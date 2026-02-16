"use client";

import { useState } from "react";

interface ShortenResult {
    code: string;
    shortUrl: string;
}

export default function ShortenForm() {
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [expirationDays, setExpirationDays] = useState("");
    const [result, setResult] = useState<ShortenResult | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setResult(null);
        setCopied(false);
        setLoading(true);

        try {
            const body: Record<string, unknown> = { url };
            if (alias.trim()) body.alias = alias.trim();
            if (expirationDays.trim()) {
                const days = Number(expirationDays);
                if (isNaN(days) || days <= 0) {
                    setError("Expiration days must be a positive number.");
                    setLoading(false);
                    return;
                }
                body.expirationDays = days;
            }

            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                return;
            }

            setResult(data);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy() {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const input = document.createElement("input");
            input.value = result.shortUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* URL input */}
                <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-zinc-300 mb-1.5">
                        Long URL <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="url-input"
                        type="url"
                        placeholder="https://example.com/very-long-url..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                {/* Alias & Expiration row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="alias-input" className="block text-sm font-medium text-zinc-300 mb-1.5">
                            Custom Alias <span className="text-zinc-600">(optional)</span>
                        </label>
                        <input
                            id="alias-input"
                            type="text"
                            placeholder="my-link"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                    <div>
                        <label htmlFor="expiration-input" className="block text-sm font-medium text-zinc-300 mb-1.5">
                            Expires in <span className="text-zinc-600">(days, optional)</span>
                        </label>
                        <input
                            id="expiration-input"
                            type="number"
                            min="1"
                            placeholder="30"
                            value={expirationDays}
                            onChange={(e) => setExpirationDays(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                            </svg>
                            Shortening...
                        </span>
                    ) : (
                        "Shorten URL"
                    )}
                </button>
            </form>

            {/* Error display */}
            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {/* Result display */}
            {result && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
                        Your short link
                    </p>
                    <div className="flex items-center gap-3">
                        <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 truncate rounded-lg bg-zinc-800 px-4 py-2.5 font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            {result.shortUrl}
                        </a>
                        <button
                            onClick={handleCopy}
                            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${copied
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                                }`}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
