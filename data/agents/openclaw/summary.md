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

**Feedback rows:** 42 (as of 2026-10-05)
