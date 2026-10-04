import type { Metadata } from 'next';
import { BenchmarkNav } from '@/components/BenchmarkNav';

export const metadata: Metadata = { title: 'Work · Coming soon', robots: { index: false, follow: false } };

export default function WorkPage() {
  return <div className="wrap mid"><div className="page-head home-head"><div><h1 className="page-title">Work assistants</h1><p className="page-sub">Coming soon.</p></div></div><BenchmarkNav active="work" /></div>;
}
