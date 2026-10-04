import Link from 'next/link';

export function BenchmarkNav({ active }: { active: 'general' | 'travel' | 'work' }) {
  return (
    <nav className="kind-bar" aria-label="Assistant category">
      <Link href="/" className={`kind${active === 'general' ? ' on' : ''}`} aria-current={active === 'general' ? 'page' : undefined}>General</Link>
      <Link href="/benchmarks/travel" className={`kind${active === 'travel' ? ' on' : ''}`} aria-current={active === 'travel' ? 'page' : undefined}>Travel</Link>
      <span className="kind category-soon" aria-disabled="true">Work <span className="kind-n">Coming soon</span></span>
    </nav>
  );
}
