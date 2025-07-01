"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";



export default function RoleCreate() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    Name: "",
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
  const { Name, description } = form;

  if (!Name || !description) {
    toast.error("Please fill all required fields.");
    return;
  }

  dispatch(
    createRole({
      name: Name,
      description,
      router,
    }) as any
  );
};


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto mt-8 mb-8">
        <h1 className="text-center font-semibold uppercase mb-6 text-lg">
          Create Role
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>
                Role Name <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                name="categoryName"
                placeholder="Enter Role name"
                value={form.Name}
                onChange={handleChange}
                className="text-uppercase"
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
                Create Role
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
