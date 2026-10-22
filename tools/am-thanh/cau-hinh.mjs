// Cấu hình tạo âm thanh mẫu bằng tools/tao-am-thanh.mjs (mục 12.3 của đặc tả).

// Giọng máy Google Cloud Text-to-Speech. Giọng đầu đọc âm tiết, từ và câu không có vai; câu hội thoại: vai xuất
// hiện trước trong mỗi bài đọc giọng đầu, vai sau đọc giọng thứ hai… Đổi giọng thì các tệp của giọng đó được tạo lại.
// Chọn 22/10/2026 theo phép đo thanh điệu tự động: khi đọc riêng 173 âm tiết ví dụ của Nền phát âm, các giọng
// Wavenet đều đúng thanh cả 173, các giọng Chirp 3 HD chỉ đúng 158–168 (thanh 1 lượn, thanh 4 không rơi…);
// Chirp 3 HD còn cho kết quả khác nhau mỗi lần gọi. A là giọng nữ, C là giọng nam.
export const GIONG = ['cmn-CN-Wavenet-A', 'cmn-CN-Wavenet-C'];

// Cách đọc riêng khi cách dựng mặc định chưa ổn (giọng máy đọc sai một chữ đa âm…): khóa là mã từ, mã câu hoặc
// tên tệp âm tiết (ví dụ huan2); giá trị { ssml: nội dung đặt trong thẻ speak, lyDo }. Ép một âm tiết bằng
// <phoneme alphabet="pinyin" ph="hai2">还</phoneme> (Pinyin số, ü viết v, thanh nhẹ là 5).
export const DOC_RIENG = {};
