// "use client";
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { Modal } from '../ui/modal';
// import Button from '../ui/button/Button';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const ViewCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
//   const { selectedCategory } = useSelector((state: RootState) => state.category);

//   if (!selectedCategory) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
//       <div className="bg-white rounded-lg shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
//           <h2 className="text-xl font-bold text-white">Category Details</h2>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="space-y-4">
//             <div className="flex items-start">
//               <div className="w-1/3 font-medium text-gray-700">Name:</div>
//               <div className="w-2/3 text-gray-900 font-semibold">{selectedCategory.name}</div>
//             </div>

//             <div className="flex items-start">
//               <div className="w-1/3 font-medium text-gray-700">Description:</div>
//               <div className="w-2/3 text-gray-800">{selectedCategory.description || <span className="text-gray-400 italic">No description</span>}</div>
//             </div>

//             <div className="flex items-start">
//               <div className="w-1/3 font-medium text-gray-700">Slug:</div>
//               <div className="w-2/3 text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded text-sm">{selectedCategory.slug}</div>
//             </div>

//             {/* Uncomment if you need to show dates
//             <div className="flex items-start">
//               <div className="w-1/3 font-medium text-gray-700">Created At:</div>
//               <div className="w-2/3 text-gray-600 text-sm">
//                 {new Date(selectedCategory.createdAt).toLocaleString()}
//               </div>
//             </div>
            
//             <div className="flex items-start">
//               <div className="w-1/3 font-medium text-gray-700">Updated At:</div>
//               <div className="w-2/3 text-gray-600 text-sm">
//                 {new Date(selectedCategory.updatedAt).toLocaleString()}
//               </div>
//             </div>
//             */}

//             {selectedCategory.imageUrl && (
//               <div className="pt-2">
//                 <div className="font-medium text-gray-700 mb-2">Image:</div>
//                 <div className="border rounded-lg overflow-hidden">
//                   <img
//                     src={selectedCategory.imageUrl}
//                     alt={selectedCategory.name}
//                     className="w-full h-48 object-cover"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
//             <Button
//               onClick={onClose}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors duration-200"
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ViewCategoryModal;

"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ViewCategoryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { selectedCategory } = useSelector((state: RootState) => state.category);

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

  if (!isOpen || !selectedCategory) return null;

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[1px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-category-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2
                id="view-category-drawer-title"
                className="text-base font-semibold text-slate-900"
              >
                {selectedCategory.name}
              </h2>
              {/* <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedCategory.isActive
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                }`}
              >
                {selectedCategory.isActive ? "Active" : "Inactive"}
              </span> */}
            </div>
            <p className="text-xs text-slate-500">
              Category #{selectedCategory.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {selectedCategory.imageUrl && (
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200/80 bg-slate-50/80 px-4 py-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Cover Image
                </h3>
              </div>
              <div className="bg-slate-100/70 p-3">
                <img
                  src={selectedCategory.imageUrl}
                  alt={selectedCategory.name}
                  className="h-48 w-full rounded-lg object-contain"
                />
              </div>
            </section>
          )}

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
              Category Information
            </h3>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Slug
              </p>
              <div className="mt-1">
                {selectedCategory.slug ? (
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800">
                    {selectedCategory.slug}
                  </code>
                ) : (
                  <span className="text-sm text-slate-400">—</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Description
              </p>
              <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 sm:text-sm">
                {selectedCategory.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Created At
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-800 tabular-nums">
                  {formatDate(selectedCategory.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Updated At
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-800 tabular-nums">
                  {formatDate(selectedCategory.updatedAt)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-white px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ViewCategoryModal;