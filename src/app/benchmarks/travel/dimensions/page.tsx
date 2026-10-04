import Link from 'next/link';
import type { Metadata } from 'next';
import protocol from '../../../../../data/travel-protocol-draft.json';

export const metadata: Metadata = { title: 'Travel dimensions', robots: { index: false, follow: false } };

export default function TravelDimensionsPage() {
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel">← Travel assistants</Link></div>
    <div className="page-head"><h1 className="page-title">Travel dimensions</h1><p className="page-sub">17 proposed dimensions. Open one to see the task, pass criteria and scoring anchors. Testing coming soon.</p></div>
    <section className="shelf"><h2 className="shelf-title"><span className="shelf-head">17 dimensions</span></h2><div className="cat-list">
      {protocol.map(t => <Link key={t.id} href={`/benchmarks/travel/dimensions/${t.id}`} className="cat-row"><span className="cat-num">{t.id}</span><span className="cat-body"><span className="cat-label">{t.title}</span><span className="cat-desc">{t.measures}</span></span><span className="row-slot"><span className="pill muted">Untested</span></span></Link>)}
    </div></section>
  </div>;
}
