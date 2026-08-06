# ⚡ Module 1.5: Immutable Financial Ledger Pattern (SHA-256 Chaining)

Module này triển khai mô hình **Sổ cái tài chính bất biến Append-Only** đánh chuỗi Hash mã hóa SHA-256 nối tiếp:

1. **Naive (`In-Place Balance Updates`)**:
   - `UPDATE benchmark_ledger_accounts SET balance = balance + X`.
   - Trực tiếp chỉnh sửa giá trị số dư trong bảng, không lưu vết lịch sử giao dịch. Bất kỳ ai truy cập DB đều có thể sửa số dư mà không thể phát hiện.

2. **Optimized (`Append-Only Cryptographic Hash Chain`)**:
   - Ghi nhận mỗi giao dịch vào `benchmark_ledger_transactions`.
   - Tính toán `currentHash = SHA256(previousHash + accountId + amount + type + timestamp)`.
   - Giao dịch trước đó làm nền tảng cho giao dịch tiếp theo. Nếu bất kỳ bản ghi nào bị can thiệp (chỉnh sửa số tiền hoặc thông tin), toàn bộ chuỗi Hash đằng sau sẽ bị phá vỡ.
   - Endpoint `GET /api/v1/db-ledger/optimized/verify` quét toàn bộ sổ cái và phát hiện ngay vị trí bản ghi bị can thiệp.

## API Endpoints

- **`POST /api/v1/db-ledger/naive/transfer`**: Test cập nhật số dư trực tiếp (Naive).
- **`POST /api/v1/db-ledger/optimized/transfer`**: Ghi nhận giao dịch tài chính Append-Only đánh chuỗi SHA-256.
- **`GET /api/v1/db-ledger/optimized/transactions?accountId=ACC_1001`**: Xem lịch sử biến động sổ cái.
- **`GET /api/v1/db-ledger/optimized/verify`**: Quét kiểm tra tính toàn vẹn của chuỗi Hash SHA-256.
- **`POST /api/v1/db-ledger/optimized/simulate-tampering`**: Giả lập hành vi sửa trộm dữ liệu DB trực tiếp để kiểm thử cơ chế phát hiện phá vỡ chuỗi Hash.
