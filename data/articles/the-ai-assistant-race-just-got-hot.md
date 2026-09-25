---
title: The AI assistant race just got hot. Here's where it stands.
dek: Meta shipped Muse, Instinct raised again, and OpenAI is hinting. After 250 tests across 26 assistants, an overview of where things sit and what to watch next.
date: 2026-09-25
author: David Pawlan
kind: Analysis
report:
update:
agents: muse, instinct, grok-bot
hero_caption: Muse, Instinct and Grok Bot on the same tasks. Illustration by Assistant Benchmark.
takeaways: Muse leads the benchmark at 9.3 with a 7-second median reply, and it makes sense given Meta's data, money and distribution | Instinct is second among general assistants and the one people love, but a slow week showed how little brand loyalty this market has | Security, bot detection and new competitors are the three things to watch next
---

Just over two weeks ago I created [Assistant Benchmark](/) as a way to compare the performance of AI assistants in the market. It is a site meant to test the use-case performance of these assistants: how does one perform when you want to book a flight, make a reservation, order your groceries, and so on. Since launch it has had over 100,000 visitors. The reaction has been absolutely insane, which I think really encapsulates the vibe of this entire industry: nobody really knows what is going on. It is a new paradigm. Nobody knows what shape it is going to take over the next few months. Nobody knows which one is the best today, nor which one is going to be the best tomorrow. Will a new one pop up tomorrow? Is OpenAI or Anthropic going to release one? I think users out here are having a lot of fun getting their feet wet with the technology, and are also deeply curious about where we are moving, and that is where Assistant Benchmark has really come in to shine.

In the past few weeks alone, Meta has shipped [Muse](/agents/muse), [Instinct](/agents/instinct) has raised another $250 million, bringing its total to $350 million, and OpenAI has hinted it will release its own, let alone the launch and race among more than 120 others, at least the ones I am aware of. This race did not start in a vacuum. It began in September 2025, when [Poke](/agents/poke) released the first iMessage-based assistant. Two months later Peter Steinberger released [Openclaw](/agents/openclaw), and that started the chain reaction of envisioning this new world of personal assistants. While Assistant Benchmark started as a project that let me track my own market research comparing these assistants, it has turned into a project for the people. It helps the general public understand who is out there, what they are doing, and what they are good at.

## Where the race sits today

To date I have personally run over 250 tests across 26 different personal assistants. Throughout all of this research, [Muse](/agents/muse) currently sits in the lead in terms of general performance across the board.

If you think about it, this makes sense. They have incredible amounts of data on each of us, given they own Facebook and Instagram. They have a ridiculous piggy bank to invest in speed, to leverage a custom model, and of course to hammer distribution through growth marketing. When you put that together it obviously works: Muse has not only been the [number one app in the App Store](https://www.foxbusiness.com/technology/metas-muse-becomes-app-stores-hottest-download), it also [outpaced ChatGPT's own launch](https://techcrunch.com/2026/09/21/metas-muse-is-outpacing-chatgpts-early-mobile-launch/) in downloads over its first twelve days.

So let's dive into the actual benchmark. At a high level, it sits [first overall at 9.3](/agents/muse). When I gave it a task to buy flowers, it asked what kind and what budget, flagged the same-day cutoff, found the one florist that could deliver, and staged an [itemized order behind a virtual card](/dimensions/purchasing). When I asked it to reply to a scheduling email, it found the thread, checked my calendar, drafted a reply with two open slots in my voice, and once I gave it permission, [fired it off](/dimensions/email_replies). 10 out of 10 on both. It has been running weekday routines without a hiccup, and it is unbelievably fast: a median reply of 7 seconds. While that might sound like a lot, it is quick considering the tasks that take longer on average, like searching for products for you to purchase.

The main gap is security. There is a lot of fear about whether your data is actually secure, given Zuckerberg's poor track record on user privacy. When it comes to purchasing, it leads the pack on direct vendor integrations, which means a higher success rate wherever a partnership exists. But that publicity also brings unwanted attention, such as [Amazon shutting off Muse's access](https://www.bloomberg.com/news/articles/2026-09-21/amazon-blocks-meta-s-muse-ai-agent-from-its-retail-site) to its store. Most recently the Meta team announced [Muse Charm](https://techcrunch.com/2026/09/23/meta-made-a-tamagotchi-like-wearable-for-its-muse-ai-agent/), a hardware device with a camera and microphone that lets you talk to your Muse agent anywhere you go.

## Instinct hit the network effect, sits at #2

[Instinct](/agents/instinct) went absolutely viral on Twitter and sits [second among general assistants](/?kind=general). Personally, I use Instinct more than Muse because I prefer iMessage as the surface, given that is where I already live. Others prefer a separate application, which lends more credit to Muse, but that is a personal preference.

In the beginning, Instinct caught my attention when it [checked into my flight](/agents/instinct/evidence/instinct-2026-08-29-58edb0) without being asked. That was a real magic moment. Now, on a day-to-day basis, it handles my life admin. It tells me who I am meeting before calls and gives me context on that person. Its [routines have been flawless](/agents/instinct/evidence/instinct-2026-09-11-bdc825). It is great at finding and booking reservations. It can order things for me via browser use, and it has a feature called [Trusted Network](https://x.com/noahrshinn/status/2097794967574028448), which is quite unique and an interesting take on the multiplayer agent world. With Trusted Network, users connect their Instincts to one another, so my Instinct can chat with yours, organize things behind the scenes, and then let us both know whatever is relevant.

It has also been a source of fun stories and joyful use cases. A friend of mine [went viral](https://x.com/oliviaalevine/status/2095705075633000815) because she got on the jumbotron at the US Open with her boyfriend and wanted the footage. She asked Instinct, mostly as a joke, to find it. Within 12 minutes it had filed a case with the USTA and emailed the ticket office, the production company, and the US Open's media contact. Overnight it went through ESPN's entire highlight package frame by frame, and when she woke up in the morning the clip was in her inbox.

While that is a one-off, it exemplifies what these assistants are capable of. They accomplish things we otherwise would not put effort towards. They serve as an extension of your workflow, and most importantly they free up your time so you can spend it on the things you actually love.

Instinct, however, also had a bad week:

- There was a hallucination scare where a user [appeared to be shown](https://x.com/prit4k/status/2102166742021890076) another person's financial information. Noah Shinn, Instinct's founder, [clarified on September 23](https://malaysia.news.yahoo.com/instincts-founder-says-viral-ai-063054528.html) that it was a hallucination.
- There have been [many reports of Instinct being incredibly slow](https://sg.news.yahoo.com/instinct-users-theyve-noticed-slowdown-163111405.html), which has led people on Twitter to move over to Muse.

This raises a larger question: what is the actual brand loyalty in this ecosystem? Are we going to see the Codex and Claude Code trend, where people swap to whichever model is best with very little loyalty? I think yes.

## What people actually do with them

So what do people actually use these assistants for? Beyond Assistant Benchmark, I also run six group chats for people who use these assistants every single day, a combined 1,200-plus people talking daily about what they actually do with them.

Since launch I have been monitoring the threads where people are not only sharing opinions, takes, tips and tricks, but describing the specific things they have done. Here is the breakdown at a high level, counted as instances where someone described a particular thing they did:

- Coordinating several agents at once: 54
- Life admin: 43
- Memory and shared context between tools: 40
- Money (investing and trading): 36
- Coding and developer workflows: 36
- Buying, booking and other real transactions: 29

What is really interesting is that the things that go viral on X, an assistant watching your flight prices or booking your trip, sit at the bottom of that list. The top of it is people wiring agents together and getting their own context to follow them around.

Keep in mind this is a skewed list. These are tech Twitter people inside the bubble who tend to be more technical. It is not a representative look at what the general individual would use these assistants for. Nonetheless, it is interesting data on how people have been using them so far.

## Grok Bot is a different product

[Grok Bot](/agents/grok-bot) sits at 7.3 and the number undersells what it is good at, because the benchmark is built around personal tasks and Grok Bot is a worker. I use it for work: scraping socials to learn a writing voice when the API refused, fixing and merging a failing pull request, building a bidding site from a blank repo, drafting a week of posts. Those were real holy-moment tasks and most of them scored 8.

It falls down where the others fall down, only more so. It runs on a cloud computer with no card of its own and no accounts, so every purchase ends at a login wall, and its X integration spent a week reconnecting itself before it gave up and said so. If you want things found and built, Grok Bot. If you want things bought and booked, use Muse or Instinct.

## The three things to watch in the coming weeks

At a high level, analyzing the space as a whole after just the first few weeks, I believe there are three things to keep an eye on in the weeks to come, things I will personally be observing and reporting on: security, bot detection, and new competitors.

### Security

Security is one of the biggest ones, and while it is incredibly important and not something to overlook, I believe it will be solved, and I am quite confident in that. Just as the internet came before cybersecurity, the adoption of assistants is going to come before the focus on securing them.

Muse had a [security flaw in its Mac app](https://www.theregister.com/ai-and-ml/2026/09/21/meta-muse-ai-app-flaw-lets-local-malware-redirect-dictation-traffic/5297980): an undocumented setting let any program already running on your machine redirect Muse's dictation traffic to a server it controlled, capture your login token, and slip hidden instructions into your voice prompts. It was a local attack rather than a remote one, meaning malware had to be on the Mac first, but it was a real prompt-injection path. Meta [patched it in about sixteen hours](https://x.com/dps/status/2102248329111634067) and used the moment to talk about its emphasis on security, which is something they are actively thinking about.

Instinct had the hallucination case, which got people wondering what is actually going on under the hood and how strong its privacy policy is. Many of the long-tail competitors are not large companies, and they are gathering a lot of data on you. People are continuously asking what happens to that data and whether it is secure.

I think as time goes on we will not only see companies appear that fight the good fight in protecting our data, but the competitors already out there will put a greater public emphasis on security.

### Bot detection

Browser use is a band-aid. It works most of the time, and then it hits a captcha, a login wall, or a site that has decided agents are not welcome and blocks the request outright.

It makes sense that these companies launch with browser use, because it is a quick win, but I do not believe it is a sustainable solution. Companies are going to either follow Amazon's path and [block these assistants](https://www.bloomberg.com/news/articles/2026-09-21/amazon-blocks-meta-s-muse-ai-agent-from-its-retail-site) from their stores, or follow Shopify's path and [build a direct integration](https://www.pymnts.com/commerce/ecommerce/2026/shopify-brings-shop-pay-checkout-solution-to-metas-muse-ai-agent/), which takes time.

All that said, I do not believe browser use is here to stay for the long run. It is a temporary solution that proves feasibility, and we are going to see heavy innovation focused on this specific corner of the AI assistant world.

### New competitors

And last but not least, who is popping up next? There is word around town that OpenAI is going to drop its own assistant and take the world by storm. I personally know of over 120 assistants out there already, and I am sure there are more I do not know about. Given how early we are, more are going to keep appearing.

The question becomes: are we going to see more horizontal generalists, or more specialists, following [Anish Acharya of a16z's theory of narrow startups](https://a16z.com/narrow-startups/)? I am a believer that, as time goes on, we will see more specialist assistants pop up that serve as plugins into the generalists. I think we will see a lot more innovation in the infrastructure layer of these assistants, and it is going to be a lot of fun to see who the new competitors are and how they take on the incumbents.

Every score you see has been personally run by me or a team member working on Assistant Benchmark. All of the tests are run authentically. This is meant to be a place of integrity. Nothing on the site is sponsored. No company is able to pay us to improve their rank, or to improve or increase the frequency with which we test their product. We try to stay as objective as possible.
