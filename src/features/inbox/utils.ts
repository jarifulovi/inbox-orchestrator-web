import { ThreadEmail } from "@/features/inbox/use-thread-details";

export function getInitial(name?: string): string {
  if (!name || !name.trim()) return "?";
  return name.trim()[0].toUpperCase();
}

export function getAvatarColor(seed?: string): string {
  const safeSeed = seed || "default";
  const palette = ["#6d5bfa", "#46d3e5", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6"];
  let h = 0;
  for (let i = 0; i < safeSeed.length; i++) h = safeSeed.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

export function formatTime(ts: string): string {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / 3_600_000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatFullDate(ts: string): string {
  if (!ts) return "";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateRange(emails: ThreadEmail[]): string {
  if (!emails || emails.length === 0) return "";
  const dates = emails
    .map((e) => (e.received_at ? new Date(e.received_at).getTime() : 0))
    .filter(Boolean);
  if (dates.length === 0) return "";
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const minStr = minDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const maxStr = maxDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (minDate.toDateString() === maxDate.toDateString()) {
    return maxStr;
  }
  return `${minStr} – ${maxStr}`;
}
