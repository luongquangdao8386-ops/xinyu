#!/usr/bin/env node
// Trích từ và chữ của một cấp từ PDF Đề cương thi HSK (11/2025) ra content/de-cuong/hsk<cấp>.json.
//
// Cách dùng: node tools/trich-de-cuong.mjs <tệp-pdf> [cấp]   (mặc định cấp 1)
// Cần pdftotext (gói poppler-utils). Không đưa tệp PDF vào repo.
//
// Bảng ngữ pháp có nhiều ô gộp nên không trích tự động: phần "nguPhap" chép tay theo
// bảng trong PDF và được giữ nguyên khi chạy lại script.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Trang PDF của từng phần (trang PDF = số trang in + 2).
const TRANG = {
  1: { tu: [4, 11], chuNhanBiet: [267, 268], chuVietTay: [288, 288], nguPhap: [297, 299] },
};

// Cấp của danh sách chữ viết tay: đề cương gộp cấp 1 và 2 trong một danh sách.
const CAP_VIET_TAY = { 1: '1–2' };

const NGUON = {
  ten: '中文水平考试 HSK考试大纲（词汇、汉字、语法）',
  donVi: '中外语言交流合作中心',
  phatHanh: '2025-11',
  thucHien: '2026-07',
  banSao: 'https://raw.githubusercontent.com/becky82/mteh/main/sources/HSK3.1/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B2%EF%BC%88%E8%AF%8D%E6%B1%87%E3%80%81%E6%B1%89%E5%AD%97%E3%80%81%E8%AF%AD%E6%B3%95%EF%BC%89.pdf',
};

const TU_LOAI = new Set(['名', '动', '形', '副', '代', '数', '量', '数量', '介', '连', '助', '叹', '拟声', '前缀', '后缀']);
const HAN = /^\p{Script=Han}$/u;

const [pdf, capArg = '1'] = process.argv.slice(2);
const cap = Number(capArg);
if (!pdf || !TRANG[cap]) {
  console.error('Cách dùng: node tools/trich-de-cuong.mjs <tệp-pdf> [cấp]');
  console.error(`Cấp đã khai báo trang: ${Object.keys(TRANG).join(', ')}`);
  process.exit(1);
}

const loi = [];
const ghiChu = [];

// Đọc các chữ kèm tọa độ của một khoảng trang; mỗi trang là một mảng chữ.
function docTrang([dau, cuoi]) {
  const xml = execFileSync('pdftotext', ['-bbox', '-f', String(dau), '-l', String(cuoi), pdf, '-'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024,
  });
  return xml.split('<page ').slice(1).map((trang) =>
    [...trang.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map(
      (m) => ({
        x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4],
        cx: (+m[1] + +m[3]) / 2, cy: (+m[2] + +m[4]) / 2,
        t: m[5].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&(apos|#39);/g, "'").replace(/&amp;/g, '&'),
      }),
    ),
  );
}

// "1（2）（4）" → { cap: 1, capSau: [2, 4] }; cấp gộp "7-9" giữ dạng chuỗi.
function tachCap(s) {
  const m = s.match(/^(\d(?:-\d)?)((?:（\d(?:-\d)?）)*)$/);
  if (!m) return null;
  const so = (x) => (x.includes('-') ? x : +x);
  return { cap: so(m[1]), capSau: [...m[2].matchAll(/（([\d-]+)）/g)].map((x) => so(x[1])) };
}

// "形、（副）、（动）" → { tuLoai: ['形'], nhomSau: [['副'], ['动']] }
function tachTuLoai(s) {
  const tuLoai = [];
  const nhomSau = [];
  for (const phan of s.match(/（[^）]*）|[^、（）]+/g) || []) {
    if (phan.startsWith('（')) nhomSau.push(phan.slice(1, -1).split('、'));
    else tuLoai.push(phan);
  }
  return { tuLoai, nhomSau };
}

function trichTu() {
  const hang = [];
  for (const [i, chu] of docTrang(TRANG[cap].tu).entries()) {
    const tieuDe = ['序号', '等级', '词语', '拼音', '词性'].map((t) => chu.find((w) => w.t === t));
    if (tieuDe.some((w) => !w)) {
      loi.push(`Trang từ thứ ${i + 1}: không thấy dòng tiêu đề bảng`);
      continue;
    }
    // Ranh giới cột: điểm giữa tâm hai tiêu đề kề nhau.
    const ranh = tieuDe.slice(1).map((w, k) => (tieuDe[k].cx + w.cx) / 2);
    const cot = (w) => ranh.filter((r) => w.cx > r).length;
    const than = chu.filter((w) => w.y0 > tieuDe[0].y1);
    const hangTrang = than
      .filter((w) => cot(w) === 0 && /^\d+$/.test(w.t))
      .map((w) => ({ stt: +w.t, y: w.y0, o: [[], [], [], [], []] }));
    if (!hangTrang.length) continue;
    const ganNhat = (w) => hangTrang.reduce((a, b) => (Math.abs(b.y - w.y0) < Math.abs(a.y - w.y0) ? b : a));
    // Số trang ở cuối trang nằm dưới hàng cuối cùng.
    const day = Math.max(...hangTrang.map((h) => h.y)) + 12;
    for (const w of than) {
      const c = cot(w);
      if (c === 0 || w.y0 > day) continue;
      ganNhat(w).o[c].push(w);
    }
    // Ô từ loại quá dài bị cắt xuống dòng dưới: phần còn lại nằm sát hàng kế tiếp.
    // Nhận ra nhờ phần trước chưa đóng ngoặc hoặc kết thúc bằng "、".
    for (let k = 0; k + 1 < hangTrang.length; k++) {
      const truoc = hangTrang[k].o[4];
      const sau = hangTrang[k + 1].o[4];
      const ghep = truoc.map((w) => w.t).join('');
      if (sau.length > 1 && (/、$/.test(ghep) || (ghep.match(/（/g) || []).length > (ghep.match(/）/g) || []).length)) {
        sau.sort((a, b) => a.y0 - b.y0);
        truoc.push(sau.shift());
        ghiChu.push(`Từ số ${hangTrang[k].stt}: từ loại bị ngắt dòng trong PDF, đã ghép lại`);
      }
    }
    hang.push(...hangTrang);
  }

  const tu = [];
  const sttDaDoc = new Set(hang.map((h) => h.stt));
  for (const h of hang) {
    // Pinyin của cụm gồm nhiều chữ cách nhau (bú kèqi); các cột khác ghép liền.
    const [capGhi, tuGhi, pinyin, tuLoaiGhi] = h.o.slice(1).map((o, c) =>
      o.sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0).map((w) => w.t).join(c === 2 ? ' ' : ''),
    );
    const c = tachCap(capGhi);
    if (!c) {
      loi.push(`Từ số ${h.stt}: không đọc được cấp "${capGhi}"`);
      continue;
    }
    if (c.cap !== cap) continue;
    const m = tuGhi.match(/^(.+?)(\d)?$/);
    if (!m) {
      loi.push(`Từ số ${h.stt}: thiếu từ`);
      continue;
    }
    const { tuLoai, nhomSau } = tachTuLoai(tuLoaiGhi);
    if (nhomSau.length !== c.capSau.length) loi.push(`Từ số ${h.stt}: ${c.capSau.length} cấp trong ngoặc nhưng ${nhomSau.length} nhóm từ loại trong ngoặc`);
    for (const t of [...tuLoai, ...nhomSau.flat()]) if (!TU_LOAI.has(t)) loi.push(`Từ số ${h.stt}: từ loại lạ "${t}"`);
    if (!pinyin) loi.push(`Từ số ${h.stt}: thiếu Pinyin`);
    const muc = { stt: h.stt, tu: m[1] };
    if (m[2]) muc.dongHinh = +m[2];
    Object.assign(muc, { pinyin, cap: c.cap, tuLoai });
    if (nhomSau.length) muc.tuLoaiCapSau = c.capSau.map((cs, k) => ({ cap: cs, tuLoai: nhomSau[k] }));
    tu.push(muc);
  }
  tu.sort((a, b) => a.stt - b.stt);
  tu.forEach((t, k) => {
    if (k && t.stt !== tu[k - 1].stt + 1) loi.push(`Từ: thiếu số thứ tự giữa ${tu[k - 1].stt} và ${t.stt}`);
  });
  // Khoảng trang phải đọc được cả hàng ngay trước và ngay sau cấp này, nếu không có thể đã sót từ.
  if (!tu.length) loi.push(`Không có từ cấp ${cap} trong khoảng trang đã khai báo`);
  else {
    if (tu[0].stt > 1 && !sttDaDoc.has(tu[0].stt - 1)) loi.push(`Từ: khoảng trang có thể bắt đầu muộn, không thấy từ số ${tu[0].stt - 1}`);
    if (!sttDaDoc.has(tu.at(-1).stt + 1)) loi.push(`Từ: khoảng trang có thể kết thúc sớm, không thấy từ số ${tu.at(-1).stt + 1}`);
  }
  return tu;
}

// Danh sách chữ dạng "1. 爱   43. 二 ...": số và chữ có thể dính nhau ("100.里") hoặc tách rời.
function trichChu(trang, ten) {
  const ds = [];
  for (const chu of docTrang(trang)) {
    for (const w of chu) {
      const m = w.t.match(/^(\d+)\.(.*)$/);
      if (!m) continue;
      let c = m[2];
      if (!c) {
        const ben = chu
          .filter((v) => v.x0 >= w.x1 - 1 && Math.abs(v.cy - w.cy) < 6 && !/^\d+\./.test(v.t))
          .sort((a, b) => a.x0 - b.x0)[0];
        c = ben ? ben.t : '';
      }
      if (!HAN.test(c)) loi.push(`${ten} số ${m[1]}: không đọc được chữ "${c}"`);
      ds.push({ stt: +m[1], chu: c });
    }
  }
  ds.sort((a, b) => a.stt - b.stt);
  ds.forEach((d, k) => {
    if (d.stt !== k + 1) loi.push(`${ten}: số thứ tự ${d.stt} ở vị trí ${k + 1}`);
  });
  const trung = ds.filter((d, k) => ds.findIndex((e) => e.chu === d.chu) !== k);
  if (trung.length) loi.push(`${ten}: chữ trùng ${trung.map((d) => d.chu).join(' ')}`);
  return ds;
}

const tu = trichTu();
const chuNhanBiet = trichChu(TRANG[cap].chuNhanBiet, 'Chữ nhận biết');
const tapNhanBiet = new Set(chuNhanBiet.map((d) => d.chu));
const chuVietTay = trichChu(TRANG[cap].chuVietTay, 'Chữ viết tay').map((d) => ({ ...d, nhanBietCap: tapNhanBiet.has(d.chu) ? cap : null }));

// Đối chiếu chữ trong từ với danh sách chữ nhận biết (chỉ báo cáo).
const chuTrongTu = new Set(tu.flatMap((t) => [...t.tu].filter((c) => HAN.test(c))));
const thieu = [...chuTrongTu].filter((c) => !tapNhanBiet.has(c));
const khongDung = chuNhanBiet.filter((d) => !chuTrongTu.has(d.chu)).map((d) => d.chu);

const raDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'de-cuong');
const ra = join(raDir, `hsk${cap}.json`);
const cu = existsSync(ra) ? JSON.parse(readFileSync(ra, 'utf8')) : {};
const nguPhap = cu.nguPhap || [];

const duLieu = {
  moTa: `Danh sách HSK ${cap} trích từ Đề cương thi HSK (11/2025): từ, chữ nhận biết, chữ viết tay, điểm ngữ pháp.`,
  nguon: {
    ...NGUON,
    sha256: createHash('sha256').update(readFileSync(pdf)).digest('hex'),
    trangIn: Object.fromEntries(Object.entries(TRANG[cap]).map(([k, [a, b]]) => [k, a === b ? `${a - 2}` : `${a - 2}–${b - 2}`])),
    ngayTrich: new Date().toISOString().slice(0, 10),
  },
  cap,
  soLuong: {
    tu: tu.length,
    chuNhanBiet: chuNhanBiet.length,
    chuVietTay: chuVietTay.length,
    chuVietTayCoTrongNhanBiet: chuVietTay.filter((d) => d.nhanBietCap).length,
    nguPhap: nguPhap.length,
    nhomNguPhap: new Set(nguPhap.map((n) => [n.loai, n.tieuLoai, n.muc].join('|'))).size,
  },
  quyUoc: {
    stt: 'Số thứ tự trong đề cương, dùng làm mã. Từ đánh số liên tục qua mọi cấp; chữ nhận biết đánh số lại từ 1 ở mỗi cấp; chữ viết tay đánh số theo danh sách của đề cương.',
    cap: 'Cấp cần học từ ở các từ loại trong "tuLoai". Đề cương ghi kiểu 1（4） với từ loại trong ngoặc, ví dụ 半 "数、（副）": dùng làm số từ ở cấp 1, làm phó từ ở cấp 4. "tuLoaiCapSau" giữ các nhóm trong ngoặc theo đúng thứ tự.',
    tuLoai: 'Chép nguyên văn ký hiệu từ loại tiếng Trung của đề cương. Cụm cố định không ghi từ loại (不客气, 你好…) có "tuLoai" rỗng.',
    dongHinh: 'Số đánh sau chữ để phân biệt từ đồng hình khác nghĩa, ví dụ 会1 (động từ, cấp 1) và 会2 (danh từ, cấp 3).',
    pinyin: 'Chép nguyên văn đề cương. Đề cương ghi thanh biến của 一 và 不 (不客气 bú kèqi, 一下 yíxià), tức dạng "Pinyin hiển thị" ở mục 11.2 của đặc tả; Pinyin gốc thêm khi soạn nội dung.',
    chuVietTay: `Đề cương gộp chữ viết tay cấp 1 và 2 thành một danh sách (cấp ${CAP_VIET_TAY[cap]}). "nhanBietCap" là ${cap} nếu chữ có trong danh sách nhận biết cấp ${cap}, null nếu chữ thuộc cấp sau.`,
    nguPhap: 'Đề cương không đánh mã điểm ngữ pháp; mã NP<cấp>-<số> do Xinyu đặt theo thứ tự các dòng trong bảng. Bốn cột 类别, 类别名称, 细目, 语法内容 ứng với "loai", "tieuLoai", "muc", "noiDung". Mỗi ô của cột 语法内容 là một điểm; ô để trống thì điểm là chính "muc". Các điểm cùng "loai", "tieuLoai", "muc" là một nhóm ("nhomNguPhap" trong "soLuong"). Chỉ số trên như 了¹, 了² chép theo đề cương. "ghiChu" ghi chỗ nghi đề cương in sai.',
  },
  doiChieu: {
    chuTrongTuNgoaiNhanBiet: thieu,
    chuNhanBietNgoaiTu: khongDung,
  },
  tu,
  chuNhanBiet,
  chuVietTay,
  nguPhap,
};

// Mỗi phần tử của mảng đối tượng nằm trên một dòng cho dễ đọc và dễ so sánh thay đổi.
function vietJson(v, lui = '') {
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (v.every((x) => x === null || typeof x !== 'object')) return JSON.stringify(v);
    return `[\n${v.map((x) => `${lui}  ${JSON.stringify(x)}`).join(',\n')}\n${lui}]`;
  }
  if (v && typeof v === 'object') {
    return `{\n${Object.entries(v).map(([k, x]) => `${lui}  ${JSON.stringify(k)}: ${vietJson(x, lui + '  ')}`).join(',\n')}\n${lui}}`;
  }
  return JSON.stringify(v);
}

console.log(`Từ: ${tu.length}; chữ nhận biết: ${chuNhanBiet.length}; chữ viết tay (cấp ${CAP_VIET_TAY[cap]}): ${chuVietTay.length}, trong đó ${duLieu.soLuong.chuVietTayCoTrongNhanBiet} có trong chữ nhận biết cấp ${cap}`);
console.log(`Ngữ pháp (giữ từ tệp cũ): ${nguPhap.length} điểm, ${duLieu.soLuong.nhomNguPhap} nhóm`);
console.log(`Chữ viết tay ngoài chữ nhận biết cấp ${cap}: ${chuVietTay.filter((d) => !d.nhanBietCap).map((d) => d.chu).join(' ') || 'không có'}`);
console.log(`Chữ có trong từ nhưng không có trong chữ nhận biết: ${thieu.join(' ') || 'không có'}`);
console.log(`Chữ nhận biết không xuất hiện trong từ nào: ${khongDung.join(' ') || 'không có'}`);
for (const g of ghiChu) console.log(`Ghi chú: ${g}`);
if (loi.length) {
  for (const l of loi) console.error(`LỖI: ${l}`);
  console.error(`Không ghi ${ra} vì có lỗi.`);
  process.exit(1);
}
mkdirSync(raDir, { recursive: true });
writeFileSync(ra, vietJson(duLieu) + '\n');
console.log(`Đã ghi ${ra}`);
