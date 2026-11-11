'use client';

import { useEffect, useRef, useState } from 'react';
import { preconnect, preload } from 'react-dom';

export function NewsletterSignup({ onReady, showFallback = false }: { onReady?: () => void; showFallback?: boolean } = {}) {
  preconnect('https://subscribe-forms.beehiiv.com');
  preload('https://subscribe-forms.beehiiv.com/v3/loader.js', { as: 'script' });
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
    const frames = new Set<HTMLIFrameElement>();
    const loaded = () => { setFailed(false); onReady?.(); };
    const observer = new MutationObserver(() => {
      host.querySelectorAll('iframe').forEach(frame => {
        if (frames.has(frame)) return;
        frames.add(frame);
        frame.title = 'Subscribe to the Assistant Benchmark newsletter';
        frame.loading = 'eager';
        frame.addEventListener('load', loaded);
      });
    });
    observer.observe(host, { childList: true, subtree: true });
    host.appendChild(script);
    return () => { observer.disconnect(); frames.forEach(frame => frame.removeEventListener('load', loaded)); script.onerror = null; host.replaceChildren(); };
  }, [onReady]);
  return <div className="nl-signup" id="subscribe">
    <div ref={container} aria-label="Newsletter subscription form" style={showFallback || failed ? { position: 'absolute', width: '100%', visibility: 'hidden', pointerEvents: 'none' } : undefined} />
    {(showFallback || failed) && <a className="nl-signup-fallback" href="https://assistant-benchmark-newsletter.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer">Subscribe on Beehiiv ↗</a>}
    {failed && <p className="nl-form-note">The embedded form couldn’t load. Use the Beehiiv link to subscribe.</p>}
    <p className="nl-form-note">Free to read. Unsubscribe anytime. <a href="https://assistant-benchmark-newsletter.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer">Subscribe on Beehiiv ↗</a></p>
  </div>;
}
