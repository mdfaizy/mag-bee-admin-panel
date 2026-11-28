// "use client";
// import { useSelector } from "react-redux";
// import { IoLayersSharp } from "react-icons/io5";
// import { LuFileText } from "react-icons/lu";
// import { CiUser } from "react-icons/ci";
// import { FaUsers } from "react-icons/fa6";
// import React, { useEffect, useRef, useState,useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   FaChevronDown,     // ChevronDownIcon
//   FaThLarge,         // GridIcon
//   FaEllipsisH,       // HorizontaLDots
//   FaList,            // ListIcon
//   FaChartPie,        // PieChartIcon
//   FaPlug,            // PlugInIcon
//   FaTable,           // TableIcon
//   FaUserCircle       // UserCircleIcon
// } from 'react-icons/fa';

// import { FaShoppingCart } from "react-icons/fa";
// import { BiPieChart } from "react-icons/bi";

// type NavSubItem = {
//   name: string;
//   path: string;
//   permissions?: string[];   // ✅ ADD THIS
//   pro?: boolean;
//   new?: boolean;
// };
// // type NavItem = {
// //   name: string;
// //   icon: React.ReactNode;
// //   path?: string;
// //   permissions?: string[];
// //   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// // };
// // type NavSubItem = {
// //   name: string;
// //   path: string;
// //   permissions?: string[];   // ✅ ADD THIS
// //   pro?: boolean;
// //   new?: boolean;
// // };

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   permissions?: string[];
//   subItems?: NavSubItem[];
// };

// const hasPermission = (
//   userPermissions: string[],
//   required?: string[]
// ) => {
//   // ✅ Full access (ADMIN / SUPER_ADMIN)
//   if (userPermissions.includes("*")) return true;

//   // Agar permission required hi nahi
//   if (!required || required.length === 0) return true;

//   // Normal permission check
//   return required.some(p => userPermissions.includes(p));
// };






// const navItems: NavItem[] = [
//   {
//     icon: <FaThLarge />,
//     name: "Dashboard",
//     subItems: [{ name: "Ecommerce", path: "/", pro: false }],
//   },
// {
//   name: "Products",
//   icon: <FaShoppingCart />,
//   permissions: ["VIEW_PRODUCT"],
//   subItems: [
//     {
//       name: "Add Product",
//       path: "/add-new-product",
//       permissions: ["CREATE_PRODUCT"],
//     },
//     {
//       name: "Products List",
//       path: "/product",
//       permissions: ["VIEW_PRODUCT"],
//     },
//   ],
// },


// {
//   name: "Banner",
//   icon: <IoLayersSharp />,
//  permissions:["VIEW-BANNER"],
//   subItems: [
//      { name: "New Banner", path: "/banner", permissions:["CREATE-BANNER"], },
//     { name: "Banner List", path: "/banner-slider",permissions:["VIEW-BANNER"], },
//   ],
// },
//  {
//   name: "Sub Category",
//   icon: <IoLayersSharp />,
//   //  permissions:["VIEW-SUB-CATEGORY"],
//   subItems: [
//      {name: "Add Sub Category",path:'/create-sub-category',permissions:["CREATE_SUBCATEGORY"],},
//     {name:'Sub Category Table',path:'/subCategoryTable',pro:false},
//     {name:'Child Sub Category Table',path:'/childSubcategory/list',pro:false},
//     // 
//   ],
// },

//  {
//   name: "Category",
//   icon: <IoLayersSharp />,

//   subItems: [
//     { name: "Category List", path: "/product-category-table" },
//     { name: "New Category", path: "/category", permissions: ["CREATE_CATEGORY"] },
//   ],
// },

//   {
//     name: "Orders",
//     icon: <LuFileText />,
//     subItems: [
//       { name: "Resent Order", path: "/orders-tables", pro: false },
//       { name: "Returns", path: "/returns-tables", pro: false },
//     ],
//   },
//   {
//     name: "User",
//     icon: <CiUser />,
//     permissions:["VIEW_USER"],
//     subItems: [{ name: "All Employees", path: "/user-table", permissions:["VIEW_USER"] },
//       { name: "Add New Employee", path: "/signup", permissions: ["CREATE_USER"]},
//        { name: "Customer List", path: "/customer", pro: false },
//       ],
//   },
//   {
//     name: "Roles",
//     icon: <FaUsers />,
//     permissions: ["VIEW_ROLE"],
//     subItems: [{ name: "All Roles", path: "/created-role/role-table",  permissions: ["VIEW_ROLE"],},
//       { name: "Role Ctreate", path: "/created-role",permissions: ["CREATE_ROLE"]  },
//       { name: "Assign Privelege", path: "/assign-privelege",  },
//     ],
//   }, 
//   {
//   name: "AI Lab Equipment",
//   icon: <LuFileText />,
//   subItems: [
//     {
//       name: "AI Lab Equipment Create",
//       path: "/lab-equipment/create",
//     },
//     {
//       name: "AI Lab Equipment List",
//       path: "/lab-equipment",
//     },
  
//   ],
// },
//   {
//   name: "GST Management",
//   icon: <LuFileText />,
//   subItems: [
//     { name: "GST Rates",  path: "/gst/rates/create",},
//     { name: "GST Rates List",  path: "/gst/rates",},
//   ],
// },
// {
//   icon: <LuFileText />,
//   name: "Enquiry",
//   subItems: [
//     {
//       name: "Enquiry List",
//       path: "/enquiries",
//       pro: false,
//     },
//     {
//       name: "Contact List",
//       path: "/contact",
//       pro: false,
//     },
//     {
//       name: "GeM Enquiries",
//       path: "/gem-enquiries",
//       pro: false,
//     },
//   ],
// },

// {
//   name: "Shipping",
//   icon: <LuFileText />,
//   subItems: [
//     {
//       name: "Shipping List",
//       path: "/settings/shipping",
//       pro: false,
//     },
//   ],
// },

// // {
// //   name: "Enquiry",
// //   icon: <LuFileText />,
// //   subItems: [
// //     {
// //       name: "Enquiry List",
// //       path: "/enquiries",
// //       pro: false,
// //     },
// //   ],
// // },
//   // 
//    {
//     icon: <BiPieChart />,
//     name: "Charts",
//     subItems: [
//       { name: "Line Chart", path: "/line-chart", pro: false },
//       { name: "Bar Chart", path: "/bar-chart", pro: false },
//     ],
//   },
//   // {
//   //   icon: <FaPlug />,
//   //   name: "Authentication",
//   //   subItems: [
//   //     { name: "Sign In", path: "/signin", pro: false },
//   //     { name: "Add New Employee", path: "/signup", permissions: ["CREATE_USER"]},
//   //       //  { name: "Role Ctreate", path: "/created-role", pro: false },
//   //     //  { name: "Assign Privelege", path: "/assign-privelege", pro: false },

//   //   ],
//   // },
// ];

// const othersItems: NavItem[] = [
 
//    {
//     icon: <FaUserCircle />,
//     name: "User Profile",
//     path: "/profile",
//   },
// ];

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const pathname = usePathname();
// const userPermissions = useSelector(
//   (state: any) => state.auth.user?.permissions || []
// );

//   // const renderMenuItems = (
//   //   navItems: NavItem[],
//   //   menuType: "main" | "others"
//   // ) => (
//   const renderMenuItems = (
//   navItems: NavItem[],
//   menuType: "main" | "others"
// ) => {
//   // 🔐 PERMISSION FILTER
//   const filteredNavItems = navItems
//     .map((nav) => {
//       // Parent permission
//       if (!hasPermission(userPermissions, nav.permissions)) {
//         return null;
//       }

//       // SubItem permission
//       if (nav.subItems) {
//         const allowedSubItems = nav.subItems.filter((sub) =>
//           hasPermission(userPermissions, sub.permissions)
//         );

//         if (allowedSubItems.length === 0) {
//           return null;
//         }

//         return { ...nav, subItems: allowedSubItems };
//       }

//       return nav;
//     })
//     .filter(Boolean) as NavItem[];

//   // ✅ RETURN JSX (VERY IMPORTANT)
//   return (
//     <ul className="flex flex-col gap-4">
//       {/* {navItems.map((nav, index) => ( */}
//       {filteredNavItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group  ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={` ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className={`menu-item-text`}>{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <FaChevronDown
//                   className={`ml-auto w-5 h-5 transition-transform duration-200  ${
//                     openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className={`menu-item-text`}>{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge `}
//                           >
//                             new
//                           </span>
//                         )}
                       
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
        
//       ))}
//     </ul>
//   );
// }

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // const isActive = (path: string) => path === pathname;
//    const isActive = useCallback((path: string) => path === pathname, [pathname]);

//   useEffect(() => {
//     // Check if the current path matches any submenu item
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({
//                 type: menuType as "main" | "others",
//                 index,
//               });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });

//     // If no submenu item matches, close the open submenu
//     if (!submenuMatched) {
//       setOpenSubmenu(null);
//     }
//   }, [pathname,isActive]);

//   useEffect(() => {
//     // Set the height of the submenu items when the submenu is opened
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex  ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 className="dark:hidden"
//                 src="/images/logo/logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <Image
//                 className="hidden dark:block"
//                 src="/images/logo/logo.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <Image
//               src="/images/logo/logo.png"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <FaEllipsisH />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>

//             <div className="">
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <FaEllipsisH />
//                 )}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {isExpanded || isHovered || isMobileOpen ? '': null}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;


"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoLayersSharp } from "react-icons/io5";
import { LuFileText } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import {
  FaChevronDown,
  FaThLarge,
  FaEllipsisH,
  FaUserCircle,
  FaShoppingCart,
} from "react-icons/fa";
import { BiPieChart } from "react-icons/bi";
import { useSidebar } from "../context/SidebarContext";

type NavSubItem = {
  name: string;
  path: string;
  permissions?: string[];
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permissions?: string[];
  subItems?: NavSubItem[];
};

const hasPermission = (userPermissions: string[], required?: string[]) => {
  if (userPermissions.includes("*")) return true;
  if (!required || required.length === 0) return true;
  return required.some((p) => userPermissions.includes(p));
};

const filterNavigation = (items: NavItem[], userPermissions: string[]): NavItem[] =>
  items
    .map((nav) => {
      if (!hasPermission(userPermissions, nav.permissions)) {
        return null;
      }

      if (nav.subItems) {
        const allowedSubItems = nav.subItems.filter((sub) =>
          hasPermission(userPermissions, sub.permissions)
        );

        if (allowedSubItems.length === 0) {
          return null;
        }

        return { ...nav, subItems: allowedSubItems };
      }

      return nav;
    })
    .filter(Boolean) as NavItem[];

const navItems: NavItem[] = [
  {
    icon: <FaThLarge className="h-4 w-4" />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    name: "Products",
    icon: <FaShoppingCart className="h-4 w-4" />,
    permissions: ["VIEW_PRODUCT"],
    subItems: [
      {
        name: "Add Product",
        path: "/add-new-product",
        permissions: ["CREATE_PRODUCT"],
      },
      {
        name: "Products List",
        path: "/product",
        permissions: ["VIEW_PRODUCT"],
      },
    ],
  },
  {
    name: "Banner",
    icon: <IoLayersSharp className="h-4 w-4" />,
    permissions: ["VIEW-BANNER"],
    subItems: [
      { name: "New Banner", path: "/banner", permissions: ["CREATE-BANNER"] },
      {
        name: "Banner List",
        path: "/banner-slider",
        permissions: ["VIEW-BANNER"],
      },
    ],
  },
  {
    name: "Sub Category",
    icon: <IoLayersSharp className="h-4 w-4" />,
    subItems: [
      {
        name: "Add Sub Category",
        path: "/create-sub-category",
        permissions: ["CREATE_SUBCATEGORY"],
      },
      { name: "Sub Category Table", path: "/subCategoryTable", pro: false },
      {
        name: "Child Sub Category Table",
        path: "/childSubcategory/list",
        pro: false,
      },
    ],
  },
  {
    name: "Category",
    icon: <IoLayersSharp className="h-4 w-4" />,
    subItems: [
      { name: "Category List", path: "/product-category-table" },
      {
        name: "New Category",
        path: "/category",
        permissions: ["CREATE_CATEGORY"],
      },
    ],
  },
  {
    name: "Orders",
    icon: <LuFileText className="h-4 w-4" />,
    subItems: [
      { name: "Resent Order", path: "/orders-tables", pro: false },
      { name: "Returns", path: "/returns-tables", pro: false },
    ],
  },
  {
    name: "User",
    icon: <CiUser className="h-4 w-4" />,
    permissions: ["VIEW_USER"],
    subItems: [
      {
        name: "All Employees",
        path: "/user-table",
        permissions: ["VIEW_USER"],
      },
      {
        name: "Add New Employee",
        path: "/signup",
        permissions: ["CREATE_USER"],
      },
      { name: "Customer List", path: "/customer", pro: false },
    ],
  },
  {
    name: "Roles",
    icon: <FaUsers className="h-4 w-4" />,
    permissions: ["VIEW_ROLE"],
    subItems: [
      {
        name: "All Roles",
        path: "/created-role/role-table",
        permissions: ["VIEW_ROLE"],
      },
      {
        name: "Role Create",
        path: "/created-role",
        permissions: ["CREATE_ROLE"],
      },
      { name: "Assign Privilege", path: "/assign-privelege" },
    ],
  },
  {
    name: "AI Lab Equipment",
    icon: <LuFileText className="h-4 w-4" />,
    subItems: [
      { name: "AI Lab Equipment Create", path: "/lab-equipment/create" },
      { name: "AI Lab Equipment List", path: "/lab-equipment" },
    ],
  },
  {
    name: "GST Management",
    icon: <LuFileText className="h-4 w-4" />,
    subItems: [
      { name: "GST Rates", path: "/gst/rates/create" },
      { name: "GST Rates List", path: "/gst/rates" },
    ],
  },
  {
    icon: <LuFileText className="h-4 w-4" />,
    name: "Enquiry",
    subItems: [
      { name: "Enquiry List", path: "/enquiries", pro: false },
      { name: "Contact List", path: "/contact", pro: false },
      { name: "GeM Enquiries", path: "/gem-enquiries", pro: false },
    ],
  },
  {
    name: "Shipping",
    icon: <LuFileText className="h-4 w-4" />,
    subItems: [
      { name: "Shipping List", path: "/settings/shipping", pro: false },
    ],
  },
  {
    icon: <BiPieChart className="h-4 w-4" />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <FaUserCircle className="h-4 w-4" />,
    name: "User Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const userPermissions: string[] = useSelector(
    (state: any) => state.auth.user?.permissions || []
  );

  const visibleMainItems = useMemo(
    () => filterNavigation(navItems, userPermissions),
    [userPermissions]
  );

  const visibleOthersItems = useMemo(
    () => filterNavigation(othersItems, userPermissions),
    [userPermissions]
  );

  const showLabels = isExpanded || isHovered || isMobileOpen;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    let submenuMatched = false;

    const groups: Array<{ type: "main" | "others"; items: NavItem[] }> = [
      { type: "main", items: visibleMainItems },
      { type: "others", items: visibleOthersItems },
    ];

    for (const group of groups) {
      group.items.forEach((nav, index) => {
        if (nav.subItems?.some((subItem) => isActive(subItem.path))) {
          setOpenSubmenu({ type: group.type, index });
          submenuMatched = true;
        }
      });
    }

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, visibleMainItems, visibleOthersItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu, showLabels]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const hasActiveChild =
          nav.subItems?.some((sub) => isActive(sub.path)) ?? false;
        const directActive = nav.path ? isActive(nav.path) : false;
        const highlighted = isOpen || hasActiveChild || directActive;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                type="button"
                onClick={() => handleSubmenuToggle(index, menuType)}
                title={!showLabels ? nav.name : undefined}
                className={`group flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  highlighted
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800/90 dark:text-slate-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                } ${!showLabels ? "justify-center" : "justify-start"}`}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    highlighted
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                  }`}
                >
                  {nav.icon}
                </span>

                {showLabels && (
                  <>
                    <span className="ml-3 truncate">{nav.name}</span>
                    <FaChevronDown
                      className={`ml-auto h-3 w-3 shrink-0 text-slate-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-slate-700 dark:text-slate-200" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  title={!showLabels ? nav.name : undefined}
                  className={`group flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
                    directActive
                      ? "bg-slate-900 text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  } ${!showLabels ? "justify-center" : "justify-start"}`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      directActive
                        ? "text-white dark:text-slate-900"
                        : "text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                    }`}
                  >
                    {nav.icon}
                  </span>

                  {showLabels && <span className="ml-3 truncate">{nav.name}</span>}
                </Link>
              )
            )}

            {nav.subItems && showLabels && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-200 ease-in-out"
                style={{
                  height: isOpen
                    ? `${subMenuHeight[`${menuType}-${index}`] || 0}px`
                    : "0px",
                }}
              >
                <ul className="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-800">
                  {nav.subItems.map((subItem) => {
                    const subActive = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            subActive
                              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                          }`}
                        >
                          <span className="truncate">{subItem.name}</span>
                          {subItem.new && (
                            <span
                              className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                subActive
                                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                              }`}
                            >
                              New
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-slate-200 bg-white text-slate-900 transition-all duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:mt-0 ${
        showLabels ? "w-[272px]" : "w-[76px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* BRAND HEADER */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-200/80 px-4 dark:border-slate-800 ${
          !showLabels ? "justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          {showLabels ? (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={140}
              height={36}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
            />
          )}
        </Link>
      </div>

      {/* SCROLLABLE NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
        <nav className="space-y-6">
          <div>
            <div
              className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${
                !showLabels ? "flex justify-center px-0" : ""
              }`}
            >
              {showLabels ? "Menu" : <FaEllipsisH className="h-3.5 w-3.5" />}
            </div>
            {renderMenuItems(visibleMainItems, "main")}
          </div>

          {visibleOthersItems.length > 0 && (
            <div className="border-t border-slate-200/70 pt-4 dark:border-slate-800">
              <div
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 ${
                  !showLabels ? "flex justify-center px-0" : ""
                }`}
              >
                {showLabels ? (
                  "Account"
                ) : (
                  <FaEllipsisH className="h-3.5 w-3.5" />
                )}
              </div>
              {renderMenuItems(visibleOthersItems, "others")}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;