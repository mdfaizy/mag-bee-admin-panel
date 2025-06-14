"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { createCategory } from "../../services/product-category/categoryService";

export default function CreateProductCategory() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { categoryName, description } = form;

    if (!categoryName || !description) {
      toast.error("Please fill all required fields.");
      return;
    }

    dispatch(
      createCategory({
        categoryName,
        description,
        router,
      }) as any
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-11/12 w-full overflow-y-auto no-scrollbar mx-auto justify-center items-center">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
          Create Product Category
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Product Category Name <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                name="categoryName"
                placeholder="Enter your category name"
                value={form.categoryName}
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
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
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
