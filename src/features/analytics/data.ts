import { SenderAnalyticsItem, SystemAnalyticsSummary } from "./types";

export const mockSenderAnalytics: SenderAnalyticsItem[] = [
  {
    id: "sender-1",
    sender_name: "Sarah Chen",
    sender_email: "sarah.chen@techcorp.io",
    total_emails: 28,
    total_tasks: 19,
    pending_tasks: 5,
    completed_tasks: 14,
    workload_density_ratio: 67.8,
    noise_ratio: 32.2,
    classification: "high_demand",
    primary_intent: "review_document",
    last_email_at: "2026-08-12T14:30:00Z"
  },
  {
    id: "sender-2",
    sender_name: "Alex Kim",
    sender_email: "alex.kim@company.com",
    total_emails: 35,
    total_tasks: 21,
    pending_tasks: 3,
    completed_tasks: 18,
    workload_density_ratio: 60.0,
    noise_ratio: 40.0,
    classification: "high_demand",
    primary_intent: "schedule_meeting",
    last_email_at: "2026-08-12T16:15:00Z"
  },
  {
    id: "sender-3",
    sender_name: "Marcus Rivera",
    sender_email: "marcus.r@designstudio.co",
    total_emails: 18,
    total_tasks: 8,
    pending_tasks: 2,
    completed_tasks: 6,
    workload_density_ratio: 44.4,
    noise_ratio: 55.6,
    classification: "balanced",
    primary_intent: "provide_information",
    last_email_at: "2026-08-11T18:20:00Z"
  },
  {
    id: "sender-4",
    sender_name: "GitHub Notifications",
    sender_email: "notifications@github.com",
    total_emails: 64,
    total_tasks: 4,
    pending_tasks: 1,
    completed_tasks: 3,
    workload_density_ratio: 6.25,
    noise_ratio: 93.75,
    classification: "noise_heavy",
    primary_intent: "other",
    last_email_at: "2026-08-12T20:05:00Z"
  },
  {
    id: "sender-5",
    sender_name: "Emily Zhang",
    sender_email: "emily.z@dataflow.io",
    total_emails: 14,
    total_tasks: 8,
    pending_tasks: 4,
    completed_tasks: 4,
    workload_density_ratio: 57.1,
    noise_ratio: 42.9,
    classification: "high_demand",
    primary_intent: "reply_requested",
    last_email_at: "2026-08-10T11:45:00Z"
  },
  {
    id: "sender-6",
    sender_name: "SaaS Billing Alerts",
    sender_email: "billing@saasplatform.com",
    total_emails: 42,
    total_tasks: 2,
    pending_tasks: 0,
    completed_tasks: 2,
    workload_density_ratio: 4.76,
    noise_ratio: 95.24,
    classification: "noise_heavy",
    primary_intent: "make_payment",
    last_email_at: "2026-08-12T09:12:00Z"
  },
  {
    id: "sender-7",
    sender_name: "David Miller",
    sender_email: "david.m@acmepartners.org",
    total_emails: 12,
    total_tasks: 5,
    pending_tasks: 1,
    completed_tasks: 4,
    workload_density_ratio: 41.7,
    noise_ratio: 58.3,
    classification: "balanced",
    primary_intent: "follow_up",
    last_email_at: "2026-08-09T15:00:00Z"
  },
  {
    id: "sender-8",
    sender_name: "Marketing Newsletters",
    sender_email: "digest@techweekly.com",
    total_emails: 29,
    total_tasks: 0,
    pending_tasks: 0,
    completed_tasks: 0,
    workload_density_ratio: 0.0,
    noise_ratio: 100.0,
    classification: "noise_heavy",
    primary_intent: "other",
    last_email_at: "2026-08-11T08:30:00Z"
  }
];

export const mockSystemAnalytics: SystemAnalyticsSummary = {
  total_emails_processed: 242,
  total_tasks_extracted: 67,
  task_extraction_rate: 27.7,
  avg_task_completion_hours: 4.2,
  sla_breached_count: 2,
  intent_distribution: [
    { label: "Schedule Meeting", count: 24, percentage: 35.8, color: "#8b7cf8" },
    { label: "Reply Requested", count: 18, percentage: 26.9, color: "#46d3e5" },
    { label: "Review Document", count: 12, percentage: 17.9, color: "#34d399" },
    { label: "Provide Information", count: 8, percentage: 11.9, color: "#f59e0b" },
    { label: "Make Payment", count: 5, percentage: 7.5, color: "#f43f5e" }
  ]
};
