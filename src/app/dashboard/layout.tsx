"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";

import Sidebar from "@/components/shared/sidebar";
import TopBar from "@/components/shared/top-bar";
import LoadingSpinner from "@/components/shared/loading-spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH CHECK TEMPORARILY DISABLED
  const { me, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading && !me) {
      router.replace("/login");
    }
  }, [loading, me, router]);

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" label="Loading dashboard…" />;
  }

  if (!me) {
    return null;
  }


  return (
    <div className="min-h-screen bg-[#0e1117] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="ml-[72px] flex flex-col min-h-screen">
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