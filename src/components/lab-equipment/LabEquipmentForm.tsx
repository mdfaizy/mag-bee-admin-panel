// "use client";

// import React, {
//   ChangeEvent,
//   DragEvent,
//   FormEvent,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   AlertCircle,
//   Check,
//   CheckCircle2,
//   ChevronDown,
//   ChevronRight,
//   Circle,
//   FlaskConical,
//   Image as ImageIcon,
//   Info,
//   ListChecks,
//   Loader2,
//   Plus,
//   RotateCcw,
//   Search,
//   FileText,
//   Sparkles,
//   Star,
//   Trash2,
//   UploadCloud,
//   X,
// } from "lucide-react";
// import RichTextEditor from "@/components/form/input/RichTextEditor";
// import { createLabEquipmentAPI } from "@/services/labEquipmentService";
// import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// import { fetchProductCategory } from "@/services/product-category/categoryService";

// /* ---------------- Types ---------------- */
// interface Category {
//   id: number;
//   name: string;
// }

// interface SubCategory {
//   id: number;
//   name: string;
//   categoryId?: number;
//   parentId?: number | null;
//   parent?: {
//     id: number;
//   } | null;
//   category?: {
//     id: number;
//   };
// }

// interface Specification {
//   id: number;
//   label: string;
//   value: string;
// }

// interface ImageItem {
//   id: string;
//   file: File;
//   url: string;
// }

// interface FormDataState {
//   name: string;
//   productCode: string;
//   categoryId: string;
//   subCategoryId: string;
//   manufacturer: string;
//   modelNumber: string;
//   origin: string;
//   standards: string;
//   description: string;
//   metaTitle: string;
//   metaDescription: string;
//   isActive: boolean;
//   isFeatured: boolean;
// }

// type FormErrors = Partial<Record<"name" | "productCode" | "categoryId", string>>;

// interface ToastState {
//   type: "success" | "error";
//   message: string;
// }

// /* ---------------- Constants ---------------- */
// const initialFormData: FormDataState = {
//   name: "",
//   productCode: "",
//   categoryId: "",
//   subCategoryId: "",
//   manufacturer: "",
//   modelNumber: "",
//   origin: "",
//   standards: "",
//   description: "",
//   metaTitle: "",
//   metaDescription: "",
//   isActive: true,
//   isFeatured: false,
// };

// const MAX_IMAGES = 8;
// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// const META_TITLE_LIMIT = 60;
// const META_DESC_LIMIT = 160;

// const SPEC_SUGGESTIONS = [
//   "Capacity",
//   "Power",
//   "Voltage",
//   "Dimensions",
//   "Weight",
//   "Accuracy",
//   "Temperature Range",
//   "Warranty",
// ];

// /* ---------------- Helpers ---------------- */
// const stripHtml = (html: string) =>
//   html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

// const slugify = (text: string) =>
//   text
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "");

// const generateProductCode = (name: string) => {
//   const prefix =
//     name
//       .trim()
//       .split(/\s+/)
//       .filter(Boolean)
//       .slice(0, 3)
//       .map((w) => w[0])
//       .join("")
//       .toUpperCase() || "LAB";
//   return `LAB-${prefix}-${Math.floor(100 + Math.random() * 900)}`;
// };

// const formatBytes = (bytes: number) =>
//   bytes < 1024 * 1024
//     ? `${Math.round(bytes / 1024)} KB`
//     : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// /* ---------------- Shared styles ---------------- */
// const inputBase =
//   "w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

// const inputClass = (hasError?: boolean) =>
//   `${inputBase} ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : "border-gray-200"}`;

// /* ---------------- Reusable UI ---------------- */
// const Field = ({
//   label,
//   htmlFor,
//   required,
//   hint,
//   error,
//   action,
//   children,
// }: {
//   label: string;
//   htmlFor?: string;
//   required?: boolean;
//   hint?: string;
//   error?: string;
//   action?: React.ReactNode;
//   children: React.ReactNode;
// }) => (
//   <div>
//     <div className="mb-1.5 flex items-center justify-between gap-2">
//       <label htmlFor={htmlFor} className="text-[13px] font-medium text-gray-700">
//         {label}
//         {required && <span className="ml-0.5 text-red-500">*</span>}
//       </label>
//       {action}
//     </div>
//     {children}
//     {error ? (
//       <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
//         <AlertCircle className="h-3.5 w-3.5 shrink-0" />
//         {error}
//       </p>
//     ) : hint ? (
//       <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
//     ) : null}
//   </div>
// );

// const Card = ({
//   title,
//   description,
//   icon,
//   aside,
//   children,
// }: {
//   title: string;
//   description?: string;
//   icon: React.ReactNode;
//   aside?: React.ReactNode;
//   children: React.ReactNode;
// }) => (
//   <section className="rounded-[10px] border border-gray-200 bg-white">
//     <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 py-4">
//       <div className="flex items-start gap-3">
//         <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600">
//           {icon}
//         </span>
//         <div>
//           <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
//           {description && (
//             <p className="mt-0.5 text-[13px] text-gray-500">{description}</p>
//           )}
//         </div>
//       </div>
//       {aside}
//     </header>
//     <div className="p-5">{children}</div>
//   </section>
// );

// const Toggle = ({
//   checked,
//   onChange,
//   label,
//   description,
// }: {
//   checked: boolean;
//   onChange: (value: boolean) => void;
//   label: string;
//   description: string;
// }) => (
//   <div className="flex items-center justify-between gap-4">
//     <div>
//       <p className="text-sm font-medium text-gray-900">{label}</p>
//       <p className="text-xs text-gray-500">{description}</p>
//     </div>
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       aria-label={label}
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 ${
//         checked ? "bg-blue-600" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
//           checked ? "translate-x-[22px]" : "translate-x-0.5"
//         }`}
//       />
//     </button>
//   </div>
// );

// const CharCounter = ({ value, limit }: { value: number; limit: number }) => {
//   const over = value > limit;
//   const near = value > limit * 0.9;
//   return (
//     <span
//       className={`text-xs tabular-nums ${
//         over ? "text-red-600" : near ? "text-amber-600" : "text-gray-400"
//       }`}
//     >
//       {value}/{limit}
//     </span>
//   );
// };

// /* ---------------- Main component ---------------- */
// const LabEquipmentForm = () => {
//   const [formData, setFormData] = useState<FormDataState>(initialFormData);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [categories, setCategories] = useState<Category[]>([]);
//   // const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
// const [selectedSubCategoryPath, setSelectedSubCategoryPath] = useState<string[]>([]);
//   const [specifications, setSpecifications] = useState<Specification[]>([
//     { id: 0, label: "", value: "" },
//   ]);
//   const [images, setImages] = useState<ImageItem[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [loadingSubCategories, setLoadingSubCategories] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [toast, setToast] = useState<ToastState | null>(null);

//   const specIdRef = useRef(1);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const imagesRef = useRef<ImageItem[]>([]);
//   imagesRef.current = images;

//   /* ---- Toast ---- */
//   const showToast = useCallback((type: ToastState["type"], message: string) => {
//     setToast({ type, message });
//   }, []);

//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 4000);
//     return () => clearTimeout(t);
//   }, [toast]);

//   /* ---- Fetch categories ---- */
//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoadingCategories(true);
//         const response = await fetchProductCategory();
//         setCategories(
//           response.map((item: any) => ({ id: item.id, name: item.name }))
//         );
//       } catch (error) {
//         console.error("Category fetch error:", error);
//         showToast("error", "Could not load categories. Please refresh.");
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     load();
//   }, [showToast]);

//   /* ---- Fetch subcategories ---- */
//  /* ---- Fetch subcategories ---- */
// /* ---- Fetch all subcategories ---- */
// useEffect(() => {
//   const load = async () => {
//     try {
//       setLoadingSubCategories(true);

//       const response = await fetchSubCategoryAll();

//       const all = Array.isArray(response)
//         ? response
//         : response?.subCategories || [];

//       setAllSubCategories(all);
//     } catch (error) {
//       console.error("Subcategory fetch error:", error);
//       setAllSubCategories([]);
//     } finally {
//       setLoadingSubCategories(false);
//     }
//   };

//   load();
// }, []);

//   /* ---- Revoke object URLs only on unmount ---- */
//   useEffect(() => {
//     return () => {
//       imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
//     };
//   }, []);

//   /* ---- Derived state ---- */
//   const isDirty = useMemo(
//     () =>
//       JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
//       images.length > 0 ||
//       specifications.some((s) => s.label || s.value),
//     [formData, images, specifications]
//   );

//   useEffect(() => {
//     if (!isDirty) return;
//     const handler = (e: BeforeUnloadEvent) => {
//       e.preventDefault();
//       e.returnValue = "";
//     };
//     window.addEventListener("beforeunload", handler);
//     return () => window.removeEventListener("beforeunload", handler);
//   }, [isDirty]);

//   const filledSpecs = specifications.filter(
//     (s) => s.label.trim() && s.value.trim()
//   );

//   const checklist = [
//     { label: "Name & product code", done: !!formData.name.trim() && !!formData.productCode.trim() },
//     { label: "Category selected", done: !!formData.categoryId },
//     { label: "Description added", done: stripHtml(formData.description).length > 0 },
//     { label: "At least 1 specification", done: filledSpecs.length > 0 },
//     { label: "At least 1 image", done: images.length > 0 },
//     { label: "SEO title & description", done: !!formData.metaTitle.trim() && !!formData.metaDescription.trim() },
//   ];
//   const completed = checklist.filter((c) => c.done).length;
//   const progress = Math.round((completed / checklist.length) * 100);

//   const selectedCategory = categories.find(
//     (c) => String(c.id) === formData.categoryId
//   );

//   /* ---- Handlers ---- */
//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

// const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
//   const categoryId = e.target.value;

//   setFormData((prev) => ({
//     ...prev,
//     categoryId,
//     subCategoryId: "",
//   }));

//   setSelectedSubCategoryPath([]);

//   setErrors((prev) => ({
//     ...prev,
//     categoryId: undefined,
//   }));
// };

// const handleNestedSubCategoryChange = (
//   level: number,
//   value: string
// ) => {
//   const newPath = selectedSubCategoryPath.slice(0, level);

//   if (value) {
//     newPath.push(value);
//   }

//   setSelectedSubCategoryPath(newPath);

//   const finalSubCategoryId = newPath.length
//     ? newPath[newPath.length - 1]
//     : "";

//   setFormData((prev) => ({
//     ...prev,
//     subCategoryId: finalSubCategoryId,
//   }));
// };

// const getSubCategoryOptions = (level: number) => {
//   const categoryId = Number(formData.categoryId);

//   if (!categoryId) return [];

//   const parentId =
//     level === 0
//       ? null
//       : Number(selectedSubCategoryPath[level - 1]);

//   return allSubCategories.filter((item: any) => {
//     const itemCategoryId =
//       item.categoryId ?? item.category?.id;

//     const itemParentId =
//       item.parentId ?? item.parent?.id ?? null;

//     return (
//       Number(itemCategoryId) === categoryId &&
//       (parentId === null
//         ? itemParentId === null
//         : Number(itemParentId) === parentId)
//     );
//   });
// };
//   /* Specifications */
//   const addSpecification = (label = "") => {
//     setSpecifications((prev) => {
//       // reuse the single empty row instead of stacking blanks
//       if (prev.length === 1 && !prev[0].label && !prev[0].value && label) {
//         return [{ ...prev[0], label }];
//       }
//       return [...prev, { id: specIdRef.current++, label, value: "" }];
//     });
//   };

//   const updateSpecification = (
//     id: number,
//     field: "label" | "value",
//     value: string
//   ) =>
//     setSpecifications((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
//     );

//   const removeSpecification = (id: number) =>
//     setSpecifications((prev) =>
//       prev.length === 1
//         ? [{ ...prev[0], label: "", value: "" }]
//         : prev.filter((s) => s.id !== id)
//     );

//   /* Images */
//   const addFiles = (files: File[]) => {
//     if (!files.length) return;

//     const valid: File[] = [];
//     for (const file of files) {
//       if (!file.type.startsWith("image/")) {
//         showToast("error", `${file.name} is not an image file.`);
//         continue;
//       }
//       if (file.size > MAX_IMAGE_SIZE) {
//         showToast("error", `${file.name} is larger than 5 MB.`);
//         continue;
//       }
//       valid.push(file);
//     }

//     const slots = MAX_IMAGES - images.length;
//     if (valid.length > slots) {
//       showToast("error", `Only ${MAX_IMAGES} images allowed. Extra files were skipped.`);
//     }

//     const toAdd = valid.slice(0, Math.max(slots, 0)).map((file) => ({
//       id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
//       file,
//       url: URL.createObjectURL(file),
//     }));
//     if (toAdd.length) setImages((prev) => [...prev, ...toAdd]);
//   };

//   const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
//     addFiles(Array.from(e.target.files || []));
//     e.target.value = "";
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setDragging(false);
//     addFiles(Array.from(e.dataTransfer.files || []));
//   };

//   const removeImage = (id: string) => {
//     setImages((prev) => {
//       const target = prev.find((i) => i.id === id);
//       if (target) URL.revokeObjectURL(target.url);
//       return prev.filter((i) => i.id !== id);
//     });
//   };

//   const makePrimary = (id: string) =>
//     setImages((prev) => {
//       const target = prev.find((i) => i.id === id);
//       return target ? [target, ...prev.filter((i) => i.id !== id)] : prev;
//     });

//   /* Reset */

// const resetForm = () => {
//   images.forEach((img) => URL.revokeObjectURL(img.url));

//   setFormData(initialFormData);
//   setSpecifications([
//     { id: specIdRef.current++, label: "", value: "" },
//   ]);
//   setImages([]);
//   setSelectedSubCategoryPath([]);
//   setErrors({});
// };

//   const handleDiscard = () => {
//     if (isDirty && !window.confirm("Discard all changes on this form?")) return;
//     resetForm();
//   };

//   /* Submit */
//   const validate = (): boolean => {
//     const next: FormErrors = {};
//     if (!formData.name.trim()) next.name = "Enter the equipment name.";
//     if (!formData.productCode.trim()) next.productCode = "Enter a product code.";
//     if (!formData.categoryId) next.categoryId = "Select a category.";
//     setErrors(next);

//     const firstKey = Object.keys(next)[0];
//     if (firstKey) {
//       document.getElementById(firstKey)?.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//       document.getElementById(firstKey)?.focus({ preventScroll: true });
//     }
//     return !firstKey;
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (submitting) return;
//     if (!validate()) {
//       showToast("error", "Please fix the highlighted fields.");
//       return;
//     }

//     const validSpecifications = filledSpecs.map((item, index) => ({
//       label: item.label.trim(),
//       value: item.value.trim(),
//       sortOrder: index,
//     }));

//     try {
//       setSubmitting(true);
//       const payload = new window.FormData();

//       payload.append("name", formData.name.trim());
//       payload.append("productCode", formData.productCode.trim());
//       payload.append("categoryId", formData.categoryId);
//       if (formData.subCategoryId)
//         payload.append("subCategoryId", formData.subCategoryId);

//       payload.append("manufacturer", formData.manufacturer);
//       payload.append("modelNumber", formData.modelNumber);
//       payload.append("origin", formData.origin);
//       payload.append("standards", formData.standards);
//       payload.append("description", formData.description);
//       payload.append("metaTitle", formData.metaTitle);
//       payload.append("metaDescription", formData.metaDescription);
//       payload.append("isActive", String(formData.isActive));
//       payload.append("isFeatured", String(formData.isFeatured));
//       payload.append("specifications", JSON.stringify(validSpecifications));

//       images.forEach((image) => payload.append("images", image.file));

//       const response = await createLabEquipmentAPI(payload);
//       showToast(
//         "success",
//         response?.data?.message || "Lab equipment created successfully."
//       );
//       resetForm();
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (error: any) {
//       console.error("Create Lab Equipment Error:", error?.response?.data || error);
//       showToast(
//         "error",
//         error?.response?.data?.message || "Could not create lab equipment."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ---------------- Render ---------------- */
//   const serpTitle = formData.metaTitle || formData.name || "Equipment title";
//   const serpSlug = slugify(formData.name) || "equipment-name";
//   const serpDesc =
//     formData.metaDescription ||
//     "Your meta description will appear here. Write 120–160 characters that describe this equipment.";

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Toast */}
//       {toast && (
//         <div
//           role="status"
//           aria-live="polite"
//           className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-2.5 rounded-[10px] border bg-white px-4 py-3 text-sm shadow-md ${
//             toast.type === "success" ? "border-emerald-200" : "border-red-200"
//           }`}
//         >
//           {toast.type === "success" ? (
//             <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
//           ) : (
//             <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
//           )}
//           <p className="text-gray-800">{toast.message}</p>
//           <button
//             type="button"
//             onClick={() => setToast(null)}
//             className="ml-1 text-gray-400 hover:text-gray-600"
//             aria-label="Dismiss"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>
//         {/* Sticky header */}
//         <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
//           <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
//             <div className="min-w-0">
//               <nav
//                 aria-label="Breadcrumb"
//                 className="flex items-center gap-1 text-xs text-gray-500"
//               >
//                 <span>Catalog</span>
//                 <ChevronRight className="h-3 w-3" />
//                 <span>Lab Equipment</span>
//                 <ChevronRight className="h-3 w-3" />
//                 <span className="text-gray-700">New</span>
//               </nav>
//               <div className="mt-0.5 flex items-center gap-2.5">
//                 <h1 className="truncate text-lg font-semibold text-gray-900">
//                   {formData.name.trim() || "New lab equipment"}
//                 </h1>
//                 <span
//                   className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
//                     formData.isActive
//                       ? "bg-emerald-50 text-emerald-700"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   <span
//                     className={`h-1.5 w-1.5 rounded-full ${
//                       formData.isActive ? "bg-emerald-500" : "bg-gray-400"
//                     }`}
//                   />
//                   {formData.isActive ? "Active" : "Inactive"}
//                 </span>
//                 {isDirty && (
//                   <span className="hidden text-xs text-gray-400 sm:inline">
//                     Unsaved changes
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="flex shrink-0 gap-2">
//               <button
//                 type="button"
//                 onClick={handleDiscard}
//                 disabled={submitting || !isDirty}
//                 className="inline-flex items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <RotateCcw className="h-4 w-4" />
//                 Discard
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="inline-flex min-w-[148px] items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving…
//                   </>
//                 ) : (
//                   "Save equipment"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
//           {/* ---------- Main column ---------- */}
//           <div className="space-y-6">
//             <Card
//               title="Basic information"
//               description="Name, code and manufacturer details"
//               icon={<Info className="h-[18px] w-[18px]" />}
//             >
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div className="md:col-span-2">
//                   <Field
//                     label="Equipment name"
//                     htmlFor="name"
//                     required
//                     error={errors.name}
//                   >
//                     <input
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="e.g. Digital Microscope MX-500"
//                       className={inputClass(!!errors.name)}
//                       autoComplete="off"
//                     />
//                   </Field>
//                 </div>

//                 <Field
//                   label="Product code"
//                   htmlFor="productCode"
//                   required
//                   error={errors.productCode}
//                   action={
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData((p) => ({
//                           ...p,
//                           productCode: generateProductCode(p.name),
//                         }));
//                         setErrors((p) => ({ ...p, productCode: undefined }));
//                       }}
//                       className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
//                     >
//                       <Sparkles className="h-3 w-3" />
//                       Generate
//                     </button>
//                   }
//                 >
//                   <input
//                     id="productCode"
//                     name="productCode"
//                     value={formData.productCode}
//                     onChange={handleChange}
//                     placeholder="e.g. LAB-MIC-001"
//                     className={`${inputClass(!!errors.productCode)} font-mono`}
//                     autoComplete="off"
//                   />
//                 </Field>

//                 <Field label="Model number" htmlFor="modelNumber">
//                   <input
//                     id="modelNumber"
//                     name="modelNumber"
//                     value={formData.modelNumber}
//                     onChange={handleChange}
//                     placeholder="e.g. MX-500"
//                     className={inputClass()}
//                   />
//                 </Field>

//                 <Field label="Manufacturer" htmlFor="manufacturer">
//                   <input
//                     id="manufacturer"
//                     name="manufacturer"
//                     value={formData.manufacturer}
//                     onChange={handleChange}
//                     placeholder="e.g. Olympus"
//                     className={inputClass()}
//                   />
//                 </Field>

//                 <Field label="Country of origin" htmlFor="origin">
//                   <input
//                     id="origin"
//                     name="origin"
//                     value={formData.origin}
//                     onChange={handleChange}
//                     placeholder="e.g. Germany, Japan, India"
//                     className={inputClass()}
//                   />
//                 </Field>

//                 <div className="md:col-span-2">
//                   <Field
//                     label="Standards & certifications"
//                     htmlFor="standards"
//                     hint="Separate multiple standards with commas."
//                   >
//                     <input
//                       id="standards"
//                       name="standards"
//                       value={formData.standards}
//                       onChange={handleChange}
//                       placeholder="e.g. ISO 9001, CE, BIS"
//                       className={inputClass()}
//                     />
//                   </Field>
//                 </div>
//               </div>
//             </Card>

//             <Card
//               title="Description"
//               description="Shown on the product page"
//               icon={<FileText className="h-[18px] w-[18px]" />}
//             >
//               <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white transition-colors focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15">
//                 <RichTextEditor
//                   value={formData.description}
//                   onChange={(value: string) =>
//                     setFormData((prev) => ({ ...prev, description: value }))
//                   }
//                 />
//               </div>
//             </Card>

//             <Card
//               title="Technical specifications"
//               description="Shown as a table on the product page"
//               icon={<ListChecks className="h-[18px] w-[18px]" />}
//               aside={
//                 <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
//                   {filledSpecs.length} added
//                 </span>
//               }
//             >
//               {/* Quick add */}
//               <div className="mb-4">
//                 <p className="mb-2 text-xs text-gray-500">Quick add</p>
//                 <div className="flex flex-wrap gap-2">
//                   {SPEC_SUGGESTIONS.filter(
//                     (s) =>
//                       !specifications.some(
//                         (sp) => sp.label.trim().toLowerCase() === s.toLowerCase()
//                       )
//                   ).map((s) => (
//                     <button
//                       key={s}
//                       type="button"
//                       onClick={() => addSpecification(s)}
//                       className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
//                     >
//                       <Plus className="h-3 w-3" />
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="overflow-hidden rounded-[10px] border border-gray-200">
//                 <div className="hidden grid-cols-[1fr_1fr_40px] gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 md:grid">
//                   <span>Name</span>
//                   <span>Value</span>
//                   <span className="sr-only">Actions</span>
//                 </div>
//                 <ul className="divide-y divide-gray-200">
//                   {specifications.map((spec, index) => (
//                     <li
//                       key={spec.id}
//                       className="grid grid-cols-1 gap-2 p-3 md:grid-cols-[1fr_1fr_40px] md:items-center md:gap-3"
//                     >
//                       <input
//                         aria-label={`Specification ${index + 1} name`}
//                         value={spec.label}
//                         onChange={(e) =>
//                           updateSpecification(spec.id, "label", e.target.value)
//                         }
//                         placeholder="e.g. Capacity"
//                         className={inputClass()}
//                       />
//                       <input
//                         aria-label={`Specification ${index + 1} value`}
//                         value={spec.value}
//                         onChange={(e) =>
//                           updateSpecification(spec.id, "value", e.target.value)
//                         }
//                         placeholder="e.g. 500 ml"
//                         className={inputClass()}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeSpecification(spec.id)}
//                         aria-label={`Remove specification ${index + 1}`}
//                         className="flex h-10 w-10 items-center justify-center rounded-[10px] text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => addSpecification()}
//                 className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] border border-dashed border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add specification
//               </button>
//             </Card>

//             <Card
//               title="Search engine listing"
//               description="Preview how this product looks on Google"
//               icon={<Search className="h-[18px] w-[18px]" />}
//             >
//               {/* Live SERP preview */}
//               <div className="mb-5 rounded-[10px] border border-gray-200 bg-gray-50 p-4">
//                 <p className="truncate text-xs text-gray-500">
//                   yourstore.com › lab-equipment › {serpSlug}
//                 </p>
//                 <p className="mt-1 truncate text-[17px] leading-snug text-[#1a0dab]">
//                   {serpTitle}
//                 </p>
//                 <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-600">
//                   {serpDesc}
//                 </p>
//               </div>

//               <div className="space-y-5">
//                 <Field
//                   label="Meta title"
//                   htmlFor="metaTitle"
//                   action={
//                     <CharCounter
//                       value={formData.metaTitle.length}
//                       limit={META_TITLE_LIMIT}
//                     />
//                   }
//                 >
//                   <input
//                     id="metaTitle"
//                     name="metaTitle"
//                     value={formData.metaTitle}
//                     onChange={handleChange}
//                     placeholder={formData.name || "Enter SEO title"}
//                     className={inputClass(formData.metaTitle.length > META_TITLE_LIMIT)}
//                   />
//                 </Field>

//                 <Field
//                   label="Meta description"
//                   htmlFor="metaDescription"
//                   action={
//                     <CharCounter
//                       value={formData.metaDescription.length}
//                       limit={META_DESC_LIMIT}
//                     />
//                   }
//                 >
//                   <textarea
//                     id="metaDescription"
//                     name="metaDescription"
//                     rows={3}
//                     value={formData.metaDescription}
//                     onChange={handleChange}
//                     placeholder="Write a short summary that makes people want to click"
//                     className={`${inputClass(
//                       formData.metaDescription.length > META_DESC_LIMIT
//                     )} resize-none`}
//                   />
//                 </Field>
//               </div>
//             </Card>
//           </div>

//           {/* ---------- Sidebar ---------- */}
//           <aside className="space-y-6 lg:sticky lg:top-[88px] lg:self-start">
//             {/* Completion */}
//             <section className="rounded-[10px] border border-gray-200 bg-white p-5">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-sm font-semibold text-gray-900">
//                   Listing completeness
//                 </h2>
//                 <span className="text-sm font-semibold tabular-nums text-gray-900">
//                   {progress}%
//                 </span>
//               </div>
//               <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
//                 <div
//                   className={`h-full rounded-full transition-all duration-300 ${
//                     progress === 100 ? "bg-emerald-500" : "bg-blue-600"
//                   }`}
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <ul className="mt-4 space-y-2">
//                 {checklist.map((item) => (
//                   <li
//                     key={item.label}
//                     className="flex items-center gap-2 text-[13px]"
//                   >
//                     {item.done ? (
//                       <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
//                     ) : (
//                       <Circle className="h-4 w-4 shrink-0 text-gray-300" />
//                     )}
//                     <span className={item.done ? "text-gray-500" : "text-gray-800"}>
//                       {item.label}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             {/* Visibility */}
//             <section className="rounded-[10px] border border-gray-200 bg-white p-5">
//               <h2 className="mb-4 text-sm font-semibold text-gray-900">
//                 Visibility
//               </h2>
//               <div className="space-y-4">
//                 <Toggle
//                   label="Active"
//                   description="Visible on the storefront"
//                   checked={formData.isActive}
//                   onChange={(v) => setFormData((p) => ({ ...p, isActive: v }))}
//                 />
//                 <div className="border-t border-gray-100" />
//                 <Toggle
//                   label="Featured"
//                   description="Highlight on the homepage"
//                   checked={formData.isFeatured}
//                   onChange={(v) => setFormData((p) => ({ ...p, isFeatured: v }))}
//                 />
//               </div>
//             </section>

//             {/* Organization */}
//             <section className="rounded-[10px] border border-gray-200 bg-white p-5">
//               <h2 className="mb-4 text-sm font-semibold text-gray-900">
//                 Organization
//               </h2>
//               <div className="space-y-4">
//                 <Field
//                   label="Category"
//                   htmlFor="categoryId"
//                   required
//                   error={errors.categoryId}
//                 >
//                   <div className="relative">
//                     <select
//                       id="categoryId"
//                       name="categoryId"
//                       value={formData.categoryId}
//                       onChange={handleCategoryChange}
//                       disabled={loadingCategories}
//                       className={`${inputClass(!!errors.categoryId)} appearance-none pr-9`}
//                     >
//                       <option value="">
//                         {loadingCategories ? "Loading…" : "Select category"}
//                       </option>
//                       {categories.map((item) => (
//                         <option key={item.id} value={item.id}>
//                           {item.name}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                   </div>
//                 </Field>

//                 {/* <Field
//                   label="Subcategory"
//                   htmlFor="subCategoryId"
//                   hint={
//                     !formData.categoryId
//                       ? "Select a category first."
//                       : !loadingSubCategories && subCategories.length === 0
//                       ? `No subcategories under ${selectedCategory?.name ?? "this category"}.`
//                       : undefined
//                   }
//                 >
//                   <div className="relative">
//                     <select
//                       id="subCategoryId"
//                       name="subCategoryId"
//                       value={formData.subCategoryId}
//                       onChange={handleChange}
//                       disabled={!formData.categoryId || loadingSubCategories}
//                       className={`${inputClass()} appearance-none pr-9`}
//                     >
//                       <option value="">
//                         {loadingSubCategories ? "Loading…" : "Select subcategory"}
//                       </option>
//                       {subCategories.map((item) => (
//                         <option key={item.id} value={item.id}>
//                           {item.name}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//                   </div>
//                 </Field> */}

//                 {/* Nested Subcategories */}
// <div className="space-y-4">
//   {Array.from(
//     { length: selectedSubCategoryPath.length + 1 },
//     (_, level) => {
//       const options = getSubCategoryOptions(level);

//       if (options.length === 0) return null;

//       return (
//         <Field
//           key={level}
//           label={
//             level === 0
//               ? "Subcategory"
//               : `Child Subcategory ${level}`
//           }
//         >
//           <div className="relative">
//             <select
//               value={selectedSubCategoryPath[level] || ""}
//               onChange={(e) =>
//                 handleNestedSubCategoryChange(
//                   level,
//                   e.target.value
//                 )
//               }
//               className={`${inputClass()} appearance-none pr-9`}
//             >
//               <option value="">
//                 {level === 0
//                   ? "Select subcategory"
//                   : "Select child subcategory"}
//               </option>

//               {options.map((item) => (
//                 <option key={item.id} value={item.id}>
//                   {item.name}
//                 </option>
//               ))}
//             </select>

//             <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           </div>
//         </Field>
//       );
//     }
//   )}
// </div>
//               </div>
//             </section>

//             {/* Images */}
//             <section className="rounded-[10px] border border-gray-200 bg-white p-5">
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
//                   <ImageIcon className="h-4 w-4 text-gray-500" />
//                   Images
//                 </h2>
//                 <span className="text-xs tabular-nums text-gray-500">
//                   {images.length}/{MAX_IMAGES}
//                 </span>
//               </div>

//               <div
//                 onDragOver={(e) => {
//                   e.preventDefault();
//                   setDragging(true);
//                 }}
//                 onDragLeave={() => setDragging(false)}
//                 onDrop={handleDrop}
//                 className={`rounded-[10px] border border-dashed p-5 text-center transition-colors ${
//                   dragging
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-300 bg-gray-50 hover:border-gray-400"
//                 }`}
//               >
//                 <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600">
//                   <UploadCloud className="h-[18px] w-[18px]" />
//                 </span>
//                 <p className="text-sm text-gray-700">
//                   Drag images here or{" "}
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={images.length >= MAX_IMAGES}
//                     className="font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
//                   >
//                     browse
//                   </button>
//                 </p>
//                 <p className="mt-1 text-xs text-gray-500">
//                   PNG, JPG or WEBP · up to 5 MB each
//                 </p>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={handleFileInput}
//                   className="hidden"
//                 />
//               </div>

//               {images.length > 0 && (
//                 <ul className="mt-4 grid grid-cols-2 gap-3">
//                   {images.map((img, index) => (
//                     <li
//                       key={img.id}
//                       className={`group relative overflow-hidden rounded-[10px] border bg-gray-50 ${
//                         index === 0 ? "col-span-2 border-blue-600" : "border-gray-200"
//                       }`}
//                     >
//                       <img
//                         src={img.url}
//                         alt={`Equipment preview ${index + 1}`}
//                         className={`w-full object-cover ${
//                           index === 0 ? "h-44" : "h-24"
//                         }`}
//                       />
//                       {index === 0 && (
//                         <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
//                           <Star className="h-3 w-3 fill-current" />
//                           Primary
//                         </span>
//                       )}
//                       <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-white/95 px-2 py-1.5 text-[11px] text-gray-600">
//                         <span className="truncate">
//                           {formatBytes(img.file.size)}
//                         </span>
//                         <div className="flex items-center gap-1">
//                           {index !== 0 && (
//                             <button
//                               type="button"
//                               onClick={() => makePrimary(img.id)}
//                               className="rounded px-1.5 py-0.5 font-medium text-blue-600 hover:bg-blue-50"
//                             >
//                               Make primary
//                             </button>
//                           )}
//                           <button
//                             type="button"
//                             onClick={() => removeImage(img.id)}
//                             aria-label="Remove image"
//                             className="rounded p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
//                           >
//                             <X className="h-3.5 w-3.5" />
//                           </button>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </section>
//           </aside>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LabEquipmentForm;


"use client";

import React, {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Image as ImageIcon,
  Info,
  ListChecks,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  FileText,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import RichTextEditor from "@/components/form/input/RichTextEditor";
import { createLabEquipmentAPI } from "@/services/labEquipmentService";
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { fetchProductCategory } from "@/services/product-category/categoryService";

/* ---------------- Types ---------------- */
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId?: number;
  parentId?: number | null;
  parent?: {
    id: number;
  } | null;
  category?: {
    id: number;
  };
}

interface Specification {
  id: number;
  label: string;
  value: string;
}

interface ImageItem {
  id: string;
  file: File;
  url: string;
}

interface FormDataState {
  name: string;
  productCode: string;
  categoryId: string;
  subCategoryId: string;
  manufacturer: string;
  modelNumber: string;
  origin: string;
  standards: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  isFeatured: boolean;
}

type FormErrors = Partial<Record<"name" | "productCode" | "categoryId", string>>;

interface ToastState {
  type: "success" | "error";
  message: string;
}

/* ---------------- Constants ---------------- */
const initialFormData: FormDataState = {
  name: "",
  productCode: "",
  categoryId: "",
  subCategoryId: "",
  manufacturer: "",
  modelNumber: "",
  origin: "",
  standards: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  isActive: true,
  isFeatured: false,
};

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const META_TITLE_LIMIT = 60;
const META_DESC_LIMIT = 160;

const SPEC_SUGGESTIONS = [
  "Capacity",
  "Power",
  "Voltage",
  "Dimensions",
  "Weight",
  "Accuracy",
  "Temperature Range",
  "Warranty",
];

/* ---------------- Helpers ---------------- */
const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const generateProductCode = (name: string) => {
  const prefix =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "LAB";
  return `LAB-${prefix}-${Math.floor(100 + Math.random() * 900)}`;
};

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* ---------------- Shared styles ---------------- */
const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 dark:disabled:bg-slate-900";

const inputClass = (hasError?: boolean) =>
  `${inputBase} ${
    hasError
      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-800"
      : "border-slate-200 dark:border-slate-800"
  }`;

/* ---------------- Reusable UI ---------------- */
const Field = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  action,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {action}
    </div>
    {children}
    {error ? (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>{error}</span>
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        {hint}
      </p>
    ) : null}
  </div>
);

const Card = ({
  title,
  description,
  icon,
  aside,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
    <header className="flex items-start justify-between gap-3 border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {icon}
        </span>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100 sm:text-sm">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {aside}
    </header>
    <div className="p-5">{children}</div>
  </section>
);

const Toggle = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 sm:text-sm">
        {label}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
        checked
          ? "bg-slate-900 dark:bg-brand-500"
          : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-2xs transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const CharCounter = ({ value, limit }: { value: number; limit: number }) => {
  const over = value > limit;
  const near = value > limit * 0.9;
  return (
    <span
      className={`text-xs tabular-nums ${
        over
          ? "font-semibold text-rose-600 dark:text-rose-400"
          : near
            ? "text-amber-600 dark:text-amber-400"
            : "text-slate-400 dark:text-slate-500"
      }`}
    >
      {value}/{limit}
    </span>
  );
};

/* ---------------- Main component ---------------- */
const LabEquipmentForm = () => {
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategoryPath, setSelectedSubCategoryPath] = useState<
    string[]
  >([]);
  const [specifications, setSpecifications] = useState<Specification[]>([
    { id: 0, label: "", value: "" },
  ]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const specIdRef = useRef(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImageItem[]>([]);
  imagesRef.current = images;

  const showToast = useCallback(
    (type: ToastState["type"], message: string) => {
      setToast({ type, message });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetchProductCategory();
        setCategories(
          response.map((item: any) => ({ id: item.id, name: item.name }))
        );
      } catch (error) {
        console.error("Category fetch error:", error);
        showToast("error", "Could not load categories. Please refresh.");
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, [showToast]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSubCategories(true);
        const response = await fetchSubCategoryAll();
        const all = Array.isArray(response)
          ? response
          : response?.subCategories || [];
        setAllSubCategories(all);
      } catch (error) {
        console.error("Subcategory fetch error:", error);
        setAllSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const isDirty = useMemo(
    () =>
      JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
      images.length > 0 ||
      specifications.some((s) => s.label || s.value),
    [formData, images, specifications]
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

  const filledSpecs = specifications.filter(
    (s) => s.label.trim() && s.value.trim()
  );

  const checklist = [
    {
      label: "Name & product code",
      done: !!formData.name.trim() && !!formData.productCode.trim(),
    },
    { label: "Category selected", done: !!formData.categoryId },
    {
      label: "Description added",
      done: stripHtml(formData.description).length > 0,
    },
    { label: "At least 1 specification", done: filledSpecs.length > 0 },
    { label: "At least 1 image", done: images.length > 0 },
    {
      label: "SEO title & description",
      done: !!formData.metaTitle.trim() && !!formData.metaDescription.trim(),
    },
  ];
  const completed = checklist.filter((c) => c.done).length;
  const progress = Math.round((completed / checklist.length) * 100);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoryId,
      subCategoryId: "",
    }));
    setSelectedSubCategoryPath([]);
    setErrors((prev) => ({
      ...prev,
      categoryId: undefined,
    }));
  };

  const handleNestedSubCategoryChange = (level: number, value: string) => {
    const newPath = selectedSubCategoryPath.slice(0, level);
    if (value) {
      newPath.push(value);
    }
    setSelectedSubCategoryPath(newPath);
    const finalSubCategoryId = newPath.length
      ? newPath[newPath.length - 1]
      : "";
    setFormData((prev) => ({
      ...prev,
      subCategoryId: finalSubCategoryId,
    }));
  };

  const getSubCategoryOptions = (level: number) => {
    const categoryId = Number(formData.categoryId);
    if (!categoryId) return [];
    const parentId =
      level === 0 ? null : Number(selectedSubCategoryPath[level - 1]);
    return allSubCategories.filter((item: any) => {
      const itemCategoryId = item.categoryId ?? item.category?.id;
      const itemParentId = item.parentId ?? item.parent?.id ?? null;
      return (
        Number(itemCategoryId) === categoryId &&
        (parentId === null
          ? itemParentId === null
          : Number(itemParentId) === parentId)
      );
    });
  };

  const addSpecification = (label = "") => {
    setSpecifications((prev) => {
      if (prev.length === 1 && !prev[0].label && !prev[0].value && label) {
        return [{ ...prev[0], label }];
      }
      return [...prev, { id: specIdRef.current++, label, value: "" }];
    });
  };

  const updateSpecification = (
    id: number,
    field: "label" | "value",
    value: string
  ) =>
    setSpecifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );

  const removeSpecification = (id: number) =>
    setSpecifications((prev) =>
      prev.length === 1
        ? [{ ...prev[0], label: "", value: "" }]
        : prev.filter((s) => s.id !== id)
    );

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    const valid: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        showToast("error", `${file.name} is not an image file.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        showToast("error", `${file.name} is larger than 5 MB.`);
        continue;
      }
      valid.push(file);
    }

    const slots = MAX_IMAGES - images.length;
    if (valid.length > slots) {
      showToast(
        "error",
        `Only ${MAX_IMAGES} images allowed. Extra files were skipped.`
      );
    }

    const toAdd = valid.slice(0, Math.max(slots, 0)).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    if (toAdd.length) setImages((prev) => [...prev, ...toAdd]);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const makePrimary = (id: string) =>
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      return target ? [target, ...prev.filter((i) => i.id !== id)] : prev;
    });

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setFormData(initialFormData);
    setSpecifications([{ id: specIdRef.current++, label: "", value: "" }]);
    setImages([]);
    setSelectedSubCategoryPath([]);
    setErrors({});
  };

  const handleDiscard = () => {
    if (isDirty && !window.confirm("Discard all changes on this form?")) return;
    resetForm();
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.name.trim()) next.name = "Enter the equipment name.";
    if (!formData.productCode.trim()) next.productCode = "Enter a product code.";
    if (!formData.categoryId) next.categoryId = "Select a category.";
    setErrors(next);

    const firstKey = Object.keys(next)[0];
    if (firstKey) {
      document.getElementById(firstKey)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      document.getElementById(firstKey)?.focus({ preventScroll: true });
    }
    return !firstKey;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) {
      showToast("error", "Please fix the highlighted fields.");
      return;
    }

    const validSpecifications = filledSpecs.map((item, index) => ({
      label: item.label.trim(),
      value: item.value.trim(),
      sortOrder: index,
    }));

    try {
      setSubmitting(true);
      const payload = new window.FormData();

      payload.append("name", formData.name.trim());
      payload.append("productCode", formData.productCode.trim());
      payload.append("categoryId", formData.categoryId);
      if (formData.subCategoryId)
        payload.append("subCategoryId", formData.subCategoryId);

      payload.append("manufacturer", formData.manufacturer);
      payload.append("modelNumber", formData.modelNumber);
      payload.append("origin", formData.origin);
      payload.append("standards", formData.standards);
      payload.append("description", formData.description);
      payload.append("metaTitle", formData.metaTitle);
      payload.append("metaDescription", formData.metaDescription);
      payload.append("isActive", String(formData.isActive));
      payload.append("isFeatured", String(formData.isFeatured));
      payload.append("specifications", JSON.stringify(validSpecifications));

      images.forEach((image) => payload.append("images", image.file));

      const response = await createLabEquipmentAPI(payload);
      showToast(
        "success",
        response?.data?.message || "Lab equipment created successfully."
      );
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Create Lab Equipment Error:", error?.response?.data || error);
      showToast(
        "error",
        error?.response?.data?.message || "Could not create lab equipment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const serpTitle = formData.metaTitle || formData.name || "Equipment title";
  const serpSlug = slugify(formData.name) || "equipment-name";
  const serpDesc =
    formData.metaDescription ||
    "Your meta description will appear here. Write 120–160 characters that describe this equipment.";

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-20 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border bg-white px-4 py-3 text-xs shadow-lg dark:bg-slate-900 sm:text-sm ${
            toast.type === "success"
              ? "border-emerald-200 dark:border-emerald-800"
              : "border-rose-200 dark:border-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <p className="text-slate-800 dark:text-slate-200">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Sticky header */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400"
              >
                <span>Catalog</span>
                <ChevronRight className="h-3 w-3" />
                <span>Lab Equipment</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-800 dark:text-slate-200">New</span>
              </nav>
              <div className="mt-0.5 flex flex-wrap items-center gap-2.5">
                <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                  {formData.name.trim() || "New Lab Equipment"}
                </h1>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    formData.isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                      : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      formData.isActive
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
                {isDirty && (
                  <span className="hidden text-xs text-slate-400 dark:text-slate-500 sm:inline">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                disabled={submitting || !isDirty}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Discard</span>
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-[144px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Save Equipment</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          {/* Main column */}
          <div className="space-y-6">
            <Card
              title="Basic Information"
              description="Name, code, and manufacturer details"
              icon={<Info className="h-4 w-4" />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Equipment Name"
                    htmlFor="name"
                    required
                    error={errors.name}
                  >
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Digital Microscope MX-500"
                      className={inputClass(!!errors.name)}
                      autoComplete="off"
                    />
                  </Field>
                </div>

                <Field
                  label="Product Code"
                  htmlFor="productCode"
                  required
                  error={errors.productCode}
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({
                          ...p,
                          productCode: generateProductCode(p.name),
                        }));
                        setErrors((p) => ({ ...p, productCode: undefined }));
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Generate</span>
                    </button>
                  }
                >
                  <input
                    id="productCode"
                    name="productCode"
                    value={formData.productCode}
                    onChange={handleChange}
                    placeholder="e.g. LAB-MIC-001"
                    className={`${inputClass(!!errors.productCode)} font-mono`}
                    autoComplete="off"
                  />
                </Field>

                <Field label="Model Number" htmlFor="modelNumber">
                  <input
                    id="modelNumber"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleChange}
                    placeholder="e.g. MX-500"
                    className={inputClass()}
                  />
                </Field>

                <Field label="Manufacturer" htmlFor="manufacturer">
                  <input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Olympus"
                    className={inputClass()}
                  />
                </Field>

                <Field label="Country of Origin" htmlFor="origin">
                  <input
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="e.g. Germany, Japan, India"
                    className={inputClass()}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field
                    label="Standards & Certifications"
                    htmlFor="standards"
                    hint="Separate multiple standards with commas."
                  >
                    <input
                      id="standards"
                      name="standards"
                      value={formData.standards}
                      onChange={handleChange}
                      placeholder="e.g. ISO 9001, CE, BIS"
                      className={inputClass()}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            <Card
              title="Description"
              description="Shown on the product detail page"
              icon={<FileText className="h-4 w-4" />}
            >
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white transition focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-brand-500 dark:focus-within:ring-brand-500/20">
                <RichTextEditor
                  value={formData.description}
                  onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>
            </Card>

            <Card
              title="Technical Specifications"
              description="Rendered as a specification table on the product page"
              icon={<ListChecks className="h-4 w-4" />}
              aside={
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600 tabular-nums dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {filledSpecs.length} added
                </span>
              }
            >
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Quick add
                </p>
                <div className="flex flex-wrap gap-2">
                  {SPEC_SUGGESTIONS.filter(
                    (s) =>
                      !specifications.some(
                        (sp) => sp.label.trim().toLowerCase() === s.toLowerCase()
                      )
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSpecification(s)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="hidden grid-cols-[1fr_1fr_40px] gap-3 border-b border-slate-200 bg-slate-50/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 md:grid">
                  <span>Name</span>
                  <span>Value</span>
                  <span className="sr-only">Actions</span>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {specifications.map((spec, index) => (
                    <li
                      key={spec.id}
                      className="grid grid-cols-1 gap-2 p-3 md:grid-cols-[1fr_1fr_40px] md:items-center md:gap-3"
                    >
                      <input
                        aria-label={`Specification ${index + 1} name`}
                        value={spec.label}
                        onChange={(e) =>
                          updateSpecification(spec.id, "label", e.target.value)
                        }
                        placeholder="e.g. Capacity"
                        className={inputClass()}
                      />
                      <input
                        aria-label={`Specification ${index + 1} value`}
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(spec.id, "value", e.target.value)
                        }
                        placeholder="e.g. 500 ml"
                        className={inputClass()}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(spec.id)}
                        aria-label={`Remove specification ${index + 1}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => addSpecification()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/50 sm:text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Specification</span>
              </button>
            </Card>

            <Card
              title="Search Engine Listing"
              description="Preview how this equipment appears in search results"
              icon={<Search className="h-4 w-4" />}
            >
              <div className="mb-5 rounded-lg border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  yourstore.com › lab-equipment › {serpSlug}
                </p>
                <p className="mt-1 truncate text-base font-medium leading-snug text-sky-700 dark:text-sky-400">
                  {serpTitle}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {serpDesc}
                </p>
              </div>

              <div className="space-y-5">
                <Field
                  label="Meta Title"
                  htmlFor="metaTitle"
                  action={
                    <CharCounter
                      value={formData.metaTitle.length}
                      limit={META_TITLE_LIMIT}
                    />
                  }
                >
                  <input
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    placeholder={formData.name || "Enter SEO title"}
                    className={inputClass(
                      formData.metaTitle.length > META_TITLE_LIMIT
                    )}
                  />
                </Field>

                <Field
                  label="Meta Description"
                  htmlFor="metaDescription"
                  action={
                    <CharCounter
                      value={formData.metaDescription.length}
                      limit={META_DESC_LIMIT}
                    />
                  }
                >
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={handleChange}
                    placeholder="Write a concise summary for search engines"
                    className={`${inputClass(
                      formData.metaDescription.length > META_DESC_LIMIT
                    )} resize-none`}
                  />
                </Field>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-[84px] lg:self-start">
            {/* Completion */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Listing Completeness
                </h2>
                <span className="text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:text-sm">
                  {progress}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    progress === 100
                      ? "bg-emerald-500"
                      : "bg-slate-900 dark:bg-brand-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-xs"
                  >
                    {item.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    <span
                      className={
                        item.done
                          ? "text-slate-500 dark:text-slate-400"
                          : "font-medium text-slate-800 dark:text-slate-200"
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Visibility */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Visibility
              </h2>
              <div className="space-y-4">
                <Toggle
                  label="Active"
                  description="Visible on the storefront"
                  checked={formData.isActive}
                  onChange={(v) => setFormData((p) => ({ ...p, isActive: v }))}
                />
                <div className="border-t border-slate-100 dark:border-slate-800" />
                <Toggle
                  label="Featured"
                  description="Highlight on the homepage"
                  checked={formData.isFeatured}
                  onChange={(v) =>
                    setFormData((p) => ({ ...p, isFeatured: v }))
                  }
                />
              </div>
            </section>

            {/* Organization */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Organization
              </h2>
              <div className="space-y-4">
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
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                      disabled={loadingCategories}
                      className={`${inputClass(
                        !!errors.categoryId
                      )} appearance-none pr-9`}
                    >
                      <option value="">
                        {loadingCategories ? "Loading…" : "Select category"}
                      </option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>

                {/* Nested Subcategories */}
                <div className="space-y-4">
                  {Array.from(
                    { length: selectedSubCategoryPath.length + 1 },
                    (_, level) => {
                      const options = getSubCategoryOptions(level);
                      if (options.length === 0) return null;

                      return (
                        <Field
                          key={level}
                          label={
                            level === 0
                              ? "Subcategory"
                              : `Child Subcategory ${level}`
                          }
                        >
                          <div className="relative">
                            <select
                              disabled={loadingSubCategories}
                              value={selectedSubCategoryPath[level] || ""}
                              onChange={(e) =>
                                handleNestedSubCategoryChange(
                                  level,
                                  e.target.value
                                )
                              }
                              className={`${inputClass()} appearance-none pr-9`}
                            >
                              <option value="">
                                {level === 0
                                  ? "Select subcategory"
                                  : "Select child subcategory"}
                              </option>

                              {options.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          </div>
                        </Field>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                  <span>Images</span>
                </h2>
                <span className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-xl border border-dashed p-5 text-center transition ${
                  dragging
                    ? "border-slate-900 bg-slate-100 dark:border-brand-500 dark:bg-slate-800/70"
                    : "border-slate-300 bg-slate-50/70 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950/60"
                }`}
              >
                <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <UploadCloud className="h-4 w-4" />
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                  Drag images here or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={images.length >= MAX_IMAGES}
                    className="font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  PNG, JPG, or WEBP · up to 5 MB each
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {images.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {images.map((img, index) => (
                    <li
                      key={img.id}
                      className={`group relative overflow-hidden rounded-xl border bg-slate-50 dark:bg-slate-950 ${
                        index === 0
                          ? "col-span-2 border-slate-900 dark:border-brand-500"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Equipment preview ${index + 1}`}
                        className={`w-full object-cover ${
                          index === 0 ? "h-44" : "h-24"
                        }`}
                      />
                      {index === 0 && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white dark:bg-brand-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span>Primary</span>
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-white/95 px-2.5 py-1.5 text-[11px] text-slate-600 dark:bg-slate-900/95 dark:text-slate-300">
                        <span className="truncate tabular-nums">
                          {formatBytes(img.file.size)}
                        </span>
                        <div className="flex items-center gap-1">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => makePrimary(img.id)}
                              className="rounded px-1.5 py-0.5 font-medium text-slate-800 hover:bg-slate-100 dark:text-brand-400 dark:hover:bg-slate-800"
                            >
                              Make primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            aria-label="Remove image"
                            className="rounded p-1 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default LabEquipmentForm;