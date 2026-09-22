import fs from 'node:fs';
import path from 'node:path';

export interface ReportPick {
  slug: string;
  label: string;
  why: string;
}

export interface ReportPickSection {
  slug: string;
  heading: string;
  paragraphs: string[];
  flaws: string[];
}

export interface ReportCompetitor {
  slug: string;
  body: string;
}

export interface ReportUpdate {
  slug: string;
  date: string;
  title: string;
  paragraphs: string[];
  runs: string[];
  agents: string[];
}

export interface Report {
  key: string;
  question: string;
  title: string;
  dimension: string;
  published: string;
  updated: string;
  author?: string;
  cover: { tint: string; agents: string[] };
  intro: string[];
  picks: ReportPick[];
  who_for: string[];
  how_we_tested: string[];
  pick_sections: ReportPickSection[];
  competition: ReportCompetitor[];
  looking_ahead: string[];
  updates: ReportUpdate[];
}

interface ReportsFile {
  reports: Report[];
}

const FILE = path.join(process.cwd(), 'data', 'reports.json');

export function getReports(): Report[] {
  try {
    const f = JSON.parse(fs.readFileSync(FILE, 'utf8')) as ReportsFile;
    return [...f.reports].sort((a, b) => b.updated.localeCompare(a.updated));
  } catch {
    return [];
  }
}

export function getReport(key: string): Report | null {
  return getReports().find(r => r.key === key) ?? null;
}

export function getUpdate(key: string, slug: string): { report: Report; update: ReportUpdate } | null {
  const report = getReport(key);
  const update = report?.updates.find(u => u.slug === slug);
  return report && update ? { report, update } : null;
}

/** The primary pick of a report (first entry in picks). */
export const primaryPick = (r: Report) => r.picks[0]?.slug;

export const updatePath = (r: Report, u: ReportUpdate) => `/reports/${r.key}/updates/${u.slug}`;

export interface PairEntry {
  report: Report;
  update?: ReportUpdate;
  competitor?: ReportCompetitor;
  section?: ReportPickSection;
  date: string;
}

/** Everything a report says about this pair: updates that involve both, and the competition write-up when one is the pick. */
export function getEntriesForPair(a: string, b: string, dimensions: string[] = []): PairEntry[] {
  const out: PairEntry[] = [];
  const reports = getReports().filter(r => dimensions.length === 0 || dimensions.includes(r.dimension));
  for (const report of reports) {
    for (const update of report.updates) {
      if (update.agents.includes(a) && update.agents.includes(b)) out.push({ report, update, date: update.date });
    }
    const pick = primaryPick(report);
    const other = pick === a ? b : pick === b ? a : null;
    if (other) {
      const competitor = report.competition.find(c => c.slug === other);
      if (competitor) out.push({ report, competitor, date: report.updated });
      const section = report.pick_sections.find(ps => ps.slug === other);
      if (section) out.push({ report, section, date: report.updated });
    }
  }
  return out.sort((x, y) => y.date.localeCompare(x.date));
}

/** Reports that rank this assistant, for the profile. */
export function getReportsForAgent(slug: string): Report[] {
  return getReports().filter(
    r => r.picks.some(p => p.slug === slug) || r.competition.some(c => c.slug === slug) || r.updates.some(u => u.agents.includes(slug)),
  );
}

export function pickLabel(r: Report, slug: string): string | null {
  return r.picks.find(p => p.slug === slug)?.label ?? null;
}
