---
title: I analyzed and compared the privacy policies of the three assistants people actually use. Here is what they say.
dek: Instinct and Muse allow training on eligible interactions by default. Grok Bot says it does not train on customer data while Privacy Mode is on. Their documents also differ on access, deletion and responsibility for agent actions.
date: 2026-09-28
author: David Pawlan
kind: Analysis
report:
update:
agents: grok-bot, muse, instinct
hero_mark: lock
hero_caption: Grok Bot, Muse and Instinct, whose documents were compared side by side. Illustration by Assistant Benchmark.
takeaways: Instinct and Muse allow training on eligible interactions by default; Grok Bot says it does not while Privacy Mode is on | Grok Bot's documents are the most specific on security and vendors, Muse's on what the agent can and cannot see, Instinct's the thinnest for the data it holds | Deleting a message or Bot can leave other stored data; full resets and account deletion have separate rules
---

I've been testing these AI assistants for a while, and every single time I post some data or talk about it with friends, I'm instantly hit with the same question: "What are these things doing with my data?" I've been scoring [Instinct](/agents/instinct), [Muse](/agents/muse), [Grok Bot](/agents/grok-bot) and dozens more on how well they book, buy and reply, yet I had not sat down and actually compared how each one handles my data. So I decided to finally do it.

I analyzed and compared the documents, such as the privacy policy and terms, across these three assistants. I had independent agents help me compare the data across three different rounds:

- Validating the information
- Extracting every claim found with the sentence behind it
- Ensuring that the quotes identified actually map to the written privacy policy

The TLDR is that they have a lot of similarities, but more differences. In my personal opinion, Grok Bot sits at the top of the leaderboard, followed by Muse and then Instinct.

## What I compared

Instinct's [privacy policy](https://instinct.com/privacy-policy) belongs to Spear Street Technology, Inc., revised August 26, 2026. It is a standalone document of about 2,700 words with a dedicated privacy contact. Its [terms](https://instinct.com/terms) choose California law and binding arbitration with a 30-day opt-out.

Muse's [privacy policy](https://muse.ai/privacy) is Meta's. It is a supplement of about 1,000 words, effective September 17, 2026, that sits on top of the [main Meta Privacy Policy](https://www.facebook.com/privacy/policy) and says so in its opening sentence: "The Meta Privacy Policy applies to all Meta Products, including Muse." It lists no contact of its own. Meta's [help center](https://www.meta.com/help/artificial-intelligence/1047255454427887/) and [launch-day engineering post](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) fill in how the system works.

Grok Bot is a Cursor product, made by Anysphere, Inc. It gives you named Bots that all share one persistent cloud computer per user, reached from Grok Bot's own desktop and iPhone apps. It is covered by Cursor's [privacy policy](https://cursor.com/privacy), last updated October 6, 2025, which never mentions it by name, plus [Grok Bot Terms](https://cursor.com/terms/grok-bot) and a [data-use page](https://cursor.com/data-use), both dated September 3, 2026. Cursor also publishes [Grok Bot security documentation](https://cursor.com/docs/grok-bot/security) and an [account-deletion guide](https://cursor.com/help/grok-bot/delete-account). xAI is listed as SpaceXAI on Cursor's [subprocessor list](https://trust.cursor.com/subprocessors), though Grok Bot can also be paid for through a linked SuperGrok subscription.

## Where they align

| | Instinct | Muse | Grok Bot |
| --- | --- | --- | --- |
| States a retention period for your data | No. The word "retention" does not appear | No | No. Kept "only for as long as necessary"; account deletion clears data within 30 days |
| What deletion removes | After account deletion, Instinct "may, but is not obligated to, delete any of your Materials"; indexed connected-service data has a separate deletion control | Deleting a message can leave memories; Meta says resetting Muse deletes all Muse data | Deleting one Bot can leave shared files and sign-ins; Cursor says deleting the account removes Grok Bot data within 30 days |
| Safety review exceptions | Flagged information may still be used for AI model training after an opt-out | Meta may monitor, log and review Muse actions for safety and other reasons | Flagged inputs may be analyzed, and abuse-detector hits may be stored for investigation |
| Puts the risk of the agent's own actions on you | Yes. Warns of "unintended payments" and disclaims them | Yes. You "bear all risk of financial loss." Meta's liability to you is capped at $250 or a year's fees, whichever is greater | Broadly. The terms assign responsibility for agentic actions to the customer but preserve provider liability for gross negligence or willful misconduct |
| Spreads the facts across several documents | Policy plus terms | Four documents: Meta's main privacy policy and terms, plus a Muse privacy supplement and Muse-specific terms that add to them; Meta's help center and an engineering post fill in the rest | Policy, Grok Bot Terms, data-use page, security page and the product docs |
| Minimum age | 18 | 18 | 18 |

## Where they diverge

| | Instinct | Muse | Grok Bot |
| --- | --- | --- | --- |
| Trains on your conversations by default | Yes, for eligible data. Opt out at app.instinct.com/settings, "on a go-forward basis"; Google Workspace data and Vault materials are excluded | Yes. "This setting is on when you first use Muse." Meta says changes to the setting "also apply to previous interactions"; it does not say past model training is reversed | Depends on Privacy Mode. With it on, Cursor says your data is not used for training. With it off, Cursor says it "may use and store" prompts "to train our models." The privacy policy frames this as no training unless "you've explicitly agreed," and turning Privacy Mode off is that agreement. No document states the default for an individual account |
| Names concrete security measures | No. "Reasonable efforts," and a warning that data "may not be secure while in transit" | Partly. An isolated per-user VM, a credential store the model cannot see, and a Sentinel that gates outside actions. No encryption-at-rest statement for today's VM; the encrypted Confidential VM is with "a small group of trusted testers" | Yes. TLS 1.2+ in transit, AES-256 at rest, cached files "encrypted using unique client-generated keys," per-user microVMs, SOC 2 Type II, ISO 27001 and ISO 42001 |
| What it may hold | Passwords, payment details and health information, "depending on the permissions you grant." Separate limits apply to Vault materials and data received from Google Workspace | Chats, files, memory and connected accounts in a VM that Meta's architecture "does not prevent Meta from accessing" when needed to "support, secure or operate the service" | One cloud computer shared by all your Bots: "files, browser sessions, credentials, memory, and routines." The Bot "doesn't see your password"; connector tokens "are never stored on the computer" |
| Humans reading your chats | Not addressed either way | Personnel access restricted "through operational policies" | No statement either way; Cursor says its monitoring telemetry "deliberately excludes customer data" |
| Your rights | No general rights section. You can revoke Google access and delete indexed data; GDPR and CCPA never appear | No rights section of its own. You can delete messages and files, reset Muse, ask it to "forget," and read what it remembers in files like MEMORY.md; formal rights are Meta's | Access, portability, deletion, correction, objection and appeal, by email. No data protection officer |
| Advertising | "We do not sell your information or disclose your information to registered data brokers or third parties who resell your information to others." Cookies are used for offers, and browser opt-out signals are not honoured | "Muse doesn't share your conversations or the data in your virtual machine with Meta ad systems." But Muse's browsing "will appear as your activity," which can influence ads indirectly | "We do not 'sell' or 'share' personal data for cross-contextual behavioral advertising." Cookies are used to "market additional products or services to you" |
| Who else gets the data | Unnamed "third-party AI model providers," vendors, "affiliates or others within our corporate group," and business partners, aggregated "or otherwise in accordance with applicable law" | Meta's own models. Meta says it [combines information across accounts](https://www.meta.com/help/accounts-center/433719745369721/) in the same Accounts Center; some safety and operational uses span accounts even when they are separate | Cursor lists potential model providers including SpaceXAI, OpenAI, Anthropic, Google Gemini and Meta; its serving mix can change. With Privacy Mode on, Cursor says it holds "zero data retention (ZDR) agreements with all providers"; your own API keys and some admin-approved models fall outside them |
| Deleting the assistant | Delete indexed data at app.instinct.com/workspace or delete the account | Delete messages, or reset Muse to delete everything | Deleting the Cursor account deletes Grok Bot within 30 days. Deleting one Bot leaves the shared computer's files and sign-ins in place |
| Who the document is written for | Consumers | Consumers | The Grok Bot Terms use business "Customers" and "Users"; Cursor says its DPA applies to Teams and Enterprise accounts, while individual plans follow the Privacy Policy |

## What I make of it

**Grok Bot's documents are the most specific.** It is the only one of the three whose governing text says it does not train on your inputs while Privacy Mode is on, names its model vendors and their zero-retention terms, and puts numbers and standards on security. However, it is not perfect. The default for Privacy Mode is never stated. Deleting a Bot does not clean the data from the computer it worked on. Most admin controls are Enterprise-only, meaning the average consumer does not have access to them.

**Muse is a close second.** It is specific about what the agent can and cannot see, such as the credential store and one-time credit card numbers. The ad carve-out is explicitly stated. However, training is on by default, and while there is isolation of data from other users, it is not isolated from Meta.

**Instinct has broad access.** Its policy states that it may reach passwords, payment details, private messages, health information, or anything else, depending on the permissions you grant it. It also only states that it will make reasonable efforts as its security statement. It does promise not to sell your data, and it does have privacy carve-outs for the Vault.

> All three assign users broad responsibility for agent actions.

This is the line that I keep coming back to, the line that tends to keep people up at night: "If an agent messes up, who is responsible?" Unfortunately, all three agree that these products act on your behalf, but their terms limit responsibility for making mistakes in different ways. Grok Bot acknowledges provider liability for gross negligence or willful misconduct. Meta and Instinct both put all financial losses on the end user. So in short, you still need to be careful and ensure you aren't giving your agent broad permissions to act on its own, especially when it has your credit card.

## What happens next

We will continue to see the concern for privacy and data, especially as adoption expands beyond the tech bubble. Just as cybersecurity came after the internet, I believe new forms of security will appear to help tackle this problem. By and large, there are clear security gaps, but nothing out of the ordinary that would prevent me from continuing to use these tools, given how productive and helpful they are.

## Source documents

- **Instinct**: [Privacy Policy](https://instinct.com/privacy-policy) (revised August 26, 2026) and [Terms of Service](https://instinct.com/terms) (revised August 26, 2026).
- **Muse**: [Muse Privacy Policy](https://muse.ai/privacy) (effective September 17, 2026), [Muse Supplemental Terms of Service](https://muse.ai/terms) (updated September 8, 2026), the [Meta Privacy Policy](https://www.facebook.com/privacy/policy) it supplements, Meta's help center page [How Muse handles your privacy, safety and security](https://www.meta.com/help/artificial-intelligence/1047255454427887/), and the engineering post [How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse) (September 8, 2026).
- **Grok Bot**: [Cursor Privacy Policy](https://cursor.com/privacy) (updated October 6, 2025), [Grok Bot Terms](https://cursor.com/terms/grok-bot) (updated September 3, 2026), [Cursor Terms of Service](https://cursor.com/terms-of-service) (updated September 3, 2026), [Data Use & Privacy Overview](https://cursor.com/data-use) (updated September 3, 2026), [Security](https://cursor.com/security) (updated August 25, 2026), [Grok Bot security documentation](https://cursor.com/docs/grok-bot/security), [Delete your Grok Bot account](https://cursor.com/help/grok-bot/delete-account), and the [subprocessor list](https://trust.cursor.com/subprocessors).
