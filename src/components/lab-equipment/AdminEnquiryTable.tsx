"use client";

import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaTrash,
  FaPen,
} from "react-icons/fa";

import type { LabEnquiry } from "@/services/enquiryService";

interface AdminEnquiryTableProps {
  enquiries: LabEnquiry[];
  onView: (id: number) => void;
  onStatusChange: (id: number, status: LabEnquiry["status"]) => void;
  updatingId: number | null;
}

// Map enums to display labels
const typeLabel: Record<string, string> = {
  RFQ: "RFQ",
  PRICE_INQUIRY: "Price Inquiry",
  BULK_PURCHASE: "Bulk Purchase",
  TECHNICAL_INFORMATION: "Tech Info",
  PRODUCT_DEMO: "Demo",
  OTHER: "Other",
};

const statusOptions: LabEnquiry["status"][] = [
  "NEW", "CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", 
  "FOLLOW_UP", "CONVERTED", "LOST", "CLOSED"
];

// Colors for status pills with a dot
const getStatusStyle = (status: string) => {
  switch (status) {
    case "NEW": return "bg-blue-50 text-blue-700 border-blue-200 dot-blue-500";
    case "CONTACTED": return "bg-cyan-50 text-cyan-700 border-cyan-200 dot-cyan-500";
    case "IN_PROGRESS": return "bg-orange-50 text-orange-700 border-orange-200 dot-orange-500";
    case "QUOTATION_SENT": return "bg-purple-50 text-purple-700 border-purple-200 dot-purple-500";
    case "FOLLOW_UP": return "bg-yellow-50 text-yellow-700 border-yellow-200 dot-yellow-500";
    case "CONVERTED": return "bg-green-50 text-green-700 border-green-200 dot-green-500";
    case "LOST": return "bg-red-50 text-red-700 border-red-200 dot-red-500";
    case "CLOSED": return "bg-slate-100 text-slate-700 border-slate-300 dot-slate-500";
    default: return "bg-slate-50 text-slate-700 border-slate-200 dot-slate-400";
  }
};

export default function AdminEnquiryTable({
  enquiries,
  onView,
  onStatusChange,
  updatingId,
}: AdminEnquiryTableProps) {
  
  if (enquiries.length === 0) {
    return (
      <div className="py-16 text-center bg-white">
        <p className="text-slate-500 text-sm">No enquiries match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-sm text-left">
        
        {/* Table Head */}
        <thead className="bg-[#fcfcfc] border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-16">ID</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Product</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Qty</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
            <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100">
          {enquiries.map((e) => (
            <tr key={e.id} className="hover:bg-slate-50/60 transition-colors group">
              
              {/* ID */}
              <td className="px-4 py-4 text-xs font-medium text-slate-500">
                #{String(e.id).padStart(4, '0')}
              </td>

              {/* Customer Details */}
              <td className="px-4 py-4">
                <div className="font-semibold text-slate-800 text-sm">{e.fullName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{e.companyName || "Individual"}</div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-blue-600 transition">
                    <FaPhone className="text-[9px]" /> {e.phone}
                  </a>
                  {e.email && (
                    <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-blue-600 transition truncate max-w-[120px]">
                      <FaEnvelope className="text-[9px]" /> {e.email}
                    </a>
                  )}
                </div>
              </td>

              {/* Product Details */}
              <td className="px-4 py-4">
                <div className="font-medium text-slate-800 text-sm truncate max-w-[200px]">
                  {e.productName || "—"}
                </div>
                {e.productCode && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-mono">
                    {e.productCode}
                  </span>
                )}
              </td>

              {/* Quantity */}
              <td className="px-4 py-4 text-center">
                <span className="font-medium text-slate-700">{e.quantity}</span>
              </td>

              {/* Type Pill */}
              <td className="px-4 py-4">
                <span className="inline-block px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-[11px] font-semibold whitespace-nowrap">
                  {typeLabel[e.enquiryType] || e.enquiryType}
                </span>
              </td>

              {/* Status & Dropdown */}
              <td className="px-4 py-4">
                <div className="flex flex-col gap-2 items-start">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${getStatusStyle(e.status).split(" dot-")[0]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(e.status).split(" dot-")[1] ? `bg-${getStatusStyle(e.status).split(" dot-")[1].replace('500', '500')}` : 'bg-slate-500'}`}></span>
                    {e.status.replace(/_/g, " ")}
                  </div>

                  <select
                    value={e.status}
                    disabled={updatingId === e.id}
                    onChange={(ev) => onStatusChange(e.id, ev.target.value as LabEnquiry["status"])}
                    className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
              </td>

              {/* Date */}
              <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                {e.createdAt ? (
                  <>
                    <div className="font-medium text-slate-700">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(e.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </>
                ) : "N/A"}
              </td>

              {/* Actions (Icons matching Product page) */}
              <td className="px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(e.id)}
                    title="View Details"
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEye className="text-sm" />
                  </button>
                  {/* These are placeholders to match your screenshot's edit/delete icons */}
                  <button
                    title="Edit (Coming Soon)"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <FaPen className="text-xs" />
                  </button>
                  <button
                    title="Delete (Coming Soon)"
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}