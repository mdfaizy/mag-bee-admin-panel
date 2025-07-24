"use client";


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedCategory,
  setCategories,
} from "@/redux/productCategory";
import {
  fetchProductCategory,
  deleteCategory,
} from "@/services/product-category/categoryService";
import ViewCategoryModal from "../productCategory/ViewCategoryModal";
import EditCategoryModal from "../productCategory/EditCategoryModal";
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

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.category);

  // const [tableData, setTableData] = useState<ProductCategory[]>([]);

const [tableData, setTableData] = useState<CategoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const result = await fetchProductCategory();
        dispatch(setCategories(result));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    getCategories();
  }, [dispatch]);

  // Sync Redux -> Local State for Pagination
  useEffect(() => {
    setTableData(categories || []);
  }, [categories]);

  const handleView = (category: any) => {
    dispatch(setSelectedCategory(category));
    setViewModalOpen(true);
  };

  const handleEdit = (category: any) => {
    dispatch(setSelectedCategory(category));
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
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
              <TableHeadCell>Slug</TableHeadCell>
              <TableHeadCell>Image</TableHeadCell>
              <TableHeadCell>Created At</TableHeadCell>
                <TableHeadCell>Updated At</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name || "—"}</TableCell>
                <TableCell>{item.description || "—"}</TableCell>
                <TableCell>{item.slug || "—"}</TableCell>
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
                 <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
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
        <span className="px-2 py-1">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {viewModalOpen && (
        <ViewCategoryModal onClose={() => setViewModalOpen(false)} />
      )}
      {/* {editModalOpen && (
        <EditCategoryModal onClose={() => setEditModalOpen(false)} />
      )}
       */}
       <EditCategoryModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
/>

    </>
  );
};

export default CategoryTable;
