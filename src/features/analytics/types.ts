export type SenderClassification = "high_demand" | "balanced" | "noise_heavy";

export interface SenderAnalyticsItem {
  id: string;
  sender_email: string;
  sender_name: string;
  total_emails: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  workload_density_ratio: number; // (total_tasks / total_emails) * 100
  noise_ratio: number; // ((total_emails - total_tasks) / total_emails) * 100
  classification: SenderClassification;
  primary_intent: string; // e.g. "schedule_meeting", "reply_requested", "provide_information"
  last_email_at: string;
}

export interface IntentDistributionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SystemAnalyticsSummary {
  total_emails_processed: number;
  total_tasks_extracted: number;
  task_extraction_rate: number; // % of emails generating actionable tasks
  avg_task_completion_hours: number;
  sla_breached_count: number;
  intent_distribution: IntentDistributionItem[];
}
