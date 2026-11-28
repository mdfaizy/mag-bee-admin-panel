"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaEye,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExcel,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  FiSearch,
  FiShield,
  FiKey,
  FiCalendar,
  FiLock,
  FiPlus,
  FiX,
} from "react-icons/fi";
import { apiConnector } from "@/services/apiConnector";
import Link from "next/link";
import ViewRoleModal from "./RoleViewModal";
import EditRoleModal from "./RoleEditModal";

interface Privilege {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  privileges: Privilege[];
}

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default function RoleTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "",
    direction: "asc",
  });

  // Right-side Drawer States
  const [viewRoleId, setViewRoleId] = useState<number | null>(null);
  const [editRoleId, setEditRoleId] = useState<number | null>(null);

  const fetchRoles = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const res = await apiConnector("GET", "/roles");
      setTableData(Array.isArray(res?.data?.roles) ? res.data.roles : []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoles(true);
  }, []);

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const data = tableData.filter((role) => {
      if (!q) return true;
      return (
        role.name?.toLowerCase().includes(q) ||
        role.description?.toLowerCase().includes(q) ||
        role.privileges?.some((p) => p.name.toLowerCase().includes(q))
      );
    });

    if (sortConfig.key) {
      data.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "privileges") {
          aVal = a.privileges?.length || 0;
          bVal = b.privileges?.length || 0;
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [tableData, searchQuery, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (key: string) => {
    if (!key) {
      setSortConfig({ key: "", direction: "asc" });
      return;
    }
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return (
        <FaSort className="text-[10px] text-slate-400 opacity-60 dark:text-slate-500" />
      );
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-[10px] text-slate-900 dark:text-brand-400" />
    ) : (
      <FaSortDown className="text-[10px] text-slate-900 dark:text-brand-400" />
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      toast.info("No roles available to export");
      return;
    }

    const headers = [
      "Role ID",
      "Role Name",
      "Description",
      "Privilege Count",
      "Assigned Privileges",
      "Created Date",
    ];

    const rows = filteredData.map((role) => [
      `#${String(role.id).padStart(4, "0")}`,
      role.name || "",
      role.description || "",
      role.privileges?.length || 0,
      (role.privileges || []).map((p) => p.name).join(", "),
      formatDate(role.createdAt),
    ]);

    const headerCells = headers
      .map(
        (h) =>
          `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(
            h
          )}</Data></Cell>`
      )
      .join("");

    const bodyRows = rows
      .map((row) => {
        const cells = row
          .map((val) => {
            const isNum = typeof val === "number" && Number.isFinite(val);
            const type = isNum ? "Number" : "String";
            return `<Cell><Data ss:Type="${type}">${escapeXml(
              val
            )}</Data></Cell>`;
          })
          .join("");
        return `<Row>${cells}</Row>`;
      })
      .join("");

    const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#0F172A"/>
      <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Roles">
    <Table>
      <Row>${headerCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([workbookXml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `roles-report_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredData.length} role(s) to Excel`);
  };

  const totalRoles = tableData.length;
  const totalPrivileges = tableData.reduce(
    (acc, r) => acc + (r.privileges?.length || 0),
    0
  );
  const avgPrivileges = totalRoles
    ? Math.round(totalPrivileges / totalRoles)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Access Control / Roles & Permissions
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Role Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400 sm:text-sm">
              {totalRoles} roles · {totalPrivileges} total privileges ·{" "}
              {avgPrivileges} avg per role
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchRoles(false)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <FaSyncAlt
                className={`h-3 w-3 text-slate-400 ${
                  refreshing ? "animate-spin text-brand-500" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredData.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <FaFileExcel className="h-3.5 w-3.5" />
              <span>Export Excel ({filteredData.length})</span>
            </button>

            <Link href="/created-role">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                <FiPlus className="h-4 w-4" />
                <span>New Role</span>
              </button>
            </Link>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Roles
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <FiShield className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {totalRoles}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Privileges
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-indigo-500 dark:bg-slate-800 dark:text-indigo-400">
                <FiKey className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {totalPrivileges}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Avg per Role
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-amber-500 dark:bg-slate-800 dark:text-amber-400">
                <FiLock className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {avgPrivileges}
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* SEARCH + FILTERS */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by role name, description, or privilege..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label="Sort roles"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="">Sort: Default</option>
                  <option value="name">Name</option>
                  <option value="privileges">Privilege Count</option>
                  <option value="createdAt">Created</option>
                </select>

                <select
                  aria-label="Items per page"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="50">50 / page</option>
                </select>

                {(searchQuery || sortConfig.key) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Role {getSortIcon("name")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="hidden !px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort("privileges")}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Privileges {getSortIcon("privileges")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="hidden !px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort("createdAt")}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Created {getSortIcon("createdAt")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    Array.from({ length: Math.min(itemsPerPage, 5) }).map(
                      (_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 6 }).map((__, j) => (
                            <TableCell key={j} className="!px-4 !py-3.5">
                              <div className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    )
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                          <FiShield className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchQuery ? "No matching roles" : "No roles yet"}
                          </div>
                          <div className="text-xs">
                            {searchQuery
                              ? "Try adjusting your search query"
                              : "Create your first role to get started"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((role) => (
                      <TableRow
                        key={role.id}
                        className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        {/* ID */}
                        <TableCell className="!px-4 !py-3.5">
                          <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                            #{String(role.id).padStart(4, "0")}
                          </span>
                        </TableCell>

                        {/* ROLE NAME */}
                        <TableCell className="!px-4 !py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              <FiShield className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {role.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* DESCRIPTION */}
                        <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
                          {role.description ? (
                            <span
                              className="line-clamp-1 max-w-[280px] text-xs text-slate-600 dark:text-slate-400"
                              title={role.description}
                            >
                              {role.description}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* PRIVILEGES */}
                        <TableCell className="!px-4 !py-3.5">
                          {role.privileges?.length > 0 ? (
                            <div className="flex max-w-[320px] flex-col gap-1.5">
                              <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <FiKey className="h-2.5 w-2.5 text-slate-400" />
                                {role.privileges.length} Privileges
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {role.privileges.slice(0, 3).map((p) => (
                                  <span
                                    key={p.id}
                                    className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800/90 dark:text-slate-400"
                                  >
                                    {p.name}
                                  </span>
                                ))}
                                {role.privileges.length > 3 && (
                                  <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800/90 dark:text-slate-400">
                                    +{role.privileges.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                              No privileges
                            </span>
                          )}
                        </TableCell>

                        {/* CREATED */}
                        <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 tabular-nums dark:text-slate-400">
                            <FiCalendar className="h-3 w-3 text-slate-400" />
                            <span>{formatDate(role.createdAt)}</span>
                          </div>
                        </TableCell>

                        {/* ACTIONS (OPEN RIGHT-SIDE DRAWERS) */}
                        <TableCell className="!px-4 !py-3.5 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setViewRoleId(role.id)}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                              title="View Role"
                            >
                              <FaEye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditRoleId(role.id)}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                              title="Edit Privileges"
                            >
                              <FaEdit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                              title="Delete"
                            >
                              <MdDeleteForever className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* PAGINATION */}
          {filteredData.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row">
                <div className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  Showing{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {Math.min(startIndex + itemsPerPage, filteredData.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {filteredData.length}
                  </span>{" "}
                  roles
                </div>
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredData.length}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT-SIDE VIEW & EDIT DRAWERS */}
      <ViewRoleModal
        isOpen={viewRoleId !== null}
        roleId={viewRoleId}
        onClose={() => setViewRoleId(null)}
        onEdit={(id) => setEditRoleId(id)}
      />

      <EditRoleModal
        isOpen={editRoleId !== null}
        roleId={editRoleId}
        onClose={() => setEditRoleId(null)}
        onSuccess={() => {
          setEditRoleId(null);
          fetchRoles(false);
        }}
      />
    </div>
  );
}