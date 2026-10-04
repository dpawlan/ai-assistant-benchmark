'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const travel = pathname.startsWith('/benchmarks/travel');
  const work = pathname.startsWith('/benchmarks/work');
  const dimensionsHref = travel ? '/benchmarks/travel/dimensions' : '/dimensions';
  return (
    <footer>
      <div className="hr" />
      <p>
        Find the right AI assistant for everyday life, travel, and work.
      </p>
      <p className="links">
        <Link href="/dimensions#how">How scoring works</Link>
        {work ? <span aria-disabled="true" title="Coming soon">Dimensions</span> : <Link href={dimensionsHref}>Dimensions</Link>}
        <Link href="/about">About</Link>
        <Link href="/request">Request a test</Link>
        <Link href="/contribute">Contribute runs</Link>
      </p>
      <p className="credit">
        Created by David Pawlan,{' '}
        <a href="https://x.com/DavidPawlan" target="_blank" rel="noopener noreferrer">
          @DavidPawlan
        </a>
      </p>
    </footer>
  );
}
