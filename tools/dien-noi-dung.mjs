#!/usr/bin/env node
// Điền nội dung Claude soạn (tools/noi-dung/*.mjs) vào Google Sheet biên soạn: đọc Sheet hiện tại, chỉ điền ô
// trống và thêm dòng chưa có, rồi ghi tools/ra/xinyu-noi-dung.xlsx để nhập lại vào Sheet (Tệp > Nhập >
// Thay thế bảng tính). Sau đó chạy thử bước kiểm tra 11.6 trên các dòng vừa soạn, coi như đã kiểm tra.
//
// Cách dùng: node tools/dien-noi-dung.mjs <nguồn> [--ra <tệp .xlsx>] [--cedict <tệp>] [--khong-cedict]
//   <nguồn>  như tools/xay-noi-dung.mjs: tệp .xlsx, thư mục CSV hoặc đường dẫn “Công bố lên web” dạng .xlsx.
// Mã thoát 1 khi nội dung soạn có lỗi (không ghép được hoặc không qua kiểm tra).

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ghiXlsx } from './lib/bang-tinh.mjs';
import { napCedict } from './lib/cedict.mjs';
import { chayThu, dienNoiDung } from './lib/dien.mjs';
import { dungTab } from './lib/mau-sheet.mjs';
import { docNguon, quaProxy } from './lib/nguon.mjs';
import { TEN_BUOC } from './lib/xay-dung.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');

await quaProxy();

const thamSo = process.argv.slice(2);
const lay = (ten) => {
  const i = thamSo.indexOf(ten);
  return i >= 0 ? thamSo.splice(i, 2)[1] : undefined;
};
const ra = lay('--ra') || join(GOC, 'tools', 'ra', 'xinyu-noi-dung.xlsx');
const tepCedict = lay('--cedict');
const khongCedict = thamSo.includes('--khong-cedict') && thamSo.splice(thamSo.indexOf('--khong-cedict'), 1);
const [nguon] = thamSo;
if (!nguon) {
  console.error('Cách dùng: node tools/dien-noi-dung.mjs <tệp .xlsx | thư mục CSV | đường dẫn .xlsx> [--ra <tệp .xlsx>] [--cedict <tệp>] [--khong-cedict]');
  process.exit(2);
}

// ---------- Nội dung soạn ----------
const thuMucNoiDung = join(GOC, 'tools', 'noi-dung');
const noiDung = {};
const tepNoiDung = readdirSync(thuMucNoiDung).filter((t) => t.endsWith('.mjs')).sort();
for (const t of tepNoiDung) {
  const { NOI_DUNG } = await import(pathToFileURL(join(thuMucNoiDung, t)));
  for (const [tab, ds] of Object.entries(NOI_DUNG || {})) (noiDung[tab] ||= []).push(...ds);
}

let bang;
try {
  bang = await docNguon(nguon);
} catch (e) {
  console.error(`Không đọc được nguồn: ${e.message}`);
  process.exit(2);
}

const { dong, cotRieng, tabKhac, baoCao } = dienNoiDung({ bang, noiDung });
const tab = [...dungTab(dong, cotRieng), ...tabKhac.map((ten) => ({ ten, dong: bang.get(ten) }))];
mkdirSync(dirname(ra), { recursive: true });
writeFileSync(ra, ghiXlsx(tab));

console.log(`Nguồn: ${nguon}`);
console.log(`Nội dung soạn: ${tepNoiDung.map((t) => `tools/noi-dung/${t}`).join(', ') || 'chưa có tệp nào'}`);
const NHAN = { loi: 'LỖI', khac: 'Khác Sheet', ghiChu: 'Ghi chú' };
console.log('\nGhép vào Sheet');
for (const m of baoCao) console.log(`  ${NHAN[m.muc].padEnd(11)} ${m.tab ? `${m.tab}${m.khoa ? ` ${m.khoa}` : ''}: ` : ''}${m.noiDung}`);

// ---------- Chạy thử kiểm tra trên các dòng vừa soạn ----------
const thuMucDeCuong = join(GOC, 'content', 'de-cuong');
const deCuong = existsSync(thuMucDeCuong)
  ? readdirSync(thuMucDeCuong)
      .filter((t) => /^hsk\d+\.json$/.test(t))
      .map((t) => JSON.parse(readFileSync(join(thuMucDeCuong, t), 'utf8')))
      .sort((a, b) => a.cap - b.cap)
  : [];
let cedict = null;
if (!khongCedict) {
  const k = await napCedict(tepCedict);
  cedict = k.tra || null;
  if (!cedict) console.log(`\nCC-CEDICT: không nạp được (${k.loi}); bỏ qua phần đối chiếu từ điển`);
}
const { soDong, baoCao: cuaSoan } = chayThu({ dong, cotRieng, noiDung, deCuong, cedict });
console.log('\nChạy thử kiểm tra trên các dòng vừa soạn (coi như đã kiểm tra)');
for (const buoc of Object.keys(TEN_BUOC).map(Number)) {
  for (const m of cuaSoan.filter((x) => x.buoc === buoc)) console.log(`  ${TEN_BUOC[buoc].split(' — ')[0].padEnd(8)} ${m.muc === 'loi' ? 'LỖI' : m.muc === 'xemTay' ? 'Xem tay' : 'Cảnh báo'}  ${m.tab} ${m.khoa}: ${m.noiDung}`);
}
const soLoi = cuaSoan.filter((m) => m.muc === 'loi').length;
console.log(`  ${soDong} dòng soạn: ${soLoi} lỗi, ${cuaSoan.length - soLoi} cảnh báo hoặc cần xem tay.`);
console.log(`\nĐã ghi ${ra}. Nhập vào Google Sheet: Tệp > Nhập > Tải lên > Thay thế bảng tính.`);
process.exit(soLoi || baoCao.some((m) => m.muc === 'loi') ? 1 : 0);
