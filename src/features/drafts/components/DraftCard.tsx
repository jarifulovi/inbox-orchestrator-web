"use client";

import Link from "next/link";
import {
  PenSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { DraftRecord, DraftStatus } from "../types";

const statusConfig: Record<DraftStatus, { label: string; className: string; icon: typeof PenSquare }> = {
  pending_approval: {
    label: "AI Pending Approval",
    className: "bg-[#6d5bfa]/10 text-[#8b7cf8] border border-[#6d5bfa]/20",
    icon: Sparkles,
  },
  draft: {
    label: "Saved Draft",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    icon: PenSquare,
  },
  sent: {
    label: "Sent",
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
    icon: AlertCircle,
  },
};

const intentColors: Record<string, string> = {
  schedule_meeting: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  review_document: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  make_payment: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  follow_up: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  reply_requested: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  provide_information: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function formatDraftDate(dateStr: string): string {
  const date = new Date(dateStr);
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

export function DraftCard({
  draft,
  onDelete,
  onSend,
}: {
  draft: DraftRecord;
  onDelete: (id: string) => void;
  onSend: (id: string) => void;
}) {
  const config = statusConfig[draft.status] || statusConfig.draft;
  const StatusIcon = config.icon;
  const isActive = draft.status === "draft" || draft.status === "pending_approval";
  const bodySnippet = draft.body?.slice(0, 140) || "No content";

  return (
    <div className="glass-card rounded-xl px-4 py-3 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={`mt-0.5 size-7 rounded-lg flex items-center justify-center shrink-0 ${
          draft.status === "pending_approval" ? "bg-[#6d5bfa]/10" :
          draft.status === "sent" ? "bg-emerald-500/10" :
          draft.status === "failed" ? "bg-red-500/10" :
          "bg-amber-500/10"
        }`}>
          <StatusIcon className={`size-3.5 ${
            draft.status === "pending_approval" ? "text-[#8b7cf8]" :
            draft.status === "sent" ? "text-emerald-400" :
            draft.status === "failed" ? "text-red-400" :
            "text-amber-400"
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-semibold truncate ${
              draft.status === "sent" ? "text-white/40" : "text-white/90"
            }`}>
              {draft.thread_subject || draft.subject || "No Subject"}
            </h3>
          </div>

          <div className="text-xs text-white/50 mb-1.5 truncate flex items-center gap-1.5">
            <span className="text-white/30">to:</span>
            <span className="text-white/70">{draft.recipient_to?.join(", ") || "—"}</span>
          </div>

          <p className="text-xs text-white/30 truncate mb-2">{bodySnippet}</p>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status Badge */}
            <span className={`${config.className} text-[10px] font-medium px-2 py-0.5 rounded-full`}>
              {config.label}
            </span>

            {/* Source Badge */}
            {draft.generation_context?.source === "auto_worker" && (
              <span className="flex items-center gap-1 text-[10px] text-[#8b7cf8] bg-[#6d5bfa]/10 border border-[#6d5bfa]/20 px-2 py-0.5 rounded-full font-medium">
                <Sparkles className="size-3" /> AI Generated
              </span>
            )}

            {/* Resolved Tasks */}
            {draft.resolved_tasks.length > 0 && (
              <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                Resolves {draft.resolved_tasks.length} task{draft.resolved_tasks.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Resolved Tasks Pills */}
          {draft.resolved_tasks.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              {draft.resolved_tasks.slice(0, 3).map((task) => (
                <span
                  key={task.task_id}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    intentColors[task.intent_label] || intentColors.other
                  }`}
                >
                  {task.title.length > 30 ? task.title.slice(0, 30) + "..." : task.title}
                </span>
              ))}
              {draft.resolved_tasks.length > 3 && (
                <span className="text-[10px] text-white/30">+{draft.resolved_tasks.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="shrink-0 text-right">
          <span className="text-xs font-medium text-white/30">{formatDraftDate(draft.updated_at)}</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-end gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
        {isActive && (
          <>
            <Link
              href={`/dashboard/threads/${draft.thread_id}`}
              className="px-2.5 py-1 text-[11px] font-medium bg-[#6d5bfa]/10 text-[#8b7cf8] hover:bg-[#6d5bfa]/20 rounded-lg transition-colors flex items-center gap-1.5 mr-auto"
            >
              <PenSquare className="size-3.5" />
              Review & Edit
            </Link>

            <button
              onClick={() => onSend(draft.id)}
              className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="size-3.5" />
              Send Now
            </button>
          </>
        )}

        {!isActive && (
          <Link
            href={`/dashboard/threads/${draft.thread_id}`}
            className="px-2.5 py-1 text-[11px] font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 mr-auto"
          >
            <Eye className="size-3.5" />
            View Thread
          </Link>
        )}

        {isActive && (
          <button
            onClick={() => onDelete(draft.id)}
            className="px-2.5 py-1 text-[11px] font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
