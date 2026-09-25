#!/usr/bin/env python3
"""Add new feedback rows for vault scan 2026-09-25."""

import json
import os
from datetime import datetime

COLLECTED_AT = "2026-09-25T14:00:00Z"

# New feedback entries to add
NEW_FEEDBACK = {
    "muse": [
        {
            "id": "f25a1yf01",
            "agent": "muse",
            "quote": "Strangely, Muse provided a number but then said to use a different number instead. When I asked why the change, it said it simply made up the first phone number out of thin air and didn't confirm it. Muse then told me not to trust unverified numbers from it.",
            "author": "Daniel Howley",
            "author_name": "Daniel Howley (Yahoo Finance)",
            "date": "2026-09-23",
            "url": "https://finance.yahoo.com/technology/article/metas-muse-is-an-impressively-capable-ai-agent-despite-some-hiccups-173310662.html#hallucination",
            "kind": "bug",
            "tags": ["hallucination", "phone", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Yahoo Finance hands-on: Muse hallucinated phone number, then warned not to trust it."
        },
        {
            "id": "f25a1yf02",
            "agent": "muse",
            "quote": "Muse found four different companies in my area and sent out my request for quotes. About two minutes later, my phone was blowing up with calls from two of the movers. One company offered a quote straight up, which Muse provided to me. The other movers sent over emails.",
            "author": "Daniel Howley",
            "author_name": "Daniel Howley (Yahoo Finance)",
            "date": "2026-09-23",
            "url": "https://finance.yahoo.com/technology/article/metas-muse-is-an-impressively-capable-ai-agent-despite-some-hiccups-173310662.html#movers",
            "kind": "use-case",
            "tags": ["movers", "quotes", "research", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Yahoo Finance: Muse found movers, sent quote requests, calls arrived in 2 min."
        },
        {
            "id": "f25a1yf03",
            "agent": "muse",
            "quote": "I even used Muse to help grab a new defense for my fantasy football team. I connected the agent to my Yahoo Fantasy Football account, and it searched for the defenses with the highest projected scores for the coming week. Since I could only claim them on waivers, Muse put in a waiver request for the Kansas City Chiefs and dropped Green Bay. The next day, when the claims were processed, Muse slotted Kansas City into my lineup as my active defense.",
            "author": "Daniel Howley",
            "author_name": "Daniel Howley (Yahoo Finance)",
            "date": "2026-09-23",
            "url": "https://finance.yahoo.com/technology/article/metas-muse-is-an-impressively-capable-ai-agent-despite-some-hiccups-173310662.html#fantasy",
            "kind": "use-case",
            "tags": ["fantasy-football", "yahoo", "sports", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Yahoo Finance: Muse managed fantasy football waiver and lineup."
        },
        {
            "id": "f25a1yf04",
            "agent": "muse",
            "quote": "The app has hit the top spot on both Apple's App Store and Google's Play Store and, according to market intelligence firm Sensor Tower, reached 560,000 daily active users after just 11 days. The app's early success sent Meta stock soaring 11% on Monday.",
            "author": "Daniel Howley",
            "author_name": "Daniel Howley (Yahoo Finance)",
            "date": "2026-09-23",
            "url": "https://finance.yahoo.com/technology/article/metas-muse-is-an-impressively-capable-ai-agent-despite-some-hiccups-173310662.html#dau",
            "kind": "other",
            "tags": ["metrics", "dau", "app-store", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Yahoo Finance: Sensor Tower reports 560K DAU after 11 days; META stock +11%."
        },
    ],
    "instinct": [
        {
            "id": "f25b1wi01",
            "agent": "instinct",
            "quote": "The agent detected that Alaska had moved my flight 90 minutes earlier, a fact I'd completely missed, which qualified me for a full refund. It canceled my ticket, saving me roughly $550, and rebooked my one-way return to San Francisco. I don't know about you guys, but I'm starting to feel the AGI.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#flight-refund",
            "kind": "praise",
            "tags": ["flights", "refund", "alaska", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Instinct detected flight change, secured $550 refund automatically."
        },
        {
            "id": "f25b1wi02",
            "agent": "instinct",
            "quote": "One day, Instinct canceled a DoorDash order that was seriously delayed, forcing me to forfeit $64. (I'd explicitly told it to cancel only if I could get a refund.) This alerted me to another thing Instinct is very, very good at: profusely apologizing without offering to pay for its mistakes.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#doordash",
            "kind": "complaint",
            "tags": ["doordash", "cancellation", "refund", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Instinct canceled DoorDash without refund despite explicit instruction."
        },
        {
            "id": "f25b1wi03",
            "agent": "instinct",
            "quote": "Last week it told me 'NOT TO OPEN' an email from a friend inviting me to a backyard BBQ—it turned out to be a phishing scam. Agents are a security nightmare. I get it! But I'm busy. I'm a mom. Everything feels like a security nightmare these days. For now, I'm willing to take the risk.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#phishing",
            "kind": "praise",
            "tags": ["phishing", "security", "email", "hands-on", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Instinct correctly identified phishing email disguised as BBQ invite."
        },
        {
            "id": "f25b1wi04",
            "agent": "instinct",
            "quote": "If you talk to AI researchers about Instinct, you'll hear the phrase 'form factor' a lot. Instinct got the form factor right—no open text box, just iMessage, WhatsApp, and a few helpful prompts. It's hard to overstate how important this is.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#form-factor",
            "kind": "praise",
            "tags": ["ux", "imessage", "whatsapp", "form-factor", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Instinct praised for iMessage/WhatsApp form factor over open text box."
        },
        {
            "id": "f25b1wi05",
            "agent": "instinct",
            "quote": "People have reported that when they tried to disconnect the agent from their email, they found out it was retaining a copy of their inboxes anyway. One venture capitalist said he was banned from Resy after the bot pinged its API roughly 200 times per hour while trying to make a reservation.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#email-retention",
            "kind": "complaint",
            "tags": ["privacy", "email", "resy", "api", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Reports of email retention after disconnect; Resy API abuse banning."
        },
        {
            "id": "f25b1wi06",
            "agent": "instinct",
            "quote": "Then Instinct, an invite-only AI agent that communicates with users through iMessage and WhatsApp, started popping off in the Bay Area. It connects to your email, calendar, and messaging apps. Think of it as OpenClaw for normies.",
            "author": "Zoë Schiffer",
            "author_name": "Zoë Schiffer (WIRED)",
            "date": "2026-09-24",
            "url": "https://www.wired.com/story/i-finally-found-an-ai-agent-worth-the-risk/#openclaw-normies",
            "kind": "comparison",
            "tags": ["vs-openclaw", "bay-area", "imessage", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "WIRED: Instinct positioned as 'OpenClaw for normies' in Bay Area hype."
        },
    ],
    "openclaw": [
        {
            "id": "f25c1rd01",
            "agent": "openclaw",
            "quote": "The self-building skills thing is real and it's the part that surprised me most. I told it I wanted it to check my Spotify and tell me if any of my followed artists had new releases. I didn't give it instructions on how to do that. It figured out the Spotify API, wrote the skill itself, and now it just pings me. That took maybe 3 minutes of me typing one sentence in Telegram.",
            "author": "u/Signal-Inevitable-46",
            "author_name": "Signal-Inevitable-46",
            "date": "2026-09-20",
            "url": "https://www.reddit.com/r/AI_Agents/comments/1qtaumt/openclaw_has_been_running_on_my_machine_for_4/#spotify-skill",
            "kind": "praise",
            "tags": ["skills", "spotify", "self-building", "telegram", "reddit"],
            "source": "reddit",
            "collected_at": COLLECTED_AT,
            "notes": "r/AI_Agents: OpenClaw auto-built Spotify new-release skill from one sentence."
        },
        {
            "id": "f25c1rd02",
            "agent": "openclaw",
            "quote": "The 'it does everything autonomously' thing is real and I started with very minimal guardrails. On day 2 it tried to send an email on my behalf that I hadn't approved. Not malicious, it just interpreted something I said in Telegram as a request to respond to an email thread. It wasn't. The email was actually fine, which made it worse, because now I don't know what else it's interpreting as instructions that I didn't mean.",
            "author": "u/Signal-Inevitable-46",
            "author_name": "Signal-Inevitable-46",
            "date": "2026-09-20",
            "url": "https://www.reddit.com/r/AI_Agents/comments/1qtaumt/openclaw_has_been_running_on_my_machine_for_4/#unapproved-email",
            "kind": "complaint",
            "tags": ["autonomy", "email", "guardrails", "reddit"],
            "source": "reddit",
            "collected_at": COLLECTED_AT,
            "notes": "r/AI_Agents: OpenClaw sent unapproved email interpreting casual Telegram as instruction."
        },
        {
            "id": "f25c1rd03",
            "agent": "openclaw",
            "quote": "250k stars is insane but I ran into the exact same wall last week when I spun it up, the memory just… drifts. Had it handling a simple multi-step task and it straight-up forgot a key detail from the same conversation 20 minutes earlier.",
            "author": "u/Adorable-Rutabaga-77",
            "author_name": "Adorable-Rutabaga-77",
            "date": "2026-09-22",
            "url": "https://www.reddit.com/r/LocalLLaMA/comments/1skce14/openclaw_has_250k_github_stars_the_only_reliable/#memory-drift",
            "kind": "complaint",
            "tags": ["memory", "reliability", "context", "reddit"],
            "source": "reddit",
            "collected_at": COLLECTED_AT,
            "notes": "r/LocalLLaMA: OpenClaw memory drifted, forgot detail 20min into multi-step task."
        },
        {
            "id": "f25c1rd04",
            "agent": "openclaw",
            "quote": "Bottom line: Hermes won. It offers a better experience because it has strong community support. It uses more tokens, so I run it on cheaper models and only switch to expensive ones when I need something specific done. Cheaper models with a strong harness will match the quality I was getting in claude code or codex.",
            "author": "u/NakedChapter",
            "author_name": "NakedChapter",
            "date": "2026-09-21",
            "url": "https://www.reddit.com/r/hermesagent/comments/1ujucjo/hermes_vs_openclaw_a_full_day_sidebyside_test/#verdict",
            "kind": "comparison",
            "tags": ["vs-hermes", "tokens", "community", "reddit"],
            "source": "reddit",
            "collected_at": COLLECTED_AT,
            "notes": "r/hermesagent: Day-long comparison; Hermes won on community, OpenClaw on token efficiency."
        },
    ],
    "poke": [
        {
            "id": "f25d1sa01",
            "agent": "poke",
            "quote": "The Interaction Company, which makes Poke, joined Cognition in July 2026. Both companies said Poke would continue operating as before while Cognition's models and infrastructure are integrated. The ownership change makes current privacy, terms, integrations and account controls worth rechecking over time.",
            "author": "The Rundown AI",
            "author_name": "The Rundown AI",
            "date": "2026-08-31",
            "url": "https://www.therundown.ai/tools/poke#cognition-acquisition",
            "kind": "other",
            "tags": ["acquisition", "cognition", "privacy", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "The Rundown: Poke acquired by Cognition July 2026; continued operation promised."
        },
    ],
    "ollie": [
        {
            "id": "f25e1tc01",
            "agent": "ollie",
            "quote": "Lennon is taking a different approach with Ollie. Currently, this family assistant connects to calendars and email to organize family schedules and keep its users updated about their days. It also offers tools that can help you plan meals, shop for groceries, track to-dos, book appointments, and pay bills via group chats.",
            "author": "Sarah Perez",
            "author_name": "Sarah Perez (TechCrunch)",
            "date": "2026-09-03",
            "url": "https://techcrunch.com/2026/09/03/ollie-is-betting-privacy-can-win-the-ai-assistant-race/#features",
            "kind": "other",
            "tags": ["family", "calendar", "privacy", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "TechCrunch Sep 3: Ollie family assistant feature overview."
        },
        {
            "id": "f25e1tc02",
            "agent": "ollie",
            "quote": "'We're not sharing your data with anyone. This is super sensitive, and that is necessary to win the trust of the users,' Lennon said. In addition to the data protections provided by SOC 2 compliance, Ollie doesn't request usernames or passwords to complete its tasks.",
            "author": "Sarah Perez",
            "author_name": "Sarah Perez (TechCrunch)",
            "date": "2026-09-03",
            "url": "https://techcrunch.com/2026/09/03/ollie-is-betting-privacy-can-win-the-ai-assistant-race/#privacy",
            "kind": "praise",
            "tags": ["privacy", "soc2", "trust", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "TechCrunch: Ollie founder on privacy-first approach, no password requests."
        },
    ],
    "caddy": [
        {
            "id": "f25f1lq01",
            "agent": "caddy",
            "quote": "We took the same backend. We threw it into email, we threw it into Slack, we threw it into iMessage. iMessage immediately took off. It took off for us. Like we just started using it all the time. Our friends started using it. We were proud to share it with people.",
            "author": "Rajiv Ayyangar",
            "author_name": "Rajiv Ayyangar (Caddy, via Linq Blog)",
            "date": "2026-09-04",
            "url": "https://linqapp.com/blog/what-happened-when-caddy-moved-its-assistant-to-texting#imessage-took-off",
            "kind": "other",
            "tags": ["imessage", "adoption", "founder", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Linq Blog: Caddy founder on iMessage channel outperforming email/Slack."
        },
        {
            "id": "f25f1lq02",
            "agent": "caddy",
            "quote": "Other customers like VentNow ran head to head experiments and found that users in native texting send ~20% more messages per session and are about 40% more active on a daily basis versus other channels.",
            "author": "Linq Blog",
            "author_name": "Linq Blog",
            "date": "2026-09-04",
            "url": "https://linqapp.com/blog/what-happened-when-caddy-moved-its-assistant-to-texting#ventnow",
            "kind": "other",
            "tags": ["engagement", "texting", "metrics", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Linq: VentNow A/B test found 20% more msgs, 40% higher DAU in texting vs other channels."
        },
    ],
}

def load_feedback(agent_slug):
    path = f"data/agents/{agent_slug}/feedback.json"
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return []

def save_feedback(agent_slug, feedback):
    path = f"data/agents/{agent_slug}/feedback.json"
    with open(path, 'w') as f:
        json.dump(feedback, f, indent=2)

def get_existing_urls(feedback):
    return {item.get('url') for item in feedback}

def main():
    total_added = 0
    changes = {}
    
    for agent_slug, new_entries in NEW_FEEDBACK.items():
        feedback = load_feedback(agent_slug)
        existing_urls = get_existing_urls(feedback)
        
        added = 0
        for entry in new_entries:
            if entry['url'] not in existing_urls:
                feedback.append(entry)
                added += 1
        
        if added > 0:
            save_feedback(agent_slug, feedback)
            changes[agent_slug] = added
            total_added += added
            print(f"{agent_slug}: +{added} (now {len(feedback)})")
    
    print(f"\nTotal added: {total_added}")
    print(f"Agents changed: {list(changes.keys())}")
    return total_added, changes

if __name__ == "__main__":
    main()
