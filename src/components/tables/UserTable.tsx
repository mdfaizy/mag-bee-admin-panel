"use client";
import React, { useEffect, useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableCell
} from "../ui/table";
import Pagination from "./Pagination";
import { fetchAllUsers, toggleUserStatus,deleteUserById ,updateUserById} from "../../services/authService";
import { toast } from "react-toastify";
import EditUserModal from "../auth/EditUserModal";
import DeleteUserModal from "../auth/DeleteUserModal";
import {  FaEdit,FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Link from "next/link";
// import  from 'react-dom'
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone_number: string;
  role_id: number;
  is_active: boolean;
  createdAt?: string; // add this if you're using it
  role?: Role; // ✅ Add this
}

export default function UserTable() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [editModalOpen, setEditModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
  // const handleToggle = async (id: number) => {
  //   try {
  //     await toggleUserStatus(id);
  //     const result = await fetchAllUsers();
  //     setTableData(result.users);

      
  //   } catch (error) {
  //     console.error("Error toggling user status:", error);
  //   }
  // };
  const handleToggle = async (id: number) => {
  try {
    const res = await toggleUserStatus(id);
    const updatedUser = res.data.user;

    setTableData((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id
          ? { ...u, is_active: updatedUser.is_active }
          : u
      )
    );

    toast.success(res.data.message);
  } catch (error) {
    console.error("Error toggling user status:", error);
    toast.error("Failed to toggle status");
  }
};


  const handleSaveUser = async (updatedUser: User) => {
  try {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
    const updated = await updateUserById(updatedUser, token);
    setTableData((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
    toast.success("User updated successfully", { style: { top: "50px" } });
  } catch (error) {
    console.error("Update failed", error);
    toast.error("Failed to update user", { style: { top: "50px" } });
  }
};

const handleDeleteUser = async () => {
  if (!selectedUser) return;

  try {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";

    await deleteUserById(selectedUser.id, token);
    setTableData((prev) => prev.filter((u) => u.id !== selectedUser.id));
    toast.success("User deleted successfully", { style: { top: "50px" } });
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Failed to delete user", { style: { top: "50px" } });
  } finally {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  }
};





  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm dark:text-white">
          <TableHeader className="bg-gray-100 dark:bg-white/[0.05] dark:text-white">
            <TableRow className="">
              <TableCell isHeader className="dark:text-white">Name</TableCell>
              <TableCell className="dark:text-white">Email</TableCell>
              <TableCell className="dark:text-white">Username</TableCell>
              <TableCell className="dark:text-white">Phone</TableCell>
              <TableCell className="dark:text-white">Role ID</TableCell>
              <TableCell className="dark:text-white">Status</TableCell>
              <TableCell className="dark:text-white">Created</TableCell>
              <TableCell className="dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y  divide-gray-200 dark:divide-white/[0.05]">
            {visibleData.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:text-white"
              >
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </TableCell>
                <TableCell className="dark:text-white">{user.email}</TableCell>
                <TableCell className="dark:text-white">{user.username}</TableCell>
                <TableCell  className="dark:text-white">{user.phone_number}</TableCell>
               <TableCell className="dark:text-white">{user.role?.name || '—'}</TableCell>




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
<TableCell className="dark:text-white">
  {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}
</TableCell>
               {/* <TableCell className="flex gap-3">
  <button
    onClick={() => {
      setSelectedUser(user);
      setEditModalOpen(true);
    }}
    className="text-blue-600 hover:underline"
  >
    <FaEdit/>
  </button>
  <button
    onClick={() => {
      setSelectedUser(user);
      setDeleteModalOpen(true);
    }}
    className="text-red-600 hover:underline"
  >
   <MdDeleteForever/>
  </button>
</TableCell> */}

<TableCell className="flex gap-3 items-center">

  {/* View User */}
  <Link
    href={`/users/view/${user.id}`}
    className="text-green-600 hover:underline"
  >
    <FaEye />
  </Link>

  {/* Edit User */}
 <Link
  href={`/users/edit/${user.id}`}
  className="text-blue-600"
>
  <FaEdit />
</Link>

  {/* Delete User */}
  <button
    onClick={() => {
      setSelectedUser(user);
      setDeleteModalOpen(true);
    }}
    className="text-red-600 hover:underline"
  >
    <MdDeleteForever />
  </button>

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
  itemsPerPage={itemsPerPage}
  totalItems={tableData.length}
  onPageChange={(page) => setCurrentPage(page)}
/>

      </div>

      <EditUserModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  user={selectedUser}
  onSave={handleSaveUser}
/>

<DeleteUserModal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={handleDeleteUser}
/>

    </div>
  );
}
