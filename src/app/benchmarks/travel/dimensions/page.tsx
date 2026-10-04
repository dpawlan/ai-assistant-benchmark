import Link from 'next/link';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import type { Metadata } from 'next';
import protocol from '../../../../../data/travel-protocol-draft.json';

export const metadata: Metadata = { title: 'Travel dimensions', robots: { index: false, follow: false } };

export default function TravelDimensionsPage() {
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel">← Travel assistants</Link></div>
    <div className="page-head"><h1 className="page-title">Dimensions</h1><p className="page-sub">17 proposed dimensions. Open one to see the task, pass criteria and scoring anchors. Testing coming soon.</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="shelf"><h2 className="shelf-title"><span className="shelf-head">17 dimensions</span></h2><div className="cat-list">
      {protocol.map(t => <Link key={t.id} href={`/benchmarks/travel/dimensions/${t.id}`} className="cat-row"><span className="cat-num">{t.id}</span><span className="cat-body"><span className="cat-label">{t.title}</span><span className="cat-desc">{t.measures}</span></span><span className="row-slot"><span className="pill muted">Untested</span></span></Link>)}
    </div></section>
    <section className="how" id="how">
      <h2 className="ag-h2">How scoring works</h2>
      <BenchmarkNav active="travel" section="scoring" />
      <p className="ag-sub">Each travel dimension has a published prompt, pass criteria and 1–10 scoring anchors. Only reviewed results with supporting evidence count. Open a dimension above for its full test specification and results.</p>
      <p className="ag-sub">The latest reviewed result counts for each dimension. After all 17 dimensions are tested, their equal-weight average becomes the Travel score, rounded to one decimal. The same score appears in General’s Travel dimension and counts once toward its overall score.</p>
      <p className="ag-sub">Partial results appear in individual dimensions without a Travel overall. Until the full set is complete, General keeps its existing travel test score.</p>
      <div className="info-list">
        <div className="info-row"><span className="il">A tested score</span><span className="iv">1 – 10</span></div>
        <div className="info-row"><span className="il">Not tested yet</span><span className="iv empty">—</span></div>
        <div className="info-row"><span className="il">Travel overall</span><span className="iv">Mean of all 17 dimensions</span></div>
        <div className="info-row"><span className="il">Protocol</span><span className="iv">travel-v1 · Draft</span></div>
      </div>
    </section>
  </div>;
}
