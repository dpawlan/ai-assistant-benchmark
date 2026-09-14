'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

interface FormData {
  title: string;
  assistant: string;
  assistantOther: string;
  what_happened: string;
  post_url: string;
  contact: string;
  vendor: boolean;
  /** Honeypot: real users never fill it. */
  website: string;
}

const EMPTY: FormData = { title: '', assistant: '', assistantOther: '', what_happened: '', post_url: '', contact: '', vendor: false, website: '' };

/** Submit a use case for review. Nothing appears on the site until it has been read and added by hand. */
export function UseCaseForm({ assistants }: { assistants: { slug: string; name: string }[] }) {
  const [data, setData] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => setData(d => ({ ...d, [key]: value }));
  const assistantName = data.assistant === 'other' ? data.assistantOther : (assistants.find(a => a.slug === data.assistant)?.name ?? '');
  const ready = data.title.trim() && assistantName.trim() && data.what_happened.trim();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/use-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          assistant: assistantName,
          what_happened: data.what_happened,
          post_url: data.post_url,
          contact: data.contact,
          vendor: data.vendor,
          website: data.website,
        }),
      });
      if (res.status === 429) throw new Error('rate');
      if (!res.ok) throw new Error(String(res.status));
      track('usecase_submitted', { vendor: data.vendor });
      setDone(true);
      setData(EMPTY);
    } catch (err) {
      setError(err instanceof Error && err.message === 'rate' ? 'Too many submissions from this connection. Try again in a few minutes.' : 'Something went wrong sending that. Try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="done">
        <h2>Got it.</h2>
        <p>We read every one. It shows up on the use-cases page once it&apos;s been checked and merged, usually within a few days.</p>
        <button type="button" className="btn ghost" onClick={() => setDone(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="uc-title">What did you ask for?</label>
        <input id="uc-title" className="input" value={data.title} onChange={e => set('title', e.target.value)} placeholder="Book a flight with points" maxLength={120} required />
        <p className="hint">One line, the job itself. Not the assistant&apos;s name.</p>
      </div>
      <div className="field">
        <label htmlFor="uc-assistant">Which assistant?</label>
        <select id="uc-assistant" className="input" value={data.assistant} onChange={e => set('assistant', e.target.value)} required>
          <option value="">Pick one</option>
          {assistants.map(a => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
          <option value="other">Other…</option>
        </select>
        {data.assistant === 'other' && (
          <input className="input" style={{ marginTop: 8 }} value={data.assistantOther} onChange={e => set('assistantOther', e.target.value)} placeholder="Assistant name" maxLength={80} />
        )}
      </div>
      <div className="field">
        <label htmlFor="uc-what">What happened?</label>
        <textarea id="uc-what" className="input" rows={5} value={data.what_happened} onChange={e => set('what_happened', e.target.value)} placeholder="What it did, how it ended, anything it got wrong." maxLength={2000} required />
      </div>
      <div className="field">
        <label htmlFor="uc-url">Link to your post (optional)</label>
        <input id="uc-url" className="input" type="url" value={data.post_url} onChange={e => set('post_url', e.target.value)} placeholder="https://x.com/…" maxLength={300} />
        <p className="hint">If you posted about it, we link to the post as the source.</p>
      </div>
      <div className="field">
        <label htmlFor="uc-contact">How to reach you (optional)</label>
        <input id="uc-contact" className="input" value={data.contact} onChange={e => set('contact', e.target.value)} placeholder="Email or @handle" maxLength={200} />
      </div>
      <div className="field">
        <label className="uc-form-check">
          <input type="checkbox" checked={data.vendor} onChange={e => set('vendor', e.target.checked)} />
          <span>
            I work on this assistant
            <span className="hint" style={{ display: 'block' }}>
              Vendor submissions are welcome and labelled as such.
            </span>
          </span>
        </label>
      </div>
      <div className="hp" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" name="website" value={data.website} onChange={e => set('website', e.target.value)} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn primary block" disabled={!ready || submitting}>
        {submitting ? 'Sending…' : 'Submit use case'}
      </button>
    </form>
  );
}
