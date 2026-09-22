import fs from 'node:fs';
import path from 'node:path';

export interface ReportChange {
  date: string;
  title: string;
  body: string;
  runs: string[];
  pairs: [string, string][];
}

export interface ReportMatchup {
  pair: [string, string];
  body: string;
}

export interface Report {
  key: string;
  question: string;
  title: string;
  dimension: string;
  updated: string;
  pick: string;
  runner_up: string;
  verdict: string;
  summary: string;
  changes: ReportChange[];
  matchups: ReportMatchup[];
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

const samePair = (p: [string, string], a: string, b: string) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a);

/** Report entries that mention this pair, newest first, with the report they belong to. */
export function getEntriesForPair(a: string, b: string): { report: Report; change?: ReportChange; matchup?: ReportMatchup }[] {
  const out: { report: Report; change?: ReportChange; matchup?: ReportMatchup }[] = [];
  for (const report of getReports()) {
    for (const change of report.changes) if (change.pairs.some(p => samePair(p, a, b))) out.push({ report, change });
    for (const matchup of report.matchups) if (samePair(matchup.pair, a, b)) out.push({ report, matchup });
  }
  return out.sort((x, y) => (y.change?.date ?? y.report.updated).localeCompare(x.change?.date ?? x.report.updated));
}

/** Reports that rank this assistant, for the profile. */
export function getReportsForAgent(slug: string): Report[] {
  return getReports().filter(r => r.pick === slug || r.runner_up === slug || r.matchups.some(m => m.pair.includes(slug)));
}
