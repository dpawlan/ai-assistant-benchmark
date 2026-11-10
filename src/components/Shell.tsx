import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { NewsletterPopup } from './NewsletterPopup';

interface ShellProps {
  footer: ReactNode;
  children: ReactNode;
}

/** Page frame: a top bar, the page, the footer. No sidebar. */
export function Shell({ footer, children }: ShellProps) {
  return (
    <div className="layout-top">
      <TopBar />
      <main>{children}</main>
      {footer}
      <NewsletterPopup />
    </div>
  );
}
