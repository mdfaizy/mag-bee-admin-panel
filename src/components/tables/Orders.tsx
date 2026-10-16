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
//   downloadInvoice,
//   getAllOrders,
//   updateOrderStatus,
// } from "../../services/orders/ResentOrder";

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

// // type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
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

// // const statusLabels: Record<OrderStatus, string> = {
// //   PENDING_PAYMENT: "Pending Payment",
// //   CONFIRMED: "Confirmed",
// //   PACKED: "Packed",
// //   SHIPPED: "Shipped",
// //   OUT_FOR_DELIVERY: "Out for Delivery",
// //   DELIVERED: "Delivered",
// //   CANCELLED: "Cancelled",
// //   RETURN_REQUESTED: "Return Requested",
// //   RETURNED: "Returned",
// //   REFUNDED: "Refunded",
// //   FAILED: "Failed",
// // };

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

//    This does NOT replace backend validation — the backend must
//    still reject invalid transitions. This only keeps the dropdown
//    from offering moves that are obviously invalid, and locks the
//    control once an order reaches a terminal state.
// ========================================================= */

// // const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
// //   PENDING_PAYMENT: ["CONFIRMED", "CANCELLED", "FAILED"],
// //   CONFIRMED: ["PACKED", "CANCELLED"],
// //   PACKED: ["SHIPPED", "CANCELLED"],
// //   SHIPPED: ["OUT_FOR_DELIVERY", "CANCELLED"],
// //   OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
// //   DELIVERED: ["RETURN_REQUESTED"],
// //   RETURN_REQUESTED: ["RETURNED"],
// //   RETURNED: ["REFUNDED"],
// //   CANCELLED: [],
// //   REFUNDED: [],
// //   FAILED: [],
// // };
// const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
//   PENDING_PAYMENT: [
//     "CONFIRMED",
//     "CANCELLED",
//     "FAILED",
//   ],

//   CONFIRMED: [
//     "PACKED",
//     "CANCELLED",
//   ],

//   PACKED: [
//     // "SHIPPED",
//     "CANCELLED",
//   ],

//   SHIPPED: [
//     // "OUT_FOR_DELIVERY",
//     "CANCELLED",
//   ],

//   OUT_FOR_DELIVERY: [
//     // "DELIVERED",
//     "CANCELLED",
//   ],

//   DELIVERED: [
//     "RETURN_REQUESTED",
//   ],

//   RETURN_REQUESTED: [
//     "RETURNED",
//   ],

//   RETURNED: [
//     "REFUNDED",
//   ],

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
//     className: "bg-yellow-50 text-yellow-700 border-yellow-200",
//     dot: "bg-yellow-500",
//     icon: Clock,
//   },
//   CONFIRMED: {
//     className: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     dot: "bg-emerald-500",
//     icon: CheckCircle2,
//   },
//   PACKED: {
//     className: "bg-blue-50 text-blue-700 border-blue-200",
//     dot: "bg-blue-500",
//     icon: PackageOpen,
//   },
//   SHIPPED: {
//     className: "bg-indigo-50 text-indigo-700 border-indigo-200",
//     dot: "bg-indigo-500",
//     icon: Truck,
//   },
//   OUT_FOR_DELIVERY: {
//     className: "bg-purple-50 text-purple-700 border-purple-200",
//     dot: "bg-purple-500",
//     icon: Truck,
//   },
//   DELIVERED: {
//     className: "bg-green-50 text-green-700 border-green-200",
//     dot: "bg-green-500",
//     icon: CheckCircle2,
//   },
//   CANCELLED: {
//     className: "bg-red-50 text-red-700 border-red-200",
//     dot: "bg-red-500",
//     icon: XCircle,
//   },
//   RETURN_REQUESTED: {
//     className: "bg-orange-50 text-orange-700 border-orange-200",
//     dot: "bg-orange-500",
//     icon: Undo2,
//   },
//   RETURNED: {
//     className: "bg-pink-50 text-pink-700 border-pink-200",
//     dot: "bg-pink-500",
//     icon: Undo2,
//   },
//   REFUNDED: {
//     className: "bg-cyan-50 text-cyan-700 border-cyan-200",
//     dot: "bg-cyan-500",
//     icon: CheckCircle2,
//   },
//   FAILED: {
//     className: "bg-red-50 text-red-700 border-red-200",
//     dot: "bg-red-500",
//     icon: XCircle,
//   },
// };

// const paymentStatusConfig: Record<PaymentStatus, string> = {
//   PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   PAID: "bg-green-50 text-green-700 border-green-200",
//   FAILED: "bg-red-50 text-red-700 border-red-200",
//   REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
//    CANCELLED: "bg-gray-50 text-gray-700 border-gray-200",
//   AUTHORIZED: "bg-blue-50 text-blue-700 border-blue-200",
//   PARTIALLY_REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
// };

// /* =========================================================
//    ORDER STATUS PIPELINE — used only to render the mini progress
//    timeline for the "happy path" (payment -> delivery). Orders
//    that branch off (cancelled / returned / failed) fall back to
//    the plain badge instead of the timeline.
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
//  const [currentPage, setCurrentPage] = useState(1);
// const itemsPerPage = 20;

// const [totalOrders, setTotalOrders] = useState(0);
// const [totalPages, setTotalPages] = useState(0);

//   /* =========================================================
//      FETCH ORDERS  (unchanged logic)
//   ========================================================= */

//   // const fetchOrders = async () => {
//   //   try {
//   //     setLoading(true);

//   //     const result = await getAllOrders();

//   //     // Backend status values are used as-is — do not remap them.
//   //     const normalizedOrders: Order[] = (result || []).map((order: any) => ({
//   //       ...order,
//   //       status: order.status || "PENDING_PAYMENT",
//   //       paymentStatus: order.paymentStatus || "PENDING",
//   //     }));

//   //     setOrders(normalizedOrders);
//   //   } catch (error) {
//   //     console.error("FETCH ORDERS ERROR:", error);
//   //     toast.error("Failed to load orders");
//   //   } finally {
//   //     setLoading(false);
//   //     setRefreshing(false);
//   //   }
//   // };
//   const fetchOrders = async () => {
//   try {
//     setLoading(true);

//     const result = await getAllOrders(
//       currentPage,
//       itemsPerPage
//     );

//     const normalizedOrders: Order[] = (
//       result.orders || []
//     ).map((order: any) => ({
//       ...order,
//       status: order.status || "PENDING_PAYMENT",
//       paymentStatus: order.paymentStatus || "PENDING",
//     }));

//     setOrders(normalizedOrders);

//     setTotalOrders(result.total || 0);
//     setTotalPages(result.totalPages || 0);
//   } catch (error) {
//     console.error("FETCH ORDERS ERROR:", error);
//     toast.error("Failed to load orders");
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// };

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

//   // const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   // const startIndex = (currentPage - 1) * itemsPerPage;
//   // const paginatedOrders = filteredOrders.slice(
//   //   startIndex,
//   //   startIndex + itemsPerPage
//   // );
// const paginatedOrders = filteredOrders;
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, dateFilter]);

//   /* =========================================================
//      STATUS UPDATE  (unchanged API call — added client-side
//      guard so an invalid/terminal transition can't be submitted)
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

//     try {
//       setUpdatingStatus(orderId);

//       // Backend expects the exact status string — no remapping.
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
//     } catch (error) {
//       console.error("UPDATE ORDER STATUS ERROR:", error);
//       toast.error("Failed to update order status");
//       await fetchOrders();
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   /* =========================================================
//      FORMAT  (unchanged logic)
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
//      STATS  (unchanged logic)
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
//         className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border text-xs font-semibold whitespace-nowrap ${config.className}`}
//       >
//         <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
//         <Icon className="w-3.5 h-3.5" />
//         {statusLabels[status]}
//       </span>
//     );
//   };

//   /* =========================================================
//      MINI STATUS TIMELINE
//      Only rendered for orders still on the happy path. Once an
//      order branches into cancelled/returned/failed, we drop back
//      to the plain badge — a linear timeline would misrepresent it.
//   ========================================================= */

//   const StatusTimeline = ({ status }: { status: OrderStatus }) => {
//     const currentIndex = HAPPY_PATH.indexOf(status);

//     return (
//       <div className="flex items-center gap-1" title={statusLabels[status]}>
//         {HAPPY_PATH.map((step, index) => (
//           <span
//             key={step}
//             className={`h-1.5 flex-1 min-w-[10px] rounded-full ${
//               index <= currentIndex ? "bg-indigo-500" : "bg-gray-200"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   /* =========================================================
//      STATUS DROPDOWN — offers only the current status plus its
//      valid next steps; locks entirely once terminal.
//   ========================================================= */
// const StatusDropdown = ({ order }: { order: Order }) => {
//   const isUpdating = updatingStatus === order.id;
//   const locked = isTerminalStatus(order.status);

//   // Current status ke according sirf allowed next statuses
//   const nextOptions =
//     STATUS_TRANSITIONS[order.status] || [];

//   if (locked) {
//     return (
//       <div
//         className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400"
//         title="This order has reached a final status and can no longer be changed"
//       >
//         <Lock className="w-3.5 h-3.5" />
//         No further action
//       </div>
//     );
//   }

//   return (
//     <select
//       value={order.status}
//       disabled={isUpdating}
//       onChange={(event) =>
//         handleStatusChange(
//           order.id,
//           order.status,
//           event.target.value as OrderStatus
//         )
//       }
//       className="w-full min-w-[175px] rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       {/* Current Status */}
//       <option value={order.status}>
//         {statusLabels[order.status]}
//       </option>

//       {/* Allowed Next Statuses */}
//       {nextOptions.map((status) => (
//         <option key={status} value={status}>
//           Move to {statusLabels[status]}
//         </option>
//       ))}
//     </select>
//   );
// };


//   // const StatusDropdown = ({ order }: { order: Order }) => {
//   //   const isUpdating = updatingStatus === order.id;
//   //   const locked = isTerminalStatus(order.status);
//   //   const nextOptions = STATUS_TRANSITIONS[order.status];

//   //   if (locked) {
//   //     return (
//   //       <div
//   //         className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-gray-200 bg-gray-50 text-xs font-medium text-gray-400"
//   //         title="This order has reached a final status and can no longer be changed"
//   //       >
//   //         <Lock className="w-3.5 h-3.5" />
//   //         No further action
//   //       </div>
//   //     );
//   //   }

//   //   return (
//   //     <select
//   //       value={order.status}
//   //       disabled={isUpdating}
//   //       onChange={(event) =>
//   //         handleStatusChange(
//   //           order.id,
//   //           order.status,
//   //           event.target.value as OrderStatus
//   //         )
//   //       }
//   //       className="w-full min-w-[175px] rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
//   //     >
//   //       <option value={order.status}>{statusLabels[order.status]}</option>
//   //       {nextOptions.map((status) => (
//   //         <option key={status} value={status}>
//   //           Move to {statusLabels[status]}
//   //         </option>
//   //       ))}
//   //     </select>
//   //   );
//   // };

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <div className="space-y-6">
//       {/* STATS */}
//       <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
//         <StatCard title="Total" value={stats.total} icon={<ShoppingBag className="w-4 h-4" />} />
//         <StatCard title="Pending Payment" value={stats.pendingPayment} icon={<Clock className="w-4 h-4" />} />
//         <StatCard title="Confirmed" value={stats.confirmed} icon={<CheckCircle2 className="w-4 h-4" />} />
//         <StatCard title="Packed" value={stats.packed} icon={<Package className="w-4 h-4" />} />
//         <StatCard title="Shipped" value={stats.shipped} icon={<Truck className="w-4 h-4" />} />
//         <StatCard title="Delivered" value={stats.delivered} icon={<CheckCircle2 className="w-4 h-4" />} />
//         <StatCard title="Cancelled" value={stats.cancelled} icon={<XCircle className="w-4 h-4" />} />
//       </div>

//       {/* MAIN CARD */}
//       <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden">
//         {/* HEADER */}
//         <div className="p-5 border-b border-gray-200 bg-gray-50/60">
//           <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Manage orders, payments, shipping and delivery status.
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2"
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
//                 Refresh
//               </Button>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2"
//               >
//                 <SlidersHorizontal className="w-4 h-4" />
//                 Filters
//                 {showFilters ? (
//                   <ChevronUp className="w-4 h-4" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* SEARCH */}
//           <div className="mt-5 flex flex-col lg:flex-row gap-3">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 placeholder="Search order, customer, phone or product..."
//                 className="pl-10"
//               />
//             </div>

//             {showFilters && (
//               <select
//                 value={dateFilter}
//                 onChange={(event) => setDateFilter(event.target.value)}
//                 className="h-10 rounded-[10px] border border-gray-300 bg-white px-4 text-sm text-gray-700"
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="week">This Week</option>
//                 <option value="month">This Month</option>
//               </select>
//             )}
//           </div>

//           {/* STATUS FILTER */}
//           <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
//             <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
//               All
//             </FilterButton>

//             {STATUS_OPTIONS.map((status) => (
//               <FilterButton
//                 key={status}
//                 active={statusFilter === status}
//                 onClick={() => setStatusFilter(status)}
//               >
//                 {statusLabels[status]}
//               </FilterButton>
//             ))}
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <Table className="min-w-[1350px]">
//             <TableHeader>
//               <TableRow className="bg-gray-50 border-b border-gray-200">
//                 <TableCell className="font-semibold text-gray-600">Order</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Customer</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Items</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Amount</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Payment</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Date</TableCell>
//                 <TableCell className="font-semibold text-gray-600">Status</TableCell>
//                 <TableCell className="font-semibold text-gray-600 text-right">Actions</TableCell>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="py-20 text-center">
//                     <div className="flex flex-col items-center gap-3">
//                       <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
//                       <span className="text-gray-500 text-sm">Loading orders...</span>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : paginatedOrders.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={8} className="py-20 text-center">
//                     <div className="mx-auto w-12 h-12 rounded-[10px] bg-gray-100 flex items-center justify-center">
//                       <ShoppingBag className="w-6 h-6 text-gray-400" />
//                     </div>
//                     <p className="mt-3 font-semibold text-gray-700">No orders found</p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Try changing your search or filters.
//                     </p>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 paginatedOrders.map((order) => {
//                   const firstItem = order.orderItems?.[0];

//                   const itemCount = (order.orderItems || []).reduce(
//                     (total, item) => total + Number(item.quantity || 0),
//                     0
//                   );

//                   const paymentStatus = order.paymentStatus || "PENDING";
//                   const showTimeline = !OFF_PATH_STATUSES.includes(order.status);

//                   return (
//                     <TableRow key={order.id} className="hover:bg-gray-50 transition align-top">
//                       {/* ORDER */}
//                       <TableCell>
//                         <div className="flex items-center gap-3">
//                           {firstItem?.product?.images?.[0]?.imageUrl ? (
//                             <div className="relative w-11 h-11 shrink-0 rounded-[10px] overflow-hidden border border-gray-200">
//                               <Image
//                                 src={firstItem.product.images[0].imageUrl}
//                                 alt={firstItem.product.name}
//                                 fill
//                                 className="object-cover"
//                               />
//                             </div>
//                           ) : (
//                             <div className="w-11 h-11 rounded-[10px] bg-gray-100 flex items-center justify-center shrink-0">
//                               <PackageOpen className="w-4 h-4 text-gray-400" />
//                             </div>
//                           )}

//                           <div className="min-w-0">
//                             <p className="font-bold text-gray-900 truncate">{order.orderCode}</p>
//                             <p className="text-xs text-gray-500 mt-0.5 truncate">
//                               {firstItem?.product?.name}
//                               {(order.orderItems?.length || 0) > 1 &&
//                                 ` +${order.orderItems.length - 1} more`}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* CUSTOMER */}
//                       <TableCell>
//                         <div className="space-y-1 min-w-[170px]">
//                           <p className="font-semibold text-gray-900">
//                             {order.buyer?.name || order.deliveryAddress?.fullName || "N/A"}
//                           </p>

//                           {order.buyer?.email && (
//                             <p className="text-xs text-gray-500 flex items-center gap-1.5">
//                               <Mail className="w-3 h-3 shrink-0" />
//                               <span className="truncate">{order.buyer.email}</span>
//                             </p>
//                           )}

//                           {(order.buyer?.phoneNumber || order.deliveryAddress?.phone) && (
//                             <p className="text-xs text-gray-500 flex items-center gap-1.5">
//                               <Phone className="w-3 h-3 shrink-0" />
//                               {order.buyer?.phoneNumber || order.deliveryAddress?.phone}
//                             </p>
//                           )}

//                           {(order.deliveryAddress?.city || order.deliveryAddress?.state) && (
//                             <p className="text-xs text-gray-400 flex items-center gap-1.5">
//                               <MapPin className="w-3 h-3 shrink-0" />
//                               {[order.deliveryAddress?.city, order.deliveryAddress?.state]
//                                 .filter(Boolean)
//                                 .join(", ")}
//                             </p>
//                           )}
//                         </div>
//                       </TableCell>

//                       {/* ITEMS */}
//                       <TableCell>
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] bg-gray-100 text-gray-700 text-sm font-semibold">
//                           <PackageOpen className="w-3.5 h-3.5" />
//                           {itemCount}
//                         </span>
//                       </TableCell>

//                       {/* AMOUNT */}
//                       <TableCell>
//                         <p className="font-bold text-gray-900">
//                           {formatCurrency(Number(order.totalAmount))}
//                         </p>
//                       </TableCell>

//                       {/* PAYMENT */}
//                       <TableCell>
//                         <div className="space-y-1.5">
//                           <span
//                             className={`inline-flex px-2.5 py-1 rounded-[10px] border text-xs font-semibold ${paymentStatusConfig[paymentStatus]}`}
//                           >
//                             {paymentStatus}
//                           </span>
//                           <p className="text-xs text-gray-500 flex items-center gap-1.5">
//                             <CreditCard className="w-3 h-3" />
//                             {order.paymentMethod || "COD"}
//                           </p>
//                         </div>
//                       </TableCell>

//                       {/* DATE */}
//                       <TableCell>
//                         <div className="flex items-start gap-2 min-w-[130px]">
//                           <Calendar className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
//                           <div>
//                             <p className="text-sm font-medium text-gray-700">
//                               {formatDate(order.createdAt)}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               Updated {formatDate(order.updatedAt)}
//                             </p>
//                           </div>
//                         </div>
//                       </TableCell>

//                       {/* STATUS */}
//                       <TableCell>
//                         <div className="space-y-2 min-w-[190px]">
//                           <StatusBadge status={order.status} />
//                           {showTimeline && <StatusTimeline status={order.status} />}
//                           <StatusDropdown order={order} />
//                         </div>
//                       </TableCell>

//                       {/* ACTIONS */}
//                       <TableCell>
//                         <div className="flex justify-end gap-1.5">
//                           {order.status === "DELIVERED" && (
//                             <button
//                               type="button"
//                               onClick={() => downloadInvoice(order.id)}
//                               title="Download invoice"
//                               className="p-2 rounded-[10px] hover:bg-green-50 text-green-600 transition"
//                             >
//                               <Download className="w-4 h-4" />
//                             </button>
//                           )}

//                           <button
//                             type="button"
//                             onClick={() => setSelectedOrder(order)}
//                             title="View order"
//                             className="p-2 rounded-[10px] hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* PAGINATION */}
//        {!loading && filteredOrders.length > 0 && (
//   <div className="border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
//     <p className="text-sm text-gray-500">
//       Showing{" "}
//       <b>
//         {(currentPage - 1) * itemsPerPage + 1}
//       </b>{" "}
//       -{" "}
//       <b>
//         {Math.min(currentPage * itemsPerPage, totalOrders)}
//       </b>{" "}
//       of <b>{totalOrders}</b> orders
//     </p>

//     <div className="flex items-center gap-2">
//       <button
//         disabled={currentPage === 1}
//         onClick={() =>
//           setCurrentPage((page) => Math.max(1, page - 1))
//         }
//         className="px-4 py-2 rounded-[10px] border border-gray-200 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition"
//       >
//         Previous
//       </button>

//       <span className="px-4 py-2 rounded-[10px] bg-indigo-600 text-white text-sm font-semibold">
//         {currentPage}
//       </span>

//       <button
//         disabled={currentPage >= totalPages}
//         onClick={() =>
//           setCurrentPage((page) =>
//             Math.min(totalPages, page + 1)
//           )
//         }
//         className="px-4 py-2 rounded-[10px] border border-gray-200 text-sm text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}
//       </div>

//       <OrderViewModal
//         isOpen={!!selectedOrder}
//         order={selectedOrder}
//         onClose={() => setSelectedOrder(null)}
//       />
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
//     <div className="bg-white border border-gray-200 rounded-[10px] p-4">
//       <div className="flex items-center justify-between">
//         <p className="text-xs font-medium text-gray-500">{title}</p>
//         <span className="w-7 h-7 rounded-[10px] bg-gray-100 text-gray-500 flex items-center justify-center">
//           {icon}
//         </span>
//       </div>
//       <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
//     </div>
//   );
// }

// /* =========================================================
//    FILTER BUTTON
// ========================================================= */

// function FilterButton({
//   active,
//   onClick,
//   children,
// }: {
//   active: boolean;
//   onClick: () => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`whitespace-nowrap px-3 py-2 rounded-[10px] text-xs font-semibold border transition ${
//         active
//           ? "bg-indigo-600 text-white border-indigo-600"
//           : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }



"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  downloadInvoice,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orders/ResentOrder";

import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

import OrderViewModal from "@/components/orders/OrderViewModal";

import {
  Search,
  Download,
  Eye,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
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
  SHIPPED: ["CANCELLED"],
  OUT_FOR_DELIVERY: ["CANCELLED"],
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
      "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    dot: "bg-blue-500",
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
      "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
    dot: "bg-red-500",
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
      "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const paymentStatusConfig: Record<PaymentStatus, string> = {
  PENDING:
    "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  PAID: "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
  FAILED:
    "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
  REFUNDED:
    "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  CANCELLED:
    "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  AUTHORIZED:
    "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  PARTIALLY_REFUNDED:
    "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900",
};

/* =========================================================
   ORDER STATUS PIPELINE
========================================================= */

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* =========================================================
     FETCH ORDERS  (unchanged logic)
  ========================================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const result = await getAllOrders(currentPage, itemsPerPage);

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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================================
     SOCKET  (unchanged logic)
  ========================================================= */

  useEffect(() => {
    const socket = getSocket();

    socket.on("new_order", () => {
      fetchOrders();
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
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  /* =========================================================
     SEARCH + FILTER  (unchanged logic)
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

    return result;
  }, [orders, searchTerm, statusFilter, dateFilter]);

  /* =========================================================
     PAGINATION  (unchanged logic)
  ========================================================= */

  const paginatedOrders = filteredOrders;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  /* =========================================================
     STATUS UPDATE (unchanged API + guard)
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
    } catch (error) {
      console.error("UPDATE ORDER STATUS ERROR:", error);
      toast.error("Failed to update order status");
      await fetchOrders();
    } finally {
      setUpdatingStatus(null);
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
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap ${config.className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className="w-3 h-3" />
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
      <div
        className="flex items-center gap-1"
        title={statusLabels[status]}
      >
        {HAPPY_PATH.map((step, index) => (
          <span
            key={step}
            className={`h-1.5 flex-1 min-w-[10px] rounded-full ${
              index <= currentIndex
                ? "bg-indigo-500"
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
      return (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-400 dark:text-slate-500"
          title="This order has reached a final status and can no longer be changed"
        >
          <Lock className="w-3 h-3" />
          No further action
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
        className="w-full min-w-[175px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6 space-y-6">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Commerce
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Orders
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage orders, payments, shipping and delivery status.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                showFilters
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* ============ STATS ============ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<ShoppingBag className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Pending Payment"
            value={stats.pendingPayment}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Packed"
            value={stats.packed}
            icon={<Package className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Shipped"
            value={stats.shipped}
            icon={<Truck className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          />
          <StatCard
            title="Cancelled"
            value={stats.cancelled}
            icon={<XCircle className="w-3.5 h-3.5" />}
          />
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- TABS (status filters) -------- */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              <button
                onClick={() => setStatusFilter("all")}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
                  statusFilter === "all"
                    ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                All
                <span
                  className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded ${
                    statusFilter === "all"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {stats.total}
                </span>
                {statusFilter === "all" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>

              {STATUS_OPTIONS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
                      active
                        ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {statusLabels[status]}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------- SEARCH + DATE FILTER -------- */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search order, customer, phone or product..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {showFilters && (
                <select
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              )}
            </div>
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[1350px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
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
                        className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                      >
                        {label}
                      </TableCell>
                    ))}
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : paginatedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <ShoppingBag
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            No orders found
                          </div>
                          <div className="text-xs">
                            Try changing your search or filters.
                          </div>
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
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group align-top"
                        >
                          {/* ORDER */}
                          <TableCell className="!py-3 !px-3">
                            <div className="flex items-center gap-3">
                              {firstItem?.product?.images?.[0]?.imageUrl ? (
                                <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                  <Image
                                    src={firstItem.product.images[0].imageUrl}
                                    alt={firstItem.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                  <PackageOpen className="w-4 h-4 text-slate-400" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {order.orderCode}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
                                  {firstItem?.product?.name}
                                  {(order.orderItems?.length || 0) > 1 &&
                                    ` +${order.orderItems.length - 1} more`}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* CUSTOMER */}
                          <TableCell className="!py-3 !px-3">
                            <div className="space-y-0.5 min-w-[170px]">
                              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                {order.buyer?.name ||
                                  order.deliveryAddress?.fullName ||
                                  "N/A"}
                              </p>

                              {order.buyer?.email && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                                  <span className="truncate max-w-[180px]">
                                    {order.buyer.email}
                                  </span>
                                </p>
                              )}

                              {(order.buyer?.phoneNumber ||
                                order.deliveryAddress?.phone) && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 tabular-nums">
                                  <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                                  {order.buyer?.phoneNumber ||
                                    order.deliveryAddress?.phone}
                                </p>
                              )}

                              {(order.deliveryAddress?.city ||
                                order.deliveryAddress?.state) && (
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
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
                          <TableCell className="!py-3 !px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <PackageOpen className="w-3 h-3" />
                              {itemCount}
                            </span>
                          </TableCell>

                          {/* AMOUNT */}
                          <TableCell className="!py-3 !px-3">
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                              {formatCurrency(Number(order.totalAmount))}
                            </p>
                          </TableCell>

                          {/* PAYMENT */}
                          <TableCell className="!py-3 !px-3">
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded border ${paymentStatusConfig[paymentStatus]}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                                {paymentStatus}
                              </span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <CreditCard className="w-3 h-3 text-slate-400" />
                                {order.paymentMethod || "COD"}
                              </p>
                            </div>
                          </TableCell>

                          {/* DATE */}
                          <TableCell className="!py-3 !px-3">
                            <div className="flex items-start gap-2 min-w-[130px]">
                              <Calendar className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                                  {formatDate(order.createdAt)}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                                  Upd. {formatDate(order.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* STATUS */}
                          <TableCell className="!py-3 !px-3">
                            <div className="space-y-2 min-w-[190px]">
                              <StatusBadge status={order.status} />
                              {showTimeline && (
                                <StatusTimeline status={order.status} />
                              )}
                              <StatusDropdown order={order} />
                            </div>
                          </TableCell>

                          {/* ACTIONS */}
                          <TableCell className="!py-3 !px-3 text-right">
                            <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity justify-end">
                              {order.status === "DELIVERED" && (
                                <button
                                  type="button"
                                  onClick={() => downloadInvoice(order.id)}
                                  title="Download invoice"
                                  className="p-1.5 rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                title="View order"
                                className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
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
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <b className="text-slate-700 dark:text-slate-300 tabular-nums">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </b>{" "}
                  -{" "}
                  <b className="text-slate-700 dark:text-slate-300 tabular-nums">
                    {Math.min(currentPage * itemsPerPage, totalOrders)}
                  </b>{" "}
                  of{" "}
                  <b className="text-slate-700 dark:text-slate-300 tabular-nums">
                    {totalOrders}
                  </b>{" "}
                  orders
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Previous
                  </button>

                  <span className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold tabular-nums">
                    {currentPage}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <span className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
          {icon}
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
        {value}
      </p>
    </div>
  );
}