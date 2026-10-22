// Màn 10 — Học từ mới (bảng 04), hoạt động “Từ vựng”: từng từ của bài với chữ Hán, Pinyin, nghĩa, loại từ, âm thanh
// (nghe chậm được), từ Hán Việt kèm cảnh báo bẫy nghĩa, âm Hán Việt từng chữ (khi content/chu.json có), câu ví dụ,
// mẹo nhớ của riêng mình (kho ghiChu), lưu vào sổ từ (kho tuDaLuu) và câu chọn nghĩa chấm ngay (mục 5.4, 5.5).
import { chuanBi } from '../am-thanh.mjs';
import { cauChonNghia, tenTuLoai } from '../bai-tap.mjs';
import { bieuTuong, h, han } from '../giao-dien.mjs';
import { doc, ghi, xoa } from '../kho.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { congTacCham, nut } from './thanh-phan.mjs';
import { cauChon, dauHoatDong, dongCau, napHoatDong, nutNgheMau, theoMa, xongVaSang } from './trong-bai.mjs';

// Ô mẹo nhớ: lưu sau khi ngừng gõ; xóa hết chữ thì xóa ghi chú.
function oGhiChu(doiTuong, tu) {
  const trangThai = h('span', { class: 'phu nho', role: 'status' });
  let hen = null;
  const luu = async () => {
    clearTimeout(hen);
    const noiDung = o.value.trim();
    if (noiDung) await ghi('ghiChu', { doiTuong, noiDung });
    else await xoa('ghiChu', doiTuong);
    trangThai.textContent = noiDung ? 'Đã lưu trên máy' : '';
  };
  const o = h('textarea', {
    id: 'ghi-chu',
    rows: 2,
    placeholder: `Cách bạn nhớ ${tu}…`,
    oninput: () => {
      trangThai.textContent = '';
      clearTimeout(hen);
      hen = setTimeout(luu, 700);
    },
    onblur: luu,
  });
  doc('ghiChu', doiTuong).then((g) => g && (o.value = g.noiDung)).catch(() => {});
  return h('div', { class: 'o-ghi-chu' }, h('label', { for: 'ghi-chu' }, bieuTuong('ghi-chu'), 'Mẹo nhớ của bạn'), o, trangThai);
}

// Hàng “Lưu vào sổ từ”: bấm để lưu hoặc bỏ lưu.
function hangLuuTu(ma) {
  const ten = h('span', { class: 'ten' }, 'Lưu vào sổ từ');
  const giaTri = h('span', { class: 'gia-tri' }, 'Xem lại ở Thư viện');
  const nutLuu = h('button', { type: 'button', class: 'hang hang-luu', 'aria-pressed': 'false', onclick: () => doi() }, h('span', { class: 'tron' }, bieuTuong('danh-dau')), h('span', { class: 'chu' }, ten, giaTri), h('span'));
  const dat = (da) => {
    nutLuu.setAttribute('aria-pressed', String(da));
    ten.textContent = da ? 'Đã lưu vào sổ từ' : 'Lưu vào sổ từ';
  };
  async function doi() {
    const da = nutLuu.getAttribute('aria-pressed') === 'true';
    if (da) await xoa('tuDaLuu', ma);
    else await ghi('tuDaLuu', { ma, ngay: new Date().toISOString() });
    dat(!da);
  }
  doc('tuDaLuu', ma).then((t) => dat(!!t)).catch(() => {});
  return nutLuu;
}

export default {
  tieuDe: 'Từ vựng',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'tu-vung');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const [dsTu, tatCaTu, tatCaCau, tatCaChu] = await Promise.all([theoMa('tu', hd.bai.tu), napNoiDung('tu'), napNoiDung('cau'), napNoiDung('chu')]);
    const cauTheoMa = new Map(tatCaCau.map((c) => [c.ma, c]));
    const chuTheoChu = new Map(tatCaChu.map((c) => [c.chu, c]));
    const batDau = new Date().toISOString();
    const hat = Date.now();
    const traLoi = new Map();
    const layCham = () => !!hoSo.ngheCham;
    for (const t of dsTu) chuanBi('tu', t.ma).catch(() => {});
    let vt = 0;
    let dau = h('header');
    const vung = h('div', { class: 'hoat-dong' });

    function veTu() {
      const tu = dsTu[vt];
      dau.replaceWith((dau = dauHoatDong({ di, hd, tienDo: [vt + 1, dsTu.length] })));
      const amHanViet = [...tu.tu].map((c) => chuTheoChu.get(c)).filter((c) => c?.amHanViet);
      const hanViet = tu.hanViet
        ? tu.loaiHanViet === 'bẫy nghĩa'
          ? h('p', { class: 'the the-canh-bao bay-nghia' }, bieuTuong('canh-bao'), h('span', {}, h('b', {}, 'Bẫy nghĩa. '), 'Từ Hán Việt “', tu.hanViet, '” nhưng ', han(tu.tu), ' nghĩa là “', tu.nghia, '”.'))
          : h('p', { class: 'han-viet' }, 'Từ Hán Việt: ', h('b', {}, tu.hanViet), tu.loaiHanViet ? ` (${tu.loaiHanViet})` : '')
        : null;
      const cau = cauChonNghia(tu, dsTu, tatCaTu.filter((t) => t.cap === tu.cap), hat + vt);
      const cuoi = vt + 1 === dsTu.length;

      vung.replaceChildren(
        ...[
          h('p', { class: 'nhan' }, 'Từ trong ngữ cảnh'),
          h(
            'div',
            { class: 'tu-lon' },
            h('h1', { class: 'han-lon' }, han(tu.tu)),
            h('p', { class: 'pinyin-lon' }, tu.pinyin),
            h('p', { class: 'nghia' }, tu.nghia),
            tu.tuLoai ? h('p', { class: 'phu nho' }, tenTuLoai(tu.tuLoai)) : null,
          ),
          h('div', { class: 'hang-nghe' }, nutNgheMau(() => ({ loai: 'tu', ma: tu.ma }), layCham), congTacCham(hoSo, luuHoSo)),
          hanViet,
          amHanViet.length ? h('p', { class: 'han-viet' }, 'Âm Hán Việt: ', amHanViet.map((c, i) => [i ? ' · ' : '', han(c.chu), ' ', c.amHanViet])) : null,
          tu.cauViDu?.length
            ? h('section', { class: 'nhom vi-du' }, h('h2', {}, 'Ví dụ'), (tu.cauViDu || []).map((m) => cauTheoMa.get(m)).filter(Boolean).map((c) => dongCau(c, { layCham })))
            : null,
          hangLuuTu(tu.ma),
          oGhiChu(`tu/${tu.ma}`, tu.tu),
          cau.dapAn.length > 1
            ? h(
                'section',
                { class: 'nhom luyen-nhanh' },
                h('h2', {}, 'Chọn nghĩa của ', han(tu.tu)),
                cauChon({ ten: `nghia-${tu.ma}`, dapAn: cau.dapAn, dung: cau.dung, tuCham: true, onCham: ({ chon, dung }) => traLoi.set(tu.ma, { muc: `tu/${tu.ma}`, dang: 'chon-nghia', chon, dung }) }),
              )
            : null,
          h(
            'div',
            { class: 'chan-co-dinh hai-nut' },
            vt ? nut('Từ trước', { rong: false, onclick: () => { vt--; veTu(); } }) : null,
            nut(cuoi ? 'Xong từ vựng' : 'Tiếp tục', {
              chinh: true,
              mui: true,
              onclick: () => {
                if (!cuoi) {
                  vt++;
                  return veTu();
                }
                xongVaSang({ di, hd, batDau, traLoi: [...traLoi.values()] });
              },
            }),
          ),
        ].filter(Boolean),
      );
      window.scrollTo(0, 0);
    }

    veTu();
    return [dau, vung];
  },
};
