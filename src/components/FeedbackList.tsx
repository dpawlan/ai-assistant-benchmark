import { Feedback } from '@/lib/types';

interface FeedbackListProps {
  feedback?: Feedback[];
}

function FeedbackKindTag({ kind }: { kind: Feedback['kind'] }) {
  const config: Record<string, { label: string }> = {
    praise: { label: 'Praise' },
    complaint: { label: 'Complaint' },
    'use-case': { label: 'Use Case' },
    bug: { label: 'Bug' },
    comparison: { label: 'Comparison' },
    'feature-request': { label: 'Feature Request' },
    other: { label: 'Other' },
  };

  const { label } = config[kind] || config.other;

  return (
    <span className="text-micro text-secondary bg-bubble px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

function getSourceName(url: string): string {
  if (url.includes('x.com') || url.includes('twitter.com')) return 'X';
  if (url.includes('reddit.com')) return 'Reddit';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('producthunt.com')) return 'Product Hunt';
  return 'Source';
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bubble flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-secondary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </div>
        <h3 className="text-heading mb-2">No feedback yet</h3>
        <p className="text-caption text-secondary">
          Public feedback will appear here as it&apos;s collected.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-divider">
        <h2 className="text-heading">Public Feedback</h2>
        <p className="text-caption text-secondary mt-1">
          {feedback.length} {feedback.length === 1 ? 'item' : 'items'} from public discussions
        </p>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
        {feedback.slice(0, 20).map((item) => (
          <article key={item.id} className="p-4 border-b border-divider last:border-b-0">
            <div className="max-w-[85%]">
              <div className="bubble mb-3">
                <p className="text-body leading-relaxed">
                  &ldquo;{item.quote.length > 400 ? item.quote.slice(0, 400) + '...' : item.quote}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-caption font-medium">
                  {item.author}
                </span>
                {item.author_name && (
                  <span className="text-caption text-secondary">
                    ({item.author_name})
                  </span>
                )}
                <span className="text-caption text-secondary">
                  &middot;
                </span>
                <span className="text-caption text-secondary">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <FeedbackKindTag kind={item.kind} />
              </div>
              
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-caption text-accent hover:underline touch-target"
              >
                View on {getSourceName(item.url)}
                <svg 
                  className="w-3 h-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
          </article>
        ))}
        
        {feedback.length > 20 && (
          <div className="p-4 text-center text-caption text-secondary bg-surface">
            Showing 20 of {feedback.length} feedback items
          </div>
        )}
      </div>
    </div>
  );
}
