# Playbook: Adversarial Review

Purpose: a deliberately critical second pass over a `plan.md` or a pre-merge diff, looking for
what an optimistic first pass would miss — edge cases, security gaps, silently-changed contracts.

## When

Recommended (not forced) at two checkpoints: Plan → Task (before committing to an implementation
approach) and pre-merge/pre-PR. Same rigor → suggestion table as `elicitation.md` applies; same
"agent recommends, developer decides" rule.

Framework MAY warn when this playbook seems disproportionate to the change's complexity (e.g.
running it on a one-line bugfix). Framework MUST NOT block execution over that warning — it's
advisory only.

## How

1. Read the artifact under review (`plan.md`, or the actual diff) plus the relevant `core/*.md`
   files it should be consistent with.
2. Actively look for: unhandled edge cases, security boundary violations (cross-reference
   `security-boundaries.md`/`destructive-actions.md`), silently broken public contracts, and
   claims in the plan that don't match what the code/plan actually does.
3. Report findings ranked by severity. Don't manufacture findings to pad the list — an honest
   "no significant issues found" is a valid outcome.

## Output

A findings list (or a clean bill of health) presented to the developer — this playbook never
edits code or `plan.md` directly; it informs the human decision.
