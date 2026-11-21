
// "use client";

// import React, { useMemo, useState } from "react";
// import { GstRate, CreateGstRatePayload } from "../type/gst.types";
// import { updateGstRateAPI } from "../service/gst.api";

// interface GstRateEditModalProps {
//   rate: GstRate;
//   onClose: () => void;
//   onSuccess: () => Promise<void>;
// }

// /* ---------- tiny inline icons ---------- */
// const IconX = ({ className = "h-5 w-5" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );
// const IconCheck = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );
// const IconAlert = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );
// const IconSpinner = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
//     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//   </svg>
// );

// const inputBase =
//   "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

// function SectionTitle({ title, hint }: { title: string; hint?: string }) {
//   return (
//     <div className="mb-4 flex items-baseline justify-between border-b border-slate-100 pb-2">
//       <h3 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
//       {hint && <span className="text-xs text-slate-400">{hint}</span>}
//     </div>
//   );
// }

// export default function GstRateEditModal({ rate, onClose, onSuccess }: GstRateEditModalProps) {
//   const [formData, setFormData] = useState<CreateGstRatePayload>({
//     rateName: rate.rateName,
//     totalRate: Number(rate.totalRate),
//     cgstRate: Number(rate.cgstRate),
//     sgstRate: Number(rate.sgstRate),
//     igstRate: Number(rate.igstRate),
//     effectiveFrom: rate.effectiveFrom ? rate.effectiveFrom.slice(0, 10) : "",
//     effectiveTo: rate.effectiveTo ? rate.effectiveTo.slice(0, 10) : null,
//     description: rate.description || "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const cgstSgstSum = useMemo(
//     () => (Number(formData.cgstRate) || 0) + (Number(formData.sgstRate) || 0),
//     [formData.cgstRate, formData.sgstRate]
//   );
//   const cgstSgstOk = Math.abs(cgstSgstSum - Number(formData.totalRate)) < 0.001;
//   const igstOk = Math.abs(Number(formData.igstRate) - Number(formData.totalRate)) < 0.001;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       switch (name) {
//         case "rateName": return { ...prev, rateName: value };
//         case "totalRate": return { ...prev, totalRate: Number(value) };
//         case "cgstRate": return { ...prev, cgstRate: Number(value) };
//         case "sgstRate": return { ...prev, sgstRate: Number(value) };
//         case "igstRate": return { ...prev, igstRate: Number(value) };
//         case "effectiveFrom": return { ...prev, effectiveFrom: value };
//         case "effectiveTo": return { ...prev, effectiveTo: value || null };
//         case "description": return { ...prev, description: value };
//         default: return prev;
//       }
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.rateName.trim()) return setError("GST rate name is required.");
//     if (!formData.effectiveFrom || Number.isNaN(new Date(formData.effectiveFrom).getTime()))
//       return setError("Please select a valid effective date.");

//     const numericRates = [formData.totalRate, formData.cgstRate, formData.sgstRate, formData.igstRate];
//     if (numericRates.some((v) => !Number.isFinite(v) || v < 0))
//       return setError("GST rates must be valid non-negative numbers.");

//     if (formData.effectiveTo && formData.effectiveTo < formData.effectiveFrom)
//       return setError("Effective To cannot be before Effective From.");

//     try {
//       setLoading(true);
//       const payload: CreateGstRatePayload = {
//         ...formData,
//         rateName: formData.rateName.trim(),
//         effectiveTo: formData.effectiveTo || null,
//         description: formData.description?.trim() || null,
//       };
//       await updateGstRateAPI(rate.id, payload);
//       await onSuccess();
//       onClose();
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Unable to update GST rate.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6"
//       onMouseDown={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="gst-edit-title"
//         className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/5 sm:max-h-[90vh] sm:rounded-2xl"
//       >
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
//           <div>
//             <h2 id="gst-edit-title" className="text-lg font-semibold text-slate-900">
//               Edit GST Rate
//             </h2>
//             <p className="mt-0.5 text-sm text-slate-500">
//               Update the tax rate details, validity period and description.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             aria-label="Close"
//             className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
//           >
//             <IconX />
//           </button>
//         </div>

//         {/* Scrollable body */}
//         <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
//           <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

//             {/* Basic info */}
//             <section>
//               <SectionTitle title="Basic information" />
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Rate Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="rateName"
//                     value={formData.rateName}
//                     onChange={handleChange}
//                     placeholder="Example: GST 18%"
//                     className={inputBase}
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description || ""}
//                     onChange={handleChange}
//                     rows={3}
//                     maxLength={255}
//                     placeholder="Short description of when this rate applies"
//                     className={`${inputBase} resize-none`}
//                   />
//                   <p className="mt-1 text-xs text-slate-400">
//                     {(formData.description?.length || 0)}/255 characters
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* Tax rates */}
//             <section>
//               <SectionTitle title="Tax rates" hint="Values are in percent (%)" />
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Total GST <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="totalRate"
//                       value={formData.totalRate}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       className={`${inputBase} pr-9`}
//                       required
//                     />
//                     <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     CGST <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="cgstRate"
//                       value={formData.cgstRate}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       className={`${inputBase} pr-9`}
//                       required
//                     />
//                     <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">%</span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     SGST <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="sgstRate"
//                       value={formData.sgstRate}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       className={`${inputBase} pr-9`}
//                       required
//                     />
//                     <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">%</span>
//                   </div>
//                 </div>

//                 <div className="sm:col-span-2">
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     IGST <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       name="igstRate"
//                       value={formData.igstRate}
//                       onChange={handleChange}
//                       min="0"
//                       step="0.01"
//                       className={`${inputBase} pr-9`}
//                       required
//                     />
//                     <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">%</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Live hints */}
//               <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3 text-xs">
//                 <div className={`flex items-center gap-2 ${cgstSgstOk ? "text-emerald-700" : "text-amber-700"}`}>
//                   {cgstSgstOk ? <IconCheck /> : <IconAlert />}
//                   <span>
//                     CGST + SGST ({cgstSgstSum.toFixed(2)}%) {cgstSgstOk ? "matches" : "does not match"} Total GST ({Number(formData.totalRate).toFixed(2)}%).
//                   </span>
//                 </div>
//                 <div className={`flex items-center gap-2 ${igstOk ? "text-emerald-700" : "text-amber-700"}`}>
//                   {igstOk ? <IconCheck /> : <IconAlert />}
//                   <span>
//                     IGST ({Number(formData.igstRate).toFixed(2)}%) {igstOk ? "matches" : "does not match"} Total GST.
//                   </span>
//                 </div>
//               </div>
//             </section>

//             {/* Validity */}
//             <section>
//               <SectionTitle title="Validity period" />
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">
//                     Effective From <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="effectiveFrom"
//                     value={formData.effectiveFrom}
//                     onChange={handleChange}
//                     className={inputBase}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="mb-1.5 block text-sm font-medium text-slate-700">Effective To</label>
//                   <input
//                     type="date"
//                     name="effectiveTo"
//                     value={formData.effectiveTo || ""}
//                     onChange={handleChange}
//                     min={formData.effectiveFrom}
//                     className={inputBase}
//                   />
//                   <p className="mt-1 text-xs text-slate-400">Leave empty if there is no expiry.</p>
//                 </div>
//               </div>
//             </section>

//             {error && (
//               <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//                 <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
//                 <span>{error}</span>
//               </div>
//             )}
//           </div>

//           {/* Sticky footer */}
//           <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
//             >
//               {loading && <IconSpinner />}
//               {loading ? "Updating..." : "Save changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Percent, Wand2, X } from "lucide-react";
import { GstRate, CreateGstRatePayload } from "../type/gst.types";
import { updateGstRateAPI } from "../service/gst.api";

interface GstRateEditModalProps {
  rate: GstRate;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

/* Rates are kept as strings in the form so users can clear / type "0." freely */
interface FormState {
  rateName: string;
  description: string;
  totalRate: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  effectiveFrom: string;
  effectiveTo: string;
}

type RateKey = "totalRate" | "cgstRate" | "sgstRate" | "igstRate";
type Errors = Partial<Record<keyof FormState | "cgstSgst" | "igst", string>>;

const EPSILON = 0.001;
const MAX_DESCRIPTION = 255;

const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "–");
const toInput = (n: unknown) => String(Number(n ?? 0));

const inputClass = (invalid?: boolean) =>
  [
    "w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors",
    "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
    "focus:ring-2",
    invalid
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-blue-600 focus:ring-blue-600/20",
  ].join(" ");

/* ---------- small building blocks ---------- */

function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function RateInput({
  id,
  name,
  value,
  invalid,
  hasMessage,
  onChange,
  inputRef,
}: {
  id: string;
  name: RateKey;
  value: string;
  invalid?: boolean;
  hasMessage?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="number"
        inputMode="decimal"
        name={name}
        value={value}
        onChange={onChange}
        min={0}
        max={100}
        step="0.01"
        aria-invalid={invalid || undefined}
        aria-describedby={hasMessage ? `${id}-msg` : undefined}
        className={`${inputClass(invalid)} pr-9`}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
        %
      </span>
    </div>
  );
}

function CheckRow({
  ok,
  invalid,
  children,
}: {
  ok: boolean;
  invalid: boolean;
  children: React.ReactNode;
}) {
  const tone = ok ? "text-emerald-700" : invalid ? "text-red-700" : "text-amber-700";
  const Icon = ok ? CheckCircle2 : AlertCircle;
  return (
    <div className={`flex items-start gap-2 text-xs ${tone}`}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/* ---------- validation ---------- */

function validate(f: FormState): Errors {
  const e: Errors = {};

  if (!f.rateName.trim()) e.rateName = "Enter a rate name.";

  (["totalRate", "cgstRate", "sgstRate", "igstRate"] as RateKey[]).forEach((k) => {
    const n = toNum(f[k]);
    if (!Number.isFinite(n)) e[k] = "Enter a number.";
    else if (n < 0 || n > 100) e[k] = "Must be between 0 and 100.";
  });

  if (!f.effectiveFrom || Number.isNaN(new Date(f.effectiveFrom).getTime())) {
    e.effectiveFrom = "Select a valid date.";
  }
  if (f.effectiveTo && f.effectiveFrom && f.effectiveTo < f.effectiveFrom) {
    e.effectiveTo = "Must be on or after the start date.";
  }

  const total = toNum(f.totalRate);
  const cgst = toNum(f.cgstRate);
  const sgst = toNum(f.sgstRate);
  const igst = toNum(f.igstRate);
  if (![total, cgst, sgst].some(Number.isNaN) && Math.abs(cgst + sgst - total) >= EPSILON) {
    e.cgstSgst = "CGST + SGST must add up to Total GST.";
  }
  if (![total, igst].some(Number.isNaN) && Math.abs(igst - total) >= EPSILON) {
    e.igst = "IGST must be equal to Total GST.";
  }

  return e;
}

/* ---------- component ---------- */

export default function GstRateEditModal({ rate, onClose, onSuccess }: GstRateEditModalProps) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const initial = useRef<FormState>({
    rateName: rate.rateName,
    description: rate.description || "",
    totalRate: toInput(rate.totalRate),
    cgstRate: toInput(rate.cgstRate),
    sgstRate: toInput(rate.sgstRate),
    igstRate: toInput(rate.igstRate),
    effectiveFrom: rate.effectiveFrom ? rate.effectiveFrom.slice(0, 10) : "",
    effectiveTo: rate.effectiveTo ? rate.effectiveTo.slice(0, 10) : "",
  });

  const [form, setForm] = useState<FormState>(initial.current);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const errors = useMemo(() => validate(form), [form]);
  const dirty = useMemo(
    () => (Object.keys(initial.current) as (keyof FormState)[]).some((k) => form[k] !== initial.current[k]),
    [form]
  );

  const total = toNum(form.totalRate);
  const cgst = toNum(form.cgstRate);
  const sgst = toNum(form.sgstRate);
  const igst = toNum(form.igstRate);
  const cgstSgstSum = (Number.isFinite(cgst) ? cgst : 0) + (Number.isFinite(sgst) ? sgst : 0);
  const cgstSgstOk = Number.isFinite(total) && Math.abs(cgstSgstSum - total) < EPSILON;
  const igstOk = Number.isFinite(total) && Number.isFinite(igst) && Math.abs(igst - total) < EPSILON;

  const err = (k: keyof Errors) => (showErrors ? errors[k] : undefined);

  const requestClose = () => {
    if (loading) return;
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    onClose();
  };

  // Esc to close, lock page scroll, focus first field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, dirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Standard Indian split: CGST = SGST = Total / 2, IGST = Total
  const autoSplit = () => {
    if (!Number.isFinite(total) || total < 0) return;
    const half = String(+(total / 2).toFixed(3));
    setForm((prev) => ({ ...prev, cgstRate: half, sgstRate: half, igstRate: String(total) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    try {
      setLoading(true);
      const payload: CreateGstRatePayload = {
        rateName: form.rateName.trim(),
        totalRate: Number(form.totalRate),
        cgstRate: Number(form.cgstRate),
        sgstRate: Number(form.sgstRate),
        igstRate: Number(form.igstRate),
        effectiveFrom: form.effectiveFrom,
        effectiveTo: form.effectiveTo || null,
        description: form.description.trim() || null,
      };
      await updateGstRateAPI(rate.id, payload);
      await onSuccess();
      onClose();
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Unable to update GST rate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-gray-900/50 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id("title")}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[10px] border border-gray-200 bg-white sm:max-h-[90vh] sm:rounded-[10px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-700">
              <Percent className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 id={id("title")} className="truncate text-base font-semibold text-gray-900">
                Edit GST rate
              </h2>
              <p className="truncate text-sm text-gray-500">{rate.rateName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={loading}
            aria-label="Close"
            className="rounded-[10px] p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-6">
            {/* Basic info */}
            <Section title="Basic information">
              <div className="space-y-4">
                <Field id={id("rateName")} label="Rate name" required error={err("rateName")}>
                  <input
                    ref={firstFieldRef}
                    id={id("rateName")}
                    type="text"
                    name="rateName"
                    value={form.rateName}
                    onChange={handleChange}
                    placeholder="e.g. GST 18%"
                    aria-invalid={!!err("rateName") || undefined}
                    aria-describedby={err("rateName") ? `${id("rateName")}-msg` : undefined}
                    className={inputClass(!!err("rateName"))}
                  />
                </Field>

                <Field id={id("description")} label="Description">
                  <textarea
                    id={id("description")}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                    maxLength={MAX_DESCRIPTION}
                    placeholder="When does this rate apply?"
                    className={`${inputClass()} resize-none`}
                  />
                  <p className="mt-1.5 text-right text-xs text-gray-400">
                    {form.description.length}/{MAX_DESCRIPTION}
                  </p>
                </Field>
              </div>
            </Section>

            {/* Tax rates */}
            <Section title="Tax rates" hint="All values in %">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field id={id("totalRate")} label="Total GST" required error={err("totalRate")} className="sm:col-span-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <RateInput
                        id={id("totalRate")}
                        name="totalRate"
                        value={form.totalRate}
                        onChange={handleChange}
                        invalid={!!err("totalRate")}
                        hasMessage={!!err("totalRate")}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={autoSplit}
                      disabled={!Number.isFinite(total) || total < 0}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Set CGST = SGST = Total ÷ 2 and IGST = Total"
                    >
                      <Wand2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Auto-split</span>
                    </button>
                  </div>
                </Field>

                <Field id={id("cgstRate")} label="CGST" required error={err("cgstRate")}>
                  <RateInput
                    id={id("cgstRate")}
                    name="cgstRate"
                    value={form.cgstRate}
                    onChange={handleChange}
                    invalid={!!err("cgstRate") || !!err("cgstSgst")}
                    hasMessage={!!err("cgstRate")}
                  />
                </Field>

                <Field id={id("sgstRate")} label="SGST / UTGST" required error={err("sgstRate")}>
                  <RateInput
                    id={id("sgstRate")}
                    name="sgstRate"
                    value={form.sgstRate}
                    onChange={handleChange}
                    invalid={!!err("sgstRate") || !!err("cgstSgst")}
                    hasMessage={!!err("sgstRate")}
                  />
                </Field>

                <Field id={id("igstRate")} label="IGST" required error={err("igstRate")}>
                  <RateInput
                    id={id("igstRate")}
                    name="igstRate"
                    value={form.igstRate}
                    onChange={handleChange}
                    invalid={!!err("igstRate") || !!err("igst")}
                    hasMessage={!!err("igstRate")}
                  />
                </Field>
              </div>

              {/* Live consistency check */}
              <div
                className="mt-4 space-y-2 rounded-[10px] border border-gray-200 bg-gray-50 p-3"
                aria-live="polite"
              >
                <CheckRow ok={cgstSgstOk} invalid={showErrors && !!errors.cgstSgst}>
                  Intra-state: CGST + SGST = {fmt(cgstSgstSum)}%{" "}
                  {cgstSgstOk ? "(matches Total GST)" : `(should be ${fmt(total)}%)`}
                </CheckRow>
                <CheckRow ok={igstOk} invalid={showErrors && !!errors.igst}>
                  Inter-state: IGST = {fmt(igst)}% {igstOk ? "(matches Total GST)" : `(should be ${fmt(total)}%)`}
                </CheckRow>
              </div>
            </Section>

            {/* Validity */}
            <Section title="Validity period">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id={id("effectiveFrom")} label="Effective from" required error={err("effectiveFrom")}>
                  <input
                    id={id("effectiveFrom")}
                    type="date"
                    name="effectiveFrom"
                    value={form.effectiveFrom}
                    onChange={handleChange}
                    aria-invalid={!!err("effectiveFrom") || undefined}
                    aria-describedby={err("effectiveFrom") ? `${id("effectiveFrom")}-msg` : undefined}
                    className={inputClass(!!err("effectiveFrom"))}
                  />
                </Field>
                <Field
                  id={id("effectiveTo")}
                  label="Effective to"
                  error={err("effectiveTo")}
                  hint="Leave empty if it never expires."
                >
                  <input
                    id={id("effectiveTo")}
                    type="date"
                    name="effectiveTo"
                    value={form.effectiveTo}
                    onChange={handleChange}
                    min={form.effectiveFrom || undefined}
                    aria-invalid={!!err("effectiveTo") || undefined}
                    aria-describedby={`${id("effectiveTo")}-msg`}
                    className={inputClass(!!err("effectiveTo"))}
                  />
                </Field>
              </div>
            </Section>

            {apiError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
            <span className="text-xs text-gray-500">{dirty ? "Unsaved changes" : "No changes yet"}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={requestClose}
                disabled={loading}
                className="rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !dirty}
                className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}