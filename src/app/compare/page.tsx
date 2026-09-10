import { Metadata } from 'next';
import Link from 'next/link';
import { PairGrid, PairSpotlight } from '@/components/PairGrid';
import { PairTally, byRecord, getMatchups, getTestedAgents } from '@/lib/compare';
import { getAgents, getScoredCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Head to head',
  description: 'Pit two assistants against each other on the same tests, see who takes each dimension, and share the scorecard.',
};

export default function CompareIndex() {
  const dimensions = getScoredCategories().length;

  // One tally per unordered pair, keyed alphabetically so either side can be looked up.
  const tallies: Record<string, PairTally> = {};
  for (const c of getMatchups()) {
    const first = c.a.slug < c.b.slug;
    const [x, y] = first ? [c.a.slug, c.b.slug] : [c.b.slug, c.a.slug];
    tallies[`${x}|${y}`] = { a: first ? c.tally.a : c.tally.b, b: first ? c.tally.b : c.tally.a, compared: c.tally.compared };
  }

  const tested = byRecord(
    getTestedAgents().map(a => ({ slug: a.slug, name: a.name, icon: a.icon, kind: a.kind, testedCount: a.testedCount })),
    tallies,
  );
  const untested = getAgents().length - tested.length;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Head to head</h1>
        <p className="page-sub">
          Pick two assistants. Each of the {dimensions} dimensions goes to the higher tested score, and the card is ready to share.
        </p>
      </div>

      <section className="shelf" style={{ paddingTop: 28 }}>
        <PairSpotlight agents={tested} tallies={tallies} />
      </section>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">Standings</span>
        </h2>
        <PairGrid agents={tested} tallies={tallies} dimensions={dimensions} />
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
