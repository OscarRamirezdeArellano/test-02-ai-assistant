"use client";

import type { SommelierUIMessage } from "@/lib/types";
import { estimateCostUSD, formatUSD } from "@/lib/pricing";

/** Suma el consumo de tokens/costo de toda la conversación. */
export function UsageMeter({ messages }: { messages: SommelierUIMessage[] }) {
  let totalTokens = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  for (const message of messages) {
    const meta = message.metadata;
    if (!meta) continue;
    totalTokens += meta.totalTokens ?? 0;
    inputTokens += meta.inputTokens ?? 0;
    outputTokens += meta.outputTokens ?? 0;
  }

  if (totalTokens === 0) return null;

  const cost = estimateCostUSD(inputTokens, outputTokens);

  return (
    <span
      className="text-xs text-muted"
      title="Consumo acumulado de la conversación (estimado)"
    >
      {totalTokens.toLocaleString("es-MX")} tokens · ≈{formatUSD(cost)}
    </span>
  );
}
