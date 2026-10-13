import { ViewSwitch } from './ViewSwitch';

/** Shared heading and layout switch for the General category. */
export function ScoreboardHead() {
  return (
    <div className="page-head home-head">
      <h1 className="page-title">Which assistant should you text?</h1>
      <ViewSwitch />
    </div>
  );
}
