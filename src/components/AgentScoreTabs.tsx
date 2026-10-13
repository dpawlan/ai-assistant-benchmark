'use client';

import { Suspense, useRef, type ReactNode, type KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';

type Benchmark = 'general' | 'travel';
type Props = { defaultTab: Benchmark; general: ReactNode; travel: ReactNode };
const tabs: Benchmark[] = ['general', 'travel'];

function ScoreTabsView({ selected, general, travel, onSelect }: Omit<Props, 'defaultTab'> & { selected: Benchmark; onSelect?: (tab: Benchmark) => void }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : event.key === 'ArrowRight' || event.key === 'ArrowLeft' ? 1 - index : null;
    if (next === null || !onSelect) return;
    event.preventDefault();
    onSelect(tabs[next]);
    buttons.current[next]?.focus();
  }
  return <>
    <div className="seg ag-score-tabs" role="tablist" aria-label="Benchmark scores">
      {tabs.map((tab, index) => <button key={tab} ref={button => { buttons.current[index] = button; }} type="button" role="tab" id={`profile-${tab}-tab`} aria-selected={selected === tab} aria-controls={`profile-${tab}-panel`} tabIndex={selected === tab ? 0 : -1} className={selected === tab ? 'on' : ''} disabled={!onSelect} onClick={() => onSelect?.(tab)} onKeyDown={event => navigate(event, index)}>{tab === 'general' ? 'General' : 'Travel'}</button>)}
    </div>
    {tabs.map(tab => <div key={tab} id={`profile-${tab}-panel`} role="tabpanel" aria-labelledby={`profile-${tab}-tab`} tabIndex={0} hidden={tab !== selected}>{tab === selected ? (tab === 'general' ? general : travel) : null}</div>)}
  </>;
}

function ConnectedScoreTabs(props: Props) {
  const searchParams = useSearchParams();
  const requested = searchParams.get('benchmark');
  const selected = requested === 'general' || requested === 'travel' ? requested : props.defaultTab;
  function select(tab: Benchmark) {
    const url = new URL(window.location.href);
    url.searchParams.set('benchmark', tab);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
  return <ScoreTabsView {...props} selected={selected} onSelect={select} />;
}

export function AgentScoreTabs(props: Props) {
  return <Suspense fallback={<ScoreTabsView {...props} selected={props.defaultTab} />}><ConnectedScoreTabs {...props} /></Suspense>;
}
