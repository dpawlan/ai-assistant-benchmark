---
title: The Consumer AI Travel Report
question: Six assistants. Two rounds of real travel tasks. What happened when we asked them to book, change, upgrade, and cancel.
dimension: travel
published: 2026-10-07
updated: 2026-10-08
author: david-pawlan
preview: true
cover_tint: #eef1f5
cover_agents: muse, instinct, miso, soar, grok-bot, dots
picks:
  - grok-bot | Budget booking | Tied for the lowest ticketed fare in round one; used an approval-based payment flow.
  - dots | Flexible trip changes | Changed its Delta booking with no added charge and a reported $60.01 credit.
  - miso | Premium travel support | Managed rebooking and seat upgrades through chat, with a human team available for follow-up.
  - muse | Cancellation clarity | Quoted the refund, requested approval, and returned a clear cancellation confirmation.
---

Booking a flight is only the beginning. Across two rounds, we examined how six AI assistants handled the work that follows: a new departure date, a better seat, and a request to cancel everything. The differences were substantial—and some of the easiest bookings became the hardest trips to change.

## Why travelers are turning to AI

Travel is a practical test of consumer AI because the work is familiar: compare flights, weigh cost against convenience, enter traveler details, and manage the reservation afterward. An assistant that can take responsibility for those steps has a clear use.

**Editorial gap:** We have not verified a travel-usage percentage or a quote establishing travel as Instinct’s largest use case, or comparable figures for the other products. The supplied recordings establish task performance, not market demand. Add those attributed figures here before making that claim.

For this first consumer report, the question is concrete: how much of a real trip can an assistant handle, and how much work comes back to the traveler?

## Why travel is so complex

The lowest fare can come with restrictions that only become important when plans change. A successful search also depends on whether an assistant can reach the airline’s checkout, pass control to the traveler when needed, and return a usable confirmation.

Our sessions exposed four recurring complications:

- **Fare conditions change the comparison.** Grok Bot and Instinct booked United Basic Economy at $191.75. Miso booked the same flight number for $258.40, described as Economy. The $66.65 difference is real, but it is not proof of a markup on an identical fare product.
- **The booking channel affects what can happen next.** Muse’s later ticket was issued through Duffel. It could cancel that reservation but reported that its booking tool could not change the date or seats after ticketing.
- **Browser control can break at the decisive moment.** Grok Bot needed traveler handoffs to finish actions on United. Instinct reported being locked out. Dots lost browser access after submitting the original purchase and needed the traveler’s confirmation email to establish that it went through.
- **Cancellation and refund completion are different outcomes.** Miso cancelled the flight but left its seat-fee refund with a human team. Dots confirmed cancellation but could not reconcile an earlier flight credit by the end of the session.

Those distinctions matter more than a confident “done.”

## How we tested

The report covers **Muse, Instinct, Miso, Soar, Grok Bot, and Dots**. The source pages call the latter two GrokBot and Dot; we use their Assistant Benchmark names here.

**Round one:** Grok Bot, Instinct, Miso, Muse, and Soar received the same opening request. Three returned ticketing confirmations: Grok Bot, Instinct, and Miso. Muse did not finish payment in that session; Soar handed the traveler to Google Flights.

> I want to book a one way flight to chicago from NYC this weekend. I want to leave Friday night and get in at a reasonable time.

**Round two:** Grok Bot, Instinct, Miso, Muse, and Dots were asked to move the flight to the following day, obtain a premium seat, and cancel everything. Dots joined with a new Delta booking; Muse completed a new booking before its modification tests. Soar was not tested in round two. This is six products across two five-product rounds—not six identical end-to-end tests.

| Stage | What the records show |
| --- | --- |
| Onboarding | We reviewed setup and payment friction visible in the sessions. Accounts and saved profiles differed, so this is not a controlled new-account timing comparison. |
| Booking | Three of five assistants returned booking confirmations in round one. Dots and Muse made fresh bookings in the later round. We distinguish a quoted fare from a ticketed reservation. |
| Detailed requests | Three of five changed the departure date and three of five completed a paid seat or cabin upgrade in round two. We recorded approval steps, extra charges, and traveler intervention. |
| Cancellations | Four of five reported flight cancellation in round two. Miso’s seat-fee refund and Dots’ earlier credit remained unresolved. We did not inspect bank statements to confirm settlement. |

### 01 · Onboarding and payment

Miso used a companion app to collect traveler information, including a Known Traveler Number. Muse used calendar context and identified two loyalty accounts. Grok Bot used secure forms and an approval-based virtual-card flow; Dots asked the traveler to enter the card security code directly in the airline checkout.

The boundaries were not equally clear. Instinct accepted card details through chat and assumed authorization when the cardholder’s name differed from the traveler’s. That is an observed consent-handling weakness, not evidence that the card was actually used without its owner’s permission. Dots explicitly asked whether the traveler was authorized to use the saved card.

### 02 · Booking

Grok Bot and Instinct each returned a $191.75 booking confirmation for United UA1871. Miso returned a $258.40 confirmation for that flight, with a different fare description. Muse’s first session stalled at payment; a later session completed a $354.40 booking for a different United flight. Soar explicitly said it could not purchase the flight.

Dots booked a $268.40 Delta Main Classic itinerary. Its checkout handoff was awkward, and the browser disconnected after purchase submission. The traveler supplied the airline confirmation; Dots acknowledged that it had not independently verified the ticket receipt at that point.

### 03 · Changes and premium seats

Grok Bot changed the United itinerary for an additional $110.74, including a move out of Basic Economy and the fare difference. It later completed a $161.25 First Class upgrade. Traveler screen handoffs were needed when airline actions stalled.

Miso cancelled and rebooked for $222.40, then reported completing an $85.99 Economy Plus seat purchase after approval. Dots changed its Delta flight with no additional payment and a reported $60.01 eCredit, then completed a $17.20 Comfort upgrade.

Muse could not complete either modification through its tools. Instinct’s attempted rebooking and seat change ended in a browser-access failure. These upgrades were different products on different itineraries; their prices are not a like-for-like cabin comparison.

### 04 · Cancellations

Grok Bot reported cancellation and a $463.74 refund after explicit approval and another traveler handoff. Muse quoted $354.40 back, asked for confirmation, then reported the booking cancelled. Those are recorded refund confirmations, not independently verified credits on a bank statement.

Miso reported the $222.40 flight refund, but its $85.99 seat-fee refund remained with its human team. Dots reported a $225.59 refund for the changed flight and upgrade; the earlier $60.01 eCredit was still unexplained when the traveler ended the session. Instinct did not complete cancellation in the saved record.

The assistants made differing statements about cancellation windows. We report the observed outcome for each reservation and do not present their explanations as a general airline refund rule.

## The competition

### Muse

**Where it worked:** Muse brought useful context into the search: calendar availability, loyalty accounts, and a clear review of the proposed fare. It declined card entry through chat. After its unsuccessful first session, a later recording showed a $354.40 booking and a clear cancellation flow: quote the refund, obtain approval, and confirm cancellation.

**Where it missed the mark:** The first payment flow failed to complete. In round two, Muse said its booking tools could not change a ticketed flight or seat, and its browser handoff did not resolve the problem. Cancellation worked; changing the trip did not.

**Consumer takeaway:** Useful context and a clear cancellation interaction, with a substantial limitation for travelers who expect the assistant to modify an existing booking. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Instinct

**Where it worked:** Instinct completed the initial $191.75 booking inside iMessage and returned confirmation and ticket information. The interaction showed that a concise text-based flow could reach an actual booking.

**Where it missed the mark:** It accepted payment details in chat and assumed permission for a card in another person’s name. In the next round, it revised its cancellation-window advice, reported being locked out of United, and did not complete the date change, seat upgrade, or cancellation. The saved session ended with work handed back to the traveler.

**Consumer takeaway:** A smooth first booking did not translate into reliable follow-through in this test. The earlier draft’s recommendation for ongoing travel assistance is withdrawn for this report. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Miso

**Where it worked:** Miso’s app-supported traveler profile carried the Known Traveler Number into the booking. It completed the initial flight, handled the next-day cancel-and-rebook sequence, and quoted an $85.99 seat upgrade before seeking approval and reporting completion—all through the text conversation after setup.

**Where it missed the mark:** The initial confirmation link failed, and a human team followed up. Its $258.40 fare was higher than the Basic Economy tickets obtained elsewhere, although the fare descriptions were different. The final seat-fee refund required its team and remained unresolved at session end.

**Consumer takeaway:** Our pick for premium travel support: a traveler profile, changes handled through iMessage, and a human team involved when follow-up was needed. The appeal is the service around the trip. Its unresolved seat-fee refund remains a limitation of the observed result. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Soar

**Where it worked:** Soar returned a concise flight shortlist and was explicit that it could not purchase a ticket. It provided a Google Flights handoff rather than claiming to have booked.

**Where it missed the mark:** It did not satisfy the booking task. Its displayed cheapest option was about $296, and it did not surface the roughly $192 option that appeared in other sessions. That is a difference in these searches, not proof of a persistent pricing disadvantage.

**Consumer takeaway:** A search-and-handoff tool in this test. Soar was not included in the modification round, so rebooking, upgrades, and cancellation are untested here—not failed. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts)

### Grok Bot

**Where it worked:** Grok Bot tied for the lowest ticketed round-one fare at $191.75. It explained fare choices, used secure forms and an approved virtual card, and removed preselected payment-storage and marketing options. In round two it completed the date change, First Class upgrade, and cancellation, with a reported $463.74 refund.

**Where it missed the mark:** The process was lengthy and required a desktop app. A form needed a retry, the virtual-card number initially confused the traveler, and three screen handoffs were needed across the modification tasks. This was successful assisted execution, not a hands-off service.

**Consumer takeaway:** The strongest combination of low initial fare and completed follow-up tasks in these records, if the traveler is willing to participate when browser automation stalls. [Booking evidence](https://stmy6z4b3h.s.stableupload.dev/#transcripts) · [Modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

### Dots

**Where it worked:** Dots selected a Delta Main Classic fare, explained its conditions, and later changed the departure date with no additional payment and a reported $60.01 credit. It quoted upgrade choices, obtained approval for a $17.20 Comfort seat, and reported cancellation of the flight and upgrade. It clearly acknowledged that the earlier credit had not reconciled.

**Where it missed the mark:** Initial setup included clarification delays, a stuck checkout handoff, and a browser disconnect. The traveler supplied the original airline confirmation. At the end, cancellation was confirmed but the disposition of the $60.01 credit remained unresolved.

**Consumer takeaway:** A strong result for flexible changes, with the advantage of a different airline and fare product. This test cannot isolate whether the result came from assistant quality, airline access, fare flexibility, or their combination. [Booking and modification evidence](https://stmy6z4b3h.s.stableupload.dev/round2.html#transcripts)

## Category winners

These are editorial picks for the recorded tasks, not claims that a product is universally best. Five assistants participated in each round, with different booking conditions and varying levels of traveler help. We have not combined the source pages’ separate scoring systems into a single overall score.

## Best for budget booking in this test: Grok Bot

Grok Bot and Instinct tied at $191.75 for the same Basic Economy flight. Grok Bot gets our category pick because the initial price was paired with a clearer payment-approval flow and successful follow-up tasks in round two. The low fare came with restrictions: changing it later cost extra.

### Flaws but not dealbreakers

The desktop workflow was verbose and required intervention. The fare comparison is specific to this route and these sessions; it does not establish which assistant will find the cheapest price on another trip.

## Best for flexible trip changes in this test: Dots

Dots moved the Delta booking without an additional charge, reported a credit, and completed the requested seat upgrade. Its selection of a changeable fare mattered when plans changed.

### Flaws but not dealbreakers

Dots used a different airline and fare from the United Basic Economy bookings. Initial checkout was not smooth, and the earlier credit remained unresolved after cancellation. This is a recommendation for the observed workflow, not proof of greater autonomy under identical conditions.

## Best for premium travel support: Miso

For travelers who value someone handling the details, Miso is our premium-service pick among the six assistants tested. Its traveler profile carried booking information forward, and it managed rebooking and a paid seat upgrade through iMessage after setup. It quoted the upgrade price and obtained approval before proceeding.

Human support is part of that appeal. The saved conversations show its team following up on a failed confirmation link and taking responsibility for a seat-fee refund that needed further work. That combination of conversational booking and human follow-up makes Miso a promising fit for travelers who want ongoing assistance when a trip gets complicated.

### Flaws but not dealbreakers

The confirmation page failed, and the seat-fee refund remained unresolved at session end. Having a human team available is valuable, but it does not by itself establish that an issue was resolved. We did not establish a comparable end-to-end speed ranking or test luxury hotels and complex international itineraries; this award reflects the travel-support workflow we observed.

## Best cancellation interaction in this test: Muse

Muse made the refund amount and approval step clear and returned a cancellation confirmation. The cancellation recording shows a straightforward sequence even though its date-change and seat-change attempts had failed.

### Flaws but not dealbreakers

The result applies to that reservation and its eligibility at the time. It does not establish cancellation performance outside that scenario, and refund settlement was not independently checked.

## Premium service and premium seats

Miso’s category pick reflects the support around a trip: saved traveler details, changes through chat, and human follow-up. For travelers specifically seeking a First Class upgrade, Grok Bot supplied the clearest example in these tests, reporting a United First upgrade for $161.25 and verifying the assigned window seat. Dots and Miso also completed paid upgrades to different seat products.

A higher cabin class is one part of premium travel. Our Miso recommendation prioritizes ongoing service, while recognizing that these tests did not cover luxury hotels, lounge benefits, or complex international itineraries.

## Evidence and limits

Explore the [Travel benchmark](/benchmarks/travel) and its [booking test evidence preview](/reports/nyc-chicago). The booking preview covers round one; the source transcripts below also document the later modification round.

The primary sources are the supplied [Booking benchmark evidence and transcripts](https://stmy6z4b3h.s.stableupload.dev/) and [Modification benchmark evidence and transcripts](https://stmy6z4b3h.s.stableupload.dev/round2.html). Those source pages require the owner’s access password. We also cross-checked sampled frames and ending screens from the 11 locally saved recordings; this was not a frame-by-frame review of every minute.

Source summaries are not treated as unquestionable findings. In particular, we do not repeat the claim that the $66.65 price difference was for an identical fare, describe all cancellations as fully resolved, or equate successful completion with zero traveler intervention. We distinguish assistant statements, visible confirmation screens, and unresolved outcomes. Bank settlement was not independently verified.

Raw videos and transcripts contain traveler and booking details. This preview summarizes the relevant evidence without copying those identifiers or payment details into the report. Publication remains pending editorial review and verification of any market-usage claims added to the introduction.
