import type { UIMessage } from "ai";
import { z } from "zod";

/** Modos de personalidad seleccionables en la UI. */
export const CHAT_MODES = ["clasico", "casual", "experto"] as const;
export type ChatMode = (typeof CHAT_MODES)[number];

export function isChatMode(value: unknown): value is ChatMode {
  return (
    typeof value === "string" && CHAT_MODES.includes(value as ChatMode)
  );
}

/**
 * Metadata que el servidor adjunta a cada mensaje del asistente.
 * Permite mostrar en la UI el modelo usado y el consumo de tokens/costo.
 */
export const messageMetadataSchema = z.object({
  model: z.string().optional(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

/** UIMessage tipado con nuestra metadata. */
export type SommelierUIMessage = UIMessage<MessageMetadata>;
