"use client";

import Image from "next/image";
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
} from "lucide-react";

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

/* =========================================================
   STATUS BADGE CONFIG — same palette used in OrdersTable so
   the badge reads identically in the table and in this modal.
   Display-only mapping; does not touch the raw order.status
   value coming from the backend.
========================================================= */

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

const STATUS_LABELS: Record<string, string> = {
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

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function OrderViewModal({
  isOpen,
  onClose,
  order,
}: OrderViewModalProps) {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const statusBadgeClass =
    STATUS_STYLES[order.status] || "bg-gray-50 text-gray-700 border-gray-200";
  const statusLabel = STATUS_LABELS[order.status] || order.status;

  const paymentStatus = order.paymentStatus || "N/A";
  const paymentBadgeClass =
    PAYMENT_STATUS_STYLES[paymentStatus] ||
    "bg-gray-50 text-gray-700 border-gray-200";

  const address = order.deliveryAddress;
  const hasAddress =
    address &&
    (address.addressLine1 ||
      address.addressLine2 ||
      address.city ||
      address.state ||
      address.pincode);

  return (
    <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[10px] border border-gray-200 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              {order.orderCode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex px-2.5 py-1 rounded-[10px] border text-xs font-semibold whitespace-nowrap ${statusBadgeClass}`}
            >
              {statusLabel}
            </span>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 transition flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* SUMMARY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryStat
              icon={<Hash className="w-4 h-4" />}
              label="Order ID"
              value={`#${order.id}`}
            />
            <SummaryStat
              icon={<Calendar className="w-4 h-4" />}
              label="Order Date"
              value={formatDate(order.createdAt)}
            />
            <SummaryStat
              icon={<Receipt className="w-4 h-4" />}
              label="Total Amount"
              value={formatCurrency(Number(order.totalAmount))}
              emphasize
            />
            <SummaryStat
              icon={<CreditCard className="w-4 h-4" />}
              label="Payment Method"
              value={order.paymentMethod || "COD"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CUSTOMER */}
            <Section title="Customer" icon={<User className="w-4 h-4" />}>
              <Field
                label="Customer Name"
                value={
                  order.deliveryAddress?.fullName || order.buyer?.name || "N/A"
                }
              />
              <Field
                label="Phone Number"
                icon={<Phone className="w-3.5 h-3.5" />}
                value={
                  order.deliveryAddress?.phone ||
                  order.buyer?.phoneNumber ||
                  "N/A"
                }
              />
              {order.buyer?.email && (
                <Field label="Email" value={order.buyer.email} />
              )}
            </Section>

            {/* PAYMENT */}
            <Section
              title="Payment"
              icon={<CreditCard className="w-4 h-4" />}
            >
              <div className="flex items-center justify-between py-1.5">
                <p className="text-xs text-gray-500">Payment Status</p>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-[10px] border text-xs font-semibold ${paymentBadgeClass}`}
                >
                  {paymentStatus}
                </span>
              </div>
              <Field
                label="Transaction ID"
                value={order.transactionId || "N/A"}
                breakAll
              />
              {order.trackingId && (
                <Field label="Tracking ID" value={order.trackingId} breakAll />
              )}
              {order.courierPartner && (
                <Field label="Courier Partner" value={order.courierPartner} />
              )}
            </Section>
          </div>

          {/* DELIVERY ADDRESS */}
          {hasAddress && (
            <Section
              title="Delivery Address"
              icon={<MapPin className="w-4 h-4" />}
            >
              <p className="text-sm text-gray-800 leading-relaxed">
                {[address?.addressLine1, address?.addressLine2]
                  .filter(Boolean)
                  .join(", ")}
                {address?.city || address?.state || address?.pincode ? (
                  <>
                    <br />
                    {[address?.city, address?.state, address?.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </>
                ) : null}
              </p>
            </Section>
          )}

          {/* ORDER ITEMS */}
          <div className="border border-gray-200 rounded-[10px] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">
                Order Items
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {order.orderItems?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  <div className="relative w-14 h-14 rounded-[10px] overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                    <Image
                      src={
                        item.product?.images?.[0]?.imageUrl ||
                        "/placeholder.png"
                      }
                      alt={item.product?.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.product?.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Product ID: {item.product?.id}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm font-bold text-gray-900">
                      {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY STAT — top-row quick facts
========================================================= */

function SummaryStat({
  icon,
  label,
  value,
  emphasize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-[10px] p-3.5">
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}
        <p className="text-xs font-medium text-gray-500">{label}</p>
      </div>
      <p
        className={`mt-1.5 truncate ${
          emphasize
            ? "text-lg font-bold text-gray-900"
            : "text-sm font-semibold text-gray-800"
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION — grouped card with a title row
========================================================= */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-[10px] p-4">
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/* =========================================================
   FIELD — label/value row
========================================================= */

function Field({
  label,
  value,
  icon,
  breakAll,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  breakAll?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <p className="text-xs text-gray-500 flex items-center gap-1.5 shrink-0">
        {icon}
        {label}
      </p>
      <p
        className={`text-sm font-semibold text-gray-900 text-right ${
          breakAll ? "break-all" : "truncate"
        }`}
      >
        {value}
      </p>
    </div>
  );
}