# ⚡ Module 4.1: Dynamic Feature Flags, Canary Releases & Shadow Traffic (Dark Launching)

Module này triển khai các kỹ thuật điều phối Traffic sản xuất không cần Deploy lại hệ thống:

1. **Hardcoded Monolithic Branching (`naive`)**:
   - `POST /api/v1/traffic-engineering/naive/evaluate`.
   - Đánh giá feature bằng logic `if/else` cứng. Bất kỳ sự thay đổi tỷ lệ hay bật/tắt tính năng nào cũng bắt buộc phải **Rebuild và Redeploy** lại Server.

2. **Dynamic Feature Flags & Canary Rollouts (`optimized`)**:
   - `POST /api/v1/traffic-engineering/flags/toggle`: Cấu hình bật/tắt và tỷ lệ phần trăm Canary Rollout (0 - 100%) trực tiếp trên Redis (`feature:flag:<name>`).
   - `POST /api/v1/traffic-engineering/optimized/evaluate`: Tải quy tắc từ Redis tốc độ **sub-5ms**, băm `userId` thành 100 bucket nhất quán để phân bổ tính năng Canary.

3. **Shadow Traffic / Dark Launching**:
   - Nhân bản request thực tế sang hệ thống thử nghiệm ngầm theo cơ chế Fire-and-forget bất đồng bộ (`setImmediate`).
   - Kiểm tra hiệu năng và lỗi của tính năng mới dưới tải thực tế **mà không làm ảnh hưởng hay tăng latency** cho response trả về người dùng.
   - API `GET /api/v1/traffic-engineering/shadow-traffic/status` theo dõi chỉ số mirror.

## API Endpoints

- **`POST /api/v1/traffic-engineering/flags/toggle`**: Cấu hình quy tắc Feature Flag & % Rollout.
- **`POST /api/v1/traffic-engineering/naive/evaluate`**: Test đánh giá Naive hardcoded.
- **`POST /api/v1/traffic-engineering/optimized/evaluate`**: Test đánh giá Dynamic Redis Feature Flag & Canary.
- **`GET /api/v1/traffic-engineering/shadow-traffic/status`**: Theo dõi chỉ số Shadow Traffic.
