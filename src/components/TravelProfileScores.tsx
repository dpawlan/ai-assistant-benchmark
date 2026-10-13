import Link from 'next/link';
import protocol from '../../data/travel-protocol-v1.json';
import type { TravelSummary } from '@/lib/travel-rollup';
import { ScoreCell } from './ScoreCell';
import { TravelCompletionTime } from './TravelCompletionTime';

export function TravelProfileScores({ slug, summary }: { slug: string; summary: TravelSummary | null }) {
  const completed = summary?.completed ?? 0;
  return <>
    <div className="ag-score-summary">
      <div><h2 className="ag-h2">Travel score</h2><p className="ag-sub">{completed > 0 ? `${completed} of ${protocol.length} dimensions tested` : 'No published Travel tests yet'}</p></div>
      <ScoreCell value={summary?.score} aggregate />
    </div>
    <div className="ag-dimension-list">
      {protocol.map(dimension => {
        const score = summary?.scores[dimension.id];
        return <Link key={dimension.id} href={`/benchmarks/travel/dimensions/${dimension.id}${score === undefined ? '' : `#${slug}`}`} className="ag-dimension-row">
          <span>{dimension.title}</span>
          <span className="ag-dimension-value">{score === undefined ? <span className="ag-score-empty">Not tested</span> : dimension.id === 19 ? <TravelCompletionTime agent={slug} /> : <ScoreCell value={score} />}<span className="ag-evidence-arrow" aria-hidden="true">↗</span></span>
        </Link>;
      })}
    </div>
    {slug === 'miso' && completed > 0 && <p className="ag-score-foot">* Booking time excludes prior traveler-profile setup.</p>}
    <p className="ag-score-foot"><Link href="/benchmarks/travel/dimensions#how">Scoring methodology ↗</Link></p>
  </>;
}
