"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { cn } from "@/lib/utils";
import { setToken } from "@/lib/auth-token";
import { connectGoogle } from "@/features/google/google.api";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;
  const colors = ["bg-red-500", "bg-amber-400", "bg-emerald-400", "bg-emerald-400"];
  const labels = ["Weak", "Fair", "Strong", "Strong"];

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1">
      {/* bar */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-white/10"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/30">Strength: <span className={cn(score === 0 ? "text-red-400" : score === 1 ? "text-amber-400" : "text-emerald-400")}>{labels[score]}</span></span>
        <div className="flex gap-3">
          {checks.map((c) => (
            <span key={c.label} className={cn("text-[10px] flex items-center gap-1", c.pass ? "text-emerald-400" : "text-white/25")}>
              <CheckCircle2 className="size-2.5" />
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    const { data, error } = await authApi.signUp(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data?.user) {
      if (data.session) {
        toast.success("Account created! Redirecting to Google connection…");
        setToken(data.session.access_token);
        try {
          const res = await connectGoogle();
          if (res?.auth_url) {
            window.location.href = res.auth_url;
            return;
          }
        } catch (err) {
          console.error("Failed to connect Google:", err);
        }
        // Fallback to dashboard if connectGoogle fails
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        // Email confirmation flow
        toast.success("Check your inbox to confirm your account");
        router.push("/login");
      }
      return;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create account
        </h2>
        <p className="text-sm text-white/40">
          Start your InboxOrchestrator AI workspace in seconds
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-5" id="register-form">
        {/* Email field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-email"
            className="text-white/70 text-xs uppercase tracking-widest font-medium"
          >
            Work email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25 pointer-events-none" />
            <Input
              id="register-email"
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
          <Label
            htmlFor="register-password"
            className="text-white/70 text-xs uppercase tracking-widest font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/25 pointer-events-none" />
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Choose a strong password"
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
          <PasswordStrength password={password} />
        </div>

        {/* Google connect note */}
        <div className="flex items-start gap-3 rounded-lg border border-[#6d5bfa]/20 bg-[#6d5bfa]/5 px-4 py-3">
          <svg
            className="size-4 mt-0.5 shrink-0 text-[#8b7cf8]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 4.5a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 6.5zm1.5 10h-3a.75.75 0 0 1 0-1.5h.75v-4H11a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75v4.75H13.5a.75.75 0 0 1 0 1.5z"
              fill="currentColor"
            />
          </svg>
          <p className="text-xs text-white/50 leading-relaxed">
            Connecting your <span className="text-[#8b7cf8] font-semibold">Google account</span> activates automated ingestion to strip away noise and extract actionable tasks.
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="register-submit"
          disabled={loading}
          className={cn(
            "w-full h-11 rounded-lg font-semibold text-sm",
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
              Creating workspace…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Create account
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>

        <p className="text-center text-[11px] text-white/25 leading-relaxed">
          By creating an account you agree to our{" "}
          <span className="text-white/40 underline underline-offset-2 cursor-pointer">Terms</span> and{" "}
          <span className="text-white/40 underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
        </p>
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

      {/* Login CTA */}
      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/login"
          id="go-to-login"
          className="text-[#8b7cf8] font-medium hover:text-[#a899fa] transition-colors"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}