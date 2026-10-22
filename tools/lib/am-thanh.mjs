// Âm thanh mẫu (mục 12.3, 12.8 của đặc tả): dựng SSML cho giọng máy, gọi Google Cloud Text-to-Speech, xử lý
// âm thanh (cắt lặng, chuẩn âm lượng) và mã hóa MP3 bằng ffmpeg. Không đọc ghi tệp trong repo: phần đó ở
// tools/tao-am-thanh.mjs.

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

import { canChinh, laChuHan, soHoa, tachAmTiet } from './pinyin.mjs';

export const bam = (x, dai = 10) => createHash('sha256').update(x).digest('hex').slice(0, dai);

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Pinyin số cho thẻ phoneme của Google: ü viết v (lv4), thanh nhẹ là 5, âm cuốn lưỡi của 儿 là r5.
export const pinyinSo = (ds) => soHoa(ds).replace(/u:/g, 'v');
const phoneme = (ph, chu) => `<phoneme alphabet="pinyin" ph="${ph}">${xml(chu)}</phoneme>`;

// Tên tệp âm thanh của một âm tiết: Pinyin số, ví dụ mā → ma1, lǜ → lv4; null khi không phải một âm tiết.
export function maAmTiet(amTiet) {
  const { ds, loi } = tachAmTiet(amTiet || '');
  return loi.length || ds.length !== 1 ? null : pinyinSo(ds);
}

// Âm tiết đọc riêng của bài Nền phát âm: luôn ép cách đọc của chữ đọc mẫu bằng Pinyin, vì chữ đứng một mình
// hay bị đọc theo âm thường gặp hơn (还 đọc hái thay cho huán). Trả về { ma (tên tệp), ssml } hoặc { loi }.
export function ssmlAmTiet(chu, amTiet) {
  const ma = maAmTiet(amTiet);
  if (!ma) return { loi: `“${amTiet}” không phải một âm tiết Pinyin` };
  if ([...(chu || '')].length !== 1 || !laChuHan(chu)) return { loi: `chữ đọc mẫu của “${amTiet}” phải là một chữ Hán` };
  return { ma, ssml: `<speak>${phoneme(ma, chu)}</speak>` };
}

// Từ và câu có ba cách dựng SSML:
//   lai    đọc thường, chỉ ép theo Pinyin hiển thị các âm tiết thanh nhẹ và chữ 一, 不 (Pinyin hiển thị đã ghi
//          thanh biến): đó là chỗ giọng máy hay đọc khác Pinyin của app (喜欢 thành xǐhuān, 一下 không lên giọng ở 一);
//   ep     ép cả đoạn chữ Hán giữa hai dấu câu theo Pinyin hiển thị (giữ được từ liền khối như 对不起);
//   thuong đọc thường hoàn toàn.
// Biến điệu thanh 3 giọng máy tự làm. Trả về { ssml, ep (các âm tiết bị ép) } hoặc { loi }.
export function ssmlCau(chuHan, pinyin, cach = 'lai') {
  const { cap, loi } = canChinh(chuHan, pinyin);
  if (!cap) return { loi: loi.join('; ') };
  if (cach === 'thuong') return { ssml: `<speak>${xml(chuHan)}</speak>`, ep: [] };
  let i = 0;
  let ra = '';
  let doan = [];
  const ep = [];
  const dongDoan = () => {
    if (!doan.length) return;
    const ph = pinyinSo(doan.map((d) => d.a));
    ra += phoneme(ph, doan.map((d) => d.c).join(''));
    ep.push(`${doan.map((d) => d.c).join('')} ${ph}`);
    doan = [];
  };
  for (const c of chuHan) {
    if (!laChuHan(c)) {
      dongDoan();
      ra += xml(c);
      continue;
    }
    const a = cap[i++];
    if (cach === 'ep') doan.push({ c, a });
    else if (a.am !== 'r' && (a.thanh === 5 || c === '一' || c === '不')) {
      const ph = pinyinSo([a]);
      ra += phoneme(ph, c);
      ep.push(`${c} ${ph}`);
    } else ra += c;
  }
  dongDoan();
  return { ssml: `<speak>${ra}</speak>`, ep };
}

// SSML viết gọn để ghi vào danh sách và xem lại: đoạn bị ép cách đọc ghi trong ngoặc vuông kèm Pinyin số, ví dụ
// [不 bu2]客[气 qi5]。 hoặc [对不起 dui4 bu5 qi3]！
export const vietGon = (ssml) =>
  ssml
    .replace(/^<speak>|<\/speak>$/g, '')
    .replace(/<phoneme alphabet="pinyin" ph="([^"]+)">([^<]*)<\/phoneme>/g, '[$2 $1]')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Gọi Google Cloud Text-to-Speech, nhận WAV (LINEAR16). Môi trường cloud: proxy tự gắn khóa vào request nên
// khoa để trống; máy khác: khóa API gửi trong header X-Goog-Api-Key. Lỗi tạm thời (quá hạn mức, máy chủ bận)
// thì chờ rồi thử lại.
export async function goiGiongMay({ ssml, giong, khoa, tanSo = 24000, soLanThu = 6 }) {
  const than = JSON.stringify({
    input: { ssml },
    voice: { languageCode: giong.split('-').slice(0, 2).join('-'), name: giong },
    audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: tanSo },
  });
  const dau = { 'Content-Type': 'application/json; charset=utf-8', ...(khoa ? { 'X-Goog-Api-Key': khoa } : {}) };
  for (let lan = 1; ; lan++) {
    let tl;
    try {
      tl = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', { method: 'POST', headers: dau, body: than });
    } catch (e) {
      // Lỗi mạng (bị chặn, mất kết nối): thử lại ít lần rồi báo để dừng cả hàng việc.
      if (lan >= 3) throw Object.assign(new Error(`không kết nối được texttospeech.googleapis.com: ${e.cause?.message || e.message}`), { khongKetNoi: true });
      await new Promise((r) => setTimeout(r, 2000 * lan));
      continue;
    }
    if (tl.ok) return Buffer.from((await tl.json()).audioContent, 'base64');
    const van = await tl.text();
    if ((tl.status === 429 || tl.status >= 500) && lan < soLanThu) {
      await new Promise((r) => setTimeout(r, 2000 * 2 ** lan));
      continue;
    }
    let thongBao = van;
    try {
      thongBao = JSON.parse(van).error.message;
    } catch {}
    const err = new Error(`giọng máy trả lỗi ${tl.status}: ${thongBao}`);
    err.trangThai = tl.status;
    throw err;
  }
}

// Đọc WAV PCM 16 bit một kênh (kết quả LINEAR16 của Google) thành Float32Array.
export function docWav(buf) {
  let p = 12;
  let tanSo = 0;
  let du = null;
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4);
    const n = buf.readUInt32LE(p + 4);
    if (id === 'fmt ') {
      if (buf.readUInt16LE(p + 10) !== 1 || buf.readUInt16LE(p + 22) !== 16) throw new Error('WAV không phải PCM 16 bit một kênh');
      tanSo = buf.readUInt32LE(p + 12);
    }
    if (id === 'data') du = buf.subarray(p + 8, p + 8 + Math.min(n, buf.length - p - 8));
    p += 8 + n + (n % 2);
  }
  if (!tanSo || !du) throw new Error('WAV thiếu phần fmt hoặc data');
  const mau = new Float32Array(du.length >> 1);
  for (let i = 0; i < mau.length; i++) mau[i] = du.readInt16LE(i * 2) / 32768;
  return { tanSo, mau };
}

// Cắt lặng hai đầu (giữ `truoc` giây trước tiếng đầu tiên và `sau` giây sau tiếng cuối), đưa âm lượng phần có
// tiếng về `rms` dBFS (đỉnh không vượt `dinh` dBFS) và vuốt 5 ms hai đầu để không có tiếng tách.
export function xuLyAmThanh(mau, tanSo, { truoc = 0.05, sau = 0.15, rms = -20, dinh = -1.5 } = {}) {
  const khung = Math.round(tanSo * 0.01);
  const nang = [];
  for (let i = 0; i + khung <= mau.length; i += khung) {
    let e = 0;
    for (let j = i; j < i + khung; j++) e += mau[j] * mau[j];
    nang.push(e / khung);
  }
  const lon = Math.max(...nang, 1e-12);
  const coTieng = nang.map((e) => e > lon * 1e-4);
  const dauTieng = coTieng.indexOf(true);
  const cuoiTieng = coTieng.lastIndexOf(true);
  if (dauTieng < 0) return new Float32Array(0);
  const a = Math.max(0, dauTieng * khung - Math.round(truoc * tanSo));
  const b = Math.min(mau.length, (cuoiTieng + 1) * khung + Math.round(sau * tanSo));
  const ra = mau.slice(a, b);
  const tb = nang.filter((e, i) => coTieng[i]).reduce((s, e, _, m) => s + e / m.length, 0);
  const dinhCu = ra.reduce((m, v) => Math.max(m, Math.abs(v)), 1e-9);
  const he = Math.min(10 ** (rms / 20) / Math.sqrt(tb), 10 ** (dinh / 20) / dinhCu);
  const vuot = Math.round(tanSo * 0.005);
  for (let i = 0; i < ra.length; i++) ra[i] *= he * Math.min(1, i / vuot, (ra.length - 1 - i) / vuot);
  return ra;
}

// Mã hóa MP3 một kênh bằng ffmpeg (libmp3lame), bỏ thẻ ID3 để cùng âm thanh luôn ra cùng tệp.
export function maHoaMp3(mau, tanSo, kbps = 48) {
  const pcm = Buffer.alloc(mau.length * 2);
  for (let i = 0; i < mau.length; i++) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(mau[i] * 32767))), i * 2);
  const r = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-loglevel', 'error', '-f', 's16le', '-ar', String(tanSo), '-ac', '1', '-i', 'pipe:0',
      '-c:a', 'libmp3lame', '-b:a', `${kbps}k`, '-map_metadata', '-1', '-id3v2_version', '0', '-write_id3v1', '0',
      '-fflags', '+bitexact', '-flags:a', '+bitexact', '-f', 'mp3', 'pipe:1'],
    { input: pcm, maxBuffer: 64 * 1024 * 1024 },
  );
  if (r.error) throw new Error(r.error.code === 'ENOENT' ? 'cần cài ffmpeg (có libmp3lame) để mã hóa MP3' : r.error.message);
  if (r.status !== 0) throw new Error(`ffmpeg lỗi: ${r.stderr.toString().trim()}`);
  return r.stdout;
}
