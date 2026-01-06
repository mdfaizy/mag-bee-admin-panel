"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import ChipInput from "@/components/form/input/ChipInput";
import { HiChevronDown, HiPlus, HiUpload, HiX } from 'react-icons/hi';

import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { SubCategory, CategoryOption } from "@/components/types/category";
import { BASE_URL } from "@/services/apis";
import { apiConnector } from "@/services/apiConnector";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
// import { createProductThunk } from "@/services/product/productThunks";

type Variant = {
  sku: string;
  price: string;
  sellingPrice: string;
  stock: string;
  attributes: { key: string; value: string }[];
};
export default function AddNewProduct() {
  const [category, setCategory] = useState<CategoryOption[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<SubCategory[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [subCategoryChildren, setSubCategoryChildren] = useState<SubCategory[]>([]);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);

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
    return 0;
  };

  const returnPolicyOptions = [
    { value: "7-day return", label: "7-day return" },
    { value: "30-day return", label: "30-day return" },
    { value: "No return", label: "No return" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", "/category");

        const formatted = res.data.map((item: any) => ({
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

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
    const filtered = subCategory.filter(sc => sc.categoryId === value);
    setFilteredSubCategory(filtered);
    setSubCategoryChildren([]);
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
          if (name !== "attributes") {
            updatedVariants[variantIndex][name as Exclude<keyof Variant, "attributes">] = value;
          }
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
  //sumbit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.originalPrice && !showVariants) {
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
      isActive: isActive,
      //  hasVariants: showVariants && variants.length > 0, 
      hasVariants: showVariants && variants.length > 0,
      originalPrice: Number(formData.originalPrice),
      price: Number(formData.price) || (variants.length ? 0 : Number(formData.originalPrice)),
      offer: Number(formData.offer) || 0,
      stock: Number(formData.stock) || (variants.length ? 0 : Number(formData.stock)),
      variants: showVariants && variants.length > 0 ? JSON.stringify(variants) : undefined,
      shippingAvailable: String(formData.shippingAvailable),
      keywords: JSON.stringify(formData.keywords),
    };
    console.log("showVariants:", showVariants);
    console.log("variants after filtering:", variants);
    console.log("hasVariants value:", showVariants && variants.length > 0);
    console.log("variants length:", variants.length);
    console.log("showVariants:", showVariants);
    console.log("hasVariants to send:", variants.length > 0);

    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      form.append(key, value !== undefined && value !== null ? value.toString() : "");
    });
    productImages.forEach((file) => form.append("imageUrl", file));
    try {
      const res = await apiConnector("POST", "/product"
        , form
      );
      //  dispatch(createProductThunk(payload, router));
      if (res.status === 201 || res.status === 200) {
        alert("Product created successfully!");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Submission failed");
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
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
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

        <form onSubmit={handleSubmit}>
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
                      name="name"
                      placeholder="Enter your product name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>SKU Code<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="skuCode"
                      placeholder="Enter SKU code"
                      value={formData.skuCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Material<span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      name="material"
                      placeholder="Enter material"
                      value={formData.material}
                      onChange={handleChange}
                    />
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
                        name="length"
                        placeholder="Enter length"
                        value={formData.length}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Width<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="width"
                        placeholder="Enter width"
                        value={formData.width}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label>Height<span className="text-red-500">*</span></Label>
                      <Input
                        type="text"
                        name="height"
                        placeholder="Enter height"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Weight<span className="text-red-500">*</span></Label>
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
                    <Select
                      options={returnPolicyOptions}
                      placeholder="Select Return Policy"
                      onChange={(value) => handleSelectChange("returnPolicy", value)}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
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
                    <Select
                      options={category}
                      placeholder="Select Category"
                      onChange={handleCategoryChange}
                      className="appearance-none pr-10"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                      <HiChevronDown className="w-4 h-4" />
                    </span>
                  </div>

                  {filteredSubCategory.length > 0 && (
                    <div className="relative">
                      <Label>Select sub-category:<span className="ml-2 text-red-500">*</span></Label>
                      <Select
                        options={filteredSubCategory}
                        placeholder="Select SubCategory"
                        // onChange={(value: string) => setFormData(prev => ({ ...prev, subCategoryId: value }))}
                        onChange={(value: string) => {
                          setFormData(prev => ({ ...prev, subCategoryId: value }));
                          fetchChildren(value); // fetch children on subcategory select
                        }}
                        className="appearance-none pr-10"
                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}



                  {subCategoryChildren.length > 0 && (
                    <div className="relative">
                      <Label>Select Sub Category Child:<span className="ml-2 text-red-500">*</span></Label>
                      <Select
                        options={subCategoryChildren}
                        placeholder="Select Child SubCategory"
                        onChange={(value: string) =>
                          setFormData((prev) => ({ ...prev, childSubCategoryId: value }))
                        }

                      />
                      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 top-7">
                        <HiChevronDown className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-700">Pricing</h2>
                </div>
                <div className="p-4 space-y-4">
                  {!showVariants && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Original Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="originalPrice"
                          placeholder="Original Price"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label>Offer %<span className="text-red-500">*</span></Label>
                        <Input
                          name="offer"
                          placeholder="Offer %"
                          type="number"
                          value={formData.offer}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label>Final Price<span className="text-red-500">*</span></Label>
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
                  )

                  }


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    {!showVariants && (
                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          type="number"
                          name="stock"
                          placeholder="Enter Stock"
                          value={formData.stock}
                          onChange={handleChange}
                        />
                      </div>
                    )}
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
                    <ChipInput
                      value={formData.keywords}
                      onChange={(keywords) => setFormData(prev => ({ ...prev, keywords }))}
                      placeholder="Add keywords"
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
            <div className="p-4">
              <Label>Product Description</Label>
              <TextArea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
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
                    name="imageUrl"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProductImages(prev => [...prev, file]);
                    }}
                    className="hidden"
                    multiple
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Variants - Full Width */}
          <div className="mt-6 border border-gray-200 rounded-lg">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">Variants</h2>
              <button
                type="button"
                onClick={toggleVariants}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                {showVariants ? (
                  <>
                    <HiX className="w-4 h-4 mr-1" /> Remove Variants
                  </>
                ) : (
                  <>
                    <HiPlus className="w-4 h-4 mr-1" /> Add Variants
                  </>
                )}
              </button>
            </div>

            {showVariants && (
              <div className="p-4">
                {formData.variants.map((variant, vIndex) => (
                  <div key={vIndex} className="border border-gray-300 p-5 rounded-lg mb-5 bg-white relative">
                    {formData.variants.length > 1 && (
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
                          name="sku"
                          value={variant.sku}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>

                      <div>
                        <Label>Stock<span className="text-red-500">*</span></Label>
                        <Input
                          name="stock"
                          value={variant.stock}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>

                      <div>
                        <Label>Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="price"
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>

                      <div>
                        <Label>Selling Price<span className="text-red-500">*</span></Label>
                        <Input
                          name="sellingPrice"
                          type="number"
                          value={variant.sellingPrice}
                          onChange={(e) => handleChange(e, { variantIndex: vIndex })}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="font-medium text-gray-700 mb-3">Attributes</h4>

                      {variant.attributes.map((attr, aIndex) => (
                        <div key={aIndex} className="flex gap-3 mb-3 items-end">
                          <div className="flex-1">
                            <Label>Key</Label>
                            <Input
                              value={attr.key}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "key",
                              })}
                              placeholder="e.g., Color"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              value={attr.value}
                              onChange={(e) => handleChange(e, {
                                variantIndex: vIndex,
                                attrIndex: aIndex,
                                attrField: "value",
                              })}
                              placeholder="e.g., Red"
                            />
                          </div>

                          {variant.attributes.length > 1 && (
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
                  onClick={addVariant}
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  <HiPlus className="w-5 h-5 mr-1" /> Add Variant
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
