export type SearchResultType = "thread" | "task" | "contact";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  relevance_score: number;
  timestamp: string;
  metadata: {
    sender?: string;
    priority?: string;
    status?: string;
    threadId?: string;
    emailId?: string;
  };
};

export type RecentSearch = {
  id: string;
  query: string;
  timestamp: string;
  result_count: number;
};
