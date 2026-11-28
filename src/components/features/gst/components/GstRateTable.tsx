// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { GstRate, ApiListResponse } from "../type/gst.types";
// import { getAllGstRatesAPI, updateGstRateStatusAPI } from "../service/gst.api";
// import GstRateViewModal from "./GstRateViewModal";
// import GstRateEditModal from "./GstRateEditModal";

// /* ---------- icons ---------- */
// const IconPlus = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//   </svg>
// );
// const IconEye = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );
// const IconEdit = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
//   </svg>
// );
// const IconToggle = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
//   </svg>
// );
// const IconAlert = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );
// const IconCheck = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );
// const IconInbox = ({ className = "h-10 w-10" }: { className?: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5v5.25A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V13.5M2.25 13.5L5.075 5.16A2.25 2.25 0 017.221 3.75h9.558a2.25 2.25 0 012.146 1.41L21.75 13.5" />
//   </svg>
// );

// /* ---------- helpers ---------- */
// function Spinner({ className = "h-4 w-4" }: { className?: string }) {
//   return (
//     <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
//     </svg>
//   );
// }

// function StatCard({
//   label, value, tone, icon,
// }: { label: string; value: number; tone: "blue" | "green" | "red"; icon: React.ReactNode }) {
//   const tones = {
//     blue: { bg: "bg-blue-50", fg: "text-blue-600", ring: "ring-blue-100" },
//     green: { bg: "bg-emerald-50", fg: "text-emerald-600", ring: "ring-emerald-100" },
//     red: { bg: "bg-rose-50", fg: "text-rose-600", ring: "ring-rose-100" },
//   }[tone];
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
//           <h3 className={`mt-2 text-2xl font-bold ${tones.fg}`}>{value}</h3>
//         </div>
//         <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones.bg} ${tones.fg} ring-1 ${tones.ring}`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function GstRateTable() {
//   const [rates, setRates] = useState<GstRate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [selectedRate, setSelectedRate] = useState<GstRate | null>(null);
//   const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
//   const [updatingId, setUpdatingId] = useState<number | null>(null);

//   const fetchGstRates = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await getAllGstRatesAPI();
//       const body = response.data as ApiListResponse<GstRate> | GstRate[];
//       setRates(Array.isArray(body) ? body : body?.data ?? []);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Unable to fetch GST rates.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchGstRates(); }, [fetchGstRates]);

//   const handleView = (rate: GstRate) => { setSelectedRate(rate); setModalType("view"); setError(""); };
//   const handleEdit = (rate: GstRate) => { setSelectedRate(rate); setModalType("edit"); setError(""); };
//   const handleCloseModal = () => { setModalType(null); setSelectedRate(null); };

//   const handleStatusChange = async (rate: GstRate) => {
//     try {
//       setUpdatingId(rate.id);
//       setError(""); setSuccess("");
//       await updateGstRateStatusAPI(rate.id, !rate.isActive);
//       setSuccess(`GST rate "${rate.rateName}" ${rate.isActive ? "deactivated" : "activated"} successfully.`);
//       await fetchGstRates();
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Unable to update GST status.");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const formatDate = (date?: string | null) => {
//     if (!date) return null;
//     const parsed = new Date(date);
//     if (Number.isNaN(parsed.getTime())) return "-";
//     return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900">GST Rates</h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage tax slabs, CGST/SGST/IGST breakdown and validity.
//           </p>
//         </div>
//         <Link
//           href="/gst/gst-rates/create"
//           className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
//         >
//           <IconPlus /> Add GST Rate
//         </Link>
//       </div>

//       {/* Alerts */}
//       {error && (
//         <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//           <IconAlert className="mt-0.5 shrink-0" /> <span>{error}</span>
//         </div>
//       )}
//       {success && (
//         <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
//           <IconCheck className="mt-0.5 shrink-0" /> <span>{success}</span>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <StatCard label="Total Rates" value={rates.length} tone="blue" icon={<span className="text-lg font-bold">%</span>} />
//         <StatCard label="Active" value={rates.filter((r) => r.isActive).length} tone="green" icon={<IconCheck />} />
//         <StatCard label="Inactive" value={rates.filter((r) => !r.isActive).length} tone="red" icon={<IconToggle />} />
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1100px] text-left text-sm">
//             <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//               <tr>
//                 <th className="px-5 py-3 font-semibold">#</th>
//                 <th className="px-5 py-3 font-semibold">Rate Name</th>
//                 <th className="px-5 py-3 text-right font-semibold">Total</th>
//                 <th className="px-5 py-3 text-right font-semibold">CGST</th>
//                 <th className="px-5 py-3 text-right font-semibold">SGST</th>
//                 <th className="px-5 py-3 text-right font-semibold">IGST</th>
//                 <th className="px-5 py-3 font-semibold">Effective From</th>
//                 <th className="px-5 py-3 font-semibold">Effective To</th>
//                 <th className="px-5 py-3 font-semibold">Status</th>
//                 <th className="px-5 py-3 text-right font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {loading ? (
//                 Array.from({ length: 5 }).map((_, i) => (
//                   <tr key={i} className="animate-pulse">
//                     <td className="px-5 py-4"><div className="h-3 w-4 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="h-3 w-32 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="ml-auto h-3 w-10 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="ml-auto h-3 w-10 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="ml-auto h-3 w-10 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="ml-auto h-3 w-10 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="h-3 w-20 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="h-3 w-16 rounded bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
//                     <td className="px-5 py-4"><div className="ml-auto h-7 w-40 rounded bg-slate-200" /></td>
//                   </tr>
//                 ))
//               ) : rates.length === 0 ? (
//                 <tr>
//                   <td colSpan={10}>
//                     <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
//                       <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
//                         <IconInbox />
//                       </div>
//                       <div>
//                         <p className="font-medium text-slate-800">No GST rates yet</p>
//                         <p className="mt-1 text-sm text-slate-500">Create your first GST rate to get started.</p>
//                       </div>
//                       <Link
//                         href="/gst/gst-rates/create"
//                         className="mt-1 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//                       >
//                         <IconPlus /> Add GST Rate
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 rates.map((rate, index) => (
//                   <tr key={rate.id} className="transition-colors hover:bg-slate-50/70">
//                     <td className="px-5 py-3.5 text-slate-500">{index + 1}</td>
//                     <td className="px-5 py-3.5">
//                       <div className="font-medium text-slate-900">{rate.rateName}</div>
//                       {rate.description && (
//                         <div className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
//                           {rate.description}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-5 py-3.5 text-right font-semibold text-slate-900">{rate.totalRate}%</td>
//                     <td className="px-5 py-3.5 text-right text-slate-700">{rate.cgstRate}%</td>
//                     <td className="px-5 py-3.5 text-right text-slate-700">{rate.sgstRate}%</td>
//                     <td className="px-5 py-3.5 text-right text-slate-700">{rate.igstRate}%</td>
                    
//                     <td className="px-5 py-3.5">
//                       <span
//                         className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
//                           rate.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
//                         }`}
//                       >
//                         <span className={`h-1.5 w-1.5 rounded-full ${rate.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
//                         {rate.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3.5">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           type="button"
//                           onClick={() => handleView(rate)}
//                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
//                         >
//                           <IconEye /> View
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => handleEdit(rate)}
//                           className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
//                         >
//                           <IconEdit /> Edit
//                         </button>
//                         <button
//                           type="button"
//                           disabled={updatingId === rate.id}
//                           onClick={() => handleStatusChange(rate)}
//                           className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                           {updatingId === rate.id ? <Spinner className="h-3 w-3" /> : <IconToggle className="h-3 w-3" />}
//                           {updatingId === rate.id ? "Updating" : rate.isActive ? "Deactivate" : "Activate"}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       {selectedRate && modalType === "view" && (
//         <GstRateViewModal rate={selectedRate} onClose={handleCloseModal} />
//       )}
//       {selectedRate && modalType === "edit" && (
//         <GstRateEditModal rate={selectedRate} onClose={handleCloseModal} onSuccess={fetchGstRates} />
//       )}
//     </div>
//   );
// }

"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GstRate, ApiListResponse } from "../type/gst.types";
import { getAllGstRatesAPI, updateGstRateStatusAPI } from "../service/gst.api";
import GstRateViewModal from "./GstRateViewModal";
import GstRateEditModal from "./GstRateEditModal";

/* ---------- icons ---------- */
const IconPlus = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const IconEye = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconEdit = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
  </svg>
);
const IconToggle = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
  </svg>
);
const IconAlert = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconCheck = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const IconInbox = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M2.25 13.5v5.25A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V13.5M2.25 13.5L5.075 5.16A2.25 2.25 0 017.221 3.75h9.558a2.25 2.25 0 012.146 1.41L21.75 13.5" />
  </svg>
);

function Spinner({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: "slate" | "emerald" | "rose";
}) {
  const dotMap = {
    slate: "bg-slate-400",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotMap[dot]}`} />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default function GstRateTable() {
  const [rates, setRates] = useState<GstRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRate, setSelectedRate] = useState<GstRate | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchGstRates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllGstRatesAPI();
      const body = response.data as ApiListResponse<GstRate> | GstRate[];
      setRates(Array.isArray(body) ? body : body?.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to fetch GST rates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGstRates();
  }, [fetchGstRates]);

  const handleView = (rate: GstRate) => {
    setSelectedRate(rate);
    setModalType("view");
    setError("");
  };

  const handleEdit = (rate: GstRate) => {
    setSelectedRate(rate);
    setModalType("edit");
    setError("");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedRate(null);
  };

  const handleStatusChange = async (rate: GstRate) => {
    try {
      setUpdatingId(rate.id);
      setError("");
      setSuccess("");
      await updateGstRateStatusAPI(rate.id, !rate.isActive);
      setSuccess(
        `GST rate "${rate.rateName}" ${
          rate.isActive ? "deactivated" : "activated"
        } successfully.`
      );
      await fetchGstRates();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to update GST status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const activeCount = rates.filter((r) => r.isActive).length;
  const inactiveCount = rates.length - activeCount;

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Taxation / GST Rates
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              GST Rates
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage tax slabs, CGST/SGST/IGST breakdown, and effective dates.
            </p>
          </div>

          <Link
            href="/gst/gst-rates/create"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:self-auto sm:text-sm"
          >
            <IconPlus />
            <span>Add GST Rate</span>
          </Link>
        </div>

        {/* ALERTS */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 sm:text-sm"
          >
            <IconAlert className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 sm:text-sm"
          >
            <IconCheck className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
          <StatCard label="Total Rates" value={rates.length} dot="slate" />
          <StatCard label="Active" value={activeCount} dot="emerald" />
          <StatCard label="Inactive" value={inactiveCount} dot="rose" />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Rate Name</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">CGST</th>
                  <th className="px-4 py-3 text-right">SGST</th>
                  <th className="px-4 py-3 text-right">IGST</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 10 }).map((__, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <div className="h-4 rounded bg-slate-100 dark:bg-slate-800" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rates.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          <IconInbox />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            No GST rates yet
                          </p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Create your first GST rate slab to get started.
                          </p>
                        </div>
                        <Link
                          href="/gst/gst-rates/create"
                          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
                        >
                          <IconPlus /> Add GST Rate
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rates.map((rate, index) => (
                    <tr
                      key={rate.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {rate.rateName}
                        </div>
                        {rate.description && (
                          <div className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400">
                            {rate.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                        {rate.totalRate}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-700 tabular-nums dark:text-slate-300 sm:text-sm">
                        {rate.cgstRate}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-700 tabular-nums dark:text-slate-300 sm:text-sm">
                        {rate.sgstRate}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-700 tabular-nums dark:text-slate-300 sm:text-sm">
                        {rate.igstRate}%
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            rate.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                              : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/30"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              rate.isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {rate.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleView(rate)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
                          >
                            <IconEye /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(rate)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
                          >
                            <IconEdit /> Edit
                          </button>
                          <button
                            type="button"
                            disabled={updatingId === rate.id}
                            onClick={() => handleStatusChange(rate)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/70"
                          >
                            {updatingId === rate.id ? (
                              <Spinner className="h-3 w-3" />
                            ) : (
                              <IconToggle className="h-3 w-3" />
                            )}
                            {updatingId === rate.id
                              ? "Updating"
                              : rate.isActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedRate && modalType === "view" && (
        <GstRateViewModal rate={selectedRate} onClose={handleCloseModal} />
      )}
      {selectedRate && modalType === "edit" && (
        <GstRateEditModal
          rate={selectedRate}
          onClose={handleCloseModal}
          onSuccess={fetchGstRates}
        />
      )}
    </div>
  );
}