// "use client";

// import React, { useEffect, useState, ChangeEvent } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "@/redux/store";
// import { Modal } from "../ui/modal";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import TextArea from "../form/input/TextArea";
// import Button from "../ui/button/Button";
// import { toast } from "react-toastify";
// import { updateOfferBanner } from "@/services/bannerServices/BannerService";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { selectedBanner } = useSelector((state: RootState) => state.banner);

//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     link: "",
//     startDate: "",
//     endDate: "",
//     imageUrl: "",
//   });
// const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   /* 🔥 SYNC DATA */
//   // useEffect(() => {
//   //   if (!selectedBanner) return;

//   //   setFormData({
//   //     title: selectedBanner.title ?? "",
//   //     subtitle: selectedBanner.subtitle ?? "",
//   //     link: selectedBanner.link ?? "",
//   //     startDate: selectedBanner.startDate?.split("T")[0] ?? "",
//   //     endDate: selectedBanner.endDate?.split("T")[0] ?? "",
//   //     imageUrl: selectedBanner.imageUrl ?? "",
//   //   });

//   //   setImagePreview(selectedBanner.imageUrl ?? null);
//   // }, [selectedBanner]);
//   useEffect(() => {
//   if (!selectedBanner) return;

//   setFormData({
//     title: selectedBanner.title ?? "",
//     subtitle: selectedBanner.subtitle ?? "",
//     link: selectedBanner.link ?? "",
//     startDate: selectedBanner.startDate?.split("T")[0] ?? "",
//     endDate: selectedBanner.endDate?.split("T")[0] ?? "",
//     imageUrl: selectedBanner.imageUrl ?? "",
//   });

//   setImagePreview(selectedBanner.imageUrl ?? null);
//   setSelectedImage(null);
// }, [selectedBanner]);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];

//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     toast.error("Please select a valid image");
//     return;
//   }

//   if (file.size > 5 * 1024 * 1024) {
//     toast.error("Image size must be less than 5MB");
//     return;
//   }

//   setSelectedImage(file);

//   // New preview
//   const previewUrl = URL.createObjectURL(file);
//   setImagePreview(previewUrl);
// };

//   /* SUBMIT */
//   // const handleSubmit = async () => {
//   //   if (!selectedBanner) return;

//   //   if (!formData.title.trim()) {
//   //     toast.error("Title is required");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   const fd = new FormData();
//   //   Object.entries(formData).forEach(([key, value]) =>
//   //     fd.append(key, value)
//   //   );

//   //   dispatch(
//   //     updateOfferBanner({
//   //       id: selectedBanner.id,
//   //       formData: fd,
//   //       onSuccess: () => {
//   //         setLoading(false);
//   //         onClose();
//   //       },
//   //     })
//   //   );
//   // };

//   const handleSubmit = async () => {
//   if (!selectedBanner) return;

//   if (!formData.title.trim()) {
//     toast.error("Title is required");
//     return;
//   }

//   if (
//     formData.startDate &&
//     formData.endDate &&
//     formData.startDate > formData.endDate
//   ) {
//     toast.error("Start date cannot be greater than end date");
//     return;
//   }

//   setLoading(true);

//   try {
//     const fd = new FormData();

//     fd.append("title", formData.title);
//     fd.append("subtitle", formData.subtitle);
//     fd.append("link", formData.link);
//     fd.append("startDate", formData.startDate);
//     fd.append("endDate", formData.endDate);

//     // ✅ Only send image when user selects a new image
//     if (selectedImage) {
//       fd.append("image", selectedImage);
//     }

//     console.log("Updating banner:", selectedBanner.id);

//     if (selectedImage) {
//       console.log("New image:", selectedImage.name);
//     }

//     dispatch(
//       updateOfferBanner({
//         id: selectedBanner.id,
//         formData: fd,
//         onSuccess: () => {
//           setLoading(false);
//           onClose();
//         },
//       })
//     );
//   } catch (error) {
//     console.error("Update banner error:", error);
//     setLoading(false);
//   }
// };

//   if (!selectedBanner) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
//       <div className="p-6 bg-white rounded-2xl space-y-4">
//         <h2 className="text-xl font-semibold">Edit Offer Banner</h2>

//         <Label>Title *</Label>
//         <Input name="title" value={formData.title} onChange={handleChange} />

//         <Label>Subtitle</Label>
//         <TextArea name="subtitle" value={formData.subtitle} onChange={handleChange} />

//         <Label>Redirect Link</Label>
//         <Input name="link" value={formData.link} onChange={handleChange} />

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label>Start Date</Label>
//             <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
//           </div>
//           <div>
//             <Label>End Date</Label>
//             <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
//           </div>
//         </div>

//         <div>
//           {/* <Label>Banner Image *</Label> */}
//           {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
//           {/* {imagePreview && (
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-48 mt-3 rounded border"
//             />
//           )} */}
//         </div>



// <div>
//   <Label>Banner Image</Label>

//   <input
//     type="file"
//     accept="image/jpeg,image/png,image/webp"
//     onChange={handleImageChange}
//     className="block w-full text-sm text-gray-600
//       file:mr-4 file:rounded-lg file:border-0
//       file:bg-gray-100 file:px-4 file:py-2
//       file:text-sm file:font-medium
//       hover:file:bg-gray-200"
//   />

//   <p className="mt-1 text-xs text-gray-500">
//     JPG, PNG or WebP • Maximum 5MB
//   </p>

//   {imagePreview && (
//     <div className="mt-3">
//       <p className="mb-2 text-sm font-medium">Preview</p>

//       <img
//         src={imagePreview}
//         alt="Banner Preview"
//         className="w-64 h-32 object-cover rounded-lg border"
//       />
//     </div>
//   )}
// </div>

//         <div className="flex justify-end gap-2 pt-4">
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditOfferBannerModal;


// "use client";

// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   ChangeEvent,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { ImagePlus, Loader2, RotateCcw, UploadCloud, X } from "lucide-react";
// import { RootState, AppDispatch } from "@/redux/store";
// import { Modal } from "../ui/modal";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import TextArea from "../form/input/TextArea";
// import Button from "../ui/button/Button";
// import { toast } from "react-toastify";
// import { updateOfferBanner } from "@/services/bannerServices/BannerService";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// const formatSize = (bytes: number) =>
//   bytes < 1024 * 1024
//     ? `${(bytes / 1024).toFixed(0)} KB`
//     : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { selectedBanner } = useSelector((state: RootState) => state.banner);

//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     link: "",
//     startDate: "",
//     endDate: "",
//     imageUrl: "",
//   });
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const blobUrlRef = useRef<string | null>(null);

//   /* blob URL cleanup (memory leak se bachne ke liye) */
//   const revokeBlob = () => {
//     if (blobUrlRef.current) {
//       URL.revokeObjectURL(blobUrlRef.current);
//       blobUrlRef.current = null;
//     }
//   };

//   useEffect(() => revokeBlob, []);

//   /* SYNC DATA */
//   useEffect(() => {
//     if (!selectedBanner) return;

//     revokeBlob();
//     setFormData({
//       title: selectedBanner.title ?? "",
//       subtitle: selectedBanner.subtitle ?? "",
//       link: selectedBanner.link ?? "",
//       startDate: selectedBanner.startDate?.split("T")[0] ?? "",
//       endDate: selectedBanner.endDate?.split("T")[0] ?? "",
//       imageUrl: selectedBanner.imageUrl ?? "",
//     });
//     setImagePreview(selectedBanner.imageUrl ?? null);
//     setSelectedImage(null);
//   }, [selectedBanner]);

//   const dateError = useMemo(() => {
//     if (
//       formData.startDate &&
//       formData.endDate &&
//       formData.startDate > formData.endDate
//     ) {
//       return "Start date, end date se pehle honi chahiye";
//     }
//     return "";
//   }, [formData.startDate, formData.endDate]);

//   const isValid = formData.title.trim().length > 0 && !dateError;

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     e.target.value = ""; // same file dobara select ho sake

//     if (!file) return;

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       toast.error("Only JPG, PNG or WebP allowed");
//       return;
//     }

//     if (file.size > MAX_IMAGE_SIZE) {
//       toast.error("Image size must be less than 5MB");
//       return;
//     }

//     revokeBlob();
//     const previewUrl = URL.createObjectURL(file);
//     blobUrlRef.current = previewUrl;

//     setSelectedImage(file);
//     setImagePreview(previewUrl);
//   };

//   const handleResetImage = () => {
//     revokeBlob();
//     setSelectedImage(null);
//     setImagePreview(selectedBanner?.imageUrl ?? null);
//   };

//   const handleSubmit = async () => {
//     if (!selectedBanner) return;

//     if (!formData.title.trim()) {
//       toast.error("Title is required");
//       return;
//     }

//     if (dateError) {
//       toast.error(dateError);
//       return;
//     }

//     setLoading(true);

//     try {
//       const fd = new FormData();
//       fd.append("title", formData.title);
//       fd.append("subtitle", formData.subtitle);
//       fd.append("link", formData.link);
//       fd.append("startDate", formData.startDate);
//       fd.append("endDate", formData.endDate);

//       // Sirf nayi image select hone par bhejo
//       if (selectedImage) {
//         fd.append("image", selectedImage);
//       }

//       dispatch(
//         updateOfferBanner({
//           id: selectedBanner.id,
//           formData: fd,
//           onSuccess: () => {
//             setLoading(false);
//             onClose();
//           },
//         })
//       );
//     } catch (error) {
//       console.error("Update banner error:", error);
//       setLoading(false);
//     }
//   };

//   if (!selectedBanner) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
//       <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-[10px] bg-white">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100">
//               <ImagePlus className="h-5 w-5 text-gray-700" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Edit Offer Banner
//               </h2>
//               <p className="text-sm text-gray-500">
//                 Banner ki details aur image update karein
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="space-y-6 overflow-y-auto px-6 py-5">
//           {/* Banner Image */}
//           <section className="space-y-2">
//             <Label>Banner Image</Label>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               onChange={handleImageChange}
//               className="hidden"
//             />

//             {imagePreview ? (
//               <div className="overflow-hidden rounded-[10px] border border-gray-200">
//                 <img
//                   src={imagePreview}
//                   alt="Banner Preview"
//                   className="h-44 w-full bg-gray-100 object-cover"
//                 />

//                 <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5">
//                   <div className="min-w-0">
//                     {selectedImage ? (
//                       <>
//                         <p className="truncate text-sm font-medium text-gray-900">
//                           {selectedImage.name}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           New image • {formatSize(selectedImage.size)}
//                         </p>
//                       </>
//                     ) : (
//                       <p className="text-sm text-gray-600">Current image</p>
//                     )}
//                   </div>

//                   <div className="flex shrink-0 items-center gap-2">
//                     {selectedImage && (
//                       <button
//                         type="button"
//                         onClick={handleResetImage}
//                         className="inline-flex items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
//                       >
//                         <RotateCcw className="h-3.5 w-3.5" />
//                         Reset
//                       </button>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="inline-flex items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
//                     >
//                       <UploadCloud className="h-3.5 w-3.5" />
//                       Change
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 px-4 py-10 text-center transition-colors hover:bg-gray-50"
//               >
//                 <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100">
//                   <UploadCloud className="h-5 w-5 text-gray-600" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-900">
//                   Click karke image upload karein
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   JPG, PNG or WebP • Maximum 5MB
//                 </p>
//               </button>
//             )}

//             {imagePreview && (
//               <p className="text-xs text-gray-500">
//                 JPG, PNG or WebP • Maximum 5MB
//               </p>
//             )}
//           </section>

//           {/* Details */}
//           <section className="space-y-4">
//             <div>
//               <Label>
//                 Title <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Diwali Mega Sale"
//               />
//             </div>

//             <div>
//               <Label>Subtitle</Label>
//               <TextArea
//                 name="subtitle"
//                 value={formData.subtitle}
//                 onChange={handleChange}
//                 placeholder="Short description likhein"
//               />
//             </div>

//             <div>
//               <Label>Redirect Link</Label>
//               <Input
//                 name="link"
//                 value={formData.link}
//                 onChange={handleChange}
//                 placeholder="https://example.com/offer"
//               />
//             </div>
//           </section>

//           {/* Schedule */}
//           <section className="space-y-2">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <Label>Start Date</Label>
//                 <Input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>End Date</Label>
//                 <Input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {dateError && <p className="text-xs text-red-500">{dateError}</p>}
//           </section>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
//           <Button variant="outline" onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading || !isValid}>
//             {loading ? (
//               <span className="inline-flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Saving...
//               </span>
//             ) : (
//               "Save Changes"
//             )}
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditOfferBannerModal;




"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ImagePlus,
  Loader2,
  RotateCcw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import { updateOfferBanner } from "@/services/bannerServices/BannerService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* blob URL cleanup (memory leak se bachne ke liye) */
const useBlobUrl = () => {
  const ref = useRef<string | null>(null);

  const revoke = useCallback(() => {
    if (ref.current) {
      URL.revokeObjectURL(ref.current);
      ref.current = null;
    }
  }, []);

  const create = useCallback(
    (file: File) => {
      revoke();
      const url = URL.createObjectURL(file);
      ref.current = url;
      return url;
    },
    [revoke]
  );

  useEffect(() => revoke, [revoke]);

  return { create, revoke };
};

/* =========================================================
   REUSABLE IMAGE FIELD (desktop + mobile dono ke liye)
========================================================= */

interface ImageFieldProps {
  label: React.ReactNode;
  hint: string;
  emptyTitle: string;
  preview: string | null;
  selectedFile: File | null;
  imgClassName: string;
  canReset: boolean;
  onSelect: (file: File) => void;
  onReset: () => void;
  onRemove?: () => void;
}

const ImageField: React.FC<ImageFieldProps> = ({
  label,
  hint,
  emptyTitle,
  preview,
  selectedFile,
  imgClassName,
  canReset,
  onSelect,
  onReset,
  onRemove,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // same file dobara select ho sake

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    onSelect(file);
  };

  const smallBtn =
    "inline-flex items-center gap-1.5 rounded-[10px] border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100";

  return (
    <section className="space-y-2">
      <Label>{label}</Label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInput}
        className="hidden"
      />

      {preview ? (
        <div className="overflow-hidden rounded-[10px] border border-gray-200">
          <img
            src={preview}
            alt="Banner Preview"
            className={`w-full bg-gray-100 object-contain ${imgClassName}`}
          />

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5">
            <div className="min-w-0">
              {selectedFile ? (
                <>
                  <p className="truncate text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    New image • {formatSize(selectedFile.size)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">Current image</p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {canReset && (
                <button type="button" onClick={onReset} className={smallBtn}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              )}
              {onRemove && (
                <button type="button" onClick={onRemove} className={smallBtn}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={smallBtn}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 px-4 py-8 text-center transition-colors hover:bg-gray-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100">
              <UploadCloud className="h-5 w-5 text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">{emptyTitle}</p>
          </button>

          {canReset && (
            <button type="button" onClick={onReset} className={smallBtn}>
              <RotateCcw className="h-3.5 w-3.5" />
              Undo remove
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">{hint}</p>
    </section>
  );
};

/* =========================================================
   MODAL
========================================================= */

const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBanner } = useSelector((state: RootState) => state.banner);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  /* Desktop image */
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* Mobile image */
  const [selectedMobileImage, setSelectedMobileImage] =
    useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [removeMobile, setRemoveMobile] = useState(false);

  const { create: createDesktopBlob, revoke: revokeDesktopBlob } =
    useBlobUrl();
  const { create: createMobileBlob, revoke: revokeMobileBlob } = useBlobUrl();

  /* SYNC DATA */
  useEffect(() => {
    if (!selectedBanner) return;

    revokeDesktopBlob();
    revokeMobileBlob();

    setFormData({
      title: selectedBanner.title ?? "",
      subtitle: selectedBanner.subtitle ?? "",
      link: selectedBanner.link ?? "",
      startDate: selectedBanner.startDate?.split("T")[0] ?? "",
      endDate: selectedBanner.endDate?.split("T")[0] ?? "",
    });

    setImagePreview(selectedBanner.imageUrl ?? null);
    setSelectedImage(null);

    setMobilePreview(selectedBanner.mobileImageUrl ?? null);
    setSelectedMobileImage(null);
    setRemoveMobile(false);
  }, [selectedBanner, revokeDesktopBlob, revokeMobileBlob]);

  const dateError = useMemo(() => {
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      return "Start date, end date se pehle honi chahiye";
    }
    return "";
  }, [formData.startDate, formData.endDate]);

  const isValid = formData.title.trim().length > 0 && !dateError;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- DESKTOP IMAGE ---------------- */

  const handleSelectDesktop = (file: File) => {
    setSelectedImage(file);
    setImagePreview(createDesktopBlob(file));
  };

  const handleResetDesktop = () => {
    revokeDesktopBlob();
    setSelectedImage(null);
    setImagePreview(selectedBanner?.imageUrl ?? null);
  };

  /* ---------------- MOBILE IMAGE ---------------- */

  const handleSelectMobile = (file: File) => {
    setSelectedMobileImage(file);
    setMobilePreview(createMobileBlob(file));
    setRemoveMobile(false);
  };

  /* Mobile image hatao (naya select ki hui ya purani) */
  const handleRemoveMobile = () => {
    revokeMobileBlob();
    setSelectedMobileImage(null);
    setMobilePreview(null);
    // sirf tab server ko batao jab pehle se mobile image saved thi
    setRemoveMobile(Boolean(selectedBanner?.mobileImageUrl));
  };

  /* Sab changes undo: wapas saved mobile image (ya khali) */
  const handleResetMobile = () => {
    revokeMobileBlob();
    setSelectedMobileImage(null);
    setMobilePreview(selectedBanner?.mobileImageUrl ?? null);
    setRemoveMobile(false);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!selectedBanner) return;

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (dateError) {
      toast.error(dateError);
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("subtitle", formData.subtitle);
      fd.append("link", formData.link);
      fd.append("startDate", formData.startDate);
      fd.append("endDate", formData.endDate);

      // Sirf nayi image select hone par bhejo
      if (selectedImage) {
        fd.append("image", selectedImage);
      }

      // Mobile: nayi image bhejo, ya hatane ka flag
      if (selectedMobileImage) {
        fd.append("mobileImage", selectedMobileImage);
      } else if (removeMobile) {
        fd.append("removeMobileImage", "true");
      }

      dispatch(
        updateOfferBanner({
          id: selectedBanner.id,
          formData: fd,
          onSuccess: () => {
            setLoading(false);
            onClose();
          },
        })
      );
    } catch (error) {
      console.error("Update banner error:", error);
      setLoading(false);
    }
  };

  if (!selectedBanner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="flex max-h-[90vh] flex-col overflow-hidden rounded-[10px] bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100">
              <ImagePlus className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Offer Banner
              </h2>
              <p className="text-sm text-gray-500">
                Banner ki details aur images update karein
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto px-6 py-5">
          {/* Desktop Image */}
          <ImageField
            label="Desktop Banner Image"
            hint="Recommended 1521 × 400 px • JPG, PNG or WebP • Maximum 5MB"
            emptyTitle="Click karke desktop image upload karein"
            preview={imagePreview}
            selectedFile={selectedImage}
            imgClassName="aspect-[1521/400]"
            canReset={selectedImage !== null}
            onSelect={handleSelectDesktop}
            onReset={handleResetDesktop}
          />

          {/* Mobile Image (optional) */}
          <ImageField
            label={
              <>
                Mobile Banner Image{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </>
            }
            hint="Recommended 800 × 600 px (4:3) • Na doge to mobile pe desktop image dikhegi"
            emptyTitle="Click karke mobile image upload karein"
            preview={mobilePreview}
            selectedFile={selectedMobileImage}
            imgClassName="h-44"
            canReset={selectedMobileImage !== null || removeMobile}
            onSelect={handleSelectMobile}
            onReset={handleResetMobile}
            onRemove={handleRemoveMobile}
          />

          {/* Details */}
          <section className="space-y-4">
            <div>
              <Label>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Diwali Mega Sale"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <TextArea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Short description likhein"
              />
            </div>

            <div>
              <Label>Redirect Link</Label>
              <Input
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/offer"
              />
            </div>
          </section>

          {/* Schedule */}
          <section className="space-y-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {dateError && <p className="text-xs text-red-500">{dateError}</p>}
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !isValid}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditOfferBannerModal;