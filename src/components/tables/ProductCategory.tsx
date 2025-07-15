


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
import { fetchProductCategory, deleteCategory } from "../../services/product-category/categoryService";
import { useDispatch } from "react-redux";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

interface ProductCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductCategoryTable() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<ProductCategory | null>(null);
 
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchProductCategory();
        console.log('result',result)
        setTableData(result);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    dispatch<any>(deleteCategory(id));
  };

  const handleEdit = (category: ProductCategory) => {
    setEditData(category);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };



  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !editData) return;

  try {
    const formData = new FormData();
    formData.append("file", file);
   formData.append("upload_preset", "ecommerce_uploads");// replace with actual
    formData.append("folder", "categories"); // optional

    const res = await fetch("https://api.cloudinary.com/v1_1/dditvtnis/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    setEditData({ ...editData, imageUrl: data.secure_url });
  } catch (err) {
    console.error("Image upload error:", err);
    alert("Image upload failed. Try again.");
  }
};








const handleSaveEdit = async () => {
  if (!editData) return;

  try {
    const rawToken = localStorage.getItem("token");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

    const res = await fetch(`http://localhost:8000/api/products/category/${editData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editData.name,
        description: editData.description,
        ...(editData.imageUrl ? { imageUrl: editData.imageUrl } : {}),
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      // Backend ka error message console me print karen
      console.error("Backend error response:", result);
      throw new Error(result.message || "Failed to update category");
    }

    alert("Category updated successfully!");

    const updated = tableData.map((item) =>
      item.id === editData.id ? result.updatedCategory : item
    );
    setTableData(updated);
    setIsEditModalOpen(false);
  } catch (error: any) {
    console.error("Update failed:", error);

    // Agar backend se aise messages aaye toh unko show karen
    if (error.message.includes("products already exist")) {
      alert("❌ You can't rename this category because products already exist under it.");
    } else if (error.message.includes("already exists")) {
      alert("⚠️ Category name already exists.");
    } else {
      // Generic error message ki jagah error.message show karo
      alert(error.message || "Something went wrong while updating.");
    }
  }
};







  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm">
            <TableHead className="bg-gray-100 dark:bg-white/[0.05]">
              <TableRow>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Url</TableHeadCell>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Created At</TableHeadCell>
                <TableHeadCell>Updated At</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
              {Array.isArray(visibleData) && visibleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name || "—"}</TableCell>
                  <TableCell>{item.description || "—"}</TableCell>
                   <TableCell>{item?.slug || "—"}</TableCell>
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Product"
                        className="w-16 h-auto object-cover rounded"
                      />
                    ) : "—"}
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
                  <TableCell className="flex gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="max-w-[600px] m-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
          {editData && (
            <form className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input name="name" value={editData.name} onChange={handleEditChange} />
              </div>
              <div>
                <Label>Description</Label>
                <Input name="description" value={editData.description} onChange={handleEditChange} />
              </div>
              {/* <div>
                <Label>Image URL</Label>
                <Input name="imageUrl" value={editData.imageUrl} onChange={handleEditChange} />
              </div> */}
              <div>
  <Label>Upload Image</Label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="mt-1 block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100"
  />
</div>

Show preview
{editData.imageUrl && (
  <img src={editData.imageUrl} alt="Preview" className="w-24 h-auto mt-2 rounded" />
)}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save</Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
