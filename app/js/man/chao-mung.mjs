// Màn 01 — Chào mừng: chỉ hiện lần đầu; giới thiệu ngắn và nút bắt đầu.
import { h, han } from '../giao-dien.mjs';

// Tranh mực: núi xa, núi gần và dải sương; nền sáng, không nhuộm đỏ son (mục 8.2).
const TRANH = `<svg class="tranh" viewBox="0 0 600 200" role="img" aria-label="Tranh mực núi và sương">
<defs>
<linearGradient id="suong" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--nen-chinh)" stop-opacity="0"/><stop offset="1" stop-color="var(--nen-chinh)"/></linearGradient>
<linearGradient id="troi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--nen-phu)"/><stop offset="1" stop-color="var(--nen-chinh)"/></linearGradient>
</defs>
<rect width="600" height="200" fill="url(#troi)"/>
<path d="M0 132 L70 92 L120 112 L190 58 L250 100 L300 84 L360 116 L430 70 L500 104 L560 88 L600 104 V200 H0Z" fill="var(--muc-nhat)"/>
<rect y="96" width="600" height="56" fill="url(#suong)"/>
<path d="M0 168 L60 140 L110 152 L170 118 L230 150 L280 138 L330 160 L400 126 L470 156 L530 142 L600 158 V200 H0Z" fill="var(--muc-vua)"/>
<rect y="150" width="600" height="34" fill="url(#suong)"/>
<path d="M0 200 V186 C80 178 150 190 230 182 C320 174 400 192 480 184 C540 178 580 186 600 182 V200Z" fill="var(--muc-dam)" opacity=".55"/>
</svg>`;

const dangCaiDat = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const laIPhone = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function goiYCaiDat() {
  if (dangCaiDat() || !laIPhone()) return null;
  return h(
    'div',
    { class: 'khoi' },
    h('h3', {}, 'Cài ra Màn hình chính'),
    h('p', { class: 'nho' }, 'Trong Safari, bấm nút Chia sẻ rồi chọn “Thêm vào MH chính”. Mở Xinyu từ biểu tượng đó để dữ liệu học được giữ lâu dài và học được khi không có mạng.'),
  );
}

export default {
  tieuDe: 'Chào mừng',
  ve({ di }) {
    const tranh = document.createElement('div');
    tranh.innerHTML = TRANH;
    return [
      tranh.firstChild,
      h(
        'div',
        { class: 'dau-man' },
        h('p', { class: 'thuong-hieu' }, han('新语', 'chu-han'), ' ', h('span', { class: 'phu' }, 'Xīnyǔ')),
        h('h1', {}, 'Chào bạn đến với Xinyu'),
        h('p', {}, 'Học tiếng Trung từ phát âm, theo lộ trình HSK 3.0, giải thích bằng tiếng Việt.'),
      ),
      h(
        'ul',
        { class: 'phu' },
        h('li', {}, 'Đi từ Pinyin và thanh điệu đến từng cấp HSK, mỗi bài một mục tiêu giao tiếp.'),
        h('li', {}, 'Ôn từ và sửa lỗi đúng lúc theo lịch ôn.'),
        h('li', {}, 'Luyện dạng bài và thi thử khi đã sẵn sàng.'),
      ),
      goiYCaiDat(),
      h('button', { class: 'nut nut-chinh nut-rong', type: 'button', onclick: () => di('muc-tieu') }, 'Bắt đầu'),
    ];
  },
};
