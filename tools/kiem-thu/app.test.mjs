// Kiểm thử phần app chạy được bằng Node (không cần trình duyệt). Chạy: node --test 'tools/kiem-thu/*.test.mjs'
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { amThanhCauHoi, maAmTiet } from '../../app/js/am-thanh.mjs';
import { baiSau, baiTiepTheo, chuDeCuaChang, danhSachBai, hoatDongCuaBai, hoatDongTiep, nhanBai, tachY, trangThaiChang, xaoDapAn } from '../../app/js/bai-hoc.mjs';
import { cacVai, cauChonNghia, cauDienTu, cauHieuHoiThoai, chuoiDongVai, tachTenNguPhap, tenTuLoai } from '../../app/js/bai-tap.mjs';
import { BUOI_HOC, baiDenCap, cachNgay, capCoNoiDung, congNgay, uocTinh } from '../../app/js/ke-hoach.mjs';
import { maAmTiet as maAmTietCongCu } from '../lib/am-thanh.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const docNoiDung = (ten) => JSON.parse(readFileSync(join(GOC, 'content', `${ten}.json`), 'utf8'));
const loTrinh = docNoiDung('lo-trinh');
const tepTrong = (thuMuc) =>
  readdirSync(join(GOC, thuMuc)).flatMap((t) => {
    const p = join(GOC, thuMuc, t);
    return statSync(p).isDirectory() ? tepTrong(relative(GOC, p)) : [relative(GOC, p)];
  });

test('Kế hoạch: bài đến cấp mục tiêu, ước tính ngày xong và so với ngày thi', () => {
  const tatCa = baiDenCap(loTrinh, 1);
  assert.equal(tatCa.length, 56);
  assert.equal(tatCa[0].ma, 'PA01');
  assert.equal(tatCa[8].chang, 'HSK 1');
  assert.deepEqual(capCoNoiDung(loTrinh), [1]);
  // Khung 12 tuần (mục 4.3): 56 bài, 30 phút mỗi ngày → 84 ngày.
  assert.deepEqual(uocTinh({ soBai: 56, phutMoiNgay: 30, homNay: '2026-10-22' }), { soBai: 56, soNgay: 84, ngayXong: '2027-01-14' });
  const kip = uocTinh({ soBai: 56, phutMoiNgay: 30, homNay: '2026-10-22', ngayThi: '2027-03-01' });
  assert.equal(kip.kip, true);
  assert.equal(kip.phutCan, 30);
  const gap = uocTinh({ soBai: 56, phutMoiNgay: 15, homNay: '2026-10-22', ngayThi: '2026-12-31' });
  assert.deepEqual([gap.kip, gap.conNgay, gap.phutCan], [false, 70, 45]);
  assert.equal(uocTinh({ soBai: 56, phutMoiNgay: 45, homNay: '2026-10-22', ngayThi: '2026-11-01' }).phutCan, null);
  assert.equal(cachNgay('2026-12-31', '2027-01-01'), 1);
  assert.equal(congNgay('2027-02-28', 1), '2027-03-01');
  for (const [phut, ds] of Object.entries(BUOI_HOC)) assert.equal(ds.reduce((s, [p]) => s + p, 0), Number(phut));
});

test('Service worker lưu sẵn đủ tệp của app, font và nội dung', () => {
  const sw = readFileSync(join(GOC, 'sw.js'), 'utf8');
  const luuSan = JSON.parse(sw.match(/const LUU_SAN = (\[[\s\S]*?\]);/)[1].replace(/'/g, '"').replace(/,\s*\]/, ']'));
  const canCo = [
    ...tepTrong('app'),
    ...tepTrong('vendor/font').filter((t) => t.endsWith('.woff2') || t.endsWith('.css')),
    ...readdirSync(join(GOC, 'content')).filter((t) => t.endsWith('.json')).map((t) => `content/${t}`),
    'index.html',
    'manifest.webmanifest',
    'audio/danh-sach.json',
  ];
  assert.deepEqual(canCo.filter((t) => !luuSan.includes(t)), [], 'tệp chưa có trong LUU_SAN của sw.js');
  assert.deepEqual(luuSan.filter((t) => t !== './' && !existsSync(join(GOC, t))), [], 'LUU_SAN có tệp không tồn tại');
});

test('Manifest và biểu tượng', () => {
  const mf = JSON.parse(readFileSync(join(GOC, 'manifest.webmanifest'), 'utf8'));
  assert.equal(mf.display, 'standalone');
  for (const i of mf.icons) {
    const png = readFileSync(join(GOC, i.src));
    const [rong, cao] = [png.readUInt32BE(16), png.readUInt32BE(20)];
    assert.equal(`${rong}x${cao}`, i.sizes, i.src);
  }
  const html = readFileSync(join(GOC, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)"/g)) assert.ok(existsSync(join(GOC, m[1])), `index.html gọi ${m[1]}`);
});

test('Tranh mực dưới 150 KB và đúng tỉ lệ khung trong CSS (mục 12.7)', () => {
  const css = readFileSync(join(GOC, 'app', 'css', 'xinyu.css'), 'utf8');
  for (const [lop, tep] of [['tranh-lon', 'tranh-nui'], ['tranh-goc', 'tranh-goc']]) {
    const webp = readFileSync(join(GOC, 'app', 'hinh', `${tep}.webp`));
    assert.ok(webp.length <= 150_000, `${tep}.webp ${webp.length} byte`);
    // WebP nén mất dữ liệu (khối VP8): bề rộng, bề cao 14 bit ở byte 26 và 28.
    assert.equal(webp.toString('latin1', 12, 16), 'VP8 ', tep);
    const tiLe = (webp.readUInt16LE(26) & 0x3fff) / (webp.readUInt16LE(28) & 0x3fff);
    const [, a, b] = css.match(new RegExp(`\\.${lop} \\{[^}]*aspect-ratio: (\\d+) / (\\d+)`));
    assert.ok(Math.abs(tiLe / (a / b) - 1) < 0.01, `${tep}.webp tỉ lệ ${tiLe.toFixed(3)}, khung .${lop} ${a}/${b}`);
  }
});

test('Module của app đúng cú pháp và chỉ nhập tệp có thật', () => {
  for (const t of tepTrong('app').filter((x) => x.endsWith('.mjs'))) {
    const r = spawnSync(process.execPath, ['--check', join(GOC, t)]);
    assert.equal(r.status, 0, `${t}: ${r.stderr}`);
    for (const m of readFileSync(join(GOC, t), 'utf8').matchAll(/from '(\.[^']+)'/g)) assert.ok(existsSync(join(GOC, dirname(t), m[1])), `${t} nhập ${m[1]}`);
  }
  const r = spawnSync(process.execPath, ['--check', join(GOC, 'sw.js')]);
  assert.equal(r.status, 0, String(r.stderr));
});

test('Lộ trình: danh sách bài, bài tiếp theo, trạng thái chặng và chủ đề', () => {
  const baiNoiDung = docNoiDung('bai');
  const ds = danhSachBai(loTrinh, baiNoiDung);
  assert.equal(ds.length, 56);
  assert.deepEqual([ds[0].ma, ds[0].soThu, ds[0].coNoiDung], ['PA01', 1, true]);
  assert.deepEqual([ds[8].chang, ds[8].soThu, ds[8].coNoiDung], ['HSK 1', 1, baiNoiDung.some((b) => b.ma === ds[8].ma)]);
  assert.equal(nhanBai(ds[9]), 'HSK 1 · Bài 02');
  assert.equal(baiTiepTheo(ds, {}, 'PA01').ma, 'PA01');
  assert.equal(baiTiepTheo(ds, { PA01: { xong: 'x' }, PA02: { batDau: 'x' } }, 'PA01').ma, 'PA02');
  // Bắt đầu giữa lộ trình: học hết từ điểm bắt đầu rồi quay về các bài trước đó.
  const xongSau = Object.fromEntries(ds.slice(50).map((b) => [b.ma, { xong: 'x' }]));
  assert.equal(baiTiepTheo(ds, xongSau, ds[50].ma).ma, 'PA01');
  assert.equal(baiTiepTheo(ds, Object.fromEntries(ds.map((b) => [b.ma, { xong: 'x' }])), 'PA01'), null);
  assert.equal(baiSau(ds, 'PA08').chang, 'HSK 1');
  assert.equal(baiSau(ds, ds.at(-1).ma), null);

  const tienDo = Object.fromEntries(ds.slice(0, 8).map((b) => [b.ma, { xong: 'x' }]));
  const tiep = baiTiepTheo(ds, tienDo, 'PA01');
  const chang = trangThaiChang(ds, tienDo, tiep);
  assert.deepEqual(chang.slice(0, 3).map((c) => c.trangThai), ['xong', 'dang', 'khoa']);
  assert.equal(chang.length, 8);
  const chuDe = chuDeCuaChang(ds, 'HSK 1', tienDo, tiep);
  assert.equal(chuDe.reduce((s, c) => s + c.bai.length, 0), 48);
  assert.deepEqual(chuDe.map((c) => c.trangThai), ['dang', 'chua', 'chua', 'chua', 'chua']);
});

test('Bài học: hoạt động theo nội dung, ý của tài liệu tham chiếu, xáo đáp án', () => {
  const bai = Object.fromEntries(docNoiDung('bai').map((b) => [b.ma, b]));
  const cauHoi = docNoiDung('cau-hoi');
  const cua = (ma) => hoatDongCuaBai(bai[ma], cauHoi.filter((q) => q.bai === ma)).map((d) => d.khoa);
  assert.deepEqual(cua('PA01'), ['phat-am', 'kiem-tra']);
  assert.deepEqual(cua('PA06'), ['phat-am', 'cap-thanh', 'kiem-tra']);
  assert.deepEqual(cua('PA08'), ['nghe-doc', 'tu-vung', 'mau-cau', 'noi', 'kiem-tra']);
  for (const ma of Object.keys(bai)) assert.equal(cua(ma).at(-1), 'kiem-tra', `${ma} có kiểm tra mục tiêu bài`);
  const ds = hoatDongCuaBai(bai.PA08, []);
  assert.equal(hoatDongTiep(ds, { hoatDong: { 'nghe-doc': 'x' } }).khoa, 'tu-vung');
  assert.deepEqual(tachY('nghe nhận ra thanh; đọc liền được.'), ['Nghe nhận ra thanh', 'Đọc liền được']);
  for (const q of cauHoi) {
    const d = xaoDapAn(q, 12345);
    assert.deepEqual([...d].sort(), [q.dapAnDung, ...q.dapAnSai.map((s) => s.dapAn)].sort(), q.ma);
    assert.deepEqual(d, xaoDapAn(q, 12345));
  }
});

test('Bài luyện trong bài: chọn nghĩa, hiểu hội thoại, điền từ, vai, tên điểm ngữ pháp, loại từ', () => {
  const tu = docNoiDung('tu');
  const tuTheoMa = new Map(tu.map((t) => [t.ma, t]));
  const cauTheoMa = new Map(docNoiDung('cau').map((c) => [c.ma, c]));
  const bai = docNoiDung('bai').find((b) => b.ma === 'PA08');
  const tuBai = bai.tu.map((m) => tuTheoMa.get(m));
  const cauBai = bai.cau.map((m) => cauTheoMa.get(m));

  for (const [i, t] of tuBai.entries()) {
    const q = cauChonNghia(t, tuBai, tu, i);
    assert.equal(q.dapAn.length, 3, t.tu);
    assert.equal(new Set(q.dapAn).size, 3, t.tu);
    assert.ok(q.dapAn.includes(t.nghia));
    assert.deepEqual(cauChonNghia(t, tuBai, tu, i), q, 'cố định theo hạt');
  }
  // Bài chỉ có một từ: đáp án nhiễu lấy từ khác cùng cấp.
  assert.equal(cauChonNghia(tuBai[0], [tuBai[0]], tu, 3).dapAn.length, 3);

  const hieu = cauHieuHoiThoai(cauBai, 5);
  assert.equal(hieu.length, 3);
  assert.equal(new Set(hieu.map((x) => x.cau.chuHan)).size, 3, 'không hỏi trùng câu');
  for (const x of hieu) {
    assert.ok(x.dapAn.includes(x.dung));
    assert.equal(new Set(x.dapAn).size, x.dapAn.length);
  }
  assert.deepEqual(cauHieuHoiThoai(cauBai.slice(0, 2), 5), [], 'hai câu giống nhau thì không hỏi');

  for (const c of cauBai) {
    const d = cauDienTu(c, tuTheoMa, tuBai, tu, 1);
    assert.equal(d.truoc + d.dung + d.sau, c.chuHan, c.ma);
    assert.ok(d.dapAn.includes(d.dung) && d.dapAn.length === 3, c.ma);
  }
  assert.equal(cauDienTu({ chuHan: '好。', tu: ['T147'] }, tuTheoMa, tuBai, tu, 1), null);

  assert.deepEqual(cacVai(cauBai), ['A', 'B']);
  const ghi = {};
  assert.deepEqual(chuoiDongVai(cauBai.slice(0, 2), 'A', new Map([['CPA08-01', ghi]])), [{ blob: ghi }, { loai: 'cau', ma: 'CPA08-02' }]);

  const np = docNoiDung('ngu-phap').find((n) => n.ma === 'NP1-45');
  const tach = tachTenNguPhap(np.giaiThich);
  assert.equal(tach.ten, 'Câu không chủ vị (非主谓句)');
  assert.match(tach.giaiThich, /^Câu chỉ gồm/);
  assert.deepEqual(tachTenNguPhap('Dùng 是 để giới thiệu.'), { ten: null, giaiThich: 'Dùng 是 để giới thiệu.' });
  assert.equal(tenTuLoai('数量、（副）'), 'số lượng từ, (phó từ)');
  assert.equal(tenTuLoai('动、名'), 'động từ, danh từ');
});

test('Mỗi hoạt động đã dựng (viec null) có màn riêng; hoạt động còn lại mở màn chờ', async () => {
  const { manHoatDong } = await import('../../app/js/man/hoat-dong.mjs');
  const bai = Object.fromEntries(docNoiDung('bai').map((b) => [b.ma, b]));
  const cauHoi = docNoiDung('cau-hoi');
  for (const ma of Object.keys(bai)) {
    for (const d of hoatDongCuaBai(bai[ma], cauHoi.filter((q) => q.bai === ma))) {
      if (d.khoa === 'kiem-tra') continue;
      const ten = manHoatDong([ma, d.khoa]).tieuDe;
      if (d.viec) assert.equal(ten, 'Bài học', `${ma} ${d.khoa} còn chờ ${d.viec}`);
      else assert.notEqual(ten, 'Bài học', `${ma} ${d.khoa} cần màn ${d.man}`);
    }
  }
  assert.equal(manHoatDong(['PA08', 'noi', 'dong-vai']).tieuDe, 'Đóng vai');
});

test('Âm thanh: tên tệp âm tiết giống công cụ, câu hỏi nghe có tệp', () => {
  const danhSach = JSON.parse(readFileSync(join(GOC, 'audio', 'danh-sach.json'), 'utf8'));
  const amTiet = [...new Set(docNoiDung('phat-am').flatMap((p) => p.amTiet || []))];
  assert.ok(amTiet.length > 100);
  for (const a of [...amTiet, 'lǜ', 'nǚ', 'ma', 'er']) assert.equal(maAmTiet(a), maAmTietCongCu(a), a);
  for (const q of docNoiDung('cau-hoi').filter((c) => c.kyNang === 'nghe')) {
    const a = amThanhCauHoi(q);
    assert.ok(a?.ma && danhSach[a.loai][a.ma], `${q.ma}: chưa có âm thanh ${JSON.stringify(q.amThanh)}`);
  }
});
