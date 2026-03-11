"use client";


import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { getSocket } from "@/services/lib/socket";
import { setBanners, setSelectedBanner,addBanner,
  updateBanner,
  removeBanner } from "@/redux/bannerSlice";
import { fetchBanner, fetchBannerById, toggleBannerStatus,deleteOfferBanner} from "@/services/bannerServices/BannerService";

import {
  Table, TableHeader, TableBody, TableRow, TableCell
} from "../ui/table";

import {
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

import Pagination from "./Pagination";
import EditOfferBannerModal from "../productOffer/EditBannerModal";

/* ---------------- TYPES ---------------- */
interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

/* ---------------- COMPONENT ---------------- */
const BannerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.banner);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editModalOpen, setEditModalOpen] = useState(false);

  /* ---------------- FETCH ALL ---------------- */
  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await fetchBanner();
      console.log("API banners:", res); 
      dispatch(setBanners(res));
    } catch {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    loadBanners();
  }, []);

 useEffect(() => {

  const socket = getSocket();

  console.log("🔌 Socket connected:", socket.id);

  socket.on("bannerCreated", (banner) => {
    dispatch(addBanner(banner));
  });

  socket.on("bannerUpdated", (banner) => {
    dispatch(updateBanner(banner));
  });

  socket.on("bannerDeleted", (id) => {
    dispatch(removeBanner(id));
  });

  socket.on("bannerStatusChanged", (banner) => {
    dispatch(updateBanner(banner));
  });

  return () => {
    socket.off("bannerCreated");
    socket.off("bannerUpdated");
    socket.off("bannerDeleted");
    socket.off("bannerStatusChanged");
  };

}, [dispatch]);
  /* ---------------- FILTER ---------------- */
  const filteredData = useMemo(() => {
    return banners.filter((b: Banner) =>
      [b.title, b.subtitle]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [banners, searchTerm]);

  /* ---------------- PAGINATION ---------------- */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDelete = async (id: number) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this banner?"
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);

    await dispatch(deleteOfferBanner(id));

    toast.success("Banner deleted successfully");

    loadBanners(); // refresh table

  } catch (error) {
    toast.error("Failed to delete banner");
  } finally {
    setLoading(false);
  }
};
  /* ---------------- EDIT (FIXED) ---------------- */
  const handleEdit = async (banner: Banner) => {
    try {
      // ✅ thunk ko dispatch karo
      await dispatch(fetchBannerById(banner.id));

      // ✅ modal open karo
      setEditModalOpen(true);
    } catch {
      toast.error("Failed to load banner details");
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      : "—";

  const handleToggleActive = async (id: number) => {
    try {
      await dispatch(toggleBannerStatus(id));
    } catch {
      toast.error("Error updating status");
    }
  };


  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <Link href="/banner">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <FaPlus size={14} /> Add Banner
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-lg">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search banner..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
        >
          <FaFilter />
          {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : visibleData.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-10">No banners found</TableCell>
              </TableRow>
            ) : (
              visibleData.map((item: Banner) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>

                  <TableCell>
                    <div className="relative w-12 h-12">
                      <Image src={item.imageUrl} alt={item.title} fill />
                    </div>
                  </TableCell>

                  {/* <TableCell>
                    {item.isActive ? "Active" : "Inactive"}
                  </TableCell> */}
                  <TableCell className="hidden md:table-cell">
                    <div
                      // onClick={() => handleToggleActive(item)}
                      onClick={() => handleToggleActive(item.id)}

                      className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-colors ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div
                        className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${item.isActive ? 'translate-x-6' : ''}`}
                      />
                    </div>
                  </TableCell>

                  <TableCell>{formatDate(item.startDate)}</TableCell>
                  <TableCell>{formatDate(item.endDate)}</TableCell>

                  <TableCell>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-yellow-600"
                    >
                      <FaEdit />
                    </button>
                    <button
  onClick={() => handleDelete(item.id)}
  className="p-2 text-red-600 hover:text-red-800"
>
  <MdDeleteForever />
</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        onPageChange={setCurrentPage}
      />

      {/* Edit Modal */}
      <EditOfferBannerModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          dispatch(setSelectedBanner(null));
          loadBanners();
        }}
      />
    </div>
  );
};

export default BannerTable;
