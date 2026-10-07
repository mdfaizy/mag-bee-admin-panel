//   "use client";

//   import React, { useEffect, useState } from "react";
//   import { useSelector, useDispatch } from "react-redux";
//   import { RootState } from "@/redux/store";
//   import {
//     setSelectedCategory,
//     setCategories,
//   } from "@/redux/productCategory";
//   import Link from "next/link";
//   import {
//     fetchProductCategory,
//     deleteCategory,
//   } from "@/services/product-category/categoryService";
//   import ViewCategoryModal from "../productCategory/ViewCategoryModal";
//   import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
//   import { MdDeleteForever } from "react-icons/md";
//   // import {
//   //   Table,
//   //   TableHead,
//   //   TableBody,
//   //   TableRow,
//   //   TableCell ,
//   //   TableCell,
//   // } from "../ui/table";
//   import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../ui/table";

//   import { Modal } from "../ui/modal";
//   import Image from "next/image";
//   import { toast } from "react-toastify";
//   import Pagination from "./Pagination";
//   import { useRouter } from "next/navigation";
// import { apiConnector } from "@/services/apiConnector";
// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   imageUrl?: string;
//   isActive: boolean;

//   createdAt: string;   // 🔥 IMPORTANT
//   updatedAt: string;   // 🔥 IMPORTANT
// }
//   const CategoryTable = () => {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const { categories } = useSelector((state: RootState) => state.category);



//     const [tableData, setTableData] = useState<any[]>([]);
//     const [currentPage, setCurrentPage] = useState(1);
    
//     const [viewModalOpen, setViewModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showFilters, setShowFilters] = useState(false);
//     const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
//     const [loading, setLoading] = useState(false);

//     const itemsPerPage = 10;
//     const startIndex = (currentPage - 1) * itemsPerPage;

//     // Filter and sort data
//     const filteredAndSortedData = React.useMemo(() => {
//       let filtered = tableData.filter(category =>
//         category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
//       );

//       // Apply sorting
//       if (sortConfig.key) {
//         filtered.sort((a, b) => {
//           if (a[sortConfig.key] < b[sortConfig.key]) {
//             return sortConfig.direction === "asc" ? -1 : 1;
//           }
//           if (a[sortConfig.key] > b[sortConfig.key]) {
//             return sortConfig.direction === "asc" ? 1 : -1;
//           }
//           return 0;
//         });
//       }

//       return filtered;
//     }, [tableData, searchTerm, sortConfig]);

//     const visibleData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
//     const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//     // Fetch categories
//     // useEffect(() => {
//     //   const getCategories = async () => {
//     //     try {
//     //       setLoading(true);
//     //       const result = await fetchProductCategory();
//     //       // dispatch(setCategories(result));
//     //     // console.log("Redux categories:", categories);

//     //     console.log("result",result);

//     //       // dispatch(setCategories(result.categories));
//     //     } catch (error) {
//     //       console.error("Failed to load categories", error);
//     //       toast.error("Failed to load categories");
//     //     } finally {
//     //       setLoading(false);
//     //     }
//     //   };
//     //   getCategories();
//     // }, [dispatch]);

//     useEffect(() => {
//   const getCategories = async () => {
//     try {
//       setLoading(true);
//       const result = await fetchProductCategory();

//       console.log("API result:", result);

//       // ✅ THIS IS REQUIRED
//       dispatch(setCategories(result));

//     } catch (error) {
//       console.error("Failed to load categories", error);
//       toast.error("Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   getCategories();
// }, [dispatch]);


//     // Sync Redux -> Local State
//     useEffect(() => {
//       setTableData(categories || []);
//     }, [categories]);

//     const handleSort = (key: string) => {
//       let direction = "asc";
//       if (sortConfig.key === key && sortConfig.direction === "asc") {
//         direction = "desc";
//       }
//       setSortConfig({ key, direction });
//     };

//     const handleView = (category: any) => {
//       dispatch(setSelectedCategory(category));
//       setViewModalOpen(true);
//     };

  

//     const handleDeleteClick = (id: number) => {
//       setSelectedDeleteId(id);
//       setDeleteModalOpen(true);
//     };

//     // const confirmDelete = async () => {
//     //   if (selectedDeleteId) {
//     //     try {
//     //       await dispatch<any>(deleteCategory(selectedDeleteId));
//     //       toast.success("Category deleted successfully");
//     //       setDeleteModalOpen(false);
//     //       setSelectedDeleteId(null);
//     //     } catch (error) {
//     //       toast.error("Failed to delete category");
//     //     }
//     //   }
//     // };

//     const confirmDelete = async () => {
//   if (selectedDeleteId) {
//     try {

//       await dispatch<any>(deleteCategory(selectedDeleteId));

//       setDeleteModalOpen(false);
//       setSelectedDeleteId(null);

//     } catch (error) {
//       toast.error("Failed to delete category");
//     }
//   }
// };

//     const formatDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     };

//     const toggleCategory = async (id: number) => {
//   try {

//     const res = await apiConnector(
//       "PATCH",
//       `/category/${id}/toggle-status`
//     );

//     if (res?.data?.success) {

//       toast.success("Category status updated");

//       // updated categories reload
//       const updatedList = await fetchProductCategory();
//       dispatch(setCategories(updatedList));

//     }

//   } catch (error: any) {

//     toast.error(
//       error?.response?.data?.message || "Failed to update category status"
//     );

//   }
// };

//     return (
//       // <div className="bg-white rounded-xl shadow-sm p-4 text-gray-800 md:p-6 border dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white  ">
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white px-4 py-4"> 
//         <div className="flex flex-col gap-4 mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <h1 className="text-2xl font-bold  mb-4 md:mb-0">Category Management</h1>
//             <Link href='/category'>
//               <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
//                 <FaPlus size={14} />
//                 <span>Add Category</span>
//               </button></Link>
//           </div>

//           <div className="flex flex-col md:flex-row gap-4 justify-between">
//             <div className="relative flex-1 max-w-2xl">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FaSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search categories by name, description or slug..."
//                 className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 <FaFilter className="text-gray-600" />
//                 <span className="hidden sm:inline">Filters</span>
//                 {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//               </button>
//             </div>
//           </div>

//           {/* Expandable Filters */}
//           {showFilters && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mt-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
//                 <select
//                   className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                   value={sortConfig.key}
//                   onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
//                 >
//                   <option value="">Default</option>
//                   <option value="name">Name</option>
//                   <option value="createdAt">Created Date</option>
//                   <option value="updatedAt">Updated Date</option>
//                 </select>
//               </div>

//               <div className="flex items-end">
//                 <button
//                   onClick={() => {
//                     setSearchTerm("");
//                     setSortConfig({ key: "", direction: "asc" });
//                   }}
//                   className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           )}
        
//         </div>

//         {/* Category Table */}
//         <div className="overflow-x-auto rounded-lg border border-gray-200">
//           <Table className="min-w-full">
//             <TableHeader className="bg-gray-50">
//               <TableRow>
//                 <TableCell isHeader
//                   className="cursor-pointer hover:bg-gray-100"
//                 // onClick={() => handleSort("id")}
//                 >
//                   <div className="flex items-center gap-1">
//                     ID
//                     {sortConfig.key === "id" && (
//                       sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell 
//                   className="cursor-pointer hover:bg-gray-100"
//                 // onClick={() => handleSort("name")}
//                 >
//                   <div className="flex items-center gap-1">
//                     Name
//                     {sortConfig.key === "name" && (
//                       sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
//                     )}
//                   </div>
//                 </TableCell>
//                 <TableCell  className="hidden md:table-cell">Description</TableCell >
//                 <TableCell  className="hidden lg:table-cell">Slug</TableCell>
//                 <TableCell >Image</TableCell>
//                 <TableCell  className="hidden lg:table-cell">Created</TableCell >
//                 <TableCell  className="hidden xl:table-cell">Updated</TableCell >
//                 <TableCell >Actions</TableCell>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 Array.from({ length: itemsPerPage }).map((_, index) => (
//                   <TableRow key={index} className="animate-pulse">
//                     <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden md:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-10 w-10 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell className="hidden xl:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
//                     <TableCell><div className="h-8 w-20 bg-gray-200 rounded"></div></TableCell>
//                   </TableRow>
//                 ))
//               ) : visibleData.length === 0 ? (
//                 <TableRow>
//                   <TableCell className="text-center py-8 text-gray-500">
//                     {searchTerm ? "No categories found matching your search" : "No categories available"}
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 visibleData.map((item) => (
//                   <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50/30 border-1 ">
//                     <TableCell className="font-medium dark:text-white">{item.id}</TableCell>
//                     <TableCell>
//                       <div className="font-medium dark:text-white">{item.name || "—"}</div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell dark:text-white">
//                       <div className="max-w-xs truncate" title={item.description}>
//                         {item.description || "—"}
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden lg:table-cell ">
//                       <span className="px-2 py-1 bg-gray-100  text-xs font-medium rounded-full">
//                         {item.slug || "—"}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       {item.imageUrl ? (
//                         <div className="relative w-10 h-10">
//                           {/* <Image
//                             src={item.imageUrl}
//                             alt={item.name || "Category image"}
//                             fill
//                             className="object-cover rounded-md"
//                           /> */}
//                           <img
//   src={item.imageUrl}
//   alt={item.name || "Category image"}
//   className="w-10 h-10 object-cover rounded-md"
// />
//                         </div>
//                       ) : (
//                         <span className="text-gray-400">—</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="hidden lg:table-cell">
//                       <span className="text-sm text-gray-600 dark:text-white">{formatDate(item.createdAt)}</span>
//                     </TableCell>
//                     <TableCell className="hidden xl:table-cell">
//                       <span className="text-sm text-gray-600 dark:text-white">{formatDate(item.updatedAt)}</span>
//                     </TableCell>
//                     <button
//   onClick={() => toggleCategory(item.id)}
//   className="p-2 text-gray-600 hover:bg-gray-100 rounded"
// >
//   {item.isActive ? "Disable" : "Enable"}
// </button>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleView(item)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
//                           title="View"
//                         >
//                           <FaEye size={16} />
//                         </button>
//                         {/* <button
//                           onClick={() => handleEdit(item)}
//                           className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
//                           title="Edit"
//                         >
//                           <FaEdit size={16} />
//                         </button> */}
//                           <button
//     onClick={() => router.push(`/edit-category/${item.id}`)}
//     className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
//     title="Edit"
//   >
//     <FaEdit size={16} />
//   </button>

//                         <button
//                           onClick={() => handleDeleteClick(item.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                           title="Delete"
//                         >
//                           <MdDeleteForever size={18} />
//                         </button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-end px-4 py-3">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             itemsPerPage={itemsPerPage}
//             totalItems={tableData.length}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//         </div>

//         {/* Modals */}
//         <ViewCategoryModal
//           isOpen={viewModalOpen}
//           onClose={() => setViewModalOpen(false)}
//         />  

//         {/* Delete Confirmation Modal */}
//         <Modal
//           isOpen={deleteModalOpen}
//           onClose={() => setDeleteModalOpen(false)}
//           className="max-w-md"
//         >
//           <div className="p-6">
//             <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//               <MdDeleteForever className="w-6 h-6 text-red-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
//               Delete Category
//             </h3>
//             <p className="text-sm text-gray-500 text-center mb-6">
//               Are you sure you want to delete this category? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <button
//                 onClick={() => setDeleteModalOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     );
//   };

//   export default CategoryTable;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSelectedCategory,
  setCategories,
} from "@/redux/productCategory";
import Link from "next/link";
import {
  fetchProductCategory,
  deleteCategory,
} from "@/services/product-category/categoryService";
import ViewCategoryModal from "../productCategory/ViewCategoryModal";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaImage,
  FaFolder,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import { Modal } from "../ui/modal";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";
import { apiConnector } from "@/services/apiConnector";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CategoryTable = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories } = useSelector((state: RootState) => state.category);

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  /* =======================================================
     FETCH
  ======================================================= */
  const loadCategories = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const result = await fetchProductCategory();
      dispatch(setCategories(result));
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [dispatch]);

  useEffect(() => {
    setTableData(categories || []);
  }, [categories]);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = useMemo(() => {
    let filtered = tableData.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) =>
        statusFilter === "active" ? c.isActive : !c.isActive
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

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

  const handleView = (category: any) => {
    dispatch(setSelectedCategory(category));
    setViewModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId) {
      try {
        await dispatch<any>(deleteCategory(selectedDeleteId));
        await loadCategories(false);
        toast.success("Category deleted successfully");
        setDeleteModalOpen(false);
        setSelectedDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const toggleCategory = async (id: number) => {
    try {
      setTogglingId(id);
      const res = await apiConnector(
        "PATCH",
        `/category/${id}/toggle-status`
      );

      if (res?.data?.success) {
        toast.success("Category status updated");
        await loadCategories(false);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update category status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
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

  const formatDate = (dateString: string) => {
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
  const totalCategories = tableData.length;
  const activeCategories = tableData.filter((c) => c.isActive).length;
  const inactiveCategories = totalCategories - activeCategories;
  const withImages = tableData.filter((c) => c.imageUrl).length;

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
                Catalog
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Categories
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Category Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalCategories} total · {activeCategories} active ·{" "}
              {inactiveCategories} inactive
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadCategories()}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FaSyncAlt size={11} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link href="/category">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                <FaPlus size={12} />
                <span>New Category</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ============ STAT CARDS ============ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <FaFolder className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalCategories}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active
              </span>
              <FaCheckCircle className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeCategories}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Inactive
              </span>
              <FaTimesCircle className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {inactiveCategories}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                With Images
              </span>
              <FaImage className="text-amber-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {withImages}
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
                  count: totalCategories,
                  icon: FaFolder,
                },
                {
                  key: "active",
                  label: "Active",
                  count: activeCategories,
                  icon: FaCheckCircle,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: inactiveCategories,
                  icon: FaTimesCircle,
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
                <FaSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Search by name, slug or description..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    showFilters
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <FaFilter size={11} />
                  <span className="hidden sm:inline">Filters</span>
                  {showFilters ? (
                    <FaChevronUp size={9} />
                  ) : (
                    <FaChevronDown size={9} />
                  )}
                </button>

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
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Sort by
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={sortConfig.key}
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="name">Name</option>
                    <option value="id">ID</option>
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
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
                        Category {getSortIcon("name")}
                      </button>
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Slug
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Image
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
                          <FaFolder
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchTerm || statusFilter !== "all"
                              ? "No matching categories"
                              : "No categories available"}
                          </div>
                          <div className="text-xs">
                            {searchTerm || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "Create your first category to get started"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* ID */}
                        <TableCell className="!py-3 !px-3">
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            #{String(item.id).padStart(4, "0")}
                          </span>
                        </TableCell>

                        {/* NAME + DESCRIPTION */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
                              {item.name || "—"}
                            </span>
                            {item.description && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                                {item.description.length > 50
                                  ? item.description.substring(0, 50) + "..."
                                  : item.description}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* SLUG */}
                        <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                          {item.slug ? (
                            <code className="px-1.5 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                              {item.slug}
                            </code>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* IMAGE */}
                        <TableCell className="!py-3 !px-3">
                          {item.imageUrl ? (
                            <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                              <img
                                src={item.imageUrl}
                                alt={item.name || "Category image"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                              <FaImage size={12} />
                            </div>
                          )}
                        </TableCell>

                        {/* STATUS TOGGLE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleCategory(item.id)}
                              disabled={togglingId === item.id}
                              title={
                                item.isActive
                                  ? "Disable category"
                                  : "Enable category"
                              }
                              className={`relative inline-flex items-center cursor-pointer w-9 h-5 rounded-full transition-colors ${
                                item.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-300 dark:bg-slate-700"
                              } ${
                                togglingId === item.id
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              <span
                                className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                                  item.isActive ? "translate-x-4" : ""
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[11px] font-medium ${
                                item.isActive
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>

                        {/* CREATED */}
                        <TableCell className="!py-3 !px-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <FaCalendarAlt
                              size={10}
                              className="text-slate-400"
                            />
                            <span className="tabular-nums">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="!py-3 !px-3 text-right">
                          <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleView(item)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="View"
                            >
                              <FaEye size={13} />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/edit-category/${item.id}`)
                              }
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id)}
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
          <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* ============ MODALS ============ */}
      <ViewCategoryModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-50 dark:bg-red-950/40 rounded-full mb-4">
            <MdDeleteForever
              className="text-red-600 dark:text-red-400"
              size={22}
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
            Delete Category
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryTable;