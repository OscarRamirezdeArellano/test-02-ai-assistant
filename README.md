# Wain — Sommelier IA 🍷

Asistente de IA especializado en **maridaje de vinos y bebidas**, construido con **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** y el **Vercel AI SDK v6** sobre la **API de Anthropic** (Claude Haiku 4.5).

> Reto **Test 02 — AI Assistant**. Implementa todos los requerimientos base **y todos los extras** de la rúbrica.

---

## 🚀 Cómo correrlo

```bash
npm install
cp .env.example .env.local     # y pon tu ANTHROPIC_API_KEY
npm run dev
# http://localhost:3000
```

Necesitas una **API key de Anthropic** ([console.anthropic.com](https://console.anthropic.com/)). Ponla en `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint`.

---

## 🍇 El dominio: por qué un sommelier de maridaje

Elegí un **sommelier de maridaje** (ninguno de los dominios sugeridos en el reto) porque es un caso donde la IA aporta valor real —traduce "¿qué tomo con esto?" en una recomendación razonada— y porque se presta a lucir las tres cosas que más importan aquí:

1. **Identidad fuerte** vía system prompt (personalidad, límites, tono).
2. **Streaming** que se siente natural con respuestas conversacionales.
3. **Tool calling** con un caso genuinamente útil: buscar en un catálogo real de vinos para **aterrizar** las recomendaciones en datos, no en alucinaciones.

## 🧠 Diseño del system prompt

El prompt (en `lib/personalities.ts`) se compone de dos capas:

- **Identidad + reglas (fijas):** quién es "Wain", que habla **solo** de maridaje y reconduce fuera de tema, que fomenta el consumo responsable y verifica mayoría de edad **sin ser repetitivo**, que **siempre ofrece una alternativa sin alcohol**, que no da consejo médico, y **cómo y cuándo usar la herramienta** de catálogo (grounding con nombre, región y precio).
- **Tono (variable por modo):** `Clásico`, `Casual` o `Experto`. El usuario lo cambia en la UI y viaja en el body de cada request; el servidor arma el system prompt según el modo.

Separar identidad de tono permite ofrecer **3 personalidades** sin duplicar reglas ni arriesgar que un modo se salte los límites.

---

## 🍷 El catálogo (qué puede recomendar Wain)

La herramienta `buscarVinos` consulta este catálogo de **16 bebidas** (`lib/wines.ts`), con precios de **$90 a $1,200 MXN** y **5 tipos** (tinto, blanco, rosado, espumoso y sin alcohol). Cuando pides algo concreto, Wain lo filtra por **platillo, tipo, presupuesto o región** y **cita datos reales** en lugar de inventar etiquetas.

| Nombre | Tipo | Región | Precio (MXN) | Marida con |
|--------|------|--------|-------------:|------------|
| Casa Madero 2V | tinto | Valle de Parras, México | $320 | carne, res, cordero, quesos |
| Santo Tomás Tempranillo | tinto | Valle de Guadalupe, México | $380 | carne, asado, barbacoa, cordero |
| Rioja Crianza | tinto | Rioja, España | $450 | carne, jamón, cochinita, cordero |
| Malbec de Mendoza | tinto | Mendoza, Argentina | $400 | carne, arrachera, res, chocolate |
| Pinot Noir Casablanca | tinto | Valle de Casablanca, Chile | $420 | salmón, atún, pato, champiñones |
| Sauvignon Blanc Marlborough | blanco | Marlborough, Nueva Zelanda | $390 | pescado, ceviche, ensalada, queso de cabra |
| Chardonnay con barrica | blanco | Valle de Guadalupe, México | $430 | pollo, pasta cremosa, langosta, camarón |
| Albariño | blanco | Rías Baixas, España | $460 | mariscos, pulpo, almejas, ceviche |
| Riesling semi-seco | blanco | Mosela, Alemania | $410 | comida picante, tailandesa, curry, cerdo |
| Rosado de Provenza | rosado | Provenza, Francia | $440 | ensalada, sushi, aperitivo, pizza |
| Cava Brut | espumoso | Penedés, España | $350 | aperitivo, fritura, sushi, celebración |
| Champagne Brut | espumoso | Champagne, Francia | $1,200 | celebración, ostras, caviar, quesos |
| Prosecco Extra Dry | espumoso | Véneto, Italia | $300 | brunch, aperitivo, postre, fruta |
| Oporto Tawny | tinto | Douro, Portugal | $520 | postre, chocolate, quesos azules, nuez |
| Kombucha de jamaica | sin alcohol | Artesanal, México | $90 | tacos, comida picante, ensalada, aperitivo |
| Mosto de uva blanca | sin alcohol | Sin alcohol | $120 | pescado, ensalada, brunch, aperitivo |

### Prompts de ejemplo para ver el _tool calling_ en acción

Estos disparan la herramienta y devuelven resultados concretos del catálogo:

- **"¿Qué le va a unos tacos al pastor?"** → Kombucha y Albariño (match por _tacos_).
- **"Recomiéndame un tinto para carne asada por menos de $400"** → Casa Madero, Santo Tomás, Malbec.
- **"¿Qué vino para salmón?"** → Pinot Noir (el único tinto que marida pescado).
- **"Mariscos con algo de España"** → Albariño (Rías Baixas).
- **"¿Qué espumoso para una celebración?"** → Cava y Champagne.
- **"Algo sin alcohol para una comida picante"** → Kombucha de jamaica.
- **"Muéstrame opciones de México"** → Casa Madero, Santo Tomás, Chardonnay, Kombucha.

Wain también responde fuera del catálogo con criterio general (por tipo de uva/estilo) y **siempre ofrece una alternativa sin alcohol** cuando aplica.

---

## ✅ Qué construí

### Requerimientos base

- **Interfaz de chat** con input multilínea (Enter envía, Shift+Enter salto), botón de envío y **auto-scroll**.
- **Streaming token a token** vía `streamText().toUIMessageStreamResponse()` + `useChat`.
- **Historial de conversación**: el array de `messages` se envía completo en cada turno.
- **System prompt configurable** por modo (ver arriba).
- **Manejo de errores visible**: banner con mensaje claro + botón "Reintentar"; el route falla temprano y explícito si falta la API key.
- **Botón para limpiar/reiniciar** la conversación.

### Extras (todos)

- **Indicador de escritura** ("El sommelier está pensando…").
- **Múltiples personalidades** seleccionables (Clásico / Casual / Experto).
- **Contador de tokens y costo estimado**: por mensaje y acumulado, vía `messageMetadata` (usage real del modelo).
- **Botón para copiar** cada respuesta del asistente.
- **Persistencia en `localStorage`**: la conversación y el modo sobreviven a un refresh.
- **Tool calling**: herramienta `buscarVinos` sobre un catálogo local (`lib/wines.ts`).
- **Rate limiting** por IP en el API route (ventana fija en memoria).
- **Respuestas en Markdown renderizado** (negritas, listas, tablas) con `react-markdown`.
- **Deploy en Vercel**: _(ver sección Deploy)_.

---

## 🧩 Decisiones técnicas y trade-offs

**API key solo en el servidor.** Toda llamada al modelo ocurre en `app/api/chat/route.ts` (Route Handler). El cliente nunca ve la key: habla con `/api/chat`, no con Anthropic. Es el requisito de seguridad central del reto.

**AI SDK v6 con la API moderna.** El starter traía la API vieja (`toDataStreamResponse`, `useChat` con input manejado). Migré a lo actual: `toUIMessageStreamResponse()`, `useChat` desde `@ai-sdk/react` con `DefaultChatTransport`, e input manejado por mí. El modo se envía por-request con `sendMessage(msg, { body: { mode } })` en lugar de recrear el transport.

**Tool calling para _grounding_, no de adorno.** El sommelier no inventa etiquetas: cuando pides algo concreto, llama a `buscarVinos`, que filtra un catálogo real por platillo, tipo, presupuesto y región. `stopWhen: stepCountIs(3)` permite el ciclo mensaje → tool → respuesta final basada en el resultado.

**Persistencia sin romper la hidratación.** El historial se restaura desde `localStorage` en el inicializador de estado (no en un efecto), y el render se protege con un hook `useMounted` basado en `useSyncExternalStore`. Así se evita tanto el _mismatch_ de hidratación como la regla `set-state-in-effect` de Next 16.

**Costo estimado, honesto.** El contador usa el `usage` real que devuelve el modelo; el costo en USD es una **estimación** con tarifas configurables en `lib/pricing.ts` (marcadas como aproximadas), no un dato al centavo.

**Rate limiting pragmático.** Ventana fija en memoria: mitiga abuso básico pero es **por instancia** en serverless. En producción usaría Upstash Redis / Vercel KV para un límite distribuido (lo anoto abajo).

**Markdown renderizado.** Las respuestas del asistente se renderizan con `react-markdown` + `remark-gfm` (negritas, listas, tablas), con estilos propios en `globals.css`. Los enlaces abren en pestaña nueva con `rel="noopener"`, y no se permite HTML crudo del modelo (seguridad). Los mensajes del **usuario** se muestran en texto plano a propósito.

**El nombre "Wain".** Un guiño juguetón a _wine_: le da personalidad e identidad memorable al asistente sin perder criterio de sommelier. El nombre y el tono viven en el system prompt (`lib/personalities.ts`).

---

## 🔮 Qué haría con más tiempo

- **Rate limiting distribuido** (Upstash Redis) y límites por usuario, no solo por IP.
- **Más herramientas**: guardar favoritos, filtrar por tipo de uva, "sorpréndeme".
- **Streaming de UI de la herramienta**: mostrar los vinos encontrados como tarjetas dentro del chat, no solo un chip.
- **Tests** del route (mockeando el modelo) y de la lógica de `searchWines`.
- **Regenerar/editar** mensajes individuales y export de la conversación.

---

## 🗂 Estructura

```
app/
  page.tsx                 # contenedor a altura completa
  layout.tsx               # shell + header
  api/chat/route.ts        # streaming + system prompt + tool + rate limit + usage
components/
  Chat.tsx                 # orquestador (useChat, persistencia, auto-scroll)
  Message.tsx              # render de parts (texto + tool) + copiar + tokens
  ChatComposer.tsx, ModeSelector.tsx, UsageMeter.tsx, TypingIndicator.tsx
  useMounted.ts            # hydration-safe con useSyncExternalStore
lib/
  personalities.ts         # system prompt por modo (identidad + reglas + tono)
  wines.ts                 # catálogo + searchWines (respalda el tool)
  pricing.ts               # estimación de costo (tarifas ajustables)
  rate-limit.ts            # ventana fija en memoria
  types.ts                 # ChatMode + metadata (zod) + tipos UIMessage
```

---

## ☁️ Deploy

Desplegado en Vercel (producción). Requiere `ANTHROPIC_API_KEY` como variable de entorno del proyecto (solo servidor).

**URL:** https://test-02-ai-assistant.vercel.app
