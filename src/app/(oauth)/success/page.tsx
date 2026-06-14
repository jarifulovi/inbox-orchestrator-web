"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";

export default function OAuthSuccessPage() {
  const { refreshUser, me } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await refreshUser(); // fetch latest /me
    })();
  }, [refreshUser]);

  useEffect(() => {
    if (me?.gmail.connected) {
      router.replace("/dashboard"); // redirect to main dashboard
    }
  }, [me, router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Syncing your Google account...</p>
    </div>
  );
}