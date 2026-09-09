import Link from 'next/link';
import { Feedback } from '@/lib/types';
import { AgentIcon } from './AgentIcon';

export const KIND_LABEL: Record<string, string> = {
  praise: 'Praise',
  complaint: 'Complaint',
  'use-case': 'Use case',
  bug: 'Bug',
  comparison: 'Comparison',
  'feature-request': 'Feature request',
  other: 'Other',
};

export function sourceName(item: Feedback): string {
  const url = item.url || '';
  if (/(^|\.)x\.com|twitter\.com/.test(url)) return 'X';
  if (/reddit\.com/.test(url)) return 'Reddit';
  if (/producthunt\.com/.test(url)) return 'Product Hunt';
  if (/linkedin\.com/.test(url)) return 'LinkedIn';
  if (/news\.ycombinator\.com/.test(url)) return 'Hacker News';
  if (item.source === 'x' || item.source === 'david-post') return 'X';
  return 'source';
}

export function shortDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function initial(item: Feedback): string {
  const s = (item.author_name || item.author || '?').replace(/^@/, '');
  // First full code point, not charAt(0): emoji and other astral characters split into a lone surrogate,
  // which serializes differently on the server and in the browser (hydration mismatch).
  const first = Array.from(s)[0] ?? '?';
  return /\p{L}|\p{N}/u.test(first) ? first.toUpperCase() : '?';
}

interface QuoteItemProps {
  quote: Feedback;
  /** When given, the quote is shown as being about this agent (feed and category pages). */
  agent?: { slug: string; name: string; icon: string | null };
  /** Rubric categories this quote speaks to, rendered as links. */
  categories?: string[];
  categoryLabels?: Record<string, string>;
  clamp?: boolean;
}

/** One public quote: author, date, text, then kind, categories, and the source link. */
export function QuoteItem({ quote, agent, categories = [], categoryLabels = {}, clamp = false }: QuoteItemProps) {
  return (
    <article className="quote">
      {agent ? (
        <Link href={`/agents/${agent.slug}`} className="q-agent" aria-label={agent.name}>
          <AgentIcon name={agent.name} icon={agent.icon} size={32} className="q-agent-icon" />
        </Link>
      ) : (
        <span className="q-av" aria-hidden="true">
          {initial(quote)}
        </span>
      )}
      <div className="q-body">
        <div className="q-head">
          {agent && (
            <Link href={`/agents/${agent.slug}`} className="q-about">
              {agent.name}
            </Link>
          )}
          <span className="q-author">{quote.author || quote.author_name || 'Anonymous'}</span>
          {quote.date && <span className="q-date">{shortDate(quote.date)}</span>}
        </div>
        <p className={`q-text${clamp ? ' clamp' : ''}`}>{quote.quote}</p>
        <div className="q-meta">
          <span className="q-kind">{KIND_LABEL[quote.kind] ?? 'Other'}</span>
          {categories.map(c => (
            <Link key={c} href={`/dimensions/${c}`} className="q-cat">
              {categoryLabels[c] ?? c}
            </Link>
          ))}
          {quote.url && (
            <a href={quote.url} target="_blank" rel="noopener noreferrer">
              Open on {sourceName(quote)}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
