# ⚡ Module 2.2: High-Throughput Rate Limiting & Flash Sale (Redis Lua Scripts)

Module này minh họa các kỹ thuật xử lý siêu tốc độ trên Redis Memory bằng **Atomic Lua Scripts**:

1. **Sliding Window Log Rate Limiter**:
   - Sử dụng Redis Sorted Set (`ZSET`) trong script Lua `sliding-window.lua`.
   - Thực thi `ZREMRANGEBYSCORE` để xóa timestamp quá hạn, `ZCARD` để kiểm tra giới hạn request, và `ZADD` để lưu request mới trong **1 bước duy nhất** trực tiếp trên Redis Engine.

2. **Flash Sale Stock Deduction (Trừ tồn kho Flash Sale)**:
   - Dùng script Lua `flash-sale-deduct.lua` thực thi `DECRBY` kết hợp kiểm tra `stock >= quantity`.
   - Giải phóng tải hoàn toàn cho PostgreSQL DB pool dưới xung đột 100,000+ RPS, bảo đảm **không bao giờ bán lố (Zero Overselling)**.

## API Endpoints

- **`POST /api/v1/redis-lua/seed`**: Nạp tồn kho sản phẩm Flash Sale trên Redis (Ví dụ 1,000 cái).
- **`GET /api/v1/redis-lua/naive/rate-limit`**: Test Rate Limit Naive (tách biệt các câu lệnh Redis GET/SET).
- **`GET /api/v1/redis-lua/optimized/rate-limit`**: Test Atomic Rate Limit (Redis Lua Sliding Window Log).
- **`POST /api/v1/redis-lua/naive/flash-sale`**: Test Flash Sale Naive.
- **`POST /api/v1/redis-lua/optimized/flash-sale`**: Test Flash Sale Atomic Redis Lua Script.
