"use client";

import Image from "next/image";
import { FiX, FiPackage, FiCalendar } from "react-icons/fi";

interface OrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

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

 return (
  <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Order Details
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            {order.orderCode}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* BODY */}
      <div className="p-8 max-h-[80vh] overflow-y-auto">

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CUSTOMER */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">
              Customer
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-gray-500">
                  Customer Name
                </p>

                <p className="font-semibold text-gray-900">
                  {order.deliveryAddress?.fullName ||
                    order.buyer?.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Phone Number
                </p>

                <p className="font-semibold text-gray-900">
                  {order.deliveryAddress?.phone ||
                    order.buyer?.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* ORDER INFO */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">
              Order Info
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold text-gray-900">
                  #{order.id}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Status
                </p>

                <p className="font-semibold text-blue-700">
                  {order.status}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Order Date
                </p>

                <p className="font-semibold text-gray-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-5">
              Payment
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-gray-500">
                  Amount
                </p>

                <p className="font-bold text-2xl text-green-700">
                  {formatCurrency(
                    Number(order.totalAmount)
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Payment Status
                </p>

                <p className="font-semibold text-gray-900">
                  {order.paymentStatus || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Transaction ID
                </p>

                <p className="font-semibold text-gray-900 break-all">
                  {order.transactionId || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="mt-8 bg-white border border-gray-200 rounded-3xl overflow-hidden">

          <div className="px-6 py-5 border-b bg-gray-50 flex items-center gap-3">
            <FiPackage className="w-5 h-5 text-indigo-600" />

            <h3 className="text-xl font-semibold text-gray-900">
              Order Items
            </h3>
          </div>

          <div className="divide-y divide-gray-100">

            {order.orderItems?.map((item: any) => (

              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center gap-5 p-6 hover:bg-gray-50 transition"
              >

                {/* IMAGE */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border bg-white flex-shrink-0">

                  <Image
                    src={
                      item.product?.images?.[0]
                        ?.imageUrl ||
                      "/placeholder.png"
                    }
                    alt={item.product?.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">

                  <h4 className="text-lg font-semibold text-gray-900">
                    {item.product?.name}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    Product ID:
                    {item.product?.id}
                  </p>
                </div>

                {/* QTY */}
                <div className="text-right">

                  <p className="text-sm text-gray-500">
                    Quantity
                  </p>

                  <p className="text-xl font-bold text-gray-900">
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