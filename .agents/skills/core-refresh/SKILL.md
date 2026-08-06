---
name: core-refresh
description: Re-derive the parts of .ai/core/*.md affected by a real codebase change, most commonly after `ai-framework check-drift` reports a minor/major dependency bump. Use after check-drift flags something, or when a real architectural change has happened that core docs don't reflect yet — not for the initial baseline (use reverse-search for that).
---

# Core-Refresh

Shares the scan-depth levels, security-boundary exclusions, question-batching, and
pending-change-proposal mechanism with the `reverse-search` skill — read that skill first if you
haven't.

## When this runs

Normally after `ai-framework check-drift` (Stage A — cheap version diff) reports a `SHOULD`
(minor) or `MUST` (major) entry. If several dependencies changed at once, treat it as one
aggregated refresh, not one pass per package.

## Scope — this is NOT a full rescan

1. Update `.ai/core/tech-stack.md` for the changed dependency/dependencies (new version, any
   notable behavior change).
2. Re-examine only the `architecture.md` sections plausibly affected — e.g. a frontend framework
   major bump touches "Frontend Architecture", not "External Integrations". Don't touch sections
   you have no real reason to revisit.

## Output

- Update the affected `core/*.md` sections, keeping the `provenance`/`confidence` frontmatter
  convention.
- If the change is architecturally significant, write an ADR under `.ai/decisions/`.
- If nobody is available to confirm right now, use the pending-change-proposal flow (see
  `reverse-search`'s skill instructions) instead of editing ratified content unattended.
