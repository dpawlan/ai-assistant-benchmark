export type AgentStatus = 'confirmed' | 'stretch';

export type CategoryGroup = 'core' | 'endorsed';

export type FeedbackKind = 'praise' | 'complaint' | 'use-case' | 'bug' | 'comparison' | 'other' | 'feature-request';

export type PublicSignal = 'low' | 'medium' | 'high' | 'unknown' | null;

export type ScoreValue = number | null;

export interface Category {
  key: string;
  label: string;
  group: CategoryGroup;
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
  meta?: AgentMeta;
  scores?: AgentScores;
  feedback?: Feedback[];
  summary?: string;
}
