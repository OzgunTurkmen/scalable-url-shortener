import { getRedisClient } from "./kv";

// ─── Configuration ───────────────────────────────────────────
const WINDOW_SECONDS = 600; // 10 minutes
const MAX_REQUESTS = 60;

// ─── Rate Limiter ────────────────────────────────────────────
interface RateLimitResult {
    allowed: boolean;
    remaining: number;
}

/**
 * IP-based rate limiter backed by Upstash Redis.
 * Uses a sliding-window counter: `rl:<ip>` with a 10-minute TTL.
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
    const redis = getRedisClient();
    const key = `rl:${ip}`;

    // INCR atomically increments (and creates if absent).
    const current = await redis.incr(key);

    // Set expiry only on the first request of the window.
    if (current === 1) {
        await redis.expire(key, WINDOW_SECONDS);
    }

    const allowed = current <= MAX_REQUESTS;
    const remaining = Math.max(0, MAX_REQUESTS - current);

    return { allowed, remaining };
}
