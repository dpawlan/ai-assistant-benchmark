import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAgent, getCategories, getAllSlugs } from '@/lib/data';
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
  const agent = getAgent(slug);
  
  if (!agent) {
    return {
      title: 'Agent Not Found | AI Benchmark',
    };
  }

  return {
    title: `${agent.name} Review | AI Assistant Benchmark`,
    description: `${agent.description}. See scores, features, and real user feedback for ${agent.name} by ${agent.vendor}.`,
    openGraph: {
      title: `${agent.name} - AI Assistant Benchmark`,
      description: agent.description,
    },
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = getAgent(slug);
  const categories = getCategories();

  if (!agent) {
    notFound();
  }

  const isStretch = agent.status === 'stretch';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leaderboard
        </Link>
      </nav>

      <header className="bg-card rounded-2xl card-shadow p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{agent.name}</h1>
              <span className={`status-badge ${isStretch ? 'status-stretch' : 'status-confirmed'}`}>
                {isStretch ? 'Stretch' : 'Confirmed'}
              </span>
            </div>
            <p className="text-secondary mb-4">by {agent.vendor}</p>
            <p className="text-lg leading-relaxed max-w-2xl">{agent.description}</p>
          </div>
          
          <div className="flex-shrink-0">
            <a
              href={agent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-bubble-blue text-white rounded-full font-medium hover:bg-bubble-blue/90 transition-colors"
            >
              Visit Site
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {agent.summary && (
          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-sm font-medium text-secondary uppercase tracking-wider mb-2">Summary</h2>
            <p className="text-foreground leading-relaxed">{agent.summary}</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
