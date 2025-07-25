"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedProduct,
  setProducts,
  setLoading
} from "@/redux/productSlice";
import { fetchProductAll ,deleteProductById,fetchPaginatedProducts} from "@/services/product/productService";

import ViewProductModal from "../products/ViewProductModal";
import EditProductModal from "../products/EditProductModal";

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
import DeleteProductModal from "../products/DeleteProductModal";
import { toast } from "react-toastify";
const ProductTable = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.product);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
const [editModalOpen, setEditModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
const [totalPages, setTotalPages] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(4);

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
}, [currentPage]);
  const handleView = (product: any) => {
    dispatch(setSelectedProduct(product));
    setViewModalOpen(true);
  };

 
const handleEdit = (product: any) => {
  console.log("Editing product:", product);
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

      toast.success("Product deleted successfully!",);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product.");
    } finally {
      setDeleteModalOpen(false);
      setSelectedProductId(null);
    }
  }
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
            {tableData.map((item) => (
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
  onClick={() => handleDeleteClick(item.id)}
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

<DeleteProductModal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={confirmDeleteProduct}
/>

    </>
  );
};

export default ProductTable;

