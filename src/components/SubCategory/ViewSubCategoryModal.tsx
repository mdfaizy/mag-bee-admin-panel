// "use client";
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { fetchProductCategory } from "@/services/product-category/categoryService";
// import { setCategories } from "@/redux/productCategory";
// import Button from "../ui/button/Button";


// interface Category {
//   id: number;
//   name: string;
// }

// interface SubCategory {
//   id?: number;
//   name: string;
//   description?: string;
//   slug?: string;
//   categoryId?: number; // ✅ optional now
//   imageUrl?: string;
//   category?: Category;
// }

// interface ViewSubCategoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   data: SubCategory | null;
// }

// const ViewSubCategoryModal: React.FC<ViewSubCategoryModalProps> = ({
//   isOpen,
//   onClose,
//   data,
// }) => {
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state: RootState) => state.category);
//   const [categoryName, setCategoryName] = useState<string>("");
// console.log('data',data)
//   // 🔹 Fetch categories when modal opens
//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const result = await fetchProductCategory();
//         dispatch(setCategories(result.categories || result));
//       } catch (error: any) {
//         console.error("Error fetching categories:", error.message);
//       }
//     };

//     if (isOpen) {
//       loadCategories();
//     }
//   }, [isOpen, dispatch]);

//   // 🔹 Set category name from categories list or fallback
// useEffect(() => {
//   if (data) {
//     const cat = categories.find(
//       (c) => c.id === data.categoryId
//     );

//     setCategoryName(cat?.name ?? data.category?.name ?? "N/A");
//   }
// }, [data, categories]);





//   if (!isOpen || !data) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-2xl">
//           <h2 className="text-xl font-bold text-white">SubCategory Details</h2>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-4">
//           <div className="flex items-start">
//             <div className="w-1/3 font-medium text-gray-700">Name:</div>
//             <div className="w-2/3 text-gray-900 font-semibold">{data.name}</div>
//           </div>

//           <div className="flex items-start">
//             <div className="w-1/3 font-medium text-gray-700">Description:</div>
//             <div className="w-2/3 text-gray-800">
//               {data.description || <span className="text-gray-400 italic">No description</span>}
//             </div>
//           </div>

//           <div className="flex items-start">
//             <div className="w-1/3 font-medium text-gray-700">Slug:</div>
//             <div className="w-2/3 text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded text-sm">
//               {data.slug || "N/A"}
//             </div>
//           </div>

//           <div className="flex items-start">
//             <div className="w-1/3 font-medium text-gray-700">Category:</div>
//             <div className="w-2/3 text-gray-900 font-semibold">{categoryName}</div>
//           </div>

//           {data.imageUrl && (
//             <div className="pt-2">
//               <div className="font-medium text-gray-700 mb-2">Image:</div>
//               <div className="border rounded-lg overflow-hidden">
//                 <img
//                   src={data.imageUrl}
//                   alt={data.name}
//                   className="w-full h-48 object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Close Button */}
//           <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
//             <Button
//               onClick={onClose}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors duration-200"
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewSubCategoryModal;



"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchProductCategory } from "@/services/product-category/categoryService";
import { setCategories } from "@/redux/productCategory";
import {
  X,
  FolderTree,
  Hash,
  FileText,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id?: number;
  name: string;
  description?: string;
  slug?: string;
  categoryId?: number;
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchProductCategory();
        dispatch(setCategories(result.categories || result));
      } catch (error: any) {
        console.error("Error fetching categories:", error?.message || error);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (data) {
      const cat = categories.find(
        (c) => c.id === (data.categoryId ?? data.category?.id)
      );
      setCategoryName(cat?.name ?? data.category?.name ?? "—");
    }
  }, [data, categories]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-subcategory-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* RIGHT DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <FolderTree className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="view-subcategory-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                SubCategory Details
              </h2>
              <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                {data.id ? `#${String(data.id).padStart(4, "0")}` : "Taxonomy"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-xs sm:text-sm">
          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
              SubCategory Information
            </h3>

            <div className="space-y-1 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Name
              </span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {data.name || "—"}
              </p>
            </div>

            <div className="space-y-1 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Layers className="h-3 w-3" />
                <span>Parent Category</span>
              </span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {categoryName}
              </p>
            </div>

            <div className="space-y-1 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Hash className="h-3 w-3" />
                <span>Slug</span>
              </span>
              <div>
                {data.slug ? (
                  <code className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    {data.slug}
                  </code>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500">—</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <FileText className="h-3 w-3" />
                <span>Description</span>
              </span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                {data.description || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    No description provided
                  </span>
                )}
              </p>
            </div>
          </section>

          {data.imageUrl && (
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40 sm:px-5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  SubCategory Media
                </h3>
              </div>
              <div className="p-4">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ViewSubCategoryModal;