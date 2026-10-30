// "use client";
// import React, { useState, useEffect, FormEvent } from "react";
// import dynamic from "next/dynamic";
// import { toast } from "react-toastify";

// // Components
// import Label from "@/components/form/Label";
// import Select from "@/components/form/Select";

// // Dynamically load MultiSelecterInput
// const MultiSelecterInput = dynamic(
//   () => import("../form/MultiSelect"),
//   { ssr: false }
// );
// // Services
// import { fetchRoles } from "@/services/role";
// import { fetchPrivileges } from "@/services/usePrivillage";
// // import { BASE_URL } from "@/services/apis";
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

//   // Form state
//   const [form, setForm] = useState({
//     roleId: "",
//     privileges: [] as PrivilegeOption[],
//   });

//   // Load roles and privileges on component mount
//   useEffect(() => {
//     async function loadData() {
//       try {
//         setIsLoading(true);
//         const rolesData = await fetchRoles();
//         const privilegesData = await fetchPrivileges();
//         // const [rolesData, privilegesData] = await Promise.all([
//         //   fetchRoles(),
//         //   fetchPrivileges(),
//         // ]);
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

//   const handleRoleChange = (value: string) => {
//     setForm((prev) => ({ ...prev, roleId: value }));
//   };

//   const handlePrivilegesChange = (selected: PrivilegeOption[] | null) => {
//     setForm((prev) => ({ ...prev, privileges: selected || [] }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const { roleId, privileges } = form;
//     if (!roleId || privileges.length === 0) {
//       toast.error("Please fill all required fields including privileges.");
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const response = await apiConnector("POST", `/roles/assign-privileges`,
//         {
//           roleId: Number(roleId),
//           privilegeIds: privileges.map(p => Number(p.value)),
//         });
//       // toast.success("Privileges assigned successfully!");
//       if (!response.data?.success) {
//         throw new Error(response.data?.message);
//       }
//       toast.success(response.data.message || "Privileges assigned successfully");
//       setForm({ roleId: "", privileges: [] });
//     } catch (error) {
//       console.error("Error submitting:", error);
//       toast.error("Failed to assign privileges.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border h-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] ">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 z-999">
//         <h1 className="text-center font-semibold uppercase mb-6 text-lg">
//           Assign Privilege
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Role Select */}
//           <div>
//             <Label>
//               Select Role <span className="text-error-500">*</span>
//             </Label>
//             <Select
//               options={roles}
//               placeholder="Select a role"
//               onChange={handleRoleChange}
//               value={form.roleId}
//             />
//           </div>

//           {/* Privilege MultiSelect */}
//           <div className="z-100">
//             <Label>
//               Select Privileges <span className="text-error-500">*</span>
//             </Label>
//             <MultiSelecterInput
//               options={privileges}
//               value={form.privileges}
//               onChange={handlePrivilegesChange}
//               placeholder="Select privileges"
//             />
//           </div>
//           {/* Submit Button */}
//           <div className="mb-8 mt-8">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="flex mt-8 items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
//             >
//               {isLoading ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import {
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaUserShield,
  FaInfoCircle,
} from "react-icons/fa";

// Components
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

// Dynamically load MultiSelect
const MultiSelecterInput = dynamic(
  () => import("../form/MultiSelect"),
  { ssr: false }
);

// Services
import { fetchRoles } from "@/services/role";
import { fetchPrivileges } from "@/services/usePrivillage";
import { apiConnector } from "@/services/apiConnector";

// Types
interface RoleOption {
  value: string;
  label: string;
}

interface PrivilegeOption {
  value: string;
  label: string;
}

export default function AssignPrivilege() {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [privileges, setPrivileges] = useState<PrivilegeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  // Handlers
  // ================================
  const handleRoleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      roleId: value,
    }));
  };

  const handlePrivilegesChange = (
    selected: PrivilegeOption[] | null
  ) => {
    setForm((prev) => ({
      ...prev,
      privileges: selected || [],
    }));
  };

  // ================================
  // Submit
  // ================================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const { roleId, privileges } = form;

    if (!roleId) {
      toast.error("Please select a role.");
      return;
    }

    if (privileges.length === 0) {
      toast.error("Please select at least one privilege.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiConnector(
        "POST",
        "/roles/assign-privileges",
        {
          roleId: Number(roleId),
          privilegeIds: privileges.map((p) => Number(p.value)),
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to assign privileges"
        );
      }

      toast.success(
        response.data.message ||
          "Privileges assigned successfully"
      );

      setForm({
        roleId: "",
        privileges: [],
      });
    } catch (error) {
      console.error("Error submitting:", error);

      toast.error(
        "Failed to assign privileges. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ================================
  // Selected Role
  // ================================
  const selectedRole = roles.find(
    (role) => role.value === form.roleId
  );

  return (
    <div className="min-h-full w-full rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FaUserShield size={22} />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assign Privileges
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Assign permissions to a role and control what
              users with that role can access.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* BODY */}
      {/* ========================================= */}
      <div className="px-6 py-6">

        <form onSubmit={handleSubmit}>

          {/* ===================================== */}
          {/* ROLE SECTION */}
          {/* ===================================== */}
          <div className="mb-7">

            <div className="mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-blue-500" />

              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Role
              </h2>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

              <Label>
                Select Role{" "}
                <span className="text-error-500">*</span>
              </Label>

              <div className="mt-2">
                <Select
                  options={roles}
                  placeholder="Select a role"
                  onChange={handleRoleChange}
                  value={form.roleId}
                />
              </div>

              {/* Role Selected */}
              {selectedRole && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <FaShieldAlt size={15} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Selected Role
                    </p>

                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      {selectedRole.label}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===================================== */}
          {/* PRIVILEGE SECTION */}
          {/* ===================================== */}
          <div className="mb-7">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">
                <FaKey className="text-blue-500" />

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Permissions
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Choose the permissions available to this role.
                  </p>
                </div>
              </div>

              {/* Selected Count */}
              <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {form.privileges.length} Selected
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

              <Label>
                Select Permissions{" "}
                <span className="text-error-500">*</span>
              </Label>

              <div className="mt-2">
                <MultiSelecterInput
                  options={privileges}
                  value={form.privileges}
                  onChange={handlePrivilegesChange}
                  placeholder="Search and select permissions..."
                />
              </div>

              {/* Selected Permissions */}
              {form.privileges.length > 0 && (
                <div className="mt-5">

                  <div className="mb-3 flex items-center gap-2">
                    <FaCheckCircle
                      className="text-green-500"
                      size={14}
                    />

                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      Selected Permissions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {form.privileges.map((privilege) => (
                      <span
                        key={privilege.value}
                        className="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                      >
                        <FaCheckCircle size={11} />
                        {privilege.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="mt-5 flex gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">

                <FaInfoCircle
                  className="mt-0.5 shrink-0 text-gray-400"
                  size={14}
                />

                <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Permissions assigned here will be inherited by
                  users who have this role.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================== */}
          {/* SUMMARY */}
          {/* ===================================== */}
          {(selectedRole || form.privileges.length > 0) && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.02]">

              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Assignment Summary
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Role */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedRole?.label || "Not selected"}
                  </p>
                </div>

                {/* Permission Count */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Permissions
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {form.privileges.length} permission
                    {form.privileges.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===================================== */}
          {/* ACTION */}
          {/* ===================================== */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                setForm({
                  roleId: "",
                  privileges: [],
                })
              }
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                !form.roleId ||
                form.privileges.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaShieldAlt size={14} />

              {isLoading
                ? "Assigning..."
                : "Assign Permissions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}