//   "use client";

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import { getSocket } from "@/services/lib/socket";
// import {
//   setBanners,
//   setSelectedBanner,
//   addBanner,
//   updateBanner,
//   removeBanner,
// } from "@/redux/bannerSlice";
// import {
//   fetchBanner,
//   fetchBannerById,
//   toggleBannerStatus,
//   deleteOfferBanner,
// } from "@/services/bannerServices/BannerService";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../ui/table";
// import {
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
//   FaImage,
//   FaSyncAlt,
// } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import Pagination from "./Pagination";
// import EditOfferBannerModal from "../productOffer/EditBannerModal";

// /* =========================================================
//    TYPES
// ========================================================= */
// interface Banner {
//   id: number;
//   title: string;
//   subtitle?: string;
//   imageUrl: string;
//   isEnabled: boolean;
//   isActive: boolean;
//   startDate?: string;
//   endDate?: string;
// }

// type StatusFilter = "all" | "enabled" | "disabled" | "active" | "inactive";

// const GCS_BASE = "https://storage.googleapis.com/magbee-ecommerce-media";

// const resolveBannerSrc = (url?: string) => {
//   if (!url) return "";
//   if (url.startsWith("http://") || url.startsWith("https://")) return url;
//   return `${GCS_BASE}/${url.replace(/^\/+/, "")}`;
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */
// const BannerTable = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { banners } = useSelector((state: RootState) => state.banner);

//   /* =======================================================
//      STATES
//   ======================================================= */
//   const [loading, setLoading] = useState(false);
//   const [togglingId, setTogglingId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

//   /* =======================================================
//      FETCH ALL BANNERS
//   ======================================================= */
//   const loadBanners = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetchBanner();
//       dispatch(setBanners(res));
//     } catch (error) {
//       console.error("Failed to load banners:", error);
//       toast.error("Failed to load banners");
//     } finally {
//       setLoading(false);
//     }
//   }, [dispatch]);

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */
//   useEffect(() => {
//     loadBanners();
//   }, [loadBanners]);

//   /* =======================================================
//      SOCKET EVENTS
//   ======================================================= */
//   useEffect(() => {
//     const socket = getSocket();

//     socket.on("bannerCreated", (banner: Banner) => {
//       dispatch(addBanner(banner));
//       toast.info("New banner added");
//     });

//     socket.on("bannerUpdated", (banner: Banner) => {
//       dispatch(updateBanner(banner));
//     });

//     socket.on("bannerDeleted", (id: number) => {
//       dispatch(removeBanner(id));
//     });

//     socket.on("bannerStatusChanged", (banner: Banner) => {
//       dispatch(updateBanner(banner));
//     });

//     return () => {
//       socket.off("bannerCreated");
//       socket.off("bannerUpdated");
//       socket.off("bannerDeleted");
//       socket.off("bannerStatusChanged");
//     };
//   }, [dispatch]);

//   /* =======================================================
//      STATS
//   ======================================================= */
//   const stats = useMemo(() => {
//     let enabled = 0;
//     let active = 0;
//     let inactive = 0;

//     for (const b of banners) {
//       if (b.isEnabled) enabled += 1;
//       if (b.isActive) active += 1;
//       else inactive += 1;
//     }

//     return {
//       total: banners.length,
//       enabled,
//       disabled: banners.length - enabled,
//       active,
//       inactive,
//     };
//   }, [banners]);

//   /* =======================================================
//      FILTER + SEARCH
//   ======================================================= */
//   const filteredData = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();

//     return banners.filter((b: Banner) => {
//       if (statusFilter === "enabled" && !b.isEnabled) return false;
//       if (statusFilter === "disabled" && b.isEnabled) return false;
//       if (statusFilter === "active" && !b.isActive) return false;
//       if (statusFilter === "inactive" && b.isActive) return false;

//       if (!term) return true;
//       return [b.title, b.subtitle, String(b.id)]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(term);
//     });
//   }, [banners, searchTerm, statusFilter]);

//   /* =======================================================
//      PAGINATION
//   ======================================================= */
//   const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const startIndex = (safePage - 1) * itemsPerPage;
//   const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   /* =======================================================
//      DELETE
//   ======================================================= */
//   const handleDelete = async (id: number) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this banner?"
//     );
//     if (!confirmDelete) return;

//     try {
//       setLoading(true);
//       await dispatch(deleteOfferBanner(id));
//       toast.success("Banner deleted");
//     } catch {
//       toast.error("Failed to delete banner");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =======================================================
//      EDIT
//   ======================================================= */
//   const handleEdit = async (banner: Banner) => {
//     try {
//       await dispatch(fetchBannerById(banner.id));
//       setEditModalOpen(true);
//     } catch {
//       toast.error("Failed to load banner details");
//     }
//   };

//   /* =======================================================
//      DATE FORMAT
//   ======================================================= */
//   const formatDate = (date?: string) =>
//     date
//       ? new Date(date).toLocaleDateString("en-IN", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         })
//       : "—";

//   /* =======================================================
//      TOGGLE ENABLE / DISABLE
//   ======================================================= */
//   const handleToggleActive = async (id: number) => {
//     try {
//       setTogglingId(id);
//       await dispatch(toggleBannerStatus(id));
//       await loadBanners();
//     } catch {
//       toast.error("Error updating status");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   /* =======================================================
//      RESET FILTERS
//   ======================================================= */
//   const resetFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setCurrentPage(1);
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */
//   return (
//     <div className="min-h-screen bg-slate-50/80 text-slate-900">
//       <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
//         {/* TOP HEADER */}
//         <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
//               Marketing / Banners
//             </p>
//             <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
//               Banner Management
//             </h1>
//             <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
//               Manage promotional creatives, live schedules, and enable/disable states.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={loadBanners}
//               disabled={loading}
//               className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
//             >
//               <FaSyncAlt
//                 className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
//               />
//               Refresh
//             </button>

//             <Link
//               href="/banner"
//               className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-slate-800"
//             >
//               <FaPlus className="h-3 w-3" />
//               New Banner
//             </Link>
//           </div>
//         </div>

//         {/* METRICS ROW */}
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
//           <MetricCard
//             label="Total Banners"
//             value={stats.total}
//             dot="slate"
//           />
//           <MetricCard
//             label="Enabled"
//             value={stats.enabled}
//             dot="emerald"
//           />
//           <MetricCard
//             label="Live Now"
//             value={stats.active}
//             dot="sky"
//           />
//           <MetricCard
//             label="Inactive"
//             value={stats.inactive}
//             dot="amber"
//           />
//         </div>

//         {/* MAIN PANEL */}
//         <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
//           {/* TABS */}
//           <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/60 px-3 pt-2">
//             {(
//               [
//                 { key: "all", label: "All", count: stats.total },
//                 { key: "enabled", label: "Enabled", count: stats.enabled },
//                 { key: "active", label: "Live", count: stats.active },
//                 { key: "disabled", label: "Disabled", count: stats.disabled },
//               ] as const
//             ).map((tab) => {
//               const active = statusFilter === tab.key;
//               return (
//                 <button
//                   key={tab.key}
//                   type="button"
//                   onClick={() => {
//                     setStatusFilter(tab.key);
//                     setCurrentPage(1);
//                   }}
//                   className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
//                     active
//                       ? "bg-white text-slate-900 shadow-2xs"
//                       : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
//                   }`}
//                 >
//                   <span>{tab.label}</span>
//                   <span
//                     className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
//                       active
//                         ? "bg-slate-900 text-white"
//                         : "bg-slate-200/70 text-slate-600"
//                     }`}
//                   >
//                     {tab.count}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* SEARCH + ADVANCED FILTER */}
//           <div className="border-b border-slate-200 p-3.5">
//             <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
//               <div className="relative w-full sm:max-w-sm">
//                 <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   placeholder="Search by ID, title, or subtitle..."
//                   className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none sm:text-sm"
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setShowFilters((prev) => !prev)}
//                 className={`inline-flex items-center gap-2 self-start rounded-lg border px-3 py-2 text-xs font-medium transition sm:self-auto ${
//                   showFilters
//                     ? "border-slate-900 bg-slate-900 text-white"
//                     : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//                 }`}
//               >
//                 <FaFilter className="h-3 w-3" />
//                 <span>More Filters</span>
//                 {showFilters ? (
//                   <FaChevronUp className="h-2.5 w-2.5" />
//                 ) : (
//                   <FaChevronDown className="h-2.5 w-2.5" />
//                 )}
//               </button>
//             </div>

//             {showFilters && (
//               <div className="mt-3 flex flex-col gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 sm:flex-row sm:items-end">
//                 <div className="w-full sm:w-56">
//                   <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                     Status Filter
//                   </label>
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value as StatusFilter);
//                       setCurrentPage(1);
//                     }}
//                     className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-900"
//                   >
//                     <option value="all">All Statuses</option>
//                     <option value="enabled">Enabled</option>
//                     <option value="disabled">Disabled</option>
//                     <option value="active">Live (Active)</option>
//                     <option value="inactive">Not Live</option>
//                   </select>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={resetFilters}
//                   className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* TABLE */}
//           <div className="overflow-x-auto">
//             <Table className="w-full min-w-[920px] border-collapse text-left">
//               <TableHeader className="bg-slate-50/90">
//                 <TableRow className="border-b border-slate-200">
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     ID
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Banner
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Preview
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Enabled
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Live Status
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Schedule
//                   </TableCell>
//                   <TableCell
//                     isHeader
//                     className="!px-4 !py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500"
//                   >
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHeader>

//               <TableBody className="divide-y divide-slate-100 text-sm">
//                 {loading && banners.length === 0 ? (
//                   Array.from({ length: 5 }).map((_, i) => (
//                     <TableRow key={i}>
//                       {Array.from({ length: 7 }).map((__, j) => (
//                         <TableCell key={j} className="!px-4 !py-3.5">
//                           <div className="h-4 animate-pulse rounded bg-slate-100" />
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : visibleData.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="py-16 text-center">
//                       <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
//                         <FaImage className="h-8 w-8 text-slate-300" />
//                         <p className="text-sm font-medium text-slate-700">
//                           No banners found
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           Try clearing your search term or switching status tabs.
//                         </p>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   visibleData.map((item: Banner) => {
//                     const imgSrc = resolveBannerSrc(item.imageUrl);
//                     const isToggling = togglingId === item.id;

//                     return (
//                       <TableRow
//                         key={item.id}
//                         className="group transition-colors hover:bg-slate-50/70"
//                       >
//                         <TableCell className="!px-4 !py-3.5 align-middle font-mono text-xs text-slate-500 tabular-nums">
//                           #{String(item.id).padStart(4, "0")}
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle">
//                           <div className="max-w-xs">
//                             <p className="truncate text-sm font-medium text-slate-900">
//                               {item.title}
//                             </p>
//                             {item.subtitle && (
//                               <p className="mt-0.5 truncate text-xs text-slate-500">
//                                 {item.subtitle}
//                               </p>
//                             )}
//                           </div>
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle">
//                           <div className="h-10 w-20 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
//                             {imgSrc ? (
//                               <img
//                                 src={imgSrc}
//                                 alt={item.title}
//                                 className="h-full w-full object-cover"
//                               />
//                             ) : (
//                               <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
//                                 No image
//                               </div>
//                             )}
//                           </div>
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
//                           <div className="inline-flex items-center gap-2">
//                             <button
//                               type="button"
//                               disabled={isToggling}
//                               onClick={() => handleToggleActive(item.id)}
//                               title={
//                                 item.isEnabled
//                                   ? "Disable banner"
//                                   : "Enable banner"
//                               }
//                               className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
//                                 item.isEnabled
//                                   ? "bg-emerald-600"
//                                   : "bg-slate-300"
//                               }`}
//                             >
//                               <span
//                                 className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs transition-transform ${
//                                   item.isEnabled
//                                     ? "translate-x-4.5"
//                                     : "translate-x-1"
//                                 }`}
//                               />
//                             </button>
//                             <span
//                               className={`text-xs font-medium ${
//                                 item.isEnabled
//                                   ? "text-emerald-700"
//                                   : "text-slate-500"
//                               }`}
//                             >
//                               {item.isEnabled ? "Enabled" : "Disabled"}
//                             </span>
//                           </div>
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
//                               item.isActive
//                                 ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
//                                 : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
//                             }`}
//                           >
//                             <span
//                               className={`h-1.5 w-1.5 rounded-full ${
//                                 item.isActive
//                                   ? "bg-emerald-500"
//                                   : "bg-slate-400"
//                               }`}
//                             />
//                             {item.isActive ? "Live" : "Inactive"}
//                           </span>
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap text-xs text-slate-600 tabular-nums">
//                           <p>{formatDate(item.startDate)}</p>
//                           <p className="text-[11px] text-slate-400">
//                             to {formatDate(item.endDate)}
//                           </p>
//                         </TableCell>

//                         <TableCell className="!px-4 !py-3.5 align-middle text-right whitespace-nowrap">
//                           <div className="inline-flex items-center gap-1">
//                             <button
//                               type="button"
//                               onClick={() => handleEdit(item)}
//                               title="Edit banner"
//                               className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
//                             >
//                               <FaEdit className="h-3.5 w-3.5" />
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => handleDelete(item.id)}
//                               title="Delete banner"
//                               className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
//                             >
//                               <MdDeleteForever className="h-4 w-4" />
//                             </button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* PAGINATION */}
//           <div className="border-t border-slate-200 bg-slate-50/50">
//             <Pagination
//               currentPage={safePage}
//               totalPages={totalPages}
//               itemsPerPage={itemsPerPage}
//               totalItems={filteredData.length}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </div>
//       </div>

//       {/* EDIT MODAL */}
//       <EditOfferBannerModal
//         isOpen={editModalOpen}
//         onClose={() => {
//           setEditModalOpen(false);
//           dispatch(setSelectedBanner(null));
//           loadBanners();
//         }}
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
//   dot: "slate" | "emerald" | "sky" | "amber";
// }) {
//   const dotMap = {
//     slate: "bg-slate-400",
//     emerald: "bg-emerald-500",
//     sky: "bg-sky-500",
//     amber: "bg-amber-500",
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

// export default BannerTable;


"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { toast } from "react-toastify";
import { getSocket } from "@/services/lib/socket";
import {
  setBanners,
  setSelectedBanner,
  addBanner,
  updateBanner,
  removeBanner,
} from "@/redux/bannerSlice";
import {
  fetchBanner,
  fetchBannerById,
  toggleBannerStatus,
  deleteOfferBanner,
} from "@/services/bannerServices/BannerService";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import {
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaImage,
  FaSyncAlt,
  FaFileExcel,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Pagination from "./Pagination";
import LoadingState from "@/components/common/LoadingState";
import EditOfferBannerModal from "../productOffer/EditBannerModal";

/* =========================================================
   TYPES
========================================================= */
interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  isEnabled: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

type StatusFilter = "all" | "enabled" | "disabled" | "active" | "inactive";

const GCS_BASE = "https://storage.googleapis.com/magbee-ecommerce-media";

const resolveBannerSrc = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${GCS_BASE}/${url.replace(/^\/+/, "")}`;
};

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/* =========================================================
   COMPONENT
========================================================= */
const BannerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.banner);

  /* =======================================================
     STATES
  ======================================================= */
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  /* =======================================================
     FETCH ALL BANNERS
  ======================================================= */
  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBanner();
      dispatch(setBanners(res));
    } catch (error) {
      console.error("Failed to load banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */
  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  /* =======================================================
     SOCKET EVENTS
  ======================================================= */
  useEffect(() => {
    const socket = getSocket();

    socket.on("bannerCreated", (banner: Banner) => {
      dispatch(addBanner(banner));
      toast.info("New banner added");
    });

    socket.on("bannerUpdated", (banner: Banner) => {
      dispatch(updateBanner(banner));
    });

    socket.on("bannerDeleted", (id: number) => {
      dispatch(removeBanner(id));
    });

    socket.on("bannerStatusChanged", (banner: Banner) => {
      dispatch(updateBanner(banner));
    });

    return () => {
      socket.off("bannerCreated");
      socket.off("bannerUpdated");
      socket.off("bannerDeleted");
      socket.off("bannerStatusChanged");
    };
  }, [dispatch]);

  /* =======================================================
     STATS
  ======================================================= */
  const stats = useMemo(() => {
    let enabled = 0;
    let active = 0;
    let inactive = 0;

    for (const b of banners) {
      if (b.isEnabled) enabled += 1;
      if (b.isActive) active += 1;
      else inactive += 1;
    }

    return {
      total: banners.length,
      enabled,
      disabled: banners.length - enabled,
      active,
      inactive,
    };
  }, [banners]);

  /* =======================================================
     FILTER + SEARCH
  ======================================================= */
  const filteredData = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return banners.filter((b: Banner) => {
      if (statusFilter === "enabled" && !b.isEnabled) return false;
      if (statusFilter === "disabled" && b.isEnabled) return false;
      if (statusFilter === "active" && !b.isActive) return false;
      if (statusFilter === "inactive" && b.isActive) return false;

      if (!term) return true;
      return [b.title, b.subtitle, String(b.id)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [banners, searchTerm, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  /* =======================================================
     DELETE
  ======================================================= */
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await dispatch(deleteOfferBanner(id));
      toast.success("Banner deleted");
    } catch {
      toast.error("Failed to delete banner");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */
  const handleEdit = async (banner: Banner) => {
    try {
      await dispatch(fetchBannerById(banner.id));
      setEditModalOpen(true);
    } catch {
      toast.error("Failed to load banner details");
    }
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  /* =======================================================
     TOGGLE ENABLE / DISABLE
  ======================================================= */
  const handleToggleActive = async (id: number) => {
    try {
      setTogglingId(id);
      await dispatch(toggleBannerStatus(id));
      await loadBanners();
    } catch {
      toast.error("Error updating status");
    } finally {
      setTogglingId(null);
    }
  };

  /* =======================================================
     EXPORT FILTERED BANNERS TO EXCEL (.xls)
  ======================================================= */
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      toast.info("No banners available to export");
      return;
    }

    const headers = [
      "ID",
      "Title",
      "Subtitle",
      "Enabled",
      "Live Status",
      "Start Date",
      "End Date",
      "Image URL",
    ];

    const rows = filteredData.map((b: Banner) => [
      `#${String(b.id).padStart(4, "0")}`,
      b.title || "",
      b.subtitle || "",
      b.isEnabled ? "Enabled" : "Disabled",
      b.isActive ? "Live" : "Inactive",
      formatDate(b.startDate),
      formatDate(b.endDate),
      resolveBannerSrc(b.imageUrl),
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
          .map(
            (val) => `<Cell><Data ss:Type="String">${escapeXml(val)}</Data></Cell>`
          )
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
  <Worksheet ss:Name="Banners">
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
    link.download = `banners-report_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredData.length} banner(s) to Excel`);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  /* =======================================================
     RENDER
  ======================================================= */
  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* TOP HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Marketing / Banners
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Banner Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage promotional creatives, live schedules, and enable/disable states.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={loadBanners}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              <FaSyncAlt
                className={`h-3 w-3 ${loading ? "animate-spin text-brand-500" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredData.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <FaFileExcel className="h-3.5 w-3.5" />
              <span>Export Excel ({filteredData.length})</span>
            </button>

            <Link
              href="/banner"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
            >
              <FaPlus className="h-3 w-3" />
              <span>New Banner</span>
            </Link>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <MetricCard label="Total Banners" value={stats.total} dot="slate" />
          <MetricCard label="Enabled" value={stats.enabled} dot="emerald" />
          <MetricCard label="Live Now" value={stats.active} dot="sky" />
          <MetricCard label="Inactive" value={stats.inactive} dot="amber" />
        </div>

        {/* MAIN PANEL */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* TABS */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/60 px-3 pt-2 dark:border-slate-800 dark:bg-slate-950/40">
            {(
              [
                { key: "all", label: "All", count: stats.total },
                { key: "enabled", label: "Enabled", count: stats.enabled },
                { key: "active", label: "Live", count: stats.active },
                { key: "disabled", label: "Disabled", count: stats.disabled },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                      active
                        ? "bg-slate-900 text-white dark:bg-brand-500 dark:text-white"
                        : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH + ADVANCED FILTER */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by ID, title, or subtitle..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`inline-flex items-center gap-2 self-start rounded-lg border px-3 py-2 text-xs font-medium transition sm:self-auto ${
                  showFilters
                    ? "border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-500 dark:text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <FaFilter className="h-3 w-3" />
                <span>More Filters</span>
                {showFilters ? (
                  <FaChevronUp className="h-2.5 w-2.5" />
                ) : (
                  <FaChevronDown className="h-2.5 w-2.5" />
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-3 flex flex-col gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/60 sm:flex-row sm:items-end">
                <div className="w-full sm:w-56">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status Filter
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as StatusFilter);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-brand-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="active">Live (Active)</option>
                    <option value="inactive">Not Live</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <Table className="w-full min-w-[920px] border-collapse text-left">
              <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                <TableRow className="border-b border-slate-200 dark:border-slate-800">
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Banner
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Preview
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Enabled
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Live Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Schedule
                  </TableCell>
                  <TableCell
                    isHeader
                    className="!px-4 !py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {loading && banners.length === 0 ? (
                  <LoadingState variant="table" rows={5} columns={7} />
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                        <FaImage className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          No banners found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Try clearing your search term or switching status tabs.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((item: Banner) => {
                    const imgSrc = resolveBannerSrc(item.imageUrl);
                    const isToggling = togglingId === item.id;

                    return (
                      <TableRow
                        key={item.id}
                        className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                      >
                        <TableCell className="!px-4 !py-3.5 align-middle font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          #{String(item.id).padStart(4, "0")}
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle">
                          <div className="max-w-xs">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item.title}
                            </p>
                            {item.subtitle && (
                              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle">
                          <div className="h-10 w-20 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400 dark:text-slate-500">
                                No image
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={() => handleToggleActive(item.id)}
                              title={
                                item.isEnabled
                                  ? "Disable banner"
                                  : "Enable banner"
                              }
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
                                item.isEnabled
                                  ? "bg-emerald-600"
                                  : "bg-slate-300 dark:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs transition-transform ${
                                  item.isEnabled
                                    ? "translate-x-4.5"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-xs font-medium ${
                                item.isEnabled
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {item.isEnabled ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.isActive
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30"
                                : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {item.isActive ? "Live" : "Inactive"}
                          </span>
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle whitespace-nowrap text-xs text-slate-600 tabular-nums dark:text-slate-400">
                          <p>{formatDate(item.startDate)}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            to {formatDate(item.endDate)}
                          </p>
                        </TableCell>

                        <TableCell className="!px-4 !py-3.5 align-middle text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit banner"
                              className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            >
                              <FaEdit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              title="Delete banner"
                              className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                            >
                              <MdDeleteForever className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditOfferBannerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          dispatch(setSelectedBanner(null));
          loadBanners();
        }}
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
  dot: "slate" | "emerald" | "sky" | "amber";
}) {
  const dotMap = {
    slate: "bg-slate-400",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
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

export default BannerTable;