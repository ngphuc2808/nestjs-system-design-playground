# ⚡ Module 1.4: Window Functions & Materialized Views

Module này chứng minh việc đẩy các tác vụ tính toán báo cáo nâng cao xuống PostgreSQL:

1. **SQL Window Functions**:
   - **Naive (`JS Array Aggregation`)**: Load toàn bộ danh sách đơn hàng về RAM Node.js và chạy vòng lặp JS để tính `rank`, `runningTotal`, `previousAmount`, gây ngốn Heap RAM và block Event Loop.
   - **Optimized (`Window Functions`)**: Chạy trực tiếp `ROW_NUMBER() OVER`, `SUM() OVER`, và `LAG() OVER` trong PostgreSQL. Trả về đúng kết quả đã tính sẵn với dung lượng Heap RAM xấp xỉ `0 MB`.

2. **Materialized Views & Concurrent Refresh**:
   - Khởi tạo Materialized View `mv_user_order_analytics` bọc sẵn tổng hợp `totalOrders`, `totalSpent`, `avgOrderAmount`.
   - Thực thi `REFRESH MATERIALIZED VIEW CONCURRENTLY` thông qua Unique Index mà không lock luồng đọc dữ liệu (`SELECT`).

## API Endpoints

- **`GET /api/v1/db-window-mview/naive/analytics?limit=50`**: Test Naive JS Array loop.
- **`GET /api/v1/db-window-mview/optimized/analytics/window?limit=50`**: Test SQL Window Functions.
- **`GET /api/v1/db-window-mview/optimized/analytics/mview?limit=50`**: Test đọc Materialized View.
- **`POST /api/v1/db-window-mview/optimized/mview/refresh`**: Kích hoạt Concurrent Refresh Materialized View.
