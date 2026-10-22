// Màn 12 — Luyện phát âm (bảng 04), hoạt động “Âm và thanh” của bài Nền phát âm: từng mục phát âm (thanh điệu, âm
// đầu, vần, quy tắc) với cách đọc, so sánh với tiếng Việt và lỗi hay mắc; chọn âm tiết hoặc từ ví dụ để nghe mẫu,
// ghi âm, nghe lại, nghe xen kẽ với mẫu rồi tự đánh giá. Không chấm điểm (mục 8.2). Tự đánh giá lưu vào lần làm
// (kho lanLam, loại phat-am) để sổ lỗi ở B1.5 dùng.
import { chuanBi, maAmTiet } from '../am-thanh.mjs';
import { bieuTuong, h, han } from '../giao-dien.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { luotBan } from './luot-ban.mjs';
import { congTacCham, nut } from './thanh-phan.mjs';
import { dauHoatDong, napHoatDong, nutNgheMau, theoMa, xongVaSang } from './trong-bai.mjs';

const LOAI = { 'thanh điệu': 'Thanh điệu', 'âm đầu': 'Âm đầu', vần: 'Vần', 'quy tắc': 'Quy tắc' };

// Ví dụ của một mục: âm tiết (âm thanh am-tiet) hoặc từ (âm thanh tu).
function viDuCua(muc, tuTheoMa) {
  if (muc.amTiet?.length) return muc.amTiet.map((a) => ({ nguon: { loai: 'amTiet', ma: maAmTiet(a) }, pinyin: a }));
  return (muc.viDu || [])
    .map((m) => tuTheoMa.get(m))
    .filter(Boolean)
    .map((t) => ({ nguon: { loai: 'tu', ma: t.ma }, pinyin: t.pinyin, han: t.tu, nghia: t.nghia }));
}

export default {
  tieuDe: 'Âm và thanh',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'phat-am');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const [dsMuc, tatCaTu] = await Promise.all([theoMa('phat-am', hd.bai.phatAm), napNoiDung('tu')]);
    const tuTheoMa = new Map(tatCaTu.map((t) => [t.ma, t]));
    const batDau = new Date().toISOString();
    const danhGia = new Map();
    const layCham = () => !!hoSo.ngheCham;
    let vt = 0;
    let dau = h('header');
    const vung = h('div', { class: 'hoat-dong' });

    function veMuc() {
      const muc = dsMuc[vt];
      const viDu = viDuCua(muc, tuTheoMa);
      for (const v of viDu) chuanBi(v.nguon.loai, v.nguon.ma).catch(() => {});
      let chon = 0;
      dau.replaceWith((dau = dauHoatDong({ di, hd, tienDo: [vt + 1, dsMuc.length] })));

      const mauLon = h('div', { class: 'mau-lon', 'aria-live': 'polite' });
      const nghe = nutNgheMau(() => viDu[chon].nguon, layCham);
      const luot = viDu.length ? luotBan({ muc: `${viDu[0].nguon.loai}/${viDu[0].nguon.ma}`, mau: viDu[0].nguon, layCham, hoSo, luuHoSo, toiDa: 6 }) : null;
      const chip = viDu.map((v, i) => h('button', { type: 'button', class: 'chip', 'aria-pressed': String(i === 0), onclick: () => chonViDu(i) }, v.han ? han(v.han) : v.pinyin));
      function veMau() {
        const v = viDu[chon];
        mauLon.replaceChildren(...(v.han ? [h('p', { class: 'han-lon' }, han(v.han)), h('p', { class: 'pinyin-lon' }, v.pinyin), h('p', { class: 'nghia' }, v.nghia)] : [h('p', { class: 'pinyin-lon chi-pinyin' }, v.pinyin)]));
      }
      function chonViDu(i) {
        chon = i;
        chip.forEach((c, j) => c.setAttribute('aria-pressed', String(i === j)));
        veMau();
        luot?.doiMuc(`${viDu[i].nguon.loai}/${viDu[i].nguon.ma}`, viDu[i].nguon);
        nghe.phat();
      }
      if (viDu.length) veMau();

      const tuDanhGia = h(
        'div',
        { class: 'tu-danh-gia', role: 'group', 'aria-label': 'Tự đánh giá' },
        h('p', {}, 'So với mẫu, bạn thấy:'),
        [
          ['khac', 'Còn khác mẫu'],
          ['giong', 'Đã giống mẫu'],
        ].map(([gt, nhan]) =>
          h('button', {
            type: 'button',
            class: 'chip rong',
            'aria-pressed': String(danhGia.get(muc.ma) === gt),
            onclick: (e) => {
              danhGia.set(muc.ma, gt);
              for (const b of tuDanhGia.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b === e.currentTarget));
            },
          }, nhan),
        ),
      );

      const cuoi = vt + 1 === dsMuc.length;
      vung.replaceChildren(
        ...[
          h('p', { class: 'nhan' }, `${LOAI[muc.loai] || muc.loai} · Nghe · Nhắc lại`),
          h('h1', { class: `ky-hieu${muc.kyHieu.length > 14 ? ' dai' : ''}` }, muc.kyHieu),
          h('p', { class: 'cach-doc' }, muc.cachDoc),
          viDu.length > 1 ? h('div', { class: 'chip-vi-du', role: 'group', 'aria-label': 'Ví dụ, chọn để nghe' }, chip) : null,
          viDu.length ? mauLon : null,
          viDu.length ? h('div', { class: 'hang-nghe' }, nghe, congTacCham(hoSo, luuHoSo)) : null,
          h(
            'dl',
            { class: 'meo' },
            muc.soSanh ? [h('dt', {}, 'So với tiếng Việt'), h('dd', {}, muc.soSanh)] : null,
            muc.loiHayMac ? [h('dt', { class: 'canh-bao' }, bieuTuong('canh-bao'), 'Lỗi hay mắc'), h('dd', {}, muc.loiHayMac)] : null,
          ),
          luot,
          viDu.length ? tuDanhGia : null,
          h(
            'div',
            { class: 'chan-co-dinh hai-nut' },
            vt ? nut('Mục trước', { rong: false, onclick: () => { vt--; veMuc(); } }) : null,
            nut(cuoi ? `Xong ${hd.d.ten.toLowerCase()}` : 'Tiếp tục', {
              chinh: true,
              mui: true,
              onclick: () => {
                if (!cuoi) {
                  vt++;
                  return veMuc();
                }
                const traLoi = [...danhGia].map(([m, gt]) => ({ muc: `phat-am/${m}`, tuDanhGia: gt, dung: gt === 'giong' }));
                xongVaSang({ di, hd, batDau, traLoi });
              },
            }),
          ),
        ].filter(Boolean),
      );
      window.scrollTo(0, 0);
    }

    veMuc();
    return [dau, vung];
  },
};
