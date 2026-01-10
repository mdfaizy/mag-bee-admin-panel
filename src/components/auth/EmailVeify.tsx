
// // src/components/auth/EmailVeify.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import axiosInstance from "@/services/axiosInstance";

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = searchParams.get("token");

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!token) {
//       toast.error("Invalid verification link");
//       setLoading(false);
//       return;
//     }

//     const verifyEmail = async () => {
//       try {
//         const res = await axiosInstance.post(
//           `/verify-email?token=${encodeURIComponent(token)}`
//         );

//         toast.success(res.data.message || "Email verified successfully");
//         router.replace("/signin");
//       } catch (err: any) {
//         const message =
//           err.response?.data?.message ||
//           err.message ||
//           "Verification failed";
//         toast.error(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyEmail();
//   }, [token, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center text-gray-700">
//       {loading ? "Verifying your email…" : "Redirecting…"}
//     </div>
//   );
// }


// /verify-email/page.tsx
// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import axiosInstance from "@/services/axiosInstance";

// export default function VerifyEmailPage() {
//   const params = useSearchParams();
//   const router = useRouter();
//   const token = params.get("token");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const submit = async () => {
//     if (!password || !confirmPassword) {
//       toast.error("All fields required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       await axiosInstance.post("/verify-email", {
//         token,
//         password,
//         confirmPassword,
//       });

//       toast.success("Email verified. Wait for admin approval.");
//       router.replace("/signin");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Verification failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Set Password</h2>
//       <input type="password" onChange={e => setPassword(e.target.value)}  className="border-1 text-black"/>
//       <input type="password" onChange={e => setConfirmPassword(e.target.value)} className="border-1 text-black"/>
//       <button onClick={submit}>Verify & Continue</button>
//     </div>
//   );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/verify-email", {
        token,
        password,
        confirmPassword,
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

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <IoEye /> : <IoEyeOff />}
            </span>
          </div>
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-lg bg-brand-500 text-white py-2 font-medium hover:bg-brand-600 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-4">
          After verification, admin approval is required before login.
        </p>
      </div>
    </div>
  );
}

