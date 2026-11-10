"use client";
import React from "react";
import Label from "@/components/form/Label";
import {
  MAX_POLICY_CONDITIONS_LENGTH,
  MAX_POLICY_WINDOW_DAYS,
  MIN_POLICY_WINDOW_DAYS,
  PolicyErrors,
  ReturnReplacementPolicy,
  describeOption,
} from "@/validations/returnPolicy";

const DAY_OPTIONS = Array.from(
  { length: MAX_POLICY_WINDOW_DAYS - MIN_POLICY_WINDOW_DAYS + 1 },
  (_, i) => MIN_POLICY_WINDOW_DAYS + i
);

interface Props {
  value: ReturnReplacementPolicy;
  onChange: (patch: Partial<ReturnReplacementPolicy>) => void;
  errors?: PolicyErrors;
}

const Toggle = ({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
      checked ? "bg-brand-500" : "bg-gray-300 dark:bg-white/10"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

const OptionCard = ({
  kind,
  enabled,
  days,
  error,
  onToggle,
  onDays,
}: {
  kind: "Return" | "Replacement";
  enabled: boolean;
  days: number;
  error?: string;
  onToggle: (v: boolean) => void;
  onDays: (d: number) => void;
}) => {
  const id = `policy-${kind.toLowerCase()}`;
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        enabled ? "border-brand-200 bg-brand-25 dark:border-brand-800 dark:bg-brand-500/5" : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <label htmlFor={id} className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {kind} Available
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            {enabled ? describeOption(kind, true, days) : `${kind} is not offered for this product`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${enabled ? "text-brand-600" : "text-gray-400"}`}>
            {enabled ? "ON" : "OFF"}
          </span>
          <Toggle id={id} checked={enabled} onChange={onToggle} label={`${kind} available`} />
        </div>
      </div>

      <fieldset disabled={!enabled} className={`mt-4 ${enabled ? "" : "opacity-50"}`}>
        <legend className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
          {kind} window (days after delivery)
          {!enabled && <span className="ml-1 text-gray-400">— not applicable</span>}
        </legend>
        <div className="grid grid-cols-7 gap-1.5" role="radiogroup" aria-label={`${kind} window in days`}>
          {DAY_OPTIONS.map((d) => {
            const active = enabled && Number(days) === d;
            return (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onDays(d)}
                className={`h-9 rounded-md border text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
        {enabled && error && <p className="mt-2 text-xs font-medium text-error-500">{error}</p>}
      </fieldset>
    </div>
  );
};

/**
 * Product-level Return & Replacement policy editor (controlled).
 * Return and Replacement are independent; windows are 1–7 days; nothing is ON by default.
 */
const ReturnReplacementPolicyFields: React.FC<Props> = ({ value, onChange, errors = {} }) => {
  const conditionsLength = (value.returnPolicyConditions || "").length;

  return (
    <div className="space-y-4">
      <OptionCard
        kind="Return"
        enabled={value.returnEligible}
        days={value.returnWindowDays}
        error={errors.returnWindowDays}
        onToggle={(on) => onChange({ returnEligible: on, returnWindowDays: on ? value.returnWindowDays : 0 })}
        onDays={(d) => onChange({ returnWindowDays: d })}
      />
      <OptionCard
        kind="Replacement"
        enabled={value.replacementEligible}
        days={value.replacementWindowDays}
        error={errors.replacementWindowDays}
        onToggle={(on) =>
          onChange({ replacementEligible: on, replacementWindowDays: on ? value.replacementWindowDays : 0 })
        }
        onDays={(d) => onChange({ replacementWindowDays: d })}
      />

      <div>
        <Label htmlFor="returnPolicyConditions">Policy conditions &amp; instructions</Label>
        <textarea
          id="returnPolicyConditions"
          rows={4}
          maxLength={MAX_POLICY_CONDITIONS_LENGTH}
          value={value.returnPolicyConditions}
          onChange={(e) => onChange({ returnPolicyConditions: e.target.value })}
          placeholder={"One condition per line, e.g.\nProduct must be unused and in original packaging\nRequest within the window after delivery"}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Shown to customers on the product page. One condition per line.</span>
          <span>
            {conditionsLength}/{MAX_POLICY_CONDITIONS_LENGTH}
          </span>
        </div>
        {errors.returnPolicyConditions && (
          <p className="mt-1 text-xs font-medium text-error-500">{errors.returnPolicyConditions}</p>
        )}
      </div>

      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-white/[0.03] dark:text-gray-400">
        <p className="font-semibold text-gray-700 dark:text-gray-300">Customer preview</p>
        <p className="mt-1">{describeOption("Return", value.returnEligible, Number(value.returnWindowDays))}</p>
        <p>{describeOption("Replacement", value.replacementEligible, Number(value.replacementWindowDays))}</p>
        <p className="mt-1 text-gray-500">
          Windows count from the delivery date. Maximum {MAX_POLICY_WINDOW_DAYS} days.
        </p>
      </div>
    </div>
  );
};

export default ReturnReplacementPolicyFields;
