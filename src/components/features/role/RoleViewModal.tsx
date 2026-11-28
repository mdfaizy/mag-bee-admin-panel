"use client";

import React, { useEffect, useState } from "react";
import { X, Shield, Key, Calendar, Loader2 } from "lucide-react";
import { apiConnector } from "@/services/apiConnector";
import { toast } from "react-toastify";

interface Privilege {
  id: number;
  name: string;
}

interface RoleDetail {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  privileges: Privilege[];
}

interface Props {
  isOpen: boolean;
  roleId: number | null;
  onClose: () => void;
  onEdit?: (roleId: number) => void;
}

export default function ViewRoleModal({
  isOpen,
  roleId,
  onClose,
  onEdit,
}: Props) {
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !roleId) return;

    let active = true;
    const loadRole = async () => {
      try {
        setLoading(true);
        const res = await apiConnector("GET", `/role/${roleId}`);
        if (active) {
          setRole(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch role details:", error);
        if (active) {
          toast.error("Failed to load role details");
          onClose();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRole();
    return () => {
      active = false;
    };
  }, [isOpen, roleId, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !roleId) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-role-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="view-role-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Role Details
              </h2>
              <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                #{String(roleId).padStart(4, "0")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {loading || !role ? (
            <div className="flex h-56 flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Loader2 className="h-5 w-5 animate-spin text-slate-700 dark:text-brand-500" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Loading role details...
              </p>
            </div>
          ) : (
            <>
              {/* ROLE OVERVIEW CARD */}
              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <Shield className="h-3.5 w-3.5 text-slate-500 dark:text-brand-400" />
                    {role.name}
                  </span>

                  {role.createdAt && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Created {formatDate(role.createdAt)}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Description
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
                    {role.description || "No description provided."}
                  </p>
                </div>
              </section>

              {/* ASSIGNED PRIVILEGES CARD */}
              <section className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <Key className="h-3.5 w-3.5 text-slate-400" />
                    <span>Assigned Privileges</span>
                  </h3>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {role.privileges?.length || 0} total
                  </span>
                </div>

                {role.privileges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {role.privileges.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {p.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-slate-400 dark:text-slate-500">
                    No privileges assigned to this role yet.
                  </p>
                )}
              </section>
            </>
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          {onEdit && role && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(role.id);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Edit Privileges
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}