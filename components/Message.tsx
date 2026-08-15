"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SommelierUIMessage } from "@/lib/types";
import { estimateCostUSD, formatUSD } from "@/lib/pricing";

export function Message({ message }: { message: SommelierUIMessage }) {
  const isUser = message.role === "user";

  // Texto plano concatenado (para el botón de copiar).
  const text = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n");

  return (
    <div
      className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span aria-hidden>{isUser ? "🧑" : "🍷"}</span>
        {isUser ? "Tú" : "Wain, el sommelier"}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-accent text-accent-foreground"
            : "rounded-tl-sm border border-border bg-card"
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            // Los mensajes del usuario van en texto plano; los del asistente
            // se renderizan como Markdown (negritas, listas, tablas…).
            return isUser ? (
              <p key={i} className="whitespace-pre-wrap">
                {part.text}
              </p>
            ) : (
              <div key={i} className="md-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }
          // Partes de herramienta: tool-buscarVinos, etc.
          if (part.type.startsWith("tool-")) {
            return <ToolCard key={i} part={part} />;
          }
          return null;
        })}
      </div>

      {!isUser && text && (
        <MessageFooter message={message} text={text} />
      )}
    </div>
  );
}

// Renderiza el estado de una llamada a herramienta de forma discreta.
function ToolCard({ part }: { part: { type: string; state?: string } }) {
  const done = part.state === "output-available";
  return (
    <div className="my-1 flex items-center gap-2 rounded-lg border border-dashed border-border bg-background/60 px-2.5 py-1.5 text-xs text-muted">
      <span aria-hidden>{done ? "📚" : "🔎"}</span>
      {done ? "Catálogo consultado" : "Consultando el catálogo…"}
    </div>
  );
}

function MessageFooter({
  message,
  text,
}: {
  message: SommelierUIMessage;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  const meta = message.metadata;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // El navegador puede bloquear el portapapeles sin gesto/permiso.
    }
  }

  const tokens = meta?.totalTokens;
  const cost =
    meta?.inputTokens != null && meta?.outputTokens != null
      ? estimateCostUSD(meta.inputTokens, meta.outputTokens)
      : null;

  return (
    <div className="flex items-center gap-3 pl-1 text-xs text-muted">
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 transition-colors hover:text-accent"
      >
        {copied ? "✓ Copiado" : "⧉ Copiar"}
      </button>
      {tokens != null && (
        <span title="Consumo de esta respuesta (estimado)">
          {tokens} tokens{cost != null ? ` · ≈${formatUSD(cost)}` : ""}
        </span>
      )}
    </div>
  );
}
