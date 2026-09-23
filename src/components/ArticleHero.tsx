import Image from 'next/image';
import { AgentIcon } from '@/components/AgentIcon';
import { ReportCover } from '@/components/ReportCover';
import type { Agent } from '@/lib/types';
import type { Article } from '@/lib/articles';
import type { Report } from '@/lib/reports';

/**
 * Featured image for an article. A real image from frontmatter wins; otherwise a composed
 * illustration from the assistants the piece is about, on the related report's tint.
 */
export function ArticleHero({ article, report, agents, bySlug = {}, size = 'full' }: { article: Article; report: Report | null; agents: Agent[]; bySlug?: Record<string, Agent>; size?: 'full' | 'thumb' }) {
  const tint = report?.cover.tint ?? '#eef1f5';
  if (article.hero) {
    return (
      <figure className={`art-hero art-hero-${size}`}>
        <Image src={article.hero} alt="" width={1600} height={800} className="art-hero-img" />
        {size === 'full' && article.heroCaption && <figcaption>{article.heroCaption}</figcaption>}
      </figure>
    );
  }
  if (report) {
    return (
      <figure className={`art-hero art-hero-${size}`}>
        <ReportCover report={report} bySlug={bySlug} size={size === 'full' ? 'hero' : 'thumb'} />
        {size === 'full' && article.heroCaption && <figcaption>{article.heroCaption}</figcaption>}
      </figure>
    );
  }
  const shown = agents.length ? agents : [];
  const big = size === 'full' ? 112 : 40;
  return (
    <figure className={`art-hero art-hero-${size}`}>
      <div className="art-hero-art" style={{ background: tint }} aria-hidden="true">
        <span className="art-hero-ring" />
        <span className="art-hero-ring two" />
        <div className="art-hero-icons">
          {shown.map((a, i) => (
            <AgentIcon key={a.slug} name={a.name} icon={a.icon} size={big} className={`art-hero-icon ${i === 0 ? 'lead' : ''}`} />
          ))}
        </div>
      </div>
      {size === 'full' && article.heroCaption && <figcaption>{article.heroCaption}</figcaption>}
    </figure>
  );
}
