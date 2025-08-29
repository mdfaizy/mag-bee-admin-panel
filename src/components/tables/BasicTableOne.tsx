"use client";

import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orders/ResentOrder";
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
  
  FiX
} from "react-icons/fi";
import { 
  FaBox, 
 
  FaShoppingBag 
} from "react-icons/fa";

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [modalOrder, setModalOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status", color: "primary" },
    { value: "pending", label: "Pending", color: "warning" },
    { value: "confirmed", label: "Confirmed", color: "primary" },
    { value: "processing", label: "Processing", color: "primary" },
    { value: "shipped", label: "Shipped", color: "primary" },
    { value: "delivered", label: "Delivered", color: "success" },
    { value: "cancelled", label: "Cancelled", color: "error" },
    { value: "returned", label: "Returned", color: "error" },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getAllOrders();
      setOrders(result);
      setFilteredOrders(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openOrderModal = async (orderId: string) => {
    try {
      // Try to get detailed order info
      const orderDetail = await getOrderById(orderId);
      setModalOrder(orderDetail);
    } catch (error) {
      // If API fails, try to find the order in our existing data
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setModalOrder(order);
      } else {
        console.error("Order not found");
        return;
      }
    }
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setModalOrder(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Filter orders by search, status, and date
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            return orderDate >= weekStart;
          case "month":
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
          case "quarter":
            const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
            const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
            return orderDate >= quarterStart;
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.orderCode.toLowerCase().includes(term) ||
        (order.deliveryAddress?.fullName || order.buyer?.name || '').toLowerCase().includes(term) ||
        order.orderItems.some((item: any) => 
          item.productName?.toLowerCase().includes(term) || 
          item.product?.name?.toLowerCase().includes(term)
        )
      );
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, dateFilter, orders]);

 
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Update modal order if it's the same order
      if (modalOrder && modalOrder.id === orderId) {
        setModalOrder({...modalOrder, status: newStatus});
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status");
    }
  };

  type BadgeColor = "primary" | "success" | "warning" | "error";

  const getStatusColor = (status: string): BadgeColor => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
      case "processing":
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
      case "returned":
        return "error";
      default:
        return "primary";
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const ordersWithItems = filteredOrders.map(order => ({
    ...order,
    totalItems: order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
    totalProducts: order.orderItems.length
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredOrders.length} orders found
              {selectedOrders.length > 0 && ` • ${selectedOrders.length} selected`}
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
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
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
            </Button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
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
            <div className="flex flex-col md:flex-row gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select 
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-blue-800 border-blue-300">
                Export Selected
              </Button>
              <Button variant="outline" size="sm" className="text-blue-800 border-blue-300">
                Bulk Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="w-12">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={selectAllOrders}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </TableCell>
              <TableCell>Order Details</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell className="text-center">Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200">
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <FiRefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  </div>
                  <p className="mt-2 text-gray-500">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : ordersWithItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <FaShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'No orders have been placed yet'
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ordersWithItems.map((order) => (
                <>
                  <TableRow key={order.id} className="hover:bg-gray-50 group">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {order.orderItems[0]?.product?.images?.[0]?.imageUrl && (
                          <Image
                            src={order.orderItems[0].product.images[0].imageUrl}
                            alt={order.orderItems[0].product.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover border"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">#{order.orderCode}</div>
                          <div className="text-sm text-gray-500">
                            {order.totalProducts} product(s)
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.deliveryAddress?.fullName || order.buyer?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.deliveryAddress?.phone || order.buyer?.phoneNumber || ''}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <FaBox className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{order.totalItems}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(parseFloat(order.totalAmount) || 0)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge size="sm" color={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs border rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1">
                      
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openOrderModal(order.id)}
                          title="View Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </Button>
                        
                        {order.totalProducts > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                            title="Expand/Collapse"
                          >
                            {expandedOrder === order.id ? (
                              <FiChevronUp className="h-4 w-4" />
                            ) : (
                              <FiChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedOrder === order.id && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={8} className="px-6 py-4">
                        <div className="grid gap-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                              <div className="text-sm text-gray-600">
                                Payment Method: {order.paymentMethod || 'N/A'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                Total: {formatCurrency(parseFloat(order.totalAmount) || 0)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h5 className="font-medium text-gray-900 mb-3">Products</h5>
                            <div className="space-y-3">
                              {order.orderItems.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                  <div className="flex items-center gap-3">
                                    {item.product?.images?.[0]?.imageUrl && (
                                      <Image
                                        src={item.product.images[0].imageUrl}
                                        alt={item.product.name}
                                        width={48}
                                        height={48}
                                        className="rounded object-cover border"
                                      />
                                    )}
                                    <div>
                                      <div className="font-medium">{item.product?.name || 'Unknown Product'}</div>
                                      <div className="text-sm text-gray-500">
                                        SKU: {item.product?.sku || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">
                                      {formatCurrency(parseFloat(item.price) || 0)} × {item.quantity}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Total: {formatCurrency((parseFloat(item.price) || 0) * item.quantity)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.deliveryAddress && (
                            <div className="border-t pt-3">
                              <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                              <div className="text-sm text-gray-600">
                                {order.deliveryAddress.fullName && <div>{order.deliveryAddress.fullName}</div>}
                                {order.deliveryAddress.street && <div>{order.deliveryAddress.street}</div>}
                                {order.deliveryAddress.city && (
                                  <div>
                                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                                  </div>
                                )}
                                {order.deliveryAddress.country && <div>{order.deliveryAddress.country}</div>}
                                {order.deliveryAddress.phone && <div>Phone: {order.deliveryAddress.phone}</div>}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && modalOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Order #{modalOrder.orderCode}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeOrderModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                  <p className="font-medium text-gray-900">
                    {modalOrder.deliveryAddress?.fullName || modalOrder.buyer?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {modalOrder.deliveryAddress?.phone || modalOrder.buyer?.phoneNumber || ''}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                  <p className="font-medium text-gray-900">
                    {formatDate(modalOrder.createdAt)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <div className="flex items-center gap-2">
                    <Badge color={getStatusColor(modalOrder.status)}>
                      {modalOrder.status.charAt(0).toUpperCase() + modalOrder.status.slice(1)}
                    </Badge>
                    <select
                      value={modalOrder.status}
                      onChange={(e) => handleStatusChange(modalOrder.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Products */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
                <div className="space-y-4">
                  {modalOrder.orderItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {item.product?.images?.[0]?.imageUrl && (
                          <Image
                            src={item.product.images[0].imageUrl}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded object-cover border"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(parseFloat(item.price) || 0)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Total: {formatCurrency((parseFloat(item.price) || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(modalOrder.totalAmount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 mt-2">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(parseFloat(modalOrder.totalAmount) || 0)}
                  </span>
                </div>
              </div>
              
              {/* Shipping Address */}
              {modalOrder.deliveryAddress && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{modalOrder.deliveryAddress.fullName}</p>
                    <p className="text-gray-600">{modalOrder.deliveryAddress.street}</p>
                    <p className="text-gray-600">
                      {modalOrder.deliveryAddress.city}, {modalOrder.deliveryAddress.state} {modalOrder.deliveryAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{modalOrder.deliveryAddress.country}</p>
                    <p className="text-gray-600">Phone: {modalOrder.deliveryAddress.phone}</p>
                  </div>
                </div>
              )}
              
              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Method: {modalOrder.paymentMethod || 'N/A'}</p>
                  <p className="text-gray-600">Status: Paid</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            
              <Button
                onClick={closeOrderModal}
                className="flex items-center gap-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}