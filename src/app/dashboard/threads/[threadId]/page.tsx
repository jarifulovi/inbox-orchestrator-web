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
  Archive,
  ArchiveRestore,
  RefreshCw,
  Loader2,
  Reply,
  PenSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/features/auth/auth-context";
import { useThreads } from "@/features/threads/use-threads";
import { useThreadDetails, ThreadEmail, EmailFact } from "@/features/threads/use-thread-details";
import { useDraftComposer } from "@/features/threads/use-draft-composer";
import { DraftComposerDrawer } from "@/features/threads/components/DraftComposerDrawer";
import { Thread, Priority, WorkflowStatus, SecurityTrustLevel } from "@/features/threads/types";
import { Task } from "@/features/tasks/types";
import { EmailContentView } from "@/components/common/email-content-view";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import {
  getInitial,
  getAvatarColor,
  formatTime,
  formatFullDate,
  formatDateRange,
} from "@/features/threads/utils";

// ─── Shared Formatters & Lookups ────────────────────────────────────────────

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
          {(email.recipient_to || email.recipients || []).length > 0 && (
            <div className="text-xs text-white/30 mb-3 flex items-center gap-1.5 flex-wrap">
              <Users className="size-3 shrink-0" />
              <span>To: {(email.recipient_to || email.recipients || []).join(", ")}</span>
            </div>
          )}

          {/* Body */}
          <EmailContentView content={email.body} />

          {/* Inline facts (tasks/commitments only) */}
          {(email.email_facts || []).filter(f => f.fact_type === "task" || f.fact_type === "commitment").length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-2">
                Extracted from this email
              </div>
              {(email.email_facts || [])
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

  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [summaryOpen, setSummaryOpen] = useState(true);

  // Archive & Unarchive modal states
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  // Real thread detail for middle & right panels
  const {
    threadDetail,
    loading: loadingDetail,
    generatingSummary,
    generateSummary,
    refresh
  } = useThreadDetails(
    selectedAccount?.id,
    activeThreadId
  );

  const activeThread = threadDetail?.thread ?? null;
  const emails = threadDetail?.emails ?? [];
  const pendingTasksList = threadDetail?.tasks?.filter(t => t.status === "pending") ?? [];
  const lastSenderEmail = emails.length > 0 ? (emails[emails.length - 1].sender || "") : "";
  const lastEmailId = emails.length > 0 ? emails[emails.length - 1].id : undefined;

  // Dedicated Draft & Reply Composer Hook
  const draftComposer = useDraftComposer({
    accountId: selectedAccount?.id,
    threadId: activeThreadId,
    threadSubject: activeThread?.subject,
    lastSenderEmail,
    replyToEmailId: lastEmailId,
    pendingTasks: pendingTasksList,
    onSuccess: refresh,
  });

  // Participant profiles extraction
  const uniqueParticipants = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of emails) {
      const name = e.sender_name || (e.sender ? e.sender.split("<")[0].trim() : "Unknown");
      const email = e.sender || "";
      if (email && !map.has(email)) {
        map.set(email, name);
      }
    }
    return Array.from(map.entries()).map(([email, name]) => ({ email, name }));
  }, [emails]);

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
  }, [activeThreadId, targetEmailId, emails]);

  // Scroll-to-element when targetEmailId changes
  useEffect(() => {
    if (!targetEmailId) return;
    const el = document.getElementById(`email-${targetEmailId}`);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [targetEmailId, activeThreadId]);

  // Filter pending tasks from active thread details
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

  const handleArchiveThread = async () => {
    if (!activeThreadId || !selectedAccount?.id) return;
    setIsArchiving(true);
    try {
      await api.patch(`/emails/threads/${activeThreadId}/status?account_id=${selectedAccount.id}`, {
        workflow_status: "archived"
      });
      toast.success("Thread archived successfully");
      setArchiveModalOpen(false);
      refresh();
    } catch (err) {
      console.error("Failed to archive thread:", err);
      toast.error("Failed to archive thread");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchiveThread = async () => {
    if (!activeThreadId || !selectedAccount?.id) return;
    setIsUnarchiving(true);
    try {
      const res = await api.patch<{ status: string; thread: { workflow_status: string } }>(
        `/emails/threads/${activeThreadId}/status?account_id=${selectedAccount.id}`,
        { workflow_status: "unarchive" }
      );
      const newStatus = res.data?.thread?.workflow_status || "active";
      const label = workflowLabel[newStatus as WorkflowStatus] || newStatus;
      toast.success(`Thread unarchived to '${label}'`);
      setUnarchiveModalOpen(false);
      refresh();
    } catch (err) {
      console.error("Failed to unarchive thread:", err);
      toast.error("Failed to unarchive thread");
    } finally {
      setIsUnarchiving(false);
    }
  };

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

  const isThreadArchived = activeThread?.workflow_status === "archived";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MIDDLE PANEL — Email viewer                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col h-full border-r border-white/[0.06] relative overflow-hidden">
        {loadingDetail ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
            <div className="size-8 border-2 border-[#6d5bfa] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/40 text-xs">Loading thread details...</span>
          </div>
        ) : activeThread ? (
          <>
            {/* Thread header */}
            <div className="px-5 py-3 border-b border-white/[0.06] shrink-0 bg-white/[0.01]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-white truncate leading-snug">{activeThread.subject}</h2>

                  {/* Subheader info: messages count, date span, participants, pending tasks */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-white/50">
                    {/* Message count */}
                    <div className="flex items-center gap-1 text-white/60">
                      <Mail className="size-3.5 text-white/40" />
                      <span>{emails.length} {emails.length === 1 ? "message" : "messages"}</span>
                    </div>

                    {/* Date range */}
                    {formatDateRange(emails) && (
                      <>
                        <span className="text-white/20">·</span>
                        <div className="flex items-center gap-1 text-white/40">
                          <Clock className="size-3 text-white/30" />
                          <span>{formatDateRange(emails)}</span>
                        </div>
                      </>
                    )}

                    {/* Participants */}
                    {uniqueParticipants.length > 0 && (
                      <>
                        <span className="text-white/20">·</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {uniqueParticipants.slice(0, 3).map((p, idx) => (
                              <div
                                key={p.email || idx}
                                className="size-4.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-[#161921]"
                                style={{ background: getAvatarColor(p.email) }}
                                title={p.name}
                              >
                                {getInitial(p.name)}
                              </div>
                            ))}
                          </div>
                          <span className="text-white/60 truncate max-w-[200px]">
                            {uniqueParticipants.map(p => p.name).join(", ")}
                          </span>
                        </div>
                      </>
                    )}

                    {/* Pending tasks badge */}
                    {pendingTasks.length > 0 && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full font-medium">
                          <CheckSquare className="size-3" />
                          {pendingTasks.length} {pendingTasks.length === 1 ? "task" : "tasks"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Header Actions: Unified Compose / Reply and Archive/Unarchive */}
                <div className="shrink-0 pt-0.5 flex items-center gap-2">
                  <button
                    onClick={draftComposer.openComposer}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8b7cf8]/15 hover:bg-[#8b7cf8]/25 text-[#a79bfb] hover:text-white border border-[#8b7cf8]/30 rounded-lg text-xs font-medium transition-all duration-150 shadow-sm cursor-pointer"
                    title="Compose or reply to thread"
                  >
                    <PenSquare className="size-3.5 text-[#8b7cf8]" />
                    <span>Compose / Reply</span>
                  </button>

                  {isThreadArchived ? (
                    <button
                      onClick={() => setUnarchiveModalOpen(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#6d5bfa]/20 hover:bg-[#6d5bfa]/30 text-[#8b7cf8] hover:text-white border border-[#6d5bfa]/40 rounded-lg text-xs font-medium transition-all duration-150 shadow-sm cursor-pointer"
                      title="Unarchive thread"
                    >
                      <ArchiveRestore className="size-3.5 text-[#8b7cf8]" />
                      <span>Unarchive</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setArchiveModalOpen(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 rounded-lg text-xs font-medium transition-all duration-150 shadow-sm cursor-pointer"
                      title="Archive thread"
                    >
                      <Archive className="size-3.5 text-zinc-400" />
                      <span>Archive</span>
                    </button>
                  )}
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

            {/* Expanded / Docked Draft Composer Drawer */}
            <DraftComposerDrawer
              isOpen={draftComposer.isOpen}
              isMinimized={draftComposer.isMinimized}
              recipientTo={draftComposer.recipientTo}
              subject={draftComposer.subject}
              selectedTaskIds={draftComposer.selectedTaskIds}
              aiInstructions={draftComposer.aiInstructions}
              selectedTone={draftComposer.selectedTone}
              draftBody={draftComposer.draftBody}
              isGenerating={draftComposer.isGenerating}
              isSaving={draftComposer.isSaving}
              statusMessage={draftComposer.statusMessage}
              pendingTasks={pendingTasksList}
              onRecipientChange={draftComposer.setRecipientTo}
              onSubjectChange={draftComposer.setSubject}
              onAiInstructionsChange={draftComposer.setAiInstructions}
              onToneChange={draftComposer.setSelectedTone}
              onDraftBodyChange={draftComposer.setDraftBody}
              onToggleTask={draftComposer.toggleTaskResolution}
              onToggleAllTasks={draftComposer.toggleAllTasks}
              onGenerateAI={draftComposer.generateDraftContent}
              onQuickRefine={draftComposer.applyQuickRefine}
              onSaveDraft={draftComposer.saveDraft}
              onSendEmail={draftComposer.sendEmail}
              onClose={draftComposer.closeComposer}
              onToggleMinimize={draftComposer.toggleMinimize}
              onDiscard={draftComposer.resetComposer}
            />
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
                  style={{ background: getAvatarColor(activeThread.sender_email || emails[0]?.sender || "") }}
                >
                  {getInitial(activeThread.sender_name || emails[0]?.sender_name || "")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{activeThread.sender_name || emails[0]?.sender_name || "Unknown"}</p>
                  <p className="text-[10px] text-white/30 truncate">{activeThread.sender_email || emails[0]?.sender || ""}</p>
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
              <div className="flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setSummaryOpen(!summaryOpen)}
                  className="flex items-center gap-1.5 focus:outline-none cursor-pointer text-left"
                >
                  <div className="size-1.5 rounded-full bg-[#8b7cf8] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-[#8b7cf8] font-semibold">AI Summary</span>
                  {summaryOpen ? (
                    <ChevronUp className="size-3.5 text-white/30" />
                  ) : (
                    <ChevronDown className="size-3.5 text-white/30" />
                  )}
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (generatingSummary) return;
                    try {
                      await generateSummary();
                    } catch (err) {
                      console.error("Summary generation error:", err);
                    }
                  }}
                  disabled={generatingSummary}
                  className="flex items-center gap-1 text-[10px] font-medium text-[#a79bfb] hover:text-white bg-[#8b7cf8]/10 hover:bg-[#8b7cf8]/25 border border-[#8b7cf8]/30 px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Generate or update AI summary for this thread"
                >
                  {generatingSummary ? (
                    <>
                      <Loader2 className="size-3 animate-spin text-[#8b7cf8]" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3 text-[#8b7cf8]" />
                      <span>{activeThread.summary ? "Re-generate" : "Summarize"}</span>
                    </>
                  )}
                </button>
              </div>

              {summaryOpen && (
                <div className="mt-2 overflow-y-auto scrollbar-thin max-h-[140px] transition-all duration-300">
                  {generatingSummary ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#8b7cf8]/5 border border-[#8b7cf8]/15 text-[#a79bfb]">
                      <Loader2 className="size-4 animate-spin shrink-0 text-[#8b7cf8]" />
                      <p className="text-xs font-medium">Synthesizing email context & generating summary...</p>
                    </div>
                  ) : activeThread.summary ? (
                    <p className="text-xs text-white/70 leading-relaxed">{activeThread.summary}</p>
                  ) : (
                    <div className="flex flex-col items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-start gap-2 text-white/40">
                        <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-amber-400/80" />
                        <p className="text-xs">No AI summary generated yet for this conversation.</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (generatingSummary) return;
                          try {
                            await generateSummary();
                          } catch (err) {
                            console.error("Summary generation error:", err);
                          }
                        }}
                        disabled={generatingSummary}
                        className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#8b7cf8] hover:bg-[#7a6bf0] px-3 py-1.5 rounded-md transition-all shadow-md shadow-[#8b7cf8]/20 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Generate AI Summary</span>
                      </button>
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

      {/* ─── Archive Confirmation Modal ────────────────────────────────────── */}
      <Dialog open={archiveModalOpen} onOpenChange={setArchiveModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <div className="size-12 rounded-full bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center mb-4">
              <Archive className="size-6 text-zinc-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-2">Archive Thread?</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
              Are you sure you want to archive <span className="text-white/90 font-medium">"{activeThread?.subject}"</span>? Archived threads are hidden from active inbox views and ignored for background re-evaluations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setArchiveModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleArchiveThread}
              disabled={isArchiving}
              className="px-4 py-2 text-sm font-medium bg-zinc-700 text-white hover:bg-zinc-600 rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center min-w-28"
            >
              {isArchiving ? "Archiving..." : "Yes, Archive"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Unarchive Confirmation Modal ──────────────────────────────────── */}
      <Dialog open={unarchiveModalOpen} onOpenChange={setUnarchiveModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <div className="size-12 rounded-full bg-[#6d5bfa]/10 border border-[#6d5bfa]/20 flex items-center justify-center mb-4">
              <ArchiveRestore className="size-6 text-[#8b7cf8]" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-2">Unarchive Thread?</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
              Are you sure you want to unarchive <span className="text-white/90 font-medium">"{activeThread?.subject}"</span>? The thread will be restored to active inbox queues and dynamically categorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setUnarchiveModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUnarchiveThread}
              disabled={isUnarchiving}
              className="px-4 py-2 text-sm font-medium bg-[#6d5bfa] text-white hover:bg-[#5b49f8] rounded-lg transition-colors shadow-lg shadow-[#6d5bfa]/20 disabled:opacity-50 flex items-center justify-center min-w-28"
            >
              {isUnarchiving ? "Unarchiving..." : "Yes, Unarchive"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
