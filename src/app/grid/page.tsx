import { Metadata } from 'next';
import { CATEGORY_SHORT, getAgents, getCategories, getIndexData, getScoredCategories, rankAgents } from '@/lib/data';
import { Matrix } from '@/components/Matrix';
import { ScoreboardHead } from '@/components/ScoreboardHead';

export const metadata: Metadata = { title: 'Scorecard grid' };

export default function GridPage() {
  const index = getIndexData();
  const agents = rankAgents(getAgents());
  const scored = getScoredCategories();
  const tested = agents.filter(a => a.overall !== null).length;

  return (
    <div className="wrap mid">
      <ScoreboardHead tested={tested} total={index.agent_count} tasks={scored.length} />
      <section className="shelf matrix-shelf">
        <Matrix agents={agents} categories={getCategories()} short={CATEGORY_SHORT} compact />
      </section>
    </div>
  );
}
