"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface ThreadArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  threadId: string;
  threadSubject: string;
  isArchived: boolean;
  accountId: string;
  onSuccess?: () => void;
}

export function ThreadArchiveModal({
  isOpen,
  onClose,
  threadId,
  threadSubject,
  isArchived,
  accountId,
  onSuccess,
}: ThreadArchiveModalProps) {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    if (!accountId || !threadId) return;
    setLoading(true);
    const targetStatus = isArchived ? "unarchive" : "archived";
    try {
      await api.patch(
        `/emails/threads/${threadId}/status?account_id=${accountId}`,
        { workflow_status: targetStatus }
      );
      toast.success(
        isArchived ? "Thread restored to active inbox." : "Thread archived."
      );
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to update thread status:", err);
      toast.error("Failed to update thread status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
        <DialogHeader className="text-left">
          <div
            className={`size-12 rounded-full border flex items-center justify-center mb-4 ${
              isArchived
                ? "bg-[#6d5bfa]/10 border-[#6d5bfa]/20 text-[#8b7cf8]"
                : "bg-zinc-500/10 border-zinc-500/20 text-zinc-400"
            }`}
          >
            {isArchived ? (
              <ArchiveRestore className="size-6" />
            ) : (
              <Archive className="size-6" />
            )}
          </div>
          <DialogTitle className="text-lg font-semibold text-white mb-2">
            {isArchived ? "Unarchive Thread?" : "Archive Thread?"}
          </DialogTitle>
          <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
            {isArchived ? (
              <>
                Are you sure you want to unarchive{" "}
                <span className="text-white/90 font-medium">
                  "{threadSubject}"
                </span>
                ? The thread will be restored to active inbox views and
                dynamically categorized.
              </>
            ) : (
              <>
                Are you sure you want to archive{" "}
                <span className="text-white/90 font-medium">
                  "{threadSubject}"
                </span>
                ? Archived threads are hidden from active inbox views and ignored
                for background re-evaluations.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center min-w-28 cursor-pointer ${
              isArchived
                ? "bg-[#6d5bfa] hover:bg-[#5b49f8] shadow-[#6d5bfa]/20"
                : "bg-zinc-700 hover:bg-zinc-600"
            }`}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isArchived ? (
              "Yes, Unarchive"
            ) : (
              "Yes, Archive"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
