"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PenSquare, Filter, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { DraftRecord } from "@/features/drafts/types";
import { DraftCard } from "@/features/drafts/components/DraftCard";

type FilterTab = "all" | "pending_approval" | "draft" | "sent";

export default function DraftsPage() {
  const { selectedAccount } = useAuth();
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const fetchDrafts = async () => {
    if (!selectedAccount?.id) return;
    setLoading(true);
    try {
      const statusParam = filterTab === "all" ? "all" : filterTab;
      const res = await api.get<{ status: string; data: DraftRecord[] }>(
        `/emails/drafts?account_id=${selectedAccount.id}&status=${statusParam}`
      );
      setDrafts(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch drafts:", err);
      toast.error("Failed to load drafts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount?.id, filterTab]);

  const statusCounts = useMemo(() => {
    const counts = { pending_approval: 0, draft: 0, sent: 0 };
    for (const d of drafts) {
      if (d.status in counts) {
        counts[d.status as keyof typeof counts]++;
      }
    }
    return counts;
  }, [drafts]);

  const handleSendDraft = async (draftId: string) => {
    if (!selectedAccount?.id) return;
    try {
      await api.post(`/emails/drafts/${draftId}/send?account_id=${selectedAccount.id}`);
      toast.success("Draft sent successfully!");
      fetchDrafts();
    } catch (err) {
      console.error("Failed to send draft:", err);
      toast.error("Failed to send draft.");
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    toast.info("Draft deletion is not yet implemented.");
  };

  if (!selectedAccount) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <Mail className="size-16 text-[#8b7cf8]/20 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">Connect your inbox</h2>
        <p className="text-sm text-white/40 leading-relaxed">
          Connect your Google account to start managing email drafts.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#6d5bfa] hover:bg-[#5b4ae3] text-sm font-semibold transition-colors shadow-lg shadow-[#6d5bfa]/20"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "All" },
    { key: "pending_approval", label: "AI Pending", count: statusCounts.pending_approval },
    { key: "draft", label: "Saved Drafts", count: statusCounts.draft },
    { key: "sent", label: "Sent History", count: statusCounts.sent },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <PenSquare className="size-6 text-[#8b7cf8]" />
            Drafts
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {statusCounts.pending_approval + statusCounts.draft} active · {drafts.length} total drafts
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <div className="flex items-center gap-2 text-white/30 px-2">
          <Filter className="size-4" />
        </div>
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterTab === tab.key
                ? "bg-[#6d5bfa]/20 text-[#8b7cf8]"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                filterTab === tab.key
                  ? "bg-[#6d5bfa]/30 text-[#8b7cf8]"
                  : "bg-white/10 text-white/40"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Drafts List */}
      <div className="max-h-[calc(100vh-230px)] overflow-y-auto custom-scrollbar space-y-2.5 pr-1.5 pb-6">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Loader2 className="size-6 text-[#8b7cf8] animate-spin" />
              <span className="text-white/40 text-sm">Loading drafts...</span>
            </div>
          </div>
        ) : drafts.length > 0 ? (
          drafts.map((draft) => (
            <DraftCard
              key={draft.id}
              draft={draft}
              onDelete={handleDeleteDraft}
              onSend={handleSendDraft}
            />
          ))
        ) : (
          <div className="glass-card rounded-xl px-6 py-16 text-center">
            <PenSquare className="size-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              {filterTab === "all" ? "No drafts yet." : `No ${filterTabs.find(t => t.key === filterTab)?.label?.toLowerCase()} drafts.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
