"use client";

import { useState, useMemo } from "react";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Tag,
  Filter,
  CalendarDays,
  List,
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

function isOverdue(date: string | null): boolean {
  if (!date) return false;
  const diffMs = new Date(date).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 0;
}

function TaskCard({ task }: { task: Task }) {
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const overdue = isOverdue(task.due_date);

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
          <div className="flex items-center gap-2 mb-1.5">
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
          
          <div className="text-xs text-white/50 mb-3 truncate flex items-center gap-1.5">
            <span className="text-white/30">from:</span>
            <span className="text-white/70 italic">{task.source_thread_subject}</span>
          </div>

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
            <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
              <Tag className="size-3" />
              {intentLabels[task.intent_label]}
            </span>
          </div>
        </div>

        {/* Due date */}
        <div className="shrink-0 text-right">
          <span
            className={`text-xs font-medium ${
              overdue && task.status === "pending"
                ? "text-red-400"
                : "text-white/30"
            }`}
          >
            {formatDueDate(task.due_date)}
          </span>
          {overdue && task.status === "pending" && (
            <AlertTriangle className="size-3.5 text-red-400 ml-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterLabel, setFilterLabel] = useState<IntentLabel | "all">("all");
  const [filterOverdue, setFilterOverdue] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchPriority = filterPriority === "all" || t.priority === filterPriority;
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const matchLabel = filterLabel === "all" || t.intent_label === filterLabel;
      const matchOverdue = !filterOverdue || (isOverdue(t.due_date) && t.status === "pending");
      
      return matchPriority && matchStatus && matchLabel && matchOverdue;
    });
  }, [filterPriority, filterStatus, filterLabel, filterOverdue]);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="size-6 text-[#8b7cf8]" />
            Tasks
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {pendingCount} pending · {tasks.length} total tasks
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#161921] rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === "list" ? "bg-[#6d5bfa]/20 text-[#8b7cf8]" : "text-white/40 hover:text-white/70"
            }`}
          >
            <List className="size-4" />
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === "calendar" ? "bg-[#6d5bfa]/20 text-[#8b7cf8]" : "text-white/40 hover:text-white/70"
            }`}
          >
            <CalendarDays className="size-4" />
            Timeline
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <div className="flex items-center gap-2 text-white/30 px-2">
          <Filter className="size-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as TaskPriority | "all")}
          className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
          className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="dismissed">Dismissed</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value as IntentLabel | "all")}
          className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
        >
          <option value="all">All Labels</option>
          {Object.entries(intentLabels).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 px-3 py-1.5 bg-[#161921] border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
          <input
            type="checkbox"
            checked={filterOverdue}
            onChange={(e) => setFilterOverdue(e.target.checked)}
            className="accent-red-500 bg-[#161921]"
          />
          <span className="text-sm text-white/70">Deadline Crossed</span>
        </label>
      </div>

      {/* Main Content Area */}
      {viewMode === "list" ? (
        <div className="space-y-2 pb-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="glass-card rounded-xl px-6 py-16 text-center">
              <CheckSquare className="size-10 text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                No tasks match your filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-xl px-6 py-24 text-center border-dashed border-2 border-white/10">
          <CalendarDays className="size-12 text-white/10 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/70 mb-2">Timeline View</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            The calendar and timeline view is currently under construction. Please use the List view for now.
          </p>
          <button
            onClick={() => setViewMode("list")}
            className="mt-6 px-4 py-2 bg-[#6d5bfa]/20 hover:bg-[#6d5bfa]/30 text-[#8b7cf8] rounded-lg text-sm font-medium transition-colors"
          >
            Switch to List View
          </button>
        </div>
      )}
    </div>
  );
}
