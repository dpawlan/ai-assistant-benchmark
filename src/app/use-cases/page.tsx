import { Metadata } from 'next';
import Link from 'next/link';
import { AgentIcon } from '@/components/AgentIcon';
import { compact, shortDate } from '@/components/QuoteItem';
import { CATEGORY_SHORT, getUseCaseAgents, getUseCases } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Trending use cases',
  description: 'What people actually get AI assistants to do, ranked by engagement on X. Each one is summarized with a prompt you can send, and links to the original post.',
};

/** Curated use cases ranked by engagement on the original post. Optional ?agent= filter. */
export default async function UseCasesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const agentSlug = typeof params.agent === 'string' ? params.agent : undefined;
  const agents = getUseCaseAgents();
  const active = agents.find(a => a.slug === agentSlug);
  const items = getUseCases(active?.slug);

  return (
    <div className="wrap">
      <div className="page-head">
        <span className="wip" title="This page is still being shaped; entries and ranking will change.">
          Work in progress
        </span>
        <h1 className="page-title">Trending use cases</h1>
        <p className="page-sub">What people actually get these assistants to do, ranked by engagement on X. Each one has a prompt you can send and a link to the post.</p>
      </div>

      <div className="trend-filters" aria-label="Filter by assistant">
        <Link href="/use-cases" className={`chip${active ? '' : ' blue'}`}>
          All
        </Link>
        {agents.map(a => (
          <Link key={a.slug} href={`/use-cases?agent=${a.slug}`} className={`chip${active?.slug === a.slug ? ' blue' : ''}`}>
            {a.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No use cases yet.</p>
      ) : (
        <ol className="uc-list">
          {items.map(u => (
            <li key={u.id} className="uc">
              <span className="uc-rank">{u.rank}</span>
              <div className="uc-body">
                <div className="uc-head">
                  <Link href={`/agents/${u.agentRef.slug}`} className="uc-agent">
                    <AgentIcon name={u.agentRef.name} icon={u.agentRef.icon} size={22} className="uc-agent-icon" />
                    {u.agentRef.name}
                  </Link>
                  {u.categories.map(c => (
                    <Link key={c} href={`/dimensions/${c}`} className="q-cat">
                      {CATEGORY_SHORT[c] ?? c}
                    </Link>
                  ))}
                </div>
                <h2 className="uc-title">{u.title}</h2>
                <p className="uc-sum">{u.summary}</p>
                <div className="uc-prompt">
                  <span className="uc-prompt-label">{u.prompt_source === 'posted' ? 'What they sent' : 'Try sending'}</span>
                  <span className="uc-prompt-text">{u.prompt}</span>
                </div>
                {u.caveat && <p className="uc-caveat">{u.caveat}</p>}
                <div className="uc-meta">
                  {u.engagement > 0 && (
                    <span>
                      {compact(u.quote.metrics?.likes ?? 0)} likes
                      {(u.quote.metrics?.reposts ?? 0) > 0 && ` · ${compact(u.quote.metrics?.reposts ?? 0)} reposts`}
                    </span>
                  )}
                  <span>{u.quote.author}</span>
                  <span>{shortDate(u.quote.date)}</span>
                  <a href={u.quote.url} target="_blank" rel="noopener noreferrer">
                    See the post
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      <p className="trend-note">
        Summaries and suggested prompts are ours; &ldquo;What they sent&rdquo; is the poster&apos;s own wording. Ranked by likes, reposts and replies on the
        original post, newer posts weighted up. Founder and vendor posts are left out. The scorecard, not this page, is the benchmark.
      </p>
    </div>
  );
}
