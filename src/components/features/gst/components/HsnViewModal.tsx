
"use client";

import React from "react";
import { HsnMaster } from "../type/gst.types";

interface HsnViewModalProps {
  hsn: HsnMaster;
  onClose: () => void;
}

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

export default function HsnViewModal({
  hsn,
  onClose,
}: HsnViewModalProps) {
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
        aria-labelledby="hsn-view-title"
        className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2
              id="hsn-view-title"
              className="text-lg font-semibold text-gray-800"
            >
              HSN Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete HSN information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm text-gray-500">HSN Code</p>
            <h3 className="mt-1 text-3xl font-bold text-blue-700">
              {hsn.hsnCode}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail
              label="HSN ID"
              value={String(hsn.id)}
            />

            <Detail
              label="Status"
              value={hsn.isActive ? "Active" : "Inactive"}
            />

            <div className="sm:col-span-2">
              <Detail
                label="Description"
                value={hsn.description || "-"}
              />
            </div>

            <Detail
              label="Chapter Name"
              value={hsn.chapterName || "-"}
            />

            <Detail
              label="Remarks"
              value={hsn.remarks || "-"}
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
