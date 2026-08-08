"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  Mail,
  CheckSquare,
  User,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useSearch } from "@/features/search/use-search";
import { SearchResultType, SearchResult } from "@/features/search/types";

const typeConfig: Record<
  SearchResultType,
  { label: string; icon: typeof Mail; color: string }
> = {
  thread: { label: "Thread", icon: Mail, color: "text-blue-400" },
  task: { label: "Task", icon: CheckSquare, color: "text-amber-400" },
  contact: { label: "Contact", icon: User, color: "text-emerald-400" },
};

export default function SearchPage() {
  const router = useRouter();
  const { selectedAccount } = useAuth();

  const {
    query,
    setQuery,
    debouncedQuery,
    results,
    loading,
    hasMore,
    recent,
    observerTarget,
    clearSearch,
    handleRecentClick,
  } = useSearch(selectedAccount?.id);

  // Route to the threads page on result click
  const handleResultClick = (result: SearchResult) => {
    const threadId = result.metadata.threadId;
    const emailId = result.metadata.emailId;
    if (threadId) {
      let targetUrl = `/dashboard/threads/${threadId}`;
      if (emailId) {
        targetUrl += `?email=${emailId}`;
      }
      router.push(targetUrl);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero search section */}
      <div className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 backdrop-blur mb-6">
          <Sparkles className="size-3 text-[#8b7cf8]" />
          Semantic search across emails, tasks & contacts
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Smart Search
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Search using natural language — find anything in your inbox
          intelligence
        </p>

        {/* Search input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/25" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'partnership proposals from last week' or 'pending code reviews'"
            className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-[#6d5bfa]/40 focus:border-[#6d5bfa]/40 transition-all duration-200"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results or recent searches */}
      {debouncedQuery.trim() ? (
        <div className="space-y-4">
          {/* Results header */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="text-white/70 font-medium">
                &ldquo;{debouncedQuery}&rdquo;
              </span>
            </span>
          </div>

          {/* Skeletons/Results list */}
          {loading && results.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="glass-card rounded-xl px-5 py-4 animate-pulse flex items-start gap-4"
                >
                  <div className="size-9 rounded-lg bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/10 rounded w-1/4" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result) => {
                const config = typeConfig[result.type];
                const TypeIcon = config.icon;

                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="glass-card rounded-xl px-5 py-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Type icon */}
                      <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <TypeIcon className={`size-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] uppercase tracking-widest font-semibold ${config.color}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-[10px] text-white/15">
                            · {Math.round(result.relevance_score * 100)}% match
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white/90 mb-1 group-hover:text-white transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-xs text-white/35 line-clamp-2">
                          {result.snippet}
                        </p>

                        {/* Metadata tags */}
                        {(result.metadata.sender ||
                          result.metadata.priority ||
                          result.metadata.status) && (
                          <div className="flex items-center gap-2 mt-2">
                            {result.metadata.sender && (
                              <span className="text-[10px] text-white/25 bg-white/5 px-2 py-0.5 rounded-full">
                                {result.metadata.sender}
                              </span>
                            )}
                            {result.metadata.priority && (
                              <span
                                className={`badge-${result.metadata.priority} text-[10px] font-medium px-2 py-0.5 rounded-full`}
                              >
                                {result.metadata.priority}
                              </span>
                            )}
                            {result.metadata.status && (
                              <span
                                className={`badge-${result.metadata.status} text-[10px] font-medium px-2 py-0.5 rounded-full`}
                              >
                                {result.metadata.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="size-4 text-white/10 group-hover:text-white/30 transition-colors shrink-0 mt-2" />
                    </div>
                  </div>
                );
              })}

              {results.length === 0 && !loading && (
                <div className="glass-card rounded-xl px-6 py-16 text-center">
                  <Search className="size-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">
                    No results found for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                  <p className="text-white/15 text-xs mt-1">
                    Try different keywords or phrases
                  </p>
                </div>
              )}

              {/* Load More observer loader */}
              {hasMore && results.length > 0 && (
                <div
                  ref={observerTarget}
                  className="h-16 flex items-center justify-center"
                >
                  <div className="size-5 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/25">
            <Clock className="size-4" />
            <span className="text-sm font-medium">Recent Searches</span>
          </div>

          <div className="space-y-1">
            {recent.map((search) => (
              <button
                key={search.id}
                onClick={() => handleRecentClick(search.query)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                <Search className="size-4 text-white/15 group-hover:text-white/30 shrink-0" />
                <span className="text-sm text-white/50 group-hover:text-white/70 flex-1">
                  {search.query}
                </span>
                <span className="text-[11px] text-white/15">
                  {search.result_count} results
                </span>
                <ArrowRight className="size-3.5 text-white/10 group-hover:text-white/25 shrink-0" />
              </button>
            ))}
            {recent.length === 0 && (
              <p className="text-xs text-white/20 px-4 py-2">
                No recent searches.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
