
"use client";

import React from "react";
import { GstRate } from "../type/gst.types";

interface GstRateViewModalProps {
  rate: GstRate;
  onClose: () => void;
}

const formatDate = (date?: string | null) => {
  if (!date) return "No expiry";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleDateString("en-IN");
};

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default function GstRateViewModal({
  rate,
  onClose,
}: GstRateViewModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gst-view-title"
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="gst-view-title"
              className="text-lg font-semibold text-gray-800"
            >
              GST Rate Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete information about this GST rate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              {rate.rateName}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                rate.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {rate.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* GST Summary */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm text-gray-600">
              Total GST Rate
            </p>

            <h2 className="mt-1 text-3xl font-bold text-blue-700">
              {rate.totalRate}%
            </h2>
          </div>

          {/* GST Breakdown */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              GST Breakdown
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Detail
                label="CGST"
                value={`${rate.cgstRate}%`}
              />

              <Detail
                label="SGST"
                value={`${rate.sgstRate}%`}
              />

              <Detail
                label="IGST"
                value={`${rate.igstRate}%`}
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Validity
            </h3>

            
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Description
            </h3>

            <div className="min-h-16 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              {rate.description || "No description available."}
            </div>
          </div>

          {/* IDs and timestamps */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail
              label="GST Rate ID"
              value={String(rate.id)}
            />

            <Detail
              label="Created At"
              value={formatDate(rate.createdAt)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
