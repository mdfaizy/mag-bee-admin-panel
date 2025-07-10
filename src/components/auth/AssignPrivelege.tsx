"use client";
import React, { useState, useEffect, FormEvent } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

import Label from "@/components/form/Label";
import Select from "@/components/form/Select";

// Dynamically import your multiselect
const MultiSelecterInput = dynamic(
  () => import("@/components/form/form-elements/MultiSelecterInput"),
  { ssr: false }
);

// Services
import { fetchRoles } from "@/services/role";
import { fetchPrivileges } from "@/services/usePrivillage";

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

  // Form state
  const [form, setForm] = useState({
  
    roleId: "",
    privileges: [] as PrivilegeOption[],
  });

  // Load roles and privileges on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const rolesData = await fetchRoles(token);
        const privilegesData = await fetchPrivileges(token);

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

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, roleId: value }));
  };

  const handlePrivilegesChange = (selected: PrivilegeOption[] | null) => {
    setForm((prev) => ({ ...prev, privileges: selected || [] }));
  };

  // Handle submit
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const { roleId, privileges } = form;

  if ( !roleId || privileges.length === 0) {
    toast.error("Please fill all required fields including privileges.");
    return;
  }

  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(
      "http://localhost:8000/api/roles/assign-privileges",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
         
          roleId,
          privilegeIds: privileges.map((p) => Number(p.value)),
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    toast.success("Privileges assigned successfully!");
    setForm({ roleId: "", privileges: [] });
  } catch (error) {
    console.error("Error submitting:", error);
    toast.error("Failed to assign privileges.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
          Assign Privilege
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          

          <div>
            <Label>
              Select Role <span className="text-error-500">*</span>
            </Label>
            <Select
              options={roles}
              placeholder="Select a role"
              onChange={handleRoleChange}
              value={form.roleId}
            />
          </div>

          <div>
            <Label>
              Select Privileges <span className="text-error-500">*</span>
            </Label>
            <MultiSelecterInput
              options={privileges}
              value={form.privileges}
              onChange={handlePrivilegesChange}
              placeholder="Select privileges"
            />
          </div>

          <div className="mb-8 mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="flex mt-8 items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
