# Amy identity handoff

Handoff for the **Amy Zinger** eval identity on `ai-assistant-benchmark` (amy worktree).  
Companion to `docs/HANDOFF.md` (David Mac / product notes). This file is about **who Amy is**, **what she has already tested**, and **what to do next**.

**Worktree:** `/home/autumn/src/ai-assistant-benchmark-amy` on odm001  
**Tracking:** [#294](https://github.com/dpawlan/ai-assistant-benchmark/issues/294) · PR [#329](https://github.com/dpawlan/ai-assistant-benchmark/pull/329)  
**Branch (open PR):** `town/amy-wave1-2026-09-16`  
**Owner bot:** Amy Zinger Eval (Grok Bot) · coordinate via Autumn COS

---

## Identity (locked)

| Field | Value |
|---|---|
| Display name | Amy Zinger |
| Birth year | 1980 |
| Gmail / Google OAuth | `amyzinger@moulder.me` |
| Phone | `+1 385-201-5820` (Tello eSIM on Autumn’s iPhone) |
| Town account | `amyzinger@moulder.me` (full access confirmed 2026-09-16) |
| Townie email | product-issued `@town.com` address (see Town Assistant settings) |
| Not for Amy OAuth | `assistantbencha@gmail.com` (other bench identity) |

**Channels Amy can use:** Telegram Web + WhatsApp Web on the box; iMessage/SMS on Autumn’s iPhone; email/web as product requires.

**Ops hard rules**

- Prefer Amy identity; never create accounts / spend without Autumn OK.
- Look-only until green-lit per target; local evidence after real episodes.
- Git push + draft PR need Autumn OK (Boski #128 / Brea #154 playbook).
- Never invent scores / quotes / fixture runs.
- Notes &lt;140 chars, third person; `npm run lint:notes`.
- Transcripts private; evidence signals-only.
- **Speed is mandatory** on every scored live episode (see below).

---

## Speed protocol (mandatory)

Every scored chat episode must capture first-reply timing.

- **Web / non-iMessage:** in-page `Date.now()` at send + `MutationObserver` on first **real** agent bubble (prefer ≥40 chars assistant text; ignore spinners/placeholders). Never Shell `date`, snapshot-poll deltas, or screenshot mtimes.
- **iMessage / SMS:** stamped `Me:` / agent lines for `node scripts/imessage.mjs import-text --slug &lt;slug&gt; --file …`.
- Contaminated stamps → leave Speed null and re-run timed; do not publish guesses.

---

## Target status

### Town (`town`) — **In progress** (Amy Wave 1)

| Item | Detail |
|---|---|
| Site | https://www.town.com/ |
| Primary channel (Amy) | **Web + Townie email** |
| Avoid | iMessage as primary; Slack (Autumn: no); WA/TG outbound (inbound-only) |
| PR | [#329](https://github.com/dpawlan/ai-assistant-benchmark/pull/329) — clearly labeled Amy Zinger |
| Issue | [#294](https://github.com/dpawlan/ai-assistant-benchmark/issues/294) — keep open until Wave 1 exit |

**Setup done**

- Signed in Web; timezone Mountain (Denver)
- Auto-inbox + Morning Briefing + Meeting Briefing enabled
- Google connected as `amyzinger@moulder.me` (Gmail/Calendar/Drive family)
- Phone connected: text Townie from `+1 385-201-5820`
- Hard rule saved: never send email or spend without asking

**Scored (Amy Wave 1, 2026-09-16)**

| Category | Score | Outcome | Notes |
|---|---|---|---|
| `recommendation_quality` | 8 | pass | Ferry Building dinner for 4; staged only |
| `content_creation_games` | 9 | pass | Maple birthday image + 90s trivia |
| `email_replies` | 8 | pass | Declined Thursday; two slots; draft only |
| `permissions_privacy` | 6 | partial | Rule honored; Google all-or-nothing; disconnect deferred |
| Speed (`usage.json`) | median **4s** | n=1 | `source: town-web-amy` timed web smoke |

**Created but not yet scored**

- `running_routine` — Morning Briefing Mon–Fri **7:00 AM America/Denver** (calendar + owed replies + weather). Saved without force-run. **Next-day fire check: Thu 2026-09-17 ~7:00–7:15 AM MT.**

**Private transcripts (gitignored)**

`data/agents/town/transcripts/` on the amy worktree (recommendation, content, privacy, email, routine, speed smokes).

**Exit to close #294**

1. Confirm Morning Briefing fired next day (enough for Wave 1 routine check; not five weekdays).
2. Disconnect Google (or document product limits) to finish privacy pack; bump score if warranted.
3. Autumn OK → merge #329 (or follow-up commit) and close #294 when Town Amy Wave 1 is accepted.
4. Landing **Completed** status only when every applicable dimension is scored or N/A — Wave 1 alone leaves Town **In progress**.

### Orchid (`orchid`) — **Paused**

- Wave 1 started (first contact + onboarding reply: America/Denver, Ferry Building SF hotel seed, hard rule).
- Google OAuth for Orchid **not** completed.
- Evidence path locked: iPhone iMessage/SMS + `import-text --slug orchid` (not Mac `imessage.mjs` live relay as primary).
- Resume only when Autumn unpauses. Do not continue Orchid while Town Wave 1 is active unless Autumn says so.

### Other slugs

No other Amy first-runs started from this bot yet. Boski / Brea / Site worktrees are **out of scope** for Amy Eval (separate bots).

---

## What to test next (priority)

1. **Town `running_routine` next-day fire** (Thu morning) — capture briefing contents; then score or N/A with evidence.
2. **Town Google disconnect** after briefing — finish `permissions_privacy` story; optional score revision.
3. **More Town Speed samples** (n&gt;1) with the same in-page harness so median isn’t a single smoke.
4. **Town Wave 2+** (only after Autumn green-light): e.g. `online_task` / `travel` **stage-only**, `proactive_behavior`, `proactive_restraint`, `memory`, `chained_tasks` — skip or limit spend categories unless Autumn OK.
5. **Orchid resume** (when unpaused): continue Wave 1 with timing on iMessage imports.
6. **Next assigned slug** from Autumn COS — plan-only first, then green-light.

---

## Repo / PR conventions (Amy)

- Touch only `data/agents/&lt;slug&gt;/**` for the assistant under test (plus docs like this handoff when asked).
- Branch shape: `&lt;slug&gt;/amy-wave1-YYYY-MM-DD` or `&lt;slug&gt;/scores-YYYY-MM-DD`.
- PR title/body must say **Amy Zinger identity** and link #294 (or the tracking issue).
- Do not treat historical non-Amy `runs.json` rows as Amy evidence.
- `usage.json` for Amy Town web: `source: town-web-amy` (prior iMessage usage backed up locally as `usage.pre-amy-imessage-backup.json`, uncommitted).

---

## Quick commands

```bash
cd /home/autumn/src/ai-assistant-benchmark-amy
git status -sb
node scripts/lint-notes.mjs
# iMessage / SMS paste import (Orchid, etc.)
node scripts/imessage.mjs import-text --slug orchid --file path/to/transcript.txt
```

Issue comment when a Wave **starts**; close when Wave exit criteria met (for Town: see above).

---

_Last updated 2026-09-16 (MT) after Amy Town Wave 1 PR #329 and timed Speed smoke._
