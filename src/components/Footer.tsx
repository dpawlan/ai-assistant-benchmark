'use client';

import Image from 'next/image';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer({ updated }: { updated: string }) {
  const pathname = usePathname();
  const travel = pathname.startsWith('/benchmarks/travel');
  const work = pathname.startsWith('/benchmarks/work');
  const dimensionsHref = travel ? '/benchmarks/travel/dimensions' : work ? '/benchmarks/work/dimensions' : '/dimensions';
  return (
    <footer>
      <div className="hr" />
      <p>
        Find the right AI assistant for everyday life, travel, and work.
      </p>
      <p>Last updated {updated}.</p>
      <p className="links">
        <Link href={dimensionsHref}>Dimensions</Link>
        <Link href="/about">About</Link>
        <Link href="/request">Request a test</Link>
      </p>
      <p className="credit">
        Created by David Pawlan,{' '}
        <a href="https://x.com/DavidPawlan" target="_blank" rel="noopener noreferrer">
          @DavidPawlan
        </a>
      </p>
      <a
        className="merit-logo"
        href="https://merit.systems"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/logos/merit.svg" alt="Merit Systems" width={104} height={30} unoptimized />
      </a>
    </footer>
  );
}
