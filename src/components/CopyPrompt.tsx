'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';

/** Copies the prompt to the clipboard and flips to "Copied" for a moment. */
export function CopyPrompt({ text, job }: { text: string; job: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      track('uc_copy_prompt', { job });
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.prompt('Copy this prompt', text);
    }
  };
  return (
    <button type="button" className={`uc-copy${done ? ' done' : ''}`} onClick={copy} aria-label="Copy prompt">
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}
