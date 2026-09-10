import { Metadata } from 'next';
import Link from 'next/link';
import { PairGrid, PairTally } from '@/components/PairGrid';
import { getMatchups, getTestedAgents } from '@/lib/compare';
import { getAgents, getScoredCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Head to head',
  description: 'Pit two assistants against each other on the same tests, see who takes each dimension, and share the scorecard.',
};

export default function CompareIndex() {
  const tested = getTestedAgents();
  const dimensions = getScoredCategories().length;
  const untested = getAgents().length - tested.length;

  // One tally per unordered pair, keyed alphabetically so the client can look either side up.
  const tallies: Record<string, PairTally> = {};
  for (const c of getMatchups()) {
    const first = c.a.slug < c.b.slug;
    const [x, y] = first ? [c.a.slug, c.b.slug] : [c.b.slug, c.a.slug];
    tallies[`${x}|${y}`] = { a: first ? c.tally.a : c.tally.b, b: first ? c.tally.b : c.tally.a, compared: c.tally.compared };
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Head to head</h1>
        <p className="page-sub">
          Pick two assistants. Each of the {dimensions} dimensions goes to the higher tested score, and the card is ready to share.
        </p>
      </div>

      <section className="shelf" style={{ paddingTop: 28 }}>
        <PairGrid
          agents={tested.map(a => ({ slug: a.slug, name: a.name, icon: a.icon, kind: a.kind, testedCount: a.testedCount }))}
          tallies={tallies}
          dimensions={dimensions}
        />
        <p className="hh-pick-note">
          {tested.length} tested {tested.length === 1 ? 'assistant' : 'assistants'}.
          {untested > 0 && (
            <>
              {' '}
              The other {untested} have no logged runs yet. <Link href="/request">Request a test</Link>
            </>
          )}
        </p>
      </section>
    </div>
  );
}
