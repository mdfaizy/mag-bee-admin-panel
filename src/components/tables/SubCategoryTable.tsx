"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubCategories,
  setSelectedSubCategory,
} from "../../redux/productSubCategory"; // <-- naya slice
import Link from "next/link";
import {
  fetchSubCategoryAll,
  deleteSubCategory,
} from "../../services/subCategoryService/subCategoryService"; // <-- service file
import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";
import { Modal } from "../ui/modal";
import Image from "next/image";
import { toast } from "react-toastify";
import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";

const SubCategoryTable = () => {
  const dispatch = useDispatch();
//   const { selectedSubCategory } = useSelector((state: RootState) => state.SubCategoryState);
  const { subCategories } = useSelector((state: RootState) => state.SubCategoryState);
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [viewModalOpen, setViewModalOpen] = useState(false);
const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loading, setLoading] = useState(false);
const [isOpen, setIsOpen] = React.useState(false);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Filtering + Sorting
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = tableData.filter(sub =>
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [tableData, searchTerm, sortConfig]);

  const visibleData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Fetch subcategories
  useEffect(() => {
    const getSubCategories = async () => {
      try {
        setLoading(true);
        const result = await fetchSubCategoryAll();
        dispatch(setSubCategories(result));
      } catch (error) {
        console.error("Failed to load subcategories", error);
        toast.error("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };
    getSubCategories();
  }, [dispatch]);

  useEffect(() => {
    setTableData(subCategories || []);
  }, [subCategories]);

const handleView = (id: number) => {
  setSelectedSubCategoryId(id);
  setViewModalOpen(true);
};


  const handleEdit = (subCategory: any) => {
    dispatch(setSelectedSubCategory(subCategory));
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId) {
      try {
        await dispatch<any>(deleteSubCategory(selectedDeleteId));
        toast.success("SubCategory deleted successfully");
        setDeleteModalOpen(false);
        setSelectedDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete subcategory");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 text-gray-800 md:p-6 border dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">SubCategory Management</h1>
          <Link href="/subcategory">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <FaPlus size={14} />
              <span>Add SubCategory</span>
            </button>
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subcategories..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaFilter className="text-gray-600" />
              <span className="hidden sm:inline">Filters</span>
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-full">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell className="hidden md:table-cell">Description</TableHeadCell>
              <TableHeadCell className="hidden lg:table-cell">Slug</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Image</TableHeadCell>
              <TableHeadCell className="hidden lg:table-cell">Created</TableHeadCell>
              <TableHeadCell className="hidden xl:table-cell">Updated</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell >Loading...</TableCell></TableRow>
            ) : visibleData.length === 0 ? (
              <TableRow>
                <TableCell  className="text-center py-8 text-gray-500">
                  {searchTerm ? "No subcategories found" : "No subcategories available"}
                </TableCell>
              </TableRow>
            ) : (
              visibleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name || "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.description || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{item.slug || "—"}</TableCell>
                  <TableCell>{item.category?.name || "—"}</TableCell>
                  <TableCell>
                    {item.imageUrl ? (
                      <div className="relative w-10 h-10">
                        <img src={item.imageUrl} alt={item.name || "image"}  className="object-cover rounded-md" />
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="hidden xl:table-cell">{formatDate(item.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button onClick={() => handleView(item.id)} className="p-2 text-blue-600"><FaEye /></button>

                      <button onClick={() => handleEdit(item)} className="p-2 text-yellow-600"><FaEdit /></button>
                      <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-red-600"><MdDeleteForever /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
   <ViewSubCategoryModal
  isOpen={viewModalOpen}
  onClose={() => setViewModalOpen(false)}
  data={tableData.find(sub => sub.id === selectedSubCategoryId) || null}
/>

     
<EditSubCategoryModal
 isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
/>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete SubCategory</h3>
          <p className="text-sm text-gray-500 text-center mb-6">Are you sure?</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm bg-gray-100">Cancel</button>
            <button onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubCategoryTable;
