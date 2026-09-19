import Link from 'next/link';
import { CATEGORY_SHORT, getAgents, getIndexData, getLatestFeed, getScoredCategories, rankAgents } from '@/lib/data';
import { RankedList } from '@/components/RankedList';
import { ViewSwitch } from '@/components/ViewSwitch';
import { LatestFeed } from '@/components/LatestFeed';
import { getCategories } from '@/lib/data';

export default function HomePage() {
  const index = getIndexData();
  const agents = rankAgents(getAgents());
  const scored = getScoredCategories();
  const feed = getLatestFeed(3);
  const categoryLabels = Object.fromEntries(getCategories().map(c => [c.key, c.label]));
  const tested = agents.filter(a => a.overall !== null).length;

  return (
    <div className="wrap">
      <div className="page-head home-head">
        <div>
          <h1 className="page-title">Which assistant should you text?</h1>
          <p className="page-sub">
            {tested} of {index.agent_count} assistants tested so far on the same {scored.length} tasks, scored 1 to 10 after real use.
          </p>
        </div>
        <ViewSwitch />
      </div>

      <RankedList agents={agents} categories={scored} short={CATEGORY_SHORT} />

      <section className="shelf latest-shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Latest</span>
        </h2>
        <LatestFeed items={feed} categoryLabels={categoryLabels} />
        <p className="shelf-more">
          <Link href="/grid">See every score in the full grid</Link>
        </p>
      </section>
    </div>
  );
}
