'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="container-wide">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 touch-target"
          >
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
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
            <span className="text-body-semibold hidden sm:inline">
              AI Benchmark
            </span>
          </Link>
          
          <nav className="flex items-center gap-1">
            <NavLink href="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink href="/categories" active={isActive('/categories')}>
              Categories
            </NavLink>
            <Link 
              href="/request" 
              className="ml-2 px-4 py-2 text-body-semibold text-white bg-accent rounded-full hover:opacity-90 transition-opacity touch-target flex items-center justify-center"
            >
              <span className="hidden sm:inline">Request a Test</span>
              <span className="sm:hidden">Request</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 text-caption font-medium rounded-lg transition-colors touch-target flex items-center justify-center ${
        active 
          ? 'text-foreground bg-bubble' 
          : 'text-secondary hover:text-foreground hover:bg-bubble/50'
      }`}
    >
      {children}
    </Link>
  );
}
