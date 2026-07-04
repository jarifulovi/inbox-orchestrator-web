"use client";

import {
  BarChart3,
  Clock,
  Mail,
  TrendingUp,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { senderProfiles } from "@/features/analytics/data";
import { SenderProfile } from "@/features/analytics/types";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 50) return "bg-amber-400";
  return "bg-red-400";
}

function getSentimentIcon(sentiment: SenderProfile["sentiment"]) {
  switch (sentiment) {
    case "positive":
      return <ArrowUpRight className="size-3.5 text-emerald-400" />;
    case "negative":
      return <ArrowDownRight className="size-3.5 text-red-400" />;
    default:
      return <span className="size-3.5 text-white/30">—</span>;
  }
}

function formatResponseTime(hours: number): string {
  if (hours === 0) return "N/A";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${Math.round(hours / 24)}d`;
}

function SenderCard({ sender }: { sender: SenderProfile }) {
  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="size-11 rounded-full bg-gradient-to-br from-[#6d5bfa]/40 to-[#46d3e5]/40 flex items-center justify-center text-white text-base font-bold">
            {sender.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
              {sender.name}
            </h3>
            <p className="text-[11px] text-white/35">{sender.email}</p>
          </div>
        </div>

        {/* Sentiment */}
        <div className="flex items-center gap-1.5">
          {getSentimentIcon(sender.sentiment)}
          <span className="text-[10px] uppercase tracking-wider text-white/25 font-medium">
            {sender.sentiment}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/[0.03] rounded-lg px-3 py-2.5 text-center">
          <Mail className="size-3.5 text-white/20 mx-auto mb-1" />
          <div className="text-base font-bold text-white/80">
            {sender.total_emails}
          </div>
          <div className="text-[10px] text-white/25">Total</div>
        </div>
        <div className="bg-white/[0.03] rounded-lg px-3 py-2.5 text-center">
          <Clock className="size-3.5 text-white/20 mx-auto mb-1" />
          <div className="text-base font-bold text-white/80">
            {formatResponseTime(sender.avg_response_time_hours)}
          </div>
          <div className="text-[10px] text-white/25">Avg Reply</div>
        </div>
        <div className="bg-white/[0.03] rounded-lg px-3 py-2.5 text-center">
          <MessageSquare className="size-3.5 text-white/20 mx-auto mb-1" />
          <div className="text-base font-bold text-white/80 flex items-center justify-center gap-1">
            {sender.emails_sent}
            <span className="text-white/20 text-xs">/</span>
            {sender.emails_received}
          </div>
          <div className="text-[10px] text-white/25">Sent / Recv</div>
        </div>
      </div>

      {/* Relationship score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
            Relationship Score
          </span>
          <span
            className={`text-sm font-bold ${getScoreColor(sender.relationship_score)}`}
          >
            {sender.relationship_score}
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreBarColor(sender.relationship_score)} transition-all duration-500`}
            style={{ width: `${sender.relationship_score}%` }}
          />
        </div>
      </div>

      {/* Top topics */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {sender.top_topics.map((topic) => (
          <span
            key={topic}
            className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const sortedSenders = [...senderProfiles].sort(
    (a, b) => b.relationship_score - a.relationship_score
  );

  const totalEmails = senderProfiles.reduce(
    (sum, s) => sum + s.total_emails,
    0
  );
  const avgResponseTime =
    senderProfiles
      .filter((s) => s.avg_response_time_hours > 0)
      .reduce((sum, s) => sum + s.avg_response_time_hours, 0) /
    senderProfiles.filter((s) => s.avg_response_time_hours > 0).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="size-6 text-[#8b7cf8]" />
          Sender Analysis
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Relationship insights across {senderProfiles.length} contacts
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="size-4 text-[#8b7cf8]" />
            <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
              Total Interactions
            </span>
          </div>
          <div className="text-2xl font-bold gradient-text">
            {totalEmails}
          </div>
        </div>
        <div className="glass-card rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-[#46d3e5]" />
            <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
              Avg Response Time
            </span>
          </div>
          <div className="text-2xl font-bold gradient-text">
            {formatResponseTime(avgResponseTime)}
          </div>
        </div>
        <div className="glass-card rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-4 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-widest text-white/25 font-semibold">
              Top Relationship
            </span>
          </div>
          <div className="text-2xl font-bold gradient-text">
            {sortedSenders[0]?.name.split(" ")[0]}
          </div>
        </div>
      </div>

      {/* Sender cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSenders.map((sender) => (
          <SenderCard key={sender.id} sender={sender} />
        ))}
      </div>
    </div>
  );
}
