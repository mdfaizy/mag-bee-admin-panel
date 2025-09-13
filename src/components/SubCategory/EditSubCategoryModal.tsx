"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedSubCategory,
  setSubCategories,
} from "@/redux/productSubCategory";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { fetchProductCategory } from "@/services/product-category/categoryService";
import { setCategories } from "@/redux/productCategory";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditSubCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedSubCategory, subCategories } = useSelector(
    (state: RootState) => state.SubCategoryState
  );
  const { categories } = useSelector((state: RootState) => state.category);

  const [formData, setFormData] = useState<{
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  imageUrl: string | File;   // 👈 string bhi aur File bhi allow karega
}>({
  name: "",
  description: "",
  slug: "",
  categoryId: "",
  imageUrl: "",
});


  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 🔹 Set form data when subcategory selected
  useEffect(() => {
    if (selectedSubCategory) {
      setFormData({
        name: selectedSubCategory.name || "",
        description: selectedSubCategory.description || "",
        slug: selectedSubCategory.slug || "",
        categoryId: selectedSubCategory.category?.id?.toString() || "",
        imageUrl: selectedSubCategory.imageUrl || "",
      });
      setImagePreview(selectedSubCategory.imageUrl || null);
    }
  }, [selectedSubCategory]);

// 🔹 Fetch categories when modal opens
useEffect(() => {
  const loadCategories = async ( token: string) => {
    try {
      const result = await fetchProductCategory();
      // ✅ Agar API direct array return kare to bhi handle
      dispatch(setCategories(result.categories || result));
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
    }
  };

  if (isOpen) {
    loadCategories();
  }
}, [isOpen, dispatch]);



  // 🔹 Ensure formData sync ho categories ke baad bhi
  useEffect(() => {
    if (categories.length > 0 && selectedSubCategory?.category?.id) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedSubCategory.category.id.toString(),
      }));
    }
  }, [categories, selectedSubCategory]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, imageUrl: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubCategory) return;

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("categoryId", formData.categoryId);
      if (formData.imageUrl instanceof File) {
        formDataObj.append("image", formData.imageUrl);
      }

      const res = await fetch(
        `http://localhost:8000/api/subcategories/${selectedSubCategory.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update subcategory");
      }

      // ✅ Update Redux store
      const updatedList = subCategories.map((sub) =>
        sub.id === selectedSubCategory.id ? result.updatedSubCategory : sub
      );
      dispatch(setSubCategories(updatedList));

      dispatch(setSelectedSubCategory(null));
      onClose();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  if (!selectedSubCategory) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit SubCategory</h2>
        <form className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
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
            <Label>Slug</Label>
            <Input name="slug" value={formData.slug} onChange={handleChange} />
          </div>

          <div>
            <Label>Category</Label>
            <select
              name="categoryId"
              value={formData.categoryId.toString()}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Category</option>

              {/* fallback option so current category always visible */}
              {categories.length === 0 &&
                selectedSubCategory?.category && (
                  <option
                    value={selectedSubCategory.category.id.toString()}
                  >
                    {selectedSubCategory.category.name}
                  </option>
                )}

              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              className="w-24 h-auto mt-2 rounded"
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditSubCategoryModal;
