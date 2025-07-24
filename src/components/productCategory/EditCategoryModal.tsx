 "use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setSelectedCategory, setCategories } from '@/redux/productCategory';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Button from '../ui/button/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selectedCategory, categories } = useSelector((state: RootState) => state.category);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
        imageUrl: selectedCategory.imageUrl,
      });
      setImagePreview(selectedCategory.imageUrl || null);
    }
  }, [selectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("upload_preset", "ecommerce_uploads");
      uploadForm.append("folder", "categories");

      const res = await fetch("https://api.cloudinary.com/v1_1/dditvtnis/image/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      setImagePreview(data.secure_url);
    } catch (err) {
      alert("Image upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory) return;

    try {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : "";

      const res = await fetch(`http://localhost:8000/api/category/${selectedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update category");
      }

      // Update Redux store
      const updatedList = categories.map((cat) =>
        cat.id === selectedCategory.id ? result.updatedCategory : cat
      );
      dispatch(setCategories(updatedList));

      dispatch(setSelectedCategory(null));
      onClose();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  if (!selectedCategory) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
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
            <Label>Upload Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-24 h-auto mt-2 rounded" />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;

