// Rate limiting sencillo por ventana fija, en memoria.
//
// NOTA: al ser en memoria, el límite es POR INSTANCIA del servidor. En Vercel
// (serverless) cada instancia tiene su propio contador, así que esto mitiga
// abuso básico pero no es un límite global estricto. Para producción usaría
// Upstash Redis / Vercel KV con un algoritmo distribuido (ver README).

const WINDOW_MS = 60_000; // 1 minuto
const MAX_REQUESTS = 15; // por IP y por ventana

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const fresh: Bucket = { count: 1, resetAt: now + WINDOW_MS };
    buckets.set(key, fresh);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: fresh.resetAt };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - bucket.count,
    resetAt: bucket.resetAt,
  };
}

/** Extrae una IP identificable de los headers de la request. */
export function clientKeyFromRequest(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "anon";
}
