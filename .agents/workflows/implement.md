# Implement (workflow)

Execute a feature's approved tasks.md checklist in order — directly, via one subagent, or fanned out across parallel subagents grouped by task dependency (ai-framework task groups) — updating progress.md's per-task drift_check as it goes, stopping immediately to ask if drift_check ever flips to needs_review, and advancing journal.md's stage once every task is done. Refuses to run if tasks.md isn't approved.

See `.agents/skills/implement/SKILL.md` for the full instructions.
