  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { useSidebar } from "@/context/SidebarContext";
  import AppHeader from "@/layout/AppHeader";
  import AppSidebar from "@/layout/AppSidebar";
  import Backdrop from "@/layout/Backdrop";
  import { useSelector, useDispatch } from "react-redux";
  import { RootState } from "@/redux/store";
  import axiosInstance from "@/services/axiosInstance";
  import { setUser } from "@/redux/authSlice";

  export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const restoreSession = async () => {
        try {
          const res = await axiosInstance.get("/auth/me");
          dispatch(setUser(res.data.user));
        } catch (err: any) {
  // ❗ only redirect if NOT already on signin
  if (window.location.pathname !== "/signin") {
    router.replace("/signin");
  }
}
        // catch {
        //   router.replace("/signin");
        // } 
        
        finally {
          setLoading(false);
        }
      };

      restoreSession();
    }, [dispatch, router]);

    // 🔒 IMPORTANT GUARD
    if (loading) {
      return <div className="p-6 text-gray-500 text-center">Checking authentication…</div>;
    }

    // 🔒 EXTRA SAFETY
    if (!user) return null;

    const mainContentMargin = isMobileOpen
      ? "ml-0"
      : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

    return (
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={`flex-1 transition-all duration-300 ${mainContentMargin}`}>
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
