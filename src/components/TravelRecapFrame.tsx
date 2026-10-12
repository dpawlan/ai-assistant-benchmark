'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './TravelRecap.module.css';

export const recapChapters = [
  { id: 'approaches', label: 'Methods' },
  { id: 'book', label: 'Booking' },
  { id: 'seats', label: 'Seats' },
  { id: 'change', label: 'Changes' },
  { id: 'fares', label: 'Fares' },
  { id: 'cancel', label: 'Cancel' },
  { id: 'profile', label: 'Details' },
  { id: 'speed', label: 'Speed' },
  { id: 'verdict', label: 'Verdict' },
];

const navigationChapters = [...recapChapters, { id: 'comparison', label: 'Table' }];

export function ChapterIcon({ id }: { id: string }) {
  const drawing = id === 'approaches' ? <><path d="M4 12h6m0 0V5h7m-7 7h7m-7 0v7h7" /><circle cx="3" cy="12" r="1.5" /><circle cx="19" cy="5" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="19" cy="19" r="1.5" /></>
    : id === 'book' ? <><path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z" /><path d="M15 5v14M8 9h3m-3 4h3" /></>
      : id === 'seats' ? <><rect x="6" y="3" width="12" height="11" rx="3" /><path d="M4 11v7h16v-7M7 18v3m10-3v3M6 14h12" /></>
        : id === 'change' ? <><path d="M5 8a7 7 0 0 1 12-3l3 3m0-5v5h-5M19 16a7 7 0 0 1-12 3l-3-3m0 5v-5h5" /></>
          : id === 'fares' ? <><path d="M3 5h8l10 10-6 6L3 9V5Z" /><circle cx="7" cy="8" r="1" /><path d="m12 12 4 4" /></>
            : id === 'cancel' ? <><path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Z" /><path d="m9 9 6 6m0-6-6 6" /></>
              : id === 'profile' ? <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M6 16a3 3 0 0 1 6 0m3-7h3m-3 4h3" /></>
                : id === 'speed' ? <><circle cx="12" cy="14" r="7" /><path d="M9 3h6m-3 0v4m6 1 2-2m-8 5v4l3 2" /></>
                  : id === 'comparison' ? <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16m6-16v16M3 14h18" /></>
                    : <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{drawing}</svg>;
}

export function TravelRecapFrame({ hero, intro, children, comparison }: { hero: ReactNode; intro?: ReactNode; children: ReactNode; comparison?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const node = root.current;
    const story = track.current;
    if (!node || !story) return;
    const sections = recapChapters.map(chapter => node.querySelector<HTMLElement>(`[data-chapter="${chapter.id}"]`)).filter((section): section is HTMLElement => !!section);
    const anchors = Array.from(story.querySelectorAll<HTMLElement>('[data-story-anchor]'));
    const header = document.querySelector<HTMLElement>('.topbar');
    const navigation = node.querySelector<HTMLElement>('nav');
    const comparisonSection = node.querySelector<HTMLElement>('[data-recap-comparison]');
    const viewport = node.querySelector<HTMLElement>('[data-viewport-height]');
    const controls = document.querySelector<HTMLElement>('[data-report-controls]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let enhanced = false;
    let stageHeight = 0;
    let step = 0;
    let stickyTop = 0;
    let start = 0;
    let chapter = -1;
    let disposed = false;

    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const currentPosition = () => (window.scrollY - start + stickyTop) / step;
    const setChapter = (next: number) => {
      if (chapter !== next) {
        chapter = next;
        setActive(next);
      }
    };
    const jumpToHash = () => {
      let hash: string;
      try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!enhanced) {
        const target = document.getElementById(hash);
        if (target && node.contains(target)) target.scrollIntoView({ block: 'start', behavior: 'instant' });
        return;
      }
      if (hash === 'comparison' && comparisonSection) {
        comparisonSection.scrollIntoView({ block: 'start', behavior: 'instant' });
        return;
      }
      const index = recapChapters.findIndex(item => item.id === hash);
      if (index !== -1) {
        window.scrollTo({ top: start - stickyTop + (index + 0.67) * step, behavior: 'instant' });
      } else if (hash) {
        // Existing evidence links also lead to the chapter containing their target.
        const target = document.getElementById(hash);
        const scene = target?.closest<HTMLElement>('[data-story-scene]');
        const sceneIndex = scene ? sections.indexOf(scene) : -1;
        if (sceneIndex !== -1) window.scrollTo({ top: start - stickyTop + (sceneIndex + 0.67) * step, behavior: 'instant' });
      }
    };
    const update = () => {
      frame = 0;
      if (disposed) return;
      if (!enhanced) {
        let next = -1;
        sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= stickyTop + 26) next = index; });
        if (comparisonSection && comparisonSection.getBoundingClientRect().top <= stickyTop + 26) next = sections.length;
        setChapter(next);
        return;
      }
      const rawPosition = currentPosition();
      const position = clamp(rawPosition, 0, sections.length);
      const comparisonActive = comparisonSection && comparisonSection.getBoundingClientRect().top <= stickyTop + 26;
      const next = comparisonActive ? sections.length : rawPosition < -0.08 ? -1 : clamp(Math.floor(position), 0, sections.length - 1);
      const focus = document.activeElement;
      const oldFocusScene = focus instanceof HTMLElement ? focus.closest<HTMLElement>('[data-story-scene]') : null;
      sections.forEach((section, index) => {
        const local = position - index;
        const enter = index === 0 ? 1 : clamp((local + 0.12) / 0.24);
        const exit = index === sections.length - 1 ? 1 : clamp((1.12 - local) / 0.24);
        const presence = Math.min(enter, exit);
        const titleEnter = index === 0 ? 1 : clamp(local / 0.1);
        const titleExit = index === sections.length - 1 ? 1 : clamp((0.98 - local) / 0.1);
        const titlePresence = Math.min(titleEnter, titleExit);
        const titleShift = local < 0.5 ? (1 - titleEnter) * 12 : -(1 - titleExit) * 12;
        const shift = local < 0.5 ? (1 - presence) * 48 : -(1 - presence) * 48;
        section.style.setProperty('--scene-progress', `${clamp(local)}`);
        section.style.setProperty('--scene-opacity', `${presence}`);
        section.style.setProperty('--scene-shift', `${shift}px`);
        section.style.setProperty('--scene-scale', `${0.975 + presence * 0.025}`);
        section.style.setProperty('--scene-title-opacity', `${titlePresence}`);
        section.style.setProperty('--scene-title-shift', `${titleShift}px`);
        section.dataset.sceneActive = `${index === next}`;
        section.dataset.sceneVisible = `${presence > 0.001}`;
        section.dataset.entered = `${rawPosition >= index - 0.12}`;
        section.inert = index !== next;
        section.setAttribute('aria-hidden', `${index !== next}`);
      });
      if (oldFocusScene && oldFocusScene !== sections[next]) {
        // Keep keyboard focus on visible content when a focused chapter leaves the stage.
        const title = (sections[next] ?? comparisonSection)?.querySelector<HTMLElement>('h2');
        if (title) title.focus({ preventScroll: true });
        else if (focus instanceof HTMLElement) focus.blur();
      }
      setChapter(next);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const syncLayout = () => {
      if (disposed) return;
      const wasEnhanced = enhanced;
      const previousComparisonTop = comparisonSection?.getBoundingClientRect().top;
      const wasInComparison = previousComparisonTop !== undefined && previousComparisonTop <= stickyTop + 26;
      const previousComparisonOffset = previousComparisonTop === undefined ? 0 : previousComparisonTop - stickyTop;
      const previousPosition = enhanced && step ? currentPosition() : -1;
      const previousStart = start;
      const headerHeight = header?.getBoundingClientRect().height ?? 55;
      const navigationHeight = navigation?.getBoundingClientRect().height ?? 90;
      stickyTop = headerHeight + navigationHeight;
      node.style.setProperty('--recap-header-height', `${headerHeight}px`);
      node.style.setProperty('--recap-nav-height', `${navigationHeight}px`);
      const phone = window.innerWidth < 700 || (window.innerWidth <= 1024 && window.innerHeight <= 500);
      const screenHeight = phone ? viewport?.getBoundingClientRect().height ?? window.innerHeight : window.innerHeight;
      const controlHeight = phone ? controls?.getBoundingClientRect().height ?? 64 : 0;
      stageHeight = Math.max(180, screenHeight - stickyTop - controlHeight);
      step = Math.max(480, stageHeight * 1.35);
      enhanced = !reduceMotion.matches && screenHeight - stickyTop - controlHeight >= (phone ? 180 : 420);
      if (enhanced) {
        node.dataset.storyEnhanced = 'true';
        story.style.setProperty('--story-height', `${stageHeight}px`);
        story.style.setProperty('--story-length', `${sections.length * step + stageHeight}px`);
        sections.forEach((section, index) => {
          section.id = `${recapChapters[index].id}-scene`;
          const anchor = anchors[index];
          if (anchor) {
            anchor.id = recapChapters[index].id;
            anchor.style.top = `${(index + 0.67) * step}px`;
          }
          const inner = section.querySelector<HTMLElement>('[data-scene-inner]');
          const heading = section.querySelector<HTMLElement>('[data-scene-heading]');
          const canvas = section.querySelector<HTMLElement>('[data-visual-canvas]');
          const padding = phone ? 24 : 48;
          if (phone && heading && canvas) {
            const headingSpace = heading.offsetHeight + parseFloat(getComputedStyle(heading).marginBottom);
            const visualHeight = Math.min(canvas.offsetHeight, Math.max(80, stageHeight - padding - headingSpace));
            section.style.setProperty('--scene-visual-height', `${visualHeight}px`);
            section.style.setProperty('--scene-visual-overflow', `${Math.max(0, canvas.offsetHeight - visualHeight)}px`);
            section.style.setProperty('--scene-fit', '1');
          } else {
            section.style.removeProperty('--scene-visual-height');
            section.style.removeProperty('--scene-visual-overflow');
            const fit = inner ? Math.min(1, (stageHeight - padding) / Math.max(1, inner.offsetHeight)) : 1;
            section.style.setProperty('--scene-fit', `${fit}`);
          }
        });
        start = story.getBoundingClientRect().top + window.scrollY;
        if (!wasInComparison && wasEnhanced && previousPosition >= 0 && previousPosition <= sections.length && previousStart !== 0) {
          const desired = start - stickyTop + previousPosition * step;
          if (Math.abs(desired - window.scrollY) > 1) window.scrollTo({ top: desired, behavior: 'instant' });
        }
      } else {
        delete node.dataset.storyEnhanced;
        anchors.forEach(anchor => { anchor.removeAttribute('id'); anchor.style.removeProperty('top'); });
        sections.forEach((section, index) => {
          section.id = recapChapters[index].id;
          section.inert = false;
          section.removeAttribute('aria-hidden');
          section.removeAttribute('data-scene-visible');
          section.removeAttribute('data-scene-active');
          section.dataset.entered = 'true';
          section.style.removeProperty('--scene-fit');
          section.style.removeProperty('--scene-visual-height');
          section.style.removeProperty('--scene-visual-overflow');
          section.style.setProperty('--scene-progress', '1');
        });
        story.style.removeProperty('--story-height');
        story.style.removeProperty('--story-length');
        if (!wasInComparison && wasEnhanced && previousPosition >= 0) sections[Math.min(sections.length - 1, Math.floor(previousPosition))]?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      if (wasInComparison && comparisonSection && previousComparisonTop !== undefined) {
        if (previousComparisonTop >= 0) {
          comparisonSection.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else {
          const offset = comparisonSection.getBoundingClientRect().top - stickyTop - previousComparisonOffset;
          if (Math.abs(offset) > 1) window.scrollTo({ top: window.scrollY + offset, behavior: 'instant' });
        }
      }
      update();
    };
    const onSceneFocus = (event: FocusEvent) => {
      if (!enhanced || !(event.target instanceof HTMLElement)) return;
      const section = event.target.closest<HTMLElement>('[data-story-scene]');
      const canvas = event.target.closest<HTMLElement>('[data-visual-canvas]');
      const visual = canvas?.parentElement;
      if (!section || !canvas || !visual) return;
      const overflow = parseFloat(section.style.getPropertyValue('--scene-visual-overflow')) || 0;
      if (overflow <= 0) return;
      const targetRect = event.target.getBoundingClientRect();
      const windowRect = visual.getBoundingClientRect();
      if (targetRect.top >= windowRect.top && targetRect.bottom <= windowRect.bottom) return;
      const targetCenter = targetRect.top - canvas.getBoundingClientRect().top + targetRect.height / 2;
      const pan = clamp((targetCenter - windowRect.height / 2) / overflow);
      const index = sections.indexOf(section);
      window.scrollTo({ top: start - stickyTop + (index + .3 + pan * .4) * step, behavior: 'instant' });
    };
    const onMotionChange = () => {
      const previousChapter = chapter;
      syncLayout();
      if (previousChapter < 0) return;
      if (previousChapter === sections.length && comparisonSection) {
        comparisonSection.scrollIntoView({ block: 'start', behavior: 'instant' });
      } else if (enhanced) {
        window.scrollTo({ top: start - stickyTop + (previousChapter + 0.67) * step, behavior: 'instant' });
      } else {
        sections[previousChapter]?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      update();
    };
    const resize = new ResizeObserver(syncLayout);
    if (header) resize.observe(header);
    if (navigation) resize.observe(navigation);
    sections.forEach(section => {
      const inner = section.querySelector<HTMLElement>('[data-scene-inner]');
      if (inner) resize.observe(inner);
    });
    const heroVisibility = new IntersectionObserver(entries => {
      node.dataset.heroVisible = `${entries.some(entry => entry.isIntersecting)}`;
    });
    const heroElement = node.querySelector('#recap-top');
    if (heroElement) heroVisibility.observe(heroElement);
    const signatures = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.signatureEntered = 'true';
          signatures.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    node.querySelectorAll('[data-signature]').forEach(signature => signatures.observe(signature));
    syncLayout();
    const initialHash = requestAnimationFrame(() => { jumpToHash(); update(); });
    node.addEventListener('focusin', onSceneFocus);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncLayout);
    window.addEventListener('hashchange', jumpToHash);
    reduceMotion.addEventListener('change', onMotionChange);
    return () => {
      disposed = true;
      resize.disconnect();
      signatures.disconnect();
      heroVisibility.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialHash);
      node.removeEventListener('focusin', onSceneFocus);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncLayout);
      window.removeEventListener('hashchange', jumpToHash);
      reduceMotion.removeEventListener('change', onMotionChange);
    };
  }, []);

  return <div ref={root} className={styles.recap}>
    <span className={styles.viewportMeasure} data-viewport-height aria-hidden="true" />
    {hero}
    <nav className={styles.progress} aria-label="Travel recap chapters">
      <div className={styles.progressInner}>
        <ol>{navigationChapters.map((chapter, index) => <li key={chapter.id}><a href={`#${chapter.id}`} aria-current={active === index ? 'location' : undefined} data-past={index < active}><span>{chapter.label}</span><ChapterIcon id={chapter.id} /></a></li>)}</ol>
      </div>
    </nav>
    {intro}
    <div ref={track} className={styles.storyTrack}>
      <div className={styles.chapterAnchors} aria-hidden="true">{recapChapters.map(chapter => <span key={chapter.id} data-story-anchor={chapter.id} className={styles.chapterAnchor} />)}</div>
      <div className={styles.storyStage}>{children}</div>
    </div>
    {comparison}
  </div>;
}

export function TravelRecapScene({ id, title, answer, children, tone = 'white', wide = false }: {
  id: string;
  title: string;
  answer?: ReactNode;
  children: ReactNode;
  tone?: 'white' | 'blue' | 'soft';
  wide?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const visual = node.querySelector<HTMLElement>('[data-recap-visual]') ?? node;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !node.closest('[data-story-enhanced]')) {
        node.dataset.entered = 'true';
        observer.unobserve(visual);
      }
    }, { threshold: 0.25, rootMargin: '0px 0px -12% 0px' });
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  return <section id={id} ref={section} data-story-scene data-chapter={id} className={`${styles.scene} ${styles[tone]} ${wide ? styles.wide : ''}`} aria-labelledby={`${id}-title`}>
    <div className={styles.sceneInner} data-scene-inner>
      <header data-scene-heading className={`${styles.sceneHeading} ${answer === undefined ? styles.titleOnly : ''}`}>
        <h2 id={`${id}-title`} tabIndex={-1}>{title}</h2>
        {answer !== undefined && <div className={styles.answer}>{answer}</div>}
      </header>
      <div className={styles.sceneVisual} data-recap-visual><div className={styles.visualCanvas} data-visual-canvas>{children}</div></div>
    </div>
  </section>;
}
