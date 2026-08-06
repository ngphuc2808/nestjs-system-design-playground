# ⚡ Module 3.1: Kafka Partitioning, Consumer Groups & Offsets

Module này triển khai các nguyên lý cốt lõi của **Apache Kafka Event-Driven Architecture**:

1. **Unkeyed Random Round-Robin (`naive`)**:
   - `POST /api/v1/kafka-core/naive/produce` với `key = null`.
   - Các sự kiện của cùng 1 đơn hàng (`ORDER_CREATED`, `ORDER_PAID`, `ORDER_CANCELLED`) bị rải rác ngẫu nhiên qua nhiều Partitions khác nhau, gây lỗi tiêu thụ ngược thứ tự sự kiện (**Out-of-order execution**).

2. **Key-Based Partition Routing (`optimized`)**:
   - `POST /api/v1/kafka-core/optimized/produce` với `key = orderId`.
   - Thuật toán Hash Murmur2 của Kafka đảm bảo toàn bộ sự kiện có cùng `orderId` luôn rơi vào đúng **1 Partition duy nhất**, bảo đảm thứ tự tuần tự tuyệt đối.

3. **Consumer Groups & Manual Offset Commits**:
   - Quản lý nhóm tiêu thụ `order-processing-group`.
   - Cấu hình `autoCommit: false` và thực thi `commitOffsets()` thủ công sau khi xử lý xong business logic để chống mất tin khi worker bị sập.

## API Endpoints

- **`POST /api/v1/kafka-core/naive/produce`**: Test đẩy tin nhắn không key (bị rải ngẫu nhiên).
- **`POST /api/v1/kafka-core/optimized/produce`**: Test đẩy tin nhắn có key (định tuyến chính xác partition).
- **`GET /api/v1/kafka-core/optimized/consumer-status`**: Kiểm tra trạng thái Consumer Group & Manual Offset Commits.
