"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { toast }
from "react-toastify";

import {
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaDownload,
  FaEye,
  FaStar,
  FaUserCircle,
  FaCalendarAlt,
  FaSpinner,
  FaInbox,
  FaCheckDouble,
} from "react-icons/fa";

import {
  MdMessage,
  MdOutlineMarkEmailRead,
} from "react-icons/md";

import {
  getAllContactsAPI,
  updateContactStatusAPI,
} from "@/services/contactService";

import ResolveContactModal
from "@/components/contact/ResolveContactModal";

interface ContactType {
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

const ContactManagementPage =
() => {

  const [contacts, setContacts] =
    useState<ContactType[]>([]);

  const [
    filteredContacts,
    setFilteredContacts,
  ] =
    useState<ContactType[]>([]);

  const [loading, setLoading] =
    useState<boolean>(false);

  const [
    selectedContact,
    setSelectedContact,
  ] =
    useState<ContactType | null>(
      null
    );

  const [
    resolveMessage,
    setResolveMessage,
  ] = useState<string>("");

  const [modalOpen, setModalOpen] =
    useState<boolean>(false);

  const [searchTerm, setSearchTerm] =
    useState<string>("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<string>("all");

  const [
    selectedContacts,
    setSelectedContacts,
  ] =
    useState<number[]>([]);

  // Stats
  const totalContacts =
    contacts.length;

  const pendingContacts =
    contacts.filter(
      (c) => !c.isResolved
    ).length;

  const resolvedContacts =
    contacts.filter(
      (c) => c.isResolved
    ).length;

  const urgentContacts =
    contacts.filter(
      (c) =>
        !c.isResolved &&
        new Date(c.createdAt) >
          new Date(
            Date.now() -
              2 *
                24 *
                60 *
                60 *
                1000
          )
    ).length;

  // Fetch Contacts
  const fetchContacts =
    async () => {

      try {

        setLoading(true);

        const response =
          await getAllContactsAPI();

        setContacts(
          response.data || []
        );

        setFilteredContacts(
          response.data || []
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch contacts"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchContacts();

  }, []);

  // Filter Contacts
  useEffect(() => {

    let filtered = [...contacts];

    if (searchTerm) {

      filtered = filtered.filter(
        (contact) =>
          contact.name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          contact.email
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          contact.subject
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          contact.message
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

    }

    if (
      statusFilter !== "all"
    ) {

      filtered = filtered.filter(
        (contact) =>
          statusFilter ===
          "resolved"
            ? contact.isResolved
            : !contact.isResolved
      );

    }

    setFilteredContacts(
      filtered
    );

  }, [
    searchTerm,
    statusFilter,
    contacts,
  ]);

  // Open Modal
  const openResolveModal = (
    contact: ContactType
  ) => {

    setSelectedContact(
      contact
    );

    setResolveMessage("");

    setModalOpen(true);

  };

  // Close Modal
  const closeModal = () => {

    setModalOpen(false);

    setSelectedContact(null);

    setResolveMessage("");

  };

  // Handle Resolve
  const handleResolve =
    async () => {

      if (!resolveMessage) {

        toast.error(
          "Resolution message required"
        );

        return;

      }

      if (!selectedContact)
        return;

      try {

        const response =
          await updateContactStatusAPI(
            selectedContact.id,
            {
              isResolved: true,
              resolutionMessage:
                resolveMessage,
            }
          );

        toast.success(
          response.message
        );

        fetchContacts();

        closeModal();

      } catch (error: any) {

        console.log(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Something went wrong"
        );

      }

    };

  // Bulk Resolve
  const handleBulkResolve =
    async () => {

      if (
        selectedContacts.length ===
        0
      ) {

        toast.error(
          "No contacts selected"
        );

        return;

      }

      try {

        for (
          const id of selectedContacts
        ) {

          await updateContactStatusAPI(
            id,
            {
              isResolved: true,
              resolutionMessage:
                "Bulk resolved by admin",
            }
          );

        }

        toast.success(
          `${selectedContacts.length} contacts resolved successfully`
        );

        setSelectedContacts(
          []
        );

        fetchContacts();

      } catch (error) {

        toast.error(
          "Failed to resolve contacts"
        );

      }

    };

  // Select All
  const selectAll = () => {

    if (
      selectedContacts.length ===
      filteredContacts.length
    ) {

      setSelectedContacts([]);

    } else {

      setSelectedContacts(
        filteredContacts.map(
          (c) => c.id
        )
      );

    }

  };

  // Toggle Selection
  const toggleSelection = (
    id: number
  ) => {

    if (
      selectedContacts.includes(id)
    ) {

      setSelectedContacts(
        selectedContacts.filter(
          (i) => i !== id
        )
      );

    } else {

      setSelectedContacts([
        ...selectedContacts,
        id,
      ]);

    }

  };

  // Export CSV
  const exportToCSV = () => {

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Status",
      "Date",
    ];

    const csvData =
      filteredContacts.map(
        (contact) => [
          contact.name,
          contact.email,
          contact.phone,
          contact.subject,
          contact.message,
          contact.isResolved
            ? "Resolved"
            : "Pending",
          new Date(
            contact.createdAt
          ).toLocaleDateString(),
        ]
      );

    const csvContent = [
      headers,
      ...csvData,
    ]
      .map((row) =>
        row.join(",")
      )
      .join("\n");

    const blob =
      new Blob([csvContent], {
        type: "text/csv",
      });

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      "contacts.csv";

    a.click();

    URL.revokeObjectURL(url);

  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Contact Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage customer queries
            </p>

          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
          >
            <FaDownload />
            Export
          </button>

        </div>

      </div>

      <ResolveContactModal
        isOpen={modalOpen}
        onClose={closeModal}
        selectedContact={
          selectedContact
        }
        resolveMessage={
          resolveMessage
        }
        setResolveMessage={
          setResolveMessage
        }
        handleResolve={
          handleResolve
        }
      />

    </div>
  );

};

export default ContactManagementPage;