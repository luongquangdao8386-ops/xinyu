// Khung chung của hoạt động trong bài (màn 09–12, 09A, 09B): nạp bài và hoạt động theo địa chỉ hoc/<mã bài>/<khóa>,
// đầu màn có tiến độ, câu ví dụ có nút nghe, câu hỏi chọn một đáp án, lưu lần làm, kết thúc hoạt động rồi sang hoạt
// động sau của bài (mục 10.2).
import { dung, phat } from '../am-thanh.mjs';
import { hoatDongCuaBai } from '../bai-hoc.mjs';
import { bieuTuong, h, han, tronChu } from '../giao-dien.mjs';
import { ghiLanLam, napLoTrinh, xongHoatDong } from '../hoc.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { duongHoatDong } from './bai.mjs';
import { dauLui, nutNghe } from './thanh-phan.mjs';

// { muc (bài trong lộ trình), bai (nội dung bài), hoatDong, d (hoạt động đang làm), sau (hoạt động kế) } hoặc null.
export async function napHoatDong(ma, khoa) {
  const [{ ds, noiDung }, cauHoi] = await Promise.all([napLoTrinh(), napNoiDung('cau-hoi')]);
  const bai = noiDung[ma];
  const hoatDong = bai ? hoatDongCuaBai(bai, cauHoi.filter((q) => q.bai === ma)) : [];
  const i = hoatDong.findIndex((d) => d.khoa === khoa);
  if (i < 0) return null;
  return { muc: ds.find((b) => b.ma === ma), bai, hoatDong, d: hoatDong[i], sau: hoatDong[i + 1] || null };
}

// Nạp các mục nội dung theo mã, giữ thứ tự của danh sách mã.
export async function theoMa(ten, dsMa = []) {
  const tatCa = await napNoiDung(ten);
  const bang = new Map(tatCa.map((x) => [x.ma, x]));
  return dsMa.map((m) => bang.get(m)).filter(Boolean);
}

export const tenBai = (muc) => `Bài ${String(muc.soThu).padStart(2, '0')}`;

// Đầu màn của hoạt động: lùi về chi tiết bài học; ten thay tên hoạt động (09A, 09B); tienDo [n, tổng] trong hoạt động.
export const dauHoatDong = ({ di, hd, ten, tienDo }) =>
  dauLui({
    lui: () => {
      dung();
      di(`bai/${hd.muc.ma}`);
    },
    nhanLui: 'Chi tiết bài học',
    tieuDe: `${tenBai(hd.muc)} / ${ten || hd.d.ten}`,
    tienDo,
  });

// Ghi hoạt động đã làm (và lần làm nếu có câu trả lời), rồi sang hoạt động sau của bài; hết thì về chi tiết bài học.
export async function xongVaSang({ di, hd, batDau, traLoi }) {
  dung();
  const { ma } = hd.muc;
  if (traLoi?.length) await ghiLanLam({ ma: `${ma}-${hd.d.khoa}-${Date.now()}`, loai: hd.d.khoa, bai: ma, batDau, xong: new Date().toISOString(), traLoi });
  await xongHoatDong(ma, hd.d.khoa);
  di(hd.sau ? duongHoatDong(ma, hd.sau.khoa) : `bai/${ma}`);
}

// Nút dạng viên “Nghe mẫu” (bảng 04): layNguon() trả về { loai, ma } đang chọn; bấm lần nữa thì dừng.
export function nutNgheMau(layNguon, layCham, nhan = 'Nghe mẫu') {
  const nut = h('button', { type: 'button', class: 'nut-nghe-mau', onclick: () => batTat() }, bieuTuong('loa'), h('span', {}, nhan));
  const dat = (dang) => nut.classList.toggle('dang', dang);
  async function batTat() {
    if (nut.classList.contains('dang')) return dung();
    const n = layNguon();
    dat(true);
    const co = await phat(n.loai, n.ma, { cham: layCham(), onXong: () => dat(false) }).catch(() => false);
    if (!co) dat(false);
  }
  nut.phat = batTat;
  return nut;
}

// Một câu: chữ Hán, nút nghe, Pinyin, nghĩa. an: { pinyin, nghia } ẩn từng dòng; vai: nhãn người nói.
export function dongCau(cau, { layCham, vai, an = {}, lop = '' } = {}) {
  return h(
    'div',
    { class: `dong-cau ${lop}`.trim(), 'data-ma': cau.ma },
    vai ? h('span', { class: 'vai', 'aria-label': `Người nói ${vai}` }, vai) : null,
    h('p', { class: 'cau-han' }, han(cau.chuHan)),
    nutNghe({ loai: 'cau', ma: cau.ma, nhan: `Nghe: ${cau.chuHan}`, layCham }),
    h('p', { class: 'cau-pinyin', hidden: !!an.pinyin }, cau.pinyin),
    h('p', { class: 'cau-nghia', hidden: !!an.nghia }, cau.nghia),
  );
}

// Câu hỏi chọn một đáp án (màn 09, 10, 11): ô đáp án và phản hồi ✓/✕ kèm chữ như màn 42.
// tuCham: chấm ngay khi chọn; không thì gọi cham() (nút Kiểm tra). ngang: đáp án ngắn xếp thành hàng (điền từ).
// onChon() khi chọn lần đầu; onCham({ chon, dung }) khi chấm.
export function cauChon({ ten, dapAn, dung: dapAnDung, loiGiai, tuCham = false, ngang = false, onChon, onCham }) {
  let chon = null;
  const phanHoi = h('div', { class: 'phan-hoi', role: 'status', 'aria-live': 'polite' });
  const nhom = h(
    'fieldset',
    { class: `dap-an${ngang ? ' ngang' : ''}` },
    h('legend', { class: 'an-chu' }, 'Chọn một đáp án'),
    dapAn.map((d) =>
      h(
        'label',
        { class: 'o-dap-an', 'data-dap-an': d },
        h('input', {
          type: 'radio',
          name: ten,
          value: d,
          onchange: () => {
            const dau = chon === null;
            chon = d;
            if (dau) onChon?.();
            if (tuCham) khung.cham();
          },
        }),
        h('span', { class: 'dau' }),
        h('span', { class: 'ten' }, tronChu(d)),
        h('span', { class: 'ket-qua' }),
      ),
    ),
  );
  const khung = h('div', { class: 'cau-chon' }, nhom, phanHoi);
  khung.cham = () => {
    if (chon === null || khung.daCham) return;
    khung.daCham = true;
    const dung_ = chon === dapAnDung;
    for (const o of nhom.querySelectorAll('.o-dap-an')) {
      o.querySelector('input').disabled = true;
      const d = o.dataset.dapAn;
      const kq = d === dapAnDung ? ['dung', 'Đáp án đúng'] : d === chon ? ['sai', 'Bạn chọn'] : null;
      if (!kq) continue;
      o.classList.add(kq[0]);
      o.querySelector('.ket-qua').replaceChildren(bieuTuong(kq[0]), kq[1]);
    }
    phanHoi.className = `phan-hoi ${dung_ ? 'dung' : 'sai'}`;
    phanHoi.replaceChildren(
      ...[
        h('p', { class: 'dong-dau' }, bieuTuong(dung_ ? 'dung' : 'sai'), h('b', {}, dung_ ? 'Đúng.' : 'Chưa đúng.'), dung_ ? null : h('span', {}, ' Đáp án: ', tronChu(dapAnDung))),
        loiGiai ? h('p', {}, tronChu(loiGiai)) : null,
      ].filter(Boolean),
    );
    onCham?.({ chon, dung: dung_ });
  };
  return khung;
}
