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


// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import {
//   X, Package, Calendar, User, Phone, MapPin, CreditCard,
//   Hash, Receipt, XCircle, CheckCircle, Truck, ShieldCheck,
//   Box, Mail, Copy, Check, FileText, Printer, RefreshCw,
//   ExternalLink, MessageSquare, Save, ChevronDown
// } from "lucide-react";
// import { getCancellationReasonLabel } from "@/utils/cancellationReasons";

// interface OrderViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   order: any;
// }

// /* =========================================================
//    STYLES & CONSTANTS
// ========================================================= */

// const STATUS_STYLES: Record<string, string> = {
//   PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
//   PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
//   OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
//   DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   CANCELLED: "bg-red-50 text-red-700 border-red-200",
//   RETURN_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
//   RETURNED: "bg-rose-50 text-rose-700 border-rose-200",
//   REFUNDED: "bg-teal-50 text-teal-700 border-teal-200",
// };

// const getStatusStyle = (status: string | undefined) => {
//   return STATUS_STYLES[String(status || "").toUpperCase()] || "bg-gray-50 text-gray-700 border-gray-200";
// };

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function AdminOrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
//   const [copiedText, setCopiedText] = useState<string | null>(null);
//   const [adminNote, setAdminNote] = useState("");
//   const [isUpdating, setIsUpdating] = useState(false);

//   if (!isOpen || !order) return null;

//   const formatCurrency = (amount: number | string) => {
//     const value = Number(amount);
//     if (!Number.isFinite(value)) return "N/A";
//     return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
//   };

//   const formatDate = (date?: string | Date | null) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
//     });
//   };

//   const handleCopy = (text: string) => {
//     if (!text || text === "N/A") return;
//     navigator.clipboard.writeText(text);
//     setCopiedText(text);
//     setTimeout(() => setCopiedText(null), 2000);
//   };

//   const address = order.deliveryAddress || {};
//   const buyer = order.buyer || {};
//   const shipment = order.shipments?.[0] || {};

//   // Mock function for admin action
//   const handleUpdateStatus = (newStatus: string) => {
//     setIsUpdating(true);
//     console.log("Updating order status to:", newStatus);
//     setTimeout(() => setIsUpdating(false), 1000); // Fake API call
//   };

//   return (
//     <div className="fixed inset-0 z-[99999] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4">
//       <div className="relative bg-gray-50 w-full max-w-6xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-2xl">
        
//         {/* =================================================
//             HEADER (Admin Actions)
//         ================================================= */}
//         <div className="shrink-0 bg-white border-b border-gray-200 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10">
//           <div>
//             <div className="flex items-center gap-3">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900">Admin Order View</h2>
//               <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(order.status)}`}>
//                 {order.status.replace(/_/g, " ")}
//               </span>
//             </div>
//             <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//               <Hash className="w-4 h-4" /> {order.orderCode}
//               <button onClick={() => handleCopy(order.orderCode)} className="text-gray-400 hover:text-gray-700">
//                 {copiedText === order.orderCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
//               </button>
//               <span className="text-gray-300">|</span>
//               <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">User ID: {buyer.id || "N/A"}</span>
//             </p>
//           </div>

//           <div className="flex items-center gap-2 w-full sm:w-auto">
//             {/* Quick Status Update Dropdown (Mock) */}
//             <div className="relative flex-1 sm:flex-none">
//               <select 
//                 className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 onChange={(e) => handleUpdateStatus(e.target.value)}
//                 defaultValue=""
//               >
//                 <option value="" disabled>Change Status...</option>
//                 <option value="CONFIRMED">Mark Confirmed</option>
//                 <option value="PACKED">Mark Packed</option>
//                 <option value="SHIPPED">Mark Shipped</option>
//                 <option value="DELIVERED">Mark Delivered</option>
//                 <option value="CANCELLED">Cancel Order</option>
//               </select>
//               <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-2.5 pointer-events-none" />
//             </div>

//             <button onClick={onClose} className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         {/* =================================================
//             BODY (Scrollable)
//         ================================================= */}
//         <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
//             {/* LEFT COL: Items & Summary (Span 2) */}
//             <div className="lg:col-span-2 space-y-5">
              
//               {/* Items List */}
//               <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                 <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
//                     <Box className="w-4 h-4 text-gray-500" /> Order Items
//                   </h3>
//                 </div>
//                 <div className="divide-y divide-gray-100">
//                   {order.orderItems?.map((item: any) => (
//                     <div key={item.id} className="flex gap-4 p-4">
//                       <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
//                         <Image src={item.product?.images?.[0]?.imageUrl || "/placeholder.png"} alt="Product" fill className="object-contain p-1" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product?.name}</h4>
//                         <div className="flex items-center gap-4 mt-1">
//                           <p className="text-xs text-gray-500">SKU: {item.product?.skuCode || "N/A"}</p>
//                           <p className="text-xs text-gray-500">Qty: <span className="font-bold text-gray-800">{item.quantity}</span></p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm font-bold text-gray-900">{formatCurrency(item.totalPrice || item.price)}</p>
//                         <p className="text-xs text-gray-500">₹{item.price} / unit</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Admin Internal Notes */}
//               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
//                   <MessageSquare className="w-4 h-4 text-gray-500" /> Internal Admin Notes
//                 </h3>
//                 <textarea 
//                   rows={3} 
//                   placeholder="Add a private note about this order (not visible to customer)..."
//                   className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   value={adminNote}
//                   onChange={(e) => setAdminNote(e.target.value)}
//                 />
//                 <div className="mt-2 flex justify-end">
//                   <button className="flex items-center gap-2 text-xs font-semibold text-white bg-gray-900 px-3 py-1.5 rounded hover:bg-gray-800 transition">
//                     <Save className="w-3.5 h-3.5" /> Save Note
//                   </button>
//                 </div>
//               </div>

//               {/* Shipment Info (Admin Only) */}
//               {(order.trackingId || shipment.awbNumber) && (
//                 <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm">
//                   <div className="px-5 py-3 border-b border-blue-100 bg-blue-50/50 flex items-center gap-2">
//                     <Truck className="w-4 h-4 text-blue-600" />
//                     <h3 className="text-sm font-semibold text-blue-900">Shipment Details (Shiprocket)</h3>
//                   </div>
//                   <div className="p-5 grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-xs text-gray-500">Courier Partner</p>
//                       <p className="font-medium text-gray-900">{shipment.courierPartner || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">AWB / Tracking No.</p>
//                       <p className="font-mono font-medium text-blue-700">{shipment.awbNumber || order.trackingId || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Provider Status</p>
//                       <p className="font-medium text-gray-900">{shipment.providerStatus || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Expected Delivery</p>
//                       <p className="font-medium text-gray-900">{formatDate(shipment.expectedDeliveryDate)}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT COL: Customer, Address, Payment & Refund */}
//             <div className="space-y-5">
              
//               {/* Payment Details */}
//               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
//                   <CreditCard className="w-4 h-4 text-gray-500" /> Payment Details
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center border-b border-gray-100 pb-2">
//                     <span className="text-sm text-gray-500">Method</span>
//                     <span className="text-sm font-bold text-gray-900">{order.paymentMethod || "COD"}</span>
//                   </div>
//                   <div className="flex justify-between items-center border-b border-gray-100 pb-2">
//                     <span className="text-sm text-gray-500">Status</span>
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                       {order.paymentStatus}
//                     </span>
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Transaction ID</span>
//                     <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block break-all">{order.transactionId || "N/A"}</span>
//                   </div>
//                   <div>
//                     <span className="text-xs text-gray-500 block mb-1">Razorpay Order ID</span>
//                     <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded block break-all">{order.razorpayOrderId || "N/A"}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer & Address */}
//               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
//                   <User className="w-4 h-4 text-gray-500" /> Customer Info
//                 </h3>
//                 <div className="space-y-2 mb-4 border-b border-gray-100 pb-4">
//                   <p className="text-sm font-bold text-gray-900">{address.fullName || buyer.name}</p>
//                   <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {address.phoneNumber || buyer.phoneNumber}</p>
//                   <p className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {buyer.email}</p>
//                 </div>
                
//                 <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
//                   <MapPin className="w-4 h-4 text-gray-500" /> Delivery Address
//                 </h3>
//                 <div className="text-sm text-gray-700 leading-relaxed">
//                   <p>{address.address}</p>
//                   <p>{address.city}, {address.state} - {address.pincode}</p>
//                   <p className="mt-1 text-xs text-gray-500 uppercase">Type: {address.addressType || "Home"}</p>
//                 </div>
//               </div>

//               {/* Cancel / Refund Info (Admin View) */}
//               {(order.status === "CANCELLED" || order.refund) && (
//                 <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
//                   <h3 className="text-sm font-semibold text-red-900 flex items-center gap-2 mb-2">
//                     <XCircle className="w-4 h-4" /> Cancellation / Refund
//                   </h3>
//                   <div className="space-y-2 text-sm text-red-800">
//                     <p><span className="font-semibold">Reason:</span> {getCancellationReasonLabel(order.cancelReasonCode) || order.cancelReason}</p>
//                     <p><span className="font-semibold">Cancelled On:</span> {formatDate(order.cancelledAt)}</p>
//                     {order.refund && (
//                       <div className="mt-3 pt-3 border-t border-red-200">
//                         <p><span className="font-semibold">Refund Amount:</span> {formatCurrency(order.refund.refundAmount)}</p>
//                         <p><span className="font-semibold">Ref Status:</span> {order.refund.refundStatus}</p>
//                         <p><span className="font-semibold">Ref Reference:</span> {order.refund.refundReference || "N/A"}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>

//         </div>

//         {/* =================================================
//             FOOTER ACTIONS
//         ================================================= */}
//         <div className="shrink-0 bg-white border-t border-gray-200 p-4 flex flex-wrap gap-3 sm:justify-end">
//           <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//             <Printer className="w-4 h-4" /> Print Invoice
//           </button>
          
//           {order.paymentStatus === "PAID" && order.status !== "CANCELLED" && (
//             <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
//               <RefreshCw className="w-4 h-4" /> Initiate Refund
//             </button>
//           )}

//           <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition shadow-sm">
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



"use client";

import Image from "next/image";
import { useState } from "react";
import {
  X,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  Hash,
  Receipt,
  XCircle,
  Truck,
  Mail,
  Copy,
  Check,
  Box,
  RotateCcw,
} from "lucide-react";
import { getCancellationReasonLabel } from "@/utils/cancellationReasons";
import { retryShiprocketCancellation } from "@/services/orders/ResentOrder";

// ==========================================================
// COURIER CANCELLATION (Shiprocket) for a cancelled order
// ==========================================================

const COURIER_CANCEL_TEXT: Record<string, string> = {
  CANCELLED: "Cancelled at Shiprocket (confirmed by Shiprocket).",
  REQUESTED: "Cancellation requested at Shiprocket; waiting for the courier to confirm.",
  IN_PROGRESS: "Cancellation at Shiprocket is in progress.",
  NOT_REQUIRED: "Not booked with Shiprocket; nothing to cancel there.",
};

const CourierCancelPanel = ({ order, shipment }: { order: any; shipment: any }) => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [current, setCurrent] = useState<{ status: string | null; error: string | null }>({
    status: shipment?.providerCancelStatus ?? null,
    error: shipment?.providerCancelError ?? null,
  });

  const orderCancelled = ["CANCELLED", "FAILED"].includes(String(order?.status || "").toUpperCase());
  const atShiprocket =
    String(shipment?.provider || "").toUpperCase() === "SHIPROCKET" && Boolean(shipment?.providerOrderId);
  if (!orderCancelled || !atShiprocket) return null;

  const confirmed = current.status === "CANCELLED" || String(shipment?.status || "").toUpperCase() === "CANCELLED";
  const text =
    COURIER_CANCEL_TEXT[current.status || ""] ||
    current.error ||
    "Not yet confirmed as cancelled at Shiprocket.";

  const retry = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response: any = await retryShiprocketCancellation(Number(shipment.id));
      const data = response?.data?.data || {};
      setCurrent({ status: data.providerCancelStatus ?? data.outcome ?? null, error: data.error ?? null });
      setResult({ ok: true, text: response?.data?.message || "Updated" });
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.data) setCurrent({ status: data.data.providerCancelStatus ?? data.data.outcome ?? null, error: data.data.error ?? null });
      setResult({ ok: false, text: data?.data?.error || data?.message || "Shiprocket cancellation failed" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="status"
      className={`mt-4 rounded-lg border p-3 text-sm ${
        confirmed ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      <p className="font-semibold">Courier cancellation</p>
      <p className="mt-0.5">{confirmed ? COURIER_CANCEL_TEXT.CANCELLED : text}</p>
      {!confirmed && current.error && current.error !== text && <p className="mt-0.5">{current.error}</p>}
      {!confirmed && (
        <button
          type="button"
          onClick={retry}
          disabled={busy || current.status === "IN_PROGRESS"}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {busy ? "Contacting Shiprocket…" : current.status === "NOT_CANCELLABLE" ? "Check Shiprocket again" : "Retry Shiprocket cancellation"}
        </button>
      )}
      {result && <p className={`mt-2 text-xs ${result.ok ? "text-green-700" : "text-red-700"}`}>{result.text}</p>}
    </div>
  );
};

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PACKED: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  OUT_FOR_DELIVERY: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  RETURN_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
  RETURNED: "bg-pink-50 text-pink-700 border-pink-200",
  REFUNDED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

const REFUND_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  REFUNDED: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

const RETURN_STATUS_STYLES: Record<string, string> = {
  REQUESTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  PICKED_UP: "bg-indigo-50 text-indigo-700 border-indigo-200",
  RECEIVED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  RETURNED: "bg-green-50 text-green-700 border-green-200",
};

const statusClass = (
  status?: string,
  styles: Record<string, string> = STATUS_STYLES
) =>
  styles[String(status || "").toUpperCase()] ||
  "bg-gray-50 text-gray-700 border-gray-200";

const prettyStatus = (status?: string) =>
  status
    ? status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "N/A";

export default function AdminOrderViewModal({
  isOpen,
  onClose,
  order,
}: OrderViewModalProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "N/A";
    const value = Number(amount);
    if (!Number.isFinite(value)) return "N/A";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async (value?: string | null) => {
    if (!value || value === "N/A") return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedText(value);
      window.setTimeout(() => setCopiedText(null), 1800);
    } catch {
      setCopiedText(null);
    }
  };

  const address = order.deliveryAddress || {};
  const buyer = order.buyer || {};
  const shipment = order.shipments?.[0] || null;
  const refund = order.refund || order.refundDetails || null;

  const returnData =
    order.returnRequest ||
    order.returnDetails ||
    order.returns?.[0] ||
    null;

  const paymentStatus = order.paymentStatus || "N/A";

  const refundStatus =
    refund?.refundStatus ||
    refund?.status ||
    order.refundStatus ||
    (paymentStatus === "REFUNDED" ? "REFUNDED" : null);

  const refundAmount =
    refund?.refundAmount ?? refund?.amount ?? order.refundAmount;

  const cancellationReason =
    getCancellationReasonLabel(order.cancelReasonCode) ||
    order.cancelReason ||
    "No reason recorded";

  const showCancellation =
    order.status === "CANCELLED" ||
    Boolean(order.cancelledAt) ||
    Boolean(order.cancelReasonCode) ||
    Boolean(order.cancelReason);

  const showRefund =
    Boolean(refund) ||
    paymentStatus === "REFUNDED" ||
    Boolean(order.refundAmount) ||
    Boolean(order.refundStatus);

  const showShipment =
    Boolean(shipment) ||
    Boolean(order.trackingId);

  const returnStatus =
    returnData?.status ||
    order.returnStatus ||
    (order.status === "RETURN_REQUESTED"
      ? "REQUESTED"
      : order.status === "RETURNED"
        ? "RETURNED"
        : null);

  const showReturn =
    Boolean(returnData) ||
    order.status === "RETURN_REQUESTED" ||
    order.status === "RETURNED" ||
    Boolean(order.returnStatus);

  const orderItems = order.orderItems || [];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 p-0 backdrop-blur-sm sm:p-4">
      <div className="relative flex h-full max-h-[96vh] w-full max-w-[1380px] flex-col overflow-hidden rounded-none border border-gray-200 bg-white shadow-2xl sm:h-auto sm:max-h-[94vh] sm:rounded-2xl">

        {/* HEADER */}
        <div className="z-10 flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                Order Details
              </h2>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Hash className="h-4 w-4 shrink-0" />
              <span className="break-all">
                {order.orderCode || `Order #${order.id}`}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(order.orderCode)}
                title="Copy order number"
                className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
              >
                {copiedText === order.orderCode ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-white p-4 sm:p-6">

          {/* SUMMARY */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<Hash className="h-5 w-5" />}
              label="Order ID"
              value={`#${order.id ?? "N/A"}`}
            />

            <SummaryCard
              icon={<Calendar className="h-5 w-5" />}
              label="Order Date"
              value={formatDate(order.createdAt)}
            />

            <SummaryCard
              icon={<Receipt className="h-5 w-5" />}
              label="Total Amount"
              value={formatCurrency(order.totalAmount)}
              highlight
            />

            <SummaryCard
              icon={<CreditCard className="h-5 w-5" />}
              label="Payment Method"
              value={prettyStatus(order.paymentMethod || "COD")}
            />
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">

            {/* LEFT COLUMN */}
            <div className="space-y-5">

              {/* CUSTOMER DETAILS */}
              <Section
                title="Customer Details"
                icon={<User className="h-5 w-5" />}
              >
                <DetailRow
                  label="Customer Name"
                  value={address.fullName || buyer.name}
                />

                <DetailRow
                  label="Buyer Account"
                  value={buyer.name}
                />

                <DetailRow
                  label="Email"
                  value={buyer.email}
                />

                <DetailRow
                  label="Delivery Phone"
                  value={
                    address.phoneNumber ||
                    address.phone ||
                    buyer.phoneNumber
                  }
                />

                {buyer.id !== undefined && (
                  <DetailRow label="User ID" value={buyer.id} />
                )}
              </Section>

              {/* PAYMENT DETAILS */}
              <Section
                title="Payment Details"
                icon={<CreditCard className="h-5 w-5" />}
              >
                <DetailRow
                  label="Payment Status"
                  value={
                    <StatusBadge
                      status={paymentStatus}
                      styles={PAYMENT_STATUS_STYLES}
                    />
                  }
                />

                <DetailRow
                  label="Payment Gateway"
                  value={prettyStatus(order.paymentMethod || "N/A")}
                />

                <DetailRow
                  label="Transaction ID"
                  value={order.transactionId}
                  copyValue={order.transactionId}
                />

                <DetailRow
                  label="Razorpay Order ID"
                  value={order.razorpayOrderId}
                  copyValue={order.razorpayOrderId}
                />
              </Section>

              {/* DELIVERY ADDRESS */}
              <Section
                title="Delivery Address"
                icon={<MapPin className="h-5 w-5" />}
              >
                <div className="space-y-1 text-sm leading-6 text-gray-700">
                  <p className="font-semibold text-gray-900">
                    {address.fullName || buyer.name || "N/A"}
                  </p>

                  <p>
                    {[
                      address.address,
                      address.addressLine1,
                      address.addressLine2,
                    ]
                      .filter(Boolean)
                      .filter(
                        (item, index, array) =>
                          array.indexOf(item) === index
                      )
                      .join(", ") || "Address not available"}
                  </p>

                  <p>
                    {[
                      address.city,
                      address.state,
                      address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {address.country && <p>{address.country}</p>}

                  <span className="mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                    {prettyStatus(address.addressType || "HOME")}
                  </span>
                </div>
              </Section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">

              {/* CANCELLATION DETAILS */}
              {showCancellation && (
                <Section
                  title="Cancellation Details"
                  icon={<XCircle className="h-5 w-5 text-red-600" />}
                  tone="red"
                  badge="Cancelled"
                >
                  <DetailRow
                    label="Reason"
                    value={cancellationReason}
                  />

                  <DetailRow
                    label="Cancellation Note"
                    value={order.cancellationNote}
                  />

                  <DetailRow
                    label="Cancelled At"
                    value={formatDate(order.cancelledAt)}
                  />

                  <DetailRow
                    label="Cancelled By"
                    value={
                      order.cancelledByName ||
                      (order.cancelledByUserId
                        ? `Admin #${order.cancelledByUserId}`
                        : "Customer / system")
                    }
                  />
                </Section>
              )}

              {/* REFUND DETAILS */}
              {showRefund && (
                <Section
                  title="Refund Details"
                  icon={<RotateCcw className="h-5 w-5 text-green-600" />}
                  tone="green"
                  badge={prettyStatus(refundStatus || "N/A")}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(150px,0.8fr)_1.6fr]">

                    <div className="flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50 p-4 text-center">
                      <p className="text-xs font-medium text-gray-600">
                        Refund Amount
                      </p>

                      <p className="mt-1 text-3xl font-bold tracking-tight text-green-700">
                        {formatCurrency(refundAmount)}
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        {Number(refundAmount) === Number(order.totalAmount)
                          ? "Full refund amount"
                          : "Refund processed"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <DetailRow
                        label="Refund Status"
                        value={
                          <StatusBadge
                            status={refundStatus}
                            styles={REFUND_STATUS_STYLES}
                          />
                        }
                      />

                      <DetailRow
                        label="Refund Method"
                        value={prettyStatus(
                          refund?.paymentMethod || refund?.method
                        )}
                      />

                      <DetailRow
                        label="Refund Reference"
                        value={
                          refund?.refundReference ||
                          refund?.gatewayRefundId
                        }
                        copyValue={
                          refund?.refundReference ||
                          refund?.gatewayRefundId
                        }
                      />

                      <DetailRow
                        label="Refund Processed At"
                        value={formatDate(
                          refund?.refundedAt || refund?.initiatedAt
                        )}
                      />

                      <DetailRow
                        label="Refund Credited At"
                        value={formatDate(
                          refund?.refundCreditedAt ||
                          refund?.completedAt
                        )}
                      />

                      <DetailRow
                        label="Retryable"
                        value={
                          refund?.retryable === true
                            ? "Yes"
                            : refund?.retryable === false
                              ? "No"
                              : "N/A"
                        }
                      />

                      {refund?.failureReason && (
                        <DetailRow
                          label="Failure Reason"
                          value={refund.failureReason}
                        />
                      )}
                    </div>
                  </div>
                </Section>
              )}

              {/* RETURN DETAILS */}
              {showReturn && (
                <Section
                  title="Return Details"
                  icon={<Package className="h-5 w-5 text-orange-600" />}
                  tone="orange"
                  badge={prettyStatus(returnStatus)}
                >
                  <DetailRow
                    label="Return Status"
                    value={
                      <StatusBadge
                        status={returnStatus}
                        styles={RETURN_STATUS_STYLES}
                      />
                    }
                  />

                  <DetailRow
                    label="Return Request ID"
                    value={
                      returnData?.returnId ||
                      returnData?.id ||
                      order.returnId
                    }
                    copyValue={
                      returnData?.returnId ||
                      returnData?.id ||
                      order.returnId
                    }
                  />

                  <DetailRow
                    label="Return Reason"
                    value={
                      returnData?.reason ||
                      returnData?.returnReason ||
                      order.returnReason
                    }
                  />

                  <DetailRow
                    label="Return Note"
                    value={
                      returnData?.note ||
                      returnData?.description ||
                      order.returnNote
                    }
                  />

                  <DetailRow
                    label="Requested At"
                    value={formatDate(
                      returnData?.requestedAt ||
                      returnData?.createdAt
                    )}
                  />

                  <DetailRow
                    label="Processed By"
                    value={
                      returnData?.processedByName ||
                      returnData?.approvedByName
                    }
                  />

                  <DetailRow
                    label="Pickup Status"
                    value={
                      returnData?.pickupStatus ||
                      order.returnPickupStatus
                    }
                  />

                  <DetailRow
                    label="Pickup Date"
                    value={formatDate(
                      returnData?.pickupDate ||
                      returnData?.scheduledPickupAt
                    )}
                  />

                  <DetailRow
                    label="Received At"
                    value={formatDate(returnData?.receivedAt)}
                  />

                  <DetailRow
                    label="Inspection Status"
                    value={returnData?.inspectionStatus}
                  />

                  <DetailRow
                    label="Inspection Note"
                    value={returnData?.inspectionNote}
                  />
                </Section>
              )}

              {/* SHIPMENT DETAILS */}
              {showShipment && (
                <Section
                  title="Shipment Details"
                  icon={<Truck className="h-5 w-5 text-blue-600" />}
                  tone="blue"
                  badge={prettyStatus(
                    shipment?.providerStatus ||
                    shipment?.status ||
                    "N/A"
                  )}
                >
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">

                    <div>
                      <DetailRow
                        label="Shipment Code"
                        value={
                          shipment?.shipmentCode ||
                          shipment?.shipmentNumber
                        }
                      />

                      <DetailRow
                        label="Provider"
                        value={prettyStatus(
                          shipment?.provider || "SHIPROCKET"
                        )}
                      />

                      <DetailRow
                        label="Courier"
                        value={
                          shipment?.courierPartner ||
                          shipment?.courierName
                        }
                      />

                      <DetailRow
                        label="AWB Number"
                        value={
                          shipment?.awbNumber || order.trackingId
                        }
                        copyValue={
                          shipment?.awbNumber || order.trackingId
                        }
                      />
                    </div>

                    <div>
                      <DetailRow
                        label="Provider Order ID"
                        value={shipment?.providerOrderId}
                        copyValue={shipment?.providerOrderId}
                      />

                      <DetailRow
                        label="Provider Shipment ID"
                        value={shipment?.providerShipmentId}
                        copyValue={shipment?.providerShipmentId}
                      />

                      <DetailRow
                        label="Provider Status"
                        value={prettyStatus(shipment?.providerStatus)}
                      />

                      <DetailRow
                        label="Expected Delivery"
                        value={formatDate(
                          shipment?.expectedDeliveryDate
                        )}
                      />

                      <DetailRow
                        label="Shipment Created At"
                        value={formatDate(shipment?.createdAt)}
                      />

                      <DetailRow
                        label="Last Updated"
                        value={formatDate(shipment?.updatedAt)}
                      />
                    </div>
                  </div>

                  <CourierCancelPanel order={order} shipment={shipment} />
                </Section>
              )}
            </div>
          </div>

          {/* ORDER ITEMS - FULL WIDTH */}
          <Section
            title={`Order Items (${orderItems.length})`}
            icon={<Box className="h-5 w-5" />}
            noPadding
          >
            {orderItems.length ? (
              <div className="divide-y divide-gray-100">
                {orderItems.map((item: any) => {
                  const imageUrl =
                    item.product?.images?.[0]?.imageUrl ||
                    "/placeholder.png";

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <Image
                          src={imageUrl}
                          alt={item.product?.name || "Product"}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">
                          {item.product?.name || "Product"}
                        </h4>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>
                            Product ID: {item.product?.id ?? "N/A"}
                          </span>

                          <span>
                            SKU: {item.product?.skuCode || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-5 border-t border-gray-100 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                        <ItemAmount
                          label="Price"
                          value={formatCurrency(item.price)}
                        />

                        <ItemAmount
                          label="Qty"
                          value={String(item.quantity ?? 0)}
                        />

                        <ItemAmount
                          label="Total"
                          value={formatCurrency(
                            item.totalPrice ??
                              Number(item.price || 0) *
                                Number(item.quantity || 0)
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="p-6 text-center text-sm text-gray-500">
                No order items found.
              </p>
            )}
          </Section>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-3.5 sm:px-7">
          <p className="hidden text-xs text-gray-400 sm:block">
            Order information is displayed from the admin order response.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <p className="text-xs font-medium text-gray-500">
          {label}
        </p>
      </div>

      <p
        title={value}
        className={`mt-2 truncate ${
          highlight
            ? "text-2xl font-bold tracking-tight text-gray-900"
            : "text-base font-bold text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION CARD
========================================================= */

function Section({
  title,
  icon,
  children,
  tone = "gray",
  badge,
  noPadding = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  tone?: "gray" | "red" | "green" | "blue" | "orange";
  badge?: string;
  noPadding?: boolean;
}) {
  const tones = {
    gray: "border-gray-200 bg-gray-50 text-gray-900",
    red: "border-red-200 bg-red-50 text-red-900",
    green: "border-green-200 bg-green-50 text-green-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    orange: "border-orange-200 bg-orange-50 text-orange-900",
  };

  const badgeTones = {
    gray: "border-gray-200 bg-white text-gray-700",
    red: "border-red-200 bg-red-100 text-red-700",
    green: "border-green-200 bg-green-100 text-green-700",
    blue: "border-blue-200 bg-blue-100 text-blue-700",
    orange: "border-orange-200 bg-orange-100 text-orange-700",
  };

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div
        className={`flex min-h-[46px] items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 ${tones[tone]}`}
      >
        <h3 className="flex items-center gap-2 text-sm font-bold sm:text-base">
          {icon}
          {title}
        </h3>

        {badge && (
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${badgeTones[tone]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className={noPadding ? "" : "px-4 py-3 sm:px-5"}>
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: React.ReactNode;
  copyValue?: string | number | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (
      copyValue === null ||
      copyValue === undefined ||
      copyValue === ""
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(String(copyValue));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const display =
    value === null || value === undefined || value === ""
      ? "Not recorded"
      : value;

  return (
    <div className="grid grid-cols-[minmax(115px,0.9fr)_minmax(0,1.4fr)] items-center gap-3 border-b border-gray-100 py-2 last:border-b-0">
      <p className="text-xs text-gray-500 sm:text-sm">
        {label}
      </p>

      <div className="flex min-w-0 items-center justify-end gap-2 text-right text-xs font-semibold text-gray-900 sm:text-sm">
        <span className="min-w-0 break-words">
          {display}
        </span>

        {copyValue !== null &&
          copyValue !== undefined &&
          copyValue !== "" && (
            <button
              type="button"
              onClick={handleCopy}
              title={`Copy ${label}`}
              className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
  styles = STATUS_STYLES,
}: {
  status?: string;
  styles?: Record<string, string>;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClass(
        status,
        styles
      )}`}
    >
      {prettyStatus(status)}
    </span>
  );
}

/* =========================================================
   ORDER ITEM AMOUNT
========================================================= */

function ItemAmount({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
