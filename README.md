# Xinyu — 新语 (Xīnyǔ)

App cá nhân học tiếng Trung và luyện thi HSK theo HSK 3.0, giải thích bằng tiếng Việt. Giao diện nền giấy ngà, tranh mực đen–xám, điểm nhấn đỏ son.

## Trạng thái

Đã có khung app (B1.1), lộ trình, bài học (B1.2) và các hoạt động trong bài (B1.3): thiết lập lần đầu, kế hoạch học, 5 tab, lộ trình các chặng, chi tiết bài; âm và thanh, nghe và đọc hội thoại, từ vựng, mẫu câu, nhại theo và đóng vai có ghi âm; kiểm tra mục tiêu bài, hoàn thành bài. Luyện chữ, ôn tập và luyện thi đang xây. Đặc tả hiện hành: [docs/dac-ta.md](docs/dac-ta.md) (bản 1.15). Việc theo từng phiên và nhật ký: [docs/tien-do.md](docs/tien-do.md).

## Định hướng kỹ thuật

- PWA tĩnh trên GitHub Pages; HTML, CSS và JavaScript thuần; chạy được khi không có mạng.
- Dữ liệu học lưu trên máy (IndexedDB); sao lưu bằng tệp; đồng bộ điện thoại–máy tính qua Google Apps Script và Google Sheet, bảo vệ bằng mã PIN.
- Nội dung soạn trên Google Sheets; script xuất ra JSON và kiểm tra tự động trước khi dùng.

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `index.html`, `sw.js`, `manifest.webmanifest` | Trang app, service worker, thông tin cài đặt |
| `app/` | Giao diện app: CSS, module JavaScript, biểu tượng |
| `vendor/` | Thư viện và font ngoài, phiên bản cố định |
| `docs/` | Đặc tả |
| `design/` | Bảng ảnh thiết kế ([quy ước](design/README.md)) |
| `content/` | Nội dung JSON, sinh từ công cụ biên soạn |
| `audio/` | Âm thanh mẫu |
| `tools/` | Script biên soạn, kiểm tra nội dung và tạo âm thanh |
| `apps-script/` | Mã Apps Script cho đồng bộ (không chứa mã PIN hay khóa) |

## Quy tắc cho repo công khai

Không đưa lên repo: khóa API, mã PIN, tệp `.env`, và tài liệu có bản quyền (bài khóa, bài tập, âm thanh của giáo trình, đề thi thật).
