// Màn 06 — Lộ trình HSK (bảng 02): các chặng từ Nền phát âm đến HSK 7–9. Chặng đang học có nút Tiếp tục vào bài
// tiếp theo; chặng chưa có bài trong lộ trình bị khóa, ghi “Chưa có nội dung” (mục 4.1).
import { baiTiepTheo, trangThaiChang } from '../bai-hoc.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { napLoTrinh } from '../hoc.mjs';
import { dauApp, nut, tranhGoc, vongSo } from './thanh-phan.mjs';

const MO_TA = { xong: 'Đã học xong', dang: 'Đang học', chua: '', khoa: 'Chưa có nội dung' };

export default {
  tieuDe: 'Lộ trình',
  async ve({ hoSo, di }) {
    const { ds, tienDo } = await napLoTrinh();
    const tiep = baiTiepTheo(ds, tienDo, hoSo.diemBatDau);
    return [
      tranhGoc(),
      dauApp(),
      h('div', { class: 'mo-dau' }, h('p', { class: 'nhan' }, 'HSK 3.0'), h('h1', {}, 'Từng cấp độ,', h('br'), 'một hành trình.')),
      h(
        'ol',
        { class: 'duong-chang' },
        trangThaiChang(ds, tienDo, tiep).map((c, i) => {
          const mo = c.trangThai !== 'khoa' ? () => di(`chang/${c.duong}`) : null;
          const so = c.trangThai === 'khoa' ? MO_TA.khoa : c.soXong ? `${c.soXong} / ${c.soBai} bài đã học` : `${c.soBai} bài`;
          return h(
            'li',
            { class: c.trangThai },
            vongSo(i + 1, c.trangThai === 'khoa' ? 'chua' : c.trangThai),
            h(
              mo ? 'button' : 'div',
              { class: 'than', type: mo ? 'button' : null, onclick: mo },
              h('span', { class: 'ten' }, c.ten),
              h('span', { class: 'gia-tri' }, c.moTa),
              h('span', { class: 'gia-tri so' }, so),
              mo ? h('span', { class: 'mo' }, bieuTuong('mo')) : h('span', { class: 'mo', title: MO_TA.khoa }, bieuTuong('khoa')),
            ),
            c.trangThai === 'dang' && tiep
              ? h('div', { class: 'hang-tiep' }, h('span', { class: 'nhan-dang' }, MO_TA.dang), nut('Tiếp tục', { chinh: true, mui: true, rong: false, nho: true, onclick: () => di(`bai/${tiep.ma}`) }))
              : null,
          );
        }),
      ),
    ];
  },
};
