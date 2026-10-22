// Màn 05 — Hôm nay (bảng 02). Bản B1.1: bài tiếp theo và số phút đã học hôm nay; thẻ ôn, luyện dạng bài và chế độ
// 5 phút thêm ở B1.2, B1.5.
import { bieuTuong, h } from '../giao-dien.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { dauApp, nut } from './thanh-phan.mjs';

export default {
  tieuDe: 'Hôm nay',
  async ve({ hoSo, di }) {
    const loTrinh = await napNoiDung('lo-trinh');
    const cum = loTrinh.find((c) => c.bai.some((b) => b.ma === hoSo.diemBatDau)) || loTrinh[0];
    const bai = cum.bai.find((b) => b.ma === hoSo.diemBatDau) || cum.bai[0];
    const soBai = loTrinh.filter((c) => c.chang === cum.chang).flatMap((c) => c.bai).findIndex((b) => b.ma === bai.ma) + 1;
    const daHoc = 0;
    return [
      dauApp(),
      h('div', { class: 'mo-dau rong' }, h('p', { class: 'loi-chao' }, 'Chào bạn,'), h('h1', {}, 'Học một chút.', h('br'), 'Tiến một bước.')),
      h(
        'section',
        { class: 'the the-bai' },
        h('div', { class: 'tranh-the', 'aria-hidden': 'true' }),
        h('p', { class: 'nhan' }, 'Bài học tiếp theo'),
        h('h2', {}, bai.chuDe),
        h('p', {}, `${cum.chang} · Bài ${String(soBai).padStart(2, '0')}`),
        h('div', { class: 'hang-nut' }, nut('Vào bài học', { chinh: true, mui: true, rong: false, onclick: () => di(`bai/${bai.ma}`) }), h('span', { class: 'thoi-gian' }, bieuTuong('dong-ho'), `${hoSo.phutMoiNgay} phút`)),
      ),
      h(
        'section',
        { class: 'tien-do' },
        h('div', { class: 'dong' }, h('b', {}, 'Hôm nay'), h('span', { class: 'so' }, h('b', {}, daHoc), ` / ${hoSo.phutMoiNgay} phút`)),
        h('div', { class: 'vach', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': hoSo.phutMoiNgay, 'aria-valuenow': daHoc, 'aria-label': 'Số phút đã học hôm nay' }, h('span', { style: `width:${(daHoc / hoSo.phutMoiNgay) * 100}%` })),
      ),
      h('p', { class: 'phu nho' }, 'Từ đến hạn ôn và bài luyện dạng đề sẽ hiện ở đây khi bạn bắt đầu học.'),
    ];
  },
};
