# Travel score alignment (preview)

General's Travel dimension uses the same score as the detailed Travel suite once all 17 dimensions have reviewed numeric results. Each dimension has equal weight. The latest eligible run per dimension wins (date, then run ID for same-date ties); the mean is rounded to one decimal. Repeated tests cannot increase a dimension's weight.

Before full coverage, the suite shows individual scores without an overall. General retains its existing travel score, as the fallback. Legacy scores are never counted as new-suite coverage. An assistant without a legacy score stays unscored. Original score/run files are untouched.

Results live in `data/travel-results.json` as an array. No real results have been added. Each result requires `id`, `agent` (roster slug), `dimension` (1–17), ISO `date`, numeric `score` (1–10), `evidence_url` (HTTPS or site-relative), `reviewed` (boolean), and `version` (`travel-v1`). Unreviewed and other-version runs are excluded; invalid reviewed current-version rows fail rather than silently alter coverage. N/A is not yet supported: settle exemptions before relaxing the complete-coverage rule.

The detailed dimension pages link to the evidence. Once complete, the shared derived score feeds General, profile, and comparison scores, and the existing General overall calculation includes Travel once. Its legacy run is no longer presented as evidence for the summary. No upload UI is introduced.

This equal-weight, full-coverage rule is a conservative starting policy for the preview. Revisit it with the final rubric before publishing new results.
