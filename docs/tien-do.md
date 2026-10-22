# Tiến độ Xinyu

**Cập nhật:** 22/10/2026. **Việc tiếp theo:** hoàn tất A7.1 (điền nội dung đã soạn vào Google Sheet, người dùng duyệt, xây nội dung, âm thanh, font); B1.4 cần A6 (phác bố cục 13A–13D) trước.

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
- [x] **A5. Âm thanh:** công cụ `tools/tao-am-thanh.mjs` và âm thanh Nền phát âm bằng Google Cloud Text-to-Speech: 173 âm tiết, 53 từ, 8 câu (PA08) trong `audio/` (1,5 MB), kèm đường cao độ, kiểm tra thanh điệu tự động và trang nghe duyệt; 8 kiểm thử mới; đặc tả 1.9 (mục 12.3, 12.8).
  - Giọng: cmn-CN-Wavenet-A (nữ) đọc âm tiết, từ, câu và vai A của hội thoại; Wavenet-C (nam) đọc vai B. Đo trên 173 âm tiết đọc riêng: các giọng Wavenet đúng thanh cả 173, các giọng Chirp 3 HD chỉ 158–168 và mỗi lần gọi ra một khác. Đổi giọng ở `tools/am-thanh/cau-hinh.mjs` rồi chạy lại với `--lam-lai tat-ca` (mất khoảng 30 giây).
  - Trang nghe duyệt (Artifact riêng tư): https://claude.ai/artifact/Fux3aY5A32rjeQuYWBjyEJ. Người dùng cần nghe hết và bấm “Cần sửa” ở tệp sai; phiên sau đọc bộ sưu tập `canSua` bằng ArtifactData rồi sửa (ép cách đọc ở `DOC_RIENG` hoặc đổi chữ đọc mẫu trên Sheet).
  - Máy báo 5 mục cần nghe kỹ: 大学, 时间, 学校 (thanh 2 lên yếu, đặc điểm của giọng, cả ba cách đọc đều vậy) và 对不起 trong từ và câu (不 chưa xuống thấp hẳn; công cụ đã chọn bản gần đúng nhất).
- [ ] **A6. Phác bố cục** 13A–13D và 47 bằng HTML tĩnh trong `design/`.
- [ ] **A7. Nội dung HSK 1**, mỗi phiên một cụm, kèm từ Hán Việt, so sánh ngữ pháp, bộ thủ, cặp dễ nhầm và âm thanh của cụm. Bài của từng cụm theo `docs/lo-trinh-hsk1.md`.
  - [ ] A7.1 Tên, thông tin cá nhân, câu hỏi cơ bản: **đã soạn** ở `tools/noi-dung/a71-ten-thong-tin.mjs` (bài H1-01–H1-10: 85 câu hội thoại vai A – B, nghĩa và câu ví dụ 63 từ, Hán Việt 8 từ gồm 3 bẫy nghĩa 认识, 先生, 女士, 65 chữ có số nét, bộ thủ, cấu tạo, âm Hán Việt, 26 điểm ngữ pháp, 63 câu hỏi kiểm tra, 5 cặp dễ nhầm). Ghép vào mẫu Sheet: 0 lỗi, 0 cảnh báo.
    - Còn lại: chạy `node tools/dien-noi-dung.mjs <đường dẫn Sheet>` (cần mở mạng tới docs.google.com, hoặc người dùng gửi tệp .xlsx tải từ Sheet), gửi `tools/ra/xinyu-noi-dung.xlsx` cho người dùng nhập và duyệt; sau khi người dùng đánh dấu “đã kiểm tra”: xây nội dung, `tao-am-thanh`, đăng trang nghe duyệt, `tao-font`, sửa `LUU_SAN` nếu số tệp font đổi.
  - [ ] A7.2 Gia đình, số đếm, ngày giờ
  - [ ] A7.3 Ăn uống, mua sắm
  - [ ] A7.4 Địa điểm, di chuyển
  - [ ] A7.5 Hẹn gặp, ôn tập tổng hợp
- [x] **A8. Bảng ảnh:** 15 bảng (41 màn) trong `design/`, danh mục và chỗ app khác bảng ở `design/README.md`. Tranh mực trong app nay là tranh thủy mặc cổ hết bản quyền: đoạn cuộn của Vương Huy (1713, Bảo tàng Metropolitan, CC0) có núi, rặng thông, lầu cổng và tháp, tạo bằng `tools/tao-tranh.mjs`; nguồn và cách xử lý ở `design/README.md`.

## Giai đoạn B1 — Lõi học tập

- [x] **B1.1 Khung app:** cấu trúc thư mục, giao diện chung (màu, font, 5 tab), service worker, IndexedDB, bật GitHub Pages; màn 01–04. Đặc tả 1.10 (mục 12.1).
  - Mã ở gốc repo: `index.html`, `sw.js`, `manifest.webmanifest`, `app/` (CSS, `app/js/` mỗi màn một module trong `man/`, biểu tượng dấu son 新), `vendor/font/` (Noto cắt theo chữ trong nội dung, 239 KB, công cụ `tools/tao-font.mjs`). `content/lo-trinh.json` cho app biết toàn bộ 56 bài.
  - Màn 01–04 làm đủ; tab Hôm nay hiện bài tiếp theo, tab Tôi xem và sửa hồ sơ, xin lưu trữ lâu dài, thiết lập lại; Lộ trình, Luyện tập, Thư viện ghi “đang xây” kèm việc sẽ làm.
  - Chạy thử bằng Chromium (khổ iPhone 13 và máy tính 1280 px): đi hết 01 → 05, tải lại vẫn giữ hồ sơ, mở được khi ngoại tuyến, không lỗi console, không cuộn ngang. 4 kiểm thử mới (kế hoạch, danh sách lưu sẵn của service worker, manifest, module).
  - **Người dùng cần làm:** bật GitHub Pages (Settings > Pages > Source: Deploy from a branch > `main`, thư mục `/ (root)` > Save), rồi mở `https://luongquangdao8386-ops.github.io/xinyu/` bằng Safari trên iPhone và Thêm vào MH chính. Môi trường cloud không mở được github.io nên chưa kiểm tra trên trang thật.
- [x] **B1.2 Lộ trình và bài học:** 05, 06, 07, 08, 39, 42, 34A theo bảng 02, 03, 12, 15; phát âm thanh; đặc tả 1.12 (mục 10.2, 12.1).
  - 05 hiện bài tiếp theo theo tiến độ đã lưu và số phút đã học hôm nay; 06 các chặng (chặng chưa có bài bị khóa); 07 chủ đề và bài của Nền phát âm, HSK 1; 08 mục tiêu, hoạt động suy ra từ nội dung bài, tài liệu tham chiếu; 42 kiểm tra mục tiêu bài từ `content/cau-hoi.json` (nghe, nghe chậm, phản hồi ✓/✕ kèm lời giải, câu sai hỏi lại một lần); 39 tổng kết và sang bài tiếp; 34A trạng thái chưa có bài ôn (tab Luyện tập).
  - Hoạt động chưa dựng (12, 47, 09, 09A, 09B, 10, 11, 13) mở màn chờ trong bài, ghi việc sẽ làm và cho sang phần sau; không đánh dấu đã làm. Bài xong khi làm xong kiểm tra.
  - Dữ liệu học mới trong IndexedDB: `tienDo`, `nhatKy`, `lanLam` (`app/js/hoc.mjs`, `app/js/gio-hoc.mjs`); lô-gic lộ trình thuần trong `app/js/bai-hoc.mjs` có kiểm thử; âm thanh trong `app/js/am-thanh.mjs`.
  - Sửa thêm: hai tranh mực cắt tạm dính viền khung điện thoại ở mép phải, đã cắt bỏ.
- [x] **B1.3 Hoạt động trong bài:** 09, 09A, 09B, 10, 11, 12, 35 theo bảng 03, 04, 12; ghi âm; đặc tả 1.14 (mục 10.2, 12.1, 12.4).
  - 12 (Âm và thanh, PA01–PA07): từng mục phát âm, chọn âm tiết hoặc từ ví dụ để nghe, ghi âm, nghe xen kẽ, tự đánh giá. 09 (Nghe & đọc), 10 (Từ vựng), 11 (Mẫu câu), 09A và 09B (Nói) chạy trên PA08; bài luyện dựng từ nội dung của bài (`app/js/bai-tap.mjs`). 35 là bảng trượt lên từ chân màn (`app/js/man/luot-ban.mjs`).
  - Dữ liệu mới (IndexedDB phiên bản 3): `banGhi`, `ghiChu`, `tuDaLuu`; câu trả lời và tự đánh giá của từng hoạt động lưu vào `lanLam` (loại là khóa hoạt động: phat-am, nghe-doc, tu-vung, mau-cau).
  - Chạy thử Chromium khổ iPhone 13 (micro giả) và 1280 px: đi hết PA03 và PA08, ghi âm lưu được, màn 35 với micro bị chặn và luyện không ghi âm, mở được khi ngoại tuyến, không lỗi console, không cuộn ngang; 34 kiểm thử.
  - **Cần thử trên iPhone thật:** ghi âm và nghe lại trong Safari khi cài ra Màn hình chính (âm lượng sau khi ghi, quyền micro hỏi lại mỗi lần mở hay không).
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
| 21/10/2026 | So sánh Google, Azure, Polly cho A5; người dùng chọn Azure | Hướng dẫn người dùng tạo tài nguyên Speech (F0, southeastasia), thêm khóa vào biến môi trường và tên miền vào danh sách cho phép; A5 làm ở phiên mới khi khóa đã có |
| 21/10/2026 | Đổi dịch vụ giọng máy A5 sang Google Cloud TTS | Microsoft chặn tạo tài khoản (“unusual activity”) nên bỏ Azure. Đã gửi hướng dẫn tạo dự án, bật API, tạo khóa API giới hạn và thêm vào môi trường cloud; A5 làm ở phiên mới khi khóa đã có |
| 22/10/2026 | A5: công cụ tạo âm thanh, âm thanh Nền phát âm, trang nghe duyệt, đặc tả 1.9 | Ép cách đọc bằng SSML `<phoneme alphabet="pinyin" ph="huan2">还</phoneme>` (ü viết v, thanh nhẹ 5, âm cuốn lưỡi r5): Wavenet bỏ qua `customPronunciations`, chỉ nhận thẻ này; Chirp 3 HD nhận cả hai. Khi bị ép, giọng máy vẫn tự biến điệu 3-3 nhưng không tự biến điệu 一, 不, nên ép theo Pinyin hiển thị. Ép riêng một chữ giữa từ có thể làm hỏng ngữ điệu (不 trong 对不起), vì vậy công cụ thử ba cách đọc và giữ bản khớp nhất. Âm thanh cho A7 tạo bằng cùng lệnh sau mỗi lần xây nội dung; câu trên 4 âm tiết không tự kiểm thanh điệu, phải nghe. Quota Chirp 3 HD thấp (lỗi 429 khi gửi nhiều yêu cầu), Wavenet không vướng. B1 cần: phát chậm bằng `playbackRate` khoảng 0,75; làm mới bộ nhớ đệm âm thanh theo mã băm trong `audio/danh-sach.json` |
| 22/10/2026 | B1.1: khung app, màn 01–04, IndexedDB, service worker, font cắt sẵn, biểu tượng; đặc tả 1.10 | Không có bảng ảnh trong `design/` nên giao diện dựng theo mục 8 (màu 8.1, font 8.4, bố cục 8.5). Màn 04 ước tính 45 phút mỗi bài (khung 12 tuần). Màn 02 chỉ cho chọn HSK 1; màn 03 chỉ cho chọn bài đã có trong `content/bai.json`, nên sau mỗi cụm A7 các bài mới tự mở. B1.2 làm màn 05 thật, 06, 07, 08, 39, 42, 34A và phát âm thanh (tốc độ chậm bằng `playbackRate`, làm mới bộ nhớ đệm theo mã băm). Chưa xác nhận GitHub Pages đã bật |
| 22/10/2026 | A8 và sửa giao diện B1.1 theo bảng ảnh; đặc tả 1.11 | Người dùng gửi 15 bảng ảnh (bảng 04 gửi hai lần, giữ một) và xác nhận chỉ đổi tên Hán Lộ thành Xinyu, còn lại theo bảng. Trước đó repo chưa có bảng nên B1.1 dựng theo chữ mô tả và trông khác bảng. Nay 01–05, 28, thanh điều hướng và màn chờ dựng theo bảng: tiêu đề Noto Serif Display hẹp đậm màu tieu-de, tranh góc, hàng danh sách có biểu tượng tròn, nút chữ serif kèm mũi tên. Các màn sau dựng theo bảng tương ứng trong `design/` và danh sách chỗ khác bảng ở `design/README.md` |
| 22/10/2026 | B1.2: màn 05, 06, 07, 08, 42, 39, 34A, phát âm thanh, dữ liệu học; đặc tả 1.12 | Chạy thử Chromium (iPhone 13, 1280 px): học hết bài PA01 qua kiểm tra, câu sai được hỏi lại, nghe được khi ngoại tuyến, không lỗi console, không cuộn ngang; 31 kiểm thử. B1.3 thay màn chờ `app/js/man/hoat-dong.mjs` bằng màn thật (09, 09A, 09B, 10, 11, 12, 35), mỗi màn gọi `xongHoatDong(ma, khoa)` khi làm xong; nút nghe dùng `nutNghe` trong `thanh-phan.mjs`. B1.5 tạo thẻ ôn từ các bài đã xong (kho `tienDo`) và sổ lỗi từ câu sai (kho `lanLam`), rồi thay màn 34A ở `on-tap.mjs`. Chưa thử trên iPhone thật: cần xem âm thanh phát được trong Safari khi cài ra Màn hình chính |
| 22/10/2026 | Thay tranh mực cắt tạm bằng tranh thủy mặc cổ (Vương Huy, “Phỏng Cự Nhiên, Yến Văn Quý sơn thủy đồ”, Met 1979.458.2, CC0); công cụ `tools/tao-tranh.mjs`; đặc tả 1.13 (mục 12.7) | Wikimedia: API và trang `Special:FilePath` hay trả 429 (IP dùng chung); trang `Special:Search` đọc được, ảnh tải được ở cỡ thu nhỏ chuẩn (330, 960, 1280, 3840 px) trên upload.wikimedia.org, tệp gốc bị chặn. Công cụ chuyển xám, làm trắng giấy ố, xóa chấm bẩn trên giấy trống, làm mờ mép trái phải, nén WebP dưới 150 KB (`tranh-nui` 1170 × 872, `tranh-goc` 640 × 1088). Sửa kèm: `.man` thiếu nền nên `mix-blend-mode: multiply` không hòa với nền ngà, giấy trắng của tranh hiện trắng hơn nền; đã thêm nền. Kiểm thử mới: tranh dưới 150 KB, đúng tỉ lệ khung CSS; 32 kiểm thử. Ảnh đi qua nhánh “mạng trước” của service worker nên không cần tăng `BAN` |
| 22/10/2026 | B1.3: màn 12, 09, 10, 11, 09A, 09B, 35; ghi âm (`app/js/ghi-am.mjs`); đặc tả 1.14 | Màn của hoạt động chọn trong `app/js/man/hoat-dong.mjs` (`hoc/<bài>/<khóa>`, 09B là `hoc/<bài>/noi/dong-vai`); khung chung, câu chọn đáp án, nút Nghe mẫu ở `trong-bai.mjs`; phần Đến lượt bạn và màn 35 ở `luot-ban.mjs`; phát chuỗi (xen kẽ, cả hội thoại) bằng `phatChuoi` trong `am-thanh.mjs`. Khi soạn A7: cột Giải thích của NguPhap mở đầu bằng tên điểm ngữ pháp và dấu hai chấm (tiêu đề màn 11, đã ghi vào mẫu Sheet); câu hội thoại cần cột Vai để có đóng vai; câu ví dụ của ngữ pháp nên chứa từ của bài để có bài điền từ. B1.5: sổ lỗi lấy thêm câu sai ở `lanLam` loại nghe-doc, tu-vung, mau-cau (trường `muc`, `dung`) và tự đánh giá “Còn khác mẫu” của phat-am (nhóm nói); ghi chú mẹo nhớ ở kho `ghiChu` hiện ở mặt sau thẻ ôn. B1.7: Thư viện đọc kho `tuDaLuu`; màn 29 cho bật tắt `hoSo.khongGhiAm`. Chưa thử ghi âm trên iPhone thật |
| 22/10/2026 | A7.1: soạn nội dung H1-01–H1-10 (`tools/noi-dung/a71-ten-thong-tin.mjs`); `dien-noi-dung` gộp nội dung nhiều tệp soạn cùng một dòng | docs.google.com bị chặn trong phiên này (proxy trả 403) nên chưa tạo được tệp nhập từ Sheet thật; không tự dựng lại Sheet vì “Thay thế bảng tính” sẽ xóa trạng thái người dùng đã đánh dấu. Tên riêng: 王明, 李月, 阮安, 越南 (H1-01), 张 (H1-06), 王, 李 (H1-08). Bộ thủ lấy theo Unihan kRSKangXi nên vài chữ khác thói quen từ điển giản thể (习 bộ băng 冫, 个 bộ cổn 丨, 能 bộ nhục 月); âm Hán Việt tự ghi theo Thiều Chửu vì kVietnamese của Unihan thiếu chữ giản thể và có âm Nôm. Từ đã soạn ở A4 (可以, 工作…) chỉ thêm câu ví dụ, Hán Việt: hai tệp ghi khác nhau ở cùng một trường là lỗi. Chạy thử app trên bản xem trước (Chromium, iPhone 13): 09, 10, 11, 42 hiện đúng, không lỗi console; chữ tên riêng hiện bằng font dự phòng cho tới khi chạy `tao-font`. Cặp 不/没, 二/两, 在/再 để A7.2, A7.4 |
