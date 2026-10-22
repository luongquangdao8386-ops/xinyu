// Ôn tập (màn 16). Bản B1.2 chỉ có trạng thái 34A — Chưa có bài ôn (bảng 12): thẻ ôn và lịch ôn FSRS thêm ở B1.5,
// tạo từ các bài đã học.
import { baiTiepTheo } from '../bai-hoc.mjs';
import { h } from '../giao-dien.mjs';
import { napLoTrinh } from '../hoc.mjs';
import { dauApp, nut } from './thanh-phan.mjs';

export default {
  tieuDe: 'Ôn tập',
  async ve({ hoSo, di }) {
    const { ds, tienDo } = await napLoTrinh();
    const tiep = baiTiepTheo(ds, tienDo, hoSo.diemBatDau);
    const daHoc = ds.some((b) => tienDo[b.ma]?.xong);
    return [
      dauApp(),
      h('h1', {}, 'Ôn tập'),
      h('div', { class: 'tranh-lon tranh-trong', 'aria-hidden': 'true' }),
      h(
        'section',
        { class: 'trang-trong' },
        daHoc ? h('h2', {}, 'Chưa có từ', h('br'), 'đến hạn ôn.') : h('h2', {}, 'Bắt đầu từ', h('br'), 'bài học đầu tiên.'),
        h('p', {}, daHoc ? 'Từ và âm đã học sẽ xuất hiện ở đây khi đến lịch ôn.' : 'Từ đã học sẽ xuất hiện ở đây khi đến lịch ôn.'),
        daHoc ? h('p', { class: 'phu nho' }, 'Lịch ôn cho các bài đã học có từ việc B1.5.') : null,
      ),
      h(
        'div',
        { class: 'nhom-nut' },
        tiep ? nut('Khám phá bài học', { chinh: true, mui: true, onclick: () => di(`bai/${tiep.ma}`) }) : null,
        nut('Xem lộ trình', { onclick: () => di('lo-trinh') }),
      ),
    ];
  },
};
