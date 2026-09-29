import { createHash } from 'node:crypto';

export const MAX_BYTES = 1_500_000;
export const RETENTION_SECONDS = 90 * 86400;
export const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export const isRankingEligible = run => run.ranking_eligible !== false && !run.tester && !run.contribution;

// Defense in depth, not an anonymity guarantee. People must review names and context.
export function scrub(value) {
  return String(value ?? '')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
    .replace(/https?:\/\/\S+/gi, '[link]')
    .replace(/\b\d(?:[ -]?\d){12,18}\b/g, '[card]')
    .replace(/\+\d[\d ().-]{7,}\d/g, '[phone]')
    .replace(/(?:\+?1[ -.]?)?\(?\b\d{3}\)?[ -.]?\d{3}[ -.]?\d{4}\b/g, '[phone]');
}
function check(ok, message) { if (!ok) throw new Error(message); }
function shape(value, keys, name) {
  check(value && typeof value === 'object' && !Array.isArray(value), `Invalid ${name}`);
  check(Object.keys(value).every(k => keys.includes(k)) && keys.every(k => Object.hasOwn(value, k)), `Unexpected or missing fields in ${name}`);
}
function str(value, max, name, empty = false) {
  check(typeof value === 'string' && value.length <= max && (empty || value.trim().length > 0), `Invalid ${name}`);
  return scrub(value);
}
function number(value, max, name, nullable = false) {
  if (nullable && value === null) return null;
  check(typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= max, `Invalid ${name}`);
  return value;
}
function date(value, now, dayOnly = false) {
  check(typeof value === 'string' && (dayOnly ? /^\d{4}-\d{2}-\d{2}$/.test(value) : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)), 'Use valid UTC timestamps or YYYY-MM-DD dates');
  const ms = Date.parse(value);
  check(Number.isFinite(ms) && new Date(ms).toISOString().slice(0,10) === value.slice(0,10) && ms <= now + 86400000 && ms >= Date.UTC(2020,0,1), 'Invalid or future date');
  return value;
}
export function validateBundle(raw, { slugs, categories, now = Date.now() }) {
  shape(raw, ['version','id','tool_revision','rubric_version','slug','contributor','source','context','drafts'], 'bundle');
  check(raw.version === 2, 'Rebuild using the current version of the contribution skill');
  check(typeof raw.id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw.id), 'Invalid submission ID');
  check(slugs.includes(raw.slug), 'Unknown assistant');
  check(typeof raw.tool_revision === 'string' && /^[0-9a-f]{40}$/.test(raw.tool_revision), 'Missing tool revision');
  check(typeof raw.rubric_version === 'string' && /^[A-Za-z0-9.-]{1,40}$/.test(raw.rubric_version), 'Invalid rubric version');
  shape(raw.contributor, ['platform','handle','disclosure','comped'], 'contributor');
  const c = raw.contributor;
  check(['x','github'].includes(c.platform), 'Choose x or github for attribution');
  check(typeof c.handle === 'string' && (c.platform === 'x' ? /^@[A-Za-z0-9_]{1,15}$/ : /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/).test(c.handle), 'Invalid contributor handle');
  const contributor = { platform: c.platform, handle: c.handle, disclosure: str(c.disclosure,500,'disclosure'), comped: str(c.comped,200,'comped disclosure') };
  check(['imessage','whatsapp-export','pasted'].includes(raw.source), 'Unsupported source');
  shape(raw.context, ['tier','timezone','integrations'], 'context');
  const context = Object.fromEntries(Object.entries(raw.context).map(([k,v]) => [k, str(v,200,k)]));
  check(Array.isArray(raw.drafts) && raw.drafts.length > 0 && raw.drafts.length <= 40, 'Select 1–40 drafts');
  const seen = new Set();
  const drafts = raw.drafts.map(d => {
    shape(d, ['id','category','protocol','date','signals','excerpt','truncated','proposed_score','proposed_outcome','notes','public_excerpts'], 'draft');
    check(typeof d.id === 'string' && /^[\w.-]{1,100}$/.test(d.id) && d.id.startsWith(`${raw.slug}-`) && !seen.has(d.id), 'Invalid or repeated draft ID');
    seen.add(d.id);
    check(categories.includes(d.category), 'Unknown category');
    check(['task','observed'].includes(d.protocol), 'Invalid protocol');
    date(d.date, now, true);
    const keys = ['turns','my_messages','agent_messages','first_reply_s','duration_min','agent_said_done','agent_said_cant','agent_asked_question','agent_initiated'];
    shape(d.signals, keys, 'signals');
    const signals = {};
    for (const k of keys) {
      if (k.startsWith('agent_') && k !== 'agent_messages') { check(typeof d.signals[k] === 'boolean', 'Invalid signal'); signals[k] = d.signals[k]; }
      else signals[k] = number(d.signals[k], k === 'first_reply_s' ? 31536000 : 1000000, k, k === 'first_reply_s');
    }
    for (const k of ['turns','my_messages','agent_messages']) check(Number.isInteger(signals[k]), 'Message counts must be integers');
    check(signals.turns === signals.my_messages + signals.agent_messages, 'Inconsistent message counts');
    check(typeof d.truncated === 'boolean' && typeof d.public_excerpts === 'boolean', 'Choose excerpt permission and report truncation');
    check(Array.isArray(d.excerpt) && d.excerpt.length > 0 && d.excerpt.length <= 40 && d.excerpt.length <= signals.turns, 'Invalid excerpt');
    let last = -Infinity;
    const excerpt = d.excerpt.map(m => {
      shape(m, ['from','ts','text','attachment'], 'message');
      check(['me','agent'].includes(m.from) && typeof m.attachment === 'boolean', 'Invalid message');
      date(m.ts, now);
      const ms = Date.parse(m.ts); check(ms >= last, 'Messages out of order'); last = ms;
      return { from: m.from, ts: m.ts, text: str(m.text,600,'excerpt text',true), attachment: m.attachment };
    });
    check(excerpt[0].ts.slice(0,10) === d.date, 'Run date must match first excerpt message');
    check(d.proposed_score === null || (Number.isInteger(d.proposed_score) && d.proposed_score >= 1 && d.proposed_score <= 10), 'Invalid proposed score');
    check(d.proposed_outcome === null || ['pass','partial','fail'].includes(d.proposed_outcome), 'Invalid proposed outcome');
    return { ...d, signals, excerpt, notes: str(d.notes,300,'note',true) };
  });
  return { ...raw, contributor, context, drafts };
}

// The exact request body is what preview prints, hashes, and submit sends.
export const wire = bundle => JSON.stringify(bundle, null, 2) + '\n';
export function stageBundle(bundle, receipt, drafts, runs) {
  const have = new Set([...drafts,...runs].map(d => d.id));
  const added = [];
  for (const d of bundle.drafts) {
    const id = `${bundle.slug}-c-${digest(`${receipt}:${d.id}`).slice(0,24)}`;
    if (have.has(id)) continue;
    have.add(id);
    added.push({ ...d, id, source_id: d.id, score: null, outcome: null, rationale: '', tester: bundle.contributor.handle,
      contribution: { receipt, contributor: bundle.contributor, source: bundle.source, context: bundle.context, tool_revision: bundle.tool_revision, rubric_version: bundle.rubric_version }, ranking_eligible: false });
  }
  return [...drafts,...added];
}
export function reviewDigest(draft) {
  const { approval, ...content } = draft;
  return digest(content);
}
export function checkApproval(draft, publishExcerpts) {
  check(draft.approval?.digest === reviewDigest(draft) && draft.approval?.reviewer === 'David Pawlan', `${draft.id}: explicit, current David approval is required`);
  check(draft.approval.publish_excerpts === publishExcerpts, `${draft.id}: excerpt publication differs from approval`);
  check(!publishExcerpts || draft.public_excerpts === true, `${draft.id}: contributor did not permit public excerpts`);
  check(draft.ranking_eligible === false, 'Pilot contributions cannot affect rankings');
}
