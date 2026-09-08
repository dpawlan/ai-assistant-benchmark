import { Metadata } from 'next';
import { getCategories } from '@/lib/data';
import { RequestForm } from '@/components/RequestForm';

export const metadata: Metadata = {
  title: 'Request a test',
  description: 'Suggest an AI assistant for the benchmark, or send a correction for one already listed.',
};

export default function RequestPage() {
  const categories = getCategories();

  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Request a test</h1>
        <p className="page-sub">
          Suggest an assistant, or send a correction.
        </p>
      </div>

      <RequestForm categories={categories.map(c => ({ key: c.key, label: c.label }))} />

      <section className="how" style={{ maxWidth: 460 }}>
        <h2 className="ag-h2">What happens next</h2>
        <div className="info-list" style={{ marginTop: 6 }}>
          <div className="info-row">
            <span className="il">We check the assistant exists and is publicly available</span>
          </div>
          <div className="info-row">
            <span className="il">It joins the queue, with your dimensions tested first</span>
          </div>
          <div className="info-row">
            <span className="il">Results go on the leaderboard; we&apos;ll tell you if you left contact info</span>
          </div>
        </div>
      </section>
    </div>
  );
}
