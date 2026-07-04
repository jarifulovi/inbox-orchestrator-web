export type TaskStatus = "pending" | "completed" | "dismissed" | "resolved";

export type TaskPriority = "low" | "medium" | "high";

export type IntentLabel =
  | "schedule_meeting"
  | "reply_requested"
  | "review_document"
  | "provide_information"
  | "make_payment"
  | "follow_up"
  | "other";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  intent_label: IntentLabel;
  due_date: string | null;
  source_thread_id: string;
  source_thread_subject: string;
  created_at: string;
};
