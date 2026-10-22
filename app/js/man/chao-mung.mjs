// Màn 01 — Chào mừng (bảng 01): chỉ hiện lần đầu; giới thiệu ngắn và nút bắt đầu. Bảng ảnh có nút “Tôi đã có tài
// khoản”; app không có tài khoản (màn 31–33 bỏ) nên không làm nút này.
import { h } from '../giao-dien.mjs';
import { nut } from './thanh-phan.mjs';

const dangCaiDat = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const laIPhone = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Gợi ý cài ra Màn hình chính trên iPhone khi đang mở bằng Safari (mục 12.2).
export function goiYCaiDat(lop = 'goi-y') {
  if (dangCaiDat() || !laIPhone()) return null;
  return h('p', { class: lop }, 'Trên iPhone: bấm nút Chia sẻ trong Safari, chọn “Thêm vào MH chính” rồi mở Xinyu từ đó để dữ liệu học được giữ lâu dài.');
}

export default {
  tieuDe: 'Chào mừng',
  ve({ di }) {
    return h(
      'div',
      { class: 'chao-mung' },
      h('div', { class: 'logo' }, h('span', { class: 'dau-son lon', lang: 'zh-CN', 'aria-hidden': 'true' }, '新'), h('span', { class: 'ten-app' }, 'Xinyu')),
      h('h1', {}, 'Tiếng Trung,', h('br'), 'từng bước vững vàng.'),
      h('p', { class: 'loi-gioi-thieu' }, 'Học từ đầu và luyện thi HSK', h('br'), 'theo lộ trình của bạn.'),
      h('div', { class: 'tranh-lon', role: 'img', 'aria-label': 'Tranh mực núi, đình và trăng' }),
      nut('Bắt đầu học', { chinh: true, mui: true, onclick: () => di('muc-tieu') }),
      goiYCaiDat(),
    );
  },
};
