import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { Thread } from "./types";
import { Task } from "@/features/tasks/types";

export type EmailFact = {
  id: string;
  email_id: string;
  fact_type: "task" | "commitment" | "decision" | "question" | "fact";
  payload?: {
    action?: string;
    actor?: string;
    target?: string;
    deadline?: string | null;
    confidence?: number;
  };
  source_sentence: string;
  created_at?: string;
};

export type ThreadEmail = {
  id: string;
  thread_id: string;
  sender: string;
  sender_name: string;
  recipient_to?: string[];
  recipients?: string[];
  subject: string;
  body: string;
  snippet: string;
  received_at: string;
  security_trust_level?: string;
  email_facts?: EmailFact[];
  email_security_analysis?: Array<{
    email_id: string;
    spf_pass?: boolean;
    dkim_pass?: boolean;
    security_trust_level?: string;
    security_trust_score?: number;
  }>;
};

export type ThreadDetail = {
  thread: Thread;
  emails: ThreadEmail[];
  tasks: Task[];
};

export function useThreadDetails(
  accountId: string | undefined,
  threadId: string | undefined
) {
  const [data, setData] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!accountId || !threadId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ThreadDetail>(
        `/emails/threads/${threadId}?account_id=${accountId}`
      );
      setData(res.data);
    } catch (err: unknown) {
      console.error(`Failed to fetch details for thread ${threadId}:`, err);
      setError("Failed to load thread details.");
    } finally {
      setLoading(false);
    }
  }, [accountId, threadId]);

  useEffect(() => {
    if (!accountId || !threadId) {
      setData(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    async function initialFetch() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<ThreadDetail>(
          `/emails/threads/${threadId}?account_id=${accountId}`,
          { signal: controller.signal }
        );
        if (mounted) {
          setData(res.data);
        }
      } catch (err: unknown) {
        if (
          (err as { name?: string })?.name === "CanceledError" ||
          (err as { name?: string })?.name === "AbortError"
        ) {
          return;
        }
        console.error(`Failed to fetch details for thread ${threadId}:`, err);
        if (mounted) {
          setError("Failed to load thread details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [accountId, threadId]);

  return {
    threadDetail: data,
    loading,
    error,
    refresh: fetchDetails,
  };
}
