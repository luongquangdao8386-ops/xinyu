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
  'hom-nay': '<path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z"/>',
  'lo-trinh': '<path d="M3.5 6.5l5.5-2 6 2 5.5-2v13l-5.5 2-6-2-5.5 2zM9 4.5v13M15 6.5v13"/>',
  'luyen-tap': '<rect x="4" y="5" width="15" height="15" rx="2"/><path d="M12 13.5l7.5-7.5 1.5 1.5-7.5 7.5-2.2.7z"/>',
  'thu-vien': '<path d="M3.5 5.5c2.8-.9 5.6-.6 8.5 1 2.9-1.6 5.7-1.9 8.5-1v13c-2.8-.9-5.6-.6-8.5 1-2.9-1.6-5.7-1.9-8.5-1zM12 6.5v13"/>',
  toi: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/>',
  lui: '<path d="M15 5l-7 7 7 7"/>',
  mo: '<path d="M9 5l7 7-7 7"/>',
  tiep: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  chon: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  sach: '<path d="M3.5 5.5c2.8-.9 5.6-.6 8.5 1 2.9-1.6 5.7-1.9 8.5-1v13c-2.8-.9-5.6-.6-8.5 1-2.9-1.6-5.7-1.9-8.5-1zM12 6.5v13"/>',
  'muc-tieu': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l7-7M16 5h3v3"/>',
  'de-cuong': '<path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5zM14.5 3.5V7H18M9.5 11.5h5M9.5 14.5h5M9.5 17.5h3"/>',
  'dong-ho': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  lich: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M8 13.5h2M11 13.5h2M14 13.5h2M8 16.5h2M11 16.5h2"/>',
  'luu-tru': '<path d="M5 7.5h14v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM4 4.5h16v3H4zM10 11.5h4"/>',
  'lam-lai': '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
};
export function bieuTuong(ten) {
  const span = document.createElement('span');
  span.innerHTML = `<svg class="bt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${BIEU_TUONG[ten]}</svg>`;
  return span.firstChild;
}

// Ngày dạng YYYY-MM-DD theo giờ của máy.
export function ngayHomNay(luc = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${luc.getFullYear()}-${p(luc.getMonth() + 1)}-${p(luc.getDate())}`;
}
export const vietNgay = (ngay) => (ngay ? ngay.split('-').reverse().join('/') : '');
