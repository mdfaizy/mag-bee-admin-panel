"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { forgotPassword } from "@/services/authService";
import { AppDispatch } from "@/redux/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordFormSchema,
  ForgotPasswordFormType,
} from "@/validations/Schema";
export default function ForgotPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.auth);

  // const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(forgotPassword(email, setEmailSent));
  // };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
  });
  const email = watch("email");
  const onSubmit = (data: ForgotPasswordFormType) => {
    dispatch(forgotPassword(data.email, setEmailSent));
  };

  return (
    <div className="grid min-h-screen place-items-center bg-white text-black w-full">

      {loading ? (
        <div className="custom-loader" />
      ) : (
        <div className="max-w-md p-6">
          <h1 className="text-xl font-semibold">
            {emailSent ? "Check your email" : "Reset your password"}
          </h1>

          <p className="mt-3 text-gray-300">
            {emailSent
              ? `We have sent reset instructions to ${email}`
              : "We’ll email you instructions to reset your password."}
          </p>

          {!emailSent && (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <input
                type="email"
                {...register("email")}
                // onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded p-3 text-black border "
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              <button className="mt-4 w-full rounded bg-blue-500 py-2" disabled={loading}>
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          )}

          <Link href="/signin" className="mt-4 block text-sm">
            ← Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}