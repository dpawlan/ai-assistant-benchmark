# Travel score alignment (preview)

General’s Travel dimension uses the same equal-weight average of tested dimensions as Travel. The latest reviewed run per dimension wins (date, then ID); the mean is rounded to one decimal. Repeated tests cannot increase a dimension’s weight. Untested dimensions stay blank and are excluded, not scored zero. If no dimensions have results, Travel stays unscored and General retains its existing score.

Results live in `data/travel-results.json`. Each requires an ID, agent slug, dimension (1–17), date, numeric score (1–10), evidence URL, reviewed flag and travel-v1 version. Unreviewed and other-version runs are excluded; invalid reviewed rows fail validation. The derived score feeds General, profiles and comparisons, counting Travel once in the General overall. Prior General runs remain as historical records, not evidence for the new aggregate.

## Observed task scoring

Grade each dimension against the actual request and documented outcome. Full completion earns 10; do not subtract for unrelated dimensions or variants never requested. Partial completion and observed errors receive lower scores with a specific explanation. Existing General travel scores are not copied into dimension scores. Observed results are labeled separately from exact executions of the proposed prompts; those prompts and anchors remain the prospective test fixtures.

The October 4 review adds 32 results across 15 assistants. Miso’s booking execution, seat selection and travel profile are 10/10 based on the tester’s confirmed outcomes. Search results are split from servicing. Instinct’s actual seat handling, price alert and check-in are scored separately. Checkout staging does not establish ticketing; a future promise does not establish completed check-in. Search-only records do not establish assigned seats or a saved travel profile.

Evidence summaries identify whether the basis is an original conversation or an existing reviewed benchmark record. They include the observed scope and shortcomings without publishing private transcripts or booking/payment/account identifiers. Older end-to-end General scores can differ from the newly separated dimension outcomes.

Muse’s reviewed hotel search and the LA itinerary comparison are not sufficient evidence for the current flight dimensions. Grok Bot’s itinerary planning likewise does not establish flight execution. No relevant results were located for Dots, Town or Odessia. Asaply’s hotel refusal is outside these flight dimensions. These assistants receive no invented flight scores.
