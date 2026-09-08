/**
 * Turn saved x402atlas search pages into inbox records.
 *
 *   node scripts/ingest-x402.mjs <slug> <dir-of-json-pages>
 *
 * Each file in <dir> is one response body from
 * https://twitter.use.x402atlas.com/search (fields: query, tweets[], cursor),
 * optionally wrapped as { body: {...} }. Records are shaped exactly like
 * collect.mjs's X collector and go to data/inbox/x/<slug>.json via the same
 * dedupe (feedback.json + every inbox) and product-mention filter.
 * Prints a one-line JSON summary on stdout.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { record, filterNew, writeInbox, isVendor, toDate } from './collect.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [slug, dir] = process.argv.slice(2);
if (!slug || !dir) {
  console.error('usage: node scripts/ingest-x402.mjs <slug> <dir>');
  process.exit(2);
}
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'sources.json'), 'utf-8')).agents;
const cfg = sources[slug];
if (!cfg) {
  console.error(`Unknown slug "${slug}"`);
  process.exit(2);
}

/** Swap t.co links for the expanded URLs the API returns, when they line up. */
function expandLinks(text, urls = []) {
  const tco = text.match(/https:\/\/t\.co\/\w+/g) ?? [];
  if (!urls.length || tco.length < urls.length) return text;
  let out = text;
  urls.forEach((u, i) => { out = out.replace(tco[i], u); });
  return out;
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
const seen = new Map();
const perQuery = {};
let pages = 0;
for (const f of files) {
  let body = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
  if (body.body) body = body.body;
  if (!Array.isArray(body.tweets)) continue;
  pages++;
  const q = (body.query ?? '').replace(/ since:\S+| until:\S+/g, '').trim();
  perQuery[q] = (perQuery[q] ?? 0) + body.tweets.length;
  for (const t of body.tweets) {
    const screen = t.author?.screen_name;
    if (!screen || seen.has(t.id)) continue;
    seen.set(
      t.id,
      record({
        slug,
        quote: expandLinks(t.text ?? '', t.urls),
        author: `@${screen}`,
        author_name: t.author?.name ?? '',
        date: toDate(t.created_at),
        url: `https://x.com/${screen}/status/${t.id}`,
        source: 'x',
        tags: [...(isVendor(cfg, screen) ? ['vendor'] : []), ...(t.in_reply_to_id ? ['reply'] : [])],
        notes: `query: ${q} | via x402atlas`,
      }),
    );
  }
}
const items = [...seen.values()];
const fresh = filterNew(slug, cfg, items);
const written = writeInbox('x', slug, fresh);
console.log(JSON.stringify({ slug, pages, tweets_raw: Object.values(perQuery).reduce((a, b) => a + b, 0), unique: items.length, new_written: written, perQuery }));
