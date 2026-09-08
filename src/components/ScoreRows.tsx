import Link from 'next/link';
import { formatDate } from '@/lib/data';
import { AgentScores, Category, Run } from '@/lib/types';
import { ScoreCell } from './ScoreCell';

interface ScoreRowsProps {
  scores: AgentScores;
  runs: Record<string, Run>;
  categories: Category[];
  /** Number of public quotes attached to each category, for the "n quotes" link. */
  quoteCounts?: Record<string, number>;
}

const OUTCOME: Record<string, string> = { pass: 'Pass', partial: 'Partial', fail: 'Fail', 'n/a': 'N/A' };

/** The 14 category rows. Scored rows show the run behind the number; rows with quotes link to them. */
export function ScoreRows({ scores, runs, categories, quoteCounts = {} }: ScoreRowsProps) {
  const groups: { title: string; items: Category[] }[] = [
    { title: 'Core', items: categories.filter(c => c.group === 'core') },
    { title: 'Endorsed', items: categories.filter(c => c.group === 'endorsed') },
  ];

  return (
    <div>
      {groups.map(group => (
        <div key={group.title}>
          <h3 className="group-title">{group.title}</h3>
          <div className="info-list">
            {group.items.map(category => {
              const run = runs[category.key];
              const n = quoteCounts[category.key] ?? 0;
              const hasLine = run || n > 0;
              return (
                <div key={category.key} className={`info-row${hasLine ? ' has-run' : ''}`}>
                  <span className="il">
                    <Link href={`/categories/${category.key}`} className="il-link">
                      {category.label}
                    </Link>
                    {hasLine && (
                      <span className="run-line">
                        {run && (
                          <>
                            {OUTCOME[run.outcome] ?? run.outcome} · {run.protocol === 'task' ? 'test' : 'observed'} · {formatDate(run.date, 'short')}
                            {run.notes ? ` · ${run.notes}` : ''}
                            {run.evidence_url && (
                              <>
                                {' · '}
                                {run.evidence_url.startsWith('/') ? (
                                  <Link href={run.evidence_url}>Read the thread</Link>
                                ) : (
                                  <a href={run.evidence_url} target="_blank" rel="noopener noreferrer">
                                    Evidence
                                  </a>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {run && n > 0 && ' · '}
                        {n > 0 && <a href={`#quotes=${category.key}`}>{n === 1 ? '1 quote' : `${n} quotes`}</a>}
                      </span>
                    )}
                  </span>
                  <ScoreCell value={scores[category.key]} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
