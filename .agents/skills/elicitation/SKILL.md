---
name: elicitation
description: Ask targeted clarifying questions for a feature and record them in its clarify.md before plan.md is written. Use at the Brainstorm-to-Clarify step of a feature, especially when rigor is strict or the request is under-specified.
---

# Elicitation

Given a feature under `.ai/features/<NNN>-<slug>/`, turn ambiguity in its `brainstorm.md` into
concrete questions in `clarify.md` — don't guess at requirements that are genuinely unclear.

## Steps

1. Read `brainstorm.md` and whichever `.ai/core/*.md` files are relevant to this feature,
   including `project-rules.md`'s **Stage Skill Defaults** table for a Clarify-stage entry (e.g.
   an interview-discipline technique). If one is listed, run the questioning per its technique
   instead of improvising your own — unless the developer already directed a different approach
   for this feature. No row, or no table at all, is normal — fall back to the steps below either
   way.
2. Draft questions that close **real** ambiguity — skip anything you could answer yourself by
   reading the code or a `core/*.md` file with `confidence: high`.
3. Add each question to `clarify.md`'s table with `status: open`.
4. Ask the developer the open questions directly in conversation.
5. When answered, update the row: `status: resolved`, and record the answer in the `Answer`
   column. Never delete a question — the resolved history is the audit trail.

## Boundaries

This is scoped elicitation for one feature — not a general requirements-gathering exercise. Stop
once `plan.md` has enough to proceed; don't keep fishing for more questions once the real
ambiguity is resolved.
