// "use client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createCategorySchema, CreateCategoryForm } from "@/validations/category.schema";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import { createCategory } from "../../services/product-category/categoryService";
// import { AppDispatch } from "@/redux/store";
// import { MdErrorOutline } from "react-icons/md";
// export default function CreateProductCategory() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateCategoryForm>({
//     resolver: zodResolver(createCategorySchema),
//   });


//   const onSubmit = async (data: CreateCategoryForm) => {
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("imageUrl", data.image);

//     dispatch(createCategory({ formData, router }) as any);
//   };
//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-start font-semibold uppercase mb-6 text-lg">
//             Create Product Category
//           </h1>
//           <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//             Add a new category to organize your products
//           </p>
//         </div>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-5">
//             <div>
//               <Label>
//                 Category Name <span className="text-error-500">*</span>
//               </Label>
//               <Input {...register("name")} placeholder="Electronics"
//                 className={`w-full px-4 py-3 mt-1 border rounded-lg resize-none outline-none
//       ${errors.name
//                     ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
//                     : "border-slate-300 focus:ring-2 focus:ring-indigo-500"
//                   }
//       disabled:opacity-50 disabled:cursor-not-allowed
//     `} />
//               {errors.name && (
//                 <p className="text-sm text-red-500 mt-1 flex text-center items-center">
//                   <MdErrorOutline className="mr-2" />
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Label>
//                 Description <span className="text-error-500">*</span>
//               </Label>
//               <TextArea {...register("description")}
//                 className={`w-full px-4 py-3 mt-1 border rounded-lg resize-none outline-none
//       ${errors.description
//                     ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
//                     : "border-slate-300 focus:ring-2 focus:ring-indigo-500"
//                   }
//       disabled:opacity-50 disabled:cursor-not-allowed
//     `} />
//               {errors.description && (
//                 <p className="text-sm text-red-500 mt-1 flex text-center items-center">
//                   <MdErrorOutline className="mr-2" />
//                   {errors.description.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Label className="block mb-2">
//                 Category Image <span className="text-red-500">*</span>
//               </Label>

//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="flex-1">
//                   <div
//                     className="flex items-center justify-center w-full">
//                     <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
//     ${errors.image
//                         ? "border-red-400 bg-red-50 hover:border-red-500"
//                         : "border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400"
//                       }
//   `}
//                     // className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400"
//                     >
//                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                         <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
//                           <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
//                         </svg>
//                         <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//                           <span className="font-semibold">Click to upload</span> or drag and drop
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           SVG, PNG, JPG or GIF (MAX. 2MB)
//                         </p>
//                       </div>
//                       <Input

//                         type="file"
//                         accept="image/jpeg,image/png,image/jpg"

//                         onChange={(e) => {
//                           const file = e.target.files?.[0];
//                           if (file) {
//                             setValue("image", file);
//                             setImagePreview(URL.createObjectURL(file));
//                           }
//                         }}
//                       />
//                       {errors.image && (
//                         <p className="text-sm text-red-500 mt-6">
//                           {errors.image.message}
//                         </p>
//                       )}
//                     </label>
//                   </div>
//                 </div>

//                 {imagePreview && (
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
//                     <div className="h-48 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 mb-8"
//               >
//                 {isSubmitting ? "Creating..." : "Create Category"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  CreateCategoryForm,
} from "@/validations/category.schema";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { createCategory } from "../../services/product-category/categoryService";
import { AppDispatch } from "@/redux/store";
import { MdErrorOutline, MdCloudUpload, MdArrowBack } from "react-icons/md";
import { X } from "lucide-react";

export default function CreateProductCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileSelect = (file?: File) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setImagePreview(null);
      resetField("image");
      return;
    }

    setValue("image", file, { shouldValidate: true });
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: CreateCategoryForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("imageUrl", data.image);

    dispatch(createCategory({ formData, router }) as any);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / Categories
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Create Product Category
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Add a new category with details and a cover image to organize your
              catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <MdArrowBack className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          {/* CATEGORY NAME */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g. Laboratory Instruments"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                errors.name
                  ? "border-rose-300 bg-rose-50/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-300 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950"
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <MdErrorOutline className="h-4 w-4 shrink-0" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
              Description <span className="text-rose-500">*</span>
            </Label>
            <TextArea
              {...register("description")}
              rows={4}
              placeholder="Write a brief summary of what products belong in this category..."
              className={`w-full resize-none rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                errors.description
                  ? "border-rose-300 bg-rose-50/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                  : "border-slate-300 bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-950"
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <MdErrorOutline className="h-4 w-4 shrink-0" />
                <span>{errors.description.message}</span>
              </p>
            )}
          </div>

          {/* CATEGORY IMAGE */}
          <div className="space-y-2">
            <Label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Category Image <span className="text-rose-500">*</span>
            </Label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label
                className={`flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center transition ${
                  errors.image
                    ? "border-rose-400 bg-rose-50/60 hover:border-rose-500"
                    : "border-slate-300 bg-slate-50/60 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <MdCloudUpload className="h-4 w-4" />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-800 dark:text-slate-200 sm:text-sm">
                  Click to upload image
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  JPG, PNG, or WEBP • Max 2 MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                />
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-950">
                  <img
                    src={imagePreview}
                    alt="Category Preview"
                    className="h-44 w-full object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleFileSelect(undefined)}
                    aria-label="Remove image preview"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex h-44 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/40 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-950/30">
                  Image preview will appear here
                </div>
              )}
            </div>

            {errors.image && (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <MdErrorOutline className="h-4 w-4 shrink-0" />
                <span>{errors.image.message}</span>
              </p>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 sm:text-sm"
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}