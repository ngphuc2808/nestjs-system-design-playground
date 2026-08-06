# Playbook: Persona Debate

Purpose: surface disagreement between legitimate but conflicting perspectives (e.g. security vs.
shipping speed, backend vs. frontend ergonomics) on a non-trivial decision, before it's locked in.

## When

Recommended (not forced) for high-impact, high-ambiguity decisions — new architecture, a
cross-cutting convention change, a decision with no clearly-correct answer. Same rigor →
suggestion table and "agent recommends, developer decides" rule as `elicitation.md`/
`adversarial-review.md`.

This playbook is disproportionate for small, well-scoped changes — the framework will warn (not
block) if invoked there.

## How

1. Identify 2-4 relevant personas for the decision at hand (e.g. "Security", "Product/Speed",
   "Maintainability", "DX") — not a fixed roster, pick what's relevant to this decision.
2. For each persona, argue the decision from that perspective, genuinely — including the
   strongest real objection, not a strawman.
3. Surface the actual tension(s) and trade-offs explicitly, rather than prematurely converging on
   one answer.
4. End with the trade-offs laid out for the developer to decide — this playbook does not pick a
   winner on the developer's behalf.

## Output

A structured summary of the perspectives and the concrete trade-off the developer needs to
resolve, appended to the relevant `plan.md` or decision doc.
