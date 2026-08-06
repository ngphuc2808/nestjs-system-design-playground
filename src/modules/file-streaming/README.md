# ⚡ Module 4.2: High-Performance Large File Streaming & Backpressure Processing

Module này minh họa kỹ thuật xử lý file dung lượng lớn (hàng triệu dòng CSV/Excel) bằng **Node.js Pipeline Streams** giúp kiểm soát dung lượng RAM cố định **< 30 MB**:

1. **Full-File RAM Buffering (`naive`)**:
   - `POST /api/v1/file-streaming/naive/upload`.
   - Đọc toàn bộ nội dung file vào bộ nhớ V8 bằng `fs.readFileSync()`. Dung lượng RAM tiêu thụ tăng tuyến tính theo kích thước file, gây nguy cơ sập server do **Heap Out-of-Memory (OOM)**.

2. **Chunked Stream Ingestion với Backpressure (`optimized`)**:
   - `POST /api/v1/file-streaming/optimized/stream-upload`.
   - Sử dụng `fs.createReadStream()` kết hợp `readline` đọc theo từng dòng và gom batch 1,000 bản ghi/lượt với cơ chế **Stream Backpressure**. Dung lượng bộ nhớ duy trì ổn định **< 30 MB RAM** dù file lên tới hàng triệu bản ghi.

3. **Chunked HTTP CSV Export Stream**:
   - `GET /api/v1/file-streaming/optimized/export-csv`.
   - Trả về dòng dữ liệu trực tiếp dưới dạng HTTP Response Chunked (`Transfer-Encoding: chunked`), không cần tạo file tạm trên đĩa.

4. **Utility Generate Large CSV File**:
   - `POST /api/v1/file-streaming/generate-sample-csv`: Khởi tạo file CSV mẫu 50,000 dòng để benchmark.

## API Endpoints

- **`POST /api/v1/file-streaming/generate-sample-csv`**: Sinh file CSV mẫu lớn (50,000 dòng).
- **`POST /api/v1/file-streaming/naive/upload`**: Test đọc file Naive (phình RAM V8).
- **`POST /api/v1/file-streaming/optimized/stream-upload`**: Test đọc file bằng Stream Backpressure (< 30 MB RAM).
- **`GET /api/v1/file-streaming/optimized/export-csv`**: Stream xuất CSV dung lượng lớn về client.
