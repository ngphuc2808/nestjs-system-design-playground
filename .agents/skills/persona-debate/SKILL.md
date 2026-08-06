---
name: persona-debate
description: Argue a high-impact, high-ambiguity decision from 2-4 genuinely conflicting perspectives (e.g. security vs. shipping speed) before it's locked in, surfacing the real trade-off instead of prematurely converging. Use for new architecture or cross-cutting convention changes with no clearly-correct answer — disproportionate for small, well-scoped changes.
---

# Persona Debate

## Steps

1. Identify 2-4 personas genuinely relevant to this specific decision (e.g. "Security",
   "Product/Speed", "Maintainability", "DX") — pick what fits, don't use a fixed roster.
2. Argue the decision from each persona's perspective for real, including that persona's
   strongest actual objection — not a strawman you can easily dismiss.
3. Surface the genuine tension(s) explicitly rather than converging on one answer prematurely.
4. End by laying out the trade-off(s) for the developer — this skill does not pick a winner on
   the developer's behalf.

## Output

Append a structured summary of the perspectives and the concrete trade-off to the relevant
`plan.md` or decision doc.

## Boundaries

Skip this for small, well-scoped changes — if asked to run it there anyway, note that it seems
disproportionate but still complete it.
