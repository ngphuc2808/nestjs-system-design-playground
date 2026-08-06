# Playbook: Constitution Drafting

Purpose: turn a developer's natural-language description of a project — given inline as an
argument (`/constitution-drafting <description>`) or drawn out in conversation — into a
structured `.ai/core/constitution.md` draft. On a greenfield repo, also bootstraps the initial
tech stack into the relevant other `core/*.md` files, since there's no code yet for
`reverse-search` to infer from; on a brownfield repo, defers that to `reverse-search` instead.

## When to use

- `constitution.md` is still the generic scaffold (`[PROJECT_NAME]` placeholders, `status: draft`)
  and nobody has filled it in yet.
- A ratified constitution needs amending (a new non-negotiable, a governance change) — this
  playbook also drives that, through the constitution's own `Governance` section, not a rewrite.

## Check current state first

Agent MUST read `.ai/core/constitution.md` before asking anything.

- If `status: ratified`: agent MUST NOT overwrite it. Ask whether this is an amendment (bump
  `version`, set `last_amended`, note what changed and why — in a `## Changelog` section added if
  none exists yet, or a short dated line near `Governance`) or a from-scratch restart, which
  discards a ratified document and requires explicit confirmation first.
- If `status: draft`: proceed below.

## Greenfield or brownfield?

Agent MUST work this out before asking anything else: look for real functionality beyond
framework boilerplate (non-trivial `src/`/`app/`/`lib/` content, a manifest with real dependencies
and scripts, existing routes/components/models/tests). If genuinely ambiguous, agent MUST ask
directly rather than guess. This decides which branch below applies — everything else is shared.

## Elicitation (batched, not one question at a time)

If an inline description was given, use it as the Purpose starting point instead of asking from
scratch — but still probe it if vague, don't take a one-liner at face value; this matters most on
a greenfield repo, where there's no code to ground a fuzzy answer against. Cover:

| Area | Question |
|---|---|
| Purpose | What does this project exist to do, and for whom? Loop until concrete if vague. |
| Core Principles | 2-5 things that must NOT be violated |
| Non-Negotiables | Hard constraints specific to this project (compliance, security posture, performance floor) |
| Governance | Who may amend this document, and by what process |

Push back if given more than ~5 Core Principles — a constitution with 15 principles is a style
guide, not a constitution.

## Greenfield branch: also bootstrap tech-stack.md/database.md/api-spec.md

Agent SHOULD use this same conversation as the one-time technical bootstrap, since there's no
code yet to `reverse-search`:

- Ask (batched): language/framework, database technology, API style if relevant.
- Write directly, `provenance: manual`, no ratify gate needed (unlike `constitution.md`):
  language/framework/key deps → `tech-stack.md`; database choice → `database.md`, filling the
  variant shape `init --db-variant` already scaffolded (flag it, don't silently override, if the
  stated tech doesn't match that variant); API style → `api-spec.md`, same caveat.

## Brownfield branch: functionality already exists

Agent MUST NOT ask about language/framework/database here — the real answer already lives in the
code. Use the description only for `constitution.md`'s four areas. After drafting it, agent MUST
recommend running `/reverse-search` to derive `tech-stack.md`, `architecture.md`, `database.md`,
`api-spec.md`, `project-rules.md`, `glossary.md` from the real code instead.

## Self-review before presenting

Agent MUST re-check its own draft before showing it: no leftover `[BRACKET_PLACEHOLDER]` text,
2-5 real Core Principles (not vague aspirations), Non-Negotiables distinct from Core Principles,
Governance names an actual process rather than "TBD", and (greenfield only) the technical files
reflect what was actually said, not invented filler. Fix what can be fixed from answers already
given; ask one more targeted question for anything still missing, rather than guessing.

## Confirm, then apply — don't hand the file back for manual editing

Agent MUST show the drafted content (or a clear summary), then present the ratify/amend decision
as a structured choice — e.g. Claude Code's `AskUserQuestion` tool with "Ratify now"/"Not yet" (or
"Apply as amendment"/"Not yet") as selectable options — rather than a single conversational
question requiring a free-text reply. Fall back to a short labeled list where no such
selectable-option mechanism exists. This gate is about `constitution.md` specifically — the
greenfield technical files have no such gate and are written directly once stated.

- Confirmed → agent SHOULD set `status: ratified` and the `ratified` date itself in the same turn
  (or bump `version`/`last_amended` for an amendment). The developer's explicit answer in
  conversation already satisfies "no state change without explicit developer approval" — making
  them also hand-edit YAML for something just confirmed out loud is friction, not an extra safety
  check.
- Wants changes → revise and ask again; `status` untouched.
- Unsure → leave `status: draft`, tell them exactly which two lines to edit whenever ready.

This is narrower than `reverse-search`'s boundary (which never touches `status` because it infers
from code with no real-time confirmation moment). Here the confirmation step itself **is** the
human act — it just happens in conversation instead of as a manual file edit.

## Output

- Drafts (or amends) `.ai/core/constitution.md`'s Purpose / Core Principles / Non-Negotiables /
  Governance sections, `provenance: manual`.
- Greenfield: also writes `tech-stack.md`/`database.md`/`api-spec.md` from the same conversation.
- Brownfield: recommends `/reverse-search` for those files instead of guessing.
- Exits with a summary of `constitution.md`'s resulting state (`draft` or `ratified`). If still
  `draft`, `ai-framework doctor`'s "constitution not yet ratified" warning is expected to persist
  until a future confirmed run.
