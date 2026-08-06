# ⚡ Module 1.2: Sargable Queries & Parameter Plan Caching

Module này chứng minh 2 nguyên lý tối ưu SQL quan trọng trong PostgreSQL:

1. **Sargable Queries (Search Argument Able)**:
   - **Non-Sargable (`naive`)**: Bọc hàm cột `WHERE DATE(created_at) = '2026-08-05'` triệt hạ B-Tree Index, ép PostgreSQL thực hiện Sequential Scan toàn bộ bảng.
   - **Sargable (`optimized`)**: Viết dạng Range Query `WHERE created_at >= '2026-08-05 00:00:00' AND created_at <= '2026-08-05 23:59:59'` giúp PostgreSQL tận dụng B-Tree Index Range Scan.

2. **Prepared Statement Parameter Binding ($1, $2)**:
   - **String Concatenation (`naive`)**: Nối chuỗi SQL (`WHERE username = '${name}'`) khiến PostgreSQL phải parse và lập kế hoạch thực thi (Plan Compilation) liên tục mỗi request, gây lãng phí CPU dưới tải cao.
   - **Prepared Statements (`optimized`)**: Dùng tham số `$1` giúp PostgreSQL lưu vệt và tái sử dụng Query Plan (Plan Cache Hit), đồng thời triệt tiêu rủi ro SQL Injection.

## API Endpoints

- **`GET /api/v1/db-sargable/naive/date-search?targetDate=2026-08-05`**: Test Non-Sargable `DATE()` wrapper.
- **`GET /api/v1/db-sargable/optimized/date-range?targetDate=2026-08-05`**: Test Sargable Date Range.
- **`GET /api/v1/db-sargable/naive/raw-string?username=user_100`**: Test Raw String Concatenation.
- **`GET /api/v1/db-sargable/optimized/parameter-binding?username=user_100`**: Test Prepared Statement Parameter Binding.
