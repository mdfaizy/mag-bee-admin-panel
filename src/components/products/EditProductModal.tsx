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

interface Variant {
  id?: number;
  sku: string;
  price: number; 
  stock: number;
  attributes: { key: string; value: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}



const EditProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, products } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize form data and variants when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        ...selectedProduct,
        // categoryId: selectedProduct.category?.id ?? selectedProduct.categoryId ?? 0,
          categoryId: selectedProduct.category?.id ?? 0,
        originalPrice: selectedProduct.originalPrice ?? 0,
        offer: selectedProduct.offer ?? 0,
        stock: selectedProduct.stock ?? 0,
        // shippingAvailable: selectedProduct.shippingAvailable ?? false,
        shippingAvailable: selectedProduct.shippingAvailable ?? false,
        warrantyInfo: selectedProduct.warrantyInfo ?? "",
        skuCode: selectedProduct.skuCode ?? "",
        material: selectedProduct.material ?? "",
        returnPolicy: selectedProduct.returnPolicy ?? "",
        manufactureDetails: selectedProduct.manufactureDetails ?? "",
      });

      setVariants(selectedProduct.variants || []);
    }
  }, [selectedProduct]);

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isOpen]);

  // Handle change for product fields
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   if (!formData) return;
  //   const { name, value, type, checked } = e.target;

  //   let parsedValue: any = value;
  //   if (type === "checkbox") {
  //     parsedValue = checked;
  //   } else if (
  //     name === "price" ||
  //     name === "originalPrice" ||
  //     name === "offer" ||
  //     name === "categoryId"
  //   ) {
  //     parsedValue = parseFloat(value);
  //     if (isNaN(parsedValue)) parsedValue = 0;
  //   }

  //   setFormData({
  //     ...formData,
  //     [name]: parsedValue,
  //   });
  // };



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
    name === "categoryId"
  ) {
    parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) parsedValue = 0;
  }

  setFormData({
    ...formData,
    [name]: parsedValue,
  });
};


  // Variant management functions
  const addVariant = () => {
    setVariants([
      ...variants,
      { sku: "", price: 0, stock: 0, attributes: [{ key: "", value: "" }] },
    ]);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    setVariants(newVariants);
  };

  const addAttribute = (vIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes.push({ key: "", value: "" });
    setVariants(newVariants);
  };

  const removeAttribute = (vIndex: number, aIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes.splice(aIndex, 1);
    setVariants(newVariants);
  };

  const handleAttributeChange = (vIndex: number, aIndex: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[vIndex].attributes[aIndex] = {
      ...newVariants[vIndex].attributes[aIndex],
      [field]: value,
    };
    setVariants(newVariants);
  };

  // Handle form submit to update product
  const handleSubmit = async () => {
    if (!formData) return;

    setLoading(true);
    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const productData = {
        ...formData,
        variants: variants,
      };

      const res = await fetch(`http://localhost:8000/api/products/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result.success && result.product) {
        const updatedList = products.map((p) =>
          p.id === formData.id ? result.product : p
        );
        dispatch(setProducts(updatedList));
        dispatch(setSelectedProduct(null));

        onClose();
        toast.success("Product updated successfully!");
      } else {
        throw new Error(result.message || "Failed to update product");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Update failed");
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
              <Input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                // step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Offer (%)</Label>
              <Input
                type="number"
                name="offer"
                value={formData.offer}
                onChange={handleChange}
                min="0"
                max="100"
                // step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Category ID</Label>
              <Input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                min="1"
              />
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
                <Input
                  name="manufactureDetails"
                  value={formData.manufactureDetails}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Shipping Available Checkbox */}
            <div className="flex items-center space-x-2 pt-4">
              <input
                id="shippingAvailable"
                type="checkbox"
                checked={formData.shippingAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, shippingAvailable: e.target.checked })
                }
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
              <div
                key={vIndex}
                className="border p-4 rounded mb-4 bg-gray-50 relative dark:bg-gray-800"
              >
                {variants.length > 1 && (
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
                    <Label>
                      SKU<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => handleVariantChange(vIndex, "sku", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>
                      Price<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "price", parseFloat(e.target.value) || 0)
                      }
                      min="0"
                      // step="0.01"
                    />
                  </div>

                  <div>
                    <Label>
                      Stock<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "stock", parseInt(e.target.value) || 0)
                      }
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Attributes</h4>
                  {variant.attributes.map((attr, aIndex) => (
                    <div key={aIndex} className="flex gap-2 mb-2 items-center">
                      <Input
                        value={attr.key}
                        onChange={(e) => handleAttributeChange(vIndex, aIndex, "key", e.target.value)}
                        placeholder="Key"
                      />
                      <Input
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(vIndex, aIndex, "value", e.target.value)
                        }
                        placeholder="Value"
                      />
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductModal;

