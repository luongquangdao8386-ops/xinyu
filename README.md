# Xinyu — 新语 (Xīnyǔ)

App cá nhân học tiếng Trung và luyện thi HSK theo HSK 3.0, giải thích bằng tiếng Việt. Giao diện nền giấy ngà, tranh mực đen–xám, điểm nhấn đỏ son.

## Trạng thái

Đang ở giai đoạn A (chuẩn bị nội dung), chưa có app. Đặc tả hiện hành: [docs/dac-ta.md](docs/dac-ta.md) (bản 1.8). Việc theo từng phiên và nhật ký: [docs/tien-do.md](docs/tien-do.md).

## Định hướng kỹ thuật

- PWA tĩnh trên GitHub Pages; HTML, CSS và JavaScript thuần; chạy được khi không có mạng.
- Dữ liệu học lưu trên máy (IndexedDB); sao lưu bằng tệp; đồng bộ điện thoại–máy tính qua Google Apps Script và Google Sheet, bảo vệ bằng mã PIN.
- Nội dung soạn trên Google Sheets; script xuất ra JSON và kiểm tra tự động trước khi dùng.

## Cấu trúc thư mục dự kiến

| Thư mục | Nội dung |
|---|---|
| `docs/` | Đặc tả |
| `design/` | Bảng ảnh thiết kế ([quy ước](design/README.md)) |
| `content/` | Nội dung JSON, sinh từ công cụ biên soạn |
| `audio/` | Âm thanh mẫu |
| `tools/` | Script biên soạn, kiểm tra nội dung và tạo âm thanh |
| `apps-script/` | Mã Apps Script cho đồng bộ (không chứa mã PIN hay khóa) |

## Quy tắc cho repo công khai

Không đưa lên repo: khóa API, mã PIN, tệp `.env`, và tài liệu có bản quyền (bài khóa, bài tập, âm thanh của giáo trình, đề thi thật).
