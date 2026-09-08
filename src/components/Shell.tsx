'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ShellProps {
  sidebar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function Shell({ sidebar, footer, children }: ShellProps) {
  const pathname = usePathname();
  // The drawer is open only for the path it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const close = () => setOpenPath(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="layout">
      <div className={`scrim${open ? ' on' : ''}`} onClick={close} aria-hidden="true" />
      <aside id="sidebar" className={`sidebar${open ? ' open' : ''}`}>
        {sidebar}
      </aside>
      <div className="content">
        <button
          type="button"
          className="menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h14M3 10h14M3 14h14" />
            </svg>
          )}
        </button>
        <main>{children}</main>
        {footer}
      </div>
    </div>
  );
}
