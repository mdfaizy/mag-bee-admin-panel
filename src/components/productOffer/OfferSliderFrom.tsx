// "use client";

// import React, { useState, ChangeEvent, FormEvent } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { createOfferBanner } from "@/services/bannerServices/BannerService";
// import { AppDispatch } from "@/redux/store";
// import { toast } from "react-toastify";

// import Label from "../form/Label";
// import Input from "../form/input/InputField";
// import TextArea from "../form/input/TextArea";

// type ImageField = "image" | "mobileImage";

// interface OfferBannerFormData {
//   title: string;
//   subtitle: string;
//   link: string;
//   startDate: string;
//   endDate: string;
//   image: File | null; // desktop (required)
//   mobileImage: File | null; // mobile (optional)
// }

// const MAX_SIZE = 2 * 1024 * 1024; // 2MB

// const OfferSliderForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const [isActive, setIsActive] = useState(true);
//   const [form, setForm] = useState<OfferBannerFormData>({
//     title: "",
//     subtitle: "",
//     link: "",
//     startDate: "",
//     endDate: "",
//     image: null,
//     mobileImage: null,
//   });

//   const [previews, setPreviews] = useState<Record<ImageField, string | null>>({
//     image: null,
//     mobileImage: null,
//   });
//   // mobile input ko reset karne ke liye (same file dobara select ho sake)
//   const [mobileInputKey, setMobileInputKey] = useState(0);
//   const [loading, setLoading] = useState(false);

//   /* -------------------- HANDLERS -------------------- */

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange =
//     (field: ImageField) => (e: ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (!file) return;

//       // file size check (2MB)
//       if (file.size > MAX_SIZE) {
//         toast.error("Image size must be less than 2MB");
//         e.target.value = "";
//         return;
//       }

//       // file type check
//       if (!file.type.startsWith("image/")) {
//         toast.error("Only image files are allowed");
//         e.target.value = "";
//         return;
//       }

//       setForm((prev) => ({ ...prev, [field]: file }));

//       const reader = new FileReader();
//       reader.onloadend = () =>
//         setPreviews((prev) => ({ ...prev, [field]: reader.result as string }));
//       reader.readAsDataURL(file);
//     };

//   const removeMobileImage = () => {
//     setForm((prev) => ({ ...prev, mobileImage: null }));
//     setPreviews((prev) => ({ ...prev, mobileImage: null }));
//     setMobileInputKey((k) => k + 1);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!form.image) {
//       toast.error("Desktop banner image is required");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", form.title);
//     formData.append("subtitle", form.subtitle);
//     formData.append("link", form.link);
//     formData.append("startDate", form.startDate);
//     formData.append("endDate", form.endDate);
//     formData.append("image", form.image);
//     formData.append("isActive", String(isActive));

//     // optional mobile image
//     if (form.mobileImage) {
//       formData.append("mobileImage", form.mobileImage);
//     }

//     try {
//       setLoading(true);
//       await dispatch(createOfferBanner({ formData, router }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------------------- UI -------------------- */

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
//     >
//       <h2 className="text-2xl font-bold text-gray-800">
//         Create New Offer Banner
//       </h2>

//       <div className="flex items-center">
//         <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
//         <button
//           type="button"
//           onClick={() => setIsActive(!isActive)}
//           className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//             isActive ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <span className="sr-only">Toggle Status</span>
//           <span
//             className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
//               isActive ? "translate-x-6" : "translate-x-1"
//             }`}
//           />
//         </button>
//         <span className="ml-2 text-sm font-medium text-gray-700">
//           {isActive ? "Active" : "Inactive"}
//         </span>
//       </div>

//       {/* Title */}
//       <div>
//         <Label>
//           Offer Title <span className="text-red-500">*</span>
//         </Label>
//         <Input
//           type="text"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="e.g. Big Billion Days"
//         />
//       </div>

//       {/* Subtitle */}
//       <div>
//         <Label>Subtitle</Label>
//         <TextArea
//           name="subtitle"
//           value={form.subtitle}
//           onChange={handleChange}
//           placeholder="e.g. Up to 70% off"
//         />
//       </div>

//       {/* Link */}
//       <div>
//         <Label>Redirect Link</Label>
//         <Input
//           type="url"
//           name="link"
//           value={form.link}
//           onChange={handleChange}
//           placeholder="https://example.com"
//         />
//       </div>

//       {/* Dates */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Label>Start Date</Label>
//           <Input
//             type="date"
//             name="startDate"
//             value={form.startDate}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <Label>End Date</Label>
//           <Input
//             type="date"
//             name="endDate"
//             value={form.endDate}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       {/* Desktop Image Upload */}
//       <div className="space-y-2">
//         <Label className="text-sm font-medium text-gray-700">
//           Desktop Banner Image <span className="text-red-500">*</span>
//         </Label>
//         <p className="text-xs text-gray-500">
//           Recommended 1521 × 400 px. PNG, JPG (Max 2MB)
//         </p>

//         <div className="flex flex-wrap gap-6">
//           <label
//             htmlFor="bannerImage"
//             className="flex flex-col items-center justify-center w-64 h-40
//                 border-2 border-dashed border-gray-300 rounded-lg
//                 cursor-pointer hover:border-blue-500
//                 transition-colors bg-gray-50"
//           >
//             <UploadIcon />
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold text-blue-600">
//                 Click to upload
//               </span>
//             </p>

//             <input
//               id="bannerImage"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange("image")}
//               className="hidden"
//               required
//             />
//           </label>

//           {previews.image && (
//             <div className="relative w-64 h-40 border rounded-lg overflow-hidden bg-white shadow-sm">
//               <img
//                 src={previews.image}
//                 alt="Desktop Banner Preview"
//                 className="w-full h-full object-contain"
//               />
//               <span className="absolute top-1 right-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
//                 Desktop
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Image Upload (optional) */}
//       <div className="space-y-2">
//         <Label className="text-sm font-medium text-gray-700">
//           Mobile Banner Image{" "}
//           <span className="font-normal text-gray-400">(optional)</span>
//         </Label>
//         <p className="text-xs text-gray-500">
//           Recommended 800 × 600 px (4:3). PNG, JPG (Max 2MB). Na doge to mobile
//           pe desktop image dikhegi.
//         </p>

//         <div className="flex flex-wrap gap-6">
//           <label
//             htmlFor="mobileBannerImage"
//             className="flex flex-col items-center justify-center w-64 h-40
//                 border-2 border-dashed border-gray-300 rounded-lg
//                 cursor-pointer hover:border-blue-500
//                 transition-colors bg-gray-50"
//           >
//             <UploadIcon />
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold text-blue-600">
//                 Click to upload
//               </span>
//             </p>

//             <input
//               key={mobileInputKey}
//               id="mobileBannerImage"
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange("mobileImage")}
//               className="hidden"
//             />
//           </label>

//           {previews.mobileImage && (
//             <div className="relative w-64 h-40 border rounded-lg overflow-hidden bg-white shadow-sm">
//               <img
//                 src={previews.mobileImage}
//                 alt="Mobile Banner Preview"
//                 className="w-full h-full object-contain"
//               />
//               <span className="absolute top-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
//                 Mobile
//               </span>
//               <button
//                 type="button"
//                 onClick={removeMobileImage}
//                 aria-label="Remove mobile image"
//                 className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
//               >
//                 ✕
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={loading}
//         className={`w-full py-2 rounded text-white ${
//           loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//         }`}
//       >
//         {loading ? "Creating..." : "Create Banner"}
//       </button>
//     </form>
//   );
// };

// const UploadIcon = () => (
//   <svg
//     className="w-10 h-10 mb-2 text-gray-400"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M7 16V12m0 0l2 2m-2-2l-2 2m6-6h.01M12 16v-4m0 0l2 2m-2-2l-2 2m6-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// );

// export default OfferSliderForm;

"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createOfferBanner } from "@/services/bannerServices/BannerService";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import {
  Calendar,
  Upload,
  X,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  ArrowLeft,
  Loader2,
  Megaphone,
} from "lucide-react";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

type ImageField = "image" | "mobileImage";

interface OfferBannerFormData {
  title: string;
  subtitle: string;
  link: string;
  startDate: string;
  endDate: string;
  image: File | null;
  mobileImage: File | null;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

const labelCls =
  "mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300";

const OfferSliderForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  const [isActive, setIsActive] = useState(true);
  const [form, setForm] = useState<OfferBannerFormData>({
    title: "",
    subtitle: "",
    link: "",
    startDate: "",
    endDate: "",
    image: null,
    mobileImage: null,
  });

  const [previews, setPreviews] = useState<Record<ImageField, string | null>>({
    image: null,
    mobileImage: null,
  });
  const [desktopInputKey, setDesktopInputKey] = useState(0);
  const [mobileInputKey, setMobileInputKey] = useState(0);
  const [loading, setLoading] = useState(false);

  /* -------------------- DATE PICKER HELPER -------------------- */
  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const el = ref.current;
    if (!el || loading) return;
    el.focus();
    if (typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === "function") {
      try {
        (el as HTMLInputElement & { showPicker: () => void }).showPicker();
      } catch {
        // Fallback when browser blocks programmatic showPicker
      }
    }
  };

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange =
    (field: ImageField) => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_SIZE) {
        toast.error("Image size must be less than 2MB");
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        e.target.value = "";
        return;
      }

      setForm((prev) => ({ ...prev, [field]: file }));

      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    };

  const removeDesktopImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreviews((prev) => ({ ...prev, image: null }));
    setDesktopInputKey((k) => k + 1);
  };

  const removeMobileImage = () => {
    setForm((prev) => ({ ...prev, mobileImage: null }));
    setPreviews((prev) => ({ ...prev, mobileImage: null }));
    setMobileInputKey((k) => k + 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      toast.error("Desktop banner image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("link", form.link);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("image", form.image);
    formData.append("isActive", String(isActive));

    if (form.mobileImage) {
      formData.append("mobileImage", form.mobileImage);
    }

    try {
      setLoading(true);
      await dispatch(createOfferBanner({ formData, router }));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <Megaphone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Marketing / Offer Banners
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                Create Offer Banner
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* TWO-COLUMN FORM + LIVE PREVIEW */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12"
        >
          {/* LEFT: FORM SECTIONS */}
          <div className="space-y-5 lg:col-span-8">
            {/* CAMPAIGN DETAILS CARD */}
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5 dark:border-slate-800">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Campaign Details
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Configure headline, redirect URL, schedule, and active state.
                  </p>
                </div>

                {/* STATUS TOGGLE */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsActive((prev) => !prev)}
                    disabled={loading}
                    aria-label="Toggle banner active status"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
                      isActive
                        ? "bg-emerald-600"
                        : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs transition-transform ${
                        isActive ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-xs font-semibold ${
                      isActive
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label className={labelCls}>
                  Offer Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Big Billion Days Sale"
                  className={inputCls}
                />
              </div>

              {/* Subtitle */}
              <div>
                <Label className={labelCls}>Subtitle</Label>
                <TextArea
                  name="subtitle"
                  rows={3}
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Up to 70% off on diagnostic & lab essentials"
                  className={inputCls}
                />
              </div>

              {/* Link */}
              <div>
                <Label className={labelCls}>Redirect Link</Label>
                <Input
                  type="url"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  placeholder="https://example.com/offers"
                  className={inputCls}
                />
              </div>

              {/* Dates (Click opens date picker) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelCls}>Start Date</Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => openDatePicker(startDateRef)}
                  >
                    <input
                      ref={startDateRef}
                      type="date"
                      name="startDate"
                      value={form.startDate}
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
                  <Label className={labelCls}>End Date</Label>
                  <div
                    className="relative cursor-pointer"
                    onClick={() => openDatePicker(endDateRef)}
                  >
                    <input
                      ref={endDateRef}
                      type="date"
                      name="endDate"
                      min={form.startDate || undefined}
                      value={form.endDate}
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
            </section>

            {/* CREATIVES UPLOAD CARD */}
            <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Banner Creatives
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  PNG, JPG, or WEBP up to 2MB each.
                </p>
              </div>

              {/* Desktop Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Monitor className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Desktop Banner Image{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                  </Label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    1521 × 400 px recommended
                  </span>
                </div>

                <div className="flex flex-wrap items-start gap-4">
                  <label
                    htmlFor="bannerImage"
                    className="flex h-36 w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-4 text-center transition hover:border-slate-900 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-brand-500 dark:hover:bg-slate-900"
                  >
                    <Upload className="mb-2 h-5 w-5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Click to upload desktop image
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      Max size 2MB
                    </span>
                    <input
                      key={desktopInputKey}
                      id="bannerImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange("image")}
                      className="hidden"
                      required
                    />
                  </label>

                  {previews.image && (
                    <div className="relative h-36 w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <img
                        src={previews.image}
                        alt="Desktop Banner Preview"
                        className="h-full w-full object-contain"
                      />
                      <span className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Desktop
                      </span>
                      <button
                        type="button"
                        onClick={removeDesktopImage}
                        aria-label="Remove desktop image"
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-rose-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Image Upload (Optional) */}
              <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Mobile Banner Image{" "}
                      <span className="font-normal text-slate-400">
                        (optional)
                      </span>
                    </span>
                  </Label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    800 × 600 px (4:3)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  If left empty, mobile screens automatically fall back to the
                  desktop banner.
                </p>

                <div className="flex flex-wrap items-start gap-4">
                  <label
                    htmlFor="mobileBannerImage"
                    className="flex h-36 w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-4 text-center transition hover:border-slate-900 hover:bg-slate-100/70 dark:border-slate-700 dark:bg-slate-950/60 dark:hover:border-brand-500 dark:hover:bg-slate-900"
                  >
                    <Upload className="mb-2 h-5 w-5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Click to upload mobile image
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      Optional · Max 2MB
                    </span>
                    <input
                      key={mobileInputKey}
                      id="mobileBannerImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange("mobileImage")}
                      className="hidden"
                    />
                  </label>

                  {previews.mobileImage && (
                    <div className="relative h-36 w-full max-w-xs overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <img
                        src={previews.mobileImage}
                        alt="Mobile Banner Preview"
                        className="h-full w-full object-contain"
                      />
                      <span className="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Mobile
                      </span>
                      <button
                        type="button"
                        onClick={removeMobileImage}
                        aria-label="Remove mobile image"
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-rose-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: SUMMARY & SUBMIT SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-20 lg:col-span-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Banner Summary
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                      : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-3.5 space-y-3 text-xs">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Title
                  </p>
                  <p className="mt-0.5 font-semibold text-slate-900 dark:text-slate-100">
                    {form.title.trim() || "Untitled Banner"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Schedule Window
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-slate-700 tabular-nums dark:text-slate-300">
                    {form.startDate || "—"} → {form.endDate || "—"}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Desktop Asset</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {form.image ? "Attached" : "Required"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{loading ? "Creating Banner..." : "Create Banner"}</span>
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default OfferSliderForm;