# Bảng ảnh thiết kế

Quy ước theo mục 9.3 của [đặc tả](../docs/dac-ta.md).

- Tên tệp: `bang-<số bảng>_man-<mã đầu>-<mã cuối>_v<phiên bản>.png`, ví dụ `bang-01_man-01-04_v2.png`.
- Mỗi lần hiệu chỉnh tăng số phiên bản; bản có số lớn nhất là căn cứ.
- Bảng ảnh xuất trước ngày 17/10/2026 có thể mang tên cũ; khi dựng app, thay bằng Xinyu/新语.

## Danh mục

| Bảng | Các màn | Phiên bản | Ngày | Tệp |
|---|---|---|---|---|
| 01 | 01 Chào mừng, 02 Mục tiêu học, 03 Kiểm tra đầu vào | 1 | 22/10/2026 | `bang-01_man-01-03_v1.png` |
| 02 | 04 Kế hoạch cá nhân, 05 Hôm nay, 06 Lộ trình HSK | 1 | 22/10/2026 | `bang-02_man-04-06_v1.png` |
| 03 | 07 Tổng quan HSK 1, 08 Chi tiết bài học, 09 Nghe và đọc | 1 | 22/10/2026 | `bang-03_man-07-09_v1.png` |
| 04 | 10 Học từ mới, 11 Ngữ pháp, 12 Luyện phát âm | 1 | 22/10/2026 | `bang-04_man-10-12_v1.png` |
| 05 | 13 Luyện chữ Hán, 14 Luyện viết câu, 15 Hội thoại AI | 1 | 22/10/2026 | `bang-05_man-13-15_v1.png` |
| 06 | 16 Ôn từ đến hạn, 17 Sổ lỗi, 18 Thư viện và tra từ | 1 | 22/10/2026 | `bang-06_man-16-18_v1.png` |
| 07 | 19 Trung tâm luyện thi, 20 Luyện theo dạng bài, 21 Chuẩn bị thi thử | 1 | 22/10/2026 | `bang-07_man-19-21_v1.png` |
| 08 | 22 Đang thi thử, 23 Xác nhận nộp bài, 24 Kết quả | 1 | 22/10/2026 | `bang-08_man-22-24_v1.png` |
| 09 | 25 Giải thích đáp án, 26 Kế hoạch sửa lỗi, 27 Tiến bộ học tập | 1 | 22/10/2026 | `bang-09_man-25-27_v1.png` |
| 10 | 28 Hồ sơ và mục tiêu, 29 Cài đặt học tập, 30 Trợ giúp | 1 | 22/10/2026 | `bang-10_man-28-30_v1.png` |
| 11 | 31 Đăng nhập, 32 Tạo tài khoản, 33 Khôi phục mật khẩu (màn bỏ) | 1 | 22/10/2026 | `bang-11_man-31-33_v1.png` |
| 12 | 34 Chưa có bài ôn (nay là 34A), 35 Chưa bật micro, 36 Mất kết nối | 1 | 22/10/2026 | `bang-12_man-34-36_v1.png` |
| 13 | 37 Học bài trên máy tính | 1 | 22/10/2026 | `bang-13_man-37-37_v1.png` |
| 14 | 38 Thi thử trên máy tính | 1 | 22/10/2026 | `bang-14_man-38-38_v1.png` |
| 15 | 39 Hoàn thành bài học, 40 Lịch sử luyện thi, 41 Cấp độ và giáo trình | 1 | 22/10/2026 | `bang-15_man-39-41_v1.png` |

Ngày là ngày đưa vào repo; bảng vẽ trước khi đổi tên app nên mang tên Hán Lộ. Các màn thêm từ bản 1.3, 1.4 của đặc tả (09A, 09B, 13A–13D, 34B–34D, 42–49) chưa có bảng; dựng theo hệ thống giao diện ở mục 8.

## Chỗ app khác bảng ảnh

Bảng ảnh là căn cứ về bố cục và phong cách; các quyết định sau trong đặc tả được ưu tiên hơn bảng:

- Tên Hán Lộ và dấu son chữ 学 đổi thành Xinyu và dấu son chữ 新 (nhận diện 17/10/2026).
- Không có tài khoản: bỏ màn 31–33, nút “Tôi đã có tài khoản” ở 01, “Quản lý tài khoản” ở 29.
- Màn 03 giữ bố cục nhưng bỏ bài kiểm tra đầu vào: chọn bắt đầu từ Nền phát âm hoặc chọn một bài (mục 4.2).
- Không có thông báo đẩy (mục 12.5): bỏ biểu tượng chuông ở đầu màn, “Nhắc học mỗi ngày” ở 29 thay bằng giờ học để đặt Lời nhắc trên máy.
- Màn 28 không có tên và ảnh đại diện (app một người dùng, không tài khoản).
- Trong bài làm và bài thi, đáp án đang chọn dùng viền chu-chinh trên nền kem, không tô đỏ như bảng (mục 8.2). Ở phần thiết lập (02, 03) ô đang chọn vẫn dùng chấm đỏ son như bảng.
- Kết quả bài luyện không ghi điểm phát âm, huy chương hay tỷ lệ đỗ (mục 8.2).

## Tranh mực trong app

Bảng ảnh dùng tranh mực vẽ riêng (núi, đình, cành cây, trăng). App dùng tranh thủy mặc cổ hết bản quyền thay cho tranh của bảng: một đoạn cuộn “Phỏng Cự Nhiên, Yến Văn Quý sơn thủy đồ” (倣巨然燕文貴山水圖) của Vương Huy (王翬, 1632–1717), vẽ năm 1713, mực và màu nhạt trên giấy, Bảo tàng Metropolitan, số 1979.458.2 ([trang tác phẩm](https://www.metmuseum.org/art/collection/search/49157), ảnh Open Access CC0, [tệp trên Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%E6%B8%85_%E7%8E%8B%E7%BF%AC_%E5%80%A3%E5%B7%A8%E7%84%B6%E7%87%95%E6%96%87%E8%B2%B4%E5%B1%B1%E6%B0%B4%E5%9C%96_%E5%8D%B7-Landscape_in_the_Style_of_Juran_and_Yan_Wengui_MET_DP204419.jpg)). Đoạn này có vách núi, rặng thông, lầu cổng, tháp, thác và thuyền; không có trăng.

- `app/hinh/tranh-nui.webp` (1170 × 872, màn 01 và 34A): cả đoạn tranh.
- `app/hinh/tranh-goc.webp` (640 × 1088, góc trên bên phải các màn và thẻ bài ở màn 05): rặng thông, tháp và lầu cổng.

Tạo lại bằng `node tools/tao-tranh.mjs` (mục 12.7): tải ảnh 3840 px, chuyển xám, chia cho nền giấy ước lượng để giấy ố thành trắng, xóa chấm bẩn trên giấy trống, cắt khung theo tỉ lệ trong `app/css/xinyu.css`, làm mờ mép trái, phải (tranh vẽ kín tới mép, không mờ thì trên màn rộng lộ cạnh thẳng), nén WebP dưới 150 KB. Đổi tranh khác thì giữ tên tệp và tỉ lệ khung (381 : 284 và 167 : 284), hoặc sửa tỉ lệ trong CSS cùng lúc.
