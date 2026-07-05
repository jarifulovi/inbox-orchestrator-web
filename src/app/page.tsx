"use client";

import Link from "next/link";
import {
  Mail,
  Brain,
  Zap,
  ShieldCheck,
  BarChart3,
  CheckSquare,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Feature cards data ──────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: "Multi-Model AI Intelligence",
    description:
      "Harnesses multiple AI models in tandem to deeply understand every email — extracting intent, sentiment, and urgency with remarkable accuracy.",
    accent: "#6d5bfa",
  },
  {
    icon: Mail,
    title: "Unified Inbox Orchestration",
    description:
      "Connect multiple Gmail accounts into one intelligent surface. No more switching tabs — your emails, unified and prioritised automatically.",
    accent: "#46d3e5",
  },
  {
    icon: CheckSquare,
    title: "Automated Task Extraction",
    description:
      "AI scans every incoming message and creates actionable tasks from buried action items before you even open the thread.",
    accent: "#a78bfa",
  },
  {
    icon: Zap,
    title: "Real-Time Workflow Automation",
    description:
      "Rules, triggers, and AI-generated workflows fire instantly — routing, labelling, and escalating messages without manual effort.",
    accent: "#34d399",
  },
  {
    icon: Search,
    title: "Semantic Smart Search",
    description:
      "Find any email by meaning, not just keywords. Ask questions in plain language and the system surfaces the most relevant threads.",
    accent: "#f59e0b",
  },
  {
    icon: BarChart3,
    title: "Sender Intelligence & Analytics",
    description:
      "Understand patterns across senders, track response rates, and see which contacts matter most — powered by continuous AI analysis.",
    accent: "#f472b6",
  },
];

/* ── Stats ────────────────────────────────────────────────── */
const stats = [
  { value: "3×", label: "Faster email triage" },
  { value: "94%", label: "Task extraction accuracy" },
  { value: "∞", label: "Gmail accounts supported" },
  { value: "<1s", label: "AI response latency" },
];

/* ── Main page ────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d11] text-white overflow-x-hidden">
      {/* ── Ambient background orbs ─────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div
          className="sidebar-orb"
          style={{
            width: 600,
            height: 600,
            top: -200,
            left: -200,
            background: "radial-gradient(circle, #6d5bfa 0%, transparent 65%)",
            opacity: 0.12,
            animation: "pulse-glow 10s ease-in-out infinite",
          }}
        />
        <div
          className="sidebar-orb"
          style={{
            width: 500,
            height: 500,
            top: "30%",
            right: -180,
            background: "radial-gradient(circle, #46d3e5 0%, transparent 65%)",
            opacity: 0.10,
            animation: "pulse-glow 14s ease-in-out infinite alternate",
          }}
        />
        <div
          className="sidebar-orb"
          style={{
            width: 400,
            height: 400,
            bottom: -100,
            left: "40%",
            background: "radial-gradient(circle, #a78bfa 0%, transparent 65%)",
            opacity: 0.08,
            animation: "pulse-glow 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06] backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg
            width="32"
            height="32"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="8" fill="url(#heroLogoGrad)" />
            <path
              d="M6 10l8 5 8-5M6 10v8l8 5 8-5V10"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="heroLogoGrad"
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
          <span className="font-semibold text-[15px] tracking-tight">
            InboxOrchestrator{" "}
            <span className="text-[#8b7cf8]">AI</span>
          </span>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/50 hover:text-white/90 transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            Sign in
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="bg-[#6d5bfa] hover:bg-[#7c6cfb] text-white border-0 shadow-lg shadow-[#6d5bfa]/20 transition-all duration-200"
            >
              Dashboard
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero section ──────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6d5bfa]/30 bg-[#6d5bfa]/10 text-[#a78bfa] text-xs font-semibold tracking-widest uppercase mb-8">
          <Sparkles className="size-3.5" />
          AI-Powered Email Intelligence
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mb-6">
          Your inbox,{" "}
          <span className="gradient-text">orchestrated</span>{" "}
          by AI
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-10">
          InboxOrchestrator AI unifies your Gmail accounts, extracts tasks
          automatically, and applies multi-model intelligence to surface what
          actually matters — so you can focus on doing, not reading.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/dashboard">
            <button
              id="hero-cta-dashboard"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm
                bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5]
                shadow-lg shadow-[#6d5bfa]/30
                hover:shadow-xl hover:shadow-[#6d5bfa]/40
                hover:scale-[1.02]
                transition-all duration-200"
            >
              Go to Dashboard
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>

          <Link href="/login">
            <button
              id="hero-cta-login"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white/70 text-sm
                border border-white/[0.10] bg-white/[0.04]
                hover:bg-white/[0.08] hover:text-white/90 hover:border-white/20
                transition-all duration-200"
            >
              Sign In
            </button>
          </Link>
        </div>

        {/* Social proof strip */}
        <p className="mt-8 text-xs text-white/25 tracking-wide">
          Supabase Auth · FastAPI Backend · Google OAuth · Multi-Account Support
        </p>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card flex flex-col items-center py-8 px-4 text-center"
            >
              <span className="text-3xl font-extrabold gradient-text mb-1">
                {s.value}
              </span>
              <span className="text-xs text-white/40 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────── */}
      <section
        id="features"
        className="relative z-10 px-6 md:px-12 pb-28 max-w-7xl mx-auto"
      >
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything your inbox{" "}
            <span className="gradient-text">needs to think</span>
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            A complete AI orchestration layer built on top of your email —
            not just another client.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 group transition-all duration-300 hover:scale-[1.01]"
                style={{ "--feature-accent": f.accent } as React.CSSProperties}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center size-11 rounded-xl shrink-0"
                  style={{
                    background: `${f.accent}1a`,
                    border: `1px solid ${f.accent}33`,
                  }}
                >
                  <Icon
                    className="size-5"
                    style={{ color: f.accent }}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white text-[15px] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-28 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-0 md:gap-0 relative">
          {/* connector line on desktop */}
          <div
            className="hidden md:block absolute top-7 left-[calc(16.66%+8px)] right-[calc(16.66%+8px)] h-px"
            style={{ background: "linear-gradient(90deg, #6d5bfa44, #46d3e544)" }}
            aria-hidden="true"
          />

          {[
            {
              step: "01",
              title: "Connect Gmail",
              desc: "Authenticate with Google OAuth — one or many accounts.",
            },
            {
              step: "02",
              title: "AI Analyses",
              desc: "Multi-model pipeline ingests and classifies every message in real-time.",
            },
            {
              step: "03",
              title: "You act faster",
              desc: "Tasks surface, priorities clear, workflows execute — automatically.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex-1 flex flex-col items-center text-center px-6 py-4 relative"
            >
              <div
                className="size-14 rounded-full border border-[#6d5bfa]/40 bg-[#6d5bfa]/10 flex items-center justify-center text-[#8b7cf8] font-bold text-sm mb-4 z-10"
                style={{ boxShadow: "0 0 24px #6d5bfa22" }}
              >
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-28 max-w-4xl mx-auto">
        <div
          className="glass-card rounded-3xl p-10 md:p-14 flex flex-col items-center text-center gap-6 relative overflow-hidden"
        >
          {/* Inner glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, #6d5bfa18 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <ShieldCheck className="size-10 text-[#8b7cf8]" aria-hidden="true" />

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Ready to{" "}
            <span className="gradient-text">orchestrate</span> your inbox?
          </h2>
          <p className="text-white/40 max-w-lg">
            Sign in with your account or jump straight to the dashboard if
            you&apos;re already connected.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <button
                id="cta-login"
                className="group flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white text-sm
                  bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5]
                  shadow-lg shadow-[#6d5bfa]/30 hover:shadow-xl hover:shadow-[#6d5bfa]/40
                  hover:scale-[1.02] transition-all duration-200"
              >
                Sign In
                <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button
                id="cta-dashboard"
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white/70 text-sm
                  border border-white/[0.10] bg-white/[0.04]
                  hover:bg-white/[0.08] hover:text-white hover:border-white/20
                  transition-all duration-200"
              >
                Open Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-xs">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#footerGrad)" />
            <path
              d="M6 10l8 5 8-5M6 10v8l8 5 8-5V10"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="footerGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6d5bfa" />
                <stop offset="1" stopColor="#46d3e5" />
              </linearGradient>
            </defs>
          </svg>
          <span>InboxOrchestrator AI</span>
        </div>
        <span>
          Next.js · Supabase · FastAPI · Google OAuth — built for the 8th
          semester SPL-03 project
        </span>
      </footer>
    </main>
  );
}
