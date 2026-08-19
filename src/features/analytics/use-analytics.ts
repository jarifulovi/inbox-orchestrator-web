"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";
import { SenderAnalyticsItem, SystemAnalyticsSummary } from "./types";

export function useAnalytics(accountId: string | undefined, authLoading: boolean = false) {
  const [senders, setSenders] = useState<SenderAnalyticsItem[]>([]);
  const [systemSummary, setSystemSummary] = useState<SystemAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    // Guard against fetching before Auth Context has finished setting up token & selected account
    if (authLoading || !accountId) {
      if (!authLoading && !accountId) {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Execute parallel requests for senders analytics and system performance
      const [sendersRes, systemRes] = await Promise.all([
        api.get<{ results: SenderAnalyticsItem[] }>(`/analytics/senders?account_id=${accountId}&limit=50`),
        api.get<{ summary: SystemAnalyticsSummary }>(`/analytics/system?account_id=${accountId}`)
      ]);

      setSenders(sendersRes.data.results || []);
      setSystemSummary(systemRes.data.summary || null);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        // Transient 401 during token restoration - silent retry after 400ms
        setTimeout(() => {
          fetchAnalytics();
        }, 400);
        return;
      }
      console.error("Failed to fetch analytics from backend API:", err);
      setError(err?.response?.data?.detail || "Failed to load workspace analytics.");
    } finally {
      setIsLoading(false);
    }
  }, [accountId, authLoading]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    senders,
    systemSummary,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
}
