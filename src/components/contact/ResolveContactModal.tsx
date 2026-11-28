"use client";

import React, { useEffect } from "react";
import {
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaTag,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

export interface ContactType {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isResolved: boolean;
  resolutionMessage?: string;
  createdAt: string;
}

interface ResolveContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContact: ContactType | null;
  resolveMessage: string;
  setResolveMessage: React.Dispatch<React.SetStateAction<string>>;
  handleResolve: () => void;
  isSubmitting?: boolean;
}

const ResolveContactModal: React.FC<ResolveContactModalProps> = ({
  isOpen,
  onClose,
  selectedContact,
  resolveMessage,
  setResolveMessage,
  handleResolve,
  isSubmitting = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !selectedContact) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolve-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* DRAWER HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2
                id="resolve-drawer-title"
                className="text-base font-semibold text-slate-900"
              >
                Inquiry #{selectedContact.id}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedContact.isResolved
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                }`}
              >
                {selectedContact.isResolved ? (
                  <FaCheckCircle className="h-3 w-3" />
                ) : (
                  <FaClock className="h-3 w-3" />
                )}
                {selectedContact.isResolved ? "Resolved" : "Pending"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Received on{" "}
              {new Date(selectedContact.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close drawer"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* SENDER METADATA */}
          <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 text-xs">
              <FaUser className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400">Name</p>
                <p className="truncate font-medium text-slate-800">
                  {selectedContact.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <FaPhone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400">Phone</p>
                <p className="truncate font-medium text-slate-800">
                  {selectedContact.phone || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:col-span-2">
              <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400">Email</p>
                <p className="truncate font-medium text-slate-800">
                  {selectedContact.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:col-span-2">
              <FaTag className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-400">Subject</p>
                <p className="font-medium text-slate-800">
                  {selectedContact.subject}
                </p>
              </div>
            </div>
          </div>

          {/* CUSTOMER MESSAGE */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Customer Message
            </label>
            <div className="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-700">
              {selectedContact.message}
            </div>
          </div>

          {/* PREVIOUS RESOLUTION NOTE (IF ALREADY RESOLVED) */}
          {selectedContact.isResolved && selectedContact.resolutionMessage && (
            <div className="space-y-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3.5">
              <p className="text-xs font-semibold text-emerald-800">
                Previous Resolution Note
              </p>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-emerald-900/80">
                {selectedContact.resolutionMessage}
              </p>
            </div>
          )}

          {/* RESOLUTION FORM */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="resolution-note"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                Resolution Response
              </label>
              <span className="text-[11px] text-slate-400">
                {resolveMessage.length} chars
              </span>
            </div>

            <textarea
              id="resolution-note"
              rows={5}
              value={resolveMessage}
              onChange={(e) => setResolveMessage(e.target.value)}
              disabled={isSubmitting}
              placeholder="Write how this query was resolved or the reply sent to the customer..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleResolve}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isSubmitting && <FaSpinner className="h-3.5 w-3.5 animate-spin" />}
            {isSubmitting
              ? "Saving..."
              : selectedContact.isResolved
              ? "Update Resolution"
              : "Mark as Resolved"}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ResolveContactModal;