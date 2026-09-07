"use client";

import React from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface EmailContentViewProps {
  content: string;
}

function renderFormattedText(text: string) {
  if (!text) return null;

  // Regex captures optional leading brackets '[', the HTTP/HTTPS URL, and optional trailing brackets/punctuation
  const urlRegex = /(\[*)\b(https?:\/\/[^\s<>\)"']+?)([\],\.\);]?)(?=\s|$|<|>)/gi;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const leadingBrackets = match[1]; // e.g. "[" or "[["
    let url = match[2];               // e.g. "https://superhuman.com/products/mail/"
    let trailingPunct = match[3];     // e.g. "]" or "."

    // If URL string itself ends with trailing bracket or period, trim it safely
    while (url.endsWith("]") || url.endsWith(")") || url.endsWith(".")) {
      trailingPunct = url.slice(-1) + trailingPunct;
      url = url.slice(0, -1);
    }

    // Append preceding text before the match (excluding any leading brackets consumed by match[1])
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    // Format shortened display URL
    let shortDisplay = url;
    try {
      const parsed = new URL(url);
      const displayPath = parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
      shortDisplay = `${parsed.protocol}//${displayPath}`;
      if (shortDisplay.length > 35) {
        shortDisplay = `${shortDisplay.substring(0, 32)}...`;
      }
    } catch {
      if (url.length > 35) {
        shortDisplay = `${url.substring(0, 32)}...`;
      }
    }

    // Render clean single bracket link pill [https://...]
    elements.push(
      <a
        key={matchIndex}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#8b7cf8] hover:text-[#a79bfb] hover:underline font-mono text-xs px-1.5 py-0.5 bg-[#8b7cf8]/10 hover:bg-[#8b7cf8]/20 rounded border border-[#8b7cf8]/20 transition-colors inline-block max-w-full truncate align-bottom my-0.5"
        title={url}
      >
        [{shortDisplay}]
      </a>
    );

    // If trailing punctuation was NOT a closing bracket matching a leading bracket, preserve it as text
    if (trailingPunct && trailingPunct !== "]") {
      elements.push(trailingPunct);
    }

    lastIndex = urlRegex.lastIndex;
  }

  // Append remaining text after last match
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export function EmailContentView({ content }: EmailContentViewProps) {
  if (!content) {
    return <div className="text-sm text-white/30 italic">No content available</div>;
  }

  // Detect if body contains HTML tags
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return (
      <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full">
        {renderFormattedText(content)}
      </div>
    );
  }

  const cleanHtml = sanitizeHtml(content);

  return (
    <div
      className="email-content-view border-t border-white/[0.05] pt-3 text-sm text-white/80 leading-relaxed break-words [overflow-wrap:anywhere] max-w-full overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

