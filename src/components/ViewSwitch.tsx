'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const kind = params.get('kind');
  const q = kind ? `?kind=${kind}` : '';
  const base = ['/benchmarks/travel', '/benchmarks/work'].find(route => pathname === route || pathname.startsWith(`${route}/`)) ?? '';
  const grid = pathname === `${base}/grid`;
  return (
    <div className="seg view-switch" role="tablist" aria-label="Layout">
      <Link href={`${base || '/'}${q}`} role="tab" aria-selected={!grid} className={!grid ? 'on' : ''}>
        List
      </Link>
      <Link href={`${base}/grid${q}`} role="tab" aria-selected={grid} className={grid ? 'on' : ''}>
        Grid
      </Link>
    </div>
  );
}

/** List or grid for the same assistants; the group filter carries across. */
export function ViewSwitch() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
