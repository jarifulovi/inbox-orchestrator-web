"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Mail, CheckSquare, Inbox, Filter, ChevronDown } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useThreads } from "@/features/threads/use-threads";
import { Thread, WorkflowStatus, CategoryFilter } from "@/features/threads/types";
import { getInitial, getAvatarColor, formatTime } from "@/features/threads/utils";
import { ThreadsProvider } from "@/features/threads/threads-context";

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

function CategoryColorDropdown({
  value,
  onChange,
}: {
  value: CategoryFilter;
  onChange: (val: CategoryFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorConfig: Record<CategoryFilter, { bg: string; shadow: string; label: string }> = {
    focused: {
      bg: "bg-emerald-400",
      shadow: "shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      label: "Focused",
    },
    all: {
      bg: "bg-blue-400",
      shadow: "shadow-[0_0_8px_rgba(96,165,250,0.6)]",
      label: "All Threads",
    },
    noise: {
      bg: "bg-amber-400",
      shadow: "shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      label: "Noise",
    },
  };

  const current = colorConfig[value];

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        title={`View: ${current.label}`}
      >
        <span className={`size-2.5 rounded-full ${current.bg} ${current.shadow}`} />
        <ChevronDown className="size-3 text-white/40" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-36 py-1 bg-[#161921] border border-white/10 rounded-xl shadow-2xl z-50 text-xs space-y-0.5">
          {(["focused", "all", "noise"] as CategoryFilter[]).map((cat) => {
            const conf = colorConfig[cat];
            const isSelected = value === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected ? "bg-white/10 text-white font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`size-2 rounded-full ${conf.bg} ${conf.shadow}`} />
                <span>{conf.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ThreadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const { selectedAccount, loading: authLoading } = useAuth();

  const activeThreadId = params?.threadId as string | undefined;

  const [filterCategory, setFilterCategory] = useState<CategoryFilter>("focused");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const threadFilters = useMemo(
    () => ({
      category: filterCategory,
      q: debouncedQuery,
    }),
    [filterCategory, debouncedQuery]
  );

  // Persistent threads hook for the left panel
  const {
    threads,
    loading: loadingThreads,
    loadingMore,
    hasMore,
    loadMore,
    refetch,
    updateThreadInList,
  } = useThreads(selectedAccount?.id, threadFilters, authLoading);

  const visibleThreads = useMemo(() => {
    let result = threads;
    // Search override: if search query 'q' is active, do not filter out noise locally
    if (!debouncedQuery.trim()) {
      if (filterCategory === "focused") {
        result = result.filter((t) => t.category !== "others" && Boolean(t.category));
      } else if (filterCategory === "noise") {
        result = result.filter((t) => t.category === "others" || !t.category);
      }
    }
    return result;
  }, [threads, filterCategory, debouncedQuery]);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!hasMore || loadingThreads || loadingMore) return;

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
  }, [hasMore, loadingThreads, loadingMore, loadMore]);

  function selectThread(id: string) {
    router.push(`/dashboard/threads/${id}`, { scroll: false });
  }

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
    <ThreadsProvider refetchThreads={refetch} updateThreadInList={updateThreadInList}>
      <div className="h-[calc(100vh-56px)] w-full flex overflow-hidden bg-[#0e1117]">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PERSISTENT LEFT PANEL — Thread list (Never unmounts on navigation)  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="w-[280px] shrink-0 border-r border-white/[0.06] flex flex-col h-full">
          {/* Search bar & Category dropdown */}
          <div className="px-3 py-3 border-b border-white/[0.06] flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="size-3.5 text-white/25 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-2 py-1.5 text-xs text-white/70 placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#6d5bfa]/40"
              />
            </div>
            <CategoryColorDropdown
              value={filterCategory}
              onChange={(cat) => {
                setSearchQuery("");
                setFilterCategory(cat);
              }}
            />
          </div>

          {/* Thread list scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-0.5">
            {loadingThreads ? (
              <div className="text-center py-10 flex flex-col items-center gap-2">
                <div className="size-5 border-2 border-[#6d5bfa] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-white/30">Loading threads...</span>
              </div>
            ) : visibleThreads.length === 0 ? (
              <div className="text-center py-10">
                <Mail className="size-8 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/25">No threads found</p>
              </div>
            ) : (
              <>
                {visibleThreads.map((t) => (
                  <ThreadListItem
                    key={t.id}
                    thread={t}
                    isActive={t.id === activeThreadId}
                    onClick={() => selectThread(t.id)}
                  />
                ))}

                {/* Infinite Scroll Sentinel */}
                {!loadingThreads && hasMore && (
                  <div ref={observerTarget} className="h-12 flex items-center justify-center pt-2">
                    {loadingMore && (
                      <div className="flex items-center gap-2">
                        <div className="size-4 border-2 border-[#6d5bfa] border-t-transparent rounded-full animate-spin" />
                        <span className="text-white/40 text-[10px]">Loading more...</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MIDDLE & RIGHT PANELS — Children route views                       */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 flex h-full">
          {children}
        </div>
      </div>
    </ThreadsProvider>
  );
}
