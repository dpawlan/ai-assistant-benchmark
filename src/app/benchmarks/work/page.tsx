import type { Metadata } from 'next';
import { WorkBenchmark } from '@/components/WorkBenchmark';

export const metadata: Metadata = { title: 'Work · Coming soon', robots: { index: false, follow: false } };

export default function WorkPage() {
  return <div className="wrap mid"><WorkBenchmark /></div>;
}
