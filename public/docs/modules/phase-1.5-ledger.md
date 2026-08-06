# ⚡ Module 1.5 — Immutable SHA-256 Ledger Pattern

> **Mục tiêu**: Bảo đảm tính toàn vẹn tài chính bằng Cryptographic SHA-256 Hash Chaining.

---

## 📊 1. Bảng So Sánh Kỹ Thuật

| # | Phương Pháp Giao Dịch | Tính Kháng Gian Lận | Khả Năng Truy Vết Audit |
|:---:|:---:|:---:|:---:|
| 1 | **Direct UPDATE Balance** | 🔴 0% (Dễ bị sửa ngầm trong DB) | ❌ Không thể truy vết |
| 2 | **Append-Only SHA-256 Ledger** | 🟢 100% (Phát hiện ngay lập tức) | ✅ Kiểm tra Cryptographic Hash Chain |

---

## 🛠️ 2. Danh Sách API Endpoints (cURL Snippets)

### 1. Naive Balance Update (POST)
```bash
curl -X POST http://localhost:3000/api/v1/db-ledger/naive/transfer \
  -H "Content-Type: application/json" \
  -d '{"accountId":"ACC_1001","amount":100}'
```

### 2. Optimized SHA-256 Ledger Entry (POST)
```bash
curl -X POST http://localhost:3000/api/v1/db-ledger/optimized/transfer \
  -H "Content-Type: application/json" \
  -d '{"fromAccountId":"ACC_1001","toAccountId":"ACC_1002","amount":250}'
```

### 3. Verify Cryptographic SHA-256 Hash Chain (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-ledger/optimized/verify"
```
