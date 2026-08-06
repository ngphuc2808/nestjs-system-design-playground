# ⚡ Module 015: Interactive System Architecture & Documentation Portal

Module này cung cấp cổng thông tin tài liệu trực quan tương tác (**Web Documentation Portal**) phục vụ trực tiếp trên HTTP port `http://localhost:3000/docs`:

1. **Web Documentation Portal (`GET /docs`)**:
   - Giao diện Single Page Application (SPA) với thiết kế **Glassmorphic Dark Mode**.
   - Hỗ trợ Sidebar tab chuyển đổi linh hoạt giữa 12 module kỹ thuật.
   - Thể hiện sơ đồ luồng dữ liệu (Architecture Flow), so sánh trực quan Naïve vs. Optimized, nút copy câu lệnh cURL và bảng tổng hợp Benchmark.

2. **JSON Metadata REST APIs (`GET /api/v1/system-docs/modules`)**:
   - Trả về danh sách định dạng JSON đầy đủ các bước thực thi, thông số endpoint, và chỉ số hiệu năng cho từng module.

## Endpoints

- **`GET /docs`**: Mở cổng Web Portal tài liệu trực quan trên trình duyệt.
- **`GET /api/v1/system-docs/modules`**: Trả về danh sách dữ liệu mô tả 12 modules dưới dạng JSON.
- **`GET /api/v1/system-docs/modules/:id`**: Trả về dữ liệu chi tiết của 1 module theo ID.
