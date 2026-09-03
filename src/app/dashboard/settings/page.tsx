"use client";

import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Mail,
  Brain,
  Bell,
  Palette,
  Shield,
  Loader2,
  KeyRound,
  ExternalLink,
  Plus,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultSettings } from "@/features/settings/data";
import { UserSettings } from "@/features/settings/types";
import { connectGoogle } from "@/features/google/google.api";
import { api } from "@/lib/axios";
import { toast } from "sonner";

import { useAuth, ConnectedAccount } from "@/features/auth/auth-context";

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
  const { me, refreshUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [togglingAccount, setTogglingAccount] = useState<Record<string, boolean>>({});
  const [reauthAccount, setReauthAccount] = useState<ConnectedAccount | null>(null);

  const [profileSettings, setProfileSettings] = useState<{
    enable_auto_task: boolean;
    enable_auto_draft: boolean;
    summary_format: string;
    ai_model: string;
  }>({
    enable_auto_task: true,
    enable_auto_draft: false,
    summary_format: "paragraph",
    ai_model: "gemini-3.6-flash",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    api.get("/settings")
      .then((res) => {
        if (res.data?.settings) {
          setProfileSettings(res.data.settings);
        }
      })
      .catch((err) => console.error("Failed to load profile settings:", err));
  }, []);

  const handleUpdateProfileSetting = async (key: string, value: any) => {
    const updated = { ...profileSettings, [key]: value };
    setProfileSettings(updated);
    setSavingSettings(true);
    try {
      await api.put("/settings", updated);
      toast.success("AI preferences updated.");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const connectedAccounts = me?.gmail?.accounts || [];

  const handleConnectAccount = async (loginHint?: string) => {
    try {
      const res = await connectGoogle(loginHint);
      if (res?.auth_url) {
        window.location.href = res.auth_url;
      } else {
        toast.error("Failed to get connection URL.");
      }
    } catch (err) {
      console.error("Failed to connect Google account:", err);
      toast.error("Failed to initiate Google account connection.");
    }
  };

  const handleToggleAccountSync = async (account: ConnectedAccount) => {
    setTogglingAccount((prev) => ({ ...prev, [account.id]: true }));
    const targetState = !account.is_active;
    try {
      await api.patch(`/auth/accounts/${account.id}/sync`, {
        is_active: targetState,
      });
      toast.success(
        targetState
          ? `Background sync resumed for ${account.email}`
          : `Background sync paused for ${account.email}`
      );
      if (refreshUser) await refreshUser();
    } catch (err) {
      console.error("Failed to update account sync status:", err);
      toast.error("Failed to update account sync status.");
    } finally {
      setTogglingAccount((prev) => ({ ...prev, [account.id]: false }));
    }
  };

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
          {connectedAccounts.length === 0 ? (
            <div className="glass-card rounded-xl px-5 py-6 text-center space-y-2">
              <p className="text-xs text-white/40">No Google email accounts connected yet.</p>
            </div>
          ) : (
            connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Google icon */}
                  <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
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
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white/80 truncate">
                      {account.email}
                    </div>
                    <div className="text-[11px] text-white/30 capitalize">
                      Provider: {account.provider}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Status indicator */}
                  <div className="flex items-center gap-1.5" title={account.is_active ? "Background sync active" : "Background sync paused"}>
                    <div
                      className={`size-2 rounded-full ${
                        account.is_active ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold ${
                        account.is_active ? "text-emerald-400/90" : "text-amber-400/90"
                      }`}
                    >
                      {account.is_active ? "Active" : "Sync Paused"}
                    </span>
                  </div>

                  {/* Last sync time if active */}
                  {account.is_active && account.sync?.last_sync_at && (
                    <span className="text-[11px] text-white/20 hidden sm:inline-block">
                      Synced{" "}
                      {new Date(account.sync.last_sync_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  {/* Sync Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40 hidden md:inline-block">
                      {account.is_active ? "Sync On" : "Sync Off"}
                    </span>
                    {togglingAccount[account.id] ? (
                      <Loader2 className="size-4 animate-spin text-[#8b7cf8]" />
                    ) : (
                      <Toggle
                        enabled={account.is_active}
                        onToggle={() => handleToggleAccountSync(account)}
                      />
                    )}
                  </div>

                  {/* Re-authenticate Button */}
                  <button
                    onClick={() => setReauthAccount(account)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Re-authenticate Google Account credentials"
                  >
                    <KeyRound className="size-3.5 text-[#8b7cf8]" />
                    <span>Re-authenticate</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add account button */}
          <button
            onClick={() => handleConnectAccount()}
            className="w-full glass-card rounded-xl px-5 py-4 flex items-center justify-center gap-2 text-sm text-[#8b7cf8] hover:bg-[#6d5bfa]/10 transition-colors"
          >
            <Plus className="size-4" />
            Connect Another Account
          </button>
        </div>
      </section>

      {/* ─── Re-authenticate Confirmation Modal ─────────────────────────── */}
      <Dialog open={!!reauthAccount} onOpenChange={(open) => !open && setReauthAccount(null)}>
        <DialogContent className="sm:max-w-sm bg-[#161921] border-white/10 text-white shadow-2xl p-6">
          <DialogHeader className="text-left">
            <div className="size-12 rounded-full bg-[#6d5bfa]/10 border border-[#6d5bfa]/20 flex items-center justify-center mb-4 text-[#8b7cf8]">
              <KeyRound className="size-6" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-2">
              Re-authenticate Google Account?
            </DialogTitle>
            <DialogDescription className="text-sm text-white/60 mb-6 leading-relaxed">
              You will be redirected to Google OAuth to re-authorize permissions for{" "}
              <span className="text-white/90 font-medium">"{reauthAccount?.email}"</span>. Your existing email threads, AI summaries, and tasks will remain preserved.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setReauthAccount(null)}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const targetEmail = reauthAccount?.email;
                setReauthAccount(null);
                handleConnectAccount(targetEmail);
              }}
              className="px-4 py-2 text-sm font-medium bg-[#6d5bfa] hover:bg-[#5b49f8] text-white rounded-lg transition-colors shadow-lg shadow-[#6d5bfa]/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Google</span>
              <ExternalLink className="size-4" />
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Preferences */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-[#46d3e5]" />
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              AI Preferences (Profile Level)
            </h2>
          </div>
          {savingSettings && (
            <div className="flex items-center gap-1.5 text-xs text-[#46d3e5]">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
        </div>

        <div className="glass-card rounded-xl px-5 divide-y divide-white/[0.04]">
          {/* Toggle options */}
          <div className="flex items-center justify-between py-3.5">
            <div>
              <div className="text-sm text-white/80 font-medium">Auto Task Extraction</div>
              <div className="text-xs text-white/40">Automatically extract actionable tasks during background orchestration</div>
            </div>
            <Toggle
              enabled={profileSettings.enable_auto_task}
              onToggle={() => handleUpdateProfileSetting("enable_auto_task", !profileSettings.enable_auto_task)}
            />
          </div>

          <div className="flex items-center justify-between py-3.5">
            <div>
              <div className="text-sm text-white/80 font-medium">Auto Draft Generation</div>
              <div className="text-xs text-white/40">Automatically generate AI reply drafts for actionable threads</div>
            </div>
            <Toggle
              enabled={profileSettings.enable_auto_draft}
              onToggle={() => handleUpdateProfileSetting("enable_auto_draft", !profileSettings.enable_auto_draft)}
            />
          </div>

          {/* Select options */}
          <SelectOption
            label="Summary style"
            options={[
              { value: "paragraph", label: "Executive Paragraph" },
              { value: "bullets", label: "Bullet Points" },
              { value: "concise", label: "Ultra Concise" },
            ]}
            value={profileSettings.summary_format}
            onChange={(val) => handleUpdateProfileSetting("summary_format", val)}
          />

          <SelectOption
            label="Language model"
            options={[
              { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
              { value: "gemini-3.7-flash", label: "Gemini 3.7 Flash" },
              { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
            ]}
            value={profileSettings.ai_model}
            onChange={(val) => handleUpdateProfileSetting("ai_model", val)}
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
