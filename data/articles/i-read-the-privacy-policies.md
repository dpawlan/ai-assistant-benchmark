---
title: I read the privacy policies of the three assistants people actually use. Here is what they say.
dek: Instinct, Muse and Grok all train on your conversations by default. Past that, they diverge sharply on what you can see, stop and delete. Every claim below is quoted from the live policy and was independently re-checked.
date: 2026-09-28
author: David Pawlan
kind: Analysis
report:
update:
agents: grok-bot, muse, instinct
hero_caption: Grok, Muse and Instinct, whose policies were read side by side. Illustration by Assistant Benchmark.
takeaways: All three train on your conversations by default and none of the three ever uses the word "encrypt" | Grok gives you the most control and rights, Muse has the safest defaults, and Instinct holds the most sensitive data with the fewest guarantees | Not one policy properly covers the messaging channel you actually use them on
---

Every time I post a test result, the first reply is some version of the same question: what are these things doing with my data? I have been scoring [Instinct](/agents/instinct), [Muse](/agents/muse) and [Grok](/agents/grok-bot) on how well they book, buy and reply. I had not sat down and read what each one says it does with everything I hand it. So this week I did.

I read the privacy policy of each of the three assistants people use most, in full, along with the terms of service where the policy pointed to them. Then I had every quote and every claim re-checked against the live pages by a second pass that had no access to my notes. Every quotation below is character for character from the source. The corrections that second pass turned up were all matters of degree, and I have folded them in.

The short version: all three train on your conversations unless you find the switch and turn it off. Beyond that, they diverge sharply, and not in the way I expected.

## Who I read

Three companies, three very different documents.

Instinct's policy belongs to Spear Street Technology, Inc., revised August 26, 2026. It is a standalone document of about 2,700 words with a dedicated privacy contact. Its terms choose California law and binding arbitration with a 30-day opt-out.

Muse's policy is Meta's. It is a supplement of about 1,000 words, effective September 17, 2026, that sits on top of the main Meta Privacy Policy and says so in its first line: "The Meta Privacy Policy applies to all Meta Products, including Muse." It lists no contact of its own.

Grok's policy belongs to SpaceXAI LLC, the company formerly branded xAI, effective August 24, 2026. It is the longest at about 4,200 words, but the facts that matter most sit in a separate consumer FAQ and in the terms. Grok inside X is not covered by it at all; that is X Corp's policy.

## Where they align

| | Instinct | Muse | Grok |
| --- | --- | --- | --- |
| Trains on your conversations by default | Yes. Opt out at app.instinct.com/settings, "on a go-forward basis" | Yes. "This setting is on when you first use Muse." | Yes. The policy never states the default; the FAQ describes an "Improve the model" toggle |
| Names a concrete security measure | No. "Reasonable efforts" | No. An isolated VM is the only architectural claim | No. "Commercially reasonable" measures |
| Uses the word "encrypt" anywhere | No, in the policy or the terms | No, in the policy or the terms | No, in the policy, the FAQ or the terms |
| Commits to breach notification | No | No | No; the terms ask you to notify them |
| Promises deletion is complete | No. The company "may, but is not obligated to, delete any of your Materials" | No. Muse "may still 'remember' information it learned from what you deleted" | No. De-identified copies are kept, and nothing says a trained model forgets |
| Names its AI or hosting vendors | No. "Third-party AI model providers" | No. Implies Meta's own models | No model or hosting vendor; Stripe, Apple, Google and X are named for payments and login |
| Covers the messaging channel you use it on | Barely. One line about texting; never names iMessage, WhatsApp or phone calls | No. Never mentions WhatsApp or the mobile number it takes at signup | No. Grok on X falls under X's policy, which never mentions Grok |
| Honors browser privacy signals | No. "Not currently designed to respond to such signals" | Defers to Meta | No. Ignores "Do Not Track" |

The encryption row surprised me most. I counted it myself on all eight documents, roughly 32,000 words in total, and the word does not appear once. Every one of them talks about security in the abstract. None of them says the thing you would expect a company holding your messages to say first.

## Where they diverge

| | Instinct | Muse | Grok |
| --- | --- | --- | --- |
| Retroactive opt-out | No. Safety-flagged content is still trained on after you opt out | Yes. "Changes to this setting also apply to previous interactions." Covers connected email and calendar too | No. Only "your new conversations will not be used." Logged-out users "in some regions (excluding the EU/UK)" cannot opt out at all |
| What it asks you to hand over | Passwords, card numbers and health details, by design, with no special handling | One-time card numbers at checkout and a credential store the agent cannot see, though both claims are on the marketing page, not in the policy | Asks you not to send sensitive data |
| Humans reading your chats | Not addressed either way | The terms reserve the right to "monitor, log, review" the agent "or other reasons in Meta's discretion" | Disclosed: "A limited number of our authorized personnel may review your conversations with Grok" |
| Your rights | None. No access, export or correction; GDPR and CCPA never appear | None of its own; all inherited from Meta | Access, correction, deletion, export, appeal and a data protection officer contact |
| Retention | No period stated. The word "retention" does not appear | No period stated | 30 days for deleted chats and accounts; Private Chat is deleted within 30 days and never trained on |
| Advertising | "We do not sell your information or disclose your information to registered data brokers." Cookies are used for offers | "Muse doesn't share your conversations or the data in your virtual machine with Meta ad systems." Activity and metadata are not covered | The FAQ says no ads; the policy lists "targeted advertising" as a cookie purpose and the terms let it share derived usage data |
| License to your content | None. It takes an authorization to access your accounts and act on your behalf | Transferable and sublicensable, but "solely to provide, maintain, secure and improve Muse" | "Irrevocable, perpetual" and "for any purpose," including your "image, likeness, voice" |
| Affiliates | None | Combines with your other Meta accounts unless you sign up with an unlinked email | Undefined "related companies," with X, SpaceX and Cursor named as examples. Signing in with X pulls your X history in |
| Minimum age | 18 | 18 | 13 with parental agreement, while admitting the service may produce "sexual situations, or violence" |
| Document quality | Standalone but silent on most of what matters | Short and clear but only a supplement | Long and complete, but the training default, human review and no-sale promise are kept out of the policy |

## What I make of it

**Grok gives you the most control.** It is the only one with concrete retention windows, a Private Chat mode, in-app export and delete-all, enumerated rights with an appeal process and a privacy officer you can email. If you want levers, Grok has them. The cost is the fine print around them: the broadest content license of the three, affiliates it never defines, and the habit of putting the important facts in an FAQ rather than the policy.

**Muse has the safest defaults.** If you never open a settings page, Muse treats your conversations best. The training opt-out reaches backwards, the ad carve-out is explicit, the license is narrow, and it strips identifiers before anything is trained on. What it does not have is anything of its own: no contact, no retention period, no rights that are not Meta's, and an admission that deletion is lossy.

**Instinct has the most exposure and the fewest guarantees.** It is the one I use most, and it is the one built to hold the most: passwords, card numbers, private messages, health details. It pairs that with "reasonable efforts" as its only security statement, a warning that data "may not be secure while in transit," no retention period, no user rights, and unnamed AI providers and business partners receiving data. Its no-sale promise, its Google and Vault carve-outs and its candour about agent risk are real strengths. They sit on the thinnest foundation.

> None of the three policies covers the channel you actually use them on.

That last point is the one I keep coming back to. These are assistants you text. Instinct and Muse never name iMessage or WhatsApp. Grok inside X answers to a policy that never names Grok. The documents that govern these products say almost nothing about the surface the products live on.

## What happens next

Scores on this site will stay hands-on. What an assistant actually does with a permission prompt matters more than what a document says. But a policy is a checkable fact that readers ask about, so the plan is a short, unscored policy row on each profile, in the same shape as the funding row, with a source link and a checked date. Instinct, Muse and Grok are done. The rest of the ranked assistants are next.

The full comparison, with every quote and the verification counts, is in the [research notes](https://github.com/dpawlan/ai-assistant-benchmark/blob/main/docs/research/privacy-policies-2026-09-27.md).
