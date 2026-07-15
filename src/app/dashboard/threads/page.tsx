"use client";
// /dashboard/threads redirects to the three-panel shell without a selected thread.
// The [threadId] page handles the empty-middle state already —
// we just re-export it pointing at a sentinel so the left panel is visible.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DUMMY_THREADS } from "@/features/threads/data";

export default function ThreadsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to the first thread so the panel always has something visible
    if (DUMMY_THREADS.length > 0) {
      router.replace(`/dashboard/threads/${DUMMY_THREADS[0].id}`);
    }
  }, [router]);

  return null;
}
