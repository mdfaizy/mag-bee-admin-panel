  // "use client";


  // import React, { useEffect, useMemo, useState } from "react";
  // import { useDispatch, useSelector } from "react-redux";
  // import { AppDispatch, RootState } from "@/redux/store";
  // import Link from "next/link";
  // import Image from "next/image";
  // import { toast } from "react-toastify";
  // import { getSocket } from "@/services/lib/socket";
  // import { setBanners, setSelectedBanner,addBanner,
  //   updateBanner,
  //   removeBanner } from "@/redux/bannerSlice";
  // import { fetchBanner, fetchBannerById, toggleBannerStatus,deleteOfferBanner} from "@/services/bannerServices/BannerService";

  // import {
  //   Table, TableHeader, TableBody, TableRow, TableCell
  // } from "../ui/table";

  // import {
  //   FaEdit,
  //   FaSearch,
  //   FaFilter,
  //   FaChevronDown,
  //   FaChevronUp,
  //   FaPlus,
  // } from "react-icons/fa";
  // import { MdDeleteForever } from "react-icons/md";

  // import Pagination from "./Pagination";
  // import EditOfferBannerModal from "../productOffer/EditBannerModal";

  // /* ---------------- TYPES ---------------- */
  // interface Banner {
  //   id: number;
  //   title: string;
  //   subtitle?: string;
  //   imageUrl: string;
  //   isActive: boolean;
  //   startDate?: string;
  //   endDate?: string;
  // }

  // /* ---------------- COMPONENT ---------------- */
  // const BannerTable = () => {
  //   const dispatch = useDispatch<AppDispatch>();
  //   const { banners } = useSelector((state: RootState) => state.banner);

  //   const [loading, setLoading] = useState(false);
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [showFilters, setShowFilters] = useState(false);

  //   const [currentPage, setCurrentPage] = useState(1);
  //   const itemsPerPage = 10;

  //   const [editModalOpen, setEditModalOpen] = useState(false);

  //   /* ---------------- FETCH ALL ---------------- */
  //   const loadBanners = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetchBanner();
  //       console.log("API banners:", res); 
  //       dispatch(setBanners(res));
  //     } catch {
  //       toast.error("Failed to load banners");
  //     } finally {
  //       setLoading(false);
  //     } 
  //   };

  //   useEffect(() => {
  //     loadBanners();
  //   }, []);

  // useEffect(() => {

  //   const socket = getSocket();

  //   console.log("🔌 Socket connected:", socket.id);

  //   socket.on("bannerCreated", (banner) => {
  //     dispatch(addBanner(banner));
  //   });

  //   socket.on("bannerUpdated", (banner) => {
  //     dispatch(updateBanner(banner));
  //   });

  //   socket.on("bannerDeleted", (id) => {
  //     dispatch(removeBanner(id));
  //   });

  //   socket.on("bannerStatusChanged", (banner) => {
  //     dispatch(updateBanner(banner));
  //   });

  //   return () => {
  //     socket.off("bannerCreated");
  //     socket.off("bannerUpdated");
  //     socket.off("bannerDeleted");
  //     socket.off("bannerStatusChanged");
  //   };

  // }, [dispatch]);
  //   /* ---------------- FILTER ---------------- */
  //   const filteredData = useMemo(() => {
  //     return banners.filter((b: Banner) =>
  //       [b.title, b.subtitle]
  //         .join(" ")
  //         .toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //     );
  //   }, [banners, searchTerm]);

  //   /* ---------------- PAGINATION ---------------- */
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //   const handleDelete = async (id: number) => {

  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this banner?"
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     setLoading(true);

  //     await dispatch(deleteOfferBanner(id));

  //     toast.success("Banner deleted successfully");

  //     loadBanners(); // refresh table

  //   } catch (error) {
  //     toast.error("Failed to delete banner");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //   /* ---------------- EDIT (FIXED) ---------------- */
  //   const handleEdit = async (banner: Banner) => {
  //     try {
  //       // ✅ thunk ko dispatch karo
  //       await dispatch(fetchBannerById(banner.id));

  //       // ✅ modal open karo
  //       setEditModalOpen(true);
  //     } catch {
  //       toast.error("Failed to load banner details");
  //     }
  //   };

  //   const formatDate = (date?: string) =>
  //     date
  //       ? new Date(date).toLocaleDateString("en-IN", {
  //         day: "numeric",
  //         month: "short",
  //         year: "numeric",
  //       })
  //       : "—";

  //   // const handleToggleActive = async (id: number) => {
  //   //   try {
  //   //     await dispatch(toggleBannerStatus(id));
  //   //   } catch {
  //   //     toast.error("Error updating status");
  //   //   }
  //   // };

  //   const handleToggleActive = async (
  //   id: number
  // ) => {

  //   try {

  //     await dispatch(
  //       toggleBannerStatus(id)
  //     );

  //     // ✅ REFRESH ALL BANNERS
  //     await loadBanners();

  //     // toast.success(
  //     //   "Banner status updated"
  //     // );

  //   } catch {

  //     toast.error(
  //       "Error updating status"
  //     );
  //   }
  // };


  //   /* ---------------- UI ---------------- */
  //   return (
  //     <div className="bg-white rounded-xl shadow-sm p-6 border">
  //       {/* Header */}
  //       <div className="flex justify-between items-center mb-6">
  //         <h1 className="text-2xl font-bold">Banner Management</h1>
  //         <Link href="/banner">
  //           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
  //             <FaPlus size={14} /> Add Banner
  //           </button>
  //         </Link>
  //       </div>

  //       {/* Search */}
  //       <div className="flex gap-3 mb-4">
  //         <div className="relative flex-1 max-w-lg">
  //           <FaSearch className="absolute left-3 top-3 text-gray-400" />
  //           <input
  //             type="text"
  //             placeholder="Search banner..."
  //             className="pl-10 pr-4 py-2 w-full border rounded-lg"
  //             value={searchTerm}
  //             onChange={(e) => setSearchTerm(e.target.value)}
  //           />
  //         </div>

  //         <button
  //           onClick={() => setShowFilters(!showFilters)}
  //           className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"
  //         >
  //           <FaFilter />
  //           {showFilters ? <FaChevronUp /> : <FaChevronDown />}
  //         </button>
  //       </div>

  //       {/* Table */}
  //       <div className="overflow-x-auto border rounded-lg">
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               <TableCell isHeader>ID</TableCell>
  //               <TableCell>Title</TableCell>
  //               <TableCell>Image</TableCell>
  //               <TableCell>Status</TableCell>
  //               <TableCell>Start</TableCell>
  //               <TableCell>End</TableCell>
  //               <TableCell>Actions</TableCell>
  //             </TableRow>
  //           </TableHeader>

  //           <TableBody>
  //             {loading ? (
  //               <TableRow>
  //                 <TableCell className="text-center py-10">Loading...</TableCell>
  //               </TableRow>
  //             ) : visibleData.length === 0 ? (
  //               <TableRow>
  //                 <TableCell className="text-center py-10">No banners found</TableCell>
  //               </TableRow>
  //             ) : (
  //               visibleData.map((item: Banner) => (
  //                 <TableRow key={item.id}>
  //                   <TableCell>{item.id}</TableCell>
  //                   <TableCell>{item.title}</TableCell>

  //                   <TableCell>
  //                     <div className="relative w-12 h-12">
  //                       <Image src={item.imageUrl} alt={item.title} fill />
  //                     </div>
  //                   </TableCell>

  //                   {/* <TableCell>
  //                     {item.isActive ? "Active" : "Inactive"}
  //                   </TableCell> */}
  //                   <TableCell className="hidden md:table-cell">
  //                     <div
  //                       // onClick={() => handleToggleActive(item)}
  //                       onClick={() => handleToggleActive(item.id)}

  //                       className={`relative inline-flex items-center cursor-pointer w-12 h-6 rounded-full transition-colors ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
  //                     >
  //                       <div
  //                         className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${item.isActive ? 'translate-x-6' : ''}`}
  //                       />
  //                     </div>
  //                   </TableCell>

  //                   <TableCell>{formatDate(item.startDate)}</TableCell>
  //                   <TableCell>{formatDate(item.endDate)}</TableCell>

  //                   <TableCell>
  //                     <button
  //                       onClick={() => handleEdit(item)}
  //                       className="p-2 text-yellow-600"
  //                     >
  //                       <FaEdit />
  //                     </button>
  //                     <button
  //   onClick={() => handleDelete(item.id)}
  //   className="p-2 text-red-600 hover:text-red-800"
  // >
  //   <MdDeleteForever />
  // </button>
  //                   </TableCell>
  //                 </TableRow>
  //               ))
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>

  //       {/* Pagination */}
  //       <Pagination
  //         currentPage={currentPage}
  //         totalPages={totalPages}
  //         itemsPerPage={itemsPerPage}
  //         totalItems={filteredData.length}
  //         onPageChange={setCurrentPage}
  //       />

  //       {/* Edit Modal */}
  //       <EditOfferBannerModal
  //         isOpen={editModalOpen}
  //         onClose={() => {
  //           setEditModalOpen(false);
  //           dispatch(setSelectedBanner(null));
  //           loadBanners();
  //         }}
  //       />
  //     </div>
  //   );
  // };

  // export default BannerTable;



//   "use client";

// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useDispatch,
//   useSelector,
// } from "react-redux";

// import {
//   AppDispatch,
//   RootState,
// } from "@/redux/store";

// import Link from "next/link";
// import Image from "next/image";

// import { toast } from "react-toastify";

// import { getSocket } from "@/services/lib/socket";

// import {
//   setBanners,
//   setSelectedBanner,
//   addBanner,
//   updateBanner,
//   removeBanner,
// } from "@/redux/bannerSlice";

// import {
//   fetchBanner,
//   fetchBannerById,
//   toggleBannerStatus,
//   deleteOfferBanner,
// } from "@/services/bannerServices/BannerService";

// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "../ui/table";

// import {
//   FaEdit,
//   FaSearch,
//   FaFilter,
//   FaChevronDown,
//   FaChevronUp,
//   FaPlus,
// } from "react-icons/fa";

// import { MdDeleteForever } from "react-icons/md";

// import Pagination from "./Pagination";
// import EditOfferBannerModal from "../productOffer/EditBannerModal";


// /* =========================================================
//    TYPES
// ========================================================= */

// interface Banner {
//   id: number;

//   title: string;

//   subtitle?: string;

//   imageUrl: string;

//   /*
//    * Admin manually controls this
//    */
//   isEnabled: boolean;

//   /*
//    * Backend/date controls this
//    */
//   isActive: boolean;

//   startDate?: string;

//   endDate?: string;
// }


// /* =========================================================
//    COMPONENT
// ========================================================= */

// const BannerTable = () => {

//   const dispatch =
//     useDispatch<AppDispatch>();

//   const { banners } =
//     useSelector(
//       (state: RootState) =>
//         state.banner
//     );


//   /* =======================================================
//      STATES
//   ======================================================= */

//   const [loading, setLoading] =
//     useState(false);

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const [showFilters, setShowFilters] =
//     useState(false);

//   const [currentPage, setCurrentPage] =
//     useState(1);

//   const itemsPerPage = 10;

//   const [editModalOpen, setEditModalOpen] =
//     useState(false);


//   /* =======================================================
//      FETCH ALL BANNERS
//   ======================================================= */

//   const loadBanners = async () => {

//     try {

//       setLoading(true);

//       const res =
//         await fetchBanner();

//       console.log(
//         "API banners:",
//         res
//       );

//       dispatch(
//         setBanners(res)
//       );

//     } catch (error) {

//       console.error(
//         "Failed to load banners:",
//         error
//       );

//       toast.error(
//         "Failed to load banners"
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {

//     loadBanners();

//   }, []);


//   /* =======================================================
//      SOCKET EVENTS
//   ======================================================= */

//   useEffect(() => {

//     const socket =
//       getSocket();

//     console.log(
//       "🔌 Socket connected:",
//       socket.id
//     );


//     /* -----------------------------------------------------
//        BANNER CREATED
//     ----------------------------------------------------- */

//     socket.on(
//       "bannerCreated",
//       (banner: Banner) => {

//         dispatch(
//           addBanner(banner)
//         );

//       }
//     );


//     /* -----------------------------------------------------
//        BANNER UPDATED
//     ----------------------------------------------------- */

//     socket.on(
//       "bannerUpdated",
//       (banner: Banner) => {

//         dispatch(
//           updateBanner(banner)
//         );

//       }
//     );


//     /* -----------------------------------------------------
//        BANNER DELETED
//     ----------------------------------------------------- */

//     socket.on(
//       "bannerDeleted",
//       (id: number) => {

//         dispatch(
//           removeBanner(id)
//         );

//       }
//     );


//     /* -----------------------------------------------------
//        STATUS CHANGED
//     ----------------------------------------------------- */

//     socket.on(
//       "bannerStatusChanged",
//       (banner: Banner) => {

//         dispatch(
//           updateBanner(banner)
//         );

//       }
//     );


//     /* -----------------------------------------------------
//        CLEANUP
//     ----------------------------------------------------- */

//     return () => {

//       socket.off(
//         "bannerCreated"
//       );

//       socket.off(
//         "bannerUpdated"
//       );

//       socket.off(
//         "bannerDeleted"
//       );

//       socket.off(
//         "bannerStatusChanged"
//       );

//     };

//   }, [dispatch]);


//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const filteredData =
//     useMemo(() => {

//       return banners.filter(
//         (b: Banner) =>
//           [
//             b.title,
//             b.subtitle,
//           ]
//             .join(" ")
//             .toLowerCase()
//             .includes(
//               searchTerm
//                 .toLowerCase()
//             )
//       );

//     }, [
//       banners,
//       searchTerm,
//     ]);


//   /* =======================================================
//      PAGINATION
//   ======================================================= */

//   const startIndex =
//     (currentPage - 1) *
//     itemsPerPage;

//   const visibleData =
//     filteredData.slice(
//       startIndex,
//       startIndex + itemsPerPage
//     );

//   const totalPages =
//     Math.ceil(
//       filteredData.length /
//         itemsPerPage
//     );


//   /* =======================================================
//      DELETE
//   ======================================================= */

//   const handleDelete =
//     async (id: number) => {

//       const confirmDelete =
//         window.confirm(
//           "Are you sure you want to delete this banner?"
//         );

//       if (!confirmDelete) {
//         return;
//       }

//       try {

//         setLoading(true);

//         await dispatch(
//           deleteOfferBanner(id)
//         );

//         /*
//          * Socket already updates Redux.
//          * No need to manually add/remove here.
//          */

//       } catch (error) {

//         toast.error(
//           "Failed to delete banner"
//         );

//       } finally {

//         setLoading(false);

//       }
//     };


//   /* =======================================================
//      EDIT
//   ======================================================= */

//   const handleEdit =
//     async (banner: Banner) => {

//       try {

//         await dispatch(
//           fetchBannerById(
//             banner.id
//           )
//         );

//         setEditModalOpen(
//           true
//         );

//       } catch {

//         toast.error(
//           "Failed to load banner details"
//         );

//       }
//     };


//   /* =======================================================
//      DATE FORMAT
//   ======================================================= */

//   const formatDate =
//     (date?: string) =>
//       date
//         ? new Date(
//             date
//           ).toLocaleDateString(
//             "en-IN",
//             {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             }
//           )
//         : "—";


//   /* =======================================================
//      TOGGLE ENABLE / DISABLE
//   ======================================================= */

//   const handleToggleActive =
//     async (id: number) => {

//       try {

//         /*
//          * Backend will toggle:
//          *
//          * isEnabled
//          *
//          * and calculate:
//          *
//          * isActive
//          */

//         await dispatch(
//           toggleBannerStatus(id)
//         );

//         /*
//          * Redux already receives
//          * updated banner.
//          *
//          * loadBanners is kept here so
//          * table always has latest DB data.
//          */

//         await loadBanners();

//       } catch {

//         toast.error(
//           "Error updating status"
//         );

//       }
//     };


//   /* =======================================================
//      UI
//   ======================================================= */

//   return (
//     <div
//       className="
//         bg-white
//         rounded-xl
//         shadow-sm
//         p-6
//         border
//       "
//     >

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div
//         className="
//           flex
//           justify-between
//           items-center
//           mb-6
//         "
//       >

//         <h1
//           className="
//             text-2xl
//             font-bold
//           "
//         >
//           Banner Management
//         </h1>


//         <Link href="/banner">

//           <button
//             className="
//               flex
//               items-center
//               gap-2
//               px-4
//               py-2
//               bg-blue-600
//               text-white
//               rounded-lg
//               hover:bg-blue-700
//               transition
//             "
//           >

//             <FaPlus size={14} />

//             Add Banner

//           </button>

//         </Link>

//       </div>


//       {/* =====================================================
//           SEARCH
//       ===================================================== */}

//       <div
//         className="
//           flex
//           gap-3
//           mb-4
//         "
//       >

//         <div
//           className="
//             relative
//             flex-1
//             max-w-lg
//           "
//         >

//           <FaSearch
//             className="
//               absolute
//               left-3
//               top-3
//               text-gray-400
//             "
//           />

//           <input
//             type="text"
//             placeholder="Search banner..."
//             className="
//               pl-10
//               pr-4
//               py-2
//               w-full
//               border
//               rounded-lg
//               outline-none
//               focus:ring-2
//               focus:ring-blue-500
//             "
//             value={searchTerm}
//             onChange={(e) =>
//               setSearchTerm(
//                 e.target.value
//               )
//             }
//           />

//         </div>


//         <button
//           onClick={() =>
//             setShowFilters(
//               !showFilters
//             )
//           }
//           className="
//             px-4
//             py-2
//             bg-gray-100
//             rounded-lg
//             flex
//             items-center
//             gap-2
//           "
//         >

//           <FaFilter />

//           {showFilters ? (
//             <FaChevronUp />
//           ) : (
//             <FaChevronDown />
//           )}

//         </button>

//       </div>


//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div
//         className="
//           overflow-x-auto
//           border
//           rounded-lg
//         "
//       >

//         <Table>

//           <TableHeader>

//             <TableRow>

//               <TableCell isHeader>
//                 ID
//               </TableCell>

//               <TableCell isHeader>
//                 Title
//               </TableCell>

//               <TableCell isHeader>
//                 Image
//               </TableCell>

//               <TableCell isHeader>
//                 Status
//               </TableCell>

//               <TableCell isHeader>
//                 Start
//               </TableCell>

//               <TableCell isHeader>
//                 End
//               </TableCell>

//               <TableCell isHeader>
//                 Actions
//               </TableCell>

//             </TableRow>

//           </TableHeader>


//           <TableBody>

//             {/* =================================================
//                 LOADING
//             ================================================= */}

//             {loading ? (

//               <TableRow>

//                 <TableCell
//                   className="
//                     text-center
//                     py-10
//                   "
//                 >
//                   Loading...
//                 </TableCell>

//               </TableRow>

//             ) : visibleData.length === 0 ? (

//               /* ===============================================
//                  EMPTY
//               =============================================== */

//               <TableRow>

//                 <TableCell
//                   className="
//                     text-center
//                     py-10
//                   "
//                 >
//                   No banners found
//                 </TableCell>

//               </TableRow>

//             ) : (

//               /* ===============================================
//                  DATA
//               =============================================== */

//               visibleData.map(
//                 (item: Banner) => (

//                   <TableRow
//                     key={item.id}
//                   >

//                     {/* ID */}

//                     <TableCell>
//                       {item.id}
//                     </TableCell>


//                     {/* TITLE */}

//                     <TableCell>
//                       {item.title}
//                     </TableCell>


//                     {/* IMAGE */}

//                     <TableCell>

//                       <div
//                         className="
//                           relative
//                           w-12
//                           h-12
//                         "
//                       >

//                         <Image
//                           src={
//                             item.imageUrl
//                           }
//                           alt={
//                             item.title
//                           }
//                           fill
//                           className="
//                             object-cover
//                             rounded
//                           "
//                         />

//                       </div>

//                     </TableCell>


//                     {/* =================================================
//                         ADMIN ENABLE/DISABLE TOGGLE
//                     ================================================= */}

//                     <TableCell>

//                       <div
//                         onClick={() =>
//                           handleToggleActive(
//                             item.id
//                           )
//                         }
//                         title={
//                           item.isEnabled
//                             ? "Disable banner"
//                             : "Enable banner"
//                         }
//                         className={`
//                           relative
//                           inline-flex
//                           items-center
//                           cursor-pointer
//                           w-12
//                           h-6
//                           rounded-full
//                           transition-colors
//                           ${
//                             item.isEnabled
//                               ? "bg-green-500"
//                               : "bg-gray-300"
//                           }
//                         `}
//                       >

//                         <div
//                           className={`
//                             absolute
//                             left-0.5
//                             top-0.5
//                             w-5
//                             h-5
//                             rounded-full
//                             bg-white
//                             shadow-sm
//                             transform
//                             transition-transform
//                             ${
//                               item.isEnabled
//                                 ? "translate-x-6"
//                                 : ""
//                             }
//                           `}
//                         />

//                       </div>

//                       {/* Actual backend status */}

//                       <span
//                         className={`
//                           ml-2
//                           text-xs
//                           font-medium
//                           ${
//                             item.isActive
//                               ? "text-green-600"
//                               : "text-gray-500"
//                           }
//                         `}
//                       >
//                         {item.isActive
//                           ? "Active"
//                           : "Inactive"}
//                       </span>

//                     </TableCell>


//                     {/* START DATE */}

//                     <TableCell>
//                       {formatDate(
//                         item.startDate
//                       )}
//                     </TableCell>


//                     {/* END DATE */}

//                     <TableCell>
//                       {formatDate(
//                         item.endDate
//                       )}
//                     </TableCell>


//                     {/* ACTIONS */}

//                     <TableCell>

//                       <button
//                         onClick={() =>
//                           handleEdit(
//                             item
//                           )
//                         }
//                         className="
//                           p-2
//                           text-yellow-600
//                           hover:text-yellow-800
//                         "
//                         title="Edit banner"
//                       >
//                         <FaEdit />
//                       </button>


//                       <button
//                         onClick={() =>
//                           handleDelete(
//                             item.id
//                           )
//                         }
//                         className="
//                           p-2
//                           text-red-600
//                           hover:text-red-800
//                         "
//                         title="Delete banner"
//                       >
//                         <MdDeleteForever />
//                       </button>

//                     </TableCell>

//                   </TableRow>

//                 )
//               )

//             )}

//           </TableBody>

//         </Table>

//       </div>


//       {/* =====================================================
//           PAGINATION
//       ===================================================== */}

//       <Pagination
//         currentPage={
//           currentPage
//         }
//         totalPages={
//           totalPages
//         }
//         itemsPerPage={
//           itemsPerPage
//         }
//         totalItems={
//           filteredData.length
//         }
//         onPageChange={
//           setCurrentPage
//         }
//       />


//       {/* =====================================================
//           EDIT MODAL
//       ===================================================== */}

//       <EditOfferBannerModal
//         isOpen={
//           editModalOpen
//         }
//         onClose={() => {

//           setEditModalOpen(
//             false
//           );

//           dispatch(
//             setSelectedBanner(
//               null
//             )
//           );

//           loadBanners();

//         }}
//       />

//     </div>
//   );
// };


// export default BannerTable;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { getSocket } from "@/services/lib/socket";
import {
  setBanners,
  setSelectedBanner,
  addBanner,
  updateBanner,
  removeBanner,
} from "@/redux/bannerSlice";
import {
  fetchBanner,
  fetchBannerById,
  toggleBannerStatus,
  deleteOfferBanner,
} from "@/services/bannerServices/BannerService";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import {
  FaEdit,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaImage,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Pagination from "./Pagination";
import EditOfferBannerModal from "../productOffer/EditBannerModal";

/* =========================================================
   TYPES
========================================================= */
interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  isEnabled: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

/* =========================================================
   COMPONENT
========================================================= */
const BannerTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.banner);

  /* =======================================================
     STATES
  ======================================================= */
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "enabled" | "disabled" | "active" | "inactive"
  >("all");

  /* =======================================================
     FETCH ALL BANNERS
  ======================================================= */
  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await fetchBanner();
      dispatch(setBanners(res));
    } catch (error) {
      console.error("Failed to load banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */
  useEffect(() => {
    loadBanners();
  }, []);

  /* =======================================================
     SOCKET EVENTS
  ======================================================= */
  useEffect(() => {
    const socket = getSocket();

    socket.on("bannerCreated", (banner: Banner) => {
      dispatch(addBanner(banner));
      toast.info("New banner added");
    });

    socket.on("bannerUpdated", (banner: Banner) => {
      dispatch(updateBanner(banner));
    });

    socket.on("bannerDeleted", (id: number) => {
      dispatch(removeBanner(id));
    });

    socket.on("bannerStatusChanged", (banner: Banner) => {
      dispatch(updateBanner(banner));
    });

    return () => {
      socket.off("bannerCreated");
      socket.off("bannerUpdated");
      socket.off("bannerDeleted");
      socket.off("bannerStatusChanged");
    };
  }, [dispatch]);

  /* =======================================================
     FILTER + SEARCH
  ======================================================= */
  const filteredData = useMemo(() => {
    let data = banners.filter((b: Banner) =>
      [b.title, b.subtitle].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter === "enabled") {
      data = data.filter((b: Banner) => b.isEnabled);
    } else if (statusFilter === "disabled") {
      data = data.filter((b: Banner) => !b.isEnabled);
    } else if (statusFilter === "active") {
      data = data.filter((b: Banner) => b.isActive);
    } else if (statusFilter === "inactive") {
      data = data.filter((b: Banner) => !b.isActive);
    }

    return data;
  }, [banners, searchTerm, statusFilter]);

  /* =======================================================
     PAGINATION
  ======================================================= */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  /* =======================================================
     DELETE
  ======================================================= */
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await dispatch(deleteOfferBanner(id));
      toast.success("Banner deleted");
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */
  const handleEdit = async (banner: Banner) => {
    try {
      await dispatch(fetchBannerById(banner.id));
      setEditModalOpen(true);
    } catch {
      toast.error("Failed to load banner details");
    }
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  /* =======================================================
     TOGGLE ENABLE / DISABLE
  ======================================================= */
  const handleToggleActive = async (id: number) => {
    try {
      await dispatch(toggleBannerStatus(id));
      await loadBanners();
    } catch {
      toast.error("Error updating status");
    }
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  /* =======================================================
     STATS
  ======================================================= */
  const totalBanners = banners.length;
  const enabledBanners = banners.filter((b) => b.isEnabled).length;
  const activeBanners = banners.filter((b) => b.isActive).length;
  const inactiveBanners = banners.filter((b) => !b.isActive).length;

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
                Marketing
              </span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                Banners
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Banner Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalBanners} total · {enabledBanners} enabled · {activeBanners}{" "}
              currently live
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadBanners}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <FaSyncAlt size={11} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link href="/banner">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-md transition-colors shadow-sm">
                <FaPlus size={12} />
                <span>New Banner</span>
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
              <FaImage className="text-slate-400" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {totalBanners}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Enabled
              </span>
              <FaCheckCircle className="text-emerald-500" size={14} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {enabledBanners}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Live Now
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
              {activeBanners}
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
              {inactiveBanners}
            </div>
          </div>
        </div>

        {/* ============ MAIN PANEL ============ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* -------- TABS -------- */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
              {[
                { key: "all", label: "All", count: totalBanners, icon: FaImage },
                {
                  key: "enabled",
                  label: "Enabled",
                  count: enabledBanners,
                  icon: FaCheckCircle,
                },
                {
                  key: "active",
                  label: "Live",
                  count: activeBanners,
                  icon: FaCalendarAlt,
                },
                {
                  key: "disabled",
                  label: "Disabled",
                  count: totalBanners - enabledBanners,
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
                  placeholder="Search banners by title or subtitle..."
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
              </div>
            </div>

            {showFilters && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-md border border-slate-200 dark:border-slate-800">
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
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                    <option value="active">Live (Active)</option>
                    <option value="inactive">Not Live</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 flex items-end">
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
            <div className="min-w-[900px] lg:min-w-full">
              <Table className="min-w-full">
                <TableHeader className="bg-slate-50 dark:bg-slate-950/60">
                  <TableRow className="border-b border-slate-200 dark:border-slate-800">
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Banner
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Preview
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Enabled
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Live Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="!py-2.5 !px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      Schedule
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
                    Array.from({ length: 5 }).map((_, i) => (
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
                          <FaImage
                            className="text-slate-300 dark:text-slate-700"
                            size={32}
                          />
                          <div className="font-medium text-slate-700 dark:text-slate-300">
                            No banners found
                          </div>
                          <div className="text-xs">
                            Try adjusting your search or filters
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((item: Banner) => (
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

                        {/* TITLE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* IMAGE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="relative w-16 h-10 rounded overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            <Image
                              // src={item.imageUrl}
                              // alt={item.title}
                               src={
    item.imageUrl.startsWith("http")
      ? item.imageUrl
      : `https://storage.googleapis.com/magbee-ecommerce-media/${item.imageUrl}`
  }
  alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>

                        {/* ENABLED TOGGLE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(item.id)}
                              title={
                                item.isEnabled
                                  ? "Disable banner"
                                  : "Enable banner"
                              }
                              className={`relative inline-flex items-center cursor-pointer w-9 h-5 rounded-full transition-colors ${
                                item.isEnabled
                                  ? "bg-emerald-500"
                                  : "bg-slate-300 dark:bg-slate-700"
                              }`}
                            >
                              <span
                                className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                                  item.isEnabled ? "translate-x-4" : ""
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[11px] font-medium ${
                                item.isEnabled
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {item.isEnabled ? "ON" : "OFF"}
                            </span>
                          </div>
                        </TableCell>

                        {/* LIVE STATUS (Backend computed) */}
                        <TableCell className="!py-3 !px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded border ${
                              item.isActive
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isActive
                                  ? "bg-emerald-500 animate-pulse"
                                  : "bg-slate-400"
                              }`}
                            />
                            {item.isActive ? "LIVE" : "INACTIVE"}
                          </span>
                        </TableCell>

                        {/* SCHEDULE */}
                        <TableCell className="!py-3 !px-3">
                          <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400">
                            <span className="tabular-nums">
                              {formatDate(item.startDate)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              → {formatDate(item.endDate)}
                            </span>
                          </div>
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="!py-3 !px-3 text-right">
                          <div className="inline-flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded transition-colors"
                              title="Edit banner"
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                              title="Delete banner"
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
              totalItems={filteredData.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}
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