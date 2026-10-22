#!/usr/bin/env node
// Tải font của app (mục 8.4) về vendor/font/ để chạy được khi không có mạng: Noto Serif Display hẹp (tiêu đề,
// gần font serif của bảng ảnh), Noto Sans
// (nội dung, điều khiển), Noto Sans SC và Noto Serif SC (chữ Hán). Chữ Hán chỉ lấy những chữ có trong content/
// và mã giao diện (app/, index.html), cắt bằng tham số text= của Google Fonts; chữ Latin lấy đủ tiếng Việt và
// Pinyin. Chạy lại sau mỗi lần xây nội dung có chữ Hán mới; nhóm chữ không đổi thì không tải lại.
//
// Cách dùng: node tools/tao-font.mjs

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { quaProxy } from './lib/nguon.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const RA = join(GOC, 'vendor', 'font');
// Trình duyệt hiện đại để Google Fonts trả về WOFF2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// Mỗi tệp chữ Hán tối đa ngần này chữ (đường dẫn yêu cầu không quá dài; trình duyệt chỉ tải nhóm có chữ cần hiện).
const CHU_MOI_TEP = 300;

const MAT = [
  { ten: 'noto-serif-display-700', ho: 'Noto Serif Display', dam: 700, truc: 'wdth,wght@80,700', loai: 'latin' },
  { ten: 'noto-sans-400', ho: 'Noto Sans', dam: 400, loai: 'latin' },
  { ten: 'noto-sans-600', ho: 'Noto Sans', dam: 600, loai: 'latin' },
  { ten: 'noto-sans-sc-400', ho: 'Noto Sans SC', dam: 400, loai: 'han' },
  { ten: 'noto-sans-sc-600', ho: 'Noto Sans SC', dam: 600, loai: 'han' },
  { ten: 'noto-serif-sc-600', ho: 'Noto Serif SC', dam: 600, loai: 'han' },
];

await quaProxy();

// Chữ Latin: ASCII, mọi chữ tiếng Việt, chữ Pinyin có dấu thanh, dấu câu và ký hiệu giao diện.
function chuLatin() {
  const chu = new Set();
  for (let c = 0x20; c < 0x7f; c++) chu.add(String.fromCharCode(c));
  const dauViet = ['', '̀', '́', '̉', '̃', '̣'];
  for (const goc of ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y']) {
    for (const d of dauViet) for (const g of [goc, goc.toUpperCase()]) chu.add((g + d).normalize('NFC'));
  }
  for (const goc of ['a', 'e', 'i', 'o', 'u', 'ü']) {
    for (const d of ['̄', '́', '̌', '̀']) for (const g of [goc, goc.toUpperCase()]) chu.add((g + d).normalize('NFC'));
  }
  for (const c of 'đĐüÜ“”‘’–—…·•×÷°→←↑↓✓✕✗⚠№€') chu.add(c);
  return [...chu].join('');
}

// Chữ Hán và dấu câu chữ Hán trong nội dung và mã giao diện.
function chuHan() {
  const chu = new Set('，。！？、：；“”‘’（）《》〈〉…—·'.split(''));
  const quet = (thuMuc, duoi) => {
    if (!existsSync(thuMuc)) return;
    for (const t of readdirSync(thuMuc)) {
      const p = join(thuMuc, t);
      if (statSync(p).isDirectory()) quet(p, duoi);
      else if (duoi.some((d) => t.endsWith(d))) for (const c of readFileSync(p, 'utf8').match(/\p{Script=Han}/gu) || []) chu.add(c);
    }
  };
  quet(join(GOC, 'content'), ['.json']);
  quet(join(GOC, 'app'), ['.mjs', '.js', '.css', '.html']);
  for (const t of ['index.html', 'manifest.webmanifest']) quet(GOC, [t]);
  return [...chu].sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
}

const bam = (s) => createHash('sha256').update(s).digest('hex').slice(0, 12);
const unicodeRange = (chu) => chu.map((c) => `U+${c.codePointAt(0).toString(16)}`).join(', ');

async function taiMat(mat, van) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(mat.ho)}:${mat.truc || `wght@${mat.dam}`}&text=${encodeURIComponent(van)}`;
  const css = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!css.ok) throw new Error(`Google Fonts trả lỗi ${css.status} cho ${mat.ho} ${mat.dam}`);
  const nguon = (await css.text()).match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\('woff2'\)/);
  if (!nguon) throw new Error(`không thấy tệp WOFF2 cho ${mat.ho} ${mat.dam}`);
  const tl = await fetch(nguon[1], { headers: { 'User-Agent': UA } });
  if (!tl.ok) throw new Error(`tải ${nguon[1]} lỗi ${tl.status}`);
  return Buffer.from(await tl.arrayBuffer());
}

mkdirSync(RA, { recursive: true });
const tepDanhSach = join(RA, 'danh-sach.json');
const cu = existsSync(tepDanhSach) ? JSON.parse(readFileSync(tepDanhSach, 'utf8')) : {};
const latin = chuLatin();
const han = chuHan();
const nhomHan = [];
for (let i = 0; i < han.length; i += CHU_MOI_TEP) nhomHan.push(han.slice(i, i + CHU_MOI_TEP));

const danhSach = {};
const css = ['/* Sinh bằng tools/tao-font.mjs; font Noto theo giấy phép SIL Open Font License 1.1 (OFL.txt). */'];
let taiMoi = 0;
for (const mat of MAT) {
  const nhom = mat.loai === 'latin' ? [[...latin]] : nhomHan;
  for (const [i, chu] of nhom.entries()) {
    const tep = `${mat.ten}${mat.loai === 'han' ? `-${i + 1}` : ''}.woff2`;
    const van = chu.join('');
    const dau = bam(`${mat.ho}|${mat.truc || mat.dam}|${van}`);
    if (cu[tep]?.bam !== dau || !existsSync(join(RA, tep))) {
      writeFileSync(join(RA, tep), await taiMat(mat, van));
      taiMoi++;
    }
    danhSach[tep] = { ho: mat.ho, dam: mat.dam, soChu: chu.length, bam: dau };
    css.push(
      `@font-face { font-family: '${mat.ho}'; font-style: normal; font-weight: ${mat.dam}; font-display: swap; src: url('${tep}') format('woff2');${mat.loai === 'han' ? ` unicode-range: ${unicodeRange(chu)};` : ''} }`,
    );
  }
}
// Xóa tệp của nhóm không còn dùng (khi số nhóm chữ Hán giảm).
for (const tep of Object.keys(cu)) if (!danhSach[tep]) rmSync(join(RA, tep), { force: true });
if (!existsSync(join(RA, 'OFL.txt'))) {
  const tl = await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/OFL.txt');
  if (!tl.ok) throw new Error(`tải giấy phép OFL lỗi ${tl.status}`);
  writeFileSync(join(RA, 'OFL.txt'), await tl.text());
}
writeFileSync(join(RA, 'font.css'), css.join('\n') + '\n');
writeFileSync(tepDanhSach, JSON.stringify(danhSach, null, 2) + '\n');
const dungLuong = Object.keys(danhSach).reduce((s, t) => s + statSync(join(RA, t)).size, 0);
console.log(`${han.filter((c) => /\p{Script=Han}/u.test(c)).length} chữ Hán, ${Object.keys(danhSach).length} tệp font (${Math.round(dungLuong / 1024)} KB), tải mới ${taiMoi}. Đã ghi vendor/font/.`);
