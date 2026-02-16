import ShortenForm from "@/components/ShortenForm";

export default function HomePage() {
  return (
    <section className="glow-accent flex flex-col items-center px-4 pt-24 pb-16">
      {/* Hero */}
      <div className="mb-12 text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Shorten any URL in{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            seconds
          </span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Paste your long link below and get a clean, shareable short URL.
          Track clicks, set expiration dates, or choose a custom alias.
        </p>
      </div>

      {/* Form */}
      <ShortenForm />
    </section>
  );
}
