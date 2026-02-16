export default function Footer() {
    return (
        <footer className="border-t border-white/10 py-6">
            <div className="mx-auto max-w-4xl px-4 text-center text-xs text-zinc-600">
                <p>
                    Built with{" "}
                    <a
                        href="https://nextjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        Next.js
                    </a>{" "}
                    &{" "}
                    <a
                        href="https://upstash.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        Upstash Redis
                    </a>
                    . Deploy on{" "}
                    <a
                        href="https://vercel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        Vercel
                    </a>
                    .
                </p>
                <p className="mt-1">&copy; {new Date().getFullYear()} Sniplink</p>
            </div>
        </footer>
    );
}
