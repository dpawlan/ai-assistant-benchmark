---
title: I read the privacy policies of the three assistants people actually use. Here is what they say.
dek: Instinct and Muse train on your conversations by default. Grok Bot says it does not while Privacy Mode is on. Past that, the three diverge on what you can see, stop and delete. Every claim below is quoted from the live documents and was checked by two independent passes.
date: 2026-09-28
author: David Pawlan
kind: Analysis
report:
update:
agents: grok-bot, muse, instinct
hero_caption: Grok Bot, Muse and Instinct, whose documents were read side by side. Illustration by Assistant Benchmark.
takeaways: Instinct and Muse train on your conversations by default; Grok Bot, a Cursor product, says it does not while Privacy Mode is on | Grok Bot's documents are the most specific on security and vendors, Muse's on what the agent can and cannot see, Instinct's the thinnest for the data it holds | All three put the risk of the agent's own actions on you, and none promises deletion is complete
---

Every time I post a test result, the first reply is some version of the same question: what are these things doing with my data? I have been scoring [Instinct](/agents/instinct), [Muse](/agents/muse) and [Grok Bot](/agents/grok-bot) on how well they book, buy and reply. I had not sat down and read what each one says it does with everything I hand it. So this week I did.

I read the documents that govern each of the three assistants people use most, in full: the privacy policy, and the terms, data-use and help pages where the policy pointed to them. Then each set got a second and a third read by two different, independent agents: the first extracted every claim with the sentence behind it, and the second checked every quote and claim against the live page with no access to the first one's notes. Every quotation below is character for character from the source.

The short version: two of the three train on your conversations unless you find the switch and turn it off. Beyond that, they diverge sharply.

## Who I read

Instinct's policy belongs to Spear Street Technology, Inc., revised August 26, 2026. It is a standalone document of about 2,700 words with a dedicated privacy contact. Its terms choose California law and binding arbitration with a 30-day opt-out.

Muse's policy is Meta's. It is a supplement of about 1,000 words, effective September 17, 2026, that sits on top of the main Meta Privacy Policy and says so in its opening sentence: "The Meta Privacy Policy applies to all Meta Products, including Muse." It lists no contact of its own. Meta's help center and a launch-day engineering post fill in how the system works.

Grok Bot is a Cursor product, made by Anysphere, Inc., not the Grok chatbot at grok.com. It gives you named Bots that all share one persistent cloud computer per user, reached from Grok Bot's own desktop and iPhone apps. It is governed by Cursor's privacy policy, last updated October 6, 2025, which never mentions it by name, plus a short set of Grok Bot Terms and a data-use page, both dated September 3, 2026. xAI, listed as SpaceXAI, is one of nine inference providers among the 17 entries on Cursor's subprocessor list, though Grok Bot can also be paid for through a linked SuperGrok subscription.

## Where they align

| | Instinct | Muse | Grok Bot |
| --- | --- | --- | --- |
| States a retention period for your data | No. The word "retention" does not appear | No | No. Kept "only for as long as necessary"; account deletion clears data within 30 days |
| Promises deletion is complete | No. The company "may, but is not obligated to, delete any of your Materials" | No. Muse "may still 'remember' information it learned from what you deleted" | No. "Deleting a Bot may not delete shared files, sessions, credentials, or routines" |
| Reserves the right to look at flagged content | Yes. Content "flagged for safety review" is still used | Yes. Meta may "monitor, log, review" the agent for safety and other reasons | Yes. Content "flagged for security review" may be analyzed |
| Puts the risk of the agent's own actions on you | Yes. Warns of "unintended payments" and disclaims them | Yes. You "bear all risk of financial loss"; liability capped at $250 or a year's fees, whichever is greater | Yes. "Customer is solely responsible for all agentic actions taken by Grok Bot, whether or not such actions were intended" (capitals in the original) |
| Spreads the facts across several documents | Policy plus terms | Supplement, supplemental terms, Meta's main policy, help center and an engineering post | Policy, Grok Bot Terms, data-use page, security page and the product docs |
| Minimum age | 18 | 18 | 18 |

## Where they diverge

| | Instinct | Muse | Grok Bot |
| --- | --- | --- | --- |
| Trains on your conversations by default | Yes. Opt out at app.instinct.com/settings, "on a go-forward basis" | Yes. "This setting is on when you first use Muse." The opt-out is retroactive: "Changes to this setting also apply to previous interactions." | No. "We do not use Inputs or Suggestions to train our models" unless flagged for security review, submitted as feedback, or "you've explicitly agreed." A Privacy Mode setting governs it; the default for an individual is not stated, and with it off Cursor "may use and store" prompts "to train our models" |
| Names concrete security measures | No. "Reasonable efforts," and a warning that data "may not be secure while in transit" | Partly. An isolated per-user VM, a credential store the model cannot see, and a Sentinel that gates outside actions. No encryption-at-rest statement for today's VM; the encrypted Confidential VM is with "a small group of trusted testers" | Yes. TLS 1.2+ in transit, AES-256 at rest, cached files "encrypted using unique client-generated keys," per-user microVMs, SOC 2 Type II, ISO 27001 and ISO 42001 |
| What it may hold | Passwords, payment details and health information, "depending on the permissions you grant," with no special handling outside the Vault | Chats, files, memory and connected accounts in a VM that Meta's architecture "does not prevent Meta from accessing" when needed to "support, secure or operate the service" | One cloud computer shared by all your Bots: "files, browser sessions, credentials, memory, and routines." The Bot "doesn't see your password"; connector tokens "are never stored on the computer" |
| Humans reading your chats | Not addressed either way | Personnel access restricted "through operational policies" | No statement either way; Cursor says its monitoring telemetry "deliberately excludes customer data" |
| Your rights | No general rights section. You can revoke Google access and delete indexed data; GDPR and CCPA never appear | No rights section of its own. You can delete messages and files, reset Muse, ask it to "forget," and read what it remembers in files like MEMORY.md; formal rights are Meta's | Access, portability, deletion, correction, objection and appeal, by email. No data protection officer |
| Advertising | "We do not sell your information or disclose your information to registered data brokers or third parties who resell your information to others." Cookies are used for offers, and browser opt-out signals are not honoured | "Muse doesn't share your conversations or the data in your virtual machine with Meta ad systems." But Muse's browsing "will appear as your activity," which can influence ads indirectly | "We do not 'sell' or 'share' personal data for cross-contextual behavioral advertising." Cookies are used to "market additional products or services to you" |
| Who else gets the data | Unnamed "third-party AI model providers," vendors, "affiliates or others within our corporate group," and business partners, aggregated "or otherwise in accordance with applicable law" | Meta's own models; your other Meta accounts unless you sign up with an unlinked email | A published subprocessor list: SpaceXAI, OpenAI, Anthropic, Google Gemini, Meta and others. With Privacy Mode on, Cursor says it holds "zero data retention (ZDR) agreements with all providers"; your own API keys and some admin-approved models fall outside them |
| Deleting the assistant | Delete indexed data at app.instinct.com/workspace or delete the account | Delete messages, or reset Muse to delete everything | Deleting the Cursor account deletes Grok Bot within 30 days. Deleting one Bot leaves the shared computer's files and sign-ins in place |
| Who the document is written for | Consumers | Consumers | Business "Customers" and their "Users"; the Grok Bot Terms never use the words privacy or training and hand personal data to the data processing addendum |

## What I make of it

**Grok Bot's documents are the most specific.** It is the only one of the three whose governing text says it does not train on your inputs while Privacy Mode is on, names its model vendors and their zero-retention terms, and puts numbers and standards on security. The gaps are real: the individual default for Privacy Mode is never stated, deleting a Bot does not clean the computer it worked on, most of the admin controls are Enterprise-only, and the terms that name the product are drafted for corporate customers, even though the consumer terms bind every individual who switches it on.

**Muse is the most specific about what the agent can and cannot see.** The credential store, the one-time card numbers and the Sentinel are all described as live, and the ad carve-out is explicit. But training is on by default, the isolation is from other users rather than from Meta, the fully private mode is still in testing, and the supplement has no contact, no retention period and no rights section of its own.

**Instinct has the most exposure and the thinnest document.** It is the one I use most, and it is the one built to reach the most: passwords, payment details, private messages, health information, where you let it. It pairs that with "reasonable efforts" as its only security statement, no retention period, no general rights section, and unnamed AI providers and partners receiving data. Its no-sale promise, its Google and Vault carve-outs and its candour about agent risk are real strengths. They sit on the least.

> All three put the risk of the agent's own actions on you, and none promises deletion is complete.

That is the line I keep coming back to. These products act on your behalf, and every one of the three says in its terms that what the agent does is your problem. Read that before you connect a card.

## What happens next

We will continue to see the concern for privacy and data, especially as adoption expands beyond the tech bubble. Just as cybersecurity came after the internet, I believe new forms of security will appear to help tackle this problem. By and large, there are clear security gaps, but nothing out of the ordinary that would prevent me from continuing to use these tools, given how productive and helpful they are.
