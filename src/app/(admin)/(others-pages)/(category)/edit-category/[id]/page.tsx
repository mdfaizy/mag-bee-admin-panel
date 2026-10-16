// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import { apiConnector } from "@/services/apiConnector";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { FaChevronRight } from "react-icons/fa";

// const EditCategoryPage = () => {
//   const { id } = useParams();
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
    
//   });
// const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   // ✅ fetch by id
//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         setPageLoading(true);

//         const res = await apiConnector("GET", `/category/id/${id}`);
//         console.log("category id", res);

//         const data = res?.data?.category;

//         if (!data) throw new Error("Category not found");

//         setFormData({
//           name: data.name || "",
//           description: data.description || "",
//           imageUrl: data.imageUrl || "",
//         });

//         setImagePreview(data.imageUrl || null);
//       } catch (err) {
//         toast.error("Failed to load category");
//         router.back();
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     if (id) fetchCategory();
//   }, [id, router]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // ✅ image upload
//   const handleImageChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setLoading(true);

//       const uploadForm = new FormData();
//       uploadForm.append("file", file);
//       uploadForm.append("upload_preset", "ecommerce_uploads");
//       uploadForm.append("folder", "categories");

//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dditvtnis/image/upload",
//         {
//           method: "POST",
//           body: uploadForm,
//         }
//       );

//       const data = await res.json();

//       setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
//       setImagePreview(data.secure_url);

//       toast.success("Image uploaded");
//     } catch {
//       toast.error("Image upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSubmit = async () => {
//   //   try {
//   //     setLoading(true);

//   //     const res = await apiConnector("PUT", `/category/${id}`, formData);

//   //     if (!res.data?.success) {
//   //       throw new Error(res.data?.message);
//   //     }

//   //     toast.success("Category updated successfully ✅");
//   //     router.back();
//   //   } catch (err: any) {
//   //     toast.error(err.message || "Update failed");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleSubmit = async () => {
//   try {
//     setLoading(true);

//     const res = await apiConnector("PUT", `/category/${id}`, formData);

//     // ✅ success detect properly
//     if (res?.data?.updatedCategory) {
//       toast.success(res.data.message || "Category updated successfully ✅");
//       router.back();
//     } else {
//       throw new Error(res?.data?.message || "Update failed");
//     }
//   } catch (err: any) {
//     toast.error(err.message || "Update failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   // ✅ page loader
//   if (pageLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col w-full p-6">
//       {/* ✅ Breadcrumb */}
//       <div className="mb-4">
//         <nav className="flex items-center text-sm text-gray-500">
//           <Link href="/" className="hover:text-blue-600">
//             Dashboard
//           </Link>
//           <FaChevronRight className="mx-2 text-xs" />
//           <Link href="/product-category-table" className="hover:text-blue-600">
//             Categories
//           </Link>
//           <FaChevronRight className="mx-2 text-xs" />
//           <span className="text-gray-800 font-medium">
//             Edit Category
//           </span>
//         </nav>
//       </div>

//       {/* ✅ Form Card */}
//       <div className="flex justify-center">
//         <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
//             Edit Category
//           </h2>

//           <div className="space-y-5">
//             <div>
//               <Label>Name</Label>
//               <Input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <Label>Description</Label>
//               <Input
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <Label>Upload Image</Label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="mt-1 block w-full"
//               />
//             </div>

//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-28 rounded mt-2"
//               />
//             )}

//             <div className="flex justify-end gap-3 pt-4">
//               <Button variant="outline" onClick={() => router.back()}>
//                 Cancel
//               </Button>

//               <Button onClick={handleSubmit} disabled={loading}>
//                 {loading ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCategoryPage;



// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import { apiConnector } from "@/services/apiConnector";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { FaChevronRight } from "react-icons/fa";

// const EditCategoryPage = () => {

//   const { id } = useParams();
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//   });

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   // ✅ Fetch Category
//   useEffect(() => {

//     const fetchCategory = async () => {

//       try {

//         const res = await apiConnector("GET", `/category/id/${id}`);

//         const data = res?.data?.category;

//         if (!data) throw new Error("Category not found");

//         setFormData({
//           name: data.name || "",
//           description: data.description || "",
//         });

//         setImagePreview(data.imageUrl || null);

//       } catch (error) {

//         toast.error("Failed to load category");
//         router.back();

//       } finally {

//         setPageLoading(false);

//       }

//     };

//     if (id) fetchCategory();

//   }, [id, router]);



//   // ✅ Handle input
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {

//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));

//   };



//   // ✅ Handle image select
//   const handleImageChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {

//     const file = e.target.files?.[0];
//     if (!file) return;

//     // validation
//     if (!file.type.startsWith("image/")) {
//       toast.error("Only image files allowed");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image must be less than 5MB");
//       return;
//     }

//     setImageFile(file);

//     const preview = URL.createObjectURL(file);
//     setImagePreview(preview);

//   };



//   // ✅ Submit
//   const handleSubmit = async () => {

//     try {

//       setLoading(true);

//       const form = new FormData();

//       form.append("name", formData.name);
//       form.append("description", formData.description);

//       if (imageFile) {
//         form.append("image", imageFile); // important
//       }

//       const res = await apiConnector(
//         "PUT",
//         `/category/${id}`,
//         form
//       );

//       if (res?.data?.updatedCategory) {

//         toast.success("Category updated successfully ✅");
//         router.push("/product-category-table");

//       } else {

//         throw new Error(res?.data?.message || "Update failed");

//       }

//     } catch (error: any) {

//       toast.error(error.message || "Update failed");

//     } finally {

//       setLoading(false);

//     }

//   };



//   // ✅ Page Loader
//   if (pageLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }



//   return (
//     <div className="flex flex-col w-full p-6">

//       {/* Breadcrumb */}
//       <div className="mb-4">
//         <nav className="flex items-center text-sm text-gray-500">
//           <Link href="/" className="hover:text-blue-600">
//             Dashboard
//           </Link>

//           <FaChevronRight className="mx-2 text-xs" />

//           <Link
//             href="/product-category-table"
//             className="hover:text-blue-600"
//           >
//             Categories
//           </Link>

//           <FaChevronRight className="mx-2 text-xs" />

//           <span className="text-gray-800 font-medium">
//             Edit Category
//           </span>
//         </nav>
//       </div>


//       {/* Form */}
//       <div className="flex justify-center">

//         <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow p-6">

//           <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
//             Edit Category
//           </h2>


//           <div className="space-y-5">

//             {/* Name */}
//             <div>
//               <Label>Name</Label>
//               <Input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>


//             {/* Description */}
//             <div>
//               <Label>Description</Label>
//               <Input
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               />
//             </div>


//             {/* Image */}
//             <div>
//               <Label>Upload Image</Label>

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="mt-1 block w-full"
//               />

//             </div>


//             {/* Preview */}
//             {imagePreview && (

//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-28 rounded mt-2 border"
//               />

//             )}


//             {/* Buttons */}
//             <div className="flex justify-end gap-3 pt-4">

//               <Button
//                 variant="outline"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 onClick={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save"}
//               </Button>

//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default EditCategoryPage;


"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Tag,
  UploadCloud,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { apiConnector } from "@/services/apiConnector";
import { toast } from "react-toastify";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* Loading skeleton */
const PageSkeleton = () => (
  <div className="w-full animate-pulse p-6">
    <div className="mb-6 h-4 w-64 rounded-[10px] bg-gray-100 dark:bg-gray-800" />
    <div className="mb-6 h-8 w-56 rounded-[10px] bg-gray-100 dark:bg-gray-800" />
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="h-72 rounded-[10px] bg-gray-100 dark:bg-gray-800 lg:col-span-2" />
      <div className="h-72 rounded-[10px] bg-gray-100 dark:bg-gray-800" />
    </div>
  </div>
);

const EditCategoryPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  useEffect(() => revokeBlob, []);

  // Fetch Category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await apiConnector("GET", `/category/id/${id}`);
        const data = res?.data?.category;

        if (!data) throw new Error("Category not found");

        setFormData({
          name: data.name || "",
          description: data.description || "",
        });

        setOriginalImage(data.imageUrl || null);
        setImagePreview(data.imageUrl || null);
      } catch (error) {
        toast.error("Failed to load category");
        router.back();
      } finally {
        setPageLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // same file dobara select ho sake

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }

    revokeBlob();
    const preview = URL.createObjectURL(file);
    blobUrlRef.current = preview;

    setImageFile(file);
    setImagePreview(preview);
  };

  const handleResetImage = () => {
    revokeBlob();
    setImageFile(null);
    setImagePreview(originalImage);
  };

  const isValid = formData.name.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);

      if (imageFile) {
        form.append("image", imageFile);
      }

      const res = await apiConnector("PUT", `/category/${id}`, form);

      if (res?.data?.updatedCategory) {
        toast.success("Category updated successfully");
        router.push("/product-category-table");
      } else {
        throw new Error(res?.data?.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <PageSkeleton />;

  return (
    <div className="flex w-full flex-col p-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="transition-colors hover:text-gray-900 dark:hover:text-white">
          Dashboard
        </Link>
        <ChevronRight className="mx-2 h-3.5 w-3.5" />
        <Link
          href="/product-category-table"
          className="transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          Categories
        </Link>
        <ChevronRight className="mx-2 h-3.5 w-3.5" />
        <span className="font-medium text-gray-900 dark:text-white">
          Edit Category
        </span>
      </nav>

      {/* Page header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Category
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Category ki details aur image update karein
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details card */}
        <div className="rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
              <Tag className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Category Details
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Name aur description
              </p>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <Label>
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Electronics"
              />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Category ke baare mein short description likhein"
              />
            </div>
          </div>
        </div>

        {/* Image card */}
        <div className="h-fit rounded-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Category Image
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG or WebP • Maximum 5MB
            </p>
          </div>

          <div className="space-y-3 p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview ? (
              <>
                <div className="overflow-hidden rounded-[10px] border border-gray-200 dark:border-gray-800">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
                  />
                </div>

                <div className="min-h-[2.25rem]">
                  {imageFile ? (
                    <>
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        New image • {formatSize(imageFile.size)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Current image
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Change
                  </button>

                  {imageFile && (
                    <button
                      type="button"
                      onClick={handleResetImage}
                      className="inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  )}
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-gray-300 px-4 py-10 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
                  <UploadCloud className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Click karke image upload karein
                </p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-6 flex items-center justify-end gap-3 rounded-[10px] border border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
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
  );
};

export default EditCategoryPage;