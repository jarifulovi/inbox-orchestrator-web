"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const { data, error } = await authApi.signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.session) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Sign in
        </h2>
        <p className="text-sm text-white/40">
          Access your orchestrated, noise-free inbox workspace
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5" id="login-form">
        {/* Email field */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-white/70 text-xs uppercase tracking-widest font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25 pointer-events-none" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={cn(
                "pl-9 h-11 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/25",
                "focus-visible:ring-[#6d5bfa]/60 focus-visible:border-[#6d5bfa]/60",
                "transition-all duration-200"
              )}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-white/70 text-xs uppercase tracking-widest font-medium">
              Password
            </Label>
            <button
              type="button"
              className="text-xs text-[#8b7cf8] hover:text-[#a899fa] transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25 pointer-events-none" />
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={cn(
                "pl-9 h-11 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/25",
                "focus-visible:ring-[#6d5bfa]/60 focus-visible:border-[#6d5bfa]/60",
                "transition-all duration-200"
              )}
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="login-submit"
          disabled={loading}
          className={cn(
            "w-full h-11 rounded-lg font-semibold text-sm mt-1",
            "bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5] text-white",
            "hover:from-[#7d6bff] hover:to-[#56e3f5]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "shadow-[0_0_24px_rgba(109,91,250,0.35)]",
            "transition-all duration-200"
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign In
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/8" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0e1117] px-3 text-white/25 tracking-widest">
            or
          </span>
        </div>
      </div>

      {/* Register CTA */}
      <p className="text-center text-sm text-white/40">
        No account yet?{" "}
        <Link
          href="/register"
          id="go-to-register"
          className="text-[#8b7cf8] font-medium hover:text-[#a899fa] transition-colors"
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}