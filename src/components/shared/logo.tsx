"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
}

export function AppLogo({
  size = 32,
  showText = true,
  href = "/",
  className = "",
}: AppLogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div
        className="relative rounded-xl overflow-hidden shadow-lg shadow-[#6d5bfa]/20 border border-white/10 group-hover:scale-105 transition-transform duration-200 shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="InboxOrchestrator AI Logo"
          width={size}
          height={size}
          className="object-cover size-full"
          priority
        />
      </div>
      {showText && (
        <span className="font-extrabold tracking-tight text-white text-base">
          InboxOrchestrator <span className="text-[#8b7cf8]">AI</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
