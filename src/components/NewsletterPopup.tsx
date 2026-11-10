'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NewsletterSignup } from './NewsletterSignup';
import './newsletter-popup.css';

const DISMISSED = 'ab:newsletter-dismissed:v1';
const SEEN = 'ab:newsletter-seen:v1';
const MONTH = 30 * 24 * 60 * 60 * 1000;

export function NewsletterPopup() {
  const pathname = usePathname();
  return <Popup key={pathname} excluded={pathname.startsWith('/newsletter')} />;
}

function Popup({ excluded }: { excluded: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const demo = useRef(false);

  useEffect(() => {
    // Local-only shortcut for reviewing the popup without waiting or altering preferences.
    demo.current = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
      && new URLSearchParams(window.location.search).get('newsletterPopup') === 'preview';
    if (!demo.current) {
      if (excluded) return;
      try {
        const dismissed = Number(localStorage.getItem(DISMISSED));
        if ((dismissed > 0 && Date.now() - dismissed < MONTH) || sessionStorage.getItem(SEEN)) return;
      } catch { /* The form remains usable when browser storage is disabled. */ }
    }
    const timer = window.setTimeout(() => {
      if (!demo.current) {
        try { sessionStorage.setItem(SEEN, '1'); } catch { /* optional persistence */ }
      }
      setOpen(true);
    }, demo.current ? 100 : 25000);
    return () => window.clearTimeout(timer);
  }, [excluded]);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
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
    setOpen(false);
  }

  if (!open) return null;
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
    <NewsletterSignup />
  </dialog>;
}
