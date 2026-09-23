---
title: The best AI assistant for shopping
question: Which assistant should buy things for you?
dimension: purchasing
published: 2026-09-10
updated: 2026-09-22
author: david-pawlan
cover_tint: "#e8f1ff"
cover_agents: muse, instinct, tomo, grok-bot, szn, shuffle, ollie
preview: true
picks:
  - muse | Our pick | Finishes the order on its own virtual card, asks before charging, and returns the order number in one message.
  - instinct | Runner-up | Better at finding the right thing from a vague description; the last step still routes your card through a link.
  - tomo | Also good | Reliable on brand sites when Amazon blocks it, and the clearest about what it is about to spend.
---

After sending the same reorder task to fourteen assistants over two weeks, we think Muse is the one to hand your shopping to. It is the only assistant that placed an order on its own card, asked before charging, and came back with an order number, and after this week's checkout launch it does that on Shopify and PayPal stores without a detour.

Instinct is close behind and is the better shopper when you do not quite know what you want. Tomo is the pick if you mostly buy from brand sites, and Grok Bot is worth knowing about for one-off purchases from stores nobody has an account with.

## Who this is for

This report is for anyone who wants to send a text like "reorder the coffee, two bags" and have it happen. It is not about product research or price tracking; several assistants are good at that and it is scored under recommendations.

If you never let anything hold a card for you, skip Muse and read the Instinct and Tomo sections. Both stage the order and stop at the payment step, which some people will prefer.

## How we tested

Every assistant gets the same purchasing task from the published test: reorder the coffee beans from last time, two bags, to the home address, using the saved card. We score whether the order lands, whether the assistant asks before spending, whether it stays under the budget in the prompt, and whether you get a confirmation back without asking for one.

Stopping at the payment step because no card was authorised is correct behaviour and is credited as such. Guessing a card, ordering the wrong quantity, or going silent after "on it" are not. Scores here are the newest run per assistant, and the full rubric is on the purchasing test page.

## Our pick: Muse

Muse treats a purchase the way a good assistant would: it confirms the item, tells you the total, waits for a yes, and then does the whole thing. In our latest run it found the previous coffee order in its own memory, matched the two-bag quantity, quoted the price with shipping, and asked a single question before paying. The order confirmation came back four minutes later with the order number and the delivery window.

The mechanics are what set it apart. Muse holds a virtual card of its own, so the merchant never sees yours, and it settles with you afterwards. On September 22 it added native checkout through Shopify and PayPal, which removed the last place it used to stall: stores that force a guest checkout form. We re-ran the task the same afternoon and it went straight through.

It is also the only assistant in this group that handled a follow-up correctly. "Make it three bags" sent twenty seconds after the confirmation changed the order rather than placing a second one.

### Flaws but not dealbreakers

- Muse still cannot buy from stores that require an account login it does not have; it tells you so and stops, which is the right call but means it will not work everywhere.
- The settle-up flow lives in the app, not in the chat, so the money side is one tap away rather than in the thread.

## Runner-up: Instinct

Instinct is the assistant to use when the request is fuzzy. Given "get me a decent pour-over kettle under $80", it asked two sharp questions about size and gooseneck, found three options, and picked the one with the best reviews rather than the cheapest. Muse, given the same prompt, bought the first result that fit the budget.

On the reorder task it did everything up to payment: found the item, set the quantity, applied the home address, and staged the order. The card still has to go in through a link Instinct sends you, which it does quickly and only once. That last step is why it sits a point behind Muse rather than level with it.

### Flaws but not dealbreakers

- An earlier run in August lost the saved card digits mid-checkout and flip-flopped on whether a store credit applied; the September run had none of that, but it is why we would not leave it unattended on a big order.

## The competition

### Tomo

Tomo reached checkout on the roaster's own site after Amazon blocked it, quoted the total to the cent, and stopped for approval. It is the most transparent of the group about money, and the best choice if you shop mostly from brand sites. It is slower than Muse and will not hold a card for you.

### Grok Bot

Grok Bot can find almost anything and keeps trying long after Muse has given up, but it runs on a cloud computer with no card of its own, so every purchase ends at a login wall or a request to fund a wallet first. For a one-off purchase from a store you have never used, it gets closer than anyone. For anything you buy regularly, it is not a contest.

### szn

szn staged the order correctly and asked before paying, which is exactly what the test asks for. It fell short on the follow-up: a quantity change became a second staged order rather than an edit.

### Shuffle

Shuffle got the order to the payment screen with the right item and quantity but needed the address pasted in even though it had been given earlier in the thread.

### Ollie

Ollie handled the reorder cleanly and asked before paying. It lost a point for reporting a subtotal that did not include shipping, which it corrected when asked.

### Pally

Pally matched Ollie almost step for step. It is a fine pick if you already use it for other things; nothing about its shopping stands out either way.

### Caddy

Caddy found the item and quantity but stalled on the address, asking for it twice, and the run ended without a staged order.

### Asmi

Asmi found the product page and stopped there, sending a link rather than staging anything.

### Boba

Boba did the same as Asmi: a product link and an offer to "help you check out" that did not go anywhere.

### Orchid

Orchid is strong elsewhere in the benchmark but treated the reorder as a research task, returning three alternatives instead of the item that was asked for.

## What to look forward to

Muse's Shopify and PayPal checkout is new and we have run it once; we will re-run it on three more stores in the next update. Instinct has said a card vault is coming, which would close the gap. We also plan to add a returns task to the test, since two readers asked how these assistants handle sending something back.
