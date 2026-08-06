# Playbook: Core-Refresh

Purpose: re-derive parts of `.ai/core/*.md` after the codebase has genuinely changed (e.g. a
dependency major bump), as opposed to `reverse-search` which builds the initial baseline.

Shares the same scan-depth levels, question-batching rules, protected-paths exclusion, and
pending-change-proposal mechanism as `reverse-search.md` — read that file first.

## Trigger

Run `ai-framework check-drift` first (Stage A — cheap, just diffs `tech-stack.md` versions
against `package.json`/`node_modules`). Only invoke this playbook (Stage B — deeper) when that
report shows a `SHOULD` (minor) or `MUST` (major) entry. Multiple dependencies changing at once
should be handled as one aggregated pass, not one run per package.

## Scope

Refresh is **scoped**, not a full rescan:
- Update `tech-stack.md` for the changed dependency/dependencies.
- Re-examine only the parts of `architecture.md` plausibly affected by that change (e.g. a
  frontend framework major bump touches "Frontend Architecture", not "External Integrations").

## Output

- Updated `core/*.md` sections with the same `provenance`/`confidence` frontmatter conventions.
- If the change is architecturally significant, write an ADR under `.ai/decisions/`.
- If nobody is available to confirm interactively, follow the pending-change-proposal flow from
  `reverse-search.md` instead of editing `constitution.md` or ratified content directly.
