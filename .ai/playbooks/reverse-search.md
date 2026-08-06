# Playbook: Reverse-Search

Purpose: derive `.ai/core/*.md` from an existing (brownfield) codebase, with provenance tracking,
instead of assuming the developer writes them from scratch.

## Scan depth (default: `standard`)

| Level | Scope | Use when |
|---|---|---|
| `quick` | Representative sample (`package.json`, migration/schema dir, `src/modules/*`, `docs/`) | First rough pass, or the repo is too large to scan fully |
| `standard` (default) | Directly relevant files + shared libs + related config | Every normal invocation |
| `full` | Entire repository | Large architecture audits, wide refactors |

Agent MUST NOT scan the entire repository unless: explicitly requested, performing an
architecture audit, or reverse-search confidence < 80%.

## Frontmatter written to every drafted file

```yaml
provenance: inferred        # inferred | confirmed | manual
confidence: medium          # low | medium | high
last_verified: <today>
```

## project-rules.md's External Skill Defaults table

Unlike the rest of `project-rules.md`, this table is a routing rule for this framework's own
agents — which non-canonical skill to default to across a feature's whole lifecycle (Plan through
Implement) when the feature touches a given part of the codebase. Populate from real findings only:

1. Look for skills beyond this framework's own 11 canonical ones, checking both `skills/*/SKILL.md`
   (a vendored reference bundle, if any) and `.claude/skills/*/SKILL.md`. Finding none is normal —
   leave the table's `[TODO]` row as-is rather than inventing an entry.
2. Read each candidate's own frontmatter (`description`/`category`/`keywords`) to judge its actual
   domain — never guess from the folder name alone.
3. Cross-reference against the real structure already found for `architecture.md`/`tech-stack.md`
   in this same pass; only add a row where the skill's domain plausibly matches something that
   actually exists in this repo. An unmatched skill is left out silently, same as an unmatched test
   archetype above.
4. One row per confident match (`Feature touches` | `Default skill` | `Skill location`, the last
   being the real path its `SKILL.md` was found at). Genuinely ambiguous matches go into Open
   Questions below, not a guessed row.
5. Never overwrite a row a human already filled in by hand — only replace rows still `[TODO]`.

## project-rules.md's Stage Skill Defaults table

A second, different axis on the same set of skills found above: instead of *codebase area*, this
table keys off *which stage of the feature lifecycle* (Brainstorm/Clarify/Plan/Tasks/Implement/Test
Coverage) a skill's technique fits. Stage fit is judgment, not a path match, so hold this table to
a higher bar than External Skill Defaults:

1. For each skill found in step above, judge from its own `description`/body whether it's a
   *technique* applicable at a specific stage (an interview discipline, a design vocabulary, a
   test-first discipline, a QA/review technique) — not a scaffolding tool, a repo-setup command, or
   something that publishes its own artifact to an external tracker (that would compete with
   `plan.md`/`tasks.md` as this framework's single source of truth — exclude those regardless of
   quality).
2. Where more than one candidate skill plausibly fits the same stage, don't add every one — this is
   never confident enough for reverse-search to auto-decide alone. Write the candidates and your
   reasoning into `.ai/core/open-questions.md` instead of guessing a winner, and ask the developer
   to confirm which (if any) becomes the default.
3. Never overwrite a row a human already filled in by hand — only ever propose additions for rows
   still `[TODO]`, and only as a question, never a silent write (unlike External Skill Defaults,
   which may write confident matches directly — stage-fit isn't confident enough for that).
4. Finding no plausible stage-fit is the normal outcome for most repos — leave the table as
   scaffolded and move on.

## Handling conflicts/uncertainty found while scanning

Group findings into 3 buckets: Open Questions, Assumptions, Conflicts. Batch them — do not
interrupt the scan for each one. Ask at most 5 questions per round, prioritized by impact
(`architecture.md`/`tech-stack.md` > `project-rules.md` > `glossary.md`). Anything beyond 5 goes
into `.ai/core/open-questions.md`; continue with the noted assumption when it's safe to do so.

## Async / nobody available to confirm

Agent MUST NOT modify `constitution.md` automatically. Agent MAY create a pending change proposal
under `.ai/decisions/pending/NNNN-<slug>.md`:

```yaml
status: pending_approval   # pending_approval | approved | rejected
proposed_change: "..."
proposed_by: agent
proposed_date: <today>
```

Human approval is required before it's applied.

## Security

`protected_paths` from `.ai/core/security-boundaries.md` are excluded from scan scope entirely —
never read, never summarized.

## Output

- Drafts (or updates) the 10 required `core/*.md` files, following each file's own template rules.
- Exits with a short summary of what was inferred, at what confidence, and what questions remain.
