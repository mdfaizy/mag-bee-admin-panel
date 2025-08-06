"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
import { ChevronDownIcon } from "@/icons";

type CategoryOption = {
  value: string;
  label: string;
};

type Variant = {
  sku: string;
  price: string;
  stock: string;
  attributes: { key: string; value: string }[];
};

export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

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
    shippingAvailable: false,
    skuCode: "",
    returnPolicy: "",
    warrantyInfo: "",
    variants: [
      {
        sku: "",
        price: "",
        stock: "",
        attributes: [{ key: "", value: "" }],
      },
    ] as Variant[],
  });

  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];

  useEffect(() => {
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
    fetchCategory();
  }, []);

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
      setFormData((prev) => {
        const updatedVariants = [...prev.variants];
        
        if (options.attrIndex !== undefined && options.attrField) {
          updatedVariants[options.variantIndex].attributes[options.attrIndex][options.attrField] = value;
        } else {
          updatedVariants[options.variantIndex][name as keyof Variant] = value;
        }

        return { ...prev, variants: updatedVariants };
      });
      return;
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
        { sku: "", price: "", stock: "", attributes: [{ key: "", value: "" }] },
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

    const form = new FormData();
    Object.entries({
      ...formData,
      price: formData.price,
      originalPrice: formData.originalPrice,
      offer: formData.offer,
      shippingAvailable: String(formData.shippingAvailable),
      keywords: JSON.stringify(formData.keywords),
      variants: JSON.stringify(formData.variants),
    }).forEach(([key, value]) => form.append(key, value));

    productImages.forEach((file) => {
      form.append("imageUrl", file);
    });

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
                  onChange={(value) => handleSelectChange("categoryId", value)}
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
                    value={formData.price}
                    readOnly
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
                      min={0}
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
  <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
  {formData.variants.map((variant, vIndex) => (
    <div key={vIndex} className="border p-4 rounded mb-4 bg-gray-50 relative">
      {/* Remove Variant Button (top-right corner) */}
      {formData.variants.length > 1 && (
        <button
          type="button"
          onClick={() => removeVariant(vIndex)}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          title="Remove variant"
        >
          ×
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>SKU<span className="text-error-500">*</span></Label>
          <Input
            name="sku"
            value={variant.sku}
            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
          />
        </div>

        <div>
          <Label>Price<span className="text-error-500">*</span></Label>
          <Input
            name="price"
            value={variant.price}
            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
          />
        </div>

        <div>
          <Label>Stock<span className="text-error-500">*</span></Label>
          <Input
            name="stock"
            value={variant.stock}
            onChange={(e) => handleChange(e, { variantIndex: vIndex })}
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Attributes</h4>
        {variant.attributes.map((attr, aIndex) => (
          <div key={aIndex} className="flex gap-2 mb-2 items-center">
            <Input
              value={attr.key}
              onChange={(e) => handleChange(e, {
                variantIndex: vIndex,
                attrIndex: aIndex,
                attrField: "key",
              })}
              placeholder="Key"
            />
            <Input
              value={attr.value}
              onChange={(e) => handleChange(e, {
                variantIndex: vIndex,
                attrIndex: aIndex,
                attrField: "value",
              })}
              placeholder="Value"
            />
            {/* Remove Attribute Button */}
            {variant.attributes.length > 1 && (
              <button
                type="button"
                onClick={() => removeAttribute(vIndex, aIndex)}
                className="text-red-500 hover:text-red-700"
                title="Remove attribute"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addAttribute(vIndex)}
          className="text-blue-500 mt-2 text-sm hover:text-blue-700"
        >
          + Add Attribute
        </button>
      </div>
    </div>
  ))}
  <button
    type="button"
    onClick={addVariant}
    className="text-green-600 font-medium hover:text-green-800"
  >
    + Add Variant
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