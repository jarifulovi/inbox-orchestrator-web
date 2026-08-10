"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Save,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Wand2,
  Loader2,
  PenSquare,
} from "lucide-react";
import { Task } from "@/features/tasks/types";

export interface DraftComposerDrawerProps {
  isOpen: boolean;
  isMinimized: boolean;
  recipientTo: string;
  subject: string;
  selectedTaskIds: Set<string>;
  aiInstructions: string;
  selectedTone: string;
  draftBody: string;
  isGenerating: boolean;
  isSaving: boolean;
  statusMessage: string | null;
  pendingTasks: Task[];
  // Handlers
  onRecipientChange: (val: string) => void;
  onSubjectChange: (val: string) => void;
  onAiInstructionsChange: (val: string) => void;
  onToneChange: (tone: string) => void;
  onDraftBodyChange: (val: string) => void;
  onToggleTask: (taskId: string) => void;
  onToggleAllTasks: () => void;
  onGenerateAI: () => void;
  onQuickRefine: (refinementType: string) => void;
  onSaveDraft: () => void;
  onSendEmail: () => void;
  onClose: () => void;
  onToggleMinimize: () => void;
  onDiscard: () => void;
}

const TONE_PRESETS = ["Professional", "Concise", "Friendly", "Urgent"];

export function DraftComposerDrawer({
  isOpen,
  isMinimized,
  recipientTo,
  subject,
  selectedTaskIds,
  aiInstructions,
  selectedTone,
  draftBody,
  isGenerating,
  isSaving,
  statusMessage,
  pendingTasks,
  onRecipientChange,
  onSubjectChange,
  onAiInstructionsChange,
  onToneChange,
  onDraftBodyChange,
  onToggleTask,
  onToggleAllTasks,
  onGenerateAI,
  onQuickRefine,
  onSaveDraft,
  onSendEmail,
  onClose,
  onToggleMinimize,
  onDiscard,
}: DraftComposerDrawerProps) {
  const [tasksDropdownOpen, setTasksDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTasksDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const selectedCount = pendingTasks.filter((t) => selectedTaskIds.has(t.id)).length;

  return (
    <div
      className={`absolute inset-x-0 bottom-0 top-0 z-30 flex flex-col bg-[#14161f]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        isMinimized ? "h-12 top-auto" : "h-full"
      }`}
    >
      {/* ─── 1. COMPOSER HEADER BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          {/* Single Clean Title */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-semibold text-white">
            <PenSquare className="size-3.5 text-[#8b7cf8]" />
            <span>Email Composer</span>
          </div>

          {statusMessage && (
            <span className="hidden sm:inline text-[11px] text-[#a79bfb] font-medium bg-[#8b7cf8]/10 px-2.5 py-0.5 rounded-full border border-[#8b7cf8]/20 animate-pulse">
              {statusMessage}
            </span>
          )}
        </div>

        {/* Task Resolution Dropdown + Minimize & Close Controls */}
        <div className="flex items-center gap-2">
          {/* Compact Task Resolution Dropdown */}
          {pendingTasks.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setTasksDropdownOpen(!tasksDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer"
                title="Select tasks to resolve upon sending or saving"
              >
                <CheckSquare className="size-3.5 text-amber-400" />
                <span>Resolve Tasks ({selectedCount}/{pendingTasks.length})</span>
                <ChevronDown
                  className={`size-3 text-amber-400 transition-transform ${
                    tasksDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Task Resolution Dropdown Overlay */}
              {tasksDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 z-50 p-3 rounded-xl bg-[#181a24] border border-amber-500/30 shadow-2xl space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <CheckSquare className="size-3.5" />
                      Task Resolution
                    </span>
                    <button
                      type="button"
                      onClick={onToggleAllTasks}
                      className="text-[10px] text-amber-400 hover:underline font-medium cursor-pointer"
                    >
                      {selectedCount === pendingTasks.length ? "Clear All" : "Select All"}
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1.5 pr-0.5">
                    {pendingTasks.map((t) => {
                      const isSelected = selectedTaskIds.has(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onToggleTask(t.id)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-200"
                              : "bg-white/[0.02] border-white/10 text-white/50 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="size-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Square className="size-3.5 text-white/30 shrink-0" />
                          )}
                          <span className="truncate">{t.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="h-4 w-[1px] bg-white/10 mx-0.5" />

          {/* Minimize & Close Buttons */}
          <button
            onClick={onToggleMinimize}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title={isMinimized ? "Expand Composer" : "Minimize Composer"}
          >
            {isMinimized ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title="Close Composer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* ─── BODY CONTENT (IF NOT MINIMIZED) ───────────────────────────────── */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-thin p-4 space-y-3.5">
          {/* ─── 2. RECIPIENTS & SUBJECT INPUTS ─────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
                To (Recipient):
              </label>
              <input
                type="text"
                value={recipientTo}
                onChange={(e) => onRecipientChange(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-[#8b7cf8] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
                Subject Line:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                placeholder="Email Subject"
                className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:outline-none focus:border-[#8b7cf8] transition-colors"
              />
            </div>
          </div>

          {/* ─── 3. AI GENERATION CONTROLS & PROMPTING ───────────────────────── */}
          <div className="p-3.5 rounded-xl bg-[#8b7cf8]/[0.05] border border-[#8b7cf8]/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#8b7cf8]" />
                <span className="text-xs font-semibold text-white">AI Content Generation</span>
              </div>
              {/* Tone Selection Pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Tone:
                </span>
                {TONE_PRESETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => onToneChange(t)}
                    className={`px-2 py-0.5 text-[10px] rounded-full font-medium transition-all cursor-pointer ${
                      selectedTone === t
                        ? "bg-[#8b7cf8] text-white shadow-sm"
                        : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom AI Instructions Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInstructions}
                onChange={(e) => onAiInstructionsChange(e.target.value)}
                placeholder="Optional instructions (e.g. 'Accept meeting for Tuesday 2 PM, ask for slides')"
                className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#8b7cf8] transition-colors"
              />

              <button
                onClick={onGenerateAI}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8b7cf8] hover:bg-[#7a6bf0] text-white font-medium text-xs rounded-lg shadow-lg shadow-[#8b7cf8]/25 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Composing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-3.5" />
                    <span>Generate AI Content</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── 4. DRAFT EDITOR & QUICK REFINEMENTS ────────────────────────── */}
          <div className="flex-1 min-h-[220px] flex flex-col p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                Email Body Editor:
              </span>
              {/* Quick AI Refinements */}
              {draftBody && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40">Quick Refine:</span>
                  <button
                    onClick={() => onQuickRefine("shorter")}
                    disabled={isGenerating}
                    className="px-2 py-0.5 text-[10px] bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/10 transition-colors cursor-pointer"
                  >
                    Shorter
                  </button>
                  <button
                    onClick={() => onQuickRefine("formal")}
                    disabled={isGenerating}
                    className="px-2 py-0.5 text-[10px] bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/10 transition-colors cursor-pointer"
                  >
                    Formal
                  </button>
                  <button
                    onClick={() => onQuickRefine("action")}
                    disabled={isGenerating}
                    className="px-2 py-0.5 text-[10px] bg-white/5 hover:bg-white/10 text-white/70 rounded border border-white/10 transition-colors cursor-pointer"
                  >
                    + Call to Action
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={draftBody}
              onChange={(e) => onDraftBodyChange(e.target.value)}
              placeholder="Click 'Generate AI Content' or type your email text here..."
              className="flex-1 w-full p-2.5 text-xs bg-transparent text-white/90 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed scrollbar-thin"
            />
          </div>

          {/* ─── 5. FOOTER TOOLBAR ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] shrink-0">
            <button
              onClick={onDiscard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Discard</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onSaveDraft}
                disabled={isSaving || !draftBody}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              >
                {isSaving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Save Draft</span>
              </button>

              <button
                onClick={onSendEmail}
                disabled={!draftBody}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="size-3.5" />
                <span>Send Reply</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
