// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   FaSearch,
//   FaSyncAlt,
//   FaInbox,
//   FaCheckCircle,
//   FaClock,
//   FaTimesCircle,
//   FaFilter,
//   FaFileAlt,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";

// import AdminEnquiryTable from "./AdminEnquiryTable";
// import {
//   getAllLabEnquiriesApi,
//   updateLabEnquiryStatusApi,
//   type LabEnquiry,
// } from "@/services/enquiryService";

// const PAGE_SIZE_OPTIONS = [10, 20, 50];

// export default function AdminEnquiries() {
//   const [enquiries, setEnquiries] = useState<LabEnquiry[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");
//   const [updatingId, setUpdatingId] = useState<number | null>(null);

//   // Filters & State
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "IN_PROGRESS" | "CLOSED">("ALL");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   // ==========================================
//   // FETCH DATA
//   // ==========================================
//   const fetchEnquiries = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const response = await getAllLabEnquiriesApi();
//       const data: LabEnquiry[] = response?.data?.items ?? [];
//       setEnquiries(data);
//     } catch (err: unknown) {
//       console.error("Fetch enquiries error:", err);
//       setError(err instanceof Error ? err.message : "Failed to fetch enquiries");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [fetchEnquiries]);

//   // ==========================================
//   // STATUS UPDATE
//   // ==========================================
//   const handleStatusChange = async (id: number, status: LabEnquiry["status"]) => {
//     const previous = enquiries;
//     try {
//       setUpdatingId(id);
//       setEnquiries((prev) =>
//         prev.map((e) => (e.id === id ? { ...e, status } : e))
//       );
//       await updateLabEnquiryStatusApi(id, status);
//     } catch (err: unknown) {
//       console.error("Status update error:", err);
//       setEnquiries(previous);
//       alert(err instanceof Error ? err.message : "Failed to update status");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleView = (id: number) => {
//     console.log("View enquiry:", id);
//     // Open Modal here
//   };

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, activeTab, pageSize]);

//   // ==========================================
//   // STATS CALCULATION
//   // ==========================================
//   const stats = useMemo(() => {
//     const total = enquiries.length;
//     const newCount = enquiries.filter((e) => e.status === "NEW").length;
//     const inProgress = enquiries.filter((e) =>
//       ["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(e.status)
//     ).length;
//     const converted = enquiries.filter((e) => e.status === "CONVERTED").length;
    
//     return { total, newCount, inProgress, converted };
//   }, [enquiries]);

//   // ==========================================
//   // FILTERED & PAGINATED DATA
//   // ==========================================
//   const filteredEnquiries = useMemo(() => {
//     const q = searchQuery.trim().toLowerCase();
//     return enquiries.filter((e) => {
//       // Tab Filter
//       if (activeTab === "NEW" && e.status !== "NEW") return false;
//       if (activeTab === "IN_PROGRESS" && !["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(e.status)) return false;
//       if (activeTab === "CLOSED" && !["CONVERTED", "LOST", "CLOSED"].includes(e.status)) return false;

//       // Search Filter
//       if (!q) return true;
//       const haystack = [e.fullName, e.email, e.phone, e.companyName, e.productName, e.productCode]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();
//       return haystack.includes(q);
//     });
//   }, [enquiries, searchQuery, activeTab]);

//   const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return filteredEnquiries.slice(start, start + pageSize);
//   }, [filteredEnquiries, currentPage, pageSize]);

//   const showingFrom = filteredEnquiries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
//   const showingTo = Math.min(currentPage * pageSize, filteredEnquiries.length);

//   // ==========================================
//   // RENDER: LOADING & ERROR
//   // ==========================================
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-3 text-sm text-slate-500 font-medium">Loading enquiries...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center max-w-md w-full">
//           <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
//           <h2 className="text-lg font-bold text-slate-800">Failed to load</h2>
//           <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
//           <button
//             onClick={fetchEnquiries}
//             className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ==========================================
//   // RENDER: MAIN UI
//   // ==========================================
//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
//       <div className="max-w-[1400px] mx-auto">
        
//         {/* --- Breadcrumbs --- */}
//         <div className="flex justify-end items-center gap-2 text-xs text-slate-500 mb-6">
//           <span>Home</span>
//           <span>/</span>
//           <span className="text-slate-800 font-medium">Lab Enquiries</span>
//         </div>

//         {/* --- Header --- */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Enquiries</h1>
//             <p className="text-sm text-slate-500 mt-1">
//               {stats.total} total enquiries · {stats.newCount} new · {stats.inProgress} in progress
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={fetchEnquiries}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
//             >
//               <FaSyncAlt className="text-slate-400" /> Refresh
//             </button>
//             {/* Add Export Button if needed */}
//             {/* <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
//               <FaPlus /> Export
//             </button> */}
//           </div>
//         </div>

//         {/* --- Stat Cards --- */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <StatCard label="TOTAL ENQUIRIES" value={stats.total} icon={<FaFileAlt />} color="text-slate-400" />
//           <StatCard label="NEW / UNREAD" value={stats.newCount} icon={<FaInbox />} color="text-blue-500" />
//           <StatCard label="IN PROGRESS" value={stats.inProgress} icon={<FaClock />} color="text-orange-500" />
//           <StatCard label="CONVERTED" value={stats.converted} icon={<FaCheckCircle />} color="text-green-500" />
//         </div>

//         {/* --- Main Content Box --- */}
//         <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
//           {/* Tabs */}
//           <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
//             <TabButton label="All" count={stats.total} active={activeTab === "ALL"} onClick={() => setActiveTab("ALL")} />
//             <TabButton label="New" count={stats.newCount} active={activeTab === "NEW"} onClick={() => setActiveTab("NEW")} />
//             <TabButton label="In Progress" count={stats.inProgress} active={activeTab === "IN_PROGRESS"} onClick={() => setActiveTab("IN_PROGRESS")} />
//             <TabButton label="Closed" count={stats.total - (stats.newCount + stats.inProgress)} active={activeTab === "CLOSED"} onClick={() => setActiveTab("CLOSED")} />
//           </div>

//           {/* Toolbar */}
//           <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-200 bg-slate-50/50">
//             <div className="relative flex-1">
//               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, phone, product..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               />
//             </div>
            
//             <div className="flex items-center gap-2">
//               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
//                 <FaFilter className="text-slate-400 text-xs" /> Filters
//               </button>
              
//               <select
//                 value={pageSize}
//                 onChange={(e) => setPageSize(Number(e.target.value))}
//                 className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
//               >
//                 {PAGE_SIZE_OPTIONS.map(size => (
//                   <option key={size} value={size}>{size} / page</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <AdminEnquiryTable
//             enquiries={paginatedData}
//             onView={handleView}
//             onStatusChange={handleStatusChange}
//             updatingId={updatingId}
//           />

//           {/* Pagination Footer */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-slate-200">
//             <span className="text-sm text-slate-500">
//               Showing <span className="font-semibold text-slate-700">{showingFrom}</span> to <span className="font-semibold text-slate-700">{showingTo}</span> of <span className="font-semibold text-slate-700">{filteredEnquiries.length}</span> enquiries
//             </span>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 <FaChevronLeft className="text-xs" />
//               </button>
              
//               <span className="px-3 text-sm font-medium text-slate-700">
//                 Page {currentPage} of {totalPages}
//               </span>

//               <button
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//               >
//                 <FaChevronRight className="text-xs" />
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // ==========================================
// // HELPER COMPONENTS
// // ==========================================

// function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
//   return (
//     <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
//       <div>
//         <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{label}</p>
//         <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
//       </div>
//       <div className={`text-xl ${color} mt-1`}>
//         {icon}
//       </div>
//     </div>
//   );
// }

// function TabButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//         active 
//           ? "border-slate-800 text-slate-800" 
//           : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
//       }`}
//     >
//       {label}
//       <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
//         active ? "bg-slate-100 text-slate-800" : "bg-slate-100 text-slate-500"
//       }`}>
//         {count}
//       </span>
//     </button>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaInbox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilter,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import AdminEnquiryTable from "./AdminEnquiryTable";
import {
  getAllLabEnquiriesApi,
  updateLabEnquiryStatusApi,
  type LabEnquiry,
} from "@/services/enquiryService";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<LabEnquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "ALL" | "NEW" | "IN_PROGRESS" | "CLOSED"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ==========================================
  // FETCH DATA
  // ==========================================
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllLabEnquiriesApi();
      const data: LabEnquiry[] = response?.data?.items ?? [];
      setEnquiries(data);
    } catch (err: unknown) {
      console.error("Fetch enquiries error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // ==========================================
  // STATUS UPDATE
  // ==========================================
  const handleStatusChange = async (
    id: number,
    status: LabEnquiry["status"]
  ) => {
    const previous = enquiries;
    try {
      setUpdatingId(id);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      await updateLabEnquiryStatusApi(id, status);
    } catch (err: unknown) {
      console.error("Status update error:", err);
      setEnquiries(previous);
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleView = (id: number) => {
    console.log("View enquiry:", id);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, pageSize]);

  // ==========================================
  // STATS CALCULATION
  // ==========================================
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === "NEW").length;
    const inProgress = enquiries.filter((e) =>
      ["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(
        e.status
      )
    ).length;
    const converted = enquiries.filter((e) => e.status === "CONVERTED").length;
    const closed = enquiries.filter((e) =>
      ["CONVERTED", "LOST", "CLOSED"].includes(e.status)
    ).length;

    return { total, newCount, inProgress, converted, closed };
  }, [enquiries]);

  // ==========================================
  // FILTERED & PAGINATED DATA
  // ==========================================
  const filteredEnquiries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (activeTab === "NEW" && e.status !== "NEW") return false;
      if (
        activeTab === "IN_PROGRESS" &&
        !["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(
          e.status
        )
      ) {
        return false;
      }
      if (
        activeTab === "CLOSED" &&
        !["CONVERTED", "LOST", "CLOSED"].includes(e.status)
      ) {
        return false;
      }

      if (!q) return true;
      const haystack = [
        e.fullName,
        e.email,
        e.phone,
        e.companyName,
        e.productName,
        e.productCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [enquiries, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredEnquiries.slice(start, start + pageSize);
  }, [filteredEnquiries, safePage, pageSize]);

  const showingFrom =
    filteredEnquiries.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingTo = Math.min(safePage * pageSize, filteredEnquiries.length);

  // ==========================================
  // RENDER: LOADING & ERROR
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/80 p-6 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-brand-500 dark:border-t-transparent" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
            Loading lab enquiries...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/80 p-6 dark:bg-slate-950">
        <div
          role="alert"
          className="w-full max-w-md rounded-xl border border-rose-200/90 bg-white p-6 text-center shadow-2xs dark:border-rose-900/50 dark:bg-slate-900"
        >
          <FaTimesCircle className="mx-auto mb-3 h-8 w-8 text-rose-500 dark:text-rose-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Failed to load enquiries
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchEnquiries}
            className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN UI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1440px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Operations / Lab Enquiries
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Lab Enquiries
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {stats.total} total enquiries · {stats.newCount} new ·{" "}
              {stats.inProgress} in progress
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchEnquiries}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <FaSyncAlt className="h-3 w-3 text-slate-400" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <StatCard
            label="Total Enquiries"
            value={stats.total}
            icon={<FaFileAlt className="h-3.5 w-3.5" />}
            dot="slate"
          />
          <StatCard
            label="New / Unread"
            value={stats.newCount}
            icon={<FaInbox className="h-3.5 w-3.5" />}
            dot="sky"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<FaClock className="h-3.5 w-3.5" />}
            dot="amber"
          />
          <StatCard
            label="Converted"
            value={stats.converted}
            icon={<FaCheckCircle className="h-3.5 w-3.5" />}
            dot="emerald"
          />
        </div>

        {/* MAIN PANEL */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* TABS */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/60 px-3 pt-2 dark:border-slate-800 dark:bg-slate-950/40">
            <TabButton
              label="All"
              count={stats.total}
              active={activeTab === "ALL"}
              onClick={() => setActiveTab("ALL")}
            />
            <TabButton
              label="New"
              count={stats.newCount}
              active={activeTab === "NEW"}
              onClick={() => setActiveTab("NEW")}
            />
            <TabButton
              label="In Progress"
              count={stats.inProgress}
              active={activeTab === "IN_PROGRESS"}
              onClick={() => setActiveTab("IN_PROGRESS")}
            />
            <TabButton
              label="Closed"
              count={stats.closed}
              active={activeTab === "CLOSED"}
              onClick={() => setActiveTab("CLOSED")}
            />
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 border-b border-slate-200 p-3.5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, company, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FaFilter className="h-3 w-3 text-slate-400" />
                <span>Reset View</span>
              </button>

              <select
                aria-label="Items per page"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <AdminEnquiryTable
            enquiries={paginatedData}
            onView={handleView}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          {/* PAGINATION FOOTER */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {showingFrom}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {showingTo}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {filteredEnquiries.length}
              </span>{" "}
              enquiries
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FaChevronLeft className="h-3 w-3" />
              </button>

              <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white tabular-nums dark:bg-brand-500">
                {safePage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function StatCard({
  label,
  value,
  icon,
  dot,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotMap[dot]}`} />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
          : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
          active
            ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-white"
            : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}