import { getAgents, getIndexData } from '@/lib/data';
import { Leaderboard } from '@/components/Leaderboard';

export default function HomePage() {
  const agents = getAgents();
  const indexData = getIndexData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
          AI Assistant{' '}
          <span className="gradient-text">Benchmark</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          Independent, evidence-based comparison of AI personal assistants. 
          Same metrics across every product. Real user feedback, no sponsored rankings.
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <StatCard 
          label="Total Assistants" 
          value={indexData.summary.totalAgents} 
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard 
          label="Confirmed" 
          value={indexData.summary.confirmedAgents}
          color="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard 
          label="Categories" 
          value={indexData.summary.categoriesCount}
          color="purple"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
        <StatCard 
          label="Feedback Items" 
          value={indexData.summary.totalFeedbackRows}
          color="orange"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
      </section>

      <Leaderboard agents={agents} />
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon,
  color = 'blue' 
}: { 
  label: string; 
  value: number; 
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-bubble-blue/10 text-bubble-blue',
    green: 'bg-accent-green/10 text-accent-green',
    purple: 'bg-accent-purple/10 text-accent-purple',
    orange: 'bg-accent-orange/10 text-accent-orange',
  };

  return (
    <div className="bg-card rounded-2xl p-5 card-shadow">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-secondary">{label}</div>
    </div>
  );
}
