import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { Task, TaskFilters, TasksResponse } from "./types";

export function useTasks(
  accountId: string | undefined,
  filters?: TaskFilters,
  authLoading: boolean = false
) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const fetchTasks = useCallback(
    async (currentOffset: number, append: boolean) => {
      if (authLoading || !accountId) return;
      try {
        const queryParams = new URLSearchParams({
          account_id: accountId,
          limit: LIMIT.toString(),
          offset: currentOffset.toString(),
        });

        if (filters?.priority && filters.priority !== "all") {
          queryParams.append("priority", filters.priority);
        }
        if (filters?.status && filters.status !== "all") {
          queryParams.append("status", filters.status);
        }
        if (filters?.intent_label && filters.intent_label !== "all") {
          queryParams.append("intent_label", filters.intent_label);
        }
        if (filters?.source && filters.source !== "all") {
          queryParams.append("source", filters.source);
        }
        if (filters?.overdue) {
          queryParams.append("overdue", "true");
        }

        const res = await api.get<TasksResponse>(
          `/emails/tasks?${queryParams.toString()}`
        );
        const newTasks = res.data.tasks || [];

        if (append) {
          setTasks((prev) => [...prev, ...newTasks]);
        } else {
          setTasks(newTasks);
        }

        setTotalCount(res.data.total_count || 0);
        setPendingCount(res.data.pending_count || 0);
        setHasMore(newTasks.length === LIMIT);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          setTimeout(() => {
            fetchTasks(currentOffset, append);
          }, 400);
          return;
        }
        console.error("Failed to fetch tasks:", err);
      }
    },
    [
      accountId,
      authLoading,
      filters?.priority,
      filters?.status,
      filters?.intent_label,
      filters?.source,
      filters?.overdue,
    ]
  );

  // Initial load or filter/account change
  useEffect(() => {
    let mounted = true;

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!accountId) {
      setTasks([]);
      setTotalCount(0);
      setPendingCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOffset(0);
    setHasMore(true);

    async function initFetch() {
      await fetchTasks(0, false);
      if (mounted) {
        setLoading(false);
      }
    }

    initFetch();

    return () => {
      mounted = false;
    };
  }, [accountId, authLoading, fetchTasks]);

  // Load next page function
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !accountId || authLoading) return;

    setLoadingMore(true);
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);

    await fetchTasks(nextOffset, true);
    setLoadingMore(false);
  }, [loading, loadingMore, hasMore, accountId, authLoading, offset, fetchTasks]);

  return {
    tasks,
    totalCount,
    pendingCount,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refetch: () => fetchTasks(0, false),
  };
}
