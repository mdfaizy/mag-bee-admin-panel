// "use client";

// import Image from "next/image";
// import { useState } from "react";
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
//   Truck,
//   Mail,
//   Copy,
//   Check,
//   Box,
//   RotateCcw,
// } from "lucide-react";
// import { getCancellationReasonLabel } from "@/utils/cancellationReasons";
// import { retryShiprocketCancellation } from "@/services/orders/ResentOrder";

// // ==========================================================
// // COURIER CANCELLATION (Shiprocket) for a cancelled order
// // ==========================================================

// const COURIER_CANCEL_TEXT: Record<string, string> = {
//   CANCELLED: "Cancelled at Shiprocket (confirmed by Shiprocket).",
//   REQUESTED: "Cancellation requested at Shiprocket; waiting for the courier to confirm.",
//   IN_PROGRESS: "Cancellation at Shiprocket is in progress.",
//   NOT_REQUIRED: "Not booked with Shiprocket; nothing to cancel there.",
// };

// const CourierCancelPanel = ({ order, shipment }: { order: any; shipment: any }) => {
//   const [busy, setBusy] = useState(false);
//   const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
//   const [current, setCurrent] = useState<{ status: string | null; error: string | null }>({
//     status: shipment?.providerCancelStatus ?? null,
//     error: shipment?.providerCancelError ?? null,
//   });

//   const orderCancelled = ["CANCELLED", "FAILED"].includes(String(order?.status || "").toUpperCase());
//   const atShiprocket =
//     String(shipment?.provider || "").toUpperCase() === "SHIPROCKET" && Boolean(shipment?.providerOrderId);
//   if (!orderCancelled || !atShiprocket) return null;

//   const confirmed = current.status === "CANCELLED" || String(shipment?.status || "").toUpperCase() === "CANCELLED";
//   const text =
//     COURIER_CANCEL_TEXT[current.status || ""] ||
//     current.error ||
//     "Not yet confirmed as cancelled at Shiprocket.";

//   const retry = async () => {
//     setBusy(true);
//     setResult(null);
//     try {
//       const response: any = await retryShiprocketCancellation(Number(shipment.id));
//       const data = response?.data?.data || {};
//       setCurrent({ status: data.providerCancelStatus ?? data.outcome ?? null, error: data.error ?? null });
//       setResult({ ok: true, text: response?.data?.message || "Updated" });
//     } catch (error: any) {
//       const data = error?.response?.data;
//       if (data?.data) setCurrent({ status: data.data.providerCancelStatus ?? data.data.outcome ?? null, error: data.data.error ?? null });
//       setResult({ ok: false, text: data?.data?.error || data?.message || "Shiprocket cancellation failed" });
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div
//       role="status"
//       className={`mt-4 rounded-lg border p-3 text-sm ${
//         confirmed ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800"
//       }`}
//     >
//       <p className="font-semibold">Courier cancellation</p>
//       <p className="mt-0.5">{confirmed ? COURIER_CANCEL_TEXT.CANCELLED : text}</p>
//       {!confirmed && current.error && current.error !== text && <p className="mt-0.5">{current.error}</p>}
//       {!confirmed && (
//         <button
//           type="button"
//           onClick={retry}
//           disabled={busy || current.status === "IN_PROGRESS"}
//           className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
//         >
//           <RotateCcw className="h-3.5 w-3.5" />
//           {busy ? "Contacting Shiprocket…" : current.status === "NOT_CANCELLABLE" ? "Check Shiprocket again" : "Retry Shiprocket cancellation"}
//         </button>
//       )}
//       {result && <p className={`mt-2 text-xs ${result.ok ? "text-green-700" : "text-red-700"}`}>{result.text}</p>}
//     </div>
//   );
// };

// interface OrderViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   order: any;
// }

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

// const PAYMENT_STATUS_STYLES: Record<string, string> = {
//   PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   PAID: "bg-green-50 text-green-700 border-green-200",
//   FAILED: "bg-red-50 text-red-700 border-red-200",
//   REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
// };

// const REFUND_STATUS_STYLES: Record<string, string> = {
//   PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
//   REFUNDED: "bg-green-50 text-green-700 border-green-200",
//   COMPLETED: "bg-green-50 text-green-700 border-green-200",
//   FAILED: "bg-red-50 text-red-700 border-red-200",
// };

// const RETURN_STATUS_STYLES: Record<string, string> = {
//   REQUESTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
//   REJECTED: "bg-red-50 text-red-700 border-red-200",
//   PICKED_UP: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   RECEIVED: "bg-cyan-50 text-cyan-700 border-cyan-200",
//   COMPLETED: "bg-green-50 text-green-700 border-green-200",
//   RETURNED: "bg-green-50 text-green-700 border-green-200",
// };

// const statusClass = (
//   status?: string,
//   styles: Record<string, string> = STATUS_STYLES
// ) =>
//   styles[String(status || "").toUpperCase()] ||
//   "bg-gray-50 text-gray-700 border-gray-200";

// const prettyStatus = (status?: string) =>
//   status
//     ? status
//         .replace(/_/g, " ")
//         .toLowerCase()
//         .replace(/\b\w/g, (char) => char.toUpperCase())
//     : "N/A";

// export default function AdminOrderViewModal({
//   isOpen,
//   onClose,
//   order,
// }: OrderViewModalProps) {
//   const [copiedText, setCopiedText] = useState<string | null>(null);

//   if (!isOpen || !order) return null;

//   const formatCurrency = (amount: number | string | null | undefined) => {
//     if (amount === null || amount === undefined || amount === "") return "N/A";
//     const value = Number(amount);
//     if (!Number.isFinite(value)) return "N/A";

//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 2,
//     }).format(value);
//   };

//   const formatDate = (date?: string | Date | null) => {
//     if (!date) return "N/A";
//     const parsed = new Date(date);
//     if (Number.isNaN(parsed.getTime())) return "N/A";

//     return parsed.toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const handleCopy = async (value?: string | null) => {
//     if (!value || value === "N/A") return;

//     try {
//       await navigator.clipboard.writeText(value);
//       setCopiedText(value);
//       window.setTimeout(() => setCopiedText(null), 1800);
//     } catch {
//       setCopiedText(null);
//     }
//   };

//   const address = order.deliveryAddress || {};
//   const buyer = order.buyer || {};
//   const shipment = order.shipments?.[0] || null;
//   const refund = order.refund || order.refundDetails || null;

//   const returnData =
//     order.returnRequest ||
//     order.returnDetails ||
//     order.returns?.[0] ||
//     null;

//   const paymentStatus = order.paymentStatus || "N/A";

//   const refundStatus =
//     refund?.refundStatus ||
//     refund?.status ||
//     order.refundStatus ||
//     (paymentStatus === "REFUNDED" ? "REFUNDED" : null);

//   const refundAmount =
//     refund?.refundAmount ?? refund?.amount ?? order.refundAmount;

//   const cancellationReason =
//     getCancellationReasonLabel(order.cancelReasonCode) ||
//     order.cancelReason ||
//     "No reason recorded";

//   const showCancellation =
//     order.status === "CANCELLED" ||
//     Boolean(order.cancelledAt) ||
//     Boolean(order.cancelReasonCode) ||
//     Boolean(order.cancelReason);

//   const showRefund =
//     Boolean(refund) ||
//     paymentStatus === "REFUNDED" ||
//     Boolean(order.refundAmount) ||
//     Boolean(order.refundStatus);

//   const showShipment =
//     Boolean(shipment) ||
//     Boolean(order.trackingId);

//   const returnStatus =
//     returnData?.status ||
//     order.returnStatus ||
//     (order.status === "RETURN_REQUESTED"
//       ? "REQUESTED"
//       : order.status === "RETURNED"
//         ? "RETURNED"
//         : null);

//   const showReturn =
//     Boolean(returnData) ||
//     order.status === "RETURN_REQUESTED" ||
//     order.status === "RETURNED" ||
//     Boolean(order.returnStatus);

//   const orderItems = order.orderItems || [];

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-900/60 p-0 backdrop-blur-sm sm:p-4">
//       <div className="relative flex h-full max-h-[96vh] w-full max-w-[1380px] flex-col overflow-hidden rounded-none border border-gray-200 bg-white shadow-2xl sm:h-auto sm:max-h-[94vh] sm:rounded-2xl">

//         {/* HEADER */}
//         <div className="z-10 flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-3">
//               <h2 className="text-xl font-bold tracking-tight text-gray-900">
//                 Order Details
//               </h2>
//               <StatusBadge status={order.status} />
//             </div>

//             <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
//               <Hash className="h-4 w-4 shrink-0" />
//               <span className="break-all">
//                 {order.orderCode || `Order #${order.id}`}
//               </span>
//               <button
//                 type="button"
//                 onClick={() => handleCopy(order.orderCode)}
//                 title="Copy order number"
//                 className="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
//               >
//                 {copiedText === order.orderCode ? (
//                   <Check className="h-3.5 w-3.5 text-green-600" />
//                 ) : (
//                   <Copy className="h-3.5 w-3.5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close order details"
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* SCROLLABLE BODY */}
//         <div className="flex-1 space-y-5 overflow-y-auto bg-white p-4 sm:p-6">

//           {/* SUMMARY */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             <SummaryCard
//               icon={<Hash className="h-5 w-5" />}
//               label="Order ID"
//               value={`#${order.id ?? "N/A"}`}
//             />

//             <SummaryCard
//               icon={<Calendar className="h-5 w-5" />}
//               label="Order Date"
//               value={formatDate(order.createdAt)}
//             />

//             <SummaryCard
//               icon={<Receipt className="h-5 w-5" />}
//               label="Total Amount"
//               value={formatCurrency(order.totalAmount)}
//               highlight
//             />

//             <SummaryCard
//               icon={<CreditCard className="h-5 w-5" />}
//               label="Payment Method"
//               value={prettyStatus(order.paymentMethod || "COD")}
//             />
//           </div>

//           {/* TWO COLUMN CONTENT */}
//           <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">

//             {/* LEFT COLUMN */}
//             <div className="space-y-5">

//               {/* CUSTOMER DETAILS */}
//               <Section
//                 title="Customer Details"
//                 icon={<User className="h-5 w-5" />}
//               >
//                 <DetailRow
//                   label="Customer Name"
//                   value={address.fullName || buyer.name}
//                 />

//                 <DetailRow
//                   label="Buyer Account"
//                   value={buyer.name}
//                 />

//                 <DetailRow
//                   label="Email"
//                   value={buyer.email}
//                 />

//                 <DetailRow
//                   label="Delivery Phone"
//                   value={
//                     address.phoneNumber ||
//                     address.phone ||
//                     buyer.phoneNumber
//                   }
//                 />

//                 {buyer.id !== undefined && (
//                   <DetailRow label="User ID" value={buyer.id} />
//                 )}
//               </Section>

//               {/* PAYMENT DETAILS */}
//               <Section
//                 title="Payment Details"
//                 icon={<CreditCard className="h-5 w-5" />}
//               >
//                 <DetailRow
//                   label="Payment Status"
//                   value={
//                     <StatusBadge
//                       status={paymentStatus}
//                       styles={PAYMENT_STATUS_STYLES}
//                     />
//                   }
//                 />

//                 <DetailRow
//                   label="Payment Gateway"
//                   value={prettyStatus(order.paymentMethod || "N/A")}
//                 />

//                 <DetailRow
//                   label="Transaction ID"
//                   value={order.transactionId}
//                   copyValue={order.transactionId}
//                 />

//                 <DetailRow
//                   label="Razorpay Order ID"
//                   value={order.razorpayOrderId}
//                   copyValue={order.razorpayOrderId}
//                 />
//               </Section>

//               {/* DELIVERY ADDRESS */}
//               <Section
//                 title="Delivery Address"
//                 icon={<MapPin className="h-5 w-5" />}
//               >
//                 <div className="space-y-1 text-sm leading-6 text-gray-700">
//                   <p className="font-semibold text-gray-900">
//                     {address.fullName || buyer.name || "N/A"}
//                   </p>

//                   <p>
//                     {[
//                       address.address,
//                       address.addressLine1,
//                       address.addressLine2,
//                     ]
//                       .filter(Boolean)
//                       .filter(
//                         (item, index, array) =>
//                           array.indexOf(item) === index
//                       )
//                       .join(", ") || "Address not available"}
//                   </p>

//                   <p>
//                     {[
//                       address.city,
//                       address.state,
//                       address.pincode,
//                     ]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </p>

//                   {address.country && <p>{address.country}</p>}

//                   <span className="mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
//                     {prettyStatus(address.addressType || "HOME")}
//                   </span>
//                 </div>
//               </Section>
//             </div>

//             {/* RIGHT COLUMN */}
//             <div className="space-y-5">

//               {/* CANCELLATION DETAILS */}
//               {showCancellation && (
//                 <Section
//                   title="Cancellation Details"
//                   icon={<XCircle className="h-5 w-5 text-red-600" />}
//                   tone="red"
//                   badge="Cancelled"
//                 >
//                   <DetailRow
//                     label="Reason"
//                     value={cancellationReason}
//                   />

//                   <DetailRow
//                     label="Cancellation Note"
//                     value={order.cancellationNote}
//                   />

//                   <DetailRow
//                     label="Cancelled At"
//                     value={formatDate(order.cancelledAt)}
//                   />

//                   <DetailRow
//                     label="Cancelled By"
//                     value={
//                       order.cancelledByName ||
//                       (order.cancelledByUserId
//                         ? `Admin #${order.cancelledByUserId}`
//                         : "Customer / system")
//                     }
//                   />
//                 </Section>
//               )}

//               {/* REFUND DETAILS */}
//               {showRefund && (
//                 <Section
//                   title="Refund Details"
//                   icon={<RotateCcw className="h-5 w-5 text-green-600" />}
//                   tone="green"
//                   badge={prettyStatus(refundStatus || "N/A")}
//                 >
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(150px,0.8fr)_1.6fr]">

//                     <div className="flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-green-100 bg-green-50 p-4 text-center">
//                       <p className="text-xs font-medium text-gray-600">
//                         Refund Amount
//                       </p>

//                       <p className="mt-1 text-3xl font-bold tracking-tight text-green-700">
//                         {formatCurrency(refundAmount)}
//                       </p>

//                       <p className="mt-1 text-xs text-green-600">
//                         {Number(refundAmount) === Number(order.totalAmount)
//                           ? "Full refund amount"
//                           : "Refund processed"}
//                       </p>
//                     </div>

//                     <div className="min-w-0">
//                       <DetailRow
//                         label="Refund Status"
//                         value={
//                           <StatusBadge
//                             status={refundStatus}
//                             styles={REFUND_STATUS_STYLES}
//                           />
//                         }
//                       />

//                       <DetailRow
//                         label="Refund Method"
//                         value={prettyStatus(
//                           refund?.paymentMethod || refund?.method
//                         )}
//                       />

//                       <DetailRow
//                         label="Refund Reference"
//                         value={
//                           refund?.refundReference ||
//                           refund?.gatewayRefundId
//                         }
//                         copyValue={
//                           refund?.refundReference ||
//                           refund?.gatewayRefundId
//                         }
//                       />

//                       <DetailRow
//                         label="Refund Processed At"
//                         value={formatDate(
//                           refund?.refundedAt || refund?.initiatedAt
//                         )}
//                       />

//                       <DetailRow
//                         label="Refund Credited At"
//                         value={formatDate(
//                           refund?.refundCreditedAt ||
//                           refund?.completedAt
//                         )}
//                       />

//                       <DetailRow
//                         label="Retryable"
//                         value={
//                           refund?.retryable === true
//                             ? "Yes"
//                             : refund?.retryable === false
//                               ? "No"
//                               : "N/A"
//                         }
//                       />

//                       {refund?.failureReason && (
//                         <DetailRow
//                           label="Failure Reason"
//                           value={refund.failureReason}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </Section>
//               )}

//               {/* RETURN DETAILS */}
//               {showReturn && (
//                 <Section
//                   title="Return Details"
//                   icon={<Package className="h-5 w-5 text-orange-600" />}
//                   tone="orange"
//                   badge={prettyStatus(returnStatus)}
//                 >
//                   <DetailRow
//                     label="Return Status"
//                     value={
//                       <StatusBadge
//                         status={returnStatus}
//                         styles={RETURN_STATUS_STYLES}
//                       />
//                     }
//                   />

//                   <DetailRow
//                     label="Return Request ID"
//                     value={
//                       returnData?.returnId ||
//                       returnData?.id ||
//                       order.returnId
//                     }
//                     copyValue={
//                       returnData?.returnId ||
//                       returnData?.id ||
//                       order.returnId
//                     }
//                   />

//                   <DetailRow
//                     label="Return Reason"
//                     value={
//                       returnData?.reason ||
//                       returnData?.returnReason ||
//                       order.returnReason
//                     }
//                   />

//                   <DetailRow
//                     label="Return Note"
//                     value={
//                       returnData?.note ||
//                       returnData?.description ||
//                       order.returnNote
//                     }
//                   />

//                   <DetailRow
//                     label="Requested At"
//                     value={formatDate(
//                       returnData?.requestedAt ||
//                       returnData?.createdAt
//                     )}
//                   />

//                   <DetailRow
//                     label="Processed By"
//                     value={
//                       returnData?.processedByName ||
//                       returnData?.approvedByName
//                     }
//                   />

//                   <DetailRow
//                     label="Pickup Status"
//                     value={
//                       returnData?.pickupStatus ||
//                       order.returnPickupStatus
//                     }
//                   />

//                   <DetailRow
//                     label="Pickup Date"
//                     value={formatDate(
//                       returnData?.pickupDate ||
//                       returnData?.scheduledPickupAt
//                     )}
//                   />

//                   <DetailRow
//                     label="Received At"
//                     value={formatDate(returnData?.receivedAt)}
//                   />

//                   <DetailRow
//                     label="Inspection Status"
//                     value={returnData?.inspectionStatus}
//                   />

//                   <DetailRow
//                     label="Inspection Note"
//                     value={returnData?.inspectionNote}
//                   />
//                 </Section>
//               )}

//               {/* SHIPMENT DETAILS */}
//               {showShipment && (
//                 <Section
//                   title="Shipment Details"
//                   icon={<Truck className="h-5 w-5 text-blue-600" />}
//                   tone="blue"
//                   badge={prettyStatus(
//                     shipment?.providerStatus ||
//                     shipment?.status ||
//                     "N/A"
//                   )}
//                 >
//                   <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">

//                     <div>
//                       <DetailRow
//                         label="Shipment Code"
//                         value={
//                           shipment?.shipmentCode ||
//                           shipment?.shipmentNumber
//                         }
//                       />

//                       <DetailRow
//                         label="Provider"
//                         value={prettyStatus(
//                           shipment?.provider || "SHIPROCKET"
//                         )}
//                       />

//                       <DetailRow
//                         label="Courier"
//                         value={
//                           shipment?.courierPartner ||
//                           shipment?.courierName
//                         }
//                       />

//                       <DetailRow
//                         label="AWB Number"
//                         value={
//                           shipment?.awbNumber || order.trackingId
//                         }
//                         copyValue={
//                           shipment?.awbNumber || order.trackingId
//                         }
//                       />
//                     </div>

//                     <div>
//                       <DetailRow
//                         label="Provider Order ID"
//                         value={shipment?.providerOrderId}
//                         copyValue={shipment?.providerOrderId}
//                       />

//                       <DetailRow
//                         label="Provider Shipment ID"
//                         value={shipment?.providerShipmentId}
//                         copyValue={shipment?.providerShipmentId}
//                       />

//                       <DetailRow
//                         label="Provider Status"
//                         value={prettyStatus(shipment?.providerStatus)}
//                       />

//                       <DetailRow
//                         label="Expected Delivery"
//                         value={formatDate(
//                           shipment?.expectedDeliveryDate
//                         )}
//                       />

//                       <DetailRow
//                         label="Shipment Created At"
//                         value={formatDate(shipment?.createdAt)}
//                       />

//                       <DetailRow
//                         label="Last Updated"
//                         value={formatDate(shipment?.updatedAt)}
//                       />
//                     </div>
//                   </div>

//                   <CourierCancelPanel order={order} shipment={shipment} />
//                 </Section>
//               )}
//             </div>
//           </div>

//           {/* ORDER ITEMS - FULL WIDTH */}
//           <Section
//             title={`Order Items (${orderItems.length})`}
//             icon={<Box className="h-5 w-5" />}
//             noPadding
//           >
//             {orderItems.length ? (
//               <div className="divide-y divide-gray-100">
//                 {orderItems.map((item: any) => {
//                   const imageUrl =
//                     item.product?.images?.[0]?.imageUrl ||
//                     "/placeholder.png";

//                   return (
//                     <div
//                       key={item.id}
//                       className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5"
//                     >
//                       <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
//                         <Image
//                           src={imageUrl}
//                           alt={item.product?.name || "Product"}
//                           fill
//                           sizes="80px"
//                           className="object-contain p-1"
//                         />
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">
//                           {item.product?.name || "Product"}
//                         </h4>

//                         <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
//                           <span>
//                             Product ID: {item.product?.id ?? "N/A"}
//                           </span>

//                           <span>
//                             SKU: {item.product?.skuCode || "N/A"}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-5 border-t border-gray-100 pt-3 text-center sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
//                         <ItemAmount
//                           label="Price"
//                           value={formatCurrency(item.price)}
//                         />

//                         <ItemAmount
//                           label="Qty"
//                           value={String(item.quantity ?? 0)}
//                         />

//                         <ItemAmount
//                           label="Total"
//                           value={formatCurrency(
//                             item.totalPrice ??
//                               Number(item.price || 0) *
//                                 Number(item.quantity || 0)
//                           )}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p className="p-6 text-center text-sm text-gray-500">
//                 No order items found.
//               </p>
//             )}
//           </Section>
//         </div>

//         {/* FOOTER */}
//         <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-3.5 sm:px-7">
//           <p className="hidden text-xs text-gray-400 sm:block">
//             Order information is displayed from the admin order response.
//           </p>

//           <button
//             type="button"
//             onClick={onClose}
//             className="ml-auto rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SUMMARY CARD
// ========================================================= */

// function SummaryCard({
//   icon,
//   label,
//   value,
//   highlight = false,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   highlight?: boolean;
// }) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4">
//       <div className="flex items-center gap-2 text-gray-400">
//         {icon}

//         <p className="text-xs font-medium text-gray-500">
//           {label}
//         </p>
//       </div>

//       <p
//         title={value}
//         className={`mt-2 truncate ${
//           highlight
//             ? "text-2xl font-bold tracking-tight text-gray-900"
//             : "text-base font-bold text-gray-900"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// /* =========================================================
//    SECTION CARD
// ========================================================= */

// function Section({
//   title,
//   icon,
//   children,
//   tone = "gray",
//   badge,
//   noPadding = false,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   tone?: "gray" | "red" | "green" | "blue" | "orange";
//   badge?: string;
//   noPadding?: boolean;
// }) {
//   const tones = {
//     gray: "border-gray-200 bg-gray-50 text-gray-900",
//     red: "border-red-200 bg-red-50 text-red-900",
//     green: "border-green-200 bg-green-50 text-green-900",
//     blue: "border-blue-200 bg-blue-50 text-blue-900",
//     orange: "border-orange-200 bg-orange-50 text-orange-900",
//   };

//   const badgeTones = {
//     gray: "border-gray-200 bg-white text-gray-700",
//     red: "border-red-200 bg-red-100 text-red-700",
//     green: "border-green-200 bg-green-100 text-green-700",
//     blue: "border-blue-200 bg-blue-100 text-blue-700",
//     orange: "border-orange-200 bg-orange-100 text-orange-700",
//   };

//   return (
//     <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
//       <div
//         className={`flex min-h-[46px] items-center justify-between gap-3 border-b px-4 py-3 sm:px-5 ${tones[tone]}`}
//       >
//         <h3 className="flex items-center gap-2 text-sm font-bold sm:text-base">
//           {icon}
//           {title}
//         </h3>

//         {badge && (
//           <span
//             className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold ${badgeTones[tone]}`}
//           >
//             {badge}
//           </span>
//         )}
//       </div>

//       <div className={noPadding ? "" : "px-4 py-3 sm:px-5"}>
//         {children}
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    DETAIL ROW
// ========================================================= */

// function DetailRow({
//   label,
//   value,
//   copyValue,
// }: {
//   label: string;
//   value: React.ReactNode;
//   copyValue?: string | number | null;
// }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     if (
//       copyValue === null ||
//       copyValue === undefined ||
//       copyValue === ""
//     ) {
//       return;
//     }

//     try {
//       await navigator.clipboard.writeText(String(copyValue));
//       setCopied(true);
//       window.setTimeout(() => setCopied(false), 1500);
//     } catch {
//       setCopied(false);
//     }
//   };

//   const display =
//     value === null || value === undefined || value === ""
//       ? "Not recorded"
//       : value;

//   return (
//     <div className="grid grid-cols-[minmax(115px,0.9fr)_minmax(0,1.4fr)] items-center gap-3 border-b border-gray-100 py-2 last:border-b-0">
//       <p className="text-xs text-gray-500 sm:text-sm">
//         {label}
//       </p>

//       <div className="flex min-w-0 items-center justify-end gap-2 text-right text-xs font-semibold text-gray-900 sm:text-sm">
//         <span className="min-w-0 break-words">
//           {display}
//         </span>

//         {copyValue !== null &&
//           copyValue !== undefined &&
//           copyValue !== "" && (
//             <button
//               type="button"
//               onClick={handleCopy}
//               title={`Copy ${label}`}
//               className="shrink-0 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
//             >
//               {copied ? (
//                 <Check className="h-3.5 w-3.5 text-green-600" />
//               ) : (
//                 <Copy className="h-3.5 w-3.5" />
//               )}
//             </button>
//           )}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    STATUS BADGE
// ========================================================= */

// function StatusBadge({
//   status,
//   styles = STATUS_STYLES,
// }: {
//   status?: string;
//   styles?: Record<string, string>;
// }) {
//   return (
//     <span
//       className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClass(
//         status,
//         styles
//       )}`}
//     >
//       {prettyStatus(status)}
//     </span>
//   );
// }

// /* =========================================================
//    ORDER ITEM AMOUNT
// ========================================================= */

// function ItemAmount({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="min-w-0">
//       <p className="text-[11px] font-medium text-gray-500">
//         {label}
//       </p>

//       <p className="mt-1 break-words text-sm font-bold text-gray-900">
//         {value}
//       </p>
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  X,
  Package,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Hash,
  Receipt,
  XCircle,
  Truck,
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
  REQUESTED:
    "Cancellation requested at Shiprocket; waiting for the courier to confirm.",
  IN_PROGRESS: "Cancellation at Shiprocket is in progress.",
  NOT_REQUIRED: "Not booked with Shiprocket; nothing to cancel there.",
};

const CourierCancelPanel = ({
  order,
  shipment,
}: {
  order: any;
  shipment: any;
}) => {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(
    null
  );
  const [current, setCurrent] = useState<{
    status: string | null;
    error: string | null;
  }>({
    status: shipment?.providerCancelStatus ?? null,
    error: shipment?.providerCancelError ?? null,
  });

  const orderCancelled = ["CANCELLED", "FAILED"].includes(
    String(order?.status || "").toUpperCase()
  );
  const atShiprocket =
    String(shipment?.provider || "").toUpperCase() === "SHIPROCKET" &&
    Boolean(shipment?.providerOrderId);
  if (!orderCancelled || !atShiprocket) return null;

  const confirmed =
    current.status === "CANCELLED" ||
    String(shipment?.status || "").toUpperCase() === "CANCELLED";
  const text =
    COURIER_CANCEL_TEXT[current.status || ""] ||
    current.error ||
    "Not yet confirmed as cancelled at Shiprocket.";

  const retry = async () => {
    setBusy(true);
    setResult(null);
    try {
      const response: any = await retryShiprocketCancellation(
        Number(shipment.id)
      );
      const data = response?.data?.data || {};
      setCurrent({
        status: data.providerCancelStatus ?? data.outcome ?? null,
        error: data.error ?? null,
      });
      setResult({ ok: true, text: response?.data?.message || "Updated" });
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.data) {
        setCurrent({
          status: data.data.providerCancelStatus ?? data.data.outcome ?? null,
          error: data.data.error ?? null,
        });
      }
      setResult({
        ok: false,
        text:
          data?.data?.error ||
          data?.message ||
          "Shiprocket cancellation failed",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="status"
      className={`mt-4 rounded-xl border p-3.5 text-xs ${
        confirmed
          ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
          : "border-amber-200 bg-amber-50/70 text-amber-900"
      }`}
    >
      <p className="font-semibold">Courier Cancellation</p>
      <p className="mt-0.5 leading-relaxed">
        {confirmed ? COURIER_CANCEL_TEXT.CANCELLED : text}
      </p>
      {!confirmed && current.error && current.error !== text && (
        <p className="mt-0.5 leading-relaxed">{current.error}</p>
      )}
      {!confirmed && (
        <button
          type="button"
          onClick={retry}
          disabled={busy || current.status === "IN_PROGRESS"}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {busy
            ? "Contacting Shiprocket…"
            : current.status === "NOT_CANCELLABLE"
              ? "Check Shiprocket again"
              : "Retry Shiprocket cancellation"}
        </button>
      )}
      {result && (
        <p
          className={`mt-2 text-xs font-medium ${
            result.ok ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {result.text}
        </p>
      )}
    </div>
  );
};

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  CONFIRMED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  PACKED: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  SHIPPED:
    "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20",
  OUT_FOR_DELIVERY:
    "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20",
  DELIVERED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  CANCELLED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  RETURN_REQUESTED:
    "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
  RETURNED: "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20",
  REFUNDED: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/20",
  FAILED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  PAID: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  FAILED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  REFUNDED:
    "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20",
};

const REFUND_STATUS_STYLES: Record<string, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  PROCESSING: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  REFUNDED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  FAILED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

const RETURN_STATUS_STYLES: Record<string, string> = {
  REQUESTED:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  PENDING:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  APPROVED: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  PICKED_UP:
    "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20",
  RECEIVED: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/20",
  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  RETURNED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
};

const statusClass = (
  status?: string,
  styles: Record<string, string> = STATUS_STYLES
) =>
  styles[String(status || "").toUpperCase()] ||
  "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/20";

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined || amount === "") return "—";
    const value = Number(amount);
    if (!Number.isFinite(value)) return "—";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = async (value?: string | null) => {
    if (!value || value === "—") return;

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
    order.returnRequest || order.returnDetails || order.returns?.[0] || null;

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

  const showShipment = Boolean(shipment) || Boolean(order.trackingId);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-0 backdrop-blur-[1px] sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-view-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-none border border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                id="order-view-modal-title"
                className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
              >
                Order Details
              </h2>
              <StatusBadge status={order.status} />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <Hash className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="break-all font-mono font-medium text-slate-700">
                {order.orderCode || `Order #${order.id}`}
              </span>
              {order.orderCode && (
                <button
                  type="button"
                  onClick={() => handleCopy(order.orderCode)}
                  title="Copy order code"
                  className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  {copiedText === order.orderCode ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* SUMMARY METRICS */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard
              icon={<Hash className="h-3.5 w-3.5" />}
              label="Order ID"
              value={`#${order.id ?? "—"}`}
            />

            <SummaryCard
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Order Date"
              value={formatDate(order.createdAt)}
            />

            <SummaryCard
              icon={<Receipt className="h-3.5 w-3.5" />}
              label="Total Amount"
              value={formatCurrency(order.totalAmount)}
              highlight
            />

            <SummaryCard
              icon={<CreditCard className="h-3.5 w-3.5" />}
              label="Payment Method"
              value={prettyStatus(order.paymentMethod || "COD")}
            />
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              {/* CUSTOMER DETAILS */}
              <Section
                title="Customer Details"
                icon={<User className="h-4 w-4" />}
              >
                <DetailRow
                  label="Customer Name"
                  value={address.fullName || buyer.name}
                />
                <DetailRow label="Buyer Account" value={buyer.name} />
                <DetailRow label="Email" value={buyer.email} />
                <DetailRow
                  label="Delivery Phone"
                  value={
                    address.phoneNumber || address.phone || buyer.phoneNumber
                  }
                />
                {buyer.id !== undefined && (
                  <DetailRow label="User ID" value={buyer.id} />
                )}
              </Section>

              {/* PAYMENT DETAILS */}
              <Section
                title="Payment Details"
                icon={<CreditCard className="h-4 w-4" />}
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
                icon={<MapPin className="h-4 w-4" />}
              >
                <div className="space-y-1 py-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  <p className="font-semibold text-slate-900">
                    {address.fullName || buyer.name || "—"}
                  </p>

                  <p>
                    {[
                      address.address,
                      address.addressLine1,
                      address.addressLine2,
                    ]
                      .filter(Boolean)
                      .filter(
                        (item, index, array) => array.indexOf(item) === index
                      )
                      .join(", ") || "Address not available"}
                  </p>

                  <p className="tabular-nums">
                    {[address.city, address.state, address.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {address.country && <p>{address.country}</p>}

                  <div className="pt-1.5">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-inset ring-slate-500/20">
                      {prettyStatus(address.addressType || "HOME")}
                    </span>
                  </div>
                </div>
              </Section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              {/* CANCELLATION DETAILS */}
              {showCancellation && (
                <Section
                  title="Cancellation Details"
                  icon={<XCircle className="h-4 w-4 text-rose-600" />}
                  tone="red"
                  badge="Cancelled"
                >
                  <DetailRow label="Reason" value={cancellationReason} />
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
                        : "Customer / System")
                    }
                  />
                </Section>
              )}

              {/* REFUND DETAILS */}
              {showRefund && (
                <Section
                  title="Refund Details"
                  icon={<RotateCcw className="h-4 w-4 text-emerald-600" />}
                  tone="green"
                  badge={prettyStatus(refundStatus || "N/A")}
                >
                  <div className="grid grid-cols-1 gap-4 py-1 sm:grid-cols-[minmax(140px,0.8fr)_1.6fr]">
                    <div className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-center">
                      <p className="text-[11px] font-medium text-emerald-800">
                        Refund Amount
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-700 tabular-nums">
                        {formatCurrency(refundAmount)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-emerald-700/80">
                        {Number(refundAmount) === Number(order.totalAmount)
                          ? "Full refund"
                          : "Refund record"}
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
                          refund?.refundReference || refund?.gatewayRefundId
                        }
                        copyValue={
                          refund?.refundReference || refund?.gatewayRefundId
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
                          refund?.refundCreditedAt || refund?.completedAt
                        )}
                      />
                      <DetailRow
                        label="Retryable"
                        value={
                          refund?.retryable === true
                            ? "Yes"
                            : refund?.retryable === false
                              ? "No"
                              : "—"
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
                  icon={<Package className="h-4 w-4 text-orange-600" />}
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
                      returnData?.returnId || returnData?.id || order.returnId
                    }
                    copyValue={
                      returnData?.returnId || returnData?.id || order.returnId
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
                      returnData?.requestedAt || returnData?.createdAt
                    )}
                  />
                  <DetailRow
                    label="Processed By"
                    value={
                      returnData?.processedByName || returnData?.approvedByName
                    }
                  />
                  <DetailRow
                    label="Pickup Status"
                    value={returnData?.pickupStatus || order.returnPickupStatus}
                  />
                  <DetailRow
                    label="Pickup Date"
                    value={formatDate(
                      returnData?.pickupDate || returnData?.scheduledPickupAt
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
                  icon={<Truck className="h-4 w-4 text-sky-600" />}
                  tone="blue"
                  badge={prettyStatus(
                    shipment?.providerStatus || shipment?.status || "N/A"
                  )}
                >
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <div>
                      <DetailRow
                        label="Shipment Code"
                        value={
                          shipment?.shipmentCode || shipment?.shipmentNumber
                        }
                      />
                      <DetailRow
                        label="Provider"
                        value={prettyStatus(shipment?.provider || "SHIPROCKET")}
                      />
                      <DetailRow
                        label="Courier"
                        value={
                          shipment?.courierPartner || shipment?.courierName
                        }
                      />
                      <DetailRow
                        label="AWB Number"
                        value={shipment?.awbNumber || order.trackingId}
                        copyValue={shipment?.awbNumber || order.trackingId}
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
                        value={formatDate(shipment?.expectedDeliveryDate)}
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
            icon={<Box className="h-4 w-4" />}
            noPadding
          >
            {orderItems.length ? (
              <div className="divide-y divide-slate-100">
                {orderItems.map((item: any) => {
                  const imageUrl =
                    item.product?.images?.[0]?.imageUrl || "/placeholder.png";

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <Image
                          src={imageUrl}
                          alt={item.product?.name || "Product"}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-xs font-semibold text-slate-900 sm:text-sm">
                          {item.product?.name || "Product"}
                        </h4>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                          <span>Product ID: {item.product?.id ?? "—"}</span>
                          <span>SKU: {item.product?.skuCode || "—"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-5 border-t border-slate-100 pt-3 text-right sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
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
              <p className="p-6 text-center text-xs text-slate-500 sm:text-sm">
                No order items found.
              </p>
            )}
          </Section>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3.5">
          <p className="hidden text-xs text-slate-400 sm:block">
            Order information reflects the latest admin order record.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
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
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-2xs">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>

      <p
        title={value}
        className={`mt-1.5 truncate tabular-nums ${
          highlight
            ? "text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            : "text-sm font-semibold text-slate-900 sm:text-base"
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
    gray: "border-slate-200/80 bg-slate-50/80 text-slate-800",
    red: "border-rose-200/80 bg-rose-50/70 text-rose-900",
    green: "border-emerald-200/80 bg-emerald-50/70 text-emerald-900",
    blue: "border-sky-200/80 bg-sky-50/70 text-sky-900",
    orange: "border-orange-200/80 bg-orange-50/70 text-orange-900",
  };

  const badgeTones = {
    gray: "border-slate-200 bg-white text-slate-700",
    red: "border-rose-200 bg-rose-100/80 text-rose-700",
    green: "border-emerald-200 bg-emerald-100/80 text-emerald-700",
    blue: "border-sky-200 bg-sky-100/80 text-sky-700",
    orange: "border-orange-200 bg-orange-100/80 text-orange-700",
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div
        className={`flex min-h-[42px] items-center justify-between gap-3 border-b px-4 py-2.5 ${tones[tone]}`}
      >
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          {icon}
          {title}
        </h3>

        {badge && (
          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeTones[tone]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className={noPadding ? "" : "px-4 py-2.5"}>{children}</div>
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
    if (copyValue === null || copyValue === undefined || copyValue === "") {
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
    value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className="grid grid-cols-[minmax(115px,0.9fr)_minmax(0,1.4fr)] items-center gap-3 border-b border-slate-100 py-2 last:border-b-0">
      <p className="text-xs text-slate-500">{label}</p>

      <div className="flex min-w-0 items-center justify-end gap-1.5 text-right text-xs font-medium text-slate-800 sm:text-sm">
        <span className="min-w-0 break-words">{display}</span>

        {copyValue !== null &&
          copyValue !== undefined &&
          copyValue !== "" && (
            <button
              type="button"
              onClick={handleCopy}
              title={`Copy ${label}`}
              className="shrink-0 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
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
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(
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

function ItemAmount({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-xs font-semibold text-slate-900 tabular-nums sm:text-sm">
        {value}
      </p>
    </div>
  );
}