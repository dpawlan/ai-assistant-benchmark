import { Feedback } from '@/lib/types';

interface FeedbackListProps {
  feedback: Feedback[];
}

function FeedbackTypeIcon({ type }: { type: Feedback['type'] }) {
  const config = {
    praise: { 
      icon: '👍', 
      bg: 'bg-accent-green/10', 
      label: 'Praise' 
    },
    complaint: { 
      icon: '👎', 
      bg: 'bg-red-500/10', 
      label: 'Complaint' 
    },
    'use-case': { 
      icon: '💡', 
      bg: 'bg-bubble-blue/10', 
      label: 'Use Case' 
    },
    'feature-request': { 
      icon: '✨', 
      bg: 'bg-accent-purple/10', 
      label: 'Feature Request' 
    },
    comparison: { 
      icon: '⚖️', 
      bg: 'bg-accent-orange/10', 
      label: 'Comparison' 
    },
  };

  const { icon, bg, label } = config[type] || config.praise;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg} text-xs font-medium`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SourceIcon({ source }: { source: string }) {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    reddit: '🔴',
    linkedin: '💼',
    producthunt: '🚀',
  };

  return (
    <span className="text-sm">{icons[source] || '🔗'}</span>
  );
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  if (feedback.length === 0) {
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
      
      <div className="divide-y divide-border">
        {feedback.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <FeedbackTypeIcon type={item.type} />
                  <span className="text-sm text-secondary">
                    from <span className="font-medium text-foreground">{item.author}</span>
                  </span>
                  <span className="text-sm text-secondary">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <blockquote className="bubble bubble-gray mb-4 inline-block">
                  <p className="text-sm leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                </blockquote>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-bubble-blue hover:underline"
                  >
                    <SourceIcon source={item.source} />
                    View on {item.source}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
