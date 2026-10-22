// Khởi động Xinyu: đăng ký service worker, đọc hồ sơ học, dựng thanh điều hướng 5 tab (mục 8.3) và chuyển màn
// theo địa chỉ dạng #/ten-man hoặc #/ten-man/sua. Lần đầu mở app đi qua 01 → 02 → 03 → 04 → 05 (mục 10.1).
import { bieuTuong, h, han } from './giao-dien.mjs';
import { doc, ghi, xoa } from './kho.mjs';
import chaoMung from './man/chao-mung.mjs';
import { choXay } from './man/cho-xay.mjs';
import diemBatDau from './man/diem-bat-dau.mjs';
import homNay from './man/hom-nay.mjs';
import keHoach from './man/ke-hoach.mjs';
import mucTieu from './man/muc-tieu.mjs';
import toi from './man/toi.mjs';

const MAN = {
  'chao-mung': chaoMung,
  'muc-tieu': mucTieu,
  'diem-bat-dau': diemBatDau,
  'ke-hoach': keHoach,
  'hom-nay': homNay,
  'lo-trinh': choXay('Lộ trình', 'Lộ trình HSK (màn 06): Nền phát âm, HSK 1–6 và HSK 7–9; tổng quan từng chặng và chi tiết bài học.', 'B1.2'),
  'luyen-tap': choXay('Luyện tập', 'Luyện tập (màn 44): luyện chữ, ôn từ, sổ lỗi, luyện thanh điệu và luyện thi.', 'B1.4–B1.6'),
  'thu-vien': choXay('Thư viện', 'Thư viện và tra từ (màn 18): tra trong kho từ của app, nghe, xem ví dụ, quản lý từ đã lưu.', 'B1.7'),
  toi,
};
const THIET_LAP = ['chao-mung', 'muc-tieu', 'diem-bat-dau', 'ke-hoach'];
const TAB = [
  ['hom-nay', 'Hôm nay'],
  ['lo-trinh', 'Lộ trình'],
  ['luyen-tap', 'Luyện tập'],
  ['thu-vien', 'Thư viện'],
  ['toi', 'Tôi'],
];

const vungMan = document.getElementById('man');
const dieuHuong = document.querySelector('.dieu-huong');
let hoSo = { khoa: 'hoSo' };

dieuHuong.append(
  h('p', { class: 'thuong-hieu' }, han('新语', 'chu-han'), h('span', { class: 'ten' }, 'Xinyu')),
  h('ul', {}, TAB.map(([ten, nhan]) => h('li', {}, h('a', { href: `#/${ten}`, 'data-man': ten }, bieuTuong(ten), h('span', {}, nhan))))),
);

const di = (duong) => {
  if (location.hash === `#/${duong}`) veMan();
  else location.hash = `#/${duong}`;
};
async function luuHoSo(thayDoi) {
  hoSo = await ghi('caiDat', { ...hoSo, ...thayDoi, khoa: 'hoSo' });
}
async function datLai() {
  await xoa('caiDat', 'hoSo');
  hoSo = { khoa: 'hoSo' };
  di('chao-mung');
}

let lanVe = 0;
async function veMan() {
  const [ten, sua] = location.hash.replace(/^#\/?/, '').split('/');
  const xong = !!hoSo.xongThietLap;
  // Chưa thiết lập xong thì chỉ vào được các màn thiết lập; đã xong thì không quay lại màn chào mừng.
  if (!MAN[ten] || (!xong && !THIET_LAP.includes(ten)) || (xong && ten === 'chao-mung')) {
    location.replace(`#/${xong ? 'hom-nay' : 'chao-mung'}`);
    return;
  }
  const lan = ++lanVe;
  const man = MAN[ten];
  const coTab = xong && !(THIET_LAP.includes(ten) && !sua);
  document.body.classList.toggle('co-dieu-huong', coTab);
  dieuHuong.hidden = !coTab;
  for (const a of dieuHuong.querySelectorAll('a')) {
    if (a.dataset.man === ten) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  let noiDung;
  try {
    noiDung = await man.ve({ hoSo, luuHoSo, di, datLai, sua: sua === 'sua' });
  } catch (e) {
    noiDung = [h('h1', {}, 'Không mở được màn này'), h('p', {}, e.message), h('p', { class: 'phu' }, 'Kiểm tra kết nối mạng rồi tải lại trang.')];
  }
  if (lan !== lanVe) return;
  document.title = `${man.tieuDe} · Xinyu`;
  vungMan.replaceChildren(...[noiDung].flat().filter(Boolean));
  window.scrollTo(0, 0);
  vungMan.focus({ preventScroll: true });
}

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
try {
  hoSo = (await doc('caiDat', 'hoSo')) || hoSo;
} catch (e) {
  vungMan.replaceChildren(h('h1', {}, 'Không mở được dữ liệu học'), h('p', {}, e.message));
  throw e;
}
addEventListener('hashchange', veMan);
veMan();
