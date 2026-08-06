---
feature: "013-traffic-engineering-feature-flags"
---

# Clarify — traffic-engineering-feature-flags

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | How are dynamic Feature Flags configured and evaluated in real-time? | resolved | Stored in Redis (`feature:flag:<name>`) holding JSON rules (`enabled`, `percentage`, `allowedUserIds`), evaluated in sub-5ms latency. |
| 2 | How is Canary Release percentage rollout evaluated for incoming requests? | resolved | Hashes `userId` to a 0-99 bucket. If `(hash % 100) < rolloutPercentage`, the user is routed to the new Canary feature path. |
| 3 | How is Shadow Traffic (Dark Launching) executed without adding latency to live users? | resolved | Executed via non-blocking asynchronous fire-and-forget tasks (`setImmediate`), sending mirrored payloads to the shadow service in the background. |
