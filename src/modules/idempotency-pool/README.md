# ⚡ Module 2.3: Idempotency Key Pattern & PgBouncer Connection Pool Optimization

Module này chứng minh việc đảm bảo **Zero Double-Charging** khi khách hàng thực hiện Retry request thanh toán bị timeout hoặc mất mạng:

1. **Naive (`Non-Idempotent Executions`)**:
   - `POST /api/v1/idempotency-pool/naive/payment`.
   - Bỏ qua header `x-idempotency-key`. Mỗi lần retry lại tạo ra một giao dịch trừ tiền mới và sinh `transactionId` mới (**nguy cơ quẹt thẻ 2 lần**).

2. **Optimized (`Idempotency Key via Redis Lock & Response Cache`)**:
   - `POST /api/v1/idempotency-pool/optimized/payment`.
   - Yêu cầu header `x-idempotency-key`.
   - Dùng Redis Lock `SET NX EX 30` khóa request trùng lặp đang xử lý (báo lỗi HTTP 409 Conflict).
   - Sau khi thanh toán thành công, lưu kết quả HTTP response vào Redis với TTL 24h. Các request retry sau đó sẽ nhận ngay kết quả từ Cache kèm Header `x-cache: HIT`.

3. **Database Connection Pool Status**:
   - API `GET /api/v1/idempotency-pool/optimized/pool-status` đo đạc số lượng kết nối `totalConnections`, `idleConnections`, `waitingClients`, và `maxPoolSize`.

## API Endpoints

- **`POST /api/v1/idempotency-pool/naive/payment`**: Test thanh toán Naive (retry bị trừ tiền tiếp).
- **`POST /api/v1/idempotency-pool/optimized/payment`**: Test Idempotent payment (retry nhận kết quả cache cũ).
- **`GET /api/v1/idempotency-pool/optimized/pool-status`**: Kiểm tra tình trạng kết nối DB pool.
