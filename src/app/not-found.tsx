import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Nothing here</h1>
        <p className="page-sub">That page doesn&apos;t exist. The assistant may have been renamed, or the link is wrong.</p>
        <p style={{ marginTop: 20 }}>
          <Link href="/" className="btn ghost">
            Back to the leaderboard
          </Link>
        </p>
      </div>
    </div>
  );
}
