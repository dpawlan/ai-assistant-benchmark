# Newsletter preview

Routes: `/newsletter`, `/newsletter/[slug]`. Linked from header and footer. No production deployment is required for local review.

The signup embeds Beehiiv form `471acc77-560e-4a7b-a1d1-057497840354` using the official loader. Beehiiv owns validation, bot protection, confirmation and delivery. No API key and no email storage in this application. The direct Beehiiv signup link remains available if an extension blocks the embed. Customize the form inside Beehiiv: hide its header, use a sans-serif font, low padding and blue #0A84FF button.

The RSS source is `https://rss.beehiiv.com/feeds/IqCwhrLcdy.xml`. The public publication moved to `https://assistant-benchmark-newsletter.beehiiv.com/`.

The Next fetch data cache refreshes on visitor requests at most once per 15 minutes during Monday 06:00–12:00 America/New_York (DST aware). Outside that window cached content does not expire. A cold cache requires an initial fetch. This is request-driven revalidation, not a background scheduled job: no visitors means no requests to Beehiiv. Development HMR caching may differ from production caching.

Current five complete issues are also saved in `data/newsletter-snapshot.json`. Live feed versions take precedence; the saved issues remain available during an outage or when they age out of the feed. RSS HTML is sanitized before rendering, keeping images and links and removing scripts, event handlers and provider CSS. The original Beehiiv URLs remain canonical. If the feed later limits its history, update the committed snapshot periodically to preserve issues beyond the original five; this version does not write a permanent database of newly fetched issues.

Checks: `node scripts/test-newsletter.mjs` (Node 22.18+), `npx tsc --noEmit`, and targeted ESLint. Verify a real subscriber separately with a consented test email; automated browser checks deliberately do not subscribe anyone.
