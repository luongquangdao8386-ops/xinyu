# Tiến độ Xinyu

**Cập nhật:** 21/10/2026. **Việc tiếp theo:** A1 (cần PDF đề cương thi HSK 11/2025).

**Thứ tự khuyến nghị:** A1 → A2 → A3 → A4 → A5 → B1.1 → B1.2 → B1.3, sau đó soạn các cụm A7 xen kẽ với B1.4–B1.8. Như vậy Nền phát âm chạy được trong app sớm, không phải đợi soạn xong toàn bộ HSK 1.

Mỗi việc dưới đây làm trong một phiên. “Cần” là thứ người dùng chuẩn bị trước khi mở phiên.

## Đã xong

- [x] Đặc tả 1.4 (`docs/dac-ta.md`), README, quy ước bảng ảnh, `CLAUDE.md`, tệp tiến độ này.

## Giai đoạn A — Chuẩn bị nội dung và thiết kế

- [ ] **A1. Danh sách HSK 1:** trích từ, chữ (nhận biết và viết tay), điểm ngữ pháp và mã từ đề cương thi 11/2025 vào `content/de-cuong/hsk1.json`. Cần: PDF đề cương.
- [ ] **A2. Công cụ biên soạn** (mục 12.8): mẫu Google Sheet (tab và cột), script `tools/xay-noi-dung` đọc CSV/XLSX, xuất JSON vào `content/`, chạy kiểm tra 11.6 bước 1–4 và in báo cáo. Cần: tạo Google Sheet theo mẫu sau phiên.
- [ ] **A3. Bảng đối chiếu** Nền phát âm và HSK 1 với 贯通中文 quyển 1 → `docs/doi-chieu-hsk1.md`: danh sách bài Xinyu, mỗi bài 4–8 từ, nhóm theo cụm chủ đề. Cần: mục lục và từ mới từng bài của giáo trình (ảnh chụp hoặc gõ).
- [ ] **A4. Nội dung Nền phát âm:** âm đầu, vần, thanh điệu, 20 cặp thanh, thanh nhẹ, biến điệu, lời chào.
- [ ] **A5. Âm thanh:** script `tools/tao-am-thanh` và âm thanh cho Nền phát âm. Cần: chọn dịch vụ giọng máy; khóa đặt trong biến môi trường của môi trường cloud, không đưa vào repo.
- [ ] **A6. Phác bố cục** 13A–13D và 47 bằng HTML tĩnh trong `design/`.
- [ ] **A7. Nội dung HSK 1**, mỗi phiên một cụm, kèm từ Hán Việt, so sánh ngữ pháp, bộ thủ, cặp dễ nhầm và âm thanh của cụm. Cụm có thể đổi theo bảng A3.
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
| 21/10/2026 | Đặc tả 1.4, README, quy ước bảng ảnh, `CLAUDE.md`, tệp tiến độ | Bắt đầu A1; cần PDF đề cương thi 11/2025 |
