import { ViewSwitch } from './ViewSwitch';

interface ScoreboardHeadProps {
  tested: number;
  total: number;
  tasks: number;
}

/** The same title, line and List | Grid switch on both views, so only the body changes when you toggle. */
export function ScoreboardHead({ tested, total, tasks }: ScoreboardHeadProps) {
  return (
    <div className="page-head home-head">
      <div>
        <h1 className="page-title">Which assistant should you text?</h1>
        <p className="page-sub">
          {tested} of {total} assistants tested so far on the same {tasks} tasks, scored 1 to 10 after real use.
        </p>
      </div>
      <ViewSwitch />
    </div>
  );
}
