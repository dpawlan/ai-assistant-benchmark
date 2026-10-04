import { ViewSwitch } from './ViewSwitch';
import { BenchmarkNav } from './BenchmarkNav';

interface ScoreboardHeadProps {
  tested: number;
  total: number;
  tasks: number;
}

/** The same title, line and List | Grid switch on both views, so only the body changes when you toggle. */
export function ScoreboardHead({ tested, total, tasks }: ScoreboardHeadProps) {
  return (
    <><BenchmarkNav active="general" /><div className="bs-preview"><span className="bs-dot" /> Design preview <span>Browse by benchmark, then by assistant type</span></div><div className="page-head home-head">
      <div>
        <p className="bs-eyebrow">THE GENERAL BENCHMARK</p>
        <h1 className="page-title">Everyday tasks. Real-world results.</h1>
        <p className="page-sub">
          {tested} of {total} assistants tested so far on the same {tasks} tasks, scored 1 to 10 after real use.
        </p>
      </div>
      <ViewSwitch />
    </div></>
  );
}
