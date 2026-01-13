"use client";
import { useSelector } from "react-redux";
import { IoLayersSharp } from "react-icons/io5";
import { LuFileText } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  FaChevronDown,     // ChevronDownIcon
  FaThLarge,         // GridIcon
  FaEllipsisH,       // HorizontaLDots
  FaList,            // ListIcon
  FaChartPie,        // PieChartIcon
  FaPlug,            // PlugInIcon
  FaTable,           // TableIcon
  FaUserCircle       // UserCircleIcon
} from 'react-icons/fa';

import { FaShoppingCart } from "react-icons/fa";
import { BiPieChart } from "react-icons/bi";

type NavSubItem = {
  name: string;
  path: string;
  permissions?: string[];   // ✅ ADD THIS
  pro?: boolean;
  new?: boolean;
};
// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   permissions?: string[];
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };
// type NavSubItem = {
//   name: string;
//   path: string;
//   permissions?: string[];   // ✅ ADD THIS
//   pro?: boolean;
//   new?: boolean;
// };

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  permissions?: string[];
  subItems?: NavSubItem[];
};

const hasPermission = (
  userPermissions: string[],
  required?: string[]
) => {
  // ✅ Full access (ADMIN / SUPER_ADMIN)
  if (userPermissions.includes("*")) return true;

  // Agar permission required hi nahi
  if (!required || required.length === 0) return true;

  // Normal permission check
  return required.some(p => userPermissions.includes(p));
};






const navItems: NavItem[] = [
  {
    icon: <FaThLarge />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
//   {
//   name: "Ecommerce",
//   icon: <FaShoppingCart />,
//  permissions: ["VIEW_PRODUCT"],
//   subItems: [
//     // { name: "Category", path: "/category",permissions: ["CREATE_CATEGORY"], pro: false },
//     // { name: "Product Category List", path: "/product-category-table",  permissions: ["VIEW_CATEGORY"],pro: false },
//     { name: "Add Product", path: "/add-new-product", pro: false },
//     { name: "Products List", path: "/product", pro: false },
//     // {name: "Create Sub Category",path:'/create-sub-category',pro:false},
//     // {name:'Sub Category Table',path:'/subCategoryTable',pro:false},
//     // { name: "Create New Banner", path: "/banner", pro: false },
//     // { name: "Banner Slider List", path: "/banner-slider", pro: false },


//   ],
// },
{
  name: "Ecommerce",
  icon: <FaShoppingCart />,
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
  icon: <IoLayersSharp />,
 permissions:["VIEW-BANNER"],
  subItems: [
     { name: "New Banner", path: "/banner", permissions:["CREATE-BANNER"], },
    { name: "Banner List", path: "/banner-slider",permissions:["VIEW-BANNER"], },
  ],
},
 {
  name: "Sub Category",
  icon: <IoLayersSharp />,
  //  permissions:["VIEW-SUB-CATEGORY"],
  subItems: [
     {name: "Add Sub Category",path:'/create-sub-category',permissions:["CREACTE-SUB-CATEGORY"],},
    {name:'Sub Category Table',path:'/subCategoryTable',pro:false},
  ],
},

 {
  name: "Category",
  icon: <IoLayersSharp />,

  subItems: [
    { name: "Category List", path: "/product-category-table" },
    { name: "New Category", path: "/category", permissions: ["CREATE_CATEGORY"] },
  ],
},
  // {
  //   name: "Tables",
  //   icon: <FaTable />,
  //   subItems: [{ name: "Resent Order", path: "/orders-tables", pro: false },
  //      { name: "Employees For MagBee", path: "/user-table", pro: false },
  //      { name: "Customer List", path: "/customer", pro: false },
  //        { name: "Product Varient", path: "/product-varient", pro: false },
  //   ],
  // },

  {
    name: "Orders",
    icon: <LuFileText />,
    subItems: [{ name: "Resent Order", path: "/orders-tables", pro: false },],
  },
  {
    name: "User",
    icon: <CiUser />,
    permissions:["VIEW_USER"],
    subItems: [{ name: "All Employees", path: "/user-table", permissions:["VIEW_USER"] },
      { name: "Add New Employee", path: "/signup", permissions: ["CREATE_USER"]},
       { name: "Customer List", path: "/customer", pro: false },
      ],
  },
  {
    name: "Roles",
    icon: <FaUsers />,
    permissions: ["VIEW_ROLE"],
    subItems: [{ name: "All Roles", path: "/",  permissions: ["VIEW_ROLE"],},
      { name: "Role Ctreate", path: "/created-role",permissions: ["CREATE_ROLE"]  },
      { name: "Assign Privelege", path: "/assign-privelege",  },
    ],
  }, 
  // 
   {
    icon: <BiPieChart />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  // {
  //   icon: <FaPlug />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Add New Employee", path: "/signup", permissions: ["CREATE_USER"]},
  //       //  { name: "Role Ctreate", path: "/created-role", pro: false },
  //     //  { name: "Assign Privelege", path: "/assign-privelege", pro: false },

  //   ],
  // },
];

const othersItems: NavItem[] = [
 
   {
    icon: <FaUserCircle />,
    name: "User Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
const userPermissions = useSelector(
  (state: any) => state.auth.user?.permissions || []
);

  // const renderMenuItems = (
  //   navItems: NavItem[],
  //   menuType: "main" | "others"
  // ) => (
  const renderMenuItems = (
  navItems: NavItem[],
  menuType: "main" | "others"
) => {
  // 🔐 PERMISSION FILTER
  const filteredNavItems = navItems
    .map((nav) => {
      // Parent permission
      if (!hasPermission(userPermissions, nav.permissions)) {
        return null;
      }

      // SubItem permission
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

  // ✅ RETURN JSX (VERY IMPORTANT)
  return (
    <ul className="flex flex-col gap-4">
      {/* {navItems.map((nav, index) => ( */}
      {filteredNavItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <FaChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                       
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
        
      ))}
    </ul>
  );
}

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <FaEllipsisH />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <FaEllipsisH />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? '': null}
      </div>
    </aside>
  );
};

export default AppSidebar;
