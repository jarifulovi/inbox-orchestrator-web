import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { Thread } from "./types";

export function useThreads(
  accountId: string | undefined,
  filters?: { status?: string; priority?: string; q?: string }
) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const fetchThreads = useCallback(
    async (currentOffset: number, append: boolean, signal?: AbortSignal) => {
      if (!accountId) return;
      try {
        let url = `/emails/threads?account_id=${accountId}&limit=${LIMIT}&offset=${currentOffset}`;
        if (filters?.status && filters.status !== "all") {
          url += `&workflow_status=${encodeURIComponent(filters.status)}`;
        }
        if (filters?.priority && filters.priority !== "all") {
          url += `&priority=${encodeURIComponent(filters.priority)}`;
        }
        if (filters?.q && filters.q.trim()) {
          url += `&q=${encodeURIComponent(filters.q.trim())}`;
        }

        const res = await api.get<{ threads: Thread[] }>(url, { signal });
        const newThreads = res.data.threads || [];

        if (append) {
          setThreads((prev) => [...prev, ...newThreads]);
        } else {
          setThreads(newThreads);
        }

        // If returned threads count is less than the limit, we hit the end of the inbox
        setHasMore(newThreads.length === LIMIT);
      } catch (err: unknown) {
        if (
          (err as { name?: string })?.name === "CanceledError" ||
          (err as { name?: string })?.name === "AbortError"
        ) {
          return;
        }
        console.error("Failed to fetch threads:", err);
      }
    },
    [accountId, filters?.status, filters?.priority, filters?.q]
  );

  // Initial load or account/filter switch with AbortController cancellation
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    setLoading(true);
    setOffset(0);
    setHasMore(true);

    async function initFetch() {
      if (!accountId) {
        setThreads([]);
        setLoading(false);
        return;
      }
      await fetchThreads(0, false, controller.signal);
      if (mounted) setLoading(false);
    }

    initFetch();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accountId, fetchThreads]);

  const loadMore = async () => {
    if (loading || loadingMore || !hasMore || !accountId) return;
    setLoadingMore(true);
    const nextOffset = offset + LIMIT;
    await fetchThreads(nextOffset, true);
    setOffset(nextOffset);
    setLoadingMore(false);
  };

  const refresh = async () => {
    setOffset(0);
    setHasMore(true);
    await fetchThreads(0, false);
  };

  const syncInbox = async () => {
    if (!accountId) return;
    setSyncing(true);
    try {
      await api.post(`/emails/sync?account_id=${accountId}`);
      await refresh();
    } catch (err) {
      console.error("Failed to sync inbox:", err);
    } finally {
      setSyncing(false);
    }
  };

  return {
    threads,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
    syncing,
    syncInbox,
  };
}
