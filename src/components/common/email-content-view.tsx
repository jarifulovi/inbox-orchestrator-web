"use client";

import React from "react";

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

  return (
    <div
      className="email-content-view border-t border-white/[0.05] pt-3"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
