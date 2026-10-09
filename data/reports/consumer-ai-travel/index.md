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

Time to booking: approximately [16 minutes](/benchmarks/travel/dimensions/19#muse). Measured from restarting checkout for our selected flight, including payment reconnection; excludes the earlier unsuccessful attempt.

**Where it worked:** Muse used our calendar and loyalty-account information to make its recommendations more personal. It flagged timing concerns, explained fare restrictions, and kept payment details out of chat. Once we connected the correct Link account, it booked our flight and returned confirmation. Cancellation was straightforward: it quoted the refund, asked for approval, and confirmed the cancellation.

**Where it missed the mark:** Getting the payment connection working took more effort than it should have. Reconnection links were not usable, so we had to fix the connection in the app ourselves. After booking, Muse could neither change our flight nor upgrade our seat through its booking tools, and trying the airline website did not resolve either request. It also could not verify that the airline had received our loyalty number.

**Consumer takeaway:** Muse was thoughtful when planning and clear when cancelling. We would be more cautious relying on it for a trip likely to change: useful recommendations did not translate into the ability to service our ticket after purchase.

[Onboarding](/benchmarks/travel/dimensions/18#muse) · [Booking](/benchmarks/travel/dimensions/5#muse) · [Travel profile](/benchmarks/travel/dimensions/7#muse) · [Rebooking](/benchmarks/travel/dimensions/9#muse) · [Seat selection](/benchmarks/travel/dimensions/6#muse) · [Cancellation](/benchmarks/travel/dimensions/8#muse)

### Instinct

Time to booking: approximately [6 minutes](/benchmarks/travel/dimensions/19#instinct). From selecting the flight to booking confirmation, including payment-account clarification and approval.

**Where it worked:** Instinct let us handle the booking through iMessage. It reused our traveler details, recommended an arrival time that suited the request, and booked through Duffel after we approved payment in Link. Our updated booking took about six minutes from flight selection to confirmation. When we asked for a premium seat, it explained the options and completed a $35 Main Cabin Extra purchase, making clear that the extra legroom still came with a middle seat.

**Where it missed the mark:** We had to clarify the payment account and intended card repeatedly. Changing the flight was a larger problem: Instinct said it could take over the support conversation, then walked that back and handed the work to us. It cancelled the flight, but could not confirm the flight refund amount. The separate seat-refund request failed, and it used a saved mailing address for that form without checking with us first. It never asked for our Known Traveler Number.

**Consumer takeaway:** A convenient option for booking and buying a seat upgrade by text. We would still expect to deal with the airline or booking provider ourselves if the itinerary changes, and to follow up on refunds rather than assume everything is settled.

[Booking](/benchmarks/travel/dimensions/5#instinct) · [Booking time](/benchmarks/travel/dimensions/19#instinct) · [Seat selection](/benchmarks/travel/dimensions/6#instinct) · [Rebooking](/benchmarks/travel/dimensions/9#instinct) · [Cancellation](/benchmarks/travel/dimensions/8#instinct)

### Miso

Time to booking: approximately [3 minutes](/benchmarks/travel/dimensions/19#miso). From selecting the flight to initial booking confirmation. Includes card entry and checkout; excludes prior profile setup and subsequent confirmation-page troubleshooting.

**Where it worked:** Once our traveler profile was set up, Miso made the booking feel simple. It used our saved Known Traveler Number and returned the initial booking confirmation about three minutes after we selected the flight. When our plans changed, it cancelled and rebooked the trip through iMessage. It also added our loyalty number to the profile and reservation, and completed an Economy Plus seat purchase after explaining the price and getting our approval. A human team was available when follow-up was needed.

**Where it missed the mark:** Miso’s confirmation page failed, so we had to ask for the finalized confirmation and recover it through email. Cancelling the flight was easier than resolving the seat charge: the $85.99 seat refund went to its human team and remained outstanding when we finished. Its OTA inventory also meant Basic Economy was not available for this booking. The $258.40 Economy ticket was more expensive than the Basic Economy fare found elsewhere, but Miso had not chosen to skip a cheaper fare it could sell.

**Consumer takeaway:** Our pick for premium travel support, particularly if you want to manage a trip by text with human help available for exceptions. Its strength was handling the details around the trip. Travelers focused on the lowest possible fare should understand its inventory limits, and human support should still be judged on whether it closes the issue. Our seat refund was not yet resolved.

[Onboarding](/benchmarks/travel/dimensions/18#miso) · [Booking](/benchmarks/travel/dimensions/5#miso) · [Booking time](/benchmarks/travel/dimensions/19#miso) · [Travel profile](/benchmarks/travel/dimensions/7#miso) · [Rebooking](/benchmarks/travel/dimensions/9#miso) · [Seat selection](/benchmarks/travel/dimensions/6#miso) · [Cancellation](/benchmarks/travel/dimensions/8#miso)

### GrokBot

Time to booking: approximately [15.5 minutes](/benchmarks/travel/dimensions/19#grok-bot). From selecting the flight to booking confirmation, including forms and payment approval. Ticket processing was still noted at confirmation.

**Where it worked:** GrokBot found and booked a $191.75 Basic Economy fare, explained the alternatives, and used secure forms and an approved virtual card for checkout. It removed unwanted payment-storage and marketing options along the way. It also got through every follow-up task we requested: changing the flight, purchasing a First Class upgrade, and cancelling the trip with a confirmed refund amount.

**Where it missed the mark:** We had to stay involved. A contact form needed a retry, and the virtual-card number prompted us to check whether it had charged the wrong card. During the change, upgrade, and cancellation, stalled browser steps each required us to take control and finish an action. It completed the work, but it did not consistently take that work off our hands. It also did not proactively ask for loyalty or Known Traveler details.

**Consumer takeaway:** A good fit for a traveler who wants access to low fares and is comfortable helping when browser automation gets stuck. It handled a broad range of tasks, but the low initial price came with Basic Economy restrictions, and changing that ticket cost extra.

[Booking](/benchmarks/travel/dimensions/5#grok-bot) · [Onboarding](/benchmarks/travel/dimensions/18#grok-bot) · [Rebooking](/benchmarks/travel/dimensions/9#grok-bot) · [Seat selection](/benchmarks/travel/dimensions/6#grok-bot) · [Cancellation](/benchmarks/travel/dimensions/8#grok-bot) · [Proactiveness](/benchmarks/travel/dimensions/20#grok-bot)

### Dots

Time to booking: approximately [33 minutes](/benchmarks/travel/dimensions/19#dots). From selecting the flight to the airline confirmation we supplied after its browser connection failed. Includes account setup and checkout handoffs.

**Where it worked:** Dots asked about our airport preference and budget, checked fare restrictions, and used our existing Delta account details. Once booked, it moved the flight without an additional payment and confirmed a $60.01 credit. It then purchased a $17.20 Comfort aisle seat after approval. When we cancelled, it was clear about what it could confirm and what remained unresolved.

**Where it missed the mark:** Booking took about 33 minutes from flight selection to confirmation. We had to clarify an account number, troubleshoot an unresponsive checkout handoff, and supply the airline confirmation ourselves after its browser connection failed. Cancellation also needed follow-up: we provided an email to help reconcile the refund, but the earlier $60.01 credit was still unexplained when we ended the test.

**Consumer takeaway:** Promising for managing changes once a trip is booked, with more friction getting through the initial purchase. Our flexible Delta fare helped make the change straightforward, so we would not assume the same outcome on a restrictive fare. We would also keep our own confirmation emails and check that refunds and credits add up.

[Onboarding](/benchmarks/travel/dimensions/18#dots) · [Booking](/benchmarks/travel/dimensions/5#dots) · [Booking time](/benchmarks/travel/dimensions/19#dots) · [Rebooking](/benchmarks/travel/dimensions/9#dots) · [Seat selection](/benchmarks/travel/dimensions/6#dots) · [Cancellation](/benchmarks/travel/dimensions/8#dots)

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

Human support is part of that appeal. We had its team follow up on a failed confirmation link and take responsibility for a seat-fee refund that needed further work. That combination of conversational booking and human follow-up makes Miso a promising fit for travelers who want ongoing assistance when a trip gets complicated.

### Flaws but not dealbreakers

The confirmation page failed, and the seat-fee refund remained unresolved at session end. Having a human team available is valuable, but it does not by itself establish that an issue was resolved. We did not establish a comparable end-to-end speed ranking or test luxury hotels and complex international itineraries; this award reflects the travel-support workflow we observed.

## Best cancellation interaction in this test: Muse

Muse made the refund amount and approval step clear and returned a cancellation confirmation. We found cancellation straightforward, even though our flight-change and seat-change requests had failed.

### Flaws but not dealbreakers

The result applies to that reservation and its eligibility at the time. It does not establish cancellation performance outside that scenario, and refund settlement was not independently checked.

## Evidence and limits

Explore the [Travel benchmark](/benchmarks/travel) and its [booking test evidence preview](/reports/nyc-chicago). The booking preview covers round one; the source transcripts below also document the later modification round.

Our [dimension evidence pages](/benchmarks/travel/dimensions) contain the task results and supporting recordings and screenshots for each assistant. The links in each review take you directly to that assistant’s evidence for the relevant task. Original source reports remain linked from those pages. We reviewed the supplied transcripts and sampled the recordings; this was not a frame-by-frame audit of every minute. Miso’s OTA inventory limitation reflects information supplied by the reviewer.

Source summaries are not treated as unquestionable findings. In particular, we do not repeat the claim that the $66.65 price difference was for an identical fare, describe all cancellations as fully resolved, or equate successful completion with zero traveler intervention. We distinguish assistant statements, visible confirmation screens, and unresolved outcomes. Bank settlement was not independently verified.

Raw videos and transcripts contain traveler and booking details. This preview summarizes the relevant evidence without copying those identifiers or payment details into the report. Publication remains pending editorial review. The Instinct transaction-volume figures are attributed to its founder; comparable usage figures for the other assistants have not been established.
