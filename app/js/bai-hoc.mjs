// Lộ trình và bài học (mục 4.1, 5.2, 5.3; màn 05–08, 39, 42): danh sách bài theo thứ tự, bài tiếp theo, trạng thái
// bài, chủ đề, chặng và các hoạt động của một bài. Hàm thuần, không đụng giao diện, để kiểm thử bằng Node.
// tienDo: { [mã bài]: { batDau, xong, hoatDong: { [khóa]: thời điểm } } } (kho tienDo trong IndexedDB).

// Các chặng trên màn 06 (mục 4.1). Chặng chưa có bài trong content/lo-trinh.json hiện khóa, “Chưa có nội dung”.
export const CHANG = [
  { ten: 'Nền phát âm', duong: 'nen-phat-am', moTa: 'Phát âm · Thanh điệu · Quy tắc cơ bản', khauHieu: ['Nghe đúng,', 'đọc chuẩn.'] },
  { ten: 'HSK 1', duong: 'hsk-1', moTa: 'Chào hỏi · Giới thiệu · Sinh hoạt', khauHieu: ['Xây nền', 'vững chắc.'] },
  { ten: 'HSK 2', duong: 'hsk-2', moTa: 'Cuộc sống hằng ngày · Mua sắm' },
  { ten: 'HSK 3', duong: 'hsk-3', moTa: 'Học tập · Công việc · Giao tiếp xã hội' },
  { ten: 'HSK 4', duong: 'hsk-4', moTa: 'Chủ đề mở rộng · Lập luận · Diễn đạt' },
  { ten: 'HSK 5', duong: 'hsk-5', moTa: 'Đọc hiểu nâng cao · Biểu đạt phức tạp' },
  { ten: 'HSK 6', duong: 'hsk-6', moTa: 'Ngôn ngữ học thuật · Văn hóa · Xã hội' },
  { ten: 'HSK 7–9 & chuyên ngành', duong: 'hsk-7-9', moTa: 'Tiếng Trung chuyên sâu · Học thuật · Nghề nghiệp' },
];

// Mọi bài theo thứ tự lộ trình: { ma, chuDe, mucTieu, chang, cum, soThu (số bài trong chặng), coNoiDung }.
// coNoiDung: bài đã có trong content/bai.json (đã soạn và kiểm tra).
export function danhSachBai(loTrinh, baiNoiDung) {
  const co = new Set(baiNoiDung.map((b) => b.ma));
  const dem = {};
  return loTrinh.flatMap((c) => c.bai.map((b) => ({ ...b, chang: c.chang, cum: c.cum, soThu: (dem[c.chang] = (dem[c.chang] || 0) + 1), coNoiDung: co.has(b.ma) })));
}

export const nhanBai = (b) => `${b.chang} · Bài ${String(b.soThu).padStart(2, '0')}`;

export function trangThaiBai(ma, tienDo) {
  const td = tienDo[ma];
  return td?.xong ? 'xong' : td?.batDau ? 'dang' : 'chua';
}

// Bài tiếp theo: bài đầu tiên chưa xong tính từ điểm bắt đầu; hết thì tìm từ đầu lộ trình; null khi đã học hết.
export function baiTiepTheo(ds, tienDo, diemBatDau) {
  const tu = Math.max(0, ds.findIndex((b) => b.ma === diemBatDau));
  const chuaXong = (b) => !tienDo[b.ma]?.xong;
  return ds.slice(tu).find(chuaXong) || ds.slice(0, tu).find(chuaXong) || null;
}

// Bài sau một bài trong lộ trình (màn 39: Sang bài tiếp theo); null khi là bài cuối.
export const baiSau = (ds, ma) => ds[ds.findIndex((b) => b.ma === ma) + 1] || null;

// Các chủ đề (cụm) của một chặng kèm số bài đã xong; trangThai: xong, dang (có bài tiếp theo hoặc bài đang học), chua.
export function chuDeCuaChang(ds, chang, tienDo, tiepTheo) {
  const nhom = [];
  for (const b of ds.filter((x) => x.chang === chang)) {
    let n = nhom.at(-1);
    if (n?.cum !== b.cum) nhom.push((n = { cum: b.cum, bai: [] }));
    n.bai.push(b);
  }
  return nhom.map((n) => {
    const soXong = n.bai.filter((b) => tienDo[b.ma]?.xong).length;
    const dang = n.bai.some((b) => b.ma === tiepTheo?.ma || trangThaiBai(b.ma, tienDo) === 'dang');
    return { ...n, soXong, trangThai: soXong === n.bai.length ? 'xong' : dang ? 'dang' : 'chua' };
  });
}

// Trạng thái từng chặng trên màn 06: khoa (chưa có bài), xong, dang (chứa bài tiếp theo), chua.
export function trangThaiChang(ds, tienDo, tiepTheo) {
  return CHANG.map((c) => {
    const bai = ds.filter((b) => b.chang === c.ten);
    const soXong = bai.filter((b) => tienDo[b.ma]?.xong).length;
    const trangThai = !bai.length ? 'khoa' : soXong === bai.length ? 'xong' : tiepTheo?.chang === c.ten ? 'dang' : 'chua';
    return { ...c, soBai: bai.length, soXong, trangThai };
  });
}

// Hoạt động của một bài theo chu trình ở mục 5.3, suy ra từ nội dung bài. man: mã màn (mục 9.1); viec: việc trong
// docs/tien-do.md sẽ dựng màn đó (null là đã có). PA06 ghi “(47)” ở cột Hoạt động nên có thêm Luyện thanh điệu.
// Nói gồm nhại theo (09A) rồi đóng vai (09B).
const HOAT_DONG = [
  { khoa: 'phat-am', ten: 'Âm và thanh', bieuTuong: 'loa', man: '12', viec: null, co: (b) => b.phatAm?.length, moTa: (b) => `${b.phatAm.length} mục · Nghe mẫu · Đọc theo` },
  { khoa: 'cap-thanh', ten: 'Luyện thanh điệu', bieuTuong: 'song-am', man: '47', viec: 'B1.6', co: (b) => /\(47\)/.test(b.hoatDong || ''), moTa: () => '20 cặp thanh · Nghe · Đọc liền' },
  { khoa: 'nghe-doc', ten: 'Nghe & đọc', bieuTuong: 'tai-nghe', man: '09', viec: null, co: (b) => b.cau?.length, moTa: () => 'Hội thoại · Hiểu nội dung' },
  { khoa: 'tu-vung', ten: 'Từ vựng', bieuTuong: 'sach', man: '10', viec: null, co: (b) => b.tu?.length, moTa: (b) => `${b.tu.length} từ · Nghĩa · Cách dùng` },
  { khoa: 'mau-cau', ten: 'Mẫu câu', bieuTuong: 'loi-thoai', man: '11', viec: null, co: (b) => b.nguPhap?.length, moTa: () => 'Cấu trúc · So với tiếng Việt' },
  { khoa: 'chu-han', ten: 'Chữ Hán', bieuTuong: 'but', man: '13', viec: 'B1.4', co: (b) => b.chu?.length, moTa: (b) => `${b.chu.length} chữ · Thứ tự nét` },
  { khoa: 'noi', ten: 'Nói', bieuTuong: 'mic', man: '09A', viec: null, co: (b) => b.cau?.length, moTa: () => 'Nhại theo · Đóng vai' },
  { khoa: 'kiem-tra', ten: 'Kiểm tra mục tiêu bài', bieuTuong: 'muc-tieu', man: '42', viec: null, co: (b, ch) => ch.length, moTa: (b, ch) => `${ch.length} câu · ${[...new Set(ch.map((q) => q.kyNang))].join(', ')}` },
];

// [{ khoa, ten, bieuTuong, man, viec, moTa }] theo thứ tự học; cauHoi: câu hỏi của bài (content/cau-hoi.json).
export const hoatDongCuaBai = (bai, cauHoi) =>
  HOAT_DONG.filter((d) => d.co(bai, cauHoi)).map(({ co, moTa, ...d }) => ({ ...d, moTa: moTa(bai, cauHoi) }));

// Hoạt động nên làm tiếp: hoạt động đầu tiên chưa làm; làm hết thì null.
export const hoatDongTiep = (ds, td) => ds.find((d) => !td?.hoatDong?.[d.khoa]) || null;

// Cột Tiêu chí, Lỗi thường gặp…: các ý cách nhau bằng dấu chấm phẩy thành danh sách, viết hoa chữ đầu.
export const tachY = (chuoi) =>
  (chuoi || '')
    .split(';')
    .map((y) => y.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map((y) => y[0].toUpperCase() + y.slice(1));

// Đáp án của một câu hỏi trắc nghiệm theo thứ tự xáo trộn cố định cho mỗi lần làm (hạt: số bất kỳ).
export function xaoDapAn(cau, hat) {
  const ds = [cau.dapAnDung, ...cau.dapAnSai.map((d) => d.dapAn)];
  let s = (hat ^ [...cau.ma].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)) >>> 0 || 1;
  for (let i = ds.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [ds[i], ds[j]] = [ds[j], ds[i]];
  }
  return ds;
}
