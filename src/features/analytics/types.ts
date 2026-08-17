export interface SenderAnalyticsItem {
  id: string;
  sender_email: string;
  sender_name: string;
  total_emails: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  actionable_email_rate: number; // % of emails containing >= 1 tasks (0-100%)
  noise_ratio: number; // % of emails containing 0 tasks (0-100%)
  task_multiplier: number; // avg generated tasks per email (e.g. 0.68)
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
