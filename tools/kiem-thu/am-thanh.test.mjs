// Kiểm thử công cụ tạo âm thanh mẫu (không gọi giọng máy). Chạy: node --test 'tools/kiem-thu/*.test.mjs'
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

import { docWav, maAmTiet, maHoaMp3, ssmlAmTiet, ssmlCau, vietGon, xuLyAmThanh } from '../lib/am-thanh.mjs';
import { cachDocThanh, doCaoDo, kiemTraThanh } from '../lib/cao-do.mjs';
import { taoTrangNghe } from '../lib/trang-nghe.mjs';

const TAN_SO = 24000;

// Tín hiệu có thanh tổng hợp: chuỗi xung tam giác lọc nhẹ theo đường tần số f(t) (Hz), biên độ a.
function giongTongHop(dai, f, a = 0.3) {
  const mau = new Float32Array(Math.round(dai * TAN_SO));
  let pha = 0;
  for (let i = 0; i < mau.length; i++) {
    pha += f(i / TAN_SO) / TAN_SO;
    const x = pha % 1;
    mau[i] = a * (0.6 * Math.sin(2 * Math.PI * pha) + 0.3 * Math.sin(4 * Math.PI * pha) + 0.1 * (x < 0.5 ? 4 * x - 1 : 3 - 4 * x));
  }
  return mau;
}
const noi = (...phan) => {
  const ra = new Float32Array(phan.reduce((s, p) => s + p.length, 0));
  let i = 0;
  for (const p of phan) {
    ra.set(p, i);
    i += p.length;
  }
  return ra;
};
const lang = (dai) => new Float32Array(Math.round(dai * TAN_SO));
function wav(mau) {
  const buf = Buffer.alloc(44 + mau.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + mau.length * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(TAN_SO, 24);
  buf.writeUInt32LE(TAN_SO * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(mau.length * 2, 40);
  mau.forEach((v, i) => buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2));
  return buf;
}

test('SSML âm tiết: luôn ép Pinyin số, ü viết v', () => {
  assert.deepEqual(ssmlAmTiet('还', 'huán'), { ma: 'huan2', ssml: '<speak><phoneme alphabet="pinyin" ph="huan2">还</phoneme></speak>' });
  assert.equal(ssmlAmTiet('女', 'nǚ').ma, 'nv3');
  assert.equal(maAmTiet('lǜ'), 'lv4');
  assert.equal(maAmTiet('ma'), 'ma5');
  assert.equal(maAmTiet('xyz'), null);
  assert.ok(ssmlAmTiet('妈妈', 'mā').loi);
  assert.ok(ssmlAmTiet('妈', 'māma').loi);
});

test('SSML từ, câu: ba cách đọc', () => {
  assert.equal(vietGon(ssmlCau('不客气。', 'Bú kèqi.').ssml), '[不 bu2]客[气 qi5]。');
  assert.equal(vietGon(ssmlCau('对不起！', 'Duìbuqǐ!', 'ep').ssml), '[对不起 dui4 bu5 qi3]！');
  assert.equal(ssmlCau('对不起！', 'Duìbuqǐ!', 'thuong').ssml, '<speak>对不起！</speak>');
  // Âm cuốn lưỡi để giọng máy tự đọc; 一 ép theo thanh đã biến trong Pinyin hiển thị.
  assert.equal(vietGon(ssmlCau('一点儿', 'yìdiǎnr').ssml), '[一 yi4]点儿');
  assert.equal(vietGon(ssmlCau('你好，我叫小明。', 'Nǐ hǎo, wǒ jiào Xiǎomíng.', 'ep').ssml), '[你好 ni3 hao3]，[我叫小明 wo3 jiao4 xiao3 ming2]。');
  assert.deepEqual(ssmlCau('你好', 'nǐ hǎo').ep, []);
  assert.ok(ssmlCau('你好', 'nǐ').loi);
});

test('Xử lý âm thanh: đọc WAV, cắt lặng, chuẩn âm lượng', () => {
  const { tanSo, mau } = docWav(wav(noi(lang(0.3), giongTongHop(0.4, () => 200, 0.05), lang(0.3))));
  assert.equal(tanSo, TAN_SO);
  const ra = xuLyAmThanh(mau, tanSo);
  assert.ok(Math.abs(ra.length / tanSo - 0.6) < 0.02, `dài ${ra.length / tanSo}s`);
  const rms = Math.sqrt(ra.slice(0.1 * tanSo, 0.4 * tanSo).reduce((s, v) => s + v * v, 0) / (0.3 * tanSo));
  assert.ok(Math.abs(20 * Math.log10(rms) + 20) < 0.5, `rms ${20 * Math.log10(rms)} dB`);
  assert.ok(Math.max(...ra.map(Math.abs)) <= 10 ** (-1.5 / 20) + 1e-6);
  assert.equal(xuLyAmThanh(lang(0.5), tanSo).length, 0);
});

const coFfmpeg = spawnSync('ffmpeg', ['-hide_banner', '-encoders']).stdout?.toString().includes('libmp3lame');
test('Mã hóa MP3 không kèm thẻ ID3', { skip: !coFfmpeg && 'chưa cài ffmpeg' }, () => {
  const mp3 = maHoaMp3(giongTongHop(0.5, () => 220, 0.2), TAN_SO);
  assert.equal(mp3[0], 0xff);
  assert.equal(mp3[1] & 0xe0, 0xe0);
  assert.ok(mp3.length > 2000 && mp3.length < 5000, `${mp3.length} byte`);
});

test('Dò cao độ: giọng phẳng, giọng đi lên, lặng', () => {
  const phang = doCaoDo(noi(lang(0.1), giongTongHop(0.4, () => 220), lang(0.1)), TAN_SO).f0;
  const giua = phang.slice(15, 45).filter(Boolean);
  assert.ok(giua.length >= 28 && giua.every((h) => Math.abs(h / 220 - 1) < 0.02), giua.join(' '));
  assert.ok(phang.slice(0, 8).every((h) => !h));
  // Đi lên 150 → 300 Hz trong 0,5 giây.
  const len = doCaoDo(giongTongHop(0.5, (t) => 150 * 2 ** (t / 0.5)), TAN_SO).f0;
  for (const k of [10, 25, 40]) assert.ok(Math.abs(len[k] / (150 * 2 ** ((k * 0.01 + 0.0075) / 0.5)) - 1) < 0.04, `khung ${k}: ${len[k]}`);
});

test('Cách đọc thực tế: biến điệu thanh 3, nửa thanh, thanh nhẹ', () => {
  const t = (...ds) => cachDocThanh(ds.map((x) => (typeof x === 'number' ? { thanh: x } : x)));
  assert.deepEqual(t(3, 3), ['2', '3']);
  assert.deepEqual(t(3, 3, 3), ['2', '2', '3']);
  assert.deepEqual(t(1, 5), ['1', '0-1']);
  assert.deepEqual(t(3, 5), ['3n', '0-3']);
  assert.deepEqual(t(4, 5, 3), ['4n', '0-4', '3']);
  assert.deepEqual(t({ thanh: 3, ketDoan: true }, 3), ['3', '3']);
});

test('Kiểm tra thanh điệu trên đường cao độ', () => {
  const doan = (n, f) => Array.from({ length: n }, (_, i) => f(i / (n - 1)));
  const moc = 200;
  const kiem = (f0, ...thanh) => kiemTraThanh(f0, moc, thanh.map((x) => ({ thanh: x }))).map((a) => a.loi);
  // Âm tiết đọc riêng.
  assert.deepEqual(kiem(doan(40, () => 250), 1), [null]);
  assert.deepEqual(kiem(doan(40, (x) => 160 * 1.7 ** x), 2), [null]);
  assert.deepEqual(kiem(doan(40, () => 200), 2), ['thanh 2 gần như không lên']);
  assert.deepEqual(kiem(doan(40, (x) => 300 / 2 ** x), 4), [null]);
  assert.deepEqual(kiem(doan(40, () => 260), 4), ['thanh 4 không rơi']);
  // Từ hai âm tiết: 1-4 (có khoảng vô thanh giữa hai âm tiết), rồi âm sau đọc phẳng.
  const lang6 = Array(6).fill(0);
  assert.deepEqual(kiem([...doan(30, () => 250), ...lang6, ...doan(30, (x) => 290 / 1.9 ** x)], 1, 4), [null, null]);
  assert.deepEqual(kiem([...doan(30, () => 250), ...lang6, ...doan(30, () => 250)], 1, 4), [null, 'thanh 4 không rơi']);
  // Thanh nhẹ sau thanh 3 đọc cao và phẳng như thanh 1 (喜欢 thành xǐhuān).
  assert.deepEqual(kiem([...doan(25, (x) => 190 / 1.3 ** x), ...lang6, ...doan(20, () => 245)], 3, 5), [null, 'thanh nhẹ đọc cao và phẳng như thanh 1']);
  assert.equal(kiemTraThanh(Array(20).fill(0), moc, [{ thanh: 1 }]), null);
});

test('Trang nghe duyệt', () => {
  const html = taoTrangNghe({
    tieuDe: 'Duyệt âm thanh mẫu',
    moTa: 'Thử <nghe>',
    tongKet: ['Từ: <b>1</b>'],
    nhom: [{ phan: 'Từ', ten: 'CT33 · cặp thanh 3-3', muc: ['tu:T147'] }],
    muc: { 'tu:T147': { khoa: 'tu:T147', chu: '你好', pinyin: 'nǐ hǎo', nghia: 'xin chào', moTa: 'T147 · đọc thường', canhBao: ['你: thanh 2 gần như không lên'], f0: [0, 200, 210, 0], moc: 200, dai: 0.5 } },
    amThanh: { 'tu:T147': 'AAAA' },
  });
  assert.match(html, /^<title>Duyệt âm thanh Xinyu<\/title>/);
  assert.match(html, /<span class="han" lang="zh-CN">你好<\/span>/);
  assert.match(html, /Thử &lt;nghe&gt;/);
  assert.match(html, /⚠<\/span> 你: thanh 2 gần như không lên/);
  assert.match(html, /"tu:T147":"AAAA"/);
});
