// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Table, TableHeader, TableBody, TableRow, TableCell
// } from "../ui/table";
// import Pagination from "./Pagination";
// import { fetchCustomer, toggleUserStatus } from "../../services/customerServices/CustomerServices";
// import { toast } from "react-toastify";
// import { FiEdit, FiEye, FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
// import { HiDotsVertical } from "react-icons/hi";
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   username: string;
//   phoneNumber: string;
//   // role_id: number;
//   is_active: boolean;
//   createdAt?: string;
 
// }

// export default function CustomerTables() {
//   const itemsPerPage = 5; 
//   const [currentPage, setCurrentPage] = useState(1); 
//   // const [tableData, setTableData] = useState<User[]>([]); 
//   const [tableData, setTableData] = useState<User[]>([]);

//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all"); 


//   const getData = async () => {
//   try {
//     setLoading(true);
//     const result = await fetchCustomer(); 
//     console.log("Fetched customers:", result);
//    setTableData(result); 
//   } catch (error) {
//     console.error("Failed to fetch customer data:", error);
//     toast.error("Failed to fetch customer data");
//   } finally {
//     setLoading(false);
//   }
// };
//   useEffect(() => {
//     getData();
//   }, []);

//   const handleToggle = async (id: number) => {
//     try {
//       // Call the API to toggle user status
//       const result = await toggleUserStatus(id);
      
//       // Update the local table data with the new status
//       const updatedData = tableData.map((user) =>
//         user.id === id ? { ...user, is_active: !user.is_active } : user
//       );
//       setTableData(updatedData);

//       toast.success(`User is now ${result.is_active ? "Active" : "Inactive"}`);
//     } catch (error) {
//       console.error("Error toggling user status:", error);
//       toast.error("Failed to toggle user status");
//     }
//   };

//   // Filter data based on search query and status filter
//   const filteredData = tableData.filter(user => {
//     const matchesSearch = 
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.phoneNumber.includes(searchQuery);
    
//     const matchesStatus = 
//       statusFilter === "all" || 
//       (statusFilter === "active" && user.is_active) || 
//       (statusFilter === "inactive" && !user.is_active);
    
//     return matchesSearch && matchesStatus;
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   // If loading, show a loading message
//   if (loading) {
//     return (
//       <div className="min-h-64 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <FiRefreshCw className="animate-spin text-2xl text-blue-500 mb-2" />
//           <p className="text-gray-500">Loading customer data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">
//       {/* Table Header with Controls */}
//       <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
        
//         <div className="flex flex-col sm:flex-row gap-3">
//           {/* Search Input */}
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search customers..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
//             />
//           </div>
          
//           {/* Status Filter */}
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
          
//           {/* Refresh Button */}
//           <button
//             onClick={getData}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
//           >
//             <FiRefreshCw className="mr-2" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="w-full overflow-x-auto">
//         <Table className="w-full">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableCell isHeader className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer
//               </TableCell>
//               <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact
//               </TableCell>
//               <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </TableCell>
//               <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Created
//               </TableCell>
//               <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="divide-y divide-gray-200">
//             {visibleData.length > 0 ? (
//               visibleData.map((user) => (
//                 <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
//                   <TableCell className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="font-medium text-blue-800">
//                           {user.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                         <div className="text-sm text-gray-500">ID: {user.id}</div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{user.email}</div>
//                     <div className="text-sm text-gray-500">{user.phoneNumber || 'No phone'}</div>
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div
//                         onClick={() => handleToggle(user.id)}
//                         className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
//                       >
//                         <div
//                           className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${user.is_active ? 'translate-x-6' : ''}`}
//                         />
//                       </div>
//                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//                         {user.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
//                   </TableCell>
//                   <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
//                         <FiEye className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
//                         <FiEdit className="w-4 h-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
//                         <HiDotsVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell  className="px-6 py-12 text-center">
//                   <div className="flex flex-col items-center justify-center">
//                     <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
//                     <p className="text-gray-500">
//                       {searchQuery || statusFilter !== "all" 
//                         ? "Try adjusting your search or filter to find what you're looking for." 
//                         : "There are no customers in the system yet."}
//                     </p>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       {/* Table Footer with Pagination */}
//       {filteredData.length > 0 && (
//         <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="text-sm text-gray-700">
//             Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
//             <span className="font-medium">
//               {Math.min(startIndex + itemsPerPage, filteredData.length)}
//             </span>{" "}
//             of <span className="font-medium">{filteredData.length}</span> results
//           </div>
          
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             itemsPerPage={itemsPerPage}
//             totalItems={filteredData.length}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import Pagination from "./Pagination";
import {
  fetchCustomer,
  toggleUserStatus,
} from "../../services/customerServices/CustomerServices";
import { toast } from "react-toastify";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  is_active: boolean;
  createdAt?: string;
}

export default function CustomerTables() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  /* =======================================================
     FETCH
  ======================================================= */
  const getData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const result = await fetchCustomer();
      setTableData(result);
    } catch (error) {
      console.error("Failed to fetch customer data:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  /* =======================================================
     TOGGLE STATUS
  ======================================================= */
  const handleToggle = async (id: number) => {
    try {
      setTogglingId(id);
      const result = await toggleUserStatus(id);

      setTableData((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, is_active: !user.is_active } : user
        )
      );

      toast.success(
        `User is now ${result.is_active ? "Active" : "Inactive"}`
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to toggle user status");
    } finally {
      setTogglingId(null);
    }
  };

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredData = useMemo(() => {
    let data = tableData.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phoneNumber?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [tableData, searchQuery, statusFilter, sortConfig]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* =======================================================
     HANDLERS
  ======================================================= */
  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortConfig({ key: "", direction: "asc" });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <FaSort className="text-slate-400 text-[10px] opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600 text-[10px]" />
    ) : (
      <FaSortDown className="text-blue-600 text-[10px]" />
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =======================================================
     STATS
  ======================================================= */
  const totalCustomers = tableData.length;
  const activeCustomers = tableData.filter((u) => u.is_active).length;
  const inactiveCustomers = totalCustomers - activeCustomers;

  /* =======================================================
     UI
  ======================================================= */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
        {/* ============ HEADER ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Users
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Customers
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalCustomers} total · {activeCustomers} active ·{" "}
              {inactiveCustomers} inactive
            </p>
          </div>

          <button
            onClick={() => getData()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FiRefreshCw size={12} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Customers
              </span>
              <FiUsers className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalCustomers}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active
              </span>
              <FiUserCheck className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeCustomers}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Inactive
              </span>
              <FiUserX className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {inactiveCustomers}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- TABS -------- */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              {[
                {
                  key: "all",
                  label: "All",
                  count: totalCustomers,
                  icon: FiUsers,
                },
                {
                  key: "active",
                  label: "Active",
                  count: activeCustomers,
                  icon: FiCheckCircle,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: inactiveCustomers,
                  icon: FiXCircle,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setStatusFilter(tab.key as any);
                      setCurrentPage(1);
                    }}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
                      active
                        ? "text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon size={11} />
                    {tab.label}
                    <span
                      className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded ${
                        active
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* -------- SEARCH + FILTERS -------- */}
          <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={13}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, username or phone..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="50">50 / page</option>
                </select>

                {(searchQuery || statusFilter !== "all") && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* -------- TABLE -------- */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort("id")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        ID {getSortIcon("id")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Customer {getSortIcon("name")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Contact
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Joined {getSortIcon("createdAt")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FiUsers
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchQuery || statusFilter !== "all"
                              ? "No matching customers"
                              : "No customers yet"}
                          </div>
                          <div className="text-xs">
                            {searchQuery || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "Customers will appear here once they register"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* ID */}
                        <TableCell className="!py-3 !px-3">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            #{String(user.id).padStart(4, "0")}
                          </span>
                        </TableCell>

                        {/* CUSTOMER */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                              {user.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                                {user.name || "—"}
                              </span>
                              {user.username && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                  @{user.username}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* CONTACT */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex flex-col gap-0.5">
                            {user.email && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <FiMail
                                  size={10}
                                  className="text-slate-400 flex-shrink-0"
                                />
                                <span className="truncate max-w-[220px]">
                                  {user.email}
                                </span>
                              </div>
                            )}
                            {user.phoneNumber && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <FiPhone
                                  size={10}
                                  className="text-slate-400 flex-shrink-0"
                                />
                                <span className="tabular-nums">
                                  {user.phoneNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* STATUS TOGGLE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggle(user.id)}
                              disabled={togglingId === user.id}
                              title={
                                user.is_active
                                  ? "Deactivate customer"
                                  : "Activate customer"
                              }
                              className={`relative inline-flex items-center cursor-pointer w-9 h-5 rounded-full transition-colors ${
                                user.is_active
                                  ? "bg-emerald-500"
                                  : "bg-slate-300 dark:bg-slate-700"
                              } ${
                                togglingId === user.id
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              <span
                                className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                                  user.is_active ? "translate-x-4" : ""
                                }`}
                              />
                            </button>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded border ${
                                user.is_active
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  user.is_active
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>

                        {/* JOINED */}
                        <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <FiCalendar
                              size={10}
                              className="text-slate-400"
                            />
                            <span className="tabular-nums">
                              {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="!py-3 !px-3 text-right">
                          <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="View"
                            >
                              <FiEye size={13} />
                            </button>
                            <button
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                              title="Edit"
                            >
                              <FiEdit size={13} />
                            </button>
                            <button
                              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                              title="More"
                            >
                              <HiDotsVertical size={13} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* -------- PAGINATION -------- */}
          {filteredData.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredData.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {filteredData.length}
                  </span>{" "}
                  results
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredData.length}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}