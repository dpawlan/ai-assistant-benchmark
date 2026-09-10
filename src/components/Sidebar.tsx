import Link from 'next/link';
import { Category } from '@/lib/types';
import { CATEGORY_SHORT } from '@/lib/data';
import { KINDS } from '@/lib/kinds';
import { SidebarNav } from './SidebarNav';

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {

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
            { href: '/dimensions', label: 'Dimensions' },
            { href: '/compare', label: 'Head to head' },
            { href: '/use-cases', label: 'Use cases' },
          ]}
        />

        <div className="side-label">Assistants</div>
        <SidebarNav items={KINDS.map(k => ({ href: k.key === 'general' ? '/' : `/?kind=${k.key}`, label: k.label }))} />

        <div className="side-label">Dimensions</div>
        <SidebarNav items={categories.map(c => ({ href: `/dimensions/${c.key}`, label: CATEGORY_SHORT[c.key] ?? c.label }))} />
      </div>

      <div className="side-foot">
        <Link href="/request" className="side-cta">
          Request a test
        </Link>
        <Link href="/dimensions#how" className="side-sub">
          How scoring works
        </Link>
      </div>
    </>
  );
}
