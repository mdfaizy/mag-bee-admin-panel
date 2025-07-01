"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { createCategory } from "../../services/product-category/categoryService";

export default function CreateProductCategory() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, image } = form;

    if (!name || !description || !image) {
      toast.error("Please fill all required fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imageUrl", image);

    dispatch(
      createCategory({
        formData,
        router,
      }) as any
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
          Create Product Category
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Category Name <span className="text-error-500">*</span>
              </Label>
              <Input
  type="text"
  name="name" 
  value={form.name}
  onChange={handleChange}
/>
            </div>

            <div>
              <Label>
                Description <span className="text-error-500">*</span>
              </Label>
              <TextArea
                name="description"
                placeholder="Enter your description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>
                Category Image <span className="text-error-500">*</span>
              </Label>
              <Input
                type="file"
                name="image"
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 mb-8"
              >
                Create Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
