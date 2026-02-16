import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About — Sniplink",
    description: "Learn about Sniplink, a serverless URL shortener built on Next.js and Upstash Redis.",
};

export default function AboutPage() {
    return (
        <section className="glow-accent flex flex-col items-center px-4 pt-24 pb-16">
            <div className="max-w-2xl text-center">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                    About Sniplink
                </h1>

                <div className="space-y-4 text-zinc-400 leading-relaxed text-left">
                    <p>
                        <strong className="text-white">Sniplink</strong> is a lightweight,
                        serverless URL shortener designed to run entirely on{" "}
                        <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
                        >
                            Vercel
                        </a>{" "}
                        with zero external infrastructure. Just deploy and it works.
                    </p>

                    <p>
                        Under the hood it uses{" "}
                        <a
                            href="https://upstash.com/docs/redis/overall/getstarted"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
                        >
                            Upstash Redis
                        </a>{" "}
                        (Vercel KV) for storage —  meaning every shortened link, click
                        counter and TTL lives in a globally-distributed, serverless
                        key-value store with no servers to manage.
                    </p>

                    <p>
                        Features include custom aliases, optional link expiration, basic
                        click tracking, and IP-based rate limiting — all running on
                        Node.js serverless functions.
                    </p>

                    <p>
                        This is a proof-of-concept / showcase project. For production
                        workloads you may want to add Postgres for richer analytics and
                        a dedicated Redis tier for higher throughput.
                    </p>
                </div>

                {/* Tech badges */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    {["Next.js 15", "TypeScript", "Tailwind CSS", "Upstash Redis", "Vercel"].map(
                        (tech) => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-400"
                            >
                                {tech}
                            </span>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
