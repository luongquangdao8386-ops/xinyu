#!/usr/bin/env node
// Tạo âm thanh mẫu (mục 12.3, 12.8): đọc nội dung đã xây trong content/, gọi Google Cloud Text-to-Speech tạo MP3
// cho âm tiết ví dụ của Nền phát âm, từ và câu mới hoặc đã sửa, tính sẵn đường cao độ, kiểm tra thanh điệu và ghi
// trang nghe duyệt. Danh sách tệp ở audio/danh-sach.json, đường cao độ ở audio/cao-do/; giọng ở tools/am-thanh/cau-hinh.mjs.
//
// Cách dùng: node tools/tao-am-thanh.mjs [--lam-lai <mã,…|tat-ca>] [--xoa-thua] [--thu] [--song <n>] [--trang <tệp .html>]
//   --lam-lai   tạo lại các mục này dù không đổi: mã từ, mã câu hoặc tên tệp âm tiết (ma1, lv4); tat-ca để tạo lại hết
//   --xoa-thua  xóa tệp âm thanh không còn mục nội dung nào dùng (mặc định chỉ liệt kê)
//   --thu       chỉ liệt kê việc sẽ làm, không gọi giọng máy
//   --song      số yêu cầu gửi cùng lúc (mặc định 4)
//   --trang     nơi ghi trang nghe duyệt (mặc định tools/ra/nghe-duyet.html)
// Khóa API: môi trường cloud có proxy tự gắn khóa, không cần làm gì; máy khác ghi GOOGLE_TTS_KEY=… vào tệp .env ở
// thư mục gốc repo. Cần ffmpeg có libmp3lame. Mã thoát 1 khi có mục không tạo được.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DOC_RIENG, GIONG } from './am-thanh/cau-hinh.mjs';
import { bam, docWav, goiGiongMay, maAmTiet, maHoaMp3, ssmlAmTiet, ssmlCau, vietGon, xuLyAmThanh } from './lib/am-thanh.mjs';
import { doCaoDo, kiemTraThanh } from './lib/cao-do.mjs';
import { vietJson } from './lib/json.mjs';
import { quaProxy } from './lib/nguon.mjs';
import { canChinh, tachAmTiet } from './lib/pinyin.mjs';
import { taoTrangNghe } from './lib/trang-nghe.mjs';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO = join(GOC, 'audio');
// Loại âm thanh: khóa trong danh-sach.json → thư mục tệp.
const LOAI = { amTiet: 'am-tiet', tu: 'tu', cau: 'cau' };
// Cách xử lý sau khi nhận âm thanh; đổi ở đây (hoặc đổi phienBan khi sửa mã xử lý) thì mọi tệp được tạo lại.
const XU_LY = { phienBan: 1, tanSo: 24000, kbps: 48, truoc: 0.05, sau: 0.15, rms: -20, dinh: -1.5 };
// Chỉ tự kiểm tra thanh điệu mục có tối đa ngần này âm tiết: câu dài hơn thì việc chia âm tiết không đáng tin.
const KIEM_TOI_DA = 4;

await quaProxy();

const thamSo = process.argv.slice(2);
const lay = (ten) => {
  const i = thamSo.indexOf(ten);
  return i >= 0 ? thamSo.splice(i, 2)[1] : undefined;
};
const co = (ten) => thamSo.includes(ten) && !!thamSo.splice(thamSo.indexOf(ten), 1);
const lamLai = new Set((lay('--lam-lai') || '').split(',').map((s) => s.trim()).filter(Boolean));
const song = Math.max(1, Number(lay('--song')) || 4);
const tepTrang = lay('--trang') || join(GOC, 'tools', 'ra', 'nghe-duyet.html');
const xoaThua = co('--xoa-thua');
const chiThu = co('--thu');
if (thamSo.length) {
  console.error(`Không hiểu tham số: ${thamSo.join(' ')}`);
  console.error('Cách dùng: node tools/tao-am-thanh.mjs [--lam-lai <mã,…|tat-ca>] [--xoa-thua] [--thu] [--song <n>] [--trang <tệp .html>]');
  process.exit(2);
}

// Khóa API khi chạy ngoài môi trường cloud: biến môi trường hoặc tệp .env (không đưa lên repo).
function docKhoa() {
  if (process.env.GOOGLE_TTS_KEY) return process.env.GOOGLE_TTS_KEY;
  const tep = join(GOC, '.env');
  if (!existsSync(tep)) return null;
  const m = readFileSync(tep, 'utf8').match(/^\s*GOOGLE_TTS_KEY\s*=\s*["']?([^"'\s#]+)/m);
  return m ? m[1] : null;
}

const docNoiDung = (tep) => {
  const duongDan = join(GOC, 'content', tep);
  return existsSync(duongDan) ? JSON.parse(readFileSync(duongDan, 'utf8')) : [];
};
const phatAm = docNoiDung('phat-am.json');
const capThanh = docNoiDung('cap-thanh.json');
const tuDs = docNoiDung('tu.json');
const cauDs = docNoiDung('cau.json');
const cauHoi = docNoiDung('cau-hoi.json');
const baiDs = docNoiDung('bai.json');
const truyenDs = docNoiDung('truyen.json');

// ---------- Danh sách mục cần âm thanh ----------
const muc = new Map(); // "loai:ma" → mục
const loi = [];
const ghiChu = [];
const them = (m) => {
  if (DOC_RIENG[m.ma]) {
    m.ssml = `<speak>${DOC_RIENG[m.ma].ssml}</speak>`;
    m.cachKhac = false;
  }
  m.khoa = `${m.loai}:${m.ma}`;
  m.yeuCau = bam(JSON.stringify({ giong: m.giong, ssml: m.ssml, XU_LY }));
  muc.set(m.khoa, m);
};

for (const p of phatAm) {
  (p.amTiet || []).forEach((a, i) => {
    const r = ssmlAmTiet(p.chuDoc?.[i], a);
    if (r.loi) return loi.push(`PhatAm ${p.ma}: ${r.loi}`);
    const cu = muc.get(`amTiet:${r.ma}`);
    if (cu) {
      if (cu.chu !== p.chuDoc[i]) ghiChu.push(`âm tiết ${a}: ${p.ma} ghi chữ ${p.chuDoc[i]}, dùng chữ ${cu.chu} như ${cu.nhom[0]}`);
      cu.nhom.push(p.ma);
      return;
    }
    const { ds } = tachAmTiet(a);
    them({ loai: 'amTiet', ma: r.ma, ssml: r.ssml, giong: GIONG[0], chu: p.chuDoc[i], pinyin: a, nhom: [p.ma], amTiet: [{ thanh: ds[0].thanh, ketDoan: true }] });
  });
}
for (const q of cauHoi) {
  const a = q.amThanh?.amTiet;
  if (a && !muc.has(`amTiet:${maAmTiet(a)}`)) loi.push(`CauHoi ${q.ma}: âm tiết “${a}” chưa có chữ đọc mẫu ở tab PhatAm`);
}

const amTietCua = (chuHan, pinyin) => canChinh(chuHan, pinyin).cap?.filter((a) => a.am !== 'r');
for (const t of tuDs) {
  const r = ssmlCau(t.tu, t.pinyin);
  if (r.loi) {
    loi.push(`Tu ${t.ma} ${t.tu}: ${r.loi}`);
    continue;
  }
  them({ loai: 'tu', ma: t.ma, ssml: r.ssml, cachKhac: r.ep.length > 0, giong: GIONG[0], chu: t.tu, pinyin: t.pinyin, nghia: t.nghia, amTiet: amTietCua(t.tu, t.pinyin) });
}
// Câu hội thoại: vai xuất hiện trước trong bài (hoặc truyện) đọc giọng đầu, vai sau giọng tiếp theo.
const vaiCuaBai = new Map();
for (const c of cauDs) {
  const r = ssmlCau(c.chuHan, c.pinyin);
  if (r.loi) {
    loi.push(`Cau ${c.ma}: ${r.loi}`);
    continue;
  }
  let giong = GIONG[0];
  if (c.vai) {
    const vai = vaiCuaBai.get(c.bai) || [];
    vaiCuaBai.set(c.bai, vai);
    if (!vai.includes(c.vai)) vai.push(c.vai);
    giong = GIONG[vai.indexOf(c.vai) % GIONG.length];
  }
  them({ loai: 'cau', ma: c.ma, ssml: r.ssml, cachKhac: r.ep.length > 0, giong, chu: c.chuHan, pinyin: c.pinyin, nghia: c.nghia, vai: c.vai, bai: c.bai, amTiet: amTietCua(c.chuHan, c.pinyin) });
}

// ---------- So với danh sách đã tạo ----------
const tepDanhSach = join(AUDIO, 'danh-sach.json');
const danhSach = existsSync(tepDanhSach) ? JSON.parse(readFileSync(tepDanhSach, 'utf8')) : {};
for (const l of Object.keys(LOAI)) danhSach[l] ||= {};
const caoDo = {};
for (const [l, thuMuc] of Object.entries(LOAI)) {
  const t = join(AUDIO, 'cao-do', `${thuMuc}.json`);
  caoDo[l] = existsSync(t) ? JSON.parse(readFileSync(t, 'utf8')) : {};
  delete caoDo[l].buoc;
}
const tepAm = (l, ma) => join(AUDIO, LOAI[l], `${ma}.mp3`);
const canTao = [...muc.values()].filter((m) => {
  const cu = danhSach[m.loai][m.ma];
  return lamLai.has('tat-ca') || lamLai.has(m.ma) || !cu || cu.yeuCau !== m.yeuCau || !existsSync(tepAm(m.loai, m.ma)) || !caoDo[m.loai][m.ma];
});
for (const ma of lamLai) if (ma !== 'tat-ca' && ![...muc.values()].some((m) => m.ma === ma)) ghiChu.push(`--lam-lai: không có mục ${ma}`);
const thua = Object.entries(danhSach)
  .filter(([l]) => LOAI[l])
  .flatMap(([l, ds]) => Object.keys(ds).filter((ma) => !muc.has(`${l}:${ma}`)).map((ma) => ({ loai: l, ma })));

const TEN_LOAI = { amTiet: 'Âm tiết', tu: 'Từ', cau: 'Câu' };
const dem = (l) => [...muc.values()].filter((m) => m.loai === l).length;
console.log(`Giọng: ${GIONG.map((g, i) => `${g} (${i ? `vai thứ ${i + 1} của hội thoại` : 'âm tiết, từ, câu, vai thứ nhất'})`).join('; ')}`);
for (const l of Object.keys(LOAI)) console.log(`  ${TEN_LOAI[l].padEnd(8)} ${String(dem(l)).padStart(4)} mục, cần tạo ${canTao.filter((m) => m.loai === l).length}`);

if (chiThu) {
  for (const m of canTao) console.log(`  tạo ${m.khoa.padEnd(16)} ${m.chu} ${m.pinyin}  ${m.ssml}`);
  if (thua.length) console.log(`Không còn dùng: ${thua.map((t) => `${t.loai}:${t.ma}`).join(', ')}`);
  for (const l of loi) console.log(`  LỖI ${l}`);
  process.exit(loi.length ? 1 : 0);
}

// ---------- Tạo âm thanh ----------
const khoa = docKhoa();
const loiTao = [];
if (canTao.length && spawnSync('ffmpeg', ['-hide_banner', '-encoders']).stdout?.toString().includes('libmp3lame') !== true) {
  console.error('Cần cài ffmpeg có bộ mã hóa libmp3lame để tạo MP3.');
  process.exit(2);
}

// Gọi giọng máy cho một cách đọc, xử lý âm thanh, mã hóa MP3 và dò cao độ (chưa ghi tệp).
async function docMot(m, ssml) {
  const { tanSo, mau } = docWav(await goiGiongMay({ ssml, giong: m.giong, khoa, tanSo: XU_LY.tanSo }));
  const sach = xuLyAmThanh(mau, tanSo, XU_LY);
  if (!sach.length) throw new Error('giọng máy trả về âm thanh rỗng');
  const { f0 } = doCaoDo(sach, tanSo);
  let cuoi = f0.length;
  while (cuoi && !f0[cuoi - 1]) cuoi--;
  return { ssml, mp3: maHoaMp3(sach, tanSo, XU_LY.kbps), f0: f0.slice(0, cuoi).map(Math.round), dai: +(sach.length / tanSo).toFixed(2) };
}
function ghiMot(m, ban) {
  mkdirSync(join(AUDIO, LOAI[m.loai]), { recursive: true });
  writeFileSync(tepAm(m.loai, m.ma), ban.mp3);
  caoDo[m.loai][m.ma] = ban.f0;
  danhSach[m.loai][m.ma] = { giong: m.giong, doc: vietGon(ban.ssml), dai: ban.dai, bam: bam(ban.mp3), yeuCau: m.yeuCau };
}
// Chạy việc trên từng mục với `song` yêu cầu cùng lúc; lỗi của một mục không dừng các mục khác.
async function chayHang(ds, viec) {
  const hang = [...ds];
  let xong = 0;
  await Promise.all(
    Array.from({ length: song }, async () => {
      for (let m; (m = hang.shift()); ) {
        try {
          await viec(m);
        } catch (e) {
          loiTao.push(`${m.khoa} ${m.chu}: ${e.message}`);
          if (e.trangThai === 401 || e.trangThai === 403) {
            hang.length = 0;
            loiTao.push(khoa ? 'khóa API trong .env bị từ chối' : 'thiếu khóa API: ngoài môi trường cloud cần GOOGLE_TTS_KEY trong tệp .env');
          } else if (e.khongKetNoi) hang.length = 0;
        }
        if (++xong % 25 === 0) process.stderr.write(`  đã xử lý ${xong}/${ds.length}\n`);
      }
    }),
  );
}

// Cao độ trung bình (trung vị Hz) của từng giọng, làm mốc cho đường cao độ và kiểm tra thanh điệu.
function tinhMoc() {
  const theoGiong = {};
  for (const l of Object.keys(LOAI)) for (const [ma, v] of Object.entries(danhSach[l])) (theoGiong[v.giong] ||= []).push(...(caoDo[l][ma] || []).filter(Boolean));
  danhSach.giong = {};
  for (const [g, hz] of Object.entries(theoGiong).sort()) {
    hz.sort((a, b) => a - b);
    danhSach.giong[g] = { moc: hz[Math.floor(hz.length / 2)] || 0 };
  }
}
// Lỗi thanh điệu máy bắt được ở một bản đọc: mảng lời mô tả theo âm tiết (kèm tổng độ lệch so với mẫu dự
// kiến ở thuộc tính lech); null khi mục không tự kiểm được.
function loiCua(m, f0) {
  if (!m.amTiet || m.amTiet.length > KIEM_TOI_DA || !f0) return null;
  const kq = kiemTraThanh(f0, danhSach.giong[m.giong].moc, m.amTiet);
  if (!kq) return Object.assign(['không tách được âm tiết từ đường cao độ'], { lech: Infinity });
  const chu = m.amTiet.map((a) => a.chu);
  const bao = kq.flatMap((a, i) => (a.loi ? [`${m.amTiet.length > 1 ? `${chu[i]}: ` : ''}${a.loi}`] : []));
  return Object.assign(bao, { lech: kq.reduce((s, a) => s + a.lech, 0) });
}

const banDau = new Map();
await chayHang(canTao, async (m) => {
  const ban = await docMot(m, m.ssml);
  ghiMot(m, ban);
  banDau.set(m.khoa, ban);
});
tinhMoc();

// Từ, câu có âm tiết bị ép mà máy vẫn báo lệch: thử thêm ép cả đoạn và đọc thường, giữ bản ít lỗi nhất, bằng
// nhau thì bản có đường cao độ gần mẫu dự kiến nhất.
const thuLai = canTao.filter((m) => m.cachKhac && banDau.has(m.khoa) && loiCua(m, banDau.get(m.khoa).f0)?.length);
const doiCach = [];
await chayHang(thuLai, async (m) => {
  const ung = [{ cach: 'lai', ban: banDau.get(m.khoa) }];
  for (const cach of ['ep', 'thuong']) ung.push({ cach, ban: await docMot(m, ssmlCau(m.chu, m.pinyin, cach).ssml) });
  for (const u of ung) u.loi = loiCua(m, u.ban.f0);
  const tot = ung.reduce((a, b) => (b.loi.length < a.loi.length || (b.loi.length === a.loi.length && b.loi.lech < a.loi.lech) ? b : a));
  if (tot.cach !== 'lai') {
    ghiMot(m, tot.ban);
    doiCach.push(`${m.khoa} ${m.chu}: dùng cách ${tot.cach === 'ep' ? 'ép cả đoạn' : 'đọc thường'} (${ung.map((u) => `${u.cach}: ${u.loi.length} lỗi, lệch ${u.loi.lech.toFixed(1)}`).join('; ')})`);
  }
});

if (xoaThua) {
  for (const t of thua) {
    rmSync(tepAm(t.loai, t.ma), { force: true });
    delete danhSach[t.loai][t.ma];
    delete caoDo[t.loai][t.ma];
  }
}
tinhMoc();

// Ghi danh sách theo thứ tự nội dung (mục thừa chưa xóa đứng cuối) và đường cao độ.
const ghi = { giong: danhSach.giong };
for (const l of Object.keys(LOAI)) {
  ghi[l] = {};
  for (const m of muc.values()) if (m.loai === l && danhSach[l][m.ma]) ghi[l][m.ma] = danhSach[l][m.ma];
  for (const [ma, v] of Object.entries(danhSach[l])) if (!ghi[l][ma]) ghi[l][ma] = v;
}
mkdirSync(join(AUDIO, 'cao-do'), { recursive: true });
// Mỗi tệp một dòng để dễ xem thay đổi bằng git diff.
const motDong = (o) => (Object.keys(o).length ? `{\n${Object.entries(o).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n')}\n  }` : '{}');
writeFileSync(tepDanhSach, `{\n  "giong": ${JSON.stringify(ghi.giong)},\n${Object.keys(LOAI).map((l) => `  "${l}": ${motDong(ghi[l])}`).join(',\n')}\n}\n`);
for (const [l, thuMuc] of Object.entries(LOAI)) {
  const ra = { buoc: 0.01 };
  for (const ma of Object.keys(ghi[l])) if (caoDo[l][ma]) ra[ma] = caoDo[l][ma];
  writeFileSync(join(AUDIO, 'cao-do', `${thuMuc}.json`), vietJson(ra) + '\n');
}

// ---------- Kiểm tra thanh điệu ----------
const canNghe = new Map();
for (const m of muc.values()) {
  const bao = ghi[m.loai][m.ma] ? loiCua(m, caoDo[m.loai][m.ma]) : null;
  if (bao?.length) canNghe.set(m.khoa, bao);
}

// ---------- Trang nghe duyệt ----------
const moTaMuc = (m) => {
  const v = ghi[m.loai][m.ma];
  if (m.loai === 'amTiet') return `${m.ma}.mp3 · ${m.nhom.join(', ')}`;
  const ep = [...v.doc.matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]).join(', ');
  return `${m.ma} · ${m.vai ? `vai ${m.vai}, ${v.giong.replace('cmn-CN-', '')}, ` : ''}${ep ? `ép Pinyin ${ep}` : 'đọc thường'}`;
};
const mucTrang = {};
const amThanh = {};
for (const m of muc.values()) {
  const v = ghi[m.loai][m.ma];
  if (!v || !existsSync(tepAm(m.loai, m.ma))) continue;
  mucTrang[m.khoa] = {
    khoa: m.khoa, chu: m.chu, pinyin: m.pinyin, nghia: m.nghia, moTa: moTaMuc(m), canhBao: canNghe.get(m.khoa) || [],
    f0: caoDo[m.loai][m.ma] || [], moc: ghi.giong[v.giong].moc, dai: v.dai,
  };
  amThanh[m.khoa] = readFileSync(tepAm(m.loai, m.ma)).toString('base64');
}
const coTrang = (k) => !!mucTrang[k];
const nhom = [];
const nghiKy = [...canNghe.keys()].filter(coTrang);
if (nghiKy.length) nhom.push({ phan: 'Máy báo cần nghe kỹ', ten: 'Đường cao độ lệch so với thanh điệu dự kiến', muc: nghiKy });
for (const p of phatAm) {
  const ds = (p.amTiet || []).map((a) => `amTiet:${maAmTiet(a)}`).filter(coTrang);
  if (ds.length) nhom.push({ phan: 'Âm tiết', ten: `${p.ma} · ${p.kyHieu}`, muc: ds });
}
const tuDaXep = new Set();
for (const c of capThanh) {
  const ds = (c.viDu || []).map((t) => `tu:${t}`).filter(coTrang);
  ds.forEach((k) => tuDaXep.add(k));
  if (ds.length) nhom.push({ phan: 'Từ', ten: `${c.ma} · cặp thanh ${c.toHop}${c.cachDoc ? ` · ${c.cachDoc}` : ''}`, muc: ds });
}
for (const p of phatAm) {
  const ds = (p.viDu || []).map((t) => `tu:${t}`).filter(coTrang);
  ds.forEach((k) => tuDaXep.add(k));
  if (ds.length) nhom.push({ phan: 'Từ', ten: `${p.ma} · ${p.kyHieu}`, muc: ds });
}
const tuKhac = tuDs.map((t) => `tu:${t.ma}`).filter((k) => coTrang(k) && !tuDaXep.has(k));
if (tuKhac.length) nhom.push({ phan: 'Từ', ten: 'Từ khác trong bài', muc: tuKhac });
for (const b of [...baiDs, ...truyenDs]) {
  const ds = cauDs.filter((c) => c.bai === b.ma).map((c) => `cau:${c.ma}`).filter(coTrang);
  if (ds.length) nhom.push({ phan: 'Câu', ten: `${b.ma} · ${b.chuDe || b.tieuDe}`, muc: ds });
}
const ngay = new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
mkdirSync(dirname(tepTrang), { recursive: true });
writeFileSync(
  tepTrang,
  taoTrangNghe({
    tieuDe: 'Duyệt âm thanh mẫu',
    moTa: `Âm thanh giọng máy của các bài đã xây nội dung, tạo ngày ${ngay}. Bấm nút tròn để nghe; “Nghe lần lượt” phát cả nhóm. Nét vẽ nhỏ ở mỗi dòng là đường cao độ, nét đứt là mức giọng trung bình. Tệp nào đọc sai, khó nghe hay có tiếng lạ thì bấm “Cần sửa” và ghi ngắn lý do.`,
    tongKet: [
      ...Object.keys(LOAI).map((l) => `${TEN_LOAI[l]}: <b>${Object.keys(mucTrang).filter((k) => k.startsWith(`${l}:`)).length}</b>`),
      `Máy báo cần nghe kỹ: <b>${nghiKy.length}</b>`,
      `Giọng: ${GIONG.map((g) => g.replace('cmn-CN-', '')).join(', ')}`,
    ],
    nhom,
    muc: mucTrang,
    amThanh,
  }),
);

// ---------- Báo cáo ----------
console.log(`\nĐã tạo ${banDau.size} tệp${canTao.length ? '' : ' (không có mục mới hoặc đã sửa)'}.`);
for (const d of doiCach) console.log(`  ${d}`);
if (canNghe.size) {
  console.log(`\nKiểm tra thanh điệu: ${canNghe.size} mục cần nghe kỹ`);
  for (const [k, bao] of canNghe) {
    const m = muc.get(k);
    console.log(`  ${k.padEnd(16)} ${m.chu} ${m.pinyin}: ${bao.join('; ')}`);
  }
}
if (thua.length) console.log(`\n${xoaThua ? 'Đã xóa' : 'Không còn dùng (xóa bằng --xoa-thua)'}: ${thua.map((t) => `${t.loai}:${t.ma}`).join(', ')}`);
for (const g of ghiChu) console.log(`Ghi chú: ${g}`);
for (const l of [...loi, ...loiTao]) console.log(`LỖI ${l}`);
console.log(`\nĐã ghi audio/ (danh-sach.json, cao-do/) và trang nghe duyệt ${tepTrang}.`);
process.exit(loi.length || loiTao.length ? 1 : 0);
