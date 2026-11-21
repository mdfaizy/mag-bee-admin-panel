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

  // Filters & State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "IN_PROGRESS" | "CLOSED">("ALL");
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
  const handleStatusChange = async (id: number, status: LabEnquiry["status"]) => {
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
    // Open Modal here
  };

  // Reset page when filters change
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
      ["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(e.status)
    ).length;
    const converted = enquiries.filter((e) => e.status === "CONVERTED").length;
    
    return { total, newCount, inProgress, converted };
  }, [enquiries]);

  // ==========================================
  // FILTERED & PAGINATED DATA
  // ==========================================
  const filteredEnquiries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enquiries.filter((e) => {
      // Tab Filter
      if (activeTab === "NEW" && e.status !== "NEW") return false;
      if (activeTab === "IN_PROGRESS" && !["CONTACTED", "IN_PROGRESS", "QUOTATION_SENT", "FOLLOW_UP"].includes(e.status)) return false;
      if (activeTab === "CLOSED" && !["CONVERTED", "LOST", "CLOSED"].includes(e.status)) return false;

      // Search Filter
      if (!q) return true;
      const haystack = [e.fullName, e.email, e.phone, e.companyName, e.productName, e.productCode]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [enquiries, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEnquiries.slice(start, start + pageSize);
  }, [filteredEnquiries, currentPage, pageSize]);

  const showingFrom = filteredEnquiries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, filteredEnquiries.length);

  // ==========================================
  // RENDER: LOADING & ERROR
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-slate-500 font-medium">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Failed to load</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">{error}</p>
          <button
            onClick={fetchEnquiries}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
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
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- Breadcrumbs --- */}
        <div className="flex justify-end items-center gap-2 text-xs text-slate-500 mb-6">
          <span>Home</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">Lab Enquiries</span>
        </div>

        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Enquiries</h1>
            <p className="text-sm text-slate-500 mt-1">
              {stats.total} total enquiries · {stats.newCount} new · {stats.inProgress} in progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchEnquiries}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <FaSyncAlt className="text-slate-400" /> Refresh
            </button>
            {/* Add Export Button if needed */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
              <FaPlus /> Export
            </button> */}
          </div>
        </div>

        {/* --- Stat Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="TOTAL ENQUIRIES" value={stats.total} icon={<FaFileAlt />} color="text-slate-400" />
          <StatCard label="NEW / UNREAD" value={stats.newCount} icon={<FaInbox />} color="text-blue-500" />
          <StatCard label="IN PROGRESS" value={stats.inProgress} icon={<FaClock />} color="text-orange-500" />
          <StatCard label="CONVERTED" value={stats.converted} icon={<FaCheckCircle />} color="text-green-500" />
        </div>

        {/* --- Main Content Box --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
            <TabButton label="All" count={stats.total} active={activeTab === "ALL"} onClick={() => setActiveTab("ALL")} />
            <TabButton label="New" count={stats.newCount} active={activeTab === "NEW"} onClick={() => setActiveTab("NEW")} />
            <TabButton label="In Progress" count={stats.inProgress} active={activeTab === "IN_PROGRESS"} onClick={() => setActiveTab("IN_PROGRESS")} />
            <TabButton label="Closed" count={stats.total - (stats.newCount + stats.inProgress)} active={activeTab === "CLOSED"} onClick={() => setActiveTab("CLOSED")} />
          </div>

          {/* Toolbar */}
          <div className="p-4 flex flex-col md:flex-row md:items-center gap-3 border-b border-slate-200 bg-slate-50/50">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                <FaFilter className="text-slate-400 text-xs" /> Filters
              </button>
              
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <AdminEnquiryTable
            enquiries={paginatedData}
            onView={handleView}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-slate-200">
            <span className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{showingFrom}</span> to <span className="font-semibold text-slate-700">{showingTo}</span> of <span className="font-semibold text-slate-700">{filteredEnquiries.length}</span> enquiries
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              
              <span className="px-3 text-sm font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <FaChevronRight className="text-xs" />
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

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`text-xl ${color} mt-1`}>
        {icon}
      </div>
    </div>
  );
}

function TabButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active 
          ? "border-slate-800 text-slate-800" 
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
      }`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
        active ? "bg-slate-100 text-slate-800" : "bg-slate-100 text-slate-500"
      }`}>
        {count}
      </span>
    </button>
  );
}