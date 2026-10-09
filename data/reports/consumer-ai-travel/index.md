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
  - grok-bot | Budget booking | Booked a $191.75 Basic Economy fare with an approval-based payment flow.
  - dots | Flexible trip changes | Changed its Delta booking with no added charge and a reported $60.01 credit.
  - miso | Premium travel support | Managed rebooking and seat upgrades through chat, with a human team available for follow-up.
  - muse | Cancellation clarity | Quoted the refund, requested approval, and returned a clear cancellation confirmation.
  - instinct | Low back-and-forth | Booked through iMessage in 15 messages, including four from the traveler.
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

Time to booking: approximately [16 minutes](/benchmarks/travel/dimensions/19#muse), including payment reconnection. Excludes the earlier failed attempt.

**Where it worked**

- Personalized recommendations using our calendar and loyalty details.
- Booked successfully after we fixed the payment connection.
- Quoted the refund, asked for approval, and confirmed cancellation.

**Where it missed the mark**

- Broken reconnection links required us to fix payment setup in the app.
- Could not change the flight, upgrade the seat, or verify the airline received our loyalty number.

**Consumer takeaway:** Thoughtful planning and clear cancellation, but a poor fit for trips likely to need changes.

[Onboarding](/benchmarks/travel/dimensions/18#muse) · [Booking execution](/benchmarks/travel/dimensions/5#muse) · [Seat selection](/benchmarks/travel/dimensions/6#muse) · [Travel profile](/benchmarks/travel/dimensions/7#muse) · [Cancellation](/benchmarks/travel/dimensions/8#muse) · [Rebooking](/benchmarks/travel/dimensions/9#muse) · [Booking speed](/benchmarks/travel/dimensions/19#muse) · [Proactiveness](/benchmarks/travel/dimensions/20#muse)

### Instinct

Time to booking: approximately [6 minutes](/benchmarks/travel/dimensions/19#instinct), including payment clarification and approval.

**Where it worked**

- Booked through iMessage using our saved traveler details.
- Purchased a $35 Main Cabin Extra seat after explaining that it was a middle seat.

**Where it missed the mark**

- Repeatedly needed clarification about the payment card; never asked for our Known Traveler Number.
- Promised help with rebooking, then handed the work back to us.
- Cancelled the flight without confirming the refund amount; the seat-refund request failed and used an address without checking.

**Consumer takeaway:** Convenient for booking by text, but expect to handle itinerary changes and refund follow-up yourself.

[Onboarding](/benchmarks/travel/dimensions/18#instinct) · [Booking execution](/benchmarks/travel/dimensions/5#instinct) · [Seat selection](/benchmarks/travel/dimensions/6#instinct) · [Travel profile](/benchmarks/travel/dimensions/7#instinct) · [Cancellation](/benchmarks/travel/dimensions/8#instinct) · [Rebooking](/benchmarks/travel/dimensions/9#instinct) · [Booking speed](/benchmarks/travel/dimensions/19#instinct) · [Proactiveness](/benchmarks/travel/dimensions/20#instinct)

### Miso

Time to booking: approximately [3 minutes](/benchmarks/travel/dimensions/19#miso) to initial confirmation. Excludes prior profile setup and confirmation-page troubleshooting.

**Where it worked**

- Used our Known Traveler Number and added loyalty details to the reservation.
- Handled rebooking, an approved Economy Plus purchase, and flight cancellation through iMessage.
- Human support resolved the seat-map issue; email recovered the booking confirmation.

**Where it missed the mark**

- No Basic Economy in its available inventory; our Economy ticket cost $258.40.
- The $85.99 seat-fee refund required a human handoff to resolve.

**Consumer takeaway:** Our pick for premium travel support: it handled the trip through chat, with a human stepping in to resolve the seat-fee refund.

[Onboarding](/benchmarks/travel/dimensions/18#miso) · [Booking execution](/benchmarks/travel/dimensions/5#miso) · [Seat selection](/benchmarks/travel/dimensions/6#miso) · [Travel profile](/benchmarks/travel/dimensions/7#miso) · [Cancellation](/benchmarks/travel/dimensions/8#miso) · [Rebooking](/benchmarks/travel/dimensions/9#miso) · [Booking speed](/benchmarks/travel/dimensions/19#miso) · [Proactiveness](/benchmarks/travel/dimensions/20#miso)

### GrokBot

Time to booking: approximately [15.5 minutes](/benchmarks/travel/dimensions/19#grok-bot), including forms and payment approval. Ticket processing was still noted at confirmation.

**Where it worked**

- Booked a $191.75 Basic Economy fare with secure forms and payment approval.
- Completed the flight change, First Class upgrade, and cancellation with our help.
- Confirmed the cancellation refund amount.

**Where it missed the mark**

- Stalled browser steps required us to take over during changes, upgrades, and cancellation.
- Payment setup needed clarification, and it did not ask for loyalty or Known Traveler details.

**Consumer takeaway:** Good for low fares if you are comfortable helping the browser along; Basic Economy changes cost extra.

[Onboarding](/benchmarks/travel/dimensions/18#grok-bot) · [Booking execution](/benchmarks/travel/dimensions/5#grok-bot) · [Seat selection](/benchmarks/travel/dimensions/6#grok-bot) · [Travel profile](/benchmarks/travel/dimensions/7#grok-bot) · [Cancellation](/benchmarks/travel/dimensions/8#grok-bot) · [Rebooking](/benchmarks/travel/dimensions/9#grok-bot) · [Booking speed](/benchmarks/travel/dimensions/19#grok-bot) · [Proactiveness](/benchmarks/travel/dimensions/20#grok-bot)

### Dots

Time to booking: approximately [33 minutes](/benchmarks/travel/dimensions/19#dots), including checkout handoffs. We supplied the airline confirmation after its browser disconnected.

**Where it worked**

- Checked our preferences and fare restrictions, then used our Delta account details.
- Changed the flight with no added payment and reported a $60.01 credit.
- Purchased a $17.20 Comfort aisle seat with approval.

**Where it missed the mark**

- Checkout required troubleshooting and our help to confirm the booking.
- Cancellation needed follow-up; the earlier $60.01 credit remained unexplained.

**Consumer takeaway:** Strong on changes with a flexible fare, but initial checkout took work and credits needed checking.

[Onboarding](/benchmarks/travel/dimensions/18#dots) · [Booking execution](/benchmarks/travel/dimensions/5#dots) · [Seat selection](/benchmarks/travel/dimensions/6#dots) · [Travel profile](/benchmarks/travel/dimensions/7#dots) · [Cancellation](/benchmarks/travel/dimensions/8#dots) · [Rebooking](/benchmarks/travel/dimensions/9#dots) · [Booking speed](/benchmarks/travel/dimensions/19#dots) · [Proactiveness](/benchmarks/travel/dimensions/20#dots)

## Category winners

These picks reflect our experience with each assistant. Routes, fares and the amount of help we provided varied, so each recommendation focuses on a specific travel need.

## Best for budget booking in this test: GrokBot

GrokBot and Instinct tied at $191.75 for the same Basic Economy flight. GrokBot gets our category pick because the initial price was paired with a clearer payment-approval flow and successful changes and cancellation. The low fare came with restrictions: changing it later cost extra.

### Flaws but not dealbreakers

The desktop workflow was verbose and required intervention. The fare comparison is specific to this route and these sessions; it does not establish which assistant will find the cheapest price on another trip.

## Best for flexible trip changes in this test: Dots

Dots moved the Delta booking without an additional charge, reported a credit, and completed the requested seat upgrade. Its selection of a changeable fare mattered when plans changed.

### Flaws but not dealbreakers

Dots used a different airline and fare from the United Basic Economy bookings. Initial checkout was not smooth, and the earlier credit remained unresolved after cancellation. This is a recommendation for the observed workflow, not proof of greater autonomy under identical conditions.

## Best for premium travel support: Miso

For travelers who value someone handling the details, Miso is our premium-service pick among the five assistants tested. Its traveler profile carried booking information forward, and it managed rebooking and a paid seat upgrade through iMessage after setup. It quoted the upgrade price and obtained approval before proceeding.

Human support is part of that appeal. When the seat map failed, Miso’s team stepped into the conversation and provided it. We also received the booking confirmation by email after the confirmation page failed. That combination of conversational booking and human support makes Miso a strong fit for travelers who want help managing the details.

### Flaws but not dealbreakers

Miso’s available inventory did not include Basic Economy, which limited its ability to match the lowest fare we found elsewhere. The separate $85.99 seat-fee refund required the human team to step in and resolve it. The issue was closed, but the assistant could not complete that step on its own.

## Best cancellation interaction in this test: Muse

Muse made the refund amount and approval step clear and returned a cancellation confirmation. We found cancellation straightforward, even though our flight-change and seat-change requests had failed.

### Flaws but not dealbreakers

The result applies to that reservation and its eligibility at the time. It does not establish cancellation performance outside that scenario, and refund settlement was not independently checked.

## Low back-and-forth during booking: Instinct

Instinct handled the booking in 15 transcript messages from the initial trip request to confirmation, including four from us. It reused our traveler details and returned confirmation about six minutes after we selected the flight.

### Flaws but not dealbreakers

The message count covers the chat, not secure forms or other setup steps. Instinct still needed help with payment-account clarification, rebooking and refund follow-up.

## Evidence and limits

Explore the [Travel benchmark](/benchmarks/travel) and its [booking test evidence preview](/reports/nyc-chicago). The booking preview covers round one; the source transcripts below also document the later modification round.

Our [dimension evidence pages](/benchmarks/travel/dimensions) contain the task results and supporting recordings and screenshots for each assistant. The links in each review take you directly to that assistant’s evidence for the relevant task. Original source reports remain linked from those pages. We reviewed the supplied transcripts and sampled the recordings; this was not a frame-by-frame audit of every minute. Miso’s OTA inventory limitation reflects information supplied by the reviewer.

Source summaries are not treated as unquestionable findings. In particular, we do not repeat the claim that the $66.65 price difference was for an identical fare, describe all cancellations as fully resolved, or equate successful completion with zero traveler intervention. We distinguish assistant statements, visible confirmation screens, and unresolved outcomes. Bank settlement was not independently verified.

Raw videos and transcripts contain traveler and booking details. This preview summarizes the relevant evidence without copying those identifiers or payment details into the report. Publication remains pending editorial review. The Instinct transaction-volume figures are attributed to its founder; comparable usage figures for the other assistants have not been established.
