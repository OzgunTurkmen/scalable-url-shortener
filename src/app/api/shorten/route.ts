import { NextRequest, NextResponse } from "next/server";
import { setUrl, codeExists, type ShortenedUrl } from "@/lib/kv";
import { generateCode, isValidUrl, isValidAlias } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

interface ShortenRequestBody {
    url: string;
    alias?: string;
    expirationDays?: number;
}

export async function POST(request: NextRequest) {
    try {
        // ── Rate Limiting ──────────────────────────────────────────
        const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            request.headers.get("x-real-ip") ??
            "unknown";

        const { allowed, remaining } = await checkRateLimit(ip);
        if (!allowed) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                {
                    status: 429,
                    headers: { "X-RateLimit-Remaining": String(remaining) },
                }
            );
        }

        // ── Parse & validate body ──────────────────────────────────
        let body: ShortenRequestBody;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body." },
                { status: 400 }
            );
        }

        const { url, alias, expirationDays } = body;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { error: "Missing required field: url" },
                { status: 400 }
            );
        }

        if (!isValidUrl(url)) {
            return NextResponse.json(
                { error: "Invalid URL. Only http and https are allowed." },
                { status: 400 }
            );
        }

        // ── Alias validation ──────────────────────────────────────
        let code: string;

        if (alias) {
            if (!isValidAlias(alias)) {
                return NextResponse.json(
                    {
                        error:
                            "Invalid alias. Use 3-32 characters: letters, numbers, hyphens, underscores.",
                    },
                    { status: 400 }
                );
            }

            if (await codeExists(alias)) {
                return NextResponse.json(
                    { error: "This alias is already taken." },
                    { status: 409 }
                );
            }

            code = alias;
        } else {
            // Generate a unique random code
            code = generateCode();
            let attempts = 0;
            while (await codeExists(code)) {
                code = generateCode();
                attempts++;
                if (attempts > 10) {
                    return NextResponse.json(
                        { error: "Could not generate a unique code. Try again." },
                        { status: 500 }
                    );
                }
            }
        }

        // ── Build data & store ─────────────────────────────────────
        const now = new Date();
        const data: ShortenedUrl = {
            originalUrl: url,
            createdAt: now.toISOString(),
            clickCount: 0,
        };

        let ttlSeconds: number | undefined;

        if (expirationDays && expirationDays > 0) {
            const expiresAt = new Date(
                now.getTime() + expirationDays * 24 * 60 * 60 * 1000
            );
            data.expiresAt = expiresAt.toISOString();
            ttlSeconds = expirationDays * 24 * 60 * 60;
        }

        await setUrl(code, data, ttlSeconds);

        // ── Build short URL ────────────────────────────────────────
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL ??
            `${request.nextUrl.protocol}//${request.nextUrl.host}`;
        const shortUrl = `${baseUrl}/r/${code}`;

        return NextResponse.json(
            { code, shortUrl },
            {
                status: 201,
                headers: { "X-RateLimit-Remaining": String(remaining) },
            }
        );
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "Internal server error";
        const isEnvError = message.includes("UPSTASH_REDIS");
        return NextResponse.json(
            { error: isEnvError ? message : "Internal server error." },
            { status: isEnvError ? 503 : 500 }
        );
    }
}
