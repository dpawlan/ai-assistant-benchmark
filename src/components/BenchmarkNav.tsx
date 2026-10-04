import Link from 'next/link';

export function BenchmarkNav({ active, section = 'assistants' }: { active: 'general' | 'travel' | 'work'; section?: 'assistants' | 'dimensions' | 'scoring' }) {
  const href = (category: 'general' | 'travel' | 'work') => {
    const base = category === 'general' ? '' : `/benchmarks/${category}`;
    return section === 'assistants' ? base || '/' : `${base}/dimensions${section === 'scoring' ? '#how' : ''}`;
  };
  return (
    <nav className="kind-bar" aria-label="Assistant category">
      <Link href={href('general')} className={`kind${active === 'general' ? ' on' : ''}`} aria-current={active === 'general' ? 'page' : undefined}>General</Link>
      <Link href={href('travel')} className={`kind${active === 'travel' ? ' on' : ''}`} aria-current={active === 'travel' ? 'page' : undefined}>Travel</Link>
      <Link href={href('work')} className={`kind${active === 'work' ? ' on' : ''}`} aria-current={active === 'work' ? 'page' : undefined}>Work <span className="kind-n">Coming soon</span></Link>
    </nav>
  );
}

const descriptions = {
  general: 'Tests how AI assistants perform as everyday helpers, from answering questions and managing schedules to getting day-to-day tasks done.',
  travel: 'Tests how AI assistants handle travel, from finding and booking flights to managing changes and disruptions.',
  work: 'Will test how AI assistants help you get work done, from email and scheduling to research and team workflows. Coming soon.',
};

export function CategoryDescription({ category }: { category: keyof typeof descriptions }) {
  return <p className="category-description">{descriptions[category]}{' '}<Link href={category === 'general' ? '/dimensions' : `/benchmarks/${category}/dimensions`}>Dimensions</Link></p>;
}
