"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

import Label from "@/components/form/Label";
import Select from "../form/Select";
const MultiSelecterInput = dynamic(() => import("../form/form-elements/MultiSelecterInput"), { ssr: false });

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

export default function AssignPrivelege() {
  const [form, setForm] = useState({
    Name: "",
    roleId: "",
    privileges: [] as PrivilegeOption[],
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [privileges, setPrivileges] = useState<PrivilegeOption[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
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
      }
    }

    loadData();
  }, []);



  const handleRoleChange = (value: string) => {
    setForm((prev) => ({ ...prev, roleId: value }));
  };

  const handlePrivilegesChange = (selected: PrivilegeOption[] | null) => {
    setForm((prev) => ({ ...prev, privileges: selected || [] }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { Name,  roleId, privileges } = form;

    if (!Name ||!roleId || privileges.length === 0) {
      toast.error("Please fill all required fields including privileges.");
      return;
    }

    console.log("Submitting form:", form);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
        Assign Privillage
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Select Role <span className="text-error-500">*</span>
              </Label>
              <Select
                options={roles}
                placeholder="Select a role"
                onChange={handleRoleChange}
                defaultValue={form.roleId}
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
                className="flex  mt-8 items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
               Sumbit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
