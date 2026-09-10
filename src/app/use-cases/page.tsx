import { Metadata } from 'next';
import Link from 'next/link';
import { QuoteItem } from '@/components/QuoteItem';
import { CATEGORY_SHORT, getTrendingAgents, getTrendingUseCases } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Trending use cases',
  description: 'What people are actually doing with AI assistants you can text, ranked by engagement on X. Every entry links to the original post.',
};

/** Public posts describing something an assistant did, ranked by engagement with a recency boost. Optional ?agent= filter. */
export default async function UseCasesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const agentSlug = typeof params.agent === 'string' ? params.agent : undefined;
  const agents = getTrendingAgents();
  const active = agents.find(a => a.slug === agentSlug);
  const items = getTrendingUseCases(40, active?.slug);

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Trending use cases</h1>
        <p className="page-sub">What people are actually doing with these assistants, ranked by engagement on X. Each one links to the original post.</p>
      </div>

      <div className="trend-filters" aria-label="Filter by assistant">
        <Link href="/use-cases" className={`chip${active ? '' : ' blue'}`}>
          All
        </Link>
        {agents.map(a => (
          <Link key={a.slug} href={`/use-cases?agent=${a.slug}`} className={`chip${active?.slug === a.slug ? ' blue' : ''}`}>
            {a.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No use cases with engagement data yet.</p>
      ) : (
        <div className="trend-list">
          {items.map(t => (
            <div key={t.quote.id} className="trend-item">
              <span className="trend-rank">{t.rank}</span>
              <QuoteItem quote={t.quote} agent={t.agent} categories={t.categories} categoryLabels={CATEGORY_SHORT} />
            </div>
          ))}
        </div>
      )}

      <p className="trend-note">
        Ranked by likes, reposts and replies on the original post, with newer posts weighted up. Founder and vendor posts are left out. Posts are shown as
        written; the scorecard, not this page, is the benchmark.
      </p>
    </div>
  );
}
