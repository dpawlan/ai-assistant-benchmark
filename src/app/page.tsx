import { CATEGORY_SHORT, getAgents, getCategories, getIndexData, getLatestFeed, rankAgents } from '@/lib/data';
import { BenchmarkStrip } from '@/components/BenchmarkStrip';
import { LatestFeed } from '@/components/LatestFeed';
import { Matrix } from '@/components/Matrix';

export default function HomePage() {
  const index = getIndexData();
  const agents = getAgents();
  const categories = getCategories();
  const anyTested = agents.some(a => a.testedCount > 0);
  const feed = getLatestFeed(8);
  const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]));

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Scorecard</h1>
        <p className="page-sub">
          {index.agent_count} assistants you can text, scored on the same {categories.length} tests. Toggle between the
          benchmark and what people say publicly; click a column to sort by it; click a name for the full profile.
          {!anyTested && ' Nothing is benchmarked yet: blanks are untested, not zero.'}
        </p>
      </div>

      <BenchmarkStrip updated={index.updated} />

      <section className="shelf matrix-shelf">
        <Matrix agents={rankAgents(agents)} categories={categories} short={CATEGORY_SHORT} />
      </section>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Latest</span>
        </h2>
        <p className="shelf-sub">New tests and new public quotes, newest first. Quotes are sentiment, not score.</p>
        <LatestFeed items={feed} categoryLabels={categoryLabels} />
      </section>
    </div>
  );
}
