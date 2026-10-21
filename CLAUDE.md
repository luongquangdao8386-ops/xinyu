# Xinyu — hướng dẫn cho Claude

App cá nhân học tiếng Trung và luyện thi HSK 3.0 cho một người dùng (chủ repo). Giao diện và phần giải thích viết bằng tiếng Việt.

## Bắt đầu mỗi phiên

1. Đọc `docs/tien-do.md` trước tiên.
2. Làm việc người dùng giao. Nếu người dùng chỉ nói “làm tiếp”, làm việc chưa xong đầu tiên theo thứ tự khuyến nghị trong `docs/tien-do.md`.
3. Đặc tả `docs/dac-ta.md` (bản 1.6) dài gần 1.000 dòng: không đọc hết. Tìm vị trí các mục bằng `grep -n '^##' docs/dac-ta.md`, rồi chỉ đọc những mục ghi trong bảng dưới.
4. Mỗi phiên làm một việc. Chạy thử hoặc kiểm tra trước khi commit.
5. Cuối phiên: đánh dấu việc đã xong, ghi một dòng vào Nhật ký trong `docs/tien-do.md` (đã làm gì, phiên sau cần biết gì), commit, rồi đẩy lên `main`. Chủ repo đã đồng ý đẩy thẳng lên `main`.

## Việc nào đọc mục nào trong đặc tả

| Việc | Mục |
|---|---|
| Đề cương, danh sách HSK 1 | 3.1, 11.1 |
| Công cụ biên soạn | 11, 12.8 |
| Soạn nội dung bài | 3.3, 5.2–5.5, 5.7–5.9, 11 |
| Âm thanh | 12.3, 12.4 |
| Khung app, giao diện | 8, 9.1, 12.1, 12.2, 12.7 |
| Lần đầu mở app, lộ trình, bài học | 4.2, 5.1–5.3, 9.1, 10.1, 10.2 |
| Luyện chữ | 7, 11.3 |
| Ôn tập, sổ lỗi | 5.4, 5.10, 10.3 |
| Luyện nói và nghe | 5.7, 10.7, 12.4 |
| Luyện thi | 6, 10.4 |
| Đọc mở rộng, sổ từ riêng, cặp dễ nhầm, bài tự sinh | 5.8, 5.9, 10.8, 11.8, 12.9 |
| Sao lưu, đồng bộ, nhắc học | 12.2, 12.5, 12.6 |
| Bố cục máy tính | 8.5 |

## Quy tắc cố định

- Giao diện, nội dung và commit message viết bằng tiếng Việt.
- App dùng HTML, CSS và JavaScript thuần: không framework, không bước build. Thư viện ngoài để trong `vendor/` với phiên bản cố định để chạy offline. Script công cụ (Node) để trong `tools/`.
- Repo công khai: không đưa lên khóa API, mã PIN, tệp `.env` hay tài liệu có bản quyền (bài khóa, bài tập, âm thanh giáo trình, đề thi thật).
- Màu theo mục 8.1 (đỏ son `#AB483B`). Đúng/sai luôn có biểu tượng và chữ, không chỉ dựa vào màu.
- Chữ Hán giản thể, gắn `lang="zh-CN"`; Pinyin theo mục 11.2.
- Không dùng điểm phát âm giả, huy chương, thưởng chuỗi ngày hay tỷ lệ đỗ.
- Mã màn theo mục 9.1; không dùng lại mã 31–33.
- Khi đổi một quyết định trong đặc tả: sửa `docs/dac-ta.md`, tăng số phiên bản và ghi vào Phụ lục A.

## Môi trường

- Phiên ngày 21/10/2026: môi trường cloud chặn các trang .cn và nhiều trang web khác; npm và raw.githubusercontent.com vẫn tải được. Khi cần tài liệu từ trang bị chặn, nhờ người dùng gửi tệp.
- Người dùng đã cho phép docs.google.com và *.googleusercontent.com để đọc Google Sheet công bố.

## Lệnh

- Trích danh sách đề cương: `node tools/trich-de-cuong.mjs <tệp-pdf> [cấp]` (cần `pdftotext`), ghi ra `content/de-cuong/hsk<cấp>.json`. Hiện mới khai báo số trang của cấp 1; cấp khác thêm vào bảng `TRANG` trong script.
- Google Sheet nội dung (công bố dạng .xlsx, tự cập nhật sau vài phút): `https://docs.google.com/spreadsheets/d/e/2PACX-1vQnaG34ixtjKtqfgf6IFNRp9s5t9XEfqOOb_-QCQLWn_qNbdlHNDW1gX2j3fCgC9GtPsnpnsso-MaqD/pub?output=xlsx`. Khi người dùng nói “xây nội dung”, chạy công cụ với đường dẫn này.
- Xây nội dung từ Google Sheet: `node tools/xay-noi-dung.mjs <tệp .xlsx | thư mục CSV | đường dẫn .xlsx>`, ghi JSON vào `content/` và in báo cáo kiểm tra; mã thoát 1 khi dòng “đã kiểm tra” có lỗi. Lần đầu tự tải CC-CEDICT qua npm vào `tools/.cache/`.
- Sinh lại mẫu Sheet và `docs/mau-sheet.md` sau khi sửa `tools/lib/cau-truc.mjs`: `node tools/tao-mau-sheet.mjs`.
- Kiểm thử công cụ: `node --test 'tools/kiem-thu/*.test.mjs'`.
