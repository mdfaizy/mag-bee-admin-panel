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

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

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


        </div>
      </div>


      <ul className="list-none p-0 m-0 space-y-2 flex gap-2 mt-2 ml-4">
        <li className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded shadow-sm">On Hold</li>
        <li className="px-4 py-2 bg-blue-100 text-blue-800 rounded shadow-sm">Pending</li>
        <li className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded shadow-sm">Ready to Ship</li>
        <li className="px-4 py-2 bg-green-100 text-green-800 rounded shadow-sm">Shipped</li>
        <li className="px-4 py-2 bg-red-100 text-red-800 rounded shadow-sm">Cancelled</li>
      </ul>

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
                <TableCell className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <FiRefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  </div>
                  <p className="mt-2 text-gray-500">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : ordersWithItems.length === 0 ? (
              <TableRow>
                <TableCell className="px-6 py-12 text-center">
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
                          <div className="font-semibold">{order.orderItems[0].product.name}</div>

                          <div className="text-sm text-gray-600">
                            {order.orderItems[0].product.id}
                          </div>

                          <div className="font-medium text-gray-900">{order.orderCode}</div>
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
                      <div className="flex gap-1">


                      </div>
                    </TableCell>
                  </TableRow>


                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}



