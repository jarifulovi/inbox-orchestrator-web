import type { Metadata } from "next";
import { AppLogo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Auth – InboxOrchestrator AI",
  description: "Sign in or create your InboxOrchestrator AI workspace",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left branding panel ── */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0b0d11] p-12">
        {/* Animated gradient orbs */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          {/* grid lines */}
          <div className="grid-overlay" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center">
          <AppLogo size={36} showText={true} href="/" />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-white/70 backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#6d5bfa] animate-pulse" />
            Automated Ingestion & Noise Reduction
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
            Transform your inbox into an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b7cf8] via-[#a78bfa] to-[#46d3e5]">
              actionable workspace.
            </span>
          </h1>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            Connecting your account triggers automated email ingestion. AI strips away inbox noise, categorizes threads, extracts key commitments, and surfaces only what needs your action.
          </p>

          {/* Feature pills */}
          <ul className="flex flex-col gap-3.5 pt-2">
            {[
              { icon: "✦", label: "Automated Email Ingestion & Fact Extraction", sub: "Scans incoming threads to extract tasks, commitments, and deadlines automatically." },
              { icon: "✦", label: "Noise Reduction & SLA Workflow Tracking", sub: "Filter chatter and monitor active deadlines (Needs Action, Awaiting Reply, Follow Up >48h SLA breach)." },
              { icon: "✦", label: "User-Controlled Task Resolution", sub: "Surface extracted action items while keeping task execution completely under your control." },
            ].map((f) => (
              <li
                key={f.label}
                className="flex items-start gap-3 text-xs"
              >
                <span className="text-[#8b7cf8] text-sm mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <span className="text-white/80 font-semibold block mb-0.5">{f.label}</span>
                  <span className="text-white/40 text-[11px] leading-normal block">{f.sub}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <p className="relative z-10 text-xs text-white/30 tracking-wide">
          © {new Date().getFullYear()} InboxOrchestrator AI — Personal Open-Source Project
        </p>

        <style>{`
          .orb {
            position: absolute;
            border-radius: 9999px;
            filter: blur(80px);
            opacity: 0.35;
          }
          .orb-1 {
            width: 480px; height: 480px;
            top: -120px; left: -120px;
            background: radial-gradient(circle, #6d5bfa 0%, transparent 70%);
            animation: drift 14s ease-in-out infinite alternate;
          }
          .orb-2 {
            width: 360px; height: 360px;
            bottom: -80px; right: -60px;
            background: radial-gradient(circle, #46d3e5 0%, transparent 70%);
            animation: drift 18s ease-in-out infinite alternate-reverse;
          }
          .orb-3 {
            width: 300px; height: 300px;
            top: 40%; left: 30%;
            background: radial-gradient(circle, #a855f7 0%, transparent 70%);
            animation: drift 22s ease-in-out infinite alternate;
          }
          .grid-overlay {
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
            background-size: 48px 48px;
          }
          @keyframes drift {
            from { transform: translate(0, 0) scale(1); }
            to   { transform: translate(40px, 30px) scale(1.08); }
          }
        `}</style>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e1117] px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex lg:hidden items-center">
          <AppLogo size={32} showText={true} href="/" />
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
