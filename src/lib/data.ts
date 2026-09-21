import fs from 'fs';
import path from 'path';
export { scoreBucket, opinionRank, isThin, THIN_SAMPLE } from './score';
import { opinionRank } from './score';
import { EvidenceOutcome,
  JobEntry,
  JobGroup,
  JobsFile,
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
  Usage, Funding } from './types';

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
  travel: 'Finds, books and manages flights and hotels, including check-in and changes.',
  recommendation_quality: 'Relevance, taste and constraint-following when it suggests options.',
  purchasing: 'Finds, compares and completes (or correctly stages) a purchase.',
  email_replies: 'Drafts or sends replies in your voice, with the right context and recipients.',
  proactive_behavior: 'Acts or nudges usefully without being asked every step.',
  running_routine: 'Reliable scheduled and recurring work.',
  third_party_integrations: 'Uses connected tools like calendar, inbox and Notion correctly.',
  permissions_privacy: 'Lets you scope what it can see and do, honors the rules you set, and revokes cleanly.',
  memory: 'Remembers your preferences, people and past requests across sessions.',
  personality: 'Has a voice worth talking to; reads like a contact, not a form.',
  phone_calls: 'Makes real phone calls on your behalf and reports back.',
  multiplayer_groups: 'Works in group chats with several people at once.',
  chained_tasks: 'Strings several steps across tools into one job, like a flight check-in.',
  proactive_restraint: 'Judgment on unprompted action: handles the small stuff, waits on the consequential.',
  content_creation_games: 'Makes images, video or games on request.',
};

/** Column labels short enough for the matrix header. */
export const CATEGORY_SHORT: Record<string, string> = {
  online_task: 'Online tasks',
  travel: 'Travel',
  recommendation_quality: 'Picks',
  purchasing: 'Purchasing',
  email_replies: 'Email',
  proactive_behavior: 'Proactive',
  running_routine: 'Routines',
  third_party_integrations: 'Connected apps',
  permissions_privacy: 'Permissions',
  memory: 'Memory',
  personality: 'Personality',
  phone_calls: 'Phone calls',
  multiplayer_groups: 'Group chats',
  chained_tasks: 'Multi-step',
  proactive_restraint: 'Restraint',
  content_creation_games: 'Images',
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

/** Dimensions the benchmark scores. Opinion-only dimensions (scored: false) are excluded everywhere scores appear. */
export function getScoredCategories(): Category[] {
  return getCategories().filter(c => c.scored !== false);
}

export function isScoredCategory(key: string): boolean {
  return getCategories().some(c => c.key === key && c.scored !== false);
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
      .filter(c => c.group === group && c.scored !== false)
      .map(c => scores[c.key])
      .filter((v): v is number => typeof v === 'number');

  const lastTested = runs.length ? runs[runs.length - 1].date : null;
  const latest = Object.values(latestRuns);
  return {
    scores,
    latestRuns,
    overall: mean([...numeric('core'), ...numeric('endorsed')]),
    core: mean(numeric('core')),
    endorsed: mean(numeric('endorsed')),
    testedCount: categories.filter(c => c.scored !== false && typeof scores[c.key] === 'number').length,
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
    bestAt: entry.best_at,
    icon: entry.icon ?? null,
    kind: entry.kind ?? 'general',
    access: entry.access ?? null,
    ...deriveScores(entry, meta, categories),
    ...deriveOpinion(entry.slug, categories),
    usage: getUsage(entry.slug),
    funding: getFunding(entry.slug),
  };
}

/** data/investors.json: investor name -> homepage, only for sites that were fetched and name the firm. */
export function getInvestorLinks(): Record<string, string> {
  return readJson<Record<string, string>>(path.join(DATA_DIR, 'investors.json')) ?? {};
}

export function getFunding(slug: string): Funding | null {
  return readJson<Funding>(path.join(agentDir(slug), 'funding.json'));
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

/** Leaderboard order: overall score, then how much public discussion exists. */
export function rankAgents(agents: Agent[]): Agent[] {
  return [...agents].sort(
    (a, b) =>
      (b.overall ?? -1) - (a.overall ?? -1) ||
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

/** Other agents in the same peer group, best first; general assistants fill in when the group is small. */
export function getRelatedAgents(slug: string, limit = 6): Agent[] {
  const all = getAgents();
  const self = all.find(a => a.slug === slug);
  if (!self) return [];
  const peers = rankAgents(all.filter(a => a.kind === self.kind && a.slug !== slug));
  if (peers.length >= limit) return peers.slice(0, limit);
  const fill = rankAgents(all.filter(a => a.kind === 'general' && a.kind !== self.kind && a.slug !== slug));
  return [...peers, ...fill].slice(0, limit);
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

/** likes + 2×reposts + replies. Views are not counted: they are inflated by the poster's own audience. */
export function engagementScore(q: Feedback): number {
  const m = q.metrics;
  if (!m || m.missing) return 0;
  return (m.likes ?? 0) + 2 * (m.reposts ?? 0) + (m.replies ?? 0);
}

export const PRICING_LABEL: Record<string, string> = {
  free: 'Free',
  freemium: 'Free tier',
  paid: 'Paid',
  credits: 'Pay as you go',
  'per-order': 'Per order',
  waitlist: 'Waitlist',
  'open-source': 'Open source',
  unknown: 'Not stated',
};

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

/* ---------- Use cases: one entry per job (data/jobs.json) ---------- */

export interface JobTested {
  agent: AgentRef;
  run: Run;
  /** 'run' = an explicit run on this job; 'dimension' = the latest run on the job's dimension. */
  via: 'run' | 'dimension';
  href: string;
}

export interface JobReported {
  agent: AgentRef;
  quote: Feedback;
  note?: string;
  outcome?: EvidenceOutcome;
  engagement: number;
}

/** One chip per assistant on a card: solid when tested, hollow when only reported. */
export interface JobAgent {
  agent: AgentRef;
  tested: JobTested | null;
  reported: JobReported | null;
}

export interface Job extends JobEntry {
  groupLabel: string;
  tested: JobTested[];
  reported: JobReported[];
  agents: JobAgent[];
  /** Sum of engagement over reported posts. */
  engagement: number;
  /** Newest of `added` and the reported posts' dates. */
  newest: string;
}

export interface RankedJob extends Job {
  votes: number;
  score: number;
  rank: number;
}

export type JobSort = 'top' | 'new';

let jobsFileCache: JobsFile | null = null;
function loadJobsFile(): JobsFile {
  if (jobsFileCache) return jobsFileCache;
  const file = path.join(DATA_DIR, 'jobs.json');
  jobsFileCache = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as JobsFile) : { version: 2, updated: '', groups: [], jobs: [] };
  return jobsFileCache;
}

export function getJobGroups(): JobGroup[] {
  return loadJobsFile().groups;
}

/** Every run on the roster, plus the latest run per agent and category (runs are date-ascending, so last wins). */
let runIndexCache: { byId: Map<string, { agent: AgentRef; run: Run }>; latest: Map<string, { agent: AgentRef; run: Run }[]> } | null = null;
function runIndex() {
  if (runIndexCache) return runIndexCache;
  const byId = new Map<string, { agent: AgentRef; run: Run }>();
  const latestByAgent = new Map<string, Map<string, Run>>();
  const agents = new Map<string, AgentRef>();
  for (const entry of getRoster()) {
    const agent: AgentRef = { slug: entry.slug, name: entry.name, icon: entry.icon ?? null };
    agents.set(entry.slug, agent);
    const perCat = new Map<string, Run>();
    for (const run of getRuns(entry.slug)) {
      byId.set(run.id, { agent, run });
      perCat.set(run.category, run);
    }
    latestByAgent.set(entry.slug, perCat);
  }
  const latest = new Map<string, { agent: AgentRef; run: Run }[]>();
  for (const [slug, perCat] of latestByAgent) {
    for (const [cat, run] of perCat) {
      if (typeof run.score !== 'number') continue; // N/A runs are not "tested"
      const list = latest.get(cat) ?? [];
      list.push({ agent: agents.get(slug)!, run });
      latest.set(cat, list);
    }
  }
  runIndexCache = { byId, latest };
  return runIndexCache;
}

/** Raw quotes by "agent/id" with founder, vendor and promo posts left out. Unlike getAllQuotes, neutral-only quotes stay. */
let rawQuoteCache: Map<string, { agent: AgentRef; quote: Feedback }> | null = null;
function rawQuotes() {
  if (rawQuoteCache) return rawQuoteCache;
  const map = new Map<string, { agent: AgentRef; quote: Feedback }>();
  for (const entry of getRoster()) {
    const agent: AgentRef = { slug: entry.slug, name: entry.name, icon: entry.icon ?? null };
    for (const quote of readJson<Feedback[]>(path.join(DATA_DIR, 'agents', entry.slug, 'feedback.json')) ?? []) {
      // Founder/vendor/promo posts never count; the site owner's own posts may stand as evidence (never as opinion).
      if (isFounderPost(quote) && quote.source !== 'david-post') continue;
      map.set(`${entry.slug}/${quote.id}`, { agent, quote });
    }
  }
  rawQuoteCache = map;
  return rawQuoteCache;
}

function testedFor(entry: JobEntry): JobTested[] {
  const { byId, latest } = runIndex();
  const out: JobTested[] = [];
  if (entry.runs?.length) {
    for (const id of entry.runs) {
      const hit = byId.get(id);
      if (!hit) continue;
      out.push({ agent: hit.agent, run: hit.run, via: 'run', href: hit.run.evidence_url ?? `/agents/${hit.agent.slug}` });
    }
  } else if (entry.dimension && entry.benchmark_task) {
    for (const hit of latest.get(entry.dimension) ?? []) {
      out.push({ agent: hit.agent, run: hit.run, via: 'dimension', href: hit.run.evidence_url ?? `/agents/${hit.agent.slug}` });
    }
  }
  const score = (t: JobTested) => (typeof t.run.score === 'number' ? t.run.score : -1);
  return out.sort((a, b) => score(b) - score(a) || a.agent.name.localeCompare(b.agent.name));
}

function buildJob(entry: JobEntry, groups: JobGroup[]): Job {
  const quotes = rawQuotes();
  const reported: JobReported[] = [];
  for (const e of entry.evidence) {
    const hit = quotes.get(`${e.agent}/${e.quote}`);
    if (!hit) {
      console.warn(`[jobs] ${entry.key}: evidence ${e.agent}/${e.quote} not found or excluded`);
      continue;
    }
    reported.push({ agent: hit.agent, quote: hit.quote, note: e.note, outcome: e.outcome, engagement: engagementScore(hit.quote) });
  }
  reported.sort((a, b) => b.engagement - a.engagement);
  const tested = testedFor(entry);
  const agents: JobAgent[] = [];
  const seen = new Map<string, JobAgent>();
  for (const t of tested) {
    if (seen.has(t.agent.slug)) continue;
    const ja = { agent: t.agent, tested: t, reported: null };
    seen.set(t.agent.slug, ja);
    agents.push(ja);
  }
  for (const r of reported) {
    const existing = seen.get(r.agent.slug);
    if (existing) {
      if (!existing.reported) existing.reported = r;
      continue;
    }
    const ja = { agent: r.agent, tested: null, reported: r };
    seen.set(r.agent.slug, ja);
    agents.push(ja);
  }
  const newest = [entry.added, ...reported.map(r => r.quote.date)].filter(Boolean).sort().at(-1) ?? entry.added;
  return {
    ...entry,
    groupLabel: groups.find(g => g.key === entry.group)?.label ?? entry.group,
    tested,
    reported,
    agents,
    engagement: reported.reduce((n, r) => n + r.engagement, 0),
    newest,
  };
}

let jobsCache: Job[] | null = null;
/** All jobs in file order, evidence joined to quotes and runs. */
export function getJobs(): Job[] {
  if (jobsCache) return jobsCache;
  const file = loadJobsFile();
  jobsCache = file.jobs.map(j => buildJob(j, file.groups));
  return jobsCache;
}

export function getJob(key: string): Job | null {
  return getJobs().find(j => j.key === key) ?? null;
}

export function getJobKeys(): string[] {
  return loadJobsFile().jobs.map(j => j.key);
}

export const RANK = {
  vote: 1,
  tested: 3,
  reported: 1,
  recency: 2,
  halfLifeDays: 60,
} as const;

/**
 * score = votes + 3·tested + 1·reported + log10(1 + engagement) + 2·0.5^(age / 60 days)
 * `tested` counts only explicit runs on this job. Dimension-derived tests are shown but not scored, otherwise every
 * job in a busy dimension would start far ahead and votes could never move it. Engagement is log-bounded so a single
 * viral post is worth about four points. Every job has evidence by lint rule, so votes reorder proven jobs; they
 * cannot promote an unproven one.
 */
export function jobScore(job: Job, votes: number, now = Date.now()): number {
  const tested = new Set(job.tested.filter(t => t.via === 'run').map(t => t.agent.slug)).size;
  const reported = new Set(job.reported.map(r => r.agent.slug)).size;
  const ageDays = Math.max(0, (now - new Date(job.newest).getTime()) / 86_400_000);
  return (
    RANK.vote * votes +
    RANK.tested * tested +
    RANK.reported * reported +
    Math.log10(1 + job.engagement) +
    RANK.recency * Math.pow(0.5, ageDays / RANK.halfLifeDays)
  );
}

export function rankJobs(jobs: Job[], votes: Record<string, number>, sort: JobSort, now = Date.now()): RankedJob[] {
  const scored = jobs.map(j => ({ ...j, votes: votes[j.key] ?? 0, score: jobScore(j, votes[j.key] ?? 0, now), rank: 0 }));
  if (sort === 'new') scored.sort((a, b) => b.added.localeCompare(a.added) || b.newest.localeCompare(a.newest) || a.title.localeCompare(b.title));
  else scored.sort((a, b) => b.score - a.score || b.engagement - a.engagement || a.title.localeCompare(b.title));
  return scored.map((j, i) => ({ ...j, rank: i + 1 }));
}

/** Lower-cased text a search can match against: title, one-liner, prompt, group, dimension, assistants, evidence notes. */
export function jobSearchText(job: Job): string {
  return [
    job.title,
    job.one_liner,
    job.prompt,
    job.groupLabel,
    job.dimension ? (CATEGORY_SHORT[job.dimension] ?? job.dimension) : '',
    job.caveat ?? '',
    ...job.agents.map(a => a.agent.name),
    ...job.reported.map(r => `${r.note ?? ''} ${r.quote.author}`),
  ]
    .join(' ')
    .toLowerCase();
}

/** Case-insensitive match; every word in the query must appear somewhere in the job's search text. */
export function jobMatches(job: Job, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = jobSearchText(job);
  return words.every(w => hay.includes(w));
}
