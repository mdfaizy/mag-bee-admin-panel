"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { AuthService } from "@/services/authService";

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(AuthService.forgotPassword(email, setEmailSent));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-gray-900 text-white pt-10 pb-6 mb-2">
      {loading ? (
        <div className="custom-loader" />
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem]">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>

          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-gray-300">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password."
              : `We have sent the reset email to ${email}`}
          </p>

          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-sm">
                  Email Address <sup className="text-red-600">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-gray-200 p-3 text-black placeholder-gray-500 focus:outline-none"
                />
              </label>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-blue-500 py-3 font-medium text-black hover:bg-blue-600 transition"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>

          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center gap-x-2 text-sm text-gray-300 hover:text-white"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
