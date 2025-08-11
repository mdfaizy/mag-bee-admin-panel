//  "use client";

//  import { toast } from "react-toastify";
// import React, { useEffect, useState } from "react";
// import { Modal } from "../ui/modal";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
// import Button from "../ui/button/Button";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setSelectedProduct, setProducts } from "@/redux/productSlice"; // make sure you have this
// import { Product } from "../../utils/type";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const EditProductModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const { selectedProduct, products } = useSelector((state: RootState) => state.product);

//   const [formData, setFormData] = useState<Product | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (selectedProduct) {
//       setFormData(selectedProduct);
//       setImagePreview(selectedProduct.imageUrl || null);
//     }
//   }, [selectedProduct]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!formData) return;
//     const { name, value } = e.target;
//     const parsedValue = name === "price" || name === "originalPrice" || name === "offer"
//       ? parseFloat(value)
//       : value;

//     const updated = {
//       ...formData,
//       [name]: parsedValue,
//     };

//     // if (name === "originalPrice" || name === "offer") {
//     //   updated.price = parseFloat(
//     //     (updated.originalPrice - (updated.originalPrice * updated.offer) / 100).toFixed(2)
//     //   );
//     // }

//     setFormData(updated);
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !formData) return;

//     setUploading(true);
//     try {
//       const uploadForm = new FormData();
//       uploadForm.append("file", file);
//       uploadForm.append("upload_preset", "ecommerce_uploads");
//       uploadForm.append("folder", "products");

//       const res = await fetch("https://api.cloudinary.com/v1_1/dditvtnis/image/upload", {
//         method: "POST",
//         body: uploadForm,
//       });

//       const data = await res.json();
//       setFormData({ ...formData, imageUrl: data.secure_url });
//       setImagePreview(data.secure_url);
//     } catch (err) {
//       alert("Image upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData) return;

//     try {
//       const rawToken = localStorage.getItem("token");
//       const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

//       const res = await fetch(`http://localhost:8000/api/products/${formData.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();
//       if (!res.ok) {
//         throw new Error(result.message || "Failed to update product");
//       }

//       // update redux store if needed
//       const updatedList = products.map((p) =>
//         p.id === formData.id ? result.updatedProduct : p
//       );
//       dispatch(setProducts(updatedList));
//       dispatch(setSelectedProduct(null));

//       onClose();
//        toast.success("Product Update successfully!",);
//     } catch (err: any) {
//      toast.error(err.message || "Updated Failed");
//     }
//   };

//   if (!formData) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
//       <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
//         <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
//         <form className="space-y-4">
//           <div>
//             <Label>Name</Label>
//             <Input name="name" value={formData.name} onChange={handleChange} />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <Input name="description" value={formData.description} onChange={handleChange} />
//           </div>
//           <div>
//             <Label>Original Price</Label>
//             <Input name="originalPrice" value={formData.originalPrice} onChange={handleChange} />
//           </div>
//           <div>
//             <Label>Offer (%)</Label>
//             <Input name="offer" value={formData.offer} onChange={handleChange} />
//           </div>
//           {/* <div>
//             <Label>Price (Auto Calculated)</Label>
//             <Input name="price" value={formData.price} disabled />
//           </div> */}

//           <div>
//             <Label>Upload Image</Label>
//             <input type="file" onChange={handleImageChange} className="mt-1 block w-full" />
//           </div>

//           {imagePreview && (
//             <img src={imagePreview} alt="Preview" className="w-24 h-auto mt-2 rounded" />
//           )}

//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="outline" type="button" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="button" onClick={handleSubmit} disabled={uploading}>
//               {uploading ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default EditProductModal;


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
      toast.error("Image upload failed");
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

      const updatedList = products.map((p) =>
        p.id === formData.id ? result.updatedProduct : p
      );
      dispatch(setProducts(updatedList));
      dispatch(setSelectedProduct(null));

      onClose();
      toast.success("Product updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  if (!formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Edit Product</h2>
        
        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Name</Label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Original Price</Label>
              <Input 
                type="number"
                name="originalPrice" 
                value={formData.originalPrice} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Offer (%)</Label>
              <Input 
                type="number"
                name="offer" 
                value={formData.offer} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Description</Label>
            <Input 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Product Image</Label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm font-medium">{uploading ? "Uploading..." : "Choose Image"}</span>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                  disabled={uploading}
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit} 
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-600 transition-colors"
            >
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductModal;


