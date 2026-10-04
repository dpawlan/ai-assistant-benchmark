import Link from 'next/link';
import type { Metadata } from 'next';
import { BenchmarkNav } from '@/components/BenchmarkNav';

export const metadata: Metadata = { title: 'Work dimensions · Coming soon', robots: { index: false, follow: false } };

export default function WorkDimensionsPage() {
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/work">← Work assistants</Link></div>
    <div className="page-head"><h1 className="page-title">Dimensions</h1><p className="page-sub">Work dimensions and test specifications are coming soon.</p></div>
    <BenchmarkNav active="work" section="dimensions" />
    <section className="shelf"><h2 className="shelf-title"><span className="shelf-head">Work dimensions</span></h2><p className="ag-sub">The Work protocol is being developed. No dimensions or results have been published yet.</p></section>
    <section className="how" id="how"><h2 className="ag-h2">How scoring works</h2><BenchmarkNav active="work" section="scoring" /><p className="ag-sub">Coming soon. Work-specific tasks, pass criteria, scoring anchors and the overall calculation will appear here once the protocol is defined.</p></section>
  </div>;
}
