"use client";

import { useState } from "react";

interface Stats {
    code: string;
    originalUrl: string;
    createdAt: string;
    clickCount: number;
    expiresAt: string | null;
}

export default function StatsLookup() {
    const [code, setCode] = useState("");
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLookup(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setStats(null);
        setLoading(true);

        const trimmed = code.trim();
        if (!trimmed) {
            setError("Please enter a short code.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/stats?code=${encodeURIComponent(trimmed)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                return;
            }

            setStats(data);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <form onSubmit={handleLookup} className="flex gap-3">
                <input
                    id="stats-code-input"
                    type="text"
                    placeholder="Enter short code (e.g. abc123)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Lookup"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {/* Stats card */}
            {stats && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {/* Click count hero */}
                    <div className="text-center pb-4 border-b border-white/10">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
                            Total Clicks
                        </p>
                        <p className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {stats.clickCount.toLocaleString()}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-0.5">
                                Original URL
                            </p>
                            <a
                                href={stats.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-cyan-400 hover:text-cyan-300 break-all transition-colors"
                            >
                                {stats.originalUrl}
                            </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Created
                                </p>
                                <p className="text-sm text-zinc-300">
                                    {formatDate(stats.createdAt)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-0.5">
                                    Expires
                                </p>
                                <p className="text-sm text-zinc-300">
                                    {stats.expiresAt ? formatDate(stats.expiresAt) : "Never"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-0.5">
                                Short Code
                            </p>
                            <p className="text-sm font-mono text-zinc-300">{stats.code}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
