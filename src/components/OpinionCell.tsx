import { OpinionStat } from '@/lib/types';

/** Public sentiment on a category: share of positive quotes on the ramp, sample size underneath. */
export function OpinionCell({ stat }: { stat: OpinionStat | undefined }) {
  if (!stat || stat.n === 0) {
    return (
      <span className="sc sc-null" title="No public quotes about this">
        —
      </span>
    );
  }
  const title = `${stat.pos} positive · ${stat.neg} negative · ${stat.neutral} neutral · ${stat.n} quotes`;
  if (stat.score === null) {
    return (
      <span className="sc op sc-thin" title={`${title}. Too few signed quotes for a score.`}>
        <span className="op-v">{stat.n}</span>
        <span className="op-n">{stat.n === 1 ? 'quote' : 'quotes'}</span>
      </span>
    );
  }
  const pct = Math.round(stat.score * 100);
  const cls =
    stat.score >= 0.85 ? 'sc-5' : stat.score >= 0.7 ? 'sc-4' : stat.score >= 0.55 ? 'sc-3' : stat.score >= 0.45 ? 'sc-0' : stat.score >= 0.3 ? 'sc-n1' : 'sc-n2';
  return (
    <span className={`sc op ${cls}`} title={`${pct}% of signed quotes positive. ${title}`}>
      <span className="op-v">{pct}%</span>
      <span className="op-n">{stat.n}</span>
    </span>
  );
}
