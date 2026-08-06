# Playbook: Analyze

Purpose: a structured, read-only cross-check that `clarify.md`/`plan.md`/`tasks.md` actually agree
with each other and with `constitution.md`, run once `tasks.md` has real content, right before
`implement`. Distinct from `adversarial-review` (open-ended critique of one artifact/diff) — this
one specifically builds a coverage map and a severity table across all three.

## When

Recommended (not forced) at the Tasks → Implement checkpoint, especially at `rigor: strict`. Same
rigor → suggestion table and "agent recommends, developer decides" rule as the other playbooks.

## Prerequisite

If `tasks.md` is still the empty scaffold, stop and point the developer at `/tasks-drafting` first.

## Operating constraints

**STRICTLY READ-ONLY** — never modify any file. Output a report; offer to suggest remediation
edits, but never apply them without a separate, explicit confirmation.

**Constitution is non-negotiable within this analysis** — any conflict between `plan.md`/
`tasks.md` and `constitution.md`'s Core Principles/Non-Negotiables is automatically CRITICAL.
Resolving it means amending `constitution.md` (via `/constitution-drafting`) or revising the plan —
never a silent edit here.

## How

1. Read `clarify.md`'s resolved answers, `plan.md`'s approach, `tasks.md`'s checklist,
   `constitution.md`.
2. Build a coverage map by judgment (not keyword matching): flag **orphan requirements**
   (a resolved clarify answer or plan point with no task addressing it) and **orphan tasks**
   (a checklist item that doesn't trace back to anything established).
3. Flag ambiguity: vague unmeasurable claims, leftover `[TODO]`/placeholder text.
4. Flag constitution conflicts — always CRITICAL.
5. Assign severity: CRITICAL (constitution conflict, zero-coverage requirement blocking baseline
   functionality) / HIGH (risky orphan task, untestable acceptance criterion) / MEDIUM (ambiguous
   wording, minor coverage gap) / LOW (style).

## Output

A Markdown table (ID | Category | Severity | Location | Summary | Recommendation), most severe
first, plus a short coverage summary. Keep it to genuinely high-signal findings — "no significant
issues found" is a legitimate outcome, don't manufacture findings to pad the list.

## Next actions

- CRITICAL present → recommend resolving before `/implement`.
- Only HIGH/MEDIUM/LOW → developer may proceed, findings noted as improvement opportunities.
- Ask explicitly whether the developer wants remediation edits suggested — never apply
  automatically.
