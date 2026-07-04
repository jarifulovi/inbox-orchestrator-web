"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/inbox");
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 border-2 border-[#6d5bfa] border-t-transparent rounded-full animate-spin" />
        <span className="text-white/40 text-sm">Redirecting to inbox...</span>
      </div>
    </div>
  );
}