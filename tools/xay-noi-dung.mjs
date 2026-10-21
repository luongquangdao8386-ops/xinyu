#!/usr/bin/env node
// Xây nội dung từ Google Sheet biên soạn (mục 12.8): đọc các tab, kiểm tra theo mục 11.6 bước 1–4,
// xuất JSON vào content/ và in báo cáo. Cấu trúc Sheet: docs/mau-sheet.md.
//
// Cách dùng: node tools/xay-noi-dung.mjs <nguồn> [--ra <thư mục>] [--cedict <tệp>] [--khong-cedict]
//   <nguồn>  tệp .xlsx tải từ Google Sheet; thư mục chứa các tệp CSV (mỗi tab một tệp, tên kết thúc
//            bằng <Tab>.csv); hoặc đường dẫn “Công bố lên web” dạng .xlsx của cả bảng tính.
//   --ra       thư mục ghi JSON (mặc định content/)
//   --cedict   tệp CC-CEDICT (cedict_ts.u8 hoặc .json); mặc định tải gói npm cedict-json và lưu vào tools/.cache/
//   --khong-cedict  bỏ qua phần đối chiếu CC-CEDICT
// Mã thoát 1 khi có lỗi ở dòng “đã kiểm tra”.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { docCsv, docXlsx } from './lib/bang-tinh.mjs';
import { TAB } from './lib/cau-truc.mjs';
import { napCedict } from './lib/cedict.mjs';
import { vietJson } from './lib/json.mjs';
import { TEN_BUOC, xayNoiDung } from './lib/xay-dung.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');

const thamSo = process.argv.slice(2);
const lay = (ten) => {
  const i = thamSo.indexOf(ten);
  return i >= 0 ? thamSo.splice(i, 2)[1] : undefined;
};
const ra = lay('--ra') || join(GOC, 'content');
const tepCedict = lay('--cedict');
const khongCedict = thamSo.includes('--khong-cedict') && thamSo.splice(thamSo.indexOf('--khong-cedict'), 1);
const [nguon] = thamSo;
if (!nguon) {
  console.error('Cách dùng: node tools/xay-noi-dung.mjs <tệp .xlsx | thư mục CSV | đường dẫn .xlsx> [--ra <thư mục>] [--cedict <tệp>] [--khong-cedict]');
  process.exit(2);
}

async function docNguon(nguon) {
  if (/^https?:\/\//.test(nguon)) {
    const tl = await fetch(nguon);
    if (!tl.ok) throw new Error(`tải ${nguon} lỗi ${tl.status}`);
    const buf = Buffer.from(await tl.arrayBuffer());
    if (buf.subarray(0, 2).toString() !== 'PK') throw new Error('đường dẫn không trả về tệp .xlsx; khi công bố lên web hãy chọn cả tài liệu và định dạng .xlsx');
    return docXlsx(buf);
  }
  if (statSync(nguon).isDirectory()) {
    const tep = readdirSync(nguon).filter((t) => t.toLowerCase().endsWith('.csv'));
    const bang = new Map();
    for (const tab of TAB) {
      const t = tep.find((x) => x.toLowerCase() === `${tab.ten.toLowerCase()}.csv` || x.toLowerCase().endsWith(` - ${tab.ten.toLowerCase()}.csv`));
      if (t) bang.set(tab.ten, docCsv(readFileSync(join(nguon, t), 'utf8')));
    }
    return bang;
  }
  return docXlsx(readFileSync(nguon));
}

let bang;
try {
  bang = await docNguon(nguon);
} catch (e) {
  console.error(`Không đọc được nguồn: ${e.message}`);
  process.exit(2);
}

const thuMucDeCuong = join(GOC, 'content', 'de-cuong');
const deCuong = existsSync(thuMucDeCuong)
  ? readdirSync(thuMucDeCuong)
      .filter((t) => /^hsk\d+\.json$/.test(t))
      .map((t) => JSON.parse(readFileSync(join(thuMucDeCuong, t), 'utf8')))
      .sort((a, b) => a.cap - b.cap)
  : [];

let cedict = null;
let veCedict = 'bỏ qua (--khong-cedict)';
if (!khongCedict) {
  const k = await napCedict(tepCedict);
  cedict = k.tra || null;
  veCedict = k.tra ? k.nguon : `không nạp được (${k.loi}); bỏ qua phần đối chiếu từ điển`;
}

const { duLieu, baoCao, thongKe } = xayNoiDung({ bang, deCuong, cedict });

mkdirSync(ra, { recursive: true });
for (const tab of TAB.filter((t) => t.tep)) writeFileSync(join(ra, tab.tep), vietJson(duLieu[tab.ten]) + '\n');

// ---------- Báo cáo ----------
const NHAN = { loi: 'LỖI', canhBao: 'Cảnh báo', xemTay: 'Xem tay', ghiChu: 'Ghi chú' };
const THU_TU = ['loi', 'canhBao', 'xemTay', 'ghiChu'];
const noi = (m) => (m.tab ? `${m.tab}${m.dong ? ` dòng ${m.dong}` : ''}${m.khoa ? ` (${m.khoa})` : ''}: ` : '');
const dongBc = (m) => `  ${(m.nhap ? `${NHAN[m.muc]}, nháp` : NHAN[m.muc]).padEnd(14)} ${noi(m)}${m.noiDung}`;

console.log(`Nguồn: ${nguon}`);
console.log(`Đề cương: ${deCuong.map((d) => `HSK ${d.cap}`).join(', ') || 'chưa có tệp nào trong content/de-cuong'}`);
console.log(`CC-CEDICT: ${veCedict}`);
for (const buoc of Object.keys(TEN_BUOC).map(Number)) {
  const ds = baoCao.filter((m) => m.buoc === buoc);
  if (!ds.length) continue;
  console.log(`\n${TEN_BUOC[buoc]}`);
  const sap = (a, b) => a.nhap - b.nhap || THU_TU.indexOf(a.muc) - THU_TU.indexOf(b.muc);
  for (const m of [...ds].sort(sap)) console.log(dongBc(m));
}

console.log(`\nĐã ghi vào ${ra}:`);
for (const t of thongKe) console.log(`  ${t.tep.padEnd(17)} ${String(t.xuat).padStart(4)} dòng (đã kiểm tra ${t.daKiemTra}/${t.tong})`);
const dem = (muc, nhap) => baoCao.filter((m) => m.muc === muc && m.nhap === nhap).length;
console.log(`\nDòng đã kiểm tra: ${dem('loi', false)} lỗi, ${dem('canhBao', false)} cảnh báo, ${dem('xemTay', false)} cần xem tay.`);
console.log(`Dòng nháp: ${dem('loi', true)} lỗi, ${dem('canhBao', true)} cảnh báo, ${dem('xemTay', true)} cần xem tay.`);
process.exit(dem('loi', false) ? 1 : 0);
