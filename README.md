# AI Assistant Benchmark

Public scorecard for AI personal assistants — Wirecutter/RTINGS-style comparison with consistent metrics across every product. Real user feedback, no sponsored rankings.

## Overview

This is an independent, evidence-based comparison site for AI personal assistants. Every assistant is evaluated across the same 14 categories, ensuring fair comparisons regardless of the tool's specialty.

### Features

- **Leaderboard**: Filterable list of 40+ AI assistants with search, status filtering, and sorting
- **Agent Profiles**: Detailed pages with score matrices across 14 categories and curated public feedback
- **Categories Guide**: Explanation of all scoring categories (7 core + 7 endorsed)
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
├── index.json       # Roster summary and metadata
├── categories.json  # 14 evaluation categories
└── agents.json      # Full agent data with scores and feedback
```

### Updating Data

1. **Add a new agent**: Add an entry to `data/agents.json` with the required schema
2. **Update scores**: Modify the `scores` object for any agent (values: `null` = not tested, `"n/a"` = not applicable, `1-10` = score)
3. **Add feedback**: Append to the `feedback` array with source attribution

### Agent Schema

```typescript
{
  slug: string;           // URL-safe identifier
  name: string;           // Display name
  vendor: string;         // Company name
  url: string;            // Product website
  status: "confirmed" | "stretch";
  description: string;    // Short description
  scores: {
    scheduling: number | null | "n/a";
    // ... 13 more categories
  };
  summary: string;        // Longer summary
  feedback: [{
    id: string;
    type: "praise" | "complaint" | "use-case";
    text: string;
    author: string;
    source: string;
    sourceUrl: string;
    date: string;
  }]
}
```

### Scoring Guidelines

- **null**: Category not yet tested
- **"n/a"**: Category not applicable (used for stretch products)
- **1-10**: Performance score based on testing and feedback

## Categories

### Core (7)
1. Scheduling & Calendar
2. Email Management
3. Research & Information
4. Writing & Editing
5. Task Management
6. Communication
7. App Integration

### Endorsed (7)
8. Coding Assistance
9. Data Analysis
10. Travel Planning
11. Shopping & Commerce
12. Health & Wellness
13. Personal Finance
14. Voice Interface

## Deployment

The site is optimized for static export and can be deployed to any static hosting platform:

```bash
npm run build
```

Recommended: Deploy to Vercel for optimal Next.js performance.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add or update data following the schema
4. Submit a pull request with description of changes

### Feedback Curation Rules

- All feedback must be sourced from public discussions (Twitter/X, Reddit, LinkedIn, ProductHunt, etc.)
- Include source URL for verification
- Do not fabricate or paraphrase quotes
- Maintain a balanced mix of praise, complaints, and use cases

## License

MIT

---

Built with Next.js and Tailwind CSS. Designed to help people choose the right AI assistant for their needs.
