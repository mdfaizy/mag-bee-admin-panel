"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { getAllOrders } from "../../../services/orders/ResentOrder";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface Order {
  id: string;
  orderCode?: string;
  createdAt: string;
  totalAmount: string | number;
  status?: string;
  paymentStatus?: string;
}

type MetricType = "sales" | "revenue" | "both";

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

export default function DynamicLineChart() {
  // =========================================================
  // STATE
  // =========================================================

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");

  const [activeMetric, setActiveMetric] =
    useState<MetricType>("both");

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const ordersData = await getAllOrders();

      console.log("Sales Analytics Orders:", ordersData);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);

      setError(
        "Failed to load order data. Please try again later."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================
  // AVAILABLE YEARS
  // =========================================================
  //
  // Current year + previous 5 years.
  // Isliye agar kisi previous year mein order nahi bhi hua,
  // tab bhi year dropdown mein year available rahega.
  //
  // Example:
  // 2026
  // 2025
  // 2024
  // 2023
  // 2022
  // 2021
  // =========================================================

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    // Current year + previous 5 years
    for (let i = 0; i <= 5; i++) {
      years.add(currentYear - i);
    }

    // Orders ke years bhi add karo
    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      if (!Number.isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [orders, currentYear]);

  // =========================================================
  // FIND LATEST YEAR WITH DATA
  // =========================================================

  useEffect(() => {
    if (orders.length === 0) return;

    const orderYears = orders
      .map((order) => {
        const date = new Date(order.createdAt);

        if (Number.isNaN(date.getTime())) {
          return null;
        }

        return date.getFullYear();
      })
      .filter((year): year is number => year !== null);

    if (orderYears.length === 0) return;

    const latestYear = Math.max(...orderYears);

    setSelectedYear(latestYear);
  }, [orders]);

  // =========================================================
  // FILTERED ORDERS
  // =========================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order.createdAt) return false;

      const orderDate = new Date(order.createdAt);

      if (Number.isNaN(orderDate.getTime())) {
        return false;
      }

      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();

      // Year filter
      if (orderYear !== selectedYear) {
        return false;
      }

      // Month filter
      if (
        selectedMonth !== "all" &&
        orderMonth !== selectedMonth
      ) {
        return false;
      }

      return true;
    });
  }, [orders, selectedYear, selectedMonth]);

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = useMemo(() => {
    let categories: string[] = [];
    let salesData: number[] = [];
    let revenueData: number[] = [];

    // =======================================================
    // ALL MONTHS
    // =======================================================

    if (selectedMonth === "all") {
      categories = MONTHS;

      salesData = Array(12).fill(0);
      revenueData = Array(12).fill(0);

      filteredOrders.forEach((order) => {
        const date = new Date(order.createdAt);

        if (Number.isNaN(date.getTime())) {
          return;
        }

        const monthIndex = date.getMonth();

        const amount = Number(order.totalAmount || 0);

        // IMPORTANT:
        // paymentStatus check intentionally removed.
        //
        // Har order ko Sales mein count kiya ja raha hai.
        // Har order ka totalAmount Revenue mein add kiya ja raha hai.

        salesData[monthIndex] += 1;

        if (!Number.isNaN(amount)) {
          revenueData[monthIndex] += amount;
        }
      });
    }

    // =======================================================
    // SPECIFIC MONTH
    // =======================================================

    else {
      categories = [FULL_MONTHS[selectedMonth]];

      salesData = [filteredOrders.length];

      const revenue = filteredOrders.reduce((sum, order) => {
        const amount = Number(order.totalAmount || 0);

        if (Number.isNaN(amount)) {
          return sum;
        }

        return sum + amount;
      }, 0);

      revenueData = [revenue];
    }

    return {
      categories,
      salesData,
      revenueData,
    };
  }, [filteredOrders, selectedMonth]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalSales = useMemo(() => {
    return chartData.salesData.reduce(
      (sum, value) => sum + value,
      0
    );
  }, [chartData.salesData]);

  const totalRevenue = useMemo(() => {
    return chartData.revenueData.reduce(
      (sum, value) => sum + value,
      0
    );
  }, [chartData.revenueData]);

  const avgOrderValue =
    totalSales > 0 ? totalRevenue / totalSales : 0;

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  const formatAxisCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }

    return `₹${Math.round(value)}`;
  };

  // =========================================================
  // SERIES
  // =========================================================

  const series = useMemo(() => {
    if (activeMetric === "sales") {
      return [
        {
          name: "Sales",
          data: chartData.salesData,
        },
      ];
    }

    if (activeMetric === "revenue") {
      return [
        {
          name: "Revenue",
          data: chartData.revenueData,
        },
      ];
    }

    return [
      {
        name: "Sales",
        data: chartData.salesData,
      },
      {
        name: "Revenue",
        data: chartData.revenueData,
      },
    ];
  }, [activeMetric, chartData]);

  // =========================================================
  // CHART OPTIONS
  // =========================================================

  const options: ApexOptions = useMemo(() => {
    const isBoth = activeMetric === "both";

    const yAxis: ApexOptions["yaxis"] = isBoth
      ? [
          {
            seriesName: "Sales",
            min: 0,

            title: {
              text: "Sales",
              style: {
                color: "#465FFF",
                fontSize: "12px",
                fontWeight: 500,
              },
            },

            labels: {
              style: {
                colors: "#64748B",
                fontSize: "11px",
              },

              formatter: (value: number) => {
                return Math.round(value).toString();
              },
            },
          },

          {
            seriesName: "Revenue",
            opposite: true,
            min: 0,

            title: {
              text: "Revenue",
              style: {
                color: "#10B981",
                fontSize: "12px",
                fontWeight: 500,
              },
            },

            labels: {
              style: {
                colors: "#64748B",
                fontSize: "11px",
              },

              formatter: (value: number) => {
                return formatAxisCurrency(value);
              },
            },
          },
        ]
      : {
          min: 0,

          labels: {
            style: {
              colors: ["#64748B"],
              fontSize: "11px",
              fontFamily: "Outfit, sans-serif",
            },

            formatter: (value: number) => {
              if (activeMetric === "revenue") {
                return formatAxisCurrency(value);
              }

              return Math.round(value).toString();
            },
          },
        };

    return {
      chart: {
        type: "line",

        height: 350,

        fontFamily: "Outfit, sans-serif",

        toolbar: {
          show: false,
        },

        zoom: {
          enabled: false,
        },

        animations: {
          enabled: true,
          speed: 500,
        },
      },

      colors:
        activeMetric === "sales"
          ? ["#465FFF"]
          : activeMetric === "revenue"
          ? ["#10B981"]
          : ["#465FFF", "#10B981"],

      stroke: {
        curve: "smooth",

        width:
          activeMetric === "both"
            ? [3, 3]
            : [3],
      },

      fill: {
        type: "gradient",

        gradient: {
          shade: "light",

          type: "vertical",

          shadeIntensity: 0.2,

          inverseColors: false,

          opacityFrom: 0.35,

          opacityTo: 0.05,

          stops: [0, 100],
        },
      },

      markers: {
        size: 0,

        strokeWidth: 2,

        strokeColors: "#ffffff",

        hover: {
          size: 6,
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: activeMetric === "both",

        position: "top",

        horizontalAlign: "right",

        fontFamily: "Outfit, sans-serif",

        fontSize: "12px",

        fontWeight: 500,

        markers: {
          size: 10,
          shape: "circle",
        },
      },

      grid: {
        borderColor: "#E5E7EB",

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

        padding: {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10,
        },
      },

      xaxis: {
        type: "category",

        categories: chartData.categories,

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          style: {
            colors: "#64748B",

            fontSize: "11px",

            fontFamily: "Outfit, sans-serif",

            fontWeight: 500,
          },
        },
      },

      yaxis: yAxis,

      tooltip: {
        enabled: true,

        shared: isBoth,

        intersect: false,

        theme: "light",

       x: {
  formatter: (value: number) => {
    return String(value);
  },
},

        y: {
          formatter: (
            value: number,
            { seriesIndex }: { seriesIndex: number }
          ) => {
            if (activeMetric === "both") {
              if (seriesIndex === 0) {
                return `${Math.round(value)} sales`;
              }

              return formatCurrency(value);
            }

            if (activeMetric === "sales") {
              return `${Math.round(value)} sales`;
            }

            return formatCurrency(value);
          },
        },

        style: {
          fontSize: "12px",
          fontFamily: "Outfit, sans-serif",
        },
      },

      noData: {
        text: "No data available",

        align: "center",

        verticalAlign: "middle",

        style: {
          color: "#64748B",

          fontSize: "14px",

          fontFamily: "Outfit, sans-serif",
        },
      },
    };
  }, [activeMetric, chartData.categories]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigateYear = (direction: "prev" | "next") => {
    const currentIndex = availableYears.indexOf(selectedYear);

    if (currentIndex === -1) return;

    if (direction === "prev") {
      const nextIndex = currentIndex + 1;

      if (nextIndex < availableYears.length) {
        setSelectedYear(availableYears[nextIndex]);
      }
    } else {
      const nextIndex = currentIndex - 1;

      if (nextIndex >= 0) {
        setSelectedYear(availableYears[nextIndex]);
      }
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (selectedMonth === "all") {
      return;
    }

    let newMonth = selectedMonth;

    if (direction === "prev") {
      newMonth = selectedMonth - 1;

      if (newMonth < 0) {
        if (availableYears.includes(selectedYear - 1)) {
          setSelectedYear(selectedYear - 1);
          newMonth = 11;
        } else {
          newMonth = 0;
        }
      }
    } else {
      newMonth = selectedMonth + 1;

      if (newMonth > 11) {
        if (availableYears.includes(selectedYear + 1)) {
          setSelectedYear(selectedYear + 1);
          newMonth = 0;
        } else {
          newMonth = 11;
        }
      }
    }

    setSelectedMonth(newMonth);
  };

  // =========================================================
  // PERIOD TITLE
  // =========================================================

  const periodTitle =
    selectedMonth === "all"
      ? selectedYear.toString()
      : `${FULL_MONTHS[selectedMonth]} ${selectedYear}`;

  // =========================================================
  // LOADING UI
  // =========================================================

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-100 px-6 pb-5 pt-6 dark:border-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />

              <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="flex gap-3">
              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />

              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />

              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>

        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading sales data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR UI
  // =========================================================

  if (error) {
    return (
      <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
          <div className="mb-4 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unable to load data
          </h3>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-gray-100 px-6 pb-5 pt-6 dark:border-gray-800">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* TITLE */}

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sales Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tracking your business performance
            </p>
          </div>

          {/* CONTROLS */}

          <div className="flex flex-wrap items-center gap-3">
            {/* METRIC */}

            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setActiveMetric("sales")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  activeMetric === "sales"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Sales
              </button>

              <button
                type="button"
                onClick={() => setActiveMetric("revenue")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  activeMetric === "revenue"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Revenue
              </button>

              <button
                type="button"
                onClick={() => setActiveMetric("both")}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  activeMetric === "both"
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Both
              </button>
            </div>

            {/* YEAR */}

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value))
              }
              className="h-10 min-w-[120px] rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* MONTH */}

            <select
              value={selectedMonth}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "all") {
                  setSelectedMonth("all");
                } else {
                  setSelectedMonth(Number(value));
                }
              }}
              className="h-10 min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">
                All Months
              </option>

              {FULL_MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===================================================
            SUMMARY
        ==================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* TOTAL SALES */}

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Sales
                </p>

                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {totalSales.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL REVENUE */}

          <div className="rounded-lg border border-green-100 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>

                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          {/* AVG ORDER VALUE */}

          <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/10">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Order Value
                </p>

                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(avgOrderValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHART HEADER
      ====================================================== */}

      <div className="px-6 pb-2 pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {periodTitle}
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {selectedMonth === "all"
                ? "Monthly performance"
                : "Selected month performance"}
            </p>
          </div>

          {/* NAVIGATION */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedMonth === "all") {
                  navigateYear("prev");
                } else {
                  navigateMonth("prev");
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedMonth === "all") {
                  navigateYear("next");
                } else {
                  navigateMonth("next");
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHART
      ====================================================== */}

      <div className="px-6 pb-4 pt-2">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px] xl:min-w-full">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:text-gray-400">
          <span>
            Showing{" "}
            {selectedMonth === "all"
              ? `${selectedYear} monthly`
              : `${FULL_MONTHS[selectedMonth]} ${selectedYear}`}{" "}
            data
          </span>

          <span>
            {totalSales.toLocaleString("en-IN")} orders •{" "}
            {formatCurrency(totalRevenue)} revenue
          </span>
        </div>
      </div>
    </div>
  );
}