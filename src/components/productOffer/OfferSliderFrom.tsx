"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createOfferBanner } from "@/services/bannerServices/BannerService";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

interface OfferBannerFormData {
  title: string;
  subtitle: string;
  link: string;
  startDate: string;
  endDate: string;
  image: File | null;
}

const OfferSliderForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isActive, setIsActive] = useState(true);
  const [form, setForm] = useState<OfferBannerFormData>({
    title: "",
    subtitle: "",
    link: "",
    startDate: "",
    endDate: "",
    image: null,
  });
  // const [isActive, setIsActive] = useState(true);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ file size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    // ✅ file type check
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setForm((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.image) {
      toast.error("Banner image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("link", form.link);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("image", form.image);
    formData.append("isActive", String(isActive));

    try {
      setLoading(true);
      await dispatch(createOfferBanner({ formData, router }));
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Create New Offer Banner
      </h2>

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

      {/* Title */}
      <div>
        <Label>
          Offer Title <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Big Billion Days"

        />
      </div>

      {/* Subtitle */}
      <div>
        <Label>Subtitle</Label>
        <TextArea
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="e.g. Up to 70% off"
        />
      </div>

      {/* Link */}
      <div>
        <Label>Redirect Link</Label>
        <Input
          type="url"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Image Upload */}

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Banner Image <span className="text-red-500">*</span>
        </Label>

        <div className="flex gap-6">
          {/* Upload Box */}
          <label
            htmlFor="bannerImage"
            className="flex flex-col items-center justify-center w-64 h-40
                 border-2 border-dashed border-gray-300 rounded-lg
                 cursor-pointer hover:border-blue-500
                 transition-colors bg-gray-50"
          >
            <svg
              className="w-10 h-10 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V12m0 0l2 2m-2-2l-2 2m6-6h.01M12 16v-4m0 0l2 2m-2-2l-2 2m6-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG (Max 2MB)
            </p>

            <input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </label>

          {/* Preview */}
          {imagePreview && (
            <div className="relative w-64 h-40 border rounded-lg overflow-hidden bg-white shadow-sm">
              <img
                src={imagePreview}
                alt="Banner Preview"
                className="w-full h-full object-contain"
              />
              <span className="absolute top-1 right-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
          )}
        </div>
      </div>


      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Creating..." : "Create Banner"}
      </button>
    </form>
  );
};

export default OfferSliderForm;
