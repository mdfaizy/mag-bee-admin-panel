/**
 * Return & Replacement policy — admin-side validation.
 * Mirrors the backend rules (Node-MageBee services/policies/productPolicy.ts);
 * the backend re-validates every save.
 */

export const MIN_POLICY_WINDOW_DAYS = 1;
export const MAX_POLICY_WINDOW_DAYS = 7;
export const MAX_POLICY_CONDITIONS_LENGTH = 2000;

export interface ReturnReplacementPolicy {
  returnEligible: boolean;
  returnWindowDays: number;
  replacementEligible: boolean;
  replacementWindowDays: number;
  returnPolicyConditions: string;
}

export type PolicyErrors = Partial<Record<keyof ReturnReplacementPolicy, string>>;

/** Safe form defaults: nothing is offered until the admin turns it on. */
export const EMPTY_POLICY: ReturnReplacementPolicy = {
  returnEligible: false,
  returnWindowDays: 0,
  replacementEligible: false,
  replacementWindowDays: 0,
  returnPolicyConditions: "",
};

const toBool = (v: unknown) => v === true || v === "true" || v === 1 || v === "1";

/** Policy as stored on a product (API response) -> form values. No invented defaults. */
export const policyFromProduct = (product: any): ReturnReplacementPolicy => {
  const returnEligible = toBool(product?.returnEligible);
  const replacementEligible = toBool(product?.replacementEligible);
  return {
    returnEligible,
    returnWindowDays: returnEligible ? Number(product?.returnWindowDays) || 0 : 0,
    replacementEligible,
    replacementWindowDays: replacementEligible ? Number(product?.replacementWindowDays) || 0 : 0,
    returnPolicyConditions: product?.returnPolicyConditions ?? "",
  };
};

const windowError = (label: string, value: unknown): string | undefined => {
  const n = Number(value);
  if (value === "" || value === null || value === undefined || !Number.isFinite(n) || n === 0) {
    return `Select a ${label.toLowerCase()} window (${MIN_POLICY_WINDOW_DAYS}–${MAX_POLICY_WINDOW_DAYS} days)`;
  }
  if (!Number.isInteger(n)) return `${label} window must be a whole number of days`;
  if (n < MIN_POLICY_WINDOW_DAYS || n > MAX_POLICY_WINDOW_DAYS) {
    return `${label} window must be between ${MIN_POLICY_WINDOW_DAYS} and ${MAX_POLICY_WINDOW_DAYS} days`;
  }
  return undefined;
};

export const validateReturnPolicy = (p: Partial<ReturnReplacementPolicy>): PolicyErrors => {
  const errors: PolicyErrors = {};
  if (p.returnEligible) {
    const e = windowError("Return", p.returnWindowDays);
    if (e) errors.returnWindowDays = e;
  }
  if (p.replacementEligible) {
    const e = windowError("Replacement", p.replacementWindowDays);
    if (e) errors.replacementWindowDays = e;
  }
  if ((p.returnPolicyConditions ?? "").trim().length > MAX_POLICY_CONDITIONS_LENGTH) {
    errors.returnPolicyConditions = `Conditions cannot exceed ${MAX_POLICY_CONDITIONS_LENGTH} characters`;
  }
  return errors;
};

/** Fields to send to the API (a disabled option's window is not applicable -> 0). */
export const policyToPayload = (p: ReturnReplacementPolicy) => ({
  returnEligible: String(p.returnEligible),
  returnWindowDays: String(p.returnEligible ? Number(p.returnWindowDays) : 0),
  replacementEligible: String(p.replacementEligible),
  replacementWindowDays: String(p.replacementEligible ? Number(p.replacementWindowDays) : 0),
  returnPolicyConditions: (p.returnPolicyConditions ?? "").trim(),
});

/** Customer-facing sentence, e.g. "7 Days Return Available". */
export const describeOption = (label: "Return" | "Replacement", eligible: boolean, days: number) =>
  eligible && days >= MIN_POLICY_WINDOW_DAYS
    ? `${days} ${days === 1 ? "Day" : "Days"} ${label} Available`
    : `${label} Not Available`;
