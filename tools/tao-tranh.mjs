#!/usr/bin/env node
// Tạo hai tranh mực của app (app/hinh/tranh-nui.webp, tranh-goc.webp; mục 12.7) từ tranh thủy mặc cổ hết bản
// quyền trên Wikimedia Commons: Vương Huy (王翬, 1632–1717), “Phỏng Cự Nhiên, Yến Văn Quý sơn thủy đồ”
// (倣巨然燕文貴山水圖, cuộn ngang, 1713), Bảo tàng Metropolitan, số 1979.458.2, ảnh Open Access (CC0).
// Đoạn dùng có núi, rặng thông, lầu cổng, tháp và thác.
//
// Xử lý: chuyển xám, chia cho nền giấy ước lượng (đóng hình thái trên ảnh thu nhỏ để xóa nét mực, rồi làm mờ)
// để giấy ố thành trắng mà vẫn giữ mảng mực loang, kéo mức, cắt khung đúng tỉ lệ khung trong xinyu.css, xóa
// chấm bẩn trên giấy trống, làm mờ mép trái, phải, lọc trung vị 3×3 cho bớt hạt giấy, thu nhỏ đủ nét cho màn
// 3x của iPhone, rồi nén WebP ở chất lượng cao nhất mà tệp còn dưới 150 KB.
//
// Cách dùng: node tools/tao-tranh.mjs        (cần ImageMagick 6 và ffmpeg có libwebp)

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { quaProxy } from './lib/nguon.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(GOC, 'tools', '.cache', 'tranh');
const RA = join(GOC, 'app', 'hinh');
// Wikimedia chặn yêu cầu không ghi rõ công cụ và nơi liên hệ.
const UA = 'XinyuBot/1.0 (https://github.com/luongquangdao8386-ops/xinyu)';
const TOI_DA = 150_000;

const NGUON = {
  ten: '清 王翬 倣巨然燕文貴山水圖 卷-Landscape in the Style of Juran and Yan Wengui MET DP204419.jpg',
  // Ảnh thu nhỏ cỡ chuẩn 3840 px: tệp gốc 4000 px thường bị trả lỗi 429 khi tải từ môi trường cloud.
  rong: 3840,
  bam: '15216df1a9863dcdc8ecc44918915a67a2a98a66a4fff8bf31aa82a41ea7f797',
};

// Khung cắt [rộng, cao, x, y] trên ảnh 3840 px (giấy vẽ nằm trong khoảng y 125–1870), tỉ lệ theo aspect-ratio
// của .tranh-lon (381/284) và .tranh-goc (167/284); cỡ ra đủ cho khung rộng nhất trên iPhone ở mật độ 3x.
// mo: phần bề rộng mờ dần về trắng ở mép [trái, phải]. Tranh vẽ kín tới mép, nên trên màn rộng (tranh không
// tràn màn) và trong thẻ bài ở màn 05 cần mép mờ để không lộ cạnh thẳng; mép trên, dưới đã có mask trong CSS.
const TRANH = [
  { tep: 'tranh-nui.webp', cat: [2321, 1730, 920, 135], co: [1170, 872], mo: [0.1, 0.1] },
  { tep: 'tranh-goc.webp', cat: [1017, 1730, 1250, 135], co: [640, 1088], mo: [0.25, 0] },
];

await quaProxy();

const chay = (lenh, thamSo) => execFileSync(lenh, thamSo, { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const ngu = (ms) => new Promise((xong) => setTimeout(xong, ms));

async function taiNguon() {
  const tep = join(CACHE, `nguon-${NGUON.rong}.jpg`);
  if (!existsSync(tep)) {
    const ten = NGUON.ten.replaceAll(' ', '_');
    const h = createHash('md5').update(ten).digest('hex');
    const q = encodeURIComponent(ten);
    const url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${h[0]}/${h.slice(0, 2)}/${q}/${NGUON.rong}px-${q}`;
    let tl;
    // Địa chỉ IP dùng chung hay bị giới hạn tần suất (429): chờ tăng dần rồi thử lại.
    for (let lan = 0, cho = 4000; lan < 7; lan++, cho *= 2) {
      tl = await fetch(url, { headers: { 'User-Agent': UA } });
      if (tl.status !== 429) break;
      await ngu(cho);
    }
    if (!tl.ok) throw new Error(`tải ảnh nguồn lỗi ${tl.status}: ${url}`);
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(tep, Buffer.from(await tl.arrayBuffer()));
  }
  const bam = createHash('sha256').update(readFileSync(tep)).digest('hex');
  if (bam !== NGUON.bam) console.warn(`Cảnh báo: ảnh nguồn khác bản đã dùng (sha256 ${bam}); xem lại khung cắt.`);
  return tep;
}

// Xóa chấm bẩn của giấy cũ: cụm điểm tối nhỏ nằm giữa vùng giấy trống (trời, mặt nước, vách núi để trắng).
// Chấm rêu và lá thông luôn đi thành đám nên vùng quanh chúng không trống, không bị xóa.
function xoaChamBan(anh, w, h) {
  const O = 16;
  const ow = Math.floor(w / O), oh = Math.floor(h / O);
  const tbO = new Float32Array(ow * oh);
  for (let y = 0; y < oh * O; y++) for (let x = 0; x < ow * O; x++) tbO[Math.floor(y / O) * ow + Math.floor(x / O)] += anh[y * w + x] / (O * O);
  const trong = (cx, cy) => {
    let tong = 0, dem = 0;
    for (let j = Math.max(0, Math.floor(cy / O) - 6); j <= Math.min(oh - 1, Math.floor(cy / O) + 6); j++) {
      for (let i = Math.max(0, Math.floor(cx / O) - 6); i <= Math.min(ow - 1, Math.floor(cx / O) + 6); i++) { tong += tbO[j * ow + i]; dem++; }
    }
    return tong / dem > 252.5;
  };
  const da = new Uint8Array(w * h);
  let soCham = 0;
  for (let p = 0; p < w * h; p++) {
    if (da[p] || anh[p] >= 235) continue;
    const cum = [p];
    da[p] = 1;
    for (let k = 0; k < cum.length; k++) {
      const x = cum[k] % w, y = Math.floor(cum[k] / w);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const q = (y + dy) * w + x + dx;
        if (x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h && !da[q] && anh[q] < 235) { da[q] = 1; cum.push(q); }
      }
    }
    if (cum.length >= 300) continue;
    let x0 = w, y0 = h, x1 = 0, y1 = 0, sx = 0, sy = 0;
    for (const q of cum) {
      const x = q % w, y = Math.floor(q / w);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); sx += x; sy += y;
    }
    if (!trong(sx / cum.length, sy / cum.length)) continue;
    for (let y = Math.max(0, y0 - 2); y <= Math.min(h - 1, y1 + 2); y++) for (let x = Math.max(0, x0 - 2); x <= Math.min(w - 1, x1 + 2); x++) anh[y * w + x] = 255;
    soCham++;
  }
  return soCham;
}

// Mép trái, phải mờ dần về trắng (đường cong smoothstep), tính theo phần bề rộng.
function moMep(anh, w, h, [trai, phai]) {
  const muc = (t) => t * t * (3 - 2 * t);
  for (let x = 0; x < w; x++) {
    const a = Math.min(trai ? muc(Math.min(1, x / (trai * w))) : 1, phai ? muc(Math.min(1, (w - 1 - x) / (phai * w))) : 1);
    if (a < 1) for (let y = 0; y < h; y++) anh[y * w + x] = Math.round(255 - (255 - anh[y * w + x]) * a);
  }
}

const nguon = await taiNguon();
const [rong, cao] = chay('identify', ['-format', '%w %h', nguon]).split(' ').map(Number);
const phang = join(CACHE, 'phang.png');
chay('convert', [
  nguon, '-colorspace', 'Gray',
  '(', '+clone', '-resize', '6.25%', '-morphology', 'Close', 'Disk:14', '-blur', '0x10', '-resize', `${rong}x${cao}!`, ')',
  '-compose', 'Divide_Src', '-composite', '-level', '10%,88%', phang,
]);

for (const t of TRANH) {
  const [w, h, x, y] = t.cat;
  const tam = join(CACHE, t.tep.replace('.webp', '.png'));
  // Xóa chấm trên khung đã cắt để viền bồi tranh ngoài giấy vẽ không bị tính vào vùng quanh chấm.
  const anh = execFileSync('convert', [phang, '-crop', `${w}x${h}+${x}+${y}`, '+repage', '-depth', '8', 'gray:-'], { maxBuffer: w * h + 1024 });
  const soCham = xoaChamBan(anh, w, h);
  moMep(anh, w, h, t.mo);
  execFileSync('convert', ['-size', `${w}x${h}`, '-depth', '8', 'gray:-', '-statistic', 'Median', '3x3', '-resize', `${t.co[0]}x${t.co[1]}!`, tam], { input: anh });
  const ra = join(RA, t.tep);
  let q = 85;
  for (; ; q -= 5) {
    chay('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', tam, '-c:v', 'libwebp', '-preset', 'picture', '-quality', String(q), '-compression_level', '6', ra]);
    if (statSync(ra).size <= TOI_DA || q <= 50) break;
  }
  rmSync(tam);
  console.log(`${t.tep}: ${t.co[0]}×${t.co[1]}, xóa ${soCham} chấm bẩn, chất lượng ${q}, ${Math.round(statSync(ra).size / 1024)} KB`);
}
rmSync(phang);
