// Khởi động Xinyu: đăng ký service worker, đọc hồ sơ học, dựng thanh điều hướng 5 tab (mục 8.3) và chuyển màn
// theo địa chỉ dạng #/ten-man/tham-so… (#/muc-tieu/sua, #/bai/PA01). Lần đầu mở app đi qua 01 → 02 → 03 → 04 → 05
// (mục 10.1). Màn bài học, kiểm tra và hoàn thành bài ẩn thanh điều hướng (mục 8.3).
import { demCho } from './gio-hoc.mjs';
import { bieuTuong, h } from './giao-dien.mjs';
import { doc, ghi, xoa } from './kho.mjs';
import bai from './man/bai.mjs';
import chang from './man/chang.mjs';
import chaoMung from './man/chao-mung.mjs';
import { choXay } from './man/cho-xay.mjs';
import diemBatDau from './man/diem-bat-dau.mjs';
import hoanThanh from './man/hoan-thanh.mjs';
import hoatDong from './man/hoat-dong.mjs';
import homNay from './man/hom-nay.mjs';
import keHoach from './man/ke-hoach.mjs';
import kiemTra from './man/kiem-tra.mjs';
import loTrinh from './man/lo-trinh.mjs';
import mucTieu from './man/muc-tieu.mjs';
import onTap from './man/on-tap.mjs';
import toi from './man/toi.mjs';

const MAN = {
  'chao-mung': chaoMung,
  'muc-tieu': mucTieu,
  'diem-bat-dau': diemBatDau,
  'ke-hoach': keHoach,
  'hom-nay': homNay,
  'lo-trinh': loTrinh,
  chang,
  bai,
  hoc: hoatDong,
  'kiem-tra': kiemTra,
  xong: hoanThanh,
  'on-tap': onTap,
  'luyen-tap': choXay({ tieuDe: 'Luyện tập', dong: ['Luyện đều,', 'nhớ lâu.'], noiDung: 'Luyện tập (màn 44): luyện chữ Hán, ôn từ đến hạn, sổ lỗi, luyện thanh điệu và luyện thi.', viec: 'B1.4–B1.6' }),
  'thu-vien': choXay({ tieuDe: 'Thư viện', dong: ['Thư viện'], noiDung: 'Tra từ, lưu lại và ôn tập mọi lúc (màn 18): tra trong kho từ của app, nghe, xem ví dụ, quản lý từ đã lưu.', viec: 'B1.7' }),
  toi,
};
const THIET_LAP = ['chao-mung', 'muc-tieu', 'diem-bat-dau', 'ke-hoach'];
// Màn tập trung: ẩn thanh điều hướng. DEM_GIO: màn tính vào thời gian học.
const TRONG_BAI = ['bai', 'hoc', 'kiem-tra', 'xong'];
const DEM_GIO = ['hoc', 'kiem-tra'];
// Tab sáng lên khi ở màn mở từ tab đó (mục 8.3).
const TAB_CUA = { chang: 'lo-trinh', 'on-tap': 'luyen-tap' };
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
  h('p', { class: 'thuong-hieu' }, h('span', { class: 'dau-son', lang: 'zh-CN', 'aria-hidden': 'true' }, '新'), h('span', { class: 'ten-app' }, 'Xinyu')),
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
let duongTruoc = null;
let vaoBaiTu = null;
async function veMan() {
  const duong = location.hash.replace(/^#\/?/, '');
  const [ten, ...thamSo] = duong.split('/').map(decodeURIComponent);
  const sua = thamSo[0] === 'sua';
  const xong = !!hoSo.xongThietLap;
  // Chưa thiết lập xong thì chỉ vào được các màn thiết lập; đã xong thì không quay lại màn chào mừng.
  if (!MAN[ten] || (!xong && !THIET_LAP.includes(ten)) || (xong && ten === 'chao-mung')) {
    location.replace(`#/${xong ? 'hom-nay' : 'chao-mung'}`);
    return;
  }
  const lan = ++lanVe;
  const man = MAN[ten];
  // Nơi vào bài học (05, 07…) để nút lùi ở màn 08 quay về đúng chỗ.
  const tenTruoc = duongTruoc?.split('/')[0];
  if (ten === 'bai' && duongTruoc && !TRONG_BAI.includes(tenTruoc)) vaoBaiTu = duongTruoc;
  duongTruoc = duong;
  demCho(DEM_GIO.includes(ten) ? thamSo[0] : null);
  const coTab = xong && !(THIET_LAP.includes(ten) && !sua) && !TRONG_BAI.includes(ten);
  document.body.classList.toggle('co-dieu-huong', coTab);
  dieuHuong.hidden = !coTab;
  for (const a of dieuHuong.querySelectorAll('a')) {
    if (a.dataset.man === (TAB_CUA[ten] || ten)) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  let noiDung;
  try {
    noiDung = await man.ve({ hoSo, luuHoSo, di, datLai, sua, thamSo, vaoBaiTu });
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
