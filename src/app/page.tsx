import Link from 'next/link';
import { CATEGORY_SHORT, getAgents, getCategories, getIndexData, getLatestFeed, getScoredCategories, rankAgents } from '@/lib/data';
import { BenchmarkStrip } from '@/components/BenchmarkStrip';
import { LatestFeed } from '@/components/LatestFeed';
import { Matrix } from '@/components/Matrix';

export default function HomePage() {
  const index = getIndexData();
  const agents = getAgents();
  const categories = getCategories();
  const feed = getLatestFeed(8);
  const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]));

  return (
    <div className="wrap wide">
      <div className="page-head home-head">
        <div>
          <h1 className="page-title">Scorecard</h1>
          <p className="page-sub">
            {index.agent_count} assistants, {getScoredCategories().length} dimensions, one scale. Overall is a running mean until an assistant is fully
            tested.
          </p>
        </div>
        <div className="home-head-right">
          <Link href="/about" className="head-link">
            About
          </Link>
          <Link href="/use-cases" className="head-prompt">
            <span className="head-prompt-q">Not sure what to use an assistant for?</span>
            <span className="head-prompt-a">See what people get them to do →</span>
          </Link>
        </div>
      </div>

      <BenchmarkStrip updated={index.updated} />

      <section className="shelf matrix-shelf">
        <Matrix agents={rankAgents(agents)} categories={categories} short={CATEGORY_SHORT} />
      </section>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Latest</span>
        </h2>
        <p className="shelf-sub">New tests and quotes.</p>
        <LatestFeed items={feed} categoryLabels={categoryLabels} />
      </section>
    </div>
  );
}
