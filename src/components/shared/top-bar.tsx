"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { emailAccounts } from "@/features/inbox/data";

export default function TopBar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(emailAccounts[0]);

  return (
    <header className="h-14 bg-[#0e1117]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left: Account Switcher */}
      <div className="relative">
        <button
          onClick={() => setAccountOpen(!accountOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {/* Account avatar */}
          <div
            className="size-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: selectedAccount.avatar_color }}
          >
            {selectedAccount.name.charAt(0)}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-white/90">
              {selectedAccount.name}
            </div>
            <div className="text-[11px] text-white/40">
              {selectedAccount.email}
            </div>
          </div>
          <ChevronDown
            className={`size-4 text-white/30 transition-transform duration-200 ${
              accountOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {accountOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-[#161921] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/40 py-1.5 z-50">
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
              Switch Account
            </div>
            {emailAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setSelectedAccount(account);
                  setAccountOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors ${
                  selectedAccount.email === account.email
                    ? "bg-[#6d5bfa]/10"
                    : ""
                }`}
              >
                <div
                  className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: account.avatar_color }}
                >
                  {account.name.charAt(0)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm font-medium text-white/90 truncate">
                    {account.name}
                  </div>
                  <div className="text-[11px] text-white/40 truncate">
                    {account.email}
                  </div>
                </div>
                {account.pending_tasks_count > 0 && (
                  <span className="text-[11px] font-semibold bg-[#6d5bfa]/20 text-[#8b7cf8] px-2 py-0.5 rounded-full">
                    {account.pending_tasks_count}
                  </span>
                )}
                {selectedAccount.email === account.email && (
                  <div className="size-2 rounded-full bg-[#6d5bfa]" />
                )}
              </button>
            ))}
            <div className="border-t border-white/[0.06] mt-1.5 pt-1.5 px-3">
              <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-[#8b7cf8] hover:bg-white/5 rounded-lg transition-colors">
                <span className="text-lg leading-none">+</span>
                Add Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-white/80">John Doe</div>
          <div className="text-[11px] text-white/30">Pro Plan</div>
        </div>
        <div className="size-8 rounded-full bg-gradient-to-br from-[#6d5bfa] to-[#46d3e5] flex items-center justify-center">
          <User className="size-4 text-white" />
        </div>
      </div>
    </header>
  );
}
