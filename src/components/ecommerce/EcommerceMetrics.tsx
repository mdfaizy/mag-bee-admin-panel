
// "use client";

// import React, { useEffect, useState } from "react";
// import { fetchAllUsers } from "@/services/authService";
// import { User } from "@/utils/type";
// import { BiBox, BiUser } from "react-icons/bi";
// import { FiDollarSign, FiShoppingCart } from "react-icons/fi";
// import { getAllOrders } from "@/services/orders/ResentOrder";

// export const EcommerceMetrics = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   // const [ setTotalRevenue] = useState(0);

//   // =========================
//   // Fetch Users
//   // =========================
//   const fetchUser = async () => {
//     try {
//       const response = await fetchAllUsers();

//       console.log("user", response);

//       setUsers(response.users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // =========================
//   // Fetch Orders
//   // =========================
//   // const getOrders = async () => {
//   //   try {
//   //     const response = await getAllOrders();

//   //     console.log("orders", response);

//   //     setOrders(response);

//   //     // Calculate total revenue
//   //     const revenue = response.reduce((sum: number, order: any) => {
//   //       return sum + parseFloat(order.totalAmount || "0");
//   //     }, 0);

//   //     setTotalRevenue(revenue);
//   //   } catch (error) {
//   //     console.error("Error fetching orders:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const getOrders = async () => {
//   try {
//     const response = await getAllOrders();

//     console.log("Orders API response:", response);

//     const ordersData = Array.isArray(response?.orders)
//       ? response.orders
//       : Array.isArray(response)
//         ? response
//         : [];

//     setOrders(ordersData);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     setOrders([]);
//   } finally {
//     setLoading(false);
//   }
// };


// const validSales = orders.filter((order) => {
//   const paymentStatus = String(
//     order.paymentStatus ?? ""
//   ).toUpperCase();

//   const status = String(order.status ?? "").toUpperCase();

//   return (
//     paymentStatus === "PAID" &&
//     !["CANCELLED", "CANCELED"].includes(status)
//   );
// });

// const totalSales = validSales.length;

// const totalRevenue = validSales.reduce(
//   (sum, order) => sum + Number(order.totalAmount ?? 0),
//   0
// );

// const averageOrderValue =
//   totalSales > 0 ? totalRevenue / totalSales : 0;

//   // =========================
//   // Initial Load
//   // =========================
//   useEffect(() => {
//     fetchUser();
//     getOrders();
//   }, []);

//   // =========================
//   // Currency Formatter
//   // =========================
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // =========================
//   // Loading State
//   // =========================
//   if (loading) {
//     return (
//       <div className="w-full">
//         <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="
//                 w-full min-w-0
//                 rounded-xl
//                 border border-gray-200
//                 bg-white
//                 p-5
//                 shadow-sm
//                 dark:border-gray-800
//                 dark:bg-gray-900
//               "
//             >
//               <div className="animate-pulse">
//                 <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />

//                 <div className="mt-5 space-y-3">
//                   <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />

//                   <div className="h-7 w-24 rounded bg-gray-200 dark:bg-gray-700" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // Metric Card Data
//   // =========================
//   const metrics = [
//     {
//       key: "customers",
//       label: "Total Customers",
//       value: users.length,
//       icon: <BiUser className="text-2xl text-blue-600 dark:text-blue-400" />,
//       iconBg: "bg-blue-100 dark:bg-blue-900/20",
//     },
//     {
//       key: "orders",
//       label: "Total Orders",
//       value: orders.length,
//       icon: <BiBox className="text-2xl text-purple-600 dark:text-purple-400" />,
//       iconBg: "bg-purple-100 dark:bg-purple-900/20",
//     },
//     {
//       key: "revenue",
//       label: "Total Revenue",
//       value: formatCurrency(totalRevenue),
//       icon: (
//         <FiDollarSign className="text-2xl text-green-600 dark:text-green-400" />
//       ),
//       iconBg: "bg-green-100 dark:bg-green-900/20",
//     },
//     {
//       key: "aov",
//       label: "Avg. Order Value",
//       value:
//         orders.length > 0
//           ? formatCurrency(totalRevenue / orders.length)
//           : formatCurrency(0),
//       icon: (
//         <FiShoppingCart className="text-2xl text-orange-600 dark:text-orange-400" />
//       ),
//       iconBg: "bg-orange-100 dark:bg-orange-900/20",
//     },
//   ];

//   // =========================
//   // Dashboard Metrics
//   // =========================
//   return (
//     <div className="w-full">
//       <div
//         className="
//           grid
//           w-full
//           grid-cols-1
//           gap-4
//           sm:grid-cols-2
//           sm:gap-5
//           lg:grid-cols-4
//           lg:gap-6
//         "
//       >
//         {metrics.map((metric) => (
//           <div
//             key={metric.key}
//             className="
//               w-full min-w-0
//               rounded-xl
//               border
//               border-gray-200
//               bg-white
//               p-5
//               shadow-sm
//               transition-all
//               hover:shadow-md
//               dark:border-gray-800
//               dark:bg-gray-900
//               dark:hover:border-gray-700
//             "
//           >
//             <div
//               className={`
//                 flex
//                 h-12
//                 w-12
//                 items-center
//                 justify-center
//                 rounded-xl
//                 ${metric.iconBg}
//               `}
//             >
//               {metric.icon}
//             </div>

//             <div className="mt-5">
//               <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
//                 {metric.label}
//               </span>

//               <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90 truncate">
//                 {metric.value}
//               </h4>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { fetchAllUsers } from "@/services/authService";
import { User } from "@/utils/type";
import {
  BiBox,
  BiUser,
  BiTrendingUp,
} from "react-icons/bi";
import {
  FiDollarSign,
  FiShoppingCart,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { getAllOrders } from "@/services/orders/ResentOrder";

interface Order {
  id: number | string;
  totalAmount?: number | string;
  paymentStatus?: string;
  status?: string;
  [key: string]: any;
}

interface MetricCard {
  key: string;
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export const EcommerceMetrics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Indian currency formatter
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

  // Fetch customers
  const fetchUser = async () => {
    try {
      const response = await fetchAllUsers();
      setUsers(Array.isArray(response?.users) ? response.users : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch all pages of orders
  const getOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const firstResponse = await getAllOrders(1, 20);

      const firstOrders: Order[] = Array.isArray(firstResponse?.orders)
        ? firstResponse.orders
        : Array.isArray(firstResponse)
          ? firstResponse
          : [];

      const total = Number(firstResponse?.total ?? firstOrders.length);
      const totalPages = Math.max(
        1,
        Number(firstResponse?.totalPages ?? 1)
      );

      let allOrders = [...firstOrders];

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            getAllOrders(index + 2, 20)
          )
        );

        allOrders = [
          ...allOrders,
          ...remainingPages.flatMap((response: any) =>
            Array.isArray(response?.orders)
              ? response.orders
              : Array.isArray(response)
                ? response
                : []
          ),
        ];
      }

      setOrders(allOrders);
      setTotalOrdersCount(total);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
      setTotalOrdersCount(0);
      setError("Unable to load order analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
    void getOrders();
  }, []);

  // Financial metrics
  const analytics = useMemo(() => {
    const paidOrders = orders.filter((order) => {
      const paymentStatus = String(
        order.paymentStatus ?? ""
      ).toUpperCase();

      const orderStatus = String(order.status ?? "").toUpperCase();

      return (
        paymentStatus === "PAID" &&
        !["CANCELLED", "CANCELED"].includes(orderStatus)
      );
    });

    const revenue = paidOrders.reduce((sum, order) => {
      const amount = Number(order.totalAmount ?? 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    const averageOrderValue =
      paidOrders.length > 0 ? revenue / paidOrders.length : 0;

    return {
      paidOrderCount: paidOrders.length,
      revenue,
      averageOrderValue,
    };
  }, [orders]);

  const metrics: MetricCard[] = [
    {
      key: "customers",
      label: "Total Customers",
      value: users.length.toLocaleString("en-IN"),
      description: "Registered customers",
      icon: <BiUser />,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      key: "orders",
      label: "Total Orders",
      value: totalOrdersCount.toLocaleString("en-IN"),
      description: `${analytics.paidOrderCount} paid orders loaded`,
      icon: <BiBox />,
      iconBg: "bg-violet-50 dark:bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value: formatCurrency(analytics.revenue),
      description: "Paid, non-cancelled orders",
      icon: <FiDollarSign />,
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "aov",
      label: "Avg. Order Value",
      value: formatCurrency(analytics.averageOrderValue),
      description: "Revenue per paid order",
      icon: <FiShoppingCart />,
      iconBg: "bg-orange-50 dark:bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="min-w-0 animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="mt-5 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-3 h-8 w-36 max-w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-3 h-3 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="w-full space-y-4">
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() => void getOrders()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 px-3 py-2 font-medium hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/40 sm:self-auto"
          >
            <FiRefreshCw />
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.key}
            className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>

                <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                  {metric.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${metric.iconBg} ${metric.iconColor}`}
              >
                {metric.icon}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              <BiTrendingUp className="shrink-0 text-lg text-gray-400" />
              <p className="min-w-0 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>
          Analytics based on {orders.length.toLocaleString("en-IN")} fetched
          orders.
        </span>

        <button
          type="button"
          onClick={() => {
            void fetchUser();
            void getOrders();
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>
    </section>
  );
};
