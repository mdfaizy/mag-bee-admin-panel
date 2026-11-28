// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { RefreshCw, Eye } from "lucide-react";

// import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
// import Button from "@/components/ui/button/Button";
// import {
//   Paginated,
//   ReturnRequest,
//   ReturnStatus,
//   getApiError,
//   listReturns,
// } from "@/services/returns/returnService";
// import ReturnDetailModal from "./ReturnDetailModal";
// import ReturnStatusBadge, { RETURN_STATUS_LABELS } from "./ReturnStatusBadge";

// const PAGE_SIZE = 20;

// const money = (value: unknown) =>
//   value == null || value === "" ? "—" : `₹${Number(value).toLocaleString("en-IN")}`;

// const ReturnsTable: React.FC = () => {
//   const [status, setStatus] = useState<ReturnStatus | "">("");
//   const [type, setType] = useState<"RETURN" | "REPLACEMENT" | "">("");
//   const [page, setPage] = useState(1);
//   const [result, setResult] = useState<Paginated<ReturnRequest> | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [openId, setOpenId] = useState<number | null>(null);

//   // Drop responses from superseded requests (fast filter changes)
//   const requestRef = useRef(0);

//   const load = useCallback(async () => {
//     const requestId = ++requestRef.current;
//     setLoading(true);
//     setError("");
//     try {
//       const data = await listReturns({ page, limit: PAGE_SIZE, status, type });
//       if (requestId === requestRef.current) setResult(data);
//     } catch (err) {
//       if (requestId === requestRef.current) setError(getApiError(err, "Unable to load returns"));
//     } finally {
//       if (requestId === requestRef.current) setLoading(false);
//     }
//   }, [page, status, type]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const rows = result?.data || [];
//   const totalPages = Math.max(1, result?.pagination?.totalPages || 1);

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
//         <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mr-auto">
//           Return requests
//           {result && <span className="ml-2 text-sm font-normal text-gray-500">({result.pagination.total})</span>}
//         </h2>

//         <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//           Status
//           <select
//             value={status}
//             onChange={(event) => {
//               setPage(1);
//               setStatus(event.target.value as ReturnStatus | "");
//             }}
//             className="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1.5"
//           >
//             <option value="">All</option>
//             {(Object.keys(RETURN_STATUS_LABELS) as ReturnStatus[]).map((value) => (
//               <option key={value} value={value}>
//                 {RETURN_STATUS_LABELS[value]}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//           Type
//           <select
//             value={type}
//             onChange={(event) => {
//               setPage(1);
//               setType(event.target.value as "RETURN" | "REPLACEMENT" | "");
//             }}
//             className="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1.5"
//           >
//             <option value="">All</option>
//             <option value="RETURN">Return</option>
//             <option value="REPLACEMENT">Replacement</option>
//           </select>
//         </label>

//         <Button
//           size="sm"
//           variant="outline"
//           onClick={load}
//           disabled={loading}
//           startIcon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
//         >
//           Refresh
//         </Button>
//       </div>

//       {error && (
//         <div className="p-4 text-sm text-red-600 flex items-center gap-3">
//           {error}
//           <button type="button" className="underline" onClick={load}>
//             Retry
//           </button>
//         </div>
//       )}

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableCell isHeader>Return</TableCell>
//             <TableCell isHeader>Order</TableCell>
//             <TableCell isHeader>Items</TableCell>
//             <TableCell isHeader>Reason</TableCell>
//             <TableCell isHeader>Payment</TableCell>
//             <TableCell isHeader>Refund</TableCell>
//             <TableCell isHeader>Status</TableCell>
//             <TableCell isHeader>Requested</TableCell>
//             <TableCell isHeader>
//               <span className="sr-only">Actions</span>
//             </TableCell>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading && !rows.length && (
//             <TableRow>
//               <TableCell colSpan={9} className="text-center text-gray-500 py-10">
//                 Loading returns…
//               </TableCell>
//             </TableRow>
//           )}

//           {!loading && !error && !rows.length && (
//             <TableRow>
//               <TableCell colSpan={9} className="text-center text-gray-500 py-10">
//                 No return requests found.
//               </TableCell>
//             </TableRow>
//           )}

//           {rows.map((request) => (
//             <TableRow key={request.id}>
//               <TableCell className="font-medium">
//                 #{request.id}
//                 <span className="block text-xs text-gray-500">{request.type}</span>
//               </TableCell>
//               <TableCell>{request.order?.orderCode || `#${request.orderId}`}</TableCell>
//               <TableCell>
//                 {request.items
//                   .map((item) => `${item.orderItem?.product?.name || "Item"} ×${item.quantity}`)
//                   .join(", ")}
//               </TableCell>
//               <TableCell className="max-w-[220px] truncate" >
//                 <span title={request.reason}>{request.reason}</span>
//               </TableCell>
//               <TableCell>{request.order?.paymentMethod || "—"}</TableCell>
//               <TableCell>
//                 {money(request.refundAmount)}
//                 {request.type === "RETURN" && (
//                   <span className="block text-xs text-gray-500">{request.refundStatus}</span>
//                 )}
//               </TableCell>
//               <TableCell>
//                 <ReturnStatusBadge status={request.status} />
//               </TableCell>
//               <TableCell className="whitespace-nowrap">
//                 {new Date(request.createdAt).toLocaleDateString("en-IN")}
//               </TableCell>
//               <TableCell>
//                 <button
//                   type="button"
//                   onClick={() => setOpenId(request.id)}
//                   className="inline-flex items-center gap-1.5 text-brand-500 hover:underline"
//                   aria-label={`View return ${request.id}`}
//                 >
//                   <Eye size={15} /> View
//                 </button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800 text-sm">
//           <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>
//             Previous
//           </Button>
//           <span className="text-gray-500">
//             Page {page} of {totalPages}
//           </span>
//           <Button
//             size="sm"
//             variant="outline"
//             disabled={page >= totalPages || loading}
//             onClick={() => setPage(page + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       )}
//       <ReturnDetailModal returnRequestId={openId} onClose={() => setOpenId(null)} onChanged={load} />
//     </div>
//   );
// };

// export default ReturnsTable;



"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshCw,
  Eye,
  RotateCcw,
  FileSpreadsheet,
  AlertCircle,
  PackageX,
  ArrowLeftRight,
  Clock,
  X,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingState from "@/components/common/LoadingState";
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
  value == null || value === ""
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

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
      if (requestId === requestRef.current) {
        setError(getApiError(err, "Unable to load returns"));
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [page, status, type]);

  useEffect(() => {
    load();
  }, [load]);

  const rows = result?.data || [];
  const totalItems = result?.pagination?.total ?? rows.length;
  const totalPages = Math.max(1, result?.pagination?.totalPages || 1);

  const pageStats = useMemo(() => {
    const returnsCount = rows.filter((r) => r.type === "RETURN").length;
    const replacementsCount = rows.filter(
      (r) => r.type === "REPLACEMENT"
    ).length;
    const totalRefund = rows.reduce((sum, r) => {
      const amt = Number(r.refundAmount);
      return Number.isFinite(amt) ? sum + amt : sum;
    }, 0);
    return { returnsCount, replacementsCount, totalRefund };
  }, [rows]);

  const hasActiveFilters = Boolean(status || type);

  const clearFilters = () => {
    setStatus("");
    setType("");
    setPage(1);
  };

  /* =========================================================
     EXPORT CURRENT PAGE TO EXCEL (.xls SpreadsheetML)
  ========================================================= */
  const handleExportExcel = () => {
    if (rows.length === 0) return;

    const headers = [
      "Return ID",
      "Type",
      "Order Code",
      "Items",
      "Reason",
      "Payment Method",
      "Refund Amount",
      "Refund Status",
      "Request Status",
      "Requested Date",
    ];

    const sheetRows = rows.map((req) => [
      `#${req.id}`,
      req.type,
      req.order?.orderCode || `#${req.orderId}`,
      req.items
        .map(
          (item) =>
            `${item.orderItem?.product?.name || "Item"} x${item.quantity}`
        )
        .join(", "),
      req.reason || "",
      req.order?.paymentMethod || "—",
      req.refundAmount != null && req.refundAmount !== ""
        ? Number(req.refundAmount)
        : 0,
      req.type === "RETURN" ? req.refundStatus || "—" : "N/A",
      RETURN_STATUS_LABELS[req.status] || req.status,
      new Date(req.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    ]);

    const headerCells = headers
      .map(
        (h) =>
          `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(
            h
          )}</Data></Cell>`
      )
      .join("");

    const bodyRows = sheetRows
      .map((row) => {
        const cells = row
          .map((val) => {
            const isNum = typeof val === "number" && Number.isFinite(val);
            const dataType = isNum ? "Number" : "String";
            return `<Cell><Data ss:Type="${dataType}">${escapeXml(
              val
            )}</Data></Cell>`;
          })
          .join("");
        return `<Row>${cells}</Row>`;
      })
      .join("");

    const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#0F172A"/>
      <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Returns">
    <Table>
      <Row>${headerCells}</Row>
      ${bodyRows}
    </Table>
  </Worksheet>
</Workbook>`;

    const blob = new Blob([workbookXml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `returns-report_page-${page}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Orders / Returns & Replacements
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Return Requests
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400 sm:text-sm">
              Review customer return and replacement claims, inspect items, and
              process refunds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-slate-400 ${
                  loading ? "animate-spin text-brand-500" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || rows.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel ({rows.length})</span>
            </button>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Requests
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <RotateCcw className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {totalItems}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Returns (Page)
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-rose-500 dark:bg-slate-800 dark:text-rose-400">
                <PackageX className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {pageStats.returnsCount}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Replacements (Page)
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-indigo-500 dark:bg-slate-800 dark:text-indigo-400">
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
              {pageStats.replacementsCount}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Refund Volume (Page)
                </span>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-amber-500 dark:bg-slate-800 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100 sm:text-2xl">
              {money(pageStats.totalRefund)}
            </div>
          </div>
        </div>

        {/* ============ ERROR BANNER ============ */}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={load}
              className="rounded-lg border border-rose-300 bg-white px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-slate-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* ============ MAIN TABLE PANEL ============ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* TOOLBAR */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-3.5 dark:border-slate-800 lg:flex-row lg:items-center">
            {/* TYPE PILLS */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { value: "", label: "All Types" },
                  { value: "RETURN", label: "Returns" },
                  { value: "REPLACEMENT", label: "Replacements" },
                ] as const
              ).map((item) => {
                const active = type === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setPage(1);
                      setType(item.value);
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-white"
                        : "border border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* STATUS SELECT + CLEAR */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>Status:</span>
                <select
                  value={status}
                  onChange={(event) => {
                    setPage(1);
                    setStatus(event.target.value as ReturnStatus | "");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  {(Object.keys(RETURN_STATUS_LABELS) as ReturnStatus[]).map(
                    (value) => (
                      <option key={value} value={value}>
                        {RETURN_STATUS_LABELS[value]}
                      </option>
                    )
                  )}
                </select>
              </label>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <div className="min-w-[1060px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Return
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Order
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Items
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Reason
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Payment
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Refund
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Requested
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading && !rows.length && (
                    <LoadingState variant="table" rows={6} columns={9} />
                  )}

                  {!loading && !error && !rows.length && (
                    <TableRow>
                      <TableCell colSpan={9} className="py-16 text-center">
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                            <RotateCcw className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            No return requests found
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {hasActiveFilters
                              ? "No requests match the selected filters."
                              : "Customer return and replacement requests will appear here."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {rows.map((request) => (
                    <TableRow
                      key={request.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                          #{request.id}
                        </span>
                        <span
                          className={`mt-1 block w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            request.type === "RETURN"
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                          }`}
                        >
                          {request.type}
                        </span>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                          {request.order?.orderCode || `#${request.orderId}`}
                        </span>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5">
                        <p className="max-w-[240px] truncate text-xs font-medium text-slate-800 dark:text-slate-200 sm:text-sm">
                          {request.items
                            .map(
                              (item) =>
                                `${item.orderItem?.product?.name || "Item"} ×${
                                  item.quantity
                                }`
                            )
                            .join(", ")}
                        </p>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5">
                        <span
                          title={request.reason}
                          className="block max-w-[220px] truncate text-xs text-slate-600 dark:text-slate-400"
                        >
                          {request.reason || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {request.order?.paymentMethod || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-900 tabular-nums dark:text-slate-100 sm:text-sm">
                          {money(request.refundAmount)}
                        </div>
                        {request.type === "RETURN" && request.refundStatus && (
                          <span className="mt-0.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {request.refundStatus}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap">
                        <ReturnStatusBadge status={request.status} />
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 whitespace-nowrap text-xs text-slate-600 tabular-nums dark:text-slate-400">
                        {new Date(request.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>

                      <TableCell className="!px-4 !py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setOpenId(request.id)}
                          aria-label={`View return ${request.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row">
              <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                Page{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {totalPages}
                </span>{" "}
                ({totalItems} total)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      <ReturnDetailModal
        returnRequestId={openId}
        onClose={() => setOpenId(null)}
        onChanged={load}
      />
    </div>
  );
};

export default ReturnsTable;