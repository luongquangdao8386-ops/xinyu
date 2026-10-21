// Kiểm thử công cụ biên soạn. Chạy: node --test tools/kiem-thu/
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { docCsv, docXlsx, ghiXlsx } from '../lib/bang-tinh.mjs';
import { TAB } from '../lib/cau-truc.mjs';
import { kiemTraYiBu, sinhPinyinGoc, soHoa, tachAmTiet } from '../lib/pinyin.mjs';
import { phanTu, xayNoiDung } from '../lib/xay-dung.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const hsk1 = JSON.parse(readFileSync(join(GOC, 'content', 'de-cuong', 'hsk1.json'), 'utf8'));

test('CSV: ngoặc kép, dấu phẩy và xuống dòng trong ô', () => {
  assert.deepEqual(docCsv('﻿a,"b, ""c"""\r\n"x\ny",2\n'), [['a', 'b, "c"'], ['x\ny', '2']]);
});

test('XLSX: ghi rồi đọc lại giữ nguyên chữ, số và ô trống', () => {
  const dong = [['Mã', 'Từ', 'Ghi chú'], ['T1', '你好 & <a>', ''], [7, '', 'cuối']];
  const doc = docXlsx(ghiXlsx([{ ten: 'Tu', dong, danhSach: [{ cot: 0, giaTri: ['x', 'y'] }] }]));
  assert.deepEqual(doc.get('Tu'), [['Mã', 'Từ', 'Ghi chú'], ['T1', '你好 & <a>'], ['7', '', 'cuối']]);
});

test('Pinyin: tách âm tiết, âm cuốn lưỡi, dấu nháy', () => {
  assert.equal(soHoa(tachAmTiet("yìdiǎnr").ds), 'yi4 dian3 r5');
  assert.equal(soHoa(tachAmTiet("Nǚ'ér").ds), 'nu:3 er2');
  assert.equal(soHoa(tachAmTiet('zhèr').ds), 'zhe4 r5');
  assert.equal(soHoa(tachAmTiet('Tiān’ānmén, xièxie!').ds), 'tian1 an1 men2 xie4 xie5');
  assert.ok(tachAmTiet('xyz').loi.length);
});

test('Pinyin gốc trả 一 và 不 về thanh gốc', () => {
  assert.equal(sinhPinyinGoc('不客气', 'bú kèqi').pinyinGoc, 'bù kèqi');
  assert.equal(sinhPinyinGoc('有一点儿', 'yǒu(yì)diǎnr').pinyinGoc, 'yǒu(yī)diǎnr');
  assert.equal(sinhPinyinGoc('你好', 'nǐ hǎo').pinyinGoc, 'nǐ hǎo');
});

test('Cách ghi 一 và 不', () => {
  const muc = (c, p) => kiemTraYiBu(c, p).map((f) => f.muc);
  assert.deepEqual(muc('我不是学生。', 'Wǒ bú shì xuésheng.'), []);
  assert.deepEqual(muc('我不是学生。', 'Wǒ bù shì xuésheng.'), ['canhBao']);
  assert.deepEqual(muc('他去不去？', 'Tā qù bu qù?'), []);
  assert.deepEqual(muc('一起', 'yìqǐ'), []);
  assert.deepEqual(muc('一起', 'yíqǐ'), ['canhBao']);
  assert.deepEqual(muc('第一', 'dì-yī'), []);
  assert.deepEqual(muc('一杯茶', 'yī bēi chá'), ['xemTay']);
  assert.deepEqual(muc('看一看', 'kàn yi kàn'), []);
  assert.deepEqual(muc('不一定', 'bù yídìng'), []);
  assert.deepEqual(muc('一', 'yì'), ['canhBao']);
});

test('Tách câu theo từ đã học', () => {
  const tap = new Set(['我', '是', '学生', '王小明', '叫']);
  assert.deepEqual(phanTu('我是学生。我叫王小明。', tap), { tu: ['我', '是', '学生', '我', '叫', '王小明'], la: [] });
  assert.deepEqual(phanTu('我是越南人。', tap).la, ['越南人']);
});

// Dựng bảng từ các đối tượng ghi theo tên trường JSON.
const bangTu = (du) =>
  new Map(
    TAB.map((t) => [t.ten, [t.cot.map((c) => c.tieuDe), ...(du[t.ten] || []).map((o) => t.cot.map((c) => (o[c.khoa] ?? '') + ''))]]),
  );
const DA = 'đã kiểm tra';
const tu = (stt, nghia, them = {}) => {
  const d = hsk1.tu.find((t) => t.stt === stt);
  return { ma: `T${stt}`, trangThai: DA, maDeCuong: stt, tu: d.tu, pinyin: d.pinyin, nghia, cap: d.cap, ...them };
};
const CEDICT = new Map(
  Object.entries({
    你: ['ni3'], 好: ['hao3', 'hao4'], 你好: ['ni3 hao3'], 我: ['wo3'], 是: ['shi4'], 学生: ['xue2 sheng5'],
    叫: ['jiao4'], 一下: ['yi1 xia4'], 不: ['bu4'], 半: ['ban4'], 老师: ['lao3 shi1'],
  }),
);

const ketQua = xayNoiDung({
  deCuong: [hsk1],
  cedict: CEDICT,
  bang: bangTu({
    Bai: [
      { ma: 'PA01', trangThai: DA, thuTu: 1, chang: 'Nền phát âm', chuDe: 'Chào hỏi', mucTieu: 'Chào', tu: '你, 好, 你好' },
      { ma: 'H1-01', trangThai: DA, thuTu: 2, chang: 'HSK 1', chuDe: 'Giới thiệu', mucTieu: 'Nói tên', tu: '我、是、不、学生、叫', chu: '我', nguPhap: 'NP1-09', tenRieng: '王小明' },
      { ma: 'H1-02', trangThai: DA, thuTu: 3, chang: 'HSK 1', chuDe: 'Số', mucTieu: 'Đếm', tu: '一下, 老师' },
      { ma: 'H1-03', trangThai: DA, thuTu: 4, chang: 'HSK 1', chuDe: 'Quê', mucTieu: 'Nói quê', tu: '越南' },
    ],
    Tu: [
      tu(146, 'bạn'), tu(72, 'tốt'), tu(147, 'xin chào'), tu(221, 'tôi'), tu(186, 'là'), tu(13, 'không'),
      tu(249, 'học sinh'), tu(88, 'gọi, tên là'), tu(259, 'một chút'), tu(7, 'một nửa', { cap: 2 }),
      tu(107, 'giáo viên', { trangThai: 'nháp' }),
    ],
    Chu: [{ chu: '我', trangThai: DA, capNhanBiet: 1, capVietTay: 1 }],
    NguPhap: [
      { ma: 'NP1-09', trangThai: DA, cap: 1, mauCau: '我、你、他', giaiThich: 'Đại từ nhân xưng' },
      { ma: 'NP1-99', trangThai: DA, cap: 1, mauCau: '…', giaiThich: '…' },
    ],
    Cau: [
      { ma: 'C1', trangThai: DA, bai: 'PA01', chuHan: '你好！', pinyin: 'Nǐ hǎo!', nghia: 'Xin chào!' },
      { ma: 'C4', trangThai: DA, bai: 'PA01', chuHan: '我是学生。', pinyin: 'Wǒ shì xuésheng.', nghia: 'Tôi là học sinh.' },
      { ma: 'C2', trangThai: DA, bai: 'H1-01', chuHan: '我是学生。', pinyin: 'Wǒ shì xuésheng.', nghia: 'Tôi là học sinh.' },
      { ma: 'C3', trangThai: DA, bai: 'H1-01', chuHan: '我不是学生。', pinyin: 'Wǒ bù shì xuésheng.', nghia: 'Tôi không phải học sinh.' },
      { ma: 'C5', trangThai: DA, bai: 'H1-01', chuHan: '我叫王小明。', pinyin: 'Wǒ jiào Wáng Xiǎomíng.', nghia: 'Tôi tên là Vương Tiểu Minh.' },
      { ma: 'C6', trangThai: DA, bai: 'TR1', chuHan: '我是老师。', pinyin: 'Wǒ shì lǎoshī.', nghia: 'Tôi là giáo viên.' },
    ],
    CauHoi: [
      { ma: 'Q1', trangThai: DA, bai: 'H1-01', dangBai: 'Chọn nghĩa', kyNang: 'đọc', diemKienThuc: '学生', noiDung: '学生 nghĩa là gì?', dapAnDung: 'học sinh', dapAnSai1: 'giáo viên', nhamVoi1: '老师' },
    ],
    CapThanh: [
      { ma: 'CT33', trangThai: DA, toHop: '3-3', cachDoc: '2-3', viDu: '你好' },
      { ma: 'CT11', trangThai: DA, toHop: '1-1', viDu: '你好' },
    ],
    CapDeNham: [{ ma: 'DN1', trangThai: DA, cacMuc: '我', giaiThich: '…' }],
    Truyen: [
      { ma: 'TR1', trangThai: DA, sauBai: 'H1-01', tieuDe: 'Thầy giáo', tuMoi: '老师' },
      { ma: 'TR2', trangThai: DA, sauBai: 'H1-01', tieuDe: 'Quá nhiều từ mới', tuMoi: '老师, 医生, 医院, 朋友' },
    ],
  }),
});
const { duLieu, baoCao } = ketQua;
const maXuat = (tab) => duLieu[tab].map((o) => o.ma ?? o.chu);
const coBaoCao = (muc, buoc, khoa, chua) => baoCao.some((m) => m.muc === muc && m.buoc === buoc && m.khoa === khoa && m.noiDung.includes(chua));

test('Bước 1: từ sai cấp, ngữ pháp ngoài đề cương', () => {
  assert.ok(coBaoCao('loi', 1, 'T7', 'sai cấp'));
  assert.ok(coBaoCao('loi', 1, 'NP1-99', 'không có trong đề cương'));
  assert.deepEqual(maXuat('NguPhap'), ['NP1-09']);
});

test('Bước 3: câu dùng từ chưa học bị chặn, tên riêng và từ mới của truyện được nhận', () => {
  assert.ok(coBaoCao('loi', 3, 'C4', '我'));
  assert.deepEqual(maXuat('Cau'), ['C1', 'C2', 'C3', 'C5', 'C6']);
  assert.deepEqual(duLieu.Cau.find((c) => c.ma === 'C5').tu, ['T221', 'T88']);
  assert.ok(coBaoCao('loi', 3, 'TR2', '4 từ mới'));
});

test('Bước 4: 不 trước thanh 4 phải ghi bú', () => {
  assert.ok(coBaoCao('canhBao', 4, 'C3', 'bú'));
  assert.equal(duLieu.Tu.find((t) => t.ma === 'T259').pinyinGoc, 'yīxià');
});

test('Phụ thuộc: bài chỉ xuất khi mọi từ, câu của bài xuất được', () => {
  assert.deepEqual(maXuat('Bai'), ['H1-01']);
  assert.ok(coBaoCao('loi', 0, 'PA01', 'Cau C4'));
  assert.ok(coBaoCao('loi', 0, 'H1-02', 'Tu T107'));
  assert.ok(coBaoCao('loi', 0, 'H1-03', '越南'));
  const h101 = duLieu.Bai[0];
  assert.equal(h101.cap, 1);
  assert.deepEqual(h101.tu, ['T221', 'T186', 'T13', 'T249', 'T88']);
  assert.deepEqual(h101.cau, ['C2', 'C3', 'C5']);
});

test('Truyện, câu hỏi, cặp thanh, cặp dễ nhầm', () => {
  assert.deepEqual(duLieu.Truyen, [{ ma: 'TR1', sauBai: 'H1-01', tieuDe: 'Thầy giáo', tuMoi: ['老师'], cap: 1, cau: ['C6'] }]);
  assert.deepEqual(duLieu.CauHoi[0].dapAnSai, [{ dapAn: 'giáo viên', nhamVoi: '老师' }]);
  assert.deepEqual(maXuat('CapThanh'), ['CT33', 'CT11']);
  assert.ok(coBaoCao('canhBao', 2, 'CT11', '3-3'));
  assert.ok(coBaoCao('loi', 0, 'DN1', 'hai mục'));
});

test('Mẫu Sheet trong repo khớp cấu trúc và không có lỗi', () => {
  const bang = docXlsx(readFileSync(join(GOC, 'tools', 'mau', 'xinyu-noi-dung.xlsx')));
  const { baoCao, thongKe } = xayNoiDung({ bang, deCuong: [hsk1] });
  assert.deepEqual(baoCao.filter((m) => m.muc === 'loi' || m.muc === 'canhBao'), []);
  assert.deepEqual(
    thongKe.filter((t) => t.tong).map((t) => [t.tab, t.tong, t.xuat]),
    [['Tu', 300, 0], ['Chu', 246, 0], ['NguPhap', 70, 0]],
  );
});

test('Dòng lệnh: đọc thư mục CSV và ghi JSON', () => {
  const thu = mkdtempSync(join(tmpdir(), 'xinyu-'));
  const tab = bangTu({ Tu: [tu(221, 'tôi')] });
  const csv = (dong) => dong.map((h) => h.map((o) => `"${String(o).replace(/"/g, '""')}"`).join(',')).join('\n');
  writeFileSync(join(thu, 'Xinyu - Tu.csv'), csv(tab.get('Tu')));
  execFileSync(process.execPath, [join(GOC, 'tools', 'xay-noi-dung.mjs'), thu, '--ra', join(thu, 'ra'), '--khong-cedict'], { stdio: 'pipe' });
  const xuat = JSON.parse(readFileSync(join(thu, 'ra', 'tu.json'), 'utf8'));
  assert.deepEqual(xuat, [{ ma: 'T221', maDeCuong: 221, tu: '我', pinyin: 'wǒ', nghia: 'tôi', cap: 1, pinyinGoc: 'wǒ' }]);
});
