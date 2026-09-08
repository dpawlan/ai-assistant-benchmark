'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  href: string;
  label: string;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav>
      {items.map(item => {
        const active = !item.href.includes('#') && pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`side-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
