import fs from 'fs';
import path from 'path';
export { scoreBucket, opinionRank, isThin, THIN_SAMPLE } from './score';
import { opinionRank } from './score';
import {
  Agent,
  AgentMeta,
  AgentScores,
  Category,
  Evidence,
  Feedback,
  IndexData,
  OpinionFile,
  OpinionStat,
  RosterEntry,
  Run,
  Sentiment,
  Task,
  TaskSet,
  Usage,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

const cache = new Map<string, unknown>();

function readJson<T>(file: string): T | null {
  if (cache.has(file)) return cache.get(file) as T | null;
  let value: T | null = null;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  } catch {
    value = null;
  }
  cache.set(file, value);
  return value;
}

function readText(file: string): string | undefined {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch {
    return undefined;
  }
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  online_task: 'Completes a real browser or web workflow end to end, not just advice.',
  recommendation_quality: 'Relevance, taste and constraint-following when it suggests options.',
  purchasing: 'Finds, compares and completes (or correctly stages) a purchase.',
  email_replies: 'Drafts or sends replies in your voice, with the right context and recipients.',
  proactive_behavior: 'Acts or nudges usefully without being asked every step.',
  running_routine: 'Reliable scheduled and recurring work.',
  third_party_integrations: 'Uses connected tools like calendar, inbox and Notion correctly.',
  memory: 'Remembers your preferences, people and past requests across sessions.',
  personality: 'Has a voice worth talking to; reads like a contact, not a form.',
  phone_calls: 'Makes real phone calls on your behalf and reports back.',
  multiplayer_groups: 'Works in group chats with several people at once.',
  chained_tasks: 'Strings several steps across tools into one job, like a flight check-in.',
  proactive_restraint: 'Acts before you knew you needed it, and knows when not to.',
  content_creation_games: 'Makes images, video or games on request.',
};

/** Column labels short enough for the matrix header. */
export const CATEGORY_SHORT: Record<string, string> = {
  online_task: 'Online',
  recommendation_quality: 'Recs',
  purchasing: 'Buying',
  email_replies: 'Email',
  proactive_behavior: 'Proactive',
  running_routine: 'Routines',
  third_party_integrations: 'Tools',
  memory: 'Memory',
  personality: 'Persona',
  phone_calls: 'Calls',
  multiplayer_groups: 'Groups',
  chained_tasks: 'Chains',
  proactive_restraint: 'Restraint',
  content_creation_games: 'Creation',
};

const PRODUCT_CLASS_LABELS: Record<string, string> = {
  agent_builder: 'Agent builder',
  team_ai_employee: 'Team AI employee',
  agent_infra: 'Agent infrastructure',
  on_device: 'On-device',
  shopping_voice: 'Shopping, voice',
  voice_platform: 'Voice platform',
  hardware_wearable: 'Hardware, wearable',
  desktop_agent: 'Desktop agent',
  unconfirmed: 'Unconfirmed',
  unclear: 'Unclear',
};

export function productClassLabel(key: string | null | undefined): string | null {
  if (!key) return null;
  return PRODUCT_CLASS_LABELS[key] ?? key.replace(/_/g, ' ');
}

export function getIndexData(): IndexData {
  const data = readJson<IndexData>(path.join(DATA_DIR, 'index.json'));
  if (!data) throw new Error('data/index.json is missing');
  return data;
}

export function getCategories(): Category[] {
  return readJson<Category[]>(path.join(DATA_DIR, 'categories.json')) ?? [];
}

export function getCategory(key: string): Category | null {
  return getCategories().find(c => c.key === key) ?? null;
}

export function getTaskSet(): TaskSet {
  return readJson<TaskSet>(path.join(DATA_DIR, 'tasks.json')) ?? { version: '0', scale: '1-10', tasks: [] };
}

export function getTask(key: string): Task | null {
  return getTaskSet().tasks.find(t => t.key === key) ?? null;
}

export function getRoster(): RosterEntry[] {
  return getIndexData().agents;
}

function agentDir(slug: string) {
  return path.join(DATA_DIR, 'agents', slug);
}

export function getRuns(slug: string): Run[] {
  const runs = readJson<Run[]>(path.join(agentDir(slug), 'runs.json')) ?? [];
  return [...runs].sort((a, b) => a.date.localeCompare(b.date));
}

/* ---------- Public opinion ---------- */

/** Signed quotes needed before a category gets a sentiment score rather than just a count. */
export const MIN_SIGNED = 3;

export function getOpinion(slug: string): OpinionFile | null {
  return readJson<OpinionFile>(path.join(agentDir(slug), 'opinion.json'));
}

/** Posts that aren't independent opinion: the company, its staff, paid or coordinated launch promotion, affiliates. */
export function isFounderPost(quote: Feedback): boolean {
  const tags = quote.tags ?? [];
  return tags.includes('founder') || tags.includes('vendor') || tags.includes('promo');
}

/**
 * A quote is worth showing only if it says something: praise, a complaint, a use case, a mixed take.
 * Bare mentions, link-drops and relayed marketing copy are classified all-neutral and stay out of the page
 * (they remain in feedback.json as collected data). Unclassified quotes are shown until someone labels them.
 */
export function hasJudgment(slug: string, quote: Feedback): boolean {
  const cats = getOpinion(slug)?.quotes[quote.id];
  if (!cats) return hasSubstance(quote);
  return Object.values(cats).some(s => s !== 'neutral');
}

/** At least four words once @mentions and links are stripped; a bare tag or link-drop says nothing. */
export function hasSubstance(quote: Feedback): boolean {
  const words = (quote.quote ?? '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/@\w+/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  return words ? words.split(' ').length >= 4 : false;
}

/** Quotes that render on the site for one agent: founder posts stay (labelled), neutral-only rows are hidden. */
export function getShownFeedback(slug: string): Feedback[] {
  const feedback = readJson<Feedback[]>(path.join(agentDir(slug), 'feedback.json')) ?? [];
  return feedback.filter(q => hasJudgment(slug, q));
}

function emptyStat(): OpinionStat {
  return { pos: 0, neg: 0, neutral: 0, n: 0, score: null };
}

/** A mixed quote is a rave with a caveat: the author's verdict is positive, so it counts as positive. */
function addSentiment(stat: OpinionStat, s: Sentiment) {
  stat.n += 1;
  if (s === 'pos' || s === 'mixed') stat.pos += 1;
  else if (s === 'neg') stat.neg += 1;
  else stat.neutral += 1;
}

function finalizeStat(stat: OpinionStat): OpinionStat {
  const signed = stat.pos + stat.neg;
  stat.score = signed >= MIN_SIGNED ? Math.round((stat.pos / signed) * 100) / 100 : null;
  return stat;
}

/** Sentiment with no specific job attached. Counts toward an agent's overall opinion only. */
export const GENERAL_KEY = 'general';

function deriveOpinion(slug: string, categories: Category[]) {
  const file = getOpinion(slug);
  const feedback = readJson<Feedback[]>(path.join(agentDir(slug), 'feedback.json')) ?? [];
  const byId = new Map(feedback.map(q => [q.id, q]));
  const opinion: Record<string, OpinionStat> = {};
  for (const c of categories) opinion[c.key] = emptyStat();
  const overall = emptyStat();

  for (const [id, cats] of Object.entries(file?.quotes ?? {})) {
    const quote = byId.get(id);
    if (!quote || isFounderPost(quote)) continue;
    let pos = false;
    let neg = false;
    for (const [key, s] of Object.entries(cats)) {
      if (key !== GENERAL_KEY && !opinion[key]) continue;
      if (key !== GENERAL_KEY) addSentiment(opinion[key], s);
      if (s === 'pos' || s === 'mixed') pos = true;
      if (s === 'neg' || s === 'mixed') neg = true;
    }
    addSentiment(overall, pos ? 'pos' : neg ? 'neg' : 'neutral');
  }
  for (const key of Object.keys(opinion)) finalizeStat(opinion[key]);
  return { opinion, opinionOverall: finalizeStat(overall) };
}

/** Categories a quote speaks to: the hand classification when present, else the tag map. */
export function quoteCategories(slug: string, quote: Feedback, map: TagMap = getTagMap()): string[] {
  const cats = getOpinion(slug)?.quotes[quote.id];
  if (cats) return Object.keys(cats).filter(k => k !== GENERAL_KEY);
  return categoriesForTags(quote.tags, map);
}

/** Agents ordered by public opinion on one category: scored first (shrunk by sample size), then by sample size. */
export function rankByOpinion(agents: Agent[], key: string): Agent[] {
  const n = (a: Agent) => a.opinion[key]?.n ?? 0;
  return [...agents]
    .filter(a => n(a) > 0)
    .sort((a, b) => opinionRank(b.opinion[key]) - opinionRank(a.opinion[key]) || n(b) - n(a) || a.name.localeCompare(b.name));
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

/**
 * Derive the category scores for one agent.
 * Latest run per category wins; scores.json fills anything without a run;
 * stretch products with a `likely_applicable` list get N/A everywhere else.
 */
function deriveScores(entry: RosterEntry, meta: AgentMeta | null, categories: Category[]) {
  const base = readJson<AgentScores>(path.join(agentDir(entry.slug), 'scores.json')) ?? {};
  const runs = getRuns(entry.slug);
  const latestRuns: Record<string, Run> = {};
  for (const run of runs) latestRuns[run.category] = run; // sorted ascending, so the last one wins

  const applicable = meta?.likely_applicable ?? [];
  const prefillNA = entry.status === 'stretch' && applicable.length > 0;

  const scores: AgentScores = {};
  for (const c of categories) {
    const run = latestRuns[c.key];
    if (run) scores[c.key] = run.score;
    else if (base[c.key] !== undefined && base[c.key] !== null) scores[c.key] = base[c.key];
    else if (prefillNA && !applicable.includes(c.key)) scores[c.key] = 'n/a';
    else scores[c.key] = null;
  }

  const numeric = (group: Category['group']) =>
    categories
      .filter(c => c.group === group)
      .map(c => scores[c.key])
      .filter((v): v is number => typeof v === 'number');

  const lastTested = runs.length ? runs[runs.length - 1].date : null;
  const latest = Object.values(latestRuns);
  return {
    scores,
    latestRuns,
    core: mean(numeric('core')),
    endorsed: mean(numeric('endorsed')),
    testedCount: Object.values(scores).filter(v => typeof v === 'number').length,
    taskRuns: latest.filter(r => r.protocol === 'task').length,
    observedRuns: latest.filter(r => r.protocol !== 'task').length,
    lastTested,
  };
}

function fromRoster(entry: RosterEntry, categories: Category[]): Agent {
  const meta = readJson<AgentMeta>(path.join(agentDir(entry.slug), 'meta.json'));
  return {
    slug: entry.slug,
    name: entry.name,
    site: entry.site || null,
    status: entry.status,
    feedbackCount: getShownFeedback(entry.slug).length,
    publicSignal: entry.public_signal,
    tagline: entry.tagline ?? '',
    icon: entry.icon ?? null,
    focus: entry.focus ?? null,
    ...deriveScores(entry, meta, categories),
    ...deriveOpinion(entry.slug, categories),
    usage: getUsage(entry.slug),
  };
}

export function getUsage(slug: string): Usage | null {
  return readJson<Usage>(path.join(agentDir(slug), 'usage.json'));
}

export function getEvidence(slug: string, id: string): Evidence | null {
  if (!/^[\w.-]+$/.test(id)) return null;
  return readJson<Evidence>(path.join(agentDir(slug), 'evidence', `${id}.json`));
}

export function listEvidenceIds(slug: string): string[] {
  try {
    return fs
      .readdirSync(path.join(agentDir(slug), 'evidence'))
      .filter(f => f.endsWith('.json'))
      .map(f => f.slice(0, -5));
  } catch {
    return [];
  }
}

/** "9s", "2m 10s", "1h 4m" for reply latencies. */
export function formatSeconds(s: number | null | undefined): string {
  if (s === null || s === undefined) return '—';
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

export function getAgents(): Agent[] {
  const categories = getCategories();
  return getRoster().map(entry => fromRoster(entry, categories));
}

/** Leaderboard order: core score, then endorsed, then how much public discussion exists. */
export function rankAgents(agents: Agent[]): Agent[] {
  return [...agents].sort(
    (a, b) =>
      (b.core ?? -1) - (a.core ?? -1) ||
      (b.endorsed ?? -1) - (a.endorsed ?? -1) ||
      b.feedbackCount - a.feedbackCount ||
      a.name.localeCompare(b.name),
  );
}

/** Agents ordered by one category's score; untested and N/A sort last. */
export function rankByCategory(agents: Agent[], key: string): Agent[] {
  const val = (a: Agent) => (typeof a.scores[key] === 'number' ? (a.scores[key] as number) : -1);
  return [...agents].sort((a, b) => val(b) - val(a) || b.feedbackCount - a.feedbackCount || a.name.localeCompare(b.name));
}

export function getCoreCategories(): Category[] {
  return getCategories().filter(cat => cat.group === 'core');
}

export function getEndorsedCategories(): Category[] {
  return getCategories().filter(cat => cat.group === 'endorsed');
}

export function getAllSlugs(): string[] {
  return getRoster().map(agent => agent.slug);
}

export function getAgentDetail(slug: string): Agent | null {
  const entry = getRoster().find(a => a.slug === slug);
  if (!entry) return null;

  const dir = agentDir(slug);
  const meta = readJson<AgentMeta>(path.join(dir, 'meta.json')) ?? undefined;
  const feedback = getShownFeedback(slug);
  const summary = readText(path.join(dir, 'summary.md'));

  return { ...fromRoster(entry, getCategories()), meta, feedback, summary };
}

/** Other agents with the same status, best first. */
export function getRelatedAgents(slug: string, limit = 6): Agent[] {
  const self = getRoster().find(a => a.slug === slug);
  if (!self) return [];
  return rankAgents(getAgents().filter(a => a.status === self.status && a.slug !== slug)).slice(0, limit);
}

/** Benchmark-wide coverage for the status strip. */
export function getBenchmarkStats() {
  const agents = getAgents();
  const tested = agents.filter(a => a.testedCount > 0);
  const lastTested = agents.map(a => a.lastTested).filter((d): d is string => !!d).sort().pop() ?? null;
  return {
    version: getTaskSet().version,
    taskCount: getTaskSet().tasks.length,
    agentCount: agents.length,
    testedCount: tested.length,
    runCount: agents.reduce((n, a) => n + Object.keys(a.latestRuns).length, 0),
    lastTested,
    /** Quotes with a hand classification, founder posts excluded. */
    classifiedCount: agents.reduce((n, a) => n + a.opinionOverall.n, 0),
    quoteCount: getAllQuotes().length,
  };
}

/* ---------- Quotes attached to the rubric ---------- */

export type TagMap = Record<string, string[]>;

export function getTagMap(): TagMap {
  const raw = readJson<Record<string, unknown>>(path.join(DATA_DIR, 'tag-categories.json')) ?? {};
  const map: TagMap = {};
  for (const [tag, cats] of Object.entries(raw)) {
    if (Array.isArray(cats)) map[tag] = cats as string[];
  }
  return map;
}

/** Rubric categories a quote speaks to, via its tags. */
export function categoriesForTags(tags: string[] | undefined, map: TagMap = getTagMap()): string[] {
  const out: string[] = [];
  for (const t of tags ?? []) for (const c of map[t] ?? []) if (!out.includes(c)) out.push(c);
  return out;
}

export interface AgentRef {
  slug: string;
  name: string;
  icon: string | null;
}

export interface AttributedQuote {
  agent: AgentRef;
  quote: Feedback;
  categories: string[];
}

let allQuotesCache: AttributedQuote[] | null = null;

/** Every quote across every agent, newest first, with its rubric categories attached. */
export function getAllQuotes(): AttributedQuote[] {
  if (allQuotesCache) return allQuotesCache;
  const map = getTagMap();
  const out: AttributedQuote[] = [];
  for (const entry of getRoster()) {
    const feedback = readJson<Feedback[]>(path.join(agentDir(entry.slug), 'feedback.json')) ?? [];
    const agent: AgentRef = { slug: entry.slug, name: entry.name, icon: entry.icon ?? null };
    for (const quote of feedback) {
      if (isFounderPost(quote) || !hasJudgment(entry.slug, quote)) continue;
      out.push({ agent, quote, categories: quoteCategories(entry.slug, quote, map) });
    }
  }
  out.sort((a, b) => (b.quote.date || '').localeCompare(a.quote.date || ''));
  allQuotesCache = out;
  return out;
}

export function getQuotesForCategory(key: string, limit = 8): { items: AttributedQuote[]; total: number } {
  const all = getAllQuotes().filter(q => q.categories.includes(key));
  return { items: all.slice(0, limit), total: all.length };
}

export type FeedItem =
  | { kind: 'run'; date: string; agent: AgentRef; run: Run }
  | { kind: 'quote'; date: string; agent: AgentRef; quote: Feedback; categories: string[] };

/**
 * Newest runs and quotes across the whole benchmark, interleaved by date.
 * The latest tests are always included; quotes are capped per assistant so one loud week doesn't fill the feed.
 */
export function getLatestFeed(limit = 10, perAgent = 2, maxRuns = 4): FeedItem[] {
  const runs: FeedItem[] = [];
  for (const entry of getRoster()) {
    const agent: AgentRef = { slug: entry.slug, name: entry.name, icon: entry.icon ?? null };
    for (const run of getRuns(entry.slug)) runs.push({ kind: 'run', date: run.date, agent, run });
  }
  runs.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const items: FeedItem[] = runs.slice(0, maxRuns);

  const seen = new Map<string, number>();
  for (const q of getAllQuotes()) {
    if (items.length >= limit) break;
    const n = seen.get(q.agent.slug) ?? 0;
    if (n >= perAgent) continue;
    seen.set(q.agent.slug, n + 1);
    items.push({ kind: 'quote', date: q.quote.date, agent: q.agent, quote: q.quote, categories: q.categories });
  }
  // Runs first on equal dates: a test is the more important event.
  items.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (a.kind === b.kind ? 0 : a.kind === 'run' ? -1 : 1));
  return items.slice(0, limit);
}

export function displayDomain(site: string | null | undefined): string | null {
  if (!site) return null;
  return site.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
}

/** "2026-09-07" -> "September 7, 2026" without timezone drift. */
export function formatDate(iso: string, style: 'long' | 'short' = 'long'): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString('en-US', { month: style, day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
