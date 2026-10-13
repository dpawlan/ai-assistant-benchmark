import { redirect } from 'next/navigation';

export default async function PreviousTestPreview({ searchParams }: { searchParams: Promise<{ assistant?: string; dimension?: string }> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.assistant) query.set('assistant', params.assistant);
  if (params.dimension) query.set('dimension', params.dimension);
  redirect(`/reports/nyc-chicago${query.size ? `?${query}` : ''}`);
}
