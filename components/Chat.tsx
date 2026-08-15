"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  messageMetadataSchema,
  isChatMode,
  type ChatMode,
  type SommelierUIMessage,
} from "@/lib/types";
import { useMounted } from "./useMounted";
import { Message } from "./Message";
import { ChatComposer } from "./ChatComposer";
import { ModeSelector } from "./ModeSelector";
import { UsageMeter } from "./UsageMeter";
import { TypingIndicator } from "./TypingIndicator";

const MESSAGES_KEY = "sommelier:messages";
const MODE_KEY = "sommelier:mode";
const MAX_STORED = 50;

const SUGGESTIONS = [
  "¿Qué le va a unos tacos al pastor?",
  "Recomiéndame un tinto para carne asada por menos de $400",
  "Algo sin alcohol para acompañar sushi",
  "¿Vino para una cena romántica con salmón?",
];

function loadMessages(): SommelierUIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as SommelierUIMessage[]) : [];
  } catch {
    return [];
  }
}

function loadMode(): ChatMode {
  if (typeof window === "undefined") return "clasico";
  const stored = localStorage.getItem(MODE_KEY);
  return isChatMode(stored) ? stored : "clasico";
}

export function Chat() {
  const mounted = useMounted();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>(loadMode);

  // Transport creado una sola vez. El modo se envía por-request en el body de
  // sendMessage/regenerate (el DefaultChatTransport fusiona options.body).
  const transport = useMemo(
    () => new DefaultChatTransport<SommelierUIMessage>({ api: "/api/chat" }),
    []
  );

  const [initialMessages] = useState<SommelierUIMessage[]>(loadMessages);

  const { messages, sendMessage, status, error, stop, regenerate, setMessages } =
    useChat<SommelierUIMessage>({
      transport,
      messages: initialMessages,
      messageMetadataSchema,
    });

  const busy = status === "submitted" || status === "streaming";
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando llegan mensajes o tokens nuevos.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persistir historial (solo escritura) y modo.
  useEffect(() => {
    try {
      localStorage.setItem(
        MESSAGES_KEY,
        JSON.stringify(messages.slice(-MAX_STORED))
      );
    } catch {
      // Ignorar errores de escritura.
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text }, { body: { mode } });
    setInput("");
  }

  function handleReset() {
    stop();
    setMessages([]);
    try {
      localStorage.removeItem(MESSAGES_KEY);
    } catch {
      // no-op
    }
  }

  const showEmpty = !mounted || messages.length === 0;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Barra superior: modo + consumo + limpiar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModeSelector mode={mode} onChange={setMode} disabled={busy} />
        <div className="flex items-center gap-3">
          {mounted && <UsageMeter messages={messages} />}
          {mounted && messages.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              🗑 Limpiar conversación
            </button>
          )}
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-background/40 p-4">
        {showEmpty ? (
          <EmptyState
            onPick={(q) => {
              setInput(q);
            }}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {status === "submitted" && <TypingIndicator />}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Error visible con reintento */}
      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <span>Algo salió mal al responder. {error.message}</span>
          <button
            type="button"
            onClick={() => regenerate({ body: { mode } })}
            className="shrink-0 rounded-lg border border-rose-400 px-3 py-1 font-medium transition-colors hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            Reintentar
          </button>
        </div>
      )}

      <ChatComposer
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        onStop={stop}
        busy={busy}
      />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl" aria-hidden>
          🍷
        </span>
        <h2 className="text-lg font-semibold">Hola, soy Vino</h2>
        <p className="max-w-sm text-sm text-muted">
          Tu sommelier de maridaje. Dime qué vas a comer o qué se te antoja y te
          recomiendo la bebida perfecta — con o sin alcohol.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
