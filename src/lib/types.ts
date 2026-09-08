export type AgentStatus = 'confirmed' | 'stretch';

export type CategoryGroup = 'core' | 'endorsed';

export type FeedbackKind = 'praise' | 'complaint' | 'use-case' | 'bug' | 'comparison' | 'other' | 'feature-request';

export type PublicSignal = 'low' | 'medium' | 'high' | 'unknown' | null;

/** null = not tested yet, "n/a" = out of scope for this product, number = tested score (1–10) */
export type ScoreValue = number | 'n/a' | null;

export type RunOutcome = 'pass' | 'partial' | 'fail' | 'n/a';

/** How one public quote reads on one rubric category. */
export type Sentiment = 'pos' | 'neg' | 'mixed' | 'neutral';

/** data/agents/<slug>/opinion.json: per-quote, per-category sentiment, classified by reading each quote. */
export interface OpinionFile {
  classified_by: string;
  date: string;
  reviewed: boolean;
  quotes: Record<string, Record<string, Sentiment>>;
}

export interface OpinionStat {
  pos: number;
  neg: number;
  neutral: number;
  /** Quotes that speak to this category at all. */
  n: number;
  /** (pos - neg) / (pos + neg), or null below the minimum signed sample. */
  score: number | null;
}

export interface Category {
  key: string;
  label: string;
  group: CategoryGroup;
}

/** The published test for one category. */
export interface Task {
  key: string;
  task: string;
  prompt: string;
  pass: string[];
  anchors: Record<string, string>;
}

export interface TaskSet {
  version: string;
  scale: string;
  tasks: Task[];
}

/** One logged test of one agent on one category. Scores are derived from these. */
/** "task": the published prompt was sent verbatim. "observed": a real-life episode scored after the fact. */
export type RunProtocol = 'task' | 'observed';

export interface Run {
  id: string;
  category: string;
  protocol?: RunProtocol;
  date: string;
  score: number | 'n/a';
  outcome: RunOutcome;
  notes?: string;
  evidence_url?: string;
}

/** data/agents/<slug>/usage.json: derived from the reviewer's own iMessage thread with the assistant. */
export interface Usage {
  source: 'imessage';
  exported_at: string;
  analyzed_at: string;
  messages: number;
  from_me: number;
  from_agent: number;
  days_active: number;
  first: string | null;
  last: string | null;
  median_reply_s: number | null;
  p90_reply_s: number | null;
  unanswered: number;
  proactive_messages: number;
  episodes: number;
}

export interface ExcerptMessage {
  from: 'me' | 'agent';
  ts: string;
  text: string;
  attachment?: boolean;
}

export interface EvidenceSignals {
  turns: number;
  my_messages: number;
  agent_messages: number;
  first_reply_s: number | null;
  duration_min: number;
  agent_said_done: boolean;
  agent_said_cant: boolean;
  agent_asked_question: boolean;
  agent_initiated: boolean;
}

/** data/agents/<slug>/evidence/<id>.json: what's published behind one run. Excerpts are optional and off by default. */
export interface Evidence {
  id: string;
  agent: string;
  category: string;
  protocol?: RunProtocol;
  date: string;
  signals: EvidenceSignals;
  excerpt?: ExcerptMessage[];
  redacted?: boolean;
  published_at: string;
}

export interface Feedback {
  id: string;
  agent: string;
  quote: string;
  author: string;
  author_name: string;
  date: string;
  url: string;
  kind: FeedbackKind;
  tags: string[];
  source: string;
  collected_at: string;
  notes: string;
}

export interface AgentMeta {
  slug: string;
  name: string;
  site: string | null;
  handles: string[];
  status: AgentStatus;
  notes: string;
  product_class?: string | null;
  public_signal?: PublicSignal;
  likely_applicable?: string[];
  tagline?: string;
  icon?: string | null;
}

export interface AgentScores {
  [key: string]: ScoreValue;
}

export interface RosterEntry {
  slug: string;
  name: string;
  status: AgentStatus;
  site: string | null;
  feedback_count: number;
  public_signal: PublicSignal;
  tagline?: string;
  icon?: string | null;
}

export interface IndexData {
  updated: string;
  agent_count: number;
  feedback_count: number;
  confirmed: number;
  stretch: number;
  agents: RosterEntry[];
}

export interface Agent {
  slug: string;
  name: string;
  site: string | null;
  status: AgentStatus;
  feedbackCount: number;
  publicSignal: PublicSignal;
  tagline: string;
  icon: string | null;
  /** Derived per-category scores: latest run wins, then scores.json, then N/A pre-fill for stretch products. */
  scores: AgentScores;
  /** Latest run per category, when one exists. */
  latestRuns: Record<string, Run>;
  /** Mean of numeric core scores, null when none. */
  core: number | null;
  /** Mean of numeric endorsed scores, null when none. */
  endorsed: number | null;
  /** Categories with a numeric score. */
  testedCount: number;
  /** How many of the latest runs used the published prompt vs. were observed in real use. */
  taskRuns: number;
  observedRuns: number;
  /** Date of the most recent run, if any. */
  lastTested: string | null;
  /** Public opinion per category, from opinion.json. Founder posts excluded. */
  opinion: Record<string, OpinionStat>;
  opinionOverall: OpinionStat;
  /** Hands-on usage from the reviewer's own thread, when exported. */
  usage: Usage | null;
  meta?: AgentMeta;
  feedback?: Feedback[];
  summary?: string;
}
