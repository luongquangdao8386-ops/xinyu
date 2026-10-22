// Kế hoạch cá nhân (màn 04, mục 4.2, 5.2): bài còn lại đến hết cấp mục tiêu, ngày dự kiến học xong và so với
// ngày thi. Hàm thuần, không đụng giao diện, để kiểm thử bằng Node.

// Khoảng thời gian cho mỗi bài, gồm cả ôn tập: khung 12 tuần ở mục 4.3 là 56 bài trong 84 ngày, mỗi ngày
// 30 phút. Từ giai đoạn B2, ước tính hoàn thành tính theo tốc độ học thật (mục 5.10).
export const PHUT_MOI_BAI = 45;
export const THOI_LUONG = [15, 30, 45];

// Cấu trúc buổi học theo thời lượng (mục 5.2).
export const BUOI_HOC = {
  15: [
    [5, 'Ôn từ, mẫu câu và lỗi đến hạn'],
    [5, 'Học mới: nghe hoặc đọc tình huống ngắn, từ và mẫu câu trọng tâm'],
    [5, 'Luyện có hướng dẫn'],
  ],
  30: [
    [5, 'Ôn từ, mẫu câu và lỗi đến hạn'],
    [5, 'Nghe hoặc đọc một tình huống ngắn'],
    [5, 'Học từ, cụm từ và mẫu câu trọng tâm'],
    [5, 'Luyện có hướng dẫn, gồm cả dạng câu hỏi thi liên quan'],
    [10, 'Vận dụng bằng nói hoặc viết, xem phản hồi và sửa lại'],
  ],
  45: [
    [8, 'Ôn từ, mẫu câu và lỗi đến hạn'],
    [7, 'Nghe hoặc đọc một tình huống ngắn'],
    [7, 'Học từ, cụm từ và mẫu câu trọng tâm'],
    [8, 'Luyện có hướng dẫn'],
    [5, 'Dạng câu hỏi thi liên quan'],
    [10, 'Vận dụng bằng nói hoặc viết, xem phản hồi và sửa lại'],
  ],
};

// Số cấp của một chặng: Nền phát âm là 0, "HSK 1" là 1…
export const capCuaChang = (chang) => (chang === 'Nền phát âm' ? 0 : parseInt(chang.replace(/\D+/, ''), 10) || 99);

// Các bài theo thứ tự lộ trình (content/lo-trinh.json), đến hết cấp mục tiêu.
export const baiDenCap = (loTrinh, cap) => loTrinh.filter((c) => capCuaChang(c.chang) <= cap).flatMap((c) => c.bai.map((b) => ({ ...b, chang: c.chang, cum: c.cum })));

// Các cấp chọn được ở màn 02: cấp đã có bài trong lộ trình (bản đầu: HSK 1).
export const capCoNoiDung = (loTrinh) => [...new Set(loTrinh.map((c) => capCuaChang(c.chang)).filter((c) => c > 0))];

const ngayUtc = (ngay) => Date.UTC(+ngay.slice(0, 4), +ngay.slice(5, 7) - 1, +ngay.slice(8, 10));
export const cachNgay = (tu, den) => Math.round((ngayUtc(den) - ngayUtc(tu)) / 86400000);
export function congNgay(ngay, soNgay) {
  const d = new Date(ngayUtc(ngay) + soNgay * 86400000);
  return d.toISOString().slice(0, 10);
}

// Ước tính nếu học mỗi ngày: { soBai, soNgay, ngayXong, ngayThi?, conNgay?, kip?, phutCan? }.
// phutCan: thời lượng nhỏ nhất trong 15/30/45 đủ học hết trước ngày thi; null khi cả 45 phút cũng không kịp.
export function uocTinh({ soBai, phutMoiNgay, homNay, ngayThi }) {
  const soNgayCan = (phut) => Math.ceil((soBai * PHUT_MOI_BAI) / phut);
  const soNgay = soNgayCan(phutMoiNgay);
  const kq = { soBai, soNgay, ngayXong: congNgay(homNay, soNgay) };
  if (ngayThi) {
    kq.ngayThi = ngayThi;
    kq.conNgay = cachNgay(homNay, ngayThi);
    kq.kip = soNgay <= kq.conNgay;
    kq.phutCan = THOI_LUONG.find((p) => soNgayCan(p) <= kq.conNgay) ?? null;
  }
  return kq;
}
