---
feature: "001-learning-progress-management"
---

# Clarify — learning-progress-management

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Should progress data be stored in-memory for zero-dependency local testing, or persisted to PostgreSQL/Redis? | resolved | In-memory Map initialized with pre-seeded 15 roadmap topics for instant zero-config local usage and fast POST/PATCH response times. |
| 2 | Should benchmark metric improvements (% faster, RPS factor) be calculated dynamically by the service or supplied by API caller? | resolved | Calculated dynamically by `LearningProgressService.updateTopic()` whenever `naiveLatencyMs`/`optimizedLatencyMs` or `naiveRps`/`optimizedRps` are supplied. |
