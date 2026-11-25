// "use client";

// import React, { useEffect, useId, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Percent, Wand2 } from "lucide-react";
// import { createGstRateAPI } from "../service/gst.api";

// /* Rates are kept as strings so users can clear / type "0." freely */
// interface FormState {
//   rateName: string;
//   description: string;
//   totalRate: string;
//   cgstRate: string;
//   sgstRate: string;
//   igstRate: string;
 
// }

// type RateKey = "totalRate" | "cgstRate" | "sgstRate" | "igstRate";
// type Errors = Partial<Record<keyof FormState | "cgstSgst" | "igst", string>>;

// const EMPTY_FORM: FormState = {
//   rateName: "",
//   description: "",
//   totalRate: "",
//   cgstRate: "",
//   sgstRate: "",
//   igstRate: "",
// };

// const EPSILON = 0.001;
// const MAX_DESCRIPTION = 255;

// const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
// const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "–");

// const inputClass = (invalid?: boolean) =>
//   [
//     "w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors",
//     "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
//     "focus:ring-2",
//     invalid
//       ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
//       : "border-gray-200 focus:border-blue-600 focus:ring-blue-600/20",
//   ].join(" ");

// /* ---------- small building blocks ---------- */

// function Field({
//   id,
//   label,
//   required,
//   optional,
//   error,
//   hint,
//   className,
//   children,
// }: {
//   id: string;
//   label: string;
//   required?: boolean;
//   optional?: boolean;
//   error?: string;
//   hint?: string;
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={className}>
//       <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
//         {label}
//         {required && <span className="ml-0.5 text-red-500">*</span>}
//         {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
//       </label>
//       {children}
//       {error ? (
//         <p id={`${id}-msg`} className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
//           <AlertCircle className="h-3.5 w-3.5 shrink-0" />
//           {error}
//         </p>
//       ) : hint ? (
//         <p id={`${id}-msg`} className="mt-1.5 text-xs text-gray-500">
//           {hint}
//         </p>
//       ) : null}
//     </div>
//   );
// }

// function RateInput({
//   id,
//   name,
//   value,
//   placeholder,
//   invalid,
//   hasMessage,
//   onChange,
// }: {
//   id: string;
//   name: RateKey;
//   value: string;
//   placeholder?: string;
//   invalid?: boolean;
//   hasMessage?: boolean;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   return (
//     <div className="relative">
//       <input
//         id={id}
//         type="number"
//         inputMode="decimal"
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         min={0}
//         max={100}
//         step="0.01"
//         aria-invalid={invalid || undefined}
//         aria-describedby={hasMessage ? `${id}-msg` : undefined}
//         className={`${inputClass(invalid)} pr-9`}
//       />
//       <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-400">
//         %
//       </span>
//     </div>
//   );
// }

// function CheckRow({
//   ok,
//   invalid,
//   children,
// }: {
//   ok: boolean;
//   invalid: boolean;
//   children: React.ReactNode;
// }) {
//   const tone = ok ? "text-emerald-700" : invalid ? "text-red-700" : "text-amber-700";
//   const Icon = ok ? CheckCircle2 : AlertCircle;
//   return (
//     <div className={`flex items-start gap-2 text-xs ${tone}`}>
//       <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
//       <span>{children}</span>
//     </div>
//   );
// }

// function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
//   return (
//     <section>
//       <div className="mb-3 flex items-baseline justify-between">
//         <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
//         {hint && <span className="text-xs text-gray-500">{hint}</span>}
//       </div>
//       {children}
//     </section>
//   );
// }

// /* ---------- validation ---------- */

// function validate(f: FormState): Errors {
//   const e: Errors = {};

//   if (!f.rateName.trim()) e.rateName = "Enter a rate name.";

//   (["totalRate", "cgstRate", "sgstRate", "igstRate"] as RateKey[]).forEach((k) => {
//     const n = toNum(f[k]);
//     if (!Number.isFinite(n)) e[k] = "Enter a number.";
//     else if (n < 0 || n > 100) e[k] = "Must be between 0 and 100.";
//   });

  

//   const total = toNum(f.totalRate);
//   const cgst = toNum(f.cgstRate);
//   const sgst = toNum(f.sgstRate);
//   const igst = toNum(f.igstRate);
//   if (![total, cgst, sgst].some(Number.isNaN) && Math.abs(cgst + sgst - total) >= EPSILON) {
//     e.cgstSgst = "CGST + SGST must add up to Total GST.";
//   }
//   if (![total, igst].some(Number.isNaN) && Math.abs(igst - total) >= EPSILON) {
//     e.igst = "IGST must be equal to Total GST.";
//   }

//   return e;
// }

// /* ---------- component ---------- */

// export default function GstRateForm() {
//   const router = useRouter();
//   const uid = useId();
//   const id = (name: string) => `${uid}-${name}`;

//   const [form, setForm] = useState<FormState>(EMPTY_FORM);
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [showErrors, setShowErrors] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);

//   const errors = useMemo(() => validate(form), [form]);
//   const dirty = useMemo(
//     () => (Object.keys(EMPTY_FORM) as (keyof FormState)[]).some((k) => form[k] !== EMPTY_FORM[k]),
//     [form]
//   );

//   const total = toNum(form.totalRate);
//   const cgst = toNum(form.cgstRate);
//   const sgst = toNum(form.sgstRate);
//   const igst = toNum(form.igstRate);
//   const cgstSgstSum = (Number.isFinite(cgst) ? cgst : 0) + (Number.isFinite(sgst) ? sgst : 0);
//   const cgstSgstOk = Number.isFinite(total) && Math.abs(cgstSgstSum - total) < EPSILON;
//   const igstOk = Number.isFinite(total) && Number.isFinite(igst) && Math.abs(igst - total) < EPSILON;

//   const err = (k: keyof Errors) => (showErrors ? errors[k] : undefined);

//   // Warn before the tab is closed / refreshed with unsaved input
//   useEffect(() => {
//     if (!dirty || loading) return;
//     const onBeforeUnload = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     window.addEventListener("beforeunload", onBeforeUnload);
//     return () => window.removeEventListener("beforeunload", onBeforeUnload);
//   }, [dirty, loading]);

//   const handleCancel = () => {
//     if (loading) return;
//     if (dirty && !window.confirm("Discard this GST rate? Your input will be lost.")) return;
//     router.back();
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // Standard Indian split: CGST = SGST = Total / 2, IGST = Total
//   const applySplit = () => {
//     if (!Number.isFinite(total) || total < 0) return;
//     const half = String(+(total / 2).toFixed(3));
//     setForm((prev) => ({ ...prev, cgstRate: half, sgstRate: half, igstRate: String(total) }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setApiError("");

//     if (Object.keys(errors).length > 0) {
//       setShowErrors(true);
//       requestAnimationFrame(() => {
//         formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       await createGstRateAPI({
//         rateName: form.rateName.trim(),
//         totalRate: Number(form.totalRate),
//         cgstRate: Number(form.cgstRate),
//         sgstRate: Number(form.sgstRate),
//         igstRate: Number(form.igstRate),
    
//         description: form.description.trim() || null,
//       });
//       router.push("/gst/rates");
//       router.refresh();
//     } catch (error: any) {
//       setApiError(error?.response?.data?.message || "Unable to create GST rate. Please try again.");
//       setLoading(false);
//     }
//     // on success we keep `loading` true so the button stays disabled during navigation
//   };

//   return (
//     <form ref={formRef} onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl">
//       <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white">
//         {/* Header */}
//         <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 sm:px-6">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-700">
//             <Percent className="h-5 w-5" />
//           </div>
//           <div className="min-w-0">
//             <h2 className="text-base font-semibold text-gray-900">Create GST rate</h2>
//             <p className="text-sm text-gray-500">Add a GST slab with its CGST / SGST and IGST split.</p>
//           </div>
//         </div>

//         <div className="space-y-8 px-5 py-6 sm:px-6">
//           {/* Basic info */}
//           <Section title="Basic information">
//             <div className="space-y-4">
//               <Field id={id("rateName")} label="Rate name" required error={err("rateName")}>
//                 <input
//                   id={id("rateName")}
//                   type="text"
//                   name="rateName"
//                   value={form.rateName}
//                   onChange={handleChange}
//                   placeholder="e.g. GST 18%"
//                   aria-invalid={!!err("rateName") || undefined}
//                   aria-describedby={err("rateName") ? `${id("rateName")}-msg` : undefined}
//                   className={inputClass(!!err("rateName"))}
//                 />
//               </Field>

//               <Field id={id("description")} label="Description" optional>
//                 <textarea
//                   id={id("description")}
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                   rows={2}
//                   maxLength={MAX_DESCRIPTION}
//                   placeholder="When does this rate apply?"
//                   className={`${inputClass()} resize-none`}
//                 />
//                 <p className="mt-1.5 text-right text-xs text-gray-400">
//                   {form.description.length}/{MAX_DESCRIPTION}
//                 </p>
//               </Field>
//             </div>
//           </Section>

//           {/* Tax rates */}
//           <Section title="Tax rates" hint="All values in %">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//               <Field id={id("totalRate")} label="Total GST" required error={err("totalRate")} className="sm:col-span-3">
//                 <div className="flex gap-2">
//                   <div className="flex-1">
//                     <RateInput
//                       id={id("totalRate")}
//                       name="totalRate"
//                       value={form.totalRate}
//                       placeholder="18"
//                       onChange={handleChange}
//                       invalid={!!err("totalRate")}
//                       hasMessage={!!err("totalRate")}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={applySplit}
//                     disabled={!Number.isFinite(total) || total < 0}
//                     className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                     title="Set CGST = SGST = Total ÷ 2 and IGST = Total"
//                   >
//                     <Wand2 className="h-4 w-4" />
//                     <span className="hidden sm:inline">Auto-split</span>
//                   </button>
//                 </div>
//                 <p className="mt-1.5 text-xs text-gray-500">
//                   Enter the total, then use Auto-split to fill CGST, SGST and IGST.
//                 </p>
//               </Field>

//               <Field id={id("cgstRate")} label="CGST" required error={err("cgstRate")}>
//                 <RateInput
//                   id={id("cgstRate")}
//                   name="cgstRate"
//                   value={form.cgstRate}
//                   placeholder="9"
//                   onChange={handleChange}
//                   invalid={!!err("cgstRate") || !!err("cgstSgst")}
//                   hasMessage={!!err("cgstRate")}
//                 />
//               </Field>

//               <Field id={id("sgstRate")} label="SGST / UTGST" required error={err("sgstRate")}>
//                 <RateInput
//                   id={id("sgstRate")}
//                   name="sgstRate"
//                   value={form.sgstRate}
//                   placeholder="9"
//                   onChange={handleChange}
//                   invalid={!!err("sgstRate") || !!err("cgstSgst")}
//                   hasMessage={!!err("sgstRate")}
//                 />
//               </Field>

//               <Field id={id("igstRate")} label="IGST" required error={err("igstRate")}>
//                 <RateInput
//                   id={id("igstRate")}
//                   name="igstRate"
//                   value={form.igstRate}
//                   placeholder="18"
//                   onChange={handleChange}
//                   invalid={!!err("igstRate") || !!err("igst")}
//                   hasMessage={!!err("igstRate")}
//                 />
//               </Field>
//             </div>

//             {/* Live consistency check */}
//             <div className="mt-4 space-y-2 rounded-[10px] border border-gray-200 bg-gray-50 p-3" aria-live="polite">
//               <CheckRow ok={cgstSgstOk} invalid={showErrors && !!errors.cgstSgst}>
//                 Intra-state: CGST + SGST = {fmt(cgstSgstSum)}%{" "}
//                 {cgstSgstOk ? "(matches Total GST)" : `(should be ${fmt(total)}%)`}
//               </CheckRow>
//               <CheckRow ok={igstOk} invalid={showErrors && !!errors.igst}>
//                 Inter-state: IGST = {fmt(igst)}% {igstOk ? "(matches Total GST)" : `(should be ${fmt(total)}%)`}
//               </CheckRow>
//             </div>
//           </Section>

//           {/* Validity */}
          

//           {apiError && (
//             <div
//               role="alert"
//               className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-700"
//             >
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <span>{apiError}</span>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
//           <button
//             type="button"
//             onClick={handleCancel}
//             disabled={loading}
//             className="inline-flex items-center gap-1.5 rounded-[10px] px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//             {loading ? "Saving..." : "Save GST rate"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }

"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Percent, Wand2 } from "lucide-react";
import { createGstRateAPI } from "../service/gst.api";

/* Rates are kept as strings so users can clear / type "0." freely */
interface FormState {
  rateName: string;
  description: string;
  totalRate: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
}

type RateKey = "totalRate" | "cgstRate" | "sgstRate" | "igstRate";
type Errors = Partial<Record<keyof FormState | "cgstSgst" | "igst", string>>;

const EMPTY_FORM: FormState = {
  rateName: "",
  description: "",
  totalRate: "",
  cgstRate: "",
  sgstRate: "",
  igstRate: "",
};

const EPSILON = 0.001;
const MAX_DESCRIPTION = 255;
const RATE_KEYS: RateKey[] = ["totalRate", "cgstRate", "sgstRate", "igstRate"];

const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fmt = (n: number) => (Number.isFinite(n) ? String(+n.toFixed(3)) : "–");

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
  optional,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
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
        {optional && <span className="ml-1 font-normal text-gray-400">(optional)</span>}
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
  placeholder,
  invalid,
  hasMessage,
  onChange,
}: {
  id: string;
  name: RateKey;
  value: string;
  placeholder?: string;
  invalid?: boolean;
  hasMessage?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode="decimal"
        name={name}
        value={value}
        onChange={onChange}
        onWheel={(e) => e.currentTarget.blur()} // scroll se value change na ho
        placeholder={placeholder}
        min={0}
        max={100}
        step="0.001"
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

  RATE_KEYS.forEach((k) => {
    const n = toNum(f[k]);
    if (!Number.isFinite(n)) e[k] = "Enter a number.";
    else if (n < 0 || n > 100) e[k] = "Must be between 0 and 100.";
  });

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

export default function GstRateForm() {
  const router = useRouter();
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = useMemo(() => validate(form), [form]);
  const dirty = useMemo(
    () => (Object.keys(EMPTY_FORM) as (keyof FormState)[]).some((k) => form[k] !== EMPTY_FORM[k]),
    [form]
  );

  const total = toNum(form.totalRate);
  const cgst = toNum(form.cgstRate);
  const sgst = toNum(form.sgstRate);
  const igst = toNum(form.igstRate);
  const hasTotal = Number.isFinite(total);
  const cgstSgstSum = (Number.isFinite(cgst) ? cgst : 0) + (Number.isFinite(sgst) ? sgst : 0);
  const cgstSgstOk = hasTotal && Math.abs(cgstSgstSum - total) < EPSILON;
  const igstOk = hasTotal && Number.isFinite(igst) && Math.abs(igst - total) < EPSILON;

  const err = (k: keyof Errors) => (showErrors ? errors[k] : undefined);

  // Warn before the tab is closed / refreshed with unsaved input
  useEffect(() => {
    if (!dirty || loading) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, loading]);

  const handleCancel = () => {
    if (loading) return;
    if (dirty && !window.confirm("Discard this GST rate? Your input will be lost.")) return;
    router.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError("");
  };

  // Standard Indian split: CGST = SGST = Total / 2, IGST = Total
  const applySplit = () => {
    if (!hasTotal || total < 0) return;
    const half = String(+(total / 2).toFixed(3));
    setForm((prev) => ({ ...prev, cgstRate: half, sgstRate: half, igstRate: String(total) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
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
      await createGstRateAPI({
        rateName: form.rateName.trim(),
        totalRate: Number(form.totalRate),
        cgstRate: Number(form.cgstRate),
        sgstRate: Number(form.sgstRate),
        igstRate: Number(form.igstRate),
        description: form.description.trim() || null,
      });
      router.push("/gst/rates");
      router.refresh();
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Unable to create GST rate. Please try again.");
      setLoading(false);
    }
    // on success we keep `loading` true so the button stays disabled during navigation
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-700">
            <Percent className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900">Create GST rate</h2>
            <p className="text-sm text-gray-500">Add a GST slab with its CGST / SGST and IGST split.</p>
          </div>
        </div>

        <div className="space-y-8 px-5 py-6 sm:px-6">
          {/* Basic info */}
          <Section title="Basic information">
            <div className="space-y-4">
              <Field id={id("rateName")} label="Rate name" required error={err("rateName")}>
                <input
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

              <Field id={id("description")} label="Description" optional>
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
                      placeholder="18"
                      onChange={handleChange}
                      invalid={!!err("totalRate")}
                      hasMessage={!!err("totalRate")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applySplit}
                    disabled={!hasTotal || total < 0}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Set CGST = SGST = Total ÷ 2 and IGST = Total"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Auto-split</span>
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Enter the total, then use Auto-split to fill CGST, SGST and IGST.
                </p>
              </Field>

              <Field id={id("cgstRate")} label="CGST" required error={err("cgstRate")}>
                <RateInput
                  id={id("cgstRate")}
                  name="cgstRate"
                  value={form.cgstRate}
                  placeholder="9"
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
                  placeholder="9"
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
                  placeholder="18"
                  onChange={handleChange}
                  invalid={!!err("igstRate") || !!err("igst")}
                  hasMessage={!!err("igstRate")}
                />
              </Field>
            </div>

            {/* Live consistency check */}
            <div className="mt-4 space-y-2 rounded-[10px] border border-gray-200 bg-gray-50 p-3" aria-live="polite">
              <CheckRow ok={cgstSgstOk} invalid={showErrors && !!errors.cgstSgst}>
                Intra-state: CGST + SGST = {fmt(cgstSgstSum)}%{" "}
                {hasTotal
                  ? cgstSgstOk
                    ? "(matches Total GST)"
                    : `(should be ${fmt(total)}%)`
                  : "(enter Total GST to verify)"}
              </CheckRow>
              <CheckRow ok={igstOk} invalid={showErrors && !!errors.igst}>
                Inter-state: IGST = {fmt(igst)}%{" "}
                {hasTotal
                  ? igstOk
                    ? "(matches Total GST)"
                    : `(should be ${fmt(total)}%)`
                  : "(enter Total GST to verify)"}
              </CheckRow>
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
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-[10px] px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save GST rate"}
          </button>
        </div>
      </div>
    </form>
  );
}