'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { track } from '@vercel/analytics';

/** A link into a job page that records the click. */
export function JobLink({ job, via, className, children }: { job: string; via: 'card' | 'more'; className?: string; children: ReactNode }) {
  return (
    <Link href={`/use-cases/${job}`} className={className} onClick={() => track('uc_open_job', { job, via })}>
      {children}
    </Link>
  );
}
