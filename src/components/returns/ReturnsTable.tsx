"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Eye } from "lucide-react";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import {
  Paginated,
  ReturnRequest,
  ReturnStatus,
  getApiError,
  listReturns,
} from "@/services/returns/returnService";
import ReturnDetailModal from "./ReturnDetailModal";
import ReturnStatusBadge, { RETURN_STATUS_LABELS } from "./ReturnStatusBadge";

const PAGE_SIZE = 20;

const money = (value: unknown) =>
  value == null || value === "" ? "—" : `₹${Number(value).toLocaleString("en-IN")}`;

const ReturnsTable: React.FC = () => {
  const [status, setStatus] = useState<ReturnStatus | "">("");
  const [type, setType] = useState<"RETURN" | "REPLACEMENT" | "">("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<ReturnRequest> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  // Drop responses from superseded requests (fast filter changes)
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setError("");
    try {
      const data = await listReturns({ page, limit: PAGE_SIZE, status, type });
      if (requestId === requestRef.current) setResult(data);
    } catch (err) {
      if (requestId === requestRef.current) setError(getApiError(err, "Unable to load returns"));
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [page, status, type]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = result?.data || [];
  const totalPages = Math.max(1, result?.pagination?.totalPages || 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mr-auto">
          Return requests
          {result && <span className="ml-2 text-sm font-normal text-gray-500">({result.pagination.total})</span>}
        </h2>

        <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          Status
          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value as ReturnStatus | "");
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1.5"
          >
            <option value="">All</option>
            {(Object.keys(RETURN_STATUS_LABELS) as ReturnStatus[]).map((value) => (
              <option key={value} value={value}>
                {RETURN_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          Type
          <select
            value={type}
            onChange={(event) => {
              setPage(1);
              setType(event.target.value as "RETURN" | "REPLACEMENT" | "");
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1.5"
          >
            <option value="">All</option>
            <option value="RETURN">Return</option>
            <option value="REPLACEMENT">Replacement</option>
          </select>
        </label>

        <Button
          size="sm"
          variant="outline"
          onClick={load}
          disabled={loading}
          startIcon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 flex items-center gap-3">
          {error}
          <button type="button" className="underline" onClick={load}>
            Retry
          </button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Return</TableCell>
            <TableCell isHeader>Order</TableCell>
            <TableCell isHeader>Items</TableCell>
            <TableCell isHeader>Reason</TableCell>
            <TableCell isHeader>Payment</TableCell>
            <TableCell isHeader>Refund</TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader>Requested</TableCell>
            <TableCell isHeader>
              <span className="sr-only">Actions</span>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && !rows.length && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-10">
                Loading returns…
              </TableCell>
            </TableRow>
          )}

          {!loading && !error && !rows.length && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-10">
                No return requests found.
              </TableCell>
            </TableRow>
          )}

          {rows.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                #{request.id}
                <span className="block text-xs text-gray-500">{request.type}</span>
              </TableCell>
              <TableCell>{request.order?.orderCode || `#${request.orderId}`}</TableCell>
              <TableCell>
                {request.items
                  .map((item) => `${item.orderItem?.product?.name || "Item"} ×${item.quantity}`)
                  .join(", ")}
              </TableCell>
              <TableCell className="max-w-[220px] truncate" >
                <span title={request.reason}>{request.reason}</span>
              </TableCell>
              <TableCell>{request.order?.paymentMethod || "—"}</TableCell>
              <TableCell>
                {money(request.refundAmount)}
                {request.type === "RETURN" && (
                  <span className="block text-xs text-gray-500">{request.refundStatus}</span>
                )}
              </TableCell>
              <TableCell>
                <ReturnStatusBadge status={request.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(request.createdAt).toLocaleDateString("en-IN")}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => setOpenId(request.id)}
                  className="inline-flex items-center gap-1.5 text-brand-500 hover:underline"
                  aria-label={`View return ${request.id}`}
                >
                  <Eye size={15} /> View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800 text-sm">
          <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || loading}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ReturnDetailModal returnRequestId={openId} onClose={() => setOpenId(null)} onChanged={load} />
    </div>
  );
};

export default ReturnsTable;
