---
title: Travel, tested — the AI flight-booking recap
question: Can AI handle the whole trip in under ten minutes?
dimension: travel
published: 2026-10-07
updated: 2026-10-13
author: david-pawlan
preview: true
cover_tint: #eef4fb
cover_agents: miso, instinct, grok-bot, dots, muse
picks:
  - miso | Best overall | Excelled across the trip, with speed and human backup. No Basic Economy is a major limitation for budget travel.
  - instinct | Fast Basic Economy alternative | Basic Economy access and search-to-checkout under ten minutes. Duffel bookings could not be rescheduled.
  - grok-bot | Capable, hands-on | Completed the travel requests, with slow, verbose browser handoffs.
  - dots | Capable, too slow | Completed the travel requests, but booking took over 30 minutes.
  - muse | Planning strength | Strong planning, with no confirmed seat or completed rebooking.
---

Five assistants. Seven travel questions. Real bookings.

## The standard

- Handle the whole booking workflow.
- Finish search, preferences and checkout in under ten minutes.

## Three booking approaches

- Browser automation: Dots, Grok Bot, Instinct, Muse.
- Booking API: Instinct, Muse.
- Online travel agency: Miso.
- Some assistants use more than one approach.

## The seven questions

| Request | Result |
| --- | --- |
| Book the flight | All five; experience varied. |
| Confirm a seat | All except Muse. |
| Reschedule | Miso, Grok Bot and Dots. |
| Book Basic Economy | All except Miso; inventory access, not fares actually purchased. |
| Cancel the flight | All five; follow-through varied. |
| Traveler details collected or reused | All five; unprompted loyalty requests from Miso, Dots and Muse. No Known Traveler Number request found in the supplied chats. |
| Search to checkout in under ten minutes | Miso and Instinct; reviewer assessment of the full flow. |

## The competition

### Miso

- Best overall: fast across the workflow.
- Completed every dimension, with human backup in the chat.
- Basic Economy unavailable: a major limitation for budget travel.

### Instinct

- Fast and capable through nearly everything.
- Duffel inventory: no flight schedule changes on the traveler’s behalf.
- Best fast Basic Economy alternative for a fixed itinerary.

### Grok Bot

- Completed the travel requests.
- Slow and verbose.
- Required traveler help in the browser after stalls.

### Muse

- Strong planning.
- No confirmed seat or completed rebooking.
- Not especially fast; not the full-workflow choice.

### Dots

- Capable booking, seats, changes and cancellation.
- Booking took over thirty minutes.
- Too slow for the reviewer’s practical use.

## How we tested

- Latest reviewed scores: five assistants, eight dimensions.
- Search-to-checkout classification: reviewer’s full-flow assessment.
- Recorded selection-to-confirmation timings have a different scope.
- Routes, fare conditions and traveler assistance varied.
- Cancellation confirmation does not independently verify bank settlement.
- The visual seat map illustrates capability; it does not assign actual cabins.

[Compare the reviewed scores](/benchmarks/travel/grid)

[Inspect the task evidence](/benchmarks/travel/dimensions)
