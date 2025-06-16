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
import { fetchProductAll } from "../../services/product/productService";

// Define interfaces
interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  originalPrice: string;
  price: string;
  offer: number;
  updatedAt: string;
  createdAt: string;
  category: Category | null;
}

export default function ProductTable() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchProductAll();
        setTableData(result);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
        setTableData([]);
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
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>Original Price</TableHeadCell>
              <TableHeadCell>Offer (%)</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Created At</TableHeadCell>
              <TableHeadCell>Updated At</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
            {visibleData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>₹{product.price}</TableCell>
                <TableCell>₹{product.originalPrice}</TableCell>
                <TableCell>{product.offer}%</TableCell>
                <TableCell>{product.category?.name || "—"}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(product.updatedAt).toLocaleString()}
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
