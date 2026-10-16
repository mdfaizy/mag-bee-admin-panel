"use client";

import React from "react";

import {
  FaTimes,
  FaEnvelope,
  FaUser,
  FaTag,
} from "react-icons/fa";

import { Modal } from "@/components/ui/modal";

interface ContactType {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isResolved: boolean;
}

interface ResolveContactModalProps {
  isOpen: boolean;

  onClose: () => void;

  selectedContact: ContactType | null;

  resolveMessage: string;

  setResolveMessage:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  handleResolve: () => void;
}

const ResolveContactModal: React.FC<
  ResolveContactModalProps
> = ({
  isOpen,
  onClose,
  selectedContact,
  resolveMessage,
  setResolveMessage,
  handleResolve,
}) => {
return (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-xl p-0"
  >
    <div className="overflow-hidden rounded-2xl bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Resolve Issue
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Send response to customer
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>

      {/* BODY */}
      <div className="space-y-3 p-5">
        {/* CUSTOMER INFO */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="space-y-2 text-xs">
            {/* NAME */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaUser className="text-blue-500" />

              <span>
                {selectedContact?.name}
              </span>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaEnvelope className="text-green-500" />

              <span>
                {selectedContact?.email}
              </span>
            </div>

            {/* SUBJECT */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaTag className="text-orange-500" />

              <span>
                {selectedContact?.subject}
              </span>
            </div>
          </div>
        </div>

        {/* CUSTOMER MESSAGE */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Customer Message
          </label>

          <div className="max-h-24 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-700">
            {selectedContact?.message}
          </div>
        </div>

        {/* RESOLUTION */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Resolution Message
          </label>

          <textarea
            rows={3}
            value={resolveMessage}
            onChange={(e) =>
              setResolveMessage(
                e.target.value
              )
            }
            placeholder="Write resolution..."
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleResolve}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Resolve
        </button>
      </div>
    </div>
  </Modal>
);
};

export default ResolveContactModal;