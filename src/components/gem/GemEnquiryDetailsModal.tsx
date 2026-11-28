"use client";

import React, { useEffect } from "react";
import {
  MdClose,
  MdBusiness,
  MdPerson,
  MdDescription,
  MdDownload,
  MdEdit,
  MdDelete,
  MdVerifiedUser,
} from "react-icons/md";
import LoadingState from "../common/LoadingState";

export type GemEnquiryStatusType =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "QUOTATION_SENT"
  | "FOLLOW_UP"
  | "CONVERTED"
  | "REJECTED";

export interface GemEnquiry {
  id: number;
  organizationName?: string;
  departmentName?: string | null;
  organizationType?: string;
  gemBuyerId?: string | null;

  fullName?: string;
  name?: string;
  designation?: string | null;
  officialEmail?: string;
  email?: string;
  mobileNumber?: string;
  phone?: string;
  fullAddress?: string | null;
  address?: string;

  productSpecification?: string;
  requirementDocument?: string | null;
  tenderDocument?: string | null;

  informationConfirmed?: boolean;
  contactConsent?: boolean;

  status?: GemEnquiryStatusType | string;
  assignedTo?: number | string | null;
  adminNotes?: string | null;

  createdAt?: string | Date;
  updatedAt?: string | Date;

  [key: string]: any;
}

interface Props {
  open: boolean;
  enquiry: GemEnquiry | null;
  loading: boolean;
  status: string;
  setStatus: (value: string) => void;
  assignedTo: string;
  setAssignedTo: (value: string) => void;
  adminNotes: string;
  setAdminNotes: (value: string) => void;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id: number) => void;
  onDocumentDownload: (
    id: number,
    type: "requirement" | "tender"
  ) => void;
}

const GEM_ENQUIRY_STATUSES: { value: GemEnquiryStatusType; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "QUOTATION_SENT", label: "Quotation Sent" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CONVERTED", label: "Converted" },
  { value: "REJECTED", label: "Rejected" },
];

const getStatusBadgeClass = (value?: string) => {
  switch (value) {
    case "CONVERTED":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20";
    case "QUOTATION_SENT":
    case "QUALIFIED":
      return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20";
    case "CONTACTED":
    case "FOLLOW_UP":
      return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20";
    case "NEW":
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";
  }
};

const formatDate = (value?: string | Date) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const DetailItem = ({
  label,
  value,
  spanFull = false,
}: {
  label: string;
  value?: string | number | null;
  spanFull?: boolean;
}) => (
  <div className={spanFull ? "sm:col-span-2" : ""}>
    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-0.5 break-words text-xs font-medium text-slate-800 sm:text-sm">
      {value || value === 0 ? value : "—"}
    </p>
  </div>
);

const Section = ({
  title,
  icon,
  children,
  gridCols = "sm:grid-cols-2",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  gridCols?: string;
}) => (
  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/80 px-4 py-2.5">
      <span className="text-slate-500">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        {title}
      </h3>
    </div>
    <div className={`grid grid-cols-1 gap-4 p-4 ${gridCols}`}>{children}</div>
  </section>
);

const GemEnquiryDetailsModal: React.FC<Props> = ({
  open,
  enquiry,
  loading,
  status,
  setStatus,
  assignedTo,
  setAssignedTo,
  adminNotes,
  setAdminNotes,
  saving,
  onClose,
  onSave,
  onDelete,
  onDocumentDownload,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, saving, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!saving) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gem-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-slate-50/60 shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2
                id="gem-drawer-title"
                className="text-base font-semibold text-slate-900"
              >
                {enquiry ? `GeM Enquiry #${enquiry.id}` : "GeM Enquiry Details"}
              </h2>
              {(status || enquiry?.status) && (
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                    status || enquiry?.status
                  )}`}
                >
                  {(status || enquiry?.status || "NEW").replaceAll("_", " ")}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {enquiry?.organizationName ||
                "Inspect buyer details, documents, and update workflow status."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close details drawer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {loading ? (
          //   <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-500 sm:text-sm">
          //     Loading enquiry details...
          //   </div>
           <LoadingState variant="table" rows={5} columns={6} />
          ) : !enquiry ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-500 sm:text-sm">
              Enquiry details not available.
            </div>
         
          ) : (
            <>
              {/* ADMIN WORKFLOW & ASSIGNMENT */}
              <Section title="Admin Management" icon={<MdEdit size={16} />}>
                <div>
                  <label
                    htmlFor="gem-status-select"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Status
                  </label>
                  <select
                    id="gem-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={saving}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 sm:text-sm"
                  >
                    {GEM_ENQUIRY_STATUSES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gem-assigned-input"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Assigned To (Employee / Admin ID)
                  </label>
                  <input
                    id="gem-assigned-input"
                    type="number"
                    min={1}
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={saving}
                    placeholder="e.g. 101"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="gem-admin-notes"
                    className="mb-1.5 block text-xs font-medium text-slate-700"
                  >
                    Admin Notes
                  </label>
                  <textarea
                    id="gem-admin-notes"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={saving}
                    placeholder="Internal remarks, quotation notes, or follow-up updates..."
                    className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 sm:text-sm"
                  />
                </div>
              </Section>

              {/* ORGANIZATION */}
              <Section
                title="Organization Details"
                icon={<MdBusiness size={16} />}
              >
                <DetailItem
                  label="Organization Name"
                  value={enquiry.organizationName}
                />
                <DetailItem label="Department" value={enquiry.departmentName} />
                <DetailItem
                  label="Organization Type"
                  value={enquiry.organizationType}
                />
                <DetailItem label="GeM Buyer ID" value={enquiry.gemBuyerId} />
              </Section>

              {/* CONTACT */}
              <Section title="Contact Details" icon={<MdPerson size={16} />}>
                <DetailItem
                  label="Full Name"
                  value={enquiry.fullName || enquiry.name}
                />
                <DetailItem label="Designation" value={enquiry.designation} />
                <DetailItem
                  label="Official Email"
                  value={enquiry.officialEmail || enquiry.email}
                />
                <DetailItem
                  label="Mobile Number"
                  value={enquiry.mobileNumber || enquiry.phone}
                />
                <DetailItem
                  label="Address"
                  value={enquiry.fullAddress || enquiry.address}
                  spanFull
                />
              </Section>

              {/* PRODUCT REQUIREMENT */}
              <Section
                title="Product Requirement"
                icon={<MdDescription size={16} />}
                gridCols="grid-cols-1"
              >
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Specification
                  </p>
                  <div className="whitespace-pre-wrap rounded-lg border border-slate-200/80 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {enquiry.productSpecification || "—"}
                  </div>
                </div>
              </Section>

              {/* DOCUMENTS */}
              <Section title="Documents" icon={<MdDownload size={16} />}>
                <DocumentRow
                  title="Requirement Document"
                  available={!!enquiry.requirementDocument}
                  onClick={() =>
                    onDocumentDownload(enquiry.id, "requirement")
                  }
                />
                <DocumentRow
                  title="Tender Document"
                  available={!!enquiry.tenderDocument}
                  onClick={() => onDocumentDownload(enquiry.id, "tender")}
                />
              </Section>

              {/* CONSENT & TIMELINE */}
              <Section
                title="Consent & Timeline"
                icon={<MdVerifiedUser size={16} />}
              >
                <DetailItem
                  label="Information Confirmed"
                  value={enquiry.informationConfirmed ? "Yes" : "No"}
                />
                <DetailItem
                  label="Contact Consent"
                  value={enquiry.contactConsent ? "Yes" : "No"}
                />
                <DetailItem
                  label="Created At"
                  value={formatDate(enquiry.createdAt)}
                />
                <DetailItem
                  label="Last Updated"
                  value={formatDate(enquiry.updatedAt)}
                />
              </Section>
            </>
          )}
        </div>

        {/* DRAWER FOOTER */}
        {enquiry && !loading && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3.5">
            <button
              type="button"
              onClick={() => onDelete(enquiry.id)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
            >
              <MdDelete size={16} />
              Delete
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

function DocumentRow({
  title,
  available,
  onClick,
}: {
  title: string;
  available: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {available ? "File attached" : "Not uploaded"}
        </p>
      </div>

      {available ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <MdDownload size={15} />
          Open
        </button>
      ) : (
        <span className="shrink-0 text-[11px] font-medium text-slate-400">
          —
        </span>
      )}
    </div>
  );
}

export default GemEnquiryDetailsModal;