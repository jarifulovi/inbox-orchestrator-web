"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/lib/axios";
import { recentSearches as defaultRecentSearches } from "@/features/search/data";
import { SearchResult, RecentSearch } from "@/features/search/types";

export function useSearch(accountId: string | undefined) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Initialize and load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        setRecent(defaultRecentSearches);
      }
    } else {
      setRecent(defaultRecentSearches);
    }
  }, []);

  // Helper to persist search query in history
  const saveRecentSearch = useCallback((searchQuery: string, count: number) => {
    if (!searchQuery.trim()) return;
    setRecent((prev) => {
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== searchQuery.toLowerCase()
      );
      const updated = [
        {
          id: `rs-${Date.now()}`,
          query: searchQuery,
          timestamp: new Date().toISOString(),
          result_count: count,
        },
        ...filtered,
      ].slice(0, 5);
      localStorage.setItem("recent_searches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Debounce the search input (350ms delay)
  useEffect(() => {
    if (query.trim().length < 3) {
      setDebouncedQuery("");
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  // Perform backend search API query
  const fetchResults = useCallback(
    async (q: string, currentOffset: number, append: boolean) => {
      if (!accountId || !q) return;
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);

        const res = await api.get<{ results: SearchResult[] }>(
          `/emails/search?account_id=${accountId}&q=${encodeURIComponent(
            q
          )}&limit=${limit}&offset=${currentOffset}&similarity_cutoff=0.35`
        );
        const newResults = res.data.results || [];

        if (append) {
          setResults((prev) => [...prev, ...newResults]);
        } else {
          setResults(newResults);
          saveRecentSearch(q, newResults.length);
        }

        setHasMore(newResults.length === limit);
      } catch (err) {
        console.error("Failed to execute smart search:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [accountId, saveRecentSearch]
  );

  // Trigger search when debounced query changes
  useEffect(() => {
    setResults([]);
    setOffset(0);
    setHasMore(true);

    if (!debouncedQuery) {
      return;
    }

    fetchResults(debouncedQuery, 0, false);
  }, [debouncedQuery, fetchResults]);

  // Load next paginated page
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !debouncedQuery) return;
    const nextOffset = offset + limit;
    await fetchResults(debouncedQuery, nextOffset, true);
    setOffset(nextOffset);
  }, [loading, loadingMore, hasMore, debouncedQuery, offset, fetchResults]);

  // Setup infinite scroll intersection observer
  useEffect(() => {
    if (!hasMore || loading || loadingMore || !debouncedQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.5 }
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
  }, [hasMore, loading, loadingMore, loadMore, debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
  }, []);

  const handleRecentClick = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    setDebouncedQuery(searchQuery);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    loading,
    loadingMore,
    hasMore,
    recent,
    observerTarget,
    clearSearch,
    handleRecentClick,
  };
}
