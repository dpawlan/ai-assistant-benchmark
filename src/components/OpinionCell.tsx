import { isThin } from '@/lib/score';
import { OpinionStat } from '@/lib/types';

/** Public sentiment on a category: share of positive quotes on the ramp. Thin samples are marked. */
interface OpinionCellProps {
  stat: OpinionStat | undefined;
  /** Category cells: dashed edge only for thin samples, bare count when unscored. Overall cells spell it out. */
  compact?: boolean;
  /** Single-purpose label ("travel") shown under the overall share. */
  focus?: string | null;
}

export function OpinionCell({ stat, compact = false, focus = null }: OpinionCellProps) {
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
      <span className="sc op sc-thin" title={`${title}. Too few to score.`}>
        <span className="op-v">{stat.n}</span>
        {!compact && <span className="op-n">{stat.n === 1 ? 'quote' : 'quotes'}</span>}
      </span>
    );
  }
  const pct = Math.round(stat.score * 100);
  const thin = isThin(stat);
  const cls =
    stat.score >= 0.85 ? 'sc-5' : stat.score >= 0.7 ? 'sc-4' : stat.score >= 0.55 ? 'sc-3' : stat.score >= 0.45 ? 'sc-0' : stat.score >= 0.3 ? 'sc-n1' : 'sc-n2';
  return (
    <span className={`sc op ${cls}${thin ? ' thin' : ''}`} title={`${pct}% positive. ${title}${thin ? '. Thin sample.' : ''}${focus ? `. ${focus} only.` : ''}`}>
      <span className="op-v">{pct}%</span>
      {!compact && (thin ? <span className="op-n">thin</span> : focus ? <span className="op-n">{focus}</span> : null)}
    </span>
  );
}
