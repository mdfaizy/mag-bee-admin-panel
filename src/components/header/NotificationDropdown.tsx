// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { FiBell ,FiX } from "react-icons/fi";

// export default function NotificationDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifying, setNotifying] = useState(true);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   const handleClick = () => {
//     toggleDropdown();
//     setNotifying(false);
//   };
//   return (
//     <div className="relative">
//       <button
//         className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
//         onClick={handleClick}
//       >
//         <span
//           className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
//             !notifying ? "hidden" : "flex"
//           }`}
//         >
//           <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
//         </span>
//          <FiBell className="text-current" size={20} />
//       </button>
//       <Dropdown
//         isOpen={isOpen}
//         onClose={closeDropdown}
//         className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0"
//       >
//         <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
//           <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//             Notification
//           </h5>
//           <button
//             onClick={toggleDropdown}
//             className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
//           >
//            <FiX className="text-current" size={24} />

//           </button>
//         </div>
//         <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
//           {/* Example notification items */}
//           {/* <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-02.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Terry Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>5 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li> */}

//           {/* <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-03.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 block space-x-1  text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Alena Franci
//                   </span>
//                   <span> requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>8 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-04.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Jocelyn Kenter
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>15 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-05.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Brandon Philips
//                   </span>
//                   <span> requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>1 hr ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               onItemClick={closeDropdown}
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-02.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Terry Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>5 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-03.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Alena Franci
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>8 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-04.jpg"
//                   alt="User"
//                   className="w-full overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Jocelyn Kenter
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>15 min ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li>

//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
//               href="#"
//             >
//               <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
//                 <Image
//                   width={40}
//                   height={40}
//                   src="/images/user/user-05.jpg"
//                   alt="User"
//                   className="overflow-hidden rounded-full"
//                 />
//                 <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
//               </span>

//               <span className="block">
//                 <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Brandon Philips
//                   </span>
//                   <span>requests permission to change</span>
//                   <span className="font-medium text-gray-800 dark:text-white/90">
//                     Project - Nganter App
//                   </span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
//                   <span>Project</span>
//                   <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
//                   <span>1 hr ago</span>
//                 </span>
//               </span>
//             </DropdownItem>
//           </li> */}
//           {/* Add more items as needed */}
//         </ul>
//         <Link
//           href="/"
//           className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
//         >
//           View All Notifications
//         </Link>
//       </Dropdown>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiBell, FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getNotificationLink = (notification: any) => {
    switch (notification.referenceType) {
      case "ORDER":
        return `/orders/${notification.referenceId}`;

      case "PRODUCT":
        return `/products/edit/${notification.referenceId}`;

      case "CATEGORY":
        return `/categories/edit/${notification.referenceId}`;

      case "SUBCATEGORY":
        return `/subcategories/edit/${notification.referenceId}`;

      case "CONTACT":
        return `/contacts/${notification.referenceId}`;

      case "GEM_ENQUIRY":
        return `/gem-enquiries/${notification.referenceId}`;

      default:
        return "/notifications";
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) / 1000
    );

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day ago`;
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);
    router.push(getNotificationLink(notification));
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
      >
        <FiBell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 z-50 mt-3 flex w-[360px] max-w-[calc(100vw-20px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:w-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-gray-800">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {unreadCount} unread notifications
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FiCheck size={18} />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading && notifications.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading notifications...
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="py-12 text-center">
                  <FiBell
                    size={30}
                    className="mx-auto mb-3 text-gray-400"
                  />

                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    No notifications
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    You&apos;re all caught up.
                  </p>
                </div>
              )}

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group flex gap-3 border-b border-gray-100 px-4 py-4 dark:border-gray-800 ${
                    !notification.isRead
                      ? "bg-blue-50/60 dark:bg-white/[0.03]"
                      : ""
                  }`}
                >
                  {/* Clickable notification */}
                  <button
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className="flex min-w-0 flex-1 gap-3 text-left"
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.isRead
                          ? "bg-gray-300"
                          : "bg-blue-500"
                      }`}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-800 dark:text-white">
                        {notification.title}
                      </span>

                      <span className="mt-1 block break-words text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </span>

                      <span className="mt-2 block text-xs text-gray-400">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                    title="Delete notification"
                    className="self-start rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3 dark:border-gray-800">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}