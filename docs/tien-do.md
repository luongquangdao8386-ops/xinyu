# Tiến độ Xinyu

**Cập nhật:** 21/10/2026. **Việc tiếp theo:** A5.

**Thứ tự khuyến nghị:** A1 → A2 → A3 → A4 → A5 → B1.1 → B1.2 → B1.3, sau đó soạn các cụm A7 xen kẽ với B1.4–B1.8. Như vậy Nền phát âm chạy được trong app sớm, không phải đợi soạn xong toàn bộ HSK 1.

Mỗi việc dưới đây làm trong một phiên. “Cần” là thứ người dùng chuẩn bị trước khi mở phiên.

## Đã xong

- [x] Đặc tả 1.4 (`docs/dac-ta.md`), README, quy ước bảng ảnh, `CLAUDE.md`, tệp tiến độ này.

## Giai đoạn A — Chuẩn bị nội dung và thiết kế

- [x] **A1. Danh sách HSK 1:** `content/de-cuong/hsk1.json` có 300 từ, 246 chữ nhận biết, 100 chữ viết tay (chung cấp 1–2) và 70 điểm ngữ pháp; số liệu ghi ở mục 3.1 của đặc tả (bản 1.5).
  - Nguồn: [bản sao trên GitHub](https://raw.githubusercontent.com/becky82/mteh/main/sources/HSK3.1/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B2%EF%BC%88%E8%AF%8D%E6%B1%87%E3%80%81%E6%B1%89%E5%AD%97%E3%80%81%E8%AF%AD%E6%B3%95%EF%BC%89.pdf), 317 trang; mã SHA-256 ghi trong tệp JSON. Không đưa tệp PDF vào repo.
  - Trích lại: `node tools/trich-de-cuong.mjs <tệp-pdf> 1`. Nếu người dùng có bản tải từ trang chính thức thì chạy lại với bản đó và so sánh thay đổi bằng `git diff`.
- [x] **A2. Công cụ biên soạn** (mục 12.8): mẫu `tools/mau/xinyu-noi-dung.xlsx` (điền sẵn 300 từ, 246 chữ, 70 điểm ngữ pháp HSK 1), cấu trúc ở `docs/mau-sheet.md`, script `tools/xay-noi-dung.mjs` chạy kiểm tra 11.6 bước 1–4 và xuất JSON vào `content/`; 13 kiểm thử.
  - Người dùng cần làm: tải mẫu lên Google Drive, mở bằng Google Trang tính, Tệp > Lưu dưới dạng Google Trang tính. Khi muốn xây nội dung: Tệp > Tải xuống > .xlsx rồi gửi tệp vào phiên.
- [x] **A3. Lộ trình bài** Nền phát âm và HSK 1 dựng từ đề cương (không có giáo trình): `docs/lo-trinh-hsk1.md`, 56 bài (PA01–PA08, H1-01–H1-48), đủ 300 từ và 70 điểm ngữ pháp; nguồn `tools/lo-trinh/hsk1.mjs`, tab Bai nhập từ `tools/mau/bai-hsk1.csv`.
- [x] **A4. Nội dung Nền phát âm:** âm đầu, vần, thanh điệu, 20 cặp thanh, thanh nhẹ, biến điệu, lời chào. Nguồn `tools/noi-dung/a4-phat-am.mjs`: 76 mục phát âm (tab PhatAm mới), 20 cặp thanh, 72 câu hỏi, 8 câu chào (PA08), cột còn trống của bài PA01–PA08, nghĩa 53 từ dùng làm ví dụ, ngữ pháp NP1-45. Công cụ mới `tools/dien-noi-dung.mjs` điền vào Sheet; đặc tả 1.8.
  - Đã nhập vào Google Sheet, người dùng xem lại và đánh dấu “đã kiểm tra”; đã xây nội dung: `content/` có 8 bài PA01–PA08, 76 mục phát âm, 20 cặp thanh, 72 câu hỏi, 8 câu, 53 từ, 1 điểm ngữ pháp.
- [ ] **A5. Âm thanh:** script `tools/tao-am-thanh` và âm thanh cho Nền phát âm. Cần: chọn dịch vụ giọng máy; khóa đặt trong biến môi trường của môi trường cloud, không đưa vào repo.
- [ ] **A6. Phác bố cục** 13A–13D và 47 bằng HTML tĩnh trong `design/`.
- [ ] **A7. Nội dung HSK 1**, mỗi phiên một cụm, kèm từ Hán Việt, so sánh ngữ pháp, bộ thủ, cặp dễ nhầm và âm thanh của cụm. Bài của từng cụm theo `docs/lo-trinh-hsk1.md`.
  - [ ] A7.1 Tên, thông tin cá nhân, câu hỏi cơ bản
  - [ ] A7.2 Gia đình, số đếm, ngày giờ
  - [ ] A7.3 Ăn uống, mua sắm
  - [ ] A7.4 Địa điểm, di chuyển
  - [ ] A7.5 Hẹn gặp, ôn tập tổng hợp
- [ ] **A8. Bảng ảnh:** người dùng tải bảng ảnh vào `design/` theo quy ước trong `design/README.md`.

## Giai đoạn B1 — Lõi học tập

- [ ] **B1.1 Khung app:** cấu trúc thư mục, giao diện chung (màu, font, 5 tab), service worker, IndexedDB, bật GitHub Pages; màn 01–04.
- [ ] **B1.2 Lộ trình và bài học:** 05, 06, 07, 08, 39, 42, 34A.
- [ ] **B1.3 Hoạt động trong bài:** 09, 09A, 09B, 10, 11, 12, 35.
- [ ] **B1.4 Luyện chữ:** 13, 13A–13D (Hanzi Writer).
- [ ] **B1.5 Ôn tập:** 16 (FSRS), 17, 34B, chế độ 5 phút, ghi chú mẹo nhớ.
- [ ] **B1.6 Luyện tập và thanh điệu:** 44, 47.
- [ ] **B1.7 Các màn còn lại:** 14, 18, 34C, 28, 29, 46 (sao lưu bằng tệp).
- [ ] **B1.8 Chạy thử trên iPhone**, sửa lỗi, chốt bản B1.

## Giai đoạn B2 — Luyện thi và mở rộng

- [ ] **B2.1 Luyện thi:** 19–26, 40, 43, 34D.
- [ ] **B2.2 Đường cao độ** (09A, 12, 47) và nghe chép (45).
- [ ] **B2.3 Đọc mở rộng** (48) và sổ từ riêng (49).
- [ ] **B2.4 Cặp dễ nhầm và bài luyện tự sinh** (43).
- [ ] **B2.5 Tiến bộ và tổng quan cấp:** 27, 41; dự báo ôn, ước tính hoàn thành, chế độ nước rút (04, 05).
- [ ] **B2.6 Bố cục máy tính:** 37, 38 và mục 8.5.
- [ ] **B2.7 Đồng bộ và nhắc học:** Apps Script, mã PIN, email nhắc học, 36 và phần đồng bộ của 46.

## Giai đoạn C — Mở rộng

- [ ] **C1** Hội thoại AI (15) và nhận xét câu viết.
- [ ] **C2** Nhận dạng giọng nói.
- [ ] **C3** Trợ giúp (30) và từ điển Trung–Việt đầy đủ.
- [ ] **C4** HSK 2 trở đi.

## Nhật ký

| Ngày | Việc | Ghi chú cho phiên sau |
|---|---|---|
| 21/10/2026 | Đặc tả 1.4, README, quy ước bảng ảnh, `CLAUDE.md`, tệp tiến độ | Bắt đầu A1 |
| 21/10/2026 | Tìm và kiểm tra bản sao đề cương thi trên GitHub | A1 tải PDF trực tiếp, không cần người dùng gửi |
| 21/10/2026 | A1: script `tools/trich-de-cuong.mjs`, `content/de-cuong/hsk1.json`, đặc tả 1.5 | Pinyin trong đề cương là dạng hiển thị (ghi biến điệu 一, 不: bú kèqi, yíxià), A2 cần sinh thêm Pinyin gốc. Mã ngữ pháp NP1-01…NP1-70 do Xinyu đặt. 店, 饺 có trong từ HSK 1 nhưng không thuộc chữ nhận biết HSK 1 (trường `doiChieu`). Đã đối chiếu Pinyin với gói `pinyin-pro`: chỉ khác ở thanh nhẹ, âm 儿 và chữ viết hoa |
| 21/10/2026 | A2: công cụ biên soạn, mẫu Sheet, kiểm thử, đặc tả 1.6 | Không dùng thư viện npm: đọc/ghi XLSX tự viết trong `tools/lib/bang-tinh.mjs`. Bảng âm tiết Pinyin sinh bằng mã (âm đầu × vần); viết nguyên bảng ra từng bị bộ lọc nội dung của API chặn. Môi trường cloud chặn docs.google.com và mdbg.net; CC-CEDICT lấy qua npm. Chưa chạy trên Sheet thật vì người dùng chưa tạo Sheet |
| 21/10/2026 | Người dùng tạo Google Sheet từ mẫu, công bố dạng .xlsx, mở mạng tới docs.google.com | Đường dẫn ghi trong `CLAUDE.md`; công cụ đọc được (300 từ, 246 chữ, 70 ngữ pháp, chưa dòng nào “đã kiểm tra”). `xay-noi-dung.mjs` tự chạy lại với NODE_USE_ENV_PROXY=1 vì fetch của Node không tự đi qua proxy |
| 21/10/2026 | A3 không cần sách: lộ trình 56 bài từ đề cương, đặc tả 1.7 | Người dùng không có 贯通中文 nên bỏ đối chiếu giáo trình. Người dùng cần nhập `tools/mau/bai-hsk1.csv` vào tab Bai của Google Sheet (ô A1, “Thay thế dữ liệu tại ô đã chọn”). Điểm ngữ pháp nhiều từ gán vào bài giới thiệu lần đầu (danh sách ở cuối `docs/lo-trinh-hsk1.md`) |
| 21/10/2026 | Xem đề mẫu HSK 1 người dùng gửi (không đưa tệp vào repo) | Đề này là **HSK 2.0** (国家汉办/孔子学院总部, “新汉语水平考试”, có từ ngoài danh sách HSK 3.0 như 小姐), chưa phải HSK 3.0. Cấu trúc: 40 câu, khoảng 40 phút; nghe 20 câu (4 phần × 5: tranh đúng/sai; nghe câu chọn 1 trong 3 tranh; nghe hội thoại ghép với 6 tranh; nghe câu + câu hỏi chọn 1 trong 3), đọc 20 câu (4 phần × 5: tranh và từ đúng/sai; câu ghép với 6 tranh; câu hỏi ghép câu trả lời; điền từ vào chỗ trống), chữ Hán in kèm Pinyin. Dùng tạm cho B2.1; vẫn cần đề mẫu HSK 3.0 (中外语言交流合作中心 phát hành, 2025–2026) |
| 21/10/2026 | A4: nội dung Nền phát âm, tab PhatAm, cột Âm thanh của CauHoi, công cụ `dien-noi-dung.mjs`, đặc tả 1.8 | Nội dung soạn ở `tools/noi-dung/`; công cụ chỉ điền ô trống, giữ chữ người dùng đã sửa. Mỗi âm tiết ví dụ có một chữ đọc mẫu (cột Chữ đọc mẫu) để A5 tạo âm thanh bằng giọng máy đọc chữ Hán; câu hỏi nghe ghi rõ thứ được phát ở cột Âm thanh (từ, mã câu hoặc âm tiết của tab PhatAm). Hán Việt mới ghi cho 9 từ chắc chắn cùng nghĩa, còn lại để A7. Chưa kiểm tra việc nhập “Thay thế bảng tính” có giữ đường dẫn công bố của Sheet hay không: lần chạy công cụ sau sẽ biết |
| 21/10/2026 | Xây nội dung lần đầu từ Sheet: JSON Nền phát âm vào `content/`, 0 lỗi, 0 cảnh báo | “Thay thế bảng tính” giữ nguyên đường dẫn công bố. Người dùng chưa sửa chữ nào trong nội dung A4 (công cụ điền không báo chỗ khác). Lưu ý khi hướng dẫn: người dùng từng đánh dấu “đã kiểm tra” cả các dòng chưa soạn (bài H1, NP1-01–44) — nhắc rõ chỉ đánh dấu dòng vừa soạn |
