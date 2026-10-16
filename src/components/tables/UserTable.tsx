// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Table, TableHeader, TableBody, TableRow, TableCell
// } from "../ui/table";
// import Pagination from "./Pagination";
// import { fetchAllUsers, toggleUserStatus,deleteUserById ,updateUserById} from "../../services/authService";
// import { toast } from "react-toastify";
// import EditUserModal from "../auth/EditUserModal";
// import DeleteUserModal from "../auth/DeleteUserModal";
// import {  FaEdit,FaEye } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import Link from "next/link";
// import ViewUserModal from "../modal/ViewUserModal";
// // import  from 'react-dom'

// interface Role {
//   id: number;
//   name: string;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   username: string;
//   phone_number: string;
//   role_id: number;
//   is_active: boolean;
//   createdAt?: string; // add this if you're using it
//   role?: Role; // ✅ Add this
// }

// export default function UserTable() {
//   const itemsPerPage = 5;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [tableData, setTableData] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
// const [selectedUser, setSelectedUser] = useState<User | null>(null);
// const [editModalOpen, setEditModalOpen] = useState(false);
// const [deleteModalOpen, setDeleteModalOpen] = useState(false);
// const [viewModalOpen, setViewModalOpen] = useState(false);
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const result = await fetchAllUsers();
//         console.log("Fetched users:", result.users);
//         setTableData(result.users);
//       } catch (error) {
//         console.error("Failed to fetch user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, []);

//   const totalPages = Math.ceil(tableData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

//   // ✅ Toggle function
//   // const handleToggle = async (id: number) => {
//   //   try {
//   //     await toggleUserStatus(id);
//   //     const result = await fetchAllUsers();
//   //     setTableData(result.users);

      
//   //   } catch (error) {
//   //     console.error("Error toggling user status:", error);
//   //   }
//   // };
//   const handleToggle = async (id: number) => {
//   try {
//     const res = await toggleUserStatus(id);
//     const updatedUser = res.data.user;

//     setTableData((prev) =>
//       prev.map((u) =>
//         u.id === updatedUser.id
//           ? { ...u, is_active: updatedUser.is_active }
//           : u
//       )
//     );

//     toast.success(res.data.message);
//   } catch (error) {
//     console.error("Error toggling user status:", error);
//     toast.error("Failed to toggle status");
//   }
// };


//   const handleSaveUser = async (updatedUser: User) => {
//   try {
//     const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
//     const updated = await updateUserById(updatedUser, token);
//     setTableData((prev) =>
//       prev.map((u) => (u.id === updated.id ? updated : u))
//     );
//     toast.success("User updated successfully", { style: { top: "50px" } });
//   } catch (error) {
//     console.error("Update failed", error);
//     toast.error("Failed to update user", { style: { top: "50px" } });
//   }
// };

// const handleDeleteUser = async () => {
//   if (!selectedUser) return;

//   try {
//     const token = localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";

//     await deleteUserById(selectedUser.id, token);
//     setTableData((prev) => prev.filter((u) => u.id !== selectedUser.id));
//     toast.success("User deleted successfully", { style: { top: "50px" } });
//   } catch (error) {
//     console.error("Delete failed", error);
//     toast.error("Failed to delete user", { style: { top: "50px" } });
//   } finally {
//     setDeleteModalOpen(false);
//     setSelectedUser(null);
//   }
// };





//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
//       <div className="w-full overflow-x-auto">
//         <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm dark:text-white">
//           <TableHeader className="bg-gray-100 dark:bg-white/[0.05] dark:text-white">
//             <TableRow className="">
//               <TableCell isHeader className="dark:text-white">Name</TableCell>
//               <TableCell className="dark:text-white">Email</TableCell>
//               <TableCell className="dark:text-white">Username</TableCell>
//               <TableCell className="dark:text-white">Phone</TableCell>
//               <TableCell className="dark:text-white">Role ID</TableCell>
//               <TableCell className="dark:text-white">Status</TableCell>
//               <TableCell className="dark:text-white">Created</TableCell>
//               <TableCell className="dark:text-white">Actions</TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="divide-y  divide-gray-200 dark:divide-white/[0.05]">
//             {visibleData.map((user) => (
//               <TableRow
//                 key={user.id}
//                 className="hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:text-white"
//               >
//                 <TableCell className="font-medium text-gray-900 dark:text-white">
//                   {user.name}
//                 </TableCell>
//                 <TableCell className="dark:text-white">{user.email}</TableCell>
//                 <TableCell className="dark:text-white">{user.username}</TableCell>
//                 <TableCell  className="dark:text-white">{user.phone_number}</TableCell>
//                <TableCell className="dark:text-white">{user.role?.name || '—'}</TableCell>




//                 <TableCell>
                  

//  <div
//   onClick={() => handleToggle(user.id)}
//   className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
//     user.is_active ? 'bg-green-500' : 'bg-red-400'
//   }`}
// >
//   <div
//     className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
//       user.is_active ? 'translate-x-6' : ''
//     }`}
//   />
// </div>
//                 </TableCell>
// <TableCell className="dark:text-white">
//   {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}
// </TableCell>
//                {/* <TableCell className="flex gap-3">
//   <button
//     onClick={() => {
//       setSelectedUser(user);
//       setEditModalOpen(true);
//     }}
//     className="text-blue-600 hover:underline"
//   >
//     <FaEdit/>
//   </button>
//   <button
//     onClick={() => {
//       setSelectedUser(user);
//       setDeleteModalOpen(true);
//     }}
//     className="text-red-600 hover:underline"
//   >
//    <MdDeleteForever/>
//   </button>
// </TableCell> */}

// <TableCell className="flex gap-3 items-center">

//   {/* View User */}
//   {/* <Link
//     href={`/users/view/${user.id}`}
//     className="text-green-600 hover:underline"
//   >
//     <FaEye />
//   </Link> */}
//   <button
//   onClick={() => {
//     setSelectedUser(user);
//     setViewModalOpen(true);
//   }}
//   className="text-green-600 hover:text-green-800"
//   title="View User"
// >
//   <FaEye />
// </button>

//   {/* Edit User */}
//  <Link
//   href={`/users/edit/${user.id}`}
//   className="text-blue-600"
// >
//   <FaEdit />
// </Link>

//   {/* Delete User */}
//   <button
//     onClick={() => {
//       setSelectedUser(user);
//       setDeleteModalOpen(true);
//     }}
//     className="text-red-600 hover:underline"
//   >
//     <MdDeleteForever />
//   </button>

// </TableCell>

//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex justify-end px-4 py-3">
//         <Pagination
//   currentPage={currentPage}
//   totalPages={totalPages}
//   itemsPerPage={itemsPerPage}
//   totalItems={tableData.length}
//   onPageChange={(page) => setCurrentPage(page)}
// />

//       </div>


// <ViewUserModal
//   isOpen={viewModalOpen}
//   onClose={() => {
//     setViewModalOpen(false);
//     setSelectedUser(null);
//   }}
//   user={selectedUser}
// />
//       <EditUserModal
//   isOpen={editModalOpen}
//   onClose={() => setEditModalOpen(false)}
//   user={selectedUser}
//   onSave={handleSaveUser}
// />

// <DeleteUserModal
//   isOpen={deleteModalOpen}
//   onClose={() => setDeleteModalOpen(false)}
//   onConfirm={handleDeleteUser}
// />

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
  fetchAllUsers,
  toggleUserStatus,
  deleteUserById,
  updateUserById,
} from "../../services/authService";
import { toast } from "react-toastify";
import EditUserModal from "../auth/EditUserModal";
import DeleteUserModal from "../auth/DeleteUserModal";
import ViewUserModal from "../modal/ViewUserModal";
import {
  FaEdit,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSyncAlt,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Link from "next/link";

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
  createdAt?: string;
  role?: Role;
}

export default function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
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
      const result = await fetchAllUsers();
      setTableData(result.users);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to fetch users");
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
    } finally {
      setTogglingId(null);
    }
  };

  /* =======================================================
     UPDATE
  ======================================================= */
  const handleSaveUser = async (updatedUser: User) => {
    try {
      const token =
        localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      const updated = await updateUserById(updatedUser, token);
      setTableData((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update user");
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const token =
        localStorage.getItem("token")?.replace(/^"|"$/g, "") || "";
      await deleteUserById(selectedUser.id, token);
      setTableData((prev) => prev.filter((u) => u.id !== selectedUser.id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredData = useMemo(() => {
    let data = tableData.filter((user) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.username?.toLowerCase().includes(q) ||
        user.phone_number?.includes(searchQuery) ||
        user.role?.name?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);

      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      data.sort((a: any, b: any) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "role") {
          aVal = a.role?.name || "";
          bVal = b.role?.name || "";
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
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
  const totalUsers = tableData.length;
  const activeUsers = tableData.filter((u) => u.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminCount = tableData.filter(
    (u) => u.role?.name?.toLowerCase() === "admin"
  ).length;

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
                Admin
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Users
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalUsers} total · {activeUsers} active · {adminCount} admins
            </p>
          </div>

          <button
            onClick={() => getData()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FaSyncAlt size={11} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <FiUsers className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalUsers}
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
              {activeUsers}
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
              {inactiveUsers}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Admins
              </span>
              <FiShield className="text-indigo-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {adminCount}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- TABS -------- */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              {[
                { key: "all", label: "All", count: totalUsers, icon: FiUsers },
                {
                  key: "active",
                  label: "Active",
                  count: activeUsers,
                  icon: FiCheckCircle,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: inactiveUsers,
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
                  placeholder="Search by name, email, username, phone or role..."
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
            <div className="min-w-[1000px] lg:min-w-full">
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
                        User {getSortIcon("name")}
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
                      <button
                        onClick={() => handleSort("role")}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Role {getSortIcon("role")}
                      </button>
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
                        Created {getSortIcon("createdAt")}
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
                        {Array.from({ length: 7 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FiUsers
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchQuery || statusFilter !== "all"
                              ? "No matching users"
                              : "No users yet"}
                          </div>
                          <div className="text-xs">
                            {searchQuery || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "Users will appear here once they register"}
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

                        {/* USER */}
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
                            {user.phone_number && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <FiPhone
                                  size={10}
                                  className="text-slate-400 flex-shrink-0"
                                />
                                <span className="tabular-nums">
                                  {user.phone_number}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* ROLE */}
                        <TableCell className="!py-3 !px-3">
                          {user.role?.name ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded border ${
                                user.role.name.toLowerCase() === "admin"
                                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {user.role.name.toLowerCase() === "admin" && (
                                <FiShield size={9} />
                              )}
                              {user.role.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* STATUS TOGGLE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggle(user.id)}
                              disabled={togglingId === user.id}
                              title={
                                user.is_active
                                  ? "Deactivate user"
                                  : "Activate user"
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

                        {/* CREATED */}
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
                              onClick={() => {
                                setSelectedUser(user);
                                setViewModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="View"
                            >
                              <FaEye size={13} />
                            </button>
                            <Link
                              href={`/users/edit/${user.id}`}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={13} />
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                              title="Delete"
                            >
                              <MdDeleteForever size={15} />
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
                  users
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

      {/* ============ MODALS ============ */}
      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

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