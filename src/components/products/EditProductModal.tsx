"use client";

import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedProduct, setProducts } from "@/redux/productSlice";
import Select from "../form/Select";
import { HiChevronDown } from 'react-icons/hi';
import { updateProductById } from "@/services/product/productService";
import { fetchProductCategory } from "@/services/product-category/categoryService";


interface Variant {
  id?: number;
  sku: string;
  price: number;
  sellingPrice?: number;
  stock: number;
  offer?: number;
  attributes: { key: string; value: string }[];
}

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
  const [images, setImages] = useState<string[]>([]); // URLs of images
  const [newImages, setNewImages] = useState<File[]>([]); // New files to upload
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  // const handleRoleChange = (value: string) => {
  //   setFormData((prev) => ({ ...prev, categoryId: value }));
  // };

// 
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await fetchProductCategory();
        console.log('response', response);

        const formatted = response.map((cat: any) => ({
          value: String(cat.id),
          label: cat.name,
        }));

        setCategoryOptions(formatted);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };

    fetchCategoriesData();
  }, []);

  // Initialize form data and variants when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      // normalize variants to safe numeric values and attributes
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
        categoryId: selectedProduct.category?.id ?? 0,
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
      //   ? selectedProduct.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl)
      //   : [];
      // setImages(imageUrls);
    } else {
      setFormData(null);
      setVariants([]);
      setImages([]);
    }
  }, [selectedProduct]);

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOpen]);

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
      name === "categoryId" ||
      name === "stock"
    ) {
      parsedValue = safeNum(value, 0);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  // Variant management functions (immutable updates)
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
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
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
          : { ...variant, attributes: variant.attributes.filter((_, ai) => ai !== aIndex) }
      )
    );
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
    }
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

  //   const handleSubmit = async () => {
  //     if (!formData) return;
  //     setLoading(true);

  //     try {
  //       const rawToken = localStorage.getItem("token");
  //       const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

  //       // 1️⃣ Upload new images to Cloudinary
  //       // const uploadedUrls = await Promise.all(
  //       //   newImages.map((file) => uploadProductImage(file))
  //       // );

  //       // // 2️⃣ Combine existing images with newly uploaded URLs
  //       // const updatedImages = [...images, ...uploadedUrls];

  //       console.log("Uploading new images", newImages);

  // const uploadedUrls = await Promise.all(
  //   newImages.map((file) => {
  //     console.log("Uploading file", file);
  //     return uploadProductImage(file);
  //   })
  // );

  // console.log("Uploaded image URLs:", uploadedUrls)
  //       // 3️⃣ Prepare product payload
  //       const sanitizedVariants = variants.map((v) => ({
  //         id: v.id,
  //         sku: v.sku ?? "",
  //         price: safeNum(v.price, 0),
  //         sellingPrice: safeNum(
  //           v.sellingPrice ?? computeSellingPrice(v.price, v.offer ?? 0),
  //           computeSellingPrice(v.price, v.offer ?? 0)
  //         ),
  //         offer: safeNum(v.offer ?? 0, 0),
  //         stock: safeNum(v.stock, 0),
  //         attributes: (v.attributes || []).map((a) => ({ key: a.key ?? "", value: a.value ?? "" })),
  //       }));

  //       const productData = {
  //         ...formData,
  //         variants: sanitizedVariants,
  //         images: updatedImages,
  //       };

  //       // 4️⃣ Update product
  //       const updatedProduct = await updateProductById(productData, token);

  //       // 5️⃣ Update redux
  //       const updatedList = products.map((p) => (p.id === formData.id ? updatedProduct : p));
  //       dispatch(setProducts(updatedList));
  //       dispatch(setSelectedProduct(null));

  //       toast.success("✅ Product updated successfully!");
  //       onClose();
  //       setNewImages([]); // reset new images
  //     } catch (err: any) {
  //       console.error("Update error:", err.message || err);
  //       toast.error(`❌ ${err.message || "Update failed"}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async () => {
    if (!formData) return;
    setLoading(true);

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";


      // Prepare sanitized variants
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

      // Prepare full product payload with updated images
      const productData = {
        ...formData,
        variants: sanitizedVariants,

      };

      // Update product on backend
      const updatedProduct = await updateProductById(productData, token);

      // Update redux store with new product data
      const updatedList = products.map((p) => (p.id === formData.id ? updatedProduct : p));
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(null));

      toast.success("✅ Product updated successfully!");
      onClose();
      setNewImages([]); // reset new images
    } catch (err: any) {
      console.error("Update error:", err.message || err);
      toast.error(`❌ ${err.message || "Update failed"}`);
    } finally {
      setLoading(false);
    }
  };


  if (!formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Product</h2>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Product Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Original Price</Label>
              <Input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} min="0" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Offer (%)</Label>
              <Input type="number" name="offer" value={formData.offer} onChange={handleChange} min="0" max="100" />
            </div>

            <div className="relative">
              {/* <Select
                options={categoryOptions}
                placeholder="Select Category"
                onChange={handleRoleChange}
                className="appearance-none pr-10"
              /> */}
              {formData.categoryId}

              {/* <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <HiChevronDown className="w-4 h-4" />
              </span> */}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              rows={3}
            />
          </div>

          {/* Optional product-level fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.skuCode !== undefined && (
              <div className="space-y-2">
                <Label>SKU Code</Label>
                <Input name="skuCode" value={formData.skuCode} onChange={handleChange} />
              </div>
            )}

            {formData.material !== undefined && (
              <div className="space-y-2">
                <Label>Material</Label>
                <Input name="material" value={formData.material} onChange={handleChange} />
              </div>
            )}

            {formData.returnPolicy !== undefined && (
              <div className="space-y-2">
                <Label>Return Policy</Label>
                <Input name="returnPolicy" value={formData.returnPolicy} onChange={handleChange} />
              </div>
            )}

            {formData.warrantyInfo !== undefined && (
              <div className="space-y-2">
                <Label>Warranty Info</Label>
                <Input name="warrantyInfo" value={formData.warrantyInfo} onChange={handleChange} />
              </div>
            )}

            {formData.manufactureDetails !== undefined && (
              <div className="space-y-2">
                <Label>Manufacture Details</Label>
                <Input name="manufactureDetails" value={formData.manufactureDetails} onChange={handleChange} />
              </div>
            )}

            {/* Shipping Available Checkbox */}
            <div className="flex items-center space-x-2 pt-4">
              <input
                id="shippingAvailable"
                type="checkbox"
                checked={formData.shippingAvailable}
                onChange={(e) => setFormData({ ...formData, shippingAvailable: e.target.checked })}
                className="w-5 h-5"
              />
              <Label htmlFor="shippingAvailable" className="cursor-pointer">
                Shipping Available
              </Label>
            </div>
          </div>

          {/* Variants Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Product Variants</h3>
            {variants.map((variant, vIndex) => (
              <div key={variant.id ?? vIndex} className="border p-4 rounded mb-4 bg-gray-50 relative dark:bg-gray-800">
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(vIndex)} className="absolute top-2 right-2 text-red-500 hover:text-red-700" title="Remove variant">
                    ×
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label>SKU<span className="text-error-500">*</span></Label>
                    <Input value={variant.sku} onChange={(e) => handleVariantChange(vIndex, "sku", e.target.value)} />
                  </div>

                  <div>
                    <Label>Price<span className="text-error-500">*</span></Label>
                    <Input type="number" value={variant.price} onChange={(e) => handleVariantChange(vIndex, "price", e.target.value)} min="0" />
                  </div>

                  <div>
                    <Label>Offer %</Label>
                    <Input type="number" value={variant.offer ?? 0} onChange={(e) => handleVariantChange(vIndex, "offer", e.target.value)} min="0" max="100" />
                  </div>

                  <div>
                    <Label>Stock<span className="text-error-500">*</span></Label>
                    <Input type="number" value={variant.stock} onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)} min="0" />
                  </div>
                </div>

                <div className="mb-3">
                  <Label>Selling Price (auto)</Label>
                  <Input type="number" value={variant.sellingPrice ?? computeSellingPrice(variant.price, variant.offer ?? 0)} />
                </div>

                <div>
                  <h4 className="font-medium mb-2">Attributes</h4>
                  {variant.attributes.map((attr, aIndex) => (
                    <div key={aIndex} className="flex gap-2 mb-2 items-center">
                      <Input value={attr.key} onChange={(e) => handleAttributeChange(vIndex, aIndex, "key", e.target.value)} placeholder="Key" />
                      <Input value={attr.value} onChange={(e) => handleAttributeChange(vIndex, aIndex, "value", e.target.value)} placeholder="Value" />
                      {variant.attributes.length > 1 && (
                        <button type="button" onClick={() => removeAttribute(vIndex, aIndex)} className="text-red-500 hover:text-red-700" title="Remove attribute">
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addAttribute(vIndex)} className="text-blue-500 mt-2 text-sm hover:text-blue-700">+ Add Attribute</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addVariant} className="text-green-600 font-medium hover:text-green-800">+ Add Variant</button>
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Product Images</h4>

            <div className="flex gap-2 flex-wrap mb-2">
              {/* Existing images */}
              {/* {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`img-${i}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))} */}

              {/* New images preview */}
              {/* {newImages.map((file, i) => (
                <div key={i} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`new-${i}`} 
                    className="w-20 h-20 object-cover rounded" 
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveNewImage(i)} 
                    className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))} */}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImage}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductModal;




