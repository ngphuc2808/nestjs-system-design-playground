# GEMINI.md — ai-framework

This project uses **ai-framework**. Read `AGENTS.md` at the repo root first — it is the canonical
entry point and its rules apply regardless of which agent tool is being used. Then read the
relevant `.ai/core/*.md` files before making changes.

Note: for Google Antigravity specifically, this repo-root file is not Antigravity's own
per-workspace rules mechanism — that's `.agents/rules/00-entry.md`. Antigravity's own global rules
file lives at `~/.gemini/GEMINI.md` in the user's home directory, not the repo. This file is kept
for tools that do read a repo-root `GEMINI.md` directly (e.g. the separate Gemini CLI); if you're
only using Antigravity, `.agents/rules/00-entry.md` is the file that actually matters.

---

Capability coverage: **88%** — see `.ai/core/capability-coverage.md`.
