---
name: adversarial-review
description: Deliberately critical review pass over a feature's plan.md or a pre-merge diff, hunting for unhandled edge cases, security-boundary violations, and silently broken contracts. Use before committing to an implementation approach (Plan to Task) or before merging/opening a PR, especially at strict rigor.
---

# Adversarial Review

Review the artifact under review (a `plan.md`, or an actual diff) as critically as you can,
cross-referencing the relevant `.ai/core/*.md` files it should be consistent with.

## Look for

- Unhandled edge cases the plan/diff doesn't account for.
- Security boundary violations — cross-check `.ai/core/security-boundaries.md` and
  `.ai/core/destructive-actions.md`.
- Silently changed or broken public contracts.
- Claims in the plan that don't actually match what the code/plan does.

## Rules

- Don't manufacture findings to pad the list. "No significant issues found" is a legitimate,
  honest outcome.
- Rank findings by severity.
- This skill never edits code or `plan.md` directly — it reports to the developer, who decides
  what to act on.
- If this review seems disproportionate to the size/risk of the change (e.g. invoked on a
  one-line fix), say so, but still complete it if asked.
