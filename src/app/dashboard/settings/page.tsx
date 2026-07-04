"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Mail,
  Brain,
  Bell,
  Palette,
  Check,
  RefreshCw,
  Plus,
  Shield,
} from "lucide-react";
import { defaultSettings } from "@/features/settings/data";
import { UserSettings } from "@/features/settings/types";

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
        enabled ? "bg-[#6d5bfa]" : "bg-white/10"
      }`}
    >
      <div
        className={`absolute top-[3px] size-4 rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function SelectOption({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-white/60">{label}</span>
      <div className="flex items-center gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              value === opt.value
                ? "bg-[#6d5bfa]/20 text-[#8b7cf8] border border-[#6d5bfa]/30"
                : "bg-white/5 text-white/30 border border-transparent hover:bg-white/8 hover:text-white/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const updateAI = (key: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      ai_preferences: { ...prev.ai_preferences, [key]: value },
    }));
  };

  const updateNotifications = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value,
      },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="size-6 text-[#8b7cf8]" />
          Settings
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Manage your accounts, AI preferences, and notifications
        </p>
      </div>

      {/* Connected Accounts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-[#8b7cf8]" />
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Connected Accounts
          </h2>
        </div>

        <div className="space-y-2">
          {settings.connected_accounts.map((account) => (
            <div
              key={account.id}
              className="glass-card rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Google icon */}
                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">
                    {account.email}
                  </div>
                  <div className="text-[11px] text-white/30">
                    Connected{" "}
                    {new Date(account.connected_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sync status */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`size-2 rounded-full ${
                      account.sync_status === "active"
                        ? "bg-emerald-400"
                        : account.sync_status === "paused"
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                  />
                  <span className="text-[11px] text-white/30 capitalize">
                    {account.sync_status}
                  </span>
                </div>

                {/* Last sync */}
                <span className="text-[11px] text-white/20">
                  Synced{" "}
                  {new Date(account.last_sync).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <button className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                  <RefreshCw className="size-3.5 text-white/30" />
                </button>
              </div>
            </div>
          ))}

          {/* Add account button */}
          <button className="w-full glass-card rounded-xl px-5 py-4 flex items-center justify-center gap-2 text-sm text-[#8b7cf8] hover:bg-[#6d5bfa]/10 transition-colors">
            <Plus className="size-4" />
            Connect Another Account
          </button>
        </div>
      </section>

      {/* AI Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-[#46d3e5]" />
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            AI Preferences
          </h2>
        </div>

        <div className="glass-card rounded-xl px-5 divide-y divide-white/[0.04]">
          {/* Toggle options */}
          {[
            {
              key: "auto_categorize",
              label: "Auto-categorize incoming emails",
            },
            {
              key: "auto_summarize",
              label: "Generate AI summaries for threads",
            },
            {
              key: "smart_priority",
              label: "Smart priority detection",
            },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between py-3.5"
            >
              <span className="text-sm text-white/60">{label}</span>
              <Toggle
                enabled={
                  settings.ai_preferences[
                    key as keyof typeof settings.ai_preferences
                  ] as boolean
                }
                onToggle={() =>
                  updateAI(
                    key,
                    !settings.ai_preferences[
                      key as keyof typeof settings.ai_preferences
                    ]
                  )
                }
              />
            </div>
          ))}

          {/* Select options */}
          <SelectOption
            label="Language model"
            options={[
              { value: "fast", label: "Fast" },
              { value: "balanced", label: "Balanced" },
              { value: "accurate", label: "Accurate" },
            ]}
            value={settings.ai_preferences.language_model}
            onChange={(val) => updateAI("language_model", val)}
          />

          <SelectOption
            label="Summary length"
            options={[
              { value: "brief", label: "Brief" },
              { value: "standard", label: "Standard" },
              { value: "detailed", label: "Detailed" },
            ]}
            value={settings.ai_preferences.summary_length}
            onChange={(val) => updateAI("summary_length", val)}
          />
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Notifications
          </h2>
        </div>

        <div className="glass-card rounded-xl px-5 divide-y divide-white/[0.04]">
          {[
            {
              key: "email_notifications",
              label: "Email notifications",
            },
            {
              key: "high_priority_alerts",
              label: "High priority alerts",
            },
            {
              key: "task_reminders",
              label: "Task due date reminders",
            },
            {
              key: "weekly_digest",
              label: "Weekly activity digest",
            },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between py-3.5"
            >
              <span className="text-sm text-white/60">{label}</span>
              <Toggle
                enabled={
                  settings.notification_preferences[
                    key as keyof typeof settings.notification_preferences
                  ]
                }
                onToggle={() =>
                  updateNotifications(
                    key,
                    !settings.notification_preferences[
                      key as keyof typeof settings.notification_preferences
                    ]
                  )
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="size-4 text-[#8b7cf8]" />
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Appearance
          </h2>
        </div>

        <div className="glass-card rounded-xl px-5 py-4">
          <div className="flex items-center gap-3">
            {(["dark", "light", "system"] as const).map((theme) => (
              <button
                key={theme}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, theme }))
                }
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all duration-200 ${
                  settings.theme === theme
                    ? "bg-[#6d5bfa]/15 text-[#8b7cf8] border border-[#6d5bfa]/25"
                    : "bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/5 hover:text-white/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {settings.theme === theme && (
                    <Check className="size-3.5" />
                  )}
                  {theme}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#6d5bfa]/[0.04] border border-[#6d5bfa]/10">
        <Shield className="size-4 text-[#8b7cf8] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-white/40">
            Your data is encrypted in transit and at rest. OAuth tokens are
            securely managed server-side and never stored in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
