# Playbook: Tasks Drafting

Purpose: break an accepted `plan.md` into a concrete `tasks.md` checklist, then apply the
developer's approval decision — the step right after `plan-drafting`, right before `implement`.
The decision here sets `status: approved` on the framework's one hard gate (`AGENTS.md`), so treat
the confirmation with real weight, not as a formality.

## Gate: plan.md must say proceed_to_task

Agent MUST read `plan.md` first. If `review_decision` isn't `proceed_to_task`, stop and point the
developer at `/plan-drafting` instead of drafting against a plan that hasn't been accepted.

## Ground in the real repo

Agent MUST read `plan.md`'s full approach, `clarify.md`'s resolved answers, and relevant
`core/*.md` (`architecture.md`, `tech-stack.md`, `project-rules.md`, `test-strategy.md`).

`project-rules.md`'s **Stage Skill Defaults** table won't normally have a Tasks-stage entry by
design — this skill's own dependency-graph checklist already owns that job, and a Tier-1 skill that
publishes tickets to an external tracker would fragment `tasks.md` as the single source of truth.
Only deviate if the developer explicitly names a different technique for this feature; if the
table does list a Tasks-stage row anyway, it's still just a default — the developer's own
instruction overrides it.

## Draft

Break the approach into concrete, individually-actionable items in `tasks.md`. Group loosely by
phase where it helps (Setup/Core/Integration/Polish), skip phases that don't apply.

Assign each item a stable id (`T1`, `T2`, ...) in both the checklist line and a matching
frontmatter `tasks:` entry (`id`, `depends_on`, `status: pending`, `locked_by: ""`,
`locked_since: null`) — e.g. `- [ ] [T2] Build API endpoint (depends: T1)`. `depends_on` defaults
to `[]`; only list another task's id when this one genuinely can't start before that one is done —
don't invent a dependency nobody needs. This graph is what lets separate `implement` sessions lock
and work independent tasks of the same feature concurrently (`ai-framework task lock`) instead of
being forced through the whole checklist one task at a time. Anything the checklist reveals is
missing from `plan.md` goes back to the developer, not invented on the spot.

## Self-review before presenting

No leftover `[TODO]`, every item concrete enough to start without re-reading `plan.md`, nothing
invented beyond what `plan.md`/`clarify.md` established.

## Present a short summary, then ask

Agent MUST read `journal.md`'s `rigor.level` before presenting the choice — call it out alongside
the options if `strict` (analyze is "strongly recommended" at that rigor per `AGENTS.md`), but
offer the analyze option regardless of rigor; a developer can want a second look at any rigor
level, not only at `strict`.

Agent MUST show a brief summary (not necessarily the full file for a long list), then present the
approval decision as a structured choice — e.g. Claude Code's `AskUserQuestion` tool with
**"Approve — start implementing" / "Run `/analyze` first, then decide" / "Not yet"** as selectable
options — rather than a single conversational question requiring a free-text reply. Fall back to a
short labeled list where no such selectable-option mechanism exists. Because this is the
framework's one hard gate, make sure the developer actually looked at the list (or its summary)
before answering.

- Confirmed ("Approve") → agent SHOULD set `status: approved` itself, same turn, then continue
  straight into `implement`'s own procedure in the same turn — don't stop and make the developer
  separately type `/implement`. Unlike a passive recommendation elsewhere in this framework (never
  auto-invoked), this option is literally labeled "Approve — start implementing": clicking it
  already is the explicit instruction to start, the same way a spoken "yes" counts as approval
  without also requiring a manual file edit.
- "Run `/analyze` first" → `status` untouched. Agent runs `analyze`'s own procedure in the same
  turn against the current artifacts, shows the report, then re-presents this same three-way choice
  — informed by the findings — rather than treating "ran analyze" as itself an approval.
- Wants changes → revise and ask again; `status` untouched.
- Unsure ("Not yet") → leave `pending_approval`, tell them exactly which line to edit whenever
  ready.

`journal.md`'s `stage` stays `tasks` here — `implement` is what advances it to `stage: implement`
(now invoked in the same turn once confirmed, rather than as a separate developer-initiated step).

## Output

- `tasks.md` drafted with a concrete checklist and a recorded `status`.
- If approved: continues straight into `implement` in the same turn — its own finish-summary
  covers what happens next.
- If still `pending_approval`: exits with the item count and what's still blocking approval.
