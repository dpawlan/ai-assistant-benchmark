# AI Assistant Benchmark

Public scorecard for AI personal assistants — Wirecutter/RTINGS-style comparison with consistent metrics across every product. Real user feedback, no sponsored rankings.

## Overview

This is an independent, evidence-based comparison site for AI personal assistants. Every assistant is evaluated across the same 14 categories, ensuring fair comparisons regardless of the tool's specialty.

### Current Data

- **40 AI Assistants** (30 confirmed, 10 stretch)
- **795 Feedback Items** from public discussions (X/Twitter, Reddit, etc.)
- **14 Evaluation Categories** (7 core + 7 endorsed)

### Features

- **Leaderboard**: Filterable list of all AI assistants with search, status filtering, and sorting by feedback count or signal strength
- **Agent Profiles**: Detailed pages with score matrices across 14 categories and curated public feedback with source links
- **Categories Guide**: Explanation of all scoring categories
- **Request a Test**: Form to suggest new assistants for evaluation

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
├── agents.json          # Full agent data dump
└── agents/
    └── <slug>/
        ├── meta.json    # Agent metadata
        ├── scores.json  # Category scores
        ├── feedback.json # Public feedback items
        └── summary.md   # Agent summary
```

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

1. **Add feedback**: Append to `data/agents/<slug>/feedback.json`
2. **Update scores**: Modify `data/agents/<slug>/scores.json`
3. **Add new agent**: Create directory in `data/agents/` with meta.json, scores.json, feedback.json, and summary.md

### Feedback Curation Rules

- All feedback must be sourced from public discussions (X/Twitter, Reddit, etc.)
- Include source URL for verification
- Do not fabricate or paraphrase quotes
- Maintain kind labels: praise, complaint, use-case, bug, comparison, other

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
