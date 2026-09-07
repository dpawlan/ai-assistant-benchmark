import { Feedback } from '@/lib/types';

interface FeedbackListProps {
  feedback?: Feedback[];
}

function FeedbackKindBadge({ kind }: { kind: Feedback['kind'] }) {
  const config: Record<string, { icon: string; bg: string; label: string }> = {
    praise: { icon: '👍', bg: 'bg-accent-green/10', label: 'Praise' },
    complaint: { icon: '👎', bg: 'bg-red-500/10', label: 'Complaint' },
    'use-case': { icon: '💡', bg: 'bg-bubble-blue/10', label: 'Use Case' },
    bug: { icon: '🐛', bg: 'bg-red-500/10', label: 'Bug' },
    comparison: { icon: '⚖️', bg: 'bg-accent-orange/10', label: 'Comparison' },
    'feature-request': { icon: '✨', bg: 'bg-accent-purple/10', label: 'Feature Request' },
    other: { icon: '💬', bg: 'bg-bubble-gray', label: 'Other' },
  };

  const { icon, bg, label } = config[kind] || config.other;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg} text-xs font-medium`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SourceIcon({ source, url }: { source: string; url: string }) {
  const isTwitter = url.includes('x.com') || url.includes('twitter.com');
  const isReddit = url.includes('reddit.com');
  
  if (isTwitter) return <span className="text-sm">𝕏</span>;
  if (isReddit) return <span className="text-sm">🔴</span>;
  return <span className="text-sm">🔗</span>;
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
      <div className="bg-card rounded-2xl card-shadow p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bubble-gray/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-2">No feedback yet</h3>
        <p className="text-secondary text-sm">
          Public feedback for this assistant will appear here as it&apos;s collected.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl card-shadow overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-semibold text-lg">Public Feedback</h2>
        <p className="text-sm text-secondary mt-1">
          {feedback.length} {feedback.length === 1 ? 'item' : 'items'} from public discussions
        </p>
      </div>
      
      <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
        {feedback.slice(0, 20).map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <FeedbackKindBadge kind={item.kind} />
                  <span className="text-sm text-secondary">
                    from <span className="font-medium text-foreground">{item.author}</span>
                    {item.author_name && (
                      <span className="text-secondary"> ({item.author_name})</span>
                    )}
                  </span>
                  <span className="text-sm text-secondary">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <blockquote className="bubble bubble-gray mb-4 inline-block max-w-full">
                  <p className="text-sm leading-relaxed break-words">
                    &ldquo;{item.quote.length > 400 ? item.quote.slice(0, 400) + '...' : item.quote}&rdquo;
                  </p>
                </blockquote>
                
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.slice(0, 5).map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-0.5 rounded-full bg-bubble-gray/50 text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-bubble-blue hover:underline"
                  >
                    <SourceIcon source={item.source} url={item.url} />
                    View on {getSourceName(item.url)}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {feedback.length > 20 && (
          <div className="p-6 text-center text-sm text-secondary">
            Showing 20 of {feedback.length} feedback items
          </div>
        )}
      </div>
    </div>
  );
}
