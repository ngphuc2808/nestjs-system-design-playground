# ai-framework entry point

This project uses **ai-framework**. Read `AGENTS.md` at the repo root first — it is the canonical
entry point and its rules apply regardless of which agent tool is being used. Then read the
relevant `.ai/core/*.md` files before making changes.

Reusable techniques (reverse-search, core-refresh, elicitation, adversarial-review,
persona-debate, constitution-drafting, plan-drafting, tasks-drafting, implement, analyze) are
documented in `.ai/playbooks/*.md`, and also rendered as native Antigravity Skills under
`.agents/skills/<id>/SKILL.md` (per Antigravity's own Skills Framework — a `SKILL.md` per skill
folder, with `name`/`description` frontmatter) by `ai-framework skills sync`. If a skill doesn't
show up, fall back to reading the matching `.ai/playbooks/*.md` file directly.

Note: `.aiexclude` in this repo marks sensitive paths — the text rule in
`AGENTS.md`/`.ai/core/security-boundaries.md` is the actual safety net; follow it even where the
technical exclusion should already apply.

---

Capability coverage: **88%** — see `.ai/core/capability-coverage.md`.
