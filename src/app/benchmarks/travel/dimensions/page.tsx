import Link from 'next/link';
import { BenchmarkNav } from '@/components/BenchmarkNav';
import type { Metadata } from 'next';
import { getAgents } from '@/lib/data';
import protocol from '../../../../../data/travel-protocol-v1.json';

export const metadata: Metadata = { title: 'Travel dimensions', robots: { index: false, follow: false } };

export default function TravelDimensionsPage() {
  const agents = getAgents();
  return <div className="wrap">
    <div className="ag-top"><Link className="back" href="/benchmarks/travel">← Travel assistants</Link></div>
    <div className="page-head"><h1 className="page-title">Dimensions</h1><p className="page-sub">Five v1 dimensions. Open one to see the task, pass criteria and scoring anchors. Observed results are labeled separately from the prescribed tests.</p></div>
    <BenchmarkNav active="travel" section="dimensions" />
    <section className="shelf"><h2 className="shelf-title"><span className="shelf-head">5 dimensions</span></h2><div className="cat-list">
      {protocol.map((t, index) => { const tested = agents.filter(a => a.travel.scores[t.id] !== undefined).length; return <Link key={t.id} href={`/benchmarks/travel/dimensions/${t.id}`} className="cat-row"><span className="cat-num">{index + 1}</span><span className="cat-body"><span className="cat-label">{t.title}</span><span className="cat-desc">{t.measures}</span></span><span className="row-slot"><span className={`pill${tested ? '' : ' muted'}`}>{tested ? `${tested} tested` : 'Untested'}</span></span></Link>; })}
    </div></section>
    <section className="how" id="how">
      <h2 className="ag-h2">How scoring works</h2>
      <BenchmarkNav active="travel" section="scoring" />
      <p className="ag-sub">Each travel dimension has a published prompt, pass criteria and 1–10 scoring anchors. Only reviewed results with supporting evidence count. Open a dimension above for its full test specification and results.</p>
      <p className="ag-sub">The latest reviewed result counts for each dimension. The equal-weight average of tested dimensions becomes the Travel score, rounded to one decimal. The same score appears in General’s Travel dimension and counts once toward its overall score.</p>
      <p className="ag-sub">Observed tasks are scored against what was actually requested: fully completing that task can earn 10/10. Untested dimensions and unrequested variants stay blank and do not lower the score.</p>
      <p className="ag-sub">Assistants appear in the Travel category after at least three dimensions have reviewed scores. Travel rankings also account for how much has been tested. We add three neutral results at 5/10 when calculating the ranking: (sum of tested dimension scores + 15) ÷ (number of tested dimensions + 3). Strong results across more dimensions rank higher than the same average from fewer tests. The displayed score remains the actual average; ranking ties are alphabetical.</p>
      <div className="info-list">
        <div className="info-row"><span className="il">A tested score</span><span className="iv">1 – 10</span></div>
        <div className="info-row"><span className="il">Not tested yet</span><span className="iv empty">—</span></div>
        <div className="info-row"><span className="il">Travel overall</span><span className="iv">Mean of tested dimensions</span></div>
        <div className="info-row"><span className="il">Protocol</span><span className="iv">travel-v1 · Draft</span></div>
      </div>
    </section>
  </div>;
}
