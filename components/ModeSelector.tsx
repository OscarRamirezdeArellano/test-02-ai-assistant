"use client";

import { CHAT_MODES, type ChatMode } from "@/lib/types";
import { MODE_META } from "@/lib/personalities";

interface ModeSelectorProps {
  mode: ChatMode;
  onChange: (mode: ChatMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Personalidad del sommelier"
    >
      {CHAT_MODES.map((m) => {
        const meta = MODE_META[m];
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            disabled={disabled}
            aria-pressed={active}
            title={meta.description}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground hover:border-accent"
            }`}
          >
            <span aria-hidden>{meta.emoji}</span>
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
