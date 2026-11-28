// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   ChangeEvent,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ImagePlus,
//   Loader2,
//   RotateCcw,
//   Trash2,
//   UploadCloud,
//   X,
// } from "lucide-react";
// import { RootState, AppDispatch } from "@/redux/store";
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

// /* blob URL cleanup (memory leak se bachne ke liye) */
// const useBlobUrl = () => {
//   const ref = useRef<string | null>(null);

//   const revoke = useCallback(() => {
//     if (ref.current) {
//       URL.revokeObjectURL(ref.current);
//       ref.current = null;
//     }
//   }, []);

//   const create = useCallback(
//     (file: File) => {
//       revoke();
//       const url = URL.createObjectURL(file);
//       ref.current = url;
//       return url;
//     },
//     [revoke]
//   );

//   useEffect(() => revoke, [revoke]);

//   return { create, revoke };
// };

// /* =========================================================
//    REUSABLE IMAGE FIELD (desktop + mobile dono ke liye)
// ========================================================= */

// interface ImageFieldProps {
//   label: React.ReactNode;
//   hint: string;
//   emptyTitle: string;
//   preview: string | null;
//   selectedFile: File | null;
//   imgClassName: string;
//   canReset: boolean;
//   onSelect: (file: File) => void;
//   onReset: () => void;
//   onRemove?: () => void;
// }

// const ImageField: React.FC<ImageFieldProps> = ({
//   label,
//   hint,
//   emptyTitle,
//   preview,
//   selectedFile,
//   imgClassName,
//   canReset,
//   onSelect,
//   onReset,
//   onRemove,
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";

//     if (!file) return;

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       toast.error("Only JPG, PNG or WebP allowed");
//       return;
//     }

//     if (file.size > MAX_IMAGE_SIZE) {
//       toast.error("Image size must be less than 5MB");
//       return;
//     }

//     onSelect(file);
//   };

//   const actionBtnClass =
//     "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900";

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between gap-2">
//         <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//           {label}
//         </Label>
//         {selectedFile && (
//           <span className="text-[11px] font-medium text-emerald-700 tabular-nums">
//             {formatSize(selectedFile.size)}
//           </span>
//         )}
//       </div>

//       <input
//         ref={inputRef}
//         type="file"
//         accept="image/jpeg,image/png,image/webp"
//         onChange={handleInput}
//         className="hidden"
//       />

//       {preview ? (
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
//           <div className="bg-slate-100/80 p-2">
//             <img
//               src={preview}
//               alt="Banner Preview"
//               className={`w-full rounded-lg object-contain ${imgClassName}`}
//             />
//           </div>

//           <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
//             <div className="min-w-0">
//               {selectedFile ? (
//                 <p className="truncate text-xs font-medium text-slate-800">
//                   {selectedFile.name}
//                 </p>
//               ) : (
//                 <p className="text-xs text-slate-500">Current uploaded asset</p>
//               )}
//             </div>

//             <div className="flex shrink-0 items-center gap-1.5">
//               {canReset && (
//                 <button
//                   type="button"
//                   onClick={onReset}
//                   className={actionBtnClass}
//                 >
//                   <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
//                   Reset
//                 </button>
//               )}
//               {onRemove && (
//                 <button
//                   type="button"
//                   onClick={onRemove}
//                   className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
//                 >
//                   <Trash2 className="h-3.5 w-3.5" />
//                   Remove
//                 </button>
//               )}
//               <button
//                 type="button"
//                 onClick={() => inputRef.current?.click()}
//                 className={actionBtnClass}
//               >
//                 <UploadCloud className="h-3.5 w-3.5 text-slate-500" />
//                 Change
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-2">
//           <button
//             type="button"
//             onClick={() => inputRef.current?.click()}
//             className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-7 text-center transition hover:border-slate-400 hover:bg-slate-50"
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-2xs">
//               <UploadCloud className="h-4 w-4 text-slate-600" />
//             </div>
//             <p className="text-xs font-medium text-slate-700 sm:text-sm">
//               {emptyTitle}
//             </p>
//           </button>

//           {canReset && (
//             <button type="button" onClick={onReset} className={actionBtnClass}>
//               <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
//               Undo remove
//             </button>
//           )}
//         </div>
//       )}

//       <p className="text-[11px] text-slate-500">{hint}</p>
//     </div>
//   );
// };

// /* =========================================================
//    RIGHT-SIDE DRAWER
// ========================================================= */

// const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { selectedBanner } = useSelector((state: RootState) => state.banner);

//   const [formData, setFormData] = useState({
//     title: "",
//     subtitle: "",
//     link: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [loading, setLoading] = useState(false);

//   /* Desktop image */
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   /* Mobile image */
//   const [selectedMobileImage, setSelectedMobileImage] =
//     useState<File | null>(null);
//   const [mobilePreview, setMobilePreview] = useState<string | null>(null);
//   const [removeMobile, setRemoveMobile] = useState(false);

//   const { create: createDesktopBlob, revoke: revokeDesktopBlob } =
//     useBlobUrl();
//   const { create: createMobileBlob, revoke: revokeMobileBlob } = useBlobUrl();

//   /* SYNC DATA */
//   useEffect(() => {
//     if (!selectedBanner) return;

//     revokeDesktopBlob();
//     revokeMobileBlob();

//     setFormData({
//       title: selectedBanner.title ?? "",
//       subtitle: selectedBanner.subtitle ?? "",
//       link: selectedBanner.link ?? "",
//       startDate: selectedBanner.startDate?.split("T")[0] ?? "",
//       endDate: selectedBanner.endDate?.split("T")[0] ?? "",
//     });

//     setImagePreview(selectedBanner.imageUrl ?? null);
//     setSelectedImage(null);

//     setMobilePreview(selectedBanner.mobileImageUrl ?? null);
//     setSelectedMobileImage(null);
//     setRemoveMobile(false);
//   }, [selectedBanner, revokeDesktopBlob, revokeMobileBlob]);

//   /* ESCAPE + BODY SCROLL LOCK */
//   useEffect(() => {
//     if (!isOpen) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && !loading) {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//       document.body.style.overflow = "";
//     };
//   }, [isOpen, loading, onClose]);

//   const dateError = useMemo(() => {
//     if (
//       formData.startDate &&
//       formData.endDate &&
//       formData.startDate > formData.endDate
//     ) {
//       return "Start date must be on or before end date";
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

//   /* ---------------- DESKTOP IMAGE ---------------- */

//   const handleSelectDesktop = (file: File) => {
//     setSelectedImage(file);
//     setImagePreview(createDesktopBlob(file));
//   };

//   const handleResetDesktop = () => {
//     revokeDesktopBlob();
//     setSelectedImage(null);
//     setImagePreview(selectedBanner?.imageUrl ?? null);
//   };

//   /* ---------------- MOBILE IMAGE ---------------- */

//   const handleSelectMobile = (file: File) => {
//     setSelectedMobileImage(file);
//     setMobilePreview(createMobileBlob(file));
//     setRemoveMobile(false);
//   };

//   const handleRemoveMobile = () => {
//     revokeMobileBlob();
//     setSelectedMobileImage(null);
//     setMobilePreview(null);
//     setRemoveMobile(Boolean(selectedBanner?.mobileImageUrl));
//   };

//   const handleResetMobile = () => {
//     revokeMobileBlob();
//     setSelectedMobileImage(null);
//     setMobilePreview(selectedBanner?.mobileImageUrl ?? null);
//     setRemoveMobile(false);
//   };

//   /* ---------------- SUBMIT ---------------- */

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

//       if (selectedImage) {
//         fd.append("image", selectedImage);
//       }

//       if (selectedMobileImage) {
//         fd.append("mobileImage", selectedMobileImage);
//       } else if (removeMobile) {
//         fd.append("removeMobileImage", "true");
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

//   if (!isOpen || !selectedBanner) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[1px] transition-opacity"
//       onClick={() => {
//         if (!loading) onClose();
//       }}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="edit-banner-drawer-title"
//     >
//       <aside
//         onClick={(e) => e.stopPropagation()}
//         className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200"
//       >
//         {/* DRAWER HEADER */}
//         <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
//               <ImagePlus className="h-4 w-4" />
//             </div>
//             <div>
//               <h2
//                 id="edit-banner-drawer-title"
//                 className="text-base font-semibold text-slate-900"
//               >
//                 Edit Offer Banner
//               </h2>
//               <p className="text-xs text-slate-500">
//                 Banner #{selectedBanner.id} • Update creatives, link, and schedule.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             aria-label="Close drawer"
//             className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* DRAWER BODY */}
//         <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
//           {/* MEDIA SECTION */}
//           <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-4">
//             <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
//               Banner Media
//             </h3>

//             <ImageField
//               label="Desktop Banner Image"
//               hint="Recommended 1521 × 400 px • JPG, PNG or WebP • Max 5 MB"
//               emptyTitle="Click to upload desktop banner image"
//               preview={imagePreview}
//               selectedFile={selectedImage}
//               imgClassName="aspect-[1521/400]"
//               canReset={selectedImage !== null}
//               onSelect={handleSelectDesktop}
//               onReset={handleResetDesktop}
//             />

//             <div className="border-t border-slate-200/80 pt-4">
//               <ImageField
//                 label={
//                   <>
//                     Mobile Banner Image{" "}
//                     <span className="font-normal normal-case text-slate-400">
//                       (optional)
//                     </span>
//                   </>
//                 }
//                 hint="Recommended 800 × 600 px (4:3) • Falls back to desktop image if omitted"
//                 emptyTitle="Click to upload mobile banner image"
//                 preview={mobilePreview}
//                 selectedFile={selectedMobileImage}
//                 imgClassName="h-40"
//                 canReset={selectedMobileImage !== null || removeMobile}
//                 onSelect={handleSelectMobile}
//                 onReset={handleResetMobile}
//                 onRemove={handleRemoveMobile}
//               />
//             </div>
//           </section>

//           {/* DETAILS SECTION */}
//           <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
//             <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
//               Campaign Details
//             </h3>

//             <div>
//               <Label className="mb-1.5 block text-xs font-medium text-slate-700">
//                 Title <span className="text-rose-500">*</span>
//               </Label>
//               <Input
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g. Festive Mega Sale"
//               />
//             </div>

//             <div>
//               <Label className="mb-1.5 block text-xs font-medium text-slate-700">
//                 Subtitle
//               </Label>
//               <TextArea
//                 name="subtitle"
//                 value={formData.subtitle}
//                 onChange={handleChange}
//                 placeholder="Short supporting message for the banner..."
//               />
//             </div>

//             <div>
//               <Label className="mb-1.5 block text-xs font-medium text-slate-700">
//                 Redirect Link
//               </Label>
//               <Input
//                 name="link"
//                 value={formData.link}
//                 onChange={handleChange}
//                 placeholder="https://example.com/offers"
//               />
//             </div>
//           </section>

//           {/* SCHEDULE SECTION */}
//           <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
//             <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
//               Schedule
//             </h3>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div>
//                 <Label className="mb-1.5 block text-xs font-medium text-slate-700">
//                   Start Date
//                 </Label>
//                 <Input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label className="mb-1.5 block text-xs font-medium text-slate-700">
//                   End Date
//                 </Label>
//                 <Input
//                   type="date"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {dateError && (
//               <p className="text-xs font-medium text-rose-600">{dateError}</p>
//             )}
//           </section>
//         </div>

//         {/* DRAWER FOOTER */}
//         <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5">
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
//       </aside>
//     </div>
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
  Calendar,
  ImagePlus,
  Loader2,
  RotateCcw,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
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

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

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
    e.target.value = "";

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

  const actionBtnClass =
    "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </Label>
        {selectedFile && (
          <span className="text-[11px] font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
            {formatSize(selectedFile.size)}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInput}
        className="hidden"
      />

      {preview ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="bg-slate-100/80 p-2 dark:bg-slate-900/80">
            <img
              src={preview}
              alt="Banner Preview"
              className={`w-full rounded-lg object-contain ${imgClassName}`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="min-w-0">
              {selectedFile ? (
                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                  {selectedFile.name}
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current uploaded asset
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {canReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className={actionBtnClass}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  Reset
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-950/70"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={actionBtnClass}
              >
                <UploadCloud className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
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
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-7 text-center transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-brand-500 dark:hover:bg-slate-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <UploadCloud className="h-4 w-4 text-slate-600 dark:text-slate-300" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 sm:text-sm">
              {emptyTitle}
            </p>
          </button>

          {canReset && (
            <button type="button" onClick={onReset} className={actionBtnClass}>
              <RotateCcw className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              Undo remove
            </button>
          )}
        </div>
      )}

      <p className="text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  );
};

/* =========================================================
   RIGHT-SIDE DRAWER
========================================================= */

const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBanner } = useSelector((state: RootState) => state.banner);

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

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

  /* DATE PICKER HELPER */
  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current;
    if (!el || loading) return;
    el.focus();
    if (
      typeof (el as HTMLInputElement & { showPicker?: () => void })
        .showPicker === "function"
    ) {
      try {
        (el as HTMLInputElement & { showPicker: () => void }).showPicker();
      } catch {
        // Fallback when browser blocks programmatic showPicker
      }
    }
  };

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

  /* ESCAPE + BODY SCROLL LOCK */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, loading, onClose]);

  const dateError = useMemo(() => {
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      return "Start date must be on or before end date";
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

  const handleRemoveMobile = () => {
    revokeMobileBlob();
    setSelectedMobileImage(null);
    setMobilePreview(null);
    setRemoveMobile(Boolean(selectedBanner?.mobileImageUrl));
  };

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

      if (selectedImage) {
        fd.append("image", selectedImage);
      }

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

  if (!isOpen || !selectedBanner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-banner-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <ImagePlus className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="edit-banner-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Edit Offer Banner
              </h2>
              <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                Banner #{selectedBanner.id} • Update creatives, link, and
                schedule.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* MEDIA SECTION */}
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Banner Media
            </h3>

            <ImageField
              label="Desktop Banner Image"
              hint="Recommended 1521 × 400 px • JPG, PNG or WebP • Max 5 MB"
              emptyTitle="Click to upload desktop banner image"
              preview={imagePreview}
              selectedFile={selectedImage}
              imgClassName="aspect-[1521/400]"
              canReset={selectedImage !== null}
              onSelect={handleSelectDesktop}
              onReset={handleResetDesktop}
            />

            <div className="border-t border-slate-200/80 pt-4 dark:border-slate-800">
              <ImageField
                label={
                  <>
                    Mobile Banner Image{" "}
                    <span className="font-normal normal-case text-slate-400 dark:text-slate-500">
                      (optional)
                    </span>
                  </>
                }
                hint="Recommended 800 × 600 px (4:3) • Falls back to desktop image if omitted"
                emptyTitle="Click to upload mobile banner image"
                preview={mobilePreview}
                selectedFile={selectedMobileImage}
                imgClassName="h-40"
                canReset={selectedMobileImage !== null || removeMobile}
                onSelect={handleSelectMobile}
                onReset={handleResetMobile}
                onRemove={handleRemoveMobile}
              />
            </div>
          </section>

          {/* DETAILS SECTION */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Campaign Details
            </h3>

            <div>
              <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Festive Mega Sale"
                className={inputCls}
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Subtitle
              </Label>
              <TextArea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Short supporting message for the banner..."
                className={inputCls}
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                Redirect Link
              </Label>
              <Input
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com/offers"
                className={inputCls}
              />
            </div>
          </section>

          {/* SCHEDULE SECTION */}
          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Schedule
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Start Date
                </Label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => openDatePicker(startDateRef)}
                >
                  <input
                    ref={startDateRef}
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    onClick={() => openDatePicker(startDateRef)}
                    disabled={loading}
                    className={`${inputCls} cursor-pointer pr-10 tabular-nums`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDatePicker(startDateRef);
                    }}
                    aria-label="Open start date calendar"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  End Date
                </Label>
                <div
                  className="relative cursor-pointer"
                  onClick={() => openDatePicker(endDateRef)}
                >
                  <input
                    ref={endDateRef}
                    type="date"
                    name="endDate"
                    min={formData.startDate || undefined}
                    value={formData.endDate}
                    onChange={handleChange}
                    onClick={() => openDatePicker(endDateRef)}
                    disabled={loading}
                    className={`${inputCls} cursor-pointer pr-10 tabular-nums`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDatePicker(endDateRef);
                    }}
                    aria-label="Open end date calendar"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {dateError && (
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                {dateError}
              </p>
            )}
          </section>
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !isValid}
            className="dark:!bg-brand-500 dark:hover:!bg-brand-600"
          >
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
      </aside>
    </div>
  );
};

export default EditOfferBannerModal;