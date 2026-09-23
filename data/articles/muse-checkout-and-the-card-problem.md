---
title: Muse just solved the card problem, and everyone else has to answer it
dek: Native checkout sounds like a feature. It is actually the answer to the question every shopping assistant has been dodging: whose card is it?
date: 2026-09-22
author: David Pawlan
kind: Analysis
report: shopping
update: muse-adds-paypal-and-shopify-checkout
preview: true
agents: muse, instinct, grok-bot
hero_caption: Muse, Instinct and Grok Bot on the purchasing test. Illustration by Assistant Benchmark.
takeaways: Muse now finishes a Shopify or PayPal order on its own card, in one message | Instinct and the rest still stop at a payment link, which the test credits but readers will not | The card question, not intelligence, now decides the shopping category
---

PREVIEW ONLY. This is placeholder prose to show the shape of an article; the events described are illustrative.

For two weeks the purchasing test has been decided by one thing, and it is not intelligence. Every assistant we sent the reorder task to could find the coffee. Most could put two bags in a basket. The split happened at the last screen, where a card number has to come from somewhere, and that is where the whole category has been quietly stuck.

There are three answers to "whose card is it", and until today every assistant picked one and lived with the consequences.

## The three answers

**Yours, typed by you.** Instinct, Tomo, szn and most of the field stage the order and send a link for you to finish. It is safe, it is honest, and it means the assistant did not actually buy anything. The test gives partial credit for this because stopping at payment is correct behaviour, but it is the assistant handing the hardest step back.

**Yours, held by them.** Grok Bot's cloud computer can log in anywhere, which sounds like the general solution until you notice it needs your credentials to do it. Nobody in our testing group was willing to hand those over, and the assistant that asks for them will keep losing on trust even when it wins on capability.

**Theirs, settled later.** Muse issues its own virtual card, buys, and settles with you afterwards. The merchant never sees your number. This was already the reason Muse tied for first, and it had one gap: stores that force a guest checkout form, where Muse would stall and send a link like everyone else.

## What changed today

Native Shopify and PayPal checkout closes that gap. In [our re-run this afternoon](/reports/shopping/updates/muse-adds-paypal-and-shopify-checkout), Muse went from prompt to order number in one message on a store it had never seen. Instinct, on the same prompt an hour later, staged the same order and stopped at its link, exactly as it did two weeks ago.

> One of these assistants can be sent a text from a meeting and the coffee arrives. The other needs you to tap a link, enter a card, and confirm.

That is a one-point difference on the scorecard. It is a much bigger difference in what the product is, and it is the difference a reader will feel the first time they try either one.

## Why this forces everyone's hand

The card problem was survivable while nobody had solved it. A user comparing Instinct and Tomo saw two assistants that both stop at payment and picked on other things: speed, memory, which one found the right item. Now the comparison is against an assistant that finishes, and "we stop at payment for your safety" starts to sound like an excuse rather than a principle.

Instinct has said a card vault is coming. If it ships, the two are level again and the choice goes back to who shops better, which is a contest Instinct wins. If it does not, the runner-up spot is about as good as it gets.

For Grok Bot the pressure is sharper. It is the most capable browser in the group and the only one with no answer to the card question at all. An Amazon integration, or a wallet it funds on your behalf, would change its position overnight. Without one, it stays the assistant we recommend for finding things and not for buying them.

## What we will watch

We have run Muse's new checkout once, on one store. The next update will cover three more, including one that fails the guest checkout path on purpose. We will also add a returns task to the test this month, because the second half of shopping is sending things back, and nobody has been scored on it yet.

The report, [The best AI assistant for shopping](/reports/shopping), has the full ranking and the write-up on every assistant that took the test.
