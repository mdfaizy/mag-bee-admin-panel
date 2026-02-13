"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { apiConnector } from "@/services/apiConnector";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const EditCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ✅ fetch by id
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setPageLoading(true);

        const res = await apiConnector("GET", `/category/id/${id}`);
        console.log("category id", res);

        const data = res?.data?.category;

        if (!data) throw new Error("Category not found");

        setFormData({
          name: data.name || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
        });

        setImagePreview(data.imageUrl || null);
      } catch (err) {
        toast.error("Failed to load category");
        router.back();
      } finally {
        setPageLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ image upload
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", "ecommerce_uploads");
      uploadForm.append("folder", "categories");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dditvtnis/image/upload",
        {
          method: "POST",
          body: uploadForm,
        }
      );

      const data = await res.json();

      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      setImagePreview(data.secure_url);

      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await apiConnector("PUT", `/category/${id}`, formData);

      if (!res.data?.success) {
        throw new Error(res.data?.message);
      }

      toast.success("Category updated successfully ✅");
      router.back();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ page loader
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-6">
      {/* ✅ Breadcrumb */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <FaChevronRight className="mx-2 text-xs" />
          <Link href="/product-category-table" className="hover:text-blue-600">
            Categories
          </Link>
          <FaChevronRight className="mx-2 text-xs" />
          <span className="text-gray-800 font-medium">
            Edit Category
          </span>
        </nav>
      </div>

      {/* ✅ Form Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Edit Category
          </h2>

          <div className="space-y-5">
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Upload Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-28 rounded mt-2"
              />
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>

              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPage;
