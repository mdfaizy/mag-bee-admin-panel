"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "@/services/authService";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordFormSchema,
  ResetPasswordFormType,
} from "@/validations/Schema";

export default function ResetPassword({ token }: { token: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  // 👁 Show / Hide states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!token) return alert("Invalid or expired reset link");
  //   if (password !== confirmPassword) return alert("Passwords do not match");

  //   dispatch(resetPassword(password, confirmPassword, token, setResetComplete));
  // };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const onSubmit = (data: ResetPasswordFormType) => {
    if (!token) return;

    dispatch(
      resetPassword(
        data.password,
        data.confirmPassword,
        token,
        setResetComplete
      )
    );
  };

  return (
    <div className="flex items-center justify-center px-6 w-2/4 min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md">

        <h1 className="text-2xl font-semibold mb-2">
          {resetComplete ? "Password Updated 🎉" : "Choose New Password"}
        </h1>

        <p className="text-sm text-gray-400 mb-6">
          {resetComplete
            ? "Your password has been reset successfully."
            : "Enter a strong password and confirm it below."}
        </p>

        {!resetComplete ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                {...register("password")}
                className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                // value={confirmPassword}
                // onChange={(e) => setConfirmPassword(e.target.value)}
                {...register("confirmPassword")}
                className="w-full rounded-md bg-gray-800 border border-gray-700 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
               {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-brand-500 py-3 text-black font-medium hover:bg-brand-700 transition disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <Link href="/signin">
            <button className="w-full mt-4 rounded-md bg-green-500 py-3 font-medium text-black hover:bg-green-600 transition">
              Go to Login
            </button>
          </Link>
        )}

        {/* BACK TO LOGIN */}
        {!resetComplete && (
          <div className="mt-6 text-center">
            <Link
              href="/signin"
              className="text-sm text-gray-400 hover:text-yellow-400 transition"
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
