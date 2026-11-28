// "use client";

// import React, { useEffect, useState } from "react";
// import { AlertTriangle } from "lucide-react";
// import { Modal } from "@/components/ui/modal";
// import {
//   CANCELLATION_NOTE_MAX,
//   CANCELLATION_REASONS,
//   validateCancellationInput,
// } from "@/utils/cancellationReasons";

// interface CancelOrderModalProps {
//   isOpen: boolean;
//   orderCode?: string;
//   /** Prepaid + paid: a refund will be requested */
//   willRefund?: boolean;
//   submitting?: boolean;
//   /** Error from the API, shown inside the modal */
//   serverError?: string | null;
//   onClose: () => void;
//   onConfirm: (data: { cancelReasonCode: string; cancellationNote: string }) => void;
// }

// /**
//  * Confirmation step for an admin cancellation. A reason is mandatory;
//  * "Other" also needs a written reason. The API re-validates everything.
//  */
// export default function CancelOrderModal({
//   isOpen,
//   orderCode,
//   willRefund = false,
//   submitting = false,
//   serverError = null,
//   onClose,
//   onConfirm,
// }: CancelOrderModalProps) {
//   const [reasonCode, setReasonCode] = useState<string>("");
//   const [note, setNote] = useState("");
//   const [touched, setTouched] = useState(false);

//   // Fresh form every time the modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setReasonCode("");
//       setNote("");
//       setTouched(false);
//     }
//   }, [isOpen]);

//   const error = validateCancellationInput(reasonCode, note);
//   const isOther = reasonCode === "OTHER";

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     setTouched(true);
//     if (error || submitting) return;
//     onConfirm({ cancelReasonCode: reasonCode, cancellationNote: note.trim() });
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={submitting ? () => undefined : onClose} className="max-w-lg m-4">
//       <form onSubmit={handleSubmit} className="p-6 sm:p-7" noValidate>
//         <div className="flex items-start gap-3 mb-5">
//           <span className="w-9 h-9 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
//             <AlertTriangle className="w-4 h-4" />
//           </span>
//           <div>
//             <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
//               Cancel order {orderCode ? <span className="font-mono">{orderCode}</span> : null}
//             </h3>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               Stock will be restored and the Shiprocket shipment cancelled if it hasn&apos;t been picked up.
//               {willRefund
//                 ? " A refund will be requested from Razorpay; the order is only cancelled if the refund request succeeds."
//                 : ""}
//             </p>
//           </div>
//         </div>

//         <fieldset disabled={submitting}>
//           <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
//             Cancellation reason <span className="text-red-500">*</span>
//           </legend>

//           <div className="grid gap-1.5" role="radiogroup" aria-required="true">
//             {CANCELLATION_REASONS.map((reason) => (
//               <label
//                 key={reason.code}
//                 className={`flex items-center gap-2.5 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors ${
//                   reasonCode === reason.code
//                     ? "border-red-400 bg-red-50/60 dark:bg-red-950/30 text-slate-900 dark:text-slate-100"
//                     : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="cancelReasonCode"
//                   value={reason.code}
//                   checked={reasonCode === reason.code}
//                   onChange={() => setReasonCode(reason.code)}
//                   className="accent-red-600"
//                 />
//                 {reason.label}
//               </label>
//             ))}
//           </div>

//           <label className="block mt-4">
//             <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//               {isOther ? (
//                 <>
//                   Describe the reason <span className="text-red-500">*</span>
//                 </>
//               ) : (
//                 "Additional notes (optional)"
//               )}
//             </span>
//             <textarea
//               value={note}
//               onChange={(event) => setNote(event.target.value)}
//               maxLength={CANCELLATION_NOTE_MAX}
//               rows={3}
//               required={isOther}
//               placeholder={isOther ? "Explain why this order is being cancelled" : "Internal note for the team"}
//               className="mt-1.5 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
//             />
//             <span className="mt-1 block text-right text-[11px] text-slate-400">
//               {note.length}/{CANCELLATION_NOTE_MAX} · internal, not shown to the customer
//             </span>
//           </label>
//         </fieldset>

//         {touched && error && (
//           <p role="alert" className="mt-2 text-sm text-red-600">
//             {error}
//           </p>
//         )}

//         {serverError && (
//           <p role="alert" className="mt-2 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700">
//             {serverError}
//           </p>
//         )}

//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className="px-4 py-2 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
//           >
//             Keep order
//           </button>
//           <button
//             type="submit"
//             disabled={submitting || (touched && Boolean(error))}
//             className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
//           >
//             {submitting ? "Cancelling…" : "Cancel order"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, RotateCcw, ShieldAlert, X } from "lucide-react";
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
  onConfirm: (data: {
    cancelReasonCode: string;
    cancellationNote: string;
  }) => void;
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

  // Fresh form every time the drawer opens
  useEffect(() => {
    if (isOpen) {
      setReasonCode("");
      setNote("");
      setTouched(false);
    }
  }, [isOpen]);

  // Escape key & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const error = validateCancellationInput(reasonCode, note);
  const isOther = reasonCode === "OTHER";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (error || submitting) return;
    onConfirm({
      cancelReasonCode: reasonCode,
      cancellationNote: note.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <h2
                id="cancel-order-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Cancel Order{" "}
                {orderCode ? (
                  <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    {orderCode}
                  </span>
                ) : null}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                This action is permanent once confirmed.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM + SCROLLABLE BODY */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* IMPACT NOTICE */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p>
                  Reserved inventory will be restored and the Shiprocket
                  shipment will be cancelled automatically if not yet picked up.
                </p>
              </div>

              {willRefund && (
                <div className="flex items-start gap-2.5 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2.5 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                  <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p>
                    Prepaid order: A refund will be requested from Razorpay. The
                    order is cancelled only if the refund request succeeds.
                  </p>
                </div>
              )}
            </div>

            {/* REASON SELECTION */}
            <fieldset
              disabled={submitting}
              className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <legend className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Cancellation Reason <span className="text-rose-500">*</span>
                </legend>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  Select the primary reason for cancelling this order.
                </p>

                <div
                  className="mt-3 grid gap-2"
                  role="radiogroup"
                  aria-required="true"
                >
                  {CANCELLATION_REASONS.map((reason) => {
                    const selected = reasonCode === reason.code;
                    return (
                      <label
                        key={reason.code}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs font-medium transition sm:text-sm ${
                          selected
                            ? "border-rose-400 bg-rose-50/60 text-slate-900 ring-1 ring-inset ring-rose-400/30 dark:border-rose-700 dark:bg-rose-950/30 dark:text-slate-100"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancelReasonCode"
                          value={reason.code}
                          checked={selected}
                          onChange={() => setReasonCode(reason.code)}
                          className="h-3.5 w-3.5 accent-rose-600"
                        />
                        <span>{reason.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* INTERNAL NOTE */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cancel-order-note"
                    className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    {isOther ? (
                      <>
                        Describe the Reason{" "}
                        <span className="text-rose-500">*</span>
                      </>
                    ) : (
                      "Internal Note (Optional)"
                    )}
                  </label>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {note.length}/{CANCELLATION_NOTE_MAX}
                  </span>
                </div>

                <textarea
                  id="cancel-order-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={CANCELLATION_NOTE_MAX}
                  rows={3}
                  required={isOther}
                  placeholder={
                    isOther
                      ? "Explain why this order is being cancelled..."
                      : "Internal context for support and operations team..."
                  }
                  className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                />

                <p className="mt-1 text-[11px] text-slate-400">
                  Recorded for internal audit only; not sent to the customer.
                </p>
              </div>
            </fieldset>

            {/* VALIDATION & SERVER ERRORS */}
            {touched && error && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
              >
                {error}
              </div>
            )}

            {serverError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
              >
                {serverError}
              </div>
            )}
          </div>

          {/* DRAWER FOOTER */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Keep Order
            </button>

            <button
              type="submit"
              disabled={submitting || (touched && Boolean(error))}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Cancelling…" : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}