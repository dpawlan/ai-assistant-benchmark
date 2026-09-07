export type AgentStatus = 'confirmed' | 'stretch';

export type CategoryType = 'core' | 'endorsed';

export type FeedbackType = 'praise' | 'complaint' | 'use-case' | 'feature-request' | 'comparison';

export type ScoreValue = number | null | 'n/a';

export interface Category {
  id: string;
  label: string;
  type: CategoryType;
  description: string;
}

export interface Feedback {
  id: string;
  type: FeedbackType;
  text: string;
  author: string;
  source: string;
  sourceUrl: string;
  date: string;
}

export interface AgentScores {
  scheduling: ScoreValue;
  email: ScoreValue;
  research: ScoreValue;
  writing: ScoreValue;
  'task-management': ScoreValue;
  communication: ScoreValue;
  integration: ScoreValue;
  coding: ScoreValue;
  'data-analysis': ScoreValue;
  travel: ScoreValue;
  shopping: ScoreValue;
  health: ScoreValue;
  finance: ScoreValue;
  voice: ScoreValue;
}

export interface Agent {
  slug: string;
  name: string;
  vendor: string;
  url: string;
  status: AgentStatus;
  description: string;
  scores: AgentScores;
  summary: string;
  feedback: Feedback[];
}

export interface RosterEntry {
  slug: string;
  name: string;
  status: AgentStatus;
  feedbackCount: number;
}

export interface IndexData {
  meta: {
    version: string;
    lastUpdated: string;
    description: string;
  };
  summary: {
    totalAgents: number;
    confirmedAgents: number;
    stretchAgents: number;
    totalFeedbackRows: number;
    categoriesCount: number;
    coreCategories: number;
    endorsedCategories: number;
  };
  roster: RosterEntry[];
}

export interface AgentsData {
  agents: Agent[];
}

export interface CategoriesData {
  categories: Category[];
}
