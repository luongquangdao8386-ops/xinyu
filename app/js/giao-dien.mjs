// Tiện ích dựng giao diện: tạo phần tử, biểu tượng nét mảnh, định dạng ngày.

// h('p', { class: 'phu' }, 'chữ', phanTuKhac): thuộc tính bắt đầu bằng "on" là sự kiện; false/null bị bỏ qua.
export function h(the, thuocTinh = {}, ...con) {
  const el = document.createElement(the);
  for (const [k, v] of Object.entries(thuocTinh || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of con.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}

// Đoạn chữ Hán: luôn gắn lang="zh-CN" để máy dùng đúng tự dạng giản thể.
export const han = (chu, lop = '') => h('span', { lang: 'zh-CN', class: `han ${lop}`.trim() }, chu);

// Biểu tượng nét mảnh 24×24 (mục 8.2), vẽ bằng currentColor.
const BIEU_TUONG = {
  'hom-nay': '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8.5 14.5l2.5 2.5 4.5-4.5"/>',
  'lo-trinh': '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16"/>',
  'luyen-tap': '<path d="M14.5 4.5l5 5L9 20H4v-5z"/><path d="M12.5 6.5l5 5"/>',
  'thu-vien': '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  toi: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/>',
  lui: '<path d="M15 5l-7 7 7 7"/>',
  chon: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
export function bieuTuong(ten) {
  const span = document.createElement('span');
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BIEU_TUONG[ten]}</svg>`;
  return span.firstChild;
}

// Ngày dạng YYYY-MM-DD theo giờ của máy.
export function ngayHomNay(luc = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${luc.getFullYear()}-${p(luc.getMonth() + 1)}-${p(luc.getDate())}`;
}
export const vietNgay = (ngay) => (ngay ? ngay.split('-').reverse().join('/') : '');
