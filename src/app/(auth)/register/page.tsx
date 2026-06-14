"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api";
import { Button } from "@/components/ui/button";


export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    setLoading(true);

    const { data, error } = await authApi.signUp(email, password);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    // Supabase may or may not auto-login depending on config
    if (data?.user) {
      toast.success("Account created successfully");

      setTimeout(() => {
        router.push("/dashboard");
      }, 300);

      return;
    }

    // fallback (email confirmation flow case)
    toast.success("Check your email to confirm your account");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-xl p-6 space-y-5">

        <div>
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-gray-500">
            Start your InboxOrchestrator workspace
          </p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-md px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          After signup, you'll connect Google to activate your workspace.
        </p>
      </div>
    </div>
  );
}