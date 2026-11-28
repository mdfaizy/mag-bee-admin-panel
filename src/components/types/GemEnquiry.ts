
export type GemEnquiryStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "QUOTED"
  | "COMPLETED"
  | "CANCELLED";

export interface GemEnquiry {
  id: number;
  organizationName: string;
  departmentName: string | null;
  organizationType: string | null;
  gemBuyerId: string | null;

  fullName: string;
  designation: string | null;
  officialEmail: string;
  mobileNumber: string;
  fullAddress: string | null;

  productSpecification: string | null;

  informationConfirmed: boolean;
  contactConsent: boolean;

  status: GemEnquiryStatus;

  requirementDocument: string | null;
  tenderDocument: string | null;

  adminNotes: string | null;
  assignedTo: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface GemEnquiryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GemEnquiryListResponse {
  success: boolean;
  message: string;
  data: GemEnquiry[];
  pagination: GemEnquiryPagination;
}

export interface GemEnquiryDetailsResponse {
  success: boolean;
  message: string;
  data: GemEnquiry;
}

export interface GemEnquiryUpdatePayload {
  status?: GemEnquiryStatus;
  adminNotes?: string | null;
  assignedTo?: string | null;
}

export interface GemEnquiryAPIResponse {
  success: boolean;
  message: string;
  data?: GemEnquiry;
}
