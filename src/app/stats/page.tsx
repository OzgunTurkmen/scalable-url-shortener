import type { Metadata } from "next";
import StatsLookup from "@/components/StatsLookup";

export const metadata: Metadata = {
    title: "Stats — Sniplink",
    description: "Look up click statistics for any Sniplink short URL.",
};

export default function StatsPage() {
    return (
        <section className="glow-accent flex flex-col items-center px-4 pt-24 pb-16">
            <div className="mb-10 text-center max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                    Link Statistics
                </h1>
                <p className="text-zinc-400">
                    Enter a short code to see how your link is performing.
                </p>
            </div>

            <StatsLookup />
        </section>
    );
}
