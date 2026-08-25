"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  User,
  Tag,
  Eye,
  Reply,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Task, IntentLabel, TaskPriority } from "@/features/tasks/types";
import { api } from "@/lib/axios";
import { useAuth } from "@/features/auth/auth-context";
import { formatDueDate, isOverdue } from "@/features/tasks/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const intentColors: Record<IntentLabel, { bg: string; text: string; border: string }> = {
  schedule_meeting: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  reply_requested: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  review_document: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  provide_information: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  make_payment: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  follow_up: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  other: { bg: "bg-[#6d5bfa]/10", text: "text-[#8b7cf8]", border: "border-[#6d5bfa]/20" },
};

const intentLabels: Record<IntentLabel, string> = {
  schedule_meeting: "Meeting",
  reply_requested: "Reply Requested",
  review_document: "Review Doc",
  provide_information: "Provide Info",
  make_payment: "Payment",
  follow_up: "Follow Up",
  other: "Task",
};

type CalendarCell =
  | { type: "empty"; key: string; tasks?: undefined }
  | { type: "day"; dayNum: number; dateKey: string; tasks: Task[]; isToday: boolean; key: string };

export function TaskCalendarView({
  tasks,
  onTaskUpdated,
}: {
  tasks: Task[];
  onTaskUpdated: () => void;
}) {
  const { selectedAccount } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [syncingGCalId, setSyncingGCalId] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Helper to construct local YYYY-MM-DD date key without UTC timezone shifts
  const getLocalDateKey = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Filter tasks to include pending and completed only (exclude dismissed)
  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "pending" || t.status === "completed");
  }, [tasks]);

  // Map visible tasks by date key (YYYY-MM-DD)
  const { tasksByDate, unscheduledTasks } = useMemo(() => {
    const map: Record<string, Task[]> = {};
    const unscheduled: Task[] = [];

    visibleTasks.forEach((t) => {
      if (t.due_date) {
        const d = new Date(t.due_date);
        if (!isNaN(d.getTime())) {
          const key = getLocalDateKey(d);
          if (!map[key]) map[key] = [];
          map[key].push(t);
          return;
        }
      }
      unscheduled.push(t);
    });

    return { tasksByDate: map, unscheduledTasks: unscheduled };
  }, [visibleTasks]);

  // Derive all tasks scheduled on the same date as selectedTask for in-modal switching
  const sameDayTasks = useMemo(() => {
    if (!selectedTask) return [];
    if (!selectedTask.due_date) return [selectedTask];
    const d = new Date(selectedTask.due_date);
    if (isNaN(d.getTime())) return [selectedTask];
    const dateKey = getLocalDateKey(d);
    return tasksByDate[dateKey] || [selectedTask];
  }, [selectedTask, tasksByDate]);

  const handleSyncToGoogleCalendar = async (task: Task) => {
    if (task.status !== "pending") {
      toast.error("Invalid Sync Status", { description: "Only pending tasks can be exported to Google Calendar." });
      return;
    }
    if (!selectedAccount?.id) {
      toast.error("No active account selected");
      return;
    }
    setSyncingGCalId(task.id);
    try {
      const res = await api.post(`/emails/tasks/${task.id}/gcal-sync?account_id=${selectedAccount.id}`);
      const data = res.data;

      if (data.status === "permission_required") {
        toast.error("Google Calendar Scope Required", {
          description: data.message || "Please re-connect your Google account in Settings to grant calendar permissions.",
        });
      } else if (data.status === "success") {
        toast.success("Exported to Google Calendar!", {
          description: "Event created successfully.",
          action: data.event_url
            ? {
                label: "View Event",
                onClick: () => window.open(data.event_url, "_blank"),
              }
            : undefined,
        });
      } else {
        toast.error("Sync Failed", { description: data.message || "Could not sync task to calendar." });
      }
    } catch (err: unknown) {
      console.error("Google Calendar Sync error:", err);
      toast.error("Google Calendar Sync Error", {
        description: "Failed to connect to Google Calendar. Make sure calendar scopes are granted.",
      });
    } finally {
      setSyncingGCalId(null);
    }
  };

  // Build calendar matrix cells
  const calendarCells = useMemo(() => {
    const cells: CalendarCell[] = [];
    // Blank padding cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ type: "empty", key: `empty-${i}` });
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(year, month, d);
      const dateKey = getLocalDateKey(dayDate);
      const dayTasks = tasksByDate[dateKey] || [];
      const isToday =
        new Date().getDate() === d &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      cells.push({
        type: "day",
        dayNum: d,
        dateKey,
        tasks: dayTasks,
        isToday,
        key: `day-${d}`,
      });
    }
    return cells;
  }, [daysInMonth, firstDayOfWeek, month, year, tasksByDate]);

  return (
    <div className="space-y-6">
      {/* Calendar Control Header */}
      <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3.5">
        <div className="flex items-center gap-3">
          <CalendarIcon className="size-5 text-[#8b7cf8]" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            {monthName} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={todayMonth}
            className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors"
            title="Next Month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Monthly Grid (3 columns on large screens) */}
        <div className="lg:col-span-3 glass-card rounded-xl p-4 overflow-hidden">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-2 border-b border-white/[0.06]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 auto-rows-fr">
            {calendarCells.map((cell) => {
              if (cell.type === "empty") {
                return <div key={cell.key} className="h-[88px] bg-white/[0.01] rounded-lg border border-transparent" />;
              }

              if (cell.type !== "day") return null;

              const hasTasks = cell.tasks.length > 0;

              return (
                <div
                  key={cell.key}
                  onClick={() => {
                    if (hasTasks) setSelectedTask(cell.tasks[0]);
                  }}
                  className={`h-[88px] p-2 rounded-lg border flex flex-col justify-between text-left transition-all overflow-hidden ${
                    hasTasks ? "cursor-pointer hover:bg-white/[0.05] hover:border-white/20 group" : ""
                  } ${
                    cell.isToday
                      ? "bg-[#6d5bfa]/10 border-[#6d5bfa]/40 shadow-inner shadow-[#6d5bfa]/10"
                      : "bg-white/[0.02] border-white/[0.05]"
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex items-center justify-between mb-1 w-full">
                    <span
                      className={`text-xs font-bold ${
                        cell.isToday
                          ? "bg-[#6d5bfa] text-white size-5 rounded-full flex items-center justify-center"
                          : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {cell.tasks.length > 0 && (
                      <span className="text-[10px] text-[#8b7cf8] bg-[#6d5bfa]/15 px-1.5 py-0.2 rounded-full font-medium">
                        {cell.tasks.length} task{cell.tasks.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Cell Task Indicators (Max 1 Task + 1 More Indicator) */}
                  <div className="space-y-1 overflow-hidden w-full flex-1 flex flex-col justify-end">
                    {hasTasks && (() => {
                      const firstTask = cell.tasks[0];
                      const colors = intentColors[firstTask.intent_label] || intentColors.other;
                      const isDone = firstTask.status === "completed";
                      return (
                        <div
                          key={firstTask.id}
                          className={`w-full px-1.5 py-0.5 rounded text-[11px] font-medium border truncate ${colors.bg} ${colors.text} ${colors.border} ${
                            isDone ? "opacity-50 line-through" : ""
                          }`}
                        >
                          {firstTask.title}
                        </div>
                      );
                    })()}
                    {cell.tasks.length > 1 && (
                      <div className="w-full px-1.5 py-0.5 rounded text-[10px] font-medium text-white/50 bg-white/5 truncate">
                        +{cell.tasks.length - 1} more...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unscheduled Tasks Sidebar */}
        <div className="glass-card rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center justify-between">
            <span>Unscheduled Tasks</span>
            <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-normal">
              {unscheduledTasks.length}
            </span>
          </h3>

          <div className="space-y-2 overflow-y-auto max-h-[500px] custom-scrollbar flex-1 pr-1">
            {unscheduledTasks.length > 0 ? (
              unscheduledTasks.map((task) => {
                const colors = intentColors[task.intent_label] || intentColors.other;
                const isDone = task.status === "completed";
                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`text-xs font-medium ${isDone ? "text-white/40 line-through" : "text-white/80 group-hover:text-white"} truncate`}>
                        {task.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {intentLabels[task.intent_label] || task.intent_label}
                      </span>
                      <span className={`badge-${task.priority.toLowerCase()} text-[9px] px-1.5 py-0.2 rounded uppercase`}>
                        {task.priority}
                      </span>
                      {isDone && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-white/30 text-xs italic">
                All tasks are scheduled on the calendar grid!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Details & Google Calendar Sync Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="sm:max-w-md bg-[#161921] border-white/10 text-white shadow-2xl p-6">
            <DialogHeader className="text-left">
              {/* Task Selector Dropdown for days with multiple tasks */}
              {sameDayTasks.length > 1 && (
                <div className="mb-3 p-2 rounded-lg bg-white/5 border border-white/10">
                  <label className="block text-[11px] font-medium text-white/60 mb-1 flex items-center justify-between">
                    <span>Tasks Scheduled for this Date ({sameDayTasks.length}):</span>
                    <span className="text-[#8b7cf8] font-normal text-[10px]">Switch selection below</span>
                  </label>
                  <select
                    value={selectedTask.id}
                    onChange={(e) => {
                      const found = sameDayTasks.find((t) => t.id === e.target.value);
                      if (found) setSelectedTask(found);
                    }}
                    className="w-full bg-[#161921] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]"
                  >
                    {sameDayTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.status === "completed" ? "Completed" : "Pending"}] {t.title} ({intentLabels[t.intent_label] || t.intent_label})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${intentColors[selectedTask.intent_label]?.bg || intentColors.other.bg} ${intentColors[selectedTask.intent_label]?.text || intentColors.other.text} ${intentColors[selectedTask.intent_label]?.border || intentColors.other.border}`}>
                  {intentLabels[selectedTask.intent_label] || selectedTask.intent_label}
                </span>
                <span className={`badge-${selectedTask.priority.toLowerCase()} text-xs font-semibold px-2 py-0.5 rounded-full uppercase`}>
                  {selectedTask.priority}
                </span>
                {selectedTask.status === "completed" ? (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Completed
                  </span>
                ) : (
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                    Pending
                  </span>
                )}
              </div>
              <DialogTitle className={`text-lg font-bold text-white leading-snug ${selectedTask.status === "completed" ? "line-through opacity-70" : ""}`}>
                {selectedTask.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-white/50 mt-1">
                From thread: <span className="text-white/80 italic">{selectedTask.source_thread_subject}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div className="flex items-center justify-between text-xs text-white/60 bg-white/5 px-3 py-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-white/40" />
                  Scheduled Due Date:
                </span>
                <span className={`font-medium ${isOverdue(selectedTask.due_date) ? "text-red-400" : "text-white/90"}`}>
                  {formatDueDate(selectedTask.due_date)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60 bg-white/5 px-3 py-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  {selectedTask.source === "manual" ? <User className="size-3.5 text-blue-400" /> : <Sparkles className="size-3.5 text-purple-400" />}
                  Origin Source:
                </span>
                <span className="font-medium capitalize text-white/90">
                  {selectedTask.source || "system"}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
              {/* Sync to Google Calendar Button */}
              <button
                onClick={() => handleSyncToGoogleCalendar(selectedTask)}
                disabled={syncingGCalId === selectedTask.id || selectedTask.status !== "pending"}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTask.status === "pending"
                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 hover:bg-amber-500/30 disabled:opacity-50"
                    : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {syncingGCalId === selectedTask.id ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Exporting to Google Calendar...
                  </>
                ) : selectedTask.status !== "pending" ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    Task Completed — Sync Disabled
                  </>
                ) : (
                  <>
                    <ExternalLink className="size-4 text-amber-400" />
                    Sync to Google Calendar
                  </>
                )}
              </button>

              <div className="flex items-center justify-end gap-2">
                {selectedTask.source_thread_id && (
                  <Link
                    href={`/dashboard/threads/${selectedTask.source_thread_id}`}
                    onClick={() => setSelectedTask(null)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#6d5bfa]/10 text-[#8b7cf8] hover:bg-[#6d5bfa]/20 rounded-lg transition-colors"
                  >
                    <Eye className="size-3.5" />
                    View Source Thread
                  </Link>
                )}
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
