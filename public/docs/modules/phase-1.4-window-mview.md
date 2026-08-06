# ⚡ Module 1.4 — Window Functions & Concurrent Materialized Views

> **Tập dữ liệu thử nghiệm**: Báo cáo Analytics trên dữ liệu lớn.

---

## 📊 1. Bảng So Sánh Kỹ Thuật

| # | Phương Pháp Analytics | Thời Gian Xử Lý | Tiêu Tốn RAM Node.js | Trạng Thái Non-Blocking |
|:---:|:---:|:---:|:---:|:---:|
| 1 | **Naive V8 RAM Sort/Filter** | 🔴 `650.0 ms` | 🔴 `> 450 MB RAM` | ❌ Block Event Loop |
| 2 | **SQL Window Functions & Materialized Views** | ⚡ `3.5 ms` | 🟢 `< 10 MB RAM` | ✅ Non-blocking (`CONCURRENTLY`) |

---

## 🛠️ 2. Danh Sách API Endpoints (cURL Snippets)

### 1. Naive V8 In-Memory Aggregation (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-window-mview/naive/analytics"
```

### 2. Optimized SQL Window & Concurrent MView (GET)
```bash
curl -s "http://localhost:3000/api/v1/db-window-mview/optimized/analytics"
```
