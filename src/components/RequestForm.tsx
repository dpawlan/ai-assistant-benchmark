'use client';

import { FormEvent, useState } from 'react';

interface FormData {
  agentName: string;
  agentUrl: string;
  categories: string[];
  contact: string;
  notes: string;
}

const initial: FormData = { agentName: '', agentUrl: '', categories: [], contact: '', notes: '' };

interface RequestFormProps {
  categories: { key: string; label: string }[];
}

export function RequestForm({ categories }: RequestFormProps) {
  const [data, setData] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [doneName, setDoneName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: string) =>
    setData(d => ({
      ...d,
      categories: d.categories.includes(key) ? d.categories.filter(k => k !== key) : [...d.categories, key],
    }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setDoneName(data.agentName.trim());
      setData(initial);
    } catch {
      setError('The request didn’t go through. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (doneName) {
    return (
      <div className="done" role="status">
        <h2>Got it. {doneName} is on the list.</h2>
        <p>We&apos;ll check it&apos;s real and public, then queue it for testing.</p>
        <button type="button" className="btn ghost" onClick={() => setDoneName(null)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="agentName">Assistant name</label>
        <input
          id="agentName"
          className="input"
          type="text"
          required
          autoComplete="off"
          value={data.agentName}
          onChange={e => setData(d => ({ ...d, agentName: e.target.value }))}
          placeholder="Poke, Town, Instinct…"
        />
      </div>

      <div className="field">
        <label htmlFor="agentUrl">Website</label>
        <input
          id="agentUrl"
          className="input"
          type="url"
          value={data.agentUrl}
          onChange={e => setData(d => ({ ...d, agentUrl: e.target.value }))}
          placeholder="https://"
        />
      </div>

      <div className="field">
        <label>Categories to test first</label>
        <div className="choices" role="group" aria-label="Categories to test first">
          {categories.map(c => {
            const on = data.categories.includes(c.key);
            return (
              <button key={c.key} type="button" className={`choice${on ? ' on' : ''}`} aria-pressed={on} onClick={() => toggle(c.key)}>
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="hint">Optional. Leave empty and we test everything.</p>
      </div>

      <div className="field">
        <label htmlFor="contact">How to reach you</label>
        <input
          id="contact"
          className="input"
          type="text"
          value={data.contact}
          onChange={e => setData(d => ({ ...d, contact: e.target.value }))}
          placeholder="Email or @handle"
        />
        <p className="hint">Optional. Only used to tell you when results are up.</p>
      </div>

      <div className="field">
        <label htmlFor="notes">Anything else</label>
        <textarea
          id="notes"
          className="input"
          rows={4}
          value={data.notes}
          onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
          placeholder="A use case worth testing, a correction to a listing, a link to a public thread…"
        />
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}

      <button type="submit" className="btn primary block" disabled={submitting || !data.agentName.trim()}>
        {submitting ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
