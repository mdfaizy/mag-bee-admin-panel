"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import EditVariantModal from "./EditVariantModal";
import axios from "axios";
// import DeleteVariantModal from "./DeleteVariantModal";

interface Product {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  sku: string;
  price: number;
  sellingPrice: number;
  offer: number;
  stock: number;
  product?: Product;
}

// Mock API calls - replace with your actual API calls


const updateVariantById = async (variant: Variant, token: string): Promise<Variant> => {
  // Replace with actual API call
  return variant;
};

const deleteVariantById = async (id: number, token: string): Promise<void> => {
  // Replace with actual API call
};

export default function ProductVariantsTable() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

//   const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
 


useEffect(() => {
  fetchAllVariants();
}, []);

const fetchAllVariants = async () => {
  try {
    setLoading(true);
    setError("");
    const res = await axios.get<Variant[]>("http://localhost:8000/api/variants");
    setTableData(res.data); // update table data here!
    setSuccess("All variants loaded successfully");
    setTimeout(() => setSuccess(""), 3000);
  } catch (err) {
    setError("Failed to load all variants");
  } finally {
    setLoading(false);
  }
};


  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveVariant = async (updatedVariant: Variant) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const updated = await updateVariantById(updatedVariant, token);
      setTableData((prev) =>
        prev.map((v) => (v.id === updated.id ? updated : v))
      );
      toast.success("Variant updated successfully", { style: { top: "50px" } });
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update variant", { style: { top: "50px" } });
    }
  };

  const handleDeleteVariant = async () => {
    if (!selectedVariant) return;

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      await deleteVariantById(selectedVariant.id, token);
      setTableData((prev) => prev.filter((v) => v.id !== selectedVariant.id));
      toast.success("Variant deleted successfully", { style: { top: "50px" } });
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete variant", { style: { top: "50px" } });
    } finally {
      setDeleteModalOpen(false);
      setSelectedVariant(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
      
      
      <div className="w-full overflow-x-auto">
      <div className="ml-5"><header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Variants Management</h1>
          <p className="text-gray-600 mt-2">View and manage all product variants in your inventory</p>
        </header>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{success}</p>
          </div>
        )}</div>
        <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm dark:text-white">
          <TableHead className="bg-gray-100 dark:bg-white/[0.05] dark:text-white">
            <TableRow className="">
              <TableHeadCell className="dark:text-white">ID</TableHeadCell>
              <TableHeadCell className="dark:text-white">SKU</TableHeadCell>
              <TableHeadCell className="dark:text-white">Price</TableHeadCell>
              <TableHeadCell className="dark:text-white">Selling Price</TableHeadCell>
              <TableHeadCell className="dark:text-white">Offer</TableHeadCell>
              <TableHeadCell className="dark:text-white">Stock</TableHeadCell>
              <TableHeadCell className="dark:text-white">Product</TableHeadCell>
              <TableHeadCell className="dark:text-white">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y  divide-gray-200 dark:divide-white/[0.05]">
            {visibleData.map((variant) => (
              <TableRow
                key={variant.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:text-white"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  #{variant.id}
                </TableCell>
                <TableCell className="dark:text-white">{variant.sku}</TableCell>
                <TableCell className="dark:text-white">{formatCurrency(variant.price)}</TableCell>
                <TableCell className="dark:text-white">{formatCurrency(variant.sellingPrice)}</TableCell>
                <TableCell className="dark:text-white">
                  <span className={`px-2 py-1 rounded-full text-xs ${variant.offer > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {variant.offer}%
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">
                  <span className={`px-2 py-1 rounded-full text-xs ${variant.stock > 10 ? 'bg-green-100 text-green-800' : variant.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {variant.stock} in stock
                  </span>
                </TableCell>
                <TableCell className="dark:text-white">{variant.product?.name || "N/A"}</TableCell>
                <TableCell className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedVariant(variant);
                      setEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVariant(variant);
                      setDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    <MdDeleteForever />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end px-4 py-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={tableData.length}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <EditVariantModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        variant={selectedVariant}
        onSave={handleSaveVariant}
      />

      {/* <DeleteVariantModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteVariant}
        variantName={selectedVariant?.sku || ""}
      /> */}
    </div>
  );
}