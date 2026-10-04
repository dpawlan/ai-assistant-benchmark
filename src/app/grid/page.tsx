import { Metadata } from 'next';
import { CATEGORY_SHORT, getAgents, getCategories, getScoredCategories, rankAgents } from '@/lib/data';
import { Matrix } from '@/components/Matrix';
import { ScoreboardHead } from '@/components/ScoreboardHead';

export const metadata: Metadata = { title: 'Scorecard grid' };

export default function GridPage() {
  const agents = rankAgents(getAgents().filter(a => a.kind === 'general'));
  const scored = getScoredCategories();
  const tested = agents.filter(a => a.overall !== null).length;

  return (
    <div className="wrap mid">
      <ScoreboardHead tested={tested} total={agents.length} tasks={scored.length} />
      <section className="shelf matrix-shelf">
        <Matrix agents={agents} categories={getCategories()} short={CATEGORY_SHORT} compact />
      </section>
    </div>
  );
}
