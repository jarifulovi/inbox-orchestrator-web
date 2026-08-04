import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { Task, TaskFilters, TasksResponse } from "./types";

export function useTasks(accountId: string | undefined, filters?: TaskFilters) {
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
      if (!accountId) return;
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

        setTotalCount(res.data.total_count ?? 0);
        setPendingCount(res.data.pending_count ?? 0);
        setHasMore(newTasks.length === LIMIT);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    },
    [
      accountId,
      filters?.priority,
      filters?.status,
      filters?.intent_label,
      filters?.source,
      filters?.overdue,
    ]
  );

  // Re-fetch when accountId or filters change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setOffset(0);
    setHasMore(true);

    async function initFetch() {
      if (!accountId) {
        setTasks([]);
        setTotalCount(0);
        setPendingCount(0);
        setLoading(false);
        return;
      }
      await fetchTasks(0, false);
      if (mounted) setLoading(false);
    }

    initFetch();

    return () => {
      mounted = false;
    };
  }, [accountId, fetchTasks]);

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore || !accountId) return;
    setLoadingMore(true);
    const nextOffset = offset + LIMIT;
    await fetchTasks(nextOffset, true);
    setOffset(nextOffset);
    setLoadingMore(false);
  };

  const refresh = async () => {
    setOffset(0);
    setHasMore(true);
    await fetchTasks(0, false);
  };

  return {
    tasks,
    totalCount,
    pendingCount,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
  };
}
