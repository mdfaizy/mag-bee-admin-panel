// "use client";

// import { X, Package, ImageOff, CheckCircle2, XCircle, Tag, Layers, MapPin, Settings, Factory } from "lucide-react";
// import { LabEquipment } from "@/services/labEquipmentService";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   equipment: LabEquipment | null;
// }

// // Spec Item Component (Clean & Modern)
// function SpecItem({ icon, label, value }: { icon?: React.ReactNode, label: string, value: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
//       <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
//         {icon} {label}
//       </div>
//       <div className="text-sm font-medium text-slate-800">
//         {value || "-"}
//       </div>
//     </div>
//   );
// }

// export default function ViewEquipmentModal({ isOpen, onClose, equipment }: Props) {
//   if (!isOpen || !equipment) return null;

//   // Primary Image nikalne ka logic
//   const imageUrl = equipment.media?.find((m) => m.isPrimary)?.mediaUrl || equipment.media?.[0]?.mediaUrl;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
//         onClick={onClose} 
//       />

//       {/* Modal Box */}
//       <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        
//         {/* Header */}
//         <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//               <Package size={20} />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-slate-900">Equipment Details</h2>
//               <p className="text-xs text-slate-500 font-medium">ID: #{equipment.id}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8">
//           <div className="flex flex-col gap-8 lg:flex-row">
            
//             {/* LEFT: Image Section */}
//             <div className="w-full shrink-0 lg:w-[350px]">
//               <div className="sticky top-0">
//                 <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm overflow-hidden group">
//                   {imageUrl ? (
//                     <img 
//                       src={imageUrl} 
//                       alt={equipment.name} 
//                       className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
//                     />
//                   ) : (
//                     <div className="text-center">
//                       <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
//                         <ImageOff size={24} className="text-slate-400" />
//                       </div>
//                       <span className="text-xs font-medium text-slate-500">No Image Available</span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Status & Badges */}
//                 <div className="mt-4 flex flex-wrap gap-2">
//                   <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
//                     <Tag size={14} className="text-slate-400" /> 
//                     {equipment.productCode}
//                   </span>
                  
//                   {equipment.isActive ? (
//                     <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
//                       <CheckCircle2 size={14} /> Active
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
//                       <XCircle size={14} /> Inactive
//                     </span>
//                   )}
                  
//                   {equipment.isFeatured && (
//                     <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200">
//                       ★ Featured
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT: Details Section */}
//             <div className="flex-1 space-y-6">
              
//               {/* Title */}
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900 leading-tight">
//                   {equipment.name}
//                 </h1>
//               </div>

//               {/* Specs Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <SpecItem 
//                   icon={<Layers size={14} />} 
//                   label="Category" 
//                   value={equipment.category?.name} 
//                 />
//                 <SpecItem 
//                   icon={<Layers size={14} />} 
//                   label="Sub Category" 
//                   value={equipment.subCategory?.name} 
//                 />
//                 <SpecItem 
//                   icon={<Settings size={14} />} 
//                   label="Model Number" 
//                   value={equipment.modelNumber} 
//                 />
//                 <SpecItem 
//                   icon={<Factory size={14} />} 
//                   label="Manufacturer" 
//                   value={equipment.manufacturer} 
//                 />
//                 <SpecItem 
//                   icon={<MapPin size={14} />} 
//                   label="Origin" 
//                   value={equipment.origin} 
//                 />
//                 <SpecItem 
//                   icon={<CheckCircle2 size={14} />} 
//                   label="Standards" 
//                   value={equipment.standards} 
//                 />
//               </div>

//               {/* Description (Rich Text) */}
//               <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//                 <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
//                   <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
//                     Description
//                   </h4>
//                 </div>
//                 <div className="p-5">
//                   {equipment.description ? (
//                     <div
//                       className="prose prose-sm md:prose-base max-w-none text-slate-600 
//                       prose-p:leading-relaxed prose-p:mb-3 
//                       prose-strong:text-slate-900 prose-strong:font-bold 
//                       prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-3 
//                       prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-3 
//                       prose-table:w-full prose-table:border-collapse 
//                       prose-th:border prose-th:border-slate-300 prose-th:bg-slate-100 prose-th:p-2 prose-th:text-left
//                       prose-td:border prose-td:border-slate-300 prose-td:p-2"
//                       dangerouslySetInnerHTML={{ __html: equipment.description }}
//                     />
//                   ) : (
//                     <p className="text-sm text-slate-500 italic">No description provided for this equipment.</p>
//                   )}
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="border-t border-slate-100 bg-white px-6 py-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
//           >
//             Close Window
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect } from "react";
import {
  X,
  Package,
  ImageOff,
  CheckCircle2,
  XCircle,
  Tag,
  Layers,
  MapPin,
  Settings,
  Factory,
  Star,
} from "lucide-react";
import { LabEquipment } from "@/services/labEquipmentService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  equipment: LabEquipment | null;
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="break-words text-xs font-medium text-slate-800 dark:text-slate-200 sm:text-sm">
        {value || "—"}
      </div>
    </div>
  );
}

export default function ViewEquipmentModal({
  isOpen,
  onClose,
  equipment,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !equipment) return null;

  const imageUrl =
    equipment.media?.find((m) => m.isPrimary)?.mediaUrl ||
    equipment.media?.[0]?.mediaUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-equipment-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="view-equipment-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Equipment Details
              </h2>
              <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                ID #{equipment.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* OVERVIEW & MEDIA SECTION */}
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 p-2 dark:border-slate-800 dark:bg-slate-950 sm:w-36">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={equipment.name}
                    className="h-full w-full rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <ImageOff className="mx-auto mb-1 h-5 w-5 text-slate-400 dark:text-slate-600" />
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2.5">
                <h1 className="text-lg font-semibold leading-snug text-slate-900 dark:text-slate-100 sm:text-xl">
                  {equipment.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span>{equipment.productCode}</span>
                  </span>

                  {equipment.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                      <XCircle className="h-3 w-3" />
                      <span>Inactive</span>
                    </span>
                  )}

                  {equipment.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/30">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SPECIFICATIONS GRID */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <h3 className="mb-3.5 border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Specifications & Metadata
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SpecItem
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Category"
                value={equipment.category?.name}
              />
              <SpecItem
                icon={<Layers className="h-3.5 w-3.5" />}
                label="Sub Category"
                value={equipment.subCategory?.name}
              />
              <SpecItem
                icon={<Settings className="h-3.5 w-3.5" />}
                label="Model Number"
                value={equipment.modelNumber}
              />
              <SpecItem
                icon={<Factory className="h-3.5 w-3.5" />}
                label="Manufacturer"
                value={equipment.manufacturer}
              />
              <SpecItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Origin"
                value={equipment.origin}
              />
              <SpecItem
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Standards"
                value={equipment.standards}
              />
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40 sm:px-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Description
              </h3>
            </div>
            <div className="p-4 sm:p-5">
              {equipment.description ? (
                <div
                  className="prose prose-sm max-w-none text-slate-600 dark:prose-invert dark:text-slate-300 prose-p:mb-3 prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:mb-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:mb-3 prose-ol:list-decimal prose-ol:pl-5 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-slate-200 prose-th:bg-slate-50 prose-th:p-2 prose-th:text-left dark:prose-th:border-slate-700 dark:prose-th:bg-slate-800 prose-td:border prose-td:border-slate-200 prose-td:p-2 dark:prose-td:border-slate-700"
                  dangerouslySetInnerHTML={{ __html: equipment.description }}
                />
              ) : (
                <p className="text-xs italic text-slate-400 dark:text-slate-500 sm:text-sm">
                  No description provided for this equipment.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}