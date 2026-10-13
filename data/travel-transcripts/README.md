# Public travel transcripts

These are manually reviewed, redacted text exports for the five published travel assistants. Names, contact details, birth dates, addresses, payment details, loyalty identifiers, booking references, and private links have been removed. Card aliases distinguish payment methods without publishing their endings. Attachment markers preserve the original sequence; attachment contents are not embedded in these exports.

GrokBot and Miso include booking plus the follow-up conversation from the same itinerary. Their initial booking exports were verified to be exact prefixes of these conversations. Dots and Muse use the reviewed booking and follow-up exports. Instinct uses only the latest Duffel booking export. The allowlist in `src/lib/travel-transcripts.ts` matches these transcripts to the tested sessions; an unmatched session has no fallback.

Do not copy new raw exports here or automatically import private files. Review every message and attachment before publication, and run `node scripts/test-travel-transcripts.mjs`. Automated pattern checks supplement a manual privacy review; they cannot establish that a transcript contains no personal information. Scores and timing data are maintained separately and are not derived from these redacted exports.
