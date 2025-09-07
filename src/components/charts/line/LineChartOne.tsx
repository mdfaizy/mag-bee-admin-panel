"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getAllOrders } from "../../../services/orders/ResentOrder";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Define the Order type based on your API response
interface Order {
  id: string;
  orderCode: string;
  createdAt: string;
  totalAmount: string;
  status: string;
  paymentStatus: string;
}

export default function DynamicLineChart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"year" | "month" | "week" | "day">("year");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeMetric, setActiveMetric] = useState<"sales" | "revenue" | "both">("both");
  
  // Process order data based on selected time range
  const processData = () => {
    if (orders.length === 0) return { categories: [], salesData: [], revenueData: [] };

    let categories: string[] = [];
    let salesData: number[] = [];
    let revenueData: number[] = [];

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      if (timeRange === "year") {
        return orderDate.getFullYear() === selectedDate.getFullYear();
      } else if (timeRange === "month") {
        return orderDate.getFullYear() === selectedDate.getFullYear() && 
               orderDate.getMonth() === selectedDate.getMonth();
      } else if (timeRange === "week") {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return orderDate >= weekStart && orderDate <= weekEnd;
      } else { // day
        return orderDate.toDateString() === selectedDate.toDateString();
      }
    });

    if (timeRange === "year") {
      // Group by month
      categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      salesData = Array(12).fill(0);
      revenueData = Array(12).fill(0);
      
      filteredOrders.forEach(order => {
        const month = new Date(order.createdAt).getMonth();
        if (order.paymentStatus === 'paid') {
          salesData[month] += 1;
          revenueData[month] += parseFloat(order.totalAmount || "0");
        }
      });
    } else if (timeRange === "month") {
      // Group by day
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
      categories = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      salesData = Array(daysInMonth).fill(0);
      revenueData = Array(daysInMonth).fill(0);
      
      filteredOrders.forEach(order => {
        const day = new Date(order.createdAt).getDate() - 1;
        if (order.paymentStatus === 'paid') {
          salesData[day] += 1;
          revenueData[day] += parseFloat(order.totalAmount || "0");
        }
      });
    } else if (timeRange === "week") {
      // Group by day of week
      categories = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      salesData = Array(7).fill(0);
      revenueData = Array(7).fill(0);
      
      filteredOrders.forEach(order => {
        const dayOfWeek = new Date(order.createdAt).getDay();
        if (order.paymentStatus === 'paid') {
          salesData[dayOfWeek] += 1;
          revenueData[dayOfWeek] += parseFloat(order.totalAmount || "0");
        }
      });
    } else { // day
      // Group by hour
      categories = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const period = i < 12 ? "AM" : "PM";
        return `${hour}${period}`;
      });
      salesData = Array(24).fill(0);
      revenueData = Array(24).fill(0);
      
      filteredOrders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        if (order.paymentStatus === 'paid') {
          salesData[hour] += 1;
          revenueData[hour] += parseFloat(order.totalAmount || "0");
        }
      });
    }

    return { categories, salesData, revenueData };
  };

  const chartData = processData();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Prepare series based on active metric
  const getSeries = () => {
    if (activeMetric === "sales") {
      return [
        {
          name: "Sales",
          data: chartData.salesData,
        }
      ];
    } else if (activeMetric === "revenue") {
      return [
        {
          name: "Revenue",
          data: chartData.revenueData,
        }
      ];
    } else {
      return [
        {
          name: "Sales",
          data: chartData.salesData,
        },
        {
          name: "Revenue",
          data: chartData.revenueData,
        }
      ];
    }
  };

  const options: ApexOptions = {
    legend: {
      show: activeMetric === "both",
      position: "top",
      horizontalAlign: "right",
      markers: {
        // radius: 12,
           size: 12,           // marker size
    strokeWidth: 0,     // border thickness
    shape: "circle",    
      },
      fontFamily: "Outfit, sans-serif",
      fontSize: "12px",
      fontWeight: 500,
    },
    colors: activeMetric === "sales" ? ["#465FFF"] : activeMetric === "revenue" ? ["#10B981"] : ["#465FFF", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        // easing: 'easeinout',
        speed: 800,
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 10,
        left: 0,
        blur: 5,
        opacity: 0.1
      }
    },
    stroke: {
      curve: "smooth",
      width: activeMetric === "both" ? [2, 3] : [3],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: activeMetric === "sales" ? ['#465FFF'] : activeMetric === "revenue" ? ['#10B981'] : ['#465FFF', '#10B981'],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: '#F1F5F9',
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
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      theme: 'dark',
      x: {
        formatter: function(value) {
          if (timeRange === "year") return MONTHS[Number(value)];
          if (timeRange === "day") return `${value} ${Number(value) < 12 ? 'AM' : 'PM'}`;
          // return value;
           return value.toString();
        }
      },
      y: {
        formatter: function(value, { seriesIndex }) {
          return seriesIndex === 0 || activeMetric === "sales" ? 
            `${value} sales` : 
            `₹${value.toLocaleString('en-IN')}`;
        }
      },
      marker: {
        show: true,
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif'
      }
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
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "11px",
          fontFamily: "Outfit, sans-serif",
          fontWeight: 500,
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: ["#64748B"],
          fontFamily: "Outfit, sans-serif",
          fontWeight: 500,
        },
        formatter: function(val) {
          if (activeMetric === "revenue" && val >= 1000) {
            return `₹${(val/1000).toFixed(0)}k`;
          }
          return activeMetric === "revenue" ? `₹${val}` : `${val}`;
        }
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = getSeries();

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Navigation functions
  const navigateTime = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    
    if (timeRange === "year") {
      newDate.setFullYear(selectedDate.getFullYear() + (direction === "next" ? 1 : -1));
    } else if (timeRange === "month") {
      newDate.setMonth(selectedDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (timeRange === "week") {
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    } else { // day
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };

  // Format date based on time range
  const formatDateRange = () => {
    if (timeRange === "year") {
      return selectedDate.getFullYear().toString();
    } else if (timeRange === "month") {
      return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    } else if (timeRange === "week") {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} - ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`;
    } else { // day
      return `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }
  };

  // Get available years from orders data
  const availableYears = Array.from(
    new Set(orders.map(order => new Date(order.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  // Calculate summary statistics
  const totalSales = chartData.salesData.reduce((a, b) => a + b, 0);
  const totalRevenue = chartData.revenueData.reduce((a, b) => a + b, 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sales Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Tracking your business performance</p>
          </div>
          <div className="h-10 bg-gray-100 rounded-lg w-48 animate-pulse"></div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sales Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Tracking your business performance</p>
          </div>
        </div>
        <div className="h-80 flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load data</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sales Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Tracking your business performance</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Metric selector */}
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setActiveMetric("sales")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeMetric === "sales" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveMetric("revenue")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeMetric === "revenue" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveMetric("both")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeMetric === "both" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Both
              </button>
            </div>
            
            {/* Time range selector */}
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            
            {/* Year selector (only show when viewing yearly data) */}
            {timeRange === "year" && availableYears.length > 0 && (
              <select 
                value={selectedDate.getFullYear()}
                onChange={(e) => setSelectedDate(new Date(parseInt(e.target.value), 0, 1))}
                className="py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-xl font-semibold text-gray-900">{totalSales}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-xl font-semibold text-gray-900">₹{avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{formatDateRange()}</h3>
          
          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateTime("prev")}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Previous period"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => navigateTime("next")}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Next period"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px]">
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-sm text-gray-500">
          <span>Showing {timeRange}ly data • Updated just now</span>
          <span>{totalSales} orders • ₹{totalRevenue.toLocaleString('en-IN')} revenue</span>
        </div>
      </div>
    </div>
  );
}