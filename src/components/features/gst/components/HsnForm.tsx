
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createHsnAPI,
  updateHsnAPI,
} from "../service/gst.api";

interface HsnFormProps {
  id?: number;
  initialData?: {
    hsnCode: string;
    description: string;
    chapterName?: string | null;
    remarks?: string | null;
  };
}

export default function HsnForm({
  id,
  initialData,
}: HsnFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hsnCode: initialData?.hsnCode || "",
    description: initialData?.description || "",
    chapterName: initialData?.chapterName || "",
    remarks: initialData?.remarks || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const hsnCode = formData.hsnCode.trim();
    const description = formData.description.trim();

    if (!hsnCode) {
      setError("HSN code is required.");
      return;
    }

    if (!/^\d{2,8}$/.test(hsnCode)) {
      setError("HSN code must contain 2 to 8 digits.");
      return;
    }

    if (!description) {
      setError("Description is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        hsnCode,
        description,
        chapterName: formData.chapterName.trim() || null,
        remarks: formData.remarks.trim() || null,
      };

      if (id) {
        await updateHsnAPI(id, payload);
      } else {
        await createHsnAPI(payload);
      }

      router.push("/gst/hsn");
      router.refresh();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to save HSN."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-white p-6"
    >
      {/* HSN Code */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          HSN Code
        </label>

        <input
          type="text"
          name="hsnCode"
          value={formData.hsnCode}
          onChange={handleChange}
          placeholder="Example: 847130"
          maxLength={8}
          inputMode="numeric"
          className={inputClass}
          required
        />

        <p className="mt-1 text-xs text-gray-500">
          Enter HSN code (maximum 8 digits).
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter HSN description"
          className={inputClass}
          rows={4}
          maxLength={255}
          required
        />
      </div>

      {/* Chapter Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Chapter Name (Optional)
        </label>

        <input
          type="text"
          name="chapterName"
          value={formData.chapterName}
          onChange={handleChange}
          placeholder="Enter chapter name"
          maxLength={100}
          className={inputClass}
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Remarks (Optional)
        </label>

        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Enter remarks"
          rows={3}
          className={inputClass}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-lg border px-5 py-2.5 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : id
              ? "Update HSN"
              : "Save HSN"}
        </button>
      </div>
    </form>
  );
}
