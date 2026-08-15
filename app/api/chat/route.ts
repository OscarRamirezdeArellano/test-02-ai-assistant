import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  tool,
} from "ai";
import { z } from "zod";
import { systemPromptFor } from "@/lib/personalities";
import { isChatMode, type SommelierUIMessage } from "@/lib/types";
import { searchWines, type WineType } from "@/lib/wines";
import { MODEL_ID } from "@/lib/pricing";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

// Herramienta de dominio: busca en el catálogo real para "aterrizar" las
// recomendaciones del sommelier (grounding) en vez de inventar etiquetas.
const buscarVinos = tool({
  description:
    "Busca vinos y bebidas en el catálogo para recomendar maridajes reales. Úsala cuando el usuario pida sugerencias concretas para un platillo, tipo de vino o presupuesto.",
  inputSchema: z.object({
    maridaje: z
      .string()
      .optional()
      .describe("Platillo o ingrediente a maridar, ej. 'salmón', 'tacos al pastor'"),
    tipo: z
      .enum(["tinto", "blanco", "rosado", "espumoso", "sin alcohol"])
      .optional()
      .describe("Tipo de bebida deseado"),
    presupuestoMax: z
      .number()
      .optional()
      .describe("Precio máximo en pesos mexicanos (MXN)"),
    region: z.string().optional().describe("Región o país de origen"),
  }),
  execute: async ({ maridaje, tipo, presupuestoMax, region }) => {
    const resultados = searchWines({
      maridaje,
      tipo: tipo as WineType | undefined,
      presupuestoMax,
      region,
    });
    return {
      encontrados: resultados.length,
      vinos: resultados.map((w) => ({
        nombre: w.nombre,
        tipo: w.tipo,
        uva: w.uva,
        region: w.region,
        precioMXN: w.precioMXN,
        cuerpo: w.cuerpo,
        notas: w.notas,
      })),
    };
  },
});

export async function POST(req: Request) {
  // Rate limiting por IP para prevenir abuso.
  const limit = rateLimit(clientKeyFromRequest(req));
  if (!limit.allowed) {
    const retryAfter = Math.ceil((limit.resetAt - Date.now()) / 1000);
    return Response.json(
      {
        error: "Demasiadas solicitudes. Espera un momento antes de continuar.",
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: { messages?: SommelierUIMessage[]; mode?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  const mode = isChatMode(body.mode) ? body.mode : "clasico";

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: "No hay mensajes que procesar." },
      { status: 400 }
    );
  }

  // Falla temprano y claro si falta la API key (mejor DX que un 500 opaco).
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          "Falta ANTHROPIC_API_KEY en el servidor. Configura tu .env.local (ver .env.example).",
      },
      { status: 500 }
    );
  }

  const result = streamText({
    model: anthropic(MODEL_ID),
    system: systemPromptFor(mode),
    messages: await convertToModelMessages(messages),
    tools: { buscarVinos },
    // Permite: mensaje → tool call → respuesta final basada en el resultado.
    stopWhen: stepCountIs(3),
    // Convierte errores del proveedor en un texto legible en el stream.
    onError: ({ error }) => {
      console.error("streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    // Adjunta a cada mensaje el modelo y el consumo de tokens para la UI.
    messageMetadata: ({ part }) => {
      if (part.type === "start") {
        return { model: MODEL_ID };
      }
      if (part.type === "finish") {
        return {
          inputTokens: part.totalUsage.inputTokens,
          outputTokens: part.totalUsage.outputTokens,
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
    onError: (error) => {
      // Mensaje genérico al cliente (no filtramos detalles del servidor).
      console.error("stream response error:", error);
      return "Ocurrió un error al generar la respuesta. Intenta de nuevo.";
    },
  });
}
