import { Metadata } from 'next';
import { CATEGORY_SHORT, getAgents, getCategories, getIndexData, getScoredCategories, rankAgents } from '@/lib/data';
import { Matrix } from '@/components/Matrix';
import { ViewSwitch } from '@/components/ViewSwitch';

export const metadata: Metadata = { title: 'Scorecard grid | Assistant Benchmark' };

export default function GridPage() {
  const index = getIndexData();
  const agents = rankAgents(getAgents());
  const scored = getScoredCategories();
  const tested = agents.filter(a => a.overall !== null).length;

  return (
    <div className="wrap wide">
      <div className="page-head home-head">
        <div>
          <h1 className="page-title">Every score, one grid</h1>
          <p className="page-sub">
            {tested} of {index.agent_count} assistants tested on the same {scored.length} tasks. Click a column to sort by it, or a name for the full profile.
          </p>
        </div>
        <ViewSwitch />
      </div>
      <section className="shelf matrix-shelf">
        <Matrix agents={agents} categories={getCategories()} short={CATEGORY_SHORT} compact />
      </section>
    </div>
  );
}
