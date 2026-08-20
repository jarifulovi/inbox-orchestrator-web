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
  UserCheck,
  Clock,
  Layers,
  FileText,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Features data (Strictly aligned with actual feature_alignment.md) ────── */
const features = [
  {
    icon: Mail,
    title: "Unified Inbox & Thread Triaging",
    description:
      "Consolidates connected Gmail mailboxes into a single workspace. Prioritizes conversations with real-time SLA status badges and unread tracking.",
    accent: "#6d5bfa",
  },
  {
    icon: CheckSquare,
    title: "Automated Action Item Extraction",
    description:
      "Scans incoming emails to extract tasks, commitments, and open questions into actionable task items with deterministic deduplication.",
    accent: "#46d3e5",
  },
  {
    icon: Clock,
    title: "Workflow Lifecycle & SLA Monitoring",
    description:
      "Track thread states automatically (Needs Action, Awaiting Reply, Follow Up >48h SLA breach, Informational, and Archived).",
    accent: "#a78bfa",
  },
  {
    icon: Search,
    title: "Smart Semantic Vector Search",
    description:
      "Natural language semantic search powered by local 384-dimensional sentence embeddings and Supabase pgvector RPC matching.",
    accent: "#34d399",
  },
  {
    icon: Send,
    title: "AI-Assisted Reply Drafting",
    description:
      "Auto-generates pending approval drafts for actionable incoming emails and allows one-click draft sending with task resolution linking.",
    accent: "#f59e0b",
  },
  {
    icon: FileText,
    title: "Thread Summaries & Context Baseline",
    description:
      "Generates concise 3-5 sentence summaries using hybrid context compression, serving as persistent memory for future processing cycles.",
    accent: "#f472b6",
  },
];

/* ── Metrics & Stats ──────────────────────────────────────────────────────── */
const stats = [
  { value: "384d", label: "Semantic vector search" },
  { value: "5 States", label: "Workflow SLA lifecycle" },
  { value: "0ms", label: "Optimistic UI state sync" },
  { value: "100%", label: "User-controlled task resolution" },
];

/* ── Main Landing Page ────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0d11] text-white overflow-x-hidden relative selection:bg-[#6d5bfa]/30 selection:text-white">
      {/* ── Ambient Background Lighting ────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 700,
            height: 700,
            top: -250,
            left: -200,
            background: "radial-gradient(circle, rgba(109,91,250,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 600,
            height: 600,
            top: "35%",
            right: -250,
            background: "radial-gradient(circle, rgba(70,211,229,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: 500,
            height: 500,
            bottom: -150,
            left: "30%",
            background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Navbar Header ─────────────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/[0.06] backdrop-blur-md bg-[#0b0d11]/80">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-8 rounded-lg bg-gradient-to-br from-[#6d5bfa] to-[#46d3e5] p-0.5 flex items-center justify-center shadow-lg shadow-[#6d5bfa]/20 group-hover:scale-105 transition-transform duration-200">
            <div className="size-full bg-[#0b0d11] rounded-[6px] flex items-center justify-center">
              <Mail className="size-4 text-[#46d3e5]" />
            </div>
          </div>
          <span className="font-bold text-base tracking-tight">
            InboxOrchestrator <span className="text-[#8b7cf8]">AI</span>
          </span>
        </Link>

        {/* Upper Header Actions: Sign In & Register */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-medium text-white/70 hover:text-white transition-colors px-3.5 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            Sign in
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-[#6d5bfa] hover:bg-[#7c6cfb] text-white border-0 shadow-lg shadow-[#6d5bfa]/25 text-xs font-semibold px-4 py-2 transition-all duration-200 cursor-pointer"
            >
              Register
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 md:pt-28 md:pb-20 max-w-5xl mx-auto">
        {/* Sparkles Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6d5bfa]/30 bg-[#6d5bfa]/10 text-[#a78bfa] text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner">
          <Sparkles className="size-3.5 text-[#46d3e5]" />
          <span>AI-Driven Email Operations Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Your inbox,{" "}
          <span className="bg-gradient-to-r from-[#6d5bfa] via-[#a78bfa] to-[#46d3e5] bg-clip-text text-transparent">
            orchestrated
          </span>{" "}
          by AI
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-8 font-normal">
          Unify your connected Gmail mailboxes, automatically extract actionable tasks, track response SLA deadlines, and perform semantic vector search across your communication context.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button
              id="hero-cta-dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white text-sm
                bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5]
                shadow-lg shadow-[#6d5bfa]/30
                hover:shadow-xl hover:shadow-[#6d5bfa]/40
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-200 cursor-pointer"
            >
              Go to Dashboard
              <ArrowRight className="size-4" />
            </button>
          </Link>

          <Link href="/login" className="w-full sm:w-auto">
            <button
              id="hero-cta-login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white/80 text-sm
                border border-white/10 bg-white/[0.04]
                hover:bg-white/[0.08] hover:text-white hover:border-white/20
                transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </Link>
        </div>

        {/* Architecture Pill Strip */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-white/40 border border-white/[0.06] bg-white/[0.02] px-4 py-2 rounded-full">
          <span className="flex items-center gap-1.5"><Layers className="size-3 text-[#6d5bfa]" /> FastAPI</span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5"><Zap className="size-3 text-[#46d3e5]" /> Next.js 16</span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="size-3 text-[#34d399]" /> Supabase Auth</span>
          <span className="text-white/20">·</span>
          <span className="flex items-center gap-1.5"><Brain className="size-3 text-[#a78bfa]" /> Gemini 1.5</span>
        </div>
      </section>

      {/* ── Interactive Dashboard UI Showcase Card ────────────────────────── */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-[#141824]/90 backdrop-blur-xl p-3 sm:p-5 shadow-2xl shadow-[#6d5bfa]/10">
          {/* Mock Window Titlebar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-white/40 ml-2 font-mono">dashboard/inbox — InboxOrchestrator AI</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Worker Active</span>
            </div>
          </div>

          {/* Mock Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-left">
            {/* Left Mock Panel */}
            <div className="md:col-span-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-2">Inbox Threads</div>
              
              <div className="p-2.5 rounded-lg bg-[#6d5bfa]/10 border border-[#6d5bfa]/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Project Delta Sync</span>
                  <span className="text-[9px] text-white/40">10:42 AM</span>
                </div>
                <p className="text-[11px] text-white/60 truncate">Please review the updated API schema before EOD.</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">Needs Action</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-medium">1 Task</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-white/[0.04] bg-white/[0.01] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80">Q3 Financial Statement</span>
                  <span className="text-[9px] text-white/30">Yesterday</span>
                </div>
                <p className="text-[11px] text-white/40 truncate">Invoice breakdown attached for audit review.</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-400/10 text-purple-400 border border-purple-400/20 font-medium">Follow Up</span>
                  <span className="text-[9px] text-white/30">SLA &gt;48h</span>
                </div>
              </div>
            </div>

            {/* Middle Mock Panel */}
            <div className="md:col-span-5 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div>
                  <h4 className="text-xs font-semibold text-white">Re: Project Delta Sync</h4>
                  <span className="text-[10px] text-white/30">Sarah Jenkins &lt;sarah@company.com&gt;</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">SPF / DKIM Verified</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Hi team, I've pushed the updated API schema modifications. Could you please review the task endpoints and verify the model context baseline by EOD today?
              </p>
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold">Extracted Action Fact</span>
                <p className="text-[11px] text-white/60">"Review task endpoints and verify model context baseline by EOD today."</p>
              </div>
            </div>

            {/* Right Mock Panel */}
            <div className="md:col-span-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 space-y-3">
              <div className="text-[10px] uppercase tracking-wider text-[#8b7cf8] font-semibold flex items-center gap-1">
                <Sparkles className="size-3 text-[#8b7cf8]" /> AI Summary
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Sarah requested an immediate review of the updated API schema endpoints before EOD.
              </p>
              <div className="border-t border-white/[0.06] pt-2 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Associated Task</div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold">Review Document</span>
                  <p className="text-[11px] text-white/80">Review API endpoints by EOD</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-[#8b7cf8] font-medium">User Status: Pending</span>
                    <button className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded hover:bg-emerald-500/20 transition-colors">
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Metric Bar ──────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-7 px-4 text-center bg-[#0e1117]/80">
              <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5] bg-clip-text text-transparent mb-1">
                {s.value}
              </span>
              <span className="text-xs text-white/50 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid (Verified against feature_alignment.md) ────────── */}
      <section id="features" className="relative z-10 px-6 md:px-12 pb-28 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for total <span className="bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5] bg-clip-text text-transparent">inbox clarity</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto">
            An operational AI management layer designed to extract workload value from incoming emails without status hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/10 p-6 flex flex-col gap-3.5 transition-all duration-200"
              >
                <div
                  className="flex items-center justify-center size-10 rounded-xl shrink-0"
                  style={{
                    background: `${f.accent}1a`,
                    border: `1px solid ${f.accent}33`,
                  }}
                >
                  <Icon className="size-5" style={{ color: f.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Contact & Feedback Card ────────────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-24 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl border border-[#46d3e5]/30 bg-gradient-to-b from-[#46d3e5]/10 via-transparent to-transparent p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#46d3e5]/30 bg-[#46d3e5]/10 text-[#46d3e5] text-[11px] font-semibold uppercase tracking-wider mb-4">
            <MessageSquare className="size-3.5" />
            Feedback & Feature Suggestions
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
            Have suggestions or feedback?
          </h2>
          <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
            InboxOrchestrator AI is a personal open-source project. We welcome your feature suggestions, feedback, and technical inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:contact@inboxorchestrator.ai?subject=InboxOrchestrator%20Feedback"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-xs bg-gradient-to-r from-[#6d5bfa] to-[#46d3e5] hover:opacity-95 transition-all shadow-lg shadow-[#6d5bfa]/20 cursor-pointer"
            >
              <Mail className="size-4" />
              Send Feedback Email
            </a>
            <a
              href="https://github.com/jarifulovi/inbox-orchestrator-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/80 text-xs border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <svg className="size-4 fill-current text-white/70 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      {/* ── Multi-Column Footer with Contact & Quick Links ──────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.06] pt-12 pb-8 px-6 md:px-12 bg-[#08090d]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06] text-xs">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <div className="size-6 rounded bg-gradient-to-br from-[#6d5bfa] to-[#46d3e5] flex items-center justify-center">
                <Mail className="size-3.5 text-white" />
              </div>
              <span>InboxOrchestrator <span className="text-[#8b7cf8]">AI</span></span>
            </div>
            <p className="text-white/40 leading-relaxed">
              AI-driven inbox management, action item extraction, and SLA lifecycle monitoring engine.
            </p>
            <span className="inline-block text-[10px] text-white/30 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.05]">
              Personal Open-Source Project
            </span>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Navigation</h5>
            <ul className="space-y-2 text-white/50">
              <li><Link href="/dashboard/inbox" className="hover:text-white transition-colors">Unified Inbox</Link></li>
              <li><Link href="/dashboard/tasks" className="hover:text-white transition-colors">Task Management</Link></li>
              <li><Link href="/dashboard/search" className="hover:text-white transition-colors">Semantic Vector Search</Link></li>
              <li><Link href="/dashboard/analytics" className="hover:text-white transition-colors">System Analytics</Link></li>
            </ul>
          </div>

          {/* Col 3: Technology Stack */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Technology Stack</h5>
            <ul className="space-y-2 text-white/50">
              <li><span>FastAPI (Python 3.11)</span></li>
              <li><span>Next.js 16 (React 19 App Router)</span></li>
              <li><span>Supabase Auth & PostgreSQL</span></li>
              <li><span>384d Sentence Transformers Vector Search</span></li>
            </ul>
          </div>

          {/* Col 4: Project Contact Info */}
          <div className="space-y-2.5">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">Contact & Support</h5>
            <ul className="space-y-2 text-white/50">
              <li className="flex items-center gap-1.5 text-white/70">
                <Mail className="size-3.5 text-[#46d3e5]" />
                <span>contact@inboxorchestrator.ai</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-[#8b7cf8]" />
                <span>Developer Feedback & Support</span>
              </li>
              <li className="text-white/30 text-[11px] pt-1">
                For technical inquiries, open an issue on GitHub.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 InboxOrchestrator AI. All rights reserved.</p>
          <p>Personal Open-Source Project</p>
        </div>
      </footer>
    </main>
  );
}
