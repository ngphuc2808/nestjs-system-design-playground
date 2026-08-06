# Playbook: Implement

Purpose: execute an approved `tasks.md` checklist for real, keeping `progress.md`'s per-task
`drift_check` honest as it goes. The step right after `tasks-drafting` (optionally after
`analyze`).

## Re-check the gate — don't trust it was already checked

Agent MUST read `tasks.md`'s frontmatter and MUST NOT proceed unless `status: approved`. This is
the framework's one hard gate (`AGENTS.md`) — do not proceed "just this once." The check is
deliberately redundant with the framework-wide rule, same defense-in-depth principle as
`security-boundaries.md`.

## Ground in context

Read `tasks.md`, `plan.md`, any existing `progress.md` rows (this may not be the first run), and
relevant `core/*.md` (`architecture.md`, `tech-stack.md`, `project-rules.md`, `test-strategy.md`).

Check `project-rules.md`'s **Stage Skill Defaults** table for an Implement-stage entry (e.g. a
test-first or bug-diagnosis discipline). If one is listed, apply it while executing tasks — unless
the developer already named a different technique for this feature. No row, or no table at all, is
normal — execute directly either way.

## Mark the stage

Agent MUST set `journal.md`'s `stage: implement` on first run, with a dated log line.

## Ask before starting — direct, or hand off to a subagent

Agent MUST ask the developer, before touching any task, whether this run should execute directly
in this conversation or be delegated to a subagent. Don't default to either silently.

- **Direct**: continue with the rest of this playbook as below.
- **Subagent**: only if the developer explicitly agrees, and only if the current tool can actually
  launch one (e.g. Claude Code's `Agent` tool). Initialize a subagent for this feature, handing it
  the feature `slug`, the path to its `tasks.md`/`plan.md`, and the instruction to run this same
  `implement` playbook to completion. Wait for its result and relay its finished summary (see
  "Output" below) back to the developer as your own — don't just report "done."
- **Multiple parallel subagents**: only offer this when the current tool can launch subagents *and*
  `ai-framework task groups <slug>` reports more than one group with startable work — otherwise
  skip straight to the two-way choice above, a third option that would do nothing isn't worth
  offering.
  1. Run `ai-framework task groups <slug>`. Each group is a connected component of the
     `depends_on` graph: tasks that depend on each other, directly or through a shared dependency,
     always land in the same group, because no subagent here can learn that a *different* subagent
     just finished a task it was waiting on — one subagent per group is what's actually safe. Never
     split a group across subagents or merge two groups into one subagent's job.
  2. Show the developer the groups and the subagent count that implies; surface any reported cycle
     plainly (needs a `tasks-drafting`/`plan.md` fix, not a workaround here).
  3. Ask the developer to confirm that count or cap it lower. If capped, work in rounds — spawn one
     subagent per group up to the cap, wait for the round to finish, then start the next round with
     the remaining groups. Never merge unrelated groups to fit under the cap.
  4. Each subagent gets the same self-sufficient briefing as the single-subagent branch above, plus
     one restriction: it only works the task ids in its assigned group, in the printed order — it
     still locks/unlocks each task itself through the normal flow below; the group assignment is a
     planning convention, not a replacement for the lock.
  5. Wait for every subagent in a round, relay each finished summary as it lands, then move to the
     next round if groups remain.
- If the current tool has no subagent-launching capability, say so plainly and continue direct —
  never fall back silently on a choice the developer didn't actually get to make.
- Ask once per `implement` run, not once per task.

## Pick a task and lock it

Task-level locking (`ai-framework task lock <slug> <task-id>`) is what lets separate agent sessions
work the same feature's independent tasks concurrently, instead of serializing the whole checklist
through one lock like the pre-Task stages do. Within a single session, still default to working one
task at a time, top to bottom, unless the developer explicitly asks you to fan out.

Before starting a task: pick one that's `pending` in `tasks.md`'s `tasks:` array, whose
`depends_on` are all already `done`, and that isn't `locked_by` someone else — then run
`ai-framework task lock <slug> <task-id>`. If it refuses (gate not approved, a dependency isn't
done yet, or someone else holds it), don't force it — pick a different eligible task, or stop if
none are eligible and tell the developer why.

## Execute

Per locked task: implement it for real, tick it `[x]` in `tasks.md`'s checklist, set its `tasks:`
entry `status` (`done`, or `blocked` — see step 6), record its row in `progress.md`
(`Task | Status | drift_check`). `drift_check: aligned` unless implementing it honestly required
deviating from what `plan.md` actually said — then `needs_review`. Once its status is set, run
`ai-framework task unlock <slug> <task-id>` to free it — this matters most for `blocked` tasks, so
someone else can pick them up.

## Drift is a hard stop

Agent MUST stop immediately the moment any task's `drift_check` becomes `needs_review` — do not
start the next task. Tell the developer exactly what diverged and why; ask whether to update
`plan.md` (via `/plan-drafting`), adjust the current work to match the existing plan, or explicitly
accept the deviation (and update `plan.md` to match reality). This is the rule `AGENTS.md` already
states in prose that nothing previously executed.

## Task failure

Mark `progress.md`'s row `Status: blocked`, set the task's `tasks:` entry `status: blocked` and
`ai-framework task unlock` it so someone else can pick it up, report why, and stop rather than skip
ahead silently.

## Completion

Once every task is ticked and every `progress.md` row is `done`/`aligned`: set `journal.md`'s
`stage: test-plan`. Read `test-plan.md` — if it has a real `test_command`, run it if safe to do so
and report pass/fail; if still `null`, tell the developer it needs filling in first (manually, or
via `/reverse-search` against `core/test-strategy.md`).

Once in `stage: test-plan`, check `project-rules.md`'s **Stage Skill Defaults** table for a Test
Coverage-stage entry (e.g. a test-plan-authoring, QA-session, or diff-review technique). If one is
listed, recommend it to the developer as the next step — never invoke it unprompted, same
"recommend, don't auto-run" rule as every other playbook suggestion in this framework.

## Output

- `tasks.md` fully ticked, `progress.md` rows reflecting real status/drift per task.
- `journal.md` advanced to `stage: test-plan` (or stopped mid-way with a clear reason if drift or
  a blocker interrupted execution).
- Exits with a summary: tasks completed, any drift flagged and how it was resolved, test-command
  result if one ran.
