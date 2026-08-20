"use client";

import { createContext, useContext } from "react";
import { Thread } from "./types";

interface ThreadsContextValue {
  refetchThreads: () => void;
  updateThreadInList?: (threadId: string, updates: Partial<Thread>) => void;
}

const ThreadsContext = createContext<ThreadsContextValue>({
  refetchThreads: () => {},
});

export function ThreadsProvider({
  children,
  refetchThreads,
  updateThreadInList,
}: {
  children: React.ReactNode;
  refetchThreads: () => void;
  updateThreadInList?: (threadId: string, updates: Partial<Thread>) => void;
}) {
  return (
    <ThreadsContext.Provider value={{ refetchThreads, updateThreadInList }}>
      {children}
    </ThreadsContext.Provider>
  );
}

export function useThreadsContext() {
  return useContext(ThreadsContext);
}
