import { Metadata } from 'next';
import { RosterPage } from '@/components/RosterPage';

export const metadata: Metadata = {
  title: 'Stretch products',
  description: 'Voice, hardware, desktop and infra products kept on the board and scored N/A where the rubric does not apply.',
};

export default function StretchPage() {
  return <RosterPage status="stretch" />;
}
