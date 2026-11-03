// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getSocket } from "@/services/lib/socket";
// import { RootState } from "@/redux/store";
// import Link from "next/link";
// import {
//   // setSelectedProduct,
//   setProducts as setReduxProducts,
//   // setProducts,
//   setLoading
// } from "@/redux/productSlice";
// import {
//   fetchProductAll, deleteProductById, fetchPaginatedProducts, fetchProductById, toggleProductStatus, updateProductStock
// } from "@/services/product/productService";
// import { toast } from "react-toastify";
// import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus, FaBox, FaTimes, FaExclamationTriangle, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import {
//   Table, TableHeader, TableBody, TableRow, TableCell
// } from "../ui/table";

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
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
//   // const [categories, setCategories] = useState<string[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
//   const [stockFilter, setStockFilter] = useState<"all" | "lowStock" | "outOfStock" | "allInactive" | "shouldBeOut">("all");
//   const handleToggleActive = async (product: any) => {
//   try {
//     const data = await toggleProductStatus(product.id);

//     fetchProducts(currentPage); // refresh table

//     toast.success(`Product is now ${data.isActive ? "active" : "inactive"}`);
//   } catch (error) {
//     toast.error("Error updating status");
//   }
// };

//   const handleStockChange = async (product: any, newStock: number) => {
//     try {
//       await updateProductStock(product.id, newStock);
//       setTableData(prev =>
//         prev.map(p => (p.id === product.id ? { ...p, stock: newStock } : p))
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
//     return variants?.reduce((total, variant) => total + (variant.stock || 0), 0);
//   };
//   // Reset filters
//   const resetFilters = () => {
//     setStatusFilter("all");
//     setCategoryFilter("all");
//     setSearchTerm("");
//     setSortConfig({ key: "", direction: "asc" });
//   };

// useEffect(() => {
//   const uniqueCategories = Array.from(
//     new Map(
//       tableData
//         .filter(p => p.category)
//         .map(p => [p.category.id, p.category])
//     ).values()
//   );

//   setCategories(uniqueCategories);
// }, [tableData]);

//   const filteredAndSortedData = React.useMemo(() => {
//     let filtered = tableData.filter(product =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.skuCode?.toLowerCase().includes()
  
//     );

//     // ✅ Apply status filter (sirf ek baar)
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(product =>
//         statusFilter === "active" ? product.isActive : !product.isActive
//       );
//     }

//     // ✅ Apply stock filter
//     if (stockFilter !== "all") {
//       filtered = filtered.filter(product => {
//         const totalStock = product.hasVariants
//           ? calculateTotalVariantStock(product.variants || [])
//           : product.stock || 0;

//         if (stockFilter === "outOfStock") return totalStock === 0;
//         if (stockFilter === "lowStock") return totalStock > 0 && totalStock < 5;
//         if (stockFilter === "shouldBeOut") return !product.isActive && totalStock === 0;
//         if (stockFilter === "allInactive") return !product.isActive;
//         return true;
//       });
//     }

//     // ✅ Apply category filter
//     console.log(categories);
//     if (categoryFilter !== "all") {
//       filtered = filtered.filter(product =>
//         product.category?.name === categoryFilter
//       );
//     }

//     // ✅ Apply sorting
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
//   }, [tableData, searchTerm, statusFilter, stockFilter, categoryFilter, sortConfig]);

// useEffect(() => {
//   const socket = getSocket();

//   const handleProductCreated = (data: any) => {
//     console.log("🔥 New product:", data);

//     fetchProducts(currentPage);
//     toast.info("🆕 New product added");
//   };

//   const handleStatusUpdate = (data: any) => {
//     console.log("⚡ Product status updated:", data);

//     fetchProducts(currentPage);
//   };

//   socket.on("product_created", handleProductCreated);
//   socket.on("product_status_updated", handleStatusUpdate);

//   return () => {
//     socket.off("product_created", handleProductCreated);
//     socket.off("product_status_updated", handleStatusUpdate);
//   };
// }, []);
//   const totalProducts = tableData.length;
//   const lowStockProducts = tableData.filter(product => {
//     const totalStock = product.hasVariants
//       ? calculateTotalVariantStock(product.variants || [])
//       : product.stock || 0;
//     return totalStock > 0 && totalStock < 5;
//   }).length;
//   const activeProducts = tableData.filter(product => product.isActive).length;
//   const inactiveProducts = tableData.filter(product => !product.isActive).length;
//   if (loading && tableData.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     // <div className=" bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white ">
//     <div className="w-full max-w-none bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
//         <h1 className="text-2xl font-bold text-gray-800  ">Product Management</h1>
//         <Link href="/add-new-product"> <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700  rounded-lg transition-colors">
//           <FaPlus size={14} />
//           <span>Add Product</span>
//         </button></Link>
//       </div>
//       <div className="p-4">
//         <div className="flex flex-col gap-2">


//           <div className="flex gap-2 border-b border-gray-300">
//             <button
//               className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "all"
//                 ? "bg-blue-500 text-white shadow-md border-b-4 border-blue-700"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               onClick={() => {
//                 setStatusFilter("all");
//                 setStockFilter("all");
//               }}
//             >
//               <FaBox className="mr-2" />
//               All ({totalProducts})
//             </button>
//             <button
//               className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "active"
//                 ? "bg-green-500 text-white shadow-md border-b-4 border-green-700"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               onClick={() => { setStatusFilter("active"); setStockFilter("all"); }}
//             >
//               <FaCheckCircle className="mr-2" />
//               Active ({activeProducts})
//             </button>
//             <button
//               className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "inactive"
//                 ? "bg-red-500 text-white shadow-md border-b-4 border-red-700"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               onClick={() => { setStatusFilter("inactive"); setStockFilter("allInactive"); }}
//             >
//               <FaTimesCircle className="mr-2" />
//               Inactive ({inactiveProducts})
//             </button>
//           </div>


//           <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-b-lg rounded-tr-lg border border-t-0 border-gray-200">
//             {statusFilter === "active" && (
//               <>
//                 <button
//                   className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "all"
//                     ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
//                     }`}
//                   onClick={() => setStockFilter("all")}
//                 >
//                   <FaBox className="mr-2" />
//                   All Stock ({totalProducts})
//                 </button>
//                 <button
//                   className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "lowStock"
//                     ? "bg-yellow-500 text-white shadow-sm border-2 border-yellow-700"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-yellow-50"
//                     }`}
//                   onClick={() => setStockFilter("lowStock")}
//                 >
//                   <FaExclamationTriangle className="mr-2" />
//                   Low Stock ({lowStockProducts})
//                 </button>
//                 <button
//                   className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "outOfStock"
//                     ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
//                     }`}
//                   onClick={() => setStockFilter("outOfStock")}
//                 >
//                   <FaTimes className="mr-2" />
//                   Out Of Stock
//                 </button>
//               </>
//             )}

//             {statusFilter === "inactive" && (
//               <>
//                 <button
//                   className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "allInactive"
//                     ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
//                     }`}
//                   onClick={() => setStockFilter("allInactive")}
//                 >
//                   <FaBox className="mr-2" />
//                   All Inactive ({inactiveProducts})
//                 </button>
//                 <button
//                   className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "shouldBeOut"
//                     ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
//                     }`}
//                   onClick={() => setStockFilter("shouldBeOut")}
//                 >
//                   <FaTimes className="mr-2" />
//                   Should be Out
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col gap-4 mb-6 ">
//         <div className="flex flex-col md:flex-row gap-4 justify-between">
//           <div className="relative flex-1 max-w-2xl">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400 dark:text-white" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search products by name, description or category..."
//               className="pl-10 pr-4 py-2.5 text-black w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2.5 text-black dar:text-white bg-slate-1000 hover:bg-gray-200 rounded-lg transition-colors"
//             >
//               <FaFilter className="text-black " />
//               <span className="hidden sm:inline">Filters</span>
//               {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//             </button>

//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600 hidden md:inline">Show:</span>
//               <select
//                 className="border text-black dar:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               >
//                 <option value="5">5</option>
//                 <option value="10">10</option>
//                 <option value="20">20</option>
//                 <option value="50">50</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Expandable Filters */}
//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mt-2 ">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 className="w-full border text-black dar:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as | "active" | "inactive")}
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>

//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//               <select
//                 className="w-full border text-black dar:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//               >
//                 <option value="all">All Categories</option>
//                 {/* {categories.map((category, index) => (
//                   <option key={index} value={category}>{category}</option>
//                 ))} */}
//                 {categories.map((category) => (
//   <option key={category.id} value={category.name}>
//     {category.name}
//   </option>
// ))}
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={resetFilters}
//                 className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* Product Table Container with Horizontal Scroll */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 dark:text-white">
//         <div className="min-w-[1000px] lg:min-w-full">
//           <Table className="min-w-full">
//             <TableHeader className="bg-gray-50 sticky top-0 z-10 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
//               <TableRow>
//                 <TableCell isHeader className="cursor-pointer">
//                   <div className="flex items-center gap-1">
//                     ID
//                     {sortConfig.key === "id" &&
//                       (sortConfig.direction === "asc"
//                         ? <FaChevronUp size={10} />
//                         : <FaChevronDown size={10} />)}
//                   </div>
//                 </TableCell>

//                 <TableCell isHeader className="cursor-pointer">
//                   <div className="flex items-center gap-1">
//                     Name
//                   </div>
//                 </TableCell>
// <TableCell isHeader className="hidden md:table-cell">Sku-Code</TableCell>
//                 <TableCell isHeader className="cursor-pointer">
//                   <div className="flex items-center gap-1">
//                     Price
//                     {sortConfig.key === "price" &&
//                       (sortConfig.direction === "asc"
//                         ? <FaChevronUp size={10} />
//                         : <FaChevronDown size={10} />)}
//                   </div>
//                 </TableCell>
      
//                 <TableCell isHeader className="hidden md:table-cell">Offer</TableCell>
//                 <TableCell isHeader className="hidden lg:table-cell">Category</TableCell>
//                 <TableCell isHeader className="hidden lg:table-cell">Image</TableCell>
//                 <TableCell isHeader className="hidden md:table-cell">Status</TableCell>
//                 <TableCell isHeader className="hidden lg:table-cell">Stock</TableCell>
//                 <TableCell isHeader>Actions</TableCell>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading ? (
//                 Array.from({ length: itemsPerPage }).map((_, index) => (
//                   <TableRow key={index} className="animate-pulse dark:text-white">
//                     <TableCell><div className="h-4 bg-gray-200 rounded dark:text-white"></div></TableCell>
//                     <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden md:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden lg:table-cell"><div className="h-10 w-10 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden md:table-cell"><div className="h-6 w-12 bg-gray-200 rounded-full"></div></TableCell>
//                     <TableCell className="hidden lg:table-cell"><div className="h-8 w-16 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-8 w-24 bg-gray-200 rounded"></div></TableCell>
//                   </TableRow>
//                 ))
//               ) : filteredAndSortedData.length === 0 ? (
//                 <TableRow>
//                   <TableCell className="text-center py-8 text-gray-500">
//                     No products found. Try adjusting your search or filters.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredAndSortedData.map((item) => (

//                   <TableRow key={item.id} className="hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-500 dark:text-white even:bg-gray-50/30">
//                     <TableCell className="font-medium dark:text-white">{item.id}</TableCell>
//                     <TableCell>
//                       <div className="flex flex-col">
//                         <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
//                         <span className="text-xs text-gray-500 truncate max-w-xs dark:text-white">
//                           {item?.description?.substring(0, 30)}...
//                         </span>
//                       </div>
//                     </TableCell>
//                      <TableCell className="font-medium dark:text-white">{item.skuCode}</TableCell>
//                     <TableCell>


//                       {item.hasVariants && item.variants?.length > 0 ? (
//                         (() => {
//                           const variantSellingPrices = item.variants.map((v: Variant) =>
//                             v.sellingPrice ? parseFloat(v.sellingPrice) : v.price
//                           );
//                           const variantOriginalPrices = item.variants.map((v: Variant) => v.price);

//                           const minIndex = variantSellingPrices.indexOf(Math.min(...variantSellingPrices));

//                           const minSelling = variantSellingPrices[minIndex];
//                           const originalPriceAtMinSelling = variantOriginalPrices[minIndex];

//                           return (
//                             <div className="flex flex-col">
//                               <span className="font-semibold text-gray-900 dark:text-white">
//                                 ₹{minSelling}
//                               </span>
//                               {originalPriceAtMinSelling > minSelling && (
//                                 <span className="text-xs text-gray-500 line-through dark:text-white">
//                                   ₹{originalPriceAtMinSelling}
//                                 </span>
//                               )}
//                             </div>
//                           );
//                         })()
//                       ) : (
//                         <div className="flex flex-col">
//                           <span className="font-semibold text-gray-900 dark:text-white">₹{item.price}</span>
//                           {item.originalPrice && item.originalPrice > item.price && (
//                             <span className="text-xs text-gray-500 line-through dark:text-white">
//                               ₹{item.originalPrice}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       {item.hasVariants && item.variants?.length > 0 ? (
//                         <span className="px-2 py-1 bg-green-100 dark:bg-gray-600 dark:text-white text-green-800 text-xs font-medium rounded-full">
//                           {
//                             Math.max(...item.variants.map((v: any) => parseFloat(v.offer || "0")))
//                           }% OFF
//                         </span>
//                       ) : item.offer ? (
//                         <span className="px-2 py-1 bg-blue-100 dark:bg-gray-600 dark:text-white text-blue-800 text-xs font-medium rounded-full">
//                           {item.offer}% OFF
//                         </span>
//                       ) : (
//                         <span className="text-gray-400">—</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="hidden lg:table-cell">
//                       {item.category?.name ? (
//                         <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
//                           {item.category.name}
//                         </span>
//                       ) : (
//                         <span className="text-gray-400 dark:text-white">—</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="hidden lg:table-cell">
//                       {item.images && item.images.length > 0 ? (
//                         <div className="relative w-12 h-12">
//                           <Image
//                             // src={item.images[0].imageUrl}
//                             src={
//   item.images?.[0]?.imageUrl
//     ? encodeURI(item.images[0].imageUrl)
//     : "/no-image.png"
// }
//                             alt={item.name}
//                             fill
//                             className="object-cover rounded-md"
//                           />
//                         </div>
//                       ) : (
//                         <span className="text-gray-400">—</span>
//                       )}
//                     </TableCell>

//                     <TableCell className="hidden md:table-cell">
//                       <div
//                         onClick={() => handleToggleActive(item)}
//                         className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-colors ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
//                       >
//                         <div
//                           className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${item.isActive ? 'translate-x-6' : ''}`}
//                         />
//                       </div>
//                     </TableCell>

//                     <TableCell className="hidden lg:table-cell">
//                       {!item.hasVariants ? (
//                         <input
//                           type="number"
//                           min="0"
//                           className="w-16 border rounded-md px-2 py-1 text-center text-sm dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
//                           value={item.stock || 0}
//                           onChange={(e) => handleStockChange(item, Number(e.target.value))}
//                         />
//                       ) : (
//                         // If product has variants, show total stock or nothing
//                         <span className="text-sm text-gray-600 dark:text-gray-300 w-32 border rounded-md px-4 py-1">
//                           {calculateTotalVariantStock(item.variants)}
//                         </span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => router.push(`/view-product/${item.id}`)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                           title="View"
//                         >
//                           <FaEye size={16} />
//                         </button>
//                         <button
//                           onClick={() => router.push(`/edit-product/${item.id}`)}

//                           className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
//                           title="Edit"
//                         >
//                           <FaEdit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteClick(item.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                           title="Delete"
//                         >
//                           <MdDeleteForever size={18} />
//                         </button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         itemsPerPage={itemsPerPage}
//         totalItems={totalItems}
//         onPageChange={setCurrentPage}
//       />
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
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
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
    } catch (error) {
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
    } catch (error) {
      toast.error("Error updating stock");
    }
  };

  const fetchProducts = async (page: number) => {
    dispatch(setLoading(true));
    try {
      const res = await fetchPaginatedProducts(page, itemsPerPage);
      const products = res?.data?.products ?? [];
      const totalPages = res?.data?.totalPages ?? 1;
      const totalItems = res?.data?.total ?? 0;

      setTableData(products);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
      dispatch(setReduxProducts(products));
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
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

  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchTerm("");
    setSortConfig({ key: "", direction: "asc" });
    setStockFilter("all");
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
    let filtered = tableData.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.skuCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  useEffect(() => {
    const socket = getSocket();

    const handleProductCreated = (data: any) => {
      fetchProducts(currentPage);
      toast.info("New product added");
    };

    const handleStatusUpdate = (data: any) => {
      fetchProducts(currentPage);
    };

    socket.on("product_created", handleProductCreated);
    socket.on("product_status_updated", handleStatusUpdate);

    return () => {
      socket.off("product_created", handleProductCreated);
      socket.off("product_status_updated", handleStatusUpdate);
    };
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

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <FaSort className="text-gray-400 text-[10px] opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600 text-[10px]" />
    ) : (
      <FaSortDown className="text-blue-600 text-[10px]" />
    );
  };

  if (loading && tableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Loading products...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            {/* <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Catalog
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Inventory
              </span>
            </div> */}
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalItems.toLocaleString()} total products ·{" "}
              {activeProducts} active · {lowStockProducts} low stock
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchProducts(currentPage)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link href="/add-new-product">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                <FaPlus size={12} />
                <span>New Product</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <FaBox className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalProducts}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active
              </span>
              <FaCheckCircle className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeProducts}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Inactive
              </span>
              <FaTimesCircle className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {inactiveProducts}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Low Stock
              </span>
              <FaExclamationTriangle className="text-amber-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {lowStockProducts}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- TABS + TOOLBAR -------- */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            {/* Tabs */}
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
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
                    onClick={() => {
                      setStatusFilter(tab.key as any);
                      setStockFilter(
                        tab.key === "inactive" ? "allInactive" : "all"
                      );
                    }}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
                      active
                        ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon size={12} />
                    {tab.label}
                    <span
                      className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded ${
                        active
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sub-filters for stock */}
            {(statusFilter === "active" || statusFilter === "inactive") && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
                {statusFilter === "active" && (
                  <>
                    {[
                      { key: "all", label: "All Stock", count: totalProducts },
                      {
                        key: "lowStock",
                        label: "Low Stock",
                        count: lowStockProducts,
                        warn: true,
                      },
                      { key: "outOfStock", label: "Out of Stock", danger: true },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setStockFilter(f.key as any)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                          stockFilter === f.key
                            ? f.danger
                              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
                              : f.warn
                              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400"
                              : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {f.label}
                        {f.count !== undefined && (
                          <span className="tabular-nums opacity-70">
                            {f.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}

                {statusFilter === "inactive" && (
                  <>
                    {[
                      {
                        key: "allInactive",
                        label: "All Inactive",
                        count: inactiveProducts,
                      },
                      { key: "shouldBeOut", label: "Should be Out", danger: true },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setStockFilter(f.key as any)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                          stockFilter === f.key
                            ? f.danger
                              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400"
                              : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {f.label}
                        {f.count !== undefined && (
                          <span className="tabular-nums opacity-70">
                            {f.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* -------- SEARCH + FILTERS -------- */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Search by name, SKU, category..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as any)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                    <option value="price">Price</option>
                    <option value="id">ID</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] lg:min-w-full">
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
                      Product
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      SKU
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort("price")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Price {getSortIcon("price")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Offer
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Category
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Image
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Stock
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
                        {Array.from({ length: 10 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredAndSortedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FaBox className="text-slate-300 dark:text-slate-700" size={32} />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            No products found
                          </div>
                          <div className="text-xs">
                            Try adjusting your search or filters
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

                      return (
                        <TableRow
                          key={item.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <TableCell className="!py-3 !px-3">
                            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                              #{String(item.id).padStart(4, "0")}
                            </span>
                          </TableCell>

                          <TableCell className="!py-3 !px-3">
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                                {item.name}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                                {item?.description?.substring(0, 40)}
                                {item?.description?.length > 40 ? "..." : ""}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="!py-3 !px-3">
                            <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                              {item.skuCode || "—"}
                            </code>
                          </TableCell>

                          <TableCell className="!py-3 !px-3">
                            {item.hasVariants && item.variants?.length > 0 ? (
                              (() => {
                                const sp = item.variants.map(
                                  (v: Variant) =>
                                    v.sellingPrice
                                      ? parseFloat(v.sellingPrice)
                                      : v.price
                                );
                                const op = item.variants.map(
                                  (v: Variant) => v.price
                                );
                                const minIdx = sp.indexOf(Math.min(...sp));
                                const minSell = sp[minIdx];
                                const origAtMin = op[minIdx];
                                return (
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                                      ₹{minSell.toLocaleString()}
                                    </span>
                                    {origAtMin > minSell && (
                                      <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                        ₹{origAtMin.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                                  ₹{Number(item.price || 0).toLocaleString()}
                                </span>
                                {item.originalPrice &&
                                  item.originalPrice > item.price && (
                                    <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                      ₹
                                      {Number(
                                        item.originalPrice
                                      ).toLocaleString()}
                                    </span>
                                  )}
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="!py-3 !px-3">
                            {item.hasVariants && item.variants?.length > 0 ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 rounded">
                                {Math.max(
                                  ...item.variants.map((v: any) =>
                                    parseFloat(v.offer || "0")
                                  )
                                )}
                                % OFF
                              </span>
                            ) : item.offer ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded">
                                {item.offer}% OFF
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">
                                —
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                            {item.category?.name ? (
                              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                                {item.category.name}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">
                                —
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                            {item.images && item.images.length > 0 ? (
                              <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
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
                              <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                <FaBox size={12} />
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="!py-3 !px-3">
                            <button
                              onClick={() => handleToggleActive(item)}
                              className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded border transition-colors ${
                                item.isActive
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
                                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isActive
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {item.isActive ? "Active" : "Inactive"}
                            </button>
                          </TableCell>

                          <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                            {!item.hasVariants ? (
                              <div className="inline-flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="0"
                                  className={`w-16 px-2 py-1 text-xs text-center font-mono tabular-nums bg-white dark:bg-slate-950 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                    isOutOfStock
                                      ? "border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
                                      : isLowStock
                                      ? "border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400"
                                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                  }`}
                                  value={item.stock || 0}
                                  onChange={(e) =>
                                    handleStockChange(
                                      item,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-1 text-xs font-mono tabular-nums rounded border ${
                                    isOutOfStock
                                      ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900"
                                      : isLowStock
                                      ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  {totalStock}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">
                                  var
                                </span>
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="!py-3 !px-3 text-right">
                            <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  router.push(`/view-product/${item.id}`)
                                }
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                                title="View"
                              >
                                <FaEye size={13} />
                              </button>
                              <button
                                onClick={() =>
                                  router.push(`/edit-product/${item.id}`)
                                }
                                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                                title="Edit"
                              >
                                <FaEdit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item.id)}
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                                title="Delete"
                              >
                                <MdDeleteForever size={15} />
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
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
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