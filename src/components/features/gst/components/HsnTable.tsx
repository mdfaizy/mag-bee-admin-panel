
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  HsnMaster,
  ApiListResponse,
} from "../type/gst.types";

import { getAllHsnAPI } from "../service/gst.api";

import HsnViewModal from "./HsnViewModal";
import HsnEditModal from "./HsnEditModal";

export default function HsnTable() {
  const [hsnList, setHsnList] = useState<HsnMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedHsn, setSelectedHsn] =
    useState<HsnMaster | null>(null);

  const [modalType, setModalType] =
    useState<"view" | "edit" | null>(null);

  // Fetch HSN List
  const fetchHsnList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllHsnAPI();

      const body = response.data as
        | ApiListResponse<HsnMaster>
        | HsnMaster[];

      const result = Array.isArray(body)
        ? body
        : body?.data ?? [];

      setHsnList(result);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to fetch HSN records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHsnList();
  }, [fetchHsnList]);

  // View
  const handleView = (hsn: HsnMaster) => {
    setSelectedHsn(hsn);
    setModalType("view");
  };

  // Edit
  const handleEdit = (hsn: HsnMaster) => {
    setSelectedHsn(hsn);
    setModalType("edit");
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedHsn(null);
    setModalType(null);
  };

  // Search
  const filteredHsn = hsnList.filter((hsn) => {
    const searchValue = search.toLowerCase();

    return (
      hsn.hsnCode.toLowerCase().includes(searchValue) ||
      hsn.description.toLowerCase().includes(searchValue) ||
      (hsn.chapterName || "").toLowerCase().includes(searchValue)
    );
  });

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        Loading HSN records...
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            HSN Master
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage HSN codes and descriptions.
          </p>
        </div>

        <Link
          href="/gst/hsn/create"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add HSN
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total HSN Codes
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-800">
            {hsnList.length}
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Active HSN
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-600">
            {hsnList.filter((hsn) => hsn.isActive).length}
          </h3>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Inactive HSN
          </p>

          <h3 className="mt-2 text-2xl font-bold text-red-600">
            {hsnList.filter((hsn) => !hsn.isActive).length}
          </h3>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by HSN code, description or chapter..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[950px] text-left text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">HSN Code</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4">Chapter Name</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredHsn.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No HSN records found.
                </td>
              </tr>
            ) : (
              filteredHsn.map((hsn, index) => (
                <tr
                  key={hsn.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-800">
                    {hsn.hsnCode}
                  </td>

                  <td className="max-w-xs px-5 py-4 text-gray-600">
                    <p className="line-clamp-2">
                      {hsn.description}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {hsn.chapterName || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        hsn.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hsn.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() => handleView(hsn)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(hsn)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedHsn && modalType === "view" && (
        <HsnViewModal
          hsn={selectedHsn}
          onClose={handleCloseModal}
        />
      )}

      {/* Edit Modal */}
      {selectedHsn && modalType === "edit" && (
        <HsnEditModal
          hsn={selectedHsn}
          onClose={handleCloseModal}
          onSuccess={fetchHsnList}
        />
      )}

    </div>
  );
}
