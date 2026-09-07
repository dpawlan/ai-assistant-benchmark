# Evaluation categories (shared rubric)

Source thread: [David Pawlan — categories post](https://x.com/DavidPawlan/status/2096597589164532121) (2026-09-06).  
Use these keys in `agents/<slug>/scores.json`. Scores are filled later; this file is the shared rubric only.

## Core (David’s seven)

| Key | Label | What to test |
|-----|-------|--------------|
| `online_task` | Carrying out an online task | Completes a real browser/web workflow end to end (not just advice). |
| `recommendation_quality` | Recommendation quality | Relevance, taste, constraint-following when suggesting options. |
| `purchasing` | Purchasing a product | Finds, compares, and completes (or correctly stages) a purchase. |
| `email_replies` | Responding to emails | Drafts/sends replies in voice, with correct context and recipients. |
| `proactive_behavior` | Proactive behavior | Acts or nudges usefully without being asked every step. |
| `running_routine` | Running a routine | Reliable scheduled / recurring work. |
| `third_party_integrations` | Third-party integrations | Uses connected tools (calendar, inbox, Notion, etc.) correctly. |

## Endorsed additions (from thread replies David affirmed)

| Key | Label | Thread signal |
|-----|-------|---------------|
| `memory` | Memory | @ConnorWaslo; David: “Ya memory is huge”. |
| `personality` | Personality | Same thread; David: “personality as well so hard to nail”. |
| `phone_calls` | Phone calls | @therealnirs tasks; David: “Phone call is massive”. |
| `multiplayer_groups` | Multiplayer / groups | @ebeezy_eth; David: “Multiplayer for sure”. |
| `chained_tasks` | Chained tasks | @RoyNasser flight check-in chain; David: “def important to test”. |
| `proactive_restraint` | Proactive restraint | @adriankxyz (act before you knew *and* know when not to); David: “Exactly the idea”. |
| `content_creation_games` | Content creation / games | @ebeezy_eth (images, video, games); David: “Games is interesting”. |

## Concrete example tasks (from the thread)

Use these as shared prompts where they fit a category — do not invent quotes beyond the thread.

| Example | Suggested primary category keys |
|---------|----------------------------------|
| Book a hotel stay (rates + UI) | `online_task`, `purchasing`, `recommendation_quality` |
| Schedule a meeting with an external guest | `online_task`, `email_replies`, `third_party_integrations` |
| Set a reminder | `running_routine`, `online_task` |
| Live phone-call briefing | `phone_calls`, `proactive_behavior` |
| Call a business and get an answer to a question | `phone_calls`, `online_task` |
| Text a coworker with a request | `online_task`, `third_party_integrations`, `multiplayer_groups` |
| Call a family member and wish them something sweet on your behalf | `phone_calls`, `personality` |
| Flight check-in chain (find flight in email → passport in Drive/Dropbox → airline check-in) | `chained_tasks`, `email_replies`, `third_party_integrations`, `online_task` |
| Act before the user knew they needed it — and know when **not** to | `proactive_behavior`, `proactive_restraint` |

## Scoring notes

- Leave numeric scores `null` until David fills them in.
- Prefer the same task wording across agents for comparability.
- Real feedback quotes stay in `feedback.jsonl` only — never invent them here.


## Scoring values

| Value | Meaning |
|-------|---------|
| `null` | Not tested yet |
| `"n/a"` | Not applicable for this product (stretch / specialty — out of scope for that use case) |
| number (or agreed score type) | Tested score — fill only after real review |

Long-term: this vault feeds an **assistant benchmark site** that breaks products down by use case. Stretch products stay listed; they simply show N/A on most personal text-PA categories.
