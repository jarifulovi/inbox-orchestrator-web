import { useState, useCallback } from "react";
import { Task } from "@/features/tasks/types";
import { api } from "@/lib/axios";

export interface UseDraftComposerOptions {
  accountId?: string;
  threadId?: string;
  threadSubject?: string;
  lastSenderEmail?: string;
  replyToEmailId?: string;
  pendingTasks?: Task[];
  onSuccess?: () => void;
}

export function useDraftComposer(options: UseDraftComposerOptions = {}) {
  const {
    accountId,
    threadId,
    threadSubject = "",
    lastSenderEmail = "",
    replyToEmailId,
    pendingTasks = [],
    onSuccess,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Form Fields
  const [recipientTo, setRecipientTo] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [aiInstructions, setAiInstructions] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [draftBody, setDraftBody] = useState("");

  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Open Composer with auto pre-fills
  const openComposer = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);

    setRecipientTo(lastSenderEmail);
    const prefilledSubject = threadSubject
      ? threadSubject.toLowerCase().startsWith("re:")
        ? threadSubject
        : `Re: ${threadSubject}`
      : "New Email Message";
    setSubject(prefilledSubject);

    // Auto-select all pending tasks by default for resolution
    if (pendingTasks.length > 0) {
      setSelectedTaskIds(new Set(pendingTasks.map((t) => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  }, [lastSenderEmail, threadSubject, pendingTasks]);

  const closeComposer = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // Toggle Task Resolution Selection
  const toggleTaskResolution = useCallback((taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);

  // Select all or clear all tasks
  const toggleAllTasks = useCallback(() => {
    if (selectedTaskIds.size === pendingTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(pendingTasks.map((t) => t.id)));
    }
  }, [pendingTasks, selectedTaskIds.size]);

  // AI Content Generation (Mocked for UI workflow)
  const generateDraftContent = useCallback(async () => {
    setIsGenerating(true);
    setStatusMessage("AI is composing email text based on context...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const selectedTaskTitles = pendingTasks
        .filter((t) => selectedTaskIds.has(t.id))
        .map((t) => t.title);

      const recipientName = recipientTo.split("@")[0] || "there";
      const resolutionNote =
        selectedTaskTitles.length > 0
          ? `Regarding: ${selectedTaskTitles.join("; ")}.`
          : "";

      const sampleGeneratedDraft = `Hi ${recipientName},\n\nThank you for your update regarding ${threadSubject || "the ongoing discussion"}.\n\n${resolutionNote}\n${aiInstructions ? `Note: ${aiInstructions}\n` : ""}I have reviewed the details and confirm everything looks good on our end. Please let me know if any further clarification is required.\n\nBest regards,\nOvi`;

      setDraftBody(sampleGeneratedDraft);
      setStatusMessage("AI Draft generated successfully.");
    } catch (err) {
      console.error("AI Draft Generation failed:", err);
      setStatusMessage("Failed to generate AI draft.");
    } finally {
      setIsGenerating(false);
    }
  }, [recipientTo, threadSubject, pendingTasks, selectedTaskIds, aiInstructions]);

  // Quick Refine Actions
  const applyQuickRefine = useCallback((refinementType: string) => {
    if (!draftBody) return;
    setIsGenerating(true);
    setTimeout(() => {
      if (refinementType === "shorter") {
        setDraftBody(
          `Hi,\n\nThanks for the update on ${threadSubject}. Confirmed on our end.\n\nBest,\nOvi`
        );
      } else if (refinementType === "formal") {
        setDraftBody(
          `Dear Team,\n\nThank you for your recent correspondence regarding ${threadSubject}. We have thoroughly evaluated the matter and confirm our concurrence.\n\nSincerely,\nOvi`
        );
      } else if (refinementType === "action") {
        setDraftBody(
          `${draftBody}\n\nCould you please confirm receipt and send over the updated schedule by EOD?`
        );
      }
      setIsGenerating(false);
    }, 800);
  }, [draftBody, threadSubject]);

  // Save Draft (API Integration)
  const saveDraft = useCallback(async () => {
    if (!accountId || !threadId) return null;
    setIsSaving(true);
    setStatusMessage("Saving draft to mailbox...");
    try {
      const recipients = recipientTo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        recipient_to: recipients.length > 0 ? recipients : [lastSenderEmail || "unknown@example.com"],
        subject: subject || threadSubject || "No Subject",
        body: draftBody || "",
        reply_to_email_id: replyToEmailId || null,
        resolved_task_ids: Array.from(selectedTaskIds),
        generation_context: aiInstructions ? { ai_instructions: aiInstructions, tone: selectedTone } : null,
      };

      const res = await api.post<{ status: string; data: any }>(
        `/emails/threads/${threadId}/drafts?account_id=${accountId}`,
        payload
      );

      setStatusMessage("Draft saved & synced successfully.");
      if (onSuccess) onSuccess();
      return res.data;
    } catch (err) {
      console.error("Failed to save draft:", err);
      setStatusMessage("Failed to save draft.");
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [
    accountId,
    threadId,
    recipientTo,
    subject,
    draftBody,
    replyToEmailId,
    selectedTaskIds,
    aiInstructions,
    selectedTone,
    lastSenderEmail,
    threadSubject,
    onSuccess,
  ]);

  // Send Email (API Integration)
  const sendEmail = useCallback(async () => {
    if (!accountId || !threadId) return null;
    setIsSaving(true);
    setStatusMessage("Sending message...");
    try {
      const draftRes = await saveDraft();
      const draftId = draftRes?.data?.id;

      if (draftId) {
        await api.post(`/emails/drafts/${draftId}/send?account_id=${accountId}`);
      }

      setStatusMessage("Message sent successfully.");
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to send message:", err);
      setStatusMessage("Failed to send message.");
    } finally {
      setIsSaving(false);
    }
  }, [accountId, threadId, saveDraft, onSuccess]);

  // Reset all composer fields
  const resetComposer = useCallback(() => {
    setRecipientTo("");
    setSubject("");
    setSelectedTaskIds(new Set());
    setAiInstructions("");
    setDraftBody("");
    setStatusMessage(null);
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  return {
    isOpen,
    isMinimized,
    recipientTo,
    subject,
    selectedTaskIds,
    aiInstructions,
    selectedTone,
    draftBody,
    isGenerating,
    isSaving,
    statusMessage,
    // Actions
    setRecipientTo,
    setSubject,
    setAiInstructions,
    setSelectedTone,
    setDraftBody,
    openComposer,
    closeComposer,
    toggleMinimize,
    toggleTaskResolution,
    toggleAllTasks,
    generateDraftContent,
    applyQuickRefine,
    saveDraft,
    sendEmail,
    resetComposer,
  };
}
