// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FaSearch,
//   FaSyncAlt,
//   FaArrowRight,
//   FaCalendarAlt,
//   FaInbox,
//   FaSpinner,
// } from "react-icons/fa";

// import GemEnquiryDetailsModal, {
//   GemEnquiry,
// } from "@/components/gem/GemEnquiryDetailsModal";
// import {
//   getGemEnquiryDocumentAPI,
//   getGemEnquiriesAPI,
//   getGemEnquiryByIdAPI,
//   updateGemEnquiryAPI,
//   deleteGemEnquiryAPI,
// } from "@/services/GemEnquiryAdminAPI";

// const getStatusBadgeStyle = (status?: string) => {
//   switch (status) {
//     case "COMPLETED":
//       return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
//     case "QUOTED":
//       return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20";
//     case "IN_PROGRESS":
//       return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
//     case "CANCELLED":
//       return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";
//     case "NEW":
//     default:
//       return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";
//   }
// };

// const GemEnquiryManagement = () => {
//   const [enquiries, setEnquiries] = useState<GemEnquiry[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [selectedEnquiry, setSelectedEnquiry] = useState<GemEnquiry | null>(
//     null
//   );

//   const [editStatus, setEditStatus] = useState("NEW");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [adminNotes, setAdminNotes] = useState("");

//   const [saving, setSaving] = useState(false);

//   // =====================================
//   // STATS
//   // =====================================

//   const stats = useMemo(() => {
//     let newCount = 0;
//     let activeCount = 0;
//     let completedCount = 0;

//     for (const item of enquiries) {
//       const s = item.status || "NEW";
//       if (s === "NEW") newCount += 1;
//       else if (s === "COMPLETED") completedCount += 1;
//       else if (s !== "CANCELLED") activeCount += 1;
//     }

//     return {
//       total: enquiries.length,
//       newCount,
//       activeCount,
//       completedCount,
//     };
//   }, [enquiries]);

//   // =====================================
//   // FETCH LIST
//   // =====================================

//   const fetchEnquiries = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await getGemEnquiriesAPI("page=1&limit=10");
//       const result = response as any;

//       const list =
//         result?.data?.data ??
//         result?.data?.enquiries ??
//         result?.data?.items ??
//         result?.data ??
//         result?.enquiries ??
//         result?.items ??
//         [];

//       setEnquiries(Array.isArray(list) ? list : []);
//     } catch (error: any) {
//       console.error("Fetch enquiries error:", error?.response?.data || error);
//       setEnquiries([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [fetchEnquiries]);

//   // =====================================
//   // FILTER LIST
//   // =====================================

//   const filteredEnquiries = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();

//     return enquiries.filter((item) => {
//       const itemStatus = item.status || "NEW";
//       if (statusFilter !== "ALL" && itemStatus !== statusFilter) return false;

//       if (!term) return true;

//       return (
//         String(item.id).includes(term) ||
//         item.organizationName?.toLowerCase().includes(term) ||
//         item.departmentName?.toLowerCase().includes(term) ||
//         item.gemBuyerId?.toLowerCase().includes(term) ||
//         item.fullName?.toLowerCase().includes(term) ||
//         item.name?.toLowerCase().includes(term) ||
//         item.officialEmail?.toLowerCase().includes(term) ||
//         item.email?.toLowerCase().includes(term)
//       );
//     });
//   }, [enquiries, searchTerm, statusFilter]);

//   // =====================================
//   // OPEN DETAILS DRAWER
//   // =====================================

//   const openDetails = async (id: number) => {
//     setModalOpen(true);
//     setDetailLoading(true);
//     setSelectedEnquiry(null);

//     try {
//       const response = await getGemEnquiryByIdAPI(id);
//       const result = response as any;

//       const enquiry =
//         result?.data?.data ??
//         result?.data?.enquiry ??
//         result?.data ??
//         result?.enquiry ??
//         result;

//       if (!enquiry || !enquiry.id) {
//         throw new Error("Invalid enquiry response");
//       }

//       setSelectedEnquiry(enquiry);
//       setEditStatus(enquiry.status || "NEW");
//       setAssignedTo(enquiry.assignedTo || "");
//       setAdminNotes(enquiry.adminNotes || "");
//     } catch (error: any) {
//       console.error("Details error:", error?.response?.data || error);
//       setSelectedEnquiry(null);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // =====================================
//   // UPDATE
//   // =====================================

//   const handleUpdate = async () => {
//     if (!selectedEnquiry) return;

//     try {
//       setSaving(true);
//       await updateGemEnquiryAPI(selectedEnquiry.id, {
//         status: editStatus,
//         assignedTo,
//         adminNotes,
//       } as any);

//       await fetchEnquiries();
//       setModalOpen(false);
//       setSelectedEnquiry(null);
//     } catch (error: any) {
//       console.error("Update error:", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to update enquiry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================
//   // DELETE
//   // =====================================

//   const handleDelete = async (id: number) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this enquiry?"
//     );
//     if (!confirmed) return;

//     try {
//       await deleteGemEnquiryAPI(id);
//       setEnquiries((prev) => prev.filter((item) => item.id !== id));
//       setModalOpen(false);
//       setSelectedEnquiry(null);
//     } catch (error: any) {
//       console.error("Delete error:", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to delete enquiry");
//     }
//   };

//   // =====================================
//   // DOCUMENT
//   // =====================================

//   const handleDocumentDownload = async (
//     id: number,
//     type: "requirement" | "tender"
//   ) => {
//     try {
//       const response = await getGemEnquiryDocumentAPI(id, type);
//       const result = response as any;

//       const documentUrl =
//         result?.data?.url ??
//         result?.data?.documentUrl ??
//         result?.url ??
//         result?.documentUrl;

//       if (documentUrl) {
//         window.open(documentUrl, "_blank");
//         return;
//       }

//       alert("Document URL not found.");
//     } catch (error: any) {
//       console.error("Document error:", error?.response?.data || error);
//       alert("Unable to open document.");
//     }
//   };

//   // =====================================
//   // CLOSE DRAWER
//   // =====================================

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//     setSelectedEnquiry(null);
//   };

//   // =====================================
//   // RENDER
//   // =====================================

//   return (
//     <div className="min-h-screen bg-slate-50/80 text-slate-900">
//       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* HEADER */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               GeM Enquiries
//             </h1>
//             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
//               Track government e-Marketplace buyer enquiries, documents, and quotations.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={fetchEnquiries}
//             disabled={loading}
//             className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 sm:self-auto"
//           >
//             <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>

//         {/* METRICS ROW */}
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
//           <MetricCard label="Total Enquiries" value={stats.total} dot="slate" />
//           <MetricCard label="New" value={stats.newCount} dot="sky" />
//           <MetricCard
//             label="In Progress / Quoted"
//             value={stats.activeCount}
//             dot="amber"
//           />
//           <MetricCard
//             label="Completed"
//             value={stats.completedCount}
//             dot="emerald"
//           />
//         </div>

//         {/* TOOLBAR */}
//         <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative w-full sm:max-w-sm">
//             <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search org, buyer ID, contact, email..."
//               className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none sm:text-sm"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             aria-label="Filter by status"
//             className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 sm:text-sm"
//           >
//             <option value="ALL">All Statuses</option>
//             <option value="NEW">New</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="QUOTED">Quoted</option>
//             <option value="COMPLETED">Completed</option>
//             <option value="CANCELLED">Cancelled</option>
//           </select>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[860px] border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                   <th className="px-4 py-3">ID</th>
//                   <th className="px-4 py-3">Organization</th>
//                   <th className="px-4 py-3">Contact</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Date</th>
//                   <th className="px-4 py-3 text-right">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100 text-sm">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       <div className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-500 sm:text-sm">
//                         <FaSpinner className="h-4 w-4 animate-spin text-slate-700" />
//                         Loading enquiries...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredEnquiries.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
//                         <FaInbox className="h-8 w-8 text-slate-300" />
//                         <p className="text-sm font-medium text-slate-700">
//                           No enquiries found
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           Try adjusting your search filter or refresh the list.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredEnquiries.map((item) => {
//                     const currentStatus = item.status || "NEW";

//                     return (
//                       <tr
//                         key={item.id}
//                         className="group transition-colors hover:bg-slate-50/70"
//                       >
//                         <td className="px-4 py-3.5 align-top text-xs font-medium text-slate-500 tabular-nums">
//                           #{item.id}
//                         </td>

//                         <td className="px-4 py-3.5 align-top">
//                           <p className="text-sm font-medium text-slate-900">
//                             {item.organizationName || "—"}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {item.departmentName || "—"}
//                           </p>
//                         </td>

//                         <td className="px-4 py-3.5 align-top">
//                           <p className="text-sm font-medium text-slate-800">
//                             {item.fullName || item.name || "—"}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {item.officialEmail || item.email || "—"}
//                           </p>
//                         </td>

//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeStyle(
//                               currentStatus
//                             )}`}
//                           >
//                             {currentStatus.replaceAll("_", " ")}
//                           </span>
//                         </td>

//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
//                             <FaCalendarAlt className="h-3 w-3 text-slate-400" />
//                             {item.createdAt
//                               ? new Date(item.createdAt).toLocaleDateString(
//                                   "en-IN",
//                                   {
//                                     day: "2-digit",
//                                     month: "short",
//                                     year: "numeric",
//                                   }
//                                 )
//                               : "—"}
//                           </div>
//                         </td>

//                         <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => openDetails(item.id)}
//                             className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
//                           >
//                             <span>View</span>
//                             <FaArrowRight className="h-2.5 w-2.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER */}
//           <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500">
//             <p className="tabular-nums">
//               Showing{" "}
//               <span className="font-medium text-slate-700">
//                 {filteredEnquiries.length}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-slate-700">{stats.total}</span>{" "}
//               enquiries
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT-SIDE DETAILS DRAWER */}
//       <GemEnquiryDetailsModal
//         open={modalOpen}
//         enquiry={selectedEnquiry}
//         loading={detailLoading}
//         status={editStatus}
//         setStatus={setEditStatus}
//         assignedTo={assignedTo}
//         setAssignedTo={setAssignedTo}
//         adminNotes={adminNotes}
//         setAdminNotes={setAdminNotes}
//         saving={saving}
//         onClose={closeModal}
//         onSave={handleUpdate}
//         onDelete={handleDelete}
//         onDocumentDownload={handleDocumentDownload}
//       />
//     </div>
//   );
// };

// function MetricCard({
//   label,
//   value,
//   dot,
// }: {
//   label: string;
//   value: number;
//   dot: "slate" | "sky" | "amber" | "emerald";
// }) {
//   const dotMap = {
//     slate: "bg-slate-400",
//     sky: "bg-sky-500",
//     amber: "bg-amber-500",
//     emerald: "bg-emerald-500",
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs">
//       <div className="flex items-center gap-2">
//         <span className={`h-2 w-2 rounded-full ${dotMap[dot]}`} />
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//       </div>
//       <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
//         {value}
//       </p>
//     </div>
//   );
// }

// export default GemEnquiryManagement;


// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FaSearch,
//   FaSyncAlt,
//   FaArrowRight,
//   FaCalendarAlt,
//   FaInbox,
//   FaSpinner,
//   FaFileExcel,
//   FaTimes,
// } from "react-icons/fa";

// import GemEnquiryDetailsModal, {
//   GemEnquiry,
// } from "@/components/gem/GemEnquiryDetailsModal";
// import {
//   getGemEnquiryDocumentAPI,
//   getGemEnquiriesAPI,
//   getGemEnquiryByIdAPI,
//   updateGemEnquiryAPI,
//   deleteGemEnquiryAPI,
// } from "@/services/GemEnquiryAdminAPI";

// const GEM_STATUS_OPTIONS = [
//   { value: "NEW", label: "New" },
//   { value: "CONTACTED", label: "Contacted" },
//   { value: "QUALIFIED", label: "Qualified" },
//   { value: "QUOTATION_SENT", label: "Quotation Sent" },
//   { value: "FOLLOW_UP", label: "Follow Up" },
//   { value: "CONVERTED", label: "Converted" },
//   { value: "REJECTED", label: "Rejected" },
// ] as const;

// const getStatusBadgeStyle = (status?: string) => {
//   switch (status) {
//     case "CONVERTED":
//       return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
//     case "QUOTATION_SENT":
//     case "QUALIFIED":
//       return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20";
//     case "CONTACTED":
//     case "FOLLOW_UP":
//       return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
//     case "REJECTED":
//       return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";
//     case "NEW":
//     default:
//       return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";
//   }
// };

// const escapeXml = (value: unknown) =>
//   String(value ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&apos;");

// const formatDateInput = (date?: string | Date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   if (Number.isNaN(d.getTime())) return "";
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// const GemEnquiryManagement = () => {
//   const [enquiries, setEnquiries] = useState<GemEnquiry[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [selectedEnquiry, setSelectedEnquiry] = useState<GemEnquiry | null>(
//     null
//   );

//   const [editStatus, setEditStatus] = useState("NEW");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [adminNotes, setAdminNotes] = useState("");

//   const [saving, setSaving] = useState(false);

//   // =====================================
//   // STATS
//   // =====================================

//   const stats = useMemo(() => {
//     let newCount = 0;
//     let activeCount = 0;
//     let convertedCount = 0;

//     for (const item of enquiries) {
//       const s = item.status || "NEW";
//       if (s === "NEW") newCount += 1;
//       else if (s === "CONVERTED") convertedCount += 1;
//       else if (s !== "REJECTED") activeCount += 1;
//     }

//     return {
//       total: enquiries.length,
//       newCount,
//       activeCount,
//       convertedCount,
//     };
//   }, [enquiries]);

//   // =====================================
//   // FETCH LIST
//   // =====================================

//   const fetchEnquiries = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await getGemEnquiriesAPI("page=1&limit=10");
//       const result = response as any;

//       const list =
//         result?.data?.data ??
//         result?.data?.enquiries ??
//         result?.data?.items ??
//         result?.data ??
//         result?.enquiries ??
//         result?.items ??
//         [];

//       setEnquiries(Array.isArray(list) ? list : []);
//     } catch (error: any) {
//       console.error("Fetch enquiries error:", error?.response?.data || error);
//       setEnquiries([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [fetchEnquiries]);

//   // =====================================
//   // FILTER LIST (SEARCH + STATUS + DATE)
//   // =====================================

//   const filteredEnquiries = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();

//     return enquiries.filter((item) => {
//       const itemStatus = item.status || "NEW";
//       if (statusFilter !== "ALL" && itemStatus !== statusFilter) return false;

//       if (fromDate || toDate) {
//         const itemDateStr = formatDateInput(item.createdAt);
//         if (!itemDateStr) return false;
//         if (fromDate && itemDateStr < fromDate) return false;
//         if (toDate && itemDateStr > toDate) return false;
//       }

//       if (!term) return true;

//       return (
//         String(item.id).includes(term) ||
//         item.organizationName?.toLowerCase().includes(term) ||
//         item.departmentName?.toLowerCase().includes(term) ||
//         item.gemBuyerId?.toLowerCase().includes(term) ||
//         item.fullName?.toLowerCase().includes(term) ||
//         item.name?.toLowerCase().includes(term) ||
//         item.officialEmail?.toLowerCase().includes(term) ||
//         item.email?.toLowerCase().includes(term)
//       );
//     });
//   }, [enquiries, searchTerm, statusFilter, fromDate, toDate]);

//   const hasActiveFilters =
//     Boolean(searchTerm.trim()) ||
//     statusFilter !== "ALL" ||
//     Boolean(fromDate) ||
//     Boolean(toDate);

//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("ALL");
//     setFromDate("");
//     setToDate("");
//   };

//   // =====================================
//   // EXPORT TO EXCEL (.xls SpreadsheetML)
//   // =====================================

//   const handleExportExcel = () => {
//     if (filteredEnquiries.length === 0) {
//       alert("No enquiries available to export for the selected filters.");
//       return;
//     }

//     const headers = [
//       "ID",
//       "Organization Name",
//       "Department",
//       "Organization Type",
//       "GeM Buyer ID",
//       "Contact Name",
//       "Designation",
//       "Official Email",
//       "Mobile Number",
//       "Status",
//       "Assigned To",
//       "Admin Notes",
//       "Created Date",
//     ];

//     const rows = filteredEnquiries.map((item) => [
//       item.id,
//       item.organizationName || "",
//       item.departmentName || "",
//       item.organizationType || "",
//       item.gemBuyerId || "",
//       item.fullName || item.name || "",
//       item.designation || "",
//       item.officialEmail || item.email || "",
//       item.mobileNumber || item.phone || "",
//       (item.status || "NEW").replaceAll("_", " "),
//       item.assignedTo ?? "",
//       item.adminNotes || "",
//       item.createdAt
//         ? new Date(item.createdAt).toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })
//         : "",
//     ]);

//     const headerCells = headers
//       .map(
//         (h) =>
//           `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(
//             h
//           )}</Data></Cell>`
//       )
//       .join("");

//     const bodyRows = rows
//       .map((row) => {
//         const cells = row
//           .map((val) => {
//             const isNum = typeof val === "number" && Number.isFinite(val);
//             const type = isNum ? "Number" : "String";
//             return `<Cell><Data ss:Type="${type}">${escapeXml(
//               val
//             )}</Data></Cell>`;
//           })
//           .join("");
//         return `<Row>${cells}</Row>`;
//       })
//       .join("");

//     const workbookXml = `<?xml version="1.0"?>
// <?mso-application progid="Excel.Sheet"?>
// <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
//   xmlns:o="urn:schemas-microsoft-com:office:office"
//   xmlns:x="urn:schemas-microsoft-com:office:excel"
//   xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
//   <Styles>
//     <Style ss:ID="Header">
//       <Font ss:Bold="1" ss:Color="#0F172A"/>
//       <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
//     </Style>
//   </Styles>
//   <Worksheet ss:Name="GeM Enquiries">
//     <Table>
//       <Row>${headerCells}</Row>
//       ${bodyRows}
//     </Table>
//   </Worksheet>
// </Workbook>`;

//     const blob = new Blob([workbookXml], {
//       type: "application/vnd.ms-excel;charset=utf-8;",
//     });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     const dateSuffix =
//       fromDate || toDate
//         ? `${fromDate || "start"}_to_${toDate || "end"}`
//         : new Date().toISOString().slice(0, 10);
//     const statusSuffix = statusFilter !== "ALL" ? `_${statusFilter}` : "";

//     link.href = url;
//     link.download = `gem-enquiries${statusSuffix}_${dateSuffix}.xls`;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     URL.revokeObjectURL(url);
//   };

//   // =====================================
//   // OPEN DETAILS DRAWER
//   // =====================================

//   const openDetails = async (id: number) => {
//     setModalOpen(true);
//     setDetailLoading(true);
//     setSelectedEnquiry(null);

//     try {
//       const response = await getGemEnquiryByIdAPI(id);
//       const result = response as any;

//       const enquiry =
//         result?.data?.data ??
//         result?.data?.enquiry ??
//         result?.data ??
//         result?.enquiry ??
//         result;

//       if (!enquiry || !enquiry.id) {
//         throw new Error("Invalid enquiry response");
//       }

//       setSelectedEnquiry(enquiry);
//       setEditStatus(enquiry.status || "NEW");
//       setAssignedTo(
//         enquiry.assignedTo !== null && enquiry.assignedTo !== undefined
//           ? String(enquiry.assignedTo)
//           : ""
//       );
//       setAdminNotes(enquiry.adminNotes || "");
//     } catch (error: any) {
//       console.error("Details error:", error?.response?.data || error);
//       setSelectedEnquiry(null);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   // =====================================
//   // UPDATE
//   // =====================================

//   const handleUpdate = async () => {
//     if (!selectedEnquiry) return;

//     try {
//       setSaving(true);
//       await updateGemEnquiryAPI(selectedEnquiry.id, {
//         status: editStatus,
//         assignedTo: assignedTo.trim() ? Number(assignedTo) : null,
//         adminNotes: adminNotes.trim() || null,
//       } as any);

//       await fetchEnquiries();
//       setModalOpen(false);
//       setSelectedEnquiry(null);
//     } catch (error: any) {
//       console.error("Update error:", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to update enquiry");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // =====================================
//   // DELETE
//   // =====================================

//   const handleDelete = async (id: number) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this enquiry?"
//     );
//     if (!confirmed) return;

//     try {
//       await deleteGemEnquiryAPI(id);
//       setEnquiries((prev) => prev.filter((item) => item.id !== id));
//       setModalOpen(false);
//       setSelectedEnquiry(null);
//     } catch (error: any) {
//       console.error("Delete error:", error?.response?.data || error);
//       alert(error?.response?.data?.message || "Failed to delete enquiry");
//     }
//   };

//   // =====================================
//   // DOCUMENT
//   // =====================================

//   const handleDocumentDownload = async (
//     id: number,
//     type: "requirement" | "tender"
//   ) => {
//     try {
//       const response = await getGemEnquiryDocumentAPI(id, type);
//       const result = response as any;

//       const documentUrl =
//         result?.data?.url ??
//         result?.data?.documentUrl ??
//         result?.url ??
//         result?.documentUrl;

//       if (documentUrl) {
//         window.open(documentUrl, "_blank");
//         return;
//       }

//       alert("Document URL not found.");
//     } catch (error: any) {
//       console.error("Document error:", error?.response?.data || error);
//       alert("Unable to open document.");
//     }
//   };

//   // =====================================
//   // CLOSE DRAWER
//   // =====================================

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//     setSelectedEnquiry(null);
//   };

//   // =====================================
//   // RENDER
//   // =====================================

//   return (
//     <div className="min-h-screen bg-slate-50/80 text-slate-900">
//       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* HEADER */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               GeM Enquiries
//             </h1>
//             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
//               Track government e-Marketplace buyer enquiries, filter by status or
//               date, and export reports.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <button
//               type="button"
//               onClick={fetchEnquiries}
//               disabled={loading}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
//             >
//               <FaSyncAlt className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
//               Refresh
//             </button>

//             <button
//               type="button"
//               onClick={handleExportExcel}
//               disabled={loading || filteredEnquiries.length === 0}
//               className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <FaFileExcel className="h-3.5 w-3.5" />
//               Export Excel ({filteredEnquiries.length})
//             </button>
//           </div>
//         </div>

//         {/* METRICS ROW */}
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
//           <MetricCard label="Total Enquiries" value={stats.total} dot="slate" />
//           <MetricCard label="New" value={stats.newCount} dot="sky" />
//           <MetricCard
//             label="Active Pipeline"
//             value={stats.activeCount}
//             dot="amber"
//           />
//           <MetricCard
//             label="Converted"
//             value={stats.convertedCount}
//             dot="emerald"
//           />
//         </div>

//         {/* TOOLBAR: SEARCH + STATUS + DATE RANGE */}
//         <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
//           <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//             <div className="relative w-full lg:max-w-sm">
//               <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search org, buyer ID, contact, email..."
//                 className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none sm:text-sm"
//               />
//             </div>

//             <div className="flex flex-wrap items-center gap-2.5">
//               {/* STATUS FILTER */}
//               <div className="flex items-center gap-1.5">
//                 <label
//                   htmlFor="gem-status-filter"
//                   className="text-xs font-medium text-slate-500"
//                 >
//                   Status:
//                 </label>
//                 <select
//                   id="gem-status-filter"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 sm:text-sm"
//                 >
//                   <option value="ALL">All Statuses</option>
//                   {GEM_STATUS_OPTIONS.map((opt) => (
//                     <option key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DATE RANGE FILTER */}
//               <div className="flex flex-wrap items-center gap-2">
//                 <div className="flex items-center gap-1.5">
//                   <label
//                     htmlFor="gem-from-date"
//                     className="text-xs font-medium text-slate-500"
//                   >
//                     From:
//                   </label>
//                   <input
//                     id="gem-from-date"
//                     type="date"
//                     value={fromDate}
//                     max={toDate || undefined}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 sm:text-sm"
//                   />
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   <label
//                     htmlFor="gem-to-date"
//                     className="text-xs font-medium text-slate-500"
//                   >
//                     To:
//                   </label>
//                   <input
//                     id="gem-to-date"
//                     type="date"
//                     value={toDate}
//                     min={fromDate || undefined}
//                     onChange={(e) => setToDate(e.target.value)}
//                     className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               {hasActiveFilters && (
//                 <button
//                   type="button"
//                   onClick={clearAllFilters}
//                   className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
//                 >
//                   <FaTimes className="h-3 w-3" />
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[860px] border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                   <th className="px-4 py-3">ID</th>
//                   <th className="px-4 py-3">Organization</th>
//                   <th className="px-4 py-3">Contact</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Date</th>
//                   <th className="px-4 py-3 text-right">Action</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100 text-sm">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       <div className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-500 sm:text-sm">
//                         <FaSpinner className="h-4 w-4 animate-spin text-slate-700" />
//                         Loading enquiries...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredEnquiries.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
//                         <FaInbox className="h-8 w-8 text-slate-300" />
//                         <p className="text-sm font-medium text-slate-700">
//                           No enquiries found
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           Try adjusting your search, status, or date filters.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredEnquiries.map((item) => {
//                     const currentStatus = item.status || "NEW";

//                     return (
//                       <tr
//                         key={item.id}
//                         className="group transition-colors hover:bg-slate-50/70"
//                       >
//                         <td className="px-4 py-3.5 align-top text-xs font-medium text-slate-500 tabular-nums">
//                           #{item.id}
//                         </td>

//                         <td className="px-4 py-3.5 align-top">
//                           <p className="text-sm font-medium text-slate-900">
//                             {item.organizationName || "—"}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {item.departmentName || "—"}
//                           </p>
//                         </td>

//                         <td className="px-4 py-3.5 align-top">
//                           <p className="text-sm font-medium text-slate-800">
//                             {item.fullName || item.name || "—"}
//                           </p>
//                           <p className="mt-0.5 text-xs text-slate-500">
//                             {item.officialEmail || item.email || "—"}
//                           </p>
//                         </td>

//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeStyle(
//                               currentStatus
//                             )}`}
//                           >
//                             {currentStatus.replaceAll("_", " ")}
//                           </span>
//                         </td>

//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
//                             <FaCalendarAlt className="h-3 w-3 text-slate-400" />
//                             {item.createdAt
//                               ? new Date(item.createdAt).toLocaleDateString(
//                                   "en-IN",
//                                   {
//                                     day: "2-digit",
//                                     month: "short",
//                                     year: "numeric",
//                                   }
//                                 )
//                               : "—"}
//                           </div>
//                         </td>

//                         <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => openDetails(item.id)}
//                             className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
//                           >
//                             <span>View</span>
//                             <FaArrowRight className="h-2.5 w-2.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* FOOTER */}
//           <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500">
//             <p className="tabular-nums">
//               Showing{" "}
//               <span className="font-medium text-slate-700">
//                 {filteredEnquiries.length}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-slate-700">{stats.total}</span>{" "}
//               enquiries
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT-SIDE DETAILS DRAWER */}
//       <GemEnquiryDetailsModal
//         open={modalOpen}
//         enquiry={selectedEnquiry}
//         loading={detailLoading}
//         status={editStatus}
//         setStatus={setEditStatus}
//         assignedTo={assignedTo}
//         setAssignedTo={setAssignedTo}
//         adminNotes={adminNotes}
//         setAdminNotes={setAdminNotes}
//         saving={saving}
//         onClose={closeModal}
//         onSave={handleUpdate}
//         onDelete={handleDelete}
//         onDocumentDownload={handleDocumentDownload}
//       />
//     </div>
//   );
// };

// function MetricCard({
//   label,
//   value,
//   dot,
// }: {
//   label: string;
//   value: number;
//   dot: "slate" | "sky" | "amber" | "emerald";
// }) {
//   const dotMap = {
//     slate: "bg-slate-400",
//     sky: "bg-sky-500",
//     amber: "bg-amber-500",
//     emerald: "bg-emerald-500",
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs">
//       <div className="flex items-center gap-2">
//         <span className={`h-2 w-2 rounded-full ${dotMap[dot]}`} />
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//       </div>
//       <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
//         {value}
//       </p>
//     </div>
//   );
// }

// export default GemEnquiryManagement;



"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaArrowRight,
  FaCalendarAlt,
  FaInbox,
  FaSpinner,
  FaFileExcel,
  FaTimes,
} from "react-icons/fa";

import GemEnquiryDetailsModal, {
  GemEnquiry,
} from "@/components/gem/GemEnquiryDetailsModal";
import {
  getGemEnquiryDocumentAPI,
  getGemEnquiriesAPI,
  getGemEnquiryByIdAPI,
  updateGemEnquiryAPI,
  deleteGemEnquiryAPI,
} from "@/services/GemEnquiryAdminAPI";

const GEM_STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "QUOTATION_SENT", label: "Quotation Sent" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "REJECTED", label: "Rejected" },
] as const;

const getStatusBadgeStyle = (status?: string) => {
  switch (status) {
    case "CONVERTED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30";
    case "QUOTATION_SENT":
    case "QUALIFIED":
      return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-500/30";
    case "CONTACTED":
    case "FOLLOW_UP":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/30";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/30";
    case "NEW":
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/40";
  }
};

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDateInput = (date?: string | Date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const GemEnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState<GemEnquiry[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<GemEnquiry | null>(
    null
  );

  const [editStatus, setEditStatus] = useState("NEW");
  const [assignedTo, setAssignedTo] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const [saving, setSaving] = useState(false);

  // =====================================
  // STATS
  // =====================================

  const stats = useMemo(() => {
    let newCount = 0;
    let activeCount = 0;
    let convertedCount = 0;

    for (const item of enquiries) {
      const s = item.status || "NEW";
      if (s === "NEW") newCount += 1;
      else if (s === "CONVERTED") convertedCount += 1;
      else if (s !== "REJECTED") activeCount += 1;
    }

    return {
      total: enquiries.length,
      newCount,
      activeCount,
      convertedCount,
    };
  }, [enquiries]);

  // =====================================
  // FETCH LIST
  // =====================================

  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getGemEnquiriesAPI("page=1&limit=10");
      const result = response as any;

      const list =
        result?.data?.data ??
        result?.data?.enquiries ??
        result?.data?.items ??
        result?.data ??
        result?.enquiries ??
        result?.items ??
        [];

      setEnquiries(Array.isArray(list) ? list : []);
    } catch (error: any) {
      console.error("Fetch enquiries error:", error?.response?.data || error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // =====================================
  // FILTER LIST (SEARCH + STATUS + DATE)
  // =====================================

  const filteredEnquiries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return enquiries.filter((item) => {
      const itemStatus = item.status || "NEW";
      if (statusFilter !== "ALL" && itemStatus !== statusFilter) return false;

      if (fromDate || toDate) {
        const itemDateStr = formatDateInput(item.createdAt);
        if (!itemDateStr) return false;
        if (fromDate && itemDateStr < fromDate) return false;
        if (toDate && itemDateStr > toDate) return false;
      }

      if (!term) return true;

      return (
        String(item.id).includes(term) ||
        item.organizationName?.toLowerCase().includes(term) ||
        item.departmentName?.toLowerCase().includes(term) ||
        item.gemBuyerId?.toLowerCase().includes(term) ||
        item.fullName?.toLowerCase().includes(term) ||
        item.name?.toLowerCase().includes(term) ||
        item.officialEmail?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });
  }, [enquiries, searchTerm, statusFilter, fromDate, toDate]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !== "ALL" ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  // =====================================
  // EXPORT TO EXCEL (.xls SpreadsheetML)
  // =====================================

  const handleExportExcel = () => {
    if (filteredEnquiries.length === 0) {
      alert("No enquiries available to export for the selected filters.");
      return;
    }

    const headers = [
      "ID",
      "Organization Name",
      "Department",
      "Organization Type",
      "GeM Buyer ID",
      "Contact Name",
      "Designation",
      "Official Email",
      "Mobile Number",
      "Status",
      "Assigned To",
      "Admin Notes",
      "Created Date",
    ];

    const rows = filteredEnquiries.map((item) => [
      item.id,
      item.organizationName || "",
      item.departmentName || "",
      item.organizationType || "",
      item.gemBuyerId || "",
      item.fullName || item.name || "",
      item.designation || "",
      item.officialEmail || item.email || "",
      item.mobileNumber || item.phone || "",
      (item.status || "NEW").replaceAll("_", " "),
      item.assignedTo ?? "",
      item.adminNotes || "",
      item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
    ]);

    const headerCells = headers
      .map(
        (h) =>
          `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(
            h
          )}</Data></Cell>`
      )
      .join("");

    const bodyRows = rows
      .map((row) => {
        const cells = row
          .map((val) => {
            const isNum = typeof val === "number" && Number.isFinite(val);
            const type = isNum ? "Number" : "String";
            return `<Cell><Data ss:Type="${type}">${escapeXml(
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
  <Worksheet ss:Name="GeM Enquiries">
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

    const dateSuffix =
      fromDate || toDate
        ? `${fromDate || "start"}_to_${toDate || "end"}`
        : new Date().toISOString().slice(0, 10);
    const statusSuffix = statusFilter !== "ALL" ? `_${statusFilter}` : "";

    link.href = url;
    link.download = `gem-enquiries${statusSuffix}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // =====================================
  // OPEN DETAILS DRAWER
  // =====================================

  const openDetails = async (id: number) => {
    setModalOpen(true);
    setDetailLoading(true);
    setSelectedEnquiry(null);

    try {
      const response = await getGemEnquiryByIdAPI(id);
      const result = response as any;

      const enquiry =
        result?.data?.data ??
        result?.data?.enquiry ??
        result?.data ??
        result?.enquiry ??
        result;

      if (!enquiry || !enquiry.id) {
        throw new Error("Invalid enquiry response");
      }

      setSelectedEnquiry(enquiry);
      setEditStatus(enquiry.status || "NEW");
      setAssignedTo(
        enquiry.assignedTo !== null && enquiry.assignedTo !== undefined
          ? String(enquiry.assignedTo)
          : ""
      );
      setAdminNotes(enquiry.adminNotes || "");
    } catch (error: any) {
      console.error("Details error:", error?.response?.data || error);
      setSelectedEnquiry(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // =====================================
  // UPDATE
  // =====================================

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;

    try {
      setSaving(true);
      await updateGemEnquiryAPI(selectedEnquiry.id, {
        status: editStatus,
        assignedTo: assignedTo.trim() ? Number(assignedTo) : null,
        adminNotes: adminNotes.trim() || null,
      } as any);

      await fetchEnquiries();
      setModalOpen(false);
      setSelectedEnquiry(null);
    } catch (error: any) {
      console.error("Update error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Failed to update enquiry");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmed) return;

    try {
      await deleteGemEnquiryAPI(id);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      setModalOpen(false);
      setSelectedEnquiry(null);
    } catch (error: any) {
      console.error("Delete error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Failed to delete enquiry");
    }
  };

  // =====================================
  // DOCUMENT
  // =====================================

  const handleDocumentDownload = async (
    id: number,
    type: "requirement" | "tender"
  ) => {
    try {
      const response = await getGemEnquiryDocumentAPI(id, type);
      const result = response as any;

      const documentUrl =
        result?.data?.url ??
        result?.data?.documentUrl ??
        result?.url ??
        result?.documentUrl;

      if (documentUrl) {
        window.open(documentUrl, "_blank");
        return;
      }

      alert("Document URL not found.");
    } catch (error: any) {
      console.error("Document error:", error?.response?.data || error);
      alert("Unable to open document.");
    }
  };

  // =====================================
  // CLOSE DRAWER
  // =====================================

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setSelectedEnquiry(null);
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Operations / GeM Desk
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              GeM Enquiries
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Track government e-Marketplace buyer enquiries, filter by status or
              date, and export reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchEnquiries}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FaSyncAlt
                className={`h-3 w-3 text-slate-400 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredEnquiries.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <FaFileExcel className="h-3.5 w-3.5" />
              Export Excel ({filteredEnquiries.length})
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <MetricCard label="Total Enquiries" value={stats.total} dot="slate" />
          <MetricCard label="New" value={stats.newCount} dot="sky" />
          <MetricCard
            label="Active Pipeline"
            value={stats.activeCount}
            dot="amber"
          />
          <MetricCard
            label="Converted"
            value={stats.convertedCount}
            dot="emerald"
          />
        </div>

        {/* TOOLBAR: SEARCH + STATUS + DATE RANGE */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search org, buyer ID, contact, email..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* STATUS FILTER */}
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="gem-status-filter"
                  className="text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  Status:
                </label>
                <select
                  id="gem-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                >
                  <option value="ALL">All Statuses</option>
                  {GEM_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE RANGE FILTER */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="gem-from-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    From:
                  </label>
                  <input
                    id="gem-from-date"
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="gem-to-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    To:
                  </label>
                  <input
                    id="gem-to-date"
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => setToDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <FaTimes className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Organization</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                        <FaSpinner className="h-4 w-4 animate-spin text-slate-700 dark:text-brand-500" />
                        Loading enquiries...
                      </div>
                    </td>
                  </tr>
                ) : filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
                        <FaInbox className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          No enquiries found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Try adjusting your search, status, or date filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((item) => {
                    const currentStatus = item.status || "NEW";

                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        <td className="px-4 py-3.5 align-top font-mono text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                          #{item.id}
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {item.organizationName || "—"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {item.departmentName || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {item.fullName || item.name || "—"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {item.officialEmail || item.email || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeStyle(
                              currentStatus
                            )}`}
                          >
                            {currentStatus.replaceAll("_", " ")}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                            <FaCalendarAlt className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openDetails(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700/70"
                          >
                            <span>View</span>
                            <FaArrowRight className="h-2.5 w-2.5 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-300" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
            <p className="tabular-nums">
              Showing{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {filteredEnquiries.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {stats.total}
              </span>{" "}
              enquiries
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE DETAILS DRAWER */}
      <GemEnquiryDetailsModal
        open={modalOpen}
        enquiry={selectedEnquiry}
        loading={detailLoading}
        status={editStatus}
        setStatus={setEditStatus}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        saving={saving}
        onClose={closeModal}
        onSave={handleUpdate}
        onDelete={handleDelete}
        onDocumentDownload={handleDocumentDownload}
      />
    </div>
  );
};

function MetricCard({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: "slate" | "sky" | "amber" | "emerald";
}) {
  const dotMap = {
    slate: "bg-slate-400",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
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

export default GemEnquiryManagement;