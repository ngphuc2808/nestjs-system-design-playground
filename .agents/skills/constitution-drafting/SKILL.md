---
name: constitution-drafting
description: Turn a developer's natural-language description of a project — given inline as an argument (e.g. `/constitution-drafting <description>`) or drawn out in conversation — into a structured .ai/core/constitution.md draft, then ratify it once confirmed. On a greenfield repo, also elicits the initial tech stack and records it into the relevant other core/*.md files; on a brownfield repo, defers that to reverse-search instead of guessing from a description.
---

# Constitution Drafting

You are turning what the developer says about this project — given up front as an inline
argument, or drawn out in conversation — into the structured `.ai/core/constitution.md` format,
and, on a genuinely empty repo, into a first pass at the technical core docs too. This is
conversational, not code-derived: see `reverse-search` for the code-inference playbook, which
this skill defers to whenever real code already exists to infer from.

## 1. Check current state first

Read `.ai/core/constitution.md`.

- If `status: ratified` already: **do not overwrite it.** A ratified constitution changes only
  through its own `Governance` section's amendment process — ask the developer whether this is an
  amendment (bump `version`, set `last_amended`, and note what changed and why — either in a
  `## Changelog` section you add if the file doesn't have one yet, or as a short dated line near
  `Governance` — applied by you once confirmed, same as step 7 below) or whether they mean to
  start over, which discards a ratified document and needs its own explicit confirmation first.
- If `status: draft` (the fresh scaffold, `[PROJECT_NAME]`-style placeholders still present):
  proceed below.

## 2. Is this greenfield or brownfield?

Before asking anything else, work out whether there's real functionality here yet:

- Look for actual source beyond framework boilerplate: non-trivial `src/`/`app/`/`lib/` content,
  a `package.json` (or equivalent) with real dependencies and scripts, existing routes,
  components, models, or tests.
- If it's genuinely ambiguous (e.g. only a fresh `create-*` scaffold with no real code written
  yet), just ask directly — "Is this a brand-new project, or is there existing functionality
  already?" — rather than guessing either way.

This decides which of step 4a/4b you take. Everything else in this skill is shared between both.

## 3. Ask, don't assume — constitution.md's four areas

If an inline description was given, use it as your starting point for Purpose instead of asking
for it from scratch — but still probe it, don't take a vague one-liner at face value. Cover all
four areas, batched, not one at a time:

- **Purpose** — what does this project exist to do, and for whom? If the answer (inline or
  spoken) is too vague to say concretely what it covers — e.g. "quản lý công việc hằng ngày" (
  manage daily tasks) without knowing which entities or flows that actually means — keep asking
  follow-ups until it's concrete. This matters most on a greenfield repo, where there's no code to
  ground a fuzzy answer against.
- **Core Principles** — 2-5 things that must NOT be violated (e.g. "never write directly to the
  DB from a controller", "all public APIs are versioned"). Push back gently if you're given more
  than ~5 — a constitution with 15 principles isn't a constitution, it's a style guide.
- **Non-Negotiables** — hard constraints specific to this project (compliance obligations,
  security posture, a performance floor) — distinct from the more general Core Principles above.
- **Governance** — who may amend this document, and by what process (e.g. "any two of the three
  founding engineers", "requires an ADR under `.ai/decisions/`").

## 4a. Greenfield: also bootstrap the technical core docs

There's no code yet for `reverse-search` to infer anything from, and this conversation is
happening anyway — use it as the one-time technical bootstrap:

1. Once direction (Purpose) is genuinely clear, ask (batched): preferred language/framework,
   database technology, and API style if relevant.
2. Write the answers into the right files, `provenance: manual` (stated intent, not inferred
   code):
   - Language, framework, key dependencies → `tech-stack.md`.
   - Database technology → `database.md`. `ai-framework init --db-variant` already picked the
     variant (`sql`/`nosql`/`hybrid`) and scaffolded the matching section shape — fill in *that*
     shape with what was said. If what they describe doesn't match what's already on disk (e.g.
     they describe MongoDB but the file is the `sql` template), say so — there is no CLI command
     to fix this after the fact (`init` refuses to run again once `.ai/` exists, and `update`
     deliberately never touches `database.md`/`api-spec.md`, since `config.yml` doesn't record
     which variant was originally chosen). The only fix is rewriting the file's section shape by
     hand to the right variant (mirror the other `database-*.md` templates), or leaving it as a
     noted open item if unsure. Don't silently force a mismatched shape, and don't suggest
     re-running `init`.
   - API style, if mentioned → `api-spec.md`, same variant-match caveat.
3. None of `tech-stack.md`/`database.md`/`api-spec.md` carry a ratify gate — write them directly
   once stated, same as `reverse-search` would, just from stated intent instead of scanned code.
   No separate confirmation step needed for these; step 7 below is only about `constitution.md`.

## 4b. Brownfield: functionality already exists

Don't ask about language/framework/database here — the real answer already lives in the code, and
asking invites a description that drifts from reality. Use the description only to inform
`constitution.md`'s four areas above. After drafting it (steps 5-7), explicitly tell the
developer: run `/reverse-search` to derive `tech-stack.md`, `architecture.md`, `database.md`,
`api-spec.md`, `project-rules.md`, and `glossary.md` from the real code — don't attempt to fill
those from the description yourself.

## 5. Draft the content

Write the answers from step 3 into `constitution.md`'s existing section structure (Purpose / Core
Principles / Non-Negotiables / Governance). Keep `provenance: manual`. Leave `status` untouched
for now — don't set `ratified` yet, that only happens after step 7.

## 6. Review your own draft before showing it

Re-read what you just wrote, critically, before presenting it. Check for:

- Leftover `[BRACKET_PLACEHOLDER]` text that never got replaced.
- Purpose is concrete and specific to this project, not generic filler that could describe any
  project.
- Core Principles: 2-5 of them, each a real "must not violate" statement — not a vague aspiration
  ("write good code" is not a principle).
- Non-Negotiables are genuinely hard constraints, distinct from the Core Principles above, not a
  duplicate list.
- Governance names an actual person/role/process — not left as "TBD" or a placeholder.
- (Greenfield only) `tech-stack.md`/`database.md`/`api-spec.md` reflect what was actually said,
  not something invented to fill a gap.

Fix anything you can from what the developer already told you. If something is still missing or
too vague, ask one more targeted question rather than guessing or inventing a principle.

## 7. Ask for confirmation, then apply it yourself

Show the developer the drafted content (or a clear summary of it), then present the decision as a
structured choice rather than open-ended prose. If your environment offers a way to show
selectable options (e.g. Claude Code's `AskUserQuestion` tool), use it with clear choices — "Ratify
now" / "Not yet — keep revising" (or, for an amendment: "Apply as amendment" / "Not yet"). If no
such mechanism is available, present the same choices as a short labeled list instead of a single
question like "shall I mark `constitution.md` as ratified?" that requires parsing a free-text
reply.

- **If they confirm**: set `status: ratified` and fill in the `ratified` date yourself, in the
  same turn (or, for an amendment, bump `version` and set `last_amended`). The developer already
  gave explicit, deliberate approval in conversation — that satisfies the same "no state change
  without explicit developer approval" rule as everywhere else in this framework. Don't also make
  them go hand-edit YAML for something they just confirmed out loud; that would just be friction,
  not an extra safety check.
- **If they want changes**: revise and ask again. Do not touch `status`.
- **If they're unsure or want to think about it**: leave `status: draft` and tell them exactly
  which two frontmatter lines to change themselves whenever they're ready — a fallback path, not
  the default one.

This is a narrower boundary than `reverse-search`'s: `reverse-search` never touches `status`
because it infers content from code with no real-time confirmation moment built in. Here, the
entire content came from the developer's own words earlier in this same conversation — the
confirmation in this step *is* that explicit human act, just delivered conversationally instead
of as a manual file edit.

## 8. Finish with a summary

Tell the developer what state `constitution.md` is in now (`draft` or `ratified`). If still
`draft`, remind them `ai-framework doctor` keeps surfacing the "constitution not yet ratified"
warning until it is. On a greenfield repo, also list what got written into `tech-stack.md`/
`database.md`/`api-spec.md`. On a brownfield repo, repeat the `reverse-search` recommendation from
step 4b so it isn't missed at the end of a long conversation.
