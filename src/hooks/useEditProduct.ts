// src/components/logic/productTableLogic.ts

import { useEffect, useState } from "react";
import { fetchProductAll } from "../services/product/productService";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  offer: number;
  categoryName?: string;
  category?: { id: number; name: string };
  slug?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const useProductTableLogic = () => {
  const itemsPerPage = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    searchTerm: "",
    categoryFilter: "",
    dateFilter: "",
    ratingFilter: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchProductAll();
        setTableData(result);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const calculateFinalPrice = (originalPrice: number, offer: number): number => {
    if (!originalPrice || !offer) return originalPrice || 0;
    return parseFloat((originalPrice - (originalPrice * offer) / 100).toFixed(2));
  };

  const handleEdit = (product: Product) => {
    setEditData(product);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    const { name, value } = e.target;
    const parsedValue =
      name === "price" || name === "originalPrice" || name === "offer"
        ? parseFloat(value)
        : value;

    const updated = {
      ...editData,
      [name]: parsedValue,
    };

    if (name === "originalPrice" || name === "offer") {
      updated.price = calculateFinalPrice(updated.originalPrice, updated.offer);
    }

    setEditData(updated);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editData) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ecommerce_uploads");
      formData.append("folder", "products");

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
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await fetch(`http://localhost:8000/api/products/products/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          description: editData.description,
          price: editData.price,
          originalPrice: editData.originalPrice,
          offer: editData.offer,
          imageUrl: editData.imageUrl || null,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      alert("✅ Product updated successfully!");
      const updated = tableData.map((item) =>
        item.id === editData.id ? result.updatedProduct : item
      );
      setTableData(updated);
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      alert(error.message || "Something went wrong while updating.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      searchTerm: "",
      categoryFilter: "",
      dateFilter: "",
      ratingFilter: "",
    });
  };

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

  return {
    itemsPerPage,
    currentPage,
    setCurrentPage,
    tableData,
    loading,
    editData,
    setEditData,
    isEditModalOpen,
    setIsEditModalOpen,
    uploading,
    formData,
    handleEdit,
    handleEditChange,
    handleImageChange,
    handleSaveEdit,
    handleChange,
    handleReset,
    visibleData,
    totalPages,
  };
};
