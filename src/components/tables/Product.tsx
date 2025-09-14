"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  setSelectedProduct,
  setProducts as setReduxProducts,
  // setProducts,
  setLoading
} from "@/redux/productSlice";
import {
  fetchProductAll, deleteProductById, fetchPaginatedProducts, fetchProductById, toggleProductStatus, updateProductStock
} from "@/services/product/productService";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";
import ViewProductModal from "../products/ViewProductModal";
import EditProductModal from "../products/EditProductModal";
import DeleteProductModal from "../products/DeleteProductModal";
import Pagination from "./Pagination";
import { getPriceDetails } from "@/utils/getPriceDB";
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
export interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  originalPrice: number;
  offer: number;
  finalPrice: number;
  category: {
    id: string;
    name: string;
  };
  url: string;
  shippingAvailable?: boolean;
  warrantyInfo?: string;
  skuCode?: string;
  material?: string;
  returnPolicy?: string;
  manufactureDetails?: string;
  imageUrl: string;
  variants?: Variant[];
  createdAt?: string;
  updatedAt?: string;
}
const ProductTable = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.product);
  const [products, setProducts] = useState<Product[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [categories, setCategories] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [showVariants, setShowVariants] = useState(false);
  const handleToggleActive = async (product: any) => {
    try {
      const data = await toggleProductStatus(product.id);
      setTableData(prev =>
        prev.map(p => (p.id === product.id ? { ...p, isActive: data.isActive } : p))
      );
      toast.success(`Product is now ${data.isActive ? "active" : "inactive"}`);
    } catch (error) {
      toast.error("Error updating status");
    }
  };
  //  const toggleVariants = () => {
  //     setShowVariants((prev) => !prev);
  //   };
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

  useEffect(() => {
    const getProducts = async () => {
      try {
        dispatch(setLoading(true));
        const result = await fetchProductAll();
        console.log("Fetched products:", result);

        dispatch(setReduxProducts(result));


        setTableData(result);


        const uniqueCategories = [
          ...new Set(
            result
              .filter((product: any) => product.category?.name)
              .map((product: any) => product.category.name)
          ),
        ];
        // setCategories(uniqueCategories );
        setCategories(uniqueCategories as string[]);



      } catch (error: any) {
        console.error("Error while processing products:", error);
        toast.error(error?.message || "Failed to load products");
      } finally {
        dispatch(setLoading(false));
      }
    };
    getProducts();
  }, [dispatch]);


  const fetchProducts = async (page: number) => {
    dispatch(setLoading(true));
    try {
      const res = await fetchPaginatedProducts(page, itemsPerPage);
      setTableData(res.products);
      setTotalPages(res.totalPages);
      setTotalItems(res.total); // ✅ Set it here
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, itemsPerPage]);

  // Filter and sort products
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = tableData.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(product =>
        statusFilter === "active" ? product.isActive : !product.isActive
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product =>
        product.category?.name === categoryFilter
      );
    }

    // Apply sorting
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
  }, [tableData, searchTerm, statusFilter, categoryFilter, sortConfig]);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleView = (product: any) => {
    setSelectedProductId(product.id);
    setViewModalOpen(true);
  };

  const handleEdit = async (product: any) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const productData = await fetchProductById(product.id, token);
      console.log("Editing product:", productData);
      dispatch(setSelectedProduct(productData));
      setEditModalOpen(true);
    } catch (error) {
      toast.error("Failed to load product details");
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (selectedProductId !== null) {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      try {
        await deleteProductById(selectedProductId, token);
        const updatedList = await fetchProductAll();
        // dispatch(setProducts(updatedList));
        // dispatch(setProducts(updatedList) as any);
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

  return (
    <div className="bg-white rounded-xl text-white shadow-sm p-4 md:p-6 border border-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white ">
      {/* Header with Search and Controls */}
      <div className="flex flex-col gap-4 mb-6 ">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
          <h1 className="text-2xl font-bold text-gray-800  ">Product Management</h1>
          <Link href="/add-new-product"> <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700  rounded-lg transition-colors">
            <FaPlus size={14} />
            <span>Add Product</span>
          </button></Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-white" />
            </div>
            <input
              type="text"
              placeholder="Search products by name, description or category..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaFilter className="text-gray-600" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">Show:</span>
              <select
                className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
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
        <div className="min-w-[1000px] lg:min-w-full"> {/* Ensure table has minimum width on mobile */}
          <Table className="min-w-full">
            <TableHead className="bg-gray-50 sticky top-0 z-10  dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">
              <TableRow>
                <TableHeadCell
                  className="cursor-pointe dark:text-white"
                // onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-1">
                    ID
                    {sortConfig.key === "id" && (
                      sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
                    )}
                  </div>
                </TableHeadCell>
                <TableHeadCell
                  className="cursor-pointer  dark:text-white"
                // onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig.key === "name" && (
                      sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
                    )}
                  </div>
                </TableHeadCell>
                <TableHeadCell
                  className="cursor-pointer dark:text-white"
                // onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortConfig.key === "price" && (
                      sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
                    )}
                  </div>
                </TableHeadCell>
                <TableHeadCell className="hidden md:table-cell dark:text-white">Offer</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell dark:text-white">Category</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell dark:text-white">Image</TableHeadCell>
                <TableHeadCell className="hidden md:table-cell dark:text-white">Status</TableHeadCell>
                <TableHeadCell className="hidden lg:table-cell dark:text-white">Stock</TableHeadCell>
                <TableHeadCell className="dark:text-white">Actions</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse dark:text-white">
                    <TableCell><div className="h-4 bg-gray-200 rounded dark:text-white"></div></TableCell>
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
                          {item.description.substring(0, 50)}...
                        </span>
                      </div>
                    </TableCell>

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


                    {/* <TableCell>
  {showVariants && item.hasVariants && item.variants?.length > 0 ? (
    (() => {
      const variantSellingPrices = item.variants.map((v: Variant) =>
        v.sellingPrice ? Number(v.sellingPrice) : Number(v.price)
      );
      const variantOriginalPrices = item.variants.map((v: Variant) => Number(v.price));

      const minIndex = variantSellingPrices.indexOf(Math.min(...variantSellingPrices));
      const minSelling = variantSellingPrices[minIndex];
      const originalAtMinSelling = variantOriginalPrices[minIndex];

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{minSelling}
          </span>
          {originalAtMinSelling > minSelling && (
            <span className="text-xs text-gray-500 line-through dark:text-white">
              ₹{originalAtMinSelling}
            </span>
          )}
        </div>
      );
    })()
  ) : (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-900 dark:text-white">
        ₹{Number(item.price)}
      </span>
      {item.originalPrice && Number(item.originalPrice) > Number(item.price) && (
        <span className="text-xs text-gray-500 line-through dark:text-white">
          ₹{item.originalPrice}
        </span>
      )}
    </div>
  )}
</TableCell> */}





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
                            src={item.images[0].imageUrl}
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
                          onClick={() => handleView(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
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
      {/* Modals */}
      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        productId={selectedProductId !== null ? selectedProductId.toString() : null}
      />

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          fetchProducts(currentPage); // Refresh data after editing
        }}
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