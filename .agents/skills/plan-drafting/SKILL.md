---
name: plan-drafting
description: Draft a feature's plan.md from its resolved brainstorm.md/clarify.md, then present a short summary and explicitly ask the developer to decide proceed_to_task or back_to_clarify — the Plan-stage loop-back checkpoint. Refuses to draft while clarify.md still has open questions.
---

# Plan Drafting

You are writing `.ai/features/<NNN>-<slug>/plan.md` from a feature that has cleared Clarify, then
running the loop-back checkpoint the template itself describes: present, ask, record the
decision. This is the step right after `elicitation` and right before Tasks.

## 1. Gate: clarify.md must have no open questions

Read `clarify.md`. If any row's `Status` is still `open`, stop here — tell the developer which
questions remain and point them at the `/elicitation` skill. Don't draft a plan against
unresolved ambiguity; that's exactly the premature-assumption failure mode `elicitation` exists
to prevent.

## 2. Ground yourself in the real repo

Read `brainstorm.md`, all of `clarify.md`'s resolved answers, and whichever `core/*.md` files are
relevant (`architecture.md`, `tech-stack.md`, `project-rules.md`, `test-strategy.md`). The plan
needs to reference real structure — actual modules/files/conventions — not a generic template
retrofitted onto this feature.

While there, check `project-rules.md`'s **Stage Skill Defaults** table for a Plan-stage entry (e.g.
a module/interface design technique). If one is listed, reach for it while shaping the approach —
unless the developer already named a different technique for this feature. No row, or no table at
all, is normal — draft the plan directly either way.

## 3. Draft the plan

Write `plan.md`'s body: the approach, the files/modules it touches, and a rough sequencing —
concrete enough that Tasks can turn it into a checklist. Ground every claim in what brainstorm/
clarify actually established; don't introduce new scope or requirements that were never
discussed — if something is missing to write a real plan, that itself belongs back in `clarify.md`
as a new question (see step 6), not filled in by guessing.

Leave `review_decision` as `null` for now — that's set in step 6, after the developer decides.

## 4. Review your own draft before showing it

Check for: no leftover `[TODO]` text, the plan actually addresses what brainstorm/clarify
established (not a generic restatement), concrete enough to become tasks, and it doesn't silently
assume an answer to something clarify.md never actually resolved.

## 5. Present a short summary — not the full file

Give the developer a brief summary of the plan (the approach and what it touches, a few
sentences) — not a full dump of `plan.md`. They can always open the file for the complete text;
the summary is what makes the next question answerable without re-reading everything.

## 6. Ask, then apply the decision yourself

Present this as a structured choice, not open-ended prose. If your environment offers a way to
show selectable options (e.g. Claude Code's `AskUserQuestion` tool), use it with two clearly
labeled choices — "Proceed to Task" and "Back to Clarify" — instead of a single conversational
question the developer has to answer in free text. If no such mechanism is available, present the
same two choices as a short labeled list (e.g. "1) Proceed to Task  2) Back to Clarify") the
developer can point at directly, rather than asking "Does this look right?" and parsing prose out
of the reply.

- **Proceed to Task**: set `plan.md`'s `review_decision: proceed_to_task` and
  `based_on_clarify: <today's date>` (marking which resolved state of `clarify.md` this plan was
  drafted against — `clarify.md` has no version counter of its own, so a date is the concrete
  anchor; this is an interpretive choice, not something the source design spelled out). Update
  `journal.md`: set `stage: tasks`, append a dated log line. Tell the developer Tasks is next —
  don't draft `tasks.md` yourself, that's a separate step.
- **Back to Clarify**: ask for the reason and the new question(s) this surfaced. Write the reason
  under `plan.md`'s `## Review Decision` heading, set `review_decision: back_to_clarify`, bump
  `version` by 1. Add the new question(s) to `clarify.md`'s table with `status: open`. Update
  `journal.md`: set `stage: clarify`, append a dated log line. Recommend running `/elicitation`
  again for the new question(s).

Same principle as `constitution-drafting`'s confirmation gate: the developer's explicit answer to
this question *is* the deliberate approval this framework requires before a state change — apply
it yourself in the same turn, don't hand the file back for a manual edit.

## 7. Finish with a summary

State the resulting `review_decision`, the new `journal.md` stage, and the concrete next step
(write `tasks.md`, or resolve the new clarify question(s)).
