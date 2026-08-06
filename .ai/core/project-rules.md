---
provenance: manual
confidence: low
last_verified: "2026-08-05"
---

# Project Rules

<!-- TODO: run the `reverse-search` Claude Code skill against this repo, or fill in manually. -->

## Tier 1 — Coding Rules

### Naming
[TODO]

### Imports
[TODO]

### Folder Layout
[TODO]

## Tier 2 — Architectural Rules
[TODO — architecture the code MUST follow (prescriptive), used as a review checklist.
This is distinct from architecture.md, which describes what the architecture currently IS.]

## External Skill Defaults

<!-- TODO: fill in only if this repo actually has extra, non-canonical skills installed (e.g.
     Anthropic's example skills vendored under `skills/`, or `.claude/skills/`) beyond this
     framework's own 11 canonical ones (those are always available, never gated by this table).
     A dangling reference to a skill nobody installed is worse than leaving this table empty —
     confirm the skill's SKILL.md actually exists at the given path before adding a row.

     plan-drafting/tasks-drafting/implement already read this file during "ground yourself in the
     real repo" — a row here means: when a feature's plan/tasks touch the matching part of the
     codebase, default to reaching for that skill across the feature's whole lifecycle (Plan
     through Implement), not just one stage.

     Example row shape (this is illustrative, not a live default — delete once real rows exist):
       | Feature touches | Default skill | Skill location |
       |---|---|---|
       | Frontend structure (UI components/pages, styling, accessibility) | `ui-ux-pro-max` | `skills/ui-ux-pro-max/SKILL.md` |
       | Backend structure (schema, queries, migrations) | `databases` | `skills/databases/SKILL.md` | -->

| Feature touches | Default skill | Skill location |
|---|---|---|
| [TODO] | [TODO] | [TODO] |

## Stage Skill Defaults

<!-- TODO: fill in only if this repo has extra, non-canonical skills installed. Different axis
     from "External Skill Defaults" above: that table keys off *which part of the codebase* a
     feature touches; this one keys off *which stage of the feature lifecycle* the agent is
     currently in — Brainstorm/Clarify/Plan/Tasks/Implement/Test Coverage — regardless of what the
     feature touches. A stage with an existing canonical playbook (elicitation, plan-drafting,
     tasks-drafting, implement) already reads this table during its own procedure; a row here adds
     a *technique* on top of that playbook, it never replaces it. These are defaults, not gates:
     if the developer names a different skill/technique for a specific feature, that instruction
     wins for that feature — the table only fires when nothing else was requested.

     Where multiple installed skills serve the same purpose, keep only the strongest one(s) per
     stage (judge by clarity, agent-friendliness, and effectiveness) rather than listing every
     candidate — a stage with three redundant options is worse than a stage with one clear default.
     A stage with no genuinely new technique to add (its canonical playbook already covers the
     job) is left with no row on purpose — don't force a pick to fill the table.

     Worked example — real skill names actually vendored into this repo's own `.agents/skills/`
     bundle at the time this convention was written, kept here as a concrete illustration (not a
     live default for every repo — most repos won't have this exact bundle installed):

       | Stage | Default skill(s) | Why this one (others in the same bundle considered and skipped) |
       |---|---|---|
       | Brainstorm | `research`, `prototype` | ground the idea in real docs/facts before writing it down; cheaply validate a state-model/UI hunch. Neither competes with a canonical playbook — Brainstorm has none. |
       | Clarify | `grilling` | one-question-at-a-time interview discipline, explicit about facts-to-look-up vs decisions-to-ask. `grill-me` is a redundant thin alias for it; `loop-me` is the same discipline locked to an unrelated vocabulary — both skipped. |
       | Plan | `codebase-design`, `domain-modeling` | shared module/interface vocabulary, and an active discipline for keeping ADRs/glossary current as design decisions crystallize. `design-an-interface`'s parallel-subagent technique is real but situational (only worth it when the interface shape is genuinely contested) — invoke by name when needed rather than as a blanket default. `ubiquitous-language` is a narrower, invocation-gated subset of `domain-modeling` — skipped. |
       | Tasks | *(none)* | `tasks-drafting` already owns this job end-to-end. `to-tickets`/`to-spec`/`wayfinder` do similar work well, but they publish to an external issue tracker — using them here would fragment `tasks.md` as the single source of truth, so they're excluded on architectural grounds, not quality. |
       | Implement | `tdd`, `diagnosing-bugs` | test-first discipline while executing each task; a structured diagnosis loop for when something breaks mid-implementation. This bundle's own `implement` skill is deliberately excluded — its name collides with this framework's canonical `implement` skill and it has none of the tasks.md-approval-gate/drift-check logic; if a bundle's skill id collides with one of this framework's 11 canonical ids, the canonical one always wins for that stage. |
       | Test Coverage | `testing-strategy`, `qa`, `code-review` | `testing-strategy` turns `plan.md`/`tasks.md` into the actual `test-plan.md` acceptance-criteria/test-case content — this framework has no canonical playbook that does that derivation. `qa` and `code-review` stay additive on top of it: an interactive bug-report session once the feature is working, and a structured two-axis (Standards/Spec) diff review. |
-->

| Stage | Default skill(s) | Skill location | Notes |
|---|---|---|---|
| Brainstorm | `ck:research`, `prototype` | `.claude/skills/research/SKILL.md`, `.claude/skills/prototype/SKILL.md` | Vendored via `ai-framework init/update --with-example-skills`; if not vendored in this repo, this row doesn't apply — brainstorm without them either way. |
| Test Coverage | `testing-strategy` | `.claude/skills/testing-strategy/SKILL.md` | Vendored via `ai-framework init/update --with-example-skills`; if not vendored in this repo, this row doesn't apply — fall back to filling `test-plan.md` manually. |

## Tier 3 — Governance Rules

### Core Docs Ownership

| File | Owner |
|---|---|
| constitution.md | [TODO] |

### Refresh Rules
See `.ai/core/tech-stack.md` and the review cadence rules (event / 30-day cadence / pre-release).

### Drift Rules
See `ai-framework check-drift`.

### Provenance Rules
See the `provenance` frontmatter field convention used across `.ai/core/*.md`
(`inferred` | `confirmed` | `manual`).
