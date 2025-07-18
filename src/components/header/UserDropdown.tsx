"use client";
import Image from "next/image";
// import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useSelector ,useDispatch} from "react-redux";
import { FaChevronDown,FaUserCircle } from 'react-icons/fa';
import { FiSettings ,FiInfo,FiLogOut} from "react-icons/fi";
import { logout } from "../../services/authService";
import { useRouter } from 'next/navigation';

import type { AppDispatch } from "../../redux/store"; // adjust path as needed


export default function UserDropdown() {
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: any) => state.profile.user);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (!user) {
    return null; // or show loading state
  }


 const handleLogout = () => {
    dispatch(logout());
    router.push('/signin'); // Redirect to homepage or login
  };


  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >

        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            src={`https://api.dicebear.com/5.x/initials/png?seed=${encodeURIComponent(user.name)}`}
            width={44}
            height={44}
            alt={user.name}
            className="rounded-full"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name}
        </span>

        <FaChevronDown
    className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
  />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
             {user?.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <FaUserCircle
  className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
  size={24}
/>
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
             <FiSettings
  className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
  size={24}
/>

              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
             <FiInfo
  className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
  size={24}
/>

              Support
            </DropdownItem>
          </li>
        </ul>
         <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
    >
      <FiLogOut
        className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        size={24}
      />
      Sign out
    </button>
      </Dropdown>
    </div>
  );
}
