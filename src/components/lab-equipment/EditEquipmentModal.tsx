// "use client";

// import { useState, useEffect, useRef } from "react";
// import { X, Save, Upload, Image as ImageIcon, Trash2, Package, FileText, Search } from "lucide-react";
// import { toast } from "react-toastify";
// import { LabEquipment, updateLabEquipmentAPI } from "@/services/labEquipmentService";
// import RichTextEditor from "../form/input/RichTextEditor";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   equipment: LabEquipment | null;
//   onSuccess: () => void;
// }

// const inputCls =
//   "w-full h-10 rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
// const labelCls = "mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400";

// function Section({
//   icon: Icon,
//   title,
//   subtitle,
//   children,
// }: {
//   icon: React.ElementType;
//   title: string;
//   subtitle?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
//       <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
//         <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//           <Icon size={18} className="text-gray-600 dark:text-gray-300" />
//         </div>
//         <div>
//           <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
//           {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
//         </div>
//       </div>
//       <div className="p-5">{children}</div>
//     </section>
//   );
// }

// export default function EditEquipmentModal({ isOpen, onClose, equipment, onSuccess }: Props) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     productCode: "",
//     modelNumber: "",
//     manufacturer: "",
//     origin: "",
//     standards: "",
//     description: "",
//     metaTitle: "",
//     metaDescription: "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   useEffect(() => {
//     if (equipment && isOpen) {
//       setFormData({
//         name: equipment.name || "",
//         productCode: equipment.productCode || "",
//         modelNumber: equipment.modelNumber || "",
//         manufacturer: equipment.manufacturer || "",
//         origin: equipment.origin || "",
//         standards: equipment.standards || "",
//         description: equipment.description || "",
//         metaTitle: equipment.metaTitle || "",
//         metaDescription: equipment.metaDescription || "",
//       });

//       const currentImage =
//         equipment.media?.find((m) => m.isPrimary)?.mediaUrl ||
//         equipment.media?.[0]?.mediaUrl ||
//         equipment.media?.[0]?.thumbnail ||
//         null;

//       setImagePreview(currentImage);
//       setSelectedFile(null);
//     }
//   }, [equipment, isOpen]);

//   // objectURL cleanup (memory leak fix)
//   useEffect(() => {
//     return () => {
//       if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
//     };
//   }, [imagePreview]);

//   if (!isOpen || !equipment) return null;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleDescriptionChange = (htmlContent: string) => {
//     setFormData((prev) => ({ ...prev, description: htmlContent }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image 5MB se chhoti honi chahiye");
//       return;
//     }
//     setSelectedFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleRemoveImage = () => {
//     setSelectedFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("productCode", formData.productCode);
//       data.append("manufacturer", formData.manufacturer);
//       data.append("modelNumber", formData.modelNumber);
//       data.append("origin", formData.origin);
//       data.append("standards", formData.standards);
//       data.append("description", formData.description);
//       data.append("metaTitle", formData.metaTitle);
//       data.append("metaDescription", formData.metaDescription);
//       if (selectedFile) data.append("images", selectedFile);

//       await updateLabEquipmentAPI(equipment.id, data);
//       toast.success("Equipment updated successfully!");
//       onSuccess();
//     } catch (error: any) {
//       console.error("Update Error:", error);
//       toast.error(error?.response?.data?.message || "Failed to update equipment");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

//       <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50 shadow-lg dark:border-gray-800 dark:bg-gray-950">
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//               <Package size={20} className="text-gray-600 dark:text-gray-300" />
//             </div>
//             <div>
//               <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit Equipment</h2>
//               <p className="text-xs text-gray-500">
//                 ID #{equipment.id} · Code {equipment.productCode}
//               </p>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
//           {/* Scrollable Body */}
//           <div className="flex-1 space-y-5 overflow-y-auto p-6">
//             {/* Basic Info */}
//             <Section icon={Package} title="Basic Information" subtitle="Equipment ki core details">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <label className={labelCls}>Equipment Name <span className="text-rose-500">*</span></label>
//                   <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Product Code <span className="text-rose-500">*</span></label>
//                   <input type="text" name="productCode" required value={formData.productCode} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Model Number</label>
//                   <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Manufacturer</label>
//                   <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Origin</label>
//                   <input type="text" name="origin" value={formData.origin} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Standards</label>
//                   <input type="text" name="standards" value={formData.standards} onChange={handleChange} className={inputCls} />
//                 </div>
//               </div>
//             </Section>

//             {/* Image */}
//             <Section icon={ImageIcon} title="Equipment Image" subtitle="JPG, PNG ya WEBP · max 5MB">
//               <div className="flex items-center gap-5">
//                 <div className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
//                   {imagePreview ? (
//                     <>
//                       <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
//                       <button
//                         type="button"
//                         onClick={handleRemoveImage}
//                         className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
//                       >
//                         <Trash2 className="text-white" size={22} />
//                       </button>
//                     </>
//                   ) : (
//                     <div className="text-center">
//                       <ImageIcon className="mx-auto mb-1 text-gray-400" size={24} />
//                       <span className="text-[10px] text-gray-500">No Image</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="flex h-10 items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
//                   >
//                     <Upload size={16} />
//                     {imagePreview ? "Change Image" : "Upload Image"}
//                   </button>
//                   {selectedFile && (
//                     <p className="max-w-xs truncate text-xs text-gray-500">{selectedFile.name}</p>
//                   )}
//                 </div>
//               </div>
//             </Section>

//             {/* Description */}
//             <Section icon={FileText} title="Description" subtitle="Product ki detailed description">
//               <div className="overflow-hidden rounded-[10px] border border-gray-200 dark:border-gray-700">
//                 <RichTextEditor value={formData.description} onChange={handleDescriptionChange} />
//               </div>
//             </Section>

//             {/* SEO */}
//             <Section icon={Search} title="SEO Meta Data" subtitle="Search engines ke liye">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <div>
//                   <label className={labelCls}>Meta Title</label>
//                   <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputCls} />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Meta Description</label>
//                   <textarea
//                     name="metaDescription"
//                     rows={3}
//                     value={formData.metaDescription}
//                     onChange={handleChange}
//                     className="w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
//                   />
//                 </div>
//               </div>
//             </Section>
//           </div>

//           {/* Footer */}
//           <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
//             <button
//               type="button"
//               onClick={onClose}
//               className="h-10 rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex h-10 items-center gap-2 rounded-[10px] bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
//             >
//               <Save size={16} />
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
  Package,
  FileText,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  LabEquipment,
  updateLabEquipmentAPI,
} from "@/services/labEquipmentService";
import RichTextEditor from "../form/input/RichTextEditor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  equipment: LabEquipment | null;
  onSuccess: () => void;
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

const labelCls =
  "mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300";

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function EditEquipmentModal({
  isOpen,
  onClose,
  equipment,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    modelNumber: "",
    manufacturer: "",
    origin: "",
    standards: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (equipment && isOpen) {
      setFormData({
        name: equipment.name || "",
        productCode: equipment.productCode || "",
        modelNumber: equipment.modelNumber || "",
        manufacturer: equipment.manufacturer || "",
        origin: equipment.origin || "",
        standards: equipment.standards || "",
        description: equipment.description || "",
        metaTitle: equipment.metaTitle || "",
        metaDescription: equipment.metaDescription || "",
      });

      const currentImage =
        equipment.media?.find((m) => m.isPrimary)?.mediaUrl ||
        equipment.media?.[0]?.mediaUrl ||
        equipment.media?.[0]?.thumbnail ||
        null;

      setImagePreview(currentImage);
      setSelectedFile(null);
    }
  }, [equipment, isOpen]);

  // Blob URL cleanup
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !equipment) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (htmlContent: string) => {
    setFormData((prev) => ({ ...prev, description: htmlContent }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("productCode", formData.productCode);
      data.append("manufacturer", formData.manufacturer);
      data.append("modelNumber", formData.modelNumber);
      data.append("origin", formData.origin);
      data.append("standards", formData.standards);
      data.append("description", formData.description);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescription", formData.metaDescription);
      if (selectedFile) data.append("images", selectedFile);

      await updateLabEquipmentAPI(equipment.id, data);
      toast.success("Equipment updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update equipment"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-equipment-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="edit-equipment-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Edit Equipment
              </h2>
              <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                ID #{equipment.id} · Code{" "}
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {equipment.productCode}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM + SCROLLABLE BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* BASIC INFO */}
            <Section
              icon={Package}
              title="Basic Information"
              subtitle="Core equipment identifiers and origin"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>
                    Equipment Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Product Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productCode"
                    required
                    disabled={isSubmitting}
                    value={formData.productCode}
                    onChange={handleChange}
                    className={`${inputCls} font-mono`}
                  />
                </div>

                <div>
                  <label className={labelCls}>Model Number</label>
                  <input
                    type="text"
                    name="modelNumber"
                    disabled={isSubmitting}
                    value={formData.modelNumber}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    disabled={isSubmitting}
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Origin</label>
                  <input
                    type="text"
                    name="origin"
                    disabled={isSubmitting}
                    value={formData.origin}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Standards</label>
                  <input
                    type="text"
                    name="standards"
                    disabled={isSubmitting}
                    value={formData.standards}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>
            </Section>

            {/* EQUIPMENT IMAGE */}
            <Section
              icon={ImageIcon}
              title="Equipment Image"
              subtitle="JPG, PNG, or WEBP · Max 5 MB"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="Remove image"
                        className="absolute inset-0 flex items-center justify-center bg-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-1 h-5 w-5 text-slate-400" />
                      <span className="text-[10px] text-slate-500">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </span>
                    </button>

                    {imagePreview && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {selectedFile && (
                    <p className="max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
                      {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </Section>

            {/* DESCRIPTION */}
            <Section
              icon={FileText}
              title="Description"
              subtitle="Detailed specification & overview"
            >
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <RichTextEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </Section>

            {/* SEO */}
            <Section
              icon={Search}
              title="SEO Meta Data"
              subtitle="Search engine title and summary"
            >
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    disabled={isSubmitting}
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea
                    name="metaDescription"
                    rows={3}
                    disabled={isSubmitting}
                    value={formData.metaDescription}
                    onChange={handleChange}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* DRAWER FOOTER */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}