"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase.client";
import { api } from "@/lib/axios";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        // 1. get session
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
          router.replace("/login");
          return;
        }

        // 2.  JWT attached is done in auth-context


        // 3. refresh backend state
        await api.get("/auth/me");

        // 4. small UX delay
        setLoading(false);

        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      } catch (err) {
        console.error(err);
        router.replace("/dashboard");
      }
    };

    run();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-2">
      {loading ? (
        <>
          <p className="text-lg font-semibold">
            Connecting your Google account...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we sync your inbox
          </p>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-green-600">
            Gmail connected successfully ✓
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </>
      )}
    </div>
  );
}