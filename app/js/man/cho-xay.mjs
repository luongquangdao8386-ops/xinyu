// Màn chưa làm: giữ đầu màn và tiêu đề như bảng ảnh, ghi rõ màn gì và làm ở việc nào trong docs/tien-do.md.
import { h } from '../giao-dien.mjs';
import { dauApp, dauBuoc, tranhGoc } from './thanh-phan.mjs';

export const choXay = ({ tieuDe, nhan, dong, noiDung, viec, lui }) => ({
  tieuDe,
  ve: ({ di }) => [
    tranhGoc(),
    lui ? dauBuoc(0, () => di(lui), 'Hôm nay') : dauApp(),
    h('div', { class: 'mo-dau' }, nhan ? h('p', { class: 'nhan' }, nhan) : null, h('h1', {}, ...dong.flatMap((d, i) => (i ? [h('br'), d] : [d])))),
    h('section', { class: 'the' }, h('p', {}, noiDung), h('p', { class: 'phu nho' }, `Đang xây ở việc ${viec}.`)),
  ],
});
