import React from "react";
import {
  FaFilter,
  FaSyncAlt,
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from "react-icons/fa";

interface Props {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: string[];
  resetFilters: () => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
}

const ProductFilters: React.FC<Props> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  resetFilters,
  stockFilter,
  setStockFilter,
  totalProducts,
  activeProducts,
  inactiveProducts,
  lowStockProducts,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top Tabs */}
        <div className="flex flex-wrap gap-1 p-4 border-b border-gray-200">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${statusFilter === "all"
                ? "bg-blue-500 text-white shadow-md border-b-4 border-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => {
              setStatusFilter("all");
              setStockFilter("all");
            }}
          >
            <FaBox className="text-sm" />
            All ({totalProducts})
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${statusFilter === "active"
                ? "bg-green-500 text-white shadow-md border-b-4 border-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => { setStatusFilter("active"); setStockFilter("all"); }}
          >
            <FaCheckCircle className="text-sm" />
            Active ({activeProducts})
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${statusFilter === "inactive"
                ? "bg-red-500 text-white shadow-md border-b-4 border-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => { setStatusFilter("inactive"); setStockFilter("allInactive"); }}
          >
            <FaTimesCircle className="text-sm" />
            Inactive ({inactiveProducts})
          </button>
        </div>

        {/* Stock Filter Buttons */}
        <div className="p-4 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {statusFilter === "active" && (
              <>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${stockFilter === "all"
                      ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                    }`}
                  onClick={() => setStockFilter("all")}
                >
                  <FaBox className="text-sm" />
                  All Stock ({totalProducts})
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${stockFilter === "lowStock"
                      ? "bg-yellow-500 text-white shadow-sm border-2 border-yellow-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-yellow-50"
                    }`}
                  onClick={() => setStockFilter("lowStock")}
                >
                  <FaExclamationTriangle className="text-sm" />
                  Low Stock ({lowStockProducts})
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${stockFilter === "outOfStock"
                      ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                    }`}
                  onClick={() => setStockFilter("outOfStock")}
                >
                  <FaTimesCircle className="text-sm" />
                  Out Of Stock
                </button>
              </>
            )}

            {statusFilter === "inactive" && (
              <>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${stockFilter === "allInactive"
                      ? "bg-blue-500 text-white shadow-sm border-2 border-blue-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                    }`}
                  onClick={() => setStockFilter("allInactive")}
                >
                  <FaBox className="text-sm" />
                  All Inactive ({inactiveProducts})
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${stockFilter === "shouldBeOut"
                      ? "bg-red-500 text-white shadow-sm border-2 border-red-700"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50"
                    }`}
                  onClick={() => setStockFilter("shouldBeOut")}
                >
                  <FaTimesCircle className="text-sm" />
                  Should be Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            Filter Products
          </h3>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <FaSyncAlt className="text-gray-500" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
