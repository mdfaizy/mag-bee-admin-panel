
"use client";

import React, { useState } from "react";
import {
  HsnMaster,
  CreateHsnPayload,
} from "../type/gst.types";

import { updateHsnAPI } from "../service/gst.api";

interface HsnEditModalProps {
  hsn: HsnMaster;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function HsnEditModal({
  hsn,
  onClose,
  onSuccess,
}: HsnEditModalProps) {
  const [formData, setFormData] = useState<CreateHsnPayload>({
    hsnCode: hsn.hsnCode || "",
    description: hsn.description || "",
    chapterName: hsn.chapterName || "",
    remarks: hsn.remarks || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      const payload: CreateHsnPayload = {
        hsnCode,
        description,
        chapterName: formData.chapterName?.trim() || null,
        remarks: formData.remarks?.trim() || null,
      };

      await updateHsnAPI(hsn.id, payload);

      await onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to update HSN."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hsn-edit-title"
        className="my-auto w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="hsn-edit-title"
              className="text-lg font-semibold text-gray-800"
            >
              Edit HSN
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update HSN information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">

            {/* HSN Code */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                Enter 2 to 8 digits.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter HSN description"
                rows={4}
                maxLength={255}
                className={inputClass}
                required
              />
            </div>

            {/* Chapter */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Chapter Name (Optional)
              </label>

              <input
                type="text"
                name="chapterName"
                value={formData.chapterName || ""}
                onChange={handleChange}
                placeholder="Enter chapter name"
                maxLength={100}
                className={inputClass}
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Remarks (Optional)
              </label>

              <textarea
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
                placeholder="Enter remarks"
                rows={3}
                className={inputClass}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update HSN"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
