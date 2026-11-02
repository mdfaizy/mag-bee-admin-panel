// "use client";

// import Image from "next/image";
// import {
//   X,
//   Package,
//   Calendar,
//   User,
//   Phone,
//   MapPin,
//   CreditCard,
//   Hash,
//   Receipt,
//   XCircle,
// } from "lucide-react";
// import { getCancellationReasonLabel } from "@/utils/cancellationReasons";

// interface OrderViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   order: any;
// }

// /* =========================================================
//    STATUS BADGE CONFIG — same palette used in OrdersTable so
//    the badge reads identically in the table and in this modal.
//    Display-only mapping; does not touch the raw order.status
//    value coming from the backend.
// ========================================================= */

// const STATUS_STYLES: Record<string, string> = {
//   PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   PACKED: "bg-blue-50 text-blue-700 border-blue-200",
//   SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700 border-purple-200",
//   DELIVERED: "bg-green-50 text-green-700 border-green-200",
//   CANCELLED: "bg-red-50 text-red-700 border-red-200",
//   RETURN_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
//   RETURNED: "bg-pink-50 text-pink-700 border-pink-200",
//   REFUNDED: "bg-cyan-50 text-cyan-700 border-cyan-200",
//   FAILED: "bg-red-50 text-red-700 border-red-200",
// };

// const STATUS_LABELS: Record<string, string> = {
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

// const PAYMENT_STATUS_STYLES: Record<string, string> = {
//   PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   PAID: "bg-green-50 text-green-700 border-green-200",
//   FAILED: "bg-red-50 text-red-700 border-red-200",
//   REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
// };

// export default function OrderViewModal({
//   isOpen,
//   onClose,
//   order,
// }: OrderViewModalProps) {
//   if (!isOpen || !order) return null;

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleString();
//   };

//   const statusBadgeClass =
//     STATUS_STYLES[order.status] || "bg-gray-50 text-gray-700 border-gray-200";
//   const statusLabel = STATUS_LABELS[order.status] || order.status;

//   const paymentStatus = order.paymentStatus || "N/A";
//   const paymentBadgeClass =
//     PAYMENT_STATUS_STYLES[paymentStatus] ||
//     "bg-gray-50 text-gray-700 border-gray-200";

//   const address = order.deliveryAddress;
//   const hasAddress =
//     address &&
//     (address.addressLine1 ||
//       address.addressLine2 ||
//       address.city ||
//       address.state ||
//       address.pincode);

//   return (
//     <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[10px] border border-gray-200 overflow-hidden flex flex-col">
//         {/* HEADER */}
//         <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
//             <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
//               <Hash className="w-3.5 h-3.5" />
//               {order.orderCode}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <span
//               className={`inline-flex px-2.5 py-1 rounded-[10px] border text-xs font-semibold whitespace-nowrap ${statusBadgeClass}`}
//             >
//               {statusLabel}
//             </span>

//             <button
//               onClick={onClose}
//               className="w-9 h-9 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 transition flex items-center justify-center"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* BODY */}
//         <div className="p-6 overflow-y-auto space-y-6">
//           {/* SUMMARY GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <SummaryStat
//               icon={<Hash className="w-4 h-4" />}
//               label="Order ID"
//               value={`#${order.id}`}
//             />
//             <SummaryStat
//               icon={<Calendar className="w-4 h-4" />}
//               label="Order Date"
//               value={formatDate(order.createdAt)}
//             />
//             <SummaryStat
//               icon={<Receipt className="w-4 h-4" />}
//               label="Total Amount"
//               value={formatCurrency(Number(order.totalAmount))}
//               emphasize
//             />
//             <SummaryStat
//               icon={<CreditCard className="w-4 h-4" />}
//               label="Payment Method"
//               value={order.paymentMethod || "COD"}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* CUSTOMER */}
//             <Section title="Customer" icon={<User className="w-4 h-4" />}>
//               <Field
//                 label="Customer Name"
//                 value={
//                   order.deliveryAddress?.fullName || order.buyer?.name || "N/A"
//                 }
//               />
//               <Field
//                 label="Phone Number"
//                 icon={<Phone className="w-3.5 h-3.5" />}
//                 value={
//                   order.deliveryAddress?.phone ||
//                   order.buyer?.phoneNumber ||
//                   "N/A"
//                 }
//               />
//               {order.buyer?.email && (
//                 <Field label="Email" value={order.buyer.email} />
//               )}
//             </Section>

//             {/* PAYMENT */}
//             <Section
//               title="Payment"
//               icon={<CreditCard className="w-4 h-4" />}
//             >
//               <div className="flex items-center justify-between py-1.5">
//                 <p className="text-xs text-gray-500">Payment Status</p>
//                 <span
//                   className={`inline-flex px-2.5 py-1 rounded-[10px] border text-xs font-semibold ${paymentBadgeClass}`}
//                 >
//                   {paymentStatus}
//                 </span>
//               </div>
//               <Field
//                 label="Transaction ID"
//                 value={order.transactionId || "N/A"}
//                 breakAll
//               />
//               {order.trackingId && (
//                 <Field label="Tracking ID" value={order.trackingId} breakAll />
//               )}
//               {order.courierPartner && (
//                 <Field label="Courier Partner" value={order.courierPartner} />
//               )}
//             </Section>
//           </div>

//           {/* CANCELLATION */}
//           {order.status === "CANCELLED" && (
//             <Section
//               title="Cancellation"
//               icon={<XCircle className="w-4 h-4 text-red-500" />}
//             >
//               <Field
//                 label="Reason"
//                 value={
//                   getCancellationReasonLabel(order.cancelReasonCode) ||
//                   order.cancelReason ||
//                   "No reason recorded"
//                 }
//                 breakAll
//               />
//               {order.cancellationNote && (
//                 <div className="py-1.5">
//                   <p className="text-xs text-gray-500">Notes</p>
//                   <p className="text-sm text-gray-900 whitespace-pre-wrap break-words mt-0.5">
//                     {order.cancellationNote}
//                   </p>
//                 </div>
//               )}
//               {order.cancelledAt && (
//                 <Field label="Cancelled At" value={formatDate(order.cancelledAt)} />
//               )}
//               <Field
//                 label="Cancelled By"
//                 value={
//                   order.cancelledByUserId
//                     ? order.cancelledByName || `Admin #${order.cancelledByUserId}`
//                     : "Customer / system"
//                 }
//               />
//             </Section>
//           )}

//           {/* DELIVERY ADDRESS */}
//           {hasAddress && (
//             <Section
//               title="Delivery Address"
//               icon={<MapPin className="w-4 h-4" />}
//             >
//               <p className="text-sm text-gray-800 leading-relaxed">
//                 {[address?.addressLine1, address?.addressLine2]
//                   .filter(Boolean)
//                   .join(", ")}
//                 {address?.city || address?.state || address?.pincode ? (
//                   <>
//                     <br />
//                     {[address?.city, address?.state, address?.pincode]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </>
//                 ) : null}
//               </p>
//             </Section>
//           )}

//           {/* ORDER ITEMS */}
//           <div className="border border-gray-200 rounded-[10px] overflow-hidden">
//             <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
//               <Package className="w-4 h-4 text-gray-500" />
//               <h3 className="text-sm font-semibold text-gray-900">
//                 Order Items
//               </h3>
//             </div>

//             <div className="divide-y divide-gray-100">
//               {order.orderItems?.map((item: any) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
//                 >
//                   <div className="relative w-14 h-14 rounded-[10px] overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
//                     <Image
//                       src={
//                         item.product?.images?.[0]?.imageUrl ||
//                         "/placeholder.png"
//                       }
//                       alt={item.product?.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h4 className="text-sm font-semibold text-gray-900 truncate">
//                       {item.product?.name}
//                     </h4>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       Product ID: {item.product?.id}
//                     </p>
//                   </div>

//                   <div className="text-right shrink-0">
//                     <p className="text-xs text-gray-500">Quantity</p>
//                     <p className="text-sm font-bold text-gray-900">
//                       {item.quantity}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SUMMARY STAT — top-row quick facts
// ========================================================= */

// function SummaryStat({
//   icon,
//   label,
//   value,
//   emphasize,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   emphasize?: boolean;
// }) {
//   return (
//     <div className="border border-gray-200 rounded-[10px] p-3.5">
//       <div className="flex items-center gap-1.5 text-gray-400">
//         {icon}
//         <p className="text-xs font-medium text-gray-500">{label}</p>
//       </div>
//       <p
//         className={`mt-1.5 truncate ${
//           emphasize
//             ? "text-lg font-bold text-gray-900"
//             : "text-sm font-semibold text-gray-800"
//         }`}
//         title={value}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION — grouped card with a title row
// ========================================================= */

// function Section({
//   title,
//   icon,
//   children,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="border border-gray-200 rounded-[10px] p-4">
//       <div className="flex items-center gap-2 mb-3 text-gray-700">
//         {icon}
//         <h3 className="text-sm font-semibold">{title}</h3>
//       </div>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// /* =========================================================
//    FIELD — label/value row
// ========================================================= */

// function Field({
//   label,
//   value,
//   icon,
//   breakAll,
// }: {
//   label: string;
//   value: string;
//   icon?: React.ReactNode;
//   breakAll?: boolean;
// }) {
//   return (
//     <div className="flex items-center justify-between gap-4 py-1.5">
//       <p className="text-xs text-gray-500 flex items-center gap-1.5 shrink-0">
//         {icon}
//         {label}
//       </p>
//       <p
//         className={`text-sm font-semibold text-gray-900 text-right ${
//           breakAll ? "break-all" : "truncate"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { useState } from "react";
import {
  X, Package, Calendar, User, Phone, MapPin, CreditCard,
  Hash, Receipt, XCircle, CheckCircle, Truck, ShieldCheck,
  Box, Mail, Copy, Check, FileText, Printer, RefreshCw,
  ExternalLink, MessageSquare, Save, ChevronDown
} from "lucide-react";
import { getCancellationReasonLabel } from "@/utils/cancellationReasons";

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

/* =========================================================
   STYLES & CONSTANTS
========================================================= */

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURN_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
  RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-teal-50 text-teal-700 border-teal-200",
};

const getStatusStyle = (status: string | undefined) => {
  return STATUS_STYLES[String(status || "").toUpperCase()] || "bg-gray-50 text-gray-700 border-gray-200";
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminOrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number | string) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return "N/A";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const handleCopy = (text: string) => {
    if (!text || text === "N/A") return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const address = order.deliveryAddress || {};
  const buyer = order.buyer || {};
  const shipment = order.shipments?.[0] || {};

  // Mock function for admin action
  const handleUpdateStatus = (newStatus: string) => {
    setIsUpdating(true);
    console.log("Updating order status to:", newStatus);
    setTimeout(() => setIsUpdating(false), 1000); // Fake API call
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
      <div className="relative bg-gray-50 w-full max-w-6xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-2xl">
        
        {/* =================================================
            HEADER (Admin Actions)
        ================================================= */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Admin Order View</h2>
              <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(order.status)}`}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Hash className="w-4 h-4" /> {order.orderCode}
              <button onClick={() => handleCopy(order.orderCode)} className="text-gray-400 hover:text-gray-700">
                {copiedText === order.orderCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">User ID: {buyer.id || "N/A"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick Status Update Dropdown (Mock) */}
            <div className="relative flex-1 sm:flex-none">
              <select 
                className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => handleUpdateStatus(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Change Status...</option>
                <option value="CONFIRMED">Mark Confirmed</option>
                <option value="PACKED">Mark Packed</option>
                <option value="SHIPPED">Mark Shipped</option>
                <option value="DELIVERED">Mark Delivered</option>
                <option value="CANCELLED">Cancel Order</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <button onClick={onClose} className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* =================================================
            BODY (Scrollable)
        ================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* LEFT COL: Items & Summary (Span 2) */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Items List */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Box className="w-4 h-4 text-gray-500" /> Order Items
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                        <Image src={item.product?.images?.[0]?.imageUrl || "/placeholder.png"} alt="Product" fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-500">SKU: {item.product?.skuCode || "N/A"}</p>
                          <p className="text-xs text-gray-500">Qty: <span className="font-bold text-gray-800">{item.quantity}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(item.totalPrice || item.price)}</p>
                        <p className="text-xs text-gray-500">₹{item.price} / unit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-gray-500" /> Internal Admin Notes
                </h3>
                <textarea 
                  rows={3} 
                  placeholder="Add a private note about this order (not visible to customer)..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <button className="flex items-center gap-2 text-xs font-semibold text-white bg-gray-900 px-3 py-1.5 rounded hover:bg-gray-800 transition">
                    <Save className="w-3.5 h-3.5" /> Save Note
                  </button>
                </div>
              </div>

              {/* Shipment Info (Admin Only) */}
              {(order.trackingId || shipment.awbNumber) && (
                <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-blue-100 bg-blue-50/50 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-900">Shipment Details (Shiprocket)</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Courier Partner</p>
                      <p className="font-medium text-gray-900">{shipment.courierPartner || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">AWB / Tracking No.</p>
                      <p className="font-mono font-medium text-blue-700">{shipment.awbNumber || order.trackingId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Provider Status</p>
                      <p className="font-medium text-gray-900">{shipment.providerStatus || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expected Delivery</p>
                      <p className="font-medium text-gray-900">{formatDate(shipment.expectedDeliveryDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COL: Customer, Address, Payment & Refund */}
            <div className="space-y-5">
              
              {/* Payment Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-gray-500" /> Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Method</span>
                    <span className="text-sm font-bold text-gray-900">{order.paymentMethod || "COD"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Transaction ID</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block break-all">{order.transactionId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Razorpay Order ID</span>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block break-all">{order.razorpayOrderId || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-gray-500" /> Customer Info
                </h3>
                <div className="space-y-2 mb-4 border-b border-gray-100 pb-4">
                  <p className="text-sm font-bold text-gray-900">{address.fullName || buyer.name}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {address.phoneNumber || buyer.phoneNumber}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {buyer.email}</p>
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> Delivery Address
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <p className="mt-1 text-xs text-gray-500 uppercase">Type: {address.addressType || "Home"}</p>
                </div>
              </div>

              {/* Cancel / Refund Info (Admin View) */}
              {(order.status === "CANCELLED" || order.refund) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-red-900 flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4" /> Cancellation / Refund
                  </h3>
                  <div className="space-y-2 text-sm text-red-800">
                    <p><span className="font-semibold">Reason:</span> {getCancellationReasonLabel(order.cancelReasonCode) || order.cancelReason}</p>
                    <p><span className="font-semibold">Cancelled On:</span> {formatDate(order.cancelledAt)}</p>
                    {order.refund && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p><span className="font-semibold">Refund Amount:</span> {formatCurrency(order.refund.refundAmount)}</p>
                        <p><span className="font-semibold">Ref Status:</span> {order.refund.refundStatus}</p>
                        <p><span className="font-semibold">Ref Reference:</span> {order.refund.refundReference || "N/A"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* =================================================
            FOOTER ACTIONS
        ================================================= */}
        <div className="shrink-0 bg-white border-t border-gray-200 p-4 flex flex-wrap gap-3 sm:justify-end">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          
          {order.paymentStatus === "PAID" && order.status !== "CANCELLED" && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
              <RefreshCw className="w-4 h-4" /> Initiate Refund
            </button>
          )}

          <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition shadow-sm">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}