// Màn 05 — Hôm nay (bảng 02): bài tiếp theo theo tiến độ đã lưu, số phút đã học hôm nay so với thời lượng đã chọn,
// lối vào Ôn tập. Thẻ ôn đến hạn, Ôn thêm và Chỉ có 5 phút thêm ở B1.5; Luyện dạng bài HSK ở B2.1.
import { baiTiepTheo, nhanBai } from '../bai-hoc.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { phutHomNay } from '../gio-hoc.mjs';
import { napLoTrinh } from '../hoc.mjs';
import { dauApp, hang, nut } from './thanh-phan.mjs';

export default {
  tieuDe: 'Hôm nay',
  async ve({ hoSo, di }) {
    const [{ ds, tienDo }, daHoc] = await Promise.all([napLoTrinh(), phutHomNay()]);
    const bai = baiTiepTheo(ds, tienDo, hoSo.diemBatDau);
    const muc = hoSo.phutMoiNgay;
    return [
      dauApp(),
      h('div', { class: 'mo-dau rong' }, h('p', { class: 'loi-chao' }, 'Chào bạn,'), h('h1', {}, 'Học một chút.', h('br'), 'Tiến một bước.')),
      bai
        ? h(
            'section',
            { class: 'the the-bai' },
            h('div', { class: 'tranh-the', 'aria-hidden': 'true' }),
            h('p', { class: 'nhan' }, tienDo[bai.ma]?.batDau ? 'Đang học' : 'Bài học tiếp theo'),
            h('h2', {}, bai.chuDe),
            h('p', {}, nhanBai(bai)),
            h('div', { class: 'hang-nut' }, nut('Vào bài học', { chinh: true, mui: true, rong: false, onclick: () => di(`bai/${bai.ma}`) }), h('span', { class: 'thoi-gian' }, bieuTuong('dong-ho'), `${muc} phút`)),
          )
        : h('section', { class: 'the the-bai' }, h('p', { class: 'nhan' }, 'Lộ trình'), h('h2', {}, 'Đã học hết các bài hiện có'), h('p', {}, 'Bài mới sẽ hiện ở đây khi nội dung được soạn thêm.')),
      h(
        'section',
        { class: 'tien-do' },
        h('div', { class: 'dong' }, h('b', {}, 'Hôm nay'), h('span', { class: 'so' }, h('b', {}, daHoc), ` / ${muc} phút`)),
        h('div', { class: 'vach', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': muc, 'aria-valuenow': Math.min(daHoc, muc), 'aria-label': 'Số phút đã học hôm nay' }, h('span', { style: `width:${Math.min(1, daHoc / muc) * 100}%` })),
      ),
      h('ul', { class: 'ds-hang phang' }, hang({ bieuTuong: 'sach', ten: 'Ôn tập', giaTri: 'Chưa có từ đến hạn', onclick: () => di('on-tap') })),
    ];
  },
};
