import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bubble-blue to-accent-purple flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
              </div>
              <span className="font-semibold">AI Benchmark</span>
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Independent, evidence-based comparison of AI personal assistants. 
              Same metrics, real feedback, no sponsored rankings.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-secondary hover:text-foreground transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-secondary hover:text-foreground transition-colors">
                  Scoring Categories
                </Link>
              </li>
              <li>
                <Link href="/request" className="text-secondary hover:text-foreground transition-colors">
                  Request a Test
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Built to help people choose the right AI assistant for their needs. 
              All feedback is sourced from public discussions.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-secondary">
          <p>AI Assistant Benchmark &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
