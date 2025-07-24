"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedProduct,
  setProducts,
} from "@/redux/productSlice";
import { fetchProductAll } from "@/services/product/productService";
import { deleteCategory } from "@/services/product-category/categoryService";

import ViewProductModal from "../products/ViewProductModal";
import EditProductModal from "../products/EditProductModal"; // ✅ Correct import

import { FaEye, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";

const ProductTable = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.product);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const result = await fetchProductAll();
        dispatch(setProducts(result));
      } catch (error) {
        console.error("Failed to load products", error);
      }
    };
    getProducts();
  }, [dispatch]);

  useEffect(() => {
    setTableData(products || []);
  }, [products]);

  const handleView = (product: any) => {
    dispatch(setSelectedProduct(product));
    setViewModalOpen(true);
  };

 
const handleEdit = (product: any) => {
  console.log("Editing product:", product);
  dispatch(setSelectedProduct(product));
  setEditModalOpen(true);
};


  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await dispatch<any>(deleteCategory(id));
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white shadow-md rounded">
          <TableHead className="bg-gray-100 dark:bg-white/[0.05]">
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Original Price</TableHeadCell>
              <TableHeadCell>Offer (%)</TableHeadCell>
              <TableHeadCell>Final Price</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Url</TableHeadCell>
              <TableHeadCell>Image</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>₹{item.originalPrice}</TableCell>
                <TableCell>{item.offer}%</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.category?.name || "—"}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt="Product"
                      className="w-16 h-auto object-cover rounded"
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    <MdDeleteForever />
                  </button>
                  <button
                    onClick={() => handleView(item)}
                    className="text-green-600 hover:underline"
                  >
                    <FaEye />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-4 px-4 py-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <ViewProductModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />
   <EditProductModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  // product={editProduct}
/>
    </>
  );
};

export default ProductTable;

