"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
// import { ChevronDownIcon } from "@/icons";
import { HiChevronDown } from 'react-icons/hi';
import { createCategory } from "@/services/product-category/categoryService";
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { error } from "console";
type CategoryOption = {
  value: string;
  label: string;
};
type SubCategory = {
  value: string;
  label: string;
  categoryId: string;
}
type Variant = {
  sku: string;
  price: string;
  sellingPrice: string;
  stock: string;
  attributes: { key: string; value: string }[];
};
type Options = {
  variantIndex: number;
  attrIndex?: number;
  attrField?: string;
}

export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
  const [showVariants, setShowVariants] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    material: "",
    keywords: [] as string[],
    price: "",
    originalPrice: "",
    offer: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    weightUnit: "kg",
    stock: "",
    shippingAvailable: false,
    skuCode: "",
    returnPolicy: "",
    warrantyInfo: "",
    variants: [
      {
        sku: "",
        price: "",
        sellingPrice: "",
        stock: "",
        attributes: [{ key: "", value: "" }],
      },
    ] as Variant[],
  });
  const calculateFinalPrice = () => {
    const originalPrice = parseFloat(formData.originalPrice);
    const offer = parseFloat(formData.offer);

    if (!isNaN(originalPrice) && !isNaN(offer)) {
      return originalPrice - (originalPrice * offer) / 100;
    }
    return 0; // Return 0 if input values are invalid
  };
  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];
  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";

      try {
        const res = await fetch("http://localhost:8000/api/category", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        // ✅ Convert API data to Select's format
        const formatted = data.map((item: any) => ({
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



  useEffect(() => {
    const fetchAllSubCategories = async () => {
      try {
        const data = await fetchSubCategoryAll(); // API call returning all subcategories
        const formatted = data.map((item: any) => ({
          value: String(item.id),
          label: item.name,
          categoryId: String(item.category.id), // 🔹 add this
        }));
        console.log(formData)
        setSubCategory(formatted);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    };

    fetchAllSubCategories();
  }, []);
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));

    // Filter subcategories that belong to this category
    const filtered = subCategory.filter(sc => sc.categoryId === value);
    setFilteredSubCategory(filtered);
  };

  const toggleVariants = () => {
    setShowVariants((prev) => !prev);
  };


  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const removeAttribute = (variantIndex: number, attrIndex: number) => {
    setFormData(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes =
        updatedVariants[variantIndex].attributes.filter((_, i) => i !== attrIndex);
      return { ...prev, variants: updatedVariants };
    });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    options?: {
      variantIndex?: number;
      attrIndex?: number;
      attrField?: "key" | "value";
    }
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (options?.variantIndex !== undefined) {
      const variantIndex = options.variantIndex;
      const attrIndex = options.attrIndex;
      const attrField = options.attrField;

      setFormData((prev) => {
        const updatedVariants = [...prev.variants];

        if (
          attrIndex !== undefined &&
          attrField &&
          updatedVariants[variantIndex]?.attributes[attrIndex]
        ) {
          updatedVariants[variantIndex].attributes[attrIndex][attrField] = value;
        } else {
          // updatedVariants[variantIndex][name as keyof Variant] = value;
          if (name !== "attributes") {
            updatedVariants[variantIndex][name as Exclude<keyof Variant, "attributes">] = value;
          }
        }

        return { ...prev, variants: updatedVariants };
      });

      return; // 🛑 Prevents double-setting formData
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { sku: "", price: "", sellingPrice: "", stock: "", attributes: [{ key: "", value: "" }] },
      ],
    }));
  };

  const addAttribute = (variantIndex: number) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex].attributes.push({ key: "", value: "" });
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.originalPrice || isNaN(Number(formData.originalPrice))) {
      alert("Original price is required.");
      return;
    }

    const variants = formData.variants
      .filter(v => v.sku || v.price || v.stock)
      .map(v => ({
        ...v,
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        attributes: v.attributes.filter(a => a.key || a.value),
      }));

    const payload = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      price: Number(formData.price) || (variants.length ? 0 : Number(formData.originalPrice)),
      offer: Number(formData.offer) || 0,
      stock: Number(formData.stock) || (variants.length ? 0 : Number(formData.stock)),
      variants: JSON.stringify(variants),
      shippingAvailable: String(formData.shippingAvailable),
      keywords: JSON.stringify(formData.keywords),
    };

    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value !== undefined && value !== null ? value.toString() : "");
    });

    productImages.forEach((file) => form.append("imageUrl", file));

    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const res = await fetch("http://localhost:8000/api/product", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.ok) {
        alert("Product created successfully!");
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full mx-auto items-center">
      <div className="flex flex-col justify-center w-full p-4 bg-white rounded-lg shadow-sm">
        <h1 className="text-center text-2xl font-bold mb-6">Add Product</h1>
        <form onSubmit={handleSubmit}>

          <div className=" w-full grid grid-cols-1 gap-6 xl:grid-cols-2">

            <div className="border border-gray-200 p-4">
              <div className="bg-gray-100 p-1"><h1>Basic information</h1></div>
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
            </div>

            <div className="">
              <div className="bg-gray-100 p-1"><h1>Type</h1></div>


              <div className="relative">
                <Label>Select category:<span className="ml-2 text-error-500">*</span></Label>
                <Select
                  options={category}
                  placeholder="Select Category"
                  onChange={handleCategoryChange}
                  className="appearance-none pr-10"
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <HiChevronDown className="w-4 h-4" />
                </span>
              </div>

              <div className="relative">
                <Select
                  options={filteredSubCategory}
                  placeholder="Select SubCategory"
                  onChange={(value: string) => setFormData(prev => ({ ...prev, subCategoryId: value }))}
                  className="appearance-none pr-10"
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <HiChevronDown className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


            <div className="space-y-6">

              <div>
                <Label>Description<span className="text-error-500">*</span></Label>
                <TextArea
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
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
                <Label>Keywords (Tags)</Label>
                <ChipInput
                  value={formData.keywords}
                  onChange={(keywords) => setFormData(prev => ({ ...prev, keywords }))}
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
                  onChange={(value) => handleSelectChange("returnPolicy", value)}
                />
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                  <HiChevronDown className="w-4 h-4" />
                </span>
              </div>

              <div>
                <Label>Warranty Info</Label>
                <TextArea
                  name="warrantyInfo"
                  placeholder="e.g., 1-year replacement warranty"
                  value={formData.warrantyInfo}
                  onChange={handleChange}
                  rows={2}
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
                    value={calculateFinalPrice().toFixed(2)}
                    {...({ readOnly: true } as any)}
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-1.5">
                <div className="flex-1">
                  <Label>Weight<span className="text-error-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="weight"
                      placeholder="Enter weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full"
                      min="0"

                    />
                    <select
                      name="weightUnit"
                      value={formData.weightUnit}
                      onChange={handleChange}
                      className="border rounded px-2 py-3 text-sm"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <Label>Stock<span className="text-error-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      name="stock"
                      placeholder="Enter Stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full"

                    />

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
                  onChange={handleChange}
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
                      if (file) setProductImages(prev => [...prev, file]);
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
                        onClick={() => setProductImages(prev => prev.filter((_, i) => i !== index))}
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

          <div className="mt-8">
            <button
              type="button"
              onClick={toggleVariants}
              className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              {showVariants ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Remove Variants
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Variants
                </>
              )}
            </button>

            {showVariants && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Product Variants
                </h3>

                {formData.variants.map((variant, vIndex) => (
                  <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative shadow-sm">
                    {/* Remove Variant Button (top-right corner) */}
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(vIndex)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                        title="Remove variant"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="sku"
                          value={variant.sku}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., PROD-001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="stock"
                          value={variant.stock}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., 100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="price"
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selling Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="sellingPrice"
                          type="number"
                          value={variant.sellingPrice}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        Attributes
                      </h4>

                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-start">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Key</label>
                            <input
                              value={attr.key}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "key",
                              })}
                              placeholder="e.g., Color"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">Value</label>
                            <input
                              value={attr.value}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "value",
                              })}
                              placeholder="e.g., Red"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>

                          {/* Remove Attribute Button */}
                          {variant.attributes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAttribute(vIndex, aIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors mt-6 p-1 rounded-full hover:bg-red-50"
                              title="Remove attribute"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addAttribute(vIndex)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Attribute
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center text-green-600 hover:text-green-800 font-medium transition-colors mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Add Variant
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save Product
            </button>
          </div>


          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}