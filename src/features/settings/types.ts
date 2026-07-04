export type ConnectedAccount = {
  id: string;
  email: string;
  provider: "google";
  connected_at: string;
  sync_status: "active" | "paused" | "error";
  last_sync: string;
};

export type AIPreferences = {
  auto_categorize: boolean;
  auto_summarize: boolean;
  smart_priority: boolean;
  language_model: "fast" | "balanced" | "accurate";
  summary_length: "brief" | "standard" | "detailed";
};

export type NotificationPreferences = {
  email_notifications: boolean;
  high_priority_alerts: boolean;
  task_reminders: boolean;
  weekly_digest: boolean;
};

export type UserSettings = {
  connected_accounts: ConnectedAccount[];
  ai_preferences: AIPreferences;
  notification_preferences: NotificationPreferences;
  theme: "dark" | "light" | "system";
};
