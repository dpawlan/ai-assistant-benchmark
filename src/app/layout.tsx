import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Shell } from '@/components/Shell';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { getCategories, getIndexData } from '@/lib/data';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Assistant Benchmark',
  title: {
    default: 'Assistant Benchmark',
    template: '%s | Assistant Benchmark',
  },
  description:
    'A public scorecard for AI assistants you can text. Every assistant scored on the same 15 dimensions, backed by real public quotes.',
  openGraph: {
    title: 'Assistant Benchmark',
    description: 'Which assistant is actually worth texting? One rubric, real quotes, no sponsored rankings.',
    type: 'website',
    siteName: 'Assistant Benchmark',
    images: [{ url: '/og/site.png', width: 1200, height: 630, alt: 'Assistant Benchmark' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assistant Benchmark',
    description: 'Which assistant is actually worth texting? One rubric, real quotes, no sponsored rankings.',
    images: ['/og/site.png'],
  },
};

/** Tells Google the site's name for the line above the URL in results (it reads this from the homepage). */
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Assistant Benchmark',
  alternateName: ['AI Assistant Benchmark', 'assistantbenchmark'],
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const categories = getCategories();
  const index = getIndexData();

  return (
    <html lang="en">
      <body>
        <Shell sidebar={<Sidebar categories={categories} />} footer={<Footer index={index} />}>
          {children}
        </Shell>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </body>
    </html>
  );
}
