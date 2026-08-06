---
name: reverse-search
description: Scan this repository to draft the ai-framework .ai/core/*.md files (constitution, tech-stack, architecture, database, api-spec, project-rules, glossary) from real code, with provenance/confidence tracking. Uses the CodeGraph index for faster scanning when the repo already has it initialized. Use when initializing ai-framework into an existing repo, or when core docs are thin/stale and need re-deriving from source.
---

# Reverse-Search

You are populating `.ai/core/*.md` from the real codebase instead of leaving them as placeholders.
This is a developer-invoked skill — never run it automatically as a side effect of something
else without being asked.

## 1. Pick a scan depth

Default to `standard` unless told otherwise:

| Level | Scope | Use when |
|---|---|---|
| `quick` | `package.json`, migration/schema dir, `src/modules/*`, `docs/` | First rough pass, or the repo is very large |
| `standard` | Directly relevant files + shared libs + related config | The default |
| `full` | Entire repository | Architecture audits, wide refactors |

Do not scan the entire repository unless explicitly asked, doing an architecture audit, or your
confidence in the `standard` pass is below ~80%.

## 2. Respect security boundaries

Read `.ai/core/security-boundaries.md` first. Never open, read, or summarize the contents of any
path matching its `protected_paths` list (`.env*`, keys, certs, secrets dirs). If you need to know
*whether* an env var exists, list its name only — never its value.

## 3. Use CodeGraph if this machine has it available

Two independent things can be missing, and both get the same fallback — plain Glob/Grep/Read,
exactly as this skill worked before CodeGraph support existed:

- **Not installed at all.** `codegraph` may not be on this machine's `PATH` — it's optional
  tooling, not a framework dependency, so plenty of machines running this skill won't have it.
  Check cheaply (e.g. `command -v codegraph`) before relying on it, and treat a "command not
  found" result the same as "unavailable," not as something to fix. Never install it yourself.
- **Installed but not initialized for this repo.** `<repo>/.codegraph/` doesn't exist, or
  `codegraph status <path>` reports "Not initialized." Never run `codegraph init` yourself either
  — indexing a repo for the first time is a side-effecting setup step outside what a read-only
  scan should trigger unattended.

Only distinguish the two in your step 9 summary: if it's installed but uninitialized, mention that
`codegraph init` would speed up the next pass. If it's not installed at all, say nothing —
recommending a new CLI install isn't this skill's call to make.

If it *is* installed and initialized, prefer it over raw file reads for the parts of scanning it
actually speeds up. It's a pre-built index, not a live grep, so it can lag behind uncommitted
changes — run `codegraph sync <path>` first if the working tree has substantial uncommitted
changes, and cross-check any dubious finding by reading the real file before writing it down.

| Instead of | Use | For |
|---|---|---|
| `Glob`/manual directory walk | `codegraph files -p <path>` | `architecture.md`'s real directory/module structure |
| `Grep` for a term across the repo | `codegraph query -p <path> <term>` | locating symbols/terms for `glossary.md`, routes for `api-spec.md`, entities for `database.md` |
| Reading several files to understand one area | `codegraph explore -p <path> <query...>` | a fast first pass over a subsystem before deciding which files still need a full `Read` |
| Reading a whole file just to see its shape | `codegraph node -p <path> -f <file> --symbols-only` | confirming a file's exports/classes without pulling its full body into context |

CodeGraph speeds up *finding and scoping* what to look at — it never replaces `Read` for a file
you're about to quote or derive exact content from. It also doesn't relax step 2: never run
`codegraph query`/`explore` in a way that would surface the contents of a `protected_paths` match,
and if a result happens to point into one, treat it the same as an unread file.

## 4. Scan and draft

Six of the 10 required `core/*.md` files get real content straight from what you find:
- `tech-stack.md` — actual dependency versions from `package.json`/lockfile.
- `architecture.md` — real directory/module structure, framework conventions in use.
- `database.md` — ORM/driver in `package.json` (`prisma`+`postgresql`/`pg` → sql,
  `mongoose` → nosql) to pick the variant; then real schema/entities.
- `api-spec.md` — framework signature (`express`/`@nestjs/core` → rest-ish,
  `graphql`/`apollo-server` → graphql, `@grpc/grpc-js` → grpc) to pick the variant; then real
  routes/operations.
- `project-rules.md` — conventions actually followed in the code (naming, folder layout).
- `glossary.md` — terms that appear >= 3 times, or are domain-specific, or are ambiguous common
  words given a project-specific meaning. Skip generic technical terms.

A seventh, `test-strategy.md`, needs a pass of its own — its scaffold ships empty
(`archetypes: []`) specifically waiting on this skill. Populate one `archetypes` entry per
directory that owns its own `package.json` (a monorepo package — or just the repo root if there's
only one), matching that package's dependency signature against the two canonical archetypes
(`api`: `express`/`@nestjs/core`-style deps; `frontend`: `react`/`next` deps plus real component
files):
```yaml
archetypes:
  - path: "apps/api/**"        # the package's real path glob
    archetype: api
    test_command: "cd apps/api && npm run test"   # that package's own package.json test script
```
Use the package's actual `test`/`e2e` script, never a guessed command. `ai-framework add-feature
--touches <path>` and `test-plan.md` scaffolding both depend on this list — skipping it silently
defeats their auto-fill. A package matching neither archetype is fine to leave out.

The remaining 3 required files aren't derived from code, so leave them exactly as `init`
scaffolded them unless the developer explicitly asks to extend them:
`security-boundaries.md`/`destructive-actions.md` are fixed policy statements, not facts about
this specific codebase; `constitution.md` has its own narrower rule — see step 6.

Write each file you *did* derive content for (everything above except
`security-boundaries.md`/`destructive-actions.md`, which don't change) with:
```yaml
provenance: inferred
confidence: low | medium | high
last_verified: <today>
```

## 5. project-rules.md's External Skill Defaults table

This table is different from every other section of `project-rules.md`: it isn't a convention the
code follows, it's a routing rule for *this framework's own agents* — which non-canonical skill to
default to reaching for across a feature's whole lifecycle (Plan through Implement) when that
feature touches a given part of the codebase. Populate it only from what's actually installed and
actually present, never from assumption:

1. Look for skills beyond this framework's own 11 canonical ones (`add-feature`, `elicitation`,
   `plan-drafting`, `tasks-drafting`, `implement`, `analyze`, `adversarial-review`,
   `persona-debate`, `core-refresh`, `constitution-drafting`, `reverse-search`) — check both
   `skills/*/SKILL.md` (a vendored reference bundle, if any) and `.claude/skills/*/SKILL.md`.
   Finding none is a completely normal outcome — leave the table as scaffolded (`[TODO]` row) and
   move on, don't invent a row to fill space.
2. For each one found, read its own frontmatter (`description`, `category`, `keywords`) to judge
   what codebase area it actually targets — never guess purely from its folder name.
3. Cross-reference that against the real structure you already found for `architecture.md`/
   `tech-stack.md` in this same pass. Only add a row where the skill's domain plausibly matches
   something that actually exists here (e.g. don't add a mobile-development skill's row if there's
   no mobile app directory or dependency in this repo) — an unmatched skill is left out silently,
   the same as an unmatched test archetype in step 4.
4. Write one row per confident match: `Feature touches` (plain description of the matching
   codebase area) | `Default skill` (the skill's id) | `Skill location` (the real path where you
   found its `SKILL.md`). Genuinely ambiguous cases (a skill that could plausibly serve two
   different domains found in this repo, or a domain split across multiple candidate skills) go
   into Open Questions (step 7) rather than a guessed row.
5. Never overwrite a row a human already filled in by hand — only replace rows still showing
   `[TODO]`. Same standing rule as everywhere else in this framework: inferred content may refresh
   freely, manually-authored content is never silently replaced.

## 5b. project-rules.md's Stage Skill Defaults table

A second, different axis on the same skills found in step 5: instead of *codebase area*, this
table keys off *which stage of the feature lifecycle* (Brainstorm/Clarify/Plan/Tasks/Implement/Test
Coverage) a skill's technique fits. Stage fit is judgment, not a path match, so hold this table to
a higher bar than the one above:

1. For each skill already found, judge from its own `description`/body whether it's a *technique*
   applicable at a specific stage (an interview discipline, a design vocabulary, a test-first
   discipline, a QA/review technique) — not a scaffolding tool, a repo-setup command, or something
   that publishes its own artifact to an external tracker (that would compete with
   `plan.md`/`tasks.md` as this framework's single source of truth — exclude those regardless of
   quality).
2. Where more than one candidate skill plausibly fits the same stage, don't add every one — this is
   never confident enough to auto-decide alone. Write the candidates and your reasoning into
   `.ai/core/open-questions.md` instead of guessing a winner, and ask the developer to confirm
   which (if any) becomes the default.
3. Never overwrite a row a human already filled in by hand — only ever propose additions for rows
   still `[TODO]`, and only as a question, never a silent write (unlike the table in step 5, which
   may write confident matches directly — stage-fit isn't confident enough for that).
4. Finding no plausible stage-fit is the normal outcome for most repos — leave the table as
   scaffolded and move on.

## 6. constitution.md is different

Never write `provenance: inferred` with confidence for `constitution.md`, and never set
`status: ratified` yourself. You may suggest 1-2 draft principles at most; the file stays
`status: draft` until a human ratifies it.

## 7. Batch your questions

Group anything unclear into three buckets: Open Questions, Assumptions, Conflicts. Don't
interrupt scanning to ask one at a time. At the end, ask at most 5 questions, prioritized by
impact (things affecting `architecture.md`/`tech-stack.md` first, `glossary.md` last). Put
anything beyond 5 into `.ai/core/open-questions.md` and proceed with the noted assumption where
it's safe to do so.

## 8. If nobody can confirm right now

Do not edit `constitution.md` or flip anything to a "confirmed"/"ratified" state unattended.
Instead create a pending change proposal under `.ai/decisions/pending/NNNN-<slug>.md`:

```yaml
status: pending_approval
proposed_change: "..."
proposed_by: agent
proposed_date: <today>
```

## 9. Finish with a summary

Tell the developer what you inferred, at what confidence, what you're still unsure about, and
where you left open questions. Apply step 3's rule: mention `codegraph init` only if CodeGraph was
installed but uninitialized; say nothing about it if the CLI wasn't present at all.
