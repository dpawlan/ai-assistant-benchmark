import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-bubble-blue to-accent-purple flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
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
            <span className="font-semibold text-lg tracking-tight">
              AI Benchmark
            </span>
          </Link>
          
          <nav className="flex items-center gap-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-foreground transition-colors rounded-lg hover:bg-bubble-gray/50"
            >
              Leaderboard
            </Link>
            <Link 
              href="/categories" 
              className="px-4 py-2 text-sm font-medium text-secondary hover:text-foreground transition-colors rounded-lg hover:bg-bubble-gray/50"
            >
              Categories
            </Link>
            <Link 
              href="/request" 
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-bubble-blue hover:bg-bubble-blue/90 transition-colors rounded-full"
            >
              Request a Test
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
