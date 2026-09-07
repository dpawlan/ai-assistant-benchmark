# Feedback vault schema

Each agent lives in `agents/<slug>/`:
- `meta.json` — name, site, handles, status (`confirmed` \| `stretch`), optional `product_class`, `likely_applicable`, notes
- `feedback.jsonl` — one JSON object per line
- `summary.md` — rolling human summary of patterns
- `scores.json` — per-category scores (null until filled); keys match `CATEGORIES.md`

## feedback.jsonl fields

```json
{
  "id": "stable-hash-or-url",
  "agent": "instinct",
  "quote": "exact text",
  "author": "@handle or name",
  "author_name": "optional display",
  "date": "YYYY-MM-DD or ISO",
  "url": "https://x.com/...",
  "kind": "praise|complaint|use-case|bug|comparison|other",
  "tags": ["travel", "email", "proactive"],
  "source": "x|granola|david-post|web|other",
  "collected_at": "ISO datetime",
  "notes": "optional"
}
```

Rules: real quotes only; never invent. Deduplicate by `url` or `id`. Prefer primary posts over screenshots of screenshots.

## scores.json

Object whose keys are the category ids in `CATEGORIES.md` (core + endorsed). Values are `null` (untested), `"n/a"` (out of scope for this product), or a number/agreed score once David fills them in after real review. Stretch/specialty agents will be mostly `"n/a"` across text-PA categories.

```json
{
  "online_task": null,
  "recommendation_quality": null,
  "purchasing": null,
  "email_replies": null,
  "proactive_behavior": null,
  "running_routine": null,
  "third_party_integrations": null,
  "memory": null,
  "personality": null,
  "phone_calls": null,
  "multiplayer_groups": null,
  "chained_tasks": null,
  "proactive_restraint": null,
  "content_creation_games": null
}
```

Do not invent scores. Shared example tasks and rubric live in `CATEGORIES.md` (source: https://x.com/DavidPawlan/status/2096597589164532121).
