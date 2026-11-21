
import { apiConnector } from "@/services/apiConnector";
import { BASE_URL } from "@/services/apis";

// ==============================
// Enquiry Types
// ==============================

export type EnquiryType =
  | "RFQ"
  | "PRICE_INQUIRY"
  | "BULK_PURCHASE"
  | "TECHNICAL_INFORMATION"
  | "PRODUCT_DEMO"
  | "OTHER";

export type EnquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "IN_PROGRESS"
  | "QUOTATION_SENT"
  | "FOLLOW_UP"
  | "CONVERTED"
  | "LOST"
  | "CLOSED";

export type EnquiryPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export type EnquirySource =
  | "WEBSITE"
  | "PHONE"
  | "EMAIL"
  | "WHATSAPP"
  | "OTHER";

export type PreferredContact =
  | "WHATSAPP"
  | "PHONE"
  | "EMAIL"
  | null;

// ==============================
// Enquiry Interface
// ==============================

export interface LabEnquiry {
  id: number;

  fullName: string;
  phone: string;
  email: string;

  companyName?: string | null;

  productId?: number | null;
  productName: string;
  productCode?: string | null;
  productSlug: string;
  categorySlug: string;

  quantity: number;
  message?: string | null;

  enquiryType: EnquiryType;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  source: EnquirySource;

  preferredContact?: PreferredContact;

  assignedToId?: number | null;

  internalNotes?: string | null;

  followUpAt?: string | null;
  lastContactedAt?: string | null;

  quotedAmount?: number | null;
  currency?: string | null;

  quotationReference?: string | null;
  quotationSentAt?: string | null;

  lostReason?: string | null;

  adminEmailSent?: boolean;
  customerEmailSent?: boolean;
  emailError?: string | null;

  createdAt: string;
  updatedAt: string;
}

// ==============================
// Pagination Interface
// ==============================

export interface EnquiryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==============================
// API Response Interfaces
// ==============================

export interface EnquiryListResponse {
  success: boolean;
  message: string;

  data: {
    items: LabEnquiry[];
    pagination: EnquiryPagination;
  };
}

export interface EnquirySingleResponse {
  success: boolean;
  message: string;
  data: LabEnquiry;
}

// ==============================
// Create Enquiry Payload
// ==============================

export interface CreateLabEnquiryPayload {
  fullName: string;
  phone: string;
  email: string;

  companyName?: string | null;

  productId?: number | null;
  productName: string;
  productCode?: string | null;
  productSlug: string;
  categorySlug: string;

  quantity: number;
  message?: string;

  enquiryType: EnquiryType;

  preferredContact?: PreferredContact;

  source?: EnquirySource;
}

// ==============================
// Update Enquiry Payload
// ==============================

export interface UpdateLabEnquiryPayload {
  fullName?: string;
  phone?: string;
  email?: string;

  companyName?: string | null;

  quantity?: number;
  message?: string | null;

  enquiryType?: EnquiryType;
  priority?: EnquiryPriority;
  status?: EnquiryStatus;

  preferredContact?: PreferredContact;

  assignedToId?: number | null;

  internalNotes?: string | null;
  followUpAt?: string | null;
  lastContactedAt?: string | null;

  quotedAmount?: number | null;
  currency?: string | null;

  quotationReference?: string | null;
  quotationSentAt?: string | null;

  lostReason?: string | null;
}

// ==============================
// GET ALL ENQUIRIES
// GET /lab-enquiries
// ==============================

export const getAllLabEnquiriesApi = async () => {
  const response = await apiConnector(
    "GET",
    `${BASE_URL}/lab-enquiries`
  );

  return response?.data;
};

// ==============================
// GET ENQUIRY BY ID
// GET /lab-enquiries/:id
// ==============================

export const getLabEnquiryByIdApi = async (
  id: number
) => {
  const response = await apiConnector(
    "GET",
    `${BASE_URL}/lab-enquiries/${id}`
  );

  return response?.data;
};

// ==============================
// CREATE ENQUIRY
// POST /lab-enquiries
// ==============================

export const createLabEnquiryApi = async (
  payload: CreateLabEnquiryPayload
) => {
  const response = await apiConnector(
    "POST",
    `${BASE_URL}/lab-enquiries`,
    payload
  );

  return response?.data;
};

// ==============================
// UPDATE ENQUIRY STATUS
// PATCH /lab-enquiries/:id/status
// ==============================

export const updateLabEnquiryStatusApi = async (
  id: number,
  status: EnquiryStatus
) => {
  const response = await apiConnector(
    "PATCH",
    `${BASE_URL}/lab-enquiries/${id}/status`,
    { status }
  );

  return response?.data;
};

// ==============================
// UPDATE ENQUIRY
// PATCH /lab-enquiries/:id
// ==============================

export const updateLabEnquiryApi = async (
  id: number,
  payload: UpdateLabEnquiryPayload
) => {
  const response = await apiConnector(
    "PATCH",
    `${BASE_URL}/lab-enquiries/${id}`,
    payload
  );

  return response?.data;
};

// ==============================
// DELETE ENQUIRY
// DELETE /lab-enquiries/:id
// ==============================

export const deleteLabEnquiryApi = async (
  id: number
) => {
  const response = await apiConnector(
    "DELETE",
    `${BASE_URL}/lab-enquiries/${id}`
  );

  return response?.data;
};
