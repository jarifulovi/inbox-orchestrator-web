import { useState, useCallback, useEffect, useRef } from "react";
import { Task } from "@/features/tasks/types";
import { api } from "@/lib/axios";
import { ActiveDraft, UseDraftComposerOptions } from "./types";

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

  // Active Draft State
  const [activeDraft, setActiveDraft] = useState<ActiveDraft | null>(null);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const fetchedThreadRef = useRef<string | null>(null);

  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch active draft for this thread on mount / thread change
  useEffect(() => {
    if (!accountId || !threadId) return;
    if (fetchedThreadRef.current === threadId) return;

    const fetchActiveDraft = async () => {
      setDraftLoading(true);
      try {
        const res = await api.get<{ status: string; data: ActiveDraft[] }>(
          `/emails/threads/${threadId}/drafts?account_id=${accountId}`
        );
        const drafts = res.data?.data || [];
        // Find the first active (unsent) draft
        const active = drafts.find(
          (d) => d.status === "draft" || d.status === "pending_approval"
        );
        if (active) {
          setActiveDraft(active);
          setActiveDraftId(active.id);
        } else {
          setActiveDraft(null);
          setActiveDraftId(null);
        }
        fetchedThreadRef.current = threadId;
      } catch (err) {
        console.error("Failed to fetch active draft:", err);
        setActiveDraft(null);
        setActiveDraftId(null);
      } finally {
        setDraftLoading(false);
      }
    };

    fetchActiveDraft();
  }, [accountId, threadId]);

  const hasActiveDraft = !!activeDraft;

  // Open Composer — hydrate from active draft if exists, otherwise use defaults
  const openComposer = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);

    if (activeDraft) {
      // Hydrate from existing draft
      setRecipientTo(activeDraft.recipient_to?.join(", ") || lastSenderEmail);
      setSubject(activeDraft.subject || threadSubject || "");
      setDraftBody(activeDraft.body || "");
      setActiveDraftId(activeDraft.id);
      // Restore resolved task selections
      if (activeDraft.resolved_task_ids?.length > 0) {
        setSelectedTaskIds(new Set(activeDraft.resolved_task_ids));
      } else if (pendingTasks.length > 0) {
        setSelectedTaskIds(new Set(pendingTasks.map((t) => t.id)));
      } else {
        setSelectedTaskIds(new Set());
      }
    } else {
      // Fresh composer with defaults
      setRecipientTo(lastSenderEmail);
      const prefilledSubject = threadSubject
        ? threadSubject.toLowerCase().startsWith("re:")
          ? threadSubject
          : `Re: ${threadSubject}`
        : "New Email Message";
      setSubject(prefilledSubject);

      if (pendingTasks.length > 0) {
        setSelectedTaskIds(new Set(pendingTasks.map((t) => t.id)));
      } else {
        setSelectedTaskIds(new Set());
      }
    }
  }, [activeDraft, lastSenderEmail, threadSubject, pendingTasks]);

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

  // Real Gemini LLM Manual AI Draft Generation
  const generateDraftContent = useCallback(async () => {
    if (!accountId || !threadId) return;
    setIsGenerating(true);
    setStatusMessage("Gemini AI is composing email text based on context...");
    try {
      const payload = {
        ai_instructions: aiInstructions || null,
        tone: selectedTone || "Professional",
        resolved_task_ids: Array.from(selectedTaskIds),
      };

      const res = await api.post<{
        status: string;
        data: { body: string; subject: string; recipient_to: string[] };
      }>(`/emails/threads/${threadId}/generate-draft?account_id=${accountId}`, payload);

      const generated = res.data?.data;
      if (generated?.body) {
        setDraftBody(generated.body);
        if (generated.subject && !subject) {
          setSubject(generated.subject);
        }
        if (generated.recipient_to?.length > 0 && !recipientTo) {
          setRecipientTo(generated.recipient_to.join(", "));
        }
        setStatusMessage("AI Draft generated successfully.");
      } else {
        setStatusMessage("No content generated.");
      }
    } catch (err) {
      console.error("AI Draft Generation failed:", err);
      setStatusMessage("Failed to generate AI draft.");
    } finally {
      setIsGenerating(false);
    }
  }, [accountId, threadId, aiInstructions, selectedTone, selectedTaskIds, subject, recipientTo]);

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

  // Save Draft (API Integration) — uses PUT if activeDraftId exists, POST otherwise
  const saveDraft = useCallback(async () => {
    if (!accountId || !threadId) return null;
    setIsSaving(true);
    setStatusMessage("Saving draft to mailbox...");
    try {
      const recipients = recipientTo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (activeDraftId) {
        // UPDATE existing draft
        const payload = {
          recipient_to: recipients.length > 0 ? recipients : [lastSenderEmail || "unknown@example.com"],
          subject: subject || threadSubject || "No Subject",
          body: draftBody || "",
          resolved_task_ids: Array.from(selectedTaskIds),
        };

        const res = await api.put<{ status: string; data: ActiveDraft }>(
          `/emails/drafts/${activeDraftId}?account_id=${accountId}`,
          payload
        );

        if (res.data?.data) {
          setActiveDraft(res.data.data);
        }

        setStatusMessage("Draft updated & synced successfully.");
        if (onSuccess) onSuccess();
        return res.data;
      } else {
        // CREATE new draft
        const payload = {
          recipient_to: recipients.length > 0 ? recipients : [lastSenderEmail || "unknown@example.com"],
          subject: subject || threadSubject || "No Subject",
          body: draftBody || "",
          reply_to_email_id: replyToEmailId || null,
          resolved_task_ids: Array.from(selectedTaskIds),
          generation_context: aiInstructions ? { ai_instructions: aiInstructions, tone: selectedTone } : null,
        };

        const res = await api.post<{ status: string; data: ActiveDraft }>(
          `/emails/threads/${threadId}/drafts?account_id=${accountId}`,
          payload
        );

        if (res.data?.data) {
          setActiveDraft(res.data.data);
          setActiveDraftId(res.data.data.id);
        }

        setStatusMessage("Draft saved & synced successfully.");
        if (onSuccess) onSuccess();
        return res.data;
      }
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
    activeDraftId,
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
      setActiveDraft(null);
      setActiveDraftId(null);
      fetchedThreadRef.current = null;
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
    // Active Draft State
    activeDraft,
    activeDraftId,
    hasActiveDraft,
    draftLoading,
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
