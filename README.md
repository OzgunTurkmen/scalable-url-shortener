# Sniplink — Scalable URL Shortener

A lightweight, serverless URL shortener built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Upstash Redis**. Designed for one-click deployment on **Vercel** with zero external infrastructure.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## Features

| Feature | Description |
|---------|-------------|
| **URL Shortening** | Paste any `http/https` URL and get a short link (`/r/abc123`) |
| **Custom Alias** | Choose your own alias (3-32 chars, `a-zA-Z0-9_-`) |
| **Link Expiration** | Set optional TTL in days — KV key auto-expires |
| **Click Tracking** | Every redirect increments a click counter |
| **Stats Lookup** | Query any short code for original URL, click count, dates |
| **Rate Limiting** | IP-based: 60 requests / 10 minutes on `/api/shorten` |
| **404 / 410 Pages** | Missing links → 404, expired links → 410 |

---

## Tech Stack

- **Framework:** Next.js 15 (App Router, Node.js runtime)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Storage:** Upstash Redis (serverless, Vercel-integrated)
- **Deployment:** Vercel (zero-config)

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Shorten a URL. Body: `{ url, alias?, expirationDays? }` |
| `GET` | `/api/stats?code=abc123` | Get stats for a short code |
| `GET` | `/r/[code]` | Redirect to original URL (increments click count) |

### POST `/api/shorten`

```json
// Request
{
  "url": "https://example.com/very-long-article-url",
  "alias": "my-link",          // optional
  "expirationDays": 30         // optional
}

// Response (201)
{
  "code": "my-link",
  "shortUrl": "https://your-domain.vercel.app/r/my-link"
}
```

### GET `/api/stats?code=my-link`

```json
// Response (200)
{
  "code": "my-link",
  "originalUrl": "https://example.com/very-long-article-url",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "clickCount": 42,
  "expiresAt": "2025-02-14T12:00:00.000Z"
}
```

---

## 1) Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/scalable-url-shortener.git
cd scalable-url-shortener

# Install dependencies
npm install

# Copy env template
cp .env.example .env.local

# Fill in your Upstash Redis credentials in .env.local
# (see "Environment Variables" section below)

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** You need an Upstash Redis instance for KV storage to work, even in local development. Create a free one at [console.upstash.com](https://console.upstash.com).

---

## 2) Vercel Deployment

### Option A: One-Click (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. In the Vercel dashboard, go to **Storage** → **Create** → **Upstash Redis**
4. Link the Redis store to your project — Vercel auto-injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
5. Set `NEXT_PUBLIC_BASE_URL` to your production domain (e.g. `https://sniplink.vercel.app`)
6. Deploy 🚀

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts, then:
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
vercel env add NEXT_PUBLIC_BASE_URL
vercel --prod
```

---

## 3) Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | ✅ | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Upstash Redis REST auth token |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ | Base URL for generated short links. Defaults to `http://localhost:3000` |

Get your Upstash credentials from the [Upstash Console](https://console.upstash.com) or by creating a Redis store in the [Vercel Dashboard → Storage](https://vercel.com/dashboard/stores).

---

## 4) Production Scaling Notes

This project is a **proof-of-concept** optimized for simplicity. For production workloads, consider:

- **PostgreSQL** (e.g. Vercel Postgres / Neon) for richer analytics (referrer, user-agent, geo, time-series click data)
- **Dedicated Redis** tier for higher throughput and persistence guarantees
- **Authentication** for managing links (e.g. NextAuth.js)
- **Custom domains** for branded short links
- **Bulk operations** for enterprise use cases

The architecture is designed so that swapping KV for Postgres + Redis requires changes only in `src/lib/kv.ts` — all API routes and components remain untouched.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Navbar + Footer
│   ├── page.tsx                # Home — Shorten form
│   ├── globals.css             # Tailwind + custom styles
│   ├── stats/page.tsx          # Stats lookup page
│   ├── about/page.tsx          # About page
│   ├── r/[code]/route.ts       # Redirect handler (GET → 302)
│   └── api/
│       ├── shorten/route.ts    # POST → URL shortening
│       └── stats/route.ts      # GET → Stats query
├── components/
│   ├── Navbar.tsx
│   ├── ShortenForm.tsx
│   ├── StatsLookup.tsx
│   └── Footer.tsx
└── lib/
    ├── kv.ts                   # Upstash Redis wrapper
    ├── utils.ts                # Code generator, validators
    └── rate-limit.ts           # IP-based rate limiter
```

---

## License

MIT
