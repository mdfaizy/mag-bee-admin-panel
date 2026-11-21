// "use client";

// import React, { useEffect, useState } from "react";
// import {
//  Table, TableHeader, TableBody, TableRow, TableCell
// } from "@/components/ui/table";
// import Pagination from "@/components/tables/Pagination";
// import { toast } from "react-toastify";
// import { FaEdit ,FaEye } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { apiConnector } from "@/services/apiConnector";
// import Link from "next/link";

// interface Privilege {
//   id: number;
//   name: string;
// }

// interface Role {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   privileges: Privilege[];
// }

// export default function RoleTable() {
//   const itemsPerPage = 5;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [tableData, setTableData] = useState<Role[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const res = await apiConnector("GET", "/roles");
//         setTableData(res.data.roles);
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//         toast.error("Failed to load roles");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, []);

//   const totalPages = Math.ceil(tableData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = tableData.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   if (loading) return <div className="p-4">Loading roles...</div>;

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] shadow-sm">
//       <div className="w-full overflow-x-auto">
//         <Table className="text-sm">
//           <TableHeader className="bg-gray-100 dark:bg-white/[0.05]">
//             <TableRow>
//               <TableCell isHeader>Name</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Privileges</TableCell>
//               <TableCell>Created</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {visibleData.map((role) => (
//               <TableRow
//                 key={role.id}
//                 className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
//               >
//                 <TableCell className="font-medium">
//                   {role.name}
//                 </TableCell>

//                 <TableCell>{role.description}</TableCell>

//                 <TableCell>
//                   <div className="flex flex-col gap-1">
//                     <span className="font-semibold">
//                       {role.privileges.length} Privileges
//                     </span>
//                     {role.privileges.length > 0 && (
//                       <div className="text-xs text-gray-500">
//                         {role.privileges
//                           .map((p) => p.name)
//                           .join(", ")}
//                       </div>
//                     )}
//                   </div>
//                 </TableCell>

//                 <TableCell>
//                   {new Date(role.createdAt).toLocaleString()}
//                 </TableCell>

//                 <TableCell className="flex gap-3">
//                   {/* <button className="text-blue-600 hover:underline">
//                     <FaEdit />
//                   </button> */}
//                   <Link
//                     href={`/created-role/edit/${role.id}`}
//                     className="text-blue-600"
//                   >
//                     <FaEdit />
//                   </Link>
//                   <Link
//                     href={`/created-role/view/${role.id}`}
//                     className="text-green-600"
//                   >
//                     <FaEye />
//                   </Link>
//                   <button className="text-red-600 hover:underline">
//                     <MdDeleteForever />
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex justify-end px-4 py-3">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           itemsPerPage={itemsPerPage}
//           totalItems={tableData.length}
//           onPageChange={(page) => setCurrentPage(page)}
//         />
//       </div>
//     </div>
//   );
// }



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
import { FaEdit, FaEye, FaSyncAlt, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  FiSearch,
  FiShield,
  FiKey,
  FiCalendar,
  FiUsers,
  FiLock,
  FiPlus,
} from "react-icons/fi";
import { apiConnector } from "@/services/apiConnector";
import Link from "next/link";

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

export default function RoleTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  /* =======================================================
     FETCH
  ======================================================= */
  const fetchRoles = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const res = await apiConnector("GET", "/roles");
      setTableData(res.data.roles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredData = useMemo(() => {
    let data = tableData.filter((role) => {
      const q = searchQuery.toLowerCase();
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

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* =======================================================
     HANDLERS
  ======================================================= */
  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSortConfig({ key: "", direction: "asc" });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <FaSort className="text-slate-400 text-[10px] opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600 text-[10px]" />
    ) : (
      <FaSortDown className="text-blue-600 text-[10px]" />
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

  /* =======================================================
     STATS
  ======================================================= */
  const totalRoles = tableData.length;
  const totalPrivileges = tableData.reduce(
    (acc, r) => acc + (r.privileges?.length || 0),
    0
  );
  const avgPrivileges = totalRoles
    ? Math.round(totalPrivileges / totalRoles)
    : 0;

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Admin
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Roles & Permissions
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Role Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalRoles} roles · {totalPrivileges} total privileges ·{" "}
              {avgPrivileges} avg per role
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRoles()}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FaSyncAlt size={11} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link href="/created-role">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                <FiPlus size={14} />
                <span>New Role</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Roles
              </span>
              <FiShield className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalRoles}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Privileges
              </span>
              <FiKey className="text-indigo-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalPrivileges}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg per Role
              </span>
              <FiLock className="text-amber-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {avgPrivileges}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- SEARCH + FILTERS -------- */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Search by role name, description or privilege..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="">Sort: Default</option>
                  <option value="name">Name</option>
                  <option value="privileges">Privilege Count</option>
                  <option value="createdAt">Created</option>
                </select>

                <select
                  className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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

                {searchQuery && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Role {getSortIcon("name")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Description
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort("privileges")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Privileges {getSortIcon("privileges")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Created {getSortIcon("createdAt")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FiShield
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchQuery
                              ? "No matching roles"
                              : "No roles yet"}
                          </div>
                          <div className="text-xs">
                            {searchQuery
                              ? "Try adjusting your search"
                              : "Create your first role to get started"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((role) => (
                      <TableRow
                        key={role.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* ID */}
                        <TableCell className="!py-3 !px-3">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            #{String(role.id).padStart(4, "0")}
                          </span>
                        </TableCell>

                        {/* ROLE NAME */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                              <FiShield size={13} />
                            </div>
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                              {role.name}
                            </span>
                          </div>
                        </TableCell>

                        {/* DESCRIPTION */}
                        <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                          {role.description ? (
                            <span
                              className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 max-w-[280px]"
                              title={role.description}
                            >
                              {role.description}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* PRIVILEGES */}
                        <TableCell className="!py-3 !px-3">
                          {role.privileges?.length > 0 ? (
                            <div className="flex flex-col gap-1.5 max-w-[320px]">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 rounded w-fit">
                                <FiKey size={9} />
                                {role.privileges.length} Privileges
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {role.privileges.slice(0, 3).map((p) => (
                                  <span
                                    key={p.id}
                                    className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
                                  >
                                    {p.name}
                                  </span>
                                ))}
                                {role.privileges.length > 3 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                                    +{role.privileges.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded">
                              No privileges
                            </span>
                          )}
                        </TableCell>

                        {/* CREATED */}
                        <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <FiCalendar
                              size={10}
                              className="text-slate-400"
                            />
                            <span className="tabular-nums">
                              {formatDate(role.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="!py-3 !px-3 text-right">
                          <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/created-role/view/${role.id}`}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="View"
                            >
                              <FaEye size={13} />
                            </Link>
                            <Link
                              href={`/created-role/edit/${role.id}`}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={13} />
                            </Link>
                            <button
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                              title="Delete"
                            >
                              <MdDeleteForever size={15} />
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

          {/* -------- PAGINATION -------- */}
          {filteredData.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredData.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {filteredData.length}
                  </span>{" "}
                  roles
                </div>
                <Pagination
                  currentPage={currentPage}
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
    </div>
  );
}