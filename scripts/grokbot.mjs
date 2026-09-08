#!/usr/bin/env node
/**
 * Build first-party benchmark evidence for the grok-bot row from Grok Bot agent chats.
 *
 * Mirror of scripts/imessage.mjs analyze/approve flow, but sourced from box agent stores
 * instead of macOS Messages chat.db.
 *
 * Typical layout on the box:
 *   /home/box/agent-data/agents/<agentId>/store.db
 *     table transcript_entries(seq, id, entry)  — entry is JSON
 *   /home/box/agent-data/agent-transcripts/<agentId>/<agentId>.jsonl
 *     optional; {role,message} lines (timestamps may appear as <timestamp>…</timestamp>)
 *
 * Entry kinds used:
 *   - kind=message, role=user          → from "me"
 *   - kind=send-message, type=text     → from "agent" (user-visible reply)
 *   - kind=send-message, type=widget   → optional agent prompt text
 * Skip: spend-initiation, events, connectors, approvals, toAgent routing, tool dumps.
 *
 * Episode split / latency / unanswered / proactive / CATEGORY_WORDS match imessage.mjs:
 *   IDLE 45m, UNANSWERED 10m, PROACTIVE gap 6h, min category confidence 0.34
 *   (clear done/cant/unanswered signals may keep down to ~0.20).
 *
 * Public artifacts (NO message text, NO excerpt field):
 *   data/agents/grok-bot/usage.json
 *   data/agents/grok-bot/runs.json
 *   data/agents/grok-bot/evidence/<id>.json
 *
 * Private (gitignored / never push):
 *   runs.draft.json with redacted excerpts for human review
 *
 * Usage (from repo root, with agent-data available):
 *   node scripts/grokbot.mjs analyze   # writes usage + drafts + scored runs/evidence
 *   node scripts/grokbot.mjs status
 *
 * Scoring heuristic (documented in each run notes as "auto: signals-based; source=<agentName>"):
 *   pass  = agent_said_done && !agent_said_cant
 *   fail  = agent_said_cant || (my_messages>=1 && agent_messages==0)
 *   else  = partial
 *   score 8–10 pass+fast+few turns; 6–7 pass with friction; 4–5 partial; 2–4 fail
 *
 * Prefer fewer high-confidence episodes (~80 cap) over flooding with weak ones.
 * Protocol is almost always "observed" for these chats.
 *
 * Privacy: never publish personal names (beyond agent product names), emails, phones,
 * addresses, or raw transcripts. Redact before any private draft excerpt.
 *
 * This file documents the pipeline; the production one-shot analyzer used for the
 * initial grok-bot evidence dump lived at /workspace/grokbot-private/analyze_grokbot.py
 * on the box. Port that logic here (or call it) when re-running from a fresh checkout.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'data', 'agents', 'grok-bot');

function status() {
  const usage = read(path.join(OUT, 'usage.json'));
  const runs = read(path.join(OUT, 'runs.json'), []);
  const evidence = fs.existsSync(path.join(OUT, 'evidence'))
    ? fs.readdirSync(path.join(OUT, 'evidence')).filter(f => f.endsWith('.json')).length
    : 0;
  console.log('grok-bot evidence status');
  console.log(`  usage: ${usage ? `${usage.messages} msgs, median_reply_s=${usage.median_reply_s}, days=${usage.days_active}, source=${usage.source}` : 'missing'}`);
  console.log(`  runs: ${runs.length}`);
  console.log(`  evidence files: ${evidence}`);
  if (usage?.agents_included) console.log(`  agents_included: ${usage.agents_included.join(', ')}`);
}

function analyze() {
  console.error(`
scripts/grokbot.mjs analyze expects box agent stores at:
  /home/box/agent-data/agents/<id>/store.db

Re-run the Python analyzer on the box (keeps private drafts out of git):
  python3 /workspace/grokbot-private/analyze_grokbot.py

Then copy ONLY public outputs into this repo:
  data/agents/grok-bot/usage.json
  data/agents/grok-bot/runs.json
  data/agents/grok-bot/evidence/*.json

Do NOT commit /workspace/grokbot-private/ or any excerpt-bearing drafts.
`.trim());
  process.exit(1);
}

function read(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

const cmd = process.argv[2] || 'status';
if (cmd === 'status') status();
else if (cmd === 'analyze') analyze();
else {
  console.error('Usage: node scripts/grokbot.mjs [status|analyze]');
  process.exit(1);
}

export { status };
