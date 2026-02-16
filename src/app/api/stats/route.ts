import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const code = request.nextUrl.searchParams.get("code");

        if (!code || typeof code !== "string") {
            return NextResponse.json(
                { error: "Missing required query parameter: code" },
                { status: 400 }
            );
        }

        const data = await getUrl(code);

        if (!data) {
            return NextResponse.json(
                { error: "Short URL not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            code,
            originalUrl: data.originalUrl,
            createdAt: data.createdAt,
            clickCount: data.clickCount,
            expiresAt: data.expiresAt ?? null,
        });
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
