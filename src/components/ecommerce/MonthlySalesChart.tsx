// "use client";
// import { ApexOptions } from "apexcharts";
// import dynamic from "next/dynamic";
// // import { MoreDotIcon } from "@/icons";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";

// // Dynamically import the ReactApexChart component
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// export default function MonthlySalesChart() {
//   const options: ApexOptions = {
//     colors: ["#465fff"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 180,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "39%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
//       colors: ["transparent"],
//     },
//     xaxis: {
//       categories: [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//     },
//     yaxis: {
//       title: {
//         text: undefined,
//       },
//     },
//     grid: {
//       yaxis: {
//         lines: {
//           show: true,
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
//         formatter: (val: number) => `${val}`,
//       },
//     },
//   };
//   const series = [
//     {
//       name: "Sales",
//       data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
//       // data: [0,0,0,0,0,0,0,0,0,0,0,0],
//     },
//   ];
//   const [isOpen, setIsOpen] = useState(false);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Sales
//         </h3>

//         <div className="relative inline-block">
//           <button onClick={toggleDropdown} className="dropdown-toggle">
//             {/* <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" /> */}
//           </button>
//           <Dropdown
//             isOpen={isOpen}
//             onClose={closeDropdown}
//             className="w-40 p-2"
//           >
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               View More
//             </DropdownItem>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               Delete
//             </DropdownItem>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={180}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import { getAllOrders } from "../../services/orders/ResentOrder"; // Update path as needed
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const MONTHS = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];

// export default function MonthlySalesChart() {
//   const [series, setSeries] = useState([
//     {
//       name: "Sales",
//       data: Array(12).fill(0), // initially empty
//     },
//   ]);
//   const [isOpen, setIsOpen] = useState(false);

//   // Fetch orders and prepare chart data
//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const orders = await getAllOrders();

//         // Create a map for monthly totals
//         const monthlySales: number[] = Array(12).fill(0);

//         orders.forEach((order: any) => {
//           const monthIndex = new Date(order.createdAt).getMonth(); // 0-11
//           const total = parseFloat(order.totalAmount || "0");
//           monthlySales[monthIndex] += total;
//         });

//         setSeries([
//           {
//             name: "Sales",
//             data: monthlySales,
//           },
//         ]);
//       } catch (error) {
//         console.error("Failed to fetch orders:", error);
//       }
//     }

//     fetchOrders();
//   }, []);

//   const options: ApexOptions = {
//     colors: ["#465fff"],
//     chart: {
//       fontFamily: "Outfit, sans-serif",
//       type: "bar",
//       height: 180,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "39%",
//         borderRadius: 5,
//         borderRadiusApplication: "end",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
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
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Outfit",
//     },
//     yaxis: {
//       title: {
//         text: undefined,
//       },
//     },
//     grid: {
//       yaxis: {
//         lines: {
//           show: true,
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
//         formatter: (val: number) => `${val}`,
//       },
//     },
//   };

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly Sales
//         </h3>

//         <div className="relative inline-block">
//           <button onClick={toggleDropdown} className="dropdown-toggle">
//             {/* Optional icon can go here */}
//           </button>
//           <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
//             <DropdownItem onItemClick={closeDropdown}>View More</DropdownItem>
//             <DropdownItem onItemClick={closeDropdown}>Delete</DropdownItem>
//           </Dropdown>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={180}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }






// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import { getAllOrders } from "../../services/orders/ResentOrder"; // Update path as needed

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
//         // easing: 'easeinout',
//         speed: 800,
//       }
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
//         }
//       }
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
//         formatter: function(val: number) {
//           if (dataType === "revenue") {
//             return val >= 1000 ? `₹${(val/1000).toFixed(1)}k` : `₹${val}`;
//           }
//           return val.toFixed(0);
//         }
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
//       }
//     },
//   };

//   if (loading) {
//     return (
//       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Monthly Sales
//           </h3>
//           <div className="h-9 bg-gray-100 rounded-md w-40 animate-pulse"></div>
//         </div>
//         <div className="h-56 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//             <p className="mt-2 text-sm text-gray-500">Loading data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-gray-900 sm:px-6 sm:pt-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//           Monthly {dataType === "revenue" ? "Revenue" : "Sales"}
//         </h3>

//         <div className="flex gap-3">
//           {/* Year Selector */}
//           <div className="relative">
//             <select 
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               className="py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
//             >
//               {availableYears.map(year => (
//                 <option key={year} value={year}>{year}</option>
//               ))}
//             </select>
//           </div>

//           {/* Data Type Selector */}
//           <div className="relative inline-flex rounded-md shadow-sm" role="group">
//             <button
//               type="button"
//               onClick={() => setDataType("sales")}
//               className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${
//                 dataType === "sales" 
//                   ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700" 
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
//               }`}
//             >
//               Sales
//             </button>
//             <button
//               type="button"
//               onClick={() => setDataType("revenue")}
//               className={`px-3 py-2 text-sm font-medium rounded-r-lg border ${
//                 dataType === "revenue" 
//                   ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700" 
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
//               }`}
//             >
//               Revenue
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-full overflow-x-auto custom-scrollbar">
//         <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={220}
//           />
//         </div>
//       </div>
      
//       <div className="flex justify-between items-center mt-4 pb-2 text-xs text-gray-500 dark:text-gray-400">
//         <span>Showing data for {selectedYear}</span>
//         <span>{dataType === "revenue" ? "Revenue in ₹" : "Number of sales"}</span>
//       </div>
//     </div>
//   );
// }