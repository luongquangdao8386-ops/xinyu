# Mẫu Google Sheet biên soạn nội dung

> Tệp này sinh từ `tools/lib/cau-truc.mjs` bằng `node tools/tao-mau-sheet.mjs`. Sửa cấu trúc ở đó rồi chạy lại để cập nhật cả tệp này và mẫu `tools/mau/xinyu-noi-dung.xlsx`.

Theo mục 11.5 và 12.8 của [đặc tả](dac-ta.md). Công cụ xây nội dung: `node tools/xay-noi-dung.mjs <nguồn>`.

## Tạo Google Sheet

1. Tải `tools/mau/xinyu-noi-dung.xlsx` từ repo (trên GitHub: mở tệp, bấm Download raw file).
2. Tải tệp lên Google Drive, mở bằng Google Trang tính, rồi chọn Tệp > Lưu dưới dạng Google Trang tính.
3. Soạn trong Google Sheet đó. Tab HuongDan nhắc lại các quy ước dưới đây.

## Quy ước

1. Mỗi tab là một loại nội dung. Dòng đầu là tên cột: không đổi tên, không xóa cột; có thể thêm cột riêng ở bên phải.
2. Cột Trạng thái: để “nháp” khi đang soạn, đổi sang “đã kiểm tra” sau khi tự xem lại. Công cụ chỉ xuất dòng “đã kiểm tra” và không có lỗi.
3. Tab Tu, Chu, NguPhap đã điền sẵn danh sách HSK 1 của đề cương thi 11/2025 (300 từ, 246 chữ nhận biết, 70 điểm ngữ pháp); tab Bai điền sẵn 56 bài theo docs/lo-trinh-hsk1.md. Không đổi Mã, Mã đề cương, Từ, Cấp của các dòng này.
4. Danh sách trong một ô (từ của bài, mã câu…) cách nhau bằng dấu phẩy, dấu 、 hoặc xuống dòng.
5. Gọi một từ bằng chữ Hán như ở tab Tu (từ đồng hình thêm số, ví dụ 会1), một chữ bằng chính chữ đó; gọi bài, câu, câu hỏi, ngữ pháp bằng mã.
6. Câu của bài hoặc truyện nằm ở tab Cau, cột Bài ghi mã bài hoặc mã truyện; thứ tự dòng là thứ tự câu. Câu chỉ được dùng từ đã học tính đến bài đó, tên riêng khai ở cột Tên riêng của tab Bai.
7. Xây nội dung: Tệp > Tải xuống > Microsoft Excel (.xlsx), gửi tệp cho Claude để chạy node tools/xay-noi-dung.mjs <tệp>. Hoặc Tệp > Chia sẻ > Công bố lên web (Publish to web), chọn cả tài liệu và định dạng .xlsx, rồi dùng đường dẫn đó thay cho tệp.
8. Tab CanSua: dán danh sách nội dung cần sửa xuất từ app (màn 29); ghi x ở cột Đã xử lý khi sửa xong.

## Kiểm tra khi xây

Công cụ chạy các bước 1–4 của mục 11.6 và in báo cáo theo bước:

- **Bước 1 — Đối chiếu đề cương:** từ, chữ, ngữ pháp khớp mã và cấp trong `content/de-cuong/`; bài không dùng từ, ngữ pháp của cấp cao hơn chặng.
- **Bước 2 — Pinyin và CC-CEDICT:** tách được âm tiết, số âm tiết khớp số chữ, Pinyin gốc của từ khớp CC-CEDICT (khác ở thanh nhẹ chỉ ghi chú).
- **Bước 3 — Từ trong câu và truyện:** câu chỉ dùng từ và tên riêng của các bài có thứ tự nhỏ hơn hoặc bằng bài của câu; truyện thêm tối đa 3 từ mới.
- **Bước 4 — Cách ghi 一 và 不:** Pinyin hiển thị ghi đúng thanh biến; 一 giữ yī (số đếm, thứ tự, ngày giờ) được liệt kê để xem tay.

Mức độ: **LỖI** chặn dòng khỏi bản xuất (và các dòng phụ thuộc vào nó, ví dụ bài có từ chưa xuất được); **Cảnh báo** và **Xem tay** không chặn; **Ghi chú** để biết. Ghi x ở cột Đã xem tay để tắt cảnh báo Pinyin của một dòng đã xem.

Mỗi tab xuất ra một tệp trong `content/`. Các trường trống không được ghi.

## Điền nội dung Claude soạn vào Sheet

Nội dung Claude soạn nằm ở `tools/noi-dung/` (mỗi việc một tệp). Lệnh `node tools/dien-noi-dung.mjs <nguồn>` đọc Sheet hiện tại, điền nội dung đó vào và ghi tệp `tools/ra/xinyu-noi-dung.xlsx`:

- Chỉ điền ô đang trống và thêm dòng chưa có; ô đã có chữ giữ nguyên, chỗ khác nhau được liệt kê trong báo cáo để xem.
- Dòng mới có trạng thái “nháp”; cột Trạng thái của dòng đã có không bị đổi.
- Cột riêng thêm bên phải được giữ; tab thiếu cột mới (khi cấu trúc đổi) được thêm cột.

Nhập vào Google Sheet ngay sau khi tạo tệp (sửa Sheet sau thời điểm đó sẽ bị ghi đè): Tệp > Nhập > Tải lên, chọn tệp, chọn “Thay thế bảng tính”. Cần quay lại thì dùng Tệp > Nhật ký phiên bản.

## Tab Bai — Bài học → `content/bai.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã bài, không trùng. Gợi ý: PA01, PA02… cho Nền phát âm; H1-01, H1-02… cho HSK 1. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Thứ tự | `thuTu` | số | có | Vị trí trên lộ trình. Từ của các bài có thứ tự nhỏ hơn hoặc bằng được coi là đã học. |
| Chặng | `chang` | chọn | có | Nền phát âm, HSK 1, HSK 2… Chọn: Nền phát âm, HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6, HSK 7–9. |
| Chủ đề | `chuDe` | chữ | có |  |
| Mục tiêu | `mucTieu` | chữ | có | Mục tiêu giao tiếp hoặc nhiệm vụ chính của bài. |
| Từ | `tu` | danh sách |  | Từ của bài, viết bằng chữ Hán như ở tab Tu (4–8 từ). Từ đồng hình thêm số, ví dụ 会1. |
| Chữ | `chu` | danh sách |  | Chữ Hán học trong bài; mỗi chữ phải có ở tab Chu. |
| Ngữ pháp | `nguPhap` | danh sách |  | Mã điểm ngữ pháp ở tab NguPhap, ví dụ NP1-08. |
| Tên riêng | `tenRieng` | danh sách |  | Tên người, tên nơi dùng trong câu từ bài này trở đi; không tính là từ mới. |
| Hoạt động | `hoatDong` | chữ |  | Hoạt động nghe, nói, đọc, viết của bài. |
| Dạng câu hỏi thi | `dangThi` | chữ |  | Dạng câu hỏi luyện thi liên quan. |
| Tham chiếu | `thamChieu` | chữ |  | Giáo trình và mục tham khảo, ví dụ 贯通中文 1, bài 2. |
| Tiêu chí hoàn thành | `tieuChi` | chữ |  |  |
| Lỗi thường gặp | `loiThuongGap` | chữ |  | Gồm lỗi người Việt hay mắc. |
| Phiên bản | `phienBan` | chữ |  | Phiên bản nội dung của bài, ví dụ 1, 2… |
| Ngày cập nhật | `ngayCapNhat` | ngày |  |  |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab Tu — Từ → `content/tu.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã từ, không trùng: T + số thứ tự đề cương (T1…T300); từ ngoài đề cương dùng TX1, TX2… |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Mã đề cương | `maDeCuong` | số |  | Số thứ tự trong đề cương thi; để trống với từ ngoài đề cương. |
| Từ | `tu` | chữ | có |  |
| Số đồng hình | `dongHinh` | số |  | Số phân biệt từ đồng hình theo đề cương, ví dụ 1 với 会1. |
| Pinyin | `pinyin` | chữ | có | Pinyin hiển thị (mục 11.2): ghi thanh biến của 一, 不; không ghi biến điệu thanh 3. |
| Pinyin gốc | `pinyinGoc` | chữ |  | Để trống thì công cụ tự sinh bằng cách trả 一, 不 về thanh gốc. |
| Nghĩa | `nghia` | chữ | có | Nghĩa tiếng Việt. |
| Từ loại | `tuLoai` | chữ |  | Theo đề cương, ví dụ 动、名. |
| Cấp | `cap` | cấp | có | Cấp HSK của từ. |
| Hán Việt | `hanViet` | chữ |  | Từ Hán Việt tương ứng, nếu có (mục 11.4). |
| Loại Hán Việt | `loaiHanViet` | chọn |  | Không chắc thì để trống. Chọn: cùng nghĩa, bẫy nghĩa. |
| Câu ví dụ | `cauViDu` | danh sách |  | Mã câu ở tab Cau. |
| Đã xem tay | — | đánh dấu x |  | Ghi x sau khi đã tự xem lại các cảnh báo Pinyin của dòng; công cụ không nhắc lại. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab Chu — Chữ Hán → `content/chu.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Chữ | `chu` | chữ | có | Một chữ giản thể, không trùng. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Số nét | `soNet` | số |  |  |
| Bộ thủ | `boThu` | chữ |  |  |
| Tên bộ | `tenBo` | chữ |  | Tên Hán Việt của bộ thủ. |
| Cấu tạo | `cauTao` | chữ |  | Bộ phận cấu tạo khi có ích cho bài. |
| Âm Hán Việt | `amHanViet` | chữ |  |  |
| Cấp nhận biết | `capNhanBiet` | cấp |  | Theo đề cương thi. |
| Cấp viết tay | `capVietTay` | cấp |  | Cấp dạy viết. Danh sách chữ viết tay cấp 1–2 của đề cương: chữ nhận biết cấp 1 ghi 1, chữ còn lại ghi 2 (mục 3.1). |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab NguPhap — Ngữ pháp → `content/ngu-phap.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã điểm ngữ pháp theo content/de-cuong, ví dụ NP1-08. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Cấp | `cap` | cấp | có |  |
| Theo đề cương | — | chữ |  | Nội dung ghi trong đề cương, chỉ để tham khảo khi soạn. |
| Mẫu câu | `mauCau` | chữ | có |  |
| Giải thích | `giaiThich` | chữ | có |  |
| So sánh với tiếng Việt | `soSanh` | chữ |  |  |
| Lỗi người Việt hay mắc | `loiHayMac` | chữ |  |  |
| Ví dụ | `viDu` | danh sách |  | Mã câu ở tab Cau. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab Cau — Câu → `content/cau.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã câu, không trùng, ví dụ C0001. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Bài | `bai` | chữ | có | Mã bài hoặc mã truyện chứa câu. Thứ tự câu trong bài, truyện là thứ tự dòng. |
| Chữ Hán | `chuHan` | chữ | có |  |
| Pinyin | `pinyin` | chữ | có | Pinyin hiển thị, viết liền theo từ, viết hoa chữ đầu câu và tên riêng. |
| Nghĩa | `nghia` | chữ | có |  |
| Vai | `vai` | chữ |  | Người nói, dùng cho đóng vai. |
| Đã xem tay | — | đánh dấu x |  | Ghi x sau khi đã tự xem lại các cảnh báo Pinyin của dòng; công cụ không nhắc lại. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab CauHoi — Câu hỏi → `content/cau-hoi.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã câu hỏi, không trùng, ví dụ Q0001. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Bài | `bai` | chữ |  | Mã bài hoặc mã truyện, nếu câu hỏi thuộc một bài. |
| Dạng bài | `dangBai` | chữ | có |  |
| Kỹ năng | `kyNang` | chọn | có | Chọn: nghe, nói, đọc, viết. |
| Điểm kiến thức | `diemKienThuc` | danh sách |  | Từ, chữ, mã ngữ pháp, mã phát âm (tab PhatAm) hoặc mã cặp thanh mà câu hỏi kiểm tra. |
| Nội dung | `noiDung` | chữ | có |  |
| Âm thanh | `amThanh` | chữ |  | Thứ được phát ở câu hỏi nghe: một từ ở tab Tu, mã câu ở tab Cau, hoặc một âm tiết Pinyin có ở cột Âm tiết ví dụ của tab PhatAm. |
| Đáp án đúng | `dapAnDung` | chữ | có |  |
| Đáp án sai 1 | `dapAnSai1` | chữ |  |  |
| Nhầm với 1 | `nhamVoi1` | chữ |  | Vì sao người học có thể chọn đáp án sai này. |
| Đáp án sai 2 | `dapAnSai2` | chữ |  |  |
| Nhầm với 2 | `nhamVoi2` | chữ |  |  |
| Đáp án sai 3 | `dapAnSai3` | chữ |  |  |
| Nhầm với 3 | `nhamVoi3` | chữ |  |  |
| Lời giải | `loiGiai` | chữ |  |  |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab PhatAm — Phát âm → `content/phat-am.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã mục phát âm: mã bài, gạch nối, số thứ tự, ví dụ PA02-01. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Bài | `bai` | chữ | có | Mã bài Nền phát âm. Thứ tự các mục trong bài là thứ tự dòng. |
| Loại | `loai` | chọn | có | Chọn: thanh điệu, âm đầu, vần, quy tắc. |
| Ký hiệu | `kyHieu` | chữ | có | Âm đầu, vần hoặc tên thanh, quy tắc, ví dụ zh, üe, Thanh 3, Biến điệu của 不. |
| Cách đọc | `cachDoc` | chữ | có | Cách đặt lưỡi, môi, hơi, cao độ; viết cho người Việt. |
| So sánh với tiếng Việt | `soSanh` | chữ |  | Âm tiếng Việt gần nhất và chỗ khác. |
| Lỗi người Việt hay mắc | `loiHayMac` | chữ |  |  |
| Âm tiết ví dụ | `amTiet` | danh sách |  | Âm tiết Pinyin có dấu thanh, mỗi mục một âm tiết, ví dụ bā, pá. |
| Chữ đọc mẫu | `chuDoc` | danh sách |  | Mỗi âm tiết ví dụ một chữ Hán đọc đúng âm tiết đó, cùng thứ tự; chỉ dùng để tạo âm thanh, app không hiển thị. |
| Từ ví dụ | `viDu` | danh sách |  | Từ ở tab Tu minh họa mục này. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab CapThanh — Cặp thanh → `content/cap-thanh.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã cặp thanh, ví dụ CT11. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Tổ hợp | `toHop` | chữ | có | Thanh của hai âm tiết, ví dụ 3-3; thanh nhẹ ghi 0, ví dụ 1-0. |
| Cách đọc thực tế | `cachDoc` | chữ |  | Ví dụ 3-3 đọc thành 2-3. |
| Từ ví dụ | `viDu` | danh sách | có | Từ hai âm tiết ở tab Tu. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab CapDeNham — Cặp dễ nhầm → `content/cap-de-nham.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã cặp, ví dụ DN001. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Các mục | `cacMuc` | danh sách | có | Từ hoặc chữ dễ nhầm với nhau, ví dụ 买, 卖. |
| Giải thích | `giaiThich` | chữ | có |  |
| Câu hỏi | `cauHoi` | danh sách |  | Mã câu hỏi phân biệt ở tab CauHoi. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab Truyen — Truyện → `content/truyen.json`

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Mã | `ma` | chữ | có | Mã truyện, ví dụ TR001. Câu của truyện nằm ở tab Cau với cột Bài là mã truyện. |
| Trạng thái | — | chọn |  | nháp hoặc đã kiểm tra. Chỉ dòng “đã kiểm tra” và không có lỗi mới được xuất ra JSON. Chọn: nháp, đã kiểm tra. |
| Sau bài | `sauBai` | chữ | có | Mở sau bài này; từ đã học tính đến bài này. |
| Tiêu đề | `tieuDe` | chữ | có |  |
| Từ mới | `tuMoi` | danh sách |  | Tối đa 3 từ chưa học dùng trong truyện. |
| Câu hỏi | `cauHoi` | danh sách |  | Mã câu hỏi hiểu ở tab CauHoi. |
| Ghi chú | — | chữ |  | Ghi chú khi soạn, không xuất ra app. |

## Tab CanSua — Nội dung cần sửa (không xuất)

| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|---|
| Ngày | — | ngày |  |  |
| Mục | — | chữ |  | Mã từ, câu hoặc câu hỏi được báo lỗi. |
| Nội dung | — | chữ |  | Danh sách xuất từ app (màn 29) dán vào đây. |
| Đã xử lý | — | đánh dấu x |  | Ghi x khi đã sửa xong. |

## Trường thêm khi xuất

- `bai.json`: `cap` (số, bỏ trống với Nền phát âm), `tu` là mã từ thay cho chữ Hán, `cau` là mã các câu của bài theo thứ tự.
- `tu.json`: `pinyinGoc` luôn có (tự sinh khi cột Pinyin gốc trống).
- `cau.json`: `tu` là mã các từ đã học xuất hiện trong câu.
- `bai.json`: `phatAm` là mã các mục phát âm của bài theo thứ tự (chỉ bài có mục ở tab PhatAm).
- `cau-hoi.json`: `dapAnSai` là danh sách `{ dapAn, nhamVoi }` thay cho các cột Đáp án sai, Nhầm với; `amThanh` là `{ tu: mã từ }`, `{ cau: mã câu }` hoặc `{ amTiet, phatAm: mã mục phát âm }`.
- `phat-am.json`: `viDu` là mã từ.
- `cap-thanh.json`: `viDu` là mã từ.
- `truyen.json`: `cap` theo bài ở cột Sau bài, `cau` là mã các câu của truyện theo thứ tự.
