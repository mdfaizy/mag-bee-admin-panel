// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getSocket } from "@/services/lib/socket";
// import { RootState } from "@/redux/store";
// import Link from "next/link";
// import { setProducts as setReduxProducts,setLoading,} from "@/redux/productSlice";
// import { fetchProductAll, deleteProductById, fetchPaginatedProducts,toggleProductStatus,updateProductStock,} from "@/services/product/productService";
// import { toast } from "react-toastify";
// import {
//   FaEye,
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaBox,
//   FaTimes,
//   FaExclamationTriangle,
//   FaTimesCircle,
//   FaCheckCircle,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
// } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import { Table,TableHeader,TableBody, TableRow,TableCell,} from "../ui/table";
// import DeleteProductModal from "../products/DeleteProductModal";
// import Pagination from "./Pagination";
// import { useRouter } from "next/navigation";
// interface VariantAttribute {
//   id?: number;
//   key: string;
//   value: string;
// }
// export interface Variant {
//   id?: number;
//   sku: string;
//   price: number;
//   stock: number;
//   offer: string;
//   sellingPrice?: string;
//   attributes: VariantAttribute[];
// }
// const ProductTable = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loading } = useSelector((state: RootState) => state.product);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [sortConfig, setSortConfig] = useState({ key: "",direction: "asc",});
//   const [categories, setCategories] = useState<any[]>([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all" >("active");
//   const [stockFilter, setStockFilter] = useState<"all" | "lowStock" | "outOfStock" | "allInactive" | "shouldBeOut">("all");

//   const handleToggleActive = async (product: any) => {
//     try {
//       const data = await toggleProductStatus(product.id);
//       fetchProducts(currentPage);
//       toast.success(
//         `Product is now ${data.isActive ? "active" : "inactive"}`
//       );
//     } catch (error) {
//       toast.error("Error updating status");
//     }
//   };

//   const handleStockChange = async (product: any, newStock: number) => {
//     try {
//       await updateProductStock(product.id, newStock);
//       setTableData((prev) =>
//         prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
//       );
//       toast.success("Stock updated!");
//     } catch (error) {
//       toast.error("Error updating stock");
//     }
//   };

//   const fetchProducts = async (page: number) => {
//     dispatch(setLoading(true));
//     try {
//       const res = await fetchPaginatedProducts(page, itemsPerPage);
//       const products = res?.data?.products ?? [];
//       const totalPages = res?.data?.totalPages ?? 1;
//       const totalItems = res?.data?.total ?? 0;
//       setTableData(products);
//       setTotalPages(totalPages);
//       setTotalItems(totalItems);
//       dispatch(setReduxProducts(products));
//     } catch (error: any) {
//       toast.error(error?.message || "Failed to fetch products");
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
//   useEffect(() => {
//     fetchProducts(currentPage);
//   }, [currentPage, itemsPerPage]);
//   const handleSort = (key: string) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };
//   const handleDeleteClick = (id: number) => {
//     setSelectedProductId(id);
//     setDeleteModalOpen(true);
//   };
//   const confirmDeleteProduct = async () => {
//     if (selectedProductId !== null) {
//       try {
//         await deleteProductById(selectedProductId);
//         const updatedList = await fetchProductAll();
//         dispatch(setReduxProducts(updatedList));
//         setTableData(updatedList);
//         toast.success("Product deleted successfully!");
//       } catch (error: any) {
//         toast.error(error.message || "Failed to delete product.");
//       } finally {
//         setDeleteModalOpen(false);
//         setSelectedProductId(null);
//       }
//     }
//   };

//   const calculateTotalVariantStock = (variants: Variant[]): number => {
//     return variants?.reduce(
//       (total, variant) => total + (variant.stock || 0),
//       0
//     );
//   };

//   const resetFilters = () => {
//     setStatusFilter("all");
//     setCategoryFilter("all");
//     setSearchTerm("");
//     setSortConfig({ key: "", direction: "asc" });
//     setStockFilter("all");
//   };

//   useEffect(() => {
//     const uniqueCategories = Array.from(
//       new Map(
//         tableData
//           .filter((p) => p.category)
//           .map((p) => [p.category.id, p.category])
//       ).values()
//     );
//     setCategories(uniqueCategories);
//   }, [tableData]);

//   // const filteredAndSortedData = React.useMemo(() => {
//   //   let filtered = tableData.filter(
//   //     (product) =>
//   //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       product.skuCode?.toLowerCase().includes(searchTerm.toLowerCase())
//   //   );

//   //   if (statusFilter !== "all") {
//   //     filtered = filtered.filter((product) =>
//   //       statusFilter === "active" ? product.isActive : !product.isActive
//   //     );
//   //   }

//   //   if (stockFilter !== "all") {
//   //     filtered = filtered.filter((product) => {
//   //       const totalStock = product.hasVariants
//   //         ? calculateTotalVariantStock(product.variants || [])
//   //         : product.stock || 0;

//   //       if (stockFilter === "outOfStock") return totalStock === 0;
//   //       if (stockFilter === "lowStock") return totalStock > 0 && totalStock < 5;
//   //       if (stockFilter === "shouldBeOut")
//   //         return !product.isActive && totalStock === 0;
//   //       if (stockFilter === "allInactive") return !product.isActive;
//   //       return true;
//   //     });
//   //   }

//   //   if (categoryFilter !== "all") {
//   //     filtered = filtered.filter(
//   //       (product) => product.category?.name === categoryFilter
//   //     );
//   //   }

//   //   if (sortConfig.key) {
//   //     filtered.sort((a, b) => {
//   //       if (a[sortConfig.key] < b[sortConfig.key]) {
//   //         return sortConfig.direction === "asc" ? -1 : 1;
//   //       }
//   //       if (a[sortConfig.key] > b[sortConfig.key]) {
//   //         return sortConfig.direction === "asc" ? 1 : -1;
//   //       }
//   //       return 0;
//   //     });
//   //   }

//   //   return filtered;
//   // }, [
//   //   tableData,
//   //   searchTerm,
//   //   statusFilter,
//   //   stockFilter,
//   //   categoryFilter,
//   //   sortConfig,
//   // ]);


//   const filteredAndSortedData = React.useMemo(() => {
//   const search = searchTerm.toLowerCase();

//   let filtered = tableData.filter((product) => {
//     return (
//       (product.name ?? "").toLowerCase().includes(search) ||
//       (product.description ?? "").toLowerCase().includes(search) ||
//       (product.category?.name ?? "").toLowerCase().includes(search) ||
//       (product.skuCode ?? "").toLowerCase().includes(search)
//     );
//   });

//   // Status filter
//   if (statusFilter !== "all") {
//     filtered = filtered.filter((product) =>
//       statusFilter === "active" ? product.isActive : !product.isActive
//     );
//   }

//   // Stock filter
//   if (stockFilter !== "all") {
//     filtered = filtered.filter((product) => {
//       const totalStock = product.hasVariants
//         ? calculateTotalVariantStock(product.variants || [])
//         : product.stock || 0;

//       if (stockFilter === "outOfStock") return totalStock === 0;

//       if (stockFilter === "lowStock")
//         return totalStock > 0 && totalStock < 5;

//       if (stockFilter === "shouldBeOut")
//         return !product.isActive && totalStock === 0;

//       if (stockFilter === "allInactive") return !product.isActive;

//       return true;
//     });
//   }

//   // Category filter
//   if (categoryFilter !== "all") {
//     filtered = filtered.filter(
//       (product) => product.category?.name === categoryFilter
//     );
//   }

//   // Sorting
//   if (sortConfig.key) {
//     filtered.sort((a, b) => {
//       const aValue = a[sortConfig.key] ?? "";
//       const bValue = b[sortConfig.key] ?? "";

//       if (aValue < bValue) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }

//       if (aValue > bValue) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }

//       return 0;
//     });
//   }

//   return filtered;
// }, [
//   tableData,
//   searchTerm,
//   statusFilter,
//   stockFilter,
//   categoryFilter,
//   sortConfig,
// ]);

//   useEffect(() => {
//     const socket = getSocket();

//     const handleProductCreated = (data: any) => {
//       fetchProducts(currentPage);
//       toast.info("New product added");
//     };

//     const handleStatusUpdate = (data: any) => {
//       fetchProducts(currentPage);
//     };

//     socket.on("product_created", handleProductCreated);
//     socket.on("product_status_updated", handleStatusUpdate);

//     return () => {
//       socket.off("product_created", handleProductCreated);
//       socket.off("product_status_updated", handleStatusUpdate);
//     };
//   }, []);

//   const totalProducts = tableData.length;
//   const lowStockProducts = tableData.filter((product) => {
//     const totalStock = product.hasVariants
//       ? calculateTotalVariantStock(product.variants || [])
//       : product.stock || 0;
//     return totalStock > 0 && totalStock < 5;
//   }).length;
//   const activeProducts = tableData.filter((product) => product.isActive).length;
//   const inactiveProducts = tableData.filter(
//     (product) => !product.isActive
//   ).length;

//   const getSortIcon = (key: string) => {
//     if (sortConfig.key !== key)
//       return <FaSort className="text-gray-400 text-[10px] opacity-50" />;
//     return sortConfig.direction === "asc" ? (
//       <FaSortUp className="text-blue-600 text-[10px]" />
//     ) : (
//       <FaSortDown className="text-blue-600 text-[10px]" />
//     );
//   };

//   if (loading && tableData.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-950">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
//           <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//             Loading products...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
//         {/* ============ HEADER ============ */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
//               Product Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               {totalItems.toLocaleString()} total products ·{" "}
//               {activeProducts} active · {lowStockProducts} low stock
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => fetchProducts(currentPage)}
//               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 />
//               </svg>
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <Link href="/add-new-product">
//               <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
//                 <FaPlus size={12} />
//                 <span>New Product</span>
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
//               <FaBox className="text-slate-400" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {totalProducts}
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
//               {activeProducts}
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
//               {inactiveProducts}
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//                 Low Stock
//               </span>
//               <FaExclamationTriangle className="text-amber-500" size={14} />
//             </div>
//             <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//               {lowStockProducts}
//             </div>
//           </div>
//         </div>

//         {/* ============ MAIN PANEL ============ */}
//         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
//           {/* -------- TABS + TOOLBAR -------- */}
//           <div className="border-b border-slate-200 dark:border-slate-800">
//             {/* Tabs */}
//             <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
//               {[
//                 {
//                   key: "all",
//                   label: "All",
//                   count: totalProducts,
//                   icon: FaBox,
//                 },
//                 {
//                   key: "active",
//                   label: "Active",
//                   count: activeProducts,
//                   icon: FaCheckCircle,
//                 },
//                 {
//                   key: "inactive",
//                   label: "Inactive",
//                   count: inactiveProducts,
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
//                       setStockFilter(
//                         tab.key === "inactive" ? "allInactive" : "all"
//                       );
//                     }}
//                     className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
//                       active
//                         ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
//                         : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                     }`}
//                   >
//                     <Icon size={12} />
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

//             {/* Sub-filters for stock */}
//             {(statusFilter === "active" || statusFilter === "inactive") && (
//               <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
//                 {statusFilter === "active" && (
//                   <>
//                     {[
//                       { key: "all", label: "All Stock", count: totalProducts },
//                       {
//                         key: "lowStock",
//                         label: "Low Stock",
//                         count: lowStockProducts,
//                         warn: true,
//                       },
//                       { key: "outOfStock", label: "Out of Stock", danger: true },
//                     ].map((f) => (
//                       <button
//                         key={f.key}
//                         onClick={() => setStockFilter(f.key as any)}
//                         className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
//                           stockFilter === f.key
//                             ? f.danger
//                               ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
//                               : f.warn
//                               ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400"
//                               : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
//                             : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
//                         }`}
//                       >
//                         {f.label}
//                         {f.count !== undefined && (
//                           <span className="tabular-nums opacity-70">
//                             {f.count}
//                           </span>
//                         )}
//                       </button>
//                     ))}
//                   </>
//                 )}

//                 {statusFilter === "inactive" && (
//                   <>
//                     {[
//                       {
//                         key: "allInactive",
//                         label: "All Inactive",
//                         count: inactiveProducts,
//                       },
//                       { key: "shouldBeOut", label: "Should be Out", danger: true },
//                     ].map((f) => (
//                       <button
//                         key={f.key}
//                         onClick={() => setStockFilter(f.key as any)}
//                         className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
//                           stockFilter === f.key
//                             ? f.danger
//                               ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
//                               : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
//                             : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
//                         }`}
//                       >
//                         {f.label}
//                         {f.count !== undefined && (
//                           <span className="tabular-nums opacity-70">
//                             {f.count}
//                           </span>
//                         )}
//                       </button>
//                     ))}
//                   </>
//                 )}
//               </div>
//             )}
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
//                   placeholder="Search by name, SKU, category..."
//                   className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
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
//                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
//                     onChange={(e) =>
//                       setStatusFilter(e.target.value as any)
//                     }
//                   >
//                     <option value="all">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
//                     Category
//                   </label>
//                   <select
//                     className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                   >
//                     <option value="all">All Categories</option>
//                     {categories.map((category) => (
//                       <option key={category.id} value={category.name}>
//                         {category.name}
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
//                     <option value="price">Price</option>
//                     <option value="id">ID</option>
//                   </select>
//                 </div>

//                 <div className="flex items-end">
//                   <button
//                     onClick={resetFilters}
//                     className="w-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//                   >
//                     Reset
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
//                       Product
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       SKU
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       <button
//                         onClick={() => handleSort("price")}
//                         className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
//                       >
//                         Price {getSortIcon("price")}
//                       </button>
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                     >
//                       Offer
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
//                     >
//                       Category
//                     </TableCell>
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
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
//                       Stock
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
//                         {Array.from({ length: 10 }).map((_, j) => (
//                           <TableCell key={j} className="!py-3 !px-3">
//                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : filteredAndSortedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={10}
//                         className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <FaBox className="text-slate-300 dark:text-slate-700" size={32} />
//                           <div className="font-medium text-slate-700 dark:text-slate-300">
//                             No products found
//                           </div>
//                           <div className="text-xs">
//                             Try adjusting your search or filters
//                           </div>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredAndSortedData.map((item) => {
//                       const totalStock = item.hasVariants
//                         ? calculateTotalVariantStock(item.variants)
//                         : item.stock || 0;
//                       const isLowStock = totalStock > 0 && totalStock < 5;
//                       const isOutOfStock = totalStock === 0;

//                       return (
//                         <TableRow
//                           key={item.id}
//                           className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
//                         >
//                           <TableCell className="!py-3 !px-3">
//                             <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
//                               #{String(item.id).padStart(4, "0")}
//                             </span>
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3">
//                             <div className="flex flex-col min-w-0">
//                               <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
//                                 {item.name}
//                               </span>
//                               <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
//                                 {item?.description?.substring(0, 40)}
//                                 {item?.description?.length > 40 ? "..." : ""}
//                               </span>
//                             </div>
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3">
//                             <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                               {item.skuCode || "—"}
//                             </code>
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3">
//                             {item.hasVariants && item.variants?.length > 0 ? (
//                               (() => {
//                                 const sp = item.variants.map(
//                                   (v: Variant) =>
//                                     v.sellingPrice
//                                       ? parseFloat(v.sellingPrice)
//                                       : v.price
//                                 );
//                                 const op = item.variants.map(
//                                   (v: Variant) => v.price
//                                 );
//                                 const minIdx = sp.indexOf(Math.min(...sp));
//                                 const minSell = sp[minIdx];
//                                 const origAtMin = op[minIdx];
//                                 return (
//                                   <div className="flex flex-col">
//                                     <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
//                                       ₹{minSell.toLocaleString()}
//                                     </span>
//                                     {origAtMin > minSell && (
//                                       <span className="text-[11px] text-slate-400 line-through tabular-nums">
//                                         ₹{origAtMin.toLocaleString()}
//                                       </span>
//                                     )}
//                                   </div>
//                                 );
//                               })()
//                             ) : (
//                               <div className="flex flex-col">
//                                 <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
//                                   ₹{Number(item.price || 0).toLocaleString()}
//                                 </span>
//                                 {item.originalPrice &&
//                                   item.originalPrice > item.price && (
//                                     <span className="text-[11px] text-slate-400 line-through tabular-nums">
//                                       ₹
//                                       {Number(
//                                         item.originalPrice
//                                       ).toLocaleString()}
//                                     </span>
//                                   )}
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3">
//                             {item.hasVariants && item.variants?.length > 0 ? (
//                               <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded">
//                                 {Math.max(
//                                   ...item.variants.map((v: any) =>
//                                     parseFloat(v.offer || "0")
//                                   )
//                                 )}
//                                 % OFF
//                               </span>
//                             ) : item.offer ? (
//                               <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded">
//                                 {item.offer}% OFF
//                               </span>
//                             ) : (
//                               <span className="text-slate-300 dark:text-slate-700">
//                                 —
//                               </span>
//                             )}
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3 hidden lg:table-cell">
//                             {item.category?.name ? (
//                               <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
//                                 {item.category.name}
//                               </span>
//                             ) : (
//                               <span className="text-slate-300 dark:text-slate-700">
//                                 —
//                               </span>
//                             )}
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3 hidden lg:table-cell">
//                             {item.images && item.images.length > 0 ? (
//                               <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
//                                 <Image
//                                   src={
//                                     item.images?.[0]?.imageUrl
//                                       ? encodeURI(item.images[0].imageUrl)
//                                       : "/no-image.png"
//                                   }
//                                   alt={item.name}
//                                   fill
//                                   className="object-cover"
//                                 />
//                               </div>
//                             ) : (
//                               <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
//                                 <FaBox size={12} />
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3">
//                             <button
//                               onClick={() => handleToggleActive(item)}
//                               className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
//                                 item.isActive
//                                   ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
//                                   : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
//                               }`}
//                             >
//                               <span
//                                 className={`w-1.5 h-1.5 rounded-full ${
//                                   item.isActive
//                                     ? "bg-emerald-500"
//                                     : "bg-slate-400"
//                                 }`}
//                               />
//                               {item.isActive ? "Active" : "Inactive"}
//                             </button>
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3 hidden lg:table-cell">
//                             {!item.hasVariants ? (
//                               <div className="inline-flex items-center gap-1.5">
//                                 <input
//                                   type="number"
//                                   min="0"
//                                   className={`w-16 px-2 py-1 text-xs text-center font-mono tabular-nums bg-white dark:bg-slate-950 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
//                                     isOutOfStock
//                                       ? "border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
//                                       : isLowStock
//                                       ? "border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
//                                       : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
//                                   }`}
//                                   value={item.stock || 0}
//                                   onChange={(e) =>
//                                     handleStockChange(
//                                       item,
//                                       Number(e.target.value)
//                                     )
//                                   }
//                                 />
//                               </div>
//                             ) : (
//                               <div className="inline-flex items-center gap-1.5">
//                                 <span
//                                   className={`px-2 py-1 text-xs font-mono tabular-nums rounded border ${
//                                     isOutOfStock
//                                       ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
//                                       : isLowStock
//                                       ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900"
//                                       : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
//                                   }`}
//                                 >
//                                   {totalStock}
//                                 </span>
//                                 <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">
//                                   var
//                                 </span>
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell className="!py-3 !px-3 text-right">
//                             <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
//                               <button
//                                 onClick={() =>
//                                   router.push(`/view-product/${item.id}`)
//                                 }
//                                 className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
//                                 title="View"
//                               >
//                                 <FaEye size={13} />
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   router.push(`/edit-product/${item.id}`)
//                                 }
//                                 className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
//                                 title="Edit"
//                               >
//                                 <FaEdit size={13} />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteClick(item.id)}
//                                 className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
//                                 title="Delete"
//                               >
//                                 <MdDeleteForever size={15} />
//                               </button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
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
//               totalItems={totalItems}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </div>
//       </div>

//       <DeleteProductModal
//         isOpen={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirm={confirmDeleteProduct}
//       />
//     </div>
//   );
// };

// export default ProductTable;


"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "@/services/lib/socket";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  setProducts as setReduxProducts,
  setLoading,
} from "@/redux/productSlice";
import {
  fetchProductAll,
  deleteProductById,
  fetchPaginatedProducts,
  toggleProductStatus,
  updateProductStock,
} from "@/services/product/productService";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaBox,
  FaTimes,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
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
import DeleteProductModal from "../products/DeleteProductModal";
import LoadingState from "@/components/common/LoadingState";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";

interface VariantAttribute {
  id?: number;
  key: string;
  value: string;
}

export interface Variant {
  id?: number;
  sku: string;
  price: number;
  stock: number;
  offer: string;
  sellingPrice?: string;
  attributes: VariantAttribute[];
}

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const ProductTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.product);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [categories, setCategories] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "active" | "inactive" | "all"
  >("active");
  const [stockFilter, setStockFilter] = useState<
    "all" | "lowStock" | "outOfStock" | "allInactive" | "shouldBeOut"
  >("all");

  const handleToggleActive = async (product: any) => {
    try {
      const data = await toggleProductStatus(product.id);
      fetchProducts(currentPage);
      toast.success(
        `Product is now ${data.isActive ? "active" : "inactive"}`
      );
    } catch {
      toast.error("Error updating status");
    }
  };

  const handleStockChange = async (product: any, newStock: number) => {
    try {
      await updateProductStock(product.id, newStock);
      setTableData((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      );
      toast.success("Stock updated!");
    } catch {
      toast.error("Error updating stock");
    }
  };

  const fetchProducts = async (page: number) => {
    dispatch(setLoading(true));
    try {
      const res = await fetchPaginatedProducts(page, itemsPerPage);
      const products = res?.data?.products ?? [];
      const fetchedTotalPages = res?.data?.totalPages ?? 1;
      const fetchedTotalItems = res?.data?.total ?? 0;
      setTableData(products);
      setTotalPages(fetchedTotalPages);
      setTotalItems(fetchedTotalItems);
      dispatch(setReduxProducts(products));
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (selectedProductId !== null) {
      try {
        await deleteProductById(selectedProductId);
        const updatedList = await fetchProductAll();
        dispatch(setReduxProducts(updatedList));
        setTableData(updatedList);
        toast.success("Product deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product.");
      } finally {
        setDeleteModalOpen(false);
        setSelectedProductId(null);
      }
    }
  };

  const calculateTotalVariantStock = (variants: Variant[]): number => {
    return variants?.reduce(
      (total, variant) => total + (variant.stock || 0),
      0
    );
  };

  const getProductPricingSummary = (item: any) => {
    if (item.hasVariants && item.variants?.length > 0) {
      const sp = item.variants.map((v: Variant) =>
        v.sellingPrice ? parseFloat(v.sellingPrice) : v.price
      );
      const op = item.variants.map((v: Variant) => v.price);
      const minSell = Math.min(...sp);
      const minIdx = sp.indexOf(minSell);
      const origAtMin = op[minIdx];
      const maxOffer = Math.max(
        ...item.variants.map((v: any) => parseFloat(v.offer || "0"))
      );
      return {
        sellingPrice: Number.isFinite(minSell) ? minSell : 0,
        originalPrice: Number.isFinite(origAtMin) ? origAtMin : 0,
        offer: Number.isFinite(maxOffer) && maxOffer > 0 ? `${maxOffer}% OFF` : "—",
      };
    }

    const sellingPrice = Number(item.price || 0);
    const originalPrice = Number(item.originalPrice || 0);
    return {
      sellingPrice,
      originalPrice: originalPrice > sellingPrice ? originalPrice : sellingPrice,
      offer: item.offer ? `${item.offer}% OFF` : "—",
    };
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchTerm("");
    setSortConfig({ key: "", direction: "asc" });
    setStockFilter("all");
    setCurrentPage(1);
  };

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Map(
        tableData
          .filter((p) => p.category)
          .map((p) => [p.category.id, p.category])
      ).values()
    );
    setCategories(uniqueCategories);
  }, [tableData]);

  const filteredAndSortedData = React.useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    let filtered = tableData.filter((product) => {
      if (!search) return true;
      return (
        (product.name ?? "").toLowerCase().includes(search) ||
        (product.description ?? "").toLowerCase().includes(search) ||
        (product.category?.name ?? "").toLowerCase().includes(search) ||
        (product.skuCode ?? "").toLowerCase().includes(search)
      );
    });

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) =>
        statusFilter === "active" ? product.isActive : !product.isActive
      );
    }

    if (stockFilter !== "all") {
      filtered = filtered.filter((product) => {
        const totalStock = product.hasVariants
          ? calculateTotalVariantStock(product.variants || [])
          : product.stock || 0;

        if (stockFilter === "outOfStock") return totalStock === 0;
        if (stockFilter === "lowStock") return totalStock > 0 && totalStock < 5;
        if (stockFilter === "shouldBeOut")
          return !product.isActive && totalStock === 0;
        if (stockFilter === "allInactive") return !product.isActive;
        return true;
      });
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category?.name === categoryFilter
      );
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [
    tableData,
    searchTerm,
    statusFilter,
    stockFilter,
    categoryFilter,
    sortConfig,
  ]);

  /* =======================================================
     EXPORT FILTERED PRODUCTS TO EXCEL (.xls)
  ======================================================= */
  const handleExportExcel = () => {
    if (filteredAndSortedData.length === 0) {
      toast.info("No products available to export");
      return;
    }

    const headers = [
      "ID",
      "Product Name",
      "SKU",
      "Category",
      "Selling Price (INR)",
      "Original Price (INR)",
      "Offer",
      "Status",
      "Total Stock",
      "Stock Type",
      "Description",
    ];

    const rows = filteredAndSortedData.map((item) => {
      const totalStock = item.hasVariants
        ? calculateTotalVariantStock(item.variants || [])
        : item.stock || 0;
      const pricing = getProductPricingSummary(item);

      return [
        `#${String(item.id).padStart(4, "0")}`,
        item.name || "",
        item.skuCode || "—",
        item.category?.name || "Uncategorized",
        pricing.sellingPrice,
        pricing.originalPrice,
        pricing.offer,
        item.isActive ? "Active" : "Inactive",
        totalStock,
        item.hasVariants ? "Variants" : "Single",
        item.description || "",
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
  <Worksheet ss:Name="Products">
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

    const activeSlug =
      categoryFilter !== "all"
        ? `_${categoryFilter.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
        : statusFilter !== "all" || stockFilter !== "all" || searchTerm.trim()
          ? "_filtered"
          : "";
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `products${activeSlug}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(
      `Exported ${filteredAndSortedData.length} product(s) to Excel`
    );
  };

  useEffect(() => {
    const socket = getSocket();

    const handleProductCreated = () => {
      fetchProducts(currentPage);
      toast.info("New product added");
    };

    const handleStatusUpdate = () => {
      fetchProducts(currentPage);
    };

    socket.on("product_created", handleProductCreated);
    socket.on("product_status_updated", handleStatusUpdate);

    return () => {
      socket.off("product_created", handleProductCreated);
      socket.off("product_status_updated", handleStatusUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalProducts = tableData.length;
  const lowStockProducts = tableData.filter((product) => {
    const totalStock = product.hasVariants
      ? calculateTotalVariantStock(product.variants || [])
      : product.stock || 0;
    return totalStock > 0 && totalStock < 5;
  }).length;
  const activeProducts = tableData.filter((product) => product.isActive).length;
  const inactiveProducts = tableData.filter(
    (product) => !product.isActive
  ).length;

  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (statusFilter !== "all") {
    activeFilters.push({
      key: "status",
      label: `Status: ${statusFilter === "active" ? "Active" : "Inactive"}`,
      clear: () => {
        setStatusFilter("all");
        setStockFilter("all");
      },
    });
  }
  if (stockFilter !== "all") {
    activeFilters.push({
      key: "stock",
      label: `Stock: ${stockFilter}`,
      clear: () => setStockFilter("all"),
    });
  }
  if (categoryFilter !== "all") {
    activeFilters.push({
      key: "category",
      label: `Category: ${categoryFilter}`,
      clear: () => setCategoryFilter("all"),
    });
  }
  const hasAnyFilter =
    activeFilters.length > 0 ||
    searchTerm.trim() !== "" ||
    sortConfig.key !== "";

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

  if (loading && tableData.length === 0) {
    return (
      <LoadingState
        variant="page"
        label="Loading products..."
        className="min-h-[320px]"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / Products
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Product Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400 sm:text-sm">
              {totalItems.toLocaleString()} total products · {activeProducts}{" "}
              active · {lowStockProducts} low stock
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchProducts(currentPage)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
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

            <Link href="/add-new-product">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                <FaPlus className="h-3 w-3" />
                <span>New Product</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <FaBox className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {totalProducts}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Active
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-emerald-500 dark:bg-slate-800 dark:text-emerald-400">
                <FaCheckCircle className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {activeProducts}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Inactive
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <FaTimesCircle className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {inactiveProducts}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Low Stock
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-amber-500 dark:bg-slate-800 dark:text-amber-400">
                <FaExclamationTriangle className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {lowStockProducts}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* -------- TABS + SUB-FILTERS -------- */}
          <div className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-1 overflow-x-auto px-3 pt-2">
              {[
                {
                  key: "all",
                  label: "All",
                  count: totalProducts,
                  icon: FaBox,
                },
                {
                  key: "active",
                  label: "Active",
                  count: activeProducts,
                  icon: FaCheckCircle,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: inactiveProducts,
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
                      setStockFilter(
                        tab.key === "inactive" ? "allInactive" : "all"
                      );
                    }}
                    className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                        active
                          ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-white"
                          : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {(statusFilter === "active" || statusFilter === "inactive") && (
              <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-200/80 bg-white/70 px-3.5 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                {statusFilter === "active" &&
                  [
                    { key: "all", label: "All Stock", count: totalProducts },
                    {
                      key: "lowStock",
                      label: "Low Stock",
                      count: lowStockProducts,
                      warn: true,
                    },
                    { key: "outOfStock", label: "Out of Stock", danger: true },
                  ].map((f: any) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setStockFilter(f.key)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                        stockFilter === f.key
                          ? f.danger
                            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                            : f.warn
                              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
                              : "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{f.label}</span>
                      {f.count !== undefined && (
                        <span className="opacity-75 tabular-nums">
                          {f.count}
                        </span>
                      )}
                    </button>
                  ))}

                {statusFilter === "inactive" &&
                  [
                    {
                      key: "allInactive",
                      label: "All Inactive",
                      count: inactiveProducts,
                    },
                    {
                      key: "shouldBeOut",
                      label: "Should be Out",
                      danger: true,
                    },
                  ].map((f: any) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setStockFilter(f.key)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                        stockFilter === f.key
                          ? f.danger
                            ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                            : "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{f.label}</span>
                      {f.count !== undefined && (
                        <span className="opacity-75 tabular-nums">
                          {f.count}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* -------- SEARCH + FILTERS -------- */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, SKU, category..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
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
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
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
                    <option value="price">Price</option>
                    <option value="id">ID</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {(activeFilters.length > 0 || searchTerm.trim()) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                  {filteredAndSortedData.length} of {totalProducts} shown
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
                      Product
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      <button
                        type="button"
                        onClick={() => handleSort("price")}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Price {getSortIcon("price")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Offer
                    </TableCell>
                    <TableCell
                      isHeader
                      className="hidden !px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell"
                    >
                      Category
                    </TableCell>
                    <TableCell
                      isHeader
                      className="hidden !px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell"
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
                      className="hidden !px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 lg:table-cell"
                    >
                      Stock
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
                    <LoadingState variant="table" rows={5} columns={10} />
                  ) : filteredAndSortedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                          <FaBox className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {hasAnyFilter
                              ? "No products match your filters"
                              : "No products found"}
                          </div>
                          <div className="text-xs">
                            {hasAnyFilter
                              ? "Try adjusting or clearing your filters"
                              : "Add a product to get started"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedData.map((item) => {
                      const totalStock = item.hasVariants
                        ? calculateTotalVariantStock(item.variants)
                        : item.stock || 0;
                      const isLowStock = totalStock > 0 && totalStock < 5;
                      const isOutOfStock = totalStock === 0;
                      const pricing = getProductPricingSummary(item);

                      return (
                        <TableRow
                          key={item.id}
                          className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          <TableCell className="!px-4 !py-3.5">
                            <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                              #{String(item.id).padStart(4, "0")}
                            </span>
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5">
                            <div className="flex min-w-0 flex-col">
                              <span className="max-w-[220px] truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                {item.name}
                              </span>
                              <span className="max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400">
                                {item?.description?.substring(0, 40)}
                                {item?.description?.length > 40 ? "..." : ""}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5">
                            <code className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                              {item.skuCode || "—"}
                            </code>
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                                ₹{pricing.sellingPrice.toLocaleString()}
                              </span>
                              {pricing.originalPrice >
                                pricing.sellingPrice && (
                                <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                  ₹{pricing.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5">
                            {pricing.offer !== "—" ? (
                              <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
                                {pricing.offer}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">
                                —
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
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

                          <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
                            {item.images && item.images.length > 0 ? (
                              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                                <Image
                                  src={
                                    item.images?.[0]?.imageUrl
                                      ? encodeURI(item.images[0].imageUrl)
                                      : "/no-image.png"
                                  }
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-700">
                                <FaBox className="h-3 w-3" />
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(item)}
                              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                                item.isActive
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  item.isActive
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {item.isActive ? "Active" : "Inactive"}
                            </button>
                          </TableCell>

                          <TableCell className="hidden !px-4 !py-3.5 lg:table-cell">
                            {!item.hasVariants ? (
                              <input
                                type="number"
                                min="0"
                                className={`w-16 rounded border bg-white px-2 py-1 text-center font-mono text-xs tabular-nums focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:bg-slate-950 dark:focus:border-brand-500 ${
                                  isOutOfStock
                                    ? "border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400"
                                    : isLowStock
                                      ? "border-amber-200 text-amber-600 dark:border-amber-900 dark:text-amber-400"
                                      : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                                }`}
                                value={item.stock || 0}
                                onChange={(e) =>
                                  handleStockChange(item, Number(e.target.value))
                                }
                              />
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <span
                                  className={`rounded border px-2 py-1 font-mono text-xs tabular-nums ${
                                    isOutOfStock
                                      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                                      : isLowStock
                                        ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
                                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  }`}
                                >
                                  {totalStock}
                                </span>
                                <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500">
                                  var
                                </span>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="!px-4 !py-3.5 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/view-product/${item.id}`)
                                }
                                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                title="View"
                              >
                                <FaEye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/edit-product/${item.id}`)
                                }
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
                      );
                    })
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
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
};

export default ProductTable;