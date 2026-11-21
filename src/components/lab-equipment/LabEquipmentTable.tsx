"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  Search, 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Star,
  PackageSearch,
  RefreshCw,
  X
} from "lucide-react";

import {
  LabEquipment,
  getPaginatedLabEquipmentAPI,
  deleteLabEquipmentAPI,
  toggleLabEquipmentStatusAPI,
  toggleLabEquipmentFeaturedAPI,
} from "@/services/labEquipmentService";

import ViewEquipmentModal from "./ViewEquipmentModal";
import EditEquipmentModal from "./EditEquipmentModal";

export default function LabEquipmentTable() {
  const router = useRouter();

  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<LabEquipment | null>(null);

  const fetchEquipment = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setLoading(true);

      const response = await getPaginatedLabEquipmentAPI({
        page,
        limit,
        search,
      });

      const payload = response?.data ?? response;
      const rows =
        payload?.data?.equipments ??
        payload?.equipments ??
        payload?.data?.equipment ??
        payload?.equipment ??
        [];

      const equipmentList = Array.isArray(rows) ? rows : [];
      setEquipment(equipmentList);

      const totalPages =
        payload?.data?.totalPages ??
        payload?.totalPages ??
        payload?.data?.pagination?.totalPages ??
        payload?.pagination?.totalPages ??
        1;
      setTotalPages(Number(totalPages));

      const total =
        payload?.data?.total ??
        payload?.total ??
        payload?.data?.pagination?.total ??
        payload?.pagination?.total ??
        equipmentList.length;
      setTotalItems(Number(total));

    } catch (error) {
      console.error("❌ Fetch Equipment Error:", error);
      toast.error("Failed to load lab equipment");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEquipment]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await deleteLabEquipmentAPI(id);
      toast.success("Equipment deleted successfully");
      fetchEquipment(true);
    } catch (error) {
      toast.error("Failed to delete equipment");
    }
  };

  const handleStatus = async (id: number) => {
    try {
      // Optimistic Update
      setEquipment(prev => prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
      await toggleLabEquipmentStatusAPI(id);
      toast.success("Status updated successfully");
    } catch (error) {
      // Revert on failure
      toast.error("Failed to update status");
      fetchEquipment(true);
    }
  };

  const handleFeatured = async (id: number) => {
    try {
      // Optimistic Update
      setEquipment(prev => prev.map(item => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
      await toggleLabEquipmentFeaturedAPI(id);
      toast.success("Featured status updated");
    } catch (error) {
      // Revert on failure
      toast.error("Failed to update featured status");
      fetchEquipment(true);
    }
  };

  const openViewModal = (item: LabEquipment) => {
    setSelectedEquipment(item);
    setIsViewModalOpen(true);
  };

  const openEditModal = (item: LabEquipment) => {
    setSelectedEquipment(item);
    setIsEditModalOpen(true);
  };

  // Calculate showing items
  const showingFrom = (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, totalItems);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 bg-slate-50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Equipment</h1>
          <p className="mt-1 text-sm text-slate-500">Manage, view, and edit your laboratory equipment inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchEquipment(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm disabled:opacity-70"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-500" : "text-slate-400"} />
            Refresh
          </button>
          <button
            onClick={() => router.push("/lab-equipment/add")}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
          >
            <Plus size={18} />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by equipment name, code..."
              className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {search && (
              <button 
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
            Total: <span className="text-slate-900">{totalItems}</span> items
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#fcfcfc] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Equipment</th>
                <th className="px-6 py-4 font-bold">Product Code</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Featured</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // 🚨 SKELETON LOADING STATE
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-100 rounded w-20"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : equipment.length === 0 ? (
                // 🚨 BEAUTIFUL EMPTY STATE
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <PackageSearch size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">No equipment found</h3>
                      <p className="text-sm text-slate-500 mb-6">
                        {search 
                          ? `We couldn't find any equipment matching "${search}". Try adjusting your search.` 
                          : "You haven't added any lab equipment yet. Get started by adding your first item."}
                      </p>
                      {search ? (
                        <button
                          onClick={() => { setSearch(""); setPage(1); }}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
                        >
                          Clear Search
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push("/lab-equipment/add")}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          <Plus size={16} /> Add Equipment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // 🚨 DATA ROWS
                equipment.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80 group">
                    
                    {/* Equipment Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                           {item.media?.[0]?.thumbnail ? (
                             <img src={item.media[0].thumbnail} alt={item.name} className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon size={20} className="text-slate-400" />
                           )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.modelNumber || "No model specified"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Product Code */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                        {item.productCode}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-medium">{item.category?.name || "-"}</div>
                      {item.subCategory?.name && (
                        <div className="text-xs text-slate-500 mt-0.5">{item.subCategory.name}</div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleStatus(item.id)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shadow-sm"
                        }`}
                      >
                        {item.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleFeatured(item.id)}
                        title="Click to toggle featured"
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                          item.isFeatured
                            ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-sm"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <Star size={13} className={item.isFeatured ? "fill-amber-500 text-amber-500" : ""} />
                        {item.isFeatured ? "Featured" : "Normal"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openViewModal(item)}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit Equipment"
                          className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Equipment"
                          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && equipment.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50 gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-semibold">{showingFrom}</span> to <span className="text-slate-900 font-semibold">{showingTo}</span> of <span className="text-slate-900 font-semibold">{totalItems}</span> items
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              
              <div className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
                {page} / {totalPages}
              </div>

              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewEquipmentModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        equipment={selectedEquipment} 
      />

      <EditEquipmentModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        equipment={selectedEquipment} 
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchEquipment(true);
        }}
      />

    </div>
  );
}