import Link from 'next/link';
import type { AgentScores, Category, Run } from '@/lib/types';
import { ScoreCell } from './ScoreCell';

interface ScoreRowsProps {
  slug: string;
  scores: AgentScores;
  runs: Record<string, Run>;
  categories: Category[];
  overall: number | null;
  testedCount: number;
  hasTravelBreakdown: boolean;
}

export function ScoreRows({ slug, scores, runs, categories, overall, testedCount, hasTravelBreakdown }: ScoreRowsProps) {
  return <>
    <div className="ag-score-summary">
      <div><h2 className="ag-h2">General score</h2><p className="ag-sub">{testedCount} of {categories.length} dimensions tested</p></div>
      <ScoreCell value={overall} aggregate />
    </div>
    <div className="ag-dimension-list">
      {categories.map(category => {
        const value = scores[category.key];
        const href = category.key === 'travel' && hasTravelBreakdown ? `/agents/${slug}?benchmark=travel#scores` : runs[category.key]?.evidence_url ?? `/dimensions/${category.key}`;
        const external = !href.startsWith('/');
        return <Link key={category.key} href={href} className="ag-dimension-row" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          <span>{category.label}</span>
          <span className="ag-dimension-value">{value == null ? <span className="ag-score-empty">Not tested</span> : <ScoreCell value={value} />}<span className="ag-evidence-arrow" aria-hidden="true">↗</span></span>
        </Link>;
      })}
    </div>
    <p className="ag-score-foot"><Link href="/dimensions#how">Scoring methodology ↗</Link></p>
  </>;
}
