# AI Assistant Benchmark

Public scorecard for AI personal assistants — Wirecutter/RTINGS-style comparison with consistent metrics across every product. Real user feedback, no sponsored rankings.

## Overview

This is an independent, evidence-based comparison site for AI personal assistants. Every assistant is evaluated across the same 14 categories, ensuring fair comparisons regardless of the tool's specialty.

### The benchmark

Every category has one published test (`data/tasks.json`: prompt, pass criteria, score anchors at 3 / 7 / 10). A score exists only when a run has been logged for it. The home page is the scorecard matrix; each category has its own ranking at `/categories/<key>`; each assistant keeps its profile at `/agents/<slug>`.

### Current Data

- **40 AI Assistants** (30 confirmed, 10 stretch)
- **795 Feedback Items** from public discussions (X/Twitter, Reddit, etc.)
- **14 Evaluation Categories** (7 core + 7 endorsed)

### Features

- **Leaderboard** (`/`): ranked "Most discussed" list plus Confirmed and Stretch shelves; `/confirmed` and `/stretch` list everything
- **Agent profiles** (`/agents/<slug>`): identity block with logo and tagline, 14 score rows, public quotes filterable by kind, information column, related agents
- **Categories** (`/categories`): the rubric, with anchors the sidebar links to, and how scoring works
- **Request a test** (`/request`): form to suggest an assistant or send a correction

## Design

The UI follows the [imessage.store](https://imessage.store) system: Apple system font stack, seven color tokens (`--bg --fill --text --sec --line --hair --blue`), a 232px sidebar, hairline-separated rows with 56px icons, pill buttons, and one bold element — the blue iMessage-bubble H1 on the home page. Light theme only. All styling lives in `src/app/globals.css` as semantic classes (`.row`, `.shelf`, `.pill`, `.info-row`, …).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: Static JSON files in `/data`

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Data Structure

All data lives in the `/data` directory:

```
data/
├── index.json           # Roster summary with all agents
├── categories.json      # 14 evaluation categories
├── tasks.json           # The published test per category (prompt, pass criteria, anchors) + benchmark version
├── agents.json          # Full agent data dump
└── agents/
    └── <slug>/
        ├── meta.json    # Agent metadata (site, tagline, icon, product_class, likely_applicable)
        ├── runs.json    # Logged tests; scores are derived from these (optional until first test)
        ├── opinion.json # Public opinion: per-quote, per-category sentiment (see below)
        ├── scores.json  # Fallback scores when no run exists for a category
        ├── feedback.json # Public feedback items
        └── summary.md   # Internal research notes (not rendered)
```

### Runs Schema

One record per test you run. The latest run per category is the score shown everywhere.

```typescript
[{
  id: string;               // any stable id
  category: string;         // key from categories.json
  date: "YYYY-MM-DD";
  score: number | "n/a";    // 1–10 against the anchors in tasks.json
  outcome: "pass" | "partial" | "fail" | "n/a";
  notes?: string;           // one line, shown next to the score
  evidence_url?: string;    // post, screenshot, transcript
}]
```

### Public opinion

The scorecard has a second view, **Public opinion**, built from the quotes. `data/agents/<slug>/opinion.json` records, for each quote, which categories it speaks to and how (`pos`, `neg`, `mixed`, `neutral`). It was produced by reading every non-founder quote (660 of 795) one at a time, not by an automated pass, and is marked `reviewed: false` until a human checks it.

```typescript
{
  classified_by: string;
  date: "YYYY-MM-DD";
  reviewed: boolean;
  quotes: { [quoteId: string]: { [categoryKey: string]: "pos" | "neg" | "mixed" | "neutral" } }
}
```

Rules: quotes tagged `founder` are excluded even if listed; quotes from vendor or team accounts, investors, and obvious coordinated promotion were skipped; general praise or complaints with no category ("it's amazing", "it's been flaky") are not counted, so the opinion view only reflects what people say about specific jobs. A category shows a net score `(pos − neg) / (pos + neg)` once it has at least 3 signed quotes; below that it shows the count. `mixed` counts as one positive and one negative. Opinion never feeds the benchmark score.

Derivation rules: latest run wins → `scores.json` value → for stretch products with a non-empty `likely_applicable` list, every other category is `"n/a"` → otherwise `null` (shown as —). Core and Endorsed means exclude N/A and nulls.

### Index Schema

```typescript
{
  updated: string;          // Last update date
  agent_count: number;      // Total agents
  feedback_count: number;   // Total feedback items
  confirmed: number;        // Confirmed agents count
  stretch: number;          // Stretch agents count
  agents: [{
    slug: string;           // URL-safe identifier
    name: string;           // Display name
    status: "confirmed" | "stretch";
    site: string | null;    // Product website
    feedback_count: number; // Feedback items for this agent
    public_signal: "low" | "medium" | "high" | "unknown" | null;
    tagline: string;        // One line, taken from the product's own site copy
    icon: string | null;    // "/logos/<slug>.png" (512px, in /public/logos) or null for a monogram
  }]
}
```

### Categories Schema

```typescript
[{
  key: string;              // Category identifier
  label: string;            // Human-readable label
  group: "core" | "endorsed";
}]
```

### Feedback Schema

```typescript
{
  id: string;
  agent: string;            // Agent slug
  quote: string;            // The actual feedback text
  author: string;           // @handle or username
  author_name: string;      // Display name if available
  date: string;             // ISO date
  url: string;              // Link to original source
  kind: "praise" | "complaint" | "use-case" | "bug" | "comparison" | "other";
  tags: string[];           // Topic tags
  source: string;           // Platform identifier
  collected_at: string;     // When feedback was collected
  notes: string;            // Internal notes
}
```

## Categories

### Core (7)
1. Carrying out an online task
2. Recommendation quality
3. Purchasing a product
4. Responding to emails
5. Proactive behavior
6. Running a routine
7. Third-party integrations

### Endorsed (7)
8. Memory
9. Personality
10. Phone calls
11. Multiplayer / groups
12. Chained tasks
13. Proactive restraint
14. Content creation / games

## Updating Data

1. **Log a test**: Append a run to `data/agents/<slug>/runs.json` (create the file if missing). The score, ranking and profile update on the next build.
2. **Add feedback**: Append to `data/agents/<slug>/feedback.json`
3. **Change a test**: Edit `data/tasks.json` and bump `version`
4. **Add new agent**: Create directory in `data/agents/` with meta.json, scores.json, feedback.json, and summary.md, then add it to `index.json`

### Logos and taglines

`public/logos/<slug>.png` are 512px normalized copies of each product's own icon (apple-touch-icon, manifest icon, or App Store icon). `tagline` in `meta.json` and `index.json` is pulled from the product's site metadata and lightly shortened. Agents without a verified product (`moves`, `sircle`, `personal-local`) have `icon: null` and render a letter monogram.

### Collecting quotes

`scripts/collect.mjs` pulls public posts about each assistant into `data/inbox/<source>/<slug>.json` for review; `merge` moves them into `feedback.json` and recounts `index.json`. Nothing is paraphrased and nothing lands in `feedback.json` without the merge step. Per-assistant queries, handles, App Store ids and Product Hunt slugs live in `data/sources.json`.

| Command | Source | Needs |
|---|---|---|
| `npm run collect:x -- --slug instinct --since 2026-06-01 --window 7` | x.com advanced search, one query per date window so no window hits the result cap | `X_AUTH_TOKEN` + `X_CT0` cookies from a logged-in session, Chrome. Against X's terms; go slowly. |
| `npm run collect:reddit` | post search + every comment on matching threads | free script app (`REDDIT_CLIENT_ID`/`SECRET`), or a home IP |
| `npm run collect:hn` | Hacker News comments and stories (Algolia) | nothing |
| `npm run collect:appstore` | App Store reviews, rating mapped to praise/complaint | app ids in `sources.json` (`collect:find-apps` suggests them) |
| `npm run collect:producthunt` | launch-page comments | `PRODUCT_HUNT_TOKEN`, `ph_slug` in `sources.json` |
| `npm run collect:merge -- --slug instinct --source hn` | inbox → `feedback.json` → reindex | review the inbox first |

Collected records carry `tags: ["auto", "<source>", ...]`, `kind: "other"` (App Store reviews use the star rating), and a `vendor` tag when the author is one of the product's own handles, so the founder/vendor exclusion still applies downstream.

### Your own threads as evidence (iMessage)

`scripts/imessage.mjs` reads the Messages database on your Mac and turns your one-to-one threads with the assistants into benchmark evidence. Needs Node 22.13+ and Full Disk Access for your terminal; nothing else to install.

```bash
npm run imessage:export -- --slug poke      # transcripts -> data/agents/poke/transcripts/ (private, gitignored)
npm run imessage:analyze -- --slug poke     # usage.json (public counts + reply latency) and runs.draft.json (private)
# open runs.draft.json: set score 1-10 and outcome pass|partial|fail on real tests, fix the category guess if needed
npm run imessage:approve -- --slug poke     # -> runs.json + evidence/<id>.json (public: category, date, timings; no message text)
node scripts/imessage.mjs discover          # lists every one-to-one thread so you can map numbers to slugs
```

Each assistant's number goes in `imessage_handles` in `data/sources.json`. Group chats are never exported. `analyze` splits the thread into episodes (one per task you started, or one the assistant started unprompted), guesses the rubric category from the wording, and records objective signals: first-reply time, turns, whether it said "done", whether it said it couldn't. Scores stay yours. Message text is never published by default: the evidence page at `/agents/<slug>/evidence/<id>` shows the category, date, score, and timings only. `approve --publish-excerpts` opts in to a redacted excerpt (emails, phones, addresses, card and confirmation numbers, links, names in `_redact_terms` masked). Each run carries `protocol`: `task` when you sent the published prompt, `observed` when it was a real-life episode scored after the fact; the site labels both. **Speed** in the scorecard is the median reply time from your thread, measured rather than judged, on a 15s / 45s / 2m / 5m ramp.

### Feedback Curation Rules

- All feedback must be sourced from public discussions (X/Twitter, Reddit, etc.)
- Include source URL for verification
- Do not fabricate or paraphrase quotes
- Maintain kind labels: praise, complaint, use-case, bug, comparison, other

## Request form

`POST /api/request` turns each "Request a test" submission into a GitHub issue labeled `request` (the queue) and an email (the alert). Both are best-effort; without the env vars it just logs. Set in Vercel:

| Var | Purpose |
|---|---|
| `GITHUB_TOKEN` | fine-grained token, Issues: read/write on the repo |
| `GITHUB_REPO` | default `dpawlan/ai-assistant-benchmark` |
| `RESEND_API_KEY` | resend.com; free tier sends from `onboarding@resend.dev` until you verify a domain and set `RESEND_FROM` |
| `REQUEST_TO` | default `davidmpawlan@gmail.com` |

The form has a hidden honeypot field and a 5-per-10-minutes-per-IP limit.

## Deployment

The site is optimized for static generation:

```bash
npm run build
```

Recommended: Deploy to Vercel for optimal Next.js performance.

## License

MIT

---

Built with Next.js and Tailwind CSS. Source data imported from the feedback vault.
