"use client";
import React, { useEffect, useState } from "react";
import { fetchAllUsers } from "@/services/authService";
import { User } from "@/utils/type";
import { BiBox, BiUser } from 'react-icons/bi';
import { FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import { getAllOrders } from "@/services/orders/ResentOrder";

export const EcommerceMetrics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchUser = async () => {
    try {
      const response = await fetchAllUsers();
      console.log("user", response)
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getOrders = async () => {
    try {
      const response = await getAllOrders();
      console.log("orders", response)
      setOrders(response);
      
      // Calculate total revenue
      const revenue = response.reduce((sum: number, order: any) => {
        return sum + parseFloat(order.totalAmount || "0");
      }, 0);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    getOrders();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    // <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 w-full mx-auto">
    //   {/* Customers Metric */}
    //   <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    //     <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
    //       <BiUser className="text-2xl text-blue-600 dark:text-blue-400" />
    //     </div>

    //     <div className="flex items-end justify-between mt-5">
    //       <div>
    //         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
    //           Total Customers
    //         </span>
    //         <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
    //           {users.length}
    //         </h4>
    //       </div>
    //       <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
    //         {/* +2.5% */}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Orders Metric */}
    //   <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    //     <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
    //       <BiBox className="text-2xl text-purple-600 dark:text-purple-400" />
    //     </div>
    //     <div className="flex items-end justify-between mt-5">
    //       <div>
    //         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
    //           Total Orders
    //         </span>
    //         <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
    //           {orders.length}
    //         </h4>
    //       </div>
    //       <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
    //         {/* +12.4% */}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Revenue Metric */}
    //   <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    //     <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
    //       <FiDollarSign className="text-2xl text-green-600 dark:text-green-400" />
    //     </div>
    //     <div className="flex items-end justify-between mt-5">
    //       <div>
    //         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
    //           Total Revenue
    //         </span>
    //         <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
    //           {formatCurrency(totalRevenue)}
    //         </h4>
    //       </div>
    //       <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
    //         {/* +8.3% */}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Average Order Value Metric */}
    //   <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    //     <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
    //       <FiShoppingCart className="text-2xl text-orange-600 dark:text-orange-400" />
    //     </div>
    //     <div className="flex items-end justify-between mt-5">
    //       <div>
    //         <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
    //           Avg. Order Value
    //         </span>
    //         <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
    //           {orders.length > 0 ? formatCurrency(totalRevenue / orders.length) : formatCurrency(0)}
    //         </h4>
    //       </div>
    //       <div className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900/20 dark:text-red-400">
    //         {/* -1.2% */}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full">
    <div className="grid grid-cols-4 gap-2">
  {/* Customers Metric */}
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
      <BiUser className="text-2xl text-blue-600 dark:text-blue-400" />
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Customers
        </span>

        <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
          {users.length}
        </h4>
      </div>
    </div>
  </div>

  {/* Orders Metric */}
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
      <BiBox className="text-2xl text-purple-600 dark:text-purple-400" />
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Orders
        </span>

        <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
          {orders.length}
        </h4>
      </div>
    </div>
  </div>

  {/* Revenue Metric */}
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
      <FiDollarSign className="text-2xl text-green-600 dark:text-green-400" />
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Revenue
        </span>

        <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
          {formatCurrency(totalRevenue)}
        </h4>
      </div>
    </div>
  </div>

  {/* Average Order Value */}
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
      <FiShoppingCart className="text-2xl text-orange-600 dark:text-orange-400" />
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Avg. Order Value
        </span>

        <h4 className="mt-1 font-bold text-gray-800 text-2xl dark:text-white/90">
          {orders.length > 0
            ? formatCurrency(totalRevenue / orders.length)
            : formatCurrency(0)}
        </h4>
      </div>
    </div>
  </div>
</div>
</div>
  );
};