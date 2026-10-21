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
import { CUM } from './lo-trinh/hsk1.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const hsk1 = JSON.parse(readFileSync(join(GOC, 'content', 'de-cuong', 'hsk1.json'), 'utf8'));

const HUONG_DAN = [
  'Mỗi tab là một loại nội dung. Dòng đầu là tên cột: không đổi tên, không xóa cột; có thể thêm cột riêng ở bên phải.',
  'Cột Trạng thái: để “nháp” khi đang soạn, đổi sang “đã kiểm tra” sau khi tự xem lại. Công cụ chỉ xuất dòng “đã kiểm tra” và không có lỗi.',
  'Tab Tu, Chu, NguPhap đã điền sẵn danh sách HSK 1 của đề cương thi 11/2025 (300 từ, 246 chữ nhận biết, 70 điểm ngữ pháp); tab Bai điền sẵn 56 bài theo docs/lo-trinh-hsk1.md. Không đổi Mã, Mã đề cương, Từ, Cấp của các dòng này.',
  'Danh sách trong một ô (từ của bài, mã câu…) cách nhau bằng dấu phẩy, dấu 、 hoặc xuống dòng.',
  'Gọi một từ bằng chữ Hán như ở tab Tu (từ đồng hình thêm số, ví dụ 会1), một chữ bằng chính chữ đó; gọi bài, câu, câu hỏi, ngữ pháp bằng mã.',
  'Câu của bài hoặc truyện nằm ở tab Cau, cột Bài ghi mã bài hoặc mã truyện; thứ tự dòng là thứ tự câu. Câu chỉ được dùng từ đã học tính đến bài đó, tên riêng khai ở cột Tên riêng của tab Bai.',
  'Xây nội dung: Tệp > Tải xuống > Microsoft Excel (.xlsx), gửi tệp cho Claude để chạy node tools/xay-noi-dung.mjs <tệp>. Hoặc Tệp > Chia sẻ > Công bố lên web (Publish to web), chọn cả tài liệu và định dạng .xlsx, rồi dùng đường dẫn đó thay cho tệp.',
  'Tab CanSua: dán danh sách nội dung cần sửa xuất từ app (màn 29); ghi x ở cột Đã xử lý khi sửa xong.',
];

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

const tab = [
  {
    ten: 'HuongDan',
    xuongDong: true,
    doRong: [14, 22, 10, 90],
    dong: [
      ['Xinyu — Sheet biên soạn nội dung', '', '', ''],
      ...HUONG_DAN.map((h, i) => [`${i + 1}.`, '', '', h]),
      ['', '', '', ''],
      ['Tab', 'Cột', 'Bắt buộc', 'Mô tả'],
      ...TAB.flatMap((t) => [
        [t.ten, `(${t.tieuDe})`, '', ''],
        ...t.cot.map((c) => ['', c.tieuDe, c.batBuoc ? 'có' : '', [c.moTa, c.chon ? `Chọn: ${c.chon.join(', ')}.` : ''].filter(Boolean).join(' ')]),
      ]),
    ],
  },
  ...TAB.map((t) => ({
    ten: t.ten,
    doRong: t.cot.map((c) => c.rong || 12),
    dong: [t.cot.map((c) => c.tieuDe), ...(dienSan[t.ten] || []).map((o) => t.cot.map((c) => o[c.khoa] ?? ''))],
    danhSach: t.cot.map((c, i) => (c.chon ? { cot: i, giaTri: c.chon } : null)).filter(Boolean),
  })),
];

const thuMuc = join(GOC, 'tools', 'mau');
mkdirSync(thuMuc, { recursive: true });
writeFileSync(join(thuMuc, 'xinyu-noi-dung.xlsx'), ghiXlsx(tab));

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
  '- `cau-hoi.json`: `dapAnSai` là danh sách `{ dapAn, nhamVoi }` thay cho các cột Đáp án sai, Nhầm với.',
  '- `cap-thanh.json`: `viDu` là mã từ.',
  '- `truyen.json`: `cap` theo bài ở cột Sau bài, `cau` là mã các câu của truyện theo thứ tự.',
  '',
];
writeFileSync(join(GOC, 'docs', 'mau-sheet.md'), md.join('\n'));
console.log('Đã ghi tools/mau/xinyu-noi-dung.xlsx và docs/mau-sheet.md');
