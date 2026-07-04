export type Priority = "high" | "medium" | "low";

export type WorkflowStatus =
  | "needs_action"
  | "awaiting_reply"
  | "informational"
  | "follow_up"
  | "archived";

export type SecurityTrustLevel = "unverified" | "suspicious" | "neutral" | "trusted";

export type Thread = {
  id: string;
  subject: string;
  sender_name: string;
  sender_email: string;
  preview: string;
  summary: string;
  priority: Priority;
  workflow_status: WorkflowStatus;
  security_trust_level: SecurityTrustLevel;
  tasks_count: number;
  timestamp: string;
  unread: boolean;
  message_count: number;
  account_email: string;
};

export type EmailAccount = {
  email: string;
  name: string;
  avatar_color: string;
  pending_tasks_count: number;
};
