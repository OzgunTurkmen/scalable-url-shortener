"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Shorten" },
    { href: "/stats", label: "Stats" },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
                        S
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-white">
                        Sniplink
                    </span>
                </Link>

                {/* Navigation links */}
                <ul className="flex items-center gap-1">
                    {links.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${isActive
                                            ? "bg-white/10 text-white"
                                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
