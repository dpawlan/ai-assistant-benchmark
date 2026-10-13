import Link from 'next/link';
import type { TravelSummary } from '@/lib/travel-rollup';
import { ScoreCell } from './ScoreCell';

export function TravelScore({ summary }: { summary: TravelSummary }) {
  return <Link href="/benchmarks/travel/grid" title="Travel scores">
    <ScoreCell value={summary.score ?? summary.legacyScore} aggregate={summary.score !== null} />
  </Link>;
}
