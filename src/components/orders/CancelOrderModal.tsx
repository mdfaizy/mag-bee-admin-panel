"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  CANCELLATION_NOTE_MAX,
  CANCELLATION_REASONS,
  validateCancellationInput,
} from "@/utils/cancellationReasons";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderCode?: string;
  /** Prepaid + paid: a refund will be requested */
  willRefund?: boolean;
  submitting?: boolean;
  /** Error from the API, shown inside the modal */
  serverError?: string | null;
  onClose: () => void;
  onConfirm: (data: { cancelReasonCode: string; cancellationNote: string }) => void;
}

/**
 * Confirmation step for an admin cancellation. A reason is mandatory;
 * "Other" also needs a written reason. The API re-validates everything.
 */
export default function CancelOrderModal({
  isOpen,
  orderCode,
  willRefund = false,
  submitting = false,
  serverError = null,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reasonCode, setReasonCode] = useState<string>("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  // Fresh form every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setReasonCode("");
      setNote("");
      setTouched(false);
    }
  }, [isOpen]);

  const error = validateCancellationInput(reasonCode, note);
  const isOther = reasonCode === "OTHER";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (error || submitting) return;
    onConfirm({ cancelReasonCode: reasonCode, cancellationNote: note.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={submitting ? () => undefined : onClose} className="max-w-lg m-4">
      <form onSubmit={handleSubmit} className="p-6 sm:p-7" noValidate>
        <div className="flex items-start gap-3 mb-5">
          <span className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Cancel order {orderCode ? <span className="font-mono">{orderCode}</span> : null}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Stock will be restored and the Shiprocket shipment cancelled if it hasn&apos;t been picked up.
              {willRefund
                ? " A refund will be requested from Razorpay; the order is only cancelled if the refund request succeeds."
                : ""}
            </p>
          </div>
        </div>

        <fieldset disabled={submitting}>
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Cancellation reason <span className="text-red-500">*</span>
          </legend>

          <div className="grid gap-1.5" role="radiogroup" aria-required="true">
            {CANCELLATION_REASONS.map((reason) => (
              <label
                key={reason.code}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors ${
                  reasonCode === reason.code
                    ? "border-red-400 bg-red-50/60 dark:bg-red-950/30 text-slate-900 dark:text-slate-100"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  type="radio"
                  name="cancelReasonCode"
                  value={reason.code}
                  checked={reasonCode === reason.code}
                  onChange={() => setReasonCode(reason.code)}
                  className="accent-red-600"
                />
                {reason.label}
              </label>
            ))}
          </div>

          <label className="block mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isOther ? (
                <>
                  Describe the reason <span className="text-red-500">*</span>
                </>
              ) : (
                "Additional notes (optional)"
              )}
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={CANCELLATION_NOTE_MAX}
              rows={3}
              required={isOther}
              placeholder={isOther ? "Explain why this order is being cancelled" : "Internal note for the team"}
              className="mt-1.5 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
            />
            <span className="mt-1 block text-right text-[11px] text-slate-400">
              {note.length}/{CANCELLATION_NOTE_MAX} · internal, not shown to the customer
            </span>
          </label>
        </fieldset>

        {touched && error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {serverError && (
          <p role="alert" className="mt-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
          >
            Keep order
          </button>
          <button
            type="submit"
            disabled={submitting || (touched && Boolean(error))}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? "Cancelling…" : "Cancel order"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
