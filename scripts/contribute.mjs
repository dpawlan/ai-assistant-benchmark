#!/usr/bin/env node
/**
 * Contribute runs to the Assistant Benchmark from your own conversations, without sending the conversations.
 *
 *   node scripts/contribute.mjs bundle  --slug poke --handle @you [--disclosure "..."] [--comped "none"] [--out contrib/poke.json]
 *   node scripts/contribute.mjs preview --file contrib/poke.json          print exactly what would be sent
 *   node scripts/contribute.mjs submit  --file contrib/poke.json [--endpoint https://assistantbenchmark.com/api/contribute]
 *
 * Maintainer side:
 *   node scripts/contribute.mjs pull [--repo dpawlan/assistant-benchmark-contrib]   inbox -> data/agents/<slug>/runs.draft.json (tagged with the contributor)
 *
 * The flow: `imessage.mjs export` + `analyze` run on the contributor's machine and produce runs.draft.json (episodes with
 * timing signals and REDACTED excerpts) and usage.json (reply-time stats). `bundle` packages those two files plus the
 * contributor's handle and disclosure. The transcript itself is never included. `submit` posts the bundle to the site,
 * which files it in a private inbox for review; nothing is published until the maintainer approves each run.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const DEFAULT_ENDPOINT = 'https://assistantbenchmark.com/api/contribute';
const DEFAULT_REPO = 'dpawlan/assistant-benchmark-contrib';
const MAX_DRAFTS = 40;
const MAX_EXCERPT = 40;

const opts = {};
const cmd = process.argv.slice(2).filter((a, i, all) => {
  if (a.startsWith('--')) { const k = a.slice(2); const v = all[i + 1]; if (v === undefined || v.startsWith('--')) opts[k] = true; else opts[k] = v; return false; }
  return !(all[i - 1]?.startsWith('--') && !all[i - 1].includes('='));
})[0];

const fail = m => { console.error(`error: ${m}`); process.exit(1); };
const readJson = (f, fb) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return fb; } };
const agentDir = slug => path.join(DATA, 'agents', slug);

/** Belt and braces: the analyzer already redacts, this catches anything that slipped through before it leaves the machine. */
export function scrub(text) {
  return String(text ?? '')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/(\+?1[ -.]?)?\(?\d{3}\)?[ -.]?\d{3}[ -.]?\d{4}\b/g, '[phone]')
    .replace(/\b\d{13,19}\b/g, '[card]')
    .replace(/\bhttps?:\/\/\S+/g, m => (/assistantbenchmark\.com|\.(png|jpg|jpeg)$/i.test(m) ? m : '[link]'));
}

function bundle() {
  const slug = String(opts.slug ?? '');
  const handle = String(opts.handle ?? '').trim();
  if (!slug) fail('--slug is required (the assistant, e.g. poke)');
  if (!/^@?[\w.-]{2,40}$/.test(handle)) fail('--handle is required: your X or GitHub handle, e.g. @you');
  const index = readJson(path.join(DATA, 'index.json'), null);
  if (!index?.agents?.some(a => a.slug === slug)) fail(`${slug} is not on the roster (see data/index.json)`);
  const drafts = readJson(path.join(agentDir(slug), 'runs.draft.json'), null);
  if (!Array.isArray(drafts) || !drafts.length) fail(`no drafts for ${slug}: run \`node scripts/imessage.mjs export --slug ${slug}\` then \`analyze --slug ${slug}\` first`);
  const usage = readJson(path.join(agentDir(slug), 'usage.json'), null);
  const transcript = readJson(path.join(agentDir(slug), 'transcripts', 'messages.json'), null);
  const keep = drafts.filter(d => d.skip !== true).slice(0, MAX_DRAFTS).map(d => ({
    id: d.id, category: d.category, protocol: d.protocol === 'task' ? 'task' : 'observed', date: d.date,
    signals: d.signals, excerpt: (d.excerpt ?? []).slice(0, MAX_EXCERPT).map(m => ({ from: m.from, ts: m.ts, text: scrub(m.text).slice(0, 600), ...(m.attachment ? { attachment: true } : {}) })),
    proposed_score: typeof d.score === 'number' ? d.score : null, proposed_outcome: d.outcome ?? null, notes: scrub(d.notes ?? '').slice(0, 300),
  }));
  const out = {
    version: 1, id: crypto.randomUUID(), created_at: new Date().toISOString(), slug,
    contributor: { handle: handle.startsWith('@') ? handle : `@${handle}`, disclosure: String(opts.disclosure ?? 'I do not work for, invest in or advise any assistant on the roster.'), comped: String(opts.comped ?? 'none') },
    source: transcript?.source ?? usage?.source ?? 'imessage',
    assistant_handle: transcript?.handle ?? transcript?.handles?.[0] ?? null,
    usage: usage ? { ...usage } : null,
    drafts: keep,
  };
  const file = String(opts.out ?? path.join(ROOT, 'contrib', `${slug}-${out.contributor.handle.replace(/^@/, '')}.json`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  console.log(`bundle written: ${path.relative(ROOT, file)}  (${keep.length} draft runs, ${Buffer.byteLength(JSON.stringify(out))} bytes)`);
  console.log(`review it: node scripts/contribute.mjs preview --file ${path.relative(ROOT, file)}`);
}

function preview() {
  const b = readJson(String(opts.file ?? ''), null);
  if (!b) fail('--file <bundle.json> is required');
  console.log(`Assistant: ${b.slug}   Contributor: ${b.contributor.handle}   Source: ${b.source}   Assistant handle: ${b.assistant_handle ?? '(unknown)'}`);
  console.log(`Disclosure: ${b.contributor.disclosure}   Comped accounts: ${b.contributor.comped}`);
  if (b.usage) console.log(`Usage: ${b.usage.messages} messages over ${b.usage.days_active} days, median reply ${b.usage.median_reply_s}s`);
  console.log(`\n${b.drafts.length} draft run(s). This is EVERYTHING that will be sent; the transcript stays on this machine.\n`);
  for (const d of b.drafts) {
    console.log(`=== ${d.id} · ${d.category} · ${d.protocol} · ${d.date} · proposed ${d.proposed_score ?? '-'} ${d.proposed_outcome ?? ''}`);
    if (d.notes) console.log(`    note: ${d.notes}`);
    for (const m of d.excerpt) console.log(`    ${m.from === 'me' ? 'you  ' : 'agent'} ${m.ts.slice(11, 16)}  ${m.text.replace(/\s+/g, ' ').slice(0, 160)}`);
    console.log('');
  }
}

async function submit() {
  const file = String(opts.file ?? '');
  const b = readJson(file, null);
  if (!b) fail('--file <bundle.json> is required');
  const endpoint = String(opts.endpoint ?? DEFAULT_ENDPOINT);
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'assistant-benchmark-contribute/1' }, body: JSON.stringify(b) });
  const text = await res.text();
  if (!res.ok) fail(`submit failed (${res.status}): ${text.slice(0, 300)}`);
  let json = {}; try { json = JSON.parse(text); } catch {}
  console.log(`submitted: ${b.slug} from ${b.contributor.handle}  ticket ${json.id ?? '?'}${json.ticket ? `  ${json.ticket}` : ''}`);
  console.log('Thank you. Each run is reviewed against the published rubric before anything appears on the site.');
}

/** Maintainer: fetch new bundles from the private inbox repo and stage them as drafts tagged with the contributor. */
function pull() {
  const repo = String(opts.repo ?? DEFAULT_REPO);
  const gh = args => execFileSync('gh', args, { encoding: 'utf8' });
  let list = [];
  try { list = JSON.parse(gh(['api', `repos/${repo}/contents/inbox`])); } catch (e) { fail(`could not list ${repo}/inbox: ${e.message.split('\n')[0]}`); }
  const seenFile = path.join(DATA, 'contrib-pulled.json');
  const seen = new Set(readJson(seenFile, []));
  let n = 0;
  for (const f of list.filter(x => x.name.endsWith('.json'))) {
    if (seen.has(f.name)) continue;
    const b = JSON.parse(Buffer.from(JSON.parse(gh(['api', `repos/${repo}/contents/inbox/${f.name}`])).content, 'base64').toString('utf8'));
    const dir = agentDir(b.slug);
    if (!fs.existsSync(dir)) { console.warn(`skip ${f.name}: unknown assistant ${b.slug}`); continue; }
    fs.mkdirSync(path.join(dir, 'contrib'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'contrib', f.name), JSON.stringify(b, null, 2) + '\n');
    const draftFile = path.join(dir, 'runs.draft.json');
    const drafts = readJson(draftFile, []);
    const runs = readJson(path.join(dir, 'runs.json'), []);
    const have = new Set([...drafts.map(d => d.id), ...runs.map(r => r.id)]);
    let added = 0;
    for (const d of b.drafts) {
      if (have.has(d.id)) continue;
      drafts.push({ id: d.id, category: d.category, protocol: d.protocol, date: d.date, signals: d.signals, excerpt: d.excerpt, score: null, outcome: null, notes: d.notes ?? '', proposed_score: d.proposed_score, proposed_outcome: d.proposed_outcome, tester: b.contributor.handle, contrib_id: b.id });
      added++;
    }
    fs.writeFileSync(draftFile, JSON.stringify(drafts, null, 2) + '\n');
    if (b.usage && !fs.existsSync(path.join(dir, 'usage.json'))) fs.writeFileSync(path.join(dir, 'usage.json'), JSON.stringify({ ...b.usage, tester: b.contributor.handle }, null, 2) + '\n');
    console.log(`${b.slug}: ${added} draft(s) from ${b.contributor.handle} (${f.name}); assistant handle ${b.assistant_handle ?? 'unknown'}`);
    seen.add(f.name); n++;
  }
  fs.writeFileSync(seenFile, JSON.stringify([...seen], null, 2) + '\n');
  console.log(`${n} bundle(s) pulled. Score the drafts (score, outcome, one-sentence note), then: node scripts/imessage.mjs approve --slug <slug>`);
}

const commands = { bundle, preview, submit, pull };
if (!commands[cmd]) { console.error(fs.readFileSync(new URL(import.meta.url)).toString().split('*/')[0].replace(/^#!.*\n/, '').replace('/**', '').replace(/^ \* ?/gm, '')); process.exit(1); }
await commands[cmd]();
