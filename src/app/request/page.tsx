import { Metadata } from 'next';
import { RequestForm } from '@/components/RequestForm';

export const metadata: Metadata = {
  title: 'Request a Test | AI Assistant Benchmark',
  description: 'Request testing and benchmarking for an AI assistant. Help us expand our coverage.',
};

export default function RequestPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Request a Test</h1>
        <p className="text-secondary leading-relaxed">
          Know an AI assistant that should be on our benchmark? 
          Let us know and we&apos;ll add it to our testing queue.
        </p>
      </div>

      <div className="bg-card rounded-2xl card-shadow p-8">
        <RequestForm />
      </div>

      <div className="mt-8 p-6 bg-bubble-gray/30 rounded-2xl">
        <h2 className="font-semibold mb-3">What happens next?</h2>
        <ol className="space-y-3 text-sm text-secondary">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bubble-blue/10 text-bubble-blue flex items-center justify-center text-xs font-medium">1</span>
            <span>We review your request and verify the assistant exists and is publicly accessible.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bubble-blue/10 text-bubble-blue flex items-center justify-center text-xs font-medium">2</span>
            <span>The assistant is added to our testing queue with your suggested categories prioritized.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bubble-blue/10 text-bubble-blue flex items-center justify-center text-xs font-medium">3</span>
            <span>Once tested, results appear on the leaderboard. We&apos;ll follow up if you provided contact info.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
