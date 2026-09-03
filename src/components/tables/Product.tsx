"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "@/services/lib/socket";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  // setSelectedProduct,
  setProducts as setReduxProducts,
  // setProducts,
  setLoading
} from "@/redux/productSlice";
import {
  fetchProductAll, deleteProductById, fetchPaginatedProducts, fetchProductById, toggleProductStatus, updateProductStock
} from "@/services/product/productService";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus, FaBox, FaTimes, FaExclamationTriangle, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table, TableHeader, TableBody, TableRow, TableCell
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
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  // const [categories, setCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [stockFilter, setStockFilter] = useState<"all" | "lowStock" | "outOfStock" | "allInactive" | "shouldBeOut">("all");


  // const handleToggleActive = async (product: any) => {
  //   try {
  //     const data = await toggleProductStatus(product.id);
  //     setTableData(prev =>
  //       prev.map(p => (p.id === product.id ? { ...p, isActive: data.isActive } : p))
  //     );
  //     toast.success(`Product is now ${data.isActive ? "active" : "inactive"}`);
  //   } catch (error) {
  //     toast.error("Error updating status");
  //   }
  // };

  const handleToggleActive = async (product: any) => {
  try {
    const data = await toggleProductStatus(product.id);

    fetchProducts(currentPage); // refresh table

    toast.success(`Product is now ${data.isActive ? "active" : "inactive"}`);
  } catch (error) {
    toast.error("Error updating status");
  }
};

  const handleStockChange = async (product: any, newStock: number) => {
    try {
      await updateProductStock(product.id, newStock);
      setTableData(prev =>
        prev.map(p => (p.id === product.id ? { ...p, stock: newStock } : p))
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
    return variants?.reduce((total, variant) => total + (variant.stock || 0), 0);
  };


  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchTerm("");
    setSortConfig({ key: "", direction: "asc" });
  };

useEffect(() => {
  const uniqueCategories = Array.from(
    new Map(
      tableData
        .filter(p => p.category)
        .map(p => [p.category.id, p.category])
    ).values()
  );

  setCategories(uniqueCategories);
}, [tableData]);

  const filteredAndSortedData = React.useMemo(() => {
    let filtered = tableData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.skuCode?.toLowerCase().includes()
  
    );

    // ✅ Apply status filter (sirf ek baar)
    if (statusFilter !== "all") {
      filtered = filtered.filter(product =>
        statusFilter === "active" ? product.isActive : !product.isActive
      );
    }

    // ✅ Apply stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter(product => {
        const totalStock = product.hasVariants
          ? calculateTotalVariantStock(product.variants || [])
          : product.stock || 0;

        if (stockFilter === "outOfStock") return totalStock === 0;
        if (stockFilter === "lowStock") return totalStock > 0 && totalStock < 5;
        if (stockFilter === "shouldBeOut") return !product.isActive && totalStock === 0;
        if (stockFilter === "allInactive") return !product.isActive;
        return true;
      });
    }

    // ✅ Apply category filter
    console.log(categories);
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product =>
        product.category?.name === categoryFilter
      );
    }

    // ✅ Apply sorting
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
  }, [tableData, searchTerm, statusFilter, stockFilter, categoryFilter, sortConfig]);

// useEffect(() => {
//   const socket = getSocket();

//   socket.on("product_created", (data) => {
//     console.log("🔥 New product:", data);

//     // ✅ realtime refresh
//     fetchProducts(currentPage);

//     toast.info("🆕 New product added");
//   });
  

//   return () => {
//     socket.off("product_created");
//   };
// }, [currentPage]);

useEffect(() => {
  const socket = getSocket();

  const handleProductCreated = (data: any) => {
    console.log("🔥 New product:", data);

    fetchProducts(currentPage);
    toast.info("🆕 New product added");
  };

  const handleStatusUpdate = (data: any) => {
    console.log("⚡ Product status updated:", data);

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
  const lowStockProducts = tableData.filter(product => {
    const totalStock = product.hasVariants
      ? calculateTotalVariantStock(product.variants || [])
      : product.stock || 0;
    return totalStock > 0 && totalStock < 5;
  }).length;
  const activeProducts = tableData.filter(product => product.isActive).length;
  const inactiveProducts = tableData.filter(product => !product.isActive).length;
  if (loading && tableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // <div className=" bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white ">
    <div className="w-full max-w-none bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        <h1 className="text-2xl font-bold text-gray-800  ">Product Management</h1>
        <Link href="/add-new-product"> <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700  rounded-lg transition-colors">
          <FaPlus size={14} />
          <span>Add Product</span>
        </button></Link>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">


          <div className="flex gap-2 border-b border-gray-300">
            <button
              className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "all"
                ? "bg-blue-500 text-white shadow-md border-b-4 border-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => {
                setStatusFilter("all");
                setStockFilter("all");
              }}
            >
              <FaBox className="mr-2" />
              All ({totalProducts})
            </button>
            <button
              className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "active"
                ? "bg-green-500 text-white shadow-md border-b-4 border-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => { setStatusFilter("active"); setStockFilter("all"); }}
            >
              <FaCheckCircle className="mr-2" />
              Active ({activeProducts})
            </button>
            <button
              className={`flex items-center px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${statusFilter === "inactive"
                ? "bg-red-500 text-white shadow-md border-b-4 border-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              onClick={() => { setStatusFilter("inactive"); setStockFilter("allInactive"); }}
            >
              <FaTimesCircle className="mr-2" />
              Inactive ({inactiveProducts})
            </button>
          </div>


          <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-b-lg rounded-tr-lg border border-t-0 border-gray-200">
            {statusFilter === "active" && (
              <>
                <button
                  className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "all"
                    ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                    }`}
                  onClick={() => setStockFilter("all")}
                >
                  <FaBox className="mr-2" />
                  All Stock ({totalProducts})
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "lowStock"
                    ? "bg-yellow-500 text-white shadow-sm border-2 border-yellow-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-yellow-50"
                    }`}
                  onClick={() => setStockFilter("lowStock")}
                >
                  <FaExclamationTriangle className="mr-2" />
                  Low Stock ({lowStockProducts})
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "outOfStock"
                    ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                    }`}
                  onClick={() => setStockFilter("outOfStock")}
                >
                  <FaTimes className="mr-2" />
                  Out Of Stock
                </button>
              </>
            )}

            {statusFilter === "inactive" && (
              <>
                <button
                  className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "allInactive"
                    ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                    }`}
                  onClick={() => setStockFilter("allInactive")}
                >
                  <FaBox className="mr-2" />
                  All Inactive ({inactiveProducts})
                </button>
                <button
                  className={`flex items-center px-3 py-2 rounded font-medium transition-all duration-200 ${stockFilter === "shouldBeOut"
                    ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                    }`}
                  onClick={() => setStockFilter("shouldBeOut")}
                >
                  <FaTimes className="mr-2" />
                  Should be Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-6 ">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-white" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, description or category..."
              className="pl-10 pr-4 py-2.5 text-black w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 text-black dar:text-white bg-slate-1000 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaFilter className="text-black " />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">Show:</span>
              <select
                className="border text-black dar:text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mt-2 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border text-black dar:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as | "active" | "inactive")}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border text-black dar:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {/* {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))} */}
                {categories.map((category) => (
  <option key={category.id} value={category.name}>
    {category.name}
  </option>
))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Product Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:text-white">
        <div className="min-w-[1000px] lg:min-w-full">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 sticky top-0 z-10 dark:border-gray-800 dark:bg-gray-900 dark:text-white">
              <TableRow>
                <TableCell isHeader className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    ID
                    {sortConfig.key === "id" &&
                      (sortConfig.direction === "asc"
                        ? <FaChevronUp size={10} />
                        : <FaChevronDown size={10} />)}
                  </div>
                </TableCell>

                <TableCell isHeader className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Name
                  </div>
                </TableCell>
<TableCell isHeader className="hidden md:table-cell">Sku-Code</TableCell>
                <TableCell isHeader className="cursor-pointer">
                  <div className="flex items-center gap-1">
                    Price
                    {sortConfig.key === "price" &&
                      (sortConfig.direction === "asc"
                        ? <FaChevronUp size={10} />
                        : <FaChevronDown size={10} />)}
                  </div>
                </TableCell>
      
                <TableCell isHeader className="hidden md:table-cell">Offer</TableCell>
                <TableCell isHeader className="hidden lg:table-cell">Category</TableCell>
                <TableCell isHeader className="hidden lg:table-cell">Image</TableCell>
                <TableCell isHeader className="hidden md:table-cell">Status</TableCell>
                <TableCell isHeader className="hidden lg:table-cell">Stock</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse dark:text-white">
                    <TableCell><div className="h-4 bg-gray-200 rounded dark:text-white"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-10 w-10 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-6 w-12 bg-gray-200 rounded-full"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-8 w-16 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-8 w-24 bg-gray-200 rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500">
                    No products found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((item) => (

                  <TableRow key={item.id} className="hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-500 dark:text-white even:bg-gray-50/30">
                    <TableCell className="font-medium dark:text-white">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-xs text-gray-500 truncate max-w-xs dark:text-white">
                          {item?.description?.substring(0, 30)}...
                        </span>
                      </div>
                    </TableCell>
                     <TableCell className="font-medium dark:text-white">{item.skuCode}</TableCell>
                    <TableCell>


                      {item.hasVariants && item.variants?.length > 0 ? (
                        (() => {
                          const variantSellingPrices = item.variants.map((v: Variant) =>
                            v.sellingPrice ? parseFloat(v.sellingPrice) : v.price
                          );
                          const variantOriginalPrices = item.variants.map((v: Variant) => v.price);

                          const minIndex = variantSellingPrices.indexOf(Math.min(...variantSellingPrices));

                          const minSelling = variantSellingPrices[minIndex];
                          const originalPriceAtMinSelling = variantOriginalPrices[minIndex];

                          return (
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-white">
                                ₹{minSelling}
                              </span>
                              {originalPriceAtMinSelling > minSelling && (
                                <span className="text-xs text-gray-500 line-through dark:text-white">
                                  ₹{originalPriceAtMinSelling}
                                </span>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-white">₹{item.price}</span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through dark:text-white">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.hasVariants && item.variants?.length > 0 ? (
                        <span className="px-2 py-1 bg-green-100 dark:bg-gray-600 dark:text-white text-green-800 text-xs font-medium rounded-full">
                          {
                            Math.max(...item.variants.map((v: any) => parseFloat(v.offer || "0")))
                          }% OFF
                        </span>
                      ) : item.offer ? (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-gray-600 dark:text-white text-blue-800 text-xs font-medium rounded-full">
                          {item.offer}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {item.category?.name ? (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {item.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-white">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {item.images && item.images.length > 0 ? (
                        <div className="relative w-12 h-12">
                          <Image
                            // src={item.images[0].imageUrl}
                            src={
  item.images?.[0]?.imageUrl
    ? encodeURI(item.images[0].imageUrl)
    : "/no-image.png"
}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div
                        onClick={() => handleToggleActive(item)}
                        className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-colors ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div
                          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${item.isActive ? 'translate-x-6' : ''}`}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      {!item.hasVariants ? (
                        <input
                          type="number"
                          min="0"
                          className="w-16 border rounded-md px-2 py-1 text-center text-sm dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={item.stock || 0}
                          onChange={(e) => handleStockChange(item, Number(e.target.value))}
                        />
                      ) : (
                        // If product has variants, show total stock or nothing
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-32 border rounded-md px-4 py-1">
                          {calculateTotalVariantStock(item.variants)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/view-product/${item.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/edit-product/${item.id}`)}

                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <MdDeleteForever size={18} />
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
      <DeleteProductModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
};

export default ProductTable;