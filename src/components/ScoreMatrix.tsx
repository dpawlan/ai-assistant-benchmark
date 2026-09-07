import { AgentScores, Category, ScoreValue } from '@/lib/types';

interface ScoreMatrixProps {
  scores?: AgentScores;
  categories: Category[];
  isStretch: boolean;
}

function ScoreCell({ value, isStretch }: { value: ScoreValue; isStretch: boolean }) {
  if (isStretch && value === null) {
    return (
      <span className="score-cell score-na">
        N/A
      </span>
    );
  }
  
  if (value === null || value === undefined) {
    return (
      <span className="score-cell score-null">
        Not tested
      </span>
    );
  }
  
  const getScoreClass = (score: number) => {
    if (score >= 8) return 'score-high';
    if (score >= 6) return 'score-mid';
    if (score >= 4) return 'score-low';
    return 'score-poor';
  };

  return (
    <span className={`score-cell ${getScoreClass(value)}`}>
      {value}
    </span>
  );
}

export function ScoreMatrix({ scores, categories, isStretch }: ScoreMatrixProps) {
  const coreCategories = categories.filter(c => c.group === 'core');
  const endorsedCategories = categories.filter(c => c.group === 'endorsed');

  const getScore = (key: string): ScoreValue => {
    if (!scores) return null;
    return scores[key] ?? null;
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-divider">
        <h2 className="text-heading">Score Matrix</h2>
        <p className="text-caption text-secondary mt-1">
          {categories.length} evaluation categories
        </p>
      </div>
      
      <div className="p-4 space-y-6">
        <section>
          <h3 className="text-micro text-secondary uppercase tracking-wider mb-3">
            Core Categories
          </h3>
          <div className="space-y-2">
            {coreCategories.map(category => (
              <div 
                key={category.key} 
                className="flex items-center justify-between py-2 border-b border-divider last:border-b-0"
              >
                <span className="text-body flex-1 min-w-0 pr-4">
                  {category.label}
                </span>
                <ScoreCell 
                  value={getScore(category.key)} 
                  isStretch={isStretch}
                />
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-micro text-secondary uppercase tracking-wider mb-3">
            Endorsed Categories
          </h3>
          <div className="space-y-2">
            {endorsedCategories.map(category => (
              <div 
                key={category.key} 
                className="flex items-center justify-between py-2 border-b border-divider last:border-b-0"
              >
                <span className="text-body flex-1 min-w-0 pr-4">
                  {category.label}
                </span>
                <ScoreCell 
                  value={getScore(category.key)} 
                  isStretch={isStretch}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <div className="px-4 py-3 bg-surface border-t border-divider">
        <div className="flex flex-wrap gap-4 text-micro text-secondary">
          <div className="flex items-center gap-2">
            <span className="score-cell score-null text-[10px] px-2 py-0.5">Not tested</span>
            <span>No data yet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="score-cell score-na text-[10px] px-2 py-0.5">N/A</span>
            <span>Not applicable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
