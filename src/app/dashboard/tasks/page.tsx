"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
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
  Eye,
  Reply,
  Trash2,
  Edit3,
  Plus,
  User,
  Search,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Task,
  TaskStatus,
  TaskPriority,
  IntentLabel,
  TaskSource,
} from "@/features/tasks/types";
import { api } from "@/lib/axios";
import { useAuth } from "@/features/auth/auth-context";
import { useTasks } from "@/features/tasks/use-tasks";
import { formatDueDate, isOverdue } from "@/features/tasks/utils";

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

function TaskCard({
  task,
  onTaskUpdated,
}: {
  task: Task;
  onTaskUpdated: () => void;
}) {
  const status = statusConfig[task.status];
  const overdue = isOverdue(task.due_date);

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [localStatus, setLocalStatus] = useState<TaskStatus>(task.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit fields state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editIntent, setEditIntent] = useState<IntentLabel>(task.intent_label);
  const [editDueDate, setEditDueDate] = useState(task.due_date ? task.due_date.slice(0, 10) : "");

  const handleResolve = async () => {
    setIsUpdating(true);
    try {
      await api.patch(`/emails/tasks/${task.id}`, { status: "completed" });
      setLocalStatus("completed");
      onTaskUpdated();
    } catch (err) {
      console.error("Failed to update task status:", err);
      setLocalStatus("completed");
    } finally {
      setIsUpdating(false);
      setResolveModalOpen(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/emails/tasks/${task.id}`);
      onTaskUpdated();
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      await api.patch(`/emails/tasks/${task.id}`, {
        title: editTitle,
        status: editStatus,
        priority: editPriority,
        intent_label: editIntent,
        due_date: editDueDate ? new Date(editDueDate).toISOString() : null,
      });
      setLocalStatus(editStatus);
      onTaskUpdated();
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const displayStatus = localStatus;
  const currentStatusConfig = statusConfig[displayStatus];
  const CurrentStatusIcon = currentStatusConfig.icon;

  return (
    <>
      <div className="glass-card rounded-xl px-5 py-4 transition-all duration-200 group">
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div
            className={`mt-0.5 size-8 rounded-lg flex items-center justify-center shrink-0 ${
              displayStatus === "completed"
                ? "bg-emerald-500/10"
                : displayStatus === "pending"
                  ? "bg-amber-500/10"
                  : "bg-zinc-500/10"
            }`}
          >
            <CurrentStatusIcon
              className={`size-4 ${
                displayStatus === "completed"
                  ? "text-emerald-400"
                  : displayStatus === "pending"
                    ? "text-amber-400"
                    : "text-zinc-400"
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3
                className={`text-sm font-semibold truncate ${
                  displayStatus === "completed" || displayStatus === "dismissed"
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
              {/* Source Badge */}
              {task.source === "manual" ? (
                <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                  <User className="size-3" /> Manual
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">
                  <Sparkles className="size-3" /> System
                </span>
              )}

              {/* Priority */}
              <span
                className={`badge-${task.priority.toLowerCase()} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}
              >
                {task.priority}
              </span>

              {/* Status */}
              <span
                className={`${currentStatusConfig.className} text-[10px] font-medium px-2 py-0.5 rounded-full`}
              >
                {currentStatusConfig.label}
              </span>

              {/* Intent label */}
              <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                <Tag className="size-3" />
                {intentLabels[task.intent_label] || task.intent_label}
              </span>
            </div>
          </div>

          {/* Due date */}
          <div className="shrink-0 text-right">
            <span
              className={`text-xs font-medium ${
                overdue && displayStatus === "pending"
                  ? "text-red-400"
                  : "text-white/30"
              }`}
            >
              {formatDueDate(task.due_date)}
            </span>
            {overdue && displayStatus === "pending" && (
              <AlertTriangle className="size-3.5 text-red-400 ml-auto mt-1" />
            )}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          {displayStatus === "pending" && (
            <button
              onClick={() => setResolveModalOpen(true)}
              className="px-3 py-1.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 mr-auto"
            >
              <CheckCircle2 className="size-3.5" />
              Resolve
            </button>
          )}

          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3 py-1.5 text-[11px] font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="size-3.5" />
            Edit
          </button>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-3 py-1.5 text-[11px] font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </button>

          {task.source_thread_id && (
            <>
              <Link
                href={`/dashboard/threads/${task.source_thread_id}`}
                className="px-3 py-1.5 text-[11px] font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Eye className="size-3.5" />
                View
              </Link>
              <Link
                href={`/dashboard/threads/${task.source_thread_id}`}
                className="px-3 py-1.5 text-[11px] font-medium bg-[#6d5bfa]/10 text-[#8b7cf8] hover:bg-[#6d5bfa]/20 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Reply className="size-3.5" />
                Reply
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Resolve Confirmation Modal */}
      <Dialog open={resolveModalOpen} onOpenChange={setResolveModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <div className="size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="size-6 text-emerald-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-2">Complete Task?</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
              Are you sure you want to mark <span className="text-white/90 font-medium">"{task.title}"</span> as completed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center min-w-28"
            >
              {isUpdating ? "Resolving..." : "Yes, Resolve"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Trash2 className="size-6 text-red-400" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-2">Delete Task?</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-white/90 font-medium">"{task.title}"</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center min-w-28"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-semibold text-white mb-2">Edit Task</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-4">
              Update task title, priority, intent, or due date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                  className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                  className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Intent Label</label>
              <select
                value={editIntent}
                onChange={(e) => setEditIntent(e.target.value as IntentLabel)}
                className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
              >
                {Object.entries(intentLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating || !editTitle.trim()}
              className="px-4 py-2 text-sm font-medium bg-[#6d5bfa] text-white hover:bg-[#5b49f8] rounded-lg transition-colors shadow-lg shadow-[#6d5bfa]/20 disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TasksPage() {
  const { selectedAccount } = useAuth();
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterLabel, setFilterLabel] = useState<IntentLabel | "all">("all");
  const [filterSource, setFilterSource] = useState<TaskSource | "all">("all");
  const [filterOverdue, setFilterOverdue] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // Create Task Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createEmailId, setCreateEmailId] = useState("");
  const [createPriority, setCreatePriority] = useState<TaskPriority>("medium");
  const [createIntent, setCreateIntent] = useState<IntentLabel>("other");
  const [createDueDate, setCreateDueDate] = useState("");
  const [emailsList, setEmailsList] = useState<Array<{ id: string; subject: string; sender: string }>>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Email Keyword Search & Existing Tasks Inspector state
  const [emailSearchQuery, setEmailSearchQuery] = useState("");
  const [existingEmailTasks, setExistingEmailTasks] = useState<Task[]>([]);
  const [loadingExistingTasks, setLoadingExistingTasks] = useState(false);

  // Search emails by keyword (debounced 300ms, capped to 6 max)
  useEffect(() => {
    if (!selectedAccount?.id || !createModalOpen) return;
    const timer = setTimeout(async () => {
      setLoadingEmails(true);
      try {
        const qParam = emailSearchQuery.trim() ? `&q=${encodeURIComponent(emailSearchQuery.trim())}` : "";
        const res = await api.get(`/emails?account_id=${selectedAccount.id}&limit=6${qParam}`);
        const emails = res.data.emails || [];
        const formatted = emails.slice(0, 6).map((e: { id: string; subject?: string; sender?: string; sender_name?: string }) => ({
          id: e.id,
          subject: e.subject || "(No Subject)",
          sender: e.sender_name || e.sender || "Unknown",
        }));
        setEmailsList(formatted);
        if (formatted.length > 0) {
          setCreateEmailId((prev) => (prev && formatted.some((f: { id: string }) => f.id === prev) ? prev : formatted[0].id));
        } else {
          setCreateEmailId("");
        }
      } catch (err) {
        console.error("Failed to search emails for task creation:", err);
      } finally {
        setLoadingEmails(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [emailSearchQuery, selectedAccount?.id, createModalOpen]);

  // Fetch existing tasks whenever selected email changes
  useEffect(() => {
    if (!createEmailId || !selectedAccount?.id || !createModalOpen) {
      setExistingEmailTasks([]);
      return;
    }
    const fetchExistingTasks = async () => {
      setLoadingExistingTasks(true);
      try {
        const res = await api.get<{ tasks: Task[] }>(
          `/emails/tasks?account_id=${selectedAccount.id}&email_id=${createEmailId}`
        );
        setExistingEmailTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch existing tasks for selected email:", err);
      } finally {
        setLoadingExistingTasks(false);
      }
    };
    fetchExistingTasks();
  }, [createEmailId, selectedAccount?.id, createModalOpen]);

  const handleOpenCreateModal = async () => {
    setCreateModalOpen(true);
    setEmailSearchQuery("");
    setExistingEmailTasks([]);
    setCreateEmailId("");
    setCreateTitle("");
    setCreateDueDate("");
    if (!selectedAccount?.id) return;
    setLoadingEmails(true);
    try {
      const res = await api.get(`/emails?account_id=${selectedAccount.id}&limit=6`);
      const emails = res.data.emails || [];
      const formatted = emails.slice(0, 6).map((e: { id: string; subject?: string; sender?: string; sender_name?: string }) => ({
        id: e.id,
        subject: e.subject || "(No Subject)",
        sender: e.sender_name || e.sender || "Unknown",
      }));
      setEmailsList(formatted);
      if (formatted.length > 0) {
        setCreateEmailId(formatted[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch emails for task creation:", err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const filters = useMemo(
    () => ({
      priority: filterPriority,
      status: filterStatus,
      intent_label: filterLabel,
      source: filterSource,
      overdue: filterOverdue,
    }),
    [filterPriority, filterStatus, filterLabel, filterSource, filterOverdue]
  );

  const {
    tasks: fetchedTasks,
    totalCount,
    pendingCount,
    loading: loadingTasks,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
  } = useTasks(selectedAccount?.id, filters);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const handleCreateTask = async () => {
    if (!selectedAccount?.id || !createTitle.trim() || !createEmailId) return;
    setIsCreating(true);
    try {
      await api.post(`/emails/tasks?account_id=${selectedAccount.id}`, {
        title: createTitle.trim(),
        email_id: createEmailId,
        account_id: selectedAccount.id,
        priority: createPriority,
        intent_label: createIntent,
        due_date: createDueDate ? new Date(createDueDate).toISOString() : null,
      });
      refresh();
      setCreateModalOpen(false);
      setCreateTitle("");
      setCreateDueDate("");
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Setup Intersection Observer for infinite scrolling pagination
  useEffect(() => {
    if (!hasMore || loadingTasks || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingTasks, loadingMore, loadMore]);

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
            {pendingCount} pending · {totalCount} total tasks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Task Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#6d5bfa] text-white text-sm font-medium hover:bg-[#5b49f8] transition-colors shadow-lg shadow-[#6d5bfa]/20"
          >
            <Plus className="size-4" />
            Create Task
          </button>

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
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <div className="flex items-center gap-2 text-white/30 px-2">
          <Filter className="size-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Priority Filter */}
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

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
          className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="dismissed">Dismissed</option>
        </select>

        {/* Source Filter */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as TaskSource | "all")}
          className="bg-[#161921] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/50 cursor-pointer"
        >
          <option value="all">All Sources</option>
          <option value="system">System</option>
          <option value="manual">Manual</option>
        </select>

        {/* Intent Label Filter */}
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
          {loadingTasks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-xl p-5 animate-pulse flex items-start gap-4">
                  <div className="size-8 rounded-lg bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-4 bg-white/10 rounded w-16" />
                      <div className="h-4 bg-white/10 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : fetchedTasks.length > 0 ? (
            <>
              {fetchedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onTaskUpdated={refresh} />
              ))}

              {/* Sentinel for IntersectionObserver */}
              <div ref={observerTarget} className="h-4 w-full" />

              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="size-6 animate-spin rounded-full border-2 border-[#8b7cf8] border-t-transparent" />
                </div>
              )}
            </>
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

      {/* Create Task Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-semibold text-white mb-1">Create Manual Task</DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-4">
              Add a new actionable item linked to an email in your inbox.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Task Title *</label>
              <input
                type="text"
                placeholder="e.g., Review contract draft"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/70">Link Email *</label>
              
              {/* Email Keyword Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search emails by keyword, subject, or sender..."
                  value={emailSearchQuery}
                  onChange={(e) => setEmailSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                />
              </div>

              {/* Email Options List / Selector */}
              {loadingEmails ? (
                <div className="text-xs text-white/40 py-2 flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin text-[#6d5bfa]" /> Searching matching emails...
                </div>
              ) : emailsList.length > 0 ? (
                <select
                  value={createEmailId}
                  onChange={(e) => setCreateEmailId(e.target.value)}
                  className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                >
                  {emailsList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.subject} — {e.sender}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Paste Target Email UUID"
                  value={createEmailId}
                  onChange={(e) => setCreateEmailId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                />
              )}

              {/* Existing Tasks Inspector Card for Selected Email */}
              {createEmailId && (
                <div className="mt-3 p-3 bg-white/[0.03] border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                      <CheckSquare className="size-3.5 text-[#6d5bfa]" /> Existing Tasks on Selected Email
                    </span>
                    {loadingExistingTasks && <Loader2 className="size-3 animate-spin text-white/40" />}
                  </div>

                  {loadingExistingTasks ? (
                    <div className="text-[11px] text-white/40 py-1 flex items-center gap-1.5">
                      <Loader2 className="size-3 animate-spin text-[#6d5bfa]" /> Fetching email tasks...
                    </div>
                  ) : existingEmailTasks.length > 0 ? (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      {existingEmailTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-white/5 rounded-lg px-2.5 py-1.5 text-xs border border-white/5"
                        >
                          <span className="truncate font-medium text-white/90 max-w-[210px]">{t.title}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase ${
                              t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              t.status === 'dismissed' ? 'bg-white/10 text-white/40' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {t.status}
                            </span>
                            <span className="text-[9px] text-white/50 uppercase">{t.priority}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-white/40 italic py-0.5">
                      No existing tasks currently linked to this email.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Priority</label>
                <select
                  value={createPriority}
                  onChange={(e) => setCreatePriority(e.target.value as TaskPriority)}
                  className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Intent Label</label>
                <select
                  value={createIntent}
                  onChange={(e) => setCreateIntent(e.target.value as IntentLabel)}
                  className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                >
                  {Object.entries(intentLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Due Date</label>
              <input
                type="date"
                value={createDueDate}
                onChange={(e) => setCreateDueDate(e.target.value)}
                className="w-full bg-[#161921] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              disabled={isCreating || !createTitle.trim() || !createEmailId}
              className="px-4 py-2 text-sm font-medium bg-[#6d5bfa] text-white hover:bg-[#5b49f8] rounded-lg transition-colors shadow-lg shadow-[#6d5bfa]/20 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Task"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
