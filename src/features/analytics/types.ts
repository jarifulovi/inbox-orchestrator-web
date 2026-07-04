export type SenderProfile = {
  id: string;
  name: string;
  email: string;
  total_emails: number;
  emails_sent: number;
  emails_received: number;
  avg_response_time_hours: number;
  relationship_score: number; // 0-100
  last_interaction: string;
  top_topics: string[];
  sentiment: "positive" | "neutral" | "negative";
};
