'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NewsletterSignup } from './NewsletterSignup';
import './newsletter-popup.css';

const DISMISSED = 'ab:newsletter-dismissed:v1';
const SEEN = 'ab:newsletter-seen:v1';
const STARTED = 'ab:newsletter-started:v1';
const DELAY = 10000;
const MONTH = 30 * 24 * 60 * 60 * 1000;

export function NewsletterPopup() {
  const pathname = usePathname();
  return <Popup key={pathname} excluded={pathname.startsWith('/newsletter')} />;
}

function Popup({ excluded }: { excluded: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [prepared, setPrepared] = useState(false);
  const [due, setDue] = useState(false);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const open = due && !dismissed;
  const demo = useRef(false);

  useEffect(() => {
    // Local-only shortcut for reviewing the popup without waiting or altering preferences.
    demo.current = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
      && new URLSearchParams(window.location.search).get('newsletterPopup') === 'preview';
    let delay = demo.current ? 100 : DELAY;
    if (!demo.current) {
      if (excluded) return;
      try {
        const dismissed = Number(localStorage.getItem(DISMISSED));
        if ((dismissed > 0 && Date.now() - dismissed < MONTH) || sessionStorage.getItem(SEEN)) return;
        const stored = Number(sessionStorage.getItem(STARTED));
        const started = stored > 0 && stored <= Date.now() ? stored : Date.now();
        sessionStorage.setItem(STARTED, String(started));
        delay = Math.max(0, DELAY - (Date.now() - started));
      } catch { /* The form remains usable when browser storage is disabled. */ }
    }
    const preload = window.setTimeout(() => setPrepared(true), 0);
    const timer = window.setTimeout(() => setDue(true), delay);
    return () => { window.clearTimeout(preload); window.clearTimeout(timer); };
  }, [excluded]);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    if (!demo.current) {
      try { sessionStorage.setItem(SEEN, '1'); } catch { /* optional persistence */ }
    }
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  function dismiss() {
    if (!demo.current) {
      try { localStorage.setItem(DISMISSED, String(Date.now())); } catch { /* optional persistence */ }
    }
    dialog.current?.close();
    setDismissed(true);
  }

  if (!prepared || dismissed) return null;
  return <dialog ref={dialog} className="newsletter-popup" aria-labelledby="newsletter-popup-title"
    onCancel={event => { event.preventDefault(); dismiss(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss();
    }}>
    <button type="button" className="newsletter-popup-close" aria-label="Close newsletter popup" onClick={dismiss} autoFocus>×</button>
    <Image src="/newsletter/icon.png" alt="" width={56} height={56} />
    <h2 id="newsletter-popup-title">Keep up with AI agents and the agentic economy.</h2>
    <p className="newsletter-popup-cadence">In your inbox every Monday morning.</p>
    <NewsletterSignup onReady={onReady} showFallback={due && !ready} />
  </dialog>;
}
