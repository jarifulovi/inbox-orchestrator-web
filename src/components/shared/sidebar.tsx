"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  CheckSquare,
  Search,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/inbox", label: "Inbox", icon: Inbox },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/search", label: "Smart Search", icon: Search },
  { href: "/dashboard/analytics", label: "Sender Analysis", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="group fixed left-0 top-0 bottom-0 w-[72px] hover:w-[260px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#0b0d11] border-r border-white/[0.06] flex flex-col z-40 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
        <div
          className="sidebar-orb"
          style={{
            width: 200,
            height: 200,
            top: -40,
            left: -40,
            background: "radial-gradient(circle, #6d5bfa 0%, transparent 70%)",
            animation: "pulse-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="sidebar-orb"
          style={{
            width: 160,
            height: 160,
            bottom: 20,
            right: -30,
            background: "radial-gradient(circle, #46d3e5 0%, transparent 70%)",
            animation: "pulse-glow 12s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 px-5 py-6 flex items-center h-[76px] shrink-0">
        <div className="flex items-center gap-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <rect width="28" height="28" rx="8" fill="url(#sidebarLogoGrad)" />
            <path
              d="M6 10l8 5 8-5M6 10v8l8 5 8-5V10"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="sidebarLogoGrad"
                x1="0"
                y1="0"
                x2="28"
                y2="28"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6d5bfa" />
                <stop offset="1" stopColor="#46d3e5" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-white font-semibold text-[15px] tracking-tight opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 w-0 group-hover:w-auto">
            InboxOrchestrator{" "}
            <span className="text-[#8b7cf8]">AI</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-3 py-2 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item flex items-center h-10 px-3 rounded-lg text-sm font-medium relative ${
                isActive
                  ? "active text-[#8b7cf8]"
                  : "text-white/50 hover:text-white/80"
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3 absolute left-3">
                <Icon
                  className={`nav-icon size-[20px] shrink-0 ${
                    isActive ? "text-[#8b7cf8]" : "text-white/30"
                  }`}
                />
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 w-0 group-hover:w-auto">
                  {item.label}
                </span>
              </div>
              
              {item.label === "Inbox" && (
                <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[11px] font-semibold bg-[#6d5bfa]/20 text-[#8b7cf8] px-2 py-0.5 rounded-full">
                  5
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="relative z-10 p-3 border-t border-white/[0.06]">
        <button 
          className="nav-item flex items-center h-10 px-3 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 w-full relative"
          title="Sign Out"
        >
          <div className="flex items-center gap-3 absolute left-3">
            <LogOut className="size-[20px] shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
              Sign Out
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
