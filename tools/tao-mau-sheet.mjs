#!/usr/bin/env node
// Sinh mẫu Google Sheet biên soạn nội dung (tools/mau/xinyu-noi-dung.xlsx) và tài liệu docs/mau-sheet.md
// từ tools/lib/cau-truc.mjs. Tab Tu, Chu, NguPhap điền sẵn danh sách HSK 1 của đề cương thi; tab Bai điền sẵn
// lộ trình ở tools/lo-trinh/hsk1.mjs.
//
// Cách dùng: node tools/tao-mau-sheet.mjs

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ghiXlsx } from './lib/bang-tinh.mjs';
import { TAB } from './lib/cau-truc.mjs';
import { dungTab, HUONG_DAN } from './lib/mau-sheet.mjs';
import { CUM } from './lo-trinh/hsk1.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const hsk1 = JSON.parse(readFileSync(join(GOC, 'content', 'de-cuong', 'hsk1.json'), 'utf8'));

// "数、（副）" như cách ghi của đề cương.
const tuLoai = (t) => [...t.tuLoai, ...(t.tuLoaiCapSau || []).map((s) => `（${s.tuLoai.join('、')}）`)].join('、');
const vietTay = new Map(hsk1.chuVietTay.map((c) => [c.chu, c]));

const dienSan = {
  Bai: CUM.flatMap((c) => c.bai).map((b, i) => ({
    ma: b.ma,
    trangThai: 'nháp',
    thuTu: i + 1,
    chang: b.ma.startsWith('PA') ? 'Nền phát âm' : 'HSK 1',
    chuDe: b.chuDe,
    mucTieu: b.mucTieu,
    tu: b.tu.join('、'),
    nguPhap: b.nguPhap.map((m) => `NP1-${m}`).join('、'),
  })),
  Tu: hsk1.tu.map((t) => ({ ma: `T${t.stt}`, trangThai: 'nháp', maDeCuong: t.stt, tu: t.tu, dongHinh: t.dongHinh, pinyin: t.pinyin, tuLoai: tuLoai(t), cap: t.cap })),
  Chu: hsk1.chuNhanBiet.map((c) => ({ chu: c.chu, trangThai: 'nháp', capNhanBiet: hsk1.cap, capVietTay: vietTay.has(c.chu) ? hsk1.cap : undefined })),
  NguPhap: hsk1.nguPhap.map((n) => ({
    ma: n.ma,
    trangThai: 'nháp',
    cap: hsk1.cap,
    deCuong: `${[n.loai, n.tieuLoai, n.muc].filter(Boolean).join(' › ')}${n.noiDung ? `: ${n.noiDung}` : ''}`,
  })),
};

const thuMuc = join(GOC, 'tools', 'mau');
mkdirSync(thuMuc, { recursive: true });
writeFileSync(join(thuMuc, 'xinyu-noi-dung.xlsx'), ghiXlsx(dungTab(dienSan)));

const KIEU = { so: 'số', ds: 'danh sách', co: 'đánh dấu x', ngay: 'ngày', cap: 'cấp' };
const md = [
  '# Mẫu Google Sheet biên soạn nội dung',
  '',
  '> Tệp này sinh từ `tools/lib/cau-truc.mjs` bằng `node tools/tao-mau-sheet.mjs`. Sửa cấu trúc ở đó rồi chạy lại để cập nhật cả tệp này và mẫu `tools/mau/xinyu-noi-dung.xlsx`.',
  '',
  'Theo mục 11.5 và 12.8 của [đặc tả](dac-ta.md). Công cụ xây nội dung: `node tools/xay-noi-dung.mjs <nguồn>`.',
  '',
  '## Tạo Google Sheet',
  '',
  '1. Tải `tools/mau/xinyu-noi-dung.xlsx` từ repo (trên GitHub: mở tệp, bấm Download raw file).',
  '2. Tải tệp lên Google Drive, mở bằng Google Trang tính, rồi chọn Tệp > Lưu dưới dạng Google Trang tính.',
  '3. Soạn trong Google Sheet đó. Tab HuongDan nhắc lại các quy ước dưới đây.',
  '',
  '## Quy ước',
  '',
  ...HUONG_DAN.map((h, i) => `${i + 1}. ${h}`),
  '',
  '## Kiểm tra khi xây',
  '',
  'Công cụ chạy các bước 1–4 của mục 11.6 và in báo cáo theo bước:',
  '',
  '- **Bước 1 — Đối chiếu đề cương:** từ, chữ, ngữ pháp khớp mã và cấp trong `content/de-cuong/`; bài không dùng từ, ngữ pháp của cấp cao hơn chặng.',
  '- **Bước 2 — Pinyin và CC-CEDICT:** tách được âm tiết, số âm tiết khớp số chữ, Pinyin gốc của từ khớp CC-CEDICT (khác ở thanh nhẹ chỉ ghi chú).',
  '- **Bước 3 — Từ trong câu và truyện:** câu chỉ dùng từ và tên riêng của các bài có thứ tự nhỏ hơn hoặc bằng bài của câu; truyện thêm tối đa 3 từ mới.',
  '- **Bước 4 — Cách ghi 一 và 不:** Pinyin hiển thị ghi đúng thanh biến; 一 giữ yī (số đếm, thứ tự, ngày giờ) được liệt kê để xem tay.',
  '',
  'Mức độ: **LỖI** chặn dòng khỏi bản xuất (và các dòng phụ thuộc vào nó, ví dụ bài có từ chưa xuất được); **Cảnh báo** và **Xem tay** không chặn; **Ghi chú** để biết. Ghi x ở cột Đã xem tay để tắt cảnh báo Pinyin của một dòng đã xem.',
  '',
  'Mỗi tab xuất ra một tệp trong `content/`. Các trường trống không được ghi.',
  '',
  '## Điền nội dung Claude soạn vào Sheet',
  '',
  'Nội dung Claude soạn nằm ở `tools/noi-dung/` (mỗi việc một tệp). Lệnh `node tools/dien-noi-dung.mjs <nguồn>` đọc Sheet hiện tại, điền nội dung đó vào và ghi tệp `tools/ra/xinyu-noi-dung.xlsx`:',
  '',
  '- Chỉ điền ô đang trống và thêm dòng chưa có; ô đã có chữ giữ nguyên, chỗ khác nhau được liệt kê trong báo cáo để xem.',
  '- Dòng mới có trạng thái “nháp”; cột Trạng thái của dòng đã có không bị đổi.',
  '- Cột riêng thêm bên phải được giữ; tab thiếu cột mới (khi cấu trúc đổi) được thêm cột.',
  '',
  'Nhập vào Google Sheet ngay sau khi tạo tệp (sửa Sheet sau thời điểm đó sẽ bị ghi đè): Tệp > Nhập > Tải lên, chọn tệp, chọn “Thay thế bảng tính”. Cần quay lại thì dùng Tệp > Nhật ký phiên bản.',
  '',
  ...TAB.flatMap((t) => [
    `## Tab ${t.ten} — ${t.tieuDe}${t.tep ? ` → \`content/${t.tep}\`` : ' (không xuất)'}`,
    '',
    '| Cột | Trường JSON | Kiểu | Bắt buộc | Mô tả |',
    '|---|---|---|---|---|',
    ...t.cot.map(
      (c) =>
        `| ${c.tieuDe} | ${c.xuat === false || !t.tep ? '—' : `\`${c.khoa}\``} | ${c.chon ? 'chọn' : KIEU[c.kieu] || 'chữ'} | ${c.batBuoc ? 'có' : ''} | ${[c.moTa, c.chon ? `Chọn: ${c.chon.join(', ')}.` : ''].filter(Boolean).join(' ')} |`,
    ),
    '',
  ]),
  '## Trường thêm khi xuất',
  '',
  '- `bai.json`: `cap` (số, bỏ trống với Nền phát âm), `tu` là mã từ thay cho chữ Hán, `cau` là mã các câu của bài theo thứ tự.',
  '- `tu.json`: `pinyinGoc` luôn có (tự sinh khi cột Pinyin gốc trống).',
  '- `cau.json`: `tu` là mã các từ đã học xuất hiện trong câu.',
  '- `bai.json`: `phatAm` là mã các mục phát âm của bài theo thứ tự (chỉ bài có mục ở tab PhatAm).',
  '- `cau-hoi.json`: `dapAnSai` là danh sách `{ dapAn, nhamVoi }` thay cho các cột Đáp án sai, Nhầm với; `amThanh` là `{ tu: mã từ }`, `{ cau: mã câu }` hoặc `{ amTiet, phatAm: mã mục phát âm }`.',
  '- `phat-am.json`: `viDu` là mã từ.',
  '- `cap-thanh.json`: `viDu` là mã từ.',
  '- `truyen.json`: `cap` theo bài ở cột Sau bài, `cau` là mã các câu của truyện theo thứ tự.',
  '',
];
writeFileSync(join(GOC, 'docs', 'mau-sheet.md'), md.join('\n'));
console.log('Đã ghi tools/mau/xinyu-noi-dung.xlsx và docs/mau-sheet.md');
