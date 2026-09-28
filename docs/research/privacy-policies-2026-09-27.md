# Privacy policies compared: Instinct, Muse, Grok Bot

Read 2026-09-27 and 2026-09-28. Quotes are verbatim from the live pages. This is a reading of the documents, not of the products' behaviour.

**Correction history.** The first draft of this file (2026-09-27) compared Instinct and Muse against the SpaceXAI privacy policy that governs the Grok chatbot at grok.com. That was the wrong product: Grok Bot is a Cursor (Anysphere, Inc.) product governed by Cursor's documents. The roster entry pointed at grok.com and was corrected on 2026-09-28. An outside review also flagged: "Affiliates: None" for Instinct was wrong (its policy names "affiliates or others within our corporate group"); "no user rights" for Instinct was too absolute; "by design" overstated the sensitive-data clause; and the claim that no policy uses the word "encrypt" failed once the correct Grok Bot documents were read (Cursor's data-use page says cached files are "encrypted using unique client-generated keys"). All of those are fixed below.

## Documents

| | Instinct | Muse | Grok Bot |
| --- | --- | --- | --- |
| Company | Spear Street Technology, Inc. d/b/a Instinct (no address; terms choose California law and San Francisco courts) | Meta Platforms, Inc. | Anysphere, Inc., 2261 Market Street STE 86466, San Francisco |
| Governing documents | Privacy policy (revised 2026-08-26, ~2,700 words); terms (same date) | Muse Privacy Policy, a supplement to the Meta Privacy Policy (effective 2026-09-17, ~1,000 words); Muse Supplemental Terms (2026-09-08); Meta help center page; Meta engineering post "How We Built Safety Into Muse" (2026-09-08) | Cursor Privacy Policy (2025-10-06, ~2,500 words, never mentions Grok Bot); Grok Bot Terms (2026-09-03, ~1,000 words, a supplement to the Cursor terms); Data Use & Privacy Overview (2026-09-03); Security page (2026-08-25); Grok Bot product docs |
| Governing law | California; JAMS arbitration; 30-day opt-out | California; AAA arbitration; 30-day opt-out (US and Canada); Meta terms elsewhere | Texas; Tarrant or Wichita County courts; class-action waiver; no arbitration clause |
| Privacy contact | privacy@instinct.com | None in the supplement | hi@cursor.com; no DPO |
| Minimum age | 18 | 18 | 18 |

## Findings

### Training on conversations

- **Instinct**: on by default. "to evaluate, fine-tune, and train the AI models that power our products". Opt out at app.instinct.com/settings, "on a go-forward basis"; "we may still use your information for AI model training when that information is flagged for safety review". Google Workspace data and Vault materials are excluded.
- **Muse**: on by default. "This setting is on when you first use Muse." Opt out under Settings, Data controls; "Changes to this setting also apply to previous interactions." The toggle also covers Connector data. Meta's engineering post calls this "a good default" and says training data includes "tool calls and subagent handoffs".
- **Grok Bot**: not by default. Cursor Privacy Policy: "We do not use Inputs or Suggestions to train our models, or permit third parties to use them for training, unless: (1) they are flagged for security review ... (2) you explicitly report them to us (for example, as Feedback), or (3) you've explicitly agreed to their use for such training purposes." Terms: "ANYSPHERE WILL NOT USE CONTENT TO TRAIN ... UNLESS YOU'VE EXPLICITLY AGREED". Data Use page: with Privacy Mode on, "Customer Data will not be used for training by Cursor. Cursor maintains zero data retention (ZDR) agreements with all providers"; with it off, "we may use and store codebase data, prompts, editor actions, code snippets, and other code data and actions to improve our AI features and train our models." The default Privacy Mode setting for an individual is not stated in any document; it is on by default for teams. The help page's answer to "Does Privacy Mode prevent xAI from training on my Grok Bot data?" is "Grok Bot runs on a separate product surface with its own data flows."

### Security statements

- **Instinct**: "Despite our reasonable efforts to protect your information, no security measures are impenetrable"; "any information you send to us electronically ... may not be secure while in transit". Candid about "unintended payments" and "misleading instructions intended to influence autonomous agents". No encryption statement, no breach commitment.
- **Muse**: "Every Muse user's VM is isolated so no one else's agent can access it." Help center: credentials go in "a Secure Credentials Store" and Muse can act "without the AI model seeing your password". Engineering post: "Sentinel is a separate host-side agent ... the sole permission authority for approval to perform actions"; "Today's Muse architecture ... restricts access to your data by Meta personnel through operational policies. It does not prevent Meta from accessing data when necessary to support, secure or operate the service." Confidential VM: "We're already using this system with a small group of trusted testers", planned "later this year". No encryption statement for today's VM.
- **Grok Bot**: "Cursor encrypts data for all infrastructure, including: TLS 1.2+ in transit; AES-256 at rest" (enterprise docs); cached files "are encrypted using unique client-generated keys" (Data Use); "Each user's work runs in a dedicated Firecracker microVM"; "SOC 2 Type II attestation", ISO 27001 and ISO 42001 with "Grok Bot ... included in the current ISO scope"; "Critical incidents are communicated via email to affected users"; 48-hour breach notice in the DPA, which does not apply to individuals. Privacy policy itself: "commercially reasonable technical and organizational measures".

### What each may hold

- **Instinct**: "you may provide your payment information to the personal assistant ... or your username and password for third-party accounts"; health information via appointments and provider emails. No special handling stated.
- **Muse**: chats, files, memory, Connector data in the VM; OAuth tokens "stored in your VM, not in centralized Meta infrastructure"; one-time card numbers via Stripe Link, live at launch.
- **Grok Bot**: "Grok Bot may retain Customer Data, files, browser sessions, credentials, memory, and routines in a persistent cloud environment." "All of your Bots use the same cloud computer"; "The Bot doesn't type credentials and doesn't see your password"; "Connector tokens are never stored on the computer."

### Human review

- **Instinct**: not addressed; safety-flagged content may be used.
- **Muse**: terms reserve the right to "monitor, log, review, suspend, block, or modify Muse's actions ... or other reasons in Meta's discretion"; personnel access restricted "through operational policies".
- **Grok Bot**: no personnel-review statement; flagged content "may be stored for investigation".

### Rights

- **Instinct**: no general rights section; can revoke Google Workspace access and "delete all data indexed from external sources"; GDPR and CCPA absent; browser signals ignored.
- **Muse**: none in the supplement; inherited from Meta.
- **Grok Bot**: right to know, access and portability, deletion, correction, objection, restriction, withdrawal, appeal; contact hi@cursor.com; no DPO; no Do Not Track statement; the policy's promised jurisdiction table is missing from the page.

### Advertising and sale

- **Instinct**: "We do not sell your information or disclose your information to registered data brokers or third parties who resell your information to others"; cookies "provide you with offers or promotions".
- **Muse**: "Muse doesn't share your conversations or the data in your virtual machine with Meta ad systems." Engineering post: "When Muse browses the internet, it will appear as your activity", which "may also indirectly influence the ads you see."
- **Grok Bot**: "We do not 'sell' or 'share' personal data for cross-contextual behavioral advertising, and we do not process personal data for 'targeted advertising' purposes"; cookies used to "market additional products or services to you".

### Third parties and affiliates

- **Instinct**: "Our affiliates or others within our corporate group"; "Third-party AI model providers who help support the Services" (unnamed); "Third-party business partners who may use the information for their own purposes" on "an aggregate / anonymized basis, or otherwise in accordance with applicable law".
- **Muse**: Meta's own models; Accounts Center combination unless signed up with an unlinked email.
- **Grok Bot**: published subprocessor list including SpaceXAI, OpenAI, Anthropic, Google, Meta, Fireworks, Together, AWS; "We may share personal data with affiliates".

### Retention and deletion

- **Instinct**: no period; "may, but is not obligated to, delete any of your Materials".
- **Muse**: no period; "Muse may still 'remember' information it learned from what you deleted"; backups maintained.
- **Grok Bot**: "only for as long as necessary"; account deletion "All data is removed within 30 days"; "Deleting a Bot may not delete shared files, sessions, credentials, or routines"; computer file retention "depend[s] on your account type".

### Liability for the agent's actions

- **Instinct**: warns of "unintended payments or communications to outside parties" and disclaims them.
- **Muse**: "you bear all risk of financial loss"; liability capped at "THE GREATER OF $250 OR THE AMOUNT YOU HAVE PAID US IN THE TWELVE MONTHS".
- **Grok Bot**: "CUSTOMER IS SOLELY RESPONSIBLE FOR ALL AGENTIC ACTIONS TAKEN BY GROK BOT, WHETHER OR NOT SUCH ACTIONS WERE INTENDED, ANTICIPATED, OR AUTHORIZED BY CUSTOMER".

### Channels

- **Instinct**: policy never names iMessage, WhatsApp or phone calls; one line, "if you send a text message to us to engage the Services"; terms cover SMS only as a contact and sign-in channel.
- **Muse**: policy never mentions WhatsApp or the mobile number taken at signup; the launch post advertises chat "directly in WhatsApp" and the engineering post lists only "the iOS and Android apps, the web UI" as clients.
- **Grok Bot**: its own desktop and iOS apps only; no messaging platform is a channel.

## Assessment

Stated criteria: what the governing documents commit to about training, security, vendors, rights, retention and deletion.

- **Grok Bot** has the most specific commitments on paper: no training without agreement, named vendors under zero-retention terms, named encryption and certifications, enumerated rights, a 30-day deletion window. Gaps: the individual Privacy Mode default is unstated, Bot deletion is incomplete, most controls are enterprise-only, and the product's own terms never mention privacy.
- **Muse** is the most specific about what the agent can and cannot see, with live credential isolation, one-time cards and a Sentinel. Training is on by default with a retroactive opt-out; isolation is from other users, not Meta; the supplement has no contact, retention or rights of its own.
- **Instinct** contemplates the most sensitive data with the thinnest guarantees: no encryption statement, no retention, no general rights, unnamed vendors and partners. Strengths: no-sale promise, Google and Vault carve-outs, candour about agent risk.

## Verification

- 2026-09-28: three independent checks re-read every source for the first draft; all quotes for Instinct and Muse confirmed character-exact; Grok column discarded and re-researched against Cursor's documents after the product misidentification was found.
- Muse's supplement page rejects plain fetches; it was read and verified in a browser session. Meta's help center page repeats the training-default and retroactive-opt-out sentences verbatim, which confirms them from a second Meta source.
- Grok Bot: 20 Cursor pages read on 2026-09-28; a second independent check of the article's Grok Bot claims found no fabricated quotes and twelve wording corrections, applied. A parallel check of the Instinct and Muse claims found 67 claims, none unsupported, and ten wording corrections, applied.

## Sources

- Instinct: https://instinct.com/privacy-policy and https://instinct.com/terms (both revised 2026-08-26)
- Muse: https://muse.ai/privacy (2026-09-17); https://muse.ai/terms (2026-09-08); https://www.facebook.com/privacy/policy; https://www.meta.com/help/artificial-intelligence/1047255454427887/; https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/; https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse
- Grok Bot: https://cursor.com/privacy (2025-10-06); https://cursor.com/terms/grok-bot (2026-09-03); https://cursor.com/terms-of-service (2026-09-03); https://cursor.com/data-use (2026-09-03); https://cursor.com/security (2026-08-25); https://cursor.com/docs/grok-bot and sub-pages; https://cursor.com/docs/enterprise/privacy-and-data-governance; https://cursor.com/help/security-and-privacy/privacy; https://cursor.com/help/grok-bot/delete-account; https://trust.cursor.com/subprocessors
