import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-divider bg-surface">
      <div className="container-wide py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
              <svg 
                className="w-3 h-3 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <span className="text-caption text-secondary">
              AI Assistant Benchmark
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-caption text-secondary hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/categories" 
              className="text-caption text-secondary hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/request" 
              className="text-caption text-secondary hover:text-foreground transition-colors"
            >
              Request a Test
            </Link>
          </nav>
        </div>
        
        <div className="mt-6 pt-6 border-t border-divider">
          <p className="text-caption text-secondary text-center sm:text-left">
            Independent, evidence-based comparison of AI personal assistants. 
            No sponsored rankings.
          </p>
        </div>
      </div>
    </footer>
  );
}
