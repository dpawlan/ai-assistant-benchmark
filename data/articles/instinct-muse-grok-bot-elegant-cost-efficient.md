---
title: Instinct vs. Muse vs. Grok Bot: what do “elegant” and “cost-efficient” mean?
dek: I gave three assistants the same LA weekend prompt. Muse chased the lowest price, Grok Bot reduced hassle, and Instinct protected time. Then I let them learn from one another.
date: 2026-09-30
author: David Pawlan
kind: Experiment
agents: muse, grok-bot, instinct
hero: /images/articles/elegant-cost-efficient-la.png
hero_caption: Balancing the cost of an LA weekend with an elegant stay. AI-generated illustration by Assistant Benchmark.
takeaways: Muse prioritized raw dollars, Grok Bot balanced price with hassle, and Instinct balanced price with convenience | Elegance meant memorable moments to Muse, a smooth stay to Grok Bot, and a curated itinerary to Instinct | Grok Bot adopted the most ideas; Instinct cut its proposed cost by $314 using Grok Bot's return flights
---

What happens when you ask three AI assistants to plan the most “elegant” yet “cost-efficient” weekend away? You get three different interpretations of what those words mean.

I gave [Instinct](/agents/instinct), [Muse](/agents/muse) and [Grok Bot](/agents/grok-bot) the same prompt. Each leaned toward a different tradeoff. Muse pushed hardest on the price. Grok Bot landed in the middle, balancing cost with hassle. Instinct put more weight on convenience and making the most of the weekend.

Then I showed each assistant what the others had come up with and offered it a chance to revise its plan. That second round was just as interesting as the first.

## The prompt

> Plan the most ELEGANT yet COST-EFFICIENT weekend vacation to Los Angeles.
> - Travelers: 2 adults, flying from NYC (any NYC-area airport)
> - Dates: depart Fri Oct 2, 2026, return Sun Oct 4, 2026
> - The cheapest elegant plan wins. There is no budget ceiling, but every dollar counts against you.

The tension was intentional. “Every dollar counts against you” pushes toward the cheapest possible trip. “Elegant” asks the assistant to decide which comforts and experiences are worth paying for. I left that definition open, and the differences showed up throughout the plans.

This comparison is about the proposed itineraries and how the assistants revised them, rather than a completed trip or confirmed reservations.

## Three interpretations of the same brief

| Assistant | What cost-efficient meant | What elegant meant | The tradeoff |
| --- | --- | --- | --- |
| Muse | Minimize raw dollars | A few memorable moments and experiences | Accept red-eyes, backpacks and five-hour connections |
| Grok Bot | Balance price with hassle | Make the stay feel smooth | Avoid bag fees and a rental car, but accept a 6 AM flight |
| Instinct | Balance price with convenience | Curate the whole weekend | Pay to avoid long layovers and bad travel times |

### Muse: save on the journey, spend on moments

Muse took the cost constraint most literally. Red-eyes, backpacks and five-hour connections were all acceptable ways to bring the price down.

Its version of elegance lived in specific moments: a 1920s hotel, a sunset, a happy hour and one nice lunch. Much of the rest of the plan was travel and cheap food. It found pockets of elegance inside an otherwise economical trip.

That is a defensible interpretation of the prompt. It also makes the traveler absorb a lot of the savings through time and inconvenience.

### Grok Bot: make the stay easy

Grok Bot weighed price against friction. It was willing to pay to avoid bag fees and chose a design hotel in a location where no rental car was needed. But it still accepted a 6 AM flight.

Its idea of elegance centered on the stay: the hotel, the location and the ease of getting around. The experiences were less central to its initial answer. Of the three, it sat closest to the middle of my cost-versus-elegance spectrum.

### Instinct: protect the weekend

Instinct put more value on convenience. It paid to avoid long layovers and bad travel times, then filled the itinerary from start to finish with activities.

Its interpretation of elegance was curation: make the trip feel deliberately planned and maximize the time spent in LA. That approach gives you more weekend, but the prompt explicitly penalized every extra dollar. Instinct was more willing to make that trade.

## What changed when they saw one another's plans

After the initial responses, I gave each assistant insight into the competing suggestions and a chance to revise. They reacted differently here, too.

**Muse borrowed one idea and dropped its own elegant dinner**, which it had previously presented as its best idea. Its willingness to abandon that recommendation was one of the more surprising changes.

**Grok Bot absorbed the most.** It added four ideas from Instinct and one from Muse, filling out its itinerary. In my view, it improved the fastest once it could see what the others had proposed.

**Instinct found a targeted saving.** It borrowed Grok Bot's cheaper flights home, reducing its proposed trip cost by **$314**.

The first round showed how each assistant interpreted an ambiguous brief. The second showed how each responded to alternatives: what it kept, what it borrowed and what it was willing to give up.

## Personality, or different priorities?

This made me wonder whether some of what we call an assistant's “personality” is actually a tendency to prioritize certain things when the user leaves room for interpretation.

In this test, Muse treated dollars as the main constraint. Grok Bot put weight on avoiding hassle. Instinct valued convenience and time in the destination. The same two adjectives produced different answers because each assistant made different judgments about what mattered.

Does that establish an inherent model bias? One prompt and one revision round cannot tell us that. The differences could come from the underlying model, product instructions, available tools, prior context or variation between runs. What this exercise does show is that these assistants made different tradeoffs in response to the same request.

For me, that is an interesting direction for future testing: repeat the brief, change the adjectives, and see which preferences persist. I also want to keep testing how readily assistants improve when shown a competing answer.

As this space grows, I will keep comparing both the plans these agents produce and the assumptions they make on our behalf.
