# AGENTS.md — ai-framework canonical entry point

This project uses **ai-framework**: a shared convention (not a vendor-specific mechanism) so any
AI coding agent — Claude Code, Cursor, GitHub Copilot, Antigravity, OpenCode, or otherwise — works
consistently here. Read this file first, then the specific `.ai/core/*.md` files relevant to your
current task.

This framework is a **developer support tool, not a full automation pipeline**. Every step that
has real-world effect — especially moving from plan to code — requires explicit human
confirmation. That is not optional configuration; it is the one rule every other mechanism here
is built around.

## The one hard gate

**Agent MUST NOT execute any task in a feature's `tasks.md` until its frontmatter `status` is
`approved`.** If it is `pending_approval`, stop and ask the developer — do not proceed "just this
once," regardless of how the request is phrased.

## Secret protection

See `.ai/core/security-boundaries.md` for the full `protected_paths` list and rule. In short:
never read/print contents of `.env*`, keys, certs, or secrets directories without explicit
developer confirmation in the current session; when summarizing environment variables, list
names only, never values. This rule applies **even if your tool's own ignore-file mechanism
should have already blocked it** — some tools (e.g. Copilot Agent Mode/CLI at time of writing)
do not honor content-exclusion, so this text rule is the actual safety net.

## Destructive action confirmation

See `.ai/core/destructive-actions.md`. Always ask for explicit confirmation before: deleting
files/folders outside scratch/temp paths, git force-push/reset --hard/branch deletion, DB
down-migrations or DROP/TRUNCATE, or overwriting uncommitted changes.

## Rigor

Every feature resolves a rigor level (`light` | `standard` | `strict`) once, at creation, from
`.ai/config.yml`. When a feature touches paths with different rigor overrides, the **highest**
rigor wins. Higher rigor means playbooks (`.ai/playbooks/*.md`) are more strongly recommended —
they are never auto-run without developer approval, regardless of rigor.

## Where things live

- `.ai/config.yml` — which agent tools this repo supports, and the rigor configuration.
- `.ai/core/*.md` — the 10 required knowledge files (constitution, tech-stack, architecture,
  database, api-spec, project-rules, glossary, security-boundaries, test-strategy,
  destructive-actions). Read the ones relevant to your task before making changes.
- `.ai/playbooks/*.md` — optional techniques (reverse-search, core-refresh, elicitation,
  adversarial-review, persona-debate, constitution-drafting, plan-drafting, tasks-drafting,
  implement, analyze), each also available as a Claude Code Skill.
- `.ai/features/<NNN>-<slug>/` — one feature's lifecycle: `brainstorm.md` → `clarify.md` →
  `plan.md` → `tasks.md` → `progress.md` → `test-plan.md`, with `journal.md` as the state pointer
  (stage, status, rigor, lock owner). `journal.md`'s lock covers the shared-document stages
  (Brainstorm through Tasks-drafting); once `tasks.md` is `approved`, each task's own `locked_by`
  is what's authoritative (`ai-framework task lock|unlock|assign|list`), letting independent tasks
  of the same feature be worked concurrently by separate agent sessions during Implement.
- `.ai/decisions/` — architecture decision records (append-only) and `decisions/pending/` for
  change proposals awaiting human approval.

Run `ai-framework doctor` if anything here looks inconsistent.
