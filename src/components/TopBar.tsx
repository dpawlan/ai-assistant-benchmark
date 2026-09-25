'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Assistants', match: (p: string) => p === '/' || p === '/grid' || p.startsWith('/agents') || p.startsWith('/dimensions') },
  { href: '/reports', label: 'Reports', match: (p: string) => p.startsWith('/reports') || p.startsWith('/articles') || p.startsWith('/authors') },
  { href: '/use-cases', label: 'Use cases', match: (p: string) => p.startsWith('/use-cases') },
  { href: '/compare', label: 'Compare', match: (p: string) => p.startsWith('/compare') },
];

/** One bar replaces the sidebar: the mark, three places to go, and the one thing a visitor can do for us. */
export function TopBar() {
  const pathname = usePathname() ?? '/';
  return (
    <header className="topbar">
      <div className="tb-in">
        <Link href="/" className="tb-brand">
          <span className="side-mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2.5c-3.3 0-6 2.2-6 5 0 1.5.8 2.9 2.1 3.8L3.5 13.5l2.8-1.1c.5.1 1.1.2 1.7.2 3.3 0 6-2.2 6-5s-2.7-5.1-6-5.1z" />
            </svg>
          </span>
          <span>Assistant Benchmark</span>
        </Link>
        <nav className="tb-links" aria-label="Primary">
          {LINKS.map(l => {
            const on = l.match(pathname);
            return (
              <Link key={l.href} href={l.href} className={`tb-link${on ? ' on' : ''}`} aria-current={on ? 'page' : undefined}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/request" className="tb-cta">
          <span className="tb-cta-full">Request a test</span>
          <span className="tb-cta-short">Request</span>
        </Link>
      </div>
    </header>
  );
}
