"use client";

import React from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface EmailContentViewProps {
  content: string;
}

export function EmailContentView({ content }: EmailContentViewProps) {
  if (!content) {
    return <div className="text-sm text-white/30 italic">No content available</div>;
  }

  // Detect if body contains HTML tags
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return (
      <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  const cleanHtml = sanitizeHtml(content);

  return (
    <div
      className="email-content-view border-t border-white/[0.05] pt-3 text-sm text-white/80 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
