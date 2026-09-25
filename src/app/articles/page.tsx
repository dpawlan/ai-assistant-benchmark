import Link from 'next/link';
import { Metadata } from 'next';
import { getAgents } from '@/lib/data';
import { getArticles } from '@/lib/articles';
import { getReport } from '@/lib/reports';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = { title: 'Writing' };

export default function ArticlesPage() {
  const articles = getArticles();
  const bySlug = Object.fromEntries(getAgents().map(a => [a.slug, a]));
  return (
    <div className="wrap mid">
      <div className="page-head">
        <h1 className="page-title">Writing</h1>
        <p className="page-sub">
          Analysis and opinion, dated and signed. The <Link href="/reports">reports</Link> carry the verdicts; this is where we argue about them.
        </p>
      </div>
      {articles.some(a => a.preview) && <p className="rp-preview">Preview with placeholder prose.</p>}
      <div className="rp-writing-list art-index">
        {articles.map(a => <ArticleCard key={a.slug} article={a} report={a.report ? getReport(a.report) : null} bySlug={bySlug} />)}
      </div>
    </div>
  );
}
