 "use client";

 import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedProduct, setProducts } from "@/redux/productSlice"; // make sure you have this
import { Product } from "../../utils/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, products } = useSelector((state: RootState) => state.product);

  const [formData, setFormData] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setFormData(selectedProduct);
      setImagePreview(selectedProduct.imageUrl || null);
    }
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    const parsedValue = name === "price" || name === "originalPrice" || name === "offer"
      ? parseFloat(value)
      : value;

    const updated = {
      ...formData,
      [name]: parsedValue,
    };

    // if (name === "originalPrice" || name === "offer") {
    //   updated.price = parseFloat(
    //     (updated.originalPrice - (updated.originalPrice * updated.offer) / 100).toFixed(2)
    //   );
    // }

    setFormData(updated);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setUploading(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", "ecommerce_uploads");
      uploadForm.append("folder", "products");

      const res = await fetch("https://api.cloudinary.com/v1_1/dditvtnis/image/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      setFormData({ ...formData, imageUrl: data.secure_url });
      setImagePreview(data.secure_url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await fetch(`http://localhost:8000/api/products/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update product");
      }

      // update redux store if needed
      const updatedList = products.map((p) =>
        p.id === formData.id ? result.updatedProduct : p
      );
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(null));

      onClose();
       toast.success("Product Update successfully!",);
    } catch (err: any) {
     toast.error(err.message || "Updated Failed");
    }
  };

  if (!formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Original Price</Label>
            <Input name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
          </div>
          <div>
            <Label>Offer (%)</Label>
            <Input name="offer" value={formData.offer} onChange={handleChange} />
          </div>
          {/* <div>
            <Label>Price (Auto Calculated)</Label>
            <Input name="price" value={formData.price} disabled />
          </div> */}

          <div>
            <Label>Upload Image</Label>
            <input type="file" onChange={handleImageChange} className="mt-1 block w-full" />
          </div>

          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-24 h-auto mt-2 rounded" />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductModal;
