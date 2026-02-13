"use client";

import {
  Table, TableHeader, TableBody, TableRow, TableCell
} from "../ui/table";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { downloadInvoice, getAllOrders, updateOrderStatus } from "../../services/orders/ResentOrder";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiCheck,
  FiPackage,
  FiTruck,
  FiAlertCircle,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import {
  FaBox,
  FaShoppingBag,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaPauseCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

type OrderStatus = "PENDING" | "ON_HOLD" | "READY_TO_SHIP" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    images?: Array<{ imageUrl: string }>;
  };
}

interface Order {
  id: string;
  orderCode: string;
  totalAmount: string | number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  deliveryAddress?: {
    fullName?: string;
    phone?: string;
  };
  buyer?: {
    name?: string;
    phoneNumber?: string;
  };
}
const statusMap = {
  placed: "PENDING",
  confirmed: "READY_TO_SHIP",
  dispatched: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getAllOrders();
      setOrders(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  // Filtering
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((order) => {
        const customerName = (
          order.deliveryAddress?.fullName ||
          order.buyer?.name ||
          ""
        ).toLowerCase();
        const orderCode = order.orderCode.toLowerCase();
        const productNames = order.orderItems
          .map((item) => item.product.name.toLowerCase())
          .join(" ");

        return (
          customerName.includes(lowerSearch) ||
          orderCode.includes(lowerSearch) ||
          productNames.includes(lowerSearch)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "today":
            return diffDays === 0;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    return result;
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);
  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((order) => order.id));
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(orderId);
      // await updateOrderStatus(orderId, newStatus);

      await updateOrderStatus(orderId, { status: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleBulkStatusChange = async (newStatus: OrderStatus) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    try {
      await Promise.all(
       selectedOrders.map((id) =>
  updateOrderStatus(id, { status: newStatus })
)

      );
      
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order.id)
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      setSelectedOrders([]);
      toast.success(`${selectedOrders.length} orders updated successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update orders");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      PENDING: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: FiClock,
        dotColor: "bg-yellow-500",
      },
      ON_HOLD: {
        label: "On Hold",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: FaPauseCircle,
        dotColor: "bg-orange-500",
      },
      READY_TO_SHIP: {
        label: "Ready to Ship",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FiPackage,
        dotColor: "bg-blue-500",
      },
      SHIPPED: {
        label: "Shipped",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: FiTruck,
        dotColor: "bg-indigo-500",
      },
      DELIVERED: {
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FaCheckCircle,
        dotColor: "bg-green-500",
      },
      CANCELLED: {
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FaTimesCircle,
        dotColor: "bg-red-500",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      onHold: orders.filter((o) => o.status === "ON_HOLD").length,
      readyToShip: orders.filter((o) => o.status === "READY_TO_SHIP").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const normalizeStatus = (status: string) => {
  return statusMap[status as keyof typeof statusMap] ?? "PENDING";
};
const ordersWithItems = paginatedOrders.map((order) => ({
  ...order,
  normalizedStatus: normalizeStatus(order.status),
  totalItems: order.orderItems.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  ),
  totalProducts: order.orderItems.length,
}));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <FaShoppingBag className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-700">Pending</span>
            <FiClock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-700">On Hold</span>
            <FaPauseCircle className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-700">{stats.onHold}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Ready</span>
            <FiPackage className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{stats.readyToShip}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-700">Shipped</span>
            <FiTruck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-700">{stats.shipped}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Delivered</span>
            <FaCheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-700">Cancelled</span>
            <FaTimesCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaShoppingBag className="w-5 h-5 text-indigo-600" />
                Order Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredOrders.length} orders found
                {selectedOrders.length > 0 && (
                  <span className="text-indigo-600 font-medium">
                    {" "}
                    • {selectedOrders.length} selected
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <FiRefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FiFilter className="h-4 w-4" />
                Filters
                {showFilters ? (
                  <FiChevronUp className="h-3 w-3" />
                ) : (
                  <FiChevronDown className="h-3 w-3" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FiDownload className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders, customers, or products..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {showFilters && (
                <div className="flex flex-wrap gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "PENDING"
                    ? "bg-yellow-600 text-white shadow-md"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("ON_HOLD")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "ON_HOLD"
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                }`}
              >
                On Hold
              </button>
              <button
                onClick={() => setStatusFilter("READY_TO_SHIP")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "READY_TO_SHIP"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                Ready to Ship
              </button>
              <button
                onClick={() => setStatusFilter("SHIPPED")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "SHIPPED"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setStatusFilter("DELIVERED")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "DELIVERED"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setStatusFilter("CANCELLED")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === "CANCELLED"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-indigo-900">
                  Bulk Actions:
                </span>
                <Button
                  size="sm"
                  onClick={() => handleBulkStatusChange("READY_TO_SHIP")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mark as Ready to Ship
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkStatusChange("SHIPPED")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Mark as Shipped
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkStatusChange("DELIVERED")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark as Delivered
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedOrders([])}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
              <TableRow className="border-b-2 border-gray-200">
                <TableCell className="w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedOrders.length === paginatedOrders.length &&
                      paginatedOrders.length > 0
                    }
                    onChange={selectAllOrders}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase">
                  Order Details
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase">
                  Customer
                </TableCell>
                <TableCell className="text-center font-semibold text-gray-700 text-xs uppercase">
                  Items
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase">
                  Amount
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase">
                  Date
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase">
                  Status
                </TableCell>
                <TableCell className="font-semibold text-gray-700 text-xs uppercase text-right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {loading ? (
                <TableRow>
                  <TableCell  className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiRefreshCw className="h-12 w-12 text-indigo-400 animate-spin mb-4" />
                      <p className="text-gray-600 font-medium">Loading orders...</p>
                      <p className="text-sm text-gray-500 mt-1">Please wait</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : ordersWithItems.length === 0 ? (
                <TableRow>
                  <TableCell  className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FaShoppingBag className="h-10 w-10 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                          ? "Try adjusting your search or filters to find what you're looking for"
                          : "No orders have been placed yet. Orders will appear here once customers start placing them."}
                      </p>
                      {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setDateFilter("all");
                          }}
                          className="mt-4"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ordersWithItems.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <>
                      <TableRow
                        key={order.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => toggleSelectOrder(order.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            {order.orderItems[0]?.product?.images?.[0]
                              ?.imageUrl && (
                              <div className="relative w-14 h-14 flex-shrink-0">
                                <Image
                                  src={
                                    order.orderItems[0].product.images[0]
                                      .imageUrl
                                  }
                                  alt={order.orderItems[0].product.name}
                                  fill
                                  className="rounded-lg object-cover border-2 border-gray-200"
                                />
                                {order.totalProducts > 1 && (
                                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                    +{order.totalProducts - 1}
                                  </span>
                                )}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900 mb-0.5">
                                {order.orderCode}
                              </div>
                              <div className="text-sm text-gray-600">
                                {order.orderItems[0].product.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <FaBox className="w-3 h-3" />
                                {order.totalProducts} product(s)
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.deliveryAddress?.fullName ||
                                order.buyer?.name ||
                                "N/A"}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <FiClock className="w-3 h-3" />
                              {order.deliveryAddress?.phone ||
                                order.buyer?.phoneNumber ||
                                ""}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
                            <FaBox className="h-3.5 w-3.5 text-slate-600" />
                            <span className="font-semibold text-slate-900">
                              {order.totalItems}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="font-bold text-gray-900 text-base">
                            {formatCurrency(parseFloat(order.totalAmount.toString()) || 0)}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div>{formatDate(order.createdAt).split(",")[0]}</div>
                              <div className="text-xs text-gray-500">
                                {formatDate(order.createdAt).split(",")[1]}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {updatingStatus === order.id ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FiRefreshCw className="w-4 h-4 animate-spin" />
                              Updating...
                            </div>
                          ) : (
                            <div className="relative group/status">
                              <div
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color} cursor-pointer`}
                              >
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                                {statusConfig.label}
                              </div>
                              
                              {/* Status Dropdown */}
                              <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10">
                                <div className="p-2 space-y-1">
                                  <button
                                    onClick={() => handleStatusChange(order.id, "PENDING")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-yellow-50 text-yellow-700 flex items-center gap-2"
                                  >
                                    <FiClock className="w-4 h-4" />
                                    Pending
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "ON_HOLD")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-orange-50 text-orange-700 flex items-center gap-2"
                                  >
                                    <FaPauseCircle className="w-4 h-4" />
                                    On Hold
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "READY_TO_SHIP")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 text-blue-700 flex items-center gap-2"
                                  >
                                    <FiPackage className="w-4 h-4" />
                                    Ready to Ship
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-indigo-50 text-indigo-700 flex items-center gap-2"
                                  >
                                    <FiTruck className="w-4 h-4" />
                                    Shipped
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-green-50 text-green-700 flex items-center gap-2"
                                  >
                                    <FaCheckCircle className="w-4 h-4" />
                                    Delivered
                                  </button>
                                  <div className="border-t border-gray-200 my-1" />
                                  <button
                                    onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-red-50 text-red-700 flex items-center gap-2"
                                  >
                                    <FaTimesCircle className="w-4 h-4" />
                                    Cancel Order
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                           {["SHIPPED", "DELIVERED"].includes(order.status) && (
  <button
    onClick={() => downloadInvoice(order.id)}
    className="p-2 hover:bg-green-50 rounded-lg"
    title="Download Invoice"
  >
    <FiDownload className="w-4 h-4 text-green-600" />
  </button>
)}



                            <button
                              onClick={() =>
                                setExpandedOrder(
                                  isExpanded ? null : order.id
                                )
                              }
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group/btn"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600" />
                            </button>
                            <button
                              className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group/btn"
                              title="Edit Order"
                            >
                              <FiEdit className="w-4 h-4 text-gray-600 group-hover/btn:text-indigo-600" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors group/btn"
                              title="Delete Order"
                            >
                              <FiTrash2 className="w-4 h-4 text-gray-600 group-hover/btn:text-red-600" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell className="bg-slate-50">
                            <div className="p-6 space-y-4">
                              <h4 className="font-semibold text-gray-900 text-lg mb-4">
                                Order Items
                              </h4>
                              <div className="grid gap-4">
                                {order.orderItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200"
                                  >
                                    {item.product.images?.[0]?.imageUrl && (
                                      <div className="relative w-16 h-16">
                                        <Image
                                          src={item.product.images[0].imageUrl}
                                          alt={item.product.name}
                                          fill
                                          className="rounded-lg object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">
                                        {item.product.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Product ID: {item.product.id}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-gray-900">
                                        Qty: {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredOrders.length > 0 && (
          <div className="border-t border-gray-200 bg-slate-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(endIndex, filteredOrders.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filteredOrders.length}
                </span>{" "}
                orders
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

