import { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';

export const metadata: Metadata = {
  title: 'Request a Test | AI Assistant Benchmark',
  description: 'Request testing and benchmarking for an AI assistant. Help us expand our coverage.',
};

export default function RequestPage() {
  return (
    <div className="container-narrow py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-display mb-3">Request a Test</h1>
        <p className="text-body text-secondary">
          Know an AI assistant that should be on our benchmark? 
          Let us know and we&apos;ll add it to our testing queue.
        </p>
      </header>

      <div className="card p-6 mb-6">
        <RequestForm />
      </div>

      <div className="card p-6">
        <h2 className="text-heading mb-4">What happens next?</h2>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-accent-tint text-accent flex items-center justify-center text-caption font-semibold flex-shrink-0">
              1
            </span>
            <span className="text-body text-secondary pt-0.5">
              We review your request and verify the assistant exists and is publicly accessible.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-accent-tint text-accent flex items-center justify-center text-caption font-semibold flex-shrink-0">
              2
            </span>
            <span className="text-body text-secondary pt-0.5">
              The assistant is added to our testing queue with your suggested categories prioritized.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="w-7 h-7 rounded-full bg-accent-tint text-accent flex items-center justify-center text-caption font-semibold flex-shrink-0">
              3
            </span>
            <span className="text-body text-secondary pt-0.5">
              Once tested, results appear on the leaderboard. We&apos;ll follow up if you provided contact info.
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
