
"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";
import Pagination from "./Pagination";
import { fetchAllUsers, toggleUserStatus } from "../../services/authService";

// ✅ Define your user type
interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone_number: string;
  role_id: number;
  is_active: boolean;
}

export default function BasicTableOne() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllUsers();
        console.log("Fetched users:", result.users);
        setTableData(result.users);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Toggle function
  const handleToggle = async (id: number) => {
    try {
      await toggleUserStatus(id);

      // Option 1: Refetch entire list
      const result = await fetchAllUsers();
      setTableData(result.users);

      // Option 2 (faster): Local toggle
      // setTableData(prev =>
      //   prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u)
      // );

    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm">
          <TableHead className="bg-gray-100 dark:bg-white/[0.05]">
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Role ID</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Created</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
            {visibleData.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium text-gray-900">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.phone_number}</TableCell>
               <TableCell>{user.role?.name || '—'}</TableCell>
<TableCell>
  {new Date(user.createdAt).toLocaleString()}
</TableCell>


                <TableCell>
                  

 <div
  onClick={() => handleToggle(user.id)}
  className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
    user.is_active ? 'bg-green-500' : 'bg-red-400'
  }`}
>
  <div
    className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
      user.is_active ? 'translate-x-6' : ''
    }`}
  />
</div>
                </TableCell>

                <TableCell className="text-blue-600 hover:underline cursor-pointer">
                  Edit
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end px-4 py-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}