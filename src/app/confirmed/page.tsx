import { Metadata } from 'next';
import { RosterPage } from '@/components/RosterPage';

export const metadata: Metadata = {
  title: 'Confirmed assistants',
  description: 'Personal AI assistants you text, each reviewed on the same 14 categories.',
};

export default function ConfirmedPage() {
  return <RosterPage status="confirmed" />;
}
