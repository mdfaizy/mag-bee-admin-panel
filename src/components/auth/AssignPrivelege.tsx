// "use client";

// import React, { useState, useEffect, FormEvent } from "react";
// import dynamic from "next/dynamic";
// import { toast } from "react-toastify";
// import {
//   FaShieldAlt,
//   FaKey,
//   FaCheckCircle,
//   FaUserShield,
//   FaInfoCircle,
// } from "react-icons/fa";

// // Components
// import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";

// // Dynamically load MultiSelect
// const MultiSelecterInput = dynamic(
//   () => import("../form/MultiSelect"),
//   { ssr: false }
// );

// // Services
// import { fetchRoles } from "@/services/role";
// import { fetchPrivileges } from "@/services/usePrivillage";
// import { apiConnector } from "@/services/apiConnector";

// // Types
// interface RoleOption {
//   value: string;
//   label: string;
// }

// interface PrivilegeOption {
//   value: string;
//   label: string;
// }

// export default function AssignPrivilege() {
//   const [roles, setRoles] = useState<RoleOption[]>([]);
//   const [privileges, setPrivileges] = useState<PrivilegeOption[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [form, setForm] = useState({
//     roleId: "",
//     privileges: [] as PrivilegeOption[],
//   });

//   // ================================
//   // Load Roles & Privileges
//   // ================================
//   useEffect(() => {
//     async function loadData() {
//       try {
//         setIsLoading(true);

//         const [rolesData, privilegesData] = await Promise.all([
//           fetchRoles(),
//           fetchPrivileges(),
//         ]);

//         setRoles(
//           rolesData.map((r) => ({
//             value: String(r.id),
//             label: r.name,
//           }))
//         );

//         setPrivileges(
//           privilegesData.map((p) => ({
//             value: String(p.id),
//             label: p.name,
//           }))
//         );
//       } catch (error) {
//         console.error("Failed to fetch roles or privileges:", error);
//         toast.error("Failed to load roles and privileges.");
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   // ================================
//   // Handlers
//   // ================================
//   const handleRoleChange = (value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       roleId: value,
//     }));
//   };

//   const handlePrivilegesChange = (
//     selected: PrivilegeOption[] | null
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       privileges: selected || [],
//     }));
//   };

//   // ================================
//   // Submit
//   // ================================
//   const handleSubmit = async (
//     e: FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     const { roleId, privileges } = form;

//     if (!roleId) {
//       toast.error("Please select a role.");
//       return;
//     }

//     if (privileges.length === 0) {
//       toast.error("Please select at least one privilege.");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const response = await apiConnector(
//         "POST",
//         "/roles/assign-privileges",
//         {
//           roleId: Number(roleId),
//           privilegeIds: privileges.map((p) => Number(p.value)),
//         }
//       );

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to assign privileges"
//         );
//       }

//       toast.success(
//         response.data.message ||
//           "Privileges assigned successfully"
//       );

//       setForm({
//         roleId: "",
//         privileges: [],
//       });
//     } catch (error) {
//       console.error("Error submitting:", error);

//       toast.error(
//         "Failed to assign privileges. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ================================
//   // Selected Role
//   // ================================
//   const selectedRole = roles.find(
//     (role) => role.value === form.roleId
//   );

//   return (
//     <div className="min-h-full w-full rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

//       {/* ========================================= */}
//       {/* HEADER */}
//       {/* ========================================= */}
//       <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
//         <div className="flex items-start gap-4">

//           {/* Icon */}
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
//             <FaUserShield size={22} />
//           </div>

//           <div>
//             <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Assign Privileges
//             </h1>

//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Assign permissions to a role and control what
//               users with that role can access.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ========================================= */}
//       {/* BODY */}
//       {/* ========================================= */}
//       <div className="px-6 py-6">

//         <form onSubmit={handleSubmit}>

//           {/* ===================================== */}
//           {/* ROLE SECTION */}
//           {/* ===================================== */}
//           <div className="mb-7">

//             <div className="mb-4 flex items-center gap-2">
//               <FaShieldAlt className="text-blue-500" />

//               <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                 Role
//               </h2>
//             </div>

//             <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

//               <Label>
//                 Select Role{" "}
//                 <span className="text-error-500">*</span>
//               </Label>

//               <div className="mt-2">
//                 <Select
//                   options={roles}
//                   placeholder="Select a role"
//                   onChange={handleRoleChange}
//                   value={form.roleId}
//                 />
//               </div>

//               {/* Role Selected */}
//               {selectedRole && (
//                 <div className="mt-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">

//                   <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
//                     <FaShieldAlt size={15} />
//                   </div>

//                   <div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Selected Role
//                     </p>

//                     <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
//                       {selectedRole.label}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ===================================== */}
//           {/* PRIVILEGE SECTION */}
//           {/* ===================================== */}
//           <div className="mb-7">

//             <div className="mb-4 flex items-center justify-between">

//               <div className="flex items-center gap-2">
//                 <FaKey className="text-blue-500" />

//                 <div>
//                   <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
//                     Permissions
//                   </h2>

//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Choose the permissions available to this role.
//                   </p>
//                 </div>
//               </div>

//               {/* Selected Count */}
//               <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                 {form.privileges.length} Selected
//               </div>
//             </div>

//             <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

//               <Label>
//                 Select Permissions{" "}
//                 <span className="text-error-500">*</span>
//               </Label>

//               <div className="mt-2">
//                 <MultiSelecterInput
//                   options={privileges}
//                   value={form.privileges}
//                   onChange={handlePrivilegesChange}
//                   placeholder="Search and select permissions..."
//                 />
//               </div>

//               {/* Selected Permissions */}
//               {form.privileges.length > 0 && (
//                 <div className="mt-5">

//                   <div className="mb-3 flex items-center gap-2">
//                     <FaCheckCircle
//                       className="text-green-500"
//                       size={14}
//                     />

//                     <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
//                       Selected Permissions
//                     </span>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {form.privileges.map((privilege) => (
//                       <span
//                         key={privilege.value}
//                         className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
//                       >
//                         <FaCheckCircle size={11} />
//                         {privilege.label}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Info */}
//               <div className="mt-5 flex gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

//                 <FaInfoCircle
//                   className="mt-0.5 shrink-0 text-gray-400"
//                   size={14}
//                 />

//                 <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
//                   Permissions assigned here will be inherited by
//                   users who have this role.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ===================================== */}
//           {/* SUMMARY */}
//           {/* ===================================== */}
//           {(selectedRole || form.privileges.length > 0) && (
//             <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

//               <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
//                 Assignment Summary
//               </h3>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                 {/* Role */}
//                 <div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Role
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                     {selectedRole?.label || "Not selected"}
//                   </p>
//                 </div>

//                 {/* Permission Count */}
//                 <div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     Permissions
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
//                     {form.privileges.length} permission
//                     {form.privileges.length !== 1
//                       ? "s"
//                       : ""}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ===================================== */}
//           {/* ACTION */}
//           {/* ===================================== */}
//           <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">

//             <button
//               type="button"
//               disabled={isLoading}
//               onClick={() =>
//                 setForm({
//                   roleId: "",
//                   privileges: [],
//                 })
//               }
//               className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
//             >
//               Reset
//             </button>

//             <button
//               type="submit"
//               disabled={
//                 isLoading ||
//                 !form.roleId ||
//                 form.privileges.length === 0
//               }
//               className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <FaShieldAlt size={14} />

//               {isLoading
//                 ? "Assigning..."
//                 : "Assign Permissions"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect, FormEvent } from "react";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import {
//   Shield,
//   Key,
//   CheckCircle2,
//   UserCheck,
//   Info,
//   ArrowLeft,
//   Loader2,
//   RotateCcw,
//   X,
// } from "lucide-react";

// import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";

// const MultiSelecterInput = dynamic(() => import("../form/MultiSelect"), {
//   ssr: false,
// });

// import { fetchRoles } from "@/services/role";
// import { fetchPrivileges } from "@/services/usePrivillage";
// import { apiConnector } from "@/services/apiConnector";

// interface RoleOption {
//   value: string;
//   label: string;
// }

// interface PrivilegeOption {
//   value: string;
//   label: string;
// }

// export default function AssignPrivilege() {
//   const router = useRouter();
//   const [roles, setRoles] = useState<RoleOption[]>([]);
//   const [privileges, setPrivileges] = useState<PrivilegeOption[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [form, setForm] = useState({
//     roleId: "",
//     privileges: [] as PrivilegeOption[],
//   });

//   // ================================
//   // Load Roles & Privileges
//   // ================================
//   useEffect(() => {
//     async function loadData() {
//       try {
//         setIsLoading(true);

//         const [rolesData, privilegesData] = await Promise.all([
//           fetchRoles(),
//           fetchPrivileges(),
//         ]);

//         setRoles(
//           rolesData.map((r) => ({
//             value: String(r.id),
//             label: r.name,
//           }))
//         );

//         setPrivileges(
//           privilegesData.map((p) => ({
//             value: String(p.id),
//             label: p.name,
//           }))
//         );
//       } catch (error) {
//         console.error("Failed to fetch roles or privileges:", error);
//         toast.error("Failed to load roles and privileges.");
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   // ================================
//   // Handlers
//   // ================================
//   const handleRoleChange = (value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       roleId: value,
//     }));
//   };

//   const handlePrivilegesChange = (selected: PrivilegeOption[] | null) => {
//     setForm((prev) => ({
//       ...prev,
//       privileges: selected || [],
//     }));
//   };

//   const handleRemovePrivilege = (value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       privileges: prev.privileges.filter((p) => p.value !== value),
//     }));
//   };

//   const handleReset = () => {
//     setForm({
//       roleId: "",
//       privileges: [],
//     });
//   };

//   // ================================
//   // Submit
//   // ================================
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const { roleId, privileges: selectedPrivileges } = form;

//     if (!roleId) {
//       toast.error("Please select a role.");
//       return;
//     }

//     if (selectedPrivileges.length === 0) {
//       toast.error("Please select at least one privilege.");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const response = await apiConnector("POST", "/roles/assign-privileges", {
//         roleId: Number(roleId),
//         privilegeIds: selectedPrivileges.map((p) => Number(p.value)),
//       });

//       if (!response.data?.success) {
//         throw new Error(
//           response.data?.message || "Failed to assign privileges"
//         );
//       }

//       toast.success(
//         response.data.message || "Privileges assigned successfully"
//       );

//       handleReset();
//     } catch (error) {
//       console.error("Error submitting:", error);
//       toast.error("Failed to assign privileges. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedRole = roles.find((role) => role.value === form.roleId);
//   const canSubmit =
//     !isLoading && Boolean(form.roleId) && form.privileges.length > 0;

//   return (
//     <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
//       <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* TOP HEADER */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
//               <UserCheck className="h-4 w-4" />
//             </div>
//             <div>
//               <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                 Access Control / Permissions
//               </p>
//               <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
//                 Assign Privileges
//               </h1>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() => router.back()}
//             disabled={isLoading}
//             className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
//           >
//             <ArrowLeft className="h-3.5 w-3.5" />
//             <span>Back</span>
//           </button>
//         </div>

//         {/* TWO-COLUMN WORKSPACE */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12"
//         >
//           {/* LEFT: CONFIGURATION CARDS */}
//           <div className="space-y-5 lg:col-span-8">
//             {/* STEP 1: TARGET ROLE */}
//             <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
//               <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
//                 <div className="flex items-center gap-2.5">
//                   <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
//                     <Shield className="h-3.5 w-3.5" />
//                   </span>
//                   <div>
//                     <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
//                       1. Target Role
//                     </h2>
//                     <p className="text-[11px] text-slate-500 dark:text-slate-400">
//                       Select the role that will receive these permissions
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 p-5">
//                 <div>
//                   <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
//                     Select Role <span className="text-rose-500">*</span>
//                   </Label>
//                   <Select
//                     options={roles}
//                     placeholder={
//                       isLoading && roles.length === 0
//                         ? "Loading roles..."
//                         : "Select a role"
//                     }
//                     onChange={handleRoleChange}
//                     value={form.roleId}
//                   />
//                 </div>

//                 {selectedRole && (
//                   <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-brand-400">
//                         <Shield className="h-4 w-4" />
//                       </div>
//                       <div>
//                         <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                           Selected Role
//                         </p>
//                         <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
//                           {selectedRole.label}
//                         </p>
//                       </div>
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30">
//                       Ready
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* STEP 2: PERMISSIONS SELECTION */}
//             <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
//               <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
//                 <div className="flex items-center gap-2.5">
//                   <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
//                     <Key className="h-3.5 w-3.5" />
//                   </span>
//                   <div>
//                     <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
//                       2. Permissions
//                     </h2>
//                     <p className="text-[11px] text-slate-500 dark:text-slate-400">
//                       Search and attach one or more privileges
//                     </p>
//                   </div>
//                 </div>

//                 <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 tabular-nums dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
//                   {form.privileges.length} / {privileges.length} selected
//                 </span>
//               </div>

//               <div className="space-y-4 p-5">
//                 <div>
//                   <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
//                     Select Permissions <span className="text-rose-500">*</span>
//                   </Label>
//                   <MultiSelecterInput
//                     options={privileges}
//                     value={form.privileges}
//                     onChange={handlePrivilegesChange}
//                     placeholder="Search and select permissions..."
//                   />
//                 </div>

//                 {/* SELECTED CHIPS */}
//                 {form.privileges.length > 0 && (
//                   <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
//                     <div className="flex items-center justify-between">
//                       <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
//                         <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
//                         <span>Selected Privileges</span>
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setForm((prev) => ({ ...prev, privileges: [] }))
//                         }
//                         className="text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
//                       >
//                         Clear all
//                       </button>
//                     </div>

//                     <div className="flex flex-wrap gap-1.5">
//                       {form.privileges.map((privilege) => (
//                         <span
//                           key={privilege.value}
//                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
//                         >
//                           <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                           <span>{privilege.label}</span>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleRemovePrivilege(privilege.value)
//                             }
//                             aria-label={`Remove ${privilege.label}`}
//                             className="ml-0.5 rounded p-0.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* AUDIT NOTICE */}
//                 <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
//                   <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
//                   <p className="leading-relaxed">
//                     Permissions assigned here take effect immediately for all
//                     employees linked to the selected role.
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* RIGHT: SUMMARY & SUBMIT SIDEBAR */}
//           <aside className="space-y-4 lg:sticky lg:top-20 lg:col-span-4">
//             <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
//               <h3 className="border-b border-slate-200/80 pb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
//                 Assignment Summary
//               </h3>

//               <div className="mt-3.5 space-y-3.5 text-xs">
//                 <div>
//                   <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                     Target Role
//                   </p>
//                   <p className="mt-1 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
//                     {selectedRole?.label || "Not selected"}
//                   </p>
//                 </div>

//                 <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
//                   <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
//                     Permissions Count
//                   </p>
//                   <p className="mt-1 text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
//                     {form.privileges.length}{" "}
//                     <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
//                       privilege{form.privileges.length !== 1 ? "s" : ""}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
//               <button
//                 type="submit"
//                 disabled={!canSubmit}
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
//               >
//                 {isLoading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Shield className="h-4 w-4" />
//                 )}
//                 <span>
//                   {isLoading ? "Assigning..." : "Assign Permissions"}
//                 </span>
//               </button>

//               <button
//                 type="button"
//                 disabled={isLoading || (!form.roleId && form.privileges.length === 0)}
//                 onClick={handleReset}
//                 className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
//               >
//                 <RotateCcw className="h-3.5 w-3.5" />
//                 <span>Reset Selection</span>
//               </button>
//             </div>
//           </aside>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Shield,
  Key,
  CheckCircle2,
  UserCheck,
  Info,
  ArrowLeft,
  Loader2,
  RotateCcw,
  X,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

import { fetchRoles } from "@/services/role";
import { fetchPrivileges } from "@/services/usePrivillage";
import { apiConnector } from "@/services/apiConnector";

interface RoleOption {
  value: string;
  label: string;
}

interface PrivilegeOption {
  value: string;
  label: string;
}

export default function AssignPrivilege() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [privileges, setPrivileges] = useState<PrivilegeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permSearch, setPermSearch] = useState("");

  const [form, setForm] = useState({
    roleId: "",
    privileges: [] as PrivilegeOption[],
  });

  // ================================
  // Load Roles & Privileges
  // ================================
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        const [rolesData, privilegesData] = await Promise.all([
          fetchRoles(),
          fetchPrivileges(),
        ]);

        setRoles(
          rolesData.map((r) => ({
            value: String(r.id),
            label: r.name,
          }))
        );

        setPrivileges(
          privilegesData.map((p) => ({
            value: String(p.id),
            label: p.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch roles or privileges:", error);
        toast.error("Failed to load roles and privileges.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ================================
  // Filtered Privileges
  // ================================
  const filteredPrivileges = useMemo(() => {
    const q = permSearch.trim().toLowerCase();
    if (!q) return privileges;
    return privileges.filter((p) => p.label.toLowerCase().includes(q));
  }, [privileges, permSearch]);

  const selectedIds = useMemo(
    () => new Set(form.privileges.map((p) => p.value)),
    [form.privileges]
  );

  const allVisibleSelected =
    filteredPrivileges.length > 0 &&
    filteredPrivileges.every((p) => selectedIds.has(p.value));

  // ================================
  // Handlers
  // ================================
  const handleRoleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      roleId: value,
    }));
  };

  const handleTogglePrivilege = (option: PrivilegeOption) => {
    setForm((prev) => {
      const exists = prev.privileges.some((p) => p.value === option.value);
      return {
        ...prev,
        privileges: exists
          ? prev.privileges.filter((p) => p.value !== option.value)
          : [...prev.privileges, option],
      };
    });
  };

  const handleToggleAllVisible = () => {
    setForm((prev) => {
      if (allVisibleSelected) {
        const visibleValues = new Set(filteredPrivileges.map((p) => p.value));
        return {
          ...prev,
          privileges: prev.privileges.filter(
            (p) => !visibleValues.has(p.value)
          ),
        };
      }

      const merged = new Map<string, PrivilegeOption>();
      prev.privileges.forEach((p) => merged.set(p.value, p));
      filteredPrivileges.forEach((p) => merged.set(p.value, p));

      return {
        ...prev,
        privileges: Array.from(merged.values()),
      };
    });
  };

  const handleRemovePrivilege = (value: string) => {
    setForm((prev) => ({
      ...prev,
      privileges: prev.privileges.filter((p) => p.value !== value),
    }));
  };

  const handleReset = () => {
    setForm({
      roleId: "",
      privileges: [],
    });
    setPermSearch("");
  };

  // ================================
  // Submit
  // ================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { roleId, privileges: selectedPrivileges } = form;

    if (!roleId) {
      toast.error("Please select a role.");
      return;
    }

    if (selectedPrivileges.length === 0) {
      toast.error("Please select at least one privilege.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiConnector("POST", "/roles/assign-privileges", {
        roleId: Number(roleId),
        privilegeIds: selectedPrivileges.map((p) => Number(p.value)),
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to assign privileges"
        );
      }

      toast.success(
        response.data.message || "Privileges assigned successfully"
      );

      handleReset();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to assign privileges. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = roles.find((role) => role.value === form.roleId);
  const canSubmit =
    !isLoading && Boolean(form.roleId) && form.privileges.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Access Control / Permissions
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                Assign Privileges
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* TWO-COLUMN WORKSPACE */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12"
        >
          {/* LEFT: CONFIGURATION CARDS */}
          <div className="space-y-5 lg:col-span-8">
            {/* STEP 1: TARGET ROLE */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <Shield className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                      1. Target Role
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Select the role that will receive these permissions
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Select Role <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    options={roles}
                    placeholder={
                      isLoading && roles.length === 0
                        ? "Loading roles..."
                        : "Select a role"
                    }
                    onChange={handleRoleChange}
                    value={form.roleId}
                  />
                </div>

                {selectedRole && (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-brand-400">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Selected Role
                        </p>
                        <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                          {selectedRole.label}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30">
                      Ready
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* STEP 2: PERMISSIONS CHECKLIST MATRIX */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                    <Key className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                      2. Permissions
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Search and check all permissions to attach
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 tabular-nums dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {form.privileges.length} / {privileges.length} selected
                </span>
              </div>

              <div className="space-y-4 p-5">
                {/* SEARCH + SELECT ALL BAR */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={permSearch}
                      onChange={(e) => setPermSearch(e.target.value)}
                      placeholder="Search permissions by name (e.g. ROLE, PRODUCT, ORDER)..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                    />
                    {permSearch && (
                      <button
                        type="button"
                        onClick={() => setPermSearch("")}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {filteredPrivileges.length > 0 && (
                    <button
                      type="button"
                      onClick={handleToggleAllVisible}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {allVisibleSelected ? (
                        <CheckSquare className="h-3.5 w-3.5 text-slate-900 dark:text-brand-400" />
                      ) : (
                        <Square className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      <span>
                        {allVisibleSelected ? "Unselect All" : "Select All"}
                      </span>
                    </button>
                  )}
                </div>

                {/* PERMISSIONS CHECKBOX GRID */}
                {isLoading && privileges.length === 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 animate-pulse rounded-lg border border-slate-100 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/60"
                      />
                    ))}
                  </div>
                ) : filteredPrivileges.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      No permissions found
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      {permSearch
                        ? `No permission matched "${permSearch}".`
                        : "No privileges available in the system."}
                    </p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {filteredPrivileges.map((privilege) => {
                        const checked = selectedIds.has(privilege.value);
                        return (
                          <label
                            key={privilege.value}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition select-none ${
                              checked
                                ? "border-slate-900 bg-slate-900/5 text-slate-900 dark:border-brand-500 dark:bg-brand-500/15 dark:text-slate-100"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isLoading}
                              onChange={() => handleTogglePrivilege(privilege)}
                              className="h-3.5 w-3.5 shrink-0 rounded border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-brand-500"
                            />
                            <span className="truncate font-mono">
                              {privilege.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SELECTED CHIPS */}
                {form.privileges.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Selected Privileges ({form.privileges.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, privileges: [] }))
                        }
                        className="text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {form.privileges.map((privilege) => (
                        <span
                          key={privilege.value}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{privilege.label}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePrivilege(privilege.value)
                            }
                            aria-label={`Remove ${privilege.label}`}
                            className="ml-0.5 rounded p-0.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AUDIT NOTICE */}
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <p className="leading-relaxed">
                    Permissions assigned here take effect immediately for all
                    employees linked to the selected role.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: SUMMARY & SUBMIT SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="border-b border-slate-200/80 pb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
                Assignment Summary
              </h3>

              <div className="mt-3.5 space-y-3.5 text-xs">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Target Role
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                    {selectedRole?.label || "Not selected"}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Permissions Count
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                    {form.privileges.length}{" "}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      privilege{form.privileges.length !== 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                <span>
                  {isLoading ? "Assigning..." : "Assign Permissions"}
                </span>
              </button>

              <button
                type="button"
                disabled={
                  isLoading || (!form.roleId && form.privileges.length === 0)
                }
                onClick={handleReset}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Selection</span>
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}