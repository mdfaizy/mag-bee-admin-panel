// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { AlertCircle, Loader2 } from "lucide-react";

// import { Modal } from "@/components/ui/modal";
// import Button from "@/components/ui/button/Button";
// import type { RootState } from "@/redux/store";
// import {
//   ReturnRequest,
//   approveReturn,
//   bookReturnPickup,
//   completeInspection,
//   completeReplacement,
//   convertReplacementToRefund,
//   dispatchReplacement,
//   getApiError,
//   getReturn,
//   isRefundApprover,
//   markReturnReceived,
//   refundReturn,
//   rejectReturn,
//   transitionCodRefund,
// } from "@/services/returns/returnService";
// import ReturnStatusBadge from "./ReturnStatusBadge";

// type InputKind = "none" | "reason" | "inspectApprove" | "payoutReference" | "replacementDispatch";

// interface PendingAction {
//   key: string;
//   title: string;
//   description: string;
//   confirmLabel: string;
//   danger?: boolean;
//   input: InputKind;
//   run: (input: { text: string; amount: string; restock: boolean; courier: string }) => Promise<any>;
// }

// const money = (value: unknown) =>
//   value == null || value === ""
//     ? "—"
//     : `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// const date = (value?: string | null) =>
//   value
//     ? new Date(value).toLocaleString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//       })
//     : "—";

// const maskAccount = (value?: string | null) => (value ? `XXXXXX${value.slice(-4)}` : "—");

// // Replacement progress before a dispatch is recorded
// const status_text = (status: string) =>
//   status === "REPLACEMENT_PROCESSING"
//     ? "Inspection passed. Dispatch the replacement and record its AWB."
//     : "The replacement is shipped after the returned item passes inspection.";

// interface Props {
//   returnRequestId: number | null;
//   onClose: () => void;
//   onChanged: () => void;
// }

// /**
//  * Staff view of one return with the lifecycle actions the backend allows
//  * from the current status. Every action is confirmed, shows progress and
//  * re-reads the return from the server afterwards.
//  */
// const ReturnDetailModal: React.FC<Props> = ({ returnRequestId, onClose, onChanged }) => {
//   const role = useSelector((state: RootState) => state.auth.user?.role);
//   const canMoveMoney = isRefundApprover(role);

//   const [request, setRequest] = useState<ReturnRequest | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [loadError, setLoadError] = useState("");
//   const [pending, setPending] = useState<PendingAction | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [text, setText] = useState("");
//   const [amount, setAmount] = useState("");
//   const [restock, setRestock] = useState(true);
//   const [courier, setCourier] = useState("");
//   const [inputError, setInputError] = useState("");
//   const [showAccount, setShowAccount] = useState(false);

//   const load = useCallback(async () => {
//     if (!returnRequestId) return;
//     setLoading(true);
//     setLoadError("");
//     try {
//       setRequest(await getReturn(returnRequestId));
//     } catch (error) {
//       setLoadError(getApiError(error, "Unable to load return"));
//     } finally {
//       setLoading(false);
//     }
//   }, [returnRequestId]);

//   useEffect(() => {
//     setRequest(null);
//     setPending(null);
//     setShowAccount(false);
//     load();
//   }, [load]);

//   const startAction = (action: PendingAction) => {
//     setText("");
//     setAmount("");
//     setCourier("");
//     setRestock(true);
//     setInputError("");
//     setPending(action);
//   };

//   const confirm = async () => {
//     if (!pending) return;

//     if ((pending.input === "reason" || pending.input === "payoutReference") && !text.trim()) {
//       setInputError(pending.input === "reason" ? "A reason is required." : "Payout reference is required.");
//       return;
//     }

//     if (pending.input === "replacementDispatch" && (!text.trim() || !courier.trim())) {
//       setInputError("Enter the AWB number and the courier name.");
//       return;
//     }

//     if (pending.input === "inspectApprove" && amount !== "") {
//       const value = Number(amount);
//       if (!Number.isFinite(value) || value <= 0) {
//         setInputError("Refund amount must be a positive number, or leave it empty to use the full eligible amount.");
//         return;
//       }
//     }

//     setSubmitting(true);
//     try {
//       const result = await pending.run({ text: text.trim(), amount, restock, courier: courier.trim() });
//       toast.success(result?.message || "Updated");
//       setPending(null);
//       onChanged();
//     } catch (error) {
//       toast.error(getApiError(error, "Action failed"));
//     } finally {
//       setSubmitting(false);
//       // Always re-read: the backend is the source of truth for status
//       load();
//     }
//   };

//   // ------------------------------------------------------------------
//   // Available actions (mirrors backend transitions; backend re-checks)
//   // ------------------------------------------------------------------

//   const actions: PendingAction[] = [];

//   if (request) {
//     const rid = request.id;
//     const isCod = String(request.order?.paymentMethod || "").toUpperCase() === "COD";
//     const isReturn = request.type === "RETURN";
//     const status = request.status;

//     // Staff-managed replacement: dispatch after the inspection passed, then
//     // confirm delivery
//     if (request.type === "REPLACEMENT" && status === "REPLACEMENT_PROCESSING") {
//       if (!request.exchangeAwbCode) {
//         actions.push({
//           key: "replacement-dispatch",
//           title: "Mark replacement dispatched?",
//           description:
//             "Ship the replacement unit, then enter its AWB number and courier. The unit is deducted from stock now and the customer sees the courier details.",
//           confirmLabel: "Mark dispatched",
//           input: "replacementDispatch",
//           run: ({ text: awbNumber, courier: courierName }) => dispatchReplacement(rid, { awbNumber, courierName }),
//         });
//       } else {
//         actions.push({
//           key: "replacement-complete",
//           title: "Mark replacement delivered?",
//           description: "Confirm the customer received the replacement. This completes the request.",
//           confirmLabel: "Mark delivered",
//           input: "none",
//           run: () => completeReplacement(rid),
//         });
//       }
//     }

//     // Refund instead of replacing (e.g. out of stock), until it is dispatched
//     if (
//       request.type === "REPLACEMENT" &&
//       !request.exchangeAwbCode &&
//       !["COMPLETED", "REJECTED", "CANCELLED"].includes(status)
//     ) {
//       actions.push({
//         key: "convert",
//         title: "Refund instead of replacing?",
//         description:
//           "The request becomes a refund return and follows the normal inspection and refund steps. Use this when the replacement cannot be shipped.",
//         confirmLabel: "Refund instead",
//         input: "none",
//         run: () => convertReplacementToRefund(rid),
//       });
//     }

//     if (status === "REQUESTED") {
//       actions.push({
//         key: "approve",
//         title: "Approve return?",
//         description: "Approves the request. You can book the pickup afterwards.",
//         confirmLabel: "Approve",
//         input: "none",
//         run: () => approveReturn(rid),
//       });
//     }

//     if (status === "REQUESTED" || status === "APPROVED") {
//       actions.push({
//         key: "pickup",
//         title: request.returnPickupError ? "Retry the reverse pickup?" : "Book reverse pickup?",
//         description: request.returnPickupError
//           ? "Tries the Shiprocket reverse pickup again. If the last attempt may have reached Shiprocket, it checks Shiprocket first and never books a second pickup."
//           : status === "REQUESTED"
//             ? "Books a pickup with the courier. This also approves the return."
//             : "Books a pickup with the courier for this return.",
//         confirmLabel: request.returnPickupError ? "Retry pickup booking" : "Book pickup",
//         input: "none",
//         run: () => bookReturnPickup(rid),
//       });
//     }

//     if (status === "REQUESTED") {
//       actions.push({
//         key: "reject",
//         title: "Reject return?",
//         description: "The customer will see this reason. The order goes back to delivered.",
//         confirmLabel: "Reject",
//         danger: true,
//         input: "reason",
//         run: ({ text: reason }) => rejectReturn(rid, reason),
//       });
//     }

//     if (["APPROVED", "PICKUP_SCHEDULED", "PICKED_UP"].includes(status)) {
//       actions.push({
//         key: "receive",
//         title: "Mark as received?",
//         description: "Confirm the returned parcel has arrived at the warehouse.",
//         confirmLabel: "Mark received",
//         input: "none",
//         run: () => markReturnReceived(rid),
//       });
//     }

//     if (status === "RECEIVED" || status === "INSPECTION") {
//       actions.push({
//         key: "inspect-pass",
//         title: isReturn ? "Pass inspection & set refund?" : "Pass inspection?",
//         description: isReturn
//           ? "Leave the amount empty to refund the full eligible amount. The backend caps it at what the customer paid. This does not send money yet."
//           : "Approves the replacement. You can then dispatch the new unit and record its AWB.",
//         confirmLabel: "Pass inspection",
//         input: "inspectApprove",
//         run: ({ amount: refund, restock: shouldRestock }) =>
//           completeInspection(rid, {
//             approved: true,
//             refundAmount: isReturn && refund !== "" ? Number(refund) : undefined,
//             restock: shouldRestock,
//           }),
//       });
//       actions.push({
//         key: "inspect-fail",
//         title: "Fail inspection?",
//         description: "Rejects the return after inspection. The customer will see this reason.",
//         confirmLabel: "Fail inspection",
//         danger: true,
//         input: "reason",
//         run: ({ text: reason }) => completeInspection(rid, { approved: false, rejectionReason: reason }),
//       });
//     }

//     if (status === "REFUND_PENDING" && isReturn && !isCod && canMoveMoney) {
//       if (request.refundStatus === "NOT_STARTED" || request.refundStatus === "FAILED") {
//         actions.push({
//           key: "refund",
//           title: `Refund ${money(request.refundAmount)}?`,
//           description:
//             "Sends the refund to the customer's original payment method through the payment gateway. It is marked refunded only after the gateway confirms.",
//           confirmLabel: request.refundStatus === "FAILED" ? "Retry refund" : "Initiate refund",
//           input: "none",
//           run: () => refundReturn(rid),
//         });
//       }
//     }

//     const cod = request.codRefund;
//     if (status === "REFUND_PENDING" && isCod && cod && canMoveMoney) {
//       if (cod.status === "DETAILS_SUBMITTED") {
//         actions.push({
//           key: "cod-verify",
//           title: "Verify payout details?",
//           description: "Confirm the bank / UPI details look correct before paying.",
//           confirmLabel: "Verify",
//           input: "none",
//           run: () => transitionCodRefund(cod.id, "verify"),
//         });
//       }
//       if (cod.status === "VERIFIED") {
//         actions.push({
//           key: "cod-processing",
//           title: "Mark payout processing?",
//           description: "Use this when the bank transfer has been started but not yet confirmed.",
//           confirmLabel: "Mark processing",
//           input: "none",
//           run: () => transitionCodRefund(cod.id, "processing"),
//         });
//       }
//       if (cod.status === "VERIFIED" || cod.status === "PROCESSING") {
//         actions.push({
//           key: "cod-paid",
//           title: `Mark ${money(cod.amount)} as paid?`,
//           description: "Only after the transfer succeeded. Enter the bank UTR / transaction ID.",
//           confirmLabel: "Mark paid",
//           input: "payoutReference",
//           run: ({ text: payoutReference }) => transitionCodRefund(cod.id, "paid", { payoutReference }),
//         });
//       }
//       if (["DETAILS_SUBMITTED", "VERIFIED", "PROCESSING"].includes(cod.status)) {
//         actions.push({
//           key: "cod-failed",
//           title: "Mark payout failed?",
//           description: "The customer will need to submit new details. Give the reason.",
//           confirmLabel: "Mark failed",
//           danger: true,
//           input: "reason",
//           run: ({ text: reason }) => transitionCodRefund(cod.id, "failed", { reason }),
//         });
//       }
//     }
//   }

//   const moneyNeedsApprover =
//     request?.status === "REFUND_PENDING" && request.type === "RETURN" && !canMoveMoney;

//   return (
//     <Modal
//       isOpen={returnRequestId != null}
//       onClose={() => !submitting && onClose()}
//       className="max-w-[760px] m-4"
//     >
//       <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
//         <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 pr-10">
//           Return #{returnRequestId}
//         </h2>

//         {loading && !request && (
//           <div className="py-16 flex justify-center">
//             <Loader2 className="animate-spin text-gray-400" />
//           </div>
//         )}

//         {loadError && !request && (
//           <div className="mt-6 flex items-center gap-2 text-sm text-red-600">
//             <AlertCircle size={16} /> {loadError}
//             <button type="button" onClick={load} className="underline ml-2">
//               Retry
//             </button>
//           </div>
//         )}

//         {request && (
//           <div className="mt-5 space-y-6 text-sm">
//             <div className="flex flex-wrap items-center gap-3">
//               <ReturnStatusBadge status={request.status} />
//               <span className="text-gray-500 dark:text-gray-400">
//                 {request.type} · Order {request.order?.orderCode || `#${request.orderId}`} ·{" "}
//                 {request.order?.paymentMethod || "—"} ({request.order?.paymentStatus || "—"})
//               </span>
//               {loading && <Loader2 size={14} className="animate-spin text-gray-400" />}
//             </div>

//             <section className="grid sm:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-1">Customer</h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   {request.customer?.name || `Customer #${request.customerId}`}
//                 </p>
//                 {request.customer?.email && <p className="text-gray-500">{request.customer.email}</p>}
//                 {request.customer?.phoneNumber && (
//                   <p className="text-gray-500">{request.customer.phoneNumber}</p>
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-1">Reason</h3>
//                 <p className="text-gray-600 dark:text-gray-400">{request.reason}</p>
//                 {request.customerComment && (
//                   <p className="text-gray-500 mt-1 italic">“{request.customerComment}”</p>
//                 )}
//               </div>
//             </section>

//             <section>
//               <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-2">Items</h3>
//               <ul className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg">
//                 {request.items.map((item) => (
//                   <li key={item.id} className="flex justify-between gap-3 px-3 py-2">
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {item.orderItem?.product?.name || `Order item #${item.orderItemId}`}
//                       {item.orderItem?.variant?.name ? ` · ${item.orderItem.variant.name}` : ""}
//                     </span>
//                     <span className="text-gray-500 shrink-0">
//                       {item.quantity} × {money(item.orderItem?.price)}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </section>

//             <section className="grid sm:grid-cols-3 gap-3">
//               {[
//                 ["Requested", date(request.createdAt)],
//                 ["Approved", date(request.approvedAt)],
//                 ["Pickup booked", date(request.pickupScheduledAt)],
//                 ["Received", date(request.receivedAt)],
//                 ["Inspected", date(request.inspectedAt)],
//                 ["Refunded", date(request.refundedAt)],
//               ].map(([label, value]) => (
//                 <div key={label} className="rounded-lg bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
//                   <p className="text-xs text-gray-500">{label}</p>
//                   <p className="text-gray-800 dark:text-gray-200">{value}</p>
//                 </div>
//               ))}
//             </section>

//             {(request.returnAwbCode || request.returnProviderStatus || request.returnProviderOrderId) && (
//               <p className="text-gray-600 dark:text-gray-400">
//                 Pickup AWB: <strong>{request.returnAwbCode || "—"}</strong>
//                 {request.returnCourierName && ` · ${request.returnCourierName}`}
//                 {request.returnProviderStatus &&
//                   !["PICKUP_BOOKING", "PICKUP_UNKNOWN"].includes(request.returnProviderStatus) &&
//                   ` · Courier status: ${request.returnProviderStatus}`}
//                 {request.returnProviderOrderId && ` · Shiprocket return order ${request.returnProviderOrderId}`}
//               </p>
//             )}

//             {request.returnPickupError && (
//               <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
//                 Last pickup attempt{request.returnPickupAttemptedAt ? ` (${date(request.returnPickupAttemptedAt)})` : ""}:{" "}
//                 {request.returnPickupError}
//               </p>
//             )}

//             {request.rejectionReason && (
//               <p className="text-red-600">Rejection reason: {request.rejectionReason}</p>
//             )}

//             {request.type === "REPLACEMENT" && (
//               <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-1">
//                 <h3 className="font-semibold text-gray-800 dark:text-white/90">Replacement</h3>
//                 {request.exchangeAwbCode ? (
//                   <p className="text-gray-600 dark:text-gray-400">
//                     AWB <strong>{request.exchangeAwbCode}</strong>
//                     {request.exchangeCourierName ? ` via ${request.exchangeCourierName}` : ""} · Dispatched{" "}
//                     {date(request.exchangeShippedAt)} · Delivered {date(request.exchangeDeliveredAt)}
//                   </p>
//                 ) : (
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {status_text(request.status)}
//                   </p>
//                 )}
//               </section>
//             )}

//             {request.type === "RETURN" && (
//               <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-1">
//                 <h3 className="font-semibold text-gray-800 dark:text-white/90">Refund</h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Amount: <strong>{money(request.refundAmount)}</strong> · Gateway status:{" "}
//                   <strong>{request.refundStatus}</strong>
//                 </p>
//                 {request.refundFailureReason && (
//                   <p className="text-red-600">Failure: {request.refundFailureReason}</p>
//                 )}

//                 {request.codRefund && (
//                   <div className="pt-2 text-gray-600 dark:text-gray-400 space-y-0.5">
//                     <p>
//                       COD payout: <strong>{request.codRefund.status}</strong> · {money(request.codRefund.amount)}
//                     </p>
//                     {request.codRefund.method && (
//                       <p>
//                         {request.codRefund.method === "UPI"
//                           ? `UPI ${request.codRefund.upiId}`
//                           : `${request.codRefund.accountHolderName} · A/C ${
//                               showAccount
//                                 ? request.codRefund.accountNumber
//                                 : maskAccount(request.codRefund.accountNumber)
//                             } · IFSC ${request.codRefund.ifsc}`}
//                         {request.codRefund.method === "BANK" && canMoveMoney && (
//                           <button
//                             type="button"
//                             className="ml-2 underline text-xs"
//                             onClick={() => setShowAccount((value) => !value)}
//                           >
//                             {showAccount ? "Hide" : "Show"}
//                           </button>
//                         )}
//                       </p>
//                     )}
//                     {request.codRefund.payoutId && <p>Payout ref: {request.codRefund.payoutId}</p>}
//                     {request.codRefund.failureReason && (
//                       <p className="text-red-600">Failure: {request.codRefund.failureReason}</p>
//                     )}
//                     {request.codRefund.status === "PENDING_DETAILS" && (
//                       <p className="text-amber-600">Waiting for the customer to add bank / UPI details.</p>
//                     )}
//                   </div>
//                 )}

//                 {moneyNeedsApprover && (
//                   <p className="text-amber-600 pt-1">
//                     Refund and payout actions need a refund-approver role.
//                   </p>
//                 )}
//               </section>
//             )}

//             {/* ACTIONS */}
//             {!pending && actions.length > 0 && (
//               <div className="flex flex-wrap gap-2 pt-2">
//                 {actions.map((action) => (
//                   <Button
//                     key={action.key}
//                     size="sm"
//                     variant={action.danger ? "outline" : "primary"}
//                     className={action.danger ? "!text-red-600 !ring-red-200" : ""}
//                     onClick={() => startAction(action)}
//                   >
//                     {action.confirmLabel}
//                   </Button>
//                 ))}
//               </div>
//             )}

//             {!pending && actions.length === 0 && (
//               <p className="text-gray-500">No staff action is available for this status.</p>
//             )}

//             {/* CONFIRMATION */}
//             {pending && (
//               <div
//                 role="alertdialog"
//                 aria-label={pending.title}
//                 className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 space-y-3"
//               >
//                 <p className="font-semibold text-gray-800 dark:text-white/90">{pending.title}</p>
//                 <p className="text-gray-600 dark:text-gray-400">{pending.description}</p>

//                 {pending.input === "replacementDispatch" && (
//                   <div className="grid sm:grid-cols-2 gap-2">
//                     <input
//                       autoFocus
//                       aria-label="AWB number"
//                       className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
//                       placeholder="AWB number"
//                       maxLength={40}
//                       value={text}
//                       disabled={submitting}
//                       onChange={(event) => setText(event.target.value)}
//                     />
//                     <input
//                       aria-label="Courier name"
//                       className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
//                       placeholder="Courier (e.g. Shadowfax)"
//                       maxLength={100}
//                       value={courier}
//                       disabled={submitting}
//                       onChange={(event) => setCourier(event.target.value)}
//                     />
//                   </div>
//                 )}

//                 {(pending.input === "reason" || pending.input === "payoutReference") && (
//                   <input
//                     autoFocus
//                     aria-label={pending.input === "reason" ? "Reason" : "Payout reference"}
//                     className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
//                     placeholder={pending.input === "reason" ? "Reason" : "UTR / transaction ID"}
//                     maxLength={pending.input === "reason" ? 1000 : 255}
//                     value={text}
//                     disabled={submitting}
//                     onChange={(event) => setText(event.target.value)}
//                   />
//                 )}

//                 {pending.input === "inspectApprove" && (
//                   <div className="space-y-2">
//                     {request?.type === "RETURN" && (
//                       <input
//                         autoFocus
//                         type="number"
//                         min="0"
//                         step="0.01"
//                         aria-label="Refund amount"
//                         className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
//                         placeholder="Refund amount (empty = full eligible amount)"
//                         value={amount}
//                         disabled={submitting}
//                         onChange={(event) => setAmount(event.target.value)}
//                       />
//                     )}
//                     <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                       <input
//                         type="checkbox"
//                         checked={restock}
//                         disabled={submitting || request?.restocked}
//                         onChange={(event) => setRestock(event.target.checked)}
//                       />
//                       Return items to stock {request?.restocked ? "(already restocked)" : ""}
//                     </label>
//                   </div>
//                 )}

//                 {inputError && <p className="text-red-600">{inputError}</p>}

//                 <div className="flex gap-2">
//                   <Button size="sm" variant="outline" disabled={submitting} onClick={() => setPending(null)}>
//                     Back
//                   </Button>
//                   <Button
//                     size="sm"
//                     disabled={submitting}
//                     className={pending.danger ? "!bg-red-600 hover:!bg-red-700" : ""}
//                     onClick={confirm}
//                     startIcon={submitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
//                   >
//                     {submitting ? "Working…" : pending.confirmLabel}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </Modal>
//   );
// };

// export default ReturnDetailModal;



"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AlertCircle,
  Loader2,
  X,
  RotateCcw,
  User,
  Package,
  Clock,
  Truck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/button/Button";
import LoadingState from "@/components/common/LoadingState";
import type { RootState } from "@/redux/store";
import {
  ReturnRequest,
  approveReturn,
  bookReturnPickup,
  completeInspection,
  completeReplacement,
  convertReplacementToRefund,
  dispatchReplacement,
  getApiError,
  getReturn,
  isRefundApprover,
  markReturnReceived,
  refundReturn,
  rejectReturn,
  transitionCodRefund,
} from "@/services/returns/returnService";
import ReturnStatusBadge from "./ReturnStatusBadge";

type InputKind =
  | "none"
  | "reason"
  | "inspectApprove"
  | "payoutReference"
  | "replacementDispatch";

interface PendingAction {
  key: string;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  input: InputKind;
  run: (input: {
    text: string;
    amount: string;
    restock: boolean;
    courier: string;
  }) => Promise<any>;
}

const money = (value: unknown) =>
  value == null || value === ""
    ? "—"
    : `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const date = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const maskAccount = (value?: string | null) =>
  value ? `XXXXXX${value.slice(-4)}` : "—";

// Replacement progress before a dispatch is recorded
const status_text = (status: string) =>
  status === "REPLACEMENT_PROCESSING"
    ? "Inspection passed. Dispatch the replacement and record its AWB."
    : "The replacement is shipped after the returned item passes inspection.";

interface Props {
  returnRequestId: number | null;
  onClose: () => void;
  onChanged: () => void;
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

/**
 * Staff right-side drawer view of one return with lifecycle actions
 * allowed from the current status. Every action is confirmed, shows progress,
 * and re-reads the return from the server afterwards.
 */
const ReturnDetailModal: React.FC<Props> = ({
  returnRequestId,
  onClose,
  onChanged,
}) => {
  const role = useSelector((state: RootState) => state.auth.user?.role);
  const canMoveMoney = isRefundApprover(role);

  const [request, setRequest] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [restock, setRestock] = useState(true);
  const [courier, setCourier] = useState("");
  const [inputError, setInputError] = useState("");
  const [showAccount, setShowAccount] = useState(false);

  const load = useCallback(async () => {
    if (!returnRequestId) return;
    setLoading(true);
    setLoadError("");
    try {
      setRequest(await getReturn(returnRequestId));
    } catch (error) {
      setLoadError(getApiError(error, "Unable to load return"));
    } finally {
      setLoading(false);
    }
  }, [returnRequestId]);

  useEffect(() => {
    setRequest(null);
    setPending(null);
    setShowAccount(false);
    load();
  }, [load]);

  useEffect(() => {
    if (returnRequestId == null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [returnRequestId, submitting, onClose]);

  if (returnRequestId == null) return null;

  const startAction = (action: PendingAction) => {
    setText("");
    setAmount("");
    setCourier("");
    setRestock(true);
    setInputError("");
    setPending(action);
  };

  const confirm = async () => {
    if (!pending) return;

    if (
      (pending.input === "reason" || pending.input === "payoutReference") &&
      !text.trim()
    ) {
      setInputError(
        pending.input === "reason"
          ? "A reason is required."
          : "Payout reference is required."
      );
      return;
    }

    if (
      pending.input === "replacementDispatch" &&
      (!text.trim() || !courier.trim())
    ) {
      setInputError("Enter the AWB number and the courier name.");
      return;
    }

    if (pending.input === "inspectApprove" && amount !== "") {
      const value = Number(amount);
      if (!Number.isFinite(value) || value <= 0) {
        setInputError(
          "Refund amount must be a positive number, or leave it empty to use the full eligible amount."
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await pending.run({
        text: text.trim(),
        amount,
        restock,
        courier: courier.trim(),
      });
      toast.success(result?.message || "Updated");
      setPending(null);
      onChanged();
    } catch (error) {
      toast.error(getApiError(error, "Action failed"));
    } finally {
      setSubmitting(false);
      // Always re-read: the backend is the source of truth for status
      load();
    }
  };

  // ------------------------------------------------------------------
  // Available actions (mirrors backend transitions; backend re-checks)
  // ------------------------------------------------------------------
  const actions: PendingAction[] = [];

  if (request) {
    const rid = request.id;
    const isCod =
      String(request.order?.paymentMethod || "").toUpperCase() === "COD";
    const isReturn = request.type === "RETURN";
    const status = request.status;

    if (request.type === "REPLACEMENT" && status === "REPLACEMENT_PROCESSING") {
      if (!request.exchangeAwbCode) {
        actions.push({
          key: "replacement-dispatch",
          title: "Mark replacement dispatched?",
          description:
            "Ship the replacement unit, then enter its AWB number and courier. The unit is deducted from stock now and the customer sees the courier details.",
          confirmLabel: "Mark dispatched",
          input: "replacementDispatch",
          run: ({ text: awbNumber, courier: courierName }) =>
            dispatchReplacement(rid, { awbNumber, courierName }),
        });
      } else {
        actions.push({
          key: "replacement-complete",
          title: "Mark replacement delivered?",
          description:
            "Confirm the customer received the replacement. This completes the request.",
          confirmLabel: "Mark delivered",
          input: "none",
          run: () => completeReplacement(rid),
        });
      }
    }

    if (
      request.type === "REPLACEMENT" &&
      !request.exchangeAwbCode &&
      !["COMPLETED", "REJECTED", "CANCELLED"].includes(status)
    ) {
      actions.push({
        key: "convert",
        title: "Refund instead of replacing?",
        description:
          "The request becomes a refund return and follows the normal inspection and refund steps. Use this when the replacement cannot be shipped.",
        confirmLabel: "Refund instead",
        input: "none",
        run: () => convertReplacementToRefund(rid),
      });
    }

    if (status === "REQUESTED") {
      actions.push({
        key: "approve",
        title: "Approve return?",
        description: "Approves the request. You can book the pickup afterwards.",
        confirmLabel: "Approve",
        input: "none",
        run: () => approveReturn(rid),
      });
    }

    if (status === "REQUESTED" || status === "APPROVED") {
      actions.push({
        key: "pickup",
        title: request.returnPickupError
          ? "Retry the reverse pickup?"
          : "Book reverse pickup?",
        description: request.returnPickupError
          ? "Tries the Shiprocket reverse pickup again. If the last attempt may have reached Shiprocket, it checks Shiprocket first and never books a second pickup."
          : status === "REQUESTED"
            ? "Books a pickup with the courier. This also approves the return."
            : "Books a pickup with the courier for this return.",
        confirmLabel: request.returnPickupError
          ? "Retry pickup booking"
          : "Book pickup",
        input: "none",
        run: () => bookReturnPickup(rid),
      });
    }

    if (status === "REQUESTED") {
      actions.push({
        key: "reject",
        title: "Reject return?",
        description:
          "The customer will see this reason. The order goes back to delivered.",
        confirmLabel: "Reject",
        danger: true,
        input: "reason",
        run: ({ text: reason }) => rejectReturn(rid, reason),
      });
    }

    if (["APPROVED", "PICKUP_SCHEDULED", "PICKED_UP"].includes(status)) {
      actions.push({
        key: "receive",
        title: "Mark as received?",
        description:
          "Confirm the returned parcel has arrived at the warehouse.",
        confirmLabel: "Mark received",
        input: "none",
        run: () => markReturnReceived(rid),
      });
    }

    if (status === "RECEIVED" || status === "INSPECTION") {
      actions.push({
        key: "inspect-pass",
        title: isReturn ? "Pass inspection & set refund?" : "Pass inspection?",
        description: isReturn
          ? "Leave the amount empty to refund the full eligible amount. The backend caps it at what the customer paid. This does not send money yet."
          : "Approves the replacement. You can then dispatch the new unit and record its AWB.",
        confirmLabel: "Pass inspection",
        input: "inspectApprove",
        run: ({ amount: refund, restock: shouldRestock }) =>
          completeInspection(rid, {
            approved: true,
            refundAmount: isReturn && refund !== "" ? Number(refund) : undefined,
            restock: shouldRestock,
          }),
      });
      actions.push({
        key: "inspect-fail",
        title: "Fail inspection?",
        description:
          "Rejects the return after inspection. The customer will see this reason.",
        confirmLabel: "Fail inspection",
        danger: true,
        input: "reason",
        run: ({ text: reason }) =>
          completeInspection(rid, { approved: false, rejectionReason: reason }),
      });
    }

    if (status === "REFUND_PENDING" && isReturn && !isCod && canMoveMoney) {
      if (
        request.refundStatus === "NOT_STARTED" ||
        request.refundStatus === "FAILED"
      ) {
        actions.push({
          key: "refund",
          title: `Refund ${money(request.refundAmount)}?`,
          description:
            "Sends the refund to the customer's original payment method through the payment gateway. It is marked refunded only after the gateway confirms.",
          confirmLabel:
            request.refundStatus === "FAILED"
              ? "Retry refund"
              : "Initiate refund",
          input: "none",
          run: () => refundReturn(rid),
        });
      }
    }

    const cod = request.codRefund;
    if (status === "REFUND_PENDING" && isCod && cod && canMoveMoney) {
      if (cod.status === "DETAILS_SUBMITTED") {
        actions.push({
          key: "cod-verify",
          title: "Verify payout details?",
          description:
            "Confirm the bank / UPI details look correct before paying.",
          confirmLabel: "Verify",
          input: "none",
          run: () => transitionCodRefund(cod.id, "verify"),
        });
      }
      if (cod.status === "VERIFIED") {
        actions.push({
          key: "cod-processing",
          title: "Mark payout processing?",
          description:
            "Use this when the bank transfer has been started but not yet confirmed.",
          confirmLabel: "Mark processing",
          input: "none",
          run: () => transitionCodRefund(cod.id, "processing"),
        });
      }
      if (cod.status === "VERIFIED" || cod.status === "PROCESSING") {
        actions.push({
          key: "cod-paid",
          title: `Mark ${money(cod.amount)} as paid?`,
          description:
            "Only after the transfer succeeded. Enter the bank UTR / transaction ID.",
          confirmLabel: "Mark paid",
          input: "payoutReference",
          run: ({ text: payoutReference }) =>
            transitionCodRefund(cod.id, "paid", { payoutReference }),
        });
      }
      if (
        ["DETAILS_SUBMITTED", "VERIFIED", "PROCESSING"].includes(cod.status)
      ) {
        actions.push({
          key: "cod-failed",
          title: "Mark payout failed?",
          description:
            "The customer will need to submit new details. Give the reason.",
          confirmLabel: "Mark failed",
          danger: true,
          input: "reason",
          run: ({ text: reason }) =>
            transitionCodRefund(cod.id, "failed", { reason }),
        });
      }
    }
  }

  const moneyNeedsApprover =
    request?.status === "REFUND_PENDING" &&
    request.type === "RETURN" &&
    !canMoveMoney;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={() => {
        if (!submitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-detail-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="return-detail-drawer-title"
                  className="font-mono text-base font-semibold text-slate-900 tabular-nums dark:text-slate-100"
                >
                  Return #{returnRequestId}
                </h2>
                {loading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lifecycle workflow, inspection, and settlement details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-xs sm:text-sm">
          {loading && !request && (
            <LoadingState variant="card" label="Loading return request..." />
          )}

          {loadError && !request && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loadError}</span>
              </div>
              <button
                type="button"
                onClick={load}
                className="rounded-lg border border-rose-300 bg-white px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300"
              >
                Retry
              </button>
            </div>
          )}

          {request && (
            <>
              {/* STATUS & ORDER STRIP */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-2.5">
                  <ReturnStatusBadge status={request.status} />
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    {request.type}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Order{" "}
                    <strong className="font-mono text-slate-900 dark:text-slate-100">
                      {request.order?.orderCode || `#${request.orderId}`}
                    </strong>
                  </span>
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {request.order?.paymentMethod || "—"} (
                  {request.order?.paymentStatus || "—"})
                </span>
              </div>

              {/* CUSTOMER & REASON */}
              <section className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2 sm:p-5">
                <div className="space-y-1">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <User className="h-3.5 w-3.5" />
                    <span>Customer</span>
                  </h3>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {request.customer?.name ||
                      `Customer #${request.customerId}`}
                  </p>
                  {request.customer?.email && (
                    <p className="break-all text-xs text-slate-500 dark:text-slate-400">
                      {request.customer.email}
                    </p>
                  )}
                  {request.customer?.phoneNumber && (
                    <p className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      {request.customer.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Reason
                  </h3>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {request.reason || "—"}
                  </p>
                  {request.customerComment && (
                    <p className="mt-1 italic text-xs text-slate-500 dark:text-slate-400">
                      &ldquo;{request.customerComment}&rdquo;
                    </p>
                  )}
                </div>
              </section>

              {/* ITEMS */}
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-950/40 sm:px-5">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Items ({request.items.length})
                  </h3>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {request.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.orderItem?.product?.name ||
                          `Order item #${item.orderItemId}`}
                        {item.orderItem?.variant?.name
                          ? ` · ${item.orderItem.variant.name}`
                          : ""}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        {item.quantity} × {money(item.orderItem?.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* TIMELINE GRID */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Timeline</span>
                </h3>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {[
                    ["Requested", date(request.createdAt)],
                    ["Approved", date(request.approvedAt)],
                    ["Pickup booked", date(request.pickupScheduledAt)],
                    ["Received", date(request.receivedAt)],
                    ["Inspected", date(request.inspectedAt)],
                    ["Refunded", date(request.refundedAt)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60"
                    >
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {label}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-slate-800 tabular-nums dark:text-slate-200">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* PICKUP / COURIER INFO */}
              {(request.returnAwbCode ||
                request.returnProviderStatus ||
                request.returnProviderOrderId) && (
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    Pickup AWB:{" "}
                    <strong className="font-mono text-slate-900 dark:text-slate-100">
                      {request.returnAwbCode || "—"}
                    </strong>
                    {request.returnCourierName &&
                      ` · ${request.returnCourierName}`}
                    {request.returnProviderStatus &&
                      ![
                        "PICKUP_BOOKING",
                        "PICKUP_UNKNOWN",
                      ].includes(request.returnProviderStatus) &&
                      ` · Courier status: ${request.returnProviderStatus}`}
                    {request.returnProviderOrderId &&
                      ` · Shiprocket return order ${request.returnProviderOrderId}`}
                  </div>
                </div>
              )}

              {request.returnPickupError && (
                <p
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
                >
                  Last pickup attempt
                  {request.returnPickupAttemptedAt
                    ? ` (${date(request.returnPickupAttemptedAt)})`
                    : ""}
                  : {request.returnPickupError}
                </p>
              )}

              {request.rejectionReason && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                  Rejection reason: {request.rejectionReason}
                </p>
              )}

              {/* REPLACEMENT SECTION */}
              {request.type === "REPLACEMENT" && (
                <section className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Replacement</span>
                  </h3>
                  {request.exchangeAwbCode ? (
                    <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                      AWB{" "}
                      <strong className="font-mono text-slate-900 dark:text-slate-100">
                        {request.exchangeAwbCode}
                      </strong>
                      {request.exchangeCourierName
                        ? ` via ${request.exchangeCourierName}`
                        : ""}{" "}
                      · Dispatched {date(request.exchangeShippedAt)} ·
                      Delivered {date(request.exchangeDeliveredAt)}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                      {status_text(request.status)}
                    </p>
                  )}
                </section>
              )}

              {/* REFUND / COD PAYOUT SECTION */}
              {request.type === "RETURN" && (
                <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    <span>Refund</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                    Amount:{" "}
                    <strong className="font-mono text-slate-900 tabular-nums dark:text-slate-100">
                      {money(request.refundAmount)}
                    </strong>{" "}
                    · Gateway status:{" "}
                    <strong className="text-slate-900 dark:text-slate-100">
                      {request.refundStatus}
                    </strong>
                  </p>
                  {request.refundFailureReason && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Failure: {request.refundFailureReason}
                    </p>
                  )}

                  {request.codRefund && (
                    <div className="space-y-1 border-t border-slate-100 pt-2.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      <p>
                        COD payout:{" "}
                        <strong className="text-slate-900 dark:text-slate-100">
                          {request.codRefund.status}
                        </strong>{" "}
                        ·{" "}
                        <span className="font-mono font-semibold tabular-nums">
                          {money(request.codRefund.amount)}
                        </span>
                      </p>
                      {request.codRefund.method && (
                        <p className="font-mono">
                          {request.codRefund.method === "UPI"
                            ? `UPI ${request.codRefund.upiId}`
                            : `${request.codRefund.accountHolderName} · A/C ${
                                showAccount
                                  ? request.codRefund.accountNumber
                                  : maskAccount(request.codRefund.accountNumber)
                              } · IFSC ${request.codRefund.ifsc}`}
                          {request.codRefund.method === "BANK" &&
                            canMoveMoney && (
                              <button
                                type="button"
                                className="ml-2 font-sans text-xs font-medium text-slate-700 underline hover:text-slate-900 dark:text-brand-400"
                                onClick={() =>
                                  setShowAccount((value) => !value)
                                }
                              >
                                {showAccount ? "Hide" : "Show"}
                              </button>
                            )}
                        </p>
                      )}
                      {request.codRefund.payoutId && (
                        <p className="font-mono">
                          Payout ref: {request.codRefund.payoutId}
                        </p>
                      )}
                      {request.codRefund.failureReason && (
                        <p className="font-medium text-rose-600 dark:text-rose-400">
                          Failure: {request.codRefund.failureReason}
                        </p>
                      )}
                      {request.codRefund.status === "PENDING_DETAILS" && (
                        <p className="font-medium text-amber-600 dark:text-amber-400">
                          Waiting for the customer to add bank / UPI details.
                        </p>
                      )}
                    </div>
                  )}

                  {moneyNeedsApprover && (
                    <p className="pt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      Refund and payout actions need a refund-approver role.
                    </p>
                  )}
                </section>
              )}

              {/* AVAILABLE ACTIONS */}
              {!pending && actions.length > 0 && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Available Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.key}
                        size="sm"
                        variant={action.danger ? "outline" : "primary"}
                        className={
                          action.danger
                            ? "!border-rose-300 !text-rose-600 hover:!bg-rose-50 dark:!border-rose-800 dark:!text-rose-400 dark:hover:!bg-rose-950/40"
                            : "dark:!bg-brand-500 dark:hover:!bg-brand-600"
                        }
                        onClick={() => startAction(action)}
                      >
                        {action.confirmLabel}
                      </Button>
                    ))}
                  </div>
                </section>
              )}

              {!pending && actions.length === 0 && (
                <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  No staff action is available for this status.
                </p>
              )}

              {/* CONFIRMATION PANEL */}
              {pending && (
                <div
                  role="alertdialog"
                  aria-label={pending.title}
                  className="space-y-3.5 rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {pending.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
                    {pending.description}
                  </p>

                  {pending.input === "replacementDispatch" && (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <input
                        autoFocus
                        aria-label="AWB number"
                        className={inputCls}
                        placeholder="AWB number"
                        maxLength={40}
                        value={text}
                        disabled={submitting}
                        onChange={(event) => setText(event.target.value)}
                      />
                      <input
                        aria-label="Courier name"
                        className={inputCls}
                        placeholder="Courier (e.g. Shadowfax)"
                        maxLength={100}
                        value={courier}
                        disabled={submitting}
                        onChange={(event) => setCourier(event.target.value)}
                      />
                    </div>
                  )}

                  {(pending.input === "reason" ||
                    pending.input === "payoutReference") && (
                    <input
                      autoFocus
                      aria-label={
                        pending.input === "reason"
                          ? "Reason"
                          : "Payout reference"
                      }
                      className={inputCls}
                      placeholder={
                        pending.input === "reason"
                          ? "Reason"
                          : "UTR / transaction ID"
                      }
                      maxLength={pending.input === "reason" ? 1000 : 255}
                      value={text}
                      disabled={submitting}
                      onChange={(event) => setText(event.target.value)}
                    />
                  )}

                  {pending.input === "inspectApprove" && (
                    <div className="space-y-3">
                      {request?.type === "RETURN" && (
                        <input
                          autoFocus
                          type="number"
                          min="0"
                          step="0.01"
                          aria-label="Refund amount"
                          className={inputCls}
                          placeholder="Refund amount (empty = full eligible amount)"
                          value={amount}
                          disabled={submitting}
                          onChange={(event) => setAmount(event.target.value)}
                        />
                      )}
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                        <input
                          type="checkbox"
                          checked={restock}
                          disabled={submitting || request?.restocked}
                          onChange={(event) => setRestock(event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 accent-slate-900 dark:border-slate-700 dark:accent-brand-500"
                        />
                        <span>
                          Return items to stock{" "}
                          {request?.restocked ? "(already restocked)" : ""}
                        </span>
                      </label>
                    </div>
                  )}

                  {inputError && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {inputError}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => setPending(null)}
                    >
                      Back
                    </Button>
                    <Button
                      size="sm"
                      disabled={submitting}
                      className={
                        pending.danger
                          ? "!bg-rose-600 text-white hover:!bg-rose-700"
                          : "dark:!bg-brand-500 dark:hover:!bg-brand-600"
                      }
                      onClick={confirm}
                      startIcon={
                        submitting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : undefined
                      }
                    >
                      {submitting ? "Working…" : pending.confirmLabel}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* DRAWER FOOTER */}
        <div className="flex shrink-0 items-center justify-end border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ReturnDetailModal;