import { Redis } from "@upstash/redis";

// ─── KV Client ───────────────────────────────────────────────
// Lazy-initialized. On Vercel, env vars (UPSTASH_REDIS_REST_URL &
// UPSTASH_REDIS_REST_TOKEN) are auto-injected when you link an Upstash store.

let _redis: Redis | null = null;

function getRedis(): Redis {
    if (_redis) return _redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error(
            "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. " +
            "Create a free Redis store at https://console.upstash.com and add the credentials to .env.local"
        );
    }

    _redis = new Redis({ url, token });
    return _redis;
}

// ─── Types ───────────────────────────────────────────────────
export interface ShortenedUrl {
    originalUrl: string;
    createdAt: string; // ISO 8601
    clickCount: number;
    expiresAt?: string; // ISO 8601 | undefined
}

// ─── Key helpers ─────────────────────────────────────────────
const urlKey = (code: string) => `url:${code}`;

// ─── CRUD ────────────────────────────────────────────────────

/**
 * Store a shortened URL entry in KV.
 * If ttlSeconds is provided the key will auto-expire.
 */
export async function setUrl(
    code: string,
    data: ShortenedUrl,
    ttlSeconds?: number
): Promise<void> {
    const redis = getRedis();
    const key = urlKey(code);
    if (ttlSeconds && ttlSeconds > 0) {
        await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
    } else {
        await redis.set(key, JSON.stringify(data));
    }
}

/**
 * Retrieve a shortened URL entry. Returns null when not found.
 */
export async function getUrl(code: string): Promise<ShortenedUrl | null> {
    const redis = getRedis();
    const raw = await redis.get<string>(urlKey(code));
    if (!raw) return null;
    // Upstash may auto-parse JSON; handle both string and object.
    if (typeof raw === "object") return raw as unknown as ShortenedUrl;
    return JSON.parse(raw) as ShortenedUrl;
}

/**
 * Atomically increment clickCount by 1.
 * We read-modify-write because the value is a JSON blob.
 */
export async function incrementClick(code: string): Promise<void> {
    const redis = getRedis();
    const data = await getUrl(code);
    if (!data) return;
    data.clickCount += 1;

    // Preserve remaining TTL if key has one.
    const ttl = await redis.ttl(urlKey(code));
    if (ttl > 0) {
        await redis.set(urlKey(code), JSON.stringify(data), { ex: ttl });
    } else {
        await redis.set(urlKey(code), JSON.stringify(data));
    }
}

/**
 * Check if a code already exists.
 */
export async function codeExists(code: string): Promise<boolean> {
    const redis = getRedis();
    const exists = await redis.exists(urlKey(code));
    return exists === 1;
}

export { getRedis as getRedisClient };
