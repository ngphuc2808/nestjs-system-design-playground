# Playbook: Plan Drafting

Purpose: draft a feature's `plan.md` from its resolved `brainstorm.md`/`clarify.md`, then run the
Plan-stage loop-back checkpoint the template itself describes — present a short summary, ask the
developer to decide, record the decision. The step right after `elicitation`, right before Tasks.

## Gate: clarify.md must have no open questions

Agent MUST read `clarify.md` first. If any row's `Status` is still `open`, agent MUST stop and
point the developer at `/elicitation` instead of drafting against unresolved ambiguity.

## Ground in the real repo

Agent MUST read `brainstorm.md`, `clarify.md`'s resolved answers, and relevant `core/*.md`
(`architecture.md`, `tech-stack.md`, `project-rules.md`, `test-strategy.md`) — the plan needs real
structure, not a generic template retrofitted onto the feature.

Check `project-rules.md`'s **Stage Skill Defaults** table for a Plan-stage entry (e.g. a
module/interface design technique). If one is listed, reach for it while shaping the approach —
unless the developer already named a different technique for this feature. No row, or no table at
all, is normal — draft the plan directly either way.

## Draft

Write `plan.md`'s body: approach, files/modules touched, rough sequencing — concrete enough for
Tasks to turn into a checklist. Ground every claim in what brainstorm/clarify actually
established; anything missing belongs back in `clarify.md` as a new question, not guessed.

## Self-review before presenting

Agent MUST check: no leftover `[TODO]`, the plan actually addresses brainstorm/clarify (not a
generic restatement), concrete enough to become tasks, no silent assumption on anything clarify
never resolved.

## Present a short summary, then ask

Agent MUST show a brief summary (not a full file dump), then present the decision as a structured
choice — e.g. Claude Code's `AskUserQuestion` tool with "Proceed to Task"/"Back to Clarify" as
selectable options — rather than a single conversational question requiring a free-text reply.
Fall back to a short labeled list ("1) Proceed to Task  2) Back to Clarify") where no such
selectable-option mechanism exists.

- **Proceed to Task** → agent SHOULD set `review_decision: proceed_to_task`,
  `based_on_clarify: <today>` (clarify.md has no version counter of its own — a date is the
  concrete anchor; interpretive choice, not spelled out in the source design), `journal.md`
  `stage: tasks` + a dated log line. Tasks itself is a separate step, not auto-drafted here.
- **Back to Clarify** → ask for the reason and new question(s); write the reason under `plan.md`'s
  `## Review Decision` heading, `review_decision: back_to_clarify`, bump `version` by 1; add the
  new question(s) to `clarify.md` as `status: open`; `journal.md` `stage: clarify` + a dated log
  line; recommend `/elicitation` again for the new question(s).

Same confirmation principle as `constitution-drafting`: the developer's explicit answer to the
proceed/back-to-clarify question *is* the deliberate approval — agent applies it the same turn,
no separate manual edit required.

## Output

- `plan.md` drafted (or revised, `version` bumped) with a recorded `review_decision`.
- On `back_to_clarify`: `clarify.md` gains new `open` question(s).
- `journal.md` gains a dated log line reflecting the new `stage`.
- Exits stating the resulting decision, stage, and the concrete next step.
