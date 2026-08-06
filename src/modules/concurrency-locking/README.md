# ⚡ Module 2.1: Concurrency Control & Locking Strategies

Module này minh họa các kỹ thuật kiểm soát truy cập đồng thời (Concurrency Control) khi trừ tồn kho trong các hệ thống chịu tải cao:

1. **Naive (`Unprotected Read-Modify-Write`)**:
   - `SELECT stock FROM benchmark_products WHERE id = 1` -> `UPDATE benchmark_products SET stock = stock - 1`.
   - Dưới tải đồng thời (ví dụ 500 requests cùng bấm mua), gây ra hiện tượng **Lost Updates** và tồn kho bị âm (Overbooking).

2. **Optimistic Concurrency Control (`OCC Version Column`)**:
   - `UPDATE benchmark_products SET stock = stock - 1, version = version + 1 WHERE id = $1 AND version = $2 AND stock >= $1`.
   - Trả về lỗi nếu bản ghi đã bị sửa bởi request khác; phù hợp cho ứng dụng ghi ít xung đột.

3. **Pessimistic Locking (`FOR UPDATE`)**:
   - `SELECT stock FROM benchmark_products WHERE id = $1 FOR UPDATE` trong DB transaction.
   - Khóa bản ghi ở cấp độ Database Row, tuần tự hóa tất cả các thao tác ghi, đảm bảo không bao giờ bán quá tồn kho.

4. **PostgreSQL Advisory Locks (`pg_advisory_xact_lock`)**:
   - `SELECT pg_advisory_xact_lock(hashtext('product_1'))` trong DB transaction.
   - Giữ khóa ứng dụng theo key trong transaction mà không khóa toàn bộ bảng.

## API Endpoints

- **`POST /api/v1/concurrency-locking/seed`**: Reset tồn kho sản phẩm về 100 đơn vị.
- **`POST /api/v1/concurrency-locking/naive/deduct`**: Test trừ kho Naive (có nguy cơ bán lố).
- **`POST /api/v1/concurrency-locking/optimized/deduct/optimistic`**: Test Optimistic Lock (Version Column).
- **`POST /api/v1/concurrency-locking/optimized/deduct/pessimistic`**: Test Pessimistic Lock (`FOR UPDATE`).
- **`POST /api/v1/concurrency-locking/optimized/deduct/advisory`**: Test PostgreSQL Advisory Lock.
