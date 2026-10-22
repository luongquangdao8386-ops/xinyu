# Xinyu — hướng dẫn cho Claude

App cá nhân học tiếng Trung và luyện thi HSK 3.0 cho một người dùng (chủ repo). Giao diện và phần giải thích viết bằng tiếng Việt.

## Bắt đầu mỗi phiên

1. Đọc `docs/tien-do.md` trước tiên.
2. Làm việc người dùng giao. Nếu người dùng chỉ nói “làm tiếp”, làm việc chưa xong đầu tiên theo thứ tự khuyến nghị trong `docs/tien-do.md`.
3. Đặc tả `docs/dac-ta.md` (bản 1.14) dài gần 1.000 dòng: không đọc hết. Tìm vị trí các mục bằng `grep -n '^##' docs/dac-ta.md`, rồi chỉ đọc những mục ghi trong bảng dưới.
4. Mỗi phiên làm một việc. Chạy thử hoặc kiểm tra trước khi commit.
5. Cuối phiên: đánh dấu việc đã xong, ghi một dòng vào Nhật ký trong `docs/tien-do.md` (đã làm gì, phiên sau cần biết gì), commit, rồi đẩy lên `main`. Chủ repo đã đồng ý đẩy thẳng lên `main`.

## Việc nào đọc mục nào trong đặc tả

| Việc | Mục |
|---|---|
| Đề cương, danh sách HSK 1, lộ trình bài | 3.1, 3.2, 11.1; `docs/lo-trinh-hsk1.md` |
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
- Giao diện dựng theo bảng ảnh trong `design/` (danh mục và những chỗ app khác bảng ở `design/README.md`): xem bảng của màn trước khi làm. Màu theo mục 8.1 (đỏ son `#AB483B`, tiêu đề `#4E120C`). Đúng/sai luôn có biểu tượng và chữ, không chỉ dựa vào màu.
- Chữ Hán giản thể, gắn `lang="zh-CN"`; Pinyin theo mục 11.2.
- Không dùng điểm phát âm giả, huy chương, thưởng chuỗi ngày hay tỷ lệ đỗ.
- Mã màn theo mục 9.1; không dùng lại mã 31–33.
- Khi đổi một quyết định trong đặc tả: sửa `docs/dac-ta.md`, tăng số phiên bản và ghi vào Phụ lục A.

## Môi trường

- Phiên ngày 21/10/2026: môi trường cloud chặn các trang .cn và nhiều trang web khác; npm và raw.githubusercontent.com vẫn tải được. Khi cần tài liệu từ trang bị chặn, nhờ người dùng gửi tệp.
- Người dùng đã cho phép docs.google.com và *.googleusercontent.com để đọc Google Sheet công bố.
- Wikimedia đã mở (22/10/2026), nhưng API của commons.wikimedia.org và tệp gốc trên upload.wikimedia.org thường trả 429 vì IP dùng chung. Tìm tệp qua trang `Special:Search` (HTML); tải ảnh ở cỡ thu nhỏ chuẩn (330, 960, 1280, 3840 px) theo đường dẫn `upload.wikimedia.org/wikipedia/commons/thumb/…`, gửi User-Agent có tên công cụ và địa chỉ repo, thử lại chậm khi gặp 429.
- Google Cloud Text-to-Speech: khóa API là network secret của môi trường cloud, proxy tự gắn header `X-Goog-Api-Key` cho texttospeech.googleapis.com nên script không cần khóa. Trang tài liệu docs.cloud.google.com bị chặn; xem cấu trúc API ở `https://texttospeech.googleapis.com/$discovery/rest?version=v1`.

## Lệnh

- Trích danh sách đề cương: `node tools/trich-de-cuong.mjs <tệp-pdf> [cấp]` (cần `pdftotext`), ghi ra `content/de-cuong/hsk<cấp>.json`. Hiện mới khai báo số trang của cấp 1; cấp khác thêm vào bảng `TRANG` trong script.
- Google Sheet nội dung (công bố dạng .xlsx, tự cập nhật sau vài phút): `https://docs.google.com/spreadsheets/d/e/2PACX-1vQnaG34ixtjKtqfgf6IFNRp9s5t9XEfqOOb_-QCQLWn_qNbdlHNDW1gX2j3fCgC9GtPsnpnsso-MaqD/pub?output=xlsx`. Khi người dùng nói “xây nội dung”, chạy công cụ với đường dẫn này.
- Xây nội dung từ Google Sheet: `node tools/xay-noi-dung.mjs <tệp .xlsx | thư mục CSV | đường dẫn .xlsx>`, ghi JSON vào `content/` và in báo cáo kiểm tra; mã thoát 1 khi dòng “đã kiểm tra” có lỗi. Lần đầu tự tải CC-CEDICT qua npm vào `tools/.cache/`.
- Sinh lại mẫu Sheet và `docs/mau-sheet.md` sau khi sửa `tools/lib/cau-truc.mjs`: `node tools/tao-mau-sheet.mjs`.
- Lộ trình bài HSK 1: sửa `tools/lo-trinh/hsk1.mjs`, rồi chạy `node tools/tao-lo-trinh.mjs` (kiểm tra đủ 300 từ, 70 điểm ngữ pháp; sinh `docs/lo-trinh-hsk1.md`, `tools/mau/bai-hsk1.csv` và `content/lo-trinh.json` cho app) và `node tools/tao-mau-sheet.mjs`.
- Soạn nội dung (A4, A7…): viết vào `tools/noi-dung/<việc>.mjs` (mỗi tab một mảng, theo tên trường JSON của `tools/lib/cau-truc.mjs`), rồi chạy `node tools/dien-noi-dung.mjs <đường dẫn Sheet công bố>`: đọc Sheet, chỉ điền ô trống và thêm dòng mới, ghi `tools/ra/xinyu-noi-dung.xlsx`, chạy thử kiểm tra trên các dòng vừa soạn (phải 0 lỗi). Gửi tệp cho người dùng nhập bằng Tệp > Nhập > Tải lên > Thay thế bảng tính; dòng mới để “nháp” cho người dùng tự xem rồi đổi sang “đã kiểm tra”.
- Tạo âm thanh mẫu sau mỗi lần xây nội dung: `node tools/tao-am-thanh.mjs` (`--thu` để xem trước, `--lam-lai <mã>` để tạo lại một mục). Tạo MP3 cho âm tiết, từ, câu mới hoặc đã sửa vào `audio/`, tự kiểm tra thanh điệu, ghi trang nghe duyệt `tools/ra/nghe-duyet.html`. Đăng lại trang đó vào Artifact `https://claude.ai/artifact/Fux3aY5A32rjeQuYWBjyEJ` (truyền `url`) để người dùng nghe; tệp người dùng đánh dấu “Cần sửa” đọc bằng ArtifactData, bộ sưu tập `canSua`. Đổi giọng hoặc ép cách đọc riêng một mục ở `tools/am-thanh/cau-hinh.mjs`.
- Tranh mực của app (`app/hinh/tranh-nui.webp`, `tranh-goc.webp`): `node tools/tao-tranh.mjs` (cần ImageMagick và ffmpeg). Nguồn, khung cắt và cách xử lý ghi ở đầu script; đổi tranh thì sửa `NGUON` và `TRANH` trong script.
- Font của app: `node tools/tao-font.mjs` sau mỗi lần xây nội dung có chữ Hán mới (cắt font Noto theo chữ trong `content/` và `app/`, ghi `vendor/font/`). Số tệp font đổi thì sửa danh sách lưu sẵn trong `sw.js`.
- Chạy app trên máy: `python3 -m http.server 8765` ở thư mục cha của repo rồi mở `http://127.0.0.1:8765/xinyu/` (giống đường dẫn GitHub Pages). Chạy thử tự động bằng Playwright có sẵn ở `/opt/node-tools/node_modules/playwright`; github.io bị chặn trong môi trường cloud.
- Thêm tệp vào `app/`, `vendor/font/` hoặc `content/`: thêm vào `LUU_SAN` trong `sw.js`; đổi cách lưu của service worker thì tăng `BAN`.
- Kiểm thử công cụ và app: `node --test 'tools/kiem-thu/*.test.mjs'`.
