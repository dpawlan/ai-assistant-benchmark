---
name: contribute-runs
description: Contribute your own conversations with an AI assistant to the Assistant Benchmark (assistantbenchmark.com) as scored test runs. Use when someone wants to add their iMessage, WhatsApp or in-app threads with an assistant like Poke, Instinct, Muse or Catch to the public benchmark. Everything runs on their machine; only redacted excerpts and timing stats are sent, never the transcript, and nothing is published until a maintainer reviews it.
---

# Contribute runs to the Assistant Benchmark

You are helping a person contribute evidence from their own conversations with an AI assistant to a public benchmark. The person stays in control at every step. Follow the steps in order and never skip a consent step.

## What this does and does not do

- It reads one-to-one threads with **assistants** (never with people) from Messages on this Mac, or from a WhatsApp or Telegram export the person provides.
- It redacts them locally, splits them into episodes, matches episodes to the benchmark's published tests, and proposes scores.
- It sends a **bundle**: draft runs with timing signals and redacted excerpts, reply-time stats, the person's handle and a disclosure. **The transcript never leaves the machine.**
- A maintainer reviews every run against the published rubric before anything appears on the site. The person cannot publish or set scores.

## Requirements

- macOS with the Messages history for iMessage or SMS threads (WhatsApp and Telegram work from an export file on any OS).
- Node 22.13 or newer (`node --version`). No packages to install.
- For Messages: the terminal needs Full Disk Access (System Settings, Privacy & Security, Full Disk Access). Tell the person to grant it and restart the terminal if the export fails with a permissions error.
- `git` to fetch the benchmark repository.

## Steps

### 1. Get the benchmark tooling

```
git clone --depth 1 https://github.com/dpawlan/ai-assistant-benchmark.git assistant-benchmark
cd assistant-benchmark
```

All commands below run from that directory. Do not run `npm install`; the scripts need nothing beyond Node.

### 2. Find the threads

```
node scripts/imessage.mjs discover --since 2026-01-01
```

This lists one-to-one threads. The `mapped` column shows which assistant a number belongs to. Show the person the rows that map to an assistant and ask which ones to contribute. If a thread is with an assistant that is not mapped, ask the person which assistant it is and check the roster in `data/index.json`; if the assistant is on the roster, add its number to `imessage_handles` for that slug in `data/sources.json` before exporting. Never map a thread with a person.

For WhatsApp: the person exports the chat from WhatsApp ("Export chat", without media) and gives you the `_chat.txt`. Then:

```
node scripts/imessage.mjs import-whatsapp --slug <slug> --file <path to _chat.txt>
```

For an assistant that lives in its own app: the person copies the conversation as text with dates into a file, then `node scripts/imessage.mjs import-text --slug <slug> --file <file> --date YYYY-MM-DD`.

### 3. Export and analyze, one assistant at a time

```
node scripts/imessage.mjs export --slug <slug>
node scripts/imessage.mjs analyze --slug <slug>
```

`analyze` writes `data/agents/<slug>/runs.draft.json` (episodes with redacted excerpts, one per candidate test) and `data/agents/<slug>/usage.json` (reply-time stats). If it reports zero drafts, the thread has no episodes that match a published test; tell the person and stop for that assistant.

### 4. Review the drafts with the person

Open `runs.draft.json`. For each draft, show the person the category it was matched to and the excerpt. Compare against the published tests in `data/tasks.json` and:

- Correct `category` when the guess is wrong, and set `protocol` to `task` if the person used the published prompt or `observed` if it was normal use.
- Set `skip: true` on any draft that is not really a test or that the person does not want to share.
- Propose a `score` from 1 to 10 and an `outcome` (`pass`, `partial`, `fail`) using the rubric and anchors in `data/tasks.json`. Explain your reasoning in one line. These are proposals; the maintainer decides.
- Write `notes` as one public sentence, under 140 characters, describing what was asked and what the assistant did. No names, numbers, addresses or account details.
- Read each excerpt for anything the redaction missed: people's names, meeting titles, flight numbers, employers, health or money details. The redaction strips emails, phone numbers, cards and links, not names. Replace such text in the excerpt with `[name]` or the like, or set `skip: true` on the draft. The person decides; when in doubt, skip.

### 5. Build the bundle and show exactly what will be sent

```
node scripts/contribute.mjs bundle --slug <slug> --handle @<their X or GitHub handle> --disclosure "<see below>" --comped "<none, or which assistants gave a free account>"
node scripts/contribute.mjs preview --file contrib/<slug>-<handle>.json
```

The disclosure must be true. The default is "I do not work for, invest in or advise any assistant on the roster." If the person does have a tie to an assistant, say so in the disclosure; the contribution is still welcome and will be labelled.

Walk the person through the preview. It is the complete content of what will be sent. Ask for an explicit yes.

### 6. Submit

```
node scripts/contribute.mjs submit --file contrib/<slug>-<handle>.json
```

Repeat steps 3 to 6 for each assistant. Tell the person that each run is reviewed before publishing and that approved runs appear on the assistant's profile with "Run by @handle" on the evidence page.

## Rules

- Never export or bundle a thread with a person. Only mapped assistant numbers.
- Never submit without showing the preview and getting a yes.
- Never edit excerpts to make an assistant look better or worse. Correct categories and propose scores; do not rewrite evidence.
- If Full Disk Access is missing, `export` fails with a permissions error. Do not try to work around it by copying system files; ask the person to grant access.
- Delete `contrib/` and `data/agents/*/transcripts/` when done if the person asks; they are local files under their control.
