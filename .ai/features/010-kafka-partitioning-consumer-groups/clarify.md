---
feature: "010-kafka-partitioning-consumer-groups"
---

# Clarify — kafka-partitioning-consumer-groups

| # | Question | Status | Answer |
|---|---|---|---|
| 1 | Which Kafka client library and topic configuration will be used? | resolved | `kafkajs` connecting to Kafka broker (`localhost:9092`). Topic `benchmark.order.events` initialized with 3 partitions. |
| 2 | How is strict message ordering per entity guaranteed using Partition Keys? | resolved | Producer specifies `key = orderId`. Kafka's murmur2 partitioner routes all lifecycle events for that `orderId` to the same partition. |
| 3 | How is fault-tolerant manual offset committing implemented? | resolved | Consumer configures `autoCommit: false`, executing `await consumer.commitOffsets(...)` explicitly after successful handler completion to prevent message loss on crashes. |
