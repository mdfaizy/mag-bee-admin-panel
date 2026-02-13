"use client";

import React, { useEffect, useState } from "react";
import {
 Table, TableHeader, TableBody, TableRow, TableCell
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { apiConnector } from "@/services/apiConnector";

interface Privilege {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  privileges: Privilege[];
}

export default function RoleTable() {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiConnector("GET", "/roles");
        setTableData(res.data.roles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <div className="p-4">Loading roles...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="text-sm">
          <TableHeader className="bg-gray-100 dark:bg-white/[0.05]">
            <TableRow>
              <TableCell isHeader>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Privileges</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleData.map((role) => (
              <TableRow
                key={role.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <TableCell className="font-medium">
                  {role.name}
                </TableCell>

                <TableCell>{role.description}</TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {role.privileges.length} Privileges
                    </span>
                    {role.privileges.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {role.privileges
                          .map((p) => p.name)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {new Date(role.createdAt).toLocaleString()}
                </TableCell>

                <TableCell className="flex gap-3">
                  <button className="text-blue-600 hover:underline">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:underline">
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
    </div>
  );
}
