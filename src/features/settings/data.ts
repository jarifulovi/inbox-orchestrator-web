import { UserSettings } from "./types";

export const defaultSettings: UserSettings = {
  connected_accounts: [
    {
      id: "acc-001",
      email: "john.doe@company.com",
      provider: "google",
      connected_at: "2026-06-15T10:00:00Z",
      sync_status: "active",
      last_sync: "2026-07-04T08:00:00Z",
    },
    {
      id: "acc-002",
      email: "johnd@personal.com",
      provider: "google",
      connected_at: "2026-06-20T14:00:00Z",
      sync_status: "active",
      last_sync: "2026-07-04T07:45:00Z",
    },
  ],
  ai_preferences: {
    auto_categorize: true,
    auto_summarize: true,
    smart_priority: true,
    language_model: "balanced",
    summary_length: "standard",
  },
  notification_preferences: {
    email_notifications: true,
    high_priority_alerts: true,
    task_reminders: true,
    weekly_digest: false,
  },
  theme: "dark",
};
