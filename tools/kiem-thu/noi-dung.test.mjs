// Kiểm thử tab PhatAm, cột Âm thanh của câu hỏi, công cụ điền nội dung và nội dung đã soạn trong tools/noi-dung/.
// Chạy: node --test tools/kiem-thu/
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { docXlsx } from '../lib/bang-tinh.mjs';
import { TAB } from '../lib/cau-truc.mjs';
import { chayThu, dienNoiDung } from '../lib/dien.mjs';
import { xayNoiDung } from '../lib/xay-dung.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const hsk1 = JSON.parse(readFileSync(join(GOC, 'content', 'de-cuong', 'hsk1.json'), 'utf8'));
const DA = 'đã kiểm tra';

const bangTu = (du) =>
  new Map(TAB.map((t) => [t.ten, [t.cot.map((c) => c.tieuDe), ...(du[t.ten] || []).map((o) => t.cot.map((c) => (o[c.khoa] ?? '') + ''))]]));

test('PhatAm: âm tiết, chữ đọc mẫu, bài; câu hỏi nghe tìm được âm thanh', () => {
  const tu = hsk1.tu.find((t) => t.tu === '你好');
  const { duLieu, baoCao } = xayNoiDung({
    deCuong: [hsk1],
    cedict: new Map([['妈', ['ma1']], ['八', ['ba1']]]),
    bang: bangTu({
      Bai: [
        { ma: 'PA01', trangThai: DA, thuTu: 1, chang: 'Nền phát âm', chuDe: 'Thanh', mucTieu: 'Nghe thanh' },
        { ma: 'H1-01', trangThai: DA, thuTu: 2, chang: 'HSK 1', chuDe: 'Chào', mucTieu: 'Chào', tu: '你好' },
      ],
      Tu: [{ ma: `T${tu.stt}`, trangThai: DA, maDeCuong: tu.stt, tu: '你好', pinyin: tu.pinyin, nghia: 'xin chào', cap: 1 }],
      PhatAm: [
        { ma: 'PA01-01', trangThai: DA, bai: 'PA01', loai: 'thanh điệu', kyHieu: 'Thanh 1', cachDoc: 'cao, phẳng', amTiet: 'mā, bā', chuDoc: '妈, 八', viDu: '你好' },
        { ma: 'PA01-02', trangThai: DA, bai: 'PA01', loai: 'thanh điệu', kyHieu: 'Thanh 2', cachDoc: 'đi lên', amTiet: 'má, xyz' },
        { ma: 'PA01-03', trangThai: DA, bai: 'PA01', loai: 'thanh điệu', kyHieu: 'Thanh 3', cachDoc: 'xuống lên', amTiet: 'mǎ, bǎ', chuDoc: '妈' },
        { ma: 'PA01-04', trangThai: DA, bai: 'PA01', loai: 'thanh điệu', kyHieu: 'Thanh 4', cachDoc: 'rơi', amTiet: 'mà', chuDoc: '八' },
        { ma: 'PA01-05', trangThai: DA, bai: 'H1-01', loai: 'âm', kyHieu: 'x', cachDoc: 'x' },
      ],
      CauHoi: [
        { ma: 'Q1', trangThai: DA, bai: 'PA01', dangBai: 'Nghe chọn âm tiết', kyNang: 'nghe', diemKienThuc: 'PA01-01', noiDung: 'Nghe', amThanh: 'bā', dapAnDung: 'bā' },
        { ma: 'Q2', trangThai: DA, bai: 'PA01', dangBai: 'Nghe chọn âm tiết', kyNang: 'nghe', noiDung: 'Nghe', amThanh: 'pā', dapAnDung: 'pā' },
        { ma: 'Q3', trangThai: DA, bai: 'H1-01', dangBai: 'Nghe từ', kyNang: 'nghe', noiDung: 'Nghe', amThanh: '你好', dapAnDung: 'xin chào' },
        { ma: 'Q4', trangThai: DA, bai: 'PA01', dangBai: 'Nghe chọn âm tiết', kyNang: 'nghe', noiDung: 'Nghe', dapAnDung: 'mā' },
      ],
    }),
  });
  const co = (muc, khoa, chua) => baoCao.some((m) => m.muc === muc && m.khoa === khoa && m.noiDung.includes(chua));
  assert.ok(co('loi', 'PA01-02', 'xyz'));
  assert.ok(co('loi', 'PA01-03', 'Chữ đọc mẫu có 1 chữ'));
  assert.ok(co('canhBao', 'PA01-04', 'không đọc mà'));
  assert.ok(co('loi', 'PA01-05', 'chỉ nhận'));
  assert.ok(co('canhBao', 'PA01-05', 'không thuộc chặng Nền phát âm'));
  assert.ok(co('loi', 'Q2', 'pā'));
  assert.ok(co('canhBao', 'Q4', 'chưa ghi cột Âm thanh'));
  assert.deepEqual(duLieu.PhatAm.map((p) => p.ma), ['PA01-01', 'PA01-04']);
  assert.deepEqual(duLieu.PhatAm[0].viDu, [`T${tu.stt}`]);
  assert.deepEqual(duLieu.CauHoi.find((q) => q.ma === 'Q1').amThanh, { amTiet: 'bā', phatAm: 'PA01-01' });
  assert.deepEqual(duLieu.CauHoi.find((q) => q.ma === 'Q3').amThanh, { tu: `T${tu.stt}` });
  // PA01 có mục phát âm lỗi nên không xuất; PA01-05 ghi bài H1-01 và có lỗi nên chặn cả H1-01.
  assert.deepEqual(duLieu.Bai.map((b) => b.ma), []);
});

test('Điền nội dung: chỉ điền ô trống, giữ chữ trên Sheet, thêm dòng và cột', () => {
  const bang = new Map([
    ['Bai', [['Mã', 'Trạng thái', 'Thứ tự', 'Chủ đề', 'Ghi chú riêng'], ['PA01', DA, '1.0', 'Thanh', 'của tôi']]],
    ['Tu', [['Mã', 'Trạng thái', 'Từ', 'Số đồng hình', 'Nghĩa'], ['T88', 'nháp', '会', '1.0', ''], ['T221', 'nháp', '我', '', 'tôi']]],
    ['TabRieng', [['a'], ['b']]],
  ]);
  const { dong, cotRieng, tabKhac, baoCao } = dienNoiDung({
    bang,
    noiDung: {
      Bai: [{ ma: 'PA01', chuDe: 'Bốn thanh', mucTieu: 'Nghe thanh', trangThai: 'nháp' }, { ma: 'PA02', chuDe: 'Âm đầu', tu: ['你', '好'] }],
      Tu: [{ tu: '会', dongHinh: 1, nghia: 'biết' }, { tu: '我', nghia: 'tôi' }, { tu: '他', nghia: 'anh ấy' }, { tu: '会', dongHinh: 1, cauViDu: ['C1'] }, { tu: '我', nghia: 'ta' }],
    },
  });
  assert.deepEqual(dong.Bai[0], { ma: 'PA01', trangThai: DA, thuTu: 1, chuDe: 'Thanh', mucTieu: 'Nghe thanh', '+Ghi chú riêng': 'của tôi' });
  assert.deepEqual(dong.Bai[1], { trangThai: 'nháp', ma: 'PA02', chuDe: 'Âm đầu', tu: '你、好' });
  // Hai chỗ soạn cùng một từ được gộp; ghi khác nhau ở cùng một trường là lỗi.
  assert.equal(dong.Tu[0].nghia, 'biết');
  assert.equal(dong.Tu[0].cauViDu, 'C1');
  assert.deepEqual(cotRieng.Bai, ['Ghi chú riêng']);
  assert.deepEqual(tabKhac, ['TabRieng']);
  const co = (muc, chua) => baoCao.some((m) => m.muc === muc && m.noiDung.includes(chua));
  assert.ok(co('khac', 'Sheet ghi “Thanh”'));
  assert.ok(co('loi', 'không tìm thấy từ 他'));
  assert.ok(co('loi', 'hai chỗ soạn ghi khác nhau ở trường nghia: “tôi” và “ta”'));
  assert.ok(co('ghiChu', 'thêm cột Chặng'));
  assert.ok(co('ghiChu', 'Sheet chưa có tab này'));
});

test('Nội dung đã soạn (tools/noi-dung/) ghép vào mẫu Sheet và qua kiểm tra không lỗi', async () => {
  const noiDung = {};
  const thuMuc = join(GOC, 'tools', 'noi-dung');
  for (const t of readdirSync(thuMuc).filter((x) => x.endsWith('.mjs')).sort()) {
    const { NOI_DUNG } = await import(pathToFileURL(join(thuMuc, t)));
    for (const [tab, ds] of Object.entries(NOI_DUNG)) (noiDung[tab] ||= []).push(...ds);
  }
  const bang = docXlsx(readFileSync(join(GOC, 'tools', 'mau', 'xinyu-noi-dung.xlsx')));
  const ghep = dienNoiDung({ bang, noiDung });
  assert.deepEqual(ghep.baoCao.filter((m) => m.muc !== 'ghiChu'), []);
  const { soDong, baoCao, duLieu } = chayThu({ ...ghep, noiDung, deCuong: [hsk1] });
  assert.deepEqual(baoCao.filter((m) => m.muc === 'loi' || m.muc === 'canhBao'), []);
  assert.equal(duLieu.Bai.length, 18);
  assert.ok(soDong >= 200);
  for (const b of duLieu.Bai.filter((x) => /^PA0[1-7]$/.test(x.ma))) assert.ok(b.phatAm?.length, `bài ${b.ma} chưa có mục phát âm`);
  // Bài HSK 1 có hội thoại đủ hai vai (đóng vai, 09B), mỗi điểm ngữ pháp của bài có ví dụ, có câu hỏi kiểm tra (42).
  for (const b of duLieu.Bai.filter((x) => x.chang === 'HSK 1')) {
    const cau = duLieu.Cau.filter((c) => b.cau?.includes(c.ma));
    assert.ok(new Set(cau.map((c) => c.vai)).size >= 2, `bài ${b.ma} chưa có hội thoại hai vai`);
    for (const m of b.nguPhap || []) assert.ok(duLieu.NguPhap.find((n) => n.ma === m)?.viDu?.length, `ngữ pháp ${m} chưa có ví dụ`);
    assert.ok(duLieu.CauHoi.filter((q) => q.bai === b.ma).length >= 5, `bài ${b.ma} có ít hơn 5 câu hỏi`);
  }
  // Đủ 20 cặp thanh: 16 tổ hợp của bốn thanh và 4 tổ hợp có thanh nhẹ ở sau (mục 5.7).
  const toHop = new Set(duLieu.CapThanh.map((c) => c.toHop));
  for (const a of [1, 2, 3, 4]) for (const b of [0, 1, 2, 3, 4]) assert.ok(toHop.has(`${a}-${b}`), `thiếu cặp ${a}-${b}`);
  // Câu hỏi nghe nào cũng có âm thanh.
  assert.deepEqual(duLieu.CauHoi.filter((q) => q.kyNang === 'nghe' && !q.amThanh).map((q) => q.ma), []);
});
