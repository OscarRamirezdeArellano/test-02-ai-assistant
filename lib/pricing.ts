// Estimación de costo por conversación.
//
// IMPORTANTE: son tarifas APROXIMADAS de Claude Haiku 4.5 en USD por millón de
// tokens, pensadas para dar una idea en la UI. Ajusta estas constantes según el
// pricing vigente de Anthropic; no pretenden ser exactas al centavo.
export const MODEL_ID = "claude-haiku-4-5";

const USD_PER_MTOK_INPUT = 1.0;
const USD_PER_MTOK_OUTPUT = 5.0;

export function estimateCostUSD(
  inputTokens: number,
  outputTokens: number
): number {
  return (
    (inputTokens / 1_000_000) * USD_PER_MTOK_INPUT +
    (outputTokens / 1_000_000) * USD_PER_MTOK_OUTPUT
  );
}

/** Formatea un costo pequeño en USD de forma legible (p. ej. "$0.0021"). */
export function formatUSD(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}
