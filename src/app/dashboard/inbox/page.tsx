"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ShieldQuestion,
  CheckSquare,
  Eye,
  Reply,
} from "lucide-react";
import { threads } from "@/features/inbox/data";
import { Thread, Priority, WorkflowStatus, SecurityTrustLevel } from "@/features/inbox/types";

const priorityLabel: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const workflowLabel: Record<WorkflowStatus, string> = {
  needs_action: "Needs Action",
  awaiting_reply: "Awaiting Reply",
  informational: "Info",
  follow_up: "Follow Up",
  archived: "Archived",
};

const workflowColor: Record<WorkflowStatus, string> = {
  needs_action:
    "bg-red-500/10 text-red-400 border border-red-500/20",
  awaiting_reply:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  informational:
    "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  follow_up:
    "bg-purple-400/10 text-purple-400 border border-purple-400/20",
  archived:
    "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

const securityIcon: Record<SecurityTrustLevel, React.ReactNode> = {
  unverified: <ShieldQuestion className="size-3 text-zinc-400" />,
  suspicious: <ShieldAlert className="size-3 text-red-400" />,
  neutral: <Shield className="size-3 text-blue-400" />,
  trusted: <ShieldCheck className="size-3 text-emerald-400" />,
};

const securityLabel: Record<SecurityTrustLevel, string> = {
  unverified: "Unverified",
  suspicious: "Suspicious",
  neutral: "Neutral",
  trusted: "Trusted",
};

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ThreadRow({ thread }: { thread: Thread }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`glass-card rounded-xl transition-all duration-200 ${thread.unread ? "border-l-2 border-l-[#6d5bfa]" : ""
        }`}
    >
      {/* Main thread row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Expand toggle */}
        <button
          className="text-white/20 hover:text-white/50 transition-colors shrink-0"
          aria-label="Toggle summary"
        >
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-sm font-semibold truncate ${thread.unread ? "text-white" : "text-white/70"
                }`}
            >
              {thread.sender_name}
            </span>
            {thread.message_count > 1 && (
              <span className="text-[10px] text-white/25 font-medium">
                ({thread.message_count})
              </span>
            )}

            {/* Security Trust Level Badge */}
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded ml-2" title={`Trust level: ${securityLabel[thread.security_trust_level]}`}>
              {securityIcon[thread.security_trust_level]}
            </div>
          </div>
          <div
            className={`text-sm truncate ${thread.unread ? "text-white/90 font-medium" : "text-white/50"
              }`}
          >
            {thread.subject}
          </div>
          <div className="text-xs text-white/30 truncate mt-0.5">
            {thread.preview}
          </div>
        </div>

        {/* Right side: badges + time */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tasks Count */}
          {thread.tasks_count > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full" title={`${thread.tasks_count} pending tasks`}>
              <CheckSquare className="size-3" />
              {thread.tasks_count}
            </div>
          )}

          {/* Priority badge */}
          <span
            className={`badge-${thread.priority} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}
          >
            {priorityLabel[thread.priority]}
          </span>

          {/* Workflow status */}
          <span
            className={`${workflowColor[thread.workflow_status]} text-[10px] font-medium px-2 py-0.5 rounded-full`}
          >
            {workflowLabel[thread.workflow_status]}
          </span>

          {/* Time */}
          <span className="text-[11px] text-white/30 w-16 text-right">
            {formatTime(thread.timestamp)}
          </span>

          {/* Unread dot */}
          {thread.unread && (
            <div className="size-2 rounded-full bg-[#6d5bfa]" />
          )}
        </div>
      </div>

      {/* Accordion summary */}
      <div
        className={`accordion-content ${expanded ? "open" : ""}`}
      >
        <div className="px-5 pb-4 pl-[48px]">
          <div className="bg-[#6d5bfa]/[0.06] border border-[#6d5bfa]/10 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-[#8b7cf8] animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-[#8b7cf8] font-semibold">
                  AI Summary
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-md text-xs font-medium transition-colors">
                  <Eye className="size-3.5" />
                  View
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1 bg-[#6d5bfa]/20 hover:bg-[#6d5bfa]/30 text-[#8b7cf8] hover:text-[#a899fa] border border-[#6d5bfa]/30 rounded-md text-xs font-medium transition-colors">
                  <Reply className="size-3.5" />
                  Reply
                </button>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {thread.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [filterStatus, setFilterStatus] = useState<WorkflowStatus | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const matchStatus = filterStatus === "all" || t.workflow_status === filterStatus;
      const matchPriority = filterPriority === "all" || t.priority === filterPriority;
      return matchStatus && matchPriority;
    });
  }, [filterStatus, filterPriority]);

  const unreadCount = threads.filter((t) => t.unread).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Mail className="size-6 text-[#8b7cf8]" />
            Inbox
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {unreadCount} unread · {threads.length} total threads
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-white/30" />
            <span className="text-sm text-white/50 hidden sm:inline-block">Filter:</span>
          </div>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
            className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
          >
            <option value="all" className="bg-[#161921] text-white/70">All Priorities</option>
            <option value="high" className="bg-[#161921] text-white/70">High</option>
            <option value="medium" className="bg-[#161921] text-white/70">Medium</option>
            <option value="low" className="bg-[#161921] text-white/70">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as WorkflowStatus | "all")}
            className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
          >
            <option value="all" className="bg-[#161921] text-white/70">All Threads</option>
            <option value="needs_action" className="bg-[#161921] text-white/70">Needs Action</option>
            <option value="awaiting_reply" className="bg-[#161921] text-white/70">Awaiting Reply</option>
            <option value="informational" className="bg-[#161921] text-white/70">Informational</option>
            <option value="follow_up" className="bg-[#161921] text-white/70">Follow Up</option>
            <option value="archived" className="bg-[#161921] text-white/70">Archived</option>
          </select>
        </div>
      </div>

      {/* Thread list - made scrollable horizontally for smaller viewports */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="min-w-[800px] space-y-2">
          {filteredThreads.map((thread) => (
            <ThreadRow key={thread.id} thread={thread} />
          ))}

          {filteredThreads.length === 0 && (
            <div className="glass-card rounded-xl px-6 py-16 text-center">
              <Mail className="size-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                No threads match this filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
