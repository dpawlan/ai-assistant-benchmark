import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-narrow py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-bubble flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-secondary" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h1 className="text-display mb-3">Page Not Found</h1>
      <p className="text-body text-secondary mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="btn-primary inline-flex"
      >
        Back to Leaderboard
      </Link>
    </div>
  );
}
