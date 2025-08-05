// "use client";
// import React, { useState, useEffect, ChangeEvent } from "react";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// import Select from "../form/Select";
// import ChipInput from "../form/input/ChipInput";
// import { ChevronDownIcon } from "@/icons";

// type CategoryOption = {
//   value: string;
//   label: string;
// };

// type SpecificationItem = {
//   key: string;
//   values: string[]; 
// };


// export default function AddNewProduct() {
//   const [category, setCategory] = useState<CategoryOption[]>([]);
//   const [productImages, setProductImages] = useState<File[]>([]);


//   const [formData, setFormData] = useState({
//     name: "",
//     categoryId: "",
//     description: "",
//     manufactureDetails: "",
//     material: "",
//     keywords: [] as string[],
//     price: "",
//     originalPrice: "",
//     offer: "",
//     quantity: "",
//     stock: "",
//     length: "",
//     width: "",
//     height: "",
//     weight: "",
//     weightUnit: "kg",
//     shippingAvailable: false,
//     skuCode: "",
//     returnPolicy: "",
//     warrantyInfo: "",
//   });
//   const returnPolicyOptions = [
//     { value: "7-day return", label: "7-day return" },
//     { value: "30-day return", label: "30-day return" },
//     { value: "No return", label: "No return" },
//   ];
//   const handleReturnPolicyChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, returnPolicy: value }));
//   };






//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const handleRoleChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, categoryId: value }));
//   };

//   const handleKeywordsChange = (newKeywords: string[]) => {
//     setFormData((prev) => ({ ...prev, keywords: newKeywords }));
//   };
  

//   const fetchCategory = async () => {
//     try {
//       const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
//       const res = await fetch("http://localhost:8000/api/category", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();
//       const formatted = data.map((item: any) => ({
//         value: String(item.id),
//         label: item.name,
//       }));
//       setCategory(formatted);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategory();
//   }, []);

//   const safeNumber = (val: string) => {
//       const num = Number(val);
//       return isNaN(num) ? 0 : num;
//     };
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const submissionData = new FormData();
//   submissionData.append("name", formData.name);
//   submissionData.append("description", formData.description);
//   submissionData.append("categoryId", formData.categoryId);
//   submissionData.append("originalPrice", String(safeNumber(formData.originalPrice)));
//   submissionData.append("price", String(safeNumber(formData.price)));
//   submissionData.append("offer", String(safeNumber(formData.offer)));
//   submissionData.append("keywords", JSON.stringify(formData.keywords));
//   submissionData.append("stock", formData.stock);
//   submissionData.append("length", formData.length);
//   submissionData.append("width", formData.width);
//   submissionData.append("height", formData.height);
//   submissionData.append("weight", formData.weight);
//   submissionData.append("weightUnit", formData.weightUnit);
//   submissionData.append("skuCode", formData.skuCode);
//   submissionData.append("material", formData.material);
//   submissionData.append("manufactureDetails", formData.manufactureDetails);
//   submissionData.append("shippingAvailable", String(formData.shippingAvailable));
//   submissionData.append("returnPolicy", formData.returnPolicy);
//   submissionData.append("warrantyInfo", formData.warrantyInfo);

//   // ✅ Append images
//   productImages.forEach((file) => {
//     submissionData.append("imageUrl", file);
//   });

 


//   try {
//     const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
//     const response = await fetch("http://localhost:8000/api/product", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: submissionData,
//     });

//     const result = await response.text();
//     if (response.ok) {
//       alert("Product added successfully!");
//     } else {
//       console.error("Failed to submit:", result);
//       alert("Submission failed.");
//     }
//   } catch (error) {
//     console.error("Error submitting form:", error);
//   }
// };

//   return (
//     <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
//       <div className="flex flex-col justify-center w-full p-4 bg-white">
//         <h1 className="text-center uppercase">Add Product</h1>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//             <div className="space-y-6">
//               <div>
//                 <Label>Product Name<span className="text-error-500">*</span></Label>
//                 <Input
//                   type="text"
//                   name="name"
//                   placeholder="Enter your product name"
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="relative">
//                 <Label>Select Category<span className="text-error-500">*</span></Label>
//                 <Select
//                   options={category}
//                   placeholder="Select Category"
//                   onChange={handleRoleChange}
//                 />
//                 <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
//                   <ChevronDownIcon className="w-4 h-4" />
//                 </span>
//               </div>

//               <div>
//                 <Label>Description<span className="text-error-500">*</span></Label>
//                 <TextArea
//                   name="description"
//                   placeholder="Enter description"
//                   value={formData.description}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>SKU Code<span className="text-error-500">*</span></Label>
//                 <Input
//                   type="text"
//                   name="skuCode"
//                   placeholder="Enter SKU code"
//                   value={formData.skuCode}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>Material<span className="text-error-500">*</span></Label>
//                 <Input
//                   type="text"
//                   name="material"
//                   placeholder="Enter material"
//                   value={formData.material}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>Manufacture Details<span className="text-error-500">*</span></Label>
//                 <TextArea
//                   name="manufactureDetails"
//                   placeholder="Enter manufacture details"
//                   value={formData.manufactureDetails}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <Label>Keywords (Tags)</Label>
//                 <ChipInput
//                   value={formData.keywords}
//                   onChange={handleKeywordsChange}
//                   placeholder="Add keywords"
//                 />
//               </div>
//             </div>





//             <div className="space-y-6">

//               <div className="relative">
//                 <Label>Return Policy</Label>
//                 <Select
//                   options={returnPolicyOptions}
//                   placeholder="Select Return Policy"
//                   onChange={handleReturnPolicyChange}
//                 />
//                 <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
//                   <ChevronDownIcon className="w-4 h-4" />
//                 </span>
//               </div>

//               <div>
//                 <Label>Warranty Info</Label>
//                 <TextArea
//                   name="warrantyInfo"
//                   placeholder="e.g., 1-year replacement warranty"
//                   value={formData.warrantyInfo}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//                 <div>
//                   <Label>Original Price<span className="text-error-500">*</span></Label>
//                   <Input
//                     name="originalPrice"
//                     placeholder="Original Price"
//                     type="number"
//                     value={formData.originalPrice}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <Label>Offer %<span className="text-error-500">*</span></Label>
//                   <Input
//                     name="offer"
//                     placeholder="Offer %"
//                     type="number"
//                     value={formData.offer}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <Label>Final Price<span className="text-error-500">*</span></Label>
//                   <Input
//                     name="price"
//                     placeholder="Final Price"
//                     type="number"
//                     value={formData.price}
//                     readOnly
//                     className="bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-1.5">
//                 <div>
//                   <Label>Quantity in Stock<span className="text-error-500">*</span></Label>
//                   <Input
//                     type="number"
//                     name="stock"
//                     placeholder="Enter stock"
//                     value={formData.stock}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div>
//                   <Label>Weight<span className="text-error-500">*</span></Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       type="number"
//                       name="weight"
//                       placeholder="Enter weight"
//                       value={formData.weight}
//                       onChange={handleChange}
//                       className="w-full"
//                       min={0}
//                     />
//                     <select
//                       name="weightUnit"
//                       value={formData.weightUnit}
//                       onChange={handleChange}
//                       className="border rounded px-2 py-3 text-sm "
//                     >
//                       <option value="kg">kg</option>
//                       <option value="g">g</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-2">
//                 <div>
//                   <Label>Length<span className="text-error-500">*</span></Label>
//                   <Input
//                     type="text"
//                     name="length"
//                     placeholder="Enter length"
//                     value={formData.length}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <Label>Width<span className="text-error-500">*</span></Label>
//                   <Input
//                     type="text"
//                     name="width"
//                     placeholder="Enter width"
//                     value={formData.width}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div>
//                   <Label>Height<span className="text-error-500">*</span></Label>
//                   <Input
//                     type="text"
//                     name="height"
//                     placeholder="Enter height"
//                     value={formData.height}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>



//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="shippingAvailable"
//                   id="shippingAvailable"
//                   checked={formData.shippingAvailable}
//                   onChange={handleCheckboxChange}
//                   className="w-4 h-4"
//                 />
//                 <label htmlFor="shippingAvailable" className="text-sm">
//                   Free Shipping Available
//                 </label>
//               </div>

//               <div>
//                 <Label>Upload Product Images <span className="text-error-500">*</span></Label>
//                 <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 w-fit">
//                   <input
//                     type="file"
//                      name="imageUrl"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         setProductImages((prev) => [...prev, file]);
//                       }
//                     }}
//                     className="hidden"
//                   />
//                   <span className="text-sm">Upload One Image</span>
//                 </label>

//                 <div className="flex flex-wrap gap-4 mt-4">
//                   {productImages.map((file, index) => (
//                     <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt={`product-${index}`}
//                         className="w-full h-full object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const updatedImages = productImages.filter((_, i) => i !== index);
//                           setProductImages(updatedImages);
//                         }}
//                         className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 text-center">
//             <button
//               type="submit"
//               className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "../form/Select";
import ChipInput from "../form/input/ChipInput";
import { ChevronDownIcon } from "@/icons";

interface Attribute {
  key: string;
  values: string[];
}

export default function AddNewProduct() {
  const [category, setCategory] = useState<{ value: string; label: string }[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    manufactureDetails: "",
    material: "",
    keywords: [] as string[],
    price: "",
    originalPrice: "",
    offer: "",
    quantity: "",
    stock: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    weightUnit: "kg",
    shippingAvailable: false,
    skuCode: "",
    returnPolicy: "",
    warrantyInfo: "",
    attributes: [] as Attribute[],
  });

  const handleAddAttribute = () => {
    setAttributes((prev) => [...prev, { key: "", values: [] }]);
  };

  const handleAttributeChange = (index: number, type: "key" | "values", value: string | string[]) => {
    const updated = [...attributes];
    if (type === "key") {
      updated[index].key = value as string;
    } else {
      updated[index].values = value as string[];
    }
    setAttributes(updated);
  };

  const handleRemoveAttribute = (index: number) => {
    const updated = [...attributes];
    updated.splice(index, 1);
    setAttributes(updated);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const submissionData = new FormData();
  //   for (const [key, value] of Object.entries(formData)) {
  //     if (Array.isArray(value)) {
  //       submissionData.append(key, JSON.stringify(value));
  //     } else {
  //       submissionData.append(key, String(value));
  //     }
  //   }
  //   productImages.forEach((file) => {
  //     submissionData.append("imageUrl", file);
  //   });
  //   submissionData.append("attributes", JSON.stringify(attributes));

  //   // TODO: add your fetch request here
  // };

  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];
  const handleReturnPolicyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, returnPolicy: value }));
  };






  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleKeywordsChange = (newKeywords: string[]) => {
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };
  

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const res = await fetch("http://localhost:8000/api/category", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const formatted = data.map((item: any) => ({
        value: String(item.id),
        label: item.name,
      }));
      setCategory(formatted);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const safeNumber = (val: string) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const submissionData = new FormData();
  submissionData.append("name", formData.name);
  submissionData.append("description", formData.description);
  submissionData.append("categoryId", formData.categoryId);
  submissionData.append("originalPrice", String(safeNumber(formData.originalPrice)));
  submissionData.append("price", String(safeNumber(formData.price)));
  submissionData.append("offer", String(safeNumber(formData.offer)));
  submissionData.append("keywords", JSON.stringify(formData.keywords));
  submissionData.append("stock", formData.stock);
  submissionData.append("length", formData.length);
  submissionData.append("width", formData.width);
  submissionData.append("height", formData.height);
  submissionData.append("weight", formData.weight);
  submissionData.append("weightUnit", formData.weightUnit);
  submissionData.append("skuCode", formData.skuCode);
  submissionData.append("material", formData.material);
  submissionData.append("manufactureDetails", formData.manufactureDetails);
  submissionData.append("shippingAvailable", String(formData.shippingAvailable));
  submissionData.append("returnPolicy", formData.returnPolicy);
  submissionData.append("warrantyInfo", formData.warrantyInfo);

  // ✅ Append images
  productImages.forEach((file) => {
    submissionData.append("imageUrl", file);
  });
  console.log("Sending attributes:", attributes);
console.log("FormData attributes stringified:", JSON.stringify(attributes));

submissionData.append("attributes", JSON.stringify(attributes));

 


  try {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
    const response = await fetch("http://localhost:8000/api/product", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: submissionData,
    });

    const result = await response.text();
    if (response.ok) {
      alert("Product added successfully!");
    } else {
      console.error("Failed to submit:", result);
      alert("Submission failed.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white">
        <h1 className="text-center uppercase">Add Product</h1>
        <form onSubmit={handleSubmit}>
   
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Label>Product Name<span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Enter your product name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Label>Select Category<span className="text-error-500">*</span></Label>
                <Select
                  options={category}
                  placeholder="Select Category"
                  onChange={handleRoleChange}
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <ChevronDownIcon className="w-4 h-4" />
                </span>
              </div>

              <div>
                <Label>Description<span className="text-error-500">*</span></Label>
                <TextArea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>SKU Code<span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="skuCode"
                  placeholder="Enter SKU code"
                  value={formData.skuCode}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Material<span className="text-error-500">*</span></Label>
                <Input
                  type="text"
                  name="material"
                  placeholder="Enter material"
                  value={formData.material}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Manufacture Details<span className="text-error-500">*</span></Label>
                <TextArea
                  name="manufactureDetails"
                  placeholder="Enter manufacture details"
                  value={formData.manufactureDetails}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Keywords (Tags)</Label>
                <ChipInput
                  value={formData.keywords}
                  onChange={handleKeywordsChange}
                  placeholder="Add keywords"
                />
              </div>
            </div>





            <div className="space-y-6">

              <div className="relative">
                <Label>Return Policy</Label>
                <Select
                  options={returnPolicyOptions}
                  placeholder="Select Return Policy"
                  onChange={handleReturnPolicyChange}
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <ChevronDownIcon className="w-4 h-4" />
                </span>
              </div>

              <div>
                <Label>Warranty Info</Label>
                <TextArea
                  name="warrantyInfo"
                  placeholder="e.g., 1-year replacement warranty"
                  value={formData.warrantyInfo}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div>
                  <Label>Original Price<span className="text-error-500">*</span></Label>
                  <Input
                    name="originalPrice"
                    placeholder="Original Price"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Offer %<span className="text-error-500">*</span></Label>
                  <Input
                    name="offer"
                    placeholder="Offer %"
                    type="number"
                    value={formData.offer}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Final Price<span className="text-error-500">*</span></Label>
                  <Input
                    name="price"
                    placeholder="Final Price"
                    type="number"
                    value={formData.price}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-1.5">
                <div>
                  <Label>Quantity in Stock<span className="text-error-500">*</span></Label>
                  <Input
                    type="number"
                    name="stock"
                    placeholder="Enter stock"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Weight<span className="text-error-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="weight"
                      placeholder="Enter weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full"
                      min={0}
                    />
                    <select
                      name="weightUnit"
                      value={formData.weightUnit}
                      onChange={handleChange}
                      className="border rounded px-2 py-3 text-sm "
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Length<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="length"
                    placeholder="Enter length"
                    value={formData.length}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Width<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="width"
                    placeholder="Enter width"
                    value={formData.width}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Height<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="height"
                    placeholder="Enter height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>
              </div>



              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="shippingAvailable"
                  id="shippingAvailable"
                  checked={formData.shippingAvailable}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <label htmlFor="shippingAvailable" className="text-sm">
                  Free Shipping Available
                </label>
              </div>

              <div>
                <Label>Upload Product Images <span className="text-error-500">*</span></Label>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 w-fit">
                  <input
                    type="file"
                     name="imageUrl"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProductImages((prev) => [...prev, file]);
                      }
                    }}
                    className="hidden"
                  />
                  <span className="text-sm">Upload One Image</span>
                </label>

                <div className="flex flex-wrap gap-4 mt-4">
                  {productImages.map((file, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`product-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImages = productImages.filter((_, i) => i !== index);
                          setProductImages(updatedImages);
                        }}
                        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

         
          {/* Product Attributes */}
          <div className="space-y-4 mt-6">
            <Label>Product Attributes</Label>
            {attributes.map((attr, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded"
              >
                <div>
                  <Label>Attribute Key</Label>
                  <Input
                    placeholder="e.g., size, color"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Values</Label>
                  <ChipInput
                    placeholder="Add values"
                    value={attr.values}
                    onChange={(newVals) => handleAttributeChange(index, "values", newVals)}
                  />
                </div>
                <div className="md:col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="text-brand-500 text-sm"
            >
              + Add Attribute
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
