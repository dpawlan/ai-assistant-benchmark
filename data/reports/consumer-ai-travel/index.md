---
title: The Consumer AI Travel Report
question: We tested real bookings across five different AI assistants to see who performs best when it comes to travel. You'll find our results below.
dimension: travel
published: 2026-10-07
updated: 2026-10-08
author: david-pawlan
preview: true
cover_tint: #eef1f5
cover_agents: muse, instinct, miso, grok-bot, dots
picks:
  - grok-bot | Budget booking | Tied for the lowest ticketed fare in round one; used an approval-based payment flow.
  - dots | Flexible trip changes | Changed its Delta booking with no added charge and a reported $60.01 credit.
  - miso | Premium travel support | Managed rebooking and seat upgrades through chat, with a human team available for follow-up.
  - muse | Cancellation clarity | Quoted the refund, requested approval, and returned a clear cancellation confirmation.
---

When it comes to travel, booking a flight is only the beginning. We examined how five AI assistants handled the entire spectrum of booking a flight. We started with onboarding and looked at how well they were able to add known traveler numbers or find a seat selection. We did re-bookings as well as cancellations. While all of them were able to execute the booking, the performance of each varied and that's what we're going to dive into.

## Why travelers are turning to AI

Travel is a practical test of consumer AI because the work is familiar: compare flights, weigh cost against convenience, enter traveler details, and manage the reservation afterward. An assistant that can take responsibility for those steps has a clear use.

Travel is already appearing as the leading use case for AI assistance. In his [conversation with Patrick O'Shaughnessy on Invest Like the Best](https://www.youtube.com/watch?v=Am7IWP8IpEc), founder Noah Shinn said travel accounted for over 50% of the platform's transaction volume, which was approaching $1 billion a year in annualized GMV.

With the rise in demand, we set out to test which AI assistants are actually the best at booking travel. This is our first consumer report.

## Why travel is so complex

Travel booking rarely follows a straight path. Finding the right flight is just the start. There are fares to compare, seats to select, and Known Traveler Numbers to add. Then plans change, and a trip that seemed settled needs to be rebooked or cancelled. Each step introduces another decision, another set of rules, and another opportunity for frustration.

That frustration is widespread. [YouGov’s Booking Burnout study](https://yougov.com/en-us/reports/51330-us-travel-stress-report-2025) found that 70% of US vacation bookers consider at least one part of the booking process stressful. For something so many people do, there is still plenty of room to make the experience easier.

Our tests revealed another layer of complexity: AI assistants approach booking in different ways. Some use browser automation to navigate airline websites, fill in forms, and complete checkout much as a person would. They may work in their own browser or ask you to take over for part of the process. Others connect to booking systems through APIs, accessing flight inventory and purchasing tickets without clicking through a website. An agency-based service can also pair its booking infrastructure with a human team to handle requests that need additional support.

Those differences shape what happens after you ask for a flight. They affect how much work you have to do, which options the assistant can offer, and whether it can help when you need to change or cancel. An assistant may be able to buy a ticket but lack the tools to modify it later. That is why we tested the steps around the booking as well as the purchase itself.

## How we tested

The report covers [Muse](https://ai.meta.com/muse/), [Instinct](https://instinct.com/), [Miso](https://miso.com/), [GrokBot](https://x.ai/bot), and [Dots](https://openai.com/index/introducing-dots/).

We tested all five assistants on their ability to cover the following dimensions from the Assistant Benchmark:

| Stage | Description |
| --- | --- |
| Onboarding flow | Getting a traveler ready to book, with clear setup steps and the required information and access in place. |
| Booking execution | Turning a chosen flight into a ticketed reservation, confirming the total and getting approval before payment. |
| Seat selection | Finding and selecting a seat that fits the traveler’s preferences, explaining any fees and confirming the assigned seat. |
| Travel profile | Collecting and correctly using traveler details, including loyalty numbers and Known Traveler Numbers, and saving or updating them when requested. |
| Cancellation | Explaining the applicable terms, cancelling with approval, and making the refund or credit outcome clear. |
| Rebooking | Moving a trip to the requested flight or date, getting approval for any additional cost, and confirming the new itinerary. |
| Booking speed | Measuring the time from selecting a flight and asking to book it through confirmation, including checkout questions, payment setup, approvals, and handoffs. |
| Proactiveness | Anticipating useful next steps, preferences, restrictions, and alternatives without waiting for the traveler to ask. |

Below, we break down each of the five assistants: where it worked, where it missed the mark, and what your takeaway should be as a consumer. We then outline which assistant is best for each scenario.

## The competition

### Muse

**Where it worked:** Muse brought useful context into the search: calendar availability, loyalty accounts, and a clear review of the proposed fare. It declined card entry through chat. After its unsuccessful first session, a later recording showed a $354.40 booking and a clear cancellation flow: quote the refund, obtain approval, and confirm cancellation.

**Where it missed the mark:** The first payment flow failed to complete. In round two, Muse said its booking tools could not change a ticketed flight or seat, and its browser handoff did not resolve the problem. Cancellation worked; changing the trip did not.

**Consumer takeaway:** Useful context and a clear cancellation interaction, with a substantial limitation for travelers who expect the assistant to modify an existing booking. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Instinct

**Where it worked:** In the latest retest, Instinct booked an American Main Cabin ticket through Duffel and Link, charged the intended card after approval, and returned confirmation. It also completed the approved $35 Main Cabin Extra purchase, clearly explaining that the seat was still a middle seat. The earlier payment-handling weakness was not repeated in this flow.

**Where it missed the mark:** Repeated card-account clarification added friction. It could not change the Duffel-issued ticket and retracted an assurance that it could handle the support chat. Cancellation completed, but the flight refund amount was unconfirmed and the seat-refund submission failed. It used a saved address for that form without checking first and did not ask for a Known Traveler Number.

**Consumer takeaway:** Improved booking and seat servicing, with a real limitation when the itinerary changes. Refund follow-through still needs work. [Latest retest evidence](https://stmy6z4b3h.s.stableupload.dev/round3.html#transcripts)

### Miso

**Where it worked:** Miso’s app-supported traveler profile carried the Known Traveler Number into the booking. It completed the initial flight, handled the next-day cancel-and-rebook sequence, and quoted an $85.99 seat upgrade before seeking approval and reporting completion—all through the text conversation after setup.

**Where it missed the mark:** The initial confirmation link failed, and a human team followed up. Its $258.40 fare was higher than the Basic Economy tickets obtained elsewhere, although the fare descriptions were different. The final seat-fee refund required its team and remained unresolved at session end.

**Consumer takeaway:** Our pick for premium travel support: a traveler profile, changes handled through iMessage, and a human team involved when follow-up was needed. The appeal is the service around the trip. Its unresolved seat-fee refund remains a limitation of the observed result. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### GrokBot

**Where it worked:** GrokBot tied for the lowest ticketed round-one fare at $191.75. It explained fare choices, used secure forms and an approved virtual card, and removed preselected payment-storage and marketing options. In round two it completed the date change, First Class upgrade, and cancellation, with a reported $463.74 refund.

**Where it missed the mark:** The process was lengthy and required a desktop app. A form needed a retry, the virtual-card number initially confused the traveler, and three screen handoffs were needed across the modification tasks. This was successful assisted execution, not a hands-off service.

**Consumer takeaway:** The strongest combination of low initial fare and completed follow-up tasks in these records, if the traveler is willing to participate when browser automation stalls. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Dots

**Where it worked:** Dots selected a Delta Main Classic fare, explained its conditions, and later changed the departure date with no additional payment and a reported $60.01 credit. It quoted upgrade choices, obtained approval for a $17.20 Comfort seat, and reported cancellation of the flight and upgrade. It clearly acknowledged that the earlier credit had not reconciled.

**Where it missed the mark:** Initial setup included clarification delays, a stuck checkout handoff, and a browser disconnect. The traveler supplied the original airline confirmation. At the end, cancellation was confirmed but the disposition of the $60.01 credit remained unresolved.

**Consumer takeaway:** A strong result for flexible changes, with the advantage of a different airline and fare product. This test cannot isolate whether the result came from assistant quality, airline access, fare flexibility, or their combination. [Booking and modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

## Category winners

These are editorial picks for the recorded tasks, not claims that a product is universally best. Four of the included assistants participated in the first round and five in the second; Instinct was later retested on a different route. Booking conditions and levels of traveler help varied. We have not combined the source pages’ separate scoring systems into a single overall score.

## Best for budget booking in this test: GrokBot

GrokBot and Instinct tied at $191.75 for the same Basic Economy flight. GrokBot gets our category pick because the initial price was paired with a clearer payment-approval flow and successful follow-up tasks in round two. The low fare came with restrictions: changing it later cost extra.

### Flaws but not dealbreakers

The desktop workflow was verbose and required intervention. The fare comparison is specific to this route and these sessions; it does not establish which assistant will find the cheapest price on another trip.

## Best for flexible trip changes in this test: Dots

Dots moved the Delta booking without an additional charge, reported a credit, and completed the requested seat upgrade. Its selection of a changeable fare mattered when plans changed.

### Flaws but not dealbreakers

Dots used a different airline and fare from the United Basic Economy bookings. Initial checkout was not smooth, and the earlier credit remained unresolved after cancellation. This is a recommendation for the observed workflow, not proof of greater autonomy under identical conditions.

## Best for premium travel support: Miso

For travelers who value someone handling the details, Miso is our premium-service pick among the five assistants tested. Its traveler profile carried booking information forward, and it managed rebooking and a paid seat upgrade through iMessage after setup. It quoted the upgrade price and obtained approval before proceeding.

Human support is part of that appeal. The saved conversations show its team following up on a failed confirmation link and taking responsibility for a seat-fee refund that needed further work. That combination of conversational booking and human follow-up makes Miso a promising fit for travelers who want ongoing assistance when a trip gets complicated.

### Flaws but not dealbreakers

The confirmation page failed, and the seat-fee refund remained unresolved at session end. Having a human team available is valuable, but it does not by itself establish that an issue was resolved. We did not establish a comparable end-to-end speed ranking or test luxury hotels and complex international itineraries; this award reflects the travel-support workflow we observed.

## Best cancellation interaction in this test: Muse

Muse made the refund amount and approval step clear and returned a cancellation confirmation. The cancellation recording shows a straightforward sequence even though its date-change and seat-change attempts had failed.

### Flaws but not dealbreakers

The result applies to that reservation and its eligibility at the time. It does not establish cancellation performance outside that scenario, and refund settlement was not independently checked.

## Premium service and premium seats

Miso’s category pick reflects the support around a trip: saved traveler details, changes through chat, and human follow-up. For travelers specifically seeking a First Class upgrade, GrokBot supplied the clearest example in these tests, reporting a United First upgrade for $161.25 and verifying the assigned window seat. Dots and Miso also completed paid upgrades to different seat products.

A higher cabin class is one part of premium travel. Our Miso recommendation prioritizes ongoing service, while recognizing that these tests did not cover luxury hotels, lounge benefits, or complex international itineraries.

## Evidence and limits

Explore the [Travel benchmark](/benchmarks/travel) and its [booking test evidence preview](/reports/nyc-chicago). The booking preview covers round one; the source transcripts below also document the later modification round.

The primary sources are the supplied [Booking benchmark evidence and transcripts](https://stmy6z4b3h.s.stableupload.dev/) and [Modification benchmark evidence and transcripts](https://stmy6z4b3h.s.stableupload.dev/round2.html). The [latest Instinct retest](https://stmy6z4b3h.s.stableupload.dev/round3.html) supersedes its earlier outcomes. Those source pages require the owner’s access password. We also cross-checked sampled frames and ending screens from the 11 locally saved recordings; this was not a frame-by-frame review of every minute. The latest retest update uses its supplied report and full transcripts; its new videos have not been independently reviewed here.

Source summaries are not treated as unquestionable findings. In particular, we do not repeat the claim that the $66.65 price difference was for an identical fare, describe all cancellations as fully resolved, or equate successful completion with zero traveler intervention. We distinguish assistant statements, visible confirmation screens, and unresolved outcomes. Bank settlement was not independently verified.

Raw videos and transcripts contain traveler and booking details. This preview summarizes the relevant evidence without copying those identifiers or payment details into the report. Publication remains pending editorial review. The Instinct transaction-volume figures are attributed to its founder; comparable usage figures for the other assistants have not been established.
