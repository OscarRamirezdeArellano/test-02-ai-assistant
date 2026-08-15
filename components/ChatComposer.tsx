"use client";

import { useRef } from "react";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  busy: boolean;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  busy,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envía; Shift+Enter inserta salto de línea.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !busy) onSubmit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !busy) onSubmit();
      }}
      className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Pregunta por un maridaje… ej. '¿Qué le va a unos tacos al pastor?'"
        aria-label="Escribe tu mensaje"
        className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
      />
      {busy ? (
        <button
          type="button"
          onClick={onStop}
          className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
        >
          Detener
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar
        </button>
      )}
    </form>
  );
}
