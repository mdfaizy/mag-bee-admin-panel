// "use client";

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import {
//   setSubCategories,
//   setSelectedSubCategory,
// } from "../../redux/productSubCategory"; // <-- naya slice
// import Link from "next/link";
// import {
//   fetchSubCategoryAll,
//   updateSubCategoryById,
  
// } from "../../services/subCategoryService/subCategoryService"; // <-- service file
// import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
// import {
//   Table, TableHeader, TableBody, TableRow, TableCell
// } from "../ui/table";
// import { Modal } from "../ui/modal";
// import Image from "next/image";
// import { toast } from "react-toastify";
// import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
// import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";

// const SubCategoryTable = () => {
//   const dispatch = useDispatch();
// //   const { selectedSubCategory } = useSelector((state: RootState) => state.SubCategoryState);
//   const { subCategories } = useSelector((state: RootState) => state.SubCategoryState);
//   const [tableData, setTableData] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
// const [viewModalOpen, setViewModalOpen] = useState(false);
// const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
//   const [loading, setLoading] = useState(false);
// // const [isOpen, setIsOpen] = React.useState(false);
//   const itemsPerPage = 10;
//   const startIndex = (currentPage - 1) * itemsPerPage;


//   console.log("SubCategoryTable data:", tableData);

//   // Filtering + Sorting
//   const filteredAndSortedData = React.useMemo(() => {
//     let filtered = tableData.filter(sub =>
//       sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sub.slug?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return filtered;
//   }, [tableData, searchTerm, sortConfig]);

//   const visibleData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
//   const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//   // Fetch subcategories
//   useEffect(() => {
//     const getSubCategories = async () => {
//       try {
//         setLoading(true);
//         const result = await fetchSubCategoryAll();
//          console.log("Final subcategories array:", result);
//         dispatch(setSubCategories(result));
//       } catch (error) {
//         console.error("Failed to load subcategories", error);
//         toast.error("Failed to load subcategories");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getSubCategories();
//   }, [dispatch]);

//   useEffect(() => {
//     setTableData(subCategories || []);
//   }, [subCategories]);

// const handleView = (id: number) => {
//   setSelectedSubCategoryId(id);
//   setViewModalOpen(true);
// };

// const handleEdit = (subCategory: any) => {
//   dispatch(setSelectedSubCategory(subCategory));
//   setEditModalOpen(true);
// };



//   const handleDeleteClick = (id: number) => {
//     setSelectedDeleteId(id);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (selectedDeleteId) {
//       try {
//         // await dispatch<any>(deleteSubCategory(selectedDeleteId));
//         toast.success("SubCategory deleted successfully");
//         setDeleteModalOpen(false);
//         setSelectedDeleteId(null);
//       } catch (error) {
//         toast.error("Failed to delete subcategory");
//       }
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 text-gray-800 md:p-6 border dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white">
//       {/* Header */}
//       <div className="flex flex-col gap-4 mb-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <h1 className="text-2xl font-bold mb-4 md:mb-0">SubCategory Management</h1>
//           <Link href="/subcategory">
//             <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
//               <FaPlus size={14} />
//               <span>Add SubCategory</span>
//             </button>
//           </Link>
//         </div>

//         {/* Search + Filter */}
//         <div className="flex flex-col md:flex-row gap-4 justify-between">
//           <div className="relative flex-1 max-w-2xl">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FaSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search subcategories..."
//               className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//             >
//               <FaFilter className="text-gray-600" />
//               <span className="hidden sm:inline">Filters</span>
//               {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <Table className="min-w-full">
//           <TableHeader className="bg-gray-50">
//             <TableRow>
//               <TableCell isHeader>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell className="hidden md:table-cell">Description</TableCell>
//               <TableCell className="hidden lg:table-cell">Slug</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Child SubCategories</TableCell>
//               <TableCell>Image</TableCell>
//               <TableCell className="hidden lg:table-cell">Created</TableCell>
//               <TableCell className="hidden xl:table-cell">Updated</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell >Loading...</TableCell></TableRow>
//             ) : visibleData.length === 0 ? (
//               <TableRow>
//                 <TableCell  className="text-center py-8 text-gray-500">
//                   {searchTerm ? "No subcategories found" : "No subcategories available"}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               visibleData.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{item?.id}</TableCell>
//                   <TableCell>{item?.name || "—"}</TableCell>
//                   <TableCell className="hidden md:table-cell">{item?.description
//     ? item.description.length > 30
//       ? item.description.substring(0, 30) + "..."
//       : item.description
//     : "—"}</TableCell>
//                   <TableCell className="hidden lg:table-cell">{item.slug || "—"}</TableCell>
//                   {/* <TableCell>{item.category?.name || "—"}</TableCell> */}
//                    <TableCell>{item.category?.name || "—"}</TableCell>
//                    <TableCell>
//   {item.children?.length > 0 ? (
//     <div className="flex flex-wrap gap-1">
//       {item.children.map((child: any) => (
//         <span
//           key={child.id}
//           className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md"
//         >
//           {child.name}
//         </span>
//       ))}
//     </div>
//   ) : (
//     <span className="text-gray-400">—</span>
//   )}
// </TableCell>
//                   <TableCell>
//                     {item.imageUrl ? (
//                       <div className="relative w-10 h-10">
//                         <img src={item.imageUrl} alt={item.name || "image"}  className="object-cover rounded-md" />
//                       </div>
//                     ) : (
//                       <span className="text-gray-400">—</span>
//                     )}
//                   </TableCell>
//                   <TableCell className="hidden lg:table-cell">{formatDate(item.createdAt)}</TableCell>
//                   <TableCell className="hidden xl:table-cell">{formatDate(item.updatedAt)}</TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <button onClick={() => handleView(item.id)} className="p-2 text-blue-600"><FaEye /></button>

//                       <button onClick={() => handleEdit(item)} className="p-2 text-yellow-600"><FaEdit /></button>
//                       <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-red-600"><MdDeleteForever /></button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Modals */}
//    <ViewSubCategoryModal
//   isOpen={viewModalOpen}
//   onClose={() => setViewModalOpen(false)}
//   data={tableData.find(sub => sub.id === selectedSubCategoryId) || null}
// />

     
// <EditSubCategoryModal
//  isOpen={editModalOpen}
//         onClose={() => setEditModalOpen(false)}
// />

//       {/* Delete Modal */}
//       <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="max-w-md">
//         <div className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete SubCategory</h3>
//           <p className="text-sm text-gray-500 text-center mb-6">Are you sure?</p>
//           <div className="flex justify-center gap-3">
//             <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm bg-gray-100">Cancel</button>
//             <button onClick={confirmDelete} className="px-4 py-2 text-sm text-white bg-red-600">Delete</button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SubCategoryTable;


"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubCategories,
  setSelectedSubCategory,
} from "../../redux/productSubCategory";
import Link from "next/link";
import { fetchSubCategoryAll } from "../../services/subCategoryService/subCategoryService";
import {
  FaEye,
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaLayerGroup,
  FaFolderOpen,
  FaImage,
  FaSyncAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSitemap,
  FaCalendarAlt,
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
import Image from "next/image";
import { toast } from "react-toastify";
import ViewSubCategoryModal from "../SubCategory/ViewSubCategoryModal";
import EditSubCategoryModal from "../SubCategory/EditSubCategoryModal";
import Pagination from "./Pagination";

const SubCategoryTable = () => {
  const dispatch = useDispatch();
  const { subCategories } = useSelector(
    (state: RootState) => state.SubCategoryState
  );

  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* =======================================================
     FILTER + SORT
  ======================================================= */
  const filteredAndSortedData = React.useMemo(() => {
    let filtered = tableData.filter(
      (sub) =>
        sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (sub) => sub.category?.name === categoryFilter
      );
    }

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
  }, [tableData, searchTerm, sortConfig, categoryFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  /* =======================================================
     UNIQUE CATEGORIES
  ======================================================= */
  const categories = React.useMemo(() => {
    return Array.from(
      new Map(
        tableData
          .filter((s) => s.category)
          .map((s) => [s.category.id, s.category])
      ).values()
    );
  }, [tableData]);

  /* =======================================================
     FETCH
  ======================================================= */
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

  /* =======================================================
     HANDLERS
  ======================================================= */
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
        toast.success("SubCategory deleted successfully");
        setDeleteModalOpen(false);
        setSelectedDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete subcategory");
      }
    }
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =======================================================
     STATS
  ======================================================= */
  const totalSubCategories = tableData.length;
  const withChildren = tableData.filter(
    (s) => s.children?.length > 0
  ).length;
  const withImages = tableData.filter((s) => s.imageUrl).length;
  const totalChildren = tableData.reduce(
    (acc, s) => acc + (s.children?.length || 0),
    0
  );

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
                Taxonomy
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              SubCategory Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalSubCategories} subcategories · {withChildren} with children
              · {totalChildren} total child items
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const getSubCategories = async () => {
                  setLoading(true);
                  try {
                    const result = await fetchSubCategoryAll();
                    dispatch(setSubCategories(result));
                  } finally {
                    setLoading(false);
                  }
                };
                getSubCategories();
              }}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FaSyncAlt size={11} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link href="/subcategory">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                <FaPlus size={12} />
                <span>New SubCategory</span>
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
              <FaLayerGroup className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalSubCategories}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                With Children
              </span>
              <FaSitemap className="text-blue-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {withChildren}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Child Items
              </span>
              <FaFolderOpen className="text-purple-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalChildren}
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
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
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
                    <option value="createdAt">Created</option>
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
            <div className="min-w-[1100px] lg:min-w-full">
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
                        Name {getSortIcon("name")}
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
                      Category
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Children
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Image
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Created
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
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j} className="!py-3 !px-3">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-16 text-sm text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <FaLayerGroup
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            {searchTerm
                              ? "No subcategories match your search"
                              : "No subcategories available"}
                          </div>
                          <div className="text-xs">
                            {searchTerm
                              ? "Try a different keyword"
                              : "Create your first subcategory to get started"}
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

                        {/* NAME + DESC */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                              {item?.name || "—"}
                            </span>
                            {item?.description && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                                {item.description.length > 40
                                  ? item.description.substring(0, 40) + "..."
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

                        {/* CATEGORY */}
                        <TableCell className="!py-3 !px-3">
                          {item.category?.name ? (
                            <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                              {item.category.name}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">
                              —
                            </span>
                          )}
                        </TableCell>

                        {/* CHILDREN */}
                        <TableCell className="!py-3 !px-3">
                          {item.children?.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {item.children.slice(0, 3).map((child: any) => (
                                <span
                                  key={child.id}
                                  className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded"
                                >
                                  {child.name}
                                </span>
                              ))}
                              {item.children.length > 3 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                                  +{item.children.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700 text-xs">
                              none
                            </span>
                          )}
                        </TableCell>

                        {/* IMAGE */}
                        <TableCell className="!py-3 !px-3">
                          {item.imageUrl ? (
                            <div className="relative w-10 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                              <img
                                src={item.imageUrl}
                                alt={item.name || "image"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                              <FaImage size={12} />
                            </div>
                          )}
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
                              onClick={() => handleView(item.id)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="View"
                            >
                              <FaEye size={13} />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
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

      {/* =====================================================
          MODALS
      ===================================================== */}
      <ViewSubCategoryModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        data={
          tableData.find((sub) => sub.id === selectedSubCategoryId) || null
        }
      />

      <EditSubCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6 bg-white dark:bg-slate-900 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 mx-auto mb-4">
            <MdDeleteForever
              className="text-red-600 dark:text-red-400"
              size={22}
            />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-2">
            Delete SubCategory
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
            Are you sure? This action cannot be undone.
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

export default SubCategoryTable;