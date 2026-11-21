/**
 * Order cancellation reasons.
 * Mirrors the backend (magbee-admin src/services/policies/cancellationPolicy.ts),
 * which re-validates every request — keep codes and limits identical.
 */

export const CANCELLATION_REASONS = [
  { code: "CUSTOMER_REQUESTED", label: "Customer requested cancellation" },
  { code: "PAYMENT_ISSUE", label: "Payment issue" },
  { code: "OUT_OF_STOCK", label: "Product out of stock" },
  { code: "DUPLICATE_ORDER", label: "Duplicate order" },
  { code: "INCORRECT_PRODUCT_OR_PRICE", label: "Incorrect product or price" },
  { code: "SHIPPING_ISSUE", label: "Shipping or delivery issue" },
  { code: "FRAUD_SUSPECTED", label: "Fraudulent or suspicious order" },
  { code: "OTHER", label: "Other" },
] as const;

export type CancellationReasonCode = (typeof CANCELLATION_REASONS)[number]["code"];

export const CANCELLATION_NOTE_MAX = 500;
export const CANCELLATION_OTHER_MIN = 5;

export const getCancellationReasonLabel = (code?: string | null) =>
  CANCELLATION_REASONS.find((reason) => reason.code === code)?.label ?? null;

/** Same rules as the API; returns an error message or null */
export const validateCancellationInput = (
  code: string | null | undefined,
  note: string
): string | null => {
  if (!code) return "Please select a cancellation reason.";

  if (!CANCELLATION_REASONS.some((reason) => reason.code === code)) {
    return "Please select a valid cancellation reason.";
  }

  const trimmed = note.replace(/\s+/g, " ").trim();

  if (trimmed.length > CANCELLATION_NOTE_MAX) {
    return `Notes must be at most ${CANCELLATION_NOTE_MAX} characters.`;
  }

  if (code === "OTHER" && trimmed.length < CANCELLATION_OTHER_MIN) {
    return `Please describe the reason (at least ${CANCELLATION_OTHER_MIN} characters).`;
  }

  return null;
};
