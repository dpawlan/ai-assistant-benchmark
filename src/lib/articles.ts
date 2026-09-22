import fs from 'node:fs';
import path from 'node:path';

export interface Article {
  slug: string;
  title: string;
  dek: string;
  date: string;
  author: string;
  kind: string;
  report: string | null;
  update: string | null;
  agents: string[];
  body: string;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] };

const DIR = path.join(process.cwd(), 'data', 'articles');

function parse(slug: string, raw: string): Article {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  const meta: Record<string, string> = {};
  if (m) for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return {
    slug,
    title: meta.title ?? slug,
    dek: meta.dek ?? '',
    date: meta.date ?? '',
    author: meta.author ?? '',
    kind: meta.kind ?? 'Article',
    report: meta.report || null,
    update: meta.update || null,
    agents: (meta.agents ?? '').split(',').map(s => s.trim()).filter(Boolean),
    body: m ? m[2].trim() : raw.trim(),
  };
}

export function getArticles(): Article[] {
  try {
    return fs.readdirSync(DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => parse(f.replace(/\.md$/, ''), fs.readFileSync(path.join(DIR, f), 'utf8')))
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function getArticle(slug: string): Article | null {
  return getArticles().find(a => a.slug === slug) ?? null;
}

export const getArticlesForReport = (key: string) => getArticles().filter(a => a.report === key);
export const getArticleForUpdate = (key: string, update: string) => getArticles().find(a => a.report === key && a.update === update) ?? null;
export const getArticlesForPair = (a: string, b: string) => getArticles().filter(x => x.agents.includes(a) && x.agents.includes(b));

/** Minimal markdown: paragraphs, ## headings, > quotes, - lists. Inline handled by <Inline>. */
export function toBlocks(body: string): Block[] {
  const out: Block[] = [];
  for (const chunk of body.split(/\n\s*\n/)) {
    const t = chunk.trim();
    if (!t) continue;
    if (t.startsWith('## ')) out.push({ type: 'h2', text: t.slice(3) });
    else if (t.startsWith('> ')) out.push({ type: 'quote', text: t.replace(/^> ?/gm, '') });
    else if (/^- /.test(t)) out.push({ type: 'ul', items: t.split('\n').map(l => l.replace(/^- /, '')) });
    else out.push({ type: 'p', text: t.replace(/\n/g, ' ') });
  }
  return out;
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / 220));
}
