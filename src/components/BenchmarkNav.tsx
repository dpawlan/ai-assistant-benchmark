import Link from 'next/link';

export function BenchmarkNav({ active }: { active: 'general' | 'travel' | 'work' }) {
  return <nav className="bs-nav" aria-label="Benchmark suite">
    <span className="bs-nav-label">Benchmarks</span>
    {[
      { key: 'general', name: 'General', href: '/', note: 'Everyday assistance' },
      { key: 'travel', name: 'Travel', href: '/benchmarks/travel', note: 'From search to arrival' },
      { key: 'work', name: 'Work', href: '/benchmarks/work', note: 'Coming next' },
    ].map(s => <Link key={s.key} href={s.href} className={`bs-suite ${active === s.key ? 'is-active' : ''}`} aria-current={active === s.key ? 'page' : undefined}>
      <strong>{s.name}</strong><span>{s.note}</span>
    </Link>)}
  </nav>;
}
