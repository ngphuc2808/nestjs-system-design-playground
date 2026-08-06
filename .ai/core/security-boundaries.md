---
provenance: manual
last_verified: "2026-08-05"
protected_paths:
  - ".env"
  - ".env.*"
  - "**/*.pem"
  - "**/*.key"
  - "**/secrets/**"
  - "**/credentials*"
---

# Security Boundaries

No single agent tool's ignore-file mechanism is reliable on its own (Cursor's `.cursorignore` is
best-effort; GitHub Copilot Agent Mode/CLI does not currently honor content-exclusion at all).
This file is the single canonical source (`protected_paths` in the frontmatter above);
`ai-framework init`/`tools add` render it into 4 defense layers: `.gitignore` (baseline, not
AI-dependent), `.cursorignore`, `.aiexclude` (Antigravity), and `permissions.deny` in
`.claude/settings.json` — plus the text rule below, which is the safety net for tools whose
technical enforcement is incomplete or absent.

## Rule (applies regardless of tool-level technical enforcement)

Agent MUST NOT read or print the contents of any path matching `protected_paths` above, and
MUST NOT write to such a path, without explicit developer confirmation in the current session.
When asked to summarize environment/config variables, list names only — never values.

Any approved exception MUST be recorded in `.ai/security-log.md` with who approved it, when,
and why.

## Scan Exclusion

The `reverse-search` and `core-refresh` skills MUST exclude `protected_paths` from their scan
scope entirely.
