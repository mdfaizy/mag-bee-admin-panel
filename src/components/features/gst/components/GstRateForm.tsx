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
// const RATE_KEYS: RateKey[] = ["totalRate", "cgstRate", "sgstRate", "igstRate"];

// const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
// const fmt = (n: number) => (Number.isFinite(n) ? String(+n.toFixed(3)) : "–");

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
//         onWheel={(e) => e.currentTarget.blur()} // scroll se value change na ho
//         placeholder={placeholder}
//         min={0}
//         max={100}
//         step="0.001"
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

//   RATE_KEYS.forEach((k) => {
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
//   const hasTotal = Number.isFinite(total);
//   const cgstSgstSum = (Number.isFinite(cgst) ? cgst : 0) + (Number.isFinite(sgst) ? sgst : 0);
//   const cgstSgstOk = hasTotal && Math.abs(cgstSgstSum - total) < EPSILON;
//   const igstOk = hasTotal && Number.isFinite(igst) && Math.abs(igst - total) < EPSILON;

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
//     if (apiError) setApiError("");
//   };

//   // Standard Indian split: CGST = SGST = Total / 2, IGST = Total
//   const applySplit = () => {
//     if (!hasTotal || total < 0) return;
//     const half = String(+(total / 2).toFixed(3));
//     setForm((prev) => ({ ...prev, cgstRate: half, sgstRate: half, igstRate: String(total) }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (loading) return;
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
//                     disabled={!hasTotal || total < 0}
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
//                 {hasTotal
//                   ? cgstSgstOk
//                     ? "(matches Total GST)"
//                     : `(should be ${fmt(total)}%)`
//                   : "(enter Total GST to verify)"}
//               </CheckRow>
//               <CheckRow ok={igstOk} invalid={showErrors && !!errors.igst}>
//                 Inter-state: IGST = {fmt(igst)}%{" "}
//                 {hasTotal
//                   ? igstOk
//                     ? "(matches Total GST)"
//                     : `(should be ${fmt(total)}%)`
//                   : "(enter Total GST to verify)"}
//               </CheckRow>
//             </div>
//           </Section>

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
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Percent,
  Sparkles,
  Wand2,
  Receipt,
} from "lucide-react";
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

const GST_PRESETS = [
  { label: "0% (Exempt)", total: 0, name: "GST 0% (Nil Rated)" },
  { label: "5%", total: 5, name: "GST 5%" },
  { label: "12%", total: 12, name: "GST 12%" },
  { label: "18%", total: 18, name: "GST 18%" },
  { label: "28%", total: 28, name: "GST 28%" },
];

const EPSILON = 0.001;
const MAX_DESCRIPTION = 255;
const RATE_KEYS: RateKey[] = ["totalRate", "cgstRate", "sgstRate", "igstRate"];
const SAMPLE_TAXABLE = 1000;

const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fmt = (n: number) => (Number.isFinite(n) ? String(+n.toFixed(3)) : "—");
const fmtInr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const inputClass = (invalid?: boolean) =>
  [
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 outline-none transition sm:text-sm",
    "placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
    "dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-900",
    invalid
      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-800"
      : "border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:focus:border-brand-500 dark:focus:ring-brand-500/20",
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
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
        {optional && (
          <span className="ml-1 font-normal text-slate-400 dark:text-slate-500">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-msg`}
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-msg`}
          className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
        >
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
        onWheel={(e) => e.currentTarget.blur()}
        placeholder={placeholder}
        min={0}
        max={100}
        step="0.001"
        aria-invalid={invalid || undefined}
        aria-describedby={hasMessage ? `${id}-msg` : undefined}
        className={`${inputClass(invalid)} pr-9 font-medium tabular-nums`}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
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
  const tone = ok
    ? "text-emerald-700 dark:text-emerald-400"
    : invalid
      ? "text-rose-700 dark:text-rose-400"
      : "text-amber-700 dark:text-amber-400";
  const Icon = ok ? CheckCircle2 : AlertCircle;
  return (
    <div className={`flex items-start gap-2 text-xs ${tone}`}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-baseline justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
          {title}
        </h3>
        {hint && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {hint}
          </span>
        )}
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

  if (
    ![total, cgst, sgst].some(Number.isNaN) &&
    Math.abs(cgst + sgst - total) >= EPSILON
  ) {
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
    () =>
      (Object.keys(EMPTY_FORM) as (keyof FormState)[]).some(
        (k) => form[k] !== EMPTY_FORM[k]
      ),
    [form]
  );

  const total = toNum(form.totalRate);
  const cgst = toNum(form.cgstRate);
  const sgst = toNum(form.sgstRate);
  const igst = toNum(form.igstRate);
  const hasTotal = Number.isFinite(total);
  const cgstSgstSum =
    (Number.isFinite(cgst) ? cgst : 0) + (Number.isFinite(sgst) ? sgst : 0);
  const cgstSgstOk = hasTotal && Math.abs(cgstSgstSum - total) < EPSILON;
  const igstOk =
    hasTotal && Number.isFinite(igst) && Math.abs(igst - total) < EPSILON;

  const err = (k: keyof Errors) => (showErrors ? errors[k] : undefined);

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
    if (
      dirty &&
      !window.confirm("Discard this GST rate? Your input will be lost.")
    ) {
      return;
    }
    router.back();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError("");
  };

  const applySplit = () => {
    if (!hasTotal || total < 0) return;
    const half = String(+(total / 2).toFixed(3));
    setForm((prev) => ({
      ...prev,
      cgstRate: half,
      sgstRate: half,
      igstRate: String(total),
    }));
  };

  const applyPreset = (preset: (typeof GST_PRESETS)[number]) => {
    const half = String(+(preset.total / 2).toFixed(3));
    setForm((prev) => ({
      ...prev,
      rateName: prev.rateName.trim() ? prev.rateName : preset.name,
      totalRate: String(preset.total),
      cgstRate: half,
      sgstRate: half,
      igstRate: String(preset.total),
    }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setApiError("");

    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
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
      setApiError(
        error?.response?.data?.message ||
          "Unable to create GST rate. Please try again."
      );
      setLoading(false);
    }
  };

  // Sample calculation preview values
  const safeCgst = Number.isFinite(cgst) ? cgst : 0;
  const safeSgst = Number.isFinite(sgst) ? sgst : 0;
  const safeIgst = Number.isFinite(igst) ? igst : 0;
  const cgstAmt = (SAMPLE_TAXABLE * safeCgst) / 100;
  const sgstAmt = (SAMPLE_TAXABLE * safeSgst) / 100;
  const igstAmt = (SAMPLE_TAXABLE * safeIgst) / 100;

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      >
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Percent className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Taxation / GST Slabs
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                Create GST Rate
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to GST Rates</span>
          </button>
        </div>

        {/* TWO-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* LEFT: FORM INPUTS */}
          <div className="space-y-5 lg:col-span-8">
            {/* QUICK SLAB PRESETS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Quick Standard Slabs
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Click to pre-fill split
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {GST_PRESETS.map((preset) => {
                  const isSelected =
                    hasTotal && Math.abs(total - preset.total) < EPSILON;
                  return (
                    <button
                      key={preset.total}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold tabular-nums transition ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                          : "border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BASIC INFO */}
            <Section title="Basic Information">
              <div className="space-y-4">
                <Field
                  id={id("rateName")}
                  label="Rate Name"
                  required
                  error={err("rateName")}
                >
                  <input
                    id={id("rateName")}
                    type="text"
                    name="rateName"
                    value={form.rateName}
                    onChange={handleChange}
                    placeholder="e.g. GST 18%"
                    aria-invalid={!!err("rateName") || undefined}
                    aria-describedby={
                      err("rateName") ? `${id("rateName")}-msg` : undefined
                    }
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
                    placeholder="Specify HSN category or product applicability..."
                    className={`${inputClass()} resize-none`}
                  />
                  <p className="mt-1.5 text-right text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                    {form.description.length}/{MAX_DESCRIPTION}
                  </p>
                </Field>
              </div>
            </Section>

            {/* TAX RATES */}
            <Section title="Tax Breakdown" hint="All values in %">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                  id={id("totalRate")}
                  label="Total GST"
                  required
                  error={err("totalRate")}
                  className="sm:col-span-3"
                >
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
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                      title="Set CGST = SGST = Total ÷ 2 and IGST = Total"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>Auto-split</span>
                    </button>
                  </div>
                </Field>

                <Field
                  id={id("cgstRate")}
                  label="CGST (Central)"
                  required
                  error={err("cgstRate")}
                >
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

                <Field
                  id={id("sgstRate")}
                  label="SGST / UTGST (State)"
                  required
                  error={err("sgstRate")}
                >
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

                <Field
                  id={id("igstRate")}
                  label="IGST (Inter-state)"
                  required
                  error={err("igstRate")}
                >
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

              {/* LIVE CONSISTENCY CHECK */}
              <div
                className="space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60"
                aria-live="polite"
              >
                <CheckRow
                  ok={cgstSgstOk}
                  invalid={showErrors && !!errors.cgstSgst}
                >
                  Intra-state: CGST + SGST ={" "}
                  <strong className="font-semibold tabular-nums">
                    {fmt(cgstSgstSum)}%
                  </strong>{" "}
                  {hasTotal
                    ? cgstSgstOk
                      ? "(matches Total GST)"
                      : `(should be ${fmt(total)}%)`
                    : "(enter Total GST to verify)"}
                </CheckRow>
                <CheckRow ok={igstOk} invalid={showErrors && !!errors.igst}>
                  Inter-state: IGST ={" "}
                  <strong className="font-semibold tabular-nums">
                    {fmt(igst)}%
                  </strong>{" "}
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
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 sm:text-sm"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE INVOICE TAX SIMULATION CARD */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <Receipt className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Live Invoice Preview
                </h3>
              </div>

              <div className="mt-3.5 space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
                  <span className="text-slate-500 dark:text-slate-400">
                    Sample Taxable Value
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {fmtInr(SAMPLE_TAXABLE)}
                  </span>
                </div>

                {/* INTRA-STATE */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Intra-State Supply
                  </p>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>CGST ({fmt(safeCgst)}%)</span>
                    <span className="tabular-nums">{fmtInr(cgstAmt)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>SGST ({fmt(safeSgst)}%)</span>
                    <span className="tabular-nums">{fmtInr(sgstAmt)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1.5 font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                    <span>Total Invoice</span>
                    <span className="tabular-nums">
                      {fmtInr(SAMPLE_TAXABLE + cgstAmt + sgstAmt)}
                    </span>
                  </div>
                </div>

                {/* INTER-STATE */}
                <div className="space-y-1.5 border-t border-slate-200/80 pt-3 dark:border-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Inter-State Supply
                  </p>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>IGST ({fmt(safeIgst)}%)</span>
                    <span className="tabular-nums">{fmtInr(igstAmt)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1.5 font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                    <span>Total Invoice</span>
                    <span className="tabular-nums">
                      {fmtInr(SAMPLE_TAXABLE + igstAmt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT ACTIONS CARD */}
            <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? "Saving GST Rate..." : "Save GST Rate"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}