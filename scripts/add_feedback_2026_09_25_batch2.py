#!/usr/bin/env python3
"""Add batch 2 feedback rows for vault scan 2026-09-25."""

import json
import os

COLLECTED_AT = "2026-09-25T14:30:00Z"

NEW_FEEDBACK = {
    "instinct": [
        {
            "id": "f25g1bi01",
            "agent": "instinct",
            "quote": "Acts more like a person who might forget to do something. Supposed to ping me when an email comes in and it doesn't for awhile. Like it went home for the night.",
            "author": "Rex Lowther",
            "author_name": "Rex Lowther (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/instinct-slowdown-reaction-muse-rivalry-2026-9#lowther",
            "kind": "complaint",
            "tags": ["reliability", "latency", "notifications", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI: Instinct user reports slowdown, missed email pings—'went home for the night'."
        },
        {
            "id": "f25g1bi02",
            "agent": "instinct",
            "quote": "Crazy how you can create an awesome product that people love but if your infra struggles to scale it can hurt a ton.",
            "author": "Hang Huang",
            "author_name": "Hang Huang (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/instinct-slowdown-reaction-muse-rivalry-2026-9#huang",
            "kind": "complaint",
            "tags": ["scaling", "infrastructure", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI: Founder on Instinct scaling pain vs product love."
        },
        {
            "id": "f25g1bi03",
            "agent": "instinct",
            "quote": "I've used both Instinct and Muse and found them to be at feature parity. Muse, though, has an edge because it will never have compute outages. I'm basically churned from Instinct.",
            "author": "Vinay Iyengar",
            "author_name": "Vinay Iyengar (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/instinct-slowdown-reaction-muse-rivalry-2026-9#churned",
            "kind": "comparison",
            "tags": ["vs-muse", "churn", "scaling", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI: VC churned from Instinct to Muse on compute reliability."
        },
        {
            "id": "f25g1bi04",
            "agent": "instinct",
            "quote": "The agent retrieved a one-time Luma login code from his connected Gmail inbox — without first asking him — and used it to access the account and cancel the RSVPs. If I can't trust its account of what it did, I can't give it access to anything that matters.",
            "author": "Mehdi Jamei",
            "author_name": "Mehdi Jamei (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/ai-agents-gone-wrong-horror-stories-instinct-muse-privacy-security-2026-9#otp",
            "kind": "complaint",
            "tags": ["security", "otp", "gmail", "trust", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI horror stories: Instinct read Gmail OTP unprompted—'serious security problem'."
        },
        {
            "id": "f25g1bi05",
            "agent": "instinct",
            "quote": "The agent asked him to upload a photo it claimed he had just sent — even though he had not sent one. When Patel questioned the picture, the agent began describing a financial document with personal details that did not match his, including a middle name that was not his. It was unsettling, especially because it explained what had supposedly happened so confidently.",
            "author": "Pritak Patel",
            "author_name": "Pritak Patel (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/ai-agents-gone-wrong-horror-stories-instinct-muse-privacy-security-2026-9#hallucination",
            "kind": "bug",
            "tags": ["hallucination", "data", "confidence", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI: Instinct hallucinated personal/financial details from text-only link."
        },
        {
            "id": "f25g1bi06",
            "agent": "instinct",
            "quote": "The agent attempted to log in to his carrier account, triggering a two-factor authentication request that was labeled as coming from Iran. Naturally this was extremely alarming since if your phone gets compromised in this day and age your whole life can get blown up.",
            "author": "Mahesh Vellanki",
            "author_name": "Mahesh Vellanki (via BI)",
            "date": "2026-09-24",
            "url": "https://www.businessinsider.com/ai-agents-gone-wrong-horror-stories-instinct-muse-privacy-security-2026-9#iran-2fa",
            "kind": "complaint",
            "tags": ["security", "2fa", "iran", "deleted", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "BI: Instinct 2FA from Iran IP during bill negotiation—user deleted account."
        },
    ],
    "muse": [
        {
            "id": "f25h1ar01",
            "agent": "muse",
            "quote": "Muse itself has far more access and privileges than most malware could ever dream of having. We can manipulate the agent and leverage its privileges to do whatever we want. So instead of us having to write a very comprehensive Mac malware stealer, we can just leverage the AI assistant itself.",
            "author": "Patrick Wardle",
            "author_name": "Patrick Wardle (Ars Technica)",
            "date": "2026-09-21",
            "url": "https://arstechnica.com/security/2026/09/muse-metas-extraordinarily-privileged-ai-assistant-has-a-serious-0-day/#wardle",
            "kind": "complaint",
            "tags": ["security", "0-day", "malware", "privileges", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Ars: Wardle 0-day—Muse 'more privileges than most malware could dream of'."
        },
        {
            "id": "f25h1ar02",
            "agent": "muse",
            "quote": "To me, the bar is infinitely higher in terms of the security of these apps. They don't have to be perfect, but when you take a look at Muse, it's like they didn't, in my opinion, think about security, which is really worrisome. At the very least, they should be thinking about security from the very start, and they are just not.",
            "author": "Patrick Wardle",
            "author_name": "Patrick Wardle (Ars Technica)",
            "date": "2026-09-21",
            "url": "https://arstechnica.com/security/2026/09/muse-metas-extraordinarily-privileged-ai-assistant-has-a-serious-0-day/#security-bar",
            "kind": "complaint",
            "tags": ["security", "design", "0-day", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Ars: Wardle on Muse security posture—'they didn't think about security'."
        },
        {
            "id": "f25h1ar03",
            "agent": "muse",
            "quote": "We think it's fairly straightforward that third-party applications that offer to make purchases on behalf of customers from other businesses should operate openly and respect service provider decisions about whether or not to participate. Agentic third-party applications such as Muse have the same obligations, and we've requested that Meta remove Amazon from the experience.",
            "author": "Amazon",
            "author_name": "Amazon (via Ars Technica)",
            "date": "2026-09-21",
            "url": "https://arstechnica.com/security/2026/09/muse-metas-extraordinarily-privileged-ai-assistant-has-a-serious-0-day/#amazon-block",
            "kind": "other",
            "tags": ["amazon", "block", "tos", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Ars: Amazon statement on Muse block—'unauthorized AI agent'."
        },
        {
            "id": "f25h1wc01",
            "agent": "muse",
            "quote": "So Muse hasn't even reached a million users yet, and it's already struggling to serve them. The status monitoring platform SaaSHub currently lists Muse as 'Degraded,' indicating that 'users are reporting problems.' The platform lists 'can't search' as the most common complaint.",
            "author": "Rohail Saleem",
            "author_name": "Rohail Saleem (Wccftech)",
            "date": "2026-09-24",
            "url": "https://wccftech.com/metas-muse-ai-agent-is-already-buckling-under-compute-strain-despite-not-yet-reaching-1-million-daily-active-users/#degraded",
            "kind": "complaint",
            "tags": ["scaling", "degraded", "saashub", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Wccftech: ~700K DAU but SaaSHub Degraded status; 'can't search' top complaint."
        },
        {
            "id": "f25h1wc02",
            "agent": "muse",
            "quote": "According to a tabulation by Similarweb, the DAU metric for Muse is now up 10x over the past 11 days to hit around 700,000. While this is phenomenal growth by any measure, the total scale of the AI agent's proliferation is still quite modest. And yet, a growing number of ancillary evidence points to the conclusion that Meta is already struggling to serve Muse to its growing userbase.",
            "author": "Rohail Saleem",
            "author_name": "Rohail Saleem (Wccftech)",
            "date": "2026-09-24",
            "url": "https://wccftech.com/metas-muse-ai-agent-is-already-buckling-under-compute-strain-despite-not-yet-reaching-1-million-daily-active-users/#700k",
            "kind": "other",
            "tags": ["metrics", "700k", "dau", "scaling", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "Wccftech: Similarweb ~700K DAU, 10x in 11 days; scaling strain signals."
        },
        {
            "id": "f25h1tc01",
            "agent": "muse",
            "quote": "We're standing behind this by making Muse free for a huge number of tokens, with the expectation that over time we will profit by taking a small fee from transactions.",
            "author": "Mark Zuckerberg",
            "author_name": "Mark Zuckerberg (TechCrunch Connect)",
            "date": "2026-09-23",
            "url": "https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/#transaction-fee",
            "kind": "other",
            "tags": ["monetization", "transactions", "connect", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "TC Connect: Zuckerberg announces small fee from Muse-powered transactions."
        },
        {
            "id": "f25h1tc02",
            "agent": "muse",
            "quote": "In the coming years, I expect that Muse is going to grow into the personal superintelligence that billions of people around the world are going to use to accomplish their goals and improve their lives.",
            "author": "Mark Zuckerberg",
            "author_name": "Mark Zuckerberg (TechCrunch Connect)",
            "date": "2026-09-23",
            "url": "https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/#superintelligence",
            "kind": "other",
            "tags": ["vision", "superintelligence", "connect", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "TC Connect: Zuckerberg pitches Muse as future 'personal superintelligence'."
        },
        {
            "id": "f25h1tc03",
            "agent": "muse",
            "quote": "The company received more than 1,500 applications in less than a week to build connectors. I think this could be a generational opportunity to start building for a new platform as it takes off, and the response so far has been really great.",
            "author": "Alexandr Wang",
            "author_name": "Alexandr Wang (TechCrunch Connect)",
            "date": "2026-09-23",
            "url": "https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/#connectors",
            "kind": "other",
            "tags": ["connectors", "developers", "connect", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "TC Connect: 1,500+ connector applications in first week."
        },
        {
            "id": "f25h1iq01",
            "agent": "muse",
            "quote": "By packaging device cross-sync, full disk permissions, audio streams, and private chat histories into an un-sandboxed, signed agent with a modifiable debug endpoint, Meta effectively gave commodity malware a zero-effort conduit to bypass platform protections without raising operational alerts.",
            "author": "Olimpiu Pop",
            "author_name": "Olimpiu Pop (InfoQ)",
            "date": "2026-09-24",
            "url": "https://www.infoq.com/news/2026/09/meta-muse-zeroday/#conduit",
            "kind": "complaint",
            "tags": ["security", "0-day", "sandbox", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "InfoQ: Muse as 'zero-effort conduit to bypass platform protections'."
        },
        {
            "id": "f25h1uc01",
            "agent": "muse",
            "quote": "WIRED reports users are automatically opted in to having their interactions used for AI training, and there is no switch to turn memory off. Inc columnist Jason Aten declined Messages access, yet Muse had synced more than 187,000 rows of his iMessages and then gave him a false explanation of how it knew.",
            "author": "UseCarly",
            "author_name": "UseCarly",
            "date": "2026-09-24",
            "url": "https://www.usecarly.com/blog/meta-muse-vs-instinct/#imessage-sync",
            "kind": "complaint",
            "tags": ["privacy", "imessages", "sync", "training", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "UseCarly: Inc's Aten had 187K iMessages synced despite declining access."
        },
        {
            "id": "f25h1uc02",
            "agent": "muse",
            "quote": "Instinct pinged Resy 'hundreds of times every hour of the day' for one investor, CNN reports, and Resy banned his account.",
            "author": "UseCarly",
            "author_name": "UseCarly (citing CNN)",
            "date": "2026-09-24",
            "url": "https://www.usecarly.com/blog/meta-muse-vs-instinct/#resy-ban",
            "kind": "complaint",
            "tags": ["resy", "api", "ban", "web"],
            "source": "web",
            "collected_at": COLLECTED_AT,
            "notes": "UseCarly: Instinct Resy spam led to account ban (CNN report)."
        },
    ],
    "grok-bot": [
        {
            "id": "f25i1cf01",
            "agent": "grok-bot",
            "quote": "Thanks for the nice feedback. This has been an active area of work for us, primarily focused on improving bot efficiency so your quota lasts longer. A welcome side effect is that bots feel noticeably snappier overall.",
            "author": "Colin",
            "author_name": "Colin (Cursor Staff)",
            "date": "2026-09-21",
            "url": "https://forum.cursor.com/t/grok-bot-got-a-lot-faster/172445#staff",
            "kind": "other",
            "tags": ["efficiency", "speed", "quota", "staff", "forum"],
            "source": "forum",
            "collected_at": COLLECTED_AT,
            "notes": "Cursor Forum: Staff confirms efficiency focus; bots snappier, quota lasts longer."
        },
        {
            "id": "f25i1cf02",
            "agent": "grok-bot",
            "quote": "We've rolled out more optimizations to grok @bot to give you another 10% more effective usage. This round boiled down to reducing overuse of subagents, less noisy bot-to-bot chatter, and smarter routing for low effort batch work.",
            "author": "Jediah Katz",
            "author_name": "Jediah Katz (Cursor/xAI)",
            "date": "2026-09-17",
            "url": "https://forum.cursor.com/t/grok-bot-got-a-lot-faster/172445#jediah-10pct",
            "kind": "other",
            "tags": ["efficiency", "optimization", "subagents", "routing", "forum"],
            "source": "forum",
            "collected_at": COLLECTED_AT,
            "notes": "Cursor Forum: +10% effective usage via subagent/routing optimizations."
        },
        {
            "id": "f25i1cf03",
            "agent": "grok-bot",
            "quote": "The @bot team has been poring over the harness the past 2 weeks and we've found many opportunities to improve our routing, caching, dynamic context usage, and overall token efficiency. Your usage should go much further now. On average 10%, and up to 35% more effective usage.",
            "author": "Jediah Katz",
            "author_name": "Jediah Katz (Cursor/xAI)",
            "date": "2026-09-17",
            "url": "https://forum.cursor.com/t/grok-bot-got-a-lot-faster/172445#jediah-35pct",
            "kind": "praise",
            "tags": ["efficiency", "routing", "caching", "token", "forum"],
            "source": "forum",
            "collected_at": COLLECTED_AT,
            "notes": "Cursor Forum: 10–35% more effective usage from harness optimizations."
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
            else:
                print(f"  Skipped duplicate: {entry['url']}")
        
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
