# AI agent feedback vault

Living repo of real public feedback + use-case scores for David Pawlan’s assistant breakdown.

**Long-term:** feeds an **assistant benchmark site** that ranks / breaks down each product by use case. Core personal text PAs get full reviews; stretch products (voice, desktop, hardware, team builders, infra) stay on the board and simply score **N/A** on categories that don’t apply.

Social drafting is paused while this is active.

## Layout

- `SCHEMA.md` — `meta.json`, `feedback.jsonl`, `summary.md`, `scores.json`
- `CATEGORIES.md` — shared evaluation rubric + N/A scoring rules
- `INDEX.md` — roster table (`confirmed` vs `stretch`)
- `agents/<slug>/` — per-agent meta, feedback, summary, scores

## Status

- `confirmed` — in the core review set (personal text / messaging PA, or deliberate override like Halo)
- `stretch` — still listed for the benchmark site; expect mostly N/A when scoring

## Scoring

Each agent has `scores.json` with placeholders for every key in `CATEGORIES.md`.
Use `null` until tested, `"n/a"` when the use case doesn’t apply, never invent scores or feedback quotes.
