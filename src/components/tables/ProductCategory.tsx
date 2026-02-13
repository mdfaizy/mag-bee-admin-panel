  "use client";

  import React, { useEffect, useState } from "react";
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
  import { FaEye, FaEdit, FaSearch, FaFilter, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
  import { MdDeleteForever } from "react-icons/md";
  // import {
  //   Table,
  //   TableHead,
  //   TableBody,
  //   TableRow,
  //   TableCell ,
  //   TableCell,
  // } from "../ui/table";
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
  import Pagination from "./Pagination";
  import { useRouter } from "next/navigation";
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;

  createdAt: string;   // 🔥 IMPORTANT
  updatedAt: string;   // 🔥 IMPORTANT
}
  const CategoryTable = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { categories } = useSelector((state: RootState) => state.category);



    const [tableData, setTableData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Filter and sort data
    const filteredAndSortedData = React.useMemo(() => {
      let filtered = tableData.filter(category =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Apply sorting
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

    // Fetch categories
    // useEffect(() => {
    //   const getCategories = async () => {
    //     try {
    //       setLoading(true);
    //       const result = await fetchProductCategory();
    //       // dispatch(setCategories(result));
    //     // console.log("Redux categories:", categories);

    //     console.log("result",result);

    //       // dispatch(setCategories(result.categories));
    //     } catch (error) {
    //       console.error("Failed to load categories", error);
    //       toast.error("Failed to load categories");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    //   getCategories();
    // }, [dispatch]);

    useEffect(() => {
  const getCategories = async () => {
    try {
      setLoading(true);
      const result = await fetchProductCategory();

      console.log("API result:", result);

      // ✅ THIS IS REQUIRED
      dispatch(setCategories(result));

    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  getCategories();
}, [dispatch]);


    // Sync Redux -> Local State
    useEffect(() => {
      setTableData(categories || []);
    }, [categories]);

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
          toast.success("Category deleted successfully");
          setDeleteModalOpen(false);
          setSelectedDeleteId(null);
        } catch (error) {
          toast.error("Failed to delete category");
        }
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      // <div className="bg-white rounded-xl shadow-sm p-4 text-gray-800 md:p-6 border dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white  ">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:text-white px-4 py-4"> 
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-2xl font-bold  mb-4 md:mb-0">Category Management</h1>
            <Link href='/category'>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <FaPlus size={14} />
                <span>Add Category</span>
              </button></Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories by name, description or slug..."
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

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={sortConfig.key}
                  onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                >
                  <option value="">Default</option>
                  <option value="name">Name</option>
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSortConfig({ key: "", direction: "asc" });
                  }}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableCell isHeader
                  className="cursor-pointer hover:bg-gray-100"
                // onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-1">
                    ID
                    {sortConfig.key === "id" && (
                      sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
                    )}
                  </div>
                </TableCell>
                <TableCell 
                  className="cursor-pointer hover:bg-gray-100"
                // onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig.key === "name" && (
                      sortConfig.direction === "asc" ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />
                    )}
                  </div>
                </TableCell>
                <TableCell  className="hidden md:table-cell">Description</TableCell >
                <TableCell  className="hidden lg:table-cell">Slug</TableCell>
                <TableCell >Image</TableCell>
                <TableCell  className="hidden lg:table-cell">Created</TableCell >
                <TableCell  className="hidden xl:table-cell">Updated</TableCell >
                <TableCell >Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-10 w-10 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell className="hidden xl:table-cell"><div className="h-4 bg-gray-200 rounded"></div></TableCell>
                    <TableCell><div className="h-8 w-20 bg-gray-200 rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : visibleData.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500">
                    {searchTerm ? "No categories found matching your search" : "No categories available"}
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 even:bg-gray-50/30 border-1 ">
                    <TableCell className="font-medium dark:text-white">{item.id}</TableCell>
                    <TableCell>
                      <div className="font-medium dark:text-white">{item.name || "—"}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell dark:text-white">
                      <div className="max-w-xs truncate" title={item.description}>
                        {item.description || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell ">
                      <span className="px-2 py-1 bg-gray-100  text-xs font-medium rounded-full">
                        {item.slug || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <div className="relative w-10 h-10">
                          <Image
                            src={item.imageUrl}
                            alt={item.name || "Category image"}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-white">{formatDate(item.createdAt)}</span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <span className="text-sm text-gray-600 dark:text-white">{formatDate(item.updatedAt)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View"
                        >
                          <FaEye size={16} />
                        </button>
                        {/* <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={16} />
                        </button> */}
                        <button
  onClick={() => router.push(`/edit-category/${item.id}`)}
  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
  title="Edit"
>
  <FaEdit size={16} />
</button>

                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <MdDeleteForever size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end px-4 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={tableData.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Modals */}
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
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <MdDeleteForever className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Category
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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