// "use client";
// import { toast } from "react-toastify";
// import React, { useState, useEffect } from "react";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import Select from "@/components/form/Select";
// import ChipInput from "@/components/form/input/ChipInput";
// import { HiChevronDown, HiPlus, HiUpload, HiX } from 'react-icons/hi';
// import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// import { SubCategory, CategoryOption } from "@/components/types/category";
// import { apiConnector } from "@/services/apiConnector";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { calculateFinalPrice } from "@/utils/priceUtils"
// type Variant = {
//   sku: string;
//   // price: string;
//   // offer:string;
//   // sellingPrice: string;
//   // stock: string;
//   price: number;
//   sellingPrice: number;
//   stock: number;
//   offer?: number;
//   attributes: { key: string; value: string }[];
// };
// export default function AddNewProduct() {
//   const [category, setCategory] = useState<CategoryOption[]>([]);
//   const [productImages, setProductImages] = useState<File[]>([]);
//   const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
//   const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
//   const [showVariants, setShowVariants] = useState(false);
//   const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const [isActive, setIsActive] = useState(false);


//   const [formData, setFormData] = useState({
//     name: "",
//     categoryId: "",
//     description: "",
//     material: "",
//     keywords: [] as string[],
//     price: "",
//     originalPrice: "",
//     offer: "",
//     length: "",
//     width: "",
//     height: "",
//     weight: "",
//     weightUnit: "kg",
//     stock: "",
//     shippingAvailable: false,
//     skuCode: "",
//     returnPolicy: "",
//     warrantyInfo: "",
//     variants: [
//       {
//         sku: "",
//         price: 0,
//         sellingPrice: 0,
//         stock: 0,
//         attributes: [{ key: "", value: "" }],
//       },
//     ] as Variant[],
//   });


//   const returnPolicyOptions = [
//     { value: "7-day return", label: "7-day return" },
//     { value: "30-day return", label: "30-day return" },
//     { value: "No return", label: "No return" },
//   ];

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await apiConnector("GET", "/category");
//         console.log("res", res);
//         const categories = Array.isArray(res.data?.categories)
//           ? res.data.categories
//           : [];
//         const formatted = categories.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//         }));

//         setCategory(formatted);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchAllSubCategories = async () => {
//       try {
//         const data = await fetchSubCategoryAll();
//         const formatted = data.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//           categoryId: String(item.category.id),
//         }));
//         setSubCategory(formatted);
//       } catch (err) {
//         console.error("Failed to fetch subcategories:", err);
//       }
//     };

//     fetchAllSubCategories();
//   }, []);

//   const handleCategoryChange = (value: string) => {
//     setFormData(prev => ({ ...prev, categoryId: value }));
//     const filtered = subCategory.filter(sc => sc.categoryId === value);
//     setFilteredSubCategory(filtered);
//     setSubCategoryChildren([]);
//   };

//   const toggleVariants = () => {
//     setShowVariants((prev) => !prev);
//   };

//   const removeVariant = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       variants: prev.variants.filter((_, i) => i !== index)
//     }));
//   };
//   const fetchChildren = async (parentId: string) => {
//     try {
//       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
//       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
//       const formatted = children.map((item: any) => ({
//         value: String(item.id),
//         label: item.name,
//         parentId: String(parentId),
//       }));

//       setSubCategoryChildren(formatted);
//     } catch (error) {
//       console.error("Failed to fetch subcategory children:", error);
//       setSubCategoryChildren([]);
//     }
//   };
//   const removeAttribute = (variantIndex: number, attrIndex: number) => {
//     setFormData(prev => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[variantIndex].attributes =
//         updatedVariants[variantIndex].attributes.filter((_, i) => i !== attrIndex);
//       return { ...prev, variants: updatedVariants };
//     });
//   };
//   const computeSellingPrice = (price: number, discount: number): number => {
//     const final = price - (price * discount) / 100;
//     return Math.max(0, Math.round(final));
//   };
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//     options?: {
//       variantIndex?: number;
//       attrIndex?: number;
//       attrField?: "key" | "value";
//     }
//   ) => {
//     const { name, value, type } = e.target;
//     const checked =
//       type === "checkbox"
//         ? (e.target as HTMLInputElement).checked
//         : undefined;

//     // ================= VARIANT HANDLING =================
//     if (options?.variantIndex !== undefined) {
//       const variantIndex = options.variantIndex;
//       const attrIndex = options.attrIndex;
//       const attrField = options.attrField;

//       setFormData((prev) => {
//         const updatedVariants = [...prev.variants];

//         // ✅ attribute update
//         if (
//           attrIndex !== undefined &&
//           attrField &&
//           updatedVariants[variantIndex]?.attributes[attrIndex]
//         ) {
//           updatedVariants[variantIndex].attributes[attrIndex][attrField] =
//             value;
//         } else {
//           // ✅ normal field update
//           if (name !== "attributes") {
//             (updatedVariants[variantIndex] as any)[name] = value;

//             // 🔥 AUTO RECALCULATE (PRODUCTION MUST)
//             if (name === "price" || name === "offer") {
//               const price =
//                 name === "price"
//                   ? Number(value)
//                   : Number(updatedVariants[variantIndex].price);

//               const offer =
//                 name === "offer"
//                   ? Number(value)
//                   : Number(updatedVariants[variantIndex].offer || 0);

//               updatedVariants[variantIndex].sellingPrice =
//                 computeSellingPrice(price, offer);
//             }
//           }
//         }

//         return { ...prev, variants: updatedVariants };
//       });

//       return;
//     }

//     // ================= NORMAL FIELD =================
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };
//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const createEmptyVariant = (): Variant => ({
//     sku: "",
//     price: 0,
//     sellingPrice: 0,
//     stock: 0,
//     offer: 0,
//     attributes: [{ key: "", value: "" }],
//   });

//   const addVariant = () => {
//     setFormData((prev) => ({
//       ...prev,
//       variants: [...prev.variants, createEmptyVariant()],
//     }));
//   };


//   const addAttribute = (variantIndex: number) => {
//     setFormData((prev) => {
//       const updatedVariants = [...prev.variants];
//       updatedVariants[variantIndex].attributes.push({ key: "", value: "" });
//       return { ...prev, variants: updatedVariants };
//     });
//   };
//   // const sumbit function
//   //   const handleSubmit = async (e: React.FormEvent) => {
//   //     e.preventDefault();
//   //     if (isSubmitting) return;
//   //     if (!formData.originalPrice && !showVariants) {
//   //       toast.error("Original price is required");  
//   //       return;
//   //     }
//   // setIsSubmitting(true);
//   //   const toastId = toast.loading("Creating product...");
//   //     const variants = formData.variants
//   //       .filter(v => v.sku || v.price || v.stock)
//   //       .map(v => ({
//   //         ...v,
//   //         price: Number(v.price) || 0,
//   //         stock: Number(v.stock) || 0,
//   //         attributes: v.attributes.filter(a => a.key || a.value),
//   //       }));

//   //     const payload = {
//   //       ...formData,
//   //       isActive: isActive,
//   //       //  hasVariants: showVariants && variants.length > 0, 
//   //       hasVariants: showVariants && variants.length > 0,
//   //       originalPrice: Number(formData.originalPrice),
//   //       price: Number(formData.price) || (variants.length ? 0 : Number(formData.originalPrice)),
//   //       offer: Number(formData.offer) || 0,
//   //       stock: Number(formData.stock) || (variants.length ? 0 : Number(formData.stock)),
//   //       variants: showVariants && variants.length > 0 ? JSON.stringify(variants) : undefined,
//   //       shippingAvailable: String(formData.shippingAvailable),
//   //       keywords: JSON.stringify(formData.keywords),
//   //     };
//   //     console.log("showVariants:", showVariants);
//   //     console.log("variants after filtering:", variants);
//   //     console.log("hasVariants value:", showVariants && variants.length > 0);
//   //     console.log("variants length:", variants.length);
//   //     console.log("showVariants:", showVariants);
//   //     console.log("hasVariants to send:", variants.length > 0);

//   //     const form = new FormData();
//   //     Object.entries(payload).forEach(([key, value]) => {
//   //       form.append(key, value !== undefined && value !== null ? value.toString() : "");
//   //     });
//   //     productImages.forEach((file) => form.append("imageUrl", file));
//   //     try {
//   //       const res = await apiConnector("POST", "/product"
//   //         , form
//   //       );
//   //       //  dispatch(createProductThunk(payload, router));
//   //       if (res.status === 201 || res.status === 200) {
//   //        toast.success("✅ Product created successfully!");
//   //        router.push("/");
//   //       }
//   //     } catch (error: any) {
//   //       // console.error("Error submitting form:", error.response?.data || error.message);
//   //       toast.error("Failed to create product");
//   //     }catch (error: any) {
//   //     toast.dismiss(toastId);
//   //     console.error("Error submitting form:", error);
//   //     toast.error(
//   //       error?.response?.data?.message || "❌ Submission failed"
//   //     );
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   //   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     if (!formData.originalPrice && !showVariants) {
//       toast.error("Original price is required");
//       return;
//     }

//     setIsSubmitting(true);
//     const toastId = toast.loading("Creating product...");

//     try {
//       const variants = formData.variants
//         .filter(v => v.sku || v.price || v.stock)
//         .map(v => ({
//           ...v,
//           price: Number(v.price) || 0,
//           stock: Number(v.stock) || 0,
//           attributes: v.attributes.filter(a => a.key || a.value),
//         }));

//       const payload = {
//         ...formData,
//         isActive: isActive,
//         hasVariants: showVariants && variants.length > 0,
//         originalPrice: Number(formData.originalPrice),
//         price:
//           Number(formData.price) ||
//           (variants.length ? 0 : Number(formData.originalPrice)),
//         offer: Number(formData.offer) || 0,
//         stock:
//           Number(formData.stock) ||
//           (variants.length ? 0 : Number(formData.stock)),
//         variants:
//           showVariants && variants.length > 0
//             ? JSON.stringify(variants)
//             : undefined,
//         shippingAvailable: String(formData.shippingAvailable),
//         keywords: JSON.stringify(formData.keywords),
//       };

//       const form = new FormData();
//       Object.entries(payload).forEach(([key, value]) => {
//         form.append(
//           key,
//           value !== undefined && value !== null ? value.toString() : ""
//         );
//       });

//       productImages.forEach(file => form.append("imageUrl", file));

//       const res = await apiConnector("POST", "/product", form);

//       toast.dismiss(toastId);

//       if (res.status === 201 || res.status === 200) {
//         toast.success("✅ Product created successfully!");
//         router.push("/");
//       } else {
//         toast.error("Failed to create product");
//       }
//     } 
//     // catch (error: any) {
//     //   toast.dismiss(toastId);
//     //   console.error("Error submitting form:", error);
//     //   toast.error(
//     //     error?.response?.data?.message || "❌ Submission failed"
//     //   );
//     // }
//     catch (error: any) {

//   toast.dismiss(toastId);

//   console.error("Product create error:", error);

//   let message = "❌ Failed to create product";

//   if (error?.response?.data?.message) {
//     message = error.response.data.message;
//   }
//   else if (error?.response?.data?.error) {
//     message = error.response.data.error;
//   }
//   else if (error?.message) {
//     message = error.message;
//   }

//   toast.error(message, {
//     position: "top-right"
//   });

// }
//      finally {
//       setIsSubmitting(false);
//     }
//   };





//   return (
//     <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
//       <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Add Product</h1>
//           <div className="flex items-center">
//             <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
//             {/* <button
//               type="button"
//               onClick={() => setIsActive(!isActive)}
//               className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
//             > */}
//             {/* <button
//   type="button"
//   onClick={() => setIsActive(prev => !prev)}
//   className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
//     isActive ? "bg-green-500" : "bg-gray-300"
//   }`}
// > */}
//             <button
//               type="button"
//               onClick={() => setIsActive(prev => !prev)}
//               className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-green-500" : "bg-gray-300"
//                 }`}
//             >


//               <span className="sr-only">Toggle Status</span>
//               <span
//                 className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
//               />
//             </button>
//             <span className="ml-2 text-sm font-medium text-gray-700">
//               {isActive ? 'Active' : 'Inactive'}
//             </span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Basic Information</h2>
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div>
//                     <Label>Product Name<span className="text-red-500">*</span></Label>
//                     <Input
//                       type="text"
//                       name="name"
//                       placeholder="Enter your product name"
//                       value={formData.name}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div>
//                     <Label>SKU Code<span className="text-red-500">*</span></Label>
//                     <Input
//                       type="text"
//                       name="skuCode"
//                       placeholder="Enter SKU code"
//                       value={formData.skuCode}
//                       onChange={handleChange}

//                     />

//                   </div>
//                   <div>
//                     <Label>Material<span className="text-red-500">*</span></Label>
//                     <Input
//                       type="text"
//                       name="material"
//                       placeholder="Enter material"
//                       value={formData.material}
//                       onChange={handleChange}

//                     />

//                   </div>
//                 </div>
//               </div>

//               {/* Dimensions */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Dimensions</h2>
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <Label>Length<span className="text-red-500">*</span></Label>
//                       <Input
//                         type="text"
//                         name="length"
//                         placeholder="Enter length"
//                         value={formData.length}
//                         onChange={handleChange}

//                       />

//                     </div>
//                     <div>
//                       <Label>Width<span className="text-red-500">*</span></Label>
//                       <Input
//                         type="text"
//                         name="width"
//                         placeholder="Enter width"
//                         value={formData.width}
//                         onChange={handleChange}

//                       />

//                     </div>
//                     <div>
//                       <Label>Height<span className="text-red-500">*</span></Label>
//                       <Input
//                         type="text"
//                         name="height"
//                         placeholder="Enter height"
//                         value={formData.height}
//                         onChange={handleChange}

//                       />

//                     </div>
//                   </div>
//                   <div>
//                     <Label>Weight<span className="text-red-500">*</span></Label>
//                     <div className="flex items-center gap-2">
//                       <Input
//                         type="number"
//                         name="weight"
//                         placeholder="Enter weight"
//                         value={formData.weight}
//                         onChange={handleChange}

//                         // onChange={handleChange}
//                         className="w-full"
//                         min="0"
//                       />
//                       <select
//                         name="weightUnit"
//                         value={formData.weightUnit}

//                         onChange={handleChange}
//                         className="border rounded px-2 py-3 text-sm"
//                       >
//                         <option value="kg">kg</option>
//                         <option value="g">g</option>
//                       </select>

//                     </div>

//                   </div>
//                 </div>
//               </div>

//               {/* Policies */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Policies</h2>
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div className="relative">
//                     <Label>Return Policy</Label>
//                     <Select
//                       options={returnPolicyOptions}
//                       placeholder="Select Return Policy"
//                       onChange={(value) => handleSelectChange("returnPolicy", value)}
//                     />
//                     <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
//                       <HiChevronDown className="w-4 h-4" />
//                     </span>
//                   </div>

//                   <div>
//                     <Label>Warranty Info</Label>
//                     <TextArea
//                       name="warrantyInfo"
//                       placeholder="e.g., 1-year replacement warranty"
//                       value={formData.warrantyInfo}
//                       onChange={handleChange}

//                       rows={2}
//                     />

//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               {/* Type */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Type</h2>
//                 </div>
//                 <div className="p-4 space-y-4">
//                   <div className="relative">
//                     <Label>Select category:<span className="ml-2 text-red-500">*</span></Label>
//                     <Select
//                       options={category}
//                       placeholder="Select Category"
//                       onChange={handleCategoryChange}
//                       className="appearance-none pr-10"
//                     />

//                     <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
//                       <HiChevronDown className="w-4 h-4" />
//                     </span>
//                   </div>

//                   {filteredSubCategory.length > 0 && (
//                     <div className="relative">
//                       <Label>Select sub-category:<span className="ml-2 text-red-500">*</span></Label>
//                       <Select
//                         options={filteredSubCategory}
//                         placeholder="Select SubCategory"
//                         // onChange={(value: string) => setFormData(prev => ({ ...prev, subCategoryId: value }))}
//                         onChange={(value: string) => {
//                           setFormData(prev => ({ ...prev, subCategoryId: value }));
//                           fetchChildren(value); // fetch children on subcategory select
//                         }}
//                         className="appearance-none pr-10"
//                       />


//                     </div>
//                   )}



//                   {subCategoryChildren.length > 0 && (
//                     <div className="relative">
//                       <Label>Select Sub Category Child:<span className="ml-2 text-red-500">*</span></Label>
//                       <Select
//                         options={subCategoryChildren}
//                         placeholder="Select Child SubCategory"
//                         onChange={(value: string) =>
//                           setFormData((prev) => ({ ...prev, childSubCategoryId: value }))
//                         }

//                       />

//                       <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
//                         <HiChevronDown className="w-4 h-4" />
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Pricing */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Pricing</h2>
//                 </div>
//                 <div className="p-4 space-y-4">
//                   {!showVariants && (
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <Label>Original Price<span className="text-red-500">*</span></Label>
//                         <Input
//                           name="originalPrice"
//                           placeholder="Original Price"
//                           type="number"
//                           value={formData.originalPrice}
//                           onChange={handleChange}
//                         />

//                       </div>

//                       <div>
//                         <Label>Offer %<span className="text-red-500">*</span></Label>
//                         <Input
//                           name="offer"
//                           placeholder="Offer %"
//                           type="number"
//                           value={formData.offer}
//                           onChange={handleChange}
//                         />

//                       </div>
//                       <div>
//                         <Label>Final Price<span className="text-red-500">*</span></Label>
//                         <Input
//                           name="price"
//                           placeholder="Final Price"
//                           type="number"
//                           // value={calculateFinalPrice().toFixed(2)}
//                           value={calculateFinalPrice(
//                             Number(formData.originalPrice),
//                             Number(formData.offer)
//                           )}



//                           // {...({ readOnly: true } as any)}
//                           className="bg-gray-100 cursor-not-allowed"
//                         />

//                       </div>
//                     </div>
//                   )}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {!showVariants && (
//                       <div>
//                         <Label>Stock<span className="text-red-500">*</span></Label>
//                         <Input
//                           type="number"
//                           name="stock"
//                           placeholder="Enter Stock"
//                           value={formData.stock}
//                           onChange={handleChange}

//                         />


//                       </div>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         name="shippingAvailable"
//                         id="shippingAvailable"
//                         checked={formData.shippingAvailable}
//                         // id="shippingAvailable"

//                         onChange={handleChange}
//                         className="w-4 h-4"
//                       />
//                       <label htmlFor="shippingAvailable" className="text-sm">
//                         Free Shipping Available
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Tags */}
//               <div className="border border-gray-200 rounded-lg">
//                 <div className="bg-gray-100 p-3 border-b border-gray-200">
//                   <h2 className="font-semibold text-gray-700">Tags</h2>
//                 </div>
//                 <div className="p-4">
//                   <div>
//                     <Label>Keywords (Tags)</Label>
//                     <ChipInput
//                       value={formData.keywords}
//                       onChange={(keywords) => setFormData(prev => ({ ...prev, keywords }))}
//                       placeholder="Add keywords"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Description - Full Width */}
//           <div className="mt-6 border border-gray-200 rounded-lg">
//             <div className="bg-gray-100 p-3 border-b border-gray-200">
//               <h2 className="font-semibold text-gray-700">Details</h2>
//             </div>
//             {/* <div className="p-4">
//               <Label>Product Description</Label>
//               <TextArea
//                 name="description"
//                 placeholder="Enter description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={4}
//               />
//             </div> */}
//             <div className="p-4 space-y-2">
//   <Label className="text-sm font-medium text-gray-700">
//     Product Description <span className="text-red-500">*</span>
//   </Label>

//   <TextArea
//     name="description"
//     placeholder="Write detailed product description (features, specifications, warranty, etc.)"
//     value={formData.description}
//     onChange={handleChange}
//     rows={6}
//     className="w-full rounded-lg border border-gray-300 p-3 text-sm 
//                focus:border-blue-500 focus:ring-1 focus:ring-blue-500
//                resize-y min-h-[140px]"
//   />

//   <p className="text-xs text-gray-500">
//     Add full product details like features, specifications, material, warranty etc.
//   </p>
// </div>
//           </div>

//           {/* Product Images - Full Width */}
//           <div className="mt-6 border border-gray-200 rounded-lg">
//             <div className="bg-gray-100 p-3 border-b border-gray-200">
//               <h2 className="font-semibold text-gray-700">Product Images</h2>
//             </div>
//             <div className="p-4">
//               <Label>Upload Product Images <span className="text-red-500">*</span></Label>

//               <div className="mt-4 flex flex-wrap gap-4">
//                 {productImages.map((file, index) => (
//                   <div key={index} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`product-${index}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
//                       className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <HiX className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//                 <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
//                   <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
//                   <span className="text-sm text-gray-500 text-center">Upload Image</span>
//                   <input
//                     type="file"
//                     name="imageUrl"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) setProductImages(prev => [...prev, file]);
//                     }}
//                     className="hidden"
//                     multiple
//                   />
//                 </label>
//               </div>
//               {productImages.length === 0 && (
//                 <p className="text-red-500 text-sm mt-2">Please upload at least one image</p>
//               )}
//             </div>
//           </div>
//           {/* Variants - Full Width */}
//           <div className="mt-6 border border-gray-200 rounded-lg">
//             <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="font-semibold text-gray-700">Variants</h2>
//               <button
//                 type="button"
//                 onClick={toggleVariants}
//                 className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
//               >
//                 {showVariants ? (
//                   <>
//                     <HiX className="w-4 h-4 mr-1" /> Remove Variants
//                   </>
//                 ) : (
//                   <>
//                     <HiPlus className="w-4 h-4 mr-1" /> Add Variants
//                   </>
//                 )}
//               </button>
//             </div>
//             {showVariants && (
//               <div className="p-4">
//                 {formData.variants.map((variant, vIndex) => (
//                   <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
//                     {formData.variants.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeVariant(vIndex)}
//                         className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//                         title="Remove variant"
//                       >
//                         <HiX className="w-5 h-5" />
//                       </button>
//                     )}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//                       <div>
//                         <Label>SKU<span className="text-red-500">*</span></Label>
//                         <Input
//                           name="sku"
//                           value={variant.sku}
//                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                         />
//                       </div>
//                       <div>
//                         <Label>Stock<span className="text-red-500">*</span></Label>
//                         <Input
//                           name="stock"
//                           value={variant.stock}
//                           onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                         />
//                       </div>
//                       <div className='flex grid grid-cols-1 md:grid-cols-3 gap-5 mb-5'>
//                         <div>
//                           <Label>Price<span className="text-red-500">*</span></Label>
//                           <Input
//                             name="price"
//                             type="number"
//                             value={variant.price}
//                             onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                           />
//                         </div>
//                         <div>
//                           <Label>Offer %</Label>
//                           <Input
//                             name="offer"
//                             type="number"
//                             value={variant.offer || 0}
//                             onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                           />
//                         </div>
//                         <div>
//                           <Label>Selling Price<span className="text-red-500">*</span></Label>
//                           <Input
//                             name="sellingPrice"
//                             type="number"
//                             value={variant.sellingPrice}
//                             onChange={(e) => handleChange(e, { variantIndex: vIndex })}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-5">
//                       <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>
//                       {variant.attributes.map((attr, aIndex) => (
//                         <div key={aIndex} className="flex gap-3 mb-3 items-end">
//                           <div className="flex-1">
//                             <Label>Key</Label>
//                             <Input
//                               value={attr.key}
//                               onChange={(e) => handleChange(e, {
//                                 variantIndex: vIndex,
//                                 attrIndex: aIndex,
//                                 attrField: "key",
//                               })}
//                               placeholder="e.g., Color"
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <Label>Value</Label>
//                             <Input
//                               value={attr.value}
//                               onChange={(e) => handleChange(e, {
//                                 variantIndex: vIndex,
//                                 attrIndex: aIndex,
//                                 attrField: "value",
//                               })}
//                               placeholder="e.g., Red"
//                             />
//                           </div>
//                           {variant.attributes.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeAttribute(vIndex, aIndex)}
//                               className="text-red-500 hover:text-red-700 mb-1"
//                               title="Remove attribute"
//                             >
//                               <HiX className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                       ))}

//                       <button
//                         type="button"
//                         onClick={() => addAttribute(vIndex)}
//                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
//                       >
//                         <HiPlus className="w-4 h-4 mr-1" /> Add Attribute
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addVariant}
//                   className="text-green-600 hover:text-green-800 font-medium flex items-center"
//                 >
//                   <HiPlus className="w-5 h-5 mr-1" /> Add Variant
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="mt-8 text-center">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2
//     ${isSubmitting
//                   ? "bg-blue-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                   Creating...
//                 </>
//               ) : (
//                 "Submit"
//               )}
//             </button>

//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// "use client";
// import { toast } from "react-toastify";
// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import Select from "@/components/form/Select";
// import ChipInput from "@/components/form/input/ChipInput";
// import { HiChevronDown, HiPlus, HiUpload, HiX } from 'react-icons/hi';
// import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
// import { SubCategory, CategoryOption } from "@/components/types/category";
// import { apiConnector } from "@/services/apiConnector";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import { calculateFinalPrice } from "@/utils/priceUtils";
// // import { productSchema, ProductFormData } from "@/validations/category.schema";
// import { ProductFormData,productSchema } from "@/validations/product.schema";
// const parseNumber = (v: any) => {
//   if (v === "" || v === null || v === undefined) return undefined;
//   const num = Number(v);
//   return isNaN(num) ? undefined : num;
// };
// type Variant = {
//   sku: string;
//   price: number;
//   sellingPrice: number;
//   stock: number;
//   offer?: number;
//   attributes: { key: string; value: string }[];
// };

// export default function AddNewProduct() {
//   const [category, setCategory] = useState<CategoryOption[]>([]);
//   const [productImages, setProductImages] = useState<File[]>([]);
//   const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
//   const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
//   const [showVariants, setShowVariants] = useState(false);
//   const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isActive, setIsActive] = useState(false);

//   const dispatch = useDispatch<any>();
//   const router = useRouter();

//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     setValue,
//     getValues,
//     formState: { errors },
//     trigger,
//   } = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//      mode: "onSubmit",
//     defaultValues: {
//       name: "",
//       categoryId: "",
//       description: "",
//       material: "",
//       keywords: [],
//       price: "",
//       originalPrice: "",
//       offer: "",
//       length: "",
//       width: "",
//       height: "",
//       weight: "",
//       weightUnit: "kg",
//       stock: "",
//       shippingAvailable: false,
//       skuCode: "",
//       returnPolicy: "",
//       warrantyInfo: "",
//       hasVariants: false,
//       variants: [],
//     },
//   });
// console.log(errors);
//   // Watch values
//   const watchOriginalPrice = watch("originalPrice");
//   const watchOffer = watch("offer");
//   const watchHasVariants = watch("hasVariants");
//   const watchVariants = watch("variants");

//   // Update showVariants state when hasVariants changes
//   useEffect(() => {
//     setShowVariants(watchHasVariants);
//   }, [watchHasVariants]);

//   // Initialize variants when toggling on
//   useEffect(() => {
//     if (watchHasVariants && (!watchVariants || watchVariants.length === 0)) {
//       setValue("variants", [{
//         sku: "",
//         // price: 0,
//         // sellingPrice: 0,
//         // stock: 0,
//         price: undefined,
// sellingPrice: undefined,
// stock: undefined,
//         attributes: [{ key: "", value: "" }],
//       }]);
//     }
//   }, [watchHasVariants, setValue, watchVariants]);

//   // Field array for variants
//   const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
//     control,
//     name: "variants",
//   });

//   // Field array for attributes within variants
//   const addAttribute = (variantIndex: number) => {
//     const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
//     setValue(`variants.${variantIndex}.attributes`, [...currentAttributes, { key: "", value: "" }]);
//   };

//   const removeAttribute = (variantIndex: number, attrIndex: number) => {
//     const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
//     setValue(`variants.${variantIndex}.attributes`, currentAttributes.filter((_, i) => i !== attrIndex));
//   };

//   // Calculate selling price for variant
//   const updateVariantSellingPrice = (variantIndex: number, price: number, offer: number = 0) => {
//     const sellingPrice = calculateFinalPrice(price, offer);
//     setValue(`variants.${variantIndex}.sellingPrice`, sellingPrice);
//   };

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await apiConnector("GET", "/category");
//         const categories = Array.isArray(res.data?.categories) ? res.data.categories : [];
//         const formatted = categories.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//         }));
//         setCategory(formatted);
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch subcategories
//   useEffect(() => {
//     const fetchAllSubCategories = async () => {
//       try {
//         const data = await fetchSubCategoryAll();
//         const formatted = data.map((item: any) => ({
//           value: String(item.id),
//           label: item.name,
//           categoryId: String(item.category.id),
//         }));
//         setSubCategory(formatted);
//       } catch (err) {
//         console.error("Failed to fetch subcategories:", err);
//       }
//     };
//     fetchAllSubCategories();
//   }, []);

//   // Filter subcategories when category changes
//   const handleCategoryChange = (value: string) => {
//     setValue("categoryId", value);
//     setValue("subCategoryId", "");
//     setValue("childSubCategoryId", "");
//     const filtered = subCategory.filter(sc => sc.categoryId === value);
//     setFilteredSubCategory(filtered);
//     setSubCategoryChildren([]);
//     trigger("categoryId");
//   };

//   // Fetch children subcategories
//   const fetchChildren = async (parentId: string) => {
//     try {
//       const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
//       const children = Array.isArray(res.data.children) ? res.data.children : res.data;
//       const formatted = children.map((item: any) => ({
//         value: String(item.id),
//         label: item.name,
//         parentId: String(parentId),
//       }));
//       setSubCategoryChildren(formatted);
//     } catch (error) {
//       console.error("Failed to fetch subcategory children:", error);
//       setSubCategoryChildren([]);
//     }
//   };

//   // Toggle variants
//   const toggleVariants = () => {
//     const newValue = !watchHasVariants;
//     setValue("hasVariants", newValue);
    
//     if (!newValue) {
//       // Clear variants when turning off
//       setValue("variants", []);
//     }
//   };

//   // Form submission
//   const onSubmit = async (data: ProductFormData) => {
//     if (isSubmitting) return;

//     // Additional validation for images
//     if (productImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }

//     setIsSubmitting(true);
//     const toastId = toast.loading("Creating product...");

//     try {
//       // Prepare variants - only if hasVariants is true
//       let variants: any[] = [];
      
//       if (data.hasVariants && data.variants) {
//         variants = data.variants
//           .filter(v => v.sku && v.price > 0)
//           .map(v => ({
//             ...v,
//             price: Number(v.price),
//             stock: Number(v.stock),
//             attributes: v.attributes.filter(a => a.key && a.value),
//           }));
//       }
// console.log("VARIANTS:", variants);
//       // Prepare payload
//       const payload = {
//         ...data,
//         isActive,
//         hasVariants: data.hasVariants,
//         // originalPrice: data.hasVariants ? 0 : Number(data.originalPrice) || 0,
//         // price: data.hasVariants ? 0 : Number(data.price) || Number(data.originalPrice) || 0,
//         // offer: data.hasVariants ? 0 : Number(data.offer) || 0,
//         // stock: data.hasVariants ? 0 : Number(data.stock) || 0,
//         originalPrice: data.hasVariants ? undefined : data.originalPrice,
// price: data.hasVariants ? undefined : data.price,
// stock: data.hasVariants ? undefined : data.stock,
// offer: data.hasVariants ? undefined : data.offer,
//         variants: data.hasVariants && variants.length > 0 ? JSON.stringify(variants) : undefined,
//         shippingAvailable: String(data.shippingAvailable),
//         keywords: JSON.stringify(data.keywords),
//       };

//       // Create FormData
//       const form = new FormData();
//       Object.entries(payload).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           form.append(key, value.toString());
//         }
//       });

//       // Add images
//       productImages.forEach(file => form.append("imageUrl", file));

//       // API call
//       const res = await apiConnector("POST", "/product", form);

//       toast.dismiss(toastId);

//       if (res.status === 201 || res.status === 200) {
//         toast.success("✅ Product created successfully!");
//         router.push("/");
//       } else {
//         toast.error("Failed to create product");
//       }
//     } catch (error: any) {
//       toast.dismiss(toastId);
//       console.error("Product create error:", error);

//       let message = "❌ Failed to create product";
//       if (error?.response?.data?.message) {
//         message = error.response.data.message;
//       } else if (error?.response?.data?.error) {
//         message = error.response.data.error;
//       } else if (error?.message) {
//         message = error.message;
//       }

//       toast.error(message, {
//         position: "top-right"
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };



"use client";
import { z } from "zod";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
import { HiChevronDown, HiPlus, HiUpload, HiX } from 'react-icons/hi';
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { SubCategory, CategoryOption } from "@/components/types/category";
import { apiConnector } from "@/services/apiConnector";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { calculateFinalPrice } from "@/utils/priceUtils";
import { ProductFormData, productSchema } from "@/validations/product.schema";

const parseNumber = (v: any) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const num = Number(v);
  return isNaN(num) ? undefined : num;
};

export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   watch,
  //   setValue,
  //   getValues,
  //   formState: { errors },
  //   trigger,
  //   setError,
  //   clearErrors
  // } = 
  // // useForm<ProductFormData>
  // useForm<z.infer<typeof productSchema>>
  // ({
  //   resolver: zodResolver(productSchema),
  //   mode: "onChange", // Change to onChange for better validation
  //   defaultValues: {
  //     name: "",
  //     categoryId: "",
  //     description: "",
  //     material: "",
  //     keywords: [],
  //     price: undefined,
  //     originalPrice: undefined,
  //     offer: undefined,
  //     length: "",
  //     width: "",
  //     height: "",
  //     weight: "",
  //     weightUnit: "kg",
  //     stock: undefined,
  //     shippingAvailable: false,
  //     skuCode: "",
  //     returnPolicy: "",
  //     warrantyInfo: "",
  //     hasVariants: false,
  //     variants: [],
  //   },
  // });

  // Watch values
  
  const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  getValues,
  formState: { errors },
  trigger,
  setError,
  clearErrors
} = useForm<ProductFormData>({
  // resolver: zodResolver(productSchema),
  resolver: zodResolver(productSchema) as any, 
  mode: "onChange",
  defaultValues: {
    name: "",
    categoryId: "",
    description: "",
    material: "",
    keywords: [],
    price: undefined,
    originalPrice: undefined,
    offer: undefined,
    length: "",
    width: "",
    height: "",
    weight: "",
    weightUnit: "kg",
    stock: undefined,
    shippingAvailable: false,
    skuCode: "",
    returnPolicy: "",
    warrantyInfo: "",
    hasVariants: false,
    variants: [],
  },
});

  const watchOriginalPrice = watch("originalPrice");
  const watchOffer = watch("offer");
  const watchHasVariants = watch("hasVariants");
  const watchVariants = watch("variants");

  // Update showVariants state when hasVariants changes
  useEffect(() => {
    setShowVariants(watchHasVariants);
  }, [watchHasVariants]);

  // Initialize variants when toggling on
  useEffect(() => {
    if (watchHasVariants && (!watchVariants || watchVariants.length === 0)) {
      setValue("variants", [{
        sku: "",
        price: undefined,
        sellingPrice: undefined,
        stock: undefined,
        offer: undefined,
        attributes: [{ key: "", value: "" }],
      }]);
    }
  }, [watchHasVariants, setValue, watchVariants]);

  // Field array for variants
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  // Field array for attributes within variants
  const addAttribute = (variantIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    setValue(`variants.${variantIndex}.attributes`, [...currentAttributes, { key: "", value: "" }]);
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    const currentAttributes = getValues(`variants.${variantIndex}.attributes`) || [];
    setValue(`variants.${variantIndex}.attributes`, currentAttributes.filter((_, i) => i !== attrIndex));
  };

  // Calculate selling price for variant
  const updateVariantSellingPrice = (variantIndex: number, price: number, offer: number = 0) => {
    const sellingPrice = calculateFinalPrice(price, offer);
    setValue(`variants.${variantIndex}.sellingPrice`, sellingPrice);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", "/category");
        const categories = Array.isArray(res.data?.categories) ? res.data.categories : [];
        const formatted = categories.map((item: any) => ({
          value: String(item.id),
          label: item.name,
        }));
        setCategory(formatted);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      try {
        const data = await fetchSubCategoryAll();
        const formatted = data.map((item: any) => ({
          value: String(item.id),
          label: item.name,
          categoryId: String(item.category.id),
        }));
        setSubCategory(formatted);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    };
    fetchAllSubCategories();
  }, []);

  // Filter subcategories when category changes
  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
    setValue("subCategoryId", "");
    setValue("childSubCategoryId", "");
    const filtered = subCategory.filter(sc => sc.categoryId === value);
    setFilteredSubCategory(filtered);
    setSubCategoryChildren([]);
    trigger("categoryId");
  };

  // Fetch children subcategories
  const fetchChildren = async (parentId: string) => {
    try {
      const res = await apiConnector("GET", `/subcategories/${parentId}/children`);
      const children = Array.isArray(res.data.children) ? res.data.children : res.data;
      const formatted = children.map((item: any) => ({
        value: String(item.id),
        label: item.name,
        parentId: String(parentId),
      }));
      setSubCategoryChildren(formatted);
    } catch (error) {
      console.error("Failed to fetch subcategory children:", error);
      setSubCategoryChildren([]);
    }
  };

  // Toggle variants
  const toggleVariants = () => {
    const newValue = !watchHasVariants;
    setValue("hasVariants", newValue, { shouldValidate: true });
    
    if (!newValue) {
      setValue("variants", []);
    }
  };

  // Check if variant SKU exists
  const checkVariantSkuExists = async (sku: string, index: number) => {
    if (!sku || sku.length < 3) return;
    
    try {
      const response = await apiConnector("GET", `/product/check-sku?variantSku=${sku}`);
      if (response.data.exists) {
        setError(`variants.${index}.sku`, { 
          type: "manual", 
          message: "This variant SKU already exists" 
        });
        return true;
      } else {
        clearErrors(`variants.${index}.sku`);
        return false;
      }
    } catch (error) {
      console.error("Error checking variant SKU:", error);
      return false;
    }
  };

  // Form submission
  // const onSubmit = async (data: ProductFormData) => {
  //   if (isSubmitting) return;

  //   // Validate images
  //   if (productImages.length === 0) {
  //     toast.error("Please upload at least one image");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   const toastId = toast.loading("Creating product...");

  //   try {
  //     // Prepare payload
  //     const payload: any = {
  //       name: data.name,
  //       skuCode: data.skuCode,
  //       material: data.material,
  //       description: data.description,
  //       categoryId: data.categoryId,
  //       subCategoryId: data.subCategoryId || null,
  //       childSubCategoryId: data.childSubCategoryId || null,
  //       length: data.length,
  //       width: data.width,
  //       height: data.height,
  //       weight: data.weight,
  //       weightUnit: data.weightUnit,
  //       returnPolicy: data.returnPolicy || null,
  //       warrantyInfo: data.warrantyInfo || null,
  //       keywords: JSON.stringify(data.keywords),
  //       shippingAvailable: data.shippingAvailable, // Boolean rahne do
  //       hasVariants: data.hasVariants, // Boolean rahne do
  //       isActive: isActive,
  //     };

  //     // Handle pricing based on variants
  //     if (data.hasVariants) {
  //       payload.originalPrice = null;
  //       payload.price = null;
  //       payload.stock = null;
  //       payload.offer = null;
        
  //       // Prepare variants - DON'T filter out based on SKU
  //       if (data.variants && data.variants.length > 0) {
  //         // const validVariants = data.variants.map(v => ({
  //         //   sku: v.sku, // SKU required
  //         //   price: Number(v.price || 0),
  //         //   sellingPrice: Number(v.sellingPrice || calculateFinalPrice(Number(v.price || 0), Number(v.offer || 0))),
  //         //   stock: Number(v.stock || 0),
  //         //   offer: Number(v.offer || 0),
  //         //   attributes: v.attributes.filter(a => a.key && a.value),
  //         // }));
  //         const validVariants = data.variants
  // .filter(v => v.sku && v.price !== undefined && v.stock !== undefined)
  // .map(v => ({
  //   sku: v.sku.trim(),
  //   price: Number(v.price),
  //   sellingPrice: Number(
  //     v.sellingPrice ??
  //     calculateFinalPrice(Number(v.price), Number(v.offer || 0))
  //   ),
  //   stock: Number(v.stock),
  //   offer: Number(v.offer || 0),
  //   attributes: v.attributes.filter(a => a.key && a.value),
  // }));
  //        console.log("VALID VARIANTS:", validVariants); 
  //         payload.variants = JSON.stringify(validVariants);
  //       }
  //     } else {
  //       payload.originalPrice = data.originalPrice || 0;
  //       payload.price = data.price || data.originalPrice || 0;
  //       payload.stock = data.stock || 0;
  //       payload.offer = data.offer || 0;
  //       payload.variants = null;
  //     }

  //     console.log("Final Payload:", payload);

  //     // Create FormData
  //     const form = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null) {
  //         form.append(key, value.toString());
  //       }
  //     });

  //     // Add images
  //     productImages.forEach(file => form.append("imageUrl", file));

  //     // API call
  //     const res = await apiConnector("POST", "/product", form);

  //     toast.dismiss(toastId);

  //     if (res.status === 201 || res.status === 200) {
  //       toast.success("✅ Product created successfully!");
  //       router.push("/");
  //     }
  //   } catch (error: any) {
  //     toast.dismiss(toastId);
  //     console.error("Product create error:", error);

  //     let message = "❌ Failed to create product";
      
  //     // Handle variant SKU errors
  //     if (error?.response?.data?.message?.includes("SKU")) {
  //       message = error.response.data.message;
        
  //       // Try to extract which SKU is duplicate
  //       const skuMatch = error.response.data.message.match(/SKU:?\s*([A-Z0-9-]+)/i);
  //       if (skuMatch && skuMatch[1]) {
  //         const duplicateSku = skuMatch[1];
  //         toast.error(`SKU "${duplicateSku}" already exists. Please use a different SKU.`);
  //       }
  //     } else if (error?.response?.data?.message) {
  //       message = error.response.data.message;
  //     } else if (error?.message) {
  //       message = error.message;
  //     }

  //     toast.error(message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  const onSubmit = async (data: ProductFormData) => {
  if (isSubmitting) return;

  // ✅ Image validation
  if (productImages.length === 0) {
    toast.error("Please upload at least one image");
    return;
  }

  setIsSubmitting(true);
  const toastId = toast.loading("Creating product...");

  try {
    // ========================
    // ✅ BASE PAYLOAD
    // ========================
    const payload: any = {
      name: data.name,
      skuCode: data.skuCode,
      material: data.material,
      description: data.description,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId || null,
      childSubCategoryId: data.childSubCategoryId || null,
      length: data.length,
      width: data.width,
      height: data.height,
      weight: data.weight,
      weightUnit: data.weightUnit,
      returnPolicy: data.returnPolicy || null,
      warrantyInfo: data.warrantyInfo || null,
      keywords: JSON.stringify(data.keywords),
      shippingAvailable: data.shippingAvailable,
      hasVariants: data.hasVariants,
      isActive: isActive,
    };

    // ========================
    // ✅ VARIANTS HANDLING
    // ========================
    if (data.hasVariants) {
      payload.originalPrice = null;
      payload.price = null;
      payload.stock = null;
      payload.offer = null;

      if (data.variants && data.variants.length > 0) {

        // ✅ FILTER + FORMAT
        const validVariants = data.variants
          .filter(v => v.sku && v.price !== undefined && v.stock !== undefined)
          .map(v => ({
            sku: v.sku.trim(),
            price: Number(v.price),
            sellingPrice: Number(
              v.sellingPrice ??
              calculateFinalPrice(Number(v.price), Number(v.offer || 0))
            ),
            stock: Number(v.stock),
            offer: Number(v.offer || 0),
            attributes: v.attributes.filter(a => a.key && a.value),
          }));

        console.log("VALID VARIANTS:", validVariants);

        // ========================
        // ✅ VALIDATION
        // ========================
        if (validVariants.length === 0) {
          toast.error("At least one valid variant required");
          setIsSubmitting(false);
          return;
        }

        const skuSet = new Set();

        for (const v of validVariants) {
          if (!v.sku || v.sku.trim() === "") {
            toast.error("SKU is required for all variants");
            setIsSubmitting(false);
            return;
          }

          if (skuSet.has(v.sku)) {
            toast.error(`Duplicate SKU in variants: ${v.sku}`);
            setIsSubmitting(false);
            return;
          }

          skuSet.add(v.sku);
        }

        payload.variants = JSON.stringify(validVariants);
      }

    } else {
      // ========================
      // ✅ SIMPLE PRODUCT
      // ========================
      payload.originalPrice = data.originalPrice || 0;
      payload.price = data.price || data.originalPrice || 0;
      payload.stock = data.stock || 0;
      payload.offer = data.offer || 0;
      payload.variants = null;
    }

    console.log("Final Payload:", payload);

    // ========================
    // ✅ FORM DATA FIX
    // ========================
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "variants") {
          form.append(key, value as string); // already JSON string
        } else {
          form.append(key, String(value));
        }
      }
    });

    // ✅ IMAGES
    productImages.forEach(file => {
      form.append("imageUrl", file);
    });

    // ========================
    // ✅ API CALL
    // ========================
    const res = await apiConnector("POST", "/product", form);

    toast.dismiss(toastId);

    if (res.status === 201 || res.status === 200) {
      toast.success("✅ Product created successfully!");
      router.push("/");
    }

  } catch (error: any) {
    toast.dismiss(toastId);
    console.error("Product create error:", error);

    let message = "❌ Failed to create product";

    if (error?.response?.data?.message?.includes("SKU")) {
      message = error.response.data.message;

      const skuMatch = error.response.data.message.match(/SKU:?\s*([A-Z0-9-]+)/i);
      if (skuMatch && skuMatch[1]) {
        const duplicateSku = skuMatch[1];
        toast.error(`SKU "${duplicateSku}" already exists`);
        setIsSubmitting(false);
        return;
      }
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    toast.error(message);

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add Product</h1>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
            <button
              type="button"
              onClick={() => setIsActive(prev => !prev)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className="sr-only">Toggle Status</span>
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Basic Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <Label>Product Name<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      {...register("name")}
                      placeholder="Enter your product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>SKU Code<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      {...register("skuCode")}
                      placeholder="Enter SKU code"
                      className={errors.skuCode ? "border-red-500" : ""}
                    />
                    {errors.skuCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.skuCode.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Material<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      {...register("material")}
                      placeholder="Enter material"
                      className={errors.material ? "border-red-500" : ""}
                    />
                    {errors.material && (
                      <p className="text-red-500 text-sm mt-1">{errors.material.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Dimensions</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Length<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        {...register("length")}
                        placeholder="Enter length"
                        className={errors.length ? "border-red-500" : ""}
                      />
                      {errors.length && (
                        <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Width<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        {...register("width")}
                        placeholder="Enter width"
                        className={errors.width ? "border-red-500" : ""}
                      />
                      {errors.width && (
                        <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Height<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        {...register("height")}
                        placeholder="Enter height"
                        className={errors.height ? "border-red-500" : ""}
                      />
                      {errors.height && (
                        <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Weight<span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        {...register("weight")}
                        placeholder="Enter weight"
                        className={`w-full ${errors.weight ? "border-red-500" : ""}`}
                        min="0"
                      />
                      <select
                        {...register("weightUnit")}
                        className="border rounded px-2 py-3 text-sm"
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                      </select>
                    </div>
                    {errors.weight && (
                      <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Policies</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Label>Return Policy</Label>
                    <Controller
                      name="returnPolicy"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={returnPolicyOptions}
                          placeholder="Select Return Policy"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <Label>Warranty Info</Label>
                    <TextArea
                      {...register("warrantyInfo")}
                      placeholder="e.g., 1-year replacement warranty"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Type */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Type</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Label>Select category:<span className="ml-2 text-red-500">*</span></Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={category}
                          placeholder="Select Category"
                          onChange={(value) => {
                            field.onChange(value);
                            handleCategoryChange(value);
                          }}
                          value={field.value}
                          className={`appearance-none pr-10 ${errors.categoryId ? "border-red-500" : ""}`}
                        />
                      )}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>

                  {filteredSubCategory.length > 0 && (
                    <div className="relative">
                      <Label>Select sub-category:</Label>
                      <Controller
                        name="subCategoryId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={filteredSubCategory}
                            placeholder="Select SubCategory"
                            onChange={(value) => {
                              field.onChange(value);
                              fetchChildren(value);
                            }}
                            value={field.value}
                            className="appearance-none pr-10"
                          />
                        )}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {subCategoryChildren.length > 0 && (
                    <div className="relative">
                      <Label>Select Sub Category Child:</Label>
                      <Controller
                        name="childSubCategoryId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={subCategoryChildren}
                            placeholder="Select Child SubCategory"
                            onChange={field.onChange}
                            value={field.value}
                          />
                        )}
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing - Conditional based on hasVariants */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Pricing</h2>
                </div>
                <div className="p-4 space-y-4">
                  {!watchHasVariants && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Original Price<span className="text-red-500">*</span></Label>
                          <Input
                            type="number"
                            // {...register("originalPrice")}
                            {...register("originalPrice", {
    setValueAs: (v) => (v === "" ? undefined : Number(v)),
  })}
                            placeholder="Original Price"
                            className={errors.originalPrice ? "border-red-500" : ""}
                          />
                          {errors.originalPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>
                          )}
                        </div>

                        <div>
                          <Label>Offer %</Label>
                          <Input
                            type="number"
                            // {...register("offer")}
                            {...register("offer", {
  setValueAs: (v) => (v === "" ? undefined : Number(v)),
})}
                            placeholder="Offer %"
                          />
                        </div>
                        <div>
                          <Label>Final Price</Label>
                          <Input
                            type="number"
                            value={calculateFinalPrice(
                              Number(watchOriginalPrice || 0),
                              Number(watchOffer || 0)
                            )}
                           {...({ readOnly: true } as any)}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register("stock")}
                          {...register("stock", {
    setValueAs: (v) => (v === "" ? undefined : Number(v)),
  })}
                          placeholder="Enter Stock"
                          className={errors.stock ? "border-red-500" : ""}
                        />
                        {errors.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register("shippingAvailable")}
                      className="w-4 h-4"
                    />
                    <label className="text-sm">
                      Free Shipping Available
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Tags</h2>
                </div>
                <div className="p-4">
                  <div>
                    <Label>Keywords (Tags)</Label>
                    <Controller
                      name="keywords"
                      control={control}
                      render={({ field }) => (
                        <ChipInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add keywords"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700">Details</h2>
            </div>
            <div className="p-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Product Description <span className="text-red-500">*</span>
              </Label>
              <TextArea
                {...register("description")}
                placeholder="Write detailed product description (features, specifications, warranty, etc.)"
                rows={6}
                className={`w-full rounded-lg border p-3 text-sm 
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                           resize-y min-h-[140px] ${errors.description ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Add full product details like features, specifications, material, warranty etc.
              </p>
            </div>
          </div>

          {/* Product Images - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-700">Product Images</h2>
            </div>
            <div className="p-4">
              <Label>Upload Product Images <span className="text-red-500">*</span></Label>

              <div className="mt-4 flex flex-wrap gap-4">
                {productImages.map((file, index) => (
                  <div key={index} className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`product-${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 text-center">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        setProductImages(prev => [...prev, ...Array.from(files)]);
                      }
                    }}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
              {productImages.length === 0 && (
                <p className="text-red-500 text-sm mt-2">Please upload at least one image</p>
              )}
            </div>
          </div>

          {/* Variants Toggle - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Variants</h2>
              <button
                type="button"
                onClick={toggleVariants}
                className={`text-sm font-medium flex items-center ${
                  watchHasVariants ? "text-red-600 hover:text-red-800" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {watchHasVariants ? (
                  <>
                    <HiX className="w-4 h-4 mr-1" /> Disable Variants
                  </>
                ) : (
                  <>
                    <HiPlus className="w-4 h-4 mr-1" /> Enable Variants
                  </>
                )}
              </button>
            </div>

            {/* Variants Section - Only shown when hasVariants is true */}
            {watchHasVariants && (
              <div className="p-4">
                {errors.variants && !Array.isArray(errors.variants) && (
                  <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                    {errors.variants.message}
                  </p>
                )}

                {variantFields.map((field, vIndex) => (
                  <div key={field.id} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
                    {variantFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(vIndex)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        title="Remove variant"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <Label>SKU<span className="text-red-500">*</span></Label>
                        <Input
                          {...register(`variants.${vIndex}.sku`)}
                          className={errors.variants?.[vIndex]?.sku ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.sku && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.sku?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register(`variants.${vIndex}.stock`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.stock`, {
  setValueAs: parseNumber,
})}
                          className={errors.variants?.[vIndex]?.stock ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.stock && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.stock?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                      <div>
                        <Label>Price<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          // {...register(`variants.${vIndex}.price`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.price`, {
  setValueAs: parseNumber,
})}
                          // onChange={(e) => {
                          //   const price = Number(e.target.value);
                          //   const offer = watchVariants?.[vIndex]?.offer || 0;
                          //   setValue(`variants.${vIndex}.price`, price);
                          //   updateVariantSellingPrice(vIndex, price, offer);
                          // }}
                          onChange={(e) => {
  const value = parseNumber(e.target.value);
  const offer = watchVariants?.[vIndex]?.offer || 0;

  setValue(`variants.${vIndex}.price`, value);
  updateVariantSellingPrice(vIndex, value || 0, offer);
}}
                          className={errors.variants?.[vIndex]?.price ? "border-red-500" : ""}
                        />
                        {errors.variants?.[vIndex]?.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.variants[vIndex]?.price?.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Offer %</Label>
                        <Input
                          type="number"
                          // {...register(`variants.${vIndex}.offer`, { valueAsNumber: true })}
                          {...register(`variants.${vIndex}.offer`, {
  setValueAs: parseNumber,
})}
                          onChange={(e) => {
                            const offer = Number(e.target.value);
                            const price = watchVariants?.[vIndex]?.price || 0;
                            setValue(`variants.${vIndex}.offer`, offer);
                            updateVariantSellingPrice(vIndex, price, offer);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Selling Price</Label>
                        <Input
                          type="number"
                          {...register(`variants.${vIndex}.sellingPrice`, {
  setValueAs: parseNumber,
})}
                          // {...register(`variants.${vIndex}.sellingPrice`, { valueAsNumber: true })}
                          // readOnly

{...({ readOnly: true } as any)}                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>
                      {errors.variants?.[vIndex]?.attributes && (
                        <p className="text-red-500 text-sm mb-2">
                          {errors.variants[vIndex]?.attributes?.message}
                        </p>
                      )}
                      
                      {watchVariants?.[vIndex]?.attributes?.map((_, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-end">
                          <div className="flex-1">
                            <Label>Key</Label>
                            <Input
                              {...register(`variants.${vIndex}.attributes.${aIndex}.key`)}
                              placeholder="e.g., Color"
                              className={errors.variants?.[vIndex]?.attributes?.[aIndex]?.key ? "border-red-500" : ""}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              {...register(`variants.${vIndex}.attributes.${aIndex}.value`)}
                              placeholder="e.g., Red"
                              className={errors.variants?.[vIndex]?.attributes?.[aIndex]?.value ? "border-red-500" : ""}
                            />
                          </div>
                          {watchVariants[vIndex]?.attributes?.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAttribute(vIndex, aIndex)}
                              className="text-red-500 hover:text-red-700 mb-1"
                              title="Remove attribute"
                            >
                              <HiX className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addAttribute(vIndex)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mt-2"
                      >
                        <HiPlus className="w-4 h-4 mr-1" /> Add Attribute
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendVariant({
                    sku: "",
                    // price: 0,
                    // sellingPrice: 0,
                    // stock: 0,
                     price: undefined,
  sellingPrice: undefined,
  stock: undefined,
                    attributes: [{ key: "", value: "" }],
                  })}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  <HiPlus className="w-5 h-5 mr-1" /> Add Variant
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto
                ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Return policy options
const returnPolicyOptions = [
  { value: "7-day return", label: "7-day return" },
  { value: "30-day return", label: "30-day return" },
  { value: "No return", label: "No return" },
];