# Handoff notes for a Claude Code session on David's Mac

Read this first. It is the context a cloud session built up while doing the redesign, benchmark layer, public-opinion view and the collection scripts. The README covers *what* exists; this covers *how David wants it worked on*.

## Non-negotiables

- **Never invent scores or quotes.** Benchmark scores come only from `runs.json`, which only `scripts/imessage.mjs approve` or David writes. Public quotes are verbatim. Do not create fixture runs in the real data tree; David was alarmed once when he saw fake numbers mid-session.
- **Message text is not published.** Transcripts and `runs.draft.json` are private (gitignored). `usage.json` and `evidence/*.json` are public and carry only category, date, protocol and timing signals. `approve --publish-excerpts` is opt-in and still redacts; David said he does not want his actual messages on the site.
- **Speed is a measured metric, not a rubric category.** Median reply time from the reviewer's thread; shown as its own scorecard column. Don't add it to the 14 categories.
- **Founder and vendor posts are excluded** from public opinion. Opinion cells show share-of-positive, never a fake 1–10.
- David gives short instructions ("go for it") and wants work done without check-ins, but wants the evidence behind any number he questions.

## The iMessage workflow (why you're here)

```bash
node scripts/imessage.mjs discover --since 2026-01-01   # every 1:1 thread: number, Contacts name, count, first message
# map assistant threads -> data/sources.json agents.<slug>.imessage_handles (phone, email or urn:biz:... string)
npm run imessage:export                                  # -> data/agents/<slug>/transcripts/messages.json (private)
npm run imessage:analyze                                 # -> usage.json (public) + runs.draft.json (private)
# David scores the drafts: score 1-10 + outcome pass|partial|fail; fix category guesses
npm run imessage:approve                                 # -> runs.json + evidence/<id>.json (public)
npm run build
```

Known mapping hints: the Town thread is saved in Contacts as **DEEPS**. Instinct issues each user a personal number. Poke (and probably Town) use Apple Messages for Business, so their handle is `urn:biz:<uuid>`, not a phone number. Ten numbers already in `sources.json` came from imessage.store's listing and may be stale; trust `discover`.

Needs Full Disk Access for the terminal and Node 22.13+ (built-in SQLite). If `discover` prints nothing, it's Full Disk Access.

## Open decisions (David's, not yours)

- Instinct's public opinion reads ~62% positive (privacy backlash thread + Reddit outage posts). Options on the table: count outage/status posts as neutral, or leave as is.
- Whether to run `scripts/collect.mjs x` (needs his x.com cookies; against X's terms) and Reddit (needs a home IP or a free script app).
- App Store ids and Product Hunt slugs in `data/sources.json` are mostly unfilled.

## Peer groups

Every agent has `kind` in `meta.json` and `index.json` (general | travel | email | shopping | games | work | infra; labels in `src/lib/kinds.ts`). The scorecard filters by it (chips, `?kind=`), General is the default, and rankings are within a group. `status` (confirmed/stretch) still exists in data and drives N/A pre-fill for stretch products, but it is no longer shown anywhere.

## Layout reminders

Design system is imessage.store's: system font, seven color tokens, sidebar + hairline rows, one blue accent. Light only. All styling in `src/app/globals.css`. Scorecard matrix is `src/components/Matrix.tsx`; opinion math is in `src/lib/data.ts` (`deriveOpinion`) and `src/lib/score.ts`.

## Grok Bot first-party chats

Grok Bot row evidence can also come from box agent chats (`source: grok-bot-chats` in `data/agents/grok-bot/usage.json`), built with `scripts/grokbot.mjs` / the box analyzer. Same privacy rules as iMessage: no message text in git; only usage, runs, and signals-only evidence JSON.
