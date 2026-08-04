export type TaskStatus = "pending" | "completed" | "dismissed";

export type TaskPriority = "low" | "medium" | "high";

export type TaskSource = "system" | "manual";

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
  source?: TaskSource;
  email_fact_id?: string | null;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  intent_label: IntentLabel;
  due_date: string | null;
  source_thread_id: string;
  source_thread_subject: string;
  created_at: string;
};

export type TaskFilters = {
  priority?: TaskPriority | "all";
  status?: TaskStatus | "all";
  intent_label?: IntentLabel | "all";
  source?: TaskSource | "all";
  overdue?: boolean;
};

export type TasksResponse = {
  tasks: Task[];
  total_count: number;
  pending_count: number;
};

