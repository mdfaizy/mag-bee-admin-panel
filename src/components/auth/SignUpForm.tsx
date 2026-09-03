
"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import { signup } from "@/services/authService";
import Select from "../form/Select";
import type { AppDispatch } from "@/redux/store";
import { RoleOption, Role } from "../types/auth";
import { apiConnector } from "@/services/apiConnector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormType } from "@/validations/loginSchema";
export default function SignUpForm() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // const [formData, setFormData] = useState({
  //   name: "",
  //   username: "",
  //   mobileNo: "",
  //   roleId: "",
  //   email: "",
  //   // password: "",
  // });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      isChecked: false,
    },
  });

  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleRoleChange = (value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     roleId: value,
  //   }));
  // };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const fetchRoles = async (): Promise<Role[]> => {
    const res = await apiConnector("GET", "/roles");
    console.log("Roles response:", res);
    const data = res.data;
    return data.roles as Role[];
  };
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        const formattedRoles = rolesData.map((role) => ({
          value: String(role.id),
          label: role.name,
        }));

        setRoles(formattedRoles);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        toast.error("Failed to load roles");
      }
    };

    loadRoles();
  }, []);


  // const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const { name, username, mobileNo, roleId, email } = formData;

  //   if (!name || !username || !mobileNo || !roleId || !email) {
  //     toast.error("Please fill all required fields.");
  //     return;
  //   }

  //   if (!isChecked) {
  //     toast.error("You must agree to the Terms and Conditions and Privacy Policy.");
  //     return;
  //   }

  //   dispatch(
  //     signup({
  //       name,
  //       username,
  //       mobileNo,
  //       roleId: Number(roleId),
  //       email,
  //       // password,
  //       router,
  //     })
  //   );
  // };


  const onSubmit = async (data: SignupFormType) => {
    await dispatch(
      signup({
        name: data.name,
        username: data.username,
        mobileNo: data.mobileNo,
        roleId: Number(data.roleId),
        email: data.email,
        router,
      })
    );
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar mx-auto">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <FaArrowLeft />
          Back to dashboard
        </Link>
      </div> */}

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {/* Sign Up */}
              Create New Employee
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in the details below to add a new employee.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    // name="name"
                    placeholder="Enter employee name"
                    //   value={formData.name}
                    //   onChange={handleChange}
                    // />
                    {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>User Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    // name="username"
                    placeholder="Enter employee username"
                    //   value={formData.username}
                    //   onChange={handleChange}
                    // />
                    {...register("username")} />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Mobile No<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    // name="mobileNo"
                    placeholder="Enter employee mobile number"
                    //   value={formData.mobileNo}
                    //   onChange={handleChange}
                    // />
                    {...register("mobileNo")} />
                  {errors.mobileNo && (
                    <p className="text-sm text-red-500">{errors.mobileNo.message}</p>
                  )}
                </div>

                <div>
                  <Label>Select Role<span className="text-error-500">*</span></Label>
                  <Select
                    options={roles}
                    placeholder="Select a role"
                    onChange={(val) => setValue("roleId", val)}
                  // value={formData.roleId}
                  />
                  {errors.roleId && (
                    <p className="text-sm text-red-500">{errors.roleId.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Email<span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  // name="email"
                  placeholder="Enter employee email"
                  //   value={formData.email}
                  //   onChange={handleChange}
                  // />
                  {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={watch("isChecked")}
                  onChange={(val) => setValue("isChecked", val)}
                />
                <p className="text-sm">
                  I confirm this employee agrees to company policies.
                </p>
              </div>
              {errors.isChecked && (
                <p className="text-sm text-red-500">{errors.isChecked.message}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
              >
                {/* Sign Up */}
                {isSubmitting ? "Creating..." : "Sign Up"}
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
