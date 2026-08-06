# ⚡ Module 3.3: Messaging Head-to-Head Comparison Benchmark (Kafka vs RabbitMQ vs BullMQ)

Module này phân tích và đo đạc trực tiếp các đánh đổi kiến trúc (Architectural Trade-offs) và hiệu năng giữa 3 giải pháp Message Queue / Event Streaming hàng đầu:

1. **Apache Kafka (`Distributed Event Streaming Log`)**:
   - Tối ưu cho Throughput cực lớn (100,000+ msg/sec), ghi log bất biến, replay sự kiện theo Offset, và phân vùng mở rộng ngang.

2. **RabbitMQ (`AMQP Enterprise Message Broker`)**:
   - Tối ưu cho định tuyến phức tạp (Direct, Fanout, Topic, Headers exchanges), tín hiệu ACK linh hoạt theo từng tin nhắn, và Dead-Letter Queues.

3. **Redis BullMQ (`Node.js / NestJS Redis-Backed Job Queue`)**:
   - Tối ưu cho Job ngầm trong ứng dụng Web (Delayed jobs, retries, concurrency limiters), cài đặt đơn giản trên nền Redis sẵn có.

## API Endpoints

- **`POST /api/v1/messaging-comparison/naive/publish`**: Test gửi tin nhắn đơn lẻ cơ bản.
- **`POST /api/v1/messaging-comparison/optimized/benchmark`**: Khởi chạy Benchmark so sánh đối đầu Throughput (msg/sec) và Độ trễ (P95/P99 latency ms) giữa 3 Engine.
- **`GET /api/v1/messaging-comparison/optimized/comparison-matrix`**: Trả về Bảng tổng hợp Tiêu chí Thiết kế Hệ thống & Khuyến nghị Use-case.
