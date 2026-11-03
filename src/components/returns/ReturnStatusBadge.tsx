import React from "react";
import type { ReturnStatus } from "@/services/returns/returnService";

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  PICKED_UP: "Picked Up",
  RECEIVED: "Received",
  INSPECTION: "In Inspection",
  REFUND_PENDING: "Refund Pending",
  REPLACEMENT_PROCESSING: "Replacement",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const TONE: Record<string, string> = {
  REQUESTED:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  APPROVED:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  PICKUP_SCHEDULED:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
  PICKED_UP:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900",
  RECEIVED:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900",
  INSPECTION:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900",
  REFUND_PENDING:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  REPLACEMENT_PROCESSING:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  COMPLETED:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900",
  REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  CANCELLED:
    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const ReturnStatusBadge: React.FC<{ status: ReturnStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${
      TONE[status] || TONE.CANCELLED
    }`}
  >
    {RETURN_STATUS_LABELS[status] || status}
  </span>
);

export default ReturnStatusBadge;
