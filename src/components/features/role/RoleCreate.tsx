// "use client";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import { createRole } from "@/services/authService";

// import { roleSchema, RoleFormValues } from "@/validations/Schema";



// export default function RoleCreate() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RoleFormValues>({
//     resolver: zodResolver(roleSchema),
//   });
//   const onSubmit = async (data: RoleFormValues) => {
//     try {
//       await dispatch(
//         createRole({
//           name: data.name,
//           description: data.description,
//           router,
//         }) as any
//       );
//     } catch {
//       toast.error("Failed to create role");
//     }
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8">
//         <h1 className="text-center font-semibold uppercase mb-6 text-lg">
//           Create Role
//         </h1>

//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
//           <div className="space-y-5">

//             {/* ROLE NAME */}
//             <div>
//               <Label>
//                 Name <span className="text-error-500">*</span>
//               </Label>
//               <Input
//                 type="text"
//                 placeholder="Enter role name"
//                 {...register("name")}
//                 className={errors.name ? "border-red-500" : ""}
//               />
//               {errors.name && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

//             {/* DESCRIPTION */}
//             <div>
//               <Label>
//                 Description <span className="text-error-500">*</span>
//               </Label>
//               <TextArea
//                 placeholder="Describe the role responsibilities"
//                 {...register("description")}
//                 className={errors.description ? "border-red-500" : ""}
//               />
//               {errors.description && (
//                 <p className="mt-1 text-xs text-red-500">
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>

//             {/* SUBMIT */}
//             <button
//               type="submit"
//               // disabled={!isValid || isSubmitting}
//               className={`
//                   w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition cursor-pointer
//                   ${
//                 // !isValid || isSubmitting
//                 // ? "bg-gray-400 cursor-not-allowed"
//                 "bg-brand-500 hover:bg-brand-600"
//                 }
//                 `}
//             >
//               {isSubmitting ? "Creating..." : "Create Role"}
//             </button>

//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { createRole } from "@/services/authService";
import { roleSchema, RoleFormValues } from "@/validations/Schema";

const ROLE_PRESETS = [
  {
    name: "CATALOG_MANAGER",
    description:
      "Manages product listings, categories, subcategories, pricing, and inventory updates.",
  },
  {
    name: "ORDER_OPERATIONS",
    description:
      "Processes incoming orders, updates fulfillment status, manages Shiprocket dispatches, and handles returns.",
  },
  {
    name: "SUPPORT_EXECUTIVE",
    description:
      "Responds to customer contact tickets, lab equipment enquiries, and GeM buyer requests.",
  },
  {
    name: "FINANCE_AUDITOR",
    description:
      "Reviews GST rate slabs, invoices, payment statuses, and refund reconciliations.",
  },
];

export default function RoleCreate() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const watchedName = watch("name") || "";
  const watchedDescription = watch("description") || "";

  const applyPreset = (preset: (typeof ROLE_PRESETS)[number]) => {
    setValue("name", preset.name, { shouldValidate: true, shouldDirty: true });
    setValue("description", preset.description, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: RoleFormValues) => {
    try {
      await dispatch(
        createRole({
          name: data.name,
          description: data.description,
          router,
        }) as any
      );
    } catch {
      toast.error("Failed to create role");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Access Control / Roles
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                Create Role
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Roles</span>
          </button>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* LEFT: ROLE FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5 lg:col-span-8"
          >
            {/* QUICK PRESETS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Common Role Templates
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Click to autofill
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {ROLE_PRESETS.map((preset) => {
                  const isSelected =
                    watchedName.trim().toUpperCase() === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs font-medium transition ${
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                          : "border-slate-200 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROLE DETAILS CARD */}
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Role Definition
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Define a clear role identifier and outline its operational
                  scope.
                </p>
              </div>

              {/* ROLE NAME */}
              <div>
                <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Role Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. CATALOG_MANAGER"
                  {...register("name")}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs outline-none transition sm:text-sm ${
                    errors.name
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 dark:border-rose-800 dark:bg-rose-950/20"
                      : "border-slate-200 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Responsibilities & Description{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <span className="text-[11px] text-slate-400 tabular-nums dark:text-slate-500">
                    {watchedDescription.length} chars
                  </span>
                </div>
                <TextArea
                  rows={4}
                  placeholder="Describe what modules and actions this role is responsible for..."
                  {...register("description")}
                  className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-xs outline-none transition sm:text-sm ${
                    errors.description
                      ? "border-rose-300 bg-rose-50/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 dark:border-rose-800 dark:bg-rose-950/20"
                      : "border-slate-200 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.description.message}</span>
                  </p>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
                >
                  {isSubmitting && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>{isSubmitting ? "Creating..." : "Create Role"}</span>
                </button>
              </div>
            </div>
          </form>

          {/* RIGHT: LIVE PREVIEW & NEXT STEP GUIDE */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="border-b border-slate-200/80 pb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
                Role Preview
              </h3>

              <div className="mt-3.5 space-y-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Badge Appearance
                  </p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-800 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                      <Shield className="h-3 w-3 text-slate-500 dark:text-brand-400" />
                      {watchedName.trim() || "NEW_ROLE"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Summary
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {watchedDescription.trim() ||
                      "Role responsibility summary will appear here as you type."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Next Step
              </p>
              <p className="mt-1">
                After creating this role, open{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Assign Privilege
                </span>{" "}
                to attach module permissions before assigning it to employees.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}