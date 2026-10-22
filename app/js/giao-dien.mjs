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
// Chuỗi lẫn chữ Hán và chữ Latin (câu hỏi, đáp án): bọc từng đoạn chữ Hán, kể cả dấu câu Trung, bằng han().
export const tronChu = (chuoi) =>
  String(chuoi ?? '')
    .split(/([\p{Script=Han}\u3000-\u303F\uFF01-\uFF60]+)/u)
    .map((d, i) => (i % 2 ? han(d) : d))
    .filter((d) => d !== '');

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
  loa: '<path d="M4.5 9.5h3.5l5-4v13l-5-4H4.5z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  'loa-cham': '<path d="M4.5 9.5h3.5l5-4v13l-5-4H4.5z"/><path d="M16.5 10.5v3M19.5 9v6"/>',
  'song-am': '<path d="M4 12h1.5M7.5 9v6M10.5 6v12M13.5 8.5v7M16.5 10.5v3M19.5 12h.5"/>',
  'tai-nghe': '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="4.5" y="13.5" width="4" height="6.5" rx="1.5"/><rect x="15.5" y="13.5" width="4" height="6.5" rx="1.5"/>',
  'loi-thoai': '<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4.5 3.5v-3.5h0a2 2 0 0 1-2-2z"/><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01"/>',
  but: '<path d="M5 19l1-4.5L15.5 5a2 2 0 0 1 3 3L9 17.5zM13.5 7l3 3M5 19h4"/>',
  mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5M9 20.5h6"/>',
  khoa: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  phat: '<path d="M8.5 5.5v13l10-6.5z"/>',
  'tam-dung': '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
  dong: '<path d="M6 6l12 12M18 6L6 18"/>',
  dung: '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
  sai: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
  'thong-tin': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
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
