//   "use client";

//   import { useEffect, useState } from "react";
//   import { useRouter } from "next/navigation";
//   import { useSidebar } from "@/context/SidebarContext";
//   import AppHeader from "@/layout/AppHeader";
//   import AppSidebar from "@/layout/AppSidebar";
//   import Backdrop from "@/layout/Backdrop";
//   import { useSelector, useDispatch } from "react-redux";
//   import { RootState } from "@/redux/store";
//   import axiosInstance from "@/services/axiosInstance";
//   import { setUser } from "@/redux/authSlice";

//   export default function AdminLayout({ children }: { children: React.ReactNode }) {
//     const router = useRouter();
//     const dispatch = useDispatch();
//     const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//     const user = useSelector((state: RootState) => state.auth.user);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//       const restoreSession = async () => {
//         try {
//           const res = await axiosInstance.get("/auth/me");
//           dispatch(setUser(res.data.user));
//         } catch (err: any) {
//   // ❗ only redirect if NOT already on signin
//   if (window.location.pathname !== "/signin") {
//     router.replace("/signin");
//   }
// }
//         // catch {
//         //   router.replace("/signin");
//         // } 
        
//         finally {
//           setLoading(false);
//         }
//       };

//       restoreSession();
//     }, [dispatch, router]);

//     // 🔒 IMPORTANT GUARD
//     if (loading) {
//       return <div className="p-6 text-gray-500 text-center">Checking authentication…</div>;
//     }

//     // 🔒 EXTRA SAFETY
//     if (!user) return null;

//     const mainContentMargin = isMobileOpen
//       ? "ml-0"
//       : isExpanded || isHovered
//       ? "lg:ml-[290px]"
//       : "lg:ml-[90px]";

//     return (
//       // <div className="min-h-screen xl:flex">
//       <div className="min-h-screen flex w-full">

//         <AppSidebar />
//         <Backdrop />
//         <div className={`flex-1 transition-all duration-300 ${mainContentMargin}`}>
//           <AppHeader />
//           {/* <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"> */}
//           <div className="w-full p-4 md:p-6">
//             {children}
//           </div>
//         </div>
//       </div>
//     );
//   }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import axiosInstance, { SESSION_EXPIRED_PATH, SessionAwareError } from "@/services/axiosInstance";
// import { setUser } from "@/redux/authSlice";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   const user = useSelector((state: RootState) => state.auth.user);
//   const [loading, setLoading] = useState(true);
//   // session could not be checked (offline / server error): never a sign-out
//   const [sessionCheckError, setSessionCheckError] = useState<string | null>(null);
//   const [attempt, setAttempt] = useState(0);

//   useEffect(() => {
//     const restoreSession = async () => {
//       setLoading(true);
//       setSessionCheckError(null);

//       try {
//         const res = await axiosInstance.get("/auth/me");
//         dispatch(setUser(res.data.user));
//       } catch (err: unknown) {
//         const error = err as SessionAwareError;
//         const status = error.response?.status;

//         if (error.sessionExpired) {
//           // the interceptor is already redirecting with the reason
//         } else if (status === 401 || status === 403) {
//           if (window.location.pathname !== "/signin") {
//             router.replace(status === 401 ? SESSION_EXPIRED_PATH : "/signin");
//           }
//         } else {
//           setSessionCheckError(
//             error.response
//               ? "The server could not confirm your session right now."
//               : "Could not reach the server. Check your connection."
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     restoreSession();
//   }, [dispatch, router, attempt]);

//   // 🔒 IMPORTANT GUARD
//   if (loading) {
//     return (
//        <div className="flex items-center justify-center h-64">
//         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (sessionCheckError) {
//     return (
//       <div className="flex items-center justify-center h-64 p-4">
//         <div role="alert" className="max-w-md w-full rounded-xl border border-red-200 bg-white p-6 text-center">
//           <p className="font-medium text-gray-800">{sessionCheckError}</p>
//           <button
//             type="button"
//             onClick={() => setAttempt((n) => n + 1)}
//             className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Try again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔒 EXTRA SAFETY
//   if (!user) return null;

//   const mainContentMargin = isMobileOpen
//     ? "ml-0"
//     : isExpanded || isHovered
//     ? "lg:ml-[290px]"
//     : "lg:ml-[90px]";

//   return (
//     <div className="min-h-screen flex w-full">
//       {/* Sidebar */}
//       <AppSidebar />
//       <Backdrop />

//       {/* Main Content Area */}
//       <div
//         className={`flex-1 w-full min-w-0 transition-all duration-300 ${mainContentMargin}`}
//       >
//         <AppHeader />

//         {/* Page Content — FULL WIDTH */}
//         <div className="w-full p-4 md:p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { Loader2, RefreshCw, WifiOff } from "lucide-react";
// import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
// import AppSidebar from "@/layout/AppSidebar";
// import Backdrop from "@/layout/Backdrop";
// import { RootState } from "@/redux/store";
// import axiosInstance, {
//   SESSION_EXPIRED_PATH,
//   SessionAwareError,
// } from "@/services/axiosInstance";
// import { setUser } from "@/redux/authSlice";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();

//   const user = useSelector((state: RootState) => state.auth.user);
//   const [loading, setLoading] = useState(true);
//   // session could not be checked (offline / server error): never a sign-out
//   const [sessionCheckError, setSessionCheckError] = useState<string | null>(
//     null
//   );
//   const [attempt, setAttempt] = useState(0);

//   useEffect(() => {
//     const restoreSession = async () => {
//       setLoading(true);
//       setSessionCheckError(null);

//       try {
//         const res = await axiosInstance.get("/auth/me");
//         dispatch(setUser(res.data.user));
//       } catch (err: unknown) {
//         const error = err as SessionAwareError;
//         const status = error.response?.status;

//         if (error.sessionExpired) {
//           // the interceptor is already redirecting with the reason
//         } else if (status === 401 || status === 403) {
//           if (window.location.pathname !== "/signin") {
//             router.replace(status === 401 ? SESSION_EXPIRED_PATH : "/signin");
//           }
//         } else {
//           setSessionCheckError(
//             error.response
//               ? "The server could not confirm your session right now."
//               : "Could not reach the server. Check your connection."
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     restoreSession();
//   }, [dispatch, router, attempt]);

//   // 🔒 SESSION LOADING STATE
//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 dark:bg-slate-950">
//         <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
//           <Loader2 className="h-5 w-5 animate-spin text-slate-700 dark:text-slate-200" />
//           <p className="text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
//             Verifying admin session...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // 🔒 OFFLINE / SERVER ERROR GUARD
//   if (sessionCheckError) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 dark:bg-slate-950">
//         <div
//           role="alert"
//           className="w-full max-w-md rounded-xl border border-rose-200/90 bg-white p-6 text-center shadow-2xs dark:border-rose-900/50 dark:bg-slate-900"
//         >
//           <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400">
//             <WifiOff className="h-4 w-4" />
//           </div>
//           <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
//             Session Check Interrupted
//           </h2>
//           <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
//             {sessionCheckError}
//           </p>
//           <button
//             type="button"
//             onClick={() => setAttempt((n) => n + 1)}
//             className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:text-sm"
//           >
//             <RefreshCw className="h-3.5 w-3.5" />
//             <span>Try again</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 🔒 EXTRA SAFETY
//   if (!user) return null;

//   const isSidebarWide = isExpanded || isHovered;
//   const mainContentMargin = isMobileOpen
//     ? "ml-0"
//     : isSidebarWide
//       ? "lg:ml-[272px]"
//       : "lg:ml-[76px]";

//   return (
//     <div className="flex min-h-screen w-full bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
//       {/* Sidebar */}
//       <AppSidebar />
//       <Backdrop />

//       {/* Main Content Area */}
//       <div
//         className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ease-in-out ${mainContentMargin}`}
//       >
//         <AppHeader />

//         {/* Page Content — FULL WIDTH */}
//         <main className="w-full min-w-0 flex-1 p-4 sm:p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RefreshCw, WifiOff } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import LoadingState from "@/components/common/LoadingState";
import { RootState } from "@/redux/store";
import axiosInstance, {
  SESSION_EXPIRED_PATH,
  SessionAwareError,
} from "@/services/axiosInstance";
import { setUser } from "@/redux/authSlice";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  // session could not be checked (offline / server error): never a sign-out
  const [sessionCheckError, setSessionCheckError] = useState<string | null>(
    null
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      setSessionCheckError(null);

      try {
        const res = await axiosInstance.get("/auth/me");
        dispatch(setUser(res.data.user));
      } catch (err: unknown) {
        const error = err as SessionAwareError;
        const status = error.response?.status;

        if (error.sessionExpired) {
          // the interceptor is already redirecting with the reason
        } else if (status === 401 || status === 403) {
          if (window.location.pathname !== "/signin") {
            router.replace(status === 401 ? SESSION_EXPIRED_PATH : "/signin");
          }
        } else {
          setSessionCheckError(
            error.response
              ? "The server could not confirm your session right now."
              : "Could not reach the server. Check your connection."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [dispatch, router, attempt]);

  // 🔒 SESSION LOADING STATE -> Reusable LoadingState
  if (loading) {
    return <LoadingState variant="page" label="Verifying admin session..." />;
  }

  // 🔒 OFFLINE / SERVER ERROR GUARD
  if (sessionCheckError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/80 px-4 dark:bg-slate-950">
        <div
          role="alert"
          className="w-full max-w-md rounded-xl border border-rose-200/90 bg-white p-6 text-center shadow-2xs dark:border-rose-900/50 dark:bg-slate-900"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400">
            <WifiOff className="h-4 w-4" />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
            Session Check Interrupted
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
            {sessionCheckError}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 sm:text-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  // 🔒 EXTRA SAFETY
  if (!user) return null;

  const isSidebarWide = isExpanded || isHovered;
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isSidebarWide
      ? "lg:ml-[272px]"
      : "lg:ml-[76px]";

  return (
    <div className="flex min-h-screen w-full bg-slate-50/80 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AppSidebar />
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />

        {/* Page Content — FULL WIDTH */}
        <main className="w-full min-w-0 flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}