'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const kind = params.get('kind');
  const q = kind ? `?kind=${kind}` : '';
  const grid = pathname === '/grid';
  return (
    <div className="seg view-switch" role="tablist" aria-label="Layout">
      <Link href={`/${q}`} role="tab" aria-selected={!grid} className={!grid ? 'on' : ''}>
        List
      </Link>
      <Link href={`/grid${q}`} role="tab" aria-selected={grid} className={grid ? 'on' : ''}>
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
