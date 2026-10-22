// Màn của tab chưa làm: ghi rõ màn gì và làm ở việc nào trong docs/tien-do.md.
import { h } from '../giao-dien.mjs';

export const choXay = (tieuDe, noiDung, viec) => ({
  tieuDe,
  ve: () => [h('h1', {}, tieuDe), h('p', {}, noiDung), h('p', { class: 'phu' }, `Đang xây ở việc ${viec}.`)],
});
