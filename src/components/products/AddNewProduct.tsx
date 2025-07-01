"use client";
import FileInput from "../form/input/FileInput";
import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import ChipInput from "../form/input/ChipInput";
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";
export default function AddNewProduct() {
  const [category, setCategory] = useState<RoleOption[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    offerPercentage: "",
    quantity: "",
    keywords: [] as string[],
  });

  // 🔁 Common input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const res = await fetch("http://localhost:8000/api/products/category", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      const formattedRoles = data.map((item: any) => ({
        value: String(item.id),
        label: item.name,
      }));
      setCategory(formattedRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  //Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please upload an image.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("categoryId", formData.categoryId);
    submissionData.append("price", formData.price);
    submissionData.append("originalPrice", formData.originalPrice);
    submissionData.append("offerPercentage", formData.offerPercentage);
    submissionData.append("quantity", formData.quantity);
    submissionData.append("keywords", JSON.stringify(formData.keywords)); 
    submissionData.append("image", selectedFile); 

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const response = await fetch("http://localhost:8000/api/products/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        alert("Product added successfully!");
      } else {
        console.error("Failed to submit:", await response.text());
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
                <Select
                  options={category}
                  placeholder="Select Category"
                  onChange={handleRoleChange}
                  className="appearance-none pr-10"
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
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <Input
                  name="originalPrice"
                  placeholder="Original Price"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
                <Input
                  name="offerPercentage"
                  placeholder="Offer %"
                  type="number"
                  value={formData.offerPercentage}
                  onChange={handleChange}
                />
                <Input
                  name="price"
                  placeholder="Final Price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
                <Input
                  name="quantity"
                  placeholder="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <ChipInput
                id="keywords"
                label="Keywords"
                placeholder="e.g. red, cotton, summer"
                onChange={(chips) =>
                  setFormData((prev) => ({ ...prev, keywords: chips }))
                }
              />
              <div>
                                       <h1 className="text-xl font-bold mb-4">Upload Your Image</h1>                                         {/* <DropzoneComponent /> */}
                                         <FileInput />
                                    </div>
            </div>
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
