// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   Search, 
//   Plus, 
//   Eye, 
//   Pencil, 
//   Trash2, 
//   Image as ImageIcon,
//   CheckCircle2,
//   XCircle,
//   Star,
//   PackageSearch,
//   RefreshCw,
//   X
// } from "lucide-react";

// import {
//   LabEquipment,
//   getPaginatedLabEquipmentAPI,
//   deleteLabEquipmentAPI,
//   toggleLabEquipmentStatusAPI,
//   toggleLabEquipmentFeaturedAPI,
// } from "@/services/labEquipmentService";

// import ViewEquipmentModal from "./ViewEquipmentModal";
// import EditEquipmentModal from "./EditEquipmentModal";

// export default function LabEquipmentTable() {
//   const router = useRouter();

//   const [equipment, setEquipment] = useState<LabEquipment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   // Modal States
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedEquipment, setSelectedEquipment] = useState<LabEquipment | null>(null);

//   const fetchEquipment = useCallback(async (isManualRefresh = false) => {
//     try {
//       if (isManualRefresh) setIsRefreshing(true);
//       else setLoading(true);

//       const response = await getPaginatedLabEquipmentAPI({
//         page,
//         limit,
//         search,
//       });

//       const payload = response?.data ?? response;
//       const rows =
//         payload?.data?.equipments ??
//         payload?.equipments ??
//         payload?.data?.equipment ??
//         payload?.equipment ??
//         [];

//       const equipmentList = Array.isArray(rows) ? rows : [];
//       setEquipment(equipmentList);

//       const totalPages =
//         payload?.data?.totalPages ??
//         payload?.totalPages ??
//         payload?.data?.pagination?.totalPages ??
//         payload?.pagination?.totalPages ??
//         1;
//       setTotalPages(Number(totalPages));

//       const total =
//         payload?.data?.total ??
//         payload?.total ??
//         payload?.data?.pagination?.total ??
//         payload?.pagination?.total ??
//         equipmentList.length;
//       setTotalItems(Number(total));

//     } catch (error) {
//       console.error("❌ Fetch Equipment Error:", error);
//       toast.error("Failed to load lab equipment");
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [page, limit, search]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchEquipment();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [fetchEquipment]);

//   const handleDelete = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this equipment?")) return;
//     try {
//       await deleteLabEquipmentAPI(id);
//       toast.success("Equipment deleted successfully");
//       fetchEquipment(true);
//     } catch (error) {
//       toast.error("Failed to delete equipment");
//     }
//   };

//   const handleStatus = async (id: number) => {
//     try {
//       // Optimistic Update
//       setEquipment(prev => prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
//       await toggleLabEquipmentStatusAPI(id);
//       toast.success("Status updated successfully");
//     } catch (error) {
//       // Revert on failure
//       toast.error("Failed to update status");
//       fetchEquipment(true);
//     }
//   };

//   const handleFeatured = async (id: number) => {
//     try {
//       // Optimistic Update
//       setEquipment(prev => prev.map(item => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
//       await toggleLabEquipmentFeaturedAPI(id);
//       toast.success("Featured status updated");
//     } catch (error) {
//       // Revert on failure
//       toast.error("Failed to update featured status");
//       fetchEquipment(true);
//     }
//   };

//   const openViewModal = (item: LabEquipment) => {
//     setSelectedEquipment(item);
//     setIsViewModalOpen(true);
//   };

//   const openEditModal = (item: LabEquipment) => {
//     setSelectedEquipment(item);
//     setIsEditModalOpen(true);
//   };

//   // Calculate showing items
//   const showingFrom = (page - 1) * limit + 1;
//   const showingTo = Math.min(page * limit, totalItems);

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 bg-slate-50 min-h-screen">
      
//       {/* Header Section */}
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Equipment</h1>
//           <p className="mt-1 text-sm text-slate-500">Manage, view, and edit your laboratory equipment inventory.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => fetchEquipment(true)}
//             disabled={isRefreshing}
//             className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm disabled:opacity-70"
//           >
//             <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-500" : "text-slate-400"} />
//             Refresh
//           </button>
//           <button
//             onClick={() => router.push("/lab-equipment/add")}
//             className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
//           >
//             <Plus size={18} />
//             Add Equipment
//           </button>
//         </div>
//       </div>

//       {/* Main Table Container */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
//         {/* Toolbar */}
//         <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//               placeholder="Search by equipment name, code..."
//               className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
//             />
//             {search && (
//               <button 
//                 onClick={() => { setSearch(""); setPage(1); }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
          
//           <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
//             Total: <span className="text-slate-900">{totalItems}</span> items
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[900px] text-left text-sm">
//             <thead className="bg-[#fcfcfc] text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4 font-bold">Equipment</th>
//                 <th className="px-6 py-4 font-bold">Product Code</th>
//                 <th className="px-6 py-4 font-bold">Category</th>
//                 <th className="px-6 py-4 font-bold text-center">Status</th>
//                 <th className="px-6 py-4 font-bold text-center">Featured</th>
//                 <th className="px-6 py-4 font-bold text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {loading ? (
//                 // 🚨 SKELETON LOADING STATE
//                 Array.from({ length: 5 }).map((_, i) => (
//                   <tr key={i} className="animate-pulse">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
//                         <div>
//                           <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
//                           <div className="h-3 bg-slate-100 rounded w-20"></div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded w-20"></div></td>
//                     <td className="px-6 py-4">
//                       <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
//                       <div className="h-3 bg-slate-100 rounded w-16"></div>
//                     </td>
//                     <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16 mx-auto"></div></td>
//                     <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20 mx-auto"></div></td>
//                     <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded w-24 ml-auto"></div></td>
//                   </tr>
//                 ))
//               ) : equipment.length === 0 ? (
//                 // 🚨 BEAUTIFUL EMPTY STATE
//                 <tr>
//                   <td colSpan={6} className="py-24 text-center">
//                     <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
//                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
//                         <PackageSearch size={32} className="text-slate-400" />
//                       </div>
//                       <h3 className="text-base font-semibold text-slate-900 mb-1">No equipment found</h3>
//                       <p className="text-sm text-slate-500 mb-6">
//                         {search 
//                           ? `We couldn't find any equipment matching "${search}". Try adjusting your search.` 
//                           : "You haven't added any lab equipment yet. Get started by adding your first item."}
//                       </p>
//                       {search ? (
//                         <button
//                           onClick={() => { setSearch(""); setPage(1); }}
//                           className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
//                         >
//                           Clear Search
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => router.push("/lab-equipment/add")}
//                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
//                         >
//                           <Plus size={16} /> Add Equipment
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 // 🚨 DATA ROWS
//                 equipment.map((item) => (
//                   <tr key={item.id} className="transition-colors hover:bg-slate-50/80 group">
                    
//                     {/* Equipment Info */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
//                            {item.media?.[0]?.thumbnail ? (
//                              <img src={item.media[0].thumbnail} alt={item.name} className="w-full h-full object-cover" />
//                            ) : (
//                              <ImageIcon size={20} className="text-slate-400" />
//                            )}
//                         </div>
//                         <div>
//                           <div className="font-semibold text-slate-900">{item.name}</div>
//                           <div className="text-xs text-slate-500 mt-0.5">{item.modelNumber || "No model specified"}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Product Code */}
//                     <td className="px-6 py-4">
//                       <span className="font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
//                         {item.productCode}
//                       </span>
//                     </td>

//                     {/* Category */}
//                     <td className="px-6 py-4">
//                       <div className="text-slate-700 font-medium">{item.category?.name || "-"}</div>
//                       {item.subCategory?.name && (
//                         <div className="text-xs text-slate-500 mt-0.5">{item.subCategory.name}</div>
//                       )}
//                     </td>

//                     {/* Status Toggle */}
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => handleStatus(item.id)}
//                         title="Click to toggle status"
//                         className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
//                           item.isActive
//                             ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm"
//                             : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shadow-sm"
//                         }`}
//                       >
//                         {item.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
//                         {item.isActive ? "Active" : "Inactive"}
//                       </button>
//                     </td>

//                     {/* Featured Toggle */}
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => handleFeatured(item.id)}
//                         title="Click to toggle featured"
//                         className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
//                           item.isFeatured
//                             ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-sm"
//                             : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
//                         }`}
//                       >
//                         <Star size={13} className={item.isFeatured ? "fill-amber-500 text-amber-500" : ""} />
//                         {item.isFeatured ? "Featured" : "Normal"}
//                       </button>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => openViewModal(item)}
//                           title="View Details"
//                           className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         >
//                           <Eye size={18} />
//                         </button>
                        
//                         <button
//                           onClick={() => openEditModal(item)}
//                           title="Edit Equipment"
//                           className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
//                         >
//                           <Pencil size={17} />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(item.id)}
//                           title="Delete Equipment"
//                           className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 size={17} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Footer */}
//         {!loading && equipment.length > 0 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50 gap-4">
//             <p className="text-sm text-slate-500 font-medium">
//               Showing <span className="text-slate-900 font-semibold">{showingFrom}</span> to <span className="text-slate-900 font-semibold">{showingTo}</span> of <span className="text-slate-900 font-semibold">{totalItems}</span> items
//             </p>
//             <div className="flex items-center gap-2">
//               <button
//                 disabled={page <= 1 || loading}
//                 onClick={() => setPage((prev) => prev - 1)}
//                 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 Previous
//               </button>
              
//               <div className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">
//                 {page} / {totalPages}
//               </div>

//               <button
//                 disabled={page >= totalPages || loading}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <ViewEquipmentModal 
//         isOpen={isViewModalOpen} 
//         onClose={() => setIsViewModalOpen(false)} 
//         equipment={selectedEquipment} 
//       />

//       <EditEquipmentModal 
//         isOpen={isEditModalOpen} 
//         onClose={() => setIsEditModalOpen(false)} 
//         equipment={selectedEquipment} 
//         onSuccess={() => {
//           setIsEditModalOpen(false);
//           fetchEquipment(true);
//         }}
//       />

//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  X,
  FileSpreadsheet,
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

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default function LabEquipmentTable() {
  const router = useRouter();

  const [equipment, setEquipment] = useState<LabEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] =
    useState<LabEquipment | null>(null);

  const fetchEquipment = useCallback(
    async (isManualRefresh = false) => {
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

        const pages =
          payload?.data?.totalPages ??
          payload?.totalPages ??
          payload?.data?.pagination?.totalPages ??
          payload?.pagination?.totalPages ??
          1;
        setTotalPages(Math.max(1, Number(pages)));

        const total =
          payload?.data?.total ??
          payload?.total ??
          payload?.data?.pagination?.total ??
          payload?.pagination?.total ??
          equipmentList.length;
        setTotalItems(Number(total));
      } catch (error) {
        console.error("Fetch Equipment Error:", error);
        toast.error("Failed to load lab equipment");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchEquipment]);

  /* =========================================================
     UNIQUE SUBCATEGORIES + FILTERED LIST
  ========================================================= */
  const subCategoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of equipment) {
      const subName = item.subCategory?.name?.trim();
      if (subName) {
        map.set(subName.toLowerCase(), subName);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    const term = search.trim().toLowerCase();

    return equipment.filter((item) => {
      if (subCategoryFilter !== "ALL") {
        const itemSub = (item.subCategory?.name || "").toLowerCase();
        if (itemSub !== subCategoryFilter.toLowerCase()) return false;
      }

      if (!term) return true;

      return (
        item.name?.toLowerCase().includes(term) ||
        item.modelNumber?.toLowerCase().includes(term) ||
        item.productCode?.toLowerCase().includes(term) ||
        item.category?.name?.toLowerCase().includes(term) ||
        item.subCategory?.name?.toLowerCase().includes(term)
      );
    });
  }, [equipment, search, subCategoryFilter]);

  const hasActiveFilters =
    Boolean(search.trim()) || subCategoryFilter !== "ALL";

  const clearFilters = () => {
    setSearch("");
    setSubCategoryFilter("ALL");
    setPage(1);
  };

  /* =========================================================
     EXPORT TO EXCEL (.xls SpreadsheetML)
  ========================================================= */
  const handleExportExcel = () => {
    if (filteredEquipment.length === 0) {
      toast.info("No equipment available to export");
      return;
    }

    const headers = [
      "ID",
      "Equipment Name",
      "Product Code",
      "Model Number",
      "Manufacturer",
      "Category",
      "Subcategory",
      "Origin",
      "Standards",
      "Status",
      "Featured",
    ];

    const rows = filteredEquipment.map((item) => [
      item.id,
      item.name || "",
      item.productCode || "",
      item.modelNumber || "",
      item.manufacturer || "",
      item.category?.name || "",
      item.subCategory?.name || "",
      item.origin || "",
      item.standards || "",
      item.isActive ? "Active" : "Inactive",
      item.isFeatured ? "Featured" : "Normal",
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
  <Worksheet ss:Name="Lab Equipment">
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

    const subSuffix =
      subCategoryFilter !== "ALL"
        ? `_${subCategoryFilter.replace(/\s+/g, "-").toLowerCase()}`
        : "";
    const dateSuffix = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `lab-equipment${subSuffix}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredEquipment.length} item(s) to Excel`);
  };

  /* =========================================================
     ACTIONS
  ========================================================= */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this equipment?"))
      return;
    try {
      await deleteLabEquipmentAPI(id);
      toast.success("Equipment deleted successfully");
      fetchEquipment(true);
    } catch {
      toast.error("Failed to delete equipment");
    }
  };

  const handleStatus = async (id: number) => {
    try {
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
      await toggleLabEquipmentStatusAPI(id);
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
      fetchEquipment(true);
    }
  };

  const handleFeatured = async (id: number) => {
    try {
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
        )
      );
      await toggleLabEquipmentFeaturedAPI(id);
      toast.success("Featured status updated");
    } catch {
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

  const showingFrom = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, totalItems);

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog / AI Lab Equipment
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Lab Equipment
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Filter equipment by name or subcategory, manage status, and export
              Excel reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchEquipment(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-slate-400 ${
                  isRefreshing ? "animate-spin text-brand-500" : ""
                }`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredEquipment.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel ({filteredEquipment.length})</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/lab-equipment/add")}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Equipment</span>
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* TOOLBAR: NAME SEARCH + SUBCATEGORY FILTER */}
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-3.5 dark:border-slate-800 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by equipment name, model, or code..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-9 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* SUBCATEGORY FILTER */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="lab-subcategory-filter"
                  className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  Subcategory:
                </label>
                <select
                  id="lab-subcategory-filter"
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-brand-500 sm:text-sm"
                >
                  <option value="ALL">All Subcategories</option>
                  {subCategoryOptions.map((subName) => (
                    <option key={subName} value={subName}>
                      {subName}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 self-start rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 tabular-nums dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 lg:self-auto">
              <span>Showing:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {filteredEquipment.length}
              </span>
              <span>of {totalItems}</span>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <th className="px-4 py-3">Equipment</th>
                  <th className="px-4 py-3">Product Code</th>
                  <th className="px-4 py-3">Category & Subcategory</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-32 rounded bg-slate-100 dark:bg-slate-800" />
                            <div className="h-3 w-20 rounded bg-slate-100/80 dark:bg-slate-800/70" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="h-5 w-20 rounded bg-slate-100 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="mx-auto h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="mx-auto h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="ml-auto h-7 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          <PackageSearch className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          No equipment found
                        </h3>
                        <p className="mt-1 mb-4 text-xs text-slate-500 dark:text-slate-400">
                          {hasActiveFilters
                            ? "No equipment matched your current search or subcategory filter."
                            : "No laboratory equipment has been added yet."}
                        </p>
                        {hasActiveFilters ? (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            Clear Filters
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => router.push("/lab-equipment/add")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Equipment</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* EQUIPMENT INFO */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                            {item.media?.[0]?.thumbnail ? (
                              <img
                                src={item.media[0].thumbnail}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item.name}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                              {item.modelNumber || "No model specified"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PRODUCT CODE */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                          {item.productCode}
                        </span>
                      </td>

                      {/* CATEGORY & SUBCATEGORY */}
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200 sm:text-sm">
                          {item.category?.name || "—"}
                        </div>
                        {item.subCategory?.name && (
                          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {item.subCategory.name}
                          </div>
                        )}
                      </td>

                      {/* STATUS TOGGLE */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleStatus(item.id)}
                          title="Click to toggle status"
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            item.isActive
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                              : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 hover:bg-rose-100/70 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/30"
                          }`}
                        >
                          {item.isActive ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{item.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* FEATURED TOGGLE */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleFeatured(item.id)}
                          title="Click to toggle featured"
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            item.isFeatured
                              ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 hover:bg-amber-100/70 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/30"
                              : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20 hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                          }`}
                        >
                          <Star
                            className={`h-3 w-3 ${
                              item.isFeatured
                                ? "fill-amber-500 text-amber-500"
                                : ""
                            }`}
                          />
                          <span>{item.isFeatured ? "Featured" : "Normal"}</span>
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openViewModal(item)}
                            title="View Details"
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit Equipment"
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-amber-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Equipment"
                            className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          {!loading && filteredEquipment.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 sm:flex-row">
              <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
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
                  {totalItems}
                </span>{" "}
                items
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white tabular-nums dark:bg-brand-500">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
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