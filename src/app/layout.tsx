import type { Metadata } from 'next';
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
  title: {
    default: 'Assistant Benchmark',
    template: '%s | Assistant Benchmark',
  },
  description:
    'A public scorecard for AI assistants you can text. Every assistant scored on the same 14 categories, backed by real public quotes.',
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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const categories = getCategories();
  const index = getIndexData();

  return (
    <html lang="en">
      <body>
        <Shell sidebar={<Sidebar categories={categories} />} footer={<Footer index={index} />}>
          {children}
        </Shell>
      </body>
    </html>
  );
}
