"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { createCategory  } from "../../services/subCategoryService/subCategoryService";
import {fetchProductCategory} from '../../services/product-category/categoryService'
interface Category {
  id: number;
  name: string;
}

export default function CreateSubCategory() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    image: null as File | null,
  });

  // ✅ Fetch all categories for parent selection
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await fetchProductCategory();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "image") {
      const file = files?.[0];
      if (file) {
        setForm((prev) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setForm((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, categoryId, image } = form;

    if (!name || !description || !categoryId || !image) {
      toast.error("Please fill all required fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("imageUrl", image);

    dispatch(
      createCategory({ formData, router }) as any
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-start font-semibold uppercase mb-6 text-lg">
            Create SubCategory
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Add a new subcategory under an existing category
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                SubCategory Name <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                value={form.name}
                placeholder="e.g., Laptops, Mobiles"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>
                Description <span className="text-error-500">*</span>
              </Label>
              <TextArea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this subcategory..."
              />
            </div>

            <div>
              <Label>
                Parent Category <span className="text-error-500">*</span>
              </Label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block mb-2">
                SubCategory Image <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF (MAX. 2MB)
                        </p>
                      </div>
                      <Input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {imagePreview && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
                    <div className="h-48 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 mb-8"
              >
                Create SubCategory
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
