import type { Metadata } from 'next';
import { WorkBenchmark } from '@/components/WorkBenchmark';

export const metadata: Metadata = { title: 'Work grid · Coming soon', robots: { index: false, follow: false } };

export default function WorkGridPage() {
  return <div className="wrap mid"><WorkBenchmark /></div>;
}
