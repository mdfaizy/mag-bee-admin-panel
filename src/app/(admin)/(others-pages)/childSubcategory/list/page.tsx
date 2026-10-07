// // "use client";

// // import React from "react";



// "use client";

// import React, {
//   useEffect,
//   useState,
// } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";



// import { getAllSubCategories } from "@/services/subCategoryService/subCategoryService";

// const ChildSubCategoryTable = () => {
//   const [subCategories, setSubCategories] =
//     useState<any[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res =
//           await getAllSubCategories();

//         setSubCategories(
//           res.subCategories || []
//         );
//       } catch (error) {
//         console.error(
//           "Failed to fetch child subcategories",
//           error
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const childSubCategories =
//     subCategories.filter(
//       (item) => item.parentId
//     );

//   const getParentName = (
//     parentId: number
//   ) => {
//     return (
//       subCategories.find(
//         (sub) => sub.id === parentId
//       )?.name || "—"
//     );
//   };

//   const formatDate = (
//     dateString: string
//   ) => {
//     return new Date(
//       dateString
//     ).toLocaleDateString();
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         Loading Child SubCategories...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 mt-8 border">
//       <h2 className="text-xl font-bold mb-4">
//         Child SubCategories
//       </h2>

//       <div className="overflow-x-auto rounded-lg border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableCell isHeader>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Slug</TableCell>
//               <TableCell>Parent</TableCell>
//               <TableCell>Created</TableCell>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {childSubCategories.length ===
//             0 ? (
//               <TableRow>
//                 <TableCell className="text-center py-6">
//                   No Child SubCategories
//                 </TableCell>
//               </TableRow>
//             ) : (
//               childSubCategories.map(
//                 (item) => (
//                   <TableRow
//                     key={item.id}
//                   >
//                     <TableCell>
//                       {item.id}
//                     </TableCell>
//                     <TableCell>
//                       {item.name}
//                     </TableCell>
//                     <TableCell>
//                       {item.slug}
//                     </TableCell>
//                     <TableCell>
//                       {getParentName(
//                         item.parentId
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {formatDate(
//                         item.createdAt
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 )
//               )
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default ChildSubCategoryTable;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { getAllSubCategories } from "@/services/subCategoryService/subCategoryService";
import {
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaSitemap,
  FaFolderOpen,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaLayerGroup,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";

const ChildSubCategoryTable = () => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [parentFilter, setParentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  /* =======================================================
     FETCH
  ======================================================= */
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllSubCategories();
      setSubCategories(res.subCategories || []);
    } catch (error) {
      console.error("Failed to fetch child subcategories", error);
      toast.error("Failed to load child subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     DERIVED DATA
  ======================================================= */
  const childSubCategories = useMemo(
    () => subCategories.filter((item) => item.parentId),
    [subCategories]
  );

  const getParentName = (parentId: number) =>
    subCategories.find((sub) => sub.id === parentId)?.name || "—";

  // Unique parents for filter dropdown
  const parents = useMemo(() => {
    return Array.from(
      new Map(
        childSubCategories
          .map((c) => {
            const p = subCategories.find((s) => s.id === c.parentId);
            return p ? [p.id, p] : null;
          })
          .filter(Boolean) as [number, any][]
      ).values()
    );
  }, [childSubCategories, subCategories]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = useMemo(() => {
    let filtered = childSubCategories.filter((item) => {
      const parentName = getParentName(item.parentId);
      return (
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (parentFilter !== "all") {
      filtered = filtered.filter(
        (item) => getParentName(item.parentId) === parentFilter
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Special case for parent sorting
        if (sortConfig.key === "parent") {
          aVal = getParentName(a.parentId);
          bVal = getParentName(b.parentId);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [childSubCategories, searchTerm, parentFilter, sortConfig, subCategories]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

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
    setSearchTerm("");
    setParentFilter("all");
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

  const formatDate = (dateString: string) => {
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
  const totalChildren = childSubCategories.length;
  const uniqueParents = parents.length;
  const withSlug = childSubCategories.filter((c) => c.slug).length;

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mt-6">
      {/* ============ SECTION HEADER ============ */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Catalog
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Child Items
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <FaSitemap
                className="text-slate-400 dark:text-slate-500"
                size={14}
              />
              Child SubCategories
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {totalChildren} child items across {uniqueParents} parent
              categories
            </p>
          </div>

          <button
            onClick={loadData}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FaSyncAlt size={11} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ============ SEARCH + FILTERS ============ */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <FaSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={12}
            />
            <input
              type="text"
              placeholder="Search by name, slug or parent..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                showFilters
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <FaFilter size={11} />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? (
                <FaChevronUp size={9} />
              ) : (
                <FaChevronDown size={9} />
              )}
            </button>

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
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Parent Category
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={parentFilter}
                onChange={(e) => {
                  setParentFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Parents</option>
                {parents.map((p: any) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Sort by
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={sortConfig.key}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="id">ID</option>
                <option value="parent">Parent</option>
                <option value="createdAt">Created</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============ TABLE ============ */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] lg:min-w-full">
          <Table className="min-w-full">
            <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
              <TableRow className="border-b border-slate-200 dark:border-slate-800">
                <TableCell
                  isHeader
                  className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort("id")}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    ID {getSortIcon("id")}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort("name")}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Name {getSortIcon("name")}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Slug
                </TableCell>
                <TableCell
                  isHeader
                  className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort("parent")}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Parent {getSortIcon("parent")}
                  </button>
                </TableCell>
                <TableCell
                  isHeader
                  className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort("createdAt")}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Created {getSortIcon("createdAt")}
                  </button>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} className="!py-3 !px-3">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : visibleData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FaSitemap
                        className="text-slate-300 dark:text-slate-700"
                        size={32}
                      />
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {searchTerm || parentFilter !== "all"
                          ? "No matching child subcategories"
                          : "No child subcategories found"}
                      </div>
                      <div className="text-xs">
                        {searchTerm || parentFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Child subcategories will appear here once created"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* ID */}
                    <TableCell className="!py-3 !px-3">
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        #{String(item.id).padStart(4, "0")}
                      </span>
                    </TableCell>

                    {/* NAME */}
                    <TableCell className="!py-3 !px-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <FaFolderOpen size={10} />
                        </span>
                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                          {item.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* SLUG */}
                    <TableCell className="!py-3 !px-3">
                      {item.slug ? (
                        <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                          {item.slug}
                        </code>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* PARENT */}
                    <TableCell className="!py-3 !px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded">
                        <FaLink size={8} />
                        {getParentName(item.parentId)}
                      </span>
                    </TableCell>

                    {/* CREATED */}
                    <TableCell className="!py-3 !px-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <FaCalendarAlt size={10} className="text-slate-400" />
                        <span className="tabular-nums">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ============ PAGINATION ============ */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedData.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ChildSubCategoryTable;