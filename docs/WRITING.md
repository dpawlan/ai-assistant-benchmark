# Writing reports, updates and articles

Everything editorial lives as markdown under `data/`. No CMS. Edit the file, commit, and the build renders it.

## Reports: `data/reports/<key>/index.md`

`<key>` becomes the URL, `/reports/<key>`. Frontmatter:

```
---
title: The best AI assistant for shopping
question: Which assistant should buy things for you?
dimension: purchasing            # a category id from data/categories.json
published: 2026-09-10
updated: 2026-09-22              # bump this whenever you add an update
author: david-pawlan             # slug from data/authors.json
cover_tint: "#e8f1ff"
cover_agents: muse, instinct, tomo, grok-bot   # first is drawn largest on the cover
picks:
  - muse | Our pick | One sentence on why.
  - instinct | Runner-up | One sentence on why.
  - tomo | Also good | One sentence on why.
---
```

Body, in this order (any `##` heading not listed below is rendered as written, where it appears):

```
Intro paragraphs before the first heading. The first one is the excerpt on cards.

## Who this is for
## How we tested
## Our pick: Muse                 # "<Label>: <Assistant name>" makes a pick section
...
### Flaws but not dealbreakers    # optional, a bullet list
- ...
## Runner-up: Instinct
## The competition
### Tomo                          # one ### per assistant, by name; links to the head to head
### Grok Bot
## What to look forward to
```

Assistant names must match `name` in the roster. Inline markdown works: `**bold**`, `*italic*`, `[text](/path)`. A line starting with `> ` becomes a pull quote.

## Updates: `data/reports/<key>/updates/<slug>.md`

One file per change to a report. `<slug>` becomes `/reports/<key>/updates/<slug>`.

```
---
title: Muse adds PayPal and Shopify checkout
date: 2026-09-22
runs: muse-2026-09-22-abc123, instinct-2026-09-22-def456   # run ids from runs.json; rendered as evidence chips
agents: muse, instinct          # the update shows on every head to head between these
---

What shipped, what we re-ran, what moved. Short and factual; no thesis.
```

Updates are the receipts. Every change to a pick, a section or a score in a report gets one, and the report's `updated` date moves with it.

## Articles: `data/articles/<slug>.md`

Signed pieces with a thesis. `<slug>` becomes `/articles/<slug>`.

```
---
title: Muse just solved the card problem
dek: One or two sentences under the headline.
date: 2026-09-22
author: David Pawlan             # must match name in data/authors.json
kind: Analysis                   # or "From the editor", "Opinion", "Field notes"
report: shopping                 # optional; the report this piece belongs to
update: muse-adds-paypal-and-shopify-checkout   # optional; the update it grew out of
agents: muse, instinct, grok-bot # shows the piece on those head to heads
hero: /articles/muse-card.jpg    # optional; without it a cover is composed from `agents`
hero_caption: Caption and credit under the hero.
takeaways: First point | Second point | Third point   # "The short version" box
---

Body in markdown. `##` for section headings, `> ` for a pull quote.
```

## Authors: `data/authors.json`

Name, role, bio, three trust lines, photo under `public/authors/`, links. Bylines link to `/authors/<slug>`.

## Rules

- Reports hold the verdict. Articles may argue with it, explain it or predict the next one, but a reader must never need an article to know the pick.
- Every claim in a report traces to a run in `runs.json`. Cite the run id in the update.
- Nothing in a report is sponsored. If money is ever involved it is an article, labelled as such.
- Remove `preview: true` from frontmatter when a piece is real; it prints the yellow banner.
