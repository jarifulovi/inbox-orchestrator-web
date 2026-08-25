import { Task } from "@/features/tasks/types";

export type DraftStatus = "pending_approval" | "draft" | "sent" | "failed";

export interface ResolvedTask {
  task_id: string;
  title: string;
  intent_label: string;
  priority: string;
}

export interface ActiveDraft {
  id: string;
  thread_id: string;
  recipient_to: string[];
  subject: string | null;
  body: string | null;
  status: DraftStatus;
  gmail_draft_id: string | null;
  generation_context: Record<string, unknown> | null;
  resolved_task_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface DraftRecord extends ActiveDraft {
  thread_subject: string;
  resolved_tasks: ResolvedTask[];
}

export interface UseDraftComposerOptions {
  accountId?: string;
  threadId?: string;
  threadSubject?: string;
  lastSenderEmail?: string;
  replyToEmailId?: string;
  pendingTasks?: Task[];
  onSuccess?: () => void;
}

export interface DraftComposerDrawerProps {
  isOpen: boolean;
  isMinimized: boolean;
  recipientTo: string;
  subject: string;
  selectedTaskIds: Set<string>;
  aiInstructions: string;
  selectedTone: string;
  draftBody: string;
  isGenerating: boolean;
  isSaving: boolean;
  statusMessage: string | null;
  pendingTasks: Task[];
  // Handlers
  onRecipientChange: (val: string) => void;
  onSubjectChange: (val: string) => void;
  onAiInstructionsChange: (val: string) => void;
  onToneChange: (tone: string) => void;
  onDraftBodyChange: (val: string) => void;
  onToggleTask: (taskId: string) => void;
  onToggleAllTasks: () => void;
  onGenerateAI: () => void;
  onQuickRefine: (refinementType: string) => void;
  onSaveDraft: () => void;
  onSendEmail: () => void;
  onClose: () => void;
  onToggleMinimize: () => void;
  onDiscard: () => void;
}
