import { Metadata } from 'next';
import Link from 'next/link';
import { UseCaseForm } from '@/components/UseCaseForm';
import { getRoster } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Submit a use case',
  description: 'Tell us something you had an AI assistant do. Reviewed by hand before it appears.',
};

export default function SubmitUseCasePage() {
  const assistants = getRoster()
    .map(a => ({ slug: a.slug, name: a.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="wrap">
      <Link href="/use-cases" className="back">
        ‹ Use cases
      </Link>
      <div className="page-head">
        <h1 className="page-title">Submit a use case</h1>
        <p className="page-sub">Something you actually had an assistant do. We read every one before it goes on the page.</p>
      </div>

      <UseCaseForm assistants={assistants} />

      <section className="how">
        <h2 className="ag-h2">What happens next</h2>
        <div className="info-list">
          <div className="info-row">
            <span className="il">Reviewed by hand</span>
            <span className="iv iv-wrap">We check the post and the claim. Nothing is published automatically.</span>
          </div>
          <div className="info-row">
            <span className="il">Filed under a job</span>
            <span className="iv iv-wrap">Your post becomes evidence under the matching job, or a new job if it&apos;s a new one.</span>
          </div>
          <div className="info-row">
            <span className="il">Vendors</span>
            <span className="iv iv-wrap">Welcome, and labelled so readers know.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
