
"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
// import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { FaArrowLeft } from "react-icons/fa6";

import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import Link from "next/link";
import { signup } from "@/services/authService";
import Select from "../form/Select";
import type { AppDispatch } from "@/redux/store";
import { RoleOption,Role } from "../types/auth";
// interface RoleOption {
//   value: string;
//   label: string;
// }
// interface Role {
//   id: number;
//   name: string;
// }
export default function SignUpForm() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    mobileNo: "",
    roleId: "",
    email: "",
    password: "",
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roleId: value,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };


const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token"); // Or sessionStorage.getItem("token")

    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch("http://localhost:8000/api/roles", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch roles");
    }

    const data = await res.json();

    // const formattedRoles = data.roles.map((role: any) => ({
    //   value: String(role.id),
    //   label: role.name,
    // }));
    const formattedRoles = (data.roles as Role[]).map((role) => ({
  value: String(role.id),
  label: role.name,
}));

    setRoles(formattedRoles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
  }
};
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, username, mobileNo, roleId, email, password } = formData;

    if (!name || !username || !mobileNo || !roleId || !email || !password) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!isChecked) {
      toast.error("You must agree to the Terms and Conditions and Privacy Policy.");
      return;
    }

    dispatch(
      signup({
        name,
        username,
        mobileNo,
        roleId: Number(roleId),
        email,
        password,
        router,
      }) 
    );
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <FaArrowLeft />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create an account!
            </p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>User Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Mobile No<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="mobileNo"
                    placeholder="Enter your mobile number"
                    value={formData.mobileNo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Select Role<span className="text-error-500">*</span></Label>
              <Select
  options={roles}
  placeholder="Select a role"
  onChange={handleRoleChange}
  value={formData.roleId}
/>


                </div>
              </div>

              <div>
                <Label>Email<span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Password<span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={toggleShowPassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <IoEye className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <IoEyeOff className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <span className="text-gray-800 dark:text-white">Terms</span> &{" "}
                  <span className="text-gray-800 dark:text-white">Privacy Policy</span>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/signin" className="text-brand-500 hover:text-brand-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
