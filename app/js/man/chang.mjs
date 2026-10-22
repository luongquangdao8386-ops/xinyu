// Màn 07 — Tổng quan chặng (bảng 03), dùng cho Nền phát âm và HSK 1: số bài đã học, các chủ đề kèm tiến độ và
// bài tiếp theo. Chặng nhiều chủ đề: bấm chủ đề để mở danh sách bài; chủ đề đang học mở sẵn. Chặng một chủ đề
// (Nền phát âm): hiện thẳng danh sách bài.
import { CHANG, baiTiepTheo, chuDeCuaChang, trangThaiBai } from '../bai-hoc.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { napLoTrinh } from '../hoc.mjs';
import { dauLui, nut, tranhGoc, vongSo } from './thanh-phan.mjs';

const TRANG_THAI_BAI = { xong: 'Đã học', dang: 'Đang học', chua: 'Chưa bắt đầu' };

function hangBai(b, tienDo, tiep, di) {
  const tt = trangThaiBai(b.ma, tienDo);
  const laTiep = b.ma === tiep?.ma;
  const phu = !b.coNoiDung ? 'Đang soạn nội dung' : laTiep && tt === 'chua' ? 'Bài tiếp theo' : TRANG_THAI_BAI[tt];
  return h(
    'li',
    { class: `${tt}${laTiep ? ' tiep' : ''}` },
    h(
      'button',
      { type: 'button', class: 'hang-lo-trinh', onclick: () => di(`bai/${b.ma}`) },
      vongSo(b.soThu, laTiep ? 'dang' : tt === 'xong' ? 'xong' : 'chua'),
      h('span', { class: 'chu' }, h('span', { class: 'ten' }, b.chuDe), h('span', { class: `gia-tri${laTiep || tt === 'dang' ? ' son' : ''}` }, phu)),
      laTiep ? null : h('span', { class: 'mo' }, bieuTuong('mo')),
    ),
    laTiep ? nutTiep(b, di) : null,
  );
}

// Nút Tiếp tục ở hàng đang học (bảng 03, màn 07).
const nutTiep = (b, di) => nut('Tiếp tục', { chinh: true, mui: true, rong: false, nho: true, onclick: () => di(`bai/${b.ma}`) });

export default {
  tieuDe: 'Tổng quan chặng',
  async ve({ hoSo, di, thamSo }) {
    const chang = CHANG.find((c) => c.duong === thamSo[0]);
    const { ds, tienDo } = await napLoTrinh();
    const baiChang = ds.filter((b) => b.chang === chang?.ten);
    if (!chang || !baiChang.length) {
      di('lo-trinh');
      return [];
    }
    const tiep = baiTiepTheo(ds, tienDo, hoSo.diemBatDau);
    const chuDe = chuDeCuaChang(ds, chang.ten, tienDo, tiep);
    const soXong = baiChang.filter((b) => tienDo[b.ma]?.xong).length;

    let danhSach;
    if (chuDe.length === 1) {
      danhSach = h('ol', { class: 'ds-lo-trinh' }, baiChang.map((b) => hangBai(b, tienDo, tiep, di)));
    } else {
      danhSach = h(
        'ol',
        { class: 'ds-lo-trinh' },
        chuDe.map((c, i) => {
          const coTiep = c.bai.some((b) => b.ma === tiep?.ma);
          const phu = c.trangThai === 'xong' ? `${c.bai.length} / ${c.bai.length} bài` : c.trangThai === 'dang' ? `Đang học · ${c.soXong} / ${c.bai.length} bài` : `Chưa bắt đầu · ${c.bai.length} bài`;
          const con = h('ol', { class: 'ds-lo-trinh con', hidden: !coTiep }, c.bai.map((b) => hangBai(b, tienDo, tiep, di)));
          const mo = h(
            'button',
            { type: 'button', class: 'hang-lo-trinh', 'aria-expanded': String(coTiep), onclick: () => { con.hidden = !con.hidden; mo.setAttribute('aria-expanded', String(!con.hidden)); } },
            vongSo(i + 1, c.trangThai),
            h('span', { class: 'chu' }, h('span', { class: 'ten' }, c.cum), h('span', { class: `gia-tri${c.trangThai === 'dang' ? ' son' : ''}` }, phu)),
            h('span', { class: 'mo xoay' }, bieuTuong('mo')),
          );
          return h('li', { class: `chu-de ${c.trangThai}${coTiep ? ' tiep' : ''}` }, mo, coTiep ? nutTiep(tiep, di) : null, con);
        }),
      );
    }

    return [
      tranhGoc(),
      dauLui({ lui: () => di('lo-trinh'), nhanLui: 'Lộ trình', tieuDe: chang.ten, phai: h('span', { class: 'the-nhan' }, 'HSK 3.0') }),
      h(
        'div',
        { class: 'mo-dau' },
        h('h1', {}, ...(chang.khauHieu || [chang.ten]).flatMap((d, i) => (i ? [h('br'), d] : [d]))),
        h('p', {}, `${soXong} / ${baiChang.length} bài đã hoàn thành`),
        h('div', { class: 'vach mong', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': baiChang.length, 'aria-valuenow': soXong, 'aria-label': 'Số bài đã hoàn thành' }, h('span', { style: `width:${(soXong / baiChang.length) * 100}%` })),
      ),
      h('section', { class: 'nhom' }, h('h2', {}, 'Nội dung học'), danhSach),
    ];
  },
};
