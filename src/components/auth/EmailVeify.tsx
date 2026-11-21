"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  verifyEmailSchema,
  VerifyEmailFormType,
} from "@/validations/verifyEmailSchema";
export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailSchema),
  });
  // const submit = async () => {

  //   if (!password || !confirmPassword) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   if (password.length < 6) {
  //     toast.error("Password must be at least 6 characters");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     await axiosInstance.post("/verify-email", {
  //       token,
  //       password,
  //       confirmPassword,
  //     });

  //     toast.success("Email verified successfully. Await admin approval.");
  //     router.replace("/signin");
  //   } catch (err: any) {
  //     toast.error(err.response?.data?.message || "Verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data: VerifyEmailFormType) => {
    if (!token) {
      toast.error("Invalid verification token");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/verify-email", {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Email verified successfully. Await admin approval.");
      router.replace("/signin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Set Your Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Verify your email and secure your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}


          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-black"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-black"
              // value={confirmPassword}
              {...register("confirmPassword")}
            // onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 text-white py-2 font-medium hover:bg-brand-600 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-4">
          After verification, admin approval is required before login.
        </p>
      </div>
    </div>
  );
}

