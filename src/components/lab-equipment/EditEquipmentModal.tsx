"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Upload, Image as ImageIcon, Trash2, Package, FileText, Search } from "lucide-react";
import { toast } from "react-toastify";
import { LabEquipment, updateLabEquipmentAPI } from "@/services/labEquipmentService";
import RichTextEditor from "../form/input/RichTextEditor";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  equipment: LabEquipment | null;
  onSuccess: () => void;
}

const inputCls =
  "w-full h-10 rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
const labelCls = "mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400";

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
    <section className="rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-3.5 dark:border-gray-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
          <Icon size={18} className="text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function EditEquipmentModal({ isOpen, onClose, equipment, onSuccess }: Props) {
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

  // objectURL cleanup (memory leak fix)
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (!isOpen || !equipment) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDescriptionChange = (htmlContent: string) => {
    setFormData((prev) => ({ ...prev, description: htmlContent }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB se chhoti honi chahiye");
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
      toast.error(error?.response?.data?.message || "Failed to update equipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />

      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-gray-50 shadow-lg dark:border-gray-800 dark:bg-gray-950">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
              <Package size={20} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Edit Equipment</h2>
              <p className="text-xs text-gray-500">
                ID #{equipment.id} · Code {equipment.productCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable Body */}
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {/* Basic Info */}
            <Section icon={Package} title="Basic Information" subtitle="Equipment ki core details">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Equipment Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Product Code <span className="text-rose-500">*</span></label>
                  <input type="text" name="productCode" required value={formData.productCode} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Model Number</label>
                  <input type="text" name="modelNumber" value={formData.modelNumber} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Manufacturer</label>
                  <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Origin</label>
                  <input type="text" name="origin" value={formData.origin} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Standards</label>
                  <input type="text" name="standards" value={formData.standards} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </Section>

            {/* Image */}
            <Section icon={ImageIcon} title="Equipment Image" subtitle="JPG, PNG ya WEBP · max 5MB">
              <div className="flex items-center gap-5">
                <div className="group relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="text-white" size={22} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-1 text-gray-400" size={24} />
                      <span className="text-[10px] text-gray-500">No Image</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-10 items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>
                  {selectedFile && (
                    <p className="max-w-xs truncate text-xs text-gray-500">{selectedFile.name}</p>
                  )}
                </div>
              </div>
            </Section>

            {/* Description */}
            <Section icon={FileText} title="Description" subtitle="Product ki detailed description">
              <div className="overflow-hidden rounded-[10px] border border-gray-200 dark:border-gray-700">
                <RichTextEditor value={formData.description} onChange={handleDescriptionChange} />
              </div>
            </Section>

            {/* SEO */}
            <Section icon={Search} title="SEO Meta Data" subtitle="Search engines ke liye">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Meta Description</label>
                  <textarea
                    name="metaDescription"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={handleChange}
                    className="w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 items-center gap-2 rounded-[10px] bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}