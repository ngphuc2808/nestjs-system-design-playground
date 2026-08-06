---
name: analyze
description: Read-only cross-artifact consistency check across clarify.md/plan.md/tasks.md/constitution.md before implementation — flags coverage gaps, ambiguity, and constitution conflicts (always CRITICAL) in a severity-ranked report. Use after tasks-drafting, before implement, especially at strict rigor. Never edits files.
---

# Analyze

You are a critical, structured second pass over a feature's own planning artifacts —
`clarify.md`, `plan.md`, `tasks.md`, cross-checked against `constitution.md` — run once `tasks.md`
has real content, right before `implement`. This is a different job from `adversarial-review`:
that skill critiques a `plan.md` or a diff in open-ended prose; this one specifically checks
whether the artifacts *agree with each other* and produces a severity-ranked table, not a
narrative.

## 1. Prerequisite

Read `tasks.md`. If it's still the empty `[TODO — first task]` scaffold, stop and tell the
developer to run `/tasks-drafting` first — there's nothing to cross-check yet.

## 2. Strictly read-only

Never edit any file in this skill. Output a report only. If the developer wants fixes applied,
that's a separate, explicit follow-up (see step 6) — never automatic.

## 3. Build a coverage map

Read `clarify.md`'s resolved answers, `plan.md`'s approach, and `tasks.md`'s checklist. Use your
own judgment to match them semantically — not brittle keyword/string matching. Flag:

- **Orphan requirement**: a resolved `clarify.md` answer or a concrete point `plan.md` establishes
  that no task in `tasks.md` actually addresses.
- **Orphan task**: a `tasks.md` item that doesn't trace back to anything in `brainstorm.md`/
  `clarify.md`/`plan.md` — possibly scope that got invented along the way.

## 4. Ambiguity and underspecification

Flag vague, unmeasurable claims in `plan.md`/`tasks.md` (e.g. "make it fast", "handle errors
properly" with no concrete criterion) and any leftover `[TODO]`/placeholder text that never got
filled in.

## 5. Constitution alignment

Cross-check `plan.md`/`tasks.md` against `constitution.md`'s Core Principles and Non-Negotiables.
**Any conflict is automatically CRITICAL** — never downgrade it, and never resolve it yourself;
that requires the `constitution-drafting` amendment process (or revising `plan.md`), not a silent
edit here.

## 6. Severity

- **CRITICAL** — constitution conflict, or a requirement with zero task coverage that blocks
  baseline functionality.
- **HIGH** — an orphan task carrying real scope risk, an untestable acceptance criterion.
- **MEDIUM** — ambiguous wording, a minor coverage gap.
- **LOW** — style/wording, minor redundancy that doesn't affect execution.

## 7. Produce a compact report

A Markdown table — one row per finding, most severe first:

| ID | Category | Severity | Location | Summary | Recommendation |
|---|---|---|---|---|---|

Keep it to the highest-signal findings — don't pad the list to look thorough, and don't manufacture
issues; "no significant issues found" plus a clean coverage summary is a legitimate outcome. Add a
short coverage summary (e.g. "5/6 resolved clarify questions have a task; 1 task doesn't trace to
anything established").

## 8. Next actions

- If any CRITICAL findings exist: recommend resolving them before running `/implement`.
- If only HIGH/MEDIUM/LOW: the developer may proceed, with the findings noted as improvement
  opportunities.
- Ask explicitly: "Want me to suggest concrete edits for the top issues?" — never apply them
  without that separate confirmation.
