// "use client";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   setSelectedSubCategory,
//   setSubCategories,
// } from "@/redux/productSubCategory";
// import { Modal } from "../ui/modal";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
// import Button from "../ui/button/Button";
// import { fetchProductCategory } from "@/services/product-category/categoryService";
// import { setCategories } from "@/redux/productCategory";
// import { updateSubCategoryById } from "@/services/subCategoryService/subCategoryService";
// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const EditSubCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const { selectedSubCategory, subCategories } = useSelector(
//     (state: RootState) => state.SubCategoryState
//   );
//   const { categories } = useSelector((state: RootState) => state.category);

//   const [formData, setFormData] = useState<{
//     name: string;
//     description: string;
//     slug: string;
//     categoryId: string;
//     imageUrl: string | File;
//   }>({
//     name: "",
//     description: "",
//     slug: "",
//     categoryId: "",
//     imageUrl: "",
//   });


//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   // 🔹 Set form data when subcategory selected
//   useEffect(() => {
//     if (selectedSubCategory) {
//       setFormData({
//         name: selectedSubCategory.name || "",
//         description: selectedSubCategory.description || "",
//         slug: selectedSubCategory.slug || "",
//         categoryId: selectedSubCategory.category?.id?.toString() || "",
//         imageUrl: selectedSubCategory.imageUrl || "",
//       });
//       setImagePreview(selectedSubCategory.imageUrl || null);
//     }
//   }, [selectedSubCategory]);

//   // 🔹 Fetch categories when modal opens
//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const result = await fetchProductCategory();
//         // ✅ Agar API direct array return kare to bhi handle
//         dispatch(setCategories(result.categories || result));
//       } catch (error: any) {
//         console.error("Error fetching categories:", error.message);
//       }
//     };

//     if (isOpen) {
//       loadCategories();
//     }
//   }, [isOpen, dispatch]);



//   // 🔹 Ensure formData sync ho categories ke baad bhi
//   useEffect(() => {
//     if (categories.length > 0 && selectedSubCategory?.category?.id) {
//       setFormData((prev) => ({
//         ...prev,
//         categoryId: selectedSubCategory.category.id.toString(),
//       }));
//     }
//   }, [categories, selectedSubCategory]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (e.target.files && e.target.files[0]) {
//   //     const file = e.target.files[0];
//   //     setFormData((prev) => ({ ...prev, imageUrl: file }));
//   //     setImagePreview(URL.createObjectURL(file));
//   //   }
//   // };
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   setFormData((prev) => ({ ...prev, imageUrl: file }));

//   const previewUrl = URL.createObjectURL(file);
//   setImagePreview(previewUrl);
// };
//   const handleSubmit = async () => {
//     if (!selectedSubCategory) return;

//     try {
//       const rawToken = localStorage.getItem("token");
//       const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

//       const formDataObj = new FormData();
//       formDataObj.append("name", formData.name);
//       formDataObj.append("description", formData.description);
//       formDataObj.append("slug", formData.slug);
//       formDataObj.append("categoryId", formData.categoryId);
//       if (formData.imageUrl instanceof File) {
//         formDataObj.append("image", formData.imageUrl);
//       }

//       const result = await updateSubCategoryById({
//         id: selectedSubCategory.id,
//         formData: formDataObj, // ✅ correct
//       });

//       // ✅ Update Redux store
//       const updatedList = subCategories.map((sub) =>
//         sub.id === selectedSubCategory.id ? result : sub
//       );
//       dispatch(setSubCategories(updatedList));

//       dispatch(setSelectedSubCategory(null));
//       onClose();
//     } catch (error: any) {
//       alert(error.message || "Something went wrong");
//     }
//   };


//   if (!selectedSubCategory) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
//       <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
//         <h2 className="text-xl font-semibold mb-4">Edit SubCategory</h2>
//         <form className="space-y-4">
//           <div>
//             <Label>Name</Label>
//             <Input name="name" value={formData.name} onChange={handleChange} />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <Input
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label>Slug</Label>
//             <Input name="slug" value={formData.slug} onChange={handleChange} />
//           </div>

//           <div>
//             <Label>Category</Label>
//             <select
//               name="categoryId"
//               // value={formData.categoryId.toString()}
//               value={formData.categoryId ? formData.categoryId.toString() : ""}
//               onChange={handleChange}
//               className="w-full border rounded p-2"
//             >
//               <option value="">Select Category</option>

//               {/* fallback option so current category always visible */}
//               {categories.length === 0 &&
//                 selectedSubCategory?.category && (
//                   <option
//                     value={selectedSubCategory.category.id.toString()}
//                   >
//                     {selectedSubCategory.category.name}
//                   </option>
//                 )}

//               {categories.map((cat: any) => (
//                 <option key={cat.id} value={cat.id.toString()}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <Label>Upload Image</Label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="mt-1 block w-full"
//             />
//           </div>
//           {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-24 h-auto mt-2 rounded"
//             />
//           )}

//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="button" onClick={handleSubmit}>
//               Save
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EditSubCategoryModal;





"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedSubCategory,
  setSubCategories,
} from "@/redux/productSubCategory";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { fetchProductCategory } from "@/services/product-category/categoryService";
import { setCategories } from "@/redux/productCategory";
import { updateSubCategoryById } from "@/services/subCategoryService/subCategoryService";
import { toast } from "react-toastify";
import { X, Save, FolderTree, Upload, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

const labelCls =
  "mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300";

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
    imageUrl: string | File;
  }>({
    name: "",
    description: "",
    slug: "",
    categoryId: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    if (categories.length > 0 && selectedSubCategory?.category?.id) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedSubCategory.category.id.toString(),
      }));
    }
  }, [categories, selectedSubCategory]);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, saving, onClose]);

  if (!isOpen || !selectedSubCategory) return null;

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
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, imageUrl: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubCategory || saving) return;

    try {
      setSaving(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("slug", formData.slug);
      formDataObj.append("categoryId", formData.categoryId);
      if (formData.imageUrl instanceof File) {
        formDataObj.append("image", formData.imageUrl);
      }

      const result = await updateSubCategoryById({
        id: selectedSubCategory.id,
        formData: formDataObj,
      });

      const updatedList = subCategories.map((sub) =>
        sub.id === selectedSubCategory.id ? result : sub
      );
      dispatch(setSubCategories(updatedList));
      dispatch(setSelectedSubCategory(null));
      toast.success("Subcategory updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!saving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-subcategory-drawer-title"
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
                id="edit-subcategory-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Edit SubCategory
              </h2>
              <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                #{String(selectedSubCategory.id).padStart(4, "0")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM + SCROLLABLE BODY */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
                Taxonomy Details
              </h3>

              <div>
                <Label className={labelCls}>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={saving}
                  className={inputCls}
                />
              </div>

              <div>
                <Label className={labelCls}>Description</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={saving}
                  className={inputCls}
                />
              </div>

              <div>
                <Label className={labelCls}>Slug</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={saving}
                  className={`${inputCls} font-mono`}
                />
              </div>

              <div>
                <Label className={labelCls}>Category</Label>
                <select
                  name="categoryId"
                  value={
                    formData.categoryId ? formData.categoryId.toString() : ""
                  }
                  onChange={handleChange}
                  disabled={saving}
                  className={inputCls}
                >
                  <option value="">Select Category</option>

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
            </section>

            {/* MEDIA UPLOAD */}
            <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <h3 className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
                <Upload className="h-3.5 w-3.5 text-slate-400" />
                <span>SubCategory Image</span>
              </h3>

              <input
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={handleImageChange}
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border file:border-slate-200 file:bg-slate-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-100 dark:text-slate-400 dark:file:border-slate-700 dark:file:bg-slate-800 dark:file:text-slate-200"
              />

              {imagePreview && (
                <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </section>
          </div>

          {/* DRAWER FOOTER */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default EditSubCategoryModal;