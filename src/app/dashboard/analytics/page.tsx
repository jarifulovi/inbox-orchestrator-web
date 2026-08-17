"use client";

import { useState, useMemo } from "react";
import {
  BarChart3,
  Users,
  Cpu,
  Search,
  ArrowUpDown,
  Flame,
  Volume2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
  Mail,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { mockSenderAnalytics, mockSystemAnalytics } from "@/features/analytics/data";

type AnalyticsTab = "senders" | "system";
type SortOption = "density_desc" | "volume_desc" | "noise_desc" | "tasks_desc";
type FilterCategory = "all" | "high_action" | "high_noise";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("senders");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("density_desc");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  // Key KPI metrics calculations
  const topWorkloadSender = useMemo(() => {
    return [...mockSenderAnalytics].sort((a, b) => b.total_tasks - a.total_tasks)[0];
  }, []);

  const topNoiseSender = useMemo(() => {
    return [...mockSenderAnalytics].sort((a, b) => b.noise_ratio - a.noise_ratio)[0];
  }, []);

  const avgActionRate = useMemo(() => {
    const total = mockSenderAnalytics.reduce((acc, s) => acc + s.actionable_email_rate, 0);
    return (total / mockSenderAnalytics.length).toFixed(1);
  }, []);

  // Filter & Sort Sender Leaderboard
  const filteredSenders = useMemo(() => {
    return mockSenderAnalytics
      .filter((sender) => {
        // Category Filter based on Actionable Rate & Noise Ratio
        if (filterCategory === "high_action" && sender.actionable_email_rate < 50) return false;
        if (filterCategory === "high_noise" && sender.noise_ratio < 80) return false;

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = sender.sender_name.toLowerCase().includes(q);
          const matchesEmail = sender.sender_email.toLowerCase().includes(q);
          return matchesName || matchesEmail;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "density_desc") return b.actionable_email_rate - a.actionable_email_rate;
        if (sortBy === "volume_desc") return b.total_emails - a.total_emails;
        if (sortBy === "noise_desc") return b.noise_ratio - a.noise_ratio;
        if (sortBy === "tasks_desc") return b.total_tasks - a.total_tasks;
        return 0;
      });
  }, [searchQuery, sortBy, filterCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="size-6 text-[#8b7cf8]" />
            Workspace Analytics & Intelligence
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Real-time sender workload analysis, email traffic metrics, and system performance analytics.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab("senders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "senders"
                ? "bg-[#6d5bfa] text-white shadow-lg shadow-[#6d5bfa]/30"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="size-4" />
            Sender Intelligence
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "system"
                ? "bg-[#6d5bfa] text-white shadow-lg shadow-[#6d5bfa]/30"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Cpu className="size-4" />
            System Performance
          </button>
        </div>
      </div>

      {/* SUB-MODULE 1: SENDER INTELLIGENCE & LEADERBOARD */}
      {activeTab === "senders" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Workload Generator */}
            <div className="glass-card rounded-xl p-5 border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest text-rose-400/80 font-bold flex items-center gap-1.5">
                  <Flame className="size-4 text-rose-400" />
                  Top Workload Generator
                </span>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  {topWorkloadSender?.total_tasks} Tasks Injected
                </span>
              </div>
              <div className="text-lg font-bold text-white">{topWorkloadSender?.sender_name}</div>
              <div className="text-xs text-white/40 font-mono mt-0.5">{topWorkloadSender?.sender_email}</div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                <span>Actionable Email Rate</span>
                <span className="font-bold text-white">{topWorkloadSender?.actionable_email_rate}%</span>
              </div>
            </div>

            {/* Top Noise Channel */}
            <div className="glass-card rounded-xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest text-amber-400/80 font-bold flex items-center gap-1.5">
                  <Volume2 className="size-4 text-amber-400" />
                  Top Noise Channel
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {topNoiseSender?.total_emails} Emails / {topNoiseSender?.total_tasks} Tasks
                </span>
              </div>
              <div className="text-lg font-bold text-white">{topNoiseSender?.sender_name}</div>
              <div className="text-xs text-white/40 font-mono mt-0.5">{topNoiseSender?.sender_email}</div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                <span>Conversational Noise Ratio</span>
                <span className="font-bold text-amber-400">{topNoiseSender?.noise_ratio.toFixed(1)}%</span>
              </div>
            </div>

            {/* Average Actionable Email Rate */}
            <div className="glass-card rounded-xl p-5 border border-[#8b7cf8]/20 bg-gradient-to-br from-[#8b7cf8]/5 to-transparent relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest text-[#8b7cf8] font-bold flex items-center gap-1.5">
                  <Zap className="size-4 text-[#8b7cf8]" />
                  Avg Actionable Rate
                </span>
                <span className="text-xs font-bold text-[#8b7cf8] bg-[#8b7cf8]/10 px-2 py-0.5 rounded-full border border-[#8b7cf8]/20">
                  Workspace Ratio
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{avgActionRate}%</div>
              <div className="text-xs text-white/40 mt-1">Average percentage of emails containing actionable tasks</div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/50">
                <span>Total Tracked Senders</span>
                <span className="font-bold text-white">{mockSenderAnalytics.length} senders</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Table Controls & Search Bar */}
          <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterCategory("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === "all"
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Senders ({mockSenderAnalytics.length})
                </button>
                <button
                  onClick={() => setFilterCategory("high_action")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === "high_action"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Flame className="size-3.5 text-rose-400" />
                  High Action (≥ 50%)
                </button>
                <button
                  onClick={() => setFilterCategory("high_noise")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterCategory === "high_noise"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Volume2 className="size-3.5 text-amber-400" />
                  Noise Heavy (≥ 80%)
                </button>
              </div>

              {/* Search & Sort Dropdowns */}
              <div className="flex items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="size-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or domain..."
                    className="bg-white/[0.04] border border-white/[0.1] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#8b7cf8] w-48 md:w-60 transition-colors"
                  />
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white/70">
                  <ArrowUpDown className="size-3.5 text-white/40" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="density_desc" className="bg-[#0b0d11] text-white">Actionable Rate (High to Low)</option>
                    <option value="tasks_desc" className="bg-[#0b0d11] text-white">Task Count (High to Low)</option>
                    <option value="volume_desc" className="bg-[#0b0d11] text-white">Email Volume (High to Low)</option>
                    <option value="noise_desc" className="bg-[#0b0d11] text-white">Noise Ratio (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Unified Sender Leaderboard Table */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-left text-xs text-white/70">
                <thead className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-white/40 border-b border-white/[0.06]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Sender Details</th>
                    <th className="px-4 py-3 font-semibold text-center">Inbound Volume</th>
                    <th className="px-4 py-3 font-semibold text-center">Actionable Tasks</th>
                    <th className="px-4 py-3 font-semibold">Actionable Rate & Intensity</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSenders.map((sender) => (
                    <tr key={sender.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Sender Info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-gradient-to-br from-[#6d5bfa]/40 to-[#46d3e5]/40 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-white/10">
                            {sender.sender_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-[#8b7cf8] transition-colors">
                              {sender.sender_name}
                            </div>
                            <div className="text-[11px] text-white/35 font-mono">{sender.sender_email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email Volume */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="font-bold text-white">{sender.total_emails}</div>
                        <div className="text-[10px] text-white/30">messages</div>
                      </td>

                      {/* Actionable Tasks */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="font-bold text-white">{sender.total_tasks}</div>
                        <div className="text-[10px] text-white/40">
                          <span className="text-amber-400 font-medium">{sender.pending_tasks} pending</span> /{" "}
                          <span className="text-emerald-400 font-medium">{sender.completed_tasks} done</span>
                        </div>
                      </td>

                      {/* Actionable Email Rate & Task Intensity Bar */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1 max-w-[160px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white">{sender.actionable_email_rate}% action</span>
                            <span className="text-[10px] text-white/40 font-mono">{sender.task_multiplier.toFixed(2)}x/email</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                sender.actionable_email_rate >= 50
                                  ? "bg-rose-500"
                                  : sender.actionable_email_rate >= 20
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                              }`}
                              style={{ width: `${Math.max(5, sender.actionable_email_rate)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/dashboard/inbox?q=${encodeURIComponent(sender.sender_email)}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8b7cf8] hover:text-white bg-[#8b7cf8]/10 hover:bg-[#8b7cf8] border border-[#8b7cf8]/20 px-2.5 py-1 rounded-lg transition-all"
                        >
                          Filter Inbox
                          <ExternalLink className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredSenders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-white/40 text-xs">
                        No senders match your search criteria or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: SYSTEM LEVEL INTELLIGENCE */}
      {activeTab === "system" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* System Performance Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
                <Mail className="size-4 text-[#8b7cf8]" />
                Emails Processed
              </div>
              <div className="text-2xl font-bold text-white">{mockSystemAnalytics.total_emails_processed}</div>
              <div className="text-[11px] text-white/30 mt-1">Total inbound messages</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
                <Layers className="size-4 text-[#46d3e5]" />
                Tasks Extracted
              </div>
              <div className="text-2xl font-bold text-white">{mockSystemAnalytics.total_tasks_extracted}</div>
              <div className="text-[11px] text-emerald-400 mt-1">
                {mockSystemAnalytics.task_extraction_rate}% extraction rate
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
                <Clock className="size-4 text-emerald-400" />
                Avg Resolution Time
              </div>
              <div className="text-2xl font-bold text-white">{mockSystemAnalytics.avg_task_completion_hours} hrs</div>
              <div className="text-[11px] text-white/30 mt-1">Task completion SLA</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-2 text-white/40 text-xs font-semibold uppercase tracking-wider">
                <AlertTriangle className="size-4 text-amber-400" />
                SLA Breached Threads
              </div>
              <div className="text-2xl font-bold text-amber-400">{mockSystemAnalytics.sla_breached_count}</div>
              <div className="text-[11px] text-white/30 mt-1">&gt; 48h awaiting reply</div>
            </div>
          </div>

          {/* Intent Distribution & Extraction Efficiency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Intent Distribution Breakdown */}
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="size-4 text-[#8b7cf8]" />
                Intent Distribution Breakdown
              </h3>
              <p className="text-xs text-white/40">Categorized operational workload types across all incoming messages.</p>

              <div className="space-y-3 pt-2">
                {mockSystemAnalytics.intent_distribution.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/80">{item.label}</span>
                      <span className="font-mono text-white/40">{item.count} tasks ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Extraction Efficiency Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Zap className="size-4 text-emerald-400" />
                  AI Orchestrator Extraction Efficiency
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  Evaluates background Gemini worker task extraction accuracy and noise rejection ratio.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Actionable Email Rate</div>
                      <div className="text-[11px] text-white/40">Messages generating 1+ task</div>
                    </div>
                    <div className="text-xl font-bold text-emerald-400">27.7%</div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Conversational Noise Rejection</div>
                      <div className="text-[11px] text-white/40">Passive / FYIs filtered out</div>
                    </div>
                    <div className="text-xl font-bold text-[#46d3e5]">72.3%</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] text-white/30 flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                Background worker is actively processing incoming email threads.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
