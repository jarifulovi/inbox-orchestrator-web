"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { emailAccounts } from "@/features/inbox/data";

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "gmail") {
    return (
      <svg viewBox="0 0 24 24" className="size-3 shrink-0" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    );
  }
  return null;
}

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
            <div className="text-sm font-medium text-white/90 flex items-center gap-2">
              {selectedAccount.name}
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                 <ProviderIcon provider={selectedAccount.provider} />
              </div>
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
                  <div className="text-sm font-medium text-white/90 truncate flex items-center gap-2">
                    {account.name}
                    <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                       <ProviderIcon provider={account.provider} />
                       {account.provider}
                    </div>
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
