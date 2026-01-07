"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axiosInstance.get(
          `/verify-email?token=${encodeURIComponent(token)}`
        );

        toast.success(res.data.message || "Email verified successfully");

        // ✅ after verify → go to login
        router.replace("/signin");
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Verification failed";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      {loading ? "Verifying your email…" : "Redirecting…"}
    </div>
  );
}
