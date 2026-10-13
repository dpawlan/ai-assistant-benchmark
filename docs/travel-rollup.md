# Travel score alignment (preview)

## Active v1 scope

`data/travel-protocol-v1.json` defines eight dimensions in display order: Onboarding flow (18), Booking execution (5), Seat selection (6), Travel profile (7), Cancellation (8), Rebooking (9), Booking speed (19) and Proactiveness (20). Existing IDs retain their evidence meaning. The original 17-dimension draft and all historical results are preserved. Only active v1 dimensions contribute to Travel scores, ranking and the three-dimension eligibility threshold. The request form uses the same active choices.


As of October 13, 2026, General’s Travel dimension uses the same weighted average as Travel: Booking speed (19) has 40% weight, and the remaining seven dimensions share 60% equally. The latest reviewed run per dimension wins (date, then ID); the displayed result is rounded to one decimal. Repeated tests cannot increase a dimension’s weight. Untested dimensions stay blank and are excluded, not scored zero; tested weights are renormalized to sum to 100%. With no booking-speed result, tested non-speed dimensions still share weight equally. If no dimensions have results, Travel stays unscored and General retains its existing score.

The weighting changes aggregation only, not any reviewed dimension result or timing threshold. Across the five report assistants, the new displayed Travel scores are Miso 9.3, Instinct 8.0, Grok Bot 7.9, Dots 7.1 and Muse 6.9. Booking speed continues to measure selected-flight booking request to confirmation; the report’s search-to-checkout under-ten-minute assessment has a broader scope.

Results live in `data/travel-results.json`. Each requires an ID, agent slug, stable dimension ID, date, numeric score (1–10), evidence URL, reviewed flag and travel-v1 version. Unreviewed and other-version runs are excluded; invalid reviewed rows fail validation. The derived score feeds General, profiles and comparisons, counting Travel once in the General overall. Prior General runs remain as historical records, not evidence for the new aggregate.

## Observed task scoring

Grade each dimension against the actual request and documented outcome. Full completion earns 10; do not subtract for unrelated dimensions or variants never requested. Partial completion and observed errors receive lower scores with a specific explanation. Existing General travel scores are not copied into dimension scores. Observed results are labeled separately from exact executions of the proposed prompts; those prompts and anchors remain the prospective test fixtures.

The October 4 review adds 32 results across 15 assistants. Miso’s booking execution, seat selection and travel profile are 10/10 based on the tester’s confirmed outcomes. Search results are split from servicing. Instinct’s actual seat handling, price alert and check-in are scored separately. Checkout staging does not establish ticketing; a future promise does not establish completed check-in. Search-only records do not establish assigned seats or a saved travel profile.

Evidence summaries identify whether the basis is an original conversation or an existing reviewed benchmark record. They include the observed scope and shortcomings without publishing private transcripts or booking/payment/account identifiers. Older end-to-end General scores can differ from the newly separated dimension outcomes.

Muse’s reviewed hotel search and the LA itinerary comparison are not sufficient evidence for the current flight dimensions. Grok Bot’s itinerary planning likewise does not establish flight execution. No relevant results were located for Dots, Town or Odessia. Asaply’s hotel refusal is outside these flight dimensions. These assistants receive no invented flight scores.

## Travel ranking

List, Grid and the report order use `(unrounded weighted average × tested dimensions + 15) / (tested dimensions + 3)`: three neutral prior results at 5/10. This preserves the existing coverage adjustment while using the same speed weighting as the displayed score. Use the unrounded result for ordering, then alphabetical name for ties. No results means no ranking score and placement after tested assistants. Repeated tests of one dimension do not add coverage. This ranking balances quality with breadth; testing more dimensions alone does not guarantee a higher position.

Travel category visibility requires at least three distinct reviewed dimensions, in both List and Grid and both score-source modes. The proposed-cohort expansion control is removed. Results below this threshold remain available in dimension details and the stored evidence; displayed scores and General aggregation are unchanged.
