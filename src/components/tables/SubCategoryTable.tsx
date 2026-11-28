// "use client";

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   setSubCategories,
//   setSelectedSubCategory,
// } from "../../redux/productSubCategory";
// import Link from "next/link";
// import { fetchSubCategoryAll,deleteSubCategoryById } from "../../services/subCategoryService/subCategoryService";
// import {
//   FaEye,
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaLayerGroup,
//   FaFolderOpen,
//   FaImage,
//   FaSyncAlt,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaSitemap,
//   FaCalendarAlt,
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
// import Image from "next/image";
// import { toast } from "react-toastify";
// import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
// import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";
// import Pagination from "./Pagination";

// const SubCategoryTable = () => {
//   const dispatch = useDispatch();
//   const { subCategories } = useSelector(
//     (state: RootState) => state.SubCategoryState
//   );

//   const [tableData, setTableData] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
//     number | null
//   >(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({
//     key: "",
//     direction: "asc",
//   });
//   const [loading, setLoading] = useState(false);
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   /* =======================================================
//      FILTER + SORT
//   ======================================================= */
//   const filteredAndSortedData = React.useMemo(() => {
//     let filtered = tableData.filter(
//       (sub) =>
//         sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sub.slug?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (categoryFilter !== "all") {
//       filtered = filtered.filter(
//         (sub) => sub.category?.name === categoryFilter
//       );
//     }

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return filtered;
//   }, [tableData, searchTerm, sortConfig, categoryFilter]);

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = filteredAndSortedData.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );
//   const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//   /* =======================================================
//      UNIQUE CATEGORIES
//   ======================================================= */
//   const categories = React.useMemo(() => {
//     return Array.from(
//       new Map(
//         tableData
//           .filter((s) => s.category)
//           .map((s) => [s.category.id, s.category])
//       ).values()
//     );
//   }, [tableData]);

//   /* =======================================================
//      FETCH
//   ======================================================= */
//   useEffect(() => {
//     const getSubCategories = async () => {
//       try {
//         setLoading(true);
//         const result = await fetchSubCategoryAll();
//         dispatch(setSubCategories(result));
//       } catch (error) {
//         console.error("Failed to load subcategories", error);
//         toast.error("Failed to load subcategories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getSubCategories();
//   }, [dispatch]);

//   useEffect(() => {
//     setTableData(subCategories || []);
//   }, [subCategories]);

//   /* =======================================================
//      HANDLERS
//   ======================================================= */
//   const handleView = (id: number) => {
//     setSelectedSubCategoryId(id);
//     setViewModalOpen(true);
//   };

//   const handleEdit = (subCategory: any) => {
//     dispatch(setSelectedSubCategory(subCategory));
//     setEditModalOpen(true);
//   };

//   const handleDeleteClick = (id: number) => {
//     setSelectedDeleteId(id);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//   if (selectedDeleteId) {
//     try {
//       await deleteSubCategoryById(selectedDeleteId);

//       toast.success("SubCategory deleted successfully");
//       setDeleteModalOpen(false);
//       setSelectedDeleteId(null);

//       // Agar list fetch se load hoti hai to refresh bhi karo
//       fetchSubCategoryAll();
//     } catch (error) {
//       toast.error("Failed to delete subcategory");
//     }
//   }
// };

//   const handleSort = (key: string) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("all");
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
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   /* =======================================================
//      STATS
//   ======================================================= */
//   const totalSubCategories = tableData.length;
//   const withChildren = tableData.filter(
//     (s) => s.children?.length > 0
//   ).length;
//   const withImages = tableData.filter((s) => s.imageUrl).length;
//   const totalChildren = tableData.reduce(
//     (acc, s) => acc + (s.children?.length || 0),
//     0
//   );

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
//                 Taxonomy
//               </span>
//             </div>
//             <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
//               SubCategory Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               {totalSubCategories} subcategories · {withChildren} with children
//               · {totalChildren} total child items
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => {
//                 const getSubCategories = async () => {
//                   setLoading(true);
//                   try {
//                     const result = await fetchSubCategoryAll();
//                     dispatch(setSubCategories(result));
//                   } finally {
//                     setLoading(false);
//                   }
//                 };
//                 getSubCategories();
//               }}
//               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               <FaSyncAlt size={11} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <Link href="/subcategory">
//               <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
//                 <FaPlus size={12} />
//                 <span>New SubCategory</span>
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
//               <FaLayerGroup className="text-slate-400" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalSubCategories}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 With Children
//               </span>
//               <FaSitemap className="text-blue-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {withChildren}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Child Items
//               </span>
//               <FaFolderOpen className="text-purple-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalChildren}
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
//                     Category
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                     value={categoryFilter}
//                     onChange={(e) => {
//                       setCategoryFilter(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <option value="all">All Categories</option>
//                     {categories.map((c: any) => (
//                       <option key={c.id} value={c.name}>
//                         {c.name}
//                       </option>
//                     ))}
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
//                     <option value="createdAt">Created</option>
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
//             <div className="min-w-[1100px] lg:min-w-full">
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
//                         Name {getSortIcon("name")}
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
//                       Category
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       Children
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       Image
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
//                     >
//                       Created
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
//                         {Array.from({ length: 8 }).map((_, j) => (
//                           <TableCell key={j} className="!py-3 !px-3">
//                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : visibleData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={8}
//                         className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <FaLayerGroup
//                             className="text-slate-300 dark:text-slate-700"
//                             size={32}
//                           />
//                           <div className="font-medium text-slate-700 dark:text-slate-300">
//                             {searchTerm
//                               ? "No subcategories match your search"
//                               : "No subcategories available"}
//                           </div>
//                           <div className="text-xs">
//                             {searchTerm
//                               ? "Try a different keyword"
//                               : "Create your first subcategory to get started"}
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

//                         {/* NAME + DESC */}
//                         <TableCell className="!py-3 !px-3">
//                           <div className="flex flex-col min-w-0">
//                             <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
//                               {item?.name || "—"}
//                             </span>
//                             {item?.description && (
//                               <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
//                                 {item.description.length > 40
//                                   ? item.description.substring(0, 40) + "..."
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

//                         {/* CATEGORY */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.category?.name ? (
//                             <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                               {item.category.name}
//                             </span>
//                           ) : (
//                             <span className="text-slate-300 dark:text-slate-700">
//                               —
//                             </span>
//                           )}
//                         </TableCell>

//                         {/* CHILDREN */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.children?.length > 0 ? (
//                             <div className="flex flex-wrap gap-1 max-w-[220px]">
//                               {item.children.slice(0, 3).map((child: any) => (
//                                 <span
//                                   key={child.id}
//                                   className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded"
//                                 >
//                                   {child.name}
//                                 </span>
//                               ))}
//                               {item.children.length > 3 && (
//                                 <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
//                                   +{item.children.length - 3}
//                                 </span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-slate-300 dark:text-slate-700 text-xs">
//                               none
//                             </span>
//                           )}
//                         </TableCell>

//                         {/* IMAGE */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.imageUrl ? (
//                             <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
//                               <img
//                                 src={item.imageUrl}
//                                 alt={item.name || "image"}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : (
//                             <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
//                               <FaImage size={12} />
//                             </div>
//                           )}
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
//                               onClick={() => handleView(item.id)}
//                               className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
//                               title="View"
//                             >
//                               <FaEye size={13} />
//                             </button>
//                             <button
//                               onClick={() => handleEdit(item)}
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

//       {/* =====================================================
//           MODALS
//       ===================================================== */}
//       <ViewSubCategoryModal
//         isOpen={viewModalOpen}
//         onClose={() => setViewModalOpen(false)}
//         data={
//           tableData.find((sub) => sub.id === selectedSubCategoryId) || null
//         }
//       />

//       <EditSubCategoryModal
//         isOpen={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//       />

//       {/* Delete Modal */}
//       <Modal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         className="max-w-md"
//       >
//         <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
//           <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 mx-auto mb-4">
//             <MdDeleteForever
//               className="text-red-600 dark:text-red-400"
//               size={22}
//             />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
//             Delete SubCategory
//           </h3>
//           <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
//             Are you sure? This action cannot be undone.
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

// export default SubCategoryTable;


// "use client";

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   setSubCategories,
//   setSelectedSubCategory,
// } from "../../redux/productSubCategory";
// import Link from "next/link";
// import { fetchSubCategoryAll, deleteSubCategoryById } from "../../services/subCategoryService/subCategoryService";
// import {
//   FaEye,
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaLayerGroup,
//   FaFolderOpen,
//   FaImage,
//   FaSyncAlt,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaSitemap,
//   FaCalendarAlt,
//   FaTimes,
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
// import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
// import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";
// import Pagination from "./Pagination";

// /* shared classes (same styles as before, just de-duplicated) */
// const thClass =
//   "!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider";
// const filterLabelClass =
//   "block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";
// const filterSelectClass =
//   "w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50";

// type SortDirection = "asc" | "desc";
// type TriState = "all" | "with" | "without";

// const SubCategoryTable = () => {
//   const dispatch = useDispatch();
//   const { subCategories } = useSelector(
//     (state: RootState) => state.SubCategoryState
//   );

//   const [tableData, setTableData] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
//     number | null
//   >(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState<{
//     key: string;
//     direction: SortDirection;
//   }>({
//     key: "",
//     direction: "asc",
//   });
//   const [loading, setLoading] = useState(false);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   /* ---- filters ---- */
//   const [categoryFilter, setCategoryFilter] = useState("all"); // category id
//   const [subCategoryFilter, setSubCategoryFilter] = useState("all"); // subcategory id
//   const [childrenFilter, setChildrenFilter] = useState<TriState>("all");
//   const [imageFilter, setImageFilter] = useState<TriState>("all");

//   /* =======================================================
//      FILTER OPTIONS (dependent: Category -> SubCategory)
//   ======================================================= */
//   const categories = React.useMemo(() => {
//     const unique = Array.from(
//       new Map(
//         tableData
//           .filter((s) => s.category)
//           .map((s) => [String(s.category.id), s.category])
//       ).values()
//     );
//     return unique.sort((a: any, b: any) =>
//       String(a.name).localeCompare(String(b.name))
//     );
//   }, [tableData]);

//   const subCategoryOptions = React.useMemo(() => {
//     const list =
//       categoryFilter === "all"
//         ? tableData
//         : tableData.filter((s) => String(s.category?.id) === categoryFilter);
//     return [...list].sort((a, b) =>
//       String(a.name).localeCompare(String(b.name))
//     );
//   }, [tableData, categoryFilter]);

//   /* =======================================================
//      FILTER + SORT
//   ======================================================= */
//   const filteredAndSortedData = React.useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();

//     let filtered = tableData.filter((sub) => {
//       // search: name, slug, description, category name, child names
//       if (q) {
//         const hit =
//           sub.name?.toLowerCase().includes(q) ||
//           sub.description?.toLowerCase().includes(q) ||
//           sub.slug?.toLowerCase().includes(q) ||
//           sub.category?.name?.toLowerCase().includes(q) ||
//           sub.children?.some((c: any) => c.name?.toLowerCase().includes(q));
//         if (!hit) return false;
//       }

//       if (categoryFilter !== "all" && String(sub.category?.id) !== categoryFilter)
//         return false;

//       if (subCategoryFilter !== "all" && String(sub.id) !== subCategoryFilter)
//         return false;

//       const childCount = sub.children?.length || 0;
//       if (childrenFilter === "with" && childCount === 0) return false;
//       if (childrenFilter === "without" && childCount > 0) return false;

//       if (imageFilter === "with" && !sub.imageUrl) return false;
//       if (imageFilter === "without" && sub.imageUrl) return false;

//       return true;
//     });

//     if (sortConfig.key) {
//       const dir = sortConfig.direction === "asc" ? 1 : -1;
//       filtered = [...filtered].sort((a, b) => {
//         const av = a[sortConfig.key];
//         const bv = b[sortConfig.key];
//         if (av == null && bv == null) return 0;
//         if (av == null) return 1;
//         if (bv == null) return -1;
//         if (typeof av === "string" && typeof bv === "string") {
//           return av.localeCompare(bv, undefined, { sensitivity: "base" }) * dir;
//         }
//         if (av < bv) return -1 * dir;
//         if (av > bv) return 1 * dir;
//         return 0;
//       });
//     }
//     return filtered;
//   }, [
//     tableData,
//     searchTerm,
//     sortConfig,
//     categoryFilter,
//     subCategoryFilter,
//     childrenFilter,
//     imageFilter,
//   ]);

//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = filteredAndSortedData.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );
//   const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//   // keep page valid when data / filters shrink the list
//   useEffect(() => {
//     if (currentPage > 1 && currentPage > totalPages) {
//       setCurrentPage(Math.max(1, totalPages));
//     }
//   }, [totalPages, currentPage]);

//   /* =======================================================
//      FETCH
//   ======================================================= */
//   const loadSubCategories = async (showLoader = true) => {
//     try {
//       if (showLoader) setLoading(true);
//       const result = await fetchSubCategoryAll();
//       dispatch(setSubCategories(result));
//     } catch (error) {
//       console.error("Failed to load subcategories", error);
//       toast.error("Failed to load subcategories");
//     } finally {
//       if (showLoader) setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadSubCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dispatch]);

//   useEffect(() => {
//     setTableData(subCategories || []);
//   }, [subCategories]);

//   /* =======================================================
//      HANDLERS
//   ======================================================= */
//   const handleView = (id: number) => {
//     setSelectedSubCategoryId(id);
//     setViewModalOpen(true);
//   };

//   const handleEdit = (subCategory: any) => {
//     dispatch(setSelectedSubCategory(subCategory));
//     setEditModalOpen(true);
//   };

//   const handleDeleteClick = (id: number) => {
//     setSelectedDeleteId(id);
//     setDeleteModalOpen(true);
//   };

//  const confirmDelete = async () => {
//   if (selectedDeleteId === null) return;

//   try {
//     console.log("Deleting SubCategory ID:", selectedDeleteId);

//     const response = await deleteSubCategoryById(selectedDeleteId);

//     console.log("Delete API Response:", response);

//     setDeleteModalOpen(false);
//     setSelectedDeleteId(null);

//     if (subCategoryFilter === String(selectedDeleteId)) {
//       setSubCategoryFilter("all");
//     }

//     await loadSubCategories(false);
//   } catch (error: any) {
//     console.error("DELETE FRONTEND ERROR:", error);
//     console.error("DELETE RESPONSE:", error.response?.data);
//     console.error("DELETE STATUS:", error.response?.status);

//     toast.error(
//       error.response?.data?.message || "Failed to delete subcategory"
//     );
//   }
// };

//   // header click: toggle direction
//   const handleSort = (key: string) => {
//     let direction: SortDirection = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // dropdown: change field, keep direction
//   const handleSortFieldChange = (key: string) => {
//     setSortConfig((prev) => ({ key, direction: key ? prev.direction : "asc" }));
//     setCurrentPage(1);
//   };

//   const toggleSortDirection = () => {
//     if (!sortConfig.key) return;
//     setSortConfig((prev) => ({
//       ...prev,
//       direction: prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const handleCategoryFilterChange = (value: string) => {
//     setCategoryFilter(value);
//     setSubCategoryFilter("all"); // dependent filter resets
//     setCurrentPage(1);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("all");
//     setSubCategoryFilter("all");
//     setChildrenFilter("all");
//     setImageFilter("all");
//     setSortConfig({ key: "", direction: "asc" });
//     setCurrentPage(1);
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
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   /* =======================================================
//      ACTIVE FILTER CHIPS
//   ======================================================= */
//   const activeFilters: { key: string; label: string; clear: () => void }[] = [];
//   if (categoryFilter !== "all") {
//     const c: any = categories.find((x: any) => String(x.id) === categoryFilter);
//     activeFilters.push({
//       key: "category",
//       label: `Category: ${c?.name ?? categoryFilter}`,
//       clear: () => handleCategoryFilterChange("all"),
//     });
//   }
//   if (subCategoryFilter !== "all") {
//     const s = tableData.find((x) => String(x.id) === subCategoryFilter);
//     activeFilters.push({
//       key: "subcategory",
//       label: `SubCategory: ${s?.name ?? subCategoryFilter}`,
//       clear: () => {
//         setSubCategoryFilter("all");
//         setCurrentPage(1);
//       },
//     });
//   }
//   if (childrenFilter !== "all") {
//     activeFilters.push({
//       key: "children",
//       label: childrenFilter === "with" ? "With children" : "Without children",
//       clear: () => {
//         setChildrenFilter("all");
//         setCurrentPage(1);
//       },
//     });
//   }
//   if (imageFilter !== "all") {
//     activeFilters.push({
//       key: "image",
//       label: imageFilter === "with" ? "With image" : "Without image",
//       clear: () => {
//         setImageFilter("all");
//         setCurrentPage(1);
//       },
//     });
//   }
//   const hasAnyFilter = activeFilters.length > 0 || searchTerm !== "" || sortConfig.key !== "";

//   /* =======================================================
//      STATS
//   ======================================================= */
//   const totalSubCategories = tableData.length;
//   const withChildren = tableData.filter(
//     (s) => s.children?.length > 0
//   ).length;
//   const withImages = tableData.filter((s) => s.imageUrl).length;
//   const totalChildren = tableData.reduce(
//     (acc, s) => acc + (s.children?.length || 0),
//     0
//   );

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
//                 Taxonomy
//               </span>
//             </div>
//             <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
//               SubCategory Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               {totalSubCategories} subcategories · {withChildren} with children
//               · {totalChildren} total child items
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => loadSubCategories()}
//               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               <FaSyncAlt size={11} />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <Link href="/subcategory">
//               <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
//                 <FaPlus size={12} />
//                 <span>New SubCategory</span>
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
//               <FaLayerGroup className="text-slate-400" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalSubCategories}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 With Children
//               </span>
//               <FaSitemap className="text-blue-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {withChildren}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Child Items
//               </span>
//               <FaFolderOpen className="text-purple-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalChildren}
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
//                   placeholder="Search by name, slug, category or child..."
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
//                   {activeFilters.length > 0 && (
//                     <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full bg-blue-600 text-white">
//                       {activeFilters.length}
//                     </span>
//                   )}
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
//                 {/* Category */}
//                 <div>
//                   <label className={filterLabelClass}>Category</label>
//                   <select
//                     className={filterSelectClass}
//                     value={categoryFilter}
//                     onChange={(e) => handleCategoryFilterChange(e.target.value)}
//                   >
//                     <option value="all">All Categories</option>
//                     {categories.map((c: any) => (
//                       <option key={c.id} value={String(c.id)}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* SubCategory (depends on Category) */}
//                 <div>
//                   <label className={filterLabelClass}>SubCategory</label>
//                   <select
//                     className={filterSelectClass}
//                     value={subCategoryFilter}
//                     onChange={(e) => {
//                       setSubCategoryFilter(e.target.value);
//                       setCurrentPage(1);
//                     }}
//                     disabled={subCategoryOptions.length === 0}
//                   >
//                     <option value="all">
//                       {categoryFilter === "all"
//                         ? "All SubCategories"
//                         : `All in ${
//                             (categories.find(
//                               (c: any) => String(c.id) === categoryFilter
//                             ) as any)?.name ?? "category"
//                           }`}
//                     </option>
//                     {subCategoryOptions.map((s) => (
//                       <option key={s.id} value={String(s.id)}>
//                         {categoryFilter === "all" && s.category?.name
//                           ? `${s.name} (${s.category.name})`
//                           : s.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Children */}
//                 <div>
//                   <label className={filterLabelClass}>Children</label>
//                   <select
//                     className={filterSelectClass}
//                     value={childrenFilter}
//                     onChange={(e) => {
//                       setChildrenFilter(e.target.value as TriState);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <option value="all">All</option>
//                     <option value="with">With children</option>
//                     <option value="without">Without children</option>
//                   </select>
//                 </div>

//                 {/* Image */}
//                 <div>
//                   <label className={filterLabelClass}>Image</label>
//                   <select
//                     className={filterSelectClass}
//                     value={imageFilter}
//                     onChange={(e) => {
//                       setImageFilter(e.target.value as TriState);
//                       setCurrentPage(1);
//                     }}
//                   >
//                     <option value="all">All</option>
//                     <option value="with">With image</option>
//                     <option value="without">Without image</option>
//                   </select>
//                 </div>

//                 {/* Sort */}
//                 <div>
//                   <label className={filterLabelClass}>Sort by</label>
//                   <div className="flex gap-2">
//                     <select
//                       className={filterSelectClass}
//                       value={sortConfig.key}
//                       onChange={(e) => handleSortFieldChange(e.target.value)}
//                     >
//                       <option value="">Default</option>
//                       <option value="name">Name</option>
//                       <option value="id">ID</option>
//                       <option value="createdAt">Created</option>
//                     </select>
//                     <button
//                       type="button"
//                       onClick={toggleSortDirection}
//                       disabled={!sortConfig.key}
//                       title={sortConfig.direction === "asc" ? "Ascending" : "Descending"}
//                       className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
//                     >
//                       {sortConfig.direction === "asc" ? (
//                         <FaSortUp size={12} />
//                       ) : (
//                         <FaSortDown size={12} />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="sm:col-span-1 lg:col-span-3 flex items-end">
//                   <button
//                     onClick={resetFilters}
//                     disabled={!hasAnyFilter}
//                     className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Active filter chips + result count */}
//             {(activeFilters.length > 0 || searchTerm) && (
//               <div className="mt-3 flex flex-wrap items-center gap-2">
//                 <span className="text-xs text-slate-500 dark:text-slate-400">
//                   {filteredAndSortedData.length} of {totalSubCategories} results
//                 </span>
//                 {activeFilters.map((f) => (
//                   <span
//                     key={f.key}
//                     className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded"
//                   >
//                     {f.label}
//                     <button
//                       type="button"
//                       onClick={f.clear}
//                       className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded"
//                       aria-label={`Clear ${f.label}`}
//                     >
//                       <FaTimes size={9} />
//                     </button>
//                   </span>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={resetFilters}
//                   className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 underline-offset-2 hover:underline"
//                 >
//                   Clear all
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* -------- TABLE -------- */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[1100px] lg:min-w-full">
//               <Table className="min-w-full">
//                 <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
//                   <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                     <TableCell isHeader className={thClass}>
//                       <button
//                         onClick={() => handleSort("id")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         ID {getSortIcon("id")}
//                       </button>
//                     </TableCell>
//                     <TableCell isHeader className={thClass}>
//                       <button
//                         onClick={() => handleSort("name")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         Name {getSortIcon("name")}
//                       </button>
//                     </TableCell>
//                     <TableCell isHeader className={`${thClass} hidden lg:table-cell`}>
//                       Slug
//                     </TableCell>
//                     <TableCell isHeader className={thClass}>
//                       Category
//                     </TableCell>
//                     <TableCell isHeader className={thClass}>
//                       Children
//                     </TableCell>
//                     <TableCell isHeader className={thClass}>
//                       Image
//                     </TableCell>
//                     <TableCell isHeader className={`${thClass} hidden lg:table-cell`}>
//                       Created
//                     </TableCell>
//                     <TableCell isHeader className={`${thClass} text-right`}>
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
//                         {Array.from({ length: 8 }).map((_, j) => (
//                           <TableCell key={j} className="!py-3 !px-3">
//                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : visibleData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={8}
//                         className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <FaLayerGroup
//                             className="text-slate-300 dark:text-slate-700"
//                             size={32}
//                           />
//                           <div className="font-medium text-slate-700 dark:text-slate-300">
//                             {hasAnyFilter
//                               ? "No subcategories match your filters"
//                               : "No subcategories available"}
//                           </div>
//                           <div className="text-xs">
//                             {hasAnyFilter
//                               ? "Try changing or clearing the filters"
//                               : "Create your first subcategory to get started"}
//                           </div>
//                           {hasAnyFilter && (
//                             <button
//                               onClick={resetFilters}
//                               className="mt-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//                             >
//                               Clear all filters
//                             </button>
//                           )}
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

//                         {/* NAME + DESC */}
//                         <TableCell className="!py-3 !px-3">
//                           <div className="flex flex-col min-w-0">
//                             <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
//                               {item?.name || "—"}
//                             </span>
//                             {item?.description && (
//                               <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
//                                 {item.description.length > 40
//                                   ? item.description.substring(0, 40) + "..."
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

//                         {/* CATEGORY */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.category?.name ? (
//                             <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                               {item.category.name}
//                             </span>
//                           ) : (
//                             <span className="text-slate-300 dark:text-slate-700">
//                               —
//                             </span>
//                           )}
//                         </TableCell>

//                         {/* CHILDREN */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.children?.length > 0 ? (
//                             <div className="flex flex-wrap gap-1 max-w-[220px]">
//                               {item.children.slice(0, 3).map((child: any) => (
//                                 <span
//                                   key={child.id}
//                                   className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded"
//                                 >
//                                   {child.name}
//                                 </span>
//                               ))}
//                               {item.children.length > 3 && (
//                                 <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
//                                   +{item.children.length - 3}
//                                 </span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-slate-300 dark:text-slate-700 text-xs">
//                               none
//                             </span>
//                           )}
//                         </TableCell>

//                         {/* IMAGE */}
//                         <TableCell className="!py-3 !px-3">
//                           {item.imageUrl ? (
//                             <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
//                               <img
//                                 src={item.imageUrl}
//                                 alt={item.name || "image"}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ) : (
//                             <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
//                               <FaImage size={12} />
//                             </div>
//                           )}
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
//                               onClick={() => handleView(item.id)}
//                               className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
//                               title="View"
//                             >
//                               <FaEye size={13} />
//                             </button>
//                             <button
//                               onClick={() => handleEdit(item)}
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

//       {/* =====================================================
//           MODALS
//       ===================================================== */}
//       <ViewSubCategoryModal
//         isOpen={viewModalOpen}
//         onClose={() => setViewModalOpen(false)}
//         data={
//           tableData.find((sub) => sub.id === selectedSubCategoryId) || null
//         }
//       />

//       <EditSubCategoryModal
//         isOpen={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
//       />

//       {/* Delete Modal */}
//       <Modal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         className="max-w-md"
//       >
//         <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
//           <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 mx-auto mb-4">
//             <MdDeleteForever
//               className="text-red-600 dark:text-red-400"
//               size={22}
//             />
//           </div>
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
//             Delete SubCategory
//           </h3>
//           <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
//             Are you sure? This action cannot be undone.
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

// export default SubCategoryTable;


"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubCategories,
  setSelectedSubCategory,
} from "../../redux/productSubCategory";
import Link from "next/link";
import {
  fetchSubCategoryAll,
  deleteSubCategoryById,
} from "../../services/subCategoryService/subCategoryService";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaLayerGroup,
  FaFolderOpen,
  FaImage,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSitemap,
  FaCalendarAlt,
  FaTimes,
  FaFileExcel,
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
import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";
import Pagination from "./Pagination";

/* shared classes */
const thClass =
  "!py-3 !px-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider";
const filterLabelClass =
  "block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";
const filterSelectClass =
  "w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 dark:focus:border-brand-500 disabled:opacity-50 transition";

type SortDirection = "asc" | "desc";
type TriState = "all" | "with" | "without";

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const SubCategoryTable = () => {
  const dispatch = useDispatch();
  const { subCategories } = useSelector(
    (state: RootState) => state.SubCategoryState
  );

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({
    key: "",
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ---- filters ---- */
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [childrenFilter, setChildrenFilter] = useState<TriState>("all");
  const [imageFilter, setImageFilter] = useState<TriState>("all");

  /* =======================================================
     FILTER OPTIONS (dependent: Category -> SubCategory)
  ======================================================= */
  const categories = React.useMemo(() => {
    const unique = Array.from(
      new Map(
        tableData
          .filter((s) => s.category)
          .map((s) => [String(s.category.id), s.category])
      ).values()
    );
    return unique.sort((a: any, b: any) =>
      String(a.name).localeCompare(String(b.name))
    );
  }, [tableData]);

  const subCategoryOptions = React.useMemo(() => {
    const list =
      categoryFilter === "all"
        ? tableData
        : tableData.filter((s) => String(s.category?.id) === categoryFilter);
    return [...list].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
  }, [tableData, categoryFilter]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let filtered = tableData.filter((sub) => {
      if (q) {
        const hit =
          sub.name?.toLowerCase().includes(q) ||
          sub.description?.toLowerCase().includes(q) ||
          sub.slug?.toLowerCase().includes(q) ||
          sub.category?.name?.toLowerCase().includes(q) ||
          sub.children?.some((c: any) => c.name?.toLowerCase().includes(q));
        if (!hit) return false;
      }

      if (
        categoryFilter !== "all" &&
        String(sub.category?.id) !== categoryFilter
      )
        return false;

      if (subCategoryFilter !== "all" && String(sub.id) !== subCategoryFilter)
        return false;

      const childCount = sub.children?.length || 0;
      if (childrenFilter === "with" && childCount === 0) return false;
      if (childrenFilter === "without" && childCount > 0) return false;

      if (imageFilter === "with" && !sub.imageUrl) return false;
      if (imageFilter === "without" && sub.imageUrl) return false;

      return true;
    });

    if (sortConfig.key) {
      const dir = sortConfig.direction === "asc" ? 1 : -1;
      filtered = [...filtered].sort((a, b) => {
        const av = a[sortConfig.key];
        const bv = b[sortConfig.key];
        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "string" && typeof bv === "string") {
          return av.localeCompare(bv, undefined, { sensitivity: "base" }) * dir;
        }
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }
    return filtered;
  }, [
    tableData,
    searchTerm,
    sortConfig,
    categoryFilter,
    subCategoryFilter,
    childrenFilter,
    imageFilter,
  ]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > 1 && currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  /* =======================================================
     FETCH
  ======================================================= */
  const loadSubCategories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const result = await fetchSubCategoryAll();
      dispatch(setSubCategories(result));
    } catch (error) {
      console.error("Failed to load subcategories", error);
      toast.error("Failed to load subcategories");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadSubCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setTableData(subCategories || []);
  }, [subCategories]);

  /* =======================================================
     HANDLERS
  ======================================================= */
  const handleView = (id: number) => {
    setSelectedSubCategoryId(id);
    setViewModalOpen(true);
  };

  const handleEdit = (subCategory: any) => {
    dispatch(setSelectedSubCategory(subCategory));
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId === null) return;

    try {
      await deleteSubCategoryById(selectedDeleteId);
      setDeleteModalOpen(false);
      setSelectedDeleteId(null);

      if (subCategoryFilter === String(selectedDeleteId)) {
        setSubCategoryFilter("all");
      }

      toast.success("Subcategory deleted successfully");
      await loadSubCategories(false);
    } catch (error: any) {
      console.error("DELETE FRONTEND ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    }
  };

  const handleSort = (key: string) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSortFieldChange = (key: string) => {
    setSortConfig((prev) => ({ key, direction: key ? prev.direction : "asc" }));
    setCurrentPage(1);
  };

  const toggleSortDirection = () => {
    if (!sortConfig.key) return;
    setSortConfig((prev) => ({
      ...prev,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setSubCategoryFilter("all");
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSubCategoryFilter("all");
    setChildrenFilter("all");
    setImageFilter("all");
    setSortConfig({ key: "", direction: "asc" });
    setCurrentPage(1);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <FaSort className="text-[10px] text-slate-400 opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-[10px] text-slate-900 dark:text-brand-400" />
    ) : (
      <FaSortDown className="text-[10px] text-slate-900 dark:text-brand-400" />
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =======================================================
     EXPORT FILTERED & SORTED LIST TO EXCEL (.xls)
  ======================================================= */
  const handleExportExcel = () => {
    if (filteredAndSortedData.length === 0) {
      toast.info("No subcategories available to export");
      return;
    }

    const headers = [
      "ID",
      "SubCategory Name",
      "Slug",
      "Parent Category",
      "Description",
      "Children Count",
      "Child Items",
      "Has Image",
      "Image URL",
      "Created Date",
    ];

    const rows = filteredAndSortedData.map((item) => {
      const childNames = Array.isArray(item.children)
        ? item.children.map((c: any) => c.name).filter(Boolean).join(", ")
        : "";

      return [
        `#${String(item.id).padStart(4, "0")}`,
        item.name || "",
        item.slug || "",
        item.category?.name || "",
        item.description || "",
        item.children?.length || 0,
        childNames,
        item.imageUrl ? "Yes" : "No",
        item.imageUrl || "",
        formatDate(item.createdAt),
      ];
    });

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
            const dataType = isNum ? "Number" : "String";
            return `<Cell><Data ss:Type="${dataType}">${escapeXml(
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
  <Worksheet ss:Name="SubCategories">
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

    const activeCategory: any =
      categoryFilter !== "all"
        ? categories.find((c: any) => String(c.id) === categoryFilter)
        : null;
    const filterSlug = activeCategory?.name
      ? `_${String(activeCategory.name)
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`
      : hasAnyFilter
        ? "_filtered"
        : "";
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `subcategories${filterSlug}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${filteredAndSortedData.length} subcategor${
        filteredAndSortedData.length === 1 ? "y" : "ies"
      } to Excel`
    );
  };

  /* =======================================================
     ACTIVE FILTER CHIPS
  ======================================================= */
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (categoryFilter !== "all") {
    const c: any = categories.find(
      (x: any) => String(x.id) === categoryFilter
    );
    activeFilters.push({
      key: "category",
      label: `Category: ${c?.name ?? categoryFilter}`,
      clear: () => handleCategoryFilterChange("all"),
    });
  }
  if (subCategoryFilter !== "all") {
    const s = tableData.find((x) => String(x.id) === subCategoryFilter);
    activeFilters.push({
      key: "subcategory",
      label: `SubCategory: ${s?.name ?? subCategoryFilter}`,
      clear: () => {
        setSubCategoryFilter("all");
        setCurrentPage(1);
      },
    });
  }
  if (childrenFilter !== "all") {
    activeFilters.push({
      key: "children",
      label: childrenFilter === "with" ? "With children" : "Without children",
      clear: () => {
        setChildrenFilter("all");
        setCurrentPage(1);
      },
    });
  }
  if (imageFilter !== "all") {
    activeFilters.push({
      key: "image",
      label: imageFilter === "with" ? "With image" : "Without image",
      clear: () => {
        setImageFilter("all");
        setCurrentPage(1);
      },
    });
  }
  const hasAnyFilter =
    activeFilters.length > 0 || searchTerm !== "" || sortConfig.key !== "";

  /* =======================================================
     STATS
  ======================================================= */
  const totalSubCategories = tableData.length;
  const withChildren = tableData.filter((s) => s.children?.length > 0).length;
  const withImages = tableData.filter((s) => s.imageUrl).length;
  const totalChildren = tableData.reduce(
    (acc, s) => acc + (s.children?.length || 0),
    0
  );

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / Taxonomy
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              SubCategory Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400 sm:text-sm">
              {totalSubCategories} subcategories · {withChildren} with children
              · {totalChildren} total child items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadSubCategories()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <FaSyncAlt className="h-3 w-3 text-slate-400" />
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

            <Link href="/subcategory">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                <FaPlus className="h-3 w-3" />
                <span>New SubCategory</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total
              </span>
              <FaLayerGroup className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {totalSubCategories}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                With Children
              </span>
              <FaSitemap className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {withChildren}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Child Items
              </span>
              <FaFolderOpen className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {totalChildren}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                With Images
              </span>
              <FaImage className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {withImages}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* -------- SEARCH + FILTERS -------- */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, slug, category or child..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
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
                  {activeFilters.length > 0 && (
                    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                      {activeFilters.length}
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
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/60 sm:grid-cols-2 lg:grid-cols-4">
                {/* Category */}
                <div>
                  <label className={filterLabelClass}>Category</label>
                  <select
                    className={filterSelectClass}
                    value={categoryFilter}
                    onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SubCategory (depends on Category) */}
                <div>
                  <label className={filterLabelClass}>SubCategory</label>
                  <select
                    className={filterSelectClass}
                    value={subCategoryFilter}
                    onChange={(e) => {
                      setSubCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    disabled={subCategoryOptions.length === 0}
                  >
                    <option value="all">
                      {categoryFilter === "all"
                        ? "All SubCategories"
                        : `All in ${
                            (
                              categories.find(
                                (c: any) => String(c.id) === categoryFilter
                              ) as any
                            )?.name ?? "category"
                          }`}
                    </option>
                    {subCategoryOptions.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {categoryFilter === "all" && s.category?.name
                          ? `${s.name} (${s.category.name})`
                          : s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Children */}
                <div>
                  <label className={filterLabelClass}>Children</label>
                  <select
                    className={filterSelectClass}
                    value={childrenFilter}
                    onChange={(e) => {
                      setChildrenFilter(e.target.value as TriState);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="with">With children</option>
                    <option value="without">Without children</option>
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className={filterLabelClass}>Image</label>
                  <select
                    className={filterSelectClass}
                    value={imageFilter}
                    onChange={(e) => {
                      setImageFilter(e.target.value as TriState);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="with">With image</option>
                    <option value="without">Without image</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className={filterLabelClass}>Sort by</label>
                  <div className="flex gap-2">
                    <select
                      className={filterSelectClass}
                      value={sortConfig.key}
                      onChange={(e) => handleSortFieldChange(e.target.value)}
                    >
                      <option value="">Default</option>
                      <option value="name">Name</option>
                      <option value="id">ID</option>
                      <option value="createdAt">Created</option>
                    </select>
                    <button
                      type="button"
                      onClick={toggleSortDirection}
                      disabled={!sortConfig.key}
                      title={
                        sortConfig.direction === "asc"
                          ? "Ascending"
                          : "Descending"
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {sortConfig.direction === "asc" ? (
                        <FaSortUp className="h-3 w-3" />
                      ) : (
                        <FaSortDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-end sm:col-span-1 lg:col-span-3">
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

            {/* Active filter chips + result count */}
            {(activeFilters.length > 0 || searchTerm) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  {filteredAndSortedData.length} of {totalSubCategories} results
                </span>
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 py-0.5 pl-2 pr-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {f.label}
                    <button
                      type="button"
                      onClick={f.clear}
                      className="rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
                      aria-label={`Clear ${f.label}`}
                    >
                      <FaTimes className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell isHeader className={thClass}>
                      <button
                        type="button"
                        onClick={() => handleSort("id")}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        ID {getSortIcon("id")}
                      </button>
                    </TableCell>
                    <TableCell isHeader className={thClass}>
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
                      className={`${thClass} hidden lg:table-cell`}
                    >
                      Slug
                    </TableCell>
                    <TableCell isHeader className={thClass}>
                      Category
                    </TableCell>
                    <TableCell isHeader className={thClass}>
                      Children
                    </TableCell>
                    <TableCell isHeader className={thClass}>
                      Image
                    </TableCell>
                    <TableCell
                      isHeader
                      className={`${thClass} hidden lg:table-cell`}
                    >
                      Created
                    </TableCell>
                    <TableCell isHeader className={`${thClass} text-right`}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    Array.from({ length: Math.min(itemsPerPage, 5) }).map(
                      (_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 8 }).map((__, j) => (
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
                        colSpan={8}
                        className="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                          <FaLayerGroup className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {hasAnyFilter
                              ? "No subcategories match your filters"
                              : "No subcategories available"}
                          </div>
                          <div className="text-xs">
                            {hasAnyFilter
                              ? "Try changing or clearing the filters"
                              : "Create your first subcategory to get started"}
                          </div>
                          {hasAnyFilter && (
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((item) => (
                      <TableRow
                        key={item.id}
                        className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        {/* ID */}
                        <TableCell className="!px-4 !py-3.5">
                          <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                            #{String(item.id).padStart(4, "0")}
                          </span>
                        </TableCell>

                        {/* NAME + DESC */}
                        <TableCell className="!px-4 !py-3.5">
                          <div className="flex min-w-0 flex-col">
                            <span className="max-w-[220px] truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item?.name || "—"}
                            </span>
                            {item?.description && (
                              <span className="max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400">
                                {item.description.length > 40
                                  ? item.description.substring(0, 40) + "..."
                                  : item.description}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* SLUG */}
                        <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
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

                        {/* CATEGORY */}
                        <TableCell className="!px-4 !py-3.5">
                          {item.category?.name ? (
                            <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              {item.category.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* CHILDREN */}
                        <TableCell className="!px-4 !py-3.5">
                          {item.children?.length > 0 ? (
                            <div className="flex max-w-[220px] flex-wrap gap-1">
                              {item.children.slice(0, 3).map((child: any) => (
                                <span
                                  key={child.id}
                                  className="inline-flex items-center rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  {child.name}
                                </span>
                              ))}
                              {item.children.length > 3 && (
                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                  +{item.children.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 dark:text-slate-700">
                              none
                            </span>
                          )}
                        </TableCell>

                        {/* IMAGE */}
                        <TableCell className="!px-4 !py-3.5">
                          {item.imageUrl ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                              <img
                                src={item.imageUrl}
                                alt={item.name || "image"}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700">
                              <FaImage className="h-3 w-3" />
                            </div>
                          )}
                        </TableCell>

                        {/* CREATED */}
                        <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 tabular-nums dark:text-slate-400">
                            <FaCalendarAlt className="h-2.5 w-2.5 text-slate-400" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="!px-4 !py-3.5 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleView(item.id)}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                              title="View"
                            >
                              <FaEye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                              title="Edit"
                            >
                              <FaEdit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(item.id)}
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

          {/* -------- PAGINATION -------- */}
          <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          MODALS
      ===================================================== */}
      <ViewSubCategoryModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={
          tableData.find((sub) => sub.id === selectedSubCategoryId) || null
        }
      />

      <EditSubCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="max-w-md"
      >
        <div className="rounded-xl bg-white p-6 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40">
            <MdDeleteForever className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="mb-2 text-center text-base font-semibold text-slate-900 dark:text-slate-100">
            Delete SubCategory
          </h3>
          <p className="mb-6 text-center text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Are you sure? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 sm:text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubCategoryTable;