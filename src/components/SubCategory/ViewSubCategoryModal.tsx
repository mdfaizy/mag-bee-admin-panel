"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchProductCategory } from "@/services/product-category/categoryService";
import { setCategories } from "@/redux/productCategory";
import Button from "../ui/button/Button";


interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id?: number;
  name: string;
  description?: string;
  slug?: string;
  categoryId?: number; // ✅ optional now
  imageUrl?: string;
  category?: Category;
}

interface ViewSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubCategory | null;
}

const ViewSubCategoryModal: React.FC<ViewSubCategoryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.category);
  const [categoryName, setCategoryName] = useState<string>("");
console.log('data',data)
  // 🔹 Fetch categories when modal opens
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchProductCategory();
        dispatch(setCategories(result.categories || result));
      } catch (error: any) {
        console.error("Error fetching categories:", error.message);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, dispatch]);

  // 🔹 Set category name from categories list or fallback
  useEffect(() => {
    if (data) {
      const cat = categories.find((c: Category) => c.id === data.categoryId);
      setCategoryName(cat ? cat.name : data.category?.name || "N/A");
    }
  }, [data, categories]);



  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">SubCategory Details</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start">
            <div className="w-1/3 font-medium text-gray-700">Name:</div>
            <div className="w-2/3 text-gray-900 font-semibold">{data.name}</div>
          </div>

          <div className="flex items-start">
            <div className="w-1/3 font-medium text-gray-700">Description:</div>
            <div className="w-2/3 text-gray-800">
              {data.description || <span className="text-gray-400 italic">No description</span>}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-1/3 font-medium text-gray-700">Slug:</div>
            <div className="w-2/3 text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded text-sm">
              {data.slug || "N/A"}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-1/3 font-medium text-gray-700">Category:</div>
            <div className="w-2/3 text-gray-900 font-semibold">{categoryName}</div>
          </div>

          {data.imageUrl && (
            <div className="pt-2">
              <div className="font-medium text-gray-700 mb-2">Image:</div>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={data.imageUrl}
                  alt={data.name}
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <Button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors duration-200"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubCategoryModal;
