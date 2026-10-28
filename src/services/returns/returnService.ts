import { apiConnector } from "../apiConnector";

// Backend: magbee-admin src/routes/returnRoutes.ts (axios baseURL already ends in /api).
// All routes are staff-only (requireStaff); refund / COD payout actions also
// require a refund-approver role (requireRefundApprover). The UI hides what
// the user can't do, but the backend is the authority.

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PICKUP_SCHEDULED"
  | "PICKED_UP"
  | "RECEIVED"
  | "INSPECTION"
  | "REFUND_PENDING"
  | "REPLACEMENT_PROCESSING"
  | "COMPLETED"
  | "CANCELLED";

export type ReturnRefundStatus = "NOT_STARTED" | "PROCESSING" | "PENDING" | "SUCCESS" | "FAILED";

export type CodRefundStatus =
  | "PENDING_DETAILS"
  | "DETAILS_SUBMITTED"
  | "VERIFIED"
  | "PAYOUT_PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REVERSED";

export type CodRefundAction = "verify" | "processing" | "paid" | "failed";

export interface ReturnItem {
  id: number;
  orderItemId: number;
  quantity: number;
  orderItem?: {
    id: number;
    quantity: number;
    price?: number | string;
    product?: { id: number; name?: string; images?: Array<{ imageUrl?: string; thumbnail?: string }> };
    variant?: { id?: number; name?: string } | null;
  };
}

export interface CodRefund {
  id: number;
  method: "BANK" | "UPI" | null;
  accountHolderName: string | null;
  accountNumber: string | null;
  ifsc: string | null;
  upiId: string | null;
  amount: number | string;
  status: CodRefundStatus;
  failureReason?: string | null;
  // Payout reference saved when staff mark the payout paid
  payoutId?: string | null;
  verifiedAt?: string | null;
  paidAt?: string | null;
}

export interface ReturnRequest {
  id: number;
  orderId: number;
  customerId: number;
  type: "RETURN" | "REPLACEMENT";
  /** replacement dispatch recorded by staff */
  exchangeAwbCode?: string | null;
  exchangeCourierName?: string | null;
  exchangeShippedAt?: string | null;
  exchangeDeliveredAt?: string | null;
  status: ReturnStatus;
  reason: string;
  customerComment: string | null;
  rejectionReason: string | null;
  returnAwbCode: string | null;
  returnShipmentId: string | null;
  returnProviderStatus: string | null;
  pickupScheduledAt: string | null;
  receivedAt: string | null;
  inspectedAt: string | null;
  approvedAt: string | null;
  cancelledAt: string | null;
  refundAmount: number | string | null;
  refundStatus: ReturnRefundStatus;
  refundInitiatedAt: string | null;
  refundedAt: string | null;
  refundFailureReason: string | null;
  restocked: boolean;
  createdAt: string;
  updatedAt: string;
  items: ReturnItem[];
  order?: {
    id: number;
    orderCode?: string;
    totalAmount?: number | string;
    paymentMethod?: string;
    paymentStatus?: string;
    status?: string;
  };
  customer?: { id: number; name?: string; email?: string; phoneNumber?: string | null };
  codRefund?: CodRefund | null;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const id = (value: number | string) => encodeURIComponent(String(value));

export const listReturns = async (params: {
  page?: number;
  limit?: number;
  status?: ReturnStatus | "";
  type?: "RETURN" | "REPLACEMENT" | "";
  orderId?: number | "";
}): Promise<Paginated<ReturnRequest>> => {
  const query: Record<string, string | number> = {
    page: params.page || 1,
    limit: params.limit || 20,
  };
  if (params.status) query.status = params.status;
  if (params.type) query.type = params.type;
  if (params.orderId) query.orderId = params.orderId;

  const response = await apiConnector("GET", "/admin/returns", undefined, { params: query });

  return {
    data: Array.isArray(response.data?.data) ? response.data.data : [],
    pagination: response.data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
};

export const getReturn = async (returnRequestId: number): Promise<ReturnRequest> => {
  const response = await apiConnector("GET", `/admin/returns/${id(returnRequestId)}`);
  return response.data?.data;
};

export const approveReturn = async (returnRequestId: number) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/approve`)).data;

export const rejectReturn = async (returnRequestId: number, reason: string) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/reject`, { reason })).data;

// Books the reverse pickup with the courier (from REQUESTED this also approves)
export const bookReturnPickup = async (returnRequestId: number) =>
  (await apiConnector("POST", `/returns/${id(returnRequestId)}/pickup`)).data;

/** Refund instead of replacing: turns a replacement request into a refund return */
export const convertReplacementToRefund = async (returnRequestId: number) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/convert-to-refund`)).data;

/** After the inspection passed: staff shipped the replacement themselves */
export const dispatchReplacement = async (
  returnRequestId: number,
  body: { awbNumber: string; courierName: string }
) => (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/replacement/dispatch`, body)).data;

/** The replacement reached the customer: completes the request */
export const completeReplacement = async (returnRequestId: number) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/replacement/complete`)).data;

export const markReturnReceived = async (returnRequestId: number) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/receive`)).data;

// QC result. The backend caps refundAmount at what the customer paid.
export const completeInspection = async (
  returnRequestId: number,
  body: { approved: boolean; refundAmount?: number; rejectionReason?: string; restock?: boolean }
) => (await apiConnector("POST", `/returns/${id(returnRequestId)}/inspect`, body)).data;

// Prepaid RETURN only: gateway refund (idempotent on the backend)
export const refundReturn = async (returnRequestId: number) =>
  (await apiConnector("POST", `/admin/returns/${id(returnRequestId)}/refund`)).data;

// COD payout lifecycle
export const transitionCodRefund = async (
  codRefundId: number,
  action: CodRefundAction,
  body: { payoutReference?: string; reason?: string } = {}
) => (await apiConnector("POST", `/admin/cod-refunds/${id(codRefundId)}/${action}`, body)).data;

// Default mirrors backend REFUND_APPROVER_ROLES; set NEXT_PUBLIC_REFUND_APPROVER_ROLES
// to the same value if the backend list is customised.
export const REFUND_APPROVER_ROLES = String(
  process.env.NEXT_PUBLIC_REFUND_APPROVER_ROLES || "SUPER_ADMIN,ADMIN"
)
  .split(",")
  .map((role) => role.trim().toUpperCase())
  .filter(Boolean);

export const isRefundApprover = (role?: string | null) =>
  REFUND_APPROVER_ROLES.includes(String(role || "").toUpperCase());

export const getApiError = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;
