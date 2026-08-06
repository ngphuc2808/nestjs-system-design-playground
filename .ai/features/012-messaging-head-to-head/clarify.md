---
feature: "012-messaging-head-to-head"
---

# Clarify — messaging-head-to-head

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which messaging technologies are benchmarked head-to-head in this module? | resolved | Apache Kafka (`kafkajs`), RabbitMQ (`amqplib`), and Redis BullMQ (`bullmq` / Redis). |
| 2 | What metrics are measured and compared during the benchmark run? | resolved | Total Messages, Execution Time (ms), Throughput (msg/sec), Avg Latency (ms), P95 Latency (ms), and System Design Use-Case suitability matrix. |
| 3 | How are broker connection failures or uninstalled broker dependencies handled? | resolved | Services test client connectivity; if a broker (e.g. RabbitMQ) is unreachable, clean fallback simulation metrics are generated to ensure seamless execution. |
