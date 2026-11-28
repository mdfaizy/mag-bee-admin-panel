// "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   FaEnvelope,
//   FaPhone,
//   FaCheckCircle,
//   FaClock,
//   FaSearch,
//   FaDownload,
//   FaArrowRight,
//   FaCalendarAlt,
//   FaSpinner,
//   FaInbox,
//   FaCheckDouble,
//   FaSyncAlt,
// } from "react-icons/fa";

// import {
//   getAllContactsAPI,
//   updateContactStatusAPI,
// } from "@/services/contactService";

// import ResolveContactModal, {
//   ContactType,
// } from "@/components/contact/ResolveContactModal";

// type StatusFilter = "all" | "pending" | "resolved";

// const ContactManagement = () => {
//   const [contacts, setContacts] = useState<ContactType[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const [selectedContact, setSelectedContact] = useState<ContactType | null>(
//     null
//   );
//   const [resolveMessage, setResolveMessage] = useState<string>("");
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [resolving, setResolving] = useState<boolean>(false);

//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [bulkLoading, setBulkLoading] = useState<boolean>(false);

//   // =========================
//   // STATS
//   // =========================

//   const stats = useMemo(() => {
//     const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
//     let pending = 0;
//     let resolved = 0;
//     let recentPending = 0;

//     for (const c of contacts) {
//       if (c.isResolved) {
//         resolved += 1;
//       } else {
//         pending += 1;
//         if (new Date(c.createdAt).getTime() > twoDaysAgo) {
//           recentPending += 1;
//         }
//       }
//     }

//     return {
//       total: contacts.length,
//       pending,
//       resolved,
//       recentPending,
//     };
//   }, [contacts]);

//   // =========================
//   // FETCH CONTACTS
//   // =========================

//   const fetchContacts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await getAllContactsAPI();
//       setContacts(Array.isArray(response?.data) ? response.data : []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch contacts");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchContacts();
//   }, [fetchContacts]);

//   // =========================
//   // FILTER CONTACTS
//   // =========================

//   const filteredContacts = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();

//     return contacts.filter((contact) => {
//       if (statusFilter === "resolved" && !contact.isResolved) return false;
//       if (statusFilter === "pending" && contact.isResolved) return false;

//       if (!term) return true;

//       return (
//         contact.name?.toLowerCase().includes(term) ||
//         contact.email?.toLowerCase().includes(term) ||
//         contact.subject?.toLowerCase().includes(term) ||
//         contact.message?.toLowerCase().includes(term) ||
//         contact.phone?.toLowerCase().includes(term)
//       );
//     });
//   }, [contacts, searchTerm, statusFilter]);

//   // =========================
//   // DRAWER HANDLERS
//   // =========================

//   const openResolveDrawer = (contact: ContactType) => {
//     setSelectedContact(contact);
//     setResolveMessage(contact.resolutionMessage || "");
//     setModalOpen(true);
//   };

//   const closeDrawer = () => {
//     if (resolving) return;
//     setModalOpen(false);
//     setSelectedContact(null);
//     setResolveMessage("");
//   };

//   // =========================
//   // RESOLVE SINGLE CONTACT
//   // =========================

// // =========================
//   // RESOLVE SINGLE CONTACT
//   // =========================

//  // =========================
//   // RESOLVE SINGLE CONTACT
//   // =========================

//   const handleResolve = async () => {
//     if (!selectedContact) return;

//     if (!resolveMessage.trim()) {
//       toast.error("Resolution message is required");
//       return;
//     }

//     try {
//       setResolving(true);

//       const response = await updateContactStatusAPI(selectedContact.id, {
//         status: "RESOLVED",
//         resolutionMessage: resolveMessage.trim(),
//       });

//       toast.success(response?.message || "Contact marked as resolved");

//       setModalOpen(false);
//       setSelectedContact(null);
//       setResolveMessage("");

//       await fetchContacts();
//     } catch (error: any) {
//       console.error("Resolve error:", error?.response?.data || error);
//       toast.error(
//         error?.response?.data?.message || "Failed to resolve contact"
//       );
//     } finally {
//       setResolving(false);
//     }
//   };

//   // =========================
//   // BULK RESOLVE
//   // =========================

//   const handleBulkResolve = async () => {
//     if (selectedIds.length === 0) {
//       toast.error("Select at least one contact");
//       return;
//     }

//     try {
//       setBulkLoading(true);
//       const results = await Promise.allSettled(
//         selectedIds.map((id) =>
//           updateContactStatusAPI(id, {
//             status: "RESOLVED",
//             resolutionMessage: "Bulk resolved by admin",
//           })
//         )
//       );

//       const succeeded = results.filter((r) => r.status === "fulfilled").length;
//       const failed = results.length - succeeded;

//       if (succeeded > 0) {
//         toast.success(`${succeeded} contact(s) resolved`);
//       }
//       if (failed > 0) {
//         toast.warning(`${failed} contact(s) could not be updated`);
//       }

//       setSelectedIds([]);
//       await fetchContacts();
//     } catch (error) {
//       console.error(error);
//       toast.error("Bulk resolution failed");
//     } finally {
//       setBulkLoading(false);
//     }
//   };

//   // =========================
//   // BULK RESOLVE
//   // =========================
//   // =========================
//   // SELECTION
//   // =========================

//   const allVisibleSelected =
//     filteredContacts.length > 0 &&
//     filteredContacts.every((c) => selectedIds.includes(c.id));

//   const toggleSelectAllVisible = () => {
//     if (allVisibleSelected) {
//       const visibleSet = new Set(filteredContacts.map((c) => c.id));
//       setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
//     } else {
//       setSelectedIds((prev) => [
//         ...new Set([...prev, ...filteredContacts.map((c) => c.id)]),
//       ]);
//     }
//   };

//   const toggleSelection = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   // =========================
//   // CSV EXPORT
//   // =========================

//   const exportToCSV = () => {
//     if (filteredContacts.length === 0) {
//       toast.info("No contacts to export");
//       return;
//     }

//     const headers = [
//       "ID",
//       "Name",
//       "Email",
//       "Phone",
//       "Subject",
//       "Message",
//       "Status",
//       "Resolution",
//       "Created At",
//     ];

//     const escapeCSV = (value: unknown) => {
//       const text = String(value ?? "");
//       return `"${text.replace(/"/g, '""')}"`;
//     };

//     const rows = filteredContacts.map((c) => [
//       c.id,
//       c.name,
//       c.email,
//       c.phone,
//       c.subject,
//       c.message,
//       c.isResolved ? "Resolved" : "Pending",
//       c.resolutionMessage || "",
//       new Date(c.createdAt).toLocaleDateString("en-IN"),
//     ]);

//     const csv = [headers, ...rows]
//       .map((row) => row.map(escapeCSV).join(","))
//       .join("\n");

//     const blob = new Blob(["\uFEFF" + csv], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     URL.revokeObjectURL(url);

//     toast.success("CSV exported");
//   };

//   // =========================
//   // RENDER
//   // =========================

//   return (
//     <div className="min-h-screen bg-slate-50/80 text-slate-900">
//       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* TOP HEADER */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               Contact Inquiries
//             </h1>
//             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
//               Review incoming messages, reply with resolutions, and track ticket status.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={fetchContacts}
//               disabled={loading}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
//             >
//               <FaSyncAlt
//                 className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
//               />
//               Refresh
//             </button>

//             <button
//               type="button"
//               onClick={exportToCSV}
//               className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800"
//             >
//               <FaDownload className="h-3 w-3" />
//               Export CSV
//             </button>
//           </div>
//         </div>

//         {/* METRICS ROW */}
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
//           <MetricCard
//             label="Total Inquiries"
//             value={stats.total}
//             accent="slate"
//           />
//           <MetricCard
//             label="Pending Action"
//             value={stats.pending}
//             accent="amber"
//           />
//           <MetricCard
//             label="Resolved"
//             value={stats.resolved}
//             accent="emerald"
//           />
//           <MetricCard
//             label="New Pending (48h)"
//             value={stats.recentPending}
//             accent="rose"
//           />
//         </div>

//         {/* TOOLBAR: SEARCH + SEGMENTED FILTER + BULK ACTION */}
//         <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
//           <div className="relative w-full lg:max-w-sm">
//             <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search name, email, phone, subject..."
//               className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none sm:text-sm"
//             />
//           </div>

//           <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
//             {/* SEGMENTED STATUS TABS */}
//             <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5">
//               {(
//                 [
//                   { key: "all", label: "All" },
//                   { key: "pending", label: "Pending" },
//                   { key: "resolved", label: "Resolved" },
//                 ] as const
//               ).map((tab) => {
//                 const active = statusFilter === tab.key;
//                 return (
//                   <button
//                     key={tab.key}
//                     type="button"
//                     onClick={() => setStatusFilter(tab.key)}
//                     className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
//                       active
//                         ? "bg-white text-slate-900 shadow-2xs"
//                         : "text-slate-600 hover:text-slate-900"
//                     }`}
//                   >
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* BULK RESOLVE BUTTON */}
//             {selectedIds.length > 0 && (
//               <button
//                 type="button"
//                 onClick={handleBulkResolve}
//                 disabled={bulkLoading}
//                 className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
//               >
//                 <FaCheckDouble className="h-3 w-3" />
//                 {bulkLoading
//                   ? "Resolving..."
//                   : `Resolve (${selectedIds.length})`}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* DATA TABLE */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[920px] border-collapse text-left">
//               <thead>
//                 <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                   <th className="w-11 px-4 py-3">
//                     <input
//                       type="checkbox"
//                       checked={allVisibleSelected}
//                       onChange={toggleSelectAllVisible}
//                       aria-label="Select all visible contacts"
//                       className="h-3.5 w-3.5 rounded border-slate-300 accent-slate-900"
//                     />
//                   </th>
//                   <th className="px-4 py-3">Sender</th>
//                   <th className="px-4 py-3">Subject & Message</th>
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
//                         Loading inquiries...
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredContacts.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
//                         <FaInbox className="h-8 w-8 text-slate-300" />
//                         <p className="text-sm font-medium text-slate-700">
//                           No matching inquiries
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           Try clearing your search query or switching status tabs.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredContacts.map((contact) => {
//                     const isChecked = selectedIds.includes(contact.id);
//                     const initials = (contact.name || "?")
//                       .split(" ")
//                       .filter(Boolean)
//                       .slice(0, 2)
//                       .map((part) => part[0]?.toUpperCase())
//                       .join("");

//                     return (
//                       <tr
//                         key={contact.id}
//                         className={`group transition-colors ${
//                           isChecked ? "bg-slate-50" : "hover:bg-slate-50/70"
//                         }`}
//                       >
//                         <td className="px-4 py-3.5 align-top">
//                           <input
//                             type="checkbox"
//                             checked={isChecked}
//                             onChange={() => toggleSelection(contact.id)}
//                             aria-label={`Select ${contact.name}`}
//                             className="mt-1 h-3.5 w-3.5 rounded border-slate-300 accent-slate-900"
//                           />
//                         </td>

//                         {/* SENDER */}
//                         <td className="px-4 py-3.5 align-top">
//                           <div className="flex items-start gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
//                               {initials}
//                             </div>
//                             <div className="min-w-0 space-y-0.5">
//                               <p className="truncate text-sm font-medium text-slate-900">
//                                 {contact.name}
//                               </p>
//                               <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
//                                 <FaEnvelope className="h-3 w-3 shrink-0 text-slate-400" />
//                                 <span className="truncate">{contact.email}</span>
//                               </p>
//                               {contact.phone && (
//                                 <p className="flex items-center gap-1.5 text-xs text-slate-500">
//                                   <FaPhone className="h-3 w-3 shrink-0 text-slate-400" />
//                                   <span>{contact.phone}</span>
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* SUBJECT & MESSAGE */}
//                         <td className="max-w-md px-4 py-3.5 align-top">
//                           <p className="line-clamp-1 text-sm font-medium text-slate-900">
//                             {contact.subject}
//                           </p>
//                           <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
//                             {contact.message}
//                           </p>
//                         </td>

//                         {/* STATUS */}
//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
//                               contact.isResolved
//                                 ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
//                                 : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
//                             }`}
//                           >
//                             {contact.isResolved ? (
//                               <FaCheckCircle className="h-3 w-3" />
//                             ) : (
//                               <FaClock className="h-3 w-3" />
//                             )}
//                             {contact.isResolved ? "Resolved" : "Pending"}
//                           </span>
//                         </td>

//                         {/* DATE */}
//                         <td className="px-4 py-3.5 align-top whitespace-nowrap">
//                           <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
//                             <FaCalendarAlt className="h-3 w-3 text-slate-400" />
//                             {new Date(contact.createdAt).toLocaleDateString(
//                               "en-IN",
//                               {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               }
//                             )}
//                           </div>
//                         </td>

//                         {/* ACTION */}
//                         <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
//                           <button
//                             type="button"
//                             onClick={() => openResolveDrawer(contact)}
//                             className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
//                           >
//                             <span>{contact.isResolved ? "Inspect" : "Resolve"}</span>
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
//           <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
//             <p className="tabular-nums">
//               Showing{" "}
//               <span className="font-medium text-slate-700">
//                 {filteredContacts.length}
//               </span>{" "}
//               of{" "}
//               <span className="font-medium text-slate-700">{stats.total}</span>{" "}
//               inquiries
//             </p>

//             {selectedIds.length > 0 && (
//               <button
//                 type="button"
//                 onClick={() => setSelectedIds([])}
//                 className="font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
//               >
//                 Clear selection ({selectedIds.length})
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* RIGHT-SIDE RESOLVE DRAWER */}
//       <ResolveContactModal
//         isOpen={modalOpen}
//         onClose={closeDrawer}
//         selectedContact={selectedContact}
//         resolveMessage={resolveMessage}
//         setResolveMessage={setResolveMessage}
//         handleResolve={handleResolve}
//         isSubmitting={resolving}
//       />
//     </div>
//   );
// };

// function MetricCard({
//   label,
//   value,
//   accent,
// }: {
//   label: string;
//   value: number;
//   accent: "slate" | "amber" | "emerald" | "rose";
// }) {
//   const dotColors = {
//     slate: "bg-slate-400",
//     amber: "bg-amber-500",
//     emerald: "bg-emerald-500",
//     rose: "bg-rose-500",
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs">
//       <div className="flex items-center gap-2">
//         <span className={`h-2 w-2 rounded-full ${dotColors[accent]}`} />
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//       </div>
//       <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
//         {value}
//       </p>
//     </div>
//   );
// }

// export default ContactManagement;


"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaDownload,
  FaArrowRight,
  FaCalendarAlt,
  FaSpinner,
  FaInbox,
  FaCheckDouble,
  FaSyncAlt,
} from "react-icons/fa";

import {
  getAllContactsAPI,
  updateContactStatusAPI,
} from "@/services/contactService";

import ResolveContactModal, {
  ContactType,
} from "@/components/contact/ResolveContactModal";

type StatusFilter = "all" | "pending" | "resolved";

const ContactManagement = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedContact, setSelectedContact] = useState<ContactType | null>(
    null
  );
  const [resolveMessage, setResolveMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resolving, setResolving] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState<boolean>(false);

  // =========================
  // STATS
  // =========================

  const stats = useMemo(() => {
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    let pending = 0;
    let resolved = 0;
    let recentPending = 0;

    for (const c of contacts) {
      if (c.isResolved) {
        resolved += 1;
      } else {
        pending += 1;
        if (new Date(c.createdAt).getTime() > twoDaysAgo) {
          recentPending += 1;
        }
      }
    }

    return {
      total: contacts.length,
      pending,
      resolved,
      recentPending,
    };
  }, [contacts]);

  // =========================
  // FETCH CONTACTS
  // =========================

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllContactsAPI();
      setContacts(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // =========================
  // FILTER CONTACTS
  // =========================

  const filteredContacts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return contacts.filter((contact) => {
      if (statusFilter === "resolved" && !contact.isResolved) return false;
      if (statusFilter === "pending" && contact.isResolved) return false;

      if (!term) return true;

      return (
        contact.name?.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.subject?.toLowerCase().includes(term) ||
        contact.message?.toLowerCase().includes(term) ||
        contact.phone?.toLowerCase().includes(term)
      );
    });
  }, [contacts, searchTerm, statusFilter]);

  // =========================
  // DRAWER HANDLERS
  // =========================

  const openResolveDrawer = (contact: ContactType) => {
    setSelectedContact(contact);
    setResolveMessage(contact.resolutionMessage || "");
    setModalOpen(true);
  };

  const closeDrawer = () => {
    if (resolving) return;
    setModalOpen(false);
    setSelectedContact(null);
    setResolveMessage("");
  };

  // =========================
  // RESOLVE SINGLE CONTACT
  // =========================

  const handleResolve = async () => {
    if (!selectedContact) return;

    if (!resolveMessage.trim()) {
      toast.error("Resolution message is required");
      return;
    }

    try {
      setResolving(true);

      const response = await updateContactStatusAPI(selectedContact.id, {
        status: "RESOLVED",
        resolutionMessage: resolveMessage.trim(),
      });

      toast.success(response?.message || "Contact marked as resolved");

      setModalOpen(false);
      setSelectedContact(null);
      setResolveMessage("");

      await fetchContacts();
    } catch (error: any) {
      console.error("Resolve error:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to resolve contact"
      );
    } finally {
      setResolving(false);
    }
  };

  // =========================
  // BULK RESOLVE
  // =========================

  const handleBulkResolve = async () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one contact");
      return;
    }

    try {
      setBulkLoading(true);
      const results = await Promise.allSettled(
        selectedIds.map((id) =>
          updateContactStatusAPI(id, {
            status: "RESOLVED",
            resolutionMessage: "Bulk resolved by admin",
          })
        )
      );

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.length - succeeded;

      if (succeeded > 0) {
        toast.success(`${succeeded} contact(s) resolved`);
      }
      if (failed > 0) {
        toast.warning(`${failed} contact(s) could not be updated`);
      }

      setSelectedIds([]);
      await fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error("Bulk resolution failed");
    } finally {
      setBulkLoading(false);
    }
  };

  // =========================
  // SELECTION
  // =========================

  const allVisibleSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every((c) => selectedIds.includes(c.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filteredContacts.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...filteredContacts.map((c) => c.id)]),
      ]);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // =========================
  // CSV EXPORT
  // =========================

  const exportToCSV = () => {
    if (filteredContacts.length === 0) {
      toast.info("No contacts to export");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Status",
      "Resolution",
      "Created At",
    ];

    const escapeCSV = (value: unknown) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredContacts.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.subject,
      c.message,
      c.isResolved ? "Resolved" : "Pending",
      c.resolutionMessage || "",
      new Date(c.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success("CSV exported");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Operations / Support Desk
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Contact Inquiries
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Review incoming messages, reply with resolutions, and track ticket
              status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchContacts}
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
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <FaDownload className="h-3 w-3" />
              Export CSV
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <MetricCard
            label="Total Inquiries"
            value={stats.total}
            accent="slate"
          />
          <MetricCard
            label="Pending Action"
            value={stats.pending}
            accent="amber"
          />
          <MetricCard
            label="Resolved"
            value={stats.resolved}
            accent="emerald"
          />
          <MetricCard
            label="New Pending (48h)"
            value={stats.recentPending}
            accent="rose"
          />
        </div>

        {/* TOOLBAR: SEARCH + SEGMENTED FILTER + BULK ACTION */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, email, phone, subject..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-end">
            {/* SEGMENTED STATUS TABS */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/80 p-0.5 dark:border-slate-800 dark:bg-slate-950">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "resolved", label: "Resolved" },
                ] as const
              ).map((tab) => {
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-brand-500 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* BULK RESOLVE BUTTON */}
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkResolve}
                disabled={bulkLoading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <FaCheckDouble className="h-3 w-3" />
                {bulkLoading
                  ? "Resolving..."
                  : `Resolve (${selectedIds.length})`}
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <th className="w-11 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible contacts"
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-brand-500"
                    />
                  </th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Subject & Message</th>
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
                        Loading inquiries...
                      </div>
                    </td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
                        <FaInbox className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          No matching inquiries
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Try clearing your search query or switching status
                          tabs.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => {
                    const isChecked = selectedIds.includes(contact.id);
                    const initials = (contact.name || "?")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase())
                      .join("");

                    return (
                      <tr
                        key={contact.id}
                        className={`group transition-colors ${
                          isChecked
                            ? "bg-slate-50 dark:bg-slate-800/60"
                            : "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="px-4 py-3.5 align-top">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelection(contact.id)}
                            aria-label={`Select ${contact.name}`}
                            className="mt-1 h-3.5 w-3.5 rounded border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-brand-500"
                          />
                        </td>

                        {/* SENDER */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
                              {initials}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                {contact.name}
                              </p>
                              <p className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                <FaEnvelope className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
                                <span className="truncate">{contact.email}</span>
                              </p>
                              {contact.phone && (
                                <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <FaPhone className="h-3 w-3 shrink-0 text-slate-400 dark:text-slate-500" />
                                  <span>{contact.phone}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* SUBJECT & MESSAGE */}
                        <td className="max-w-md px-4 py-3.5 align-top">
                          <p className="line-clamp-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                            {contact.subject}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            {contact.message}
                          </p>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              contact.isResolved
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                                : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/30"
                            }`}
                          >
                            {contact.isResolved ? (
                              <FaCheckCircle className="h-3 w-3" />
                            ) : (
                              <FaClock className="h-3 w-3" />
                            )}
                            {contact.isResolved ? "Resolved" : "Pending"}
                          </span>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                            <FaCalendarAlt className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                            {new Date(contact.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3.5 align-top text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openResolveDrawer(contact)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700/70"
                          >
                            <span>
                              {contact.isResolved ? "Inspect" : "Resolve"}
                            </span>
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
          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p className="tabular-nums">
              Showing{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {filteredContacts.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {stats.total}
              </span>{" "}
              inquiries
            </p>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white"
              >
                Clear selection ({selectedIds.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE RESOLVE DRAWER */}
      <ResolveContactModal
        isOpen={modalOpen}
        onClose={closeDrawer}
        selectedContact={selectedContact}
        resolveMessage={resolveMessage}
        setResolveMessage={setResolveMessage}
        handleResolve={handleResolve}
        isSubmitting={resolving}
      />
    </div>
  );
};

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "slate" | "amber" | "emerald" | "rose";
}) {
  const dotColors = {
    slate: "bg-slate-400",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotColors[accent]}`} />
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

export default ContactManagement;