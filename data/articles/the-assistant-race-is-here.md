---
title: The assistant race is here. Here's who actually finishes the task.
dek: Meta, Apple and a $2.5 billion startup all shipped this month, and the coverage is about who is entering. I have been texting all of them the same tasks since March. The list of who delivers looks different.
date: 2026-09-25
author: David Pawlan
kind: Analysis
report:
update:
agents: muse, instinct, grok-bot
hero_caption: Muse, Instinct and Grok Bot on the same tasks. Illustration by Assistant Benchmark.
takeaways: Muse tops the benchmark at 9.3 and replies in 7 seconds; Instinct is at 8.5 and 20 seconds, and that gap is why people are switching | The dividing line is not intelligence, it is what the assistant is allowed to touch: your card, your logins, your calendar | Security is the next phase, and both leaders had an incident this week
---

Two weeks ago I put up a site that texts the same tasks to every AI assistant I can get a number for and writes down what happens. It has had over 100,000 visitors since. I do not think that is because the site is good. I think it is because nobody, including the people building these things, knows what is going on.

This month made that obvious. Meta shipped Muse on September 8 and has pushed an update nearly every week since. Apple turned on Siri AI on the 14th. Instinct, which you reach by text and which raised $250 million at a $2.5 billion valuation in August, is reportedly in talks at four times that. OpenAI hired the person behind OpenClaw to build its own. Axios called it [the AI assistant race](https://www.axios.com/2026/09/20/ai-assistant-openai-meta-muse-instinct-grok-apple). Bloomberg says Muse is [off to a fast start](https://www.bloomberg.com/news/newsletters/2026-09-23/meta-muse-ai-personal-assistant-gets-off-to-fast-start).

All of that coverage is about who is entering. None of it has run anything. I have, so here is what the same tasks say about the three that matter most right now.

## Muse is the one that finishes

I did not expect to write that. Muse is the newest of the three and it comes from a company with a mixed record on trust. But on the benchmark it sits [first overall at 9.3](/agents/muse), and it is not close on the things people actually text an assistant for.

Given the reorder task, it asked what kind of flowers and what budget, flagged the same-day cutoff, found the one florist that could deliver, and staged an itemized order behind a virtual card so the shop never saw mine. Given a scheduling email, it found the thread, checked my calendar, drafted a reply-all with two open slots in my voice, asked, and sent when I said go. Ten out of ten on both. It linked OpenTable in the middle of a restaurant task to finish the booking rather than sending me a link. It has been running my weekday routines since the 17th without a miss.

And it is fast. Muse's median reply in my thread is 7 seconds. Instinct's is 20. That does not sound like much until you are standing in a shop waiting for one of them to answer.

Its weak spot is travel, where it books through a single aggregator and the supply is thin; it found nothing under budget near the Loop and asked me to loosen the brief. It also, as far as I can tell, cannot do Amazon anymore, and it is building direct merchant integrations instead. Which brings me to the actual story.

## The line is access, not intelligence

Every assistant I have tested can find the coffee. Most can put two bags in a basket. The split happens at the last screen, where a card or a login has to come from somewhere, and that is where the whole category is stuck.

Browser use is a band-aid. It works most of the time and then it hits a captcha, a login wall, or a site that has decided agents are not welcome, and the task dies. The assistants that finish are the ones that have solved the access problem some other way: Muse with its own card and direct merchant integrations, Instinct by working inside your own airline and hotel accounts, which is how it got a [10 on travel](/agents/instinct) and booked a trip end to end, check-in and boarding pass included.

The best test of this is a small one. I book a flight to Chicago for a weekend, run a few unrelated tasks, then ask for a dinner reservation in New York that same weekend. Of the eight assistants that have faced it, three caught the conflict and asked which city I would actually be in. Five booked New York. That is memory, and it is the difference between an assistant and a search box with a card attached.

## Instinct is the one people love, and the one people are leaving

I use Instinct more than anything else, because it lives in iMessage and that is where I live. The first time it checked me in for a flight without being asked, and sent the boarding pass with the seat and PreCheck already on it, was the moment this category became real for me. It handles my life admin. It asks who I am meeting before a call and gives me context. Its routines have been [flawless](/agents/instinct) and its memory is the best in the group after Muse.

It is also the one that produces the stories. A friend of mine got on the jumbotron at the US Open with her boyfriend and wanted the footage. She [asked Instinct](https://x.com/oliviaalevine/status/2095705075633000815) mostly as a joke. Within twelve minutes it had filed a case with the USTA and emailed the ticket office, the production company and the US Open's media contact; overnight it went through ESPN's highlight package frame by frame. The clip was in her inbox eighteen hours later. A person at the production company made the final call, but nobody would have asked without the assistant doing the asking. That is what these are for.

It also had a bad week. Users have been getting capacity warnings for a while; on the 24th [the slowdowns became a story](https://sg.news.yahoo.com/instinct-users-theyve-noticed-slowdown-163111405.html) and the founder acknowledged them. I run group chats with over a thousand people who use these things every day, and what struck me was not the complaints. It was that there was no deliberation. "It's so slow, I switched to Muse today." Not a debate, a reflex.

That is the thing the launch coverage cannot see. Context used to be the moat. Now it is an email and calendar connection, and it takes four minutes to rebuild somewhere else. When Instinct and Muse are both effectively free, a slow day is a churn event. I struggle to see how a paid tier survives in this market, and I struggle to see how the free ones pay for the inference either. That is not a prediction about Instinct. It is a question every company on my roster has to answer.

## What people actually do with them

I run six group chats for people who use these assistants every day, a bit over a thousand people in total. Since launch I have been counting the threads where someone described a specific thing they had done with one, not opinions, not takes, an actual instance. This is tech Twitter, so it is nothing like the general public, but it is the closest thing to usage data anyone outside the companies has.

- Coordinating several agents at once: 54
- Life admin: 43
- Memory and shared context between tools: 40
- Money, meaning investing and trading: 36
- Coding and developer workflows: 36
- Buying, booking and other real transactions: 29

The thing that goes viral on X, an assistant watching your flight prices or booking your trip, is the bottom of that list. The top of it is people wiring agents together and getting their own context to follow them around. The early adopters are not using these to be ten percent more efficient at errands. They are building a personal operating system, and they will move it to whichever assistant runs it fastest.

## Grok Bot is a different product

Grok Bot sits at [7.3](/agents/grok-bot) and the number undersells what it is good at, because the benchmark is built around personal tasks and Grok Bot is a worker. I use it for work: scraping socials to learn a writing voice when the API refused, fixing and merging a failing pull request, building a bidding site from a blank repo, drafting a week of posts. Those were real holy-moment tasks and most of them scored 8.

It falls down where the others fall down, only more so. It runs on a cloud computer with no card of its own and no accounts, so every purchase ends at a login wall, and its X integration spent a week reconnecting itself before it gave up and said so. If you want things found and built, Grok Bot. If you want things bought and booked, not yet.

## Security is the next phase, and it started this week

Ask a non-technical friend about any of this and the first question is whether it is safe. It is the right question, and this week gave both leaders an answer they did not want.

On September 21 [a user posted screenshots](https://x.com/prit4k/status/2102166742021890076) of Instinct describing a financial document that was not his. Two days later the founder [said it was a hallucination](https://malaysia.news.yahoo.com/instincts-founder-says-viral-ai-063054528.html), not a leak, and shipped a system to intercept the agent before it acts on an invented fact. The same day, a researcher disclosed [a Muse Mac flaw](https://www.theregister.com/ai-and-ml/2026/09/21/meta-muse-ai-app-flaw-lets-local-malware-redirect-dictation-traffic/5297980) that let local malware redirect dictation and grab a token. Meta patched it in about sixteen hours and [called it a local attack, not a remote one](https://x.com/dps/status/2102248329111634067), which is true and also not the point.

The pattern is the internet's: first adoption, then security. I would say we are still in the adoption phase, and I would say the card is the part I worry about least. If an assistant buys the wrong thing, I charge it back and cancel the card. The part nobody has thought through is the work inbox. Connect one of these to a company email, have it surface a document that is not yours, and the question is not whether it hallucinated. It is who is liable.

## What I would watch

The next month decides more than the last one did. Muse has a head start on commerce and that is plainly Meta's plan: sit on the transaction. Instinct has the interface people want and a capacity problem it has to fix in public. OpenAI has not shipped, and I am not going to guess about a product that does not exist.

What I can do is keep running the tasks. The benchmark is a scoreboard, and starting this week it also has reports: one question, everyone ranked, a pick, and a dated log of every change. [The first one is shopping](/reports/shopping). Muse is the pick. Check back when it isn't.

Data note: every score above is the newest run per assistant on the published test. Muse's runs are from launch week; I am re-running purchasing and email on the current build and will update the numbers here if they move. Nothing on the site is sponsored.
