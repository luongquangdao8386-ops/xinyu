// Màn 05 — Hôm nay. Bản B1.1 chỉ có bài tiếp theo và thời lượng; buổi học, thẻ ôn và chế độ 5 phút làm ở B1.2, B1.5.
import { h, ngayHomNay, vietNgay } from '../giao-dien.mjs';
import { napNoiDung } from '../noi-dung.mjs';

const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

export default {
  tieuDe: 'Hôm nay',
  async ve({ hoSo }) {
    const loTrinh = await napNoiDung('lo-trinh');
    const bai = loTrinh.flatMap((c) => c.bai).find((b) => b.ma === hoSo.diemBatDau) || loTrinh[0].bai[0];
    return [
      h('div', { class: 'dau-man' }, h('p', { class: 'nhan' }, `${THU[new Date().getDay()]}, ${vietNgay(ngayHomNay())}`), h('h1', {}, 'Hôm nay')),
      h(
        'section',
        { class: 'khoi' },
        h('p', { class: 'phu nho' }, 'Bài tiếp theo'),
        h('h2', {}, `${bai.ma} · ${bai.chuDe}`),
        h('p', {}, bai.mucTieu),
        h('p', { class: 'phu nho' }, `Buổi học ${hoSo.phutMoiNgay} phút mỗi ngày.`),
      ),
      h('p', { class: 'phu' }, 'Màn bài học và buổi học hằng ngày đang được xây (việc B1.2); hiện app mới có khung và phần thiết lập.'),
    ];
  },
};
