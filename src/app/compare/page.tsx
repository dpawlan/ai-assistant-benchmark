import { Metadata } from 'next';
import Link from 'next/link';
import { AgentIcon } from '@/components/AgentIcon';
import { PairPicker } from '@/components/PairPicker';
import { comparePath, getMatchups, getTestedAgents, verdict } from '@/lib/compare';
import { getAgents, getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Head to head',
  description: 'Pit two assistants against each other on the same tests, see who takes each dimension, and share the scorecard.',
};

export default function CompareIndex() {
  const tested = getTestedAgents();
  const matchups = getMatchups();
  const categories = getCategories();
  const untested = getAgents().length - tested.length;

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Head to head</h1>
        <p className="page-sub">
          Pick two assistants. Each of the {categories.length} dimensions goes to the higher tested score, and the card is ready to share.
        </p>
      </div>

      <section className="shelf" style={{ paddingTop: 28 }}>
        <PairPicker options={tested.map(a => ({ slug: a.slug, name: a.name }))} />
        <p className="hh-pick-note">
          {tested.length} tested {tested.length === 1 ? 'assistant' : 'assistants'} to choose from.
          {untested > 0 && (
            <>
              {' '}
              The other {untested} have no logged runs yet. <Link href="/request">Request a test</Link>
            </>
          )}
        </p>
      </section>

      <section className="shelf">
        <h2 className="shelf-title">
          <span className="shelf-head">{matchups.length} matchups</span>
        </h2>
        <p className="shelf-sub">Every pair of tested assistants, with the current tally.</p>
        <div className="hh-list">
          {matchups.map(c => {
            const v = verdict(c);
            return (
              <Link key={`${c.a.slug}-${c.b.slug}`} href={comparePath(c.a.slug, c.b.slug)} className="hh-item">
                <span className="hh-item-side">
                  <AgentIcon name={c.a.name} icon={c.a.icon} size={40} />
                  <span className="hh-item-name">{c.a.name}</span>
                </span>
                <span className="hh-item-mid">
                  <span className="hh-item-num">
                    {v.tally.a}–{v.tally.b}
                  </span>
                  <span className="hh-item-sub">{v.tally.compared ? `${v.tally.compared} compared` : 'not compared yet'}</span>
                </span>
                <span className="hh-item-side right">
                  <span className="hh-item-name">{c.b.name}</span>
                  <AgentIcon name={c.b.name} icon={c.b.icon} size={40} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
