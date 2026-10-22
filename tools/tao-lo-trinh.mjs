#!/usr/bin/env node
// Kiểm tra lộ trình Nền phát âm và HSK 1 (tools/lo-trinh/hsk1.mjs) với đề cương thi, rồi sinh:
// docs/lo-trinh-hsk1.md (bảng bài), tools/mau/bai-hsk1.csv (nhập vào tab Bai của Google Sheet) và
// content/lo-trinh.json (danh sách bài theo lộ trình cho app, gồm cả bài chưa soạn).
//
// Cách dùng: node tools/tao-lo-trinh.mjs   (mã thoát 1 khi lộ trình sai)

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TAB } from './lib/cau-truc.mjs';
import { vietJson } from './lib/json.mjs';
import { CUM } from './lo-trinh/hsk1.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const hsk1 = JSON.parse(readFileSync(join(GOC, 'content', 'de-cuong', 'hsk1.json'), 'utf8'));

const ten = (t) => t.tu + (t.dongHinh || '');
const tuDc = new Map(hsk1.tu.map((t) => [ten(t), t]));
const npDc = new Map(hsk1.nguPhap.map((n) => [n.ma.slice(4), n]));
const loi = [];
const ghiChu = [];

const bai = CUM.flatMap((c) => c.bai.map((b) => ({ ...b, cum: c })));
const daGap = new Map();
const npGap = new Map();
bai.forEach((b, i) => {
  if (bai.findIndex((x) => x.ma === b.ma) !== i) loi.push(`trùng mã bài ${b.ma}`);
  const hsk = b.ma.startsWith('H1');
  if (hsk && (b.tu.length < 4 || b.tu.length > 8)) loi.push(`${b.ma} có ${b.tu.length} từ, cần 4–8`);
  for (const w of b.tu) {
    if (!tuDc.has(w)) loi.push(`${b.ma}: “${w}” không có trong đề cương HSK 1`);
    else if (daGap.has(w)) loi.push(`“${w}” có ở cả ${daGap.get(w)} và ${b.ma}`);
    else daGap.set(w, b.ma);
  }
  for (const m of b.nguPhap) {
    if (!npDc.has(m)) loi.push(`${b.ma}: ngữ pháp ${m} không có trong đề cương`);
    else if (npGap.has(m)) loi.push(`ngữ pháp ${m} có ở cả ${npGap.get(m)} và ${b.ma}`);
    else npGap.set(m, b.ma);
  }
});
for (const w of tuDc.keys()) if (!daGap.has(w)) loi.push(`chưa xếp từ “${w}”`);
for (const m of npDc.keys()) if (!npGap.has(m)) loi.push(`chưa xếp ngữ pháp NP1-${m}`);

// Điểm ngữ pháp liệt kê từ cụ thể: từ nào học sau bài của điểm ngữ pháp thì ghi chú để biết.
const thuTu = new Map(bai.map((b, i) => [b.ma, i]));
for (const [m, ma] of npGap) {
  const n = npDc.get(m);
  if (n.loai !== '语素' && n.loai !== '词类') continue;
  const cacTu = n.noiDung.replace(/^（\d）[^：]*：/, '').split(/[、/]/).map((w) => w.replace(/[¹²³—]/g, '').trim());
  const sau = cacTu.filter((w) => {
    const b = daGap.get(w) || daGap.get(`${w}1`);
    return b && thuTu.get(b) > thuTu.get(ma);
  });
  if (sau.length) ghiChu.push(`NP1-${m} (${ma}): ${sau.map((w) => `${w} học ở ${daGap.get(w) || daGap.get(`${w}1`)}`).join(', ')}`);
}

if (loi.length) {
  for (const l of loi) console.error(`LỖI: ${l}`);
  process.exit(1);
}

// ---------- docs/lo-trinh-hsk1.md ----------
const tomTatNp = (m) => {
  const n = npDc.get(m);
  return `${m} ${n.muc || n.tieuLoai}${n.noiDung ? `: ${n.noiDung}` : ''}`;
};
const md = [
  '# Lộ trình bài Nền phát âm và HSK 1',
  '',
  '> Sinh từ `tools/lo-trinh/hsk1.mjs` bằng `node tools/tao-lo-trinh.mjs`. Sửa lộ trình ở tệp đó rồi chạy lại; script kiểm tra mỗi từ và mỗi điểm ngữ pháp HSK 1 có mặt đúng một lần.',
  '',
  'Lộ trình dựng thẳng từ Đề cương thi HSK (11/2025) trong `content/de-cuong/hsk1.json`, không theo giáo trình nào (mục 3.2 của [đặc tả](dac-ta.md)). Các cụm theo khung 12 tuần ở mục 4.3; mỗi bài HSK 1 có 4–8 từ (mục 5.2). Ngữ pháp ghi mã bỏ tiền tố NP1-.',
  '',
  '| Cụm | Việc soạn | Số bài | Số từ |',
  '|---|---|---|---|',
  ...CUM.map((c) => `| ${c.ten} | ${c.viec} | ${c.bai.length} | ${c.bai.reduce((n, b) => n + b.tu.length, 0)} |`),
  `| **Cộng** | | **${bai.length}** | **${daGap.size}** |`,
  '',
  'Bài Nền phát âm PA01–PA07 luyện âm và thanh trên âm tiết, không tính từ vựng; PA08 dạy sáu lời chào thuộc danh sách HSK 1.',
  '',
  ...CUM.flatMap((c) => [
    `## ${c.ten} (${c.viec})`,
    '',
    '| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |',
    '|---|---|---|---|---|',
    ...c.bai.map((b) => `| ${b.ma} | ${b.chuDe} | ${b.mucTieu} | ${b.tu.join('、')} | ${b.nguPhap.map(tomTatNp).join('<br>')} |`),
    '',
  ]),
  '## Ghi chú khi soạn',
  '',
  '- Câu trong bài chỉ dùng từ của bài đó và các bài trước (mục 11.6 bước 3); công cụ xây nội dung kiểm tra việc này.',
  '- Điểm ngữ pháp gồm nhiều từ (đại từ, lượng từ, phó từ…) được gán vào bài giới thiệu lần đầu; các từ còn lại học ở bài sau và được nhắc lại cùng điểm ngữ pháp đó:',
  ...ghiChu.map((g) => `  - ${g}`),
  '- Thứ tự và cách chia bài có thể chỉnh khi soạn từng cụm (A7); sửa `tools/lo-trinh/hsk1.mjs` rồi chạy lại script.',
  '',
];
writeFileSync(join(GOC, 'docs', 'lo-trinh-hsk1.md'), md.join('\n'));

// ---------- tools/mau/bai-hsk1.csv ----------
const cot = TAB.find((t) => t.ten === 'Bai').cot;
const csv = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const dong = [
  cot.map((c) => c.tieuDe),
  ...bai.map((b, i) => {
    const gt = {
      ma: b.ma,
      trangThai: 'nháp',
      thuTu: String(i + 1),
      chang: b.ma.startsWith('PA') ? 'Nền phát âm' : 'HSK 1',
      chuDe: b.chuDe,
      mucTieu: b.mucTieu,
      tu: b.tu.join('、'),
      nguPhap: b.nguPhap.map((m) => `NP1-${m}`).join('、'),
    };
    return cot.map((c) => gt[c.khoa] ?? '');
  }),
];
writeFileSync(join(GOC, 'tools', 'mau', 'bai-hsk1.csv'), '﻿' + dong.map((h) => h.map(csv).join(',')).join('\r\n') + '\r\n');

// ---------- content/lo-trinh.json ----------
// App dùng để biết thứ tự toàn bộ bài (kể cả bài chưa soạn) khi chọn điểm bắt đầu và tính kế hoạch.
const loTrinh = CUM.map((c) => ({
  cum: c.ten,
  chang: c.bai[0].ma.startsWith('PA') ? 'Nền phát âm' : 'HSK 1',
  bai: c.bai.map((b) => ({ ma: b.ma, chuDe: b.chuDe, mucTieu: b.mucTieu })),
}));
writeFileSync(join(GOC, 'content', 'lo-trinh.json'), vietJson(loTrinh) + '\n');

console.log(`${bai.length} bài, ${daGap.size} từ, ${npGap.size} điểm ngữ pháp. Đã ghi docs/lo-trinh-hsk1.md, tools/mau/bai-hsk1.csv và content/lo-trinh.json`);
for (const g of ghiChu) console.log(`Ghi chú: ${g}`);
