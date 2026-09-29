import { getAllSlugs } from '@/lib/data';
import { sendEmail } from '@/lib/inbox';
import tasks from '../../../../data/tasks.json';
import { createIntake } from '../../../../scripts/lib/contribution-intake.mjs';

export const runtime = 'nodejs';

// No raw payloads in email, logs or Git history. Missing configuration fails closed.
export const POST = createIntake({
  slugs: getAllSlugs(),
  categories: tasks.tasks.map(t => t.key),
  notify: async ({ id, slug, count }: { id: string; slug: string; count: number }) => {
    if (!process.env.RESEND_API_KEY) throw new Error('Notification not configured');
    await sendEmail({
      subject: 'Benchmark contribution received',
      rows: [['Receipt', id], ['Assistant', slug], ['Drafts', String(count)]],
      text: `Contribution ${id}: ${count} drafts for ${slug}. Pull the private inbox to review.`,
    });
  },
});
