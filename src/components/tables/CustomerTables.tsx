"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableCell
} from "../ui/table";
import Pagination from "./Pagination";
import { fetchCustomer, toggleUserStatus } from "../../services/customerServices/CustomerServices";
import { toast } from "react-toastify";
import { FiEdit, FiEye, FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  // role_id: number;
  is_active: boolean;
  createdAt?: string;
 
}

export default function CustomerTables() {
  const itemsPerPage = 5; 
  const [currentPage, setCurrentPage] = useState(1); 
  // const [tableData, setTableData] = useState<User[]>([]); 
  const [tableData, setTableData] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 


  const getData = async () => {
  try {
    setLoading(true);
    const result = await fetchCustomer(); 
    console.log("Fetched customers:", result);
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

  const handleToggle = async (id: number) => {
    try {
      // Call the API to toggle user status
      const result = await toggleUserStatus(id);
      
      // Update the local table data with the new status
      const updatedData = tableData.map((user) =>
        user.id === id ? { ...user, is_active: !user.is_active } : user
      );
      setTableData(updatedData);

      toast.success(`User is now ${result.is_active ? "Active" : "Inactive"}`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to toggle user status");
    }
  };

  // Filter data based on search query and status filter
  const filteredData = tableData.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && user.is_active) || 
      (statusFilter === "inactive" && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // If loading, show a loading message
  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FiRefreshCw className="animate-spin text-2xl text-blue-500 mb-2" />
          <p className="text-gray-500">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">
      {/* Table Header with Controls */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          {/* Refresh Button */}
          <button
            onClick={getData}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </TableCell>
              <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </TableCell>
              <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </TableCell>
              <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </TableCell>
              <TableCell className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {visibleData.length > 0 ? (
              visibleData.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-medium text-blue-800">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phoneNumber || 'No phone'}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        onClick={() => handleToggle(user.id)}
                        className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${user.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div
                          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${user.is_active ? 'translate-x-6' : ''}`}
                        />
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
                        <HiDotsVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell  className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
                    <p className="text-gray-500">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search or filter to find what you're looking for." 
                        : "There are no customers in the system yet."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Table Footer with Pagination */}
      {filteredData.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(startIndex + itemsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span> results
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}