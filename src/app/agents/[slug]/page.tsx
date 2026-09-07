import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAgentDetail, getCategories, getAllSlugs } from '@/lib/data';
import { ScoreMatrix } from '@/components/ScoreMatrix';
import { FeedbackList } from '@/components/FeedbackList';

interface AgentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentDetail(slug);
  
  if (!agent) {
    return {
      title: 'Agent Not Found | AI Benchmark',
    };
  }

  return {
    title: `${agent.name} Review | AI Assistant Benchmark`,
    description: `See scores, features, and ${agent.feedbackCount} real user feedback items for ${agent.name}.`,
    openGraph: {
      title: `${agent.name} - AI Assistant Benchmark`,
      description: `${agent.feedbackCount} public feedback items collected`,
    },
  };
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = await getAgentDetail(slug);
  const categories = getCategories();

  if (!agent) {
    notFound();
  }

  const isStretch = agent.status === 'stretch';
  const displaySite = agent.site 
    ? agent.site.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : null;

  return (
    <div className="container-wide py-6 md:py-8">
      <nav className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-caption text-secondary hover:text-foreground transition-colors touch-target"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leaderboard
        </Link>
      </nav>

      <header className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="avatar w-14 h-14 text-xl">
            {getInitial(agent.name)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-title">{agent.name}</h1>
              <span className={`badge ${isStretch ? 'badge-stretch' : 'badge-confirmed'}`}>
                {isStretch ? 'Stretch' : 'Confirmed'}
              </span>
            </div>
            
            {displaySite && (
              <p className="text-caption text-secondary mb-3">
                {displaySite}
              </p>
            )}
            
            <p className="text-body text-secondary">
              {agent.feedbackCount} public feedback items collected
            </p>
          </div>
        </div>

        {agent.site && (
          <div className="mt-4 pt-4 border-t border-divider">
            <a
              href={agent.site}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Visit Site
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        {agent.summary && (
          <div className="mt-4 pt-4 border-t border-divider">
            <h2 className="text-micro text-secondary uppercase tracking-wider mb-2">Summary</h2>
            <p className="text-body leading-relaxed whitespace-pre-wrap">
              {agent.summary.split('\n').slice(0, 10).join('\n')}
            </p>
          </div>
        )}
      </header>

      <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <ScoreMatrix 
          scores={agent.scores} 
          categories={categories} 
          isStretch={isStretch}
        />
        <FeedbackList feedback={agent.feedback} />
      </div>
    </div>
  );
}
