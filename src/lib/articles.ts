import fs from 'node:fs';
import path from 'node:path';
import { isTrue, list, parseFrontmatter, str } from '@/lib/md';

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
  hero: string | null;
  heroCaption: string;
  takeaways: string[];
  preview: boolean;
  body: string;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] };

const DIR = path.join(process.cwd(), 'data', 'articles');

function parse(slug: string, raw: string): Article {
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug,
    title: str(meta.title, slug),
    dek: str(meta.dek),
    date: str(meta.date),
    author: str(meta.author),
    kind: str(meta.kind, 'Article'),
    report: str(meta.report) || null,
    update: str(meta.update) || null,
    agents: list(meta.agents),
    hero: str(meta.hero) || null,
    heroCaption: str(meta.hero_caption),
    takeaways: str(meta.takeaways).split('|').map(s => s.trim()).filter(Boolean),
    preview: isTrue(meta.preview),
    body,
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
