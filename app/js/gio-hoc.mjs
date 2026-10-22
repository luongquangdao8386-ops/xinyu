// Đếm thời gian học (nhật ký học, mục 11.5; số phút trên màn 05): chỉ đếm khi đang ở màn học hoặc kiểm tra, trang
// đang hiện và người dùng có thao tác trong 3 phút gần nhất. Ghi vào kho nhatKy theo ngày, mỗi 30 giây và khi rời màn.
import { ngayHomNay } from './giao-dien.mjs';
import { doc, ghi } from './kho.mjs';

const NHIP = 5;
const NGHI = 3 * 60 * 1000;
let baiDangHoc = null;
let choGhi = 0;
let lanThaoTac = Date.now();
let demNhip = 0;

for (const su of ['pointerdown', 'keydown', 'scroll', 'touchstart']) addEventListener(su, () => (lanThaoTac = Date.now()), { passive: true, capture: true });
addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && luu());
addEventListener('pagehide', () => luu());

setInterval(() => {
  if (!baiDangHoc || document.visibilityState !== 'visible' || Date.now() - lanThaoTac > NGHI) return;
  choGhi += NHIP;
  if (++demNhip % 6 === 0) luu();
}, NHIP * 1000);

// Bắt đầu đếm cho một bài (mã bài), hoặc dừng khi maBai rỗng.
export function demCho(maBai) {
  if (baiDangHoc && baiDangHoc !== maBai) luu();
  baiDangHoc = maBai || null;
  lanThaoTac = Date.now();
}

let dangLuu = Promise.resolve();
function luu() {
  if (!choGhi) return dangLuu;
  const giay = choGhi;
  const bai = baiDangHoc;
  choGhi = 0;
  dangLuu = dangLuu.then(async () => {
    const ngay = ngayHomNay();
    const cu = (await doc('nhatKy', ngay)) || { ngay, giay: 0, bai: [] };
    await ghi('nhatKy', { ...cu, giay: cu.giay + giay, bai: bai && !cu.bai.includes(bai) ? [...cu.bai, bai] : cu.bai });
  });
  return dangLuu.catch(() => {});
}

// Số phút đã học hôm nay (gồm phần chưa ghi).
export async function phutHomNay() {
  await luu();
  const nk = await doc('nhatKy', ngayHomNay());
  return Math.floor(((nk?.giay || 0) + choGhi) / 60);
}
