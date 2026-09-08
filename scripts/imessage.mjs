#!/usr/bin/env node
/**
 * Turn your own iMessage threads with the assistants into benchmark evidence.
 *
 *   node scripts/imessage.mjs export   [--db ~/Library/Messages/chat.db] [--slug poke,town] [--since 2026-01-01]
 *   node scripts/imessage.mjs analyze  [--slug ...] [--all]      usage stats + draft runs, redacted
 *   node scripts/imessage.mjs approve  [--slug ...]              drafts you've scored -> runs.json + public evidence
 *   node scripts/imessage.mjs status
 *   node scripts/imessage.mjs discover [--db ...] [--since ...]   list one-to-one threads so you can map numbers to slugs
 *
 * Runs on the Mac that has your Messages history. Terminal needs Full Disk Access
 * (System Settings > Privacy & Security > Full Disk Access). Needs Node 22.13+ (built-in SQLite, no installs).
 *
 * What stays private (gitignored): data/agents/<slug>/transcripts/ and runs.draft.json.
 * What gets published: data/agents/<slug>/usage.json (counts and latencies) and, once you approve a draft,
 * data/agents/<slug>/evidence/<id>.json (the redacted excerpt for that one test) plus the run in runs.json.
 *
 * Every excerpt is redacted before it leaves the transcripts folder: emails, phone numbers, street addresses,
 * card numbers, long digit runs, confirmation codes, URLs (kept as their domain), and any names listed under
 * `_redact_terms` in data/sources.json. Group chats with humans are never exported.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const APPLE_EPOCH_MS = 978307200000;

/* ---------- CLI ---------- */

const opts = {};
let sources = {};
let redactTerms = [];
let slugs = [];

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = rest[i + 1];
    if (next === undefined || next.startsWith('--')) opts[key] = true;
    else {
      opts[key] = next;
      i++;
    }
  }
  return cmd;
}

async function main() {
  const cmd = parseArgs(process.argv.slice(2));
  const commands = { export: exportChats, analyze, approve, status, discover };
  if (!commands[cmd]) {
    console.error(fs.readFileSync(new URL(import.meta.url)).toString().split('*/')[0].replace('/**', '').replace(/^ \* ?/gm, ''));
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(path.join(DATA, 'sources.json'), 'utf-8'));
  sources = cfg.agents;
  redactTerms = cfg._redact_terms ?? [];
  slugs = opts.slug ? String(opts.slug).split(',') : Object.keys(sources);
  for (const s of slugs) if (!sources[s]) fail(`Unknown slug "${s}". Add it to data/sources.json.`);
  await commands[cmd]();
}

function fail(msg) {
  console.error(`\n${msg}\n`);
  process.exit(1);
}

/* ---------- Paths and small helpers ---------- */

const agentDir = slug => path.join(DATA, 'agents', slug);
const transcriptFile = slug => path.join(agentDir(slug), 'transcripts', 'messages.json');
const usageFile = slug => path.join(agentDir(slug), 'usage.json');
const draftFile = slug => path.join(agentDir(slug), 'runs.draft.json');
const runsFile = slug => path.join(agentDir(slug), 'runs.json');
const evidenceDir = slug => path.join(agentDir(slug), 'evidence');

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

/**
 * Phone numbers compare by their last ten digits; emails and Apple Messages for Business ids
 * (`urn:biz:<uuid>`, used by Poke and others) by lowercase string.
 */
export function normalizeHandle(h) {
  const s = String(h ?? '').trim().toLowerCase();
  if (s.includes('@') || s.startsWith('urn:')) return s;
  const digits = s.replace(/\D/g, '');
  return digits.slice(-10);
}

/** Messages store dates as nanoseconds (or, on old exports, seconds) since 2001-01-01. */
export function appleDateToMs(d) {
  const n = Number(d); // BigInt from node:sqlite is fine here; the precision loss is sub-millisecond
  if (!n) return 0;
  const ms = n > 1e14 ? n / 1e6 : n > 1e11 ? n / 1e3 : n * 1000;
  return Math.round(ms + APPLE_EPOCH_MS);
}

/**
 * Pull the text out of a typedstream `attributedBody` blob. Newer macOS versions leave `message.text` NULL
 * and store the string here: after the NSString class marker comes 0x2B, a length (1, 2 or 4 bytes), then UTF-8.
 */
export function decodeAttributedBody(buf) {
  if (!buf || !buf.length) return null;
  const b = Buffer.from(buf);
  const marker = b.indexOf('NSString');
  if (marker < 0) return null;
  const plus = b.indexOf(0x2b, marker);
  if (plus < 0 || plus - marker > 40) return null;
  let i = plus + 1;
  let len = b[i];
  if (len === 0x81) {
    len = b.readUInt16LE(i + 1);
    i += 3;
  } else if (len === 0x82) {
    len = b.readUInt32LE(i + 1);
    i += 5;
  } else {
    i += 1;
  }
  const text = b.subarray(i, i + len).toString('utf8');
  return text.replace(/￼/g, '').trim() || null;
}

/* ---------- Redaction ---------- */

const STREET = '(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|way|ct|court|pl|place|hwy|highway|pkwy|parkway|ter|terrace|cir|circle)';

/** Mask anything that identifies a person, place, account or payment. Amounts, dates and times are kept for context. */
export function redact(text, extraTerms = []) {
  let t = String(text ?? '');
  t = t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]');
  t = t.replace(/https?:\/\/([^\s/]+)[^\s]*/gi, (_, host) => `[link: ${host.replace(/^www\./, '')}]`);
  t = t.replace(/\b\d(?:[ -]?\d){12,18}\b/g, '[card]');
  t = t.replace(/(?:\+?1[ -.]?)?\(?\b\d{3}\)?[ -.]?\d{3}[ -.]?\d{4}\b/g, '[phone]');
  t = t.replace(new RegExp(`\\b\\d{1,6}\\s+(?:[A-Za-z0-9'.-]+\\s){1,4}${STREET}\\b\\.?(?:,?\\s*(?:apt|suite|unit|#)\\s*[\\w-]+)?`, 'gi'), '[address]');
  t = t.replace(/\b\d{5}(?:-\d{4})?\b/g, '[zip]');
  t = t.replace(/\b(?=[A-Z0-9-]*\d)(?=[A-Z0-9-]*[A-Z])[A-Z0-9]{6,10}\b/g, '[code]');
  t = t.replace(/\b\d{6,}\b/g, '[number]');
  for (const term of extraTerms) {
    if (!term) continue;
    t = t.replace(new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), '[name]');
  }
  return t;
}

/* ---------- export ---------- */

async function openDb(file) {
  const { DatabaseSync } = await import('node:sqlite');
  try {
    return new DatabaseSync(file, { readOnly: true });
  } catch (e) {
    fail(`Could not open ${file}: ${e.message}\nOn macOS give your terminal Full Disk Access, or copy chat.db somewhere and pass --db.`);
  }
}

async function exportChats() {
  const dbPath = String(opts.db ?? path.join(os.homedir(), 'Library', 'Messages', 'chat.db'));
  const sinceMs = new Date(opts.since ?? '2020-01-01').getTime();
  const db = await openDb(dbPath);

  const byHandle = new Map();
  for (const slug of slugs) for (const h of sources[slug].imessage_handles ?? []) byHandle.set(normalizeHandle(h), slug);
  if (byHandle.size === 0) fail('No imessage_handles configured for the selected assistants in data/sources.json.');

  const chatsStmt = db
    .prepare(
      `SELECT c.ROWID AS id, c.chat_identifier, c.service_name, COUNT(chj.handle_id) AS participants, GROUP_CONCAT(h.id) AS handles
       FROM chat c
       JOIN chat_handle_join chj ON chj.chat_id = c.ROWID
       JOIN handle h ON h.ROWID = chj.handle_id
       GROUP BY c.ROWID`,
    );
  chatsStmt.setReadBigInts(true); // message dates are nanoseconds since 2001 and overflow a JS number
  const chats = chatsStmt.all();

  const chatsBySlug = new Map();
  for (const c of chats) {
    if (Number(c.participants) !== 1) continue; // one-to-one only; group chats with humans are never exported
    const slug = byHandle.get(normalizeHandle(c.handles));
    if (!slug) continue;
    if (!chatsBySlug.has(slug)) chatsBySlug.set(slug, []);
    chatsBySlug.get(slug).push(c);
  }

  const messageQuery = db.prepare(
    `SELECT m.ROWID AS id, m.date, m.is_from_me, m.text, m.attributedBody AS body, m.cache_has_attachments AS att,
            m.item_type, m.associated_message_type AS assoc
     FROM message m JOIN chat_message_join j ON j.message_id = m.ROWID
     WHERE j.chat_id = ? ORDER BY m.date`,
  );
  messageQuery.setReadBigInts(true);

  for (const slug of slugs) {
    const chatList = chatsBySlug.get(slug) ?? [];
    if (chatList.length === 0) {
      console.log(`${slug}: no one-to-one thread found for ${sources[slug].imessage_handles.join(', ')}`);
      continue;
    }
    const seen = new Set();
    const messages = [];
    for (const c of chatList) {
      for (const m of messageQuery.all(c.id)) {
        const mid = Number(m.id);
        if (seen.has(mid)) continue;
        seen.add(mid);
        if (Number(m.item_type) !== 0) continue; // group events, etc.
        if (Number(m.assoc) >= 2000 && Number(m.assoc) < 4000) continue; // tapbacks / reactions
        const ms = appleDateToMs(m.date);
        if (ms < sinceMs) continue;
        const text = (m.text && String(m.text).trim()) || decodeAttributedBody(m.body);
        if (!text && !m.att) continue;
        messages.push({ id: mid, ts: new Date(ms).toISOString(), from: Number(m.is_from_me) ? 'me' : 'agent', text: text ?? '', attachment: Boolean(Number(m.att)), service: c.service_name });
      }
    }
    messages.sort((a, b) => a.ts.localeCompare(b.ts));
    writeJson(transcriptFile(slug), { slug, handles: sources[slug].imessage_handles, exported_at: new Date().toISOString(), chats: chatList.map(c => c.chat_identifier), messages });
    console.log(`${slug}: ${messages.length} messages, ${messages[0]?.ts.slice(0, 10) ?? '-'} to ${messages.at(-1)?.ts.slice(0, 10) ?? '-'} -> ${path.relative(ROOT, transcriptFile(slug))}`);
  }
  db.close();
}

/** Best-effort map of phone/email -> contact name from the macOS Contacts databases, so threads are recognizable. */
async function loadContacts() {
  const names = new Map();
  const base = path.join(os.homedir(), 'Library', 'Application Support', 'AddressBook');
  const files = [];
  const walk = dir => {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && (e.name === 'Sources' || dir.endsWith('Sources'))) walk(full);
      else if (e.isFile() && e.name.endsWith('.abcddb')) files.push(full);
    }
  };
  walk(base);
  const { DatabaseSync } = await import('node:sqlite');
  for (const file of files) {
    try {
      const db = new DatabaseSync(file, { readOnly: true });
      const label = r => [r.ZNICKNAME, [r.ZFIRSTNAME, r.ZLASTNAME].filter(Boolean).join(' '), r.ZORGANIZATION].filter(Boolean).join(' / ');
      for (const r of db.prepare('SELECT p.ZFULLNUMBER AS h, c.ZFIRSTNAME, c.ZLASTNAME, c.ZNICKNAME, c.ZORGANIZATION FROM ZABCDPHONENUMBER p JOIN ZABCDRECORD c ON c.Z_PK = p.ZOWNER').all()) {
        const key = normalizeHandle(r.h);
        if (key && label(r)) names.set(key, label(r));
      }
      for (const r of db.prepare('SELECT e.ZADDRESS AS h, c.ZFIRSTNAME, c.ZLASTNAME, c.ZNICKNAME, c.ZORGANIZATION FROM ZABCDEMAILADDRESS e JOIN ZABCDRECORD c ON c.Z_PK = e.ZOWNER').all()) {
        const key = normalizeHandle(r.h);
        if (key && label(r)) names.set(key, label(r));
      }
      db.close();
    } catch {
      /* a Contacts source we can't read; skip it */
    }
  }
  return names;
}

/** List every one-to-one thread with its number and contact name, so unknown assistant numbers can be added to sources.json. */
async function discover() {
  const dbPath = String(opts.db ?? path.join(os.homedir(), 'Library', 'Messages', 'chat.db'));
  const sinceMs = new Date(opts.since ?? '2026-01-01').getTime();
  const db = await openDb(dbPath);
  const known = new Map();
  for (const [slug, cfg] of Object.entries(sources)) for (const h of cfg.imessage_handles ?? []) known.set(normalizeHandle(h), slug);
  const stmt = db
    .prepare(
      `SELECT h.id AS handle, c.service_name AS service, COUNT(m.ROWID) AS n, MAX(m.date) AS last,
              (SELECT m2.text FROM message m2 JOIN chat_message_join j2 ON j2.message_id = m2.ROWID
                WHERE j2.chat_id = c.ROWID AND m2.is_from_me = 0 AND m2.text IS NOT NULL ORDER BY m2.date LIMIT 1) AS first_in
       FROM chat c
       JOIN chat_handle_join chj ON chj.chat_id = c.ROWID
       JOIN handle h ON h.ROWID = chj.handle_id
       JOIN chat_message_join j ON j.chat_id = c.ROWID
       JOIN message m ON m.ROWID = j.message_id
       WHERE (SELECT COUNT(*) FROM chat_handle_join x WHERE x.chat_id = c.ROWID) = 1
       GROUP BY c.ROWID HAVING n >= 3 ORDER BY n DESC`,
    );
  stmt.setReadBigInts(true);
  const rows = stmt.all().filter(r => appleDateToMs(r.last) >= sinceMs);
  const contacts = await loadContacts();
  console.log('handle                    contact               service   msgs  last        mapped      first incoming message');
  for (const r of rows) {
    const key = normalizeHandle(r.handle);
    const slug = known.get(key) ?? '';
    const name = contacts.get(key) ?? '';
    console.log(`${String(r.handle).padEnd(25)} ${name.slice(0, 20).padEnd(21)} ${String(r.service).padEnd(9)} ${String(r.n).padStart(5)}  ${new Date(appleDateToMs(r.last)).toISOString().slice(0, 10)}  ${slug.padEnd(11)} ${String(r.first_in ?? '').replace(/\s+/g, ' ').slice(0, 60)}`);
  }
  console.log('\nAdd assistant numbers to imessage_handles in data/sources.json. Threads with people are listed too; nothing is exported until a number is mapped.');
  db.close();
}

/* ---------- analyze ---------- */

/** Extra vocabulary per category, on top of the words in each task prompt. */
const CATEGORY_WORDS = {
  online_task: ['book', 'booking', 'reserve', 'reservation', 'website', 'site', 'form', 'sign up', 'apply', 'log in', 'login', 'check in', 'check-in', 'hotel', 'flight', 'table', 'appointment', 'browser'],
  recommendation_quality: ['recommend', 'suggest', 'options', 'best', 'ideas', 'where should', 'what should', 'find me a', 'restaurant', 'dinner spot', 'gift'],
  purchasing: ['buy', 'order', 'purchase', 'checkout', 'cart', 'amazon', 'pay', 'paid', 'card', 'ship', 'deliver', 'reorder'],
  email_replies: ['email', 'reply', 'inbox', 'draft', 'send him', 'send her', 'send them', 'respond', 'thread', 'follow up', 'follow-up'],
  proactive_behavior: ['remind', 'heads up', 'noticed', 'watch', 'alert', 'let me know when', 'flag', 'track'],
  running_routine: ['every day', 'every morning', 'daily', 'weekly', 'each week', 'every week', 'schedule this', 'digest', 'recurring', 'routine', 'at 7', 'at 8', 'at 9'],
  third_party_integrations: ['calendar', 'notion', 'slack', 'gmail', 'drive', 'connect', 'integration', 'sheet', 'doc', 'spotify', 'linear', 'hubspot', 'block time', 'invite'],
  memory: ['remember', 'you know', 'like last time', 'my usual', 'preference', 'i told you', 'forget', 'forgot'],
  personality: ['lol', 'haha', 'joke', 'funny', 'how are you', 'thanks', 'thank you', 'love that'],
  phone_calls: ['call', 'phone', 'ring them', 'dial', 'on the phone', 'voicemail'],
  multiplayer_groups: ['group', 'everyone', 'my wife', 'my husband', 'my partner', 'the team', 'we all', 'friends'],
  chained_tasks: ['then', 'after that', 'and then', 'passport', 'boarding pass', 'check-in chain', 'find it in', 'from my email', 'from drive'],
  proactive_restraint: ["don't send", 'do not send', 'ask me first', 'before you', 'check with me', 'without asking', 'permission', 'confirm before'],
  content_creation_games: ['image', 'picture', 'meme', 'game', 'trivia', 'video', 'draw', 'generate', 'make me a'],
};

const STOP = new Set('a an the and or of to for in on at with by from me my i you your it is are be this that as under near next week tomorrow today please can could would'.split(' '));

function loadTasks() {
  const set = readJson(path.join(DATA, 'tasks.json'), { tasks: [] });
  return set.tasks.map(t => ({ key: t.key, words: [...new Set(`${t.task} ${t.prompt}`.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w)))] }));
}

/** Score an episode against every category; return the ranked list with a rough confidence. */
export function categorize(episodeText, myText, tasks) {
  const all = ` ${episodeText.toLowerCase()} `;
  const mine = ` ${myText.toLowerCase()} `;
  const scores = [];
  for (const t of tasks) {
    let s = 0;
    for (const w of t.words) if (mine.includes(` ${w}`)) s += 1;
    for (const w of CATEGORY_WORDS[t.key] ?? []) {
      if (mine.includes(w)) s += 3;
      else if (all.includes(w)) s += 1;
    }
    scores.push({ key: t.key, score: s });
  }
  scores.sort((a, b) => b.score - a.score);
  const total = scores.reduce((n, s) => n + s.score, 0) || 1;
  const top = scores[0];
  return { category: top.score >= 3 ? top.key : null, confidence: Math.round((top.score / total) * 100) / 100, alternatives: scores.slice(1, 3).filter(s => s.score > 0).map(s => s.key) };
}

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function percentile(nums, p) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

const IDLE_MS = 45 * 60 * 1000;
const PROACTIVE_GAP_MS = 6 * 60 * 60 * 1000;
const UNANSWERED_MS = 10 * 60 * 1000;

/** Usage stats plus episodes (one per task you started). Exported for tests. */
export function analyzeTranscript(messages) {
  const latencies = [];
  let unanswered = 0;
  let proactive = 0;
  const episodes = [];
  let current = null;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const t = Date.parse(m.ts);
    const prev = messages[i - 1];
    const prevT = prev ? Date.parse(prev.ts) : -Infinity;

    if (m.from === 'me') {
      // Reply latency and unanswered: look ahead to the next agent message before my next message.
      let j = i + 1;
      let replied = false;
      while (j < messages.length && messages[j].from !== 'me') {
        if (messages[j].from === 'agent' && !replied) {
          latencies.push(Math.round((Date.parse(messages[j].ts) - t) / 1000));
          replied = true;
        }
        j++;
      }
      if (!replied) {
        const nextMine = messages[j];
        if (!nextMine || Date.parse(nextMine.ts) - t > UNANSWERED_MS) unanswered++;
      }
      if (!current || t - prevT > IDLE_MS) {
        current = { start: m.ts, messages: [] };
        episodes.push(current);
      }
    } else if (m.from === 'agent') {
      const lastMineT = [...messages.slice(0, i)].reverse().find(x => x.from === 'me');
      if (!lastMineT || t - Date.parse(lastMineT.ts) > PROACTIVE_GAP_MS) {
        proactive++;
        if (!current || t - prevT > IDLE_MS) {
          current = { start: m.ts, messages: [], agentInitiated: true };
          episodes.push(current);
        }
      }
    }
    if (current) current.messages.push(m);
  }

  const days = new Set(messages.map(m => m.ts.slice(0, 10)));
  return {
    stats: {
      messages: messages.length,
      from_me: messages.filter(m => m.from === 'me').length,
      from_agent: messages.filter(m => m.from === 'agent').length,
      days_active: days.size,
      first: messages[0]?.ts.slice(0, 10) ?? null,
      last: messages.at(-1)?.ts.slice(0, 10) ?? null,
      median_reply_s: median(latencies),
      p90_reply_s: percentile(latencies, 90),
      unanswered,
      proactive_messages: proactive,
      episodes: episodes.length,
    },
    episodes,
  };
}

function signalsFor(ep) {
  const agent = ep.messages.filter(m => m.from === 'agent');
  const mine = ep.messages.filter(m => m.from === 'me');
  const first = ep.messages[0];
  const firstReply = agent.find(m => Date.parse(m.ts) > Date.parse(first.ts));
  const text = agent.map(m => m.text).join('\n');
  return {
    turns: ep.messages.length,
    my_messages: mine.length,
    agent_messages: agent.length,
    first_reply_s: firstReply ? Math.round((Date.parse(firstReply.ts) - Date.parse(first.ts)) / 1000) : null,
    duration_min: Math.round((Date.parse(ep.messages.at(-1).ts) - Date.parse(first.ts)) / 60000),
    agent_said_done: /\b(done|booked|sent|ordered|scheduled|confirmed|completed|placed|reserved|all set)\b/i.test(text),
    agent_said_cant: /\b(can't|cannot|couldn't|unable|not able|wasn't able|failed|sorry)\b/i.test(text),
    agent_asked_question: agent.some(m => m.text.trim().endsWith('?')),
    agent_initiated: Boolean(ep.agentInitiated),
  };
}

async function analyze() {
  const tasks = loadTasks();
  const minConfidence = Number(opts['min-confidence'] ?? 0.34);
  for (const slug of slugs) {
    const transcript = readJson(transcriptFile(slug), null);
    if (!transcript) continue;
    const terms = [...redactTerms, ...(sources[slug].redact_terms ?? [])];
    const { stats, episodes } = analyzeTranscript(transcript.messages);
    writeJson(usageFile(slug), { source: 'imessage', exported_at: transcript.exported_at, analyzed_at: new Date().toISOString(), ...stats });

    const existing = readJson(draftFile(slug), []);
    const byId = new Map(existing.map(d => [d.id, d]));
    let added = 0;
    for (const ep of episodes) {
      const myText = ep.messages.filter(m => m.from === 'me').map(m => m.text).join('\n');
      const allText = ep.messages.map(m => m.text).join('\n');
      const cat = categorize(allText, myText, tasks);
      if (!opts.all && (!cat.category || cat.confidence < minConfidence)) continue;
      const id = `${slug}-${ep.start.slice(0, 10)}-${crypto.createHash('sha1').update(ep.start + (ep.messages[0]?.text ?? '')).digest('hex').slice(0, 6)}`;
      if (byId.has(id)) continue; // keep any scoring you've already typed into the draft
      byId.set(id, {
        id,
        category: cat.category,
        category_confidence: cat.confidence,
        alternatives: cat.alternatives,
        date: ep.start.slice(0, 10),
        signals: signalsFor(ep),
        excerpt: ep.messages.slice(0, 40).map(m => ({ from: m.from, ts: m.ts, text: redact(m.text, terms).slice(0, 600), ...(m.attachment ? { attachment: true } : {}) })),
        score: null,
        outcome: null,
        notes: '',
      });
      added++;
    }
    const drafts = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
    writeJson(draftFile(slug), drafts);
    console.log(`${slug}: ${stats.messages} msgs, ${stats.days_active} days, median reply ${stats.median_reply_s ?? '-'}s, ${stats.unanswered} unanswered, ${stats.proactive_messages} proactive · ${episodes.length} episodes, ${added} new drafts (${drafts.length} total) -> ${path.relative(ROOT, draftFile(slug))}`);
  }
  console.log('\nOpen each runs.draft.json, set "score" (1-10) and "outcome" (pass|partial|fail) on the ones that were real tests, fix "category" if the guess is wrong, then run: node scripts/imessage.mjs approve');
}

/* ---------- approve ---------- */

async function approve() {
  let total = 0;
  for (const slug of slugs) {
    const drafts = readJson(draftFile(slug), []);
    const ready = drafts.filter(d => typeof d.score === 'number' && d.outcome && d.category);
    if (!ready.length) continue;
    const runs = readJson(runsFile(slug), []);
    const have = new Set(runs.map(r => r.id));
    for (const d of ready) {
      if (have.has(d.id)) continue;
      writeJson(path.join(evidenceDir(slug), `${d.id}.json`), {
        id: d.id,
        agent: slug,
        category: d.category,
        date: d.date,
        signals: d.signals,
        excerpt: d.excerpt,
        redacted: true,
        published_at: new Date().toISOString(),
      });
      runs.push({ id: d.id, category: d.category, date: d.date, score: d.score, outcome: d.outcome, notes: d.notes ?? '', evidence_url: `/agents/${slug}/evidence/${d.id}` });
      total++;
    }
    runs.sort((a, b) => a.date.localeCompare(b.date));
    writeJson(runsFile(slug), runs);
    writeJson(draftFile(slug), drafts.filter(d => !ready.includes(d)));
    console.log(`${slug}: ${ready.length} runs approved -> ${path.relative(ROOT, runsFile(slug))}`);
  }
  console.log(`${total} runs published with evidence. Rebuild the site to see them.`);
}

/* ---------- status ---------- */

async function status() {
  for (const slug of slugs) {
    const t = readJson(transcriptFile(slug), null);
    const u = readJson(usageFile(slug), null);
    const d = readJson(draftFile(slug), []);
    const r = readJson(runsFile(slug), []);
    if (!t && !u && !d.length && !r.length) continue;
    console.log(`${slug.padEnd(16)} transcript ${t ? t.messages.length + ' msgs' : '-'}  usage ${u ? 'yes' : '-'}  drafts ${d.length} (${d.filter(x => typeof x.score === 'number').length} scored)  runs ${r.length}`);
  }
}

/* ---------- Entry point ---------- */

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
