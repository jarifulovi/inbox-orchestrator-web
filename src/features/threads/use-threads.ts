import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { Thread } from "./types";

export function useThreads(
  accountId: string | undefined,
  filters?: { status?: string; priority?: string; q?: string },
  authLoading: boolean = false
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
      if (authLoading || !accountId) return;
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
      } catch (err: any) {
        if (
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return;
        }
        if (err?.response?.status === 401) {
          // Retry after transient auth token restoration
          setTimeout(() => {
            fetchThreads(currentOffset, append, signal);
          }, 400);
          return;
        }
        console.error("Failed to fetch threads:", err);
      }
    },
    [accountId, authLoading, filters?.status, filters?.priority, filters?.q]
  );

  // Initial load or account/filter switch with AbortController cancellation
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!accountId) {
      setThreads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setOffset(0);
    setHasMore(true);

    async function initFetch() {
      await fetchThreads(0, false, controller.signal);
      if (mounted) {
        setLoading(false);
      }
    }

    initFetch();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accountId, authLoading, fetchThreads]);

  // Load next page function
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !accountId || authLoading) return;

    setLoadingMore(true);
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);

    await fetchThreads(nextOffset, true);
    setLoadingMore(false);
  }, [loading, loadingMore, hasMore, accountId, authLoading, offset, fetchThreads]);

  // Sync inbox background worker trigger
  const syncInbox = useCallback(async () => {
    if (!accountId || syncing || authLoading) return;
    setSyncing(true);
    try {
      await api.post(`/emails/threads/sync?account_id=${accountId}`);
      await fetchThreads(0, false);
    } catch (err) {
      console.error("Failed to trigger inbox sync:", err);
    } finally {
      setSyncing(false);
    }
  }, [accountId, syncing, authLoading, fetchThreads]);

  return {
    threads,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    syncing,
    syncInbox,
    refetch: () => fetchThreads(0, false),
  };
}
