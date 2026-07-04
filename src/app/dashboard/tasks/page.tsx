"use client";

import { useMemo } from "react";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Tag,
} from "lucide-react";
import { tasks } from "@/features/tasks/data";
import {
  Task,
  TaskStatus,
  TaskPriority,
  IntentLabel,
} from "@/features/tasks/types";

const statusConfig: Record<
  TaskStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending",
    className: "badge-pending",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    className: "badge-completed",
    icon: CheckCircle2,
  },
  dismissed: {
    label: "Dismissed",
    className: "badge-dismissed",
    icon: XCircle,
  },
  resolved: {
    label: "Resolved",
    className: "badge-resolved",
    icon: Sparkles,
  },
};

const intentLabels: Record<IntentLabel, string> = {
  schedule_meeting: "Schedule Meeting",
  reply_requested: "Reply Requested",
  review_document: "Review Document",
  provide_information: "Provide Info",
  make_payment: "Make Payment",
  follow_up: "Follow Up",
  other: "Other",
};

function formatDueDate(date: string | null): string {
  if (!date) return "No deadline";
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isDueSoon(date: string | null): boolean {
  if (!date) return false;
  const diffMs = new Date(date).getTime() - new Date().getTime();
  return diffMs < 2 * 24 * 60 * 60 * 1000; // < 2 days
}

function TaskCard({ task }: { task: Task }) {
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const dueSoon = isDueSoon(task.due_date);

  return (
    <div className="glass-card rounded-xl px-5 py-4 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div
          className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 ${
            task.status === "completed"
              ? "bg-emerald-500/10"
              : task.status === "pending"
                ? "bg-amber-500/10"
                : task.status === "resolved"
                  ? "bg-[#6d5bfa]/10"
                  : "bg-zinc-500/10"
          }`}
        >
          <StatusIcon
            className={`size-4 ${
              task.status === "completed"
                ? "text-emerald-400"
                : task.status === "pending"
                  ? "text-amber-400"
                  : task.status === "resolved"
                    ? "text-[#8b7cf8]"
                    : "text-zinc-400"
            }`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-sm font-semibold truncate ${
                task.status === "completed" || task.status === "dismissed"
                  ? "text-white/40 line-through"
                  : "text-white/90"
              }`}
            >
              {task.title}
            </h3>
          </div>
          <p className="text-xs text-white/35 mb-2.5 line-clamp-1">
            {task.description}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority */}
            <span
              className={`badge-${task.priority} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}
            >
              {task.priority}
            </span>

            {/* Status */}
            <span
              className={`${status.className} text-[10px] font-medium px-2 py-0.5 rounded-full`}
            >
              {status.label}
            </span>

            {/* Intent label */}
            <span className="flex items-center gap-1 text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
              <Tag className="size-3" />
              {intentLabels[task.intent_label]}
            </span>

            {/* Source thread */}
            <span className="text-[10px] text-white/20 truncate max-w-[180px]">
              from: {task.source_thread_subject}
            </span>
          </div>
        </div>

        {/* Due date */}
        <div className="shrink-0 text-right">
          <span
            className={`text-xs font-medium ${
              dueSoon && task.status === "pending"
                ? "text-red-400"
                : "text-white/30"
            }`}
          >
            {formatDueDate(task.due_date)}
          </span>
          {dueSoon && task.status === "pending" && (
            <AlertTriangle className="size-3.5 text-red-400 ml-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskPriority, Task[]> = {
      high: [],
      medium: [],
      low: [],
    };
    tasks.forEach((t) => groups[t.priority].push(t));
    return groups;
  }, []);

  const prioritySections: {
    key: TaskPriority;
    label: string;
    icon: typeof AlertTriangle;
    color: string;
  }[] = [
    { key: "high", label: "High Priority", icon: AlertTriangle, color: "text-red-400" },
    { key: "medium", label: "Medium Priority", icon: Clock, color: "text-amber-400" },
    { key: "low", label: "Low Priority", icon: CheckSquare, color: "text-emerald-400" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <CheckSquare className="size-6 text-[#8b7cf8]" />
          Tasks
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {tasks.filter((t) => t.status === "pending").length} pending ·{" "}
          {tasks.length} total tasks
        </p>
      </div>

      {/* Grouped task lists */}
      {prioritySections.map(({ key, label, icon: Icon, color }) => {
        const group = groupedTasks[key];
        if (group.length === 0) return null;

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={`size-4 ${color}`} />
              <h2 className={`text-sm font-semibold ${color} uppercase tracking-wider`}>
                {label}
              </h2>
              <span className="text-[11px] text-white/20 font-medium">
                ({group.length})
              </span>
            </div>
            <div className="space-y-2">
              {group.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
