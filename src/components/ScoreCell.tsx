import { scoreBucket } from '@/lib/score';
import { ScoreValue } from '@/lib/types';

interface ScoreCellProps {
  value: ScoreValue | undefined;
  /** Core / endorsed means render one decimal. */
  aggregate?: boolean;
}

/** One score on the blue ramp; "—" untested; "N/A" out of scope. */
export function ScoreCell({ value, aggregate = false }: ScoreCellProps) {
  if (value === 'n/a') return <span className="sc sc-na">N/A</span>;
  if (typeof value !== 'number') {
    return (
      <span className="sc sc-null" title="Not tested yet">
        —
      </span>
    );
  }
  const text = aggregate ? value.toFixed(1) : Number.isInteger(value) ? String(value) : value.toFixed(1);
  return <span className={`sc sc-${scoreBucket(value)}`}>{text}</span>;
}
