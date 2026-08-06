# 📊 Module 0: Learning Progress & Dashboard

Module 0 đóng vai trò là Engine theo dõi tiến độ học tập và ghi nhận các chỉ số đo đạc hiệu năng (Latency ms, RPS) giữa 2 phiên bản `naive` và `optimized` cho tất cả 15 chủ đề trong lộ trình NestJS Playground.

## APIs Supported

- **`GET /api/v1/learning-progress/summary`**: Trả về tổng quan phần trăm hoàn thành và danh sách chi tiết tất cả chủ đề.
- **`PATCH /api/v1/learning-progress/:topicId`**: Cập nhật trạng thái (`TODO` | `IN_PROGRESS` | `COMPLETED`), lưu thêm ghi chú `keyTakeaways`, và ghi lại các thông số benchmark.

## Usage

1. Khởi động ứng dụng NestJS: `pnpm run start:dev`
2. Test API summary: `curl http://localhost:3000/api/v1/learning-progress/summary`
3. Cập nhật tiến độ sau khi hoàn thành 1 bài benchmark: Sử dụng Postman collection trong `postman/learning-progress-postman-collection.json`.
