"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /** Visual size of the spinner */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional label shown below the spinner */
  label?: string;
  /** Fill the full viewport height */
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { ring: "size-5 border-2", text: "text-xs" },
  md: { ring: "size-8 border-2", text: "text-sm" },
  lg: { ring: "size-12 border-[3px]", text: "text-sm" },
  xl: { ring: "size-16 border-[3px]", text: "text-base" },
};

/**
 * Reusable loading spinner component.
 *
 * Usage:
 *   <LoadingSpinner />                          // default centred spinner
 *   <LoadingSpinner size="lg" label="Loading…" />
 *   <LoadingSpinner fullScreen label="Authenticating…" />
 */
export default function LoadingSpinner({
  size = "md",
  label,
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const { ring, text } = sizeMap[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "min-h-screen bg-[#0b0d11]",
        className
      )}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center">
        {/* Soft pulse halo */}
        <span
          className="absolute rounded-full animate-ping opacity-20"
          style={{
            inset: "-4px",
            background:
              "radial-gradient(circle, #6d5bfa 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Spinning ring */}
        <div
          className={cn(
            ring,
            "rounded-full border-white/10 border-t-[#6d5bfa] animate-spin"
          )}
        />

        {/* Inner accent dot */}
        <span
          className="absolute size-1.5 rounded-full bg-[#46d3e5]"
          aria-hidden="true"
        />
      </div>

      {label && (
        <p className={cn(text, "text-white/40 tracking-wide font-medium")}>
          {label}
        </p>
      )}
    </div>
  );
}
