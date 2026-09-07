import { Metadata } from 'next';
import { getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Scoring Categories | AI Assistant Benchmark',
  description: 'The 14 evaluation categories used to benchmark AI personal assistants. 7 core categories and 7 endorsed specialty areas.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const coreCategories = categories.filter(c => c.group === 'core');
  const endorsedCategories = categories.filter(c => c.group === 'endorsed');

  return (
    <div className="container-content py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-display mb-3">Scoring Categories</h1>
        <p className="text-body text-secondary max-w-xl">
          Every AI assistant is evaluated across the same {categories.length} categories. 
          This ensures fair, consistent comparisons regardless of the tool&apos;s specialty.
        </p>
      </header>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent-tint flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-heading">Core Categories</h2>
            <p className="text-caption text-secondary">Fundamental capabilities</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          {coreCategories.map((category, index) => (
            <div 
              key={category.key} 
              className="flex items-center gap-4 p-4 border-b border-divider last:border-b-0"
            >
              <span className="w-7 h-7 rounded-lg bg-accent-tint text-accent flex items-center justify-center text-caption font-semibold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-body-semibold">{category.label}</h3>
                <p className="text-caption text-secondary">
                  Key: <code className="bg-bubble px-1.5 py-0.5 rounded text-micro">{category.key}</code>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-stretch-bg flex items-center justify-center">
            <svg className="w-4 h-4 text-stretch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-heading">Endorsed Categories</h2>
            <p className="text-caption text-secondary">Specialty areas</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          {endorsedCategories.map((category, index) => (
            <div 
              key={category.key} 
              className="flex items-center gap-4 p-4 border-b border-divider last:border-b-0"
            >
              <span className="w-7 h-7 rounded-lg bg-stretch-bg text-stretch flex items-center justify-center text-caption font-semibold flex-shrink-0">
                {coreCategories.length + index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-body-semibold">{category.label}</h3>
                <p className="text-caption text-secondary">
                  Key: <code className="bg-bubble px-1.5 py-0.5 rounded text-micro">{category.key}</code>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h3 className="text-heading mb-3">How We Score</h3>
        <div className="space-y-3 text-body text-secondary">
          <p>
            Each category is scored on a 1-10 scale based on real-world testing, 
            user feedback, and documented capabilities. Scores reflect practical 
            performance, not marketing claims.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="score-cell score-null text-[10px] px-2 py-0.5">Not tested</span>
              <span className="text-caption">No data yet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="score-cell score-na text-[10px] px-2 py-0.5">N/A</span>
              <span className="text-caption">Doesn&apos;t apply</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
