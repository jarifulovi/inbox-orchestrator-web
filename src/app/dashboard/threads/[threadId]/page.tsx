"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ShieldQuestion,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Inbox,
  Users,
  Sparkles,
  AlertCircle,
  ListTodo,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import {
  DUMMY_THREADS,
  DUMMY_THREAD_DETAILS,
  ThreadEmail,
  EmailFact,
} from "@/features/threads/data";
import { Thread, Priority, WorkflowStatus, SecurityTrustLevel } from "@/features/inbox/types";
import { Task } from "@/features/tasks/types";

// ─── Shared Formatters & Lookups ────────────────────────────────────────────

function formatTime(ts: string) {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function getInitial(name: string) {
  return name?.trim()?.[0]?.toUpperCase() ?? "?";
}

function getAvatarColor(seed: string) {
  const palette = ["#6d5bfa", "#46d3e5", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

const workflowLabel: Record<WorkflowStatus, string> = {
  needs_action: "Needs Action",
  awaiting_reply: "Awaiting Reply",
  informational: "Info",
  follow_up: "Follow Up",
  archived: "Archived",
};

const workflowColor: Record<WorkflowStatus, string> = {
  needs_action: "bg-red-500/10 text-red-400 border border-red-500/20",
  awaiting_reply: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  informational: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
  follow_up: "bg-purple-400/10 text-purple-400 border border-purple-400/20",
  archived: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

const priorityColor: Record<Priority, string> = {
  high: "badge-high",
  medium: "badge-medium",
  low: "badge-low",
};

const securityIcon: Record<SecurityTrustLevel, React.ReactNode> = {
  unverified: <ShieldQuestion className="size-3.5 text-zinc-400" />,
  suspicious: <ShieldAlert className="size-3.5 text-red-400" />,
  neutral: <Shield className="size-3.5 text-blue-400" />,
  trusted: <ShieldCheck className="size-3.5 text-emerald-400" />,
};

const factTypeColor: Record<EmailFact["fact_type"], string> = {
  task: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  commitment: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  decision: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  question: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  fact: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
};

// ─── LEFT PANEL: Thread List Item ───────────────────────────────────────────

function ThreadListItem({
  thread,
  isActive,
  onClick,
}: {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}) {
  const avatarColor = getAvatarColor(thread.sender_email);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-150 group border ${
        isActive
          ? "bg-[#6d5bfa]/10 border-[#6d5bfa]/30"
          : "border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div
          className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
          style={{ background: avatarColor }}
        >
          {getInitial(thread.sender_name)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Row 1: name + time */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className={`text-xs font-semibold truncate ${thread.unread ? "text-white" : "text-white/60"}`}>
              {thread.sender_name}
            </span>
            <span className="text-[10px] text-white/30 shrink-0">{formatTime(thread.timestamp)}</span>
          </div>

          {/* Row 2: subject */}
          <div className={`text-xs truncate mb-1 ${thread.unread ? "text-white/80 font-medium" : "text-white/40"}`}>
            {thread.subject}
          </div>

          {/* Row 3: badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`${workflowColor[thread.workflow_status] || workflowColor.informational} text-[9px] font-medium px-1.5 py-0.5 rounded-full`}>
              {workflowLabel[thread.workflow_status] || "Info"}
            </span>
            {thread.tasks_count > 0 && (
              <span className="flex items-center gap-0.5 text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
                <CheckSquare className="size-2.5" />
                {thread.tasks_count}
              </span>
            )}
            {thread.unread && (
              <span className="size-1.5 rounded-full bg-[#6d5bfa] ml-auto" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── MIDDLE PANEL: Email Card ────────────────────────────────────────────────

function EmailCard({
  email,
  isExpanded,
  isTarget,
  onToggle,
}: {
  email: ThreadEmail;
  isExpanded: boolean;
  isTarget: boolean;
  onToggle: () => void;
}) {
  const avatarColor = getAvatarColor(email.sender);

  return (
    <div
      id={`email-${email.id}`}
      className={`rounded-xl border transition-all duration-200 ${
        isTarget
          ? "border-[#6d5bfa]/40 shadow-[0_0_0_1px_rgba(109,91,250,0.15)]"
          : "border-white/[0.06]"
      } ${isExpanded ? "bg-white/[0.03]" : "bg-white/[0.015] hover:bg-white/[0.03]"}`}
    >
      {/* Email Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 flex items-center gap-3"
      >
        {/* Sender avatar */}
        <div
          className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: avatarColor }}
        >
          {getInitial(email.sender_name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{email.sender_name}</span>
            <span className="text-xs text-white/30 truncate">&lt;{email.sender}&gt;</span>
          </div>
          {!isExpanded && (
            <p className="text-xs text-white/40 truncate">{email.snippet}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/30">{formatFullDate(email.received_at)}</span>
          {isExpanded ? (
            <ChevronUp className="size-4 text-white/20" />
          ) : (
            <ChevronDown className="size-4 text-white/20" />
          )}
        </div>
      </button>

      {/* Email Body — expanded only */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          {/* Recipients bar */}
          {email.recipients.length > 0 && (
            <div className="text-xs text-white/30 mb-3 flex items-center gap-1.5 flex-wrap">
              <Users className="size-3 shrink-0" />
              <span>To: {email.recipients.join(", ")}</span>
            </div>
          )}

          {/* Body */}
          <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap border-t border-white/[0.05] pt-3">
            {email.body}
          </div>

          {/* Inline facts (tasks/commitments only) */}
          {email.email_facts.filter(f => f.fact_type === "task" || f.fact_type === "commitment").length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-2">
                Extracted from this email
              </div>
              {email.email_facts
                .filter(f => f.fact_type === "task" || f.fact_type === "commitment")
                .map(fact => (
                  <div
                    key={fact.id}
                    className="flex items-start gap-2 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2"
                  >
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide shrink-0 mt-0.5 ${factTypeColor[fact.fact_type]}`}>
                      {fact.fact_type}
                    </span>
                    <p className="text-xs text-white/50 leading-snug">{fact.source_sentence}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RIGHT PANEL: Task Fact Item ─────────────────────────────────────────────

const intentLabels: Record<string, string> = {
  schedule_meeting: "Schedule Meeting",
  reply_requested: "Reply Requested",
  review_document: "Review Document",
  provide_information: "Provide Info",
  make_payment: "Make Payment",
  follow_up: "Follow Up",
  other: "Task",
};

function TaskItem({ task }: { task: Task }) {
  const hasDueDate = task.due_date;
  const colorKey = (task.priority?.toLowerCase() ?? "low") as Priority;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2">
      {/* Intent badge + priority */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {intentLabels[task.intent_label] || "Task"}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`text-[8px] font-semibold px-1 py-0.2 rounded uppercase tracking-wider ${priorityColor[colorKey] || "badge-low"}`}>
            {task.priority}
          </span>
          {hasDueDate && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400/80">
              <Clock className="size-2.5" />
              {new Date(hasDueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="text-xs text-white/70 leading-snug">{task.title}</p>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function ThreadsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedAccount } = useAuth();

  const activeThreadId = params?.threadId as string | undefined;
  const targetEmailId = searchParams?.get("email") ?? null;

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [summaryOpen, setSummaryOpen] = useState(true);

  // Thread detail from dummy data
  const threadDetail = activeThreadId ? DUMMY_THREAD_DETAILS[activeThreadId] ?? null : null;
  const activeThread = threadDetail?.thread ?? null;
  const emails = threadDetail?.emails ?? [];

  // Filtered thread list for left panel
  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return DUMMY_THREADS;
    const q = searchQuery.toLowerCase();
    return DUMMY_THREADS.filter(
      t =>
        t.subject.toLowerCase().includes(q) ||
        t.sender_name.toLowerCase().includes(q) ||
        t.sender_email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Auto-expand the last email or the targeted one on thread load
  useEffect(() => {
    if (!emails.length) return;
    const defaultExpanded = new Set<string>();
    if (targetEmailId) {
      defaultExpanded.add(targetEmailId);
    } else {
      defaultExpanded.add(emails[emails.length - 1].id);
    }
    setExpandedEmails(defaultExpanded);
  }, [activeThreadId, targetEmailId]);

  // Scroll-to-element when targetEmailId changes
  useEffect(() => {
    if (!targetEmailId) return;
    const el = document.getElementById(`email-${targetEmailId}`);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [targetEmailId, activeThreadId]);

  // Filter pending tasks from the dedicated tasks table data structure
  const pendingTasks = useMemo(() => {
    const allTasks = threadDetail?.tasks ?? [];
    return allTasks.filter(t => t.status === "pending");
  }, [threadDetail]);

  function toggleEmail(id: string) {
    setExpandedEmails(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectThread(id: string) {
    router.push(`/dashboard/threads/${id}`);
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  if (!selectedAccount) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Inbox className="size-12 text-white/10 mx-auto" />
          <p className="text-white/40 text-sm">Connect an inbox to view threads</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] w-full flex overflow-hidden bg-[#0e1117]">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LEFT PANEL — Thread list                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-[280px] shrink-0 border-r border-white/[0.06] flex flex-col h-full">
        {/* Search bar */}
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="size-3.5 text-white/25 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-xs text-white/70 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/40"
            />
          </div>
        </div>

        {/* Thread list scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-0.5">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-10">
              <Mail className="size-8 text-white/10 mx-auto mb-2" />
              <p className="text-xs text-white/25">No threads found</p>
            </div>
          ) : (
            filteredThreads.map(t => (
              <ThreadListItem
                key={t.id}
                thread={t}
                isActive={t.id === activeThreadId}
                onClick={() => selectThread(t.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MIDDLE PANEL — Email viewer                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col h-full border-r border-white/[0.06]">
        {activeThread ? (
          <>
            {/* Thread header */}
            <div className="px-5 py-3.5 border-b border-white/[0.06] shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white truncate">{activeThread.subject}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-white/40">{emails.length} messages</span>
                    <span className="text-white/20">·</span>
                    <span className={`${workflowColor[activeThread.workflow_status] || workflowColor.informational} text-[10px] font-medium px-1.5 py-0.5 rounded-full`}>
                      {workflowLabel[activeThread.workflow_status] || "Info"}
                    </span>
                    <span className={`${priorityColor[activeThread.priority] || priorityColor.medium} text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider`}>
                      {activeThread.priority}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5" title={`Trust: ${activeThread.security_trust_level}`}>
                  {securityIcon[activeThread.security_trust_level] || securityIcon.unverified}
                </div>
              </div>
            </div>

            {/* Emails scroll */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3">
              {emails.map(email => (
                <EmailCard
                  key={email.id}
                  email={email}
                  isExpanded={expandedEmails.has(email.id)}
                  isTarget={email.id === targetEmailId}
                  onToggle={() => toggleEmail(email.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
            <div className="size-16 rounded-2xl bg-[#6d5bfa]/10 border border-[#6d5bfa]/20 flex items-center justify-center">
              <Mail className="size-7 text-[#6d5bfa]/50" />
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Select a thread</p>
              <p className="text-white/25 text-xs mt-1">Choose a thread from the left to read its emails</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* RIGHT PANEL — Thread metadata + summary + tasks                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-[320px] shrink-0 flex flex-col h-full">
        {activeThread ? (
          <>
            {/* ── Section 1: Thread Metadata (fixed) ─────────────────────── */}
            <div className="px-4 py-4 border-b border-white/[0.06] shrink-0 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                Thread Info
              </div>

              {/* Sender + date range */}
              <div className="flex items-start gap-2.5">
                <div
                  className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: getAvatarColor(activeThread.sender_email) }}
                >
                  {getInitial(activeThread.sender_name)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{activeThread.sender_name}</p>
                  <p className="text-[10px] text-white/30 truncate">{activeThread.sender_email}</p>
                </div>
              </div>

              {/* Status chip */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-2.5 py-2">
                <p className="text-[9px] text-white/25 uppercase tracking-wide mb-1">Status</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`${workflowColor[activeThread.workflow_status] || workflowColor.informational} text-[9px] font-medium px-1.5 py-0.5 rounded-full`}>
                    {workflowLabel[activeThread.workflow_status] || "Info"}
                  </span>
                  <span className={`${priorityColor[activeThread.priority] || priorityColor.medium} text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider`}>
                    {activeThread.priority}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-white/30 bg-white/[0.03] px-1.5 py-0.5 rounded-full border border-white/[0.05]">
                    {securityIcon[activeThread.security_trust_level] || securityIcon.unverified}
                    <span className="capitalize">{activeThread.security_trust_level || "unverified"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ── Section 2: AI Summary (Collapsible Drawer) ───── */}
            <div className="px-4 py-3 border-b border-white/[0.06] shrink-0">
              <button
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between gap-1.5 focus:outline-none cursor-pointer text-left"
              >
                <div className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-[#8b7cf8] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-[#8b7cf8] font-semibold">AI Summary</span>
                </div>
                {summaryOpen ? (
                  <ChevronUp className="size-3.5 text-white/30" />
                ) : (
                  <ChevronDown className="size-3.5 text-white/30" />
                )}
              </button>
              {summaryOpen && (
                <div className="mt-2 overflow-y-auto scrollbar-thin max-h-[120px] transition-all duration-300">
                  {activeThread.summary ? (
                    <p className="text-xs text-white/55 leading-relaxed">{activeThread.summary}</p>
                  ) : (
                    <div className="flex items-start gap-2 text-white/25">
                      <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                      <p className="text-xs">No AI summary available yet for this thread.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Section 3: Tasks (flex-1, scrollable) ───────────────────── */}
            <div className="flex-1 min-h-0 flex flex-col px-4 py-4">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <ListTodo className="size-3.5 text-white/40" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                    Pending Tasks
                  </span>
                </div>
                {pendingTasks.length > 0 && (
                  <span className="text-[10px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded-full font-medium">
                    {pendingTasks.length}
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckSquare className="size-8 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/25">No pending tasks extracted</p>
                  </div>
                ) : (
                  pendingTasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4 text-center">
            <div className="space-y-2">
              <Sparkles className="size-8 text-white/10 mx-auto" />
              <p className="text-xs text-white/25">Select a thread to see<br />metadata and tasks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
