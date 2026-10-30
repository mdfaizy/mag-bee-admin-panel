"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AlertCircle, Loader2 } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
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

type InputKind = "none" | "reason" | "inspectApprove" | "payoutReference" | "replacementDispatch";

interface PendingAction {
  key: string;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  input: InputKind;
  run: (input: { text: string; amount: string; restock: boolean; courier: string }) => Promise<any>;
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

const maskAccount = (value?: string | null) => (value ? `XXXXXX${value.slice(-4)}` : "—");

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

/**
 * Staff view of one return with the lifecycle actions the backend allows
 * from the current status. Every action is confirmed, shows progress and
 * re-reads the return from the server afterwards.
 */
const ReturnDetailModal: React.FC<Props> = ({ returnRequestId, onClose, onChanged }) => {
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

    if ((pending.input === "reason" || pending.input === "payoutReference") && !text.trim()) {
      setInputError(pending.input === "reason" ? "A reason is required." : "Payout reference is required.");
      return;
    }

    if (pending.input === "replacementDispatch" && (!text.trim() || !courier.trim())) {
      setInputError("Enter the AWB number and the courier name.");
      return;
    }

    if (pending.input === "inspectApprove" && amount !== "") {
      const value = Number(amount);
      if (!Number.isFinite(value) || value <= 0) {
        setInputError("Refund amount must be a positive number, or leave it empty to use the full eligible amount.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await pending.run({ text: text.trim(), amount, restock, courier: courier.trim() });
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
    const isCod = String(request.order?.paymentMethod || "").toUpperCase() === "COD";
    const isReturn = request.type === "RETURN";
    const status = request.status;

    // Staff-managed replacement: dispatch after the inspection passed, then
    // confirm delivery
    if (request.type === "REPLACEMENT" && status === "REPLACEMENT_PROCESSING") {
      if (!request.exchangeAwbCode) {
        actions.push({
          key: "replacement-dispatch",
          title: "Mark replacement dispatched?",
          description:
            "Ship the replacement unit, then enter its AWB number and courier. The unit is deducted from stock now and the customer sees the courier details.",
          confirmLabel: "Mark dispatched",
          input: "replacementDispatch",
          run: ({ text: awbNumber, courier: courierName }) => dispatchReplacement(rid, { awbNumber, courierName }),
        });
      } else {
        actions.push({
          key: "replacement-complete",
          title: "Mark replacement delivered?",
          description: "Confirm the customer received the replacement. This completes the request.",
          confirmLabel: "Mark delivered",
          input: "none",
          run: () => completeReplacement(rid),
        });
      }
    }

    // Refund instead of replacing (e.g. out of stock), until it is dispatched
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
        title: "Book reverse pickup?",
        description:
          status === "REQUESTED"
            ? "Books a pickup with the courier. This also approves the return."
            : "Books a pickup with the courier for this return.",
        confirmLabel: "Book pickup",
        input: "none",
        run: () => bookReturnPickup(rid),
      });
    }

    if (status === "REQUESTED") {
      actions.push({
        key: "reject",
        title: "Reject return?",
        description: "The customer will see this reason. The order goes back to delivered.",
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
        description: "Confirm the returned parcel has arrived at the warehouse.",
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
        description: "Rejects the return after inspection. The customer will see this reason.",
        confirmLabel: "Fail inspection",
        danger: true,
        input: "reason",
        run: ({ text: reason }) => completeInspection(rid, { approved: false, rejectionReason: reason }),
      });
    }

    if (status === "REFUND_PENDING" && isReturn && !isCod && canMoveMoney) {
      if (request.refundStatus === "NOT_STARTED" || request.refundStatus === "FAILED") {
        actions.push({
          key: "refund",
          title: `Refund ${money(request.refundAmount)}?`,
          description:
            "Sends the refund to the customer's original payment method through the payment gateway. It is marked refunded only after the gateway confirms.",
          confirmLabel: request.refundStatus === "FAILED" ? "Retry refund" : "Initiate refund",
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
          description: "Confirm the bank / UPI details look correct before paying.",
          confirmLabel: "Verify",
          input: "none",
          run: () => transitionCodRefund(cod.id, "verify"),
        });
      }
      if (cod.status === "VERIFIED") {
        actions.push({
          key: "cod-processing",
          title: "Mark payout processing?",
          description: "Use this when the bank transfer has been started but not yet confirmed.",
          confirmLabel: "Mark processing",
          input: "none",
          run: () => transitionCodRefund(cod.id, "processing"),
        });
      }
      if (cod.status === "VERIFIED" || cod.status === "PROCESSING") {
        actions.push({
          key: "cod-paid",
          title: `Mark ${money(cod.amount)} as paid?`,
          description: "Only after the transfer succeeded. Enter the bank UTR / transaction ID.",
          confirmLabel: "Mark paid",
          input: "payoutReference",
          run: ({ text: payoutReference }) => transitionCodRefund(cod.id, "paid", { payoutReference }),
        });
      }
      if (["DETAILS_SUBMITTED", "VERIFIED", "PROCESSING"].includes(cod.status)) {
        actions.push({
          key: "cod-failed",
          title: "Mark payout failed?",
          description: "The customer will need to submit new details. Give the reason.",
          confirmLabel: "Mark failed",
          danger: true,
          input: "reason",
          run: ({ text: reason }) => transitionCodRefund(cod.id, "failed", { reason }),
        });
      }
    }
  }

  const moneyNeedsApprover =
    request?.status === "REFUND_PENDING" && request.type === "RETURN" && !canMoveMoney;

  return (
    <Modal
      isOpen={returnRequestId != null}
      onClose={() => !submitting && onClose()}
      className="max-w-[760px] m-4"
    >
      <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 pr-10">
          Return #{returnRequestId}
        </h2>

        {loading && !request && (
          <div className="py-16 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}

        {loadError && !request && (
          <div className="mt-6 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} /> {loadError}
            <button type="button" onClick={load} className="underline ml-2">
              Retry
            </button>
          </div>
        )}

        {request && (
          <div className="mt-5 space-y-6 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <ReturnStatusBadge status={request.status} />
              <span className="text-gray-500 dark:text-gray-400">
                {request.type} · Order {request.order?.orderCode || `#${request.orderId}`} ·{" "}
                {request.order?.paymentMethod || "—"} ({request.order?.paymentStatus || "—"})
              </span>
              {loading && <Loader2 size={14} className="animate-spin text-gray-400" />}
            </div>

            <section className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-1">Customer</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {request.customer?.name || `Customer #${request.customerId}`}
                </p>
                {request.customer?.email && <p className="text-gray-500">{request.customer.email}</p>}
                {request.customer?.phoneNumber && (
                  <p className="text-gray-500">{request.customer.phoneNumber}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-1">Reason</h3>
                <p className="text-gray-600 dark:text-gray-400">{request.reason}</p>
                {request.customerComment && (
                  <p className="text-gray-500 mt-1 italic">“{request.customerComment}”</p>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-2">Items</h3>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-lg">
                {request.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 px-3 py-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.orderItem?.product?.name || `Order item #${item.orderItemId}`}
                      {item.orderItem?.variant?.name ? ` · ${item.orderItem.variant.name}` : ""}
                    </span>
                    <span className="text-gray-500 shrink-0">
                      {item.quantity} × {money(item.orderItem?.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid sm:grid-cols-3 gap-3">
              {[
                ["Requested", date(request.createdAt)],
                ["Approved", date(request.approvedAt)],
                ["Pickup booked", date(request.pickupScheduledAt)],
                ["Received", date(request.receivedAt)],
                ["Inspected", date(request.inspectedAt)],
                ["Refunded", date(request.refundedAt)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              ))}
            </section>

            {(request.returnAwbCode || request.returnProviderStatus) && (
              <p className="text-gray-600 dark:text-gray-400">
                Pickup AWB: <strong>{request.returnAwbCode || "—"}</strong>
                {request.returnProviderStatus && ` · Courier status: ${request.returnProviderStatus}`}
              </p>
            )}

            {request.rejectionReason && (
              <p className="text-red-600">Rejection reason: {request.rejectionReason}</p>
            )}

            {request.type === "REPLACEMENT" && (
              <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Replacement</h3>
                {request.exchangeAwbCode ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    AWB <strong>{request.exchangeAwbCode}</strong>
                    {request.exchangeCourierName ? ` via ${request.exchangeCourierName}` : ""} · Dispatched{" "}
                    {date(request.exchangeShippedAt)} · Delivered {date(request.exchangeDeliveredAt)}
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {status_text(request.status)}
                  </p>
                )}
              </section>
            )}

            {request.type === "RETURN" && (
              <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-1">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">Refund</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Amount: <strong>{money(request.refundAmount)}</strong> · Gateway status:{" "}
                  <strong>{request.refundStatus}</strong>
                </p>
                {request.refundFailureReason && (
                  <p className="text-red-600">Failure: {request.refundFailureReason}</p>
                )}

                {request.codRefund && (
                  <div className="pt-2 text-gray-600 dark:text-gray-400 space-y-0.5">
                    <p>
                      COD payout: <strong>{request.codRefund.status}</strong> · {money(request.codRefund.amount)}
                    </p>
                    {request.codRefund.method && (
                      <p>
                        {request.codRefund.method === "UPI"
                          ? `UPI ${request.codRefund.upiId}`
                          : `${request.codRefund.accountHolderName} · A/C ${
                              showAccount
                                ? request.codRefund.accountNumber
                                : maskAccount(request.codRefund.accountNumber)
                            } · IFSC ${request.codRefund.ifsc}`}
                        {request.codRefund.method === "BANK" && canMoveMoney && (
                          <button
                            type="button"
                            className="ml-2 underline text-xs"
                            onClick={() => setShowAccount((value) => !value)}
                          >
                            {showAccount ? "Hide" : "Show"}
                          </button>
                        )}
                      </p>
                    )}
                    {request.codRefund.payoutId && <p>Payout ref: {request.codRefund.payoutId}</p>}
                    {request.codRefund.failureReason && (
                      <p className="text-red-600">Failure: {request.codRefund.failureReason}</p>
                    )}
                    {request.codRefund.status === "PENDING_DETAILS" && (
                      <p className="text-amber-600">Waiting for the customer to add bank / UPI details.</p>
                    )}
                  </div>
                )}

                {moneyNeedsApprover && (
                  <p className="text-amber-600 pt-1">
                    Refund and payout actions need a refund-approver role.
                  </p>
                )}
              </section>
            )}

            {/* ACTIONS */}
            {!pending && actions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {actions.map((action) => (
                  <Button
                    key={action.key}
                    size="sm"
                    variant={action.danger ? "outline" : "primary"}
                    className={action.danger ? "!text-red-600 !ring-red-200" : ""}
                    onClick={() => startAction(action)}
                  >
                    {action.confirmLabel}
                  </Button>
                ))}
              </div>
            )}

            {!pending && actions.length === 0 && (
              <p className="text-gray-500">No staff action is available for this status.</p>
            )}

            {/* CONFIRMATION */}
            {pending && (
              <div
                role="alertdialog"
                aria-label={pending.title}
                className="rounded-lg border border-gray-300 dark:border-gray-700 p-4 space-y-3"
              >
                <p className="font-semibold text-gray-800 dark:text-white/90">{pending.title}</p>
                <p className="text-gray-600 dark:text-gray-400">{pending.description}</p>

                {pending.input === "replacementDispatch" && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input
                      autoFocus
                      aria-label="AWB number"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
                      placeholder="AWB number"
                      maxLength={40}
                      value={text}
                      disabled={submitting}
                      onChange={(event) => setText(event.target.value)}
                    />
                    <input
                      aria-label="Courier name"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
                      placeholder="Courier (e.g. Shadowfax)"
                      maxLength={100}
                      value={courier}
                      disabled={submitting}
                      onChange={(event) => setCourier(event.target.value)}
                    />
                  </div>
                )}

                {(pending.input === "reason" || pending.input === "payoutReference") && (
                  <input
                    autoFocus
                    aria-label={pending.input === "reason" ? "Reason" : "Payout reference"}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
                    placeholder={pending.input === "reason" ? "Reason" : "UTR / transaction ID"}
                    maxLength={pending.input === "reason" ? 1000 : 255}
                    value={text}
                    disabled={submitting}
                    onChange={(event) => setText(event.target.value)}
                  />
                )}

                {pending.input === "inspectApprove" && (
                  <div className="space-y-2">
                    {request?.type === "RETURN" && (
                      <input
                        autoFocus
                        type="number"
                        min="0"
                        step="0.01"
                        aria-label="Refund amount"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
                        placeholder="Refund amount (empty = full eligible amount)"
                        value={amount}
                        disabled={submitting}
                        onChange={(event) => setAmount(event.target.value)}
                      />
                    )}
                    <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <input
                        type="checkbox"
                        checked={restock}
                        disabled={submitting || request?.restocked}
                        onChange={(event) => setRestock(event.target.checked)}
                      />
                      Return items to stock {request?.restocked ? "(already restocked)" : ""}
                    </label>
                  </div>
                )}

                {inputError && <p className="text-red-600">{inputError}</p>}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={submitting} onClick={() => setPending(null)}>
                    Back
                  </Button>
                  <Button
                    size="sm"
                    disabled={submitting}
                    className={pending.danger ? "!bg-red-600 hover:!bg-red-700" : ""}
                    onClick={confirm}
                    startIcon={submitting ? <Loader2 size={14} className="animate-spin" /> : undefined}
                  >
                    {submitting ? "Working…" : pending.confirmLabel}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReturnDetailModal;
