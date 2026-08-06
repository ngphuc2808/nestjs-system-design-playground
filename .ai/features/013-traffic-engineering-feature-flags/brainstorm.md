---
feature: "013-traffic-engineering-feature-flags"
created: "2026-08-05"
---

# Brainstorm — traffic-engineering-feature-flags

<!-- Append-only. This file is a reference marker of how the feature started — do not edit past
     entries. Add new entries below, each with its own date heading. -->

## 2026-08-05

### Overview & Purpose
Module 4.1 (Dynamic Feature Flags, Canary Releases & Shadow Traffic / Dark Launching) demonstrates production traffic control without redeployments:
1. **Hardcoded Monolithic Branching (`naive`)**:
   - `POST /api/v1/traffic-engineering/naive/evaluate`: Hardcoded `if/else` conditions requiring full application rebuilds and redeployments to toggle features or adjust percentage rollouts.
2. **Dynamic Feature Flags & Shadow Traffic Engine (`optimized`)**:
   - **Dynamic Feature Flags**: Redis-backed dynamic feature toggles (`feature:flag:<name>`) supporting percentage rollouts (e.g. 10% canary user allocation via hash of `userId`).
   - **Shadow Traffic (Dark Launching)**: Asynchronously mirroring real production traffic to a new experimental service in the background (fire-and-forget / non-blocking) to test performance and edge cases without affecting live user responses.
   - Configuration toggle API `POST /api/v1/traffic-engineering/flags/toggle` and evaluation endpoint `POST /api/v1/traffic-engineering/optimized/evaluate`.

### Key Value & Objectives
- **Zero-Downtime Feature Deployment**: Toggling features dynamically in under 5ms without server restarts.
- **Dual Controllers**:
  - `TrafficEngineeringNaiveController`: `/api/v1/traffic-engineering/naive/evaluate`.
  - `TrafficEngineeringOptimizedController`: `/api/v1/traffic-engineering/optimized/evaluate`, `/flags/toggle`, `/shadow-traffic/status`.

### Architectural & Module Boundaries
- Code location: `src/modules/traffic-engineering/`
- Standard layout: `controllers/`, `services/`, `interfaces/`, `dto/`, `postman/`, `README.md`
- Infrastructure: Redis 7 (`ioredis`) for real-time feature flag state storage
