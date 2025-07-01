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
import { fetchProductCategory } from "../../services/product-category/categoryService";

interface ProductCategory {
  id: number;
  name: string;
  description: string;
  imageUrl:string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductCategorttable() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  const getData = async () => {
    try {
      const result = await fetchProductCategory();
      console.log("Fetched users:", result);
      setTableData(result);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setTableData([]); // fallback to empty
    } finally {
      setLoading(false);
    }
  };
  getData();
}, []);


  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = tableData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm">
        <TableHead className="bg-gray-100 dark:bg-white/[0.05]">
  <TableRow>
    <TableHeadCell>ID</TableHeadCell>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>Description</TableHeadCell>
    <TableHeadCell>Image</TableHeadCell>
    <TableHeadCell>Created At</TableHeadCell>
    <TableHeadCell>Updated At</TableHeadCell>
    <TableHeadCell>Actions</TableHeadCell>
  </TableRow>
</TableHead>

          <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
{Array.isArray(visibleData) && visibleData.map((item) => (
  <TableRow key={item.id}>
    <TableCell>{item.id}</TableCell>
    <TableCell>{item.name || "—"}</TableCell>
    <TableCell>{item.description || "—"}</TableCell>
    {/* <TableCell>{item.imageUrl || "—"}</TableCell> */}

    <TableCell>
  {item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt="Product"
      className="w-16 h-auto object-cover rounded" // Tailwind for small image
    />
  ) : (
    "—"
  )}
</TableCell>

    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
    <TableCell>{new Date(item.updatedAt).toLocaleString()}</TableCell>
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
