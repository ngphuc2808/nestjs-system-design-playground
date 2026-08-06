---
provenance: manual
last_verified: "2026-08-05"
---

# Destructive Actions

destructive_patterns:
  - pattern: "file/folder deletion outside scratch/temp paths"
    confirm: always
  - pattern: "git force-push, reset --hard, branch deletion"
    confirm: always
  - pattern: "DB down-migration, DROP/TRUNCATE"
    confirm: always
  - pattern: "overwrite uncommitted changes (checkout/restore/clean)"
    confirm: always

## Rule (applies regardless of tool-level technical enforcement)

Agent MUST ask for explicit confirmation before executing any action matching a pattern above,
regardless of tool-level technical enforcement. This applies whether the action goes through a
skill (whose `skill.yml` `side_effects`/`risk_level` must not contradict this list) or is
ad-hoc (the agent typing a command directly).
