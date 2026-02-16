import { NextRequest, NextResponse } from "next/server";
import { getUrl, incrementClick } from "@/lib/kv";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { error: "Missing code parameter." },
        { status: 400 }
      );
    }

    const data = await getUrl(code);

    // ── Not found ──────────────────────────────────────────────
    if (!data) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>404 — Not Found</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fafafa">
  <div style="text-align:center">
    <h1 style="font-size:4rem;margin:0">404</h1>
    <p>This short link does not exist.</p>
    <a href="/" style="color:#60a5fa">Go Home</a>
  </div>
</body>
</html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // ── Expired ────────────────────────────────────────────────
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>410 — Gone</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fafafa">
  <div style="text-align:center">
    <h1 style="font-size:4rem;margin:0">410</h1>
    <p>This short link has expired.</p>
    <a href="/" style="color:#60a5fa">Go Home</a>
  </div>
</body>
</html>`,
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    // ── Increment click & redirect ────────────────────────────
    await incrementClick(code);

    return NextResponse.redirect(data.originalUrl, 302);
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
