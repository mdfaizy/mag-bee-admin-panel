// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   setSelectedCategory,
//   setCategories,
// } from "@/redux/productCategory";
// import Link from "next/link";
// import {
//   fetchProductCategory,
//   deleteCategory,
// } from "@/services/product-category/categoryService";
// import ViewCategoryModal from "../productCategory/ViewCategoryModal";
// import {
//   FaEye,
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaSyncAlt,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaCalendarAlt,
//   FaImage,
//   FaFolder,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../ui/table";
// import { Modal } from "../ui/modal";
// import { toast } from "react-toastify";
// import Pagination from "./Pagination";
// import { useRouter } from "next/navigation";
// import { apiConnector } from "@/services/apiConnector";

// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   imageUrl?: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const CategoryTable = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { categories } = useSelector((state: RootState) => state.category);

//   const [tableData, setTableData] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({
//     key: "",
//     direction: "asc",
//   });
//   const [loading, setLoading] = useState(false);
//   const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
//     "all"
//   );
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [togglingId, setTogglingId] = useState<number | null>(null);

//   /* =======================================================
//      FETCH
//   ======================================================= */
//   const loadCategories = async (showLoader = true) => {
//     try {
//       if (showLoader) setLoading(true);
//       const result = await fetchProductCategory();
//       dispatch(setCategories(result));
//     } catch (error) {
//       console.error("Failed to load categories", error);
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, [dispatch]);

//   useEffect(() => {
//     setTableData(categories || []);
//   }, [categories]);

//   /* =======================================================
//      FILTER + SORT
//   ======================================================= */
//   const filteredAndSortedData = useMemo(() => {
//     let filtered = tableData.filter(
//       (category) =>
//         category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         category.description
//           ?.toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (statusFilter !== "all") {
//       filtered = filtered.filter((c) =>
//         statusFilter === "active" ? c.isActive : !c.isActive
//       );
//     }

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key])
//           return sortConfig.direction === "asc" ? -1 : 1;
//         if (a[sortConfig.key] > b[sortConfig.key])
//           return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   }, [tableData, searchTerm, sortConfig, statusFilter]);

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

//   const handleView = (category: any) => {
//     dispatch(setSelectedCategory(category));
//     setViewModalOpen(true);
//   };

//   const handleDeleteClick = (id: number) => {
//     setSelectedDeleteId(id);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (selectedDeleteId) {
//       try {
//         await dispatch<any>(deleteCategory(selectedDeleteId));
//         await loadCategories(false);
//         toast.success("Category deleted successfully");
//         setDeleteModalOpen(false);
//         setSelectedDeleteId(null);
//       } catch (error) {
//         toast.error("Failed to delete category");
//       }
//     }
//   };

//   const toggleCategory = async (id: number) => {
//     try {
//       setTogglingId(id);
//       const res = await apiConnector(
//         "PATCH",
//         `/category/${id}/toggle-status`
//       );

//       if (res?.data?.success) {
//         toast.success("Category status updated");
//         await loadCategories(false);
//       }
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "Failed to update category status"
//       );
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
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
//   const totalCategories = tableData.length;
//   const activeCategories = tableData.filter((c) => c.isActive).length;
//   const inactiveCategories = totalCategories - activeCategories;
//   const withImages = tableData.filter((c) => c.imageUrl).length;

//   /* =======================================================
//      UI
//   ======================================================= */
//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
//         {/* ============ HEADER ============ */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Catalog
//               </span>
//               <span className="text-slate-300 dark:text-slate-700">/</span>
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Categories
//               </span>
//             </div>
//             <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
//               Category Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               {totalCategories} total · {activeCategories} active ·{" "}
//               {inactiveCategories} inactive
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => loadCategories()}
//               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               <FaSyncAlt size={11} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <Link href="/category">
//               <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
//                 <FaPlus size={12} />
//                 <span>New Category</span>
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* ============ STAT CARDS ============ */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Total
//               </span>
//               <FaFolder className="text-slate-400" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalCategories}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Active
//               </span>
//               <FaCheckCircle className="text-emerald-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {activeCategories}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Inactive
//               </span>
//               <FaTimesCircle className="text-slate-400" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {inactiveCategories}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 With Images
//               </span>
//               <FaImage className="text-amber-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {withImages}
//             </div>
//           </div>
//         </div>

//         {/* ============ MAIN PANEL ============ */}
//         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
//           {/* -------- TABS -------- */}
//           <div className="border-b border-slate-200 dark:border-slate-800">
//             <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
//               {[
//                 {
//                   key: "all",
//                   label: "All",
//                   count: totalCategories,
//                   icon: FaFolder,
//                 },
//                 {
//                   key: "active",
//                   label: "Active",
//                   count: activeCategories,
//                   icon: FaCheckCircle,
//                 },
//                 {
//                   key: "inactive",
//                   label: "Inactive",
//                   count: inactiveCategories,
//                   icon: FaTimesCircle,
//                 },
//               ].map((tab) => {
//                 const Icon = tab.icon;
//                 const active = statusFilter === tab.key;
//                 return (
//                   <button
//                     key={tab.key}
//                     onClick={() => {
//                       setStatusFilter(tab.key as any);
//                       setCurrentPage(1);
//                     }}
//                     className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
//                       active
//                         ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
//                         : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                     }`}
//                   >
//                     <Icon size={11} />
//                     {tab.label}
//                     <span
//                       className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded ${
//                         active
//                           ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
//                           : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
//                       }`}
//                     >
//                       {tab.count}
//                     </span>
//                     {active && (
//                       <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* -------- SEARCH + FILTERS -------- */}
//           <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
//             <div className="flex flex-col md:flex-row gap-2">
//               <div className="relative flex-1">
//                 <FaSearch
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={12}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search by name, slug or description..."
//                   className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
//                     showFilters
//                       ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
//                       : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
//                   }`}
//                 >
//                   <FaFilter size={11} />
//                   <span className="hidden sm:inline">Filters</span>
//                   {showFilters ? (
//                     <FaChevronUp size={9} />
//                   ) : (
//                     <FaChevronDown size={9} />
//                   )}
//                 </button>

//                 <select
//                   className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value="5">5 / page</option>
//                   <option value="10">10 / page</option>
//                   <option value="20">20 / page</option>
//                   <option value="50">50 / page</option>
//                 </select>
//               </div>
//             </div>

//             {showFilters && (
//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                     Status
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value as any);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <option value="all">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                     Sort by
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                     value={sortConfig.key}
//                     onChange={(e) => handleSort(e.target.value)}
//                   >
//                     <option value="">Default</option>
//                     <option value="name">Name</option>
//                     <option value="id">ID</option>
//                     <option value="createdAt">Created Date</option>
//                     <option value="updatedAt">Updated Date</option>
//                   </select>
//                 </div>

//                 <div className="sm:col-span-2 flex items-end">
//                   <button
//                     onClick={resetFilters}
//                     className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* -------- TABLE -------- */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[1000px] lg:min-w-full">
//               <Table className="min-w-full">
//                 <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
//                   <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       <button
//                         onClick={() => handleSort("id")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         ID {getSortIcon("id")}
//                       </button>
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       <button
//                         onClick={() => handleSort("name")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         Category {getSortIcon("name")}
//                       </button>
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
//                     >
//                       Slug
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       Image
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       Status
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
//                     >
//                       <button
//                         onClick={() => handleSort("createdAt")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         Created {getSortIcon("createdAt")}
//                       </button>
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {loading ? (
//                     Array.from({ length: itemsPerPage }).map((_, i) => (
//                       <TableRow
//                         key={i}
//                         className="border-b border-slate-100 dark:border-slate-800"
//                       >
//                         {Array.from({ length: 7 }).map((_, j) => (
//                           <TableCell key={j} className="!py-3 !px-3">
//                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : visibleData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={7}
//                         className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <FaFolder
//                             className="text-slate-300 dark:text-slate-700"
//                             size={32}
//                           />
//                           <div className="font-medium text-slate-700 dark:text-slate-300">
//                             {searchTerm || statusFilter !== "all"
//                               ? "No matching categories"
//                               : "No categories available"}
//                           </div>
//                           <div className="text-xs">
//                             {searchTerm || statusFilter !== "all"
//                               ? "Try adjusting your search or filters"
//                               : "Create your first category to get started"}
//                           </div>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     visibleData.map((item) => (
//                       <TableRow
//                         key={item.id}
//                         className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
//                       >
//                         {/* ID */}
//                         <TableCell className="!py-3 !px-3">
//                           <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
//                             #{String(item.id).padStart(4, "0")}
//                           </span>
//                         </TableCell>

//                         {/* NAME + DESCRIPTION */}
//                         <TableCell className="!py-3 !px-3">
//                           <div className="flex flex-col min-w-0">
//                             <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
//                               {item.name || "—"}
//                             </span>
//                             {item.description && (
//                               <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
//                                 {item.description.length > 50
//                                   ? item.description.substring(0, 50) + "..."
//                                   : item.description}
//                               </span>
//                             )}
//                           </div>
//                         </TableCell>

//                         {/* SLUG */}
//                         <TableCell className="!py-3 !px-3 hidden lg:table-cell">
//                           {item.slug ? (
//                             <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                               {item.slug}
//                             </code>
//                           ) : (
//                             <span className="text-slate-300 dark:text-slate-700">
//                               —
//                             </span>
//                           )}
//                         </TableCell>

//                         {/* IMAGE */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.imageUrl ? (
//                             <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
//                               <img
//                                 src={item.imageUrl}
//                                 alt={item.name || "Category image"}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : (
//                             <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
//                               <FaImage size={12} />
//                             </div>
//                           )}
//                         </TableCell>

//                         {/* STATUS TOGGLE */}
//                         <TableCell className="!py-3 !px-3">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => toggleCategory(item.id)}
//                               disabled={togglingId === item.id}
//                               title={
//                                 item.isActive
//                                   ? "Disable category"
//                                   : "Enable category"
//                               }
//                               className={`relative inline-flex items-center cursor-pointer w-9 h-5 rounded-full transition-colors ${
//                                 item.isActive
//                                   ? "bg-emerald-500"
//                                   : "bg-slate-300 dark:bg-slate-700"
//                               } ${
//                                 togglingId === item.id
//                                   ? "opacity-50 cursor-wait"
//                                   : ""
//                               }`}
//                             >
//                               <span
//                                 className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
//                                   item.isActive ? "translate-x-4" : ""
//                                 }`}
//                               />
//                             </button>
//                             <span
//                               className={`text-[11px] font-medium ${
//                                 item.isActive
//                                   ? "text-emerald-600 dark:text-emerald-400"
//                                   : "text-slate-500 dark:text-slate-400"
//                               }`}
//                             >
//                               {item.isActive ? "Active" : "Inactive"}
//                             </span>
//                           </div>
//                         </TableCell>

//                         {/* CREATED */}
//                         <TableCell className="!py-3 !px-3 hidden lg:table-cell">
//                           <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
//                             <FaCalendarAlt
//                               size={10}
//                               className="text-slate-400"
//                             />
//                             <span className="tabular-nums">
//                               {formatDate(item.createdAt)}
//                             </span>
//                           </div>
//                         </TableCell>

//                         {/* ACTIONS */}
//                         <TableCell className="!py-3 !px-3 text-right">
//                           <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={() => handleView(item)}
//                               className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
//                               title="View"
//                             >
//                               <FaEye size={13} />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 router.push(`/edit-category/${item.id}`)
//                               }
//                               className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
//                               title="Edit"
//                             >
//                               <FaEdit size={13} />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteClick(item.id)}
//                               className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
//                               title="Delete"
//                             >
//                               <MdDeleteForever size={15} />
//                             </button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           {/* -------- PAGINATION -------- */}
//           <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               totalItems={filteredAndSortedData.length}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ============ MODALS ============ */}
//       <ViewCategoryModal
//         isOpen={viewModalOpen}
//         onClose={() => setViewModalOpen(false)}
//       />

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         className="max-w-md"
//       >
//         <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-50 dark:bg-red-950/40 rounded-full mb-4">
//             <MdDeleteForever
//               className="text-red-600 dark:text-red-400"
//               size={22}
//             />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
//             Delete Category
//           </h3>
//           <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
//             Are you sure you want to delete this category? This action cannot be
//             undone.
//           </p>
//           <div className="flex justify-center gap-3">
//             <button
//               onClick={() => setDeleteModalOpen(false)}
//               className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={confirmDelete}
//               className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default CategoryTable;


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedCategory,
  setCategories,
} from "@/redux/productCategory";
import Link from "next/link";
import {
  fetchProductCategory,
  deleteCategory,
} from "@/services/product-category/categoryService";
import ViewCategoryModal from "../productCategory/ViewCategoryModal";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaImage,
  FaFolder,
  FaCheckCircle,
  FaTimesCircle,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";
import { apiConnector } from "@/services/apiConnector";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDateInput = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CategoryTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector((state: RootState) => state.category);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  /* =======================================================
     FETCH
  ======================================================= */
  const loadCategories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const result = await fetchProductCategory();
      dispatch(setCategories(result));
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [dispatch]);

  useEffect(() => {
    setTableData(categories || []);
  }, [categories]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let filtered = tableData.filter((category) => {
      if (statusFilter !== "all") {
        const matchesStatus =
          statusFilter === "active" ? category.isActive : !category.isActive;
        if (!matchesStatus) return false;
      }

      if (fromDate || toDate) {
        const createdStr = formatDateInput(category.createdAt);
        if (!createdStr) return false;
        if (fromDate && createdStr < fromDate) return false;
        if (toDate && createdStr > toDate) return false;
      }

      if (!term) return true;

      return (
        String(category.id).includes(term) ||
        category.name?.toLowerCase().includes(term) ||
        category.description?.toLowerCase().includes(term) ||
        category.slug?.toLowerCase().includes(term)
      );
    });

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig, statusFilter, fromDate, toDate]);

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

  /* =======================================================
     EXPORT TO EXCEL (.xls SpreadsheetML)
  ======================================================= */
  const handleExportExcel = () => {
    if (filteredAndSortedData.length === 0) {
      toast.info("No categories available to export");
      return;
    }

    const headers = [
      "ID",
      "Category Name",
      "Slug",
      "Description",
      "Status",
      "Created Date",
      "Updated Date",
    ];

    const rows = filteredAndSortedData.map((item) => [
      item.id,
      item.name || "",
      item.slug || "",
      item.description || "",
      item.isActive ? "Active" : "Inactive",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      item.updatedAt
        ? new Date(item.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
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
  <Worksheet ss:Name="Categories">
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

    const dateSuffix =
      fromDate || toDate
        ? `${fromDate || "start"}_to_${toDate || "end"}`
        : new Date().toISOString().slice(0, 10);
    const statusSuffix = statusFilter !== "all" ? `_${statusFilter}` : "";

    link.href = url;
    link.download = `categories${statusSuffix}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success("Categories exported to Excel");
  };

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

  const handleView = (category: any) => {
    dispatch(setSelectedCategory(category));
    setViewModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId) {
      try {
        await dispatch<any>(deleteCategory(selectedDeleteId));
        await loadCategories(false);
        toast.success("Category deleted successfully");
        setDeleteModalOpen(false);
        setSelectedDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const toggleCategory = async (id: number) => {
    try {
      setTogglingId(id);
      const res = await apiConnector(
        "PATCH",
        `/category/${id}/toggle-status`
      );

      if (res?.data?.success) {
        toast.success("Category status updated");
        await loadCategories(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update category status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !== "all" ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    Boolean(sortConfig.key);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
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
  const totalCategories = tableData.length;
  const activeCategories = tableData.filter((c) => c.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;
  const withImages = tableData.filter((c) => c.imageUrl).length;

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / Categories
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Category Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Organize product categories, filter by date or status, and export
              sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadCategories()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FaSyncAlt size={11} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredAndSortedData.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFileExcel className="h-3.5 w-3.5" />
              <span>Export Excel ({filteredAndSortedData.length})</span>
            </button>

            <Link
              href="/category"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <FaPlus size={11} />
              <span>New Category</span>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Categories
              </span>
              <FaFolder className="text-slate-400" size={13} />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {totalCategories}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Active
              </span>
              <FaCheckCircle className="text-emerald-500" size={13} />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {activeCategories}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Inactive
              </span>
              <FaTimesCircle className="text-slate-400" size={13} />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {inactiveCategories}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                With Images
              </span>
              <FaImage className="text-sky-500" size={13} />
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
              {withImages}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* -------- TABS -------- */}
          <div className="border-b border-slate-200 bg-slate-50/60 px-3 pt-2 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                {
                  key: "all",
                  label: "All",
                  count: totalCategories,
                  icon: FaFolder,
                },
                {
                  key: "active",
                  label: "Active",
                  count: activeCategories,
                  icon: FaCheckCircle,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: inactiveCategories,
                  icon: FaTimesCircle,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab.key as any);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon size={11} />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                        active
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------- SEARCH + DATE + FILTERS -------- */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <FaSearch
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Search by name, slug, or description..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="cat-from-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    From:
                  </label>
                  <input
                    id="cat-from-date"
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="cat-to-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    To:
                  </label>
                  <input
                    id="cat-to-date"
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    showFilters
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaFilter size={11} />
                  <span>Filters</span>
                  {showFilters ? (
                    <FaChevronUp size={9} />
                  ) : (
                    <FaChevronDown size={9} />
                  )}
                </button>

                <select
                  aria-label="Items per page"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
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

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <FaTimes className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/50 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sort By
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 sm:text-sm"
                    value={sortConfig.key}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="name">Category Name</option>
                    <option value="id">ID</option>
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[920px] border-collapse text-left">
              <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("id")}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
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
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      Category {getSortIcon("name")}
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
                    Image
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
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

              <TableBody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {loading && tableData.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j} className="!px-4 !py-3.5">
                          <div className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
                        <FaFolder
                          className="h-8 w-8 text-slate-300 dark:text-slate-700"
                        />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {hasActiveFilters
                            ? "No matching categories"
                            : "No categories available"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {hasActiveFilters
                            ? "Try adjusting your search, status, or date filters."
                            : "Create your first category to get started."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <TableCell className="!px-4 !py-3.5 align-middle font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        #{String(item.id).padStart(4, "0")}
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle">
                        <div className="max-w-xs">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.name || "—"}
                          </p>
                          {item.description && (
                            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle">
                        {item.slug ? (
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.slug}
                          </code>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-700">
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle">
                        {item.imageUrl ? (
                          <div className="h-10 w-10 overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                            <img
                              src={item.imageUrl}
                              alt={item.name || "Category image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700">
                            <FaImage size={12} />
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCategory(item.id)}
                            disabled={togglingId === item.id}
                            title={
                              item.isActive
                                ? "Disable category"
                                : "Enable category"
                            }
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
                              item.isActive
                                ? "bg-emerald-600"
                                : "bg-slate-300 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs transition-transform ${
                                item.isActive
                                  ? "translate-x-4.5"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-xs font-medium ${
                              item.isActive
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 tabular-nums dark:text-slate-400">
                          <FaCalendarAlt
                            size={10}
                            className="text-slate-400"
                          />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleView(item)}
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            title="View"
                          >
                            <FaEye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/edit-category/${item.id}`)
                            }
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            title="Edit"
                          >
                            <FaEdit size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(item.id)}
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
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

          {/* -------- PAGINATION -------- */}
          <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* ============ MODALS ============ */}
      <ViewCategoryModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="max-w-md"
      >
        <div className="rounded-xl bg-white p-6 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40">
            <MdDeleteForever
              className="text-rose-600 dark:text-rose-400"
              size={22}
            />
          </div>
          <h3 className="mb-2 text-center text-base font-semibold text-slate-900 dark:text-slate-100">
            Delete Category
          </h3>
          <p className="mb-6 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-rose-700 sm:text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryTable;