---
name: tasks-drafting
description: Draft a feature's tasks.md checklist from its approved plan.md, present a short summary, and — once the developer explicitly confirms in conversation — set tasks.md's status to approved. Refuses to draft while plan.md hasn't reached proceed_to_task.
---

# Tasks Drafting

You are writing `.ai/features/<NNN>-<slug>/tasks.md` from a feature whose plan has been accepted,
then applying the developer's approval decision — the step right after `plan-drafting` and right
before `implement`. Unlike every other confirmation this framework asks for, the decision here
sets `status: approved` on **the one hard gate the entire framework is built around**
(`AGENTS.md`: "Agent MUST NOT execute any task... until status is approved") — treat the
confirmation step (6 below) with real weight, not as a formality to rush past.

## 1. Gate: plan.md must say proceed_to_task

Read `plan.md`. If `review_decision` isn't `proceed_to_task` yet, stop here — tell the developer
`/plan-drafting` hasn't concluded, and point them at it instead of drafting a checklist
against a plan that hasn't actually been accepted.

## 2. Ground yourself in the real repo

Read `plan.md`'s approach in full, `clarify.md`'s resolved answers, and whichever `core/*.md`
files are relevant (`architecture.md`, `tech-stack.md`, `project-rules.md`, `test-strategy.md`).
The checklist needs to reference real files/modules `plan.md` already named — not a generic
"implement the feature" restatement.

`project-rules.md`'s **Stage Skill Defaults** table won't normally have a Tasks-stage entry by
design — this skill's own dependency-graph checklist already owns that job, and a Tier-1 skill that
publishes tickets to an external tracker would fragment `tasks.md` as the single source of truth.
Only deviate if the developer explicitly names a different technique for this feature; if the
table does list a Tasks-stage row anyway, it's still just a default — the developer's own
instruction overrides it.

## 3. Draft the checklist

Break `plan.md`'s approach into concrete, individually-actionable checklist items in `tasks.md`.
Group loosely by phase where it genuinely helps (e.g. `## Setup`, `## Core`, `## Integration`,
`## Polish`) — skip any phase that doesn't apply, don't force a fixed template.

Assign each item a stable id (`T1`, `T2`, ...) and add a matching entry to the frontmatter `tasks:`
array (`id`, `depends_on`, `status: pending`, `locked_by: ""`, `locked_since: null`). Tag the
checklist line with its id so the two stay cross-referenceable: `- [ ] [T2] Build API endpoint
(depends: T1)`. `depends_on` defaults to `[]` (independent) — only list another task's id when this
one genuinely can't start before that one is done; don't invent a dependency that isn't real, and
don't force artificial sequencing on tasks that just happen to be listed in reading order. This
`depends_on` graph is what lets `implement` — including separate concurrent agent sessions, via
`ai-framework task lock` — work independent tasks of the same feature in parallel instead of being
forced through the whole checklist one task at a time.

Ground every item in what `plan.md` actually established. If writing a real task here reveals
something `plan.md` never decided (a missing detail, an approach gap), that belongs back in
`plan.md` — flag it to the developer rather than quietly inventing scope to fill the gap.

## 4. Review your own draft before showing it

Check for: no leftover `[TODO]` placeholder text, every item concrete enough that someone could
start it without re-reading `plan.md`, and no invented requirement `plan.md`/`clarify.md` never
established.

## 5. Present a short summary — not the full file

Give the developer a brief summary (the phases, the item count, anything you flagged as missing
from `plan.md`) — not a full dump of `tasks.md`. For a short list, showing the whole thing is
fine; for a long one, a summary plus "open the file for the full list" is more useful than a wall
of text.

## 6. Ask for confirmation, then apply it yourself

Read `journal.md`'s `rigor.level` before presenting the choice — mention it alongside the options
if it's `strict` (analyze is "strongly recommended" at that rigor per `AGENTS.md`'s rigor table),
but offer the analyze option regardless of rigor: a developer can be unsure about a checklist at
any rigor level, not only at `strict`.

Present this as a structured choice, not open-ended prose. If your environment offers a way to
show selectable options (e.g. Claude Code's `AskUserQuestion` tool), use it with clear choices —
**"Approve — start implementing" / "Run `/analyze` first, then decide" / "Not yet, let me review
more"** — instead of a single conversational question like "shall I mark `tasks.md` as approved?"
that requires parsing a free-text reply. If no such mechanism is available, present the same three
choices as a short labeled list. Because this is the framework's one hard gate, make sure the
developer actually looked at the list (or its summary) before answering, not just reflexively
confirming; if the list is long, remind them they can open the full file first.

- **If they confirm ("Approve — start implementing")**: set `tasks.md`'s `status: approved`
  yourself, in the same turn. The developer's explicit, deliberate answer in conversation satisfies
  the same "no state change without explicit developer approval" rule as everywhere else in this
  framework (same principle `constitution-drafting`/`plan-drafting` already apply) — don't also
  make them hand-edit YAML for something they just confirmed out loud. Then, in the same turn,
  continue straight into the `implement` skill's own procedure against the now-approved `tasks.md`
  — don't stop here and make the developer separately type `/implement` themselves. This is a
  deliberate exception to this framework's usual "recommend, never auto-invoke" rule: elsewhere a
  recommendation is passive (the developer hasn't said "go" yet), but this option is literally
  labeled "Approve — start implementing" — clicking it already is the explicit instruction to
  start, the same way a spoken "yes" elsewhere in this framework counts as approval without also
  requiring a manual file edit.
- **If they pick "Run `/analyze` first, then decide"**: don't touch `status` yet. Run `analyze`'s
  own full procedure in the same turn (its `SKILL.md`) against the current `clarify.md`/`plan.md`/
  `tasks.md`/`constitution.md`, show its report, then **re-present this same three-way choice** —
  now informed by the findings — rather than assuming the developer wants to approve just because
  they asked to see the report. Same reasoning as the "Approve" branch: an explicit request to run
  analyze is itself the explicit instruction to run it now, not a passive recommendation to relay.
- **If they want changes**: revise the checklist and ask again. Do not touch `status`.
- **If they're unsure or want to review it themselves first ("Not yet")**: leave
  `status: pending_approval` and tell them exactly which line to change (`status: approved`)
  whenever they're ready — the fallback path, not the default one.

Don't touch `journal.md`'s `stage` here — it stays `tasks` for the whole Tasks phase; `implement`
is what advances it to `stage: implement` when execution actually begins.

## 7. Finish with a summary

State how many checklist items were drafted and `tasks.md`'s resulting `status`.

- **If approved**: don't stop here — this is where step 6 continues straight into `implement`'s
  own procedure in the same turn; that skill's own finish-summary covers what happens next, not a
  separate "run `/implement`" recommendation from this skill.
- **If still `pending_approval`**: tell the developer what's blocking it. `/analyze` was already
  offered as one of the three choices in step 6 — no need to mention it again here as an
  afterthought.
