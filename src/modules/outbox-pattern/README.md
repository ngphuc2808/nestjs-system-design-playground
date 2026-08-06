# ⚡ Module 3.2: Transactional Outbox Pattern & CDC Relay Simulation

Module này giải quyết triệt để sự cố **Dual-Write Problem** giữa Database và Message Broker:

1. **Unsafe Dual-Write (`naive`)**:
   - `POST /api/v1/outbox-pattern/naive/create-order`.
   - Thực hiện lưu Đơn hàng vào DB rồi bắn trực tiếp Message sang Broker ở bước I/O riêng biệt.
   - Khi mạng sang Broker bị lỗi (`simulateBrokerFailure: true`), đơn hàng vẫn bị lưu ở DB nhưng không có tin nhắn nào phát ra (**bản ghi mồ côi / trôi dữ liệu**).

2. **Transactional Outbox Pattern (`optimized`)**:
   - `POST /api/v1/outbox-pattern/optimized/create-order`.
   - Cả đơn hàng (`benchmark_outbox_orders`) và sự kiện Outbox (`benchmark_outbox_events`) được lưu đồng thời trong **1 DB Transaction duy nhất**.
   - Đảm bảo 100% nếu DB lưu đơn hàng thành công thì bản ghi Outbox event chắc chắn tồn tại.

3. **CDC Relay Poller (`FOR UPDATE SKIP LOCKED`)**:
   - `POST /api/v1/outbox-pattern/optimized/relay/trigger`.
   - Tiến trình Outbox Relay quét `SELECT * FROM benchmark_outbox_events WHERE status = 'PENDING' FOR UPDATE SKIP LOCKED`.
   - Bắn tin sang Kafka/Broker và cập nhật `status = 'PROCESSED'`, bảo đảm **At-Least-Once Delivery**.

## API Endpoints

- **`POST /api/v1/outbox-pattern/naive/create-order`**: Test Dual-Write (có option test lỗi đứt mạng broker).
- **`POST /api/v1/outbox-pattern/optimized/create-order`**: Test tạo đơn hàng kèm Outbox Event nguyên tử.
- **`GET /api/v1/outbox-pattern/optimized/outbox-events`**: Xem danh sách Outbox Events.
- **`POST /api/v1/outbox-pattern/optimized/relay/trigger`**: Kích hoạt Outbox Relay đẩy tin sang Broker.
