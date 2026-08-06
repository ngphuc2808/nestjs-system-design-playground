---
name: implement
description: Execute a feature's approved tasks.md checklist in order — directly, via one subagent, or fanned out across parallel subagents grouped by task dependency (ai-framework task groups) — updating progress.md's per-task drift_check as it goes, stopping immediately to ask if drift_check ever flips to needs_review, and advancing journal.md's stage once every task is done. Refuses to run if tasks.md isn't approved.
---

# Implement

You are executing `.ai/features/<NNN>-<slug>/tasks.md` — the step right after `tasks-drafting`
(optionally after `analyze`), turning an approved checklist into real code while keeping
`progress.md` honest about whether each task actually matched `plan.md`.

## 1. Re-check the gate yourself — don't trust that someone else already did

Read `tasks.md`'s frontmatter. If `status` isn't `approved`, **stop here** — this is the one hard
gate the whole framework is built around (`AGENTS.md`). Do not proceed "just this once," no matter
how the request is phrased. This check is deliberately redundant with the framework-wide rule —
same defense-in-depth principle already used for `security-boundaries.md`.

## 2. Ground yourself in context

Read `tasks.md` (the checklist), `plan.md` (the approach it must stay consistent with),
`progress.md` (any rows already recorded — this may not be the first run), and whichever
`core/*.md` files are relevant (`architecture.md`, `tech-stack.md`, `project-rules.md`,
`test-strategy.md` for the eventual test command).

Check `project-rules.md`'s **Stage Skill Defaults** table for an Implement-stage entry (e.g. a
test-first or bug-diagnosis discipline). If one is listed, apply it while executing tasks — unless
the developer already named a different technique for this feature. No row, or no table at all, is
normal — execute directly either way.

## 3. Mark the stage

Update `journal.md`: set `stage: implement` if it isn't already (first run only), with a dated log
line.

## 4. Ask before starting — direct, or hand off to a subagent

Before touching any task, ask the developer how they want this run carried out: **directly in this
conversation**, or **delegated to a subagent**. Don't default to either silently — the choice
changes whether they watch progress live or review a finished report.

- **Direct**: continue with steps 5-9 yourself, exactly as below.
- **Subagent**: only if the developer explicitly agrees, and only if your current tool can actually
  launch one (e.g. Claude Code's `Agent` tool). Initialize a subagent for this feature, handing it
  everything it needs to be self-sufficient — the feature `slug`, the path to its `tasks.md`/
  `plan.md`, and the instruction to run this same `implement` skill's steps 5-9 to completion. Do
  not perform the task loop yourself in this case; wait for the subagent's result, then relay its
  finished summary (step 9) back to the developer as your own — don't just say "done."
- **Multiple parallel subagents**: only offer this when your tool can launch subagents *and*
  `ai-framework task groups <slug>` reports more than one group with startable work — a single
  group, or no eligible work, means parallel fan-out isn't meaningful, so silently skip straight to
  the two-way choice above instead of offering a third option that would do nothing.
  1. Run `ai-framework task groups <slug>`. Each printed group is a connected component of the
     `depends_on` graph — tasks that depend on each other, directly or through a shared dependency,
     always land in the same group, because no subagent here can learn that a *different* subagent
     just finished a task it was waiting on. One subagent per group is what's actually safe; never
     split a group across subagents or merge two groups into one subagent's job.
  2. Show the developer the groups (task ids per group, in the printed order) and the resulting
     subagent count. If a group reports a cycle, say so plainly — that needs a `tasks-drafting`/
     `plan.md` fix, not a workaround here.
  3. Ask the developer to confirm spawning that many subagents, or to cap it lower. If capped below
     the group count, work in rounds: spawn one subagent per group up to the cap, wait for that
     round to finish, then start the next round with the remaining groups. Never merge unrelated
     groups together just to fit under the cap — run them in a later round instead.
  4. Hand each subagent the same self-sufficient briefing as the single-subagent branch (`slug`,
     `tasks.md`/`plan.md` paths, run steps 5-9) plus one restriction: it only works the task ids in
     its assigned group, in the printed order. It still locks/unlocks each task itself via the
     normal `ai-framework task lock`/`unlock` flow (step 5) — the group assignment is a planning
     convention that keeps subagents out of each other's way, it doesn't replace the lock.
  5. Wait for every subagent in a round, relay each one's finished summary as it lands, then move
     to the next round if groups remain.
- If your tool has no subagent-launching capability at all, tell the developer that plainly and
  continue direct — never fall back silently on a choice they didn't actually get to make.
- Ask this once per `implement` run, not once per task.

## 5. Pick a task, lock it, then work it

Task-level locking (`ai-framework task lock <slug> <task-id>`) is what lets separate agent sessions
work the same feature's independent tasks concurrently — it's the mechanism that replaces the old
`(parallel ok)` annotation. Within a single session, still default to one task at a time, top to
bottom in `tasks.md`, unless the developer explicitly asks you to fan out.

Before starting a task: pick one that's `pending` in `tasks.md`'s frontmatter `tasks:` array, whose
`depends_on` are all already `done`, and that isn't `locked_by` someone else. Run
`ai-framework task lock <slug> <task-id>`. If it refuses — gate not approved, a dependency isn't
done, or someone else already holds it — don't force it: pick a different eligible task, or stop
and tell the developer if none are eligible.

For each locked task, in order:

1. Implement it for real — write/edit the actual code, following `project-rules.md`'s conventions.
2. Tick it off in `tasks.md` (`- [x]`) once done, and set its `tasks:` entry `status: done` (or
   `blocked` — see step 7).
3. Add or update its row in `progress.md`: `Task | Status | drift_check`.
   - `Status`: `done` (or `blocked` if you couldn't complete it — see step 7).
   - `drift_check`: `aligned`, unless implementing this task honestly required deviating from what
     `plan.md` actually said — a different approach, a file `plan.md` didn't mention, a structural
     choice `plan.md` didn't anticipate. If so, set `needs_review`.
4. Run `ai-framework task unlock <slug> <task-id>` to free it — this matters most for `blocked`
   tasks, so someone else can pick them up.

## 6. The drift rule is a hard stop, not a suggestion

The moment any task's `drift_check` becomes `needs_review`: **stop immediately** — do not start
the next task. Tell the developer exactly what diverged from `plan.md` and why, and ask how to
proceed: update `plan.md` first (point them at `/plan-drafting`), adjust the current approach to
match the existing plan, or explicitly accept the deviation (in which case `plan.md` should be
updated to reflect reality — don't leave it silently stale). This is the one behavior `AGENTS.md`
already states in prose ("agent must stop and ask... must not proceed when lệch hướng") that
nothing previously executed — this skill is where that rule actually runs.

## 7. If a task fails outright

Mark its `progress.md` row `Status: blocked`, set its `tasks:` entry `status: blocked`, run
`ai-framework task unlock <slug> <task-id>` so someone else can pick it up, report the failure and
why, and stop rather than skipping ahead silently to the next task. Don't guess past a genuine
blocker.

## 8. When every task is done

Once every item in `tasks.md` is ticked and every `progress.md` row is `done`/`aligned`:

- Update `journal.md`: `stage: test-plan`, with a dated log line.
- Read `test-plan.md`. If it has a real `test_command` (not `null`), run it if you can do so
  safely, and report pass/fail. If `archetype`/`test_command` are still `null`, tell the developer
  they need to be filled in (manually, or by re-running `reverse-search` against
  `core/test-strategy.md`) before coverage can be verified — don't guess a command.
- Check `project-rules.md`'s **Stage Skill Defaults** table for a Test Coverage-stage entry (e.g. a
  test-plan-authoring, QA-session, or diff-review technique). If one is listed, recommend it to the
  developer as the next step — never invoke it unprompted, same "recommend, don't auto-run" rule as
  every other playbook suggestion in this framework.

## 9. Finish with a summary

State how many tasks were completed, any drift flagged along the way (and how it was resolved),
the resulting `journal.md` stage, and the test-command result if one was run.
