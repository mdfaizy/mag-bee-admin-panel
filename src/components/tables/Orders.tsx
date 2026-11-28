// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../ui/table";

// import { getSocket } from "@/services/lib/socket";
// import Image from "next/image";

// import {
//   cancelOrderWithReason,
//   downloadInvoice,
//   getAllOrders,
//   updateOrderStatus,
// } from "../../services/orders/ResentOrder";
// import CancelOrderModal from "@/components/orders/CancelOrderModal";
// import { getCancellationReasonLabel } from "@/utils/cancellationReasons";

// import Input from "../form/input/InputField";
// import Button from "../ui/button/Button";

// import OrderViewModal from "@/components/orders/OrderViewModal";

// import {
//   Search,
//   Download,
//   Eye,
//   ChevronUp,
//   ChevronDown,
//   SlidersHorizontal,
//   RefreshCw,
//   Package,
//   PackageOpen,
//   Truck,
//   Clock,
//   Calendar,
//   XCircle,
//   CheckCircle2,
//   ShoppingBag,
//   Undo2,
//   Lock,
//   MapPin,
//   CreditCard,
//   Phone,
//   Mail,
// } from "lucide-react";

// import { toast } from "react-toastify";

// /* =========================================================
//    ORDER STATUS
//    NOTE: values must stay identical to backend — do not rename.
// ========================================================= */

// type OrderStatus =
//   | "PENDING_PAYMENT"
//   | "CONFIRMED"
//   | "PACKED"
//   | "SHIPPED"
//   | "OUT_FOR_DELIVERY"
//   | "DELIVERED"
//   | "CANCELLED"
//   | "RETURN_REQUESTED"
//   | "RETURNED"
//   | "REFUNDED"
//   | "FAILED";

// type PaymentStatus =
//   | "PENDING"
//   | "AUTHORIZED"
//   | "PAID"
//   | "FAILED"
//   | "CANCELLED"
//   | "REFUNDED"
//   | "PARTIALLY_REFUNDED";

// const STATUS_OPTIONS: OrderStatus[] = [
//   "PENDING_PAYMENT",
//   "CONFIRMED",
//   "PACKED",
//   "SHIPPED",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
//   "CANCELLED",
//   "RETURN_REQUESTED",
//   "RETURNED",
//   "REFUNDED",
//   "FAILED",
// ];

// const statusLabels: Record<OrderStatus, string> = {
//   PENDING_PAYMENT: "Pending Payment",
//   CONFIRMED: "Ready to Ship",
//   PACKED: "Packed",
//   SHIPPED: "Shipped",
//   OUT_FOR_DELIVERY: "Out for Delivery",
//   DELIVERED: "Delivered",
//   CANCELLED: "Cancelled",
//   RETURN_REQUESTED: "Return Requested",
//   RETURNED: "Returned",
//   REFUNDED: "Refunded",
//   FAILED: "Failed",
// };

// /* =========================================================
//    STATUS TRANSITION MAP (client-side guardrail only)
// ========================================================= */

// const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
//   PENDING_PAYMENT: ["CONFIRMED", "CANCELLED", "FAILED"],
//   CONFIRMED: ["PACKED", "CANCELLED"],
//   PACKED: ["CANCELLED"],
//   // Dispatched: the backend refuses cancellation (use return / RTO instead)
//   SHIPPED: [],
//   OUT_FOR_DELIVERY: [],
//   DELIVERED: ["RETURN_REQUESTED"],
//   RETURN_REQUESTED: ["RETURNED"],
//   RETURNED: ["REFUNDED"],
//   CANCELLED: [],
//   REFUNDED: [],
//   FAILED: [],
// };

// const isTerminalStatus = (status: OrderStatus) =>
//   STATUS_TRANSITIONS[status].length === 0;

// /* =========================================================
//    STATUS CONFIG (icon + color tokens)
// ========================================================= */

// const statusConfig: Record<
//   OrderStatus,
//   { className: string; dot: string; icon: any }
// > = {
//   PENDING_PAYMENT: {
//     className:
//       "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
//     dot: "bg-amber-500",
//     icon: Clock,
//   },
//   CONFIRMED: {
//     className:
//       "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
//     dot: "bg-emerald-500",
//     icon: CheckCircle2,
//   },
//   PACKED: {
//     className:
//       "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
//     dot: "bg-blue-500",
//     icon: PackageOpen,
//   },
//   SHIPPED: {
//     className:
//       "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
//     dot: "bg-indigo-500",
//     icon: Truck,
//   },
//   OUT_FOR_DELIVERY: {
//     className:
//       "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900",
//     dot: "bg-purple-500",
//     icon: Truck,
//   },
//   DELIVERED: {
//     className:
//       "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
//     dot: "bg-green-500",
//     icon: CheckCircle2,
//   },
//   CANCELLED: {
//     className:
//       "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
//     dot: "bg-red-500",
//     icon: XCircle,
//   },
//   RETURN_REQUESTED: {
//     className:
//       "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
//     dot: "bg-orange-500",
//     icon: Undo2,
//   },
//   RETURNED: {
//     className:
//       "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900",
//     dot: "bg-pink-500",
//     icon: Undo2,
//   },
//   REFUNDED: {
//     className:
//       "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
//     dot: "bg-cyan-500",
//     icon: CheckCircle2,
//   },
//   FAILED: {
//     className:
//       "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
//     dot: "bg-red-500",
//     icon: XCircle,
//   },
// };

// const paymentStatusConfig: Record<PaymentStatus, string> = {
//   PENDING:
//     "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
//   PAID: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
//   FAILED:
//     "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
//   REFUNDED:
//     "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900",
//   CANCELLED:
//     "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
//   AUTHORIZED:
//     "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
//   PARTIALLY_REFUNDED:
//     "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
// };

// /* =========================================================
//    ORDER STATUS PIPELINE
// ========================================================= */

// const HAPPY_PATH: OrderStatus[] = [
//   "PENDING_PAYMENT",
//   "CONFIRMED",
//   "PACKED",
//   "SHIPPED",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
// ];

// const OFF_PATH_STATUSES: OrderStatus[] = [
//   "CANCELLED",
//   "RETURN_REQUESTED",
//   "RETURNED",
//   "REFUNDED",
//   "FAILED",
// ];

// /* =========================================================
//    TYPES
// ========================================================= */

// interface OrderItem {
//   id: string;
//   quantity: number;
//   price?: number;
//   originalPrice?: number;
//   discount?: number;
//   totalPrice?: number;
//   product: {
//     id: string;
//     name: string;
//     images?: Array<{ imageUrl: string }>;
//   };
//   variant?: { id?: number; name?: string };
// }

// interface Order {
//   id: string;
//   orderCode: string;
//   totalAmount: string | number;
//   status: OrderStatus;
//   paymentStatus?: PaymentStatus;
//   paymentMethod?: "COD" | "RAZORPAY" | "STRIPE" | "PAYPAL";
//   transactionId?: string | null;
//   trackingId?: string | null;
//   courierPartner?: string | null;
//   deliveredAt?: string | null;
//   cancelReason?: string | null;
//   cancelReasonCode?: string | null;
//   cancellationNote?: string | null;
//   cancelledAt?: string | null;
//   cancelledByUserId?: number | null;
//   cancelledByName?: string | null;
//   returnReason?: string | null;
//   invoiceGenerated?: boolean;
//   createdAt: string;
//   updatedAt: string;
//   orderItems: OrderItem[];
//   deliveryAddress?: {
//     fullName?: string;
//     phone?: string;
//     addressLine1?: string;
//     addressLine2?: string;
//     city?: string;
//     state?: string;
//     pincode?: string;
//   };
//   buyer?: {
//     name?: string;
//     email?: string;
//     phoneNumber?: string;
//   };
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function OrdersTable() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
//   const [dateFilter, setDateFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
//   const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
//   const [cancelSubmitting, setCancelSubmitting] = useState(false);
//   const [cancelError, setCancelError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;

//   const [totalOrders, setTotalOrders] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   /* =========================================================
//      FETCH ORDERS  (unchanged logic)
//   ========================================================= */

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);

//       const result = await getAllOrders(currentPage, itemsPerPage);

//       const normalizedOrders: Order[] = (result.orders || []).map(
//         (order: any) => ({
//           ...order,
//           status: order.status || "PENDING_PAYMENT",
//           paymentStatus: order.paymentStatus || "PENDING",
//         })
//       );

//       setOrders(normalizedOrders);
//       setTotalOrders(result.total || 0);
//       setTotalPages(result.totalPages || 0);
//     } catch (error) {
//       console.error("FETCH ORDERS ERROR:", error);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   /* =========================================================
//      SOCKET  (unchanged logic)
//   ========================================================= */

//   useEffect(() => {
//     const socket = getSocket();

//     socket.on("new_order", () => {
//       fetchOrders();
//       toast.info("New order received");
//     });

//     socket.on("order_status_updated", (data: any) => {
//       setOrders((previous) =>
//         previous.map((order) =>
//           String(order.id) === String(data.orderId)
//             ? {
//                 ...order,
//                 status: data.status,
//                 paymentStatus: data.paymentStatus ?? order.paymentStatus,
//               }
//             : order
//         )
//       );
//     });

//     return () => {
//       socket.off("new_order");
//       socket.off("order_status_updated");
//     };
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchOrders();
//   };

//   /* =========================================================
//      SEARCH + FILTER  (unchanged logic)
//   ========================================================= */

//   const filteredOrders = useMemo(() => {
//     let result = [...orders];

//     if (searchTerm.trim()) {
//       const search = searchTerm.trim().toLowerCase();

//       result = result.filter((order) => {
//         const customer = (
//           order.buyer?.name ||
//           order.deliveryAddress?.fullName ||
//           ""
//         ).toLowerCase();
//         const email = (order.buyer?.email || "").toLowerCase();
//         const phone = (
//           order.buyer?.phoneNumber ||
//           order.deliveryAddress?.phone ||
//           ""
//         ).toLowerCase();
//         const orderCode = (order.orderCode || "").toLowerCase();
//         const products = (order.orderItems || [])
//           .map((item) => item.product?.name || "")
//           .join(" ")
//           .toLowerCase();

//         return (
//           customer.includes(search) ||
//           email.includes(search) ||
//           phone.includes(search) ||
//           orderCode.includes(search) ||
//           products.includes(search)
//         );
//       });
//     }

//     if (statusFilter !== "all") {
//       result = result.filter((order) => order.status === statusFilter);
//     }

//     if (dateFilter !== "all") {
//       const now = new Date();

//       result = result.filter((order) => {
//         const orderDate = new Date(order.createdAt);
//         const difference = now.getTime() - orderDate.getTime();
//         const days = difference / (1000 * 60 * 60 * 24);

//         if (dateFilter === "today") {
//           return orderDate.toDateString() === now.toDateString();
//         }
//         if (dateFilter === "week") return days <= 7;
//         if (dateFilter === "month") return days <= 30;

//         return true;
//       });
//     }

//     return result;
//   }, [orders, searchTerm, statusFilter, dateFilter]);

//   /* =========================================================
//      PAGINATION  (unchanged logic)
//   ========================================================= */

//   const paginatedOrders = filteredOrders;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, dateFilter]);

//   /* =========================================================
//      STATUS UPDATE (unchanged API + guard)
//   ========================================================= */

//   const handleStatusChange = async (
//     orderId: string,
//     currentStatus: OrderStatus,
//     newStatus: OrderStatus
//   ) => {
//     if (newStatus === currentStatus) return;

//     const allowed = STATUS_TRANSITIONS[currentStatus];
//     if (!allowed.includes(newStatus)) {
//       toast.error(
//         `Cannot move from ${statusLabels[currentStatus]} to ${statusLabels[newStatus]}`
//       );
//       return;
//     }

//     // Cancellation needs a reason: confirm in the modal first
//     if (newStatus === "CANCELLED") {
//       const target = orders.find((order) => String(order.id) === String(orderId)) || null;
//       setCancelError(null);
//       setCancelTarget(target);
//       return;
//     }

//     try {
//       setUpdatingStatus(orderId);

//       await updateOrderStatus(orderId, { status: newStatus });

//       setOrders((previous) =>
//         previous.map((order) =>
//           String(order.id) === String(orderId)
//             ? { ...order, status: newStatus }
//             : order
//         )
//       );

//       setSelectedOrder((previous) =>
//         previous && String(previous.id) === String(orderId)
//           ? { ...previous, status: newStatus }
//           : previous
//       );

//       toast.success(`Order status changed to ${statusLabels[newStatus]}`);
//     } catch (error: any) {
//       console.error("UPDATE ORDER STATUS ERROR:", error);
//       toast.error(error?.response?.data?.message || "Failed to update order status");
//       await fetchOrders();
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   /* =========================================================
//      CANCEL WITH REASON
//   ========================================================= */

//   const handleConfirmCancel = async (data: {
//     cancelReasonCode: string;
//     cancellationNote: string;
//   }) => {
//     if (!cancelTarget) return;

//     const orderId = cancelTarget.id;

//     try {
//       setCancelSubmitting(true);
//       setCancelError(null);

//       const response = await cancelOrderWithReason(orderId, data);
//       const saved = response?.data || {};

//       const patch: Partial<Order> = {
//         status: (saved.status as OrderStatus) || "CANCELLED",
//         paymentStatus: saved.paymentStatus ?? cancelTarget.paymentStatus,
//         cancelReason: saved.cancelReason ?? null,
//         cancelReasonCode: saved.cancelReasonCode ?? data.cancelReasonCode,
//         cancellationNote: saved.cancellationNote ?? null,
//         cancelledAt: saved.cancelledAt ?? null,
//         cancelledByUserId: saved.cancelledByUserId ?? null,
//         cancelledByName: saved.cancelledByName ?? null,
//         updatedAt: saved.updatedAt ?? cancelTarget.updatedAt,
//       };

//       setOrders((previous) =>
//         previous.map((order) =>
//           String(order.id) === String(orderId) ? { ...order, ...patch } : order
//         )
//       );
//       setSelectedOrder((previous) =>
//         previous && String(previous.id) === String(orderId) ? { ...previous, ...patch } : previous
//       );

//       // Refund state comes from the payment record — never assume "refunded"
//       const refundStatus = saved.refund?.refundStatus;
//       const refundNote =
//         refundStatus === "REFUNDED"
//           ? " Refund processed by Razorpay."
//           : refundStatus === "REFUND_PENDING"
//             ? " Refund requested — awaiting Razorpay confirmation."
//             : refundStatus === "REFUND_FAILED"
//               ? " Refund NOT completed — retry it from the order's refund action."
//               : "";

//       toast.success(`Order ${cancelTarget.orderCode} cancelled.${refundNote}`);

//       for (const warning of saved.warnings || []) {
//         toast.warning(warning, { autoClose: false });
//       }

//       setCancelTarget(null);
//     } catch (error: any) {
//       console.error("CANCEL ORDER ERROR:", error);
//       const message =
//         error?.response?.data?.message || "Failed to cancel the order. Please try again.";
//       setCancelError(message);
//       toast.error(message);

//       // Already cancelled / dispatched elsewhere: refresh to the real state
//       if (error?.response?.status === 409) {
//         await fetchOrders();
//       }
//     } finally {
//       setCancelSubmitting(false);
//     }
//   };

//   /* =========================================================
//      FORMAT
//   ========================================================= */

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(amount || 0);
//   };

//   const formatDate = (value: string) => {
//     return new Date(value).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   /* =========================================================
//      STATS
//   ========================================================= */

//   const stats = useMemo(() => {
//     return {
//       total: orders.length,
//       pendingPayment: orders.filter((o) => o.status === "PENDING_PAYMENT")
//         .length,
//       confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
//       packed: orders.filter((o) => o.status === "PACKED").length,
//       shipped: orders.filter(
//         (o) => o.status === "SHIPPED" || o.status === "OUT_FOR_DELIVERY"
//       ).length,
//       delivered: orders.filter((o) => o.status === "DELIVERED").length,
//       cancelled: orders.filter((o) => o.status === "CANCELLED").length,
//     };
//   }, [orders]);

//   /* =========================================================
//      STATUS BADGE
//   ========================================================= */

//   const StatusBadge = ({ status }: { status: OrderStatus }) => {
//     const config = statusConfig[status] || statusConfig.PENDING_PAYMENT;
//     const Icon = config.icon;

//     return (
//       <span
//         className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap ${config.className}`}
//       >
//         <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
//         <Icon className="w-3 h-3" />
//         {statusLabels[status]}
//       </span>
//     );
//   };

//   /* =========================================================
//      MINI STATUS TIMELINE
//   ========================================================= */

//   const StatusTimeline = ({ status }: { status: OrderStatus }) => {
//     const currentIndex = HAPPY_PATH.indexOf(status);

//     return (
//       <div
//         className="flex items-center gap-1"
//         title={statusLabels[status]}
//       >
//         {HAPPY_PATH.map((step, index) => (
//           <span
//             key={step}
//             className={`h-1.5 flex-1 min-w-[10px] rounded-full ${
//               index <= currentIndex
//                 ? "bg-indigo-500"
//                 : "bg-slate-200 dark:bg-slate-800"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   /* =========================================================
//      STATUS DROPDOWN
//   ========================================================= */

//   const StatusDropdown = ({ order }: { order: Order }) => {
//     const isUpdating = updatingStatus === order.id;
//     const locked = isTerminalStatus(order.status);
//     const nextOptions = STATUS_TRANSITIONS[order.status] || [];

//     if (locked) {
//       const courierTracked = order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY";
//       return (
//         <div
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-400 dark:text-slate-500"
//           title={
//             courierTracked
//               ? "Dispatched orders update from Shiprocket tracking and can no longer be cancelled"
//               : "This order has reached a final status and can no longer be changed"
//           }
//         >
//           <Lock className="w-3 h-3" />
//           {courierTracked ? "Tracked by courier" : "No further action"}
//         </div>
//       );
//     }

//     return (
//       <select
//         value={order.status}
//         disabled={isUpdating}
//         onChange={(event) =>
//           handleStatusChange(
//             order.id,
//             order.status,
//             event.target.value as OrderStatus
//           )
//         }
//         className="w-full min-w-[175px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         <option value={order.status}>{statusLabels[order.status]}</option>

//         {nextOptions.map((status) => (
//           <option key={status} value={status}>
//             Move to {statusLabels[status]}
//           </option>
//         ))}
//       </select>
//     );
//   };

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
//       <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
//         {/* ============ HEADER ============ */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Commerce
//               </span>
//               <span className="text-slate-300 dark:text-slate-700">/</span>
//               <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
//                 Orders
//               </span>
//             </div>
//             <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
//               Order Management
//             </h1>
//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               Manage orders, payments, shipping and delivery status.
//             </p>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
//             >
//               <RefreshCw
//                 className={`w-3.5 h-3.5 ${
//                   refreshing ? "animate-spin" : ""
//                 }`}
//               />
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
//                 showFilters
//                   ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
//                   : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
//               }`}
//             >
//               <SlidersHorizontal className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Filters</span>
//               {showFilters ? (
//                 <ChevronUp className="w-3 h-3" />
//               ) : (
//                 <ChevronDown className="w-3 h-3" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ============ STATS ============ */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
//           <StatCard
//             title="Total"
//             value={stats.total}
//             icon={<ShoppingBag className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Pending Payment"
//             value={stats.pendingPayment}
//             icon={<Clock className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Confirmed"
//             value={stats.confirmed}
//             icon={<CheckCircle2 className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Packed"
//             value={stats.packed}
//             icon={<Package className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Shipped"
//             value={stats.shipped}
//             icon={<Truck className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Delivered"
//             value={stats.delivered}
//             icon={<CheckCircle2 className="w-3.5 h-3.5" />}
//           />
//           <StatCard
//             title="Cancelled"
//             value={stats.cancelled}
//             icon={<XCircle className="w-3.5 h-3.5" />}
//           />
//         </div>

//         {/* ============ MAIN PANEL ============ */}
//         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
//           {/* -------- TABS (status filters) -------- */}
//           <div className="border-b border-slate-200 dark:border-slate-800">
//             <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
//               <button
//                 onClick={() => setStatusFilter("all")}
//                 className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
//                   statusFilter === "all"
//                     ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
//                     : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                 }`}
//               >
//                 All
//                 <span
//                   className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded ${
//                     statusFilter === "all"
//                       ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
//                       : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
//                   }`}
//                 >
//                   {stats.total}
//                 </span>
//                 {statusFilter === "all" && (
//                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
//                 )}
//               </button>

//               {STATUS_OPTIONS.map((status) => {
//                 const active = statusFilter === status;
//                 return (
//                   <button
//                     key={status}
//                     onClick={() => setStatusFilter(status)}
//                     className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
//                       active
//                         ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
//                         : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                     }`}
//                   >
//                     {statusLabels[status]}
//                     {active && (
//                       <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* -------- SEARCH + DATE FILTER -------- */}
//           <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
//             <div className="flex flex-col md:flex-row gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
//                 <input
//                   value={searchTerm}
//                   onChange={(event) => setSearchTerm(event.target.value)}
//                   placeholder="Search order, customer, phone or product..."
//                   className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                 />
//               </div>

//               {showFilters && (
//                 <select
//                   value={dateFilter}
//                   onChange={(event) => setDateFilter(event.target.value)}
//                   className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                 >
//                   <option value="all">All Time</option>
//                   <option value="today">Today</option>
//                   <option value="week">This Week</option>
//                   <option value="month">This Month</option>
//                 </select>
//               )}
//             </div>
//           </div>

//           {/* -------- TABLE -------- */}
//           <div className="overflow-x-auto">
//             <div className="min-w-[1350px] lg:min-w-full">
//               <Table className="min-w-full">
//                 <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
//                   <TableRow className="border-b border-slate-200 dark:border-slate-800">
//                     {[
//                       "Order",
//                       "Customer",
//                       "Items",
//                       "Amount",
//                       "Payment",
//                       "Date",
//                       "Status",
//                     ].map((label) => (
//                       <TableCell
//                         key={label}
//                         isHeader
//                         className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
//                       >
//                         {label}
//                       </TableCell>
//                     ))}
//                     <TableCell
//                       isHeader
//                       className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
//                     >
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {loading ? (
//                     Array.from({ length: 5 }).map((_, i) => (
//                       <TableRow
//                         key={i}
//                         className="border-b border-slate-100 dark:border-slate-800"
//                       >
//                         {Array.from({ length: 8 }).map((_, j) => (
//                           <TableCell key={j} className="!py-3 !px-3">
//                             <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : paginatedOrders.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={8}
//                         className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <ShoppingBag
//                             className="text-slate-300 dark:text-slate-700"
//                             size={32}
//                           />
//                           <div className="font-medium text-slate-700 dark:text-slate-300">
//                             No orders found
//                           </div>
//                           <div className="text-xs">
//                             Try changing your search or filters.
//                           </div>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     paginatedOrders.map((order) => {
//                       const firstItem = order.orderItems?.[0];
//                       const itemCount = (order.orderItems || []).reduce(
//                         (total, item) => total + Number(item.quantity || 0),
//                         0
//                       );

//                       const paymentStatus = order.paymentStatus || "PENDING";
//                       const showTimeline = !OFF_PATH_STATUSES.includes(
//                         order.status
//                       );

//                       return (
//                         <TableRow
//                           key={order.id}
//                           className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group align-top"
//                         >
//                           {/* ORDER */}
//                           <TableCell className="!py-3 !px-3">
//                             <div className="flex items-center gap-3">
//                               {firstItem?.product?.images?.[0]?.imageUrl ? (
//                                 <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
//                                   <Image
//                                     src={firstItem.product.images[0].imageUrl}
//                                     alt={firstItem.product.name}
//                                     fill
//                                     className="object-cover"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
//                                   <PackageOpen className="w-4 h-4 text-slate-400" />
//                                 </div>
//                               )}

//                               <div className="min-w-0">
//                                 <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
//                                   {order.orderCode}
//                                 </p>
//                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
//                                   {firstItem?.product?.name}
//                                   {(order.orderItems?.length || 0) > 1 &&
//                                     ` +${order.orderItems.length - 1} more`}
//                                 </p>
//                               </div>
//                             </div>
//                           </TableCell>

//                           {/* CUSTOMER */}
//                           <TableCell className="!py-3 !px-3">
//                             <div className="space-y-0.5 min-w-[170px]">
//                               <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
//                                 {order.buyer?.name ||
//                                   order.deliveryAddress?.fullName ||
//                                   "N/A"}
//                               </p>

//                               {order.buyer?.email && (
//                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
//                                   <Mail className="w-3 h-3 shrink-0 text-slate-400" />
//                                   <span className="truncate max-w-[180px]">
//                                     {order.buyer.email}
//                                   </span>
//                                 </p>
//                               )}

//                               {(order.buyer?.phoneNumber ||
//                                 order.deliveryAddress?.phone) && (
//                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 tabular-nums">
//                                   <Phone className="w-3 h-3 shrink-0 text-slate-400" />
//                                   {order.buyer?.phoneNumber ||
//                                     order.deliveryAddress?.phone}
//                                 </p>
//                               )}

//                               {(order.deliveryAddress?.city ||
//                                 order.deliveryAddress?.state) && (
//                                 <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
//                                   <MapPin className="w-3 h-3 shrink-0" />
//                                   {[
//                                     order.deliveryAddress?.city,
//                                     order.deliveryAddress?.state,
//                                   ]
//                                     .filter(Boolean)
//                                     .join(", ")}
//                                 </p>
//                               )}
//                             </div>
//                           </TableCell>

//                           {/* ITEMS */}
//                           <TableCell className="!py-3 !px-3">
//                             <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
//                               <PackageOpen className="w-3 h-3" />
//                               {itemCount}
//                             </span>
//                           </TableCell>

//                           {/* AMOUNT */}
//                           <TableCell className="!py-3 !px-3">
//                             <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
//                               {formatCurrency(Number(order.totalAmount))}
//                             </p>
//                           </TableCell>

//                           {/* PAYMENT */}
//                           <TableCell className="!py-3 !px-3">
//                             <div className="space-y-1">
//                               <span
//                                 className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded border ${paymentStatusConfig[paymentStatus]}`}
//                               >
//                                 <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
//                                 {paymentStatus}
//                               </span>
//                               <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
//                                 <CreditCard className="w-3 h-3 text-slate-400" />
//                                 {order.paymentMethod || "COD"}
//                               </p>
//                             </div>
//                           </TableCell>

//                           {/* DATE */}
//                           <TableCell className="!py-3 !px-3">
//                             <div className="flex items-start gap-2 min-w-[130px]">
//                               <Calendar className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
//                               <div>
//                                 <p className="text-xs font-medium text-slate-700 dark:text-slate-300 tabular-nums">
//                                   {formatDate(order.createdAt)}
//                                 </p>
//                                 <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
//                                   Upd. {formatDate(order.updatedAt)}
//                                 </p>
//                               </div>
//                             </div>
//                           </TableCell>

//                           {/* STATUS */}
//                           <TableCell className="!py-3 !px-3">
//                             <div className="space-y-2 min-w-[190px]">
//                               <StatusBadge status={order.status} />
//                               {showTimeline && (
//                                 <StatusTimeline status={order.status} />
//                               )}
//                               {order.status === "CANCELLED" && (
//                                 <CancellationSummary order={order} formatDate={formatDate} />
//                               )}
//                               <StatusDropdown order={order} />
//                             </div>
//                           </TableCell>

//                           {/* ACTIONS */}
//                           <TableCell className="!py-3 !px-3 text-right">
//                             <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity justify-end">
//                               {order.status === "DELIVERED" && (
//                                 <button
//                                   type="button"
//                                   onClick={() => downloadInvoice(order.id)}
//                                   title="Download invoice"
//                                   className="p-1.5 rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
//                                 >
//                                   <Download className="w-3.5 h-3.5" />
//                                 </button>
//                               )}

//                               <button
//                                 type="button"
//                                 onClick={() => setSelectedOrder(order)}
//                                 title="View order"
//                                 className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
//                               >
//                                 <Eye className="w-3.5 h-3.5" />
//                               </button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           {/* -------- PAGINATION -------- */}
//           {!loading && filteredOrders.length > 0 && (
//             <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   Showing{" "}
//                   <b className="text-slate-700 dark:text-slate-300 tabular-nums">
//                     {(currentPage - 1) * itemsPerPage + 1}
//                   </b>{" "}
//                   -{" "}
//                   <b className="text-slate-700 dark:text-slate-300 tabular-nums">
//                     {Math.min(currentPage * itemsPerPage, totalOrders)}
//                   </b>{" "}
//                   of{" "}
//                   <b className="text-slate-700 dark:text-slate-300 tabular-nums">
//                     {totalOrders}
//                   </b>{" "}
//                   orders
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <button
//                     disabled={currentPage === 1}
//                     onClick={() =>
//                       setCurrentPage((page) => Math.max(1, page - 1))
//                     }
//                     className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//                   >
//                     Previous
//                   </button>

//                   <span className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold tabular-nums">
//                     {currentPage}
//                   </span>

//                   <button
//                     disabled={currentPage >= totalPages}
//                     onClick={() =>
//                       setCurrentPage((page) =>
//                         Math.min(totalPages, page + 1)
//                       )
//                     }
//                     className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <OrderViewModal
//         isOpen={!!selectedOrder}
//         order={selectedOrder}
//         onClose={() => setSelectedOrder(null)}
//       />

//       <CancelOrderModal
//         isOpen={!!cancelTarget}
//         orderCode={cancelTarget?.orderCode}
//         willRefund={
//           cancelTarget?.paymentMethod !== "COD" && cancelTarget?.paymentStatus === "PAID"
//         }
//         submitting={cancelSubmitting}
//         serverError={cancelError}
//         onClose={() => {
//           setCancelTarget(null);
//           setCancelError(null);
//         }}
//         onConfirm={handleConfirmCancel}
//       />
//     </div>
//   );
// }

// /* =========================================================
//    CANCELLATION SUMMARY (cancelled rows)
// ========================================================= */

// function CancellationSummary({
//   order,
//   formatDate,
// }: {
//   order: Order;
//   formatDate: (value: string) => string;
// }) {
//   const reason =
//     getCancellationReasonLabel(order.cancelReasonCode) || order.cancelReason || "No reason recorded";

//   return (
//     <div className="max-w-[240px] rounded border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 px-2 py-1.5">
//       <p className="text-[11px] font-medium text-red-700 dark:text-red-400 break-words">{reason}</p>
//       {order.cancellationNote && (
//         <p
//           className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2 break-words"
//           title={order.cancellationNote}
//         >
//           {order.cancellationNote}
//         </p>
//       )}
//       {(order.cancelledAt || order.cancelledByUserId) && (
//         <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
//           {order.cancelledAt ? formatDate(order.cancelledAt) : ""}
//           {order.cancelledByUserId
//             ? ` · by ${order.cancelledByName || `admin #${order.cancelledByUserId}`}`
//             : ""}
//         </p>
//       )}
//     </div>
//   );
// }

// /* =========================================================
//    STAT CARD
// ========================================================= */

// function StatCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//           {title}
//         </p>
//         <span className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
//           {icon}
//         </span>
//       </div>
//       <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
//         {value}
//       </p>
//     </div>
//   );
// }

"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";

import { getSocket } from "@/services/lib/socket";
import Image from "next/image";

import {
  cancelOrderWithReason,
  downloadInvoice,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orders/ResentOrder";
import CancelOrderModal from "@/components/orders/CancelOrderModal";
import { getCancellationReasonLabel } from "@/utils/cancellationReasons";
import OrderViewModal from "@/components/orders/OrderViewModal";

import {
  Search,
  Download,
  Eye,
  RefreshCw,
  Package,
  PackageOpen,
  Truck,
  Clock,
  Calendar,
  XCircle,
  CheckCircle2,
  ShoppingBag,
  Undo2,
  Lock,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  FileSpreadsheet,
  X,
} from "lucide-react";

import { toast } from "react-toastify";

/* =========================================================
   ORDER STATUS
   NOTE: values must stay identical to backend — do not rename.
========================================================= */

type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "REFUNDED"
  | "FAILED";

type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
  "FAILED",
];

const statusLabels: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  CONFIRMED: "Ready to Ship",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURN_REQUESTED: "Return Requested",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

/* =========================================================
   STATUS TRANSITION MAP (client-side guardrail only)
========================================================= */

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED", "FAILED"],
  CONFIRMED: ["PACKED", "CANCELLED"],
  PACKED: ["CANCELLED"],
  SHIPPED: [],
  OUT_FOR_DELIVERY: [],
  DELIVERED: ["RETURN_REQUESTED"],
  RETURN_REQUESTED: ["RETURNED"],
  RETURNED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
  FAILED: [],
};

const isTerminalStatus = (status: OrderStatus) =>
  STATUS_TRANSITIONS[status].length === 0;

/* =========================================================
   STATUS CONFIG (icon + color tokens)
========================================================= */

const statusConfig: Record<
  OrderStatus,
  { className: string; dot: string; icon: any }
> = {
  PENDING_PAYMENT: {
    className:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    dot: "bg-amber-500",
    icon: Clock,
  },
  CONFIRMED: {
    className:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  PACKED: {
    className:
      "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900",
    dot: "bg-sky-500",
    icon: PackageOpen,
  },
  SHIPPED: {
    className:
      "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
    dot: "bg-indigo-500",
    icon: Truck,
  },
  OUT_FOR_DELIVERY: {
    className:
      "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900",
    dot: "bg-purple-500",
    icon: Truck,
  },
  DELIVERED: {
    className:
      "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  CANCELLED: {
    className:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    dot: "bg-rose-500",
    icon: XCircle,
  },
  RETURN_REQUESTED: {
    className:
      "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
    dot: "bg-orange-500",
    icon: Undo2,
  },
  RETURNED: {
    className:
      "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-900",
    dot: "bg-pink-500",
    icon: Undo2,
  },
  REFUNDED: {
    className:
      "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900",
    dot: "bg-cyan-500",
    icon: CheckCircle2,
  },
  FAILED: {
    className:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    dot: "bg-rose-500",
    icon: XCircle,
  },
};

const paymentStatusConfig: Record<PaymentStatus, string> = {
  PENDING:
    "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  PAID: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  FAILED:
    "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  REFUNDED:
    "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  CANCELLED:
    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  AUTHORIZED:
    "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900",
  PARTIALLY_REFUNDED:
    "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
};

const HAPPY_PATH: OrderStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const OFF_PATH_STATUSES: OrderStatus[] = [
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED",
  "FAILED",
];

/* =========================================================
   HELPERS
========================================================= */

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDateInput = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* =========================================================
   TYPES
========================================================= */

interface OrderItem {
  id: string;
  quantity: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  totalPrice?: number;
  product: {
    id: string;
    name: string;
    images?: Array<{ imageUrl: string }>;
  };
  variant?: { id?: number; name?: string };
}

interface Order {
  id: string;
  orderCode: string;
  totalAmount: string | number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: "COD" | "RAZORPAY" | "STRIPE" | "PAYPAL";
  transactionId?: string | null;
  trackingId?: string | null;
  courierPartner?: string | null;
  deliveredAt?: string | null;
  cancelReason?: string | null;
  cancelReasonCode?: string | null;
  cancellationNote?: string | null;
  cancelledAt?: string | null;
  cancelledByUserId?: number | null;
  cancelledByName?: string | null;
  returnReason?: string | null;
  invoiceGenerated?: boolean;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  deliveryAddress?: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  buyer?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);

        const result = await getAllOrders(page, itemsPerPage);

        const normalizedOrders: Order[] = (result.orders || []).map(
          (order: any) => ({
            ...order,
            status: order.status || "PENDING_PAYMENT",
            paymentStatus: order.paymentStatus || "PENDING",
          })
        );

        setOrders(normalizedOrders);
        setTotalOrders(result.total || 0);
        setTotalPages(result.totalPages || 0);
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  /* =========================================================
     SOCKET
  ========================================================= */

  useEffect(() => {
    const socket = getSocket();

    socket.on("new_order", () => {
      fetchOrders(1);
      toast.info("New order received");
    });

    socket.on("order_status_updated", (data: any) => {
      setOrders((previous) =>
        previous.map((order) =>
          String(order.id) === String(data.orderId)
            ? {
                ...order,
                status: data.status,
                paymentStatus: data.paymentStatus ?? order.paymentStatus,
              }
            : order
        )
      );
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
    };
  }, [fetchOrders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders(currentPage);
  };

  /* =========================================================
     SEARCH + STATUS + DATE FILTER
  ========================================================= */

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase();

      result = result.filter((order) => {
        const customer = (
          order.buyer?.name ||
          order.deliveryAddress?.fullName ||
          ""
        ).toLowerCase();
        const email = (order.buyer?.email || "").toLowerCase();
        const phone = (
          order.buyer?.phoneNumber ||
          order.deliveryAddress?.phone ||
          ""
        ).toLowerCase();
        const orderCode = (order.orderCode || "").toLowerCase();
        const products = (order.orderItems || [])
          .map((item) => item.product?.name || "")
          .join(" ")
          .toLowerCase();

        return (
          customer.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          orderCode.includes(search) ||
          products.includes(search)
        );
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();

      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const difference = now.getTime() - orderDate.getTime();
        const days = difference / (1000 * 60 * 60 * 24);

        if (dateFilter === "today") {
          return orderDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "week") return days <= 7;
        if (dateFilter === "month") return days <= 30;

        return true;
      });
    }

    if (fromDate || toDate) {
      result = result.filter((order) => {
        const orderDateStr = formatDateInput(order.createdAt);
        if (!orderDateStr) return false;
        if (fromDate && orderDateStr < fromDate) return false;
        if (toDate && orderDateStr > toDate) return false;
        return true;
      });
    }

    return result;
  }, [orders, searchTerm, statusFilter, dateFilter, fromDate, toDate]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    statusFilter !== "all" ||
    dateFilter !== "all" ||
    Boolean(fromDate) ||
    Boolean(toDate);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setFromDate("");
    setToDate("");
  };

  const paginatedOrders = filteredOrders;

  /* =========================================================
     EXPORT TO EXCEL (.xls SpreadsheetML)
  ========================================================= */

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      toast.info("No orders available to export for the selected filters");
      return;
    }

    const headers = [
      "Order Code",
      "Customer Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Pincode",
      "Products",
      "Total Qty",
      "Total Amount (INR)",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Courier Partner",
      "Tracking ID",
      "Order Date",
      "Cancellation Reason",
    ];

    const rows = filteredOrders.map((order) => {
      const customerName =
        order.buyer?.name || order.deliveryAddress?.fullName || "";
      const phone =
        order.buyer?.phoneNumber || order.deliveryAddress?.phone || "";
      const productsSummary = (order.orderItems || [])
        .map((item) => `${item.product?.name || "Item"} (x${item.quantity})`)
        .join("; ");
      const totalQty = (order.orderItems || []).reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );
      const cancelInfo =
        order.status === "CANCELLED"
          ? getCancellationReasonLabel(order.cancelReasonCode) ||
            order.cancelReason ||
            ""
          : "";

      return [
        order.orderCode,
        customerName,
        order.buyer?.email || "",
        phone,
        order.deliveryAddress?.city || "",
        order.deliveryAddress?.state || "",
        order.deliveryAddress?.pincode || "",
        productsSummary,
        totalQty,
        Number(order.totalAmount || 0),
        order.paymentMethod || "COD",
        order.paymentStatus || "PENDING",
        statusLabels[order.status] || order.status,
        order.courierPartner || "",
        order.trackingId || "",
        order.createdAt
          ? new Date(order.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        cancelInfo,
      ];
    });

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
          .map((val) => {
            const isNum = typeof val === "number" && Number.isFinite(val);
            const type = isNum ? "Number" : "String";
            return `<Cell><Data ss:Type="${type}">${escapeXml(
              val
            )}</Data></Cell>`;
          })
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
  <Worksheet ss:Name="Orders">
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

    const dateSuffix =
      fromDate || toDate
        ? `${fromDate || "start"}_to_${toDate || "end"}`
        : dateFilter !== "all"
          ? dateFilter
          : new Date().toISOString().slice(0, 10);
    const statusSuffix = statusFilter !== "all" ? `_${statusFilter}` : "";

    link.href = url;
    link.download = `orders${statusSuffix}_${dateSuffix}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredOrders.length} order(s) to Excel`);
  };

  /* =========================================================
     STATUS UPDATE
  ========================================================= */

  const handleStatusChange = async (
    orderId: string,
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ) => {
    if (newStatus === currentStatus) return;

    const allowed = STATUS_TRANSITIONS[currentStatus];
    if (!allowed.includes(newStatus)) {
      toast.error(
        `Cannot move from ${statusLabels[currentStatus]} to ${statusLabels[newStatus]}`
      );
      return;
    }

    if (newStatus === "CANCELLED") {
      const target =
        orders.find((order) => String(order.id) === String(orderId)) || null;
      setCancelError(null);
      setCancelTarget(target);
      return;
    }

    try {
      setUpdatingStatus(orderId);

      await updateOrderStatus(orderId, { status: newStatus });

      setOrders((previous) =>
        previous.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status: newStatus }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous && String(previous.id) === String(orderId)
          ? { ...previous, status: newStatus }
          : previous
      );

      toast.success(`Order status changed to ${statusLabels[newStatus]}`);
    } catch (error: any) {
      console.error("UPDATE ORDER STATUS ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update order status"
      );
      await fetchOrders(currentPage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  /* =========================================================
     CANCEL WITH REASON
  ========================================================= */

  const handleConfirmCancel = async (data: {
    cancelReasonCode: string;
    cancellationNote: string;
  }) => {
    if (!cancelTarget) return;

    const orderId = cancelTarget.id;

    try {
      setCancelSubmitting(true);
      setCancelError(null);

      const response = await cancelOrderWithReason(orderId, data);
      const saved = response?.data || {};

      const patch: Partial<Order> = {
        status: (saved.status as OrderStatus) || "CANCELLED",
        paymentStatus: saved.paymentStatus ?? cancelTarget.paymentStatus,
        cancelReason: saved.cancelReason ?? null,
        cancelReasonCode: saved.cancelReasonCode ?? data.cancelReasonCode,
        cancellationNote: saved.cancellationNote ?? null,
        cancelledAt: saved.cancelledAt ?? null,
        cancelledByUserId: saved.cancelledByUserId ?? null,
        cancelledByName: saved.cancelledByName ?? null,
        updatedAt: saved.updatedAt ?? cancelTarget.updatedAt,
      };

      setOrders((previous) =>
        previous.map((order) =>
          String(order.id) === String(orderId) ? { ...order, ...patch } : order
        )
      );
      setSelectedOrder((previous) =>
        previous && String(previous.id) === String(orderId)
          ? { ...previous, ...patch }
          : previous
      );

      const refundStatus = saved.refund?.refundStatus;
      const refundNote =
        refundStatus === "REFUNDED"
          ? " Refund processed by Razorpay."
          : refundStatus === "REFUND_PENDING"
            ? " Refund requested — awaiting Razorpay confirmation."
            : refundStatus === "REFUND_FAILED"
              ? " Refund NOT completed — retry it from the order's refund action."
              : "";

      toast.success(`Order ${cancelTarget.orderCode} cancelled.${refundNote}`);

      for (const warning of saved.warnings || []) {
        toast.warning(warning, { autoClose: false });
      }

      setCancelTarget(null);
    } catch (error: any) {
      console.error("CANCEL ORDER ERROR:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to cancel the order. Please try again.";
      setCancelError(message);
      toast.error(message);

      if (error?.response?.status === 409) {
        await fetchOrders(currentPage);
      }
    } finally {
      setCancelSubmitting(false);
    }
  };

  /* =========================================================
     FORMAT
  ========================================================= */

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pendingPayment: orders.filter((o) => o.status === "PENDING_PAYMENT")
        .length,
      confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
      packed: orders.filter((o) => o.status === "PACKED").length,
      shipped: orders.filter(
        (o) => o.status === "SHIPPED" || o.status === "OUT_FOR_DELIVERY"
      ).length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  /* =========================================================
     STATUS BADGE
  ========================================================= */

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const config = statusConfig[status] || statusConfig.PENDING_PAYMENT;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${config.className}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
        <Icon className="h-3 w-3" />
        {statusLabels[status]}
      </span>
    );
  };

  /* =========================================================
     MINI STATUS TIMELINE
  ========================================================= */

  const StatusTimeline = ({ status }: { status: OrderStatus }) => {
    const currentIndex = HAPPY_PATH.indexOf(status);

    return (
      <div className="flex items-center gap-1" title={statusLabels[status]}>
        {HAPPY_PATH.map((step, index) => (
          <span
            key={step}
            className={`h-1.5 min-w-[10px] flex-1 rounded-full ${
              index <= currentIndex
                ? "bg-slate-900 dark:bg-sky-500"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          />
        ))}
      </div>
    );
  };

  /* =========================================================
     STATUS DROPDOWN
  ========================================================= */

  const StatusDropdown = ({ order }: { order: Order }) => {
    const isUpdating = updatingStatus === order.id;
    const locked = isTerminalStatus(order.status);
    const nextOptions = STATUS_TRANSITIONS[order.status] || [];

    if (locked) {
      const courierTracked =
        order.status === "SHIPPED" || order.status === "OUT_FOR_DELIVERY";
      return (
        <div
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-500"
          title={
            courierTracked
              ? "Dispatched orders update from Shiprocket tracking and can no longer be cancelled"
              : "This order has reached a final status and can no longer be changed"
          }
        >
          <Lock className="h-3 w-3" />
          {courierTracked ? "Tracked by courier" : "No further action"}
        </div>
      );
    }

    return (
      <select
        value={order.status}
        disabled={isUpdating}
        onChange={(event) =>
          handleStatusChange(
            order.id,
            order.status,
            event.target.value as OrderStatus
          )
        }
        className="w-full min-w-[175px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value={order.status}>{statusLabels[order.status]}</option>

        {nextOptions.map((status) => (
          <option key={status} value={status}>
            Move to {statusLabels[status]}
          </option>
        ))}
      </select>
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Commerce / Orders
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Order Management
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Track customer orders, fulfillment progress, date-wise filters,
              and export Excel reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || filteredOrders.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white shadow-2xs transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Export Excel ({filteredOrders.length})</span>
            </button>
          </div>
        </div>

        {/* ============ STATS ============ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<ShoppingBag className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Pending Payment"
            value={stats.pendingPayment}
            icon={<Clock className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Packed"
            value={stats.packed}
            icon={<Package className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Shipped"
            value={stats.shipped}
            icon={<Truck className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<XCircle className="h-3.5 w-3.5" />}
          />
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* -------- TABS (status filters) -------- */}
          <div className="border-b border-slate-200 bg-slate-50/60 px-3 pt-2 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
                  statusFilter === "all"
                    ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                    : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                }`}
              >
                <span>All</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                    statusFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {stats.total}
                </span>
              </button>

              {STATUS_OPTIONS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------- SEARCH + DATE RANGE FILTER -------- */}
          <div className="border-b border-slate-200 p-3.5 dark:border-slate-800">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search order code, customer, phone, product..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* QUICK PERIOD PRESET */}
                <select
                  aria-label="Quick date range"
                  value={dateFilter}
                  onChange={(event) => {
                    setDateFilter(event.target.value);
                    if (event.target.value !== "all") {
                      setFromDate("");
                      setToDate("");
                    }
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>

                {/* CUSTOM FROM / TO DATE */}
                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="order-from-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    From:
                  </label>
                  <input
                    id="order-from-date"
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="order-to-date"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400"
                  >
                    To:
                  </label>
                  <input
                    id="order-to-date"
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setDateFilter("all");
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[1320px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50/90 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    {[
                      "Order",
                      "Customer",
                      "Items",
                      "Amount",
                      "Payment",
                      "Date",
                      "Status",
                    ].map((label) => (
                      <TableCell
                        key={label}
                        isHeader
                        className="!px-4 !py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                      >
                        {label}
                      </TableCell>
                    ))}
                    <TableCell
                      isHeader
                      className="!px-4 !py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((__, j) => (
                          <TableCell key={j} className="!px-4 !py-3.5">
                            <div className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-16 text-center">
                        <div className="mx-auto flex max-w-xs flex-col items-center gap-2 text-slate-400">
                          <ShoppingBag className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            No orders found
                          </p>
                          <p className="text-xs text-slate-500">
                            Try adjusting your search, status, or date range.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOrders.map((order) => {
                      const firstItem = order.orderItems?.[0];
                      const itemCount = (order.orderItems || []).reduce(
                        (total, item) => total + Number(item.quantity || 0),
                        0
                      );

                      const paymentStatus = order.paymentStatus || "PENDING";
                      const showTimeline = !OFF_PATH_STATUSES.includes(
                        order.status
                      );

                      return (
                        <TableRow
                          key={order.id}
                          className="group align-top transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          {/* ORDER */}
                          <TableCell className="!px-4 !py-3.5">
                            <div className="flex items-center gap-3">
                              {firstItem?.product?.images?.[0]?.imageUrl ? (
                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                                  <Image
                                    src={firstItem.product.images[0].imageUrl}
                                    alt={firstItem.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                  <PackageOpen className="h-4 w-4 text-slate-400" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                                  {order.orderCode}
                                </p>
                                <p className="mt-0.5 max-w-[200px] truncate text-[11px] text-slate-500 dark:text-slate-400">
                                  {firstItem?.product?.name}
                                  {(order.orderItems?.length || 0) > 1 &&
                                    ` +${order.orderItems.length - 1} more`}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* CUSTOMER */}
                          <TableCell className="!px-4 !py-3.5">
                            <div className="min-w-[170px] space-y-0.5">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {order.buyer?.name ||
                                  order.deliveryAddress?.fullName ||
                                  "N/A"}
                              </p>

                              {order.buyer?.email && (
                                <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                  <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                                  <span className="max-w-[180px] truncate">
                                    {order.buyer.email}
                                  </span>
                                </p>
                              )}

                              {(order.buyer?.phoneNumber ||
                                order.deliveryAddress?.phone) && (
                                <p className="flex items-center gap-1.5 text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                                  <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                                  {order.buyer?.phoneNumber ||
                                    order.deliveryAddress?.phone}
                                </p>
                              )}

                              {(order.deliveryAddress?.city ||
                                order.deliveryAddress?.state) && (
                                <p className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  {[
                                    order.deliveryAddress?.city,
                                    order.deliveryAddress?.state,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          {/* ITEMS */}
                          <TableCell className="!px-4 !py-3.5">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              <PackageOpen className="h-3 w-3" />
                              {itemCount}
                            </span>
                          </TableCell>

                          {/* AMOUNT */}
                          <TableCell className="!px-4 !py-3.5">
                            <p className="text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                              {formatCurrency(Number(order.totalAmount))}
                            </p>
                          </TableCell>

                          {/* PAYMENT */}
                          <TableCell className="!px-4 !py-3.5">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${paymentStatusConfig[paymentStatus]}`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                {paymentStatus}
                              </span>
                              <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <CreditCard className="h-3 w-3 text-slate-400" />
                                {order.paymentMethod || "COD"}
                              </p>
                            </div>
                          </TableCell>

                          {/* DATE */}
                          <TableCell className="!px-4 !py-3.5">
                            <div className="flex min-w-[135px] items-start gap-2">
                              <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                              <div>
                                <p className="text-xs font-medium text-slate-700 tabular-nums dark:text-slate-300">
                                  {formatDate(order.createdAt)}
                                </p>
                                <p className="text-[10px] text-slate-400 tabular-nums dark:text-slate-500">
                                  Upd. {formatDate(order.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* STATUS */}
                          <TableCell className="!px-4 !py-3.5">
                            <div className="min-w-[190px] space-y-2">
                              <StatusBadge status={order.status} />
                              {showTimeline && (
                                <StatusTimeline status={order.status} />
                              )}
                              {order.status === "CANCELLED" && (
                                <CancellationSummary
                                  order={order}
                                  formatDate={formatDate}
                                />
                              )}
                              <StatusDropdown order={order} />
                            </div>
                          </TableCell>

                          {/* ACTIONS */}
                          <TableCell className="!px-4 !py-3.5 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              {order.status === "DELIVERED" && (
                                <button
                                  type="button"
                                  onClick={() => downloadInvoice(order.id)}
                                  title="Download invoice"
                                  className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                title="View order"
                                className="rounded-lg border border-transparent p-2 text-slate-500 transition hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                              >
                                <Eye className="h-3.5 w-3.5" />
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
          </div>

          {/* -------- PAGINATION -------- */}
          {!loading && filteredOrders.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <b className="text-slate-700 tabular-nums dark:text-slate-300">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </b>{" "}
                  -{" "}
                  <b className="text-slate-700 tabular-nums dark:text-slate-300">
                    {Math.min(currentPage * itemsPerPage, totalOrders)}
                  </b>{" "}
                  of{" "}
                  <b className="text-slate-700 tabular-nums dark:text-slate-300">
                    {totalOrders}
                  </b>{" "}
                  orders
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Previous
                  </button>

                  <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white tabular-nums dark:bg-slate-100 dark:text-slate-900">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <OrderViewModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <CancelOrderModal
        isOpen={!!cancelTarget}
        orderCode={cancelTarget?.orderCode}
        willRefund={
          cancelTarget?.paymentMethod !== "COD" &&
          cancelTarget?.paymentStatus === "PAID"
        }
        submitting={cancelSubmitting}
        serverError={cancelError}
        onClose={() => {
          setCancelTarget(null);
          setCancelError(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}

/* =========================================================
   CANCELLATION SUMMARY (cancelled rows)
========================================================= */

function CancellationSummary({
  order,
  formatDate,
}: {
  order: Order;
  formatDate: (value: string) => string;
}) {
  const reason =
    getCancellationReasonLabel(order.cancelReasonCode) ||
    order.cancelReason ||
    "No reason recorded";

  return (
    <div className="max-w-[240px] rounded-lg border border-rose-100 bg-rose-50/50 px-2.5 py-1.5 dark:border-rose-900/50 dark:bg-rose-950/20">
      <p className="break-words text-[11px] font-medium text-rose-700 dark:text-rose-400">
        {reason}
      </p>
      {order.cancellationNote && (
        <p
          className="mt-0.5 line-clamp-2 break-words text-[11px] text-slate-600 dark:text-slate-400"
          title={order.cancellationNote}
        >
          {order.cancellationNote}
        </p>
      )}
      {(order.cancelledAt || order.cancelledByUserId) && (
        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
          {order.cancelledAt ? formatDate(order.cancelledAt) : ""}
          {order.cancelledByUserId
            ? ` · by ${
                order.cancelledByName || `admin #${order.cancelledByUserId}`
              }`
            : ""}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}