import Link from 'next/link';
import { Category } from '@/lib/types';
import { SidebarNav } from './SidebarNav';

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  const core = categories.filter(c => c.group === 'core');
  const endorsed = categories.filter(c => c.group === 'endorsed');

  return (
    <>
      <div className="side-nav">
        <Link href="/" className="side-brand">
          <span className="side-mark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2C4.4 2 1.5 4.4 1.5 7.4c0 1.6.8 3 2.1 4-.2.9-.7 1.7-1.3 2.3 1.4-.1 2.7-.6 3.7-1.3.6.1 1.3.2 2 .2 3.6 0 6.5-2.4 6.5-5.4S11.6 2 8 2z" />
            </svg>
          </span>
          <span>Assistant Benchmark</span>
        </Link>

        <SidebarNav
          items={[
            { href: '/', label: 'Scorecard' },
            { href: '/confirmed', label: 'Confirmed' },
            { href: '/stretch', label: 'Stretch' },
            { href: '/categories', label: 'Categories' },
          ]}
        />

        <div className="side-label">Core</div>
        <SidebarNav items={core.map(c => ({ href: `/categories/${c.key}`, label: c.label }))} />

        <div className="side-label">Endorsed</div>
        <SidebarNav items={endorsed.map(c => ({ href: `/categories/${c.key}`, label: c.label }))} />
      </div>

      <div className="side-foot">
        <Link href="/request" className="side-cta">
          Request a test
        </Link>
        <Link href="/categories#how" className="side-sub">
          How scoring works
        </Link>
      </div>
    </>
  );
}
