"use client";

import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import { HiChevronDown, HiX, HiPlus, HiPhotograph } from 'react-icons/hi';
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedProduct, setProducts } from "@/redux/productSlice";
import Select from "../form/Select";
// import { HiChevronDown, HiX } from 'react-icons/hi';
import { updateProductById } from "@/services/product/productService";
import { fetchProductCategory } from "@/services/product-category/categoryService";
import { fetchSubCategoryAll } from "@/services/subCategoryService/subCategoryService";
import { Product,Variant} from "@/components/types/product";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const safeNum = (v: any, fallback = 0) => {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

const computeSellingPrice = (price: number, offer: number) =>
  Math.round((price * (1 - (offer || 0) / 100) + Number.EPSILON) * 100) / 100;

const EditProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, products } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setCategoryLoading(true);
        const response = await fetchProductCategory();
        const formatted = response.map((cat: any) => ({
          value: String(cat.id),
          label: cat.name,
        }));

        setCategoryOptions(formatted);
      } catch (err) {
        console.error("Category fetch error", err);
        toast.error("Failed to load categories");
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const fetchSubCategoryAllData = async () => {
      try {
        const response = await fetchSubCategoryAll();
        const formatted = response.map((cat: any) => ({
          value: String(cat.id),
          label: cat.name,
        }));
        setSubCategoryOptions(formatted);
      } catch (err) {
        console.error("SubCategory fetch error", err);
        toast.error("Failed to load subcategories");
      }
    };

    fetchSubCategoryAllData();
  }, []);


  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      subCategoryId: value,
    }));
  };

  // Initialize form data and variants when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      const initialVariants: Variant[] = (selectedProduct.variants || []).map((v: any) => {
        const price = safeNum(v.price, 0);
        const offer = safeNum(v.offer, 0);
        const sellingPrice = safeNum(v.sellingPrice, computeSellingPrice(price, offer));
        return {
          id: v.id,
          sku: v.sku ?? "",
          price,
          sellingPrice,
          stock: safeNum(v.stock, 0),
          offer,
          attributes:
            (v.attributes || []).map((a: any) => ({ key: a.key ?? "", value: a.value ?? "" })) ||
            [{ key: "", value: "" }],
        };
      });

      setFormData({
        ...selectedProduct,
        // categoryId: selectedProduct.category?.id ? String(selectedProduct.category.id) : "",
        categoryId: selectedProduct.category?.id?.toString() || "",
        // subCategoryId: selectedProduct.subCategory?.id?.toString() || "",
        // subCategoryId: selectedProduct.subCategory?.name || "",
        subCategoryId: selectedProduct.subCategory?.id?.toString() || "",

        originalPrice: safeNum(selectedProduct.originalPrice, 0),
        offer: safeNum(selectedProduct.offer, 0),
        stock: safeNum(selectedProduct.stock, 0),
        shippingAvailable: selectedProduct.shippingAvailable ?? false,
        warrantyInfo: selectedProduct.warrantyInfo ?? "",
        skuCode: selectedProduct.skuCode ?? "",
        material: selectedProduct.material ?? "",
        returnPolicy: selectedProduct.returnPolicy ?? "",
        manufactureDetails: selectedProduct.manufactureDetails ?? "",
      });

      setVariants(initialVariants.length ? initialVariants : []);

      // Extract image URLs from selectedProduct.images
      // const imageUrls = selectedProduct.images
      //   ? selectedProduct.images.map((img: any) => (typeof img === "string" ? img : img.imageUrl))
      //   : [];

      const typedProduct = selectedProduct as unknown as Product;


      const imageUrls = typedProduct.images
        ? typedProduct.images.map((img) =>
          typeof img === "string" ? img : img.imageUrl
        )
        : [];

      setImages(imageUrls);

      // setImages(imageUrls);

      setRemovedImageIds([]);
    } else {
      setFormData(null);
      setVariants([]);
      setImages([]);
      setRemovedImageIds([]);
    }
  }, [selectedProduct]);


  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOpen]);

  // const handleCategoryChange = (value: string) => {
  //   setFormData((prev: any) => ({ ...prev, categoryId: value }));
  // };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev: any) => ({ ...prev, categoryId: value }));
  };

  // 🔁 Sync hasVariants with current variants
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      hasVariants: variants.length > 0,
    }));
  }, [variants]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value, type } = e.target;

    let parsedValue: any = value;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      parsedValue = e.target.checked;
    } else if (
      name === "price" ||
      name === "originalPrice" ||
      name === "offer" ||
      name === "stock"
    ) {
      parsedValue = safeNum(value, 0);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  // Variant management functions
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        sku: "",
        price: 0,
        sellingPrice: 0,
        offer: 0,
        stock: 0,
        attributes: [{ key: "", value: "" }],
      },
    ]);
    setFormData((prev: any) => ({
      ...prev,
      hasVariants: true, 
    }));
  };

  const removeVariant = (index: number) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);

    setFormData((prev: any) => ({
      ...prev,
      hasVariants: updatedVariants.length > 0,
    }));

    console.log("Variants after removal:", updatedVariants.length); // ✅ Moved inside
  };



  const handleVariantChange = (index: number, field: string, value: string | number) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== index) return variant;
        const updated: Variant = { ...variant };

        if (field === "price" || field === "stock" || field === "offer" || field === "sellingPrice") {
          const num = safeNum(value, 0);
          (updated as any)[field] = num;
        } else {
          (updated as any)[field] = value;
        }

        // If price or offer changed, recalc sellingPrice
        if (field === "price" || field === "offer") {
          const priceNum = safeNum(updated.price, 0);
          const offerNum = safeNum(updated.offer, 0);
          updated.sellingPrice = computeSellingPrice(priceNum, offerNum);
        }

        return updated;
      })
    );
  };




  const addAttribute = (vIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i !== vIndex ? variant : { ...variant, attributes: [...variant.attributes, { key: "", value: "" }] }
      )
    );
  };

  const removeAttribute = (vIndex: number, aIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i !== vIndex
          ? variant
          : {
            ...variant,
            attributes: variant.attributes.length > 1
              ? variant.attributes.filter((_, ai) => ai !== aIndex)
              : [{ key: "", value: "" }]
          }
      )
    );
  };

const handleRemoveImage = (index: number) => {
  const imgToRemove = images[index];
  if (!imgToRemove || !selectedProduct?.images) return; // ✅ check first

  const imgObj = selectedProduct.images[index];
  if (imgObj && "id" in imgObj) {
    setRemovedImageIds(prev => [...prev, (imgObj as { id: number }).id]);
  }

  setImages(prev => prev.filter((_, i) => i !== index));
};




  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (vIndex: number, aIndex: number, field: string, value: string) => {
    setVariants((prev) =>
      prev.map((variant, vi) => {
        if (vi !== vIndex) return variant;
        const updatedAttributes = variant.attributes.map((attr, ai) =>
          ai !== aIndex ? attr : { ...attr, [field]: value }
        );
        return { ...variant, attributes: updatedAttributes };
      })
    );
  };

  const calculateFinalPrice = () => {
    const originalPrice = parseFloat(formData.originalPrice);
    const offer = parseFloat(formData.offer);

    if (!isNaN(originalPrice) && !isNaN(offer)) {
      return originalPrice - (originalPrice * offer) / 100;
    }
    return 0; // Return 0 if input values are invalid
  };
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    if (filesArray.length + newImages.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }



    // Validate file types and size
    const validFiles = filesArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`Image ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setNewImages(prev => [...prev, ...validFiles]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Basic validation
    if (!formData.name || !formData.categoryId) {
      toast.error("Please fill in  fields");
      return;
    }

    setLoading(true);

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const sanitizedVariants = variants.map((v) => ({
        id: v.id,
        sku: v.sku ?? "",
        price: safeNum(v.price, 0),
        sellingPrice: safeNum(
          v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
          computeSellingPrice(v.price, v.offer ?? 0)
        ),
        offer: safeNum(v.offer ?? 0, 0),
        stock: safeNum(v.stock, 0),
        attributes: (v.attributes || []).map((a) => ({ key: a.key ?? "", value: a.value ?? "" })),
      }));
      const hasVariants = variants.length > 0;
      const productData = new FormData();
      productData.append("name", formData.name || "");
      productData.append("originalPrice", String(formData.originalPrice ?? 0));
      productData.append("offer", String(formData.offer ?? 0));
      productData.append("description", formData.description || "");
      productData.append("slug", formData.slug || "");
      productData.append("categoryId", String(formData.categoryId ?? 0));
      productData.append("subCategoryId", String(formData.subCategoryId || ""));

      productData.append("material", formData.material || "");
      productData.append("stock", String(formData.stock ?? 0));
      productData.append("length", String(formData.length ?? 0));
      productData.append("height", String(formData.height ?? 0));
      productData.append("width", String(formData.width ?? 0));
      productData.append("weight", String(formData.weight ?? 0));
      productData.append("weightUnit", formData.weightUnit || "");
      productData.append("shippingAvailable", String(formData.shippingAvailable ?? false));
      productData.append("skuCode", formData.skuCode || "");
      productData.append("returnPolicy", formData.returnPolicy || "");
      productData.append("warrantyInfo", formData.warrantyInfo || "");
      productData.append("manufactureDetails", formData.manufactureDetails || "");
      productData.append("variants", JSON.stringify(sanitizedVariants));

      if (removedImageIds.length > 0) {
        productData.append("removeImagePublicIds", JSON.stringify(removedImageIds));
      }
      productData.append("hasVariants", String(hasVariants));
      // productData.append("stock", String(formData.stock ?? 0));
      // Attach new images
      newImages.forEach((file) => {
        productData.append("images", file);
      });

      const updatedProduct = await updateProductById(formData.id, productData, token);

      // Update Redux
      const updatedList = products.map((p) =>
        p.id === formData.id ? updatedProduct : p
      );
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(null));

      toast.success("✅ Product updated successfully!");
      onClose();
      setNewImages([]);
      setRemovedImageIds([]);
    } catch (err: any) {
      console.error("Update error:", err.message || err);
      toast.error(`❌ ${err.message || "Update failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;



  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column layout for form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Basic Information</h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Product Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select
                        name="categoryId"
                        value={formData?.categoryId || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label>SubCategory</Label>
                      <select
                        name="subCategoryId"
                        value={formData?.subCategoryId || ""}
                        onChange={handleSubCategoryChange}
                        className="w-full border rounded-lg p-3 text-black dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select SubCategory</option>
                        {subCategoryOptions.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.label}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Description</Label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={4}
                      placeholder="Product description..."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              {!formData.hasVariants && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Pricing & Stock</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Original Price</Label>
                      <Input
                        name="originalPrice"
                        placeholder="0.00"
                        type="number"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label>Offer %</Label>
                      <Input
                        name="offer"
                        placeholder="0%"
                        type="number"
                        value={formData.offer}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label>Final Price</Label>
                      <Input
                        name="price"
                        placeholder="0.00"
                        type="number"
                        value={calculateFinalPrice().toFixed(2)}
                        {...({ readOnly: true } as any)}
                        className="w-full bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      name="stock"
                      placeholder="Enter stock quantity"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Product Details</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>SKU Code</Label>
                      <Input
                        name="skuCode"
                        value={formData.skuCode}
                        onChange={handleChange}
                        placeholder="SKU code"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label>Material</Label>
                      <Input
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="Product material"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Return Policy</Label>
                    <Input
                      name="returnPolicy"
                      value={formData.returnPolicy}
                      onChange={handleChange}
                      placeholder="Return policy"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label>Warranty Info</Label>
                    <Input
                      name="warrantyInfo"
                      value={formData.warrantyInfo}
                      onChange={handleChange}
                      placeholder="Warranty information"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label>Manufacture Details</Label>
                    <Input
                      name="manufactureDetails"
                      value={formData.manufactureDetails}
                      onChange={handleChange}
                      placeholder="Manufacture details"
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      id="shippingAvailable"
                      type="checkbox"
                      checked={formData.shippingAvailable}
                      onChange={(e) => setFormData({ ...formData, shippingAvailable: e.target.checked })}
                      className="w-5 h-5 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="shippingAvailable" className="cursor-pointer">
                      Shipping Available
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Media & Variants */}
            <div className="space-y-6">
              {/* Image Upload Section */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Product Images</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload up to 10 images. First image will be the main product image.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={img}
                          alt={`Product image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}

                  {newImages.map((file, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <HiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {(images.length + newImages.length) < 10 && (
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors p-4">
                      <HiPhotograph className="text-2xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAddImages}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Variants Section */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Product Variants</h3>
                  <Button
                    type="button"
                    onClick={addVariant}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <HiPlus className="w-4 h-4" /> Add Variant
                  </Button>
                </div>

                {variants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <HiPhotograph className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-2 text-sm">No variants added yet.</p>
                    <p className="text-xs">Click "Add Variant" to create your first product variant.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {variants.map((variant, vIndex) => (
                      <div key={vIndex} className="border p-4 rounded-lg bg-white dark:bg-gray-750 relative">
                        <button
                          type="button"
                          onClick={() => removeVariant(vIndex)}
                          className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                          title="Remove variant"
                        >
                          <HiX className="w-5 h-5" />
                        </button>

                        <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Variant {vIndex + 1}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label>SKU</Label>
                            <Input
                              value={variant.sku}
                              onChange={(e) => handleVariantChange(vIndex, "sku", e.target.value)}
                              placeholder="Variant SKU"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
                              min="0"
                              className="w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <Label>Price</Label>
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantChange(vIndex, "price", e.target.value)}
                              min="0"

                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label>Offer %</Label>
                            <Input
                              type="number"
                              value={variant.offer ?? 0}
                              onChange={(e) => handleVariantChange(vIndex, "offer", e.target.value)}
                              min="0"
                              max="100"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label>Final Price</Label>
                            <Input
                              type="number"
                              value={variant.sellingPrice ?? computeSellingPrice(variant.price, variant.offer ?? 0)}
                              {...({ readOnly: true } as any)}
                              className="w-full bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-2">
                            <Label>Attributes</Label>
                            <Button
                              type="button"
                              onClick={() => addAttribute(vIndex)}

                              size="sm"
                              className="text-xs flex items-center gap-1"
                            >
                              <HiPlus className="w-3 h-3" /> Add Attribute
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {variant.attributes.map((attr, aIndex) => (
                              <div key={aIndex} className="flex gap-2 items-center">
                                <Input
                                  value={attr.key}
                                  onChange={(e) => handleAttributeChange(vIndex, aIndex, "key", e.target.value)}
                                  placeholder="Attribute name"
                                  className="flex-1"
                                />
                                <Input
                                  value={attr.value}
                                  onChange={(e) => handleAttributeChange(vIndex, aIndex, "value", e.target.value)}
                                  placeholder="Value"
                                  className="flex-1"
                                />
                                {variant.attributes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeAttribute(vIndex, aIndex)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Remove attribute"
                                  >
                                    <HiX className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  {/* <Spinner size="sm" className="mr-2" /> */}
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default EditProductModal;