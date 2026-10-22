// Kiểm thử phần app chạy được bằng Node (không cần trình duyệt). Chạy: node --test 'tools/kiem-thu/*.test.mjs'
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { BUOI_HOC, baiDenCap, cachNgay, capCoNoiDung, congNgay, uocTinh } from '../../app/js/ke-hoach.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const loTrinh = JSON.parse(readFileSync(join(GOC, 'content', 'lo-trinh.json'), 'utf8'));
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

test('Module của app đúng cú pháp và chỉ nhập tệp có thật', () => {
  for (const t of tepTrong('app').filter((x) => x.endsWith('.mjs'))) {
    const r = spawnSync(process.execPath, ['--check', join(GOC, t)]);
    assert.equal(r.status, 0, `${t}: ${r.stderr}`);
    for (const m of readFileSync(join(GOC, t), 'utf8').matchAll(/from '(\.[^']+)'/g)) assert.ok(existsSync(join(GOC, dirname(t), m[1])), `${t} nhập ${m[1]}`);
  }
  const r = spawnSync(process.execPath, ['--check', join(GOC, 'sw.js')]);
  assert.equal(r.status, 0, String(r.stderr));
});
