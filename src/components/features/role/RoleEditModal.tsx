"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Shield,
  Key,
  Save,
  Loader2,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
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
  privileges: Privilege[];
}

interface Props {
  isOpen: boolean;
  roleId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoleModal({
  isOpen,
  roleId,
  onClose,
  onSuccess,
}: Props) {
  const [role, setRole] = useState<RoleDetail | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [privSearch, setPrivSearch] = useState("");

  useEffect(() => {
    if (!isOpen || !roleId) return;

    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setPrivSearch("");
        const [roleRes, privilegeRes] = await Promise.all([
          apiConnector("GET", `/role/${roleId}`),
          apiConnector("GET", `/privileges`),
        ]);

        if (active) {
          setRole({
            ...roleRes.data,
            privileges: Array.isArray(roleRes.data?.privileges)
              ? roleRes.data.privileges
              : [],
          });
          setAllPrivileges(
            Array.isArray(privilegeRes.data?.data) ? privilegeRes.data.data : []
          );
        }
      } catch (error) {
        console.error("Failed to load role/privileges:", error);
        if (active) {
          toast.error("Failed to load role privileges");
          onClose();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [isOpen, roleId, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, saving, onClose]);

  const filteredPrivileges = useMemo(() => {
    const q = privSearch.trim().toLowerCase();
    if (!q) return allPrivileges;
    return allPrivileges.filter((p) => p.name.toLowerCase().includes(q));
  }, [allPrivileges, privSearch]);

  if (!isOpen || !roleId) return null;

  const selectedIds = new Set((role?.privileges || []).map((p) => p.id));

  const togglePrivilege = (privilegeId: number) => {
    if (!role) return;
    const exists = selectedIds.has(privilegeId);

    if (exists) {
      setRole({
        ...role,
        privileges: role.privileges.filter((p) => p.id !== privilegeId),
      });
    } else {
      const privilege = allPrivileges.find((p) => p.id === privilegeId);
      if (!privilege) return;
      setRole({
        ...role,
        privileges: [...role.privileges, privilege],
      });
    }
  };

  const handleSelectAllVisible = () => {
    if (!role) return;
    const allVisibleChecked =
      filteredPrivileges.length > 0 &&
      filteredPrivileges.every((p) => selectedIds.has(p.id));

    if (allVisibleChecked) {
      const visibleSet = new Set(filteredPrivileges.map((p) => p.id));
      setRole({
        ...role,
        privileges: role.privileges.filter((p) => !visibleSet.has(p.id)),
      });
    } else {
      const merged = new Map<number, Privilege>();
      role.privileges.forEach((p) => merged.set(p.id, p));
      filteredPrivileges.forEach((p) => merged.set(p.id, p));
      setRole({
        ...role,
        privileges: Array.from(merged.values()),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || saving) return;

    try {
      setSaving(true);
      const privilegeIds = role.privileges.map((p) => p.id);

      await apiConnector("POST", "/roles/assign-privileges", {
        roleId: role.id,
        privilegeIds,
      });

      toast.success("Privileges updated successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Update privileges error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update privileges"
      );
    } finally {
      setSaving(false);
    }
  };

  const allVisibleSelected =
    filteredPrivileges.length > 0 &&
    filteredPrivileges.every((p) => selectedIds.has(p.id));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!saving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-role-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="edit-role-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Edit Role Privileges
              </h2>
              <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                #{String(roleId).padStart(4, "0")}
                {role?.name ? ` · ${role.name}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM + SCROLLABLE BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {loading || !role ? (
              <div className="flex h-56 flex-col items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <Loader2 className="h-5 w-5 animate-spin text-slate-700 dark:text-brand-500" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Loading role permissions...
                </p>
              </div>
            ) : (
              <>
                {/* ROLE NAME CARD */}
                <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Role Name
                  </label>
                  <input
                    value={role.name}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 sm:text-sm"
                  />
                </section>

                {/* PRIVILEGES CHECKLIST CARD */}
                <section className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-slate-400" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Privileges
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 tabular-nums dark:bg-slate-800 dark:text-slate-300">
                        {selectedIds.size} / {allPrivileges.length} selected
                      </span>
                    </div>

                    {filteredPrivileges.length > 0 && (
                      <button
                        type="button"
                        onClick={handleSelectAllVisible}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        {allVisibleSelected ? (
                          <CheckSquare className="h-3.5 w-3.5" />
                        ) : (
                          <Square className="h-3.5 w-3.5" />
                        )}
                        <span>
                          {allVisibleSelected
                            ? "Unselect visible"
                            : "Select all visible"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* PRIVILEGE SEARCH */}
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={privSearch}
                      onChange={(e) => setPrivSearch(e.target.value)}
                      placeholder="Filter privileges by name..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500"
                    />
                  </div>

                  {/* GRID OF PRIVILEGE CHECKBOX CARDS */}
                  {filteredPrivileges.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                      No privileges matched "{privSearch}".
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {filteredPrivileges.map((p) => {
                        const checked = selectedIds.has(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                              checked
                                ? "border-slate-900 bg-slate-900/5 text-slate-900 dark:border-brand-500 dark:bg-brand-500/15 dark:text-slate-100"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={saving}
                              onChange={() => togglePrivilege(p.id)}
                              className="h-3.5 w-3.5 rounded border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-brand-500"
                            />
                            <span className="truncate font-mono">{p.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          {/* DRAWER FOOTER */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loading || !role}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{saving ? "Updating..." : "Update Privileges"}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}