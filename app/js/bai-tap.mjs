// Bài luyện trong bài học (màn 09, 10, 11, 09A, 09B) dựng từ nội dung đã kiểm tra, không sinh chữ mới: đáp án nhiễu
// lấy từ các từ, câu khác của cùng bài (thiếu thì lấy từ khác cùng cấp). Hàm thuần, không đụng giao diện, để kiểm
// thử bằng Node.

// Xáo trộn cố định theo hạt (số bất kỳ), cùng cách với xaoDapAn ở bai-hoc.mjs.
export function xao(ds, hat) {
  const kq = [...ds];
  let s = hat >>> 0 || 1;
  for (let i = kq.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [kq[i], kq[j]] = [kq[j], kq[i]];
  }
  return kq;
}

// Màn 10: chọn nghĩa của một từ. Đáp án: nghĩa đúng và tối đa soNhieu nghĩa khác, ưu tiên từ cùng bài rồi đến từ
// cùng cấp; bỏ nghĩa trùng. Trả về { dung, dapAn } (dapAn đã xáo).
export function cauChonNghia(tu, tuCungBai, tuCungCap, hat, soNhieu = 2) {
  const nhieu = [];
  for (const nguon of [xao(tuCungBai, hat), xao(tuCungCap, hat + 1)]) {
    for (const t of nguon) {
      if (nhieu.length >= soNhieu) break;
      if (t.ma !== tu.ma && t.nghia && t.nghia !== tu.nghia && !nhieu.includes(t.nghia)) nhieu.push(t.nghia);
    }
  }
  return { dung: tu.nghia, dapAn: xao([tu.nghia, ...nhieu], hat + 2) };
}

// Màn 09: kiểm tra hiểu hội thoại: nghe một câu, chọn nghĩa. Mỗi câu khác nhau (bỏ câu trùng chữ Hán) thành một câu
// hỏi, lấy tối đa soCau câu; đáp án nhiễu là nghĩa của câu khác trong hội thoại.
export function cauHieuHoiThoai(cauBai, hat, soCau = 3, soNhieu = 2) {
  const khac = [];
  for (const c of cauBai) if (c.nghia && !khac.some((k) => k.chuHan === c.chuHan || k.nghia === c.nghia)) khac.push(c);
  if (khac.length < 2) return [];
  return xao(khac, hat)
    .slice(0, soCau)
    .map((cau, i) => {
      const nhieu = xao(khac.filter((k) => k !== cau), hat + i + 1).slice(0, soNhieu).map((k) => k.nghia);
      return { cau, dung: cau.nghia, dapAn: xao([cau.nghia, ...nhieu], hat + i + 7) };
    });
}

// Màn 11: điền từ còn thiếu vào một câu ví dụ. Bỏ từ dài nhất của câu có mặt trong chữ Hán của câu; đáp án là từ đó
// và tối đa soNhieu từ khác (cùng bài trước, rồi cùng cấp). tuTheoMa: Map mã → từ. Trả về null khi câu không có từ
// nào tìm được trong chữ Hán. { truoc, sau, dung, dapAn }.
export function cauDienTu(cau, tuTheoMa, tuCungBai, tuCungCap, hat, soNhieu = 2) {
  const tu = (cau.tu || [])
    .map((m) => tuTheoMa.get(m))
    .filter((t) => t && cau.chuHan.includes(t.tu))
    .sort((a, b) => b.tu.length - a.tu.length)[0];
  if (!tu) return null;
  const vt = cau.chuHan.indexOf(tu.tu);
  const nhieu = [];
  for (const nguon of [xao(tuCungBai, hat), xao(tuCungCap, hat + 1)]) {
    for (const t of nguon) {
      if (nhieu.length >= soNhieu) break;
      if (t.tu !== tu.tu && !nhieu.includes(t.tu) && !cau.chuHan.includes(t.tu)) nhieu.push(t.tu);
    }
  }
  return { truoc: cau.chuHan.slice(0, vt), sau: cau.chuHan.slice(vt + tu.tu.length), dung: tu.tu, dapAn: xao([tu.tu, ...nhieu], hat + 2) };
}

// Màn 09B: các vai theo thứ tự xuất hiện trong hội thoại.
export const cacVai = (cauBai) => [...new Set(cauBai.map((c) => c.vai).filter(Boolean))];

// Màn 09B: chuỗi phát lại cả đoạn sau khi đóng vai: câu của vai mình dùng bản ghi (chưa ghi thì dùng mẫu), câu của
// vai khác dùng mẫu. banGhi: Map mã câu → Blob.
export const chuoiDongVai = (cauBai, vai, banGhi) =>
  cauBai.map((c) => (c.vai === vai && banGhi.get(c.ma) ? { blob: banGhi.get(c.ma) } : { loai: 'cau', ma: c.ma }));

// Màn 09A: các mức hiện chữ khi nhại theo (mục 5.7): hiện chữ Hán và Pinyin → chỉ chữ Hán → không hiện chữ.
export const MUC_CHU = [
  { khoa: 'du', ten: 'Hán + Pinyin' },
  { khoa: 'han', ten: 'Chỉ chữ Hán' },
  { khoa: 'an', ten: 'Ẩn chữ' },
];

// Màn 11: tên điểm ngữ pháp là phần đầu của lời giải thích trước dấu hai chấm (quy ước khi soạn), ví dụ
// “Câu không chủ vị (非主谓句): …”; không có thì null. Trả về { ten, giaiThich } (giaiThich bỏ phần tên, viết hoa chữ
// đầu).
export function tachTenNguPhap(giaiThich = '') {
  const m = /^([^:：.。]{3,70})[:：]\s*/.exec(giaiThich);
  const conLai = m ? giaiThich.slice(m[0].length) : giaiThich;
  return { ten: m ? m[1].trim() : null, giaiThich: m ? conLai.charAt(0).toUpperCase() + conLai.slice(1) : giaiThich };
}

// Loại từ ghi trong đề cương (chữ Hán viết tắt, ví dụ 动、名 hoặc 数量、（副）) sang tiếng Việt; loại trong ngoặc
// giữ ngoặc.
const TU_LOAI = { 名: 'danh từ', 动: 'động từ', 形: 'tính từ', 代: 'đại từ', 副: 'phó từ', 数: 'số từ', 量: 'lượng từ', 介: 'giới từ', 连: 'liên từ', 助: 'trợ từ', 叹: 'thán từ', 拟声: 'từ tượng thanh', 助动: 'động từ năng nguyện', 数量: 'số lượng từ', 前缀: 'tiền tố', 后缀: 'hậu tố' };
export const tenTuLoai = (tuLoai) =>
  (tuLoai || '')
    .split(/[、,，/\s]+/)
    .filter(Boolean)
    .map((l) => {
      const ngoac = /^[（(](.+)[）)]$/.exec(l);
      return ngoac ? `(${TU_LOAI[ngoac[1]] || ngoac[1]})` : TU_LOAI[l] || l;
    })
    .join(', ');
