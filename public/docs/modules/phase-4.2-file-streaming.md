# ⚡ Module 4.2 — High-Performance Stream File Processing (< 30MB RAM)

> **Mục tiêu**: Đọc/Ghi file CSV khổng lồ với RAM tiêu thụ cố định < 30 MB.

```bash
curl -X POST http://localhost:3000/api/v1/file-streaming/optimized/stream-upload \
  -H "Content-Type: application/json" \
  -d '{"filepath":"sample_large_dataset.csv","batchSize":1000}'
```
