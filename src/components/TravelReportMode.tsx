'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChapterIcon, recapChapters } from './TravelRecapFrame';
import styles from './TravelReportMode.module.css';

const contentsChapters = [...recapChapters, { id: 'comparison', label: 'Scores' }];

export function TravelReportMode({ animated, article }: { animated: ReactNode; article: ReactNode }) {
  const [articleMode, setArticleMode] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const view = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const contentsButton = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);

  useEffect(() => {
    if (!contentsOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controls.current?.contains(event.target)) setContentsOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setContentsOpen(false);
      contentsButton.current?.focus({ preventScroll: true });
    };
    const phone = window.matchMedia('(max-width: 699px), (max-width: 1024px) and (max-height: 500px)');
    const closeOnDesktop = () => { if (!phone.matches) setContentsOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    phone.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
      phone.removeEventListener('change', closeOnDesktop);
    };
  }, [contentsOpen]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.topbar');
    if (!header) return;
    const measure = () => view.current?.style.setProperty('--report-header-height', `${header.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = destination.current;
    if (!id) return;
    destination.current = null;
    if (articleMode || id === 'recap-top') {
      const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }));
      return () => cancelAnimationFrame(frame);
    }
    // The animated frame restores the matching chapter from the hash on mount.
  }, [articleMode]);

  function switchMode() {
    setContentsOpen(false);
    const node = view.current;
    let id = 'recap-top';
    const navigation = !articleMode ? node?.querySelector('nav[aria-label="Travel recap chapters"]') : null;
    const navigationBounds = navigation?.getBoundingClientRect();
    const readingLine = (navigationBounds?.height ? navigationBounds.bottom : document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 80) + 80;
    const comparison = node?.querySelector<HTMLElement>('#comparison');
    if (comparison && comparison.getBoundingClientRect().top < readingLine) id = 'comparison';
    else if (articleMode) {
      node?.querySelectorAll<HTMLElement>('[data-article-chapter]').forEach(section => {
        if (section.getBoundingClientRect().top <= readingLine) id = section.id;
      });
    } else {
      const activeScene = node?.querySelector<HTMLElement>('[data-story-scene][data-scene-active="true"]');
      if (activeScene) id = activeScene.dataset.chapter ?? id;
      else node?.querySelectorAll<HTMLElement>('[data-story-scene]').forEach(section => {
        if (section.getBoundingClientRect().top <= readingLine) id = section.dataset.chapter ?? id;
      });
    }
    destination.current = id;
    window.history.replaceState(window.history.state, '', `#${id}`);
    setArticleMode(value => !value);
  }

  return <div className={styles.report} data-travel-mode={articleMode ? 'article' : 'animated'}>
    <div className={styles.controls} ref={controls} data-report-controls>
      <button ref={contentsButton} className={`${styles.toggle} ${styles.contentsButton}`} type="button" aria-expanded={contentsOpen} aria-controls="travel-report-contents" onClick={() => setContentsOpen(value => !value)}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" focusable="false"><path d="M7 5h10M7 10h10M7 15h10M3 5h.5M3 10h.5M3 15h.5" /></svg>
        Contents
        <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" focusable="false"><path d={contentsOpen ? 'm4 6 4 4 4-4' : 'm4 10 4-4 4 4'} /></svg>
      </button>
      {contentsOpen && <nav className={styles.contents} id="travel-report-contents" aria-label="Report sections">
        <ol>{contentsChapters.map(chapter => <li key={chapter.id}><a href={`#${chapter.id}`} onClick={() => {
          setContentsOpen(false);
          contentsButton.current?.focus({ preventScroll: true });
        }}><ChapterIcon id={chapter.id} /><span>{chapter.label}</span></a></li>)}</ol>
      </nav>}
      <button className={styles.toggle} type="button" onClick={switchMode} aria-controls="travel-report-view" aria-pressed={articleMode}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" focusable="false">
          {articleMode ? <><path d="m7 4 9 6-9 6V4Z" /></> : <><rect x="4" y="2.5" width="12" height="15" rx="1.5" /><path d="M7 7h6M7 10h6M7 13h4" /></>}
        </svg>
        {articleMode ? 'Animated mode' : 'Article mode'}
      </button>
    </div>
    <div id="travel-report-view" ref={view}>{articleMode ? article : animated}</div>
  </div>;
}
