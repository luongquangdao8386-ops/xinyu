---
title: "Xinyu — Đặc tả ứng dụng học tiếng Trung và luyện thi HSK"
version: "1.5"
brand_chinese: "新语"
brand_pinyin: "Xīnyǔ"
date: "2026-10-21"
language: "vi-VN"
status: "Đã chốt đặc tả; app dùng cá nhân; chưa triển khai"
---

# Xinyu — Đặc tả ứng dụng học tiếng Trung và luyện thi HSK

Tài liệu tổng hợp các quyết định về sản phẩm, nội dung và kỹ thuật, dùng làm cơ sở xây dựng app.

**Định hướng đã thống nhất:** học tiếng Trung từ đầu đến chuyên sâu, đồng thời luyện thi HSK; lấy HSK 3.0 làm trục chương trình. Phong cách giao diện là nền giấy ngà, tranh mực đen–xám và điểm nhấn đỏ son.

**Phạm vi sử dụng:** app cá nhân, một người dùng (chính tác giả tự học). Không có tài khoản, không phát hành công khai. Khi có nhiều cách làm, ưu tiên cách đơn giản nhất đủ dùng cho một người.

**Trạng thái hiện tại:** đã dựng bộ 15 bảng thiết kế gồm 41 màn hình/trạng thái (39 màn điện thoại, 2 màn máy tính); phong cách tổng thể đã được duyệt. Bản 1.3 bỏ 3 màn tài khoản và thêm 5 màn; bản 1.4 thêm 3 màn và 2 trạng thái cho các tính năng học mới (mục 9). App chưa được triển khai. Lịch sử thay đổi ở Phụ lục A.

Các bảng ảnh là tài liệu hình ảnh đối chiếu riêng, không nhúng vào tệp này; quy ước lưu và đặt tên ở mục 9.3.

**Nhận diện (cập nhật 17/10/2026):** tên hiển thị là **Xinyu**; chữ Hán **新语**, Pinyin **Xīnyǔ**, ý tưởng “những lời mới”. Dùng tên này trên logo chữ, màn chào mừng, điều hướng và tài liệu. Mọi tên khác xuất hiện trên các bảng ảnh xuất trước lần đổi tên đều thay bằng Xinyu/新语; các bảng ảnh đó vẫn là tài liệu tham chiếu bố cục.

## 1. Mục tiêu và đối tượng

### 1.1. Mục tiêu sản phẩm

- Bắt đầu từ phát âm và Pinyin, sau đó phát triển nghe, nói, đọc, viết.
- Tổ chức kiến thức và hoạt động học theo từng cấp HSK.
- Kết hợp học có hệ thống, ôn tập theo lịch, luyện dạng bài và thi thử.
- Dùng kết quả làm bài để chỉ ra kiến thức cần học lại.
- Duy trì luyện giao tiếp và khả năng vận dụng kiến thức.
- Tận dụng vốn tiếng Việt (từ Hán Việt, so sánh ngữ pháp) để học nhanh và tránh lỗi.
- Mở rộng đến HSK 7–9 và các hướng thương mại, học thuật hoặc biên phiên dịch.

### 1.2. Mặc định thiết kế

| Nội dung | Mặc định |
|---|---|
| Người dùng | Một người: chính tác giả, người Việt trưởng thành |
| Ngôn ngữ giải thích | Tiếng Việt |
| Ngôn ngữ đích | Tiếng Phổ thông |
| Chữ Hán | Giản thể |
| Thời gian học | 30 phút/ngày, có lựa chọn 15 hoặc 45 phút; chế độ 5 phút cho ngày bận |
| Đề cương | HSK 3.0 theo Đề cương thi HSK (11/2025) |
| Nền tảng | Web app cài được (PWA): iPhone (thêm ra Màn hình chính) và trình duyệt máy tính |
| Tài khoản | Không có; dữ liệu lưu trên máy, có sao lưu và đồng bộ (mục 12) |
| Phạm vi bản đầu | Nền phát âm và HSK 1 |

Trong app chỉ chỉnh được: thời lượng và giờ học mỗi ngày, cấp mục tiêu (trong các cấp đã có nội dung), ngày thi, cách hiện Pinyin, tốc độ âm thanh và cỡ chữ. Các mục còn lại là quyết định cố định của bản đầu.

## 2. Những quyết định đã thống nhất

| Hạng mục | Quyết định |
|---|---|
| Tên sản phẩm | Xinyu — 新语 (Xīnyǔ) |
| Phạm vi sử dụng | Cá nhân, một người dùng; không tài khoản, không phát hành |
| Phong cách | Giấy ngà, tranh mực đen–xám, điểm nhấn đỏ son |
| Vùng tranh | Nền sáng; không có nền hoặc lớp nhuộm đỏ son trong tranh |
| Chương trình | HSK là trục chính, theo HSK 3.0 |
| Văn bản gốc | Đề cương thi HSK (11/2025) cho danh sách từ, chữ và ngữ pháp |
| Phiên bản thi | Chỉ HSK 3.0; không làm chế độ HSK 2.0 |
| Giáo trình tham khảo | Chính: 贯通中文综合教程; phụ: HSK标准教程, 汉语教程 |
| Cách tổ chức | Hai chế độ liên thông: Học theo cấp HSK và Luyện thi HSK |
| Theo dõi | Tách tiến độ học khỏi kết quả luyện thi |
| Tận dụng tiếng Việt | Từ Hán Việt kèm cảnh báo bẫy nghĩa, so sánh ngữ pháp, bộ thủ theo tên Hán Việt (mục 5.5) |
| Tập viết | Luyện chữ Hán bốn bước (13A–13D), luyện viết câu, luyện gõ và nghe chép |
| Phát âm | Ghi âm, nghe lại, so với mẫu và tự đánh giá; đường cao độ từ giai đoạn B2; không chấm điểm |
| Luyện nói không cần AI | Luyện thanh điệu (47), nhại theo (09A), đóng vai (09B) |
| Hội thoại AI | Giai đoạn C, theo quy tắc ở mục 5.6 |
| Dữ liệu | Lưu trên máy; sao lưu bằng tệp; đồng bộ điện thoại–máy tính qua Apps Script |
| Biên soạn | Soạn trên Google Sheets, script xuất JSON và kiểm tra tự động (mục 12.8) |
| Danh mục màn | 41 màn đã vẽ; bản 1.3 bỏ 3 màn, thêm 5 màn; bản 1.4 thêm 3 màn và 2 trạng thái (mục 9) |
| Nội dung học | Tự biên soạn, kiểm tra theo quy trình ở mục 11.6 trước khi dùng |

Các màu xanh ngọc, xanh dương, tím và tranh nhuộm đỏ thuộc những phương án giao diện trước, không dùng làm màu chủ đạo. Màu ngữ nghĩa cho đúng, sai và cảnh báo được quy định riêng ở mục 8.1.

## 3. Cơ sở học thuật và giáo trình

### 3.1. Thứ tự ưu tiên

1. **Đề cương thi HSK (HSK 3.0):** 中文水平考试HSK考试大纲, do 中外语言交流合作中心 phát hành 11/2025, thực hiện từ 7/2026. Đây là nguồn chính cho danh sách từ, chữ Hán (chữ cần nhận biết và chữ cần viết tay), điểm ngữ pháp, chủ đề và cấu trúc thi.
2. **Chuẩn trình độ** 《国际中文教育中文水平等级标准》(GF 0025—2021): khung năng lực nền. Không lấy số liệu từng cấp từ văn bản này. Ví dụ: Chuẩn 2021 ghi cấp 1 có 500 từ, 300 chữ và 48 điểm ngữ pháp, trong khi đề cương thi đặt HSK 1 là 300 từ (bảng dưới).
3. **Giáo trình:** tham khảo cách tổ chức kiến thức, chủ điểm và tiến trình bài học.
4. **Nội dung riêng của Xinyu:** giải thích tiếng Việt, hội thoại, ví dụ, bài tập, truyện đọc và tình huống tự biên soạn.
5. **Tài liệu bổ trợ:** củng cố kỹ năng hoặc phát triển chuyên sâu theo nhu cầu.

**Số liệu HSK 1 theo đề cương thi** (trích ngày 21/10/2026; danh sách ở `content/de-cuong/hsk1.json`, cách trích ở mục 11.1):

| Phần | Số lượng | Ghi chú |
|---|---|---|
| Từ | 300 | Số thứ tự 1–300 (HSK 2: 301–500). 15 từ có thêm cách dùng học ở cấp sau, đề cương ghi dạng 1（4）, ví dụ 半 làm số từ ở cấp 1, làm phó từ ở cấp 4 |
| Chữ nhận biết | 246 | 店 (饭店, 商店, 书店) và 饺 (饺子) có trong từ HSK 1 nhưng đề cương xếp vào chữ nhận biết cấp 2 và cấp 3 |
| Chữ viết tay | 100, chung cho HSK 1–2 | Đề cương không tách riêng cấp 1. 95 chữ thuộc chữ nhận biết HSK 1, Xinyu dạy viết trong HSK 1; 5 chữ 比, 地, 过, 为, 长 dạy viết trong HSK 2 |
| Điểm ngữ pháp | 70 | Mỗi ô nội dung của bảng ngữ pháp là một điểm; gộp theo mục (细目) còn 49. Đề cương không đánh mã ngữ pháp |

**Mốc thời gian:** kỳ thi HSK 3.0 chính thức đầu tiên là ngày 13/12/2026; từ mốc này HSK 3.0 thay HSK 2.0. Bản đầu của Xinyu gần như chắc chắn ra sau mốc này nên chỉ theo HSK 3.0. Khi có thông báo mới, đối chiếu lại trên chinesetest.cn.

### 3.2. Các nguồn giáo trình

| Tài liệu | Vai trò |
|---|---|
| Đề cương thi và đề mẫu HSK 3.0 | Chuẩn đối chiếu chương trình và nhánh luyện thi |
| 贯通中文综合教程 | Giáo trình tham khảo chính. Viết theo HSK 3.0, nhóm tác giả 姜丽萍, Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh. Quyển 1 (2026) có 15 bài, mục tiêu 300 từ, khớp với số từ HSK 1 của đề cương thi |
| Giáo trình chuẩn HSK — HSK标准教程 | Tài liệu phụ. Viết cho HSK 2.0 (HSK 1 chỉ có 150 từ); chỉ tham khảo cách dạy, không dùng làm danh sách từ |
| Giáo trình Hán ngữ — 汉语教程（第3版） | Bổ trợ nền phát âm, mẫu câu và kiến thức cơ bản |
| Phát triển Hán ngữ — 发展汉语 | Bổ trợ nghe, nói, đọc, viết ở trung cấp; không cần cho bản đầu. Bản đã xác minh là 第二版 (2011–2013); link nhà xuất bản ghi 第三版, cần kiểm tra khi dùng |
| 国际中文教育中文水平等级标准 | Khung năng lực nền (xem mục 3.1) |

HSK标准教程 gồm sáu cấp với chín quyển giáo trình. Các quyển sau của 贯通中文 cần được kiểm tra trước khi chốt tài liệu cho HSK 2 trở lên.

Mỗi bài trong 贯通中文 quyển 1 có khoảng 20 từ, còn một bài Xinyu có 4–8 từ (mục 5.2). Vì vậy một bài giáo trình tương ứng khoảng 3–5 bài Xinyu.

### 3.3. Bảng đối chiếu nội dung cần lập khi biên soạn

Mỗi bài học cần có:

- Mã bài, cấp HSK và phiên bản đề cương.
- Mục tiêu giao tiếp hoặc nhiệm vụ.
- Chủ đề; từ/cụm từ, chữ Hán và điểm ngữ pháp kèm mã theo đề cương.
- Hoạt động nghe, nói, đọc, viết.
- Dạng câu hỏi luyện thi có liên quan.
- Giáo trình và mục tài liệu tham khảo.
- Tiêu chí hoàn thành và lỗi thường gặp, gồm lỗi người Việt hay mắc.
- Phiên bản nội dung, cách đã kiểm tra (mục 11.6) và ngày cập nhật.

Không đồng nhất “cấp HSK” với “phiên bản đề cương”. Trên giao diện, “Cấp: HSK 1” và nhãn “HSK 3.0” là hai thông tin riêng; ở bản đầu, nhãn đề cương cố định là HSK 3.0.

## 4. Lộ trình học

### 4.1. Trục lộ trình

**Nền phát âm → HSK 1 → HSK 2 → HSK 3 → HSK 4 → HSK 5 → HSK 6 → HSK 7–9 hoặc chuyên ngành.**

Bản đầu chỉ có Nền phát âm và HSK 1. Trên màn Lộ trình (06), các chặng sau hiện ở trạng thái khóa với nhãn “Chưa có nội dung”; màn 02 và 19 chỉ cho chọn những cấp đã có nội dung.

| Chặng | Trọng tâm học | Cách đánh giá trong app |
|---|---|---|
| Nền phát âm | Pinyin, âm đầu, vần, thanh điệu, 20 cặp thanh, thanh nhẹ, biến điệu cơ bản; lời chào | Nghe phân biệt âm và cặp thanh, đọc Pinyin, ghi âm, nói lời chào |
| HSK 1 | Kiến thức và nhiệm vụ thuộc cấp 1; giới thiệu bản thân và các chủ đề cơ bản | Kiểm tra cuối bài, cuối chủ đề, luyện dạng bài và thi thử |
| HSK 2 | Mở rộng kiến thức theo cấp; nối câu và xử lý tình huống quen thuộc | Bài nghe/đọc mới, nhiệm vụ vận dụng và bài luyện theo cấp |
| HSK 3 | Tăng độ dài và khả năng kết nối thông tin | Đánh giá riêng từng kỹ năng; kiểm tra yêu cầu phần nói của HSK 3.0 trước khi làm |
| HSK 4 | Đọc/nghe phức tạp hơn, giải thích và trình bày ý kiến | Bài học, nhiệm vụ nói/viết và luyện thi theo đề cương |
| HSK 5 | Xử lý nhiều chủ đề và văn bản đa dạng hơn | Luyện kỹ năng, phân tích lỗi và thi thử |
| HSK 6 | Nâng cao khả năng hiểu và diễn đạt | Nhiệm vụ tổng hợp và luyện thi theo yêu cầu mục tiêu |
| HSK 7–9/chuyên ngành | Học thuật, thương mại, biên phiên dịch theo lựa chọn | Sản phẩm chuyên đề, bài trình bày, bài viết hoặc bản dịch |

Danh sách kiến thức và yêu cầu thi chính xác của mỗi cấp lấy theo đề cương thi. Phát âm, chữ Hán và giao tiếp được luyện xuyên suốt. Mục tiêu chuyên sâu là quá trình nhiều năm, điều chỉnh theo kết quả thực tế.

### 4.2. Lần đầu mở app

1. Xem màn chào mừng (01).
2. Chọn mục tiêu “Học từ đầu”, “Luyện thi HSK” hoặc “Học và luyện thi”, và chọn cấp mục tiêu (02).
3. Chọn điểm bắt đầu: từ Nền phát âm, hoặc chọn một bài bất kỳ (03).
4. Trên màn Kế hoạch (04), chọn thời lượng mỗi ngày và ngày thi (không bắt buộc); kế hoạch được tính lại ngay khi thay đổi.
5. Vào màn Hôm nay (05).

Bản đầu không có bài kiểm tra đầu vào: người dùng tự biết trình độ và tự chọn điểm bắt đầu.

### 4.3. Khung 12 tuần đầu tham khảo

| Tuần | Chặng | Trọng tâm | Nhiệm vụ ứng dụng |
|---|---|---|---|
| 1–2 | Nền phát âm | Âm, thanh điệu, cặp thanh, Pinyin và lời chào | Nghe phân biệt và nói những câu chào ngắn |
| 3–4 | HSK 1 | Tên, thông tin cá nhân, câu hỏi cơ bản | Tự giới thiệu và hỏi thông tin người khác |
| 5–6 | HSK 1 | Gia đình, số đếm, ngày giờ | Nói về gia đình và lịch sinh hoạt |
| 7–8 | HSK 1 | Ăn uống, mua sắm | Gọi món, hỏi giá, nói số lượng |
| 9–10 | HSK 1 | Địa điểm và di chuyển | Hỏi và hiểu chỉ dẫn đơn giản |
| 11–12 | HSK 1 | Hẹn gặp, kết hợp chủ đề và ôn tập | Thực hiện hội thoại tổng hợp và kiểm tra kiến thức |

Nền phát âm kết thúc sau tuần 2; phần tự giới thiệu thuộc HSK 1. Thứ tự chi tiết theo bảng đối chiếu với 贯通中文 quyển 1. Lịch 12 tuần không phải cam kết hoàn thành một cấp hoặc đạt một chứng chỉ.

## 5. Cách học trong app

### 5.1. Hai chế độ liên thông

| Chế độ | Nội dung |
|---|---|
| Học theo cấp HSK | Học kiến thức theo trình tự, luyện từng kỹ năng, ôn tập, kiểm tra cuối bài và cuối chủ đề |
| Luyện thi HSK | Chọn cấp, luyện dạng bài, làm đề có thời gian, xem lời giải và sửa lỗi |

Kết quả luyện thi tạo danh sách kiến thức cần ôn. Bài ôn dẫn người học trở lại bài học, ví dụ hoặc hoạt động có liên quan.

### 5.2. Cấu trúc một buổi học

**Buổi 15 phút**

| Thời lượng | Hoạt động |
|---|---|
| 5 phút | Ôn từ, mẫu câu và lỗi đến hạn |
| 5 phút | Học mới: nghe/đọc tình huống ngắn, từ và mẫu câu trọng tâm |
| 5 phút | Luyện có hướng dẫn |

Phần vận dụng nói hoặc viết chuyển sang buổi sau.

**Buổi 30 phút**

| Thời lượng | Hoạt động |
|---|---|
| 5 phút | Ôn từ, mẫu câu và lỗi đến hạn |
| 5 phút | Nghe hoặc đọc một tình huống ngắn |
| 5 phút | Học từ/cụm từ và mẫu câu trọng tâm |
| 5 phút | Luyện có hướng dẫn, gồm cả dạng câu hỏi thi liên quan |
| 10 phút | Vận dụng bằng nói hoặc viết, xem phản hồi và sửa lại |

**Buổi 45 phút**

| Thời lượng | Hoạt động |
|---|---|
| 8 phút | Ôn từ, mẫu câu và lỗi đến hạn |
| 7 phút | Nghe hoặc đọc một tình huống ngắn |
| 7 phút | Học từ/cụm từ và mẫu câu trọng tâm |
| 8 phút | Luyện có hướng dẫn |
| 5 phút | Dạng câu hỏi thi liên quan |
| 10 phút | Vận dụng bằng nói hoặc viết, xem phản hồi và sửa lại |

**Ngày bận:** chế độ “Chỉ có 5 phút” chỉ ôn thẻ đến hạn (mục 5.10).

Quy tắc chung:

- Một bài mới có khoảng 4–8 từ/cụm từ và một mục tiêu giao tiếp chính. Một bài có thể chia thành nhiều buổi.
- Phần vận dụng nói có thể là nhại theo hoặc đóng vai (mục 5.7).
- Buổi cuối của mỗi bài dành 5 phút cho kiểm tra mục tiêu bài (màn 42), thay cho phần luyện có hướng dẫn.
- Phần ôn đầu buổi giới hạn theo thời gian. Thẻ đến hạn còn lại dời sang buổi sau hoặc vào mục “Ôn thêm” trên màn Hôm nay, ưu tiên thẻ quá hạn lâu nhất.

### 5.3. Chu trình bài học

1. Ôn kiến thức liên quan.
2. Nghe/đọc trong ngữ cảnh.
3. Học từ, chữ và mẫu câu.
4. Luyện có hướng dẫn.
5. Luyện dạng câu hỏi liên quan.
6. Vận dụng bằng nói hoặc viết.
7. Kiểm tra mục tiêu bài.
8. Ghi lỗi và lên lịch ôn.
9. Hoàn thành bài, học tiếp hoặc luyện lại.

### 5.4. Ôn tập và sửa lỗi

- Lịch ôn dùng thuật toán FSRS (thư viện ts-fsrs).
- Thang tự đánh giá bốn mức: Quên, Khó, Nhớ, Dễ.
- Mỗi từ có thể sinh nhiều thẻ riêng: nhận mặt chữ, nghe hiểu, nhớ nghĩa, viết tay (với chữ cần viết).
- Ghi chú mẹo nhớ của riêng mình gắn được vào mọi từ và chữ (màn 10, 13, 16, 18, 49) và hiện ở mặt sau thẻ ôn.
- Phân biệt từ mới, từ đã gặp và từ cần ôn.
- Sổ lỗi có nhóm từ vựng, ngữ pháp, nghe, đọc, nói, viết và cặp hay nhầm (mục 5.9).
- Mỗi lỗi gắn với bài học hoặc hoạt động luyện lại.
- Cho phép làm câu tương tự sau khi xem lời giải.
- Đánh giá lại bằng nội dung mới, thay vì chỉ lặp đúng câu đã ghi nhớ: mỗi điểm kiến thức có ít nhất hai câu hỏi khác nhau.

### 5.5. Tận dụng tiếng Việt

**Từ Hán Việt**

- Mỗi từ có trường từ Hán Việt khi có từ tương ứng, chia hai loại:
  - Cùng nghĩa: 电话 điện thoại, 问题 vấn đề, 准备 chuẩn bị.
  - Bẫy nghĩa: 东西 đông tây là “đồ vật”, 告诉 cáo tố là “nói cho biết”, 爱人 ái nhân là “vợ/chồng”.
- Bẫy nghĩa luôn hiện cảnh báo. Chỉ ghi từ Hán Việt khi đã kiểm tra; không chắc thì để trống.
- Âm Hán Việt của từng chữ dùng làm gợi nhớ khi phù hợp, luôn kèm nghĩa và cách dùng hiện đại (nguồn ở mục 11.4).

**So sánh ngữ pháp**

Mỗi điểm ngữ pháp có phần so sánh với tiếng Việt và lỗi người Việt hay mắc, ví dụ:

- Định ngữ đứng trước danh từ: 红衣服 — áo đỏ.
- Nơi chốn và thời gian đứng trước động từ: 我在家学习 — tôi học ở nhà (không nói 我学习在家).
- Lượng từ gần với loại từ tiếng Việt (个 ~ cái, 只 ~ con) nhưng không trùng hoàn toàn.

**Bộ thủ**

- Bài ngắn về các bộ thủ thường gặp ở HSK 1, gọi theo tên Hán Việt quen thuộc: nhân đứng 亻, ba chấm thủy 氵, tài gảy 扌, khẩu 口, nữ 女, mộc 木.

**Phát âm**

- Bài ngắn về các nhóm âm j/q/x, zh/ch/sh, ü và những cặp âm dễ nhầm.
- Chỉ ra chỗ khác giữa thanh tiếng Trung và dấu tiếng Việt mà người Việt hay đọc lẫn, ví dụ đọc thanh 3 như dấu hỏi.
- Học thanh nhẹ và biến điệu qua âm thanh, từ và câu.

**Chung**

- Mỗi từ gắn với ngữ cảnh sử dụng.
- Dùng Pinyin chuẩn và âm thanh; giảm dần gợi ý khi đọc tốt hơn.
- Tách nhận mặt chữ, gõ chữ và viết tay thành những năng lực luyện tập riêng.

### 5.6. Hội thoại AI (giai đoạn C)

- Câu trả lời của AI luôn có nhãn “AI” và không được coi là nội dung đã kiểm tra.
- Giới hạn từ vựng trong các cấp đã học; từ ngoài phạm vi được đánh dấu.
- Pinyin và nghĩa hiển thị lấy từ kho dữ liệu của app (tách từ rồi tra), không để AI tự ghi, vì AI hay sai chữ đa âm.
- Giải thích lỗi bằng tiếng Việt.
- Có nút báo câu sai để xem lại.
- Khóa API nằm ở Apps Script (mục 12.6), không nằm trong mã nguồn.

### 5.7. Luyện nói và nghe không cần AI

**Luyện thanh điệu (47)**

- Đủ 20 cặp thanh của từ hai âm tiết: 16 tổ hợp của bốn thanh và 4 tổ hợp có thanh nhẹ ở âm tiết sau. Tổ hợp 3–3 ghi rõ cách đọc thực tế là 2–3 (你好).
- Chế độ nghe nhận biết: nghe một từ, chọn cặp thanh.
- Chế độ nói lại: nghe mẫu, ghi âm, nghe lại.
- Từ ví dụ ưu tiên lấy trong HSK 1.

**Nhại theo (09A)**

- Phát từng câu của hội thoại hoặc bài đọc; lặp lại một câu; tốc độ chậm hoặc bình thường.
- Sau mỗi câu, ghi âm giọng mình rồi nghe xen kẽ với mẫu.
- Ẩn dần chữ: hiện chữ Hán và Pinyin → chỉ chữ Hán → không hiện chữ.

**Đóng vai (09B)**

- Chọn một vai trong hội thoại mẫu. App phát lời vai kia; đến lượt mình thì hiện gợi ý (có thể ẩn) và ghi âm.
- Xong đoạn, nghe lại cả hội thoại ghép giọng mẫu với giọng mình; sau đó đổi vai.

**Nghe chép (45)**

- Nghe một câu (nghe lại được), rồi gõ lại bằng bộ gõ của máy.
- App so từng chữ, đánh dấu chữ sai hoặc thiếu; lỗi được ghi vào sổ lỗi.

Đường cao độ dùng chung cho 09A, 12 và 47, làm ở giai đoạn B2; cách làm ở mục 12.4.

### 5.8. Đọc mở rộng và sổ từ riêng

**Đọc mở rộng (48)**

- Truyện và bài đọc ngắn khoảng 100–300 chữ, xếp theo cấp.
- Chỉ dùng từ đã học, thêm tối đa 3 từ mới có đánh dấu. Truyện chỉ mở khi đã học hết các từ còn lại.
- Pinyin ẩn sẵn; chạm vào từ để xem Pinyin, nghĩa, nghe âm thanh và thêm vào ôn.
- Cuối truyện có 2–3 câu hỏi hiểu, không bắt buộc.
- Script kiểm tra từ vựng ở mục 11.6 giữ truyện đúng trình độ.

**Sổ từ riêng (49)**

- Thêm nhanh từ hoặc câu gặp ngoài đời và trong công việc.
- Gõ chữ Hán, app gợi ý Pinyin (mục 12.1); người học kiểm tra lại, nhập nghĩa tiếng Việt, câu ví dụ và ghi chú.
- Âm thanh đọc bằng giọng máy trên điện thoại (mục 12.9).
- Từ riêng ôn chung lịch FSRS, có nhãn “Riêng” và không tính vào tiến độ HSK.
- Nếu từ riêng trùng một từ HSK, app hỏi để gộp vào từ HSK.

### 5.9. Cặp dễ nhầm và bài luyện tự sinh

**Cặp dễ nhầm**

- Mỗi đáp án sai trong câu hỏi có trường “nhầm với”, trỏ tới một cặp dễ nhầm.
- Khi cùng một cặp bị nhầm từ 2 lần, app tạo bài luyện phân biệt cho cặp đó (43) và đưa vào lịch ôn.
- Danh sách soạn sẵn: 不/没, 二/两, 在/再, 会/能/可以; ở các cấp sau thêm 的/得/地. Chữ giống nhau: 己/已, 未/末, 土/士, 人/入/八.
- Sổ lỗi (17) có mục “Cặp hay nhầm”.

**Bài luyện tự sinh**

- App tạo ngẫu nhiên số, giá tiền, giờ, ngày và số điện thoại; giọng máy trên điện thoại đọc; người học chọn đáp án hoặc gõ chữ số (43).
- Luyện nghe không giới hạn mà không phải soạn thêm nội dung.
- Quy tắc đọc ở mục 11.8. Phạm vi số và đơn vị chỉ dùng từ đã có trong danh sách của cấp.

### 5.10. Theo dõi, dự báo và nước rút

- **Lịch học:** các ngày đã học hiện dạng ô theo ngày, kèm số phút. Không có thưởng chuỗi ngày, huy hiệu hay điểm.
- **Chế độ “Chỉ có 5 phút”** trên màn Hôm nay: chỉ ôn thẻ đến hạn, thẻ quá hạn lâu nhất trước, dừng sau 5 phút. Dùng cho ngày bận để không đứt thói quen.
- **Dự báo ôn:** số thẻ đến hạn trong 7 ngày tới. Khi số thẻ của ngày mai vượt 1,5 lần mức trung bình 14 ngày gần nhất, màn Hôm nay đề xuất học ít từ mới hơn.
- **Ước tính hoàn thành:** ngày dự kiến học xong cấp đang học theo tốc độ trung bình 14 ngày gần nhất, so với ngày thi.
- **Nước rút:** từ 28 ngày trước ngày thi, mỗi tuần một bài thi thử đầy đủ; buổi học hằng ngày ưu tiên sổ lỗi, cặp dễ nhầm và dạng bài yếu nhất; bài mới chỉ học khi còn bài chưa học trong cấp thi. Màn Kế hoạch (04) hiện ngày bắt đầu nước rút.

## 6. Luyện thi HSK

### 6.1. Các thành phần

- Chọn cấp (bản đầu: HSK 1); nhãn đề cương cố định là HSK 3.0.
- Luyện theo dạng bài hoặc phần kỹ năng.
- Chọn độ dài bài luyện ngắn.
- Kiểm tra âm thanh trước khi thi thử.
- Làm bài có đồng hồ và danh sách câu hỏi.
- Xác nhận trước khi nộp.
- Xem kết quả theo từng phần.
- Xem đáp án, giải thích và lỗi.
- Lập kế hoạch sửa lỗi.
- Xem lịch sử luyện thi.

### 6.2. Nguyên tắc thiết kế bài thi

- Thi thử đầy đủ theo cấu trúc, thời lượng và số câu của đề mẫu HSK 3.0 chính thức. Khi chưa có đề mẫu, chỉ làm luyện theo dạng bài, và bài thi thử nếu có phải ghi rõ là bài mô phỏng.
- Bài luyện ngắn có thông số riêng và được nhận diện rõ là bài luyện.
- Luyện ngắn phản hồi ngay sau từng câu (màn 43). Thi thử phản hồi sau khi nộp.
- Phân biệt câu đã trả lời, chưa trả lời và đang xem.
- Thông báo số câu còn bỏ trống trước khi nộp.
- Đồng hồ thi thử tính theo giờ thực và không tạm dừng. Nếu app bị đóng, mở lại sẽ làm tiếp trong thời gian còn lại; hết giờ thì tự nộp. Bài luyện ngắn được tạm dừng.
- Bài làm được lưu trên máy sau mỗi câu, nên mất mạng không ảnh hưởng.
- Bố trí buổi thi thử đủ thời lượng, tách khỏi buổi học thường ngày.
- Từ 28 ngày trước ngày thi, kế hoạch chuyển sang chế độ nước rút (mục 5.10).
- Phần nói và viết theo yêu cầu của từng cấp trong HSK 3.0. Theo các bài tổng hợp, HSK 1 chỉ có nghe và đọc; xác nhận lại với đề mẫu.

### 6.3. Đọc kết quả

| Chỉ số | Ý nghĩa |
|---|---|
| Tiến độ học | Bài đã học, từ đã ôn và nhiệm vụ đã thực hiện |
| Kết quả luyện thi | Số câu đúng và tỷ lệ từng phần, thời gian, dạng câu còn yếu |
| Nội dung cần củng cố | Các kiến thức được đề xuất ôn tiếp |
| Lịch sử | Các lần luyện để xem lại kết quả và lời giải |

App không tái tạo được cách quy đổi điểm chính thức. Kết quả hiển thị bằng số câu đúng và tỷ lệ. Chỉ hiện “điểm ước tính” khi đã có quy tắc chấm được công bố, và luôn ghi rõ đó không phải điểm HSK.

Các ảnh thiết kế dùng đề luyện 20 câu, đồng hồ và kết quả như 16/20 để minh họa bố cục. Những con số đó không mô tả cấu trúc hoặc điểm chính thức của HSK.

## 7. Tập viết và hướng dẫn cách viết

### 7.1. Ba phần luyện viết

| Phần | Mục tiêu | Màn |
|---|---|---|
| Viết chữ Hán | Biết cấu tạo, hướng nét, thứ tự nét; viết lại từ trí nhớ | 13, 13A–13D |
| Viết câu và đoạn | Dùng từ, ngữ pháp và cách tổ chức nội dung | 14 |
| Gõ chữ và nghe chép | Gõ đúng từ và câu bằng bộ gõ; nghe rồi gõ lại câu | 45 |

### 7.2. Bốn bước học viết chữ

Công cụ: thư viện Hanzi Writer và dữ liệu nét đi kèm, đã đối chiếu với chuẩn thứ tự nét (mục 11.3). Ô tập viết dùng 田字格.

**Bước 1 — Xem mẫu từng nét (13A)**

- Hiển thị chữ được viết bằng chuyển động.
- Cho thấy thứ tự và hướng từng nét.
- Có phát chậm, tạm dừng, xem lại toàn chữ hoặc từng nét.
- Có phần giải thích ngắn khi cần.

**Bước 2 — Đồ theo mẫu (13B)**

- Hiển thị nét mờ trong ô 田字格.
- Viết bằng ngón tay, chuột hoặc bút cảm ứng tùy thiết bị.
- Gợi ý nét tiếp theo khi người học yêu cầu, hoặc tự động sau 3 lần sai một nét.
- Có viết lại và xóa lần tập hiện tại.

**Bước 3 — Tự viết (13C)**

- Ẩn mẫu để viết từ trí nhớ.
- Có thể xem gợi ý khi gặp khó khăn; lần viết có dùng gợi ý được ghi nhận riêng.
- Giữ vùng viết rõ ràng, không có tranh trang trí phía sau.

**Bước 4 — Đối chiếu và luyện lại (13D)**

- Hiển thị chữ người học cạnh mẫu.
- Phản hồi theo từng nét: nét đúng, nét sai (sai hình hoặc lệch vị trí), số lần sai mỗi nét, nét vẽ ngược hướng. Nét vẽ khớp với một nét khác của chữ được báo là sai thứ tự.
- Chỉ ra nét nên luyện lại.
- Chữ có nét sai được đưa vào lịch ôn viết tay.

### 7.3. Thông tin đi kèm mỗi chữ

- Chữ giản thể.
- Pinyin, âm thanh và nghĩa tiếng Việt.
- Âm Hán Việt, hiển thị khi giúp nhớ.
- Số nét.
- Bộ thủ (kèm tên Hán Việt) và bộ phận cấu tạo khi có ích cho bài.
- Cấp cần nhận biết và cấp cần viết tay, theo đề cương thi.
- Từ chứa chữ và câu ví dụ.
- Ghi chú mẹo nhớ của riêng mình.
- Liên kết với bài học và cấp đang học.

Ví dụ minh họa trong bản vẽ: 人 — rén — người; âm Hán Việt: nhân; 2 nét.

### 7.4. Viết câu và đoạn (14)

- Sắp xếp từ thành câu.
- Điền thành phần còn thiếu.
- Viết câu theo tình huống hoặc mẫu.
- Tự viết câu giới thiệu và đoạn ngắn khi đạt trình độ phù hợp.
- Câu viết tự do: bản đầu so với câu mẫu và tự đánh giá; nhận xét bằng AI ở giai đoạn C.
- Lưu lỗi từ vựng và ngữ pháp để ôn.

### 7.5. Gõ chữ và nghe chép (45)

- Dùng bộ gõ tiếng Trung của máy: trên iPhone, thêm bàn phím Tiếng Trung (Giản thể) kiểu Pinyin; trên máy tính, dùng bộ gõ Pinyin của hệ điều hành. App không tự làm bộ gõ.
- Luyện gõ: nghe hoặc xem nghĩa rồi gõ từ hoặc câu; app so chữ gõ ra với đáp án.
- Nghe chép: nghe một câu rồi gõ lại (mục 5.7).
- Lỗi chọn sai chữ đồng âm được ghi vào sổ lỗi.

### 7.6. Các trạng thái viết cần phác bố cục

Màn 13 đã có bản tổng quan và nút “Xem mẫu”. Cần phác bố cục bốn trạng thái chi tiết dưới cùng nhóm màn trước khi làm:

| Mã trạng thái | Nội dung |
|---|---|
| 13A | Xem mẫu chữ chuyển động theo từng nét |
| 13B | Đồ theo nét mờ và nhận gợi ý |
| 13C | Tự viết khi đã ẩn mẫu |
| 13D | Đối chiếu, xem phản hồi và luyện lại |

Các trạng thái 13A–13D chưa nằm trong 41 màn đã vẽ.

## 8. Hệ thống giao diện

### 8.1. Màu sắc

| Mã màu | Giá trị | Dùng cho |
|---|---|---|
| nen-chinh | #FBF6EE | Nền giấy ngà |
| nen-phu | #F0E5D7 | Nền kem: thẻ, khối phụ, đáp án đang chọn |
| chu-chinh | #352521 | Chữ chính, viền đáp án đang chọn |
| chu-phu | #6B5A50 | Chữ phụ, chú thích |
| son | #AB483B | Nút chính, tab đang chọn, tiến độ, dấu nhận diện nhỏ |
| dung | #2F6446 | Đúng; luôn kèm ✓ và chữ “Đúng” |
| nen-dung | #E5EFE7 | Nền thẻ đáp án đúng |
| sai | #8E2A20 | Sai và cảnh báo bẫy nghĩa; luôn kèm ✕ hoặc chữ |
| nen-sai | #F8E5E1 | Nền thẻ đáp án sai |
| canh-bao | #7A5410 | Cảnh báo: câu bỏ trống, sắp hết giờ |
| nen-canh-bao | #F6ECD2 | Nền khối cảnh báo |
| vien-o | #8F7C6C | Viền ô nhập, ô tập viết, nút phụ |
| phan-cach | #E2D5C3 | Đường phân cách trang trí |
| Tranh | — | Mực đen, xám trung tính, vùng sương sáng |

Đỏ son đổi từ #AD493C sang #AB483B để đạt 4.5:1 trên nền kem; mắt thường gần như không thấy khác biệt.

Độ tương phản đã kiểm tra theo chuẩn WCAG AA (chữ cần từ 4.5:1, viền điều khiển từ 3:1):

| Màu chữ/viền | Trên nen-chinh | Trên nen-phu |
|---|---|---|
| chu-chinh | 13.57:1 | 11.75:1 |
| chu-phu | 6.09:1 | 5.27:1 |
| son | 5.24:1 | 4.54:1 |
| dung | 6.44:1 | 5.57:1 |
| sai | 7.80:1 | 6.75:1 |
| canh-bao | 6.29:1 | 5.44:1 |
| vien-o | 3.71:1 | 3.21:1 |

Chữ màu nền ngà trên nút đỏ son đạt 5.24:1. Chữ dung, sai, canh-bao trên nền nhạt tương ứng đạt 5.88:1, 6.91:1 và 5.75:1.

### 8.2. Quy tắc bắt buộc

- Vùng tranh có nền sáng, không phủ hoặc nhuộm đỏ son.
- Đỏ son dùng cho nút, tab đang chọn, tiến độ và dấu nhận diện nhỏ.
- Trong bài làm và bài thi, đáp án đang chọn dùng viền chu-chinh trên nền kem, không dùng đỏ son, để không lẫn với đáp án sai.
- Đúng/sai không chỉ dựa vào màu: luôn có biểu tượng ✓/✕ và chữ.
- Đường cao độ không hiển thị như điểm số hay tỷ lệ phần trăm.
- Tranh núi, đình, cành cây và sương là mực đen–xám.
- Tranh ở đầu màn hoặc mép vùng giới thiệu; không cản nội dung và câu trả lời.
- Màn thi thử giảm trang trí để ưu tiên câu hỏi, đáp án, đồng hồ và điều hướng.
- Icon nét mảnh, đồng nhất.
- Khoảng trắng thoáng, ít khung hộp lặp lại.
- Nút và vùng chạm tối thiểu 44 × 44 px.
- Không dùng điểm phát âm AI giả, huy chương, tiền thưởng, thưởng chuỗi ngày hoặc tỷ lệ đỗ để trang trí.

### 8.3. Điều hướng

Trên điện thoại, các khu vực chính dùng năm mục:

| Tab | Màn chính | Mở tiếp từ tab |
|---|---|---|
| Hôm nay | 05 | 08, 16, 49 (Thêm từ) và các hoạt động trong ngày |
| Lộ trình | 06 | 07, 08, 41 |
| Luyện tập | 44 | 12, 13, 14, 16, 17, 19 (luyện thi), 43 (cặp dễ nhầm, bài tự sinh), 45, 47; 15 ở giai đoạn C |
| Thư viện | 18 | 48, 49 |
| Tôi | 28 | 27, 29, 40, 46; 30 ở giai đoạn C |

Màn bài học tập trung, kiểm tra và thi thử ẩn thanh điều hướng để dành chỗ cho nhiệm vụ. Trên máy tính, điều hướng chính nằm ở thanh bên.

### 8.4. Chữ và font

- Tiêu đề: giữ font serif trong bảng ảnh nếu hiển thị đủ dấu tiếng Việt và Pinyin; nếu không, dùng Noto Serif.
- Nội dung và điều khiển: Noto Sans.
- Chữ Hán: Noto Sans SC cho nội dung, Noto Serif SC cho tiêu đề. Mọi đoạn chữ Hán gắn `lang="zh-CN"` để máy dùng đúng tự dạng giản thể.
- Kiểm tra trước khi chốt font: hiển thị đủ ā á ǎ à, ē é ě è, ī í ǐ ì, ō ó ǒ ò, ū ú ǔ ù, ǖ ǘ ǚ ǜ ü; các chữ 直, 骨, 角 hiện đúng tự dạng giản thể.
- Font chữ Hán dùng bản chia nhỏ của Google Fonts hoặc tự cắt theo danh sách chữ có trong nội dung, để trang tải nhanh và chạy được khi không có mạng.

### 8.5. Bố cục máy tính

- Màn rộng dưới 900 px: dùng bố cục điện thoại, thanh điều hướng ở dưới, nội dung rộng tối đa 560 px và căn giữa.
- Từ 900 px: thanh điều hướng bên trái; nội dung một cột rộng tối đa 720 px.
- Màn bài học và thi thử dùng bố cục hai cột theo màn 37 và 38.
- Luyện chữ trên máy tính viết bằng chuột; ô 田字格 rộng tối thiểu 320 px.

## 9. Danh mục màn hình và trạng thái

### 9.1. Danh mục

Cột Giai đoạn theo mục 13. “Bỏ” là màn đã vẽ nhưng không dùng trong app cá nhân; mã màn được giữ nguyên để đối chiếu bảng ảnh. Đường cao độ trên 09A, 12 và 47 thuộc giai đoạn B2.

| Mã | Màn hình | Nội dung/hành động chính | Giai đoạn |
|---|---|---|---|
| 01 | Chào mừng | Chỉ hiện lần đầu; giới thiệu ngắn và nút bắt đầu | B1 |
| 02 | Mục tiêu học | Chọn học từ đầu, luyện thi hoặc kết hợp; chọn cấp mục tiêu | B1 |
| 03 | Chọn điểm bắt đầu | Bắt đầu từ Nền phát âm hoặc chọn một bài; dùng lại bố cục cũ, bỏ phần kiểm tra đầu vào | B1 |
| 04 | Kế hoạch cá nhân | Thời lượng, ngày thi; kế hoạch tính lại ngay khi đổi; ngày bắt đầu nước rút (B2) | B1 |
| 05 | Hôm nay | Bài tiếp theo, thời lượng, từ đến hạn, Ôn thêm, Chỉ có 5 phút; đề xuất giảm từ mới và nút Thêm từ (B2) | B1 |
| 06 | Lộ trình HSK | Nền phát âm, HSK 1–6, HSK 7–9/chuyên ngành; chặng chưa có nội dung bị khóa | B1 |
| 07 | Tổng quan chặng | Chủ đề, tiến độ và bài tiếp theo; dùng cho cả Nền phát âm và HSK 1 | B1 |
| 08 | Chi tiết bài học | Mục tiêu, các hoạt động và tài liệu tham chiếu | B1 |
| 09 | Nghe và đọc | Hội thoại, âm thanh, hỗ trợ nghĩa/Pinyin, kiểm tra hiểu; dẫn vào 09A, 09B | B1 |
| 09A | Nhại theo | Từng câu, lặp lại, ghi âm, nghe xen kẽ với mẫu, ẩn dần chữ (mục 5.7) | B1 |
| 09B | Đóng vai | Nói lời một vai, ghi âm, nghe lại cả đoạn, đổi vai (mục 5.7) | B1 |
| 10 | Học từ mới | Từ, Pinyin, âm thanh, nghĩa, âm Hán Việt, từ Hán Việt và cảnh báo bẫy nghĩa, câu, ghi chú, lưu từ | B1 |
| 11 | Ngữ pháp | Mẫu câu, giải thích, so sánh với tiếng Việt, ví dụ và bài tập | B1 |
| 12 | Luyện phát âm | Nghe mẫu, ghi âm, nghe lại, so với mẫu, tự đánh giá | B1 |
| 13 | Luyện chữ Hán | Ô viết, chữ mẫu, xem mẫu, viết lại, gợi ý, ghi chú; dẫn vào 13A–13D | B1 |
| 13A–13D | Các bước viết chữ | Xem mẫu, đồ theo, tự viết, đối chiếu (mục 7.2) | B1 |
| 14 | Luyện viết câu | Sắp xếp từ, điền chỗ trống, viết câu và so với câu mẫu | B1 |
| 15 | Hội thoại AI | Nhiệm vụ nói, hội thoại, gợi ý; theo quy tắc mục 5.6 | C |
| 16 | Ôn từ đến hạn | Thẻ ôn, mở đáp án kèm ghi chú, tự đánh giá bốn mức | B1 |
| 17 | Sổ lỗi | Xem nhóm lỗi, mục Cặp hay nhầm (B2), mở hoạt động luyện lại | B1 |
| 18 | Thư viện và tra từ | Tra trong kho từ của app, nghe, xem ví dụ, quản lý từ đã lưu; dẫn vào 48, 49 | B1 |
| 19 | Trung tâm luyện thi | Chọn cấp, luyện dạng bài, thi thử, lịch sử và kế hoạch | B2 |
| 20 | Luyện theo dạng bài | Chọn kỹ năng, dạng bài và số câu luyện | B2 |
| 21 | Chuẩn bị thi thử | Kiểm tra thông số, âm thanh và sẵn sàng làm bài | B2 |
| 22 | Đang thi thử | Câu hỏi, đáp án, đồng hồ và điều hướng | B2 |
| 23 | Xác nhận nộp bài | Báo câu bỏ trống; nộp hoặc tiếp tục làm | B2 |
| 24 | Kết quả | Dùng chung cho thi thử và bài luyện ngắn: từng phần, thời gian, lời giải, kế hoạch ôn | B2 |
| 25 | Giải thích đáp án | Đáp án đã chọn, đáp án đúng, lý do và câu tương tự | B2 |
| 26 | Kế hoạch sửa lỗi | Các hoạt động ôn được đề xuất từ bài luyện | B2 |
| 27 | Tiến bộ học tập | Tách tiến độ học và kết quả thi; lịch học, dự báo ôn, ước tính hoàn thành | B2 |
| 28 | Hồ sơ và mục tiêu | Cấp mục tiêu, thời lượng, ngày thi | B1 |
| 29 | Cài đặt học tập | Cách hiện Pinyin, tốc độ âm thanh, cỡ chữ, giờ học, micro, danh sách nội dung cần sửa | B1 |
| 30 | Trợ giúp | Cách cài app ra Màn hình chính, bật micro, thêm bàn phím Pinyin, cài giọng đọc, cách ôn | C |
| 31 | Đăng nhập | — | Bỏ |
| 32 | Tạo tài khoản | — | Bỏ |
| 33 | Khôi phục mật khẩu | — | Bỏ |
| 34A | Chưa có bài ôn | Giải thích trạng thái và dẫn đến bài đầu (màn 34 đã vẽ) | B1 |
| 34B | Sổ lỗi trống | Giải thích và dẫn về bài đang học | B1 |
| 34C | Chưa có từ đã lưu | Hướng dẫn lưu từ từ màn 10 | B1 |
| 34D | Chưa có lịch sử thi | Dẫn đến luyện dạng bài hoặc thi thử | B2 |
| 35 | Chưa bật micro | Cho phép micro, làm phần thay thế không cần nói, hoặc để sau | B1 |
| 36 | Ngoại tuyến | Báo đang ngoại tuyến; vẫn học được; đồng bộ khi có mạng | B2 |
| 37 | Học bài trên máy tính | Bài học, kiểm tra hiểu và hội thoại trong bố cục rộng | B2 |
| 38 | Thi thử trên máy tính | Câu hỏi, danh sách câu, trạng thái, đồng hồ, nộp bài | B2 |
| 39 | Hoàn thành bài học | Tổng kết hoạt động, ôn lại, học tiếp | B1 |
| 40 | Lịch sử luyện thi | Xem các bài đã làm và mở lại kết quả | B2 |
| 41 | Cấp độ và giáo trình | Nội dung cấp, nguồn tham khảo và danh sách bài | B2 |
| 42 | Kiểm tra | Kiểm tra mục tiêu bài và kiểm tra cuối chủ đề, dùng chung bố cục | B1 |
| 43 | Làm bài luyện ngắn | Câu hỏi, phản hồi ngay sau từng câu, tạm dừng; biến thể cặp dễ nhầm và bài tự sinh | B2 |
| 44 | Luyện tập | Màn chính của tab Luyện tập | B1 |
| 45 | Luyện gõ và nghe chép | Theo mục 7.5 | B2 |
| 46 | Sao lưu và đồng bộ | Xuất/nhập tệp sao lưu (B1); kết nối Apps Script bằng mã PIN (B2) | B1/B2 |
| 47 | Luyện thanh điệu | 20 cặp thanh: nghe nhận biết và nói lại (mục 5.7) | B1 |
| 48 | Đọc mở rộng | Danh sách truyện theo cấp và màn đọc có chạm để tra (mục 5.8) | B2 |
| 49 | Sổ từ riêng | Thêm, sửa và ôn từ riêng (mục 5.8) | B2 |

Màn 37–38 là bản máy tính; các màn còn lại là điện thoại và hiển thị trên máy tính theo mục 8.5.

### 9.2. Màn cần bố cục mới

- 13A–13D và 47: nhiều trạng thái hoặc có đường cao độ, nên phác bố cục trước khi làm.
- 09A, 09B, 42–46, 48, 49 và 34B–34D: dựng thẳng bằng code theo hệ thống giao diện ở mục 8, không bắt buộc vẽ trước.

### 9.3. Quy ước lưu bảng ảnh

- Lưu bảng ảnh trong thư mục `design/` của repo.
- Đặt tên tệp theo mẫu `bang-<số bảng>_man-<mã đầu>-<mã cuối>_v<phiên bản>.png`, ví dụ `bang-01_man-01-04_v2.png`.
- Mỗi lần hiệu chỉnh tăng số phiên bản; bản có số lớn nhất là căn cứ.
- Lập danh mục trong `design/README.md` gồm: số bảng, các màn trong bảng, phiên bản và ngày.

## 10. Những luồng chính

### 10.1. Lần đầu và hằng ngày

- Lần đầu: 01 → 02 → 03 → 04 → 05.
- Hằng ngày: 05 → 08 (bài tiếp theo), hoặc 06 → 07 → 08.

### 10.2. Học và hoàn thành một bài

08 → các hoạt động 09–14 theo cấu trúc bài, gồm 09A và 09B khi bài có hội thoại → 42 (kiểm tra mục tiêu, ở buổi cuối của bài) → 39.

Từ màn 39, người học có thể ôn lại hoặc sang bài tiếp theo. Khi hết một chủ đề: 42 (kiểm tra cuối chủ đề) → 07.

### 10.3. Ôn tập

- Thường ngày: 05 hoặc 44 → 16/17 → hoạt động luyện lại → cập nhật tiến độ ở 27.
- Ngày bận: 05 → Chỉ có 5 phút → 16.
- Cặp dễ nhầm: 17 → 43 (biến thể cặp dễ nhầm).

### 10.4. Luyện thi

- Luyện ngắn: 19 → 20 → 43 → 24 → 25 → 26.
- Thi thử: 19 → 21 → 22 → 23 → 24 → 25 → 26 → hoạt động ôn, rồi luyện lại.
- Lịch sử: 40, mở từ màn 19 hoặc tab Tôi.
- Nước rút: 04 hiện ngày bắt đầu; trong giai đoạn nước rút, 05 đưa bài thi thử hằng tuần vào kế hoạch.

### 10.5. Viết chữ

13 → 13A xem mẫu → 13B đồ theo → 13C tự viết → 13D đối chiếu.

Người học có thể quay lại xem mẫu hoặc luyện riêng nét chưa vững.

### 10.6. Sao lưu và tình huống gián đoạn

- Sao lưu và đồng bộ: tab Tôi → 46.
- Trạng thái trống: 34A–34D.
- Chưa bật micro: 35.
- Ngoại tuyến: 36; bài đang làm vẫn được lưu trên máy.

### 10.7. Luyện nói và nghe

- Trong bài: 09 → 09A nhại theo → 09B đóng vai.
- Thanh điệu: 44 → 47.
- Nghe chép: 44 → 45.
- Bài tự sinh: 44 → 43 (biến thể bài tự sinh).

### 10.8. Đọc mở rộng và sổ từ riêng

- Đọc: 18 → 48 → chạm vào từ → thêm vào ôn (16).
- Từ riêng: 18 hoặc nút Thêm từ ở 05 → 49 → thêm từ → ôn ở 16.

## 11. Chuẩn dữ liệu nội dung

### 11.1. Danh sách gốc

- Từ, chữ và điểm ngữ pháp lấy từ Đề cương thi HSK (11/2025) và giữ mã của đề cương: từ và chữ dùng số thứ tự trong đề cương. Đề cương không đánh mã điểm ngữ pháp nên Xinyu đặt mã `NP<cấp>-<số>` theo thứ tự dòng trong bảng (NP1-01 đến NP1-70).
- Danh sách từng cấp lưu ở `content/de-cuong/hsk<cấp>.json`. Từ và chữ trích bằng `tools/trich-de-cuong.mjs` từ tệp PDF (không đưa PDF vào repo); bảng ngữ pháp có ô gộp nên chép tay, script giữ nguyên phần này khi chạy lại. Quy ước từng trường ghi trong mục `quyUoc` của tệp JSON.
- Số liệu HSK 1 đã xác nhận với đề cương (mục 3.1).

### 11.2. Pinyin

- Lưu hai trường: Pinyin gốc (thanh gốc, theo GB/T 16159—2012) và Pinyin hiển thị.
- Pinyin hiển thị ghi thanh biến của 一 và 不 theo quy ước thường dùng trong giáo trình (ví dụ 不客气 bú kèqi, 一起 yìqǐ); không ghi biến điệu khi hai thanh 3 đi liền nhau (你好 nǐ hǎo). Các bài Nền phát âm dạy rõ những quy tắc này.
- Thanh nhẹ không có dấu (妈妈 māma).
- Pinyin của câu viết liền theo từ, viết hoa chữ đầu câu và tên riêng.
- Pinyin lưu theo từ, không ghép từ Pinyin của từng chữ, để xử lý chữ đa âm (行, 长, 了…).

### 11.3. Chữ Hán và nét viết

- Chữ giản thể theo 《通用规范汉字表》(2013).
- Thứ tự nét theo 《通用规范汉字笔顺规范》(GF 0023—2020).
- Dữ liệu nét lấy từ Hanzi Writer. Đối chiếu từng chữ HSK 1 với GF 0023—2020; chữ nào lệch thì ghi vào danh sách sửa riêng.
- Mỗi chữ có: số nét, bộ thủ kèm tên Hán Việt, bộ phận cấu tạo, âm Hán Việt, cấp cần nhận biết, cấp cần viết tay.

### 11.4. Âm Hán Việt và từ Hán Việt

- Âm Hán Việt của chữ: lấy từ trường kVietnamese của cơ sở dữ liệu Unihan, đối chiếu với từ điển Hán Việt.
- Từ Hán Việt của từ: tự biên soạn (có thể nhờ AI gợi ý), kiểm tra bằng từ điển tiếng Việt; ghi loại “cùng nghĩa” hoặc “bẫy nghĩa”, không chắc thì để trống.
- Chỉ hiển thị khi giúp nhớ, luôn kèm nghĩa hiện đại (mục 5.5).

### 11.5. Mô hình dữ liệu

**Nội dung** (tệp JSON trong repo, sinh từ công cụ biên soạn ở mục 12.8):

| Đối tượng | Trường chính |
|---|---|
| Bài | Mã, chặng/cấp, chủ đề, mục tiêu, danh sách từ/chữ/ngữ pháp, hoạt động, tài liệu tham chiếu, phiên bản |
| Từ | Mã đề cương, chữ, Pinyin gốc, Pinyin hiển thị, nghĩa tiếng Việt, loại từ, cấp, từ Hán Việt, loại Hán Việt (cùng nghĩa/bẫy nghĩa), âm thanh, câu ví dụ |
| Chữ | Chữ, số nét, bộ thủ, tên Hán Việt của bộ, cấu tạo, âm Hán Việt, cấp nhận biết, cấp viết tay |
| Ngữ pháp | Mã đề cương, mẫu câu, giải thích, so sánh với tiếng Việt, lỗi người Việt hay mắc, ví dụ, cấp |
| Câu | Chữ Hán, Pinyin hiển thị, nghĩa, âm thanh, danh sách từ, vai (người nói, dùng cho đóng vai) |
| Câu hỏi | Mã, dạng bài, kỹ năng, điểm kiến thức, nội dung, đáp án đúng, các đáp án sai kèm trường “nhầm với”, lời giải |
| Cặp thanh | Tổ hợp thanh, cách đọc thực tế, từ ví dụ, âm thanh |
| Cặp dễ nhầm | Mã, các mục trong cặp, giải thích phân biệt, câu hỏi phân biệt |
| Truyện | Mã, cấp, tiêu đề, danh sách câu, từ mới (tối đa 3), câu hỏi hiểu, âm thanh (nếu có) |

**Dữ liệu học** (lưu trên máy; mỗi bản ghi có thời điểm cập nhật để đồng bộ):

| Đối tượng | Trường chính |
|---|---|
| Thẻ ôn | Đối tượng, loại thẻ, trạng thái FSRS, ngày đến hạn |
| Lỗi | Câu hỏi hoặc hoạt động, nhóm lỗi, cặp dễ nhầm (nếu có), ngày, đã luyện lại hay chưa |
| Lần làm bài | Loại (luyện ngắn, thi thử, kiểm tra, bài tự sinh), thời gian, câu trả lời, kết quả từng phần |
| Từ riêng | Chữ, Pinyin, nghĩa tiếng Việt, câu ví dụ, ghi chú, ngày thêm |
| Ghi chú | Đối tượng (từ hoặc chữ), nội dung, ngày |
| Nhật ký học | Ngày, số phút, các hoạt động |
| Bản ghi âm | Mục liên quan, ngày, tệp âm thanh (không đồng bộ) |

### 11.6. Kiểm tra nội dung khi làm một mình

Thay cho bước rà soát chuyên môn, mỗi phần nội dung đi qua các bước sau. Các bước 1–4 chạy tự động trong công cụ biên soạn (mục 12.8).

1. Đối chiếu với danh sách đề cương: từ, chữ và ngữ pháp nằm đúng cấp.
2. Đối chiếu Pinyin từng từ với CC-CEDICT; từ nào lệch thì xem lại.
3. Kiểm tra câu ví dụ, bài đọc và truyện chỉ dùng từ đã học và từ của bài (truyện thêm tối đa 3 từ mới).
4. Kiểm tra cách ghi 一 và 不 trong Pinyin hiển thị; trường hợp ngoại lệ xem lại bằng tay.
5. Kiểm tra từ Hán Việt, nhất là các từ ghi “bẫy nghĩa”.
6. Nghe lại toàn bộ âm thanh.
7. Trong app, nút “Báo lỗi” trên thẻ từ, câu và câu hỏi ghi vào danh sách nội dung cần sửa (xem ở màn 29).
8. Khi có thể, nhờ giáo viên hoặc người bản xứ xem mẫu một số bài.

### 11.7. Bản quyền

- Repo công khai chỉ chứa nội dung tự biên soạn.
- Bài khóa, bài tập và âm thanh của giáo trình hoặc đề thi thật chỉ dùng để tham khảo khi biên soạn, không chép vào repo.

### 11.8. Quy tắc bài luyện tự sinh

- Giọng máy đọc chuỗi chữ Hán do app sinh ra, không đọc chữ số Ả Rập.
- Số đếm dùng 二 (十二, 二十二); trước lượng từ dùng 两 (两个, 两本).
- Giờ: 两点 (không nói 二点), 半, 分.
- Ngày: 月, 号 (văn nói) hoặc 日 (văn viết); thứ: 星期 kèm số, 星期天 hoặc 星期日.
- Năm đọc từng chữ số: 二〇二六年.
- Số điện thoại đọc từng chữ số, số 1 đọc yāo (viết 幺 trong chuỗi đưa cho giọng máy).
- Giá tiền: 块 (văn nói) hoặc 元 (văn viết).
- Chỉ sinh số, đơn vị và mẫu câu có trong danh sách từ của cấp đang học.

## 12. Kiến trúc kỹ thuật

### 12.1. Tổng quan

| Thành phần | Lựa chọn |
|---|---|
| Ứng dụng | PWA tĩnh trên GitHub Pages, repo `luongquangdao8386-ops/xinyu`; HTML, CSS và JavaScript thuần |
| Nội dung | Tệp JSON và âm thanh MP3 trong repo |
| Dữ liệu học | IndexedDB trên máy |
| Ngoại tuyến | Service worker lưu sẵn trang, nội dung, font và âm thanh của các bài đã mở |
| Nét chữ | Hanzi Writer |
| Lịch ôn | ts-fsrs |
| Gợi ý Pinyin cho từ riêng | pinyin-pro (xử lý chữ đa âm) |
| Giọng máy trên máy | Web Speech API (speechSynthesis), giọng zh-CN |
| Đường cao độ | Web Audio API, dò cao độ ngay trên máy |
| Biên soạn | Google Sheets và script xuất JSON (mục 12.8) |
| Sao lưu | Xuất/nhập tệp JSON (B1) |
| Đồng bộ | Google Apps Script + Google Sheet, bảo vệ bằng mã PIN 6 số (B2) |
| AI | Gọi qua Apps Script; khóa API lưu trong Script Properties (C) |

### 12.2. Lưu dữ liệu trên iPhone

- Cài app ra Màn hình chính và mở app từ đó, để dữ liệu ít có nguy cơ bị Safari xóa khi lâu không mở trang.
- Xin quyền lưu trữ lâu dài bằng `navigator.storage.persist()`.
- Khi chưa bật đồng bộ, app nhắc xuất tệp sao lưu mỗi tuần.

### 12.3. Âm thanh mẫu

- Từ, câu, hội thoại và truyện: tạo sẵn bằng giọng máy neural tiếng Phổ thông, nghe duyệt trước khi dùng; tên tệp theo mã nội dung. Mỗi câu có tệp riêng để dùng cho nhại theo và đóng vai.
- Âm tiết, thanh điệu và cặp thanh ở Nền phát âm: ưu tiên ghi âm người thật; nếu dùng giọng máy thì nghe kỹ thanh nhẹ và biến điệu.
- Đường cao độ của âm thanh mẫu được tính sẵn khi tạo âm thanh.
- Có hai tốc độ phát: bình thường và chậm.

### 12.4. Ghi âm và đường cao độ

- Ghi bằng MediaRecorder; lưu trên máy, không đồng bộ. Mỗi mục giữ 3 bản ghi gần nhất, gồm cả bản ghi nhại theo và đóng vai.
- Đường cao độ (B2): dò cao độ ngay trên máy bằng Web Audio API (thuật toán kiểu YIN), vẽ đường của mẫu và của bản ghi trên cùng một khung.
- Quy đổi theo cao độ trung bình của từng giọng (đơn vị nửa cung) để so hình dạng lên xuống, không so độ cao tuyệt đối giữa hai giọng.
- Không tính điểm và không hiển thị phần trăm.

### 12.5. Nhắc học

- Bản đầu không có thông báo đẩy. Dùng Lời nhắc hoặc Lịch của điện thoại theo giờ học đặt ở màn 29.
- Giai đoạn B2: Apps Script gửi email vào giờ học nếu hôm đó chưa học (biết qua dữ liệu đồng bộ).

### 12.6. Đồng bộ (B2)

- Điện thoại và máy tính gửi các bản ghi thay đổi lên Google Sheet qua Apps Script; với cùng một bản ghi, bản có thời điểm cập nhật mới hơn được giữ.
- Đồng bộ thẻ ôn, lỗi, lần làm bài, từ riêng, ghi chú và nhật ký học; bản ghi âm không đồng bộ.
- Mã PIN và khóa API lưu trong Script Properties, không nằm trong mã nguồn.

### 12.7. Hiệu năng

- Tranh mực xuất dạng WebP hoặc SVG, mỗi tranh dưới khoảng 150 KB.
- Font theo mục 8.4.
- Âm thanh tải theo bài và được lưu vào bộ nhớ đệm khi đã mở.

### 12.8. Công cụ biên soạn (giai đoạn A)

- Nội dung soạn trên một Google Sheet, mỗi loại một tab: Bai, Tu, Chu, NguPhap, Cau, CauHoi, CapThanh, CapDeNham, Truyen. Cột theo mô hình dữ liệu ở mục 11.5; mỗi dòng có mã và trạng thái (nháp hoặc đã kiểm tra).
- Script `tools/xay-noi-dung` đọc dữ liệu từ đường dẫn CSV công bố của từng tab, hoặc từ tệp .xlsx tải về khi không truy cập được mạng. Script chuyển dữ liệu thành JSON trong `content/`, chạy các bước kiểm tra 1–4 ở mục 11.6 và in báo cáo. Dòng chưa ở trạng thái “đã kiểm tra” không được xuất.
- Script `tools/tao-am-thanh` tạo MP3 cho từ, câu và truyện mới hoặc đã sửa, đồng thời tính sẵn đường cao độ của âm thanh mẫu. Khóa dịch vụ giọng máy đặt trong biến môi trường (tệp `.env`, không đưa lên repo).
- Danh sách nội dung cần sửa xuất từ app (màn 29) được dán vào tab CanSua để xử lý.

### 12.9. Giọng máy trên điện thoại

- Dùng cho sổ từ riêng và bài luyện tự sinh. Nội dung bài học vẫn dùng âm thanh tạo sẵn (mục 12.3).
- Chọn giọng tiếng Trung (zh-CN) có sẵn trên máy. Nếu máy không có giọng zh-CN, ẩn nút nghe của hai tính năng này và hướng dẫn cài giọng đọc.

## 13. Lộ trình triển khai

### Giai đoạn A — Chuẩn bị nội dung và thiết kế

- Tải bản gốc Đề cương thi HSK (11/2025); xác nhận và nhập danh sách từ, chữ, ngữ pháp HSK 1.
- Tìm đề mẫu HSK 3.0 cấp 1 để chốt cấu trúc thi thử.
- Dựng công cụ biên soạn (mục 12.8) trước khi soạn hàng loạt.
- Lập bảng đối chiếu Nền phát âm và HSK 1 với 贯通中文 quyển 1.
- Biên soạn và kiểm tra nội dung theo mục 11.6, gồm từ Hán Việt, so sánh ngữ pháp, bộ thủ, cặp thanh và cặp dễ nhầm của HSK 1; tạo âm thanh.
- Phác bố cục 13A–13D và 47.
- Lưu bảng ảnh theo quy ước ở mục 9.3.

### Giai đoạn B1 — Lõi học tập

- Các màn B1 ở mục 9.
- Nền phát âm, luyện thanh điệu và các bài HSK 1.
- Tận dụng tiếng Việt: từ Hán Việt và bẫy nghĩa, so sánh ngữ pháp, bộ thủ.
- Nhại theo và đóng vai.
- Ôn từ theo FSRS, ghi chú mẹo nhớ, chế độ 5 phút, sổ lỗi, kiểm tra cuối bài và cuối chủ đề.
- Luyện chữ 13A–13D, viết câu, ghi âm phát âm.
- Lưu trên máy, sao lưu bằng tệp, chạy ngoại tuyến.

### Giai đoạn B2 — Luyện thi và mở rộng

- Các màn B2: luyện dạng bài, thi thử HSK 1, kết quả, lời giải, kế hoạch sửa lỗi, lịch sử.
- Đường cao độ cho 09A, 12 và 47.
- Đọc mở rộng, sổ từ riêng, cặp dễ nhầm, bài luyện tự sinh.
- Luyện gõ và nghe chép.
- Tiến bộ học tập: lịch học, dự báo ôn, ước tính hoàn thành; chế độ nước rút.
- Bố cục máy tính (màn 37, 38 và mục 8.5).
- Đồng bộ qua Apps Script và nhắc học bằng email.

### Giai đoạn C — Mở rộng

- Hội thoại AI (mục 5.6) và nhận xét câu viết bằng AI.
- Nhận dạng giọng nói để phản hồi phát âm.
- Trợ giúp (màn 30) và từ điển Trung–Việt đầy đủ.
- HSK 2–3 rồi các cấp tiếp theo; HSK 7–9 và các hướng chuyên ngành.

Việc dựng giao diện không xác nhận một tính năng đã hoạt động.

## 14. Các điểm kiểm tra khi triển khai

- Phong cách giữ đúng nền giấy ngà, tranh mực và đỏ son ở điều khiển.
- Màu và độ tương phản theo mục 8.1; đúng/sai luôn có biểu tượng và chữ.
- Chữ Hán đúng tự dạng giản thể; Pinyin đủ dấu (mục 8.4).
- Phân biệt cấp HSK với phiên bản đề cương.
- Từ, chữ và ngữ pháp khớp Đề cương thi HSK (11/2025).
- Từ Hán Việt đã kiểm tra; bẫy nghĩa luôn có cảnh báo.
- Bài học có mục tiêu, nguồn tham khảo, nhiệm vụ vận dụng và kiểm tra cuối bài.
- Truyện đọc mở rộng đúng trình độ; bài tự sinh đọc đúng quy tắc ở mục 11.8.
- Tiến độ học tách khỏi kết quả luyện thi; từ riêng không tính vào tiến độ HSK.
- Thi thử theo đề mẫu HSK 3.0; kết quả không được gọi là điểm HSK.
- Đường cao độ không hiển thị như điểm số.
- Mẫu viết có thứ tự, hướng nét và điều khiển xem lại.
- Có cách ôn, sửa lỗi và học tiếp sau một hoạt động.
- Có phương án khi chưa bật micro hoặc máy không có giọng zh-CN.
- Dữ liệu học không mất khi đóng app, mất mạng hoặc đổi máy (qua sao lưu và đồng bộ).
- Dữ liệu minh họa trong bản vẽ được thay bằng nội dung đã kiểm tra.
- Repo không chứa khóa API, mã PIN, tệp `.env` hay tài liệu có bản quyền.

## 15. Nguồn tham khảo

Các nguồn được tra cứu ngày 17/10/2026 và 21/10/2026. Khi xây nội dung và lập kế hoạch thi, cần đối chiếu thông báo và tài liệu áp dụng tại thời điểm đó.

1. [Chinese Tests Service Website — HSK](https://www.chinesetest.cn/HSK) — đề cương, đề mẫu và thông báo chính thức.
2. [Đề cương thi HSK, 中外语言交流合作中心 (11/2025) — bản PDF](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf) — link lấy từ kết quả tìm kiếm, chưa mở được để kiểm tra nội dung.
3. [Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh — HSK标准教程](https://www.blcup.com/SeriesBook/index/8) — giới thiệu bộ Giáo trình chuẩn HSK.
4. [Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh — 贯通中文综合教程 课本1](https://www.blcup.com/PInfo/index/14364) — giáo trình tham khảo chính theo HSK 3.0.
5. [Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh — 汉语教程（第3版）1（上）](https://www.blcup.com/PInfo/index/8648) — giáo trình Hán ngữ nền tảng.
6. [Nhà xuất bản Đại học Ngôn ngữ Bắc Kinh — 发展汉语 中级综合（I）](https://www.blcup.com/PInfo/index/13395) — giáo trình kỹ năng bổ trợ; cần kiểm tra phiên bản.
7. [Bộ Giáo dục Trung Quốc — 国际中文教育中文水平等级标准](https://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/t20210329_523304.html) — khung năng lực nền.
8. [Viện Khổng Tử Đại học Sheffield — HSK](https://sheffield.ac.uk/confucius/proficiency-tests/hsk) — mốc HSK 3.0 ngày 13/12/2026.
9. [Báo Lào Cai — HSK 3.0 từ ngày 13/12](https://baolaocai.vn/tu-ngay-1312-to-chuc-ky-thi-nang-luc-tieng-trung-hsk-30-phien-ban-moi-nguoi-on-phien-ban-cu-can-lam-gi-post904790.html) — HSK 3.0 thay HSK 2.0.
10. [Wikipedia — 通用规范汉字笔顺规范 (GF 0023—2020)](https://en.wikipedia.org/wiki/Stroke_Orders_of_the_Commonly_Used_Standard_Chinese_Characters) — chuẩn thứ tự nét.
11. [Hanzi Writer](https://hanziwriter.org/) — thư viện hoạt họa và luyện viết nét chữ.
12. [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) — thư viện lịch ôn FSRS.
13. [pinyin-pro](https://github.com/zh-lx/pinyin-pro) — thư viện chuyển chữ Hán sang Pinyin, giấy phép MIT.
14. [CC-CEDICT](https://cc-cedict.org/wiki/) — từ điển Trung–Anh dùng để đối chiếu Pinyin.
15. [Unihan](https://www.unicode.org/charts/unihan.html) — cơ sở dữ liệu chữ Hán, có trường âm Hán Việt kVietnamese.
16. [MDN — Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — giọng máy trên trình duyệt.
17. [MDN — Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — xử lý âm thanh để dò cao độ.

## 16. Ghi chú bàn giao

- Đây là tài liệu đặc tả trước triển khai, không phải mã nguồn hay ứng dụng hoàn thiện.
- Giữ nguyên các quyết định đã chốt khi xây app. Điều chỉnh tiếp theo ghi rõ số màn hoặc mã trạng thái, tăng số phiên bản tài liệu và ghi vào Phụ lục A.
- Bảng ảnh có nhiều bản thì dùng bản có số phiên bản lớn nhất (mục 9.3).
- Mã màn 31–33 giữ trong danh mục ở trạng thái “Bỏ” để đối chiếu bảng ảnh; không dùng lại các mã này cho màn mới.

## Phụ lục A — Lịch sử thay đổi

### Bản 1.5 (21/10/2026)

- Ghi số liệu HSK 1 trích từ đề cương thi (mục 3.1): 300 từ, 246 chữ nhận biết, 100 chữ viết tay chung cho HSK 1–2, 70 điểm ngữ pháp.
- Chữ viết tay cấp 1–2: dạy viết trong HSK 1 các chữ thuộc chữ nhận biết HSK 1, các chữ còn lại trong HSK 2.
- Mã điểm ngữ pháp do Xinyu đặt vì đề cương không đánh mã; nơi lưu danh sách đề cương và script trích (mục 11.1).

### Bản 1.4 (21/10/2026)

- Tận dụng tiếng Việt: từ Hán Việt kèm cảnh báo bẫy nghĩa, so sánh ngữ pháp, bộ thủ theo tên Hán Việt (mục 5.5).
- Luyện thanh điệu với 20 cặp thanh (màn 47); đường cao độ chuyển từ giai đoạn C lên B2.
- Nhại theo (09A), đóng vai (09B) và nghe chép (45): luyện nói và nghe không cần AI.
- Công cụ biên soạn bằng Google Sheets, kèm kiểm tra tự động, đưa vào giai đoạn A (mục 12.8).
- Đọc mở rộng (48) và sổ từ riêng (49).
- Cặp dễ nhầm sinh từ sổ lỗi và bài luyện tự sinh (mục 5.9, 11.8).
- Chế độ “Chỉ có 5 phút”, lịch học, dự báo ôn, ước tính hoàn thành và chế độ nước rút (mục 5.10).
- Ghi chú mẹo nhớ trên từng từ và chữ.
- Mô hình dữ liệu, kiến trúc, luồng, danh mục màn và lộ trình triển khai cập nhật theo các tính năng trên.

### Bản 1.3 (21/10/2026)

- Chuyển sang app cá nhân một người dùng: bỏ tài khoản (màn 31–33) và bài kiểm tra đầu vào; dữ liệu lưu trên máy, có sao lưu và đồng bộ.
- Chỉ định văn bản gốc: Đề cương thi HSK (11/2025) cho danh sách từ, chữ và ngữ pháp; tách khỏi Chuẩn trình độ 2021 vì số liệu từng cấp khác nhau.
- Ghi mốc HSK 3.0 thay HSK 2.0 từ 13/12/2026; không làm chế độ HSK 2.0.
- Đổi giáo trình tham khảo chính sang 贯通中文综合教程; HSK标准教程 thành tài liệu phụ vì viết cho HSK 2.0.
- Thêm 5 màn (42–46) và các trạng thái 34B–34D; gắn giai đoạn triển khai cho từng màn.
- Thêm màu đúng/sai/cảnh báo; chỉnh đỏ son thành #AB483B để đạt độ tương phản trên nền kem.
- Thêm chuẩn dữ liệu nội dung (mục 11) và kiến trúc kỹ thuật (mục 12).
- Sửa các mâu thuẫn: giá trị chỉnh được trong app, thứ tự các bước khởi đầu, ranh giới Nền phát âm, cấu trúc buổi 15 và 45 phút, luồng 10.1, cách hiển thị kết quả thi thử.
- Bỏ tên tiếng Anh chưa xác minh của 贯通中文; ghi chú phiên bản 发展汉语 cần kiểm tra.

### Bản 1.2 (17/10/2026)

- Thống nhất tên hiển thị Xinyu — 新语 (Xīnyǔ).
