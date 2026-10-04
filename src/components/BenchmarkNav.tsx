import Link from 'next/link';

export function BenchmarkNav({ active }: { active: 'general' | 'travel' | 'work' }) {
  return (
    <nav className="kind-bar" aria-label="Assistant category">
      <Link href="/" className={`kind${active === 'general' ? ' on' : ''}`} aria-current={active === 'general' ? 'page' : undefined}>General</Link>
      <Link href="/benchmarks/travel" className={`kind${active === 'travel' ? ' on' : ''}`} aria-current={active === 'travel' ? 'page' : undefined}>Travel</Link>
      <Link href="/benchmarks/work" className={`kind${active === 'work' ? ' on' : ''}`} aria-current={active === 'work' ? 'page' : undefined}>Work <span className="kind-n">Coming soon</span></Link>
    </nav>
  );
}

const descriptions = {
  general: 'Tests how AI assistants perform as everyday helpers, from answering questions and managing schedules to getting day-to-day tasks done.',
  travel: 'Tests how AI assistants handle travel, from finding and booking flights to managing changes and disruptions. Testing coming soon.',
  work: 'Will test how AI assistants help you get work done, from email and scheduling to research and team workflows. Coming soon.',
};

export function CategoryDescription({ category }: { category: keyof typeof descriptions }) {
  return <p className="category-description">{descriptions[category]}{category !== 'work' && <> <Link href={category === 'travel' ? '/benchmarks/travel/dimensions' : '/dimensions'}>Explore dimensions →</Link></>}</p>;
}
