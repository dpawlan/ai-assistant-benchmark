import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/Shell';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { getCategories, getIndexData } from '@/lib/data';

export const metadata: Metadata = {
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
