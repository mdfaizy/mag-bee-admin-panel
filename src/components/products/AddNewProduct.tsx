// "use client";
// import FileInput from "../form/input/FileInput";
// import React, { useState, useEffect ,ChangeEvent} from "react";
// import Input from "@/components/form/input/InputField";
// import Label from "@/components/form/Label";
// import TextArea from "@/components/form/input/TextArea";
// // import ChipInput from "../form/input/ChipInput";
// import Select from "../form/Select";
// import { ChevronDownIcon } from "@/icons";
// export default function AddNewProduct() {
//   const [category, setCategory] = useState<RoleOption[]>([]);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null); 

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     categoryId: "",
//     price: "",
//     originalPrice: "",
//     offerPercentage: "",
//     quantity: "",
//     image: null as File | null,
//     // keywords: [] as string[],
//   });


//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//   const { name, value, files } = e.target as HTMLInputElement;

//   if (name === "image" && files && files.length > 0) {
//     setSelectedFile(files[0]);
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }
// };


//   const handleRoleChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, categoryId: value }));
//   };

//   const fetchRoles = async () => {
//     try {
//       const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
//       const res = await fetch("http://localhost:8000/api/products/category", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch roles");
//       const data = await res.json();
//       const formattedRoles = data.map((item: any) => ({
//         value: String(item.id),
//         label: item.name,
//       }));
//       setCategory(formattedRoles);
//     } catch (error) {
//       console.error("Failed to fetch roles:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);




//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!selectedFile) {
//     alert("Please upload an image.");
//     return;
//   }

//   const safeNumber = (val: string) => {
//     const num = Number(val);
//     return isNaN(num) ? 0 : num;
//   };

//   const submissionData = new FormData();
//   submissionData.append("name", formData.name);
//   submissionData.append("description", formData.description);
//   submissionData.append("categoryId", formData.categoryId);
//   submissionData.append("originalPrice", String(safeNumber(formData.originalPrice)));
//   submissionData.append("price", String(safeNumber(formData.price)));
//   submissionData.append("offer", String(safeNumber(formData.offerPercentage))); 
//   submissionData.append("quantity", String(safeNumber(formData.quantity)));
//   submissionData.append("keywords", JSON.stringify(formData.keywords));
//   submissionData.append("imageUrl", selectedFile);

//   // Debug payload
//   for (const [key, val] of submissionData.entries()) {
//     console.log(`${key}: ${val}`);
//   }

//   try {
//     const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
//     const response = await fetch("http://localhost:8000/api/products/product", {
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
//                 <Select
//                   options={category}
//                   placeholder="Select Category"
//                   onChange={handleRoleChange}
//                   className="appearance-none pr-10"
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
//             </div>
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//                 <Input
//                   name="originalPrice"
//                   placeholder="Original Price"
//                   type="number"
//                   value={formData.originalPrice}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="offerPercentage"
//                   placeholder="Offer %"
//                   type="number"
//                   value={formData.offerPercentage}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="price"
//                   placeholder="Final Price"
//                   type="number"
//                   value={formData.price}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="quantity"
//                   placeholder="Quantity"
//                   type="number"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                 />
//               </div>
//               {/* <ChipInput
//                 id="keywords"
//                 label="Keywords"
//                 placeholder="e.g. red, cotton, summer"
//                 onChange={(chips) =>
//                   setFormData((prev) => ({ ...prev, keywords: chips }))
//                 }
//               /> */}
//              <input
//   type="file"
//   name="image"
//   accept="image/*"
//   onChange={handleChange}
// />

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
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { createProduct } from "@/services/product/productService";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

export default function CreateProductForm() {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    offerPercentage: "",
    quantity: "",
  });

  interface Category {
  id: string | number;
  name: string;
}
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files.length > 0) {
      setSelectedFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, categoryId: val }));
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const res = await fetch("http://localhost:8000/api/products/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
     const formatted = (data as Category[]).map((item) => ({
  value: String(item.id),
  label: item.name,
}));
      setCategories(formatted);
    } catch (err) {
      console.error("Category fetch failed", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload an image.");
      return;
    }

    const safeNumber = (val: string) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    };

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("categoryId", formData.categoryId);
    submissionData.append("originalPrice", String(safeNumber(formData.originalPrice)));
    submissionData.append("price", String(safeNumber(formData.price)));
    submissionData.append("offer", String(safeNumber(formData.offerPercentage)));
    submissionData.append("quantity", String(safeNumber(formData.quantity)));
    submissionData.append("imageUrl", selectedFile);

    dispatch(createProduct({ formData: submissionData, router }));
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Product Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <Label>Description</Label>
          <TextArea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="relative">
          <Select
            options={categories}
            placeholder="Select Category"
            onChange={handleCategoryChange}
            className="appearance-none pr-10"
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="originalPrice" placeholder="Original Price" value={formData.originalPrice} onChange={handleChange} />
          <Input name="price" placeholder="Final Price" value={formData.price} onChange={handleChange} />
          <Input name="offerPercentage" placeholder="Offer %" value={formData.offerPercentage} onChange={handleChange} />
          <Input name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
        </div>

        <div>
          <Label>Image</Label>
          <Input type="file" name="image"  onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
