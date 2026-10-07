// // "use client";
// // import { useEffect, useState } from "react";
// // import dynamic from "next/dynamic";
// // import { ApexOptions } from "apexcharts";
// // import { getAllOrders } from "../../../services/orders/ResentOrder"; // Update path as needed

// // const ReactApexChart = dynamic(() => import("react-apexcharts"), {
// //   ssr: false,
// // });

// // const MONTHS = [
// //   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// // ];

// // interface Order {
// //   id: string;
// //   totalAmount: string;
// //   createdAt: string;
// //   // Add other properties as needed
// // }

// // export default function MonthlySalesChart() {
// //   const [series, setSeries] = useState([
// //     {
// //       name: "Sales",
// //       data: Array(12).fill(0),
// //     },
// //   ]);
// //   const [orders, setOrders] = useState<Order[]>([]);
// //   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
// //   const [dataType, setDataType] = useState<"sales" | "revenue">("revenue");
// //   const [availableYears, setAvailableYears] = useState<number[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // Fetch orders and prepare chart data
// //   useEffect(() => {
// //     async function fetchOrders() {
// //       try {
// //         setLoading(true);
// //         const ordersData = await getAllOrders();
// //         setOrders(ordersData);

// //         // Extract available years from orders
// //         const years = new Set<number>();
// //         ordersData.forEach((order: Order) => {
// //           const year = new Date(order.createdAt).getFullYear();
// //           years.add(year);
// //         });
        
// //         const sortedYears = Array.from(years).sort((a, b) => b - a);
// //         setAvailableYears(sortedYears);
        
// //         if (sortedYears.length > 0 && !sortedYears.includes(selectedYear)) {
// //           setSelectedYear(sortedYears[0]);
// //         }
        
// //       } catch (error) {
// //         console.error("Failed to fetch orders:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchOrders();
// //   }, []);

// //   // Update chart data when year, data type, or orders change
// //   useEffect(() => {
// //     if (orders.length === 0) return;

// //     const monthlyData: number[] = Array(12).fill(0);

// //     orders.forEach((order: Order) => {
// //       const orderDate = new Date(order.createdAt);
// //       const orderYear = orderDate.getFullYear();
// //       const orderMonth = orderDate.getMonth(); // 0-11

// //       if (orderYear === selectedYear) {
// //         if (dataType === "revenue") {
// //           const amount = parseFloat(order.totalAmount || "0");
// //           monthlyData[orderMonth] += amount;
// //         } else {
// //           // Count as a sale
// //           monthlyData[orderMonth] += 1;
// //         }
// //       }
// //     });

// //     setSeries([
// //       {
// //         name: dataType === "revenue" ? "Revenue" : "Sales",
// //         data: monthlyData,
// //       },
// //     ]);
// //   }, [orders, selectedYear, dataType]);

// //   const options: ApexOptions = {
// //     colors: ["#465fff"],
// //     chart: {
// //       fontFamily: "Outfit, sans-serif",
// //       type: "bar",
// //       height: 220,
// //       toolbar: {
// //         show: false,
// //       },
// //       animations: {
// //         enabled: true,
// //         // easing: 'easeinout',
// //         speed: 800,
// //       }
// //     },
// //     plotOptions: {
// //       bar: {
// //         horizontal: false,
// //         columnWidth: "35%",
// //         borderRadius: 5,
// //         borderRadiusApplication: "end",
// //       },
// //     },
// //     dataLabels: {
// //       enabled: false,
// //     },
// //     stroke: {
// //       show: true,
// //       width: 2,
// //       colors: ["transparent"],
// //     },
// //     xaxis: {
// //       categories: MONTHS,
// //       axisBorder: {
// //         show: false,
// //       },
// //       axisTicks: {
// //         show: false,
// //       },
// //       labels: {
// //         style: {
// //           colors: "#6B7280",
// //           fontSize: "12px",
// //           fontFamily: "Outfit, sans-serif",
// //         }
// //       }
// //     },
// //     yaxis: {
// //       title: {
// //         text: undefined,
// //       },
// //       labels: {
// //         style: {
// //           colors: "#6B7280",
// //           fontSize: "12px",
// //           fontFamily: "Outfit, sans-serif",
// //         },
// //         formatter: function(val: number) {
// //           if (dataType === "revenue") {
// //             return val >= 1000 ? `₹${(val/1000).toFixed(1)}k` : `₹${val}`;
// //           }
// //           return val.toFixed(0);
// //         }
// //       },
// //     },
// //     grid: {
// //       borderColor: "#F3F4F6",
// //       strokeDashArray: 5,
// //       yaxis: {
// //         lines: {
// //           show: true,
// //         },
// //       },
// //       xaxis: {
// //         lines: {
// //           show: false,
// //         },
// //       },
// //     },
// //     fill: {
// //       opacity: 1,
// //     },
// //     tooltip: {
// //       x: {
// //         show: false,
// //       },
// //       y: {
// //         formatter: (val: number) => {
// //           if (dataType === "revenue") {
// //             return `₹${val.toLocaleString()}`;
// //           }
// //           return `${val} sales`;
// //         },
// //       },
// //       style: {
// //         fontFamily: "Outfit, sans-serif",
// //       }
// //     },
// //   };

// //   if (loading) {
// //     return (
// //       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
// //             Monthly Sales
// //           </h3>
// //           <div className="h-9 bg-gray-100 rounded-md w-40 animate-pulse"></div>
// //         </div>
// //         <div className="h-56 flex items-center justify-center">
// //           <div className="text-center">
// //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
// //             <p className="mt-2 text-sm text-gray-500">Loading data...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
// //         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
// //           Monthly {dataType === "revenue" ? "Revenue" : "Sales"}
// //         </h3>

// //         <div className="flex gap-3">
// //           {/* Year Selector */}
// //           <div className="relative">
// //             <select 
// //               value={selectedYear}
// //               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
// //               className="py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
// //             >
// //               {availableYears.map(year => (
// //                 <option key={year} value={year}>{year}</option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Data Type Selector */}
// //           <div className="relative inline-flex rounded-md shadow-sm" role="group">
// //             <button
// //               type="button"
// //               onClick={() => setDataType("sales")}
// //               className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${
// //                 dataType === "sales" 
// //                   ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700" 
// //                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
// //               }`}
// //             >
// //               Sales
// //             </button>
// //             <button
// //               type="button"
// //               onClick={() => setDataType("revenue")}
// //               className={`px-3 py-2 text-sm font-medium rounded-r-lg border ${
// //                 dataType === "revenue" 
// //                   ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700" 
// //                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
// //               }`}
// //             >
// //               Revenue
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-full overflow-x-auto custom-scrollbar">
// //         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
// //           <ReactApexChart
// //             options={options}
// //             series={series}
// //             type="bar"
// //             height={220}
// //           />
// //         </div>
// //       </div>
      
// //       <div className="flex justify-between items-center mt-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
// //         <span>Showing data for {selectedYear}</span>
// //         <span>{dataType === "revenue" ? "Revenue in ₹" : "Number of sales"}</span>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import { BarChart3, TrendingUp } from "lucide-react";
// import { getAllOrders } from "../../../services/orders/ResentOrder"; // Update path as needed

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const MONTHS = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];

// interface Order {
//   id: string;
//   totalAmount: string;
//   createdAt: string;
//   // Add other properties as needed
// }

// export default function MonthlySalesChart() {
//   const [series, setSeries] = useState([
//     {
//       name: "Sales",
//       data: Array(12).fill(0),
//     },
//   ]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [dataType, setDataType] = useState<"sales" | "revenue">("revenue");
//   const [availableYears, setAvailableYears] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch orders and prepare chart data
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         setLoading(true);
//         const ordersData = await getAllOrders();
//         setOrders(ordersData);

//         // Extract available years from orders
//         const years = new Set<number>();
//         ordersData.forEach((order: Order) => {
//           const year = new Date(order.createdAt).getFullYear();
//           years.add(year);
//         });

//         const sortedYears = Array.from(years).sort((a, b) => b - a);
//         setAvailableYears(sortedYears);

//         if (sortedYears.length > 0 && !sortedYears.includes(selectedYear)) {
//           setSelectedYear(sortedYears[0]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   // Update chart data when year, data type, or orders change
//   useEffect(() => {
//     if (orders.length === 0) return;

//     const monthlyData: number[] = Array(12).fill(0);

//     orders.forEach((order: Order) => {
//       const orderDate = new Date(order.createdAt);
//       const orderYear = orderDate.getFullYear();
//       const orderMonth = orderDate.getMonth(); // 0-11

//       if (orderYear === selectedYear) {
//         if (dataType === "revenue") {
//           const amount = parseFloat(order.totalAmount || "0");
//           monthlyData[orderMonth] += amount;
//         } else {
//           // Count as a sale
//           monthlyData[orderMonth] += 1;
//         }
//       }
//     });

//     setSeries([
//       {
//         name: dataType === "revenue" ? "Revenue" : "Sales",
//         data: monthlyData,
//       },
//     ]);
//   }, [orders, selectedYear, dataType]);

//   const totalForYear = series[0].data.reduce((a, b) => a + b, 0);
//   const hasDataForYear = totalForYear > 0;

//   const options: ApexOptions = {
//     colors: ["#465fff"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 220,
//       toolbar: {
//         show: false,
//       },
//       animations: {
//         enabled: true,
//         speed: 800,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "35%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ["transparent"],
//     },
//     xaxis: {
//       categories: MONTHS,
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//       labels: {
//         style: {
//           colors: "#6B7280",
//           fontSize: "12px",
//           fontFamily: "Outfit, sans-serif",
//         },
//       },
//     },
//     yaxis: {
//       title: {
//         text: undefined,
//       },
//       labels: {
//         style: {
//           colors: "#6B7280",
//           fontSize: "12px",
//           fontFamily: "Outfit, sans-serif",
//         },
//         formatter: function (val: number) {
//           if (dataType === "revenue") {
//             return val >= 1000 ? `₹${(val / 1000).toFixed(1)}k` : `₹${val}`;
//           }
//           return val.toFixed(0);
//         },
//       },
//     },
//     grid: {
//       borderColor: "#F3F4F6",
//       strokeDashArray: 5,
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//     tooltip: {
//       x: {
//         show: false,
//       },
//       y: {
//         formatter: (val: number) => {
//           if (dataType === "revenue") {
//             return `₹${val.toLocaleString()}`;
//           }
//           return `${val} sales`;
//         },
//       },
//       style: {
//         fontFamily: "Outfit, sans-serif",
//       },
//     },
//   };

//   // =========================
//   // Loading State
//   // =========================
//   if (loading) {
//     return (
//       <div className="w-full min-w-0 rounded-[10px] border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
//         <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="h-5 w-36 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
//           <div className="flex gap-3">
//             <div className="h-9 w-24 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
//             <div className="h-9 w-40 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
//           </div>
//         </div>
//         <div className="flex h-56 items-end gap-3 px-2 pb-4">
//           {Array.from({ length: 12 }).map((_, i) => (
//             <div
//               key={i}
//               className="flex-1 animate-pulse rounded-t-[6px] bg-gray-100 dark:bg-gray-800"
//               style={{ height: `${30 + ((i * 13) % 60)}%` }}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // =========================
//   // Chart
//   // =========================
//   return (
//     <div className="w-full min-w-0 rounded-[10px] border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
//       {/* Header */}
//       <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//             <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
//           </div>
//           <div>
//             <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
//               Monthly {dataType === "revenue" ? "Revenue" : "Sales"}
//             </h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {selectedYear} overview
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           {/* Year Selector */}
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="h-9 rounded-[10px] border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
//           >
//             {availableYears.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>

//           {/* Data Type Toggle */}
//           <div className="inline-flex rounded-[10px] border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
//             <button
//               type="button"
//               onClick={() => setDataType("sales")}
//               className={`rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors ${
//                 dataType === "sales"
//                   ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
//                   : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               }`}
//             >
//               Sales
//             </button>
//             <button
//               type="button"
//               onClick={() => setDataType("revenue")}
//               className={`rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors ${
//                 dataType === "revenue"
//                   ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
//                   : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               }`}
//             >
//               Revenue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Chart / Empty State */}
//       {hasDataForYear ? (
//         <div className="max-w-full overflow-x-auto custom-scrollbar">
//           <div className="-ml-5 min-w-[650px] pl-2 xl:min-w-full">
//             <ReactApexChart
//               options={options}
//               series={series}
//               type="bar"
//               height={220}
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
//           <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
//             <TrendingUp className="h-5 w-5 text-gray-400" />
//           </div>
//           <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//             No {dataType === "revenue" ? "revenue" : "sales"} data for {selectedYear}
//           </p>
//           <p className="text-xs text-gray-400 dark:text-gray-500">
//             Try selecting a different year
//           </p>
//         </div>
//       )}

//       <div className="mt-4 flex items-center justify-between border-t border-gray-100 pb-4 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
//         <span>Showing data for {selectedYear}</span>
//         <span>{dataType === "revenue" ? "Revenue in ₹" : "Number of sales"}</span>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { getAllOrders } from "../../../services/orders/ResentOrder";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const FULL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Order {
  id: string;
  totalAmount: string;
  createdAt: string;
}

type DataType = "sales" | "revenue";

export default function MonthlySalesChart() {
  const currentYear = new Date().getFullYear();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // 0 = All Months
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const [dataType, setDataType] = useState<DataType>("revenue");

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);

        const ordersData = await getAllOrders();

        console.log("Orders:", ordersData);

        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // =========================================================
  // AVAILABLE YEARS
  // =========================================================

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    });

    // Current year bhi option mein rahe
    years.add(currentYear);

    return Array.from(years).sort((a, b) => b - a);
  }, [orders, currentYear]);

  // =========================================================
  // SELECTED YEAR VALIDATION
  // =========================================================

  useEffect(() => {
    if (
      availableYears.length > 0 &&
      !availableYears.includes(selectedYear)
    ) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // =========================================================
  // MONTH AVAILABILITY FOR SELECTED YEAR
  // =========================================================

  const availableMonths = useMemo(() => {
    const months = new Set<number>();

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (
        !isNaN(date.getTime()) &&
        date.getFullYear() === selectedYear
      ) {
        months.add(date.getMonth() + 1);
      }
    });

    return Array.from(months).sort((a, b) => a - b);
  }, [orders, selectedYear]);

  // =========================================================
  // RESET MONTH WHEN YEAR CHANGES
  // =========================================================

  useEffect(() => {
    if (
      selectedMonth !== 0 &&
      !availableMonths.includes(selectedMonth)
    ) {
      setSelectedMonth(0);
    }
  }, [selectedYear, availableMonths, selectedMonth]);

  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order.createdAt) return false;

      const date = new Date(order.createdAt);

      if (isNaN(date.getTime())) return false;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (year !== selectedYear) {
        return false;
      }

      // 0 means all months
      if (selectedMonth !== 0 && month !== selectedMonth) {
        return false;
      }

      return true;
    });
  }, [orders, selectedYear, selectedMonth]);

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = useMemo(() => {
    // If a specific month is selected
    // show only that month's value
    if (selectedMonth !== 0) {
      if (dataType === "revenue") {
        return [
          filteredOrders.reduce((sum, order) => {
            return sum + Number(order.totalAmount || 0);
          }, 0),
        ];
      }

      return [filteredOrders.length];
    }

    // All months selected
    const monthlyData = Array(12).fill(0);

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);

      if (isNaN(date.getTime())) return;

      const monthIndex = date.getMonth();

      if (dataType === "revenue") {
        monthlyData[monthIndex] += Number(order.totalAmount || 0);
      } else {
        monthlyData[monthIndex] += 1;
      }
    });

    return monthlyData;
  }, [filteredOrders, selectedMonth, dataType]);

  // =========================================================
  // CHART CATEGORIES
  // =========================================================

  const chartCategories = useMemo(() => {
    if (selectedMonth !== 0) {
      return [FULL_MONTHS[selectedMonth - 1]];
    }

    return MONTHS;
  }, [selectedMonth]);

  // =========================================================
  // TOTAL
  // =========================================================

  const totalValue = useMemo(() => {
    return chartData.reduce((sum, value) => sum + value, 0);
  }, [chartData]);

  const hasData = totalValue > 0;

  // =========================================================
  // CHART OPTIONS
  // =========================================================

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 320,
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },

    colors: ["#465FFF"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: selectedMonth === 0 ? "45%" : "35%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },

    xaxis: {
      categories: chartCategories,

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
        },

        formatter: (value: number) => {
          if (dataType === "revenue") {
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            }

            if (value >= 1000) {
              return `₹${(value / 1000).toFixed(1)}K`;
            }

            return `₹${Math.round(value)}`;
          }

          return Math.round(value).toString();
        },
      },
    },

    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 5,

      xaxis: {
        lines: {
          show: false,
        },
      },

      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: true,
      },

      y: {
        formatter: (value: number) => {
          if (dataType === "revenue") {
            return `₹${value.toLocaleString("en-IN")}`;
          }

          return `${value} sales`;
        },
      },

      style: {
        fontFamily: "Outfit, sans-serif",
      },
    },
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="w-full min-w-0 rounded-[10px] border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />

            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />

              <div className="h-3 w-28 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="h-9 w-28 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />

            <div className="h-9 w-32 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />

            <div className="h-9 w-40 animate-pulse rounded-[10px] bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>

        <div className="flex h-72 items-end gap-4 px-2 pb-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 animate-pulse rounded-t-[6px] bg-gray-100 dark:bg-gray-800"
              style={{
                height: `${30 + ((i * 13) % 60)}%`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="w-full min-w-0 rounded-[10px] border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* TITLE */}

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
            <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
              {dataType === "revenue"
                ? "Revenue Overview"
                : "Sales Overview"}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedMonth === 0
                ? `${selectedYear} monthly overview`
                : `${FULL_MONTHS[selectedMonth - 1]} ${selectedYear} overview`}
            </p>
          </div>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap items-center gap-3">
          {/* YEAR */}

          <div className="flex items-center gap-2">
            <label className="hidden text-xs font-medium text-gray-500 sm:block dark:text-gray-400">
              Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(Number(e.target.value));
                setSelectedMonth(0);
              }}
              className="
                h-10
                min-w-[110px]
                rounded-[10px]
                border
                border-gray-200
                bg-white
                px-3
                text-sm
                font-medium
                text-gray-700
                outline-none
                transition
                hover:border-gray-300
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-200
              "
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* MONTH */}

          <div className="flex items-center gap-2">
            <label className="hidden text-xs font-medium text-gray-500 sm:block dark:text-gray-400">
              Month
            </label>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="
                h-10
                min-w-[140px]
                rounded-[10px]
                border
                border-gray-200
                bg-white
                px-3
                text-sm
                font-medium
                text-gray-700
                outline-none
                transition
                hover:border-gray-300
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-200
              "
            >
              <option value={0}>All Months</option>

              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {FULL_MONTHS[month - 1]}
                </option>
              ))}
            </select>
          </div>

          {/* SALES / REVENUE */}

          <div className="inline-flex rounded-[10px] border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setDataType("sales")}
              className={`
                rounded-[8px]
                px-3
                py-1.5
                text-sm
                font-medium
                transition-colors
                ${
                  dataType === "sales"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }
              `}
            >
              Sales
            </button>

            <button
              type="button"
              onClick={() => setDataType("revenue")}
              className={`
                rounded-[8px]
                px-3
                py-1.5
                text-sm
                font-medium
                transition-colors
                ${
                  dataType === "revenue"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }
              `}
            >
              Revenue
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* TOTAL */}

        <div className="rounded-[10px] border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {dataType === "revenue" ? "Total Revenue" : "Total Sales"}
          </p>

          <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
            {dataType === "revenue"
              ? `₹${totalValue.toLocaleString("en-IN")}`
              : totalValue.toLocaleString("en-IN")}
          </p>
        </div>

        {/* ORDERS */}

        <div className="rounded-[10px] border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Orders
          </p>

          <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
            {filteredOrders.length.toLocaleString("en-IN")}
          </p>
        </div>

        {/* PERIOD */}

        <div className="rounded-[10px] border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Selected Period
          </p>

          <p className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
            {selectedMonth === 0
              ? selectedYear
              : `${FULL_MONTHS[selectedMonth - 1]} ${selectedYear}`}
          </p>
        </div>
      </div>

      {/* =====================================================
          CHART
      ====================================================== */}

      {hasData ? (
        <div className="w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[650px] xl:min-w-full">
            <ReactApexChart
              options={options}
              series={[
                {
                  name: dataType === "revenue" ? "Revenue" : "Sales",
                  data: chartData,
                },
              ]}
              type="bar"
              height={320}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-72 flex-col items-center justify-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-800">
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            No{" "}
            {dataType === "revenue"
              ? "revenue"
              : "sales"}{" "}
            data available
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            Try selecting a different year or month
          </p>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pb-4 pt-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:text-gray-400">
        <span>
          Showing data for{" "}
          {selectedMonth === 0
            ? selectedYear
            : `${FULL_MONTHS[selectedMonth - 1]} ${selectedYear}`}
        </span>

        <span>
          {dataType === "revenue"
            ? "Revenue in ₹"
            : "Number of sales"}
        </span>
      </div>
    </div>
  );
}