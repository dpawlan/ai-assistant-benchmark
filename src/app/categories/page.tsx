import { Metadata } from 'next';
import { getCategories } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Scoring Categories | AI Assistant Benchmark',
  description: 'The 14 evaluation categories used to benchmark AI personal assistants. 7 core categories and 7 endorsed specialty areas.',
};

export default function CategoriesPage() {
  const categories = getCategories();
  const coreCategories = categories.filter(c => c.type === 'core');
  const endorsedCategories = categories.filter(c => c.type === 'endorsed');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Scoring Categories</h1>
        <p className="text-secondary leading-relaxed max-w-2xl mx-auto">
          Every AI assistant is evaluated across the same {categories.length} categories. 
          This ensures fair, consistent comparisons regardless of the tool&apos;s specialty.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-bubble-blue/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-bubble-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Core Categories</h2>
            <p className="text-sm text-secondary">Fundamental capabilities expected from personal assistants</p>
          </div>
        </div>

        <div className="grid gap-4">
          {coreCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index + 1} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Endorsed Categories</h2>
            <p className="text-sm text-secondary">Specialty areas with varying support across assistants</p>
          </div>
        </div>

        <div className="grid gap-4">
          {endorsedCategories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={coreCategories.length + index + 1} 
              isEndorsed 
            />
          ))}
        </div>
      </section>

      <div className="mt-12 p-6 bg-bubble-gray/30 rounded-2xl">
        <h3 className="font-semibold mb-3">How We Score</h3>
        <div className="space-y-3 text-sm text-secondary">
          <p>
            Each category is scored on a 1-10 scale based on real-world testing, 
            user feedback, and documented capabilities. Scores reflect practical 
            performance, not marketing claims.
          </p>
          <p>
            <strong className="text-foreground">Not tested (—):</strong> We haven&apos;t evaluated this category yet.
          </p>
          <p>
            <strong className="text-foreground">N/A:</strong> Category doesn&apos;t apply to this type of assistant.
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ 
  category, 
  index,
  isEndorsed = false 
}: { 
  category: { id: string; label: string; description: string };
  index: number;
  isEndorsed?: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl p-6 card-shadow flex items-start gap-4">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
        isEndorsed 
          ? 'bg-accent-purple/10 text-accent-purple' 
          : 'bg-bubble-blue/10 text-bubble-blue'
      }`}>
        {index}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{category.label}</h3>
        <p className="text-sm text-secondary">{category.description}</p>
      </div>
    </div>
  );
}
