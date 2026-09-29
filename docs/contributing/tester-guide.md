# Assistant Benchmark tester guide

Use your own agent to contribute evidence from an existing assistant conversation. You choose what to share. David reviews the evidence, confirms or changes the proposed score, and approves any public result. Pilot contributions do not change headline rankings or Speed.

## Before you start

This guide is for a Mac with Codex running locally or Claude Code. You need Git and Node 22.13 or newer. No invitation file, submission token or account is required. Your agent provider's normal usage charges and data settings apply.

The pilot supports Messages on your Mac, WhatsApp text exports without media, and dated text copied from an assistant app into a local file. Telegram is not supported yet. Start with one assistant and a short date range. You do not need to make purchases or run new tests.

Before accessing a conversation, the agent checks that the live intake is accepting submissions. If unavailable, you may choose a preview-only rehearsal; it ends with a local preview and does not submit.

## Install the tested version

Open Terminal. Check the prerequisites with `git --version` and `node --version`. If either is missing or Node is older than 22.13, ask your agent to help you install it before continuing. No npm packages are required for the contribution tools.

Run these commands one line at a time. If a command fails, stop and ask for help. Use a fresh folder; do not overwrite an existing checkout.

```sh
git clone --no-checkout --depth 1 https://github.com/dpawlan/ai-assistant-benchmark.git assistant-benchmark-pilot
cd assistant-benchmark-pilot
git fetch --depth 1 origin a48256b160a54fed6b05241abde34822514b26b0
git checkout --detach FETCH_HEAD
```

Choose the command for your agent. You only need one.

Codex

```sh
node scripts/install-contribute.mjs --agent codex
```

Claude Code

```sh
node scripts/install-contribute.mjs --agent claude
```

Look for “Installed contribute-runs” and the tool revision. Open a new local agent session in the assistant-benchmark-pilot folder. Keep that folder in place while using the skill; it contains the tested tools. Do not update it to a different branch during the pilot.

<!-- PAGEBREAK -->

## Start the contribution

Paste this into your agent:

> Use contribute-runs to help me contribute an existing assistant conversation. First check whether the intake is accepting submissions. Then ask which assistant and date range, help me review personal details, and show the complete submission before asking permission to send it.

The agent will check intake readiness, then ask which assistant conversation and date range to use. No private invitation is needed.

For Messages, the app running the terminal may need Full Disk Access under System Settings, Privacy & Security. Grant it only if you choose that route, then restart that app. WhatsApp and dated text imports do not require this permission. Do not upload your Messages database or paste a complete raw export into the agent conversation.

## Review what will be shared

The local scripts extract the selected conversation and prepare redacted excerpts. Your agent may send the redacted text it reads to its model provider under that provider's settings. Automatic redaction can miss names, meeting titles, health details and other identifying context. Check every excerpt and remove anything you do not want shared.

The submission preview contains all information sent to Assistant Benchmark:

- The assistant, task/category, date, excerpts, timing availability and signals, and any proposed score. Missing times use ordering placeholders, not measured timestamps.
- Your proposed public note, attribution platform and handle.
- Your affiliations, any free or discounted accounts, account tier and relevant integrations, plus your timezone.
- The tool and rubric versions, submission ID and permission for public excerpts.

Attribution is self-reported. The intake uses a temporary keyed network-address hash to limit spam (six new submissions per hour per network, up to 100 per day across the pilot). Unknown context can be marked unknown. Disclose vendor ties honestly; they may be published with an approved result. A proposed score is a suggestion, not your final benchmark score.

David must be able to read the submitted excerpts privately to review them. You separately choose whether redacted excerpts may be public. The default is no public excerpts. Even with excerpts private, approved scores, notes, attribution, context and disclosures may appear publicly.

## Confirm and save your receipt

Read the complete preview. If it is cut off, ask the agent to show the rest or open the complete bundle. Say yes only when you are comfortable sending exactly that content to Assistant Benchmark. If anything changes, you should see a new preview and be asked again.

A successful submission returns a receipt ID and saves a receipt file. Keep it. The private intake expires submissions after 90 days. Approved public results remain until corrected or withdrawn; public copies may persist elsewhere. David may request more evidence, leave a run unscored, or decline publication.

<!-- PAGEBREAK -->

## If something does not work

**The agent cannot find the skill**

Open a new local session in the tool folder. Tell the agent to read the installed SKILL.md directly if needed. Codex installs at ~/.agents/skills/contribute-runs/SKILL.md; Claude Code installs at ~/.claude/skills/contribute-runs/SKILL.md. A browser-only chat cannot run these local tools.

**Messages access is denied**

Check Full Disk Access for the app actually running the command and restart it. You can instead choose an export route or stop. Do not copy the system Messages database to work around denied access.

**No assistant conversation or usable draft is found**

Confirm the assistant and dates. If its number is not mapped, identify it for the agent; do not give access to unrelated personal conversations. If no evidence matches a test, stop without submitting. Missing or truncated outcomes should not be invented.

**Submission is unavailable or fails**

Contact David at davidmpawlan@gmail.com. If delivery is uncertain, keep the original bundle and ask the agent to retry the same submission once. Do not create a fresh bundle just to retry. Do not assume delivery succeeded until you have a receipt. Send David the error or receipt, never raw conversations .

## Corrections and cleanup

For a correction or withdrawal, email David at davidmpawlan@gmail.com with your receipt ID. If a result has already been published, David will review what needs to change; removing it cannot erase every external cache or copy.

After successful submission, you can ask the agent to remove generated raw exports and drafts while keeping the receipt and your original chat history. Your agent provider may retain its session history separately. To uninstall the skill, remove only its contribute-runs folder from the skill location above. You can remove the downloaded tool folder after saving any receipt you want to keep.

## What happens next

David reviews the evidence against the published rubric and decides the final score and public wording. If published, your contribution is credited and affiliations are disclosed. Reviewed pilot contributions are shown separately from results used for headline rankings. For the first contribution, David will help with any friction; email David whenever you are unsure.
