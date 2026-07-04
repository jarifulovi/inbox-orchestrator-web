"use client";

// AUTH CHECK TEMPORARILY DISABLED
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/features/auth/auth-context";

import Sidebar from "@/components/shared/sidebar";
import TopBar from "@/components/shared/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH CHECK TEMPORARILY DISABLED
  // const { me, loading } = useAuth();
  // const router = useRouter();
  //
  // useEffect(() => {
  //   if (!loading && !me) {
  //     router.replace("/login");
  //   }
  // }, [loading, me, router]);
  //
  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-[#0b0d11]">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="size-8 border-2 border-[#6d5bfa] border-t-transparent rounded-full animate-spin" />
  //         <span className="text-white/40 text-sm">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }
  //
  // if (!me) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-[#0e1117] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="ml-[260px] flex flex-col min-h-screen">
        {/* Top bar with account switcher */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}