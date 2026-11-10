'use client';

import { useEffect, useRef, useState } from 'react';

export function NewsletterSignup() {
  const container = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    script.dataset.beehiivForm = '471acc77-560e-4a7b-a1d1-057497840354';
    script.onerror = () => setFailed(true);
    const observer = new MutationObserver(() => {
      host.querySelectorAll('iframe').forEach(frame => { frame.title = 'Subscribe to the Assistant Benchmark newsletter'; });
    });
    observer.observe(host, { childList: true, subtree: true });
    host.appendChild(script);
    return () => { observer.disconnect(); script.onerror = null; host.replaceChildren(); };
  }, []);
  return <div className="nl-signup" id="subscribe">
    <div ref={container} aria-label="Newsletter subscription form" />
    {failed && <p className="nl-form-note">The signup form couldn’t load. You can still subscribe below.</p>}
    <p className="nl-form-note">Free to read. Unsubscribe anytime. <a href="https://assistant-benchmark-newsletter.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer">Subscribe on Beehiiv ↗</a></p>
  </div>;
}
