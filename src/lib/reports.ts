import fs from 'node:fs';
import path from 'node:path';
import { getAgents } from '@/lib/data';
import { excerpt, isTrue, list, parseFrontmatter, slugify, splitSections, str } from '@/lib/md';

/**
 * Reports live in data/reports/<key>/index.md with updates in data/reports/<key>/updates/<slug>.md.
 * Frontmatter carries the structured bits; the body is markdown with `##` sections. Recognised
 * headings: "Who this is for", "How we tested", "<Label>: <Assistant name>" (a pick section, with an
 * optional "### Flaws but not dealbreakers" list), "The competition" (one `### <Assistant name>` per
 * entry), "What to look forward to". Any other `##` section is rendered as written, in place.
 */

export interface ReportPick {
  slug: string;
  label: string;
  why: string;
}

export interface ReportPickSection {
  slug: string;
  heading: string;
  body: string;
  flaws: string;
  excerpt: string;
}

export interface ReportCompetitor {
  slug: string;
  body: string;
  excerpt: string;
}

export interface ReportUpdate {
  slug: string;
  date: string;
  title: string;
  body: string;
  excerpt: string;
  runs: string[];
  agents: string[];
}

export type ReportSection =
  | { type: 'who'; body: string }
  | { type: 'how'; body: string }
  | { type: 'pick'; section: ReportPickSection }
  | { type: 'competition'; entries: ReportCompetitor[] }
  | { type: 'ahead'; body: string }
  | { type: 'extra'; id: string; heading: string; body: string };

export interface Report {
  key: string;
  question: string;
  title: string;
  dimension: string;
  published: string;
  updated: string;
  author?: string;
  preview: boolean;
  cover: { tint: string; agents: string[] };
  intro: string;
  excerpt: string;
  picks: ReportPick[];
  sections: ReportSection[];
  pick_sections: ReportPickSection[];
  competition: ReportCompetitor[];
  updates: ReportUpdate[];
}

const DIR = path.join(process.cwd(), 'data', 'reports');

let nameIndex: Map<string, string> | null = null;
function slugForName(name: string): string | null {
  if (!nameIndex) nameIndex = new Map(getAgents().flatMap(a => [[a.name.toLowerCase(), a.slug], [a.slug, a.slug]]));
  return nameIndex.get(name.trim().toLowerCase()) ?? null;
}

function parseUpdate(slug: string, raw: string): ReportUpdate {
  const { meta, body } = parseFrontmatter(raw);
  return { slug, date: str(meta.date), title: str(meta.title, slug), body, excerpt: excerpt(body), runs: list(meta.runs), agents: list(meta.agents) };
}

function parseReport(key: string, raw: string, updates: ReportUpdate[]): Report {
  const { meta, body } = parseFrontmatter(raw);
  const picks: ReportPick[] = list(meta.picks).map(line => {
    const [slug = '', label = '', ...why] = line.split('|').map(s => s.trim());
    return { slug, label, why: why.join(' | ') };
  });
  const { lead, sections: raw2 } = splitSections(body, 2);
  const sections: ReportSection[] = [];
  const pick_sections: ReportPickSection[] = [];
  const competition: ReportCompetitor[] = [];
  for (const s of raw2) {
    const h = s.heading;
    if (/^who this is for$/i.test(h)) sections.push({ type: 'who', body: s.body });
    else if (/^how we tested$/i.test(h)) sections.push({ type: 'how', body: s.body });
    else if (/^what to look forward to$/i.test(h)) sections.push({ type: 'ahead', body: s.body });
    else if (/^the competition$/i.test(h)) {
      const entries = splitSections(s.body, 3).sections.flatMap(e => {
        const slug = slugForName(e.heading);
        if (!slug) { console.warn(`reports/${key}: unknown assistant "${e.heading}" in The competition`); return []; }
        return [{ slug, body: e.body, excerpt: excerpt(e.body) }];
      });
      competition.push(...entries);
      sections.push({ type: 'competition', entries });
    } else {
      const m = /^([^:]+):\s*(.+)$/.exec(h);
      const slug = m ? slugForName(m[2]) : null;
      if (slug) {
        const { lead: main, sections: subs } = splitSections(s.body, 3);
        const flaws = subs.find(x => /flaw/i.test(x.heading))?.body ?? '';
        const section = { slug, heading: h, body: main, flaws, excerpt: excerpt(main) };
        pick_sections.push(section);
        sections.push({ type: 'pick', section });
      } else {
        sections.push({ type: 'extra', id: slugify(h), heading: h, body: s.body });
      }
    }
  }
  return {
    key,
    question: str(meta.question),
    title: str(meta.title, key),
    dimension: str(meta.dimension),
    published: str(meta.published),
    updated: str(meta.updated) || str(meta.published),
    author: str(meta.author) || undefined,
    preview: isTrue(meta.preview),
    cover: { tint: str(meta.cover_tint, '#eef1f5'), agents: list(meta.cover_agents) },
    intro: lead,
    excerpt: excerpt(lead),
    picks,
    sections,
    pick_sections,
    competition,
    updates: updates.sort((a, b) => b.date.localeCompare(a.date)),
  };
}

export function getReports(): Report[] {
  try {
    return fs.readdirSync(DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && fs.existsSync(path.join(DIR, d.name, 'index.md')))
      .map(d => {
        const dir = path.join(DIR, d.name);
        const updDir = path.join(dir, 'updates');
        const updates = fs.existsSync(updDir)
          ? fs.readdirSync(updDir).filter(f => f.endsWith('.md')).map(f => parseUpdate(f.replace(/\.md$/, ''), fs.readFileSync(path.join(updDir, f), 'utf8')))
          : [];
        return parseReport(d.name, fs.readFileSync(path.join(dir, 'index.md'), 'utf8'), updates);
      })
      .sort((a, b) => b.updated.localeCompare(a.updated));
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

/** Everything a report says about this pair: updates that involve both, and the write-up on the non-pick when one is the pick. */
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
