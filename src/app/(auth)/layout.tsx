import type { Metadata } from "next";

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
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="logo-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <path
                d="M6 10l8 5 8-5M6 10v8l8 5 8-5V10"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="logoGrad"
                  x1="0"
                  y1="0"
                  x2="28"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6d5bfa" />
                  <stop offset="1" stopColor="#46d3e5" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="text-white font-semibold text-[15px] tracking-tight">
            InboxOrchestrator <span className="text-[#8b7cf8]">AI</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#6d5bfa] animate-pulse" />
            Powered by multi-model AI
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Your inbox,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b7cf8] to-[#46d3e5]">
              intelligently
            </span>
            <br />
            orchestrated.
          </h1>

          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            Connect your Gmail. Let AI triage, summarise, and route every email
            — so you can focus on what actually matters.
          </p>

          {/* Feature pills */}
          <ul className="flex flex-col gap-3 pt-2">
            {[
              { icon: "✦", label: "Smart triage & auto-categorisation" },
              { icon: "✦", label: "Multi-model summarisation pipeline" },
              { icon: "✦", label: "Workflow triggers & task generation" },
            ].map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-3 text-sm text-white/60"
              >
                <span className="text-[#8b7cf8] text-xs">{f.icon}</span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <p className="relative z-10 text-xs text-white/25 tracking-wide">
          © {new Date().getFullYear()} InboxOrchestrator AI
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
        <div className="mb-8 flex lg:hidden items-center gap-2.5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="8" fill="url(#logoGradMobile)" />
            <path
              d="M6 10l8 5 8-5M6 10v8l8 5 8-5V10"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="logoGradMobile"
                x1="0"
                y1="0"
                x2="28"
                y2="28"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6d5bfa" />
                <stop offset="1" stopColor="#46d3e5" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-white font-semibold text-[15px] tracking-tight">
            InboxOrchestrator <span className="text-[#8b7cf8]">AI</span>
          </span>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
