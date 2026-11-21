// "use client";

// import React, {
//   useState,
//   ChangeEvent,
//   FormEvent,
//   useEffect,
// } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";

// import {
//   createSubCategory,
//   getSubCategoriesByCategory,
// } from "../../services/subCategoryService/subCategoryService";

// import {
//   fetchProductCategory,
// } from "../../services/product-category/categoryService";

// interface Category {
//   id: number;
//   name: string;
// }

// interface SubCategory {
//   id: number;
//   name: string;
//   description: string;
// }

// export default function CreateSubCategory() {
//   const router = useRouter();

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [imageFile, setImageFile] = useState<File | null>(null);
// const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     categoryId: "",
//     parentId: "",
//   });

//   const [loading, setLoading] = useState(false);

//   /*
//    -----------------------------------
//    FETCH ALL CATEGORIES
//    -----------------------------------
//   */
//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const data = await fetchProductCategory();
//         setCategories(data);
//       } catch (err) {
//         toast.error("Failed to fetch categories");
//       }
//     }

//     loadCategories();
//   }, []);

//   /*
//    -----------------------------------
//    FETCH SUBCATEGORIES ON CATEGORY CHANGE
//    -----------------------------------
//   */
//   useEffect(() => {
//     async function loadSubCategories() {
//       if (!form.categoryId) {
//         setSubCategories([]);
//         return;
//       }

//       try {
//         const data = await getSubCategoriesByCategory(
//           form.categoryId
//         );

//         setSubCategories(data);
//       } catch (err) {
//         toast.error("Failed to fetch subcategories");
//       }
//     }

//     loadSubCategories();
//   }, [form.categoryId]);

//   /*
//    -----------------------------------
//    HANDLE INPUT CHANGE
//    -----------------------------------
//   */
//   const handleChange = (
//     e: ChangeEvent<
//       HTMLInputElement |
//       HTMLTextAreaElement |
//       HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,

//       // Reset parent if category changes
//       ...(name === "categoryId"
//         ? { parentId: "" }
//         : {}),
//     }));
//   };


//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];

//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     toast.error("Only image files are allowed");
//     e.target.value = "";
//     return;
//   }

//   if (file.size > 2 * 1024 * 1024) {
//     toast.error("Image size must be less than 2MB");
//     e.target.value = "";
//     return;
//   }

//   setImageFile(file);
//   setImagePreview(URL.createObjectURL(file));
// };

//   /*
//    -----------------------------------
//    HANDLE SUBMIT
//    -----------------------------------
//   */
//   const handleSubmit = async (
//     e: FormEvent<HTMLFormElement>
//   ) => {
//     e.preventDefault();

//     const { name, description, categoryId, parentId } = form;

//     if (!name || !categoryId) {
//       toast.error("Name and Category are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();

//       formData.append("name", name);
//       formData.append("description", description);
//         formData.append("slug", "");
//       formData.append("categoryId", categoryId);

//       if (parentId) {
//         formData.append("parentId", parentId);
//       }

//        // Optional image
//     if (imageFile) {
//       formData.append("image", imageFile);
//     }
//       await createSubCategory({
//         formData,
//         router,
//       });

//       toast.success("SubCategory Created Successfully");

//       setForm({
//         name: "",
//          description: "",
//         categoryId: "",
//         parentId: "",
//       });
//     setImageFile(null);
//     setImagePreview(null);
//       setSubCategories([]);
//     } catch (err: any) {
//       toast.error(
//         err?.response?.data?.message ||"Error creating subcategory"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-start font-semibold uppercase mb-2 text-lg">
//             Create SubCategory
//           </h1>

//           <p className="text-sm text-gray-600 dark:text-gray-300">
//             Add nested subcategories under category/subcategory
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-5 mt-5">

//             {/* NAME */}
//             <div>
//               <Label>
//                 SubCategory Name{" "}
//                 <span className="text-error-500">*</span>
//               </Label>

//               <Input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 placeholder="e.g. Mobile / Realme / Narzo"
//                 onChange={handleChange}
//               />
//             </div>

//             {/* CATEGORY */}
//             <div>
//               <Label>
//                 Category{" "}
//                 <span className="text-error-500">*</span>
//               </Label>

//               <select
//                 name="categoryId"
//                 value={form.categoryId}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">Select Category</option>

//                 {categories.map((cat) => (
//                   <option
//                     key={cat.id}
//                     value={cat.id}
//                   >
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* PARENT SUBCATEGORY */}
//             <div>
//               <Label>Parent SubCategory (Optional)</Label>

//               <select
//                 name="parentId"
//                 value={form.parentId}
//                 onChange={handleChange}
//                 disabled={!form.categoryId}
//                 className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">
//                   No Parent (Root SubCategory)
//                 </option>

//                 {subCategories.map((sub) => (
//                   <option
//                     key={sub.id}
//                     value={sub.id}
//                   >
//                     {sub.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* DESCRIPTION */}
// <div>
//   <Label>SubCategory Description (Optional)</Label>

//   <textarea
//     name="description"
//     value={form.description}
//     onChange={handleChange}
//     placeholder="Enter subcategory description"
//     rows={4}
//     className="w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-700 dark:text-white"
//   />
// </div>

// {/* IMAGE UPLOAD */}
// <div>
//   <Label>SubCategory Image (Optional)</Label>

//   <input
//     type="file"
//     accept="image/jpeg,image/png,image/jpg,image/webp"
//     onChange={handleImageChange}
//     className="w-full rounded-lg border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
//   />

//   {imagePreview && (
//     <div className="mt-3">
//       <img
//         src={imagePreview}
//         alt="SubCategory Preview"
//         className="h-32 w-32 rounded-lg border object-cover"
//       />

//       <button
//         type="button"
//         onClick={() => {
//           setImageFile(null);
//           setImagePreview(null);
//         }}
//         className="mt-2 block text-sm text-red-500"
//       >
//         Remove Image
//       </button>
//     </div>
//   )}
// </div>

//             {/* SUBMIT */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
//               >
//                 {loading
//                   ? "Creating..."
//                   : "Create SubCategory"}
//               </button>
//             </div>

//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import React, {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FolderTree,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";

import {
  createSubCategory,
  getSubCategoriesByCategory,
} from "../../services/subCategoryService/subCategoryService";
import { fetchProductCategory } from "../../services/product-category/categoryService";

/* ---------------- Types ---------------- */
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  description: string;
}

interface FormState {
  name: string;
  description: string;
  categoryId: string;
  parentId: string;
}

type FormErrors = Partial<Record<"name" | "categoryId", string>>;

/* ---------------- Constants ---------------- */
const initialForm: FormState = {
  name: "",
  description: "",
  categoryId: "",
  parentId: "",
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const NAME_LIMIT = 60;
const DESC_LIMIT = 250;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const inputBase =
  "w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:disabled:bg-gray-900";

const inputClass = (hasError?: boolean) =>
  `${inputBase} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "border-gray-200 dark:border-gray-700"
  }`;

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");


  
/* ---------------- Reusable UI ---------------- */
const Field = ({
  label,
  htmlFor,
  required,
  optional,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
        {optional && (
          <span className="ml-1.5 font-normal text-gray-400">Optional</span>
        )}
      </label>
      {counter}
    </div>
    {children}
    {error ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {error}
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
    ) : null}
  </div>
);

// const Counter = ({ value, limit }: { value: number; limit: number }) => (
//   <span
//     className={`text-xs tabular-nums ${
//       value > limit
//         ? "text-red-600"
//         : value > limit * 0.9
//         ? "text-amber-600"
//         : "text-gray-400"
//     }`}
//   >
//     {value}/{limit}
//   </span>
// );

const Counter = ({ value }: { value: number }) => (
  <span className="text-sm text-gray-500">
    {value} characters
  </span>
);
/* ---------------- Main component ---------------- */
export default function CreateSubCategory() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);
  previewRef.current = imagePreview;

  /* ---- Load categories ---- */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true);
        const data = await fetchProductCategory();
        setCategories(data);
      } catch {
        toast.error("Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, []);

  /* ---- Load subcategories when category changes ---- */
  useEffect(() => {
    const load = async () => {
      if (!form.categoryId) {
        setSubCategories([]);
        return;
      }
      try {
        setLoadingSubs(true);
        const data = await getSubCategoriesByCategory(form.categoryId);
        setSubCategories(data);
      } catch {
        setSubCategories([]);
        toast.error("Failed to fetch subcategories");
      } finally {
        setLoadingSubs(false);
      }
    };
    load();
  }, [form.categoryId]);

  /* ---- Revoke preview URL on unmount ---- */
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  /* ---- Derived ---- */
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm) || !!imageFile,
    [form, imageFile]
  );

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const selectedCategory = categories.find(
    (c) => String(c.id) === form.categoryId
  );
  const selectedParent = subCategories.find(
    (s) => String(s.id) === form.parentId
  );

  /* ---- Handlers ---- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" ? { parentId: "" } : {}),
    }));
    if (name === "name" || name === "categoryId") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setImage = (file: File | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const processFile = (file?: File) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 2 MB");
      return;
    }
    setImage(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    processFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setImage(null);
    setSubCategories([]);
  };

  const handleReset = () => {
    if (isDirty && !window.confirm("Clear everything on this form?")) return;
    resetForm();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Enter a subcategory name.";
    if (!form.categoryId) next.categoryId = "Select a category.";
    setErrors(next);

    const firstKey = Object.keys(next)[0];
    if (firstKey) {
      const el = document.getElementById(firstKey);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("slug", "");
      formData.append("categoryId", form.categoryId);
      if (form.parentId) formData.append("parentId", form.parentId);
      if (imageFile) formData.append("image", imageFile);

      await createSubCategory({ formData, router });

      // toast.success("Subcategory created");
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not create subcategory");
    } finally {
      setLoading(false);
    }
  };

  /* ---- Path preview ---- */
  const pathParts = [
    selectedCategory?.name,
    selectedParent?.name,
    form.name.trim() || undefined,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <FolderTree className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create subcategory
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Add a subcategory under a category, or nest it inside another
              subcategory.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* Name */}
            <Field
              label="Subcategory name"
              htmlFor="name"
              required
              error={errors.name}
              counter={<Counter value={form.name.length} />}
            >
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={NAME_LIMIT}
                placeholder="e.g. Microscopes"
                autoComplete="off"
                className={inputClass(!!errors.name)}
              />
              {form.name.trim() && (
                <p className="mt-1.5 text-xs text-gray-400">
                  URL slug:{" "}
                  <span className="font-mono text-gray-500">
                    {slugify(form.name)}
                  </span>
                </p>
              )}
            </Field>

            {/* Category + Parent */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Category"
                htmlFor="categoryId"
                required
                error={errors.categoryId}
              >
                <div className="relative">
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className={`${inputClass(!!errors.categoryId)} appearance-none pr-9`}
                  >
                    <option value="">
                      {loadingCategories ? "Loading…" : "Select category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </Field>

              <Field
                label="Parent subcategory"
                htmlFor="parentId"
                optional
                hint={
                  !form.categoryId
                    ? "Select a category first."
                    : !loadingSubs && subCategories.length === 0
                    ? "No subcategories yet. This will be a top-level one."
                    : undefined
                }
              >
                <div className="relative">
                  <select
                    id="parentId"
                    name="parentId"
                    value={form.parentId}
                    onChange={handleChange}
                    disabled={!form.categoryId || loadingSubs}
                    className={`${inputClass()} appearance-none pr-9`}
                  >
                    <option value="">
                      {loadingSubs ? "Loading…" : "None (top level)"}
                    </option>
                    {subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  {loadingSubs ? (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                  ) : (
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  )}
                </div>
              </Field>
            </div>

            {/* Path preview */}
            {pathParts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 rounded-[10px] border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] dark:border-gray-800 dark:bg-gray-800/50">
                <span className="mr-1 text-gray-400">Will be created at</span>
                {pathParts.map((part, i) => (
                  <React.Fragment key={`${part}-${i}`}>
                    {i > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                    )}
                    <span
                      className={
                        i === pathParts.length - 1 && form.name.trim()
                          ? "font-medium text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {part}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Description */}
                          <Field
              label="Description"
              htmlFor="description"
              optional
              counter={
                <Counter value={form.description.length} />
              }
            >
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={(e) => {
                  handleChange(e);

                  // Auto resize
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Write a detailed description..."
                className={`${inputClass()} resize-none overflow-hidden`}
                style={{ minHeight: "120px" }}
              />
            </Field>
            {/* Image */}
            <Field label="Image" htmlFor="image" optional>
              {imagePreview && imageFile ? (
                <div className="flex items-center gap-4 rounded-[10px] border border-gray-200 p-3 dark:border-gray-800">
                  <img
                    src={imagePreview}
                    alt="Subcategory preview"
                    className="h-20 w-20 shrink-0 rounded-[10px] border border-gray-200 object-cover dark:border-gray-700"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {imageFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(imageFile.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Replace
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    aria-label="Remove image"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`rounded-[10px] border border-dashed px-4 py-6 text-center transition-colors ${
                    dragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800/40"
                  }`}
                >
                  <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <UploadCloud className="h-[18px] w-[18px]" />
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Drag an image here or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP · up to 2 MB
                  </p>
                </div>
              )}
              <input
                id="image"
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileInput}
                className="hidden"
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Required
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || !isDirty}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:flex-none"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[168px] sm:flex-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create subcategory"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}