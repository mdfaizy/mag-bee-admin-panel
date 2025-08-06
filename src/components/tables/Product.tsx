"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedProduct,
  setProducts,
  setLoading
} from "@/redux/productSlice";
import { fetchProductAll, deleteProductById, fetchPaginatedProducts } from "@/services/product/productService";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaSearch } from "react-icons/fa";
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

const ProductTable = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: RootState) => state.product);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        dispatch(setLoading(true));
        const result = await fetchProductAll();
        dispatch(setProducts(result));
        setTableData(result);
      } catch (error) {
        toast.error("Failed to load products");
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
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, itemsPerPage]);

  const filteredData = tableData.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (product: any) => {
    dispatch(setSelectedProduct(product));
    setViewModalOpen(true);
  };

  const handleEdit = (product: any) => {
    dispatch(setSelectedProduct(product));
    setEditModalOpen(true);
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
        dispatch(setProducts(updatedList));
        toast.success("Product deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product.");
      } finally {
        setDeleteModalOpen(false);
        setSelectedProductId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm"
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

      {/* Product Table */}
      <div className="overflow-x-auto ">
    
        <Table className="min-w-full">
          <TableHead className="bg-gray-50">
            <TableRow>
             
              <TableHeadCell className="w-20 sticky left-0 bg-gray-50 z-20">ID</TableHeadCell>
<TableHeadCell className="min-w-[200px] sticky left-20 bg-gray-50 z-20">Name</TableHeadCell>
              <TableHeadCell className="hidden md:table-cell">Description</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell className="hidden md:table-cell">Offer</TableHeadCell>
              <TableHeadCell className="hidden lg:table-cell">Category</TableHeadCell>
              <TableHeadCell className="hidden lg:table-cell">Image</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="animate-pulse flex justify-center">
                    <div className="h-8 w-8 bg-blue-200 rounded-full"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-xs">
                    {item.description || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.offer ? `${item.offer}%` : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.category?.name || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Product"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "—"
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

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} products
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
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