"use client";

import React from "react";
import { FaTimes, FaCheckCircle, FaUser } from "react-icons/fa";

interface Privilege {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  privileges?: Privilege[];
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone_number: string;
  is_active: boolean;
  createdAt?: string;
  role?: Role;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ViewUserModal({
  isOpen,
  onClose,
  user,
}: ViewUserModalProps) {
  if (!isOpen || !user) return null;

  const privileges = user.role?.privileges || [];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FaUser size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Employee Details
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                View employee information and permissions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
          
          {/* ================= USER INFO ================= */}
          <div className="mb-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              {/* Name */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Name
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name || "—"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Email
                </p>

                <p className="break-all text-sm font-semibold text-gray-900 dark:text-white">
                  {user.email || "—"}
                </p>
              </div>

              {/* Username */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Username
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.username || "—"}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Phone Number
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.phone_number || "—"}
                </p>
              </div>

              {/* Status */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Status
                </p>

                {user.is_active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Inactive
                  </span>
                )}
              </div>

              {/* Created At */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Created At
                </p>

                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= ROLE ================= */}
          <div className="mb-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Role Information
            </h3>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-white/[0.03]">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                {/* Role Name */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Role
                  </p>

                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {user.role?.name || "No Role"}
                  </span>
                </div>

                {/* Role ID */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Role ID
                  </p>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.role?.id ?? "—"}
                  </p>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                    Description
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {user.role?.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PRIVILEGES ================= */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Permissions
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permissions assigned to this employee's role
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {privileges.length} Permission
                {privileges.length !== 1 ? "s" : ""}
              </span>
            </div>

            {privileges.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {privileges.map((privilege) => (
                  <div
                    key={privilege.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
                  >
                    <FaCheckCircle
                      className="shrink-0 text-green-500"
                      size={15}
                    />

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {privilege.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No permissions assigned to this role.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}