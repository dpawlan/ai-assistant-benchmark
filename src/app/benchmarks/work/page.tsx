import type { Metadata } from 'next';
import { BenchmarkNav, CategoryDescription } from '@/components/BenchmarkNav';

export const metadata: Metadata = { title: 'Work · Coming soon', robots: { index: false, follow: false } };

export default function WorkPage() {
  return <div className="wrap mid"><div className="page-head home-head"><div><h1 className="page-title">Work assistants</h1></div></div><BenchmarkNav active="work" /><CategoryDescription category="work" /></div>;
}
