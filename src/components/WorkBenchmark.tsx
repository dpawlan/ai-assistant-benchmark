'use client';

import { useState } from 'react';
import { ViewSwitch } from './ViewSwitch';
import { BenchmarkNav, CategoryDescription } from './BenchmarkNav';

export function WorkBenchmark() {
  const [opinion, setOpinion] = useState(false);
  return <>
    <div className="page-head home-head"><h1 className="page-title">Work assistants</h1><ViewSwitch /></div>
    <div className="rank-bar">
      <BenchmarkNav active="work" />
      <div className="seg" role="tablist" aria-label="Score source">
        <button role="tab" aria-selected={!opinion} className={!opinion ? 'on' : ''} onClick={() => setOpinion(false)}>Scores</button>
        <button role="tab" aria-selected={opinion} className={opinion ? 'on' : ''} onClick={() => setOpinion(true)}>Public opinion</button>
      </div>
    </div>
    <CategoryDescription category="work" />
    <p className="rk-empty">{opinion ? 'Public opinion for Work is coming soon.' : 'Work scores are coming soon.'}</p>
  </>;
}
