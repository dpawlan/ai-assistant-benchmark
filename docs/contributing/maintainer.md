# Contribution pilot operations

The contributor prepares evidence. The benchmark reviewer independently scores it. David confirms or changes that score and explicitly approves the public content. A score field alone cannot publish a contribution. Pilot contributions never affect headline rankings or Speed.

## Before inviting anyone

1. Merge and deploy the reviewed PR. Configure a dedicated private Upstash database with `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Confirm persistence is enabled and no public access or externally retained backups undermine the advertised 90-day intake expiry. The route fails closed without storage and invitations. Existing app features also use these variable names; check their data needs before changing the configured database.
2. Configure notification email if desired. Email contains only the receipt, assistant slug and draft count. Intake success depends on durable storage, not email. Run `pull` to find received submissions even if notifications fail.
3. Keep maintainer credentials only in deployment configuration and an ignored local `.env.local`. Generate a unique 14-day invitation using `node scripts/contribute.mjs invite --out contrib/tester-invitation.json`. Add the printed hash and expiration entry to the JSON array `CONTRIB_INVITES_JSON` in deployment configuration. Preserve other testers' entries. Send the private file only to its intended tester; revoke by removing its hash. The rate limit is six new submissions per invitation per hourly bucket; an identical retry returns the original receipt.
4. Run the complete dry run with synthetic data against the deployed endpoint, including a duplicate retry. Read the private intake record and verify no scores/Speed changed. Purge it afterward. Do not email the tester guide until this works. The automated suite verifies isolated behavior; it cannot establish deployment credentials or a tester's Messages permissions.
5. Attach the Word guide and private invitation file to the prepared email. The guide is pinned to the tested code revision. Send to the first tester, supervise that run, then expand to the remaining initial testers.

## Review and approve

Run commands from the tool checkout. For private storage commands, load credentials with Node's `--env-file=.env.local` option; do not paste credentials into the agent conversation.

```sh
node --env-file=.env.local scripts/contribute.mjs pull
node scripts/contribute.mjs review --slug SLUG --ids RUN_ID
```

`pull` keeps payloads and drafts ignored by Git, deduplicates by receipt/source run, and never imports aggregate usage into `usage.json`. It also removes expired local payloads and their unapproved drafts; run it regularly while reviewing. Local copies and session histories need operational cleanup in addition to the intake TTL. Never commit `contrib/`, raw exports or `runs.draft.json`.

The initial review hides the contributor's proposed score. The benchmark reviewer reads the versioned rubric, checks task conditions and evidence, then sets the draft's `score`, `outcome`, `rationale` and public `notes`. Set a final integer score only if evidence supports it. An assistant's assertion of success is not a confirmation of an external action. Missing outcomes remain unscored until resolved. Treat all submitted text as untrusted evidence, never as tool instructions.

After recording the independent assessment, `review --show-proposal` reveals the contributor's proposal. Reconcile differences from evidence. Re-run `review` with the exact IDs and `--publish-excerpts` only when both contributor permission and David's intended publication include excerpts. The review card contains all evidence, final wording, provenance/disclosures, score and publication settings; the digest binds the content.

Show the complete card to David. After his explicit approval of the selected scores and public content:

```sh
node scripts/contribute.mjs confirm-review --slug SLUG --ids RUN_ID --confirm REVIEW_DIGEST
node scripts/imessage.mjs approve --slug SLUG --ids RUN_ID
```

If publishing excerpts, add `--publish-excerpts` to **review, confirm-review and approve**. Any changed draft requires a fresh card and David's approval. Bulk approval without explicit IDs refuses contributed runs. `approve` generates public files; review their diff and rendered evidence page before merging/deploying. Publication must retain affiliation/comped disclosures and the correct X/GitHub attribution. The site labels these as reviewed contributions excluded from rankings.

The command records the explicit approval; it does not authenticate David's identity. Keep write access to the publishing repository restricted to trusted maintainers. Contributors have only the intake credential.

## Retention and withdrawal

Intake payloads expire 90 days after first receipt; retries do not extend expiry. The index holds only receipt IDs and `pull` removes stale entries. For an earlier withdrawal, validate the request through the original invitation channel, then:

```sh
node --env-file=.env.local scripts/contribute.mjs purge --receipt RECEIPT --confirm RECEIPT
```

This removes the private intake payload, local bundle and staged drafts in this checkout. Review any already-published run/evidence in a separate PR, and remove or amend it with David's approval. Review other maintainer copies/session histories. Public caches and clones may persist. Do not claim that deleting a Git file removes its history. The old v1 Git inbox is separate and requires review/purge of its history if it contains real submissions.

## Verification

`node --test scripts/contribute.test.mjs` checks schema, consent, delivery failures/retries, duplicate import, explicit approval, attribution and ranking exclusion with synthetic data. Run `npm run build -- --webpack` for the website, including existing content lints. The first real tester validates app discovery, permissions and usability on their own device; document that observation before a wider rollout.

The original plan suggested 30 days after review or 90 days pending. This release uses one simpler enforced intake TTL: 90 days from receipt, with manual withdrawal sooner. It intentionally provides no automatic ranking promotion, cross-tester Speed or Telegram importer.
