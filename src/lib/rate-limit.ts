import "server-only";

/**
 * In-process sliding-window limiter. Enough for a single Node instance, which
 * is how this site is deployed; behind more than one instance, swap the store
 * for Redis and keep the same `check()` signature.
 */

type Bucket = { hits: number[]; blockedUntil?: number };

const store = new Map<string, Bucket>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    if (bucket.blockedUntil && bucket.blockedUntil > now) continue;
    if (bucket.hits.length === 0 || now - bucket.hits[bucket.hits.length - 1] > 3_600_000) {
      store.delete(key);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export type RateLimitRule = {
  /** Requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Extra cool-down applied once the limit is hit. */
  blockMs?: number;
};

export const RULES = {
  advisor: { limit: 12, windowMs: 60_000, blockMs: 30_000 },
  lead: { limit: 5, windowMs: 10 * 60_000, blockMs: 60_000 },
  search: { limit: 40, windowMs: 60_000 },
  newsletter: { limit: 3, windowMs: 10 * 60_000, blockMs: 60_000 },
  login: { limit: 8, windowMs: 10 * 60_000, blockMs: 5 * 60_000 },
  upload: { limit: 10, windowMs: 10 * 60_000 },
} as const satisfies Record<string, RateLimitRule>;

export function check(key: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = store.get(key) ?? { hits: [] };
  if (bucket.blockedUntil && bucket.blockedUntil > now) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }

  bucket.hits = bucket.hits.filter((t) => now - t < rule.windowMs);
  if (bucket.hits.length >= rule.limit) {
    bucket.blockedUntil = now + (rule.blockMs ?? rule.windowMs);
    store.set(key, bucket);
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((rule.blockMs ?? rule.windowMs) / 1000),
    };
  }

  bucket.hits.push(now);
  store.set(key, bucket);
  return { ok: true, remaining: rule.limit - bucket.hits.length, retryAfterSeconds: 0 };
}

/**
 * Client identity for limiting. Prefers the proxy-forwarded address; falls back
 * to a constant so a misconfigured proxy fails closed (shared bucket) rather
 * than open (unlimited).
 */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}

export function tooManyRequests(result: RateLimitResult, message: string): Response {
  return Response.json(
    { error: "rate_limited", message },
    { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
  );
}
