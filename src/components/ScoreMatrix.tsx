import { AgentScores, Category, ScoreValue } from '@/lib/types';

interface ScoreMatrixProps {
  scores: AgentScores;
  categories: Category[];
  isStretch: boolean;
}

function ScoreCell({ value, isStretch }: { value: ScoreValue; isStretch: boolean }) {
  if (value === 'n/a' || (isStretch && value === null)) {
    return (
      <div className="score-cell score-na text-xs">
        N/A
      </div>
    );
  }
  
  if (value === null) {
    return (
      <div className="score-cell score-null text-xs">
        —
      </div>
    );
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-accent-green/20 text-accent-green';
    if (score >= 6) return 'bg-bubble-blue/20 text-bubble-blue';
    if (score >= 4) return 'bg-accent-orange/20 text-accent-orange';
    return 'bg-red-500/20 text-red-500';
  };

  return (
    <div className={`score-cell ${getScoreColor(value)}`}>
      {value}
    </div>
  );
}

export function ScoreMatrix({ scores, categories, isStretch }: ScoreMatrixProps) {
  const coreCategories = categories.filter(c => c.type === 'core');
  const endorsedCategories = categories.filter(c => c.type === 'endorsed');

  return (
    <div className="bg-card rounded-2xl card-shadow overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-semibold text-lg">Score Matrix</h2>
        <p className="text-sm text-secondary mt-1">
          Performance across {categories.length} evaluation categories
        </p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-secondary uppercase tracking-wider mb-3">
            Core Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coreCategories.map(category => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-bubble-gray/30"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="font-medium text-sm truncate">{category.label}</div>
                  <div className="text-xs text-secondary truncate">{category.description}</div>
                </div>
                <ScoreCell 
                  value={scores[category.id as keyof AgentScores]} 
                  isStretch={isStretch}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-secondary uppercase tracking-wider mb-3">
            Endorsed Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {endorsedCategories.map(category => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-bubble-gray/30"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="font-medium text-sm truncate">{category.label}</div>
                  <div className="text-xs text-secondary truncate">{category.description}</div>
                </div>
                <ScoreCell 
                  value={scores[category.id as keyof AgentScores]} 
                  isStretch={isStretch}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-bubble-gray/20 border-t border-border">
        <div className="flex flex-wrap gap-4 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <div className="score-cell score-null text-xs w-8 h-6">—</div>
            <span>Not tested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="score-cell score-na text-xs w-8 h-6">N/A</div>
            <span>Not applicable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
