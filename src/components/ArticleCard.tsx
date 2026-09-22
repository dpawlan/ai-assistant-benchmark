import Link from 'next/link';
import { formatDate } from '@/lib/data';
import { readingMinutes, type Article } from '@/lib/articles';
import type { Agent } from '@/lib/types';
import type { Report } from '@/lib/reports';
import { ArticleHero } from '@/components/ArticleHero';

export function ArticleCard({ article, report, bySlug, showReport = true }: { article: Article; report: Report | null; bySlug: Record<string, Agent>; showReport?: boolean }) {
  const agents = article.agents.map(s => bySlug[s]).filter(Boolean);
  return (
    <Link href={`/articles/${article.slug}`} className="art-card">
      <ArticleHero article={article} report={report} agents={agents} bySlug={bySlug} size="thumb" />
      <span className="art-card-text">
        <span className="art-card-meta">
          {article.kind}, {formatDate(article.date)}
          {showReport && report ? `, from ${report.title}` : ''}
        </span>
        <span className="art-card-title">{article.title}</span>
        <span className="art-card-dek">{article.dek}</span>
        <span className="art-card-foot">By {article.author}. {readingMinutes(article.body)} minute read.</span>
      </span>
    </Link>
  );
}
