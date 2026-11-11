# OpenClaw

Site: https://openclaw.ai/

OpenClaw is an open-source personal AI assistant that runs on your own machine (macOS, Windows, Linux) and works from WhatsApp, Telegram, iMessage, Slack, Discord, Signal, SMS and other chat apps, with iOS and Android companion apps. It handles the inbox, email, calendar and flight check-ins, and is stewarded by an independent 501(c)(3) foundation. Requested via the form (issue #182).

**Feedback rows:** 12 (as of 2026-09-22)
**Kinds:** bug=3, complaint=3, praise=1, use-case=1, other=1, comparison=1

_Updated 2026-09-18 weekday vault scan (+6 rows)._

**New this scan:**
- (2026-06-09) TheModernBlog: capable OSS agent; CVE-2026-25253 WebSocket RCE; ClawHavoc 341 malicious skills / 9k+ installs.
- (2026-05-07) unsubbed.co: Gartner "unacceptable cybersecurity risk"; Cisco/CrowdStrike/Belgian CERT warnings.
- (2026-09-02/08) Peter Yang + Luca Rossi: left OpenClaw for Hermes (reliability), then Grok Bot for orchestration.



- **2026-09-21 vault scan:** Rerealize 9.3/9.4 update-path split-brain + memory/reply regressions; AirMore 2.0 gateway-not-model review; Faraday self-host control pick.

- **2026-09-22 vault scan (+2 rows):** r/openclaw 13-week daily-driver recap (LobsterWeary2675, 11 May; missed by prior scans): Raspberry Pi + Telegram infra; powerful but requires patience/debugging.

- **2026-09-23 vault scan (+3 rows):** Trail of Bits audit recap (21 Sep): 24 severity-rated vulnerabilities (0 Critical, 2 High, 16 Medium, 6 Low); all fixed in 2026.8.1 / 2026.7.33 LTS. Audit lesson: mid-run permission changes must re-check tools. Emergent Windows retest (8 Sep; missed by prior scans): install OK, live memory task fails post-OAuth; not first-pick for simple assistant.

- **2026-09-24 vault scan (+3 rows):** arXiv CIK-Bench (Wang et al., Apr 2026): live OpenClaw eval; ASR 24.6%→64–74% under CIK poisoning. RuntimeWire analysis (21 Sep): Trail of Bits audit permission loss across agent handoffs. Saner Muse-alts roundup (11 Sep): OpenClaw power vs CLI setup friction.

- **2026-09-25 vault scan (+4 rows):** r/AI_Agents (Sep 20): Self-building Spotify skill in 3 min from one sentence; but unapproved email from casual Telegram interpreted as instruction. r/LocalLLaMA (Sep 22): memory drift forgotten detail 20min into task. r/hermesagent (Sep 21): day-long comparison — Hermes won on community, OpenClaw on token efficiency.

_Updated 2026-09-28 weekday vault scan (+4 rows)._

**New this scan:**
- (2026-09-26) Clauday Super User Daily: Maintainers deleted ~400k agent-written tests; coverage barely moved.
- (2026-09-26) SlowMist (via Clauday): MemoryOS/memos-cloud-openclaw-plugin supply-chain credential theft.
- (2026-09-26) Clauday Super User Daily: Gym booking via unauth cancel API — agent aligned to user, harmful to others.
- (2026-09-23) Techy Surgeon: Powerful but setup intimidating; abandoned for hosted agents.

_Updated 2026-09-29 weekday vault scan (+6 rows)._

**New this scan:**
- (2026-09-25) OpenClaw blog (Graham McBain): Microsoft Autopilot built on OpenClaw.
- (2026-09-25) Omar Shahine (via OpenClaw blog): "Enterprise grade runtime" commitment.
- (2026-09-28) Clauday Super User Daily: @bensig — personalized daily newspaper via OpenClaw.
- (2026-09-28) Clauday Super User Daily: @menhguin — VPS→Mac mini hosting economics.
- (2026-09-28) Clauday Super User Daily: @augmentedtraff — M5Stack smartwatch running OpenClaw.
- (2026-09-28) Clauday Super User Daily: @MichaelGannotti — Team Reports heap/event-loop fix.

_Updated 2026-09-30 weekday vault scan (+3 rows)._

**New this scan:**
- (2026-09-23) Jay Eskenazi (BI): Non-dev setup took hours + dev help; confusing AWS bills; churned.
- (2026-09-02) VelvetShark: Daily OpenClaw since January; silent failures worst.
- (2026-08-30) Yardwork: OpenClaw approvals off by default; safety is opt-in config.

_Updated 2026-10-01 vault scan (+2 rows)._

**New this scan:**
- (2026-09-30) Berk Kalelioğlu (AIMultiple): Hard to set up without server experience; 12-page config reference.
- (2026-09-30) Berk Kalelioğlu (AIMultiple): Heartbeat ~100k tokens/30min; ~$19/day at Anthropic Opus 5.5; Claude subs banned since Apr 4.

_Updated 2026-10-05 vault scan (+2 rows)._

**New this scan:**
- (2026-10-04) AI Provider Index: Tencent AIG added to ClawScan security pipeline; dual scanner with SkillSpector.
- (2026-10-04) AI Provider Index: ClawScan 98.6% malicious case detection on SkillTrustBench 556-case subset.

**Previous scan (2026-10-02, +3 rows):**
- (2026-09-29) UseCarly: CVE-2026-25253 / malicious skills / Meta researcher inbox bulk-delete anecdote.
- (2026-10-01) Gizmodo: OpenClaw stronger for chat channels/multi-agent/skill library.

_Updated 2026-10-06 weekday vault scan (+5 rows)._

**New this scan:**
- (2026-10-05) My AI Guide: 30+ updates, 113 fixes, GPT-6.1 Sol + Opus 5.5 support.
- (2026-10-05) My AI Guide: Stability over reasoning; production still fractures on maintenance.
- (2026-10-05) TechThoughtLeaders: OpenClaw 391k stars, passed React in March; #1 harness.
- (2026-10-05) TechThoughtLeaders: Stars ≠ adoption; Claude Code leads at 39% per JetBrains.
- (2026-10-02) ClawUp: One-click OpenClaw/Hermes deploy; 1–3 min provisioning.

_Updated 2026-10-12 weekday vault scan (+3 rows)._

**New this scan:**
- (2026-10-09) Ali Tarik Sahin (Upstash): Pick OpenClaw to own setup + use 20+ chat apps + large ecosystem.
- (2026-10-12) Freedom.Tech: v2026.10.2 fixes Windows upgrades, prompt-cache, credential masking.
- (2026-10-12) Max Kaplan: Claims OpenClaw/Hermes era over as ChatGPT closes functionality gap.

_Updated 2026-10-13 weekday vault scan (+2 rows)._

**New this scan:**
- (2026-10-13) r/openclaw: Every update breaks something; memory and keys fail post-upgrade.
- (2026-10-13) r/openclaw: Switched to Hermes after another broken update; Hermes ported cron jobs easily.

_Updated 2026-10-15 weekday vault scan (+3 rows)._

**New this scan:**
- (2026-10-01) Felipe Fontoura: Pick OpenClaw for device-native PA with wake word and heartbeat.
- (2026-10-01) Felipe Fontoura: OpenClaw still wins reach; depth gap with Hermes mostly closed.
- (2026-10-01) Felipe Fontoura: OpenClaw heartbeat (30min) vs Hermes cron-only; heartbeat is the PA feature.

_Updated 2026-10-16 weekday vault scan (+2 rows)._

**New this scan:**
- (2026-09-24) TestedActually: OpenClaw widest reach (29 platforms) but 2026 security record concerning.
- (2026-10-15) PerkShelf: OpenClaw or Hermes for full control and model choice.

**Feedback rows:** 57 (as of 2026-10-16)

_Updated 2026-10-20 weekday vault scan (+3 rows)._

**New this scan:**
- (2026-10-15) Tun Win (tun.lat): OpenClaw self-hosted on home server; handles personal ops over Telegram; deeply satisfying when it works.
- (2026-10-15) Tun Win (tun.lat): Maintenance pain—updates for CVE fixes break custom setups; every update is a gamble.
- (2026-10-15) Tun Win (tun.lat): Model churn pain—GPT-5.6 to 6.0 to 6.1 required reworking configs each time.

**Feedback rows:** 60 (as of 2026-10-20)

_Updated 2026-10-23 weekday vault scan (+2 rows)._

**New this scan:**
- (2026-10-23) @69houdini1: User prefers multi-agent approach (OpenClaw, Grok Bot, Hermes).
- (2026-10-22) @Ripuhiring: User ranking puts OpenClaw 5th of 9.

**Feedback rows:** 72 (as of 2026-10-26)

_Updated 2026-10-26 weekday vault scan (+7 rows)._

**New this scan:**
- (2026-10-23) @69houdini1: Multi-agent approach praised—OpenClaw, Grok Bot, Hermes.
- (2026-10-24) @techstack_daily: OpenClaw vs Hermes: 'Both need patience but OpenClaw wins on ecosystem.'
- (2026-10-24) @selfhost_coder: Migrated from Muse to OpenClaw for ownership; 'worth the setup pain.'
- (2026-10-25) @homelab_zak: OpenClaw + Telegram infra—'runs flawlessly once configured.'
- (2026-10-25) @floppy_pigeon: 'OpenClaw has the features but Hermes has the community.'
- (2026-10-26) @LightInABox99: Ranked OpenClaw 4th of 6 in personal agent comparison.
- (2026-10-23) @Ripuhiring: User ranking puts OpenClaw 5th of 9.

_Updated 2026-10-27 weekday vault scan (+1 rows)._

**New this scan:**
- (2026-10-26) @fabricated_mnd: OpenClaw 'too technical' for casual user.

**Feedback rows:** 73 (as of 2026-10-27)

_Updated 2026-10-29 weekday vault scan (+2 rows)._

**New this scan:**
- (2026-10-29) @Mercurion5d: OpenClaw was a mess; broke after every update; churned to Hermes.
- (2026-10-29) @AICEOGiuliano: OpenClaw hype spawned Claw wrappers; Hermes proved more useful.

**Feedback rows:** 75 (as of 2026-10-29)

_Updated 2026-10-30 vault scan (+2 rows)._

**New this scan:**
- (2026-10-30) @ForestTechSol: OpenClaw at launch—'spent days getting it to work. Underwhelmed.'
- (2026-10-29) @_odsc: Former OpenClaw maintainer on personal AI shift to delegation.

**Feedback rows:** 77 (as of 2026-10-30)

_Updated 2026-11-02 vault scan (+1 row)._

**New this scan:**
- (2026-10-30) @Geektak: OpenClaw and Hermes can do more but Meta Muse satisfies set-it-and-forget-it needs.

**Feedback rows:** 78 (as of 2026-11-02)

_Updated 2026-11-03 vault scan (+3 rows)._

**New this scan:**
- (2026-11-02) @tregoudeau: Uses Claude Duet + BB app for local access to machines, OpenClaw, Codex—multi-harness Projects.
- (2026-11-03) @ashandironzero: Ranking: Grok bot > Duet > Muse > Hermes > Dots > OpenClaw.
- (2026-11-02) @yanique_a: Questions need for OpenClaw, Hermes, Grok Bot, Duet, Dot, Muse—all do the same thing.

**Feedback rows:** 81 (as of 2026-11-03)

_Updated 2026-11-04 vault scan (+2 rows)._

**New this scan:**
- (2026-11-03) @NickPassig: OpenClaw on 'not now' list alongside Codex and Dots.
- (2026-11-04) @KI_Vater: Uses GrokBot, Hermes, and OpenClaw (Duet unavailable in EU).

**Feedback rows:** 83 (as of 2026-11-04)

_Updated 2026-11-05 vault scan (+1 row)._

**New this scan:**
- (2026-11-04) @cascacius: Preference ranking—OpenClaw over Grok Bot (alongside Hermes, Taskade, Claude).

**Feedback rows:** 84 (as of 2026-11-05)

_Updated 2026-11-06 weekday vault scan (+6 rows)._

**New this scan:**
- (2026-11-06) @frugalbc: Considering switch back to OpenClaw after Grok Bot usage issues.
- (2026-11-06) @ashwinsharan158: Harness leaderboard—mini-swe-agent 51.4% solved, OpenClaw 27.3%; wrapper matters more than model.
- (2026-11-06) @8Examples: Changed hands-free OpenClaw wake word detection from acoustic to LLM-based.
- (2026-11-06) @frmdomi: "OpenClaw is so far behind, damn. It's literally just slop right now."
- (2026-11-06) @Meedo11: Stopped OpenClaw days ago; transferred routines to Grok Bot; Hermes ready as backup.
- (2026-11-06) @Sarah_Cecc: Uses OpenClaw alongside Hermes and Grok Bot on Mac mini; separate identity.

**Feedback rows:** 90 (as of 2026-11-06)

_Updated 2026-11-09 weekday vault scan (+11 rows)._

**New this scan:**
- (2026-11-07) @jantegze: Tried OpenClaw; "Hermes agent is like 100x better."
- (2026-11-08) @PriorReason: OpenClaw gateway using 2GB+ on 4GB VPS—asks if normal.
- (2026-11-08) @AIMoshHq: Garry Tan benchmark—OpenClaw $0.44/task vs Claude Code $0.22, half the time.
- (2026-11-08) @ColdMorningGrit: Set up agent flux with OpenClaw; knew nothing, now right-hand man.
- (2026-11-09) @snir000: Full circle—OpenClaw → Grok Bot → OpenClaw.
- (2026-11-07) @davidfano: Prefers OpenClaw; thinks both OpenClaw and Hermes are good.
- (2026-11-07) @leov: Turning over work agents from OpenClaw to Hermes—"not serious people."
- (2026-11-08) @HermesAgentTips: Was creating OpenClaw content, stumbled on Hermes, fell in love.
- (2026-11-06) @josiahgarber: Bit the bullet—migrating to Hermes from OpenClaw.
- (2026-11-07) @Luis_MMF: Using OpenClaw Enterprise with team of accountants; very useful.
- (2026-11-06) @crmitchelmore: Migrated from dots to OpenClaw, tried for weeks, going back to OpenClaw.

**Feedback rows:** 101 (as of 2026-11-09)

_Updated 2026-11-10 weekday vault scan (+7 rows)._

**New this scan:**
- (2026-11-09) @scottbillows: Pivoted from Gemini Spark to Grok Bot; mentions OpenClaw/Hermes ecosystem.
- (2026-11-10) @cbgrok: "I think you are pro openclaw?...I've been through the grinder with openclaw."
- (2026-11-10) @joelniklaus: OpenClaw defaults to 8,192 tokens when maxTokens unset—checking limits.
- (2026-11-09) @jarredsumner: "OpenCode uses 41% less memory with Bun AoT and OpenClaw starts 3x faster" (641 likes).
- (2026-11-10) @ap13p: OpenClaw using 9GB RAM for 2 sessions with 2 subagents each.
- (2026-11-10) @helpnetsecurity: 575+ malicious OpenClaw skills delivered malware to Windows/macOS.
- (2026-11-10) @openloftAI: OpenLoft: one-click OpenClaw deployment to lower barrier.

**Feedback rows:** 108 (as of 2026-11-10)

_Updated 2026-11-11 weekday vault scan (+5 rows)._

**New this scan:**
- (2026-11-11) @iCleanAI: v2026.11.3 patch—credential handling, interrupted update recovery, backup timeouts; 56 PRs from 36 contributors.
- (2026-11-10) @JayQinQT: Telegram bot config tip—dmPolicy allowFrom wildcard for strangers.
- (2026-11-11) @JayQinQT: Shell commands disabled by policy—tools.alsoAllow config workaround.
- (2026-11-10) @DumbTien: Google Meet video recordings via OpenClaw.
- (2026-11-11) @alfokker: "hermes is just a very slightly better openclaw, but not for serious work."

**Feedback rows:** 113 (as of 2026-11-11)
