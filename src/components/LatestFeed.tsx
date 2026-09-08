import Link from 'next/link';
import { FeedItem, formatDate } from '@/lib/data';
import { AgentIcon } from './AgentIcon';
import { ScoreCell } from './ScoreCell';
import { KIND_LABEL, sourceName } from './QuoteItem';

interface LatestFeedProps {
  items: FeedItem[];
  categoryLabels: Record<string, string>;
}

const OUTCOME: Record<string, string> = { pass: 'Pass', partial: 'Partial', fail: 'Fail', 'n/a': 'N/A' };

/** Newest tests and quotes across the benchmark: the changelog, in feed form. */
export function LatestFeed({ items, categoryLabels }: LatestFeedProps) {
  if (items.length === 0) return <p className="empty-state">Nothing yet.</p>;

  return (
    <div className="feed">
      {items.map(item => (
        <article key={item.kind === 'run' ? `run-${item.agent.slug}-${item.run.id}` : `q-${item.quote.id}`} className={`feed-item ${item.kind}`}>
          <Link href={`/agents/${item.agent.slug}`} className="feed-icon" aria-label={item.agent.name}>
            <AgentIcon name={item.agent.name} icon={item.agent.icon} size={32} className="q-agent-icon" />
          </Link>
          <div className="feed-body">
            <div className="feed-head">
              <Link href={`/agents/${item.agent.slug}`} className="feed-agent">
                {item.agent.name}
              </Link>
              {item.kind === 'run' ? (
                <span className="feed-tag run">Tested</span>
              ) : (
                <span className="feed-tag">{KIND_LABEL[item.quote.kind] ?? 'Quote'}</span>
              )}
              <span className="feed-date">{formatDate(item.date, 'short')}</span>
            </div>

            {item.kind === 'run' ? (
              <div className="feed-run">
                <ScoreCell value={item.run.score} />
                <span className="feed-run-text">
                  <Link href={`/categories/${item.run.category}`} className="feed-cat">
                    {categoryLabels[item.run.category] ?? item.run.category}
                  </Link>
                  {' · '}
                  {OUTCOME[item.run.outcome] ?? item.run.outcome}
                  {item.run.notes ? ` · ${item.run.notes}` : ''}
                  {item.run.evidence_url && (
                    <>
                      {' · '}
                      {item.run.evidence_url.startsWith('/') ? (
                        <Link href={item.run.evidence_url}>Read the thread</Link>
                      ) : (
                        <a href={item.run.evidence_url} target="_blank" rel="noopener noreferrer">
                          Evidence
                        </a>
                      )}
                    </>
                  )}
                </span>
              </div>
            ) : (
              <>
                <p className="q-text clamp">{item.quote.quote}</p>
                <div className="q-meta">
                  <span className="feed-author">{item.quote.author || item.quote.author_name || 'Anonymous'}</span>
                  {item.categories.map(c => (
                    <Link key={c} href={`/categories/${c}`} className="q-cat">
                      {categoryLabels[c] ?? c}
                    </Link>
                  ))}
                  {item.quote.url && (
                    <a href={item.quote.url} target="_blank" rel="noopener noreferrer">
                      Open on {sourceName(item.quote)}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
