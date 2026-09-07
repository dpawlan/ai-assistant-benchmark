import { getAgents, getIndexData, getCategories } from '@/lib/data';
import { Leaderboard } from '@/components/Leaderboard';

export default function HomePage() {
  const agents = getAgents();
  const indexData = getIndexData();
  const categories = getCategories();

  const coreCount = categories.filter(c => c.group === 'core').length;
  const endorsedCount = categories.filter(c => c.group === 'endorsed').length;

  return (
    <div className="container-wide py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-display mb-3">
          AI Assistant Benchmark
        </h1>
        <p className="text-body text-secondary max-w-xl">
          Independent, evidence-based comparison of AI personal assistants. 
          Same metrics across every product. Real user feedback, no sponsored rankings.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 mb-8">
        <StatPill label="Assistants" value={indexData.agent_count} />
        <StatPill label="Confirmed" value={indexData.confirmed} variant="confirmed" />
        <StatPill label="Categories" value={coreCount + endorsedCount} />
        <StatPill label="Feedback items" value={indexData.feedback_count} />
      </div>

      <Leaderboard agents={agents} />
    </div>
  );
}

function StatPill({ 
  label, 
  value, 
  variant = 'default' 
}: { 
  label: string; 
  value: number; 
  variant?: 'default' | 'confirmed';
}) {
  const bgClass = variant === 'confirmed' 
    ? 'bg-confirmed-bg' 
    : 'bg-bubble';
  
  const textClass = variant === 'confirmed' 
    ? 'text-confirmed' 
    : 'text-foreground';

  return (
    <div className={`${bgClass} rounded-full px-4 py-2 flex items-center gap-2`}>
      <span className={`text-body-semibold ${textClass}`}>{value}</span>
      <span className="text-caption text-secondary">{label}</span>
    </div>
  );
}
