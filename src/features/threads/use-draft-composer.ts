import { useState, useCallback } from "react";
import { Task } from "@/features/tasks/types";

export interface UseDraftComposerOptions {
  threadSubject?: string;
  lastSenderEmail?: string;
  pendingTasks?: Task[];
}

export function useDraftComposer(options: UseDraftComposerOptions = {}) {
  const { threadSubject = "", lastSenderEmail = "", pendingTasks = [] } = options;

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

  // Save Draft (Mocked action)
  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatusMessage("Draft saved to mailbox.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Send Email (Mocked action)
  const sendEmail = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatusMessage("Message sent successfully.");
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

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
