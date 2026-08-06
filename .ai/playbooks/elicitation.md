# Playbook: Elicitation

Purpose: turn a vague or under-specified feature request into a concrete `clarify.md` before
`plan.md` is written, by asking targeted questions rather than guessing.

## When

Recommended (not forced) at the Brainstorm → Clarify transition, especially at `rigor: strict`.
See the rigor → suggestion table below (from artifact §17, reused wherever a playbook is
recommended):

| Rigor | Suggestion |
|---|---|
| `light` | none |
| `standard` | optional |
| `strict` | strongly recommended |

Framework MAY recommend this playbook. Framework MUST NOT automatically execute it without
developer approval — the developer always decides whether to run it.

## How

1. Read `brainstorm.md` and the relevant `core/*.md` files, including `project-rules.md`'s
   **Stage Skill Defaults** table for a Clarify-stage entry (e.g. an interview-discipline
   technique). If one is listed, run the questioning per its technique instead of improvising one —
   unless the developer already directed a different approach for this feature. No row, or no
   table at all, is normal — fall back to the steps below either way.
2. Draft questions that close real ambiguity — not questions answerable by reading the code
   or `core/*.md` yourself.
3. Write each question into `clarify.md`'s table with `status: open`.
4. When the developer answers, mark `status: resolved` and record the answer inline — do not
   delete the question, so the resolution stays auditable.

## Boundaries

Don't ask about anything `reverse-search`/`core-refresh` could have already answered with
`confidence: high`. Don't ask more than necessary to unblock `plan.md` — this is scoped
elicitation for one feature, not a full requirements-gathering exercise.
