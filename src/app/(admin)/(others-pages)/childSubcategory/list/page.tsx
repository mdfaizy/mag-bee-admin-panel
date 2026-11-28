// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@/components/ui/table";
// import { getAllSubCategories } from "@/services/subCategoryService/subCategoryService";
// import {
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaSitemap,
//   FaFolderOpen,
//   FaSyncAlt,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaCalendarAlt,
//   FaLayerGroup,
//   FaLink,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Pagination from "@/components/tables/Pagination";

// const ChildSubCategoryTable = () => {
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [parentFilter, setParentFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({
//     key: "",
//     direction: "asc",
//   });

//   /* =======================================================
//      FETCH
//   ======================================================= */
//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const res = await getAllSubCategories();
//       setSubCategories(res.subCategories || []);
//     } catch (error) {
//       console.error("Failed to fetch child subcategories", error);
//       toast.error("Failed to load child subcategories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   /* =======================================================
//      DERIVED DATA
//   ======================================================= */
//   const childSubCategories = useMemo(
//     () => subCategories.filter((item) => item.parentId),
//     [subCategories]
//   );

//   const getParentName = (parentId: number) =>
//     subCategories.find((sub) => sub.id === parentId)?.name || "—";

//   // Unique parents for filter dropdown
//   const parents = useMemo(() => {
//     return Array.from(
//       new Map(
//         childSubCategories
//           .map((c) => {
//             const p = subCategories.find((s) => s.id === c.parentId);
//             return p ? [p.id, p] : null;
//           })
//           .filter(Boolean) as [number, any][]
//       ).values()
//     );
//   }, [childSubCategories, subCategories]);

//   /* =======================================================
//      FILTER + SORT
//   ======================================================= */
//   const filteredAndSortedData = useMemo(() => {
//     let filtered = childSubCategories.filter((item) => {
//       const parentName = getParentName(item.parentId);
//       return (
//         item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         parentName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });

//     if (parentFilter !== "all") {
//       filtered = filtered.filter(
//         (item) => getParentName(item.parentId) === parentFilter
//       );
//     }

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         let aVal = a[sortConfig.key];
//         let bVal = b[sortConfig.key];

//         // Special case for parent sorting
//         if (sortConfig.key === "parent") {
//           aVal = getParentName(a.parentId);
//           bVal = getParentName(b.parentId);
//         }

//         if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//         if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   }, [childSubCategories, searchTerm, parentFilter, sortConfig, subCategories]);

//   /* =======================================================
//      PAGINATION
//   ======================================================= */
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = filteredAndSortedData.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );
//   const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//   /* =======================================================
//      HANDLERS
//   ======================================================= */
//   const handleSort = (key: string) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setParentFilter("all");
//     setSortConfig({ key: "", direction: "asc" });
//   };

//   const getSortIcon = (key: string) => {
//     if (sortConfig.key !== key)
//       return <FaSort className="text-slate-400 text-[10px] opacity-50" />;
//     return sortConfig.direction === "asc" ? (
//       <FaSortUp className="text-blue-600 text-[10px]" />
//     ) : (
//       <FaSortDown className="text-blue-600 text-[10px]" />
//     );
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "—";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   /* =======================================================
//      STATS
//   ======================================================= */
//   const totalChildren = childSubCategories.length;
//   const uniqueParents = parents.length;
//   const withSlug = childSubCategories.filter((c) => c.slug).length;

//   /* =======================================================
//      UI
//   ======================================================= */
//   return (
//     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden mt-6">
//       {/* ============ SECTION HEADER ============ */}
//       <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Catalog
//               </span>
//               <span className="text-slate-300 dark:text-slate-700">/</span>
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Child Items
//               </span>
//             </div>
//             <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
//               <FaSitemap
//                 className="text-slate-400 dark:text-slate-500"
//                 size={14}
//               />
//               Child SubCategories
//             </h2>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               {totalChildren} child items across {uniqueParents} parent
//               categories
//             </p>
//           </div>

//           <button
//             onClick={loadData}
//             className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//           >
//             <FaSyncAlt size={11} />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* ============ SEARCH + FILTERS ============ */}
//       <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
//         <div className="flex flex-col md:flex-row gap-2">
//           <div className="relative flex-1">
//             <FaSearch
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={12}
//             />
//             <input
//               type="text"
//               placeholder="Search by name, slug or parent..."
//               className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
//                 showFilters
//                   ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
//                   : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
//               }`}
//             >
//               <FaFilter size={11} />
//               <span className="hidden sm:inline">Filters</span>
//               {showFilters ? (
//                 <FaChevronUp size={9} />
//               ) : (
//                 <FaChevronDown size={9} />
//               )}
//             </button>

//             <select
//               className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               value={itemsPerPage}
//               onChange={(e) => {
//                 setItemsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//             >
//               <option value="5">5 / page</option>
//               <option value="10">10 / page</option>
//               <option value="20">20 / page</option>
//               <option value="50">50 / page</option>
//             </select>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
//             <div>
//               <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                 Parent Category
//               </label>
//               <select
//                 className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                 value={parentFilter}
//                 onChange={(e) => {
//                   setParentFilter(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value="all">All Parents</option>
//                 {parents.map((p: any) => (
//                   <option key={p.id} value={p.name}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                 Sort by
//               </label>
//               <select
//                 className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                 value={sortConfig.key}
//                 onChange={(e) => handleSort(e.target.value)}
//               >
//                 <option value="">Default</option>
//                 <option value="name">Name</option>
//                 <option value="id">ID</option>
//                 <option value="parent">Parent</option>
//                 <option value="createdAt">Created</option>
//               </select>
//             </div>

//             <div className="sm:col-span-2 flex items-end">
//               <button
//                 onClick={resetFilters}
//                 className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ============ TABLE ============ */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[800px] lg:min-w-full">
//           <Table className="min-w-full">
//             <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
//               <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                 <TableCell
//                   isHeader
//                   className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                 >
//                   <button
//                     onClick={() => handleSort("id")}
//                     className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                   >
//                     ID {getSortIcon("id")}
//                   </button>
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                 >
//                   <button
//                     onClick={() => handleSort("name")}
//                     className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                   >
//                     Name {getSortIcon("name")}
//                   </button>
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                 >
//                   Slug
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                 >
//                   <button
//                     onClick={() => handleSort("parent")}
//                     className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                   >
//                     Parent {getSortIcon("parent")}
//                   </button>
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                 >
//                   <button
//                     onClick={() => handleSort("createdAt")}
//                     className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                   >
//                     Created {getSortIcon("createdAt")}
//                   </button>
//                 </TableCell>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading ? (
//                 Array.from({ length: 5 }).map((_, i) => (
//                   <TableRow
//                     key={i}
//                     className="border-b border-slate-100 dark:border-slate-800"
//                   >
//                     {Array.from({ length: 5 }).map((_, j) => (
//                       <TableCell key={j} className="!py-3 !px-3">
//                         <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : visibleData.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={5}
//                     className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <FaSitemap
//                         className="text-slate-300 dark:text-slate-700"
//                         size={32}
//                       />
//                       <div className="font-medium text-slate-700 dark:text-slate-300">
//                         {searchTerm || parentFilter !== "all"
//                           ? "No matching child subcategories"
//                           : "No child subcategories found"}
//                       </div>
//                       <div className="text-xs">
//                         {searchTerm || parentFilter !== "all"
//                           ? "Try adjusting your search or filters"
//                           : "Child subcategories will appear here once created"}
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 visibleData.map((item) => (
//                   <TableRow
//                     key={item.id}
//                     className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
//                   >
//                     {/* ID */}
//                     <TableCell className="!py-3 !px-3">
//                       <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
//                         #{String(item.id).padStart(4, "0")}
//                       </span>
//                     </TableCell>

//                     {/* NAME */}
//                     <TableCell className="!py-3 !px-3">
//                       <div className="flex items-center gap-2">
//                         <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
//                           <FaFolderOpen size={10} />
//                         </span>
//                         <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
//                           {item.name}
//                         </span>
//                       </div>
//                     </TableCell>

//                     {/* SLUG */}
//                     <TableCell className="!py-3 !px-3">
//                       {item.slug ? (
//                         <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                           {item.slug}
//                         </code>
//                       ) : (
//                         <span className="text-slate-300 dark:text-slate-700">
//                           —
//                         </span>
//                       )}
//                     </TableCell>

//                     {/* PARENT */}
//                     <TableCell className="!py-3 !px-3">
//                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded">
//                         <FaLink size={8} />
//                         {getParentName(item.parentId)}
//                       </span>
//                     </TableCell>

//                     {/* CREATED */}
//                     <TableCell className="!py-3 !px-3">
//                       <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
//                         <FaCalendarAlt size={10} className="text-slate-400" />
//                         <span className="tabular-nums">
//                           {formatDate(item.createdAt)}
//                         </span>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* ============ PAGINATION ============ */}
//       <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           itemsPerPage={itemsPerPage}
//           totalItems={filteredAndSortedData.length}
//           onPageChange={setCurrentPage}
//         />
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
  FaLink,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Pagination from "@/components/tables/Pagination";
import LoadingState from "@/components/common/LoadingState";

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const ChildSubCategoryTable = () => {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [parentFilter, setParentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "",
    direction: "asc",
  });

  /* =======================================================
     FETCH
  ======================================================= */
  const loadData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const res = await getAllSubCategories();
      setSubCategories(
        Array.isArray(res?.subCategories) ? res.subCategories : []
      );
    } catch (error) {
      console.error("Failed to fetch child subcategories", error);
      toast.error("Failed to load child subcategories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  /* =======================================================
     DERIVED DATA
  ======================================================= */
  const childSubCategories = useMemo(
    () => subCategories.filter((item) => item.parentId),
    [subCategories]
  );

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, any>();
    subCategories.forEach((sub) => map.set(sub.id, sub));
    return map;
  }, [subCategories]);

  const getParentName = (parentId: number) =>
    subCategoryMap.get(parentId)?.name || "—";

  const parents = useMemo(() => {
    return Array.from(
      new Map(
        childSubCategories
          .map((c) => {
            const p = subCategoryMap.get(c.parentId);
            return p ? [p.id, p] : null;
          })
          .filter(Boolean) as [number, any][]
      ).values()
    ).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [childSubCategories, subCategoryMap]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let filtered = childSubCategories.filter((item) => {
      const parentName = getParentName(item.parentId);

      if (q) {
        const hit =
          item.name?.toLowerCase().includes(q) ||
          item.slug?.toLowerCase().includes(q) ||
          parentName.toLowerCase().includes(q);
        if (!hit) return false;
      }

      if (parentFilter !== "all" && parentName !== parentFilter) {
        return false;
      }

      return true;
    });

    if (sortConfig.key) {
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "parent") {
          aVal = getParentName(a.parentId);
          bVal = getParentName(b.parentId);
        }

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal, undefined, { sensitivity: "base" }) * dir;
        }
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
    }

    return filtered;
  }, [
    childSubCategories,
    searchTerm,
    parentFilter,
    sortConfig,
    subCategoryMap,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedData.length / itemsPerPage)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     HANDLERS
  ======================================================= */
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
    setSearchTerm("");
    setParentFilter("all");
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return (
        <FaSort className="text-[10px] text-slate-400 opacity-50 dark:text-slate-500" />
      );
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-[10px] text-slate-900 dark:text-brand-400" />
    ) : (
      <FaSortDown className="text-[10px] text-slate-900 dark:text-brand-400" />
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
     EXPORT FILTERED LIST TO EXCEL (.xls)
  ======================================================= */
  const handleExportExcel = () => {
    if (filteredAndSortedData.length === 0) {
      toast.info("No child subcategories available to export");
      return;
    }

    const headers = [
      "ID",
      "Child SubCategory Name",
      "Slug",
      "Parent SubCategory",
      "Created Date",
    ];

    const rows = filteredAndSortedData.map((item) => [
      `#${String(item.id).padStart(4, "0")}`,
      item.name || "",
      item.slug || "",
      getParentName(item.parentId),
      formatDate(item.createdAt),
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
          .map(
            (val) => `<Cell><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`
          )
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
  <Worksheet ss:Name="Child SubCategories">
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
    const filterSlug =
      parentFilter !== "all"
        ? `_${parentFilter.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : searchTerm.trim()
          ? "_filtered"
          : "";
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `child-subcategories${filterSlug}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${filteredAndSortedData.length} child item(s) to Excel`
    );
  };

  /* =======================================================
     STATS
  ======================================================= */
  const totalChildren = childSubCategories.length;
  const uniqueParents = parents.length;
  const withSlug = childSubCategories.filter((c) => Boolean(c.slug)).length;
  const hasAnyFilter =
    Boolean(searchTerm.trim()) ||
    parentFilter !== "all" ||
    Boolean(sortConfig.key);

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="mt-6 space-y-5 text-slate-900 dark:text-slate-100">
      {/* ============ KPI SUMMARY STRIP ============ */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Child Items
              </span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <FaFolderOpen className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
            {totalChildren}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Parent SubCategories
              </span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-indigo-500 dark:bg-slate-800 dark:text-indigo-400">
              <FaSitemap className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
            {uniqueParents}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                With URL Slug
              </span>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-emerald-500 dark:bg-slate-800 dark:text-emerald-400">
              <FaLink className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
            {withSlug}
          </div>
        </div>
      </div>

      {/* ============ MAIN CARD ============ */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        {/* SECTION HEADER */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Catalog / Nested Taxonomy
              </p>
              <h2 className="mt-0.5 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                <FaSitemap className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span>Child SubCategories</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                {totalChildren} nested child items across {uniqueParents} parent
                subcategories
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => loadData(false)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
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
                disabled={loading || filteredAndSortedData.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <FaFileExcel className="h-3.5 w-3.5" />
                <span>Export Excel ({filteredAndSortedData.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER BAR */}
        <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by child name, slug, or parent..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  showFilters
                    ? "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <FaFilter className="h-3 w-3" />
                <span>Filters</span>
                {parentFilter !== "all" && (
                  <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                    1
                  </span>
                )}
                {showFilters ? (
                  <FaChevronUp className="h-2.5 w-2.5" />
                ) : (
                  <FaChevronDown className="h-2.5 w-2.5" />
                )}
              </button>

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

              {hasAnyFilter && (
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

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Parent SubCategory
                </label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
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
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sort by
                </label>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
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

              <div className="flex items-end sm:col-span-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasAnyFilter}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <div className="min-w-[820px] lg:min-w-full">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("id")}
                      className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      ID {getSortIcon("id")}
                    </button>
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
                      Name {getSortIcon("name")}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Slug
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("parent")}
                      className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      Parent {getSortIcon("parent")}
                    </button>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      Created {getSortIcon("createdAt")}
                    </button>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <LoadingState variant="table" rows={5} columns={5} />
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                        <FaSitemap className="h-8 w-8 text-slate-300 dark:text-slate-700" />
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
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* ID */}
                      <TableCell className="!px-4 !py-3.5">
                        <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          #{String(item.id).padStart(4, "0")}
                        </span>
                      </TableCell>

                      {/* NAME */}
                      <TableCell className="!px-4 !py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                            <FaFolderOpen className="h-3 w-3" />
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* SLUG */}
                      <TableCell className="!px-4 !py-3.5">
                        {item.slug ? (
                          <code className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                            {item.slug}
                          </code>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">
                            —
                          </span>
                        )}
                      </TableCell>

                      {/* PARENT */}
                      <TableCell className="!px-4 !py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <FaLink className="h-2.5 w-2.5 text-slate-400" />
                          <span>{getParentName(item.parentId)}</span>
                        </span>
                      </TableCell>

                      {/* CREATED */}
                      <TableCell className="!px-4 !py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 tabular-nums dark:text-slate-400">
                          <FaCalendarAlt className="h-2.5 w-2.5 text-slate-400" />
                          <span>{formatDate(item.createdAt)}</span>
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
        {filteredAndSortedData.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSubCategoryTable;