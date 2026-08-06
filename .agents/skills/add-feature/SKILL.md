---
name: add-feature
description: Take a natural-language feature description — given inline (e.g. `/add-feature <description>`) or drawn out in conversation — derive a slug, scaffold the feature directory via `ai-framework add-feature`, then write the description into the new brainstorm.md. Turns starting a feature into one step instead of "run the CLI, then separately go write brainstorm.md yourself."
---

# Add Feature

You are the entry point for starting a new feature end-to-end: pick a slug, run the deterministic
CLI scaffold, then turn the developer's description into a real `brainstorm.md` entry instead of
leaving it as `[TODO]`. This is the first skill in the feature lifecycle — see `elicitation` for
the step right after it (Brainstorm → Clarify).

Unlike every other canonical skill, this one shells out to the CLI as part of its own execution —
the directory numbering, rigor resolution, and locking are deterministic and already correctly
implemented there; don't reimplement any of that logic yourself.

## 1. Get the description

Use the inline argument if one was given. If not, ask: "What's the feature you want to start?"
Only ask a follow-up if what you have is too thin to name the feature or say one real sentence
about it (e.g. a single ambiguous word). This step is deliberately light — deep clarification is
`elicitation`'s job at the next stage, not this one's. `brainstorm.md` is meant to hold a rough
idea, not a fully-specified one; don't try to front-load Clarify's work here.

## 2. Check the constitution gate first

Read `.ai/core/constitution.md`. If `status` isn't `ratified`, stop here — the CLI will
hard-refuse anyway. Tell the developer to finish it first (point them at the
`/constitution-drafting` skill if it's still the placeholder scaffold).

## 3. Derive a slug, confirm it

Propose a short, descriptive `kebab-case` slug for the idea (lowercase letters/digits, single
hyphens — e.g. "cho phép người dùng upload avatar" → `user-avatar-upload`). Show it to the
developer before scaffolding — the feature directory name is effectively permanent (there's no
rename command), so a bad slug is real friction to live with later. Adjust if they want something
different.

## 4. Run the CLI scaffold

Invoke:

```
ai-framework add-feature <slug> [--touches <path>...] [--depends-on <slug>...]
```

- Add `--touches <path>` only for paths the description explicitly names (source files/modules) —
  this also resolves the feature's rigor level and, if `core/test-strategy.md` has a matching
  entry, auto-fills `test-plan.md`'s archetype. Don't invent paths that weren't mentioned.
- Add `--depends-on <slug>` only if the developer explicitly says this depends on another named,
  existing feature — never guess a dependency from the description alone.
- If the command isn't found, the CLI likely isn't installed/linked in this repo yet — tell the
  developer, don't try to work around it.
- If the CLI errors (slug already exists, invalid slug shape, a named dependency hasn't passed
  Clarify yet, a dependency cycle) — relay the exact error and ask the developer how to proceed
  (different slug, drop the dependency, etc.). Don't try to route around it yourself.

## 5. Write the brainstorm entry

On success, read the freshly created `brainstorm.md` — it already has today's date heading from
the scaffold. Replace its `[TODO — what is this feature, why does it matter, what's the rough
shape of the idea]` placeholder with a real entry built from what the developer actually said:
what the feature is, why it matters, and the rough shape of the approach. Ground it in their
words — don't invent scope or requirements they didn't mention; that's exactly the kind of
premature assumption `elicitation` exists to catch at the next stage, not something to smuggle in
here.

Before writing, check `.ai/core/project-rules.md`'s **Stage Skill Defaults** table for a
Brainstorm-stage entry (e.g. a research or throwaway-prototype technique). If one is listed and the
idea genuinely has an open factual unknown or a "does this feel right" hunch worth cheaply
validating, mention it to the developer as an option — don't invoke it unprompted or block
scaffolding on it; this step stays deliberately light, same as the rest of this skill. A missing
table or `[TODO]` row is completely normal — most repos have none, and that's not a blocker.

## 6. Finish with a summary and the next step

Tell the developer: the feature directory created, its resolved rigor level, and (if applicable)
the auto-resolved test archetype or recorded dependencies. Recommend running the `/elicitation`
skill next, to turn anything still unclear in the brainstorm into `clarify.md` questions — purely
a suggestion, never auto-invoked.
