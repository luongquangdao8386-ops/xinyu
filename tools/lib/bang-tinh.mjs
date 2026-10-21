// Đọc và ghi bảng tính không cần thư viện ngoài: CSV, và XLSX ở mức đủ dùng cho công cụ biên soạn
// (chữ, số, ô đúng/sai, kiểm tra dữ liệu dạng danh sách). Một bảng là mảng các dòng, mỗi dòng là mảng chuỗi.

import { deflateRawSync, inflateRawSync } from 'node:zlib';

// ---------- CSV ----------

export function docCsv(van) {
  van = van.replace(/^﻿/, '');
  const dong = [];
  let o = '';
  let hang = [];
  let ngoac = false;
  for (let i = 0; i < van.length; i++) {
    const c = van[i];
    if (ngoac) {
      if (c === '"' && van[i + 1] === '"') {
        o += '"';
        i++;
      } else if (c === '"') ngoac = false;
      else o += c;
    } else if (c === '"') ngoac = true;
    else if (c === ',') {
      hang.push(o);
      o = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && van[i + 1] === '\n') i++;
      hang.push(o);
      dong.push(hang);
      hang = [];
      o = '';
    } else o += c;
  }
  if (o !== '' || hang.length) {
    hang.push(o);
    dong.push(hang);
  }
  return dong;
}

// ---------- ZIP ----------

const BANG_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = BANG_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function docZip(buf) {
  let cuoi = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      cuoi = i;
      break;
    }
  }
  if (cuoi < 0) throw new Error('Không phải tệp .xlsx (không đọc được cấu trúc zip)');
  const soTep = buf.readUInt16LE(cuoi + 10);
  let p = buf.readUInt32LE(cuoi + 16);
  const tep = new Map();
  for (let k = 0; k < soTep; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Tệp zip hỏng');
    const cachNen = buf.readUInt16LE(p + 10);
    const coNen = buf.readUInt32LE(p + 20);
    const dTen = buf.readUInt16LE(p + 28);
    const dThem = buf.readUInt16LE(p + 30);
    const dChu = buf.readUInt16LE(p + 32);
    const dau = buf.readUInt32LE(p + 42);
    const ten = buf.toString('utf8', p + 46, p + 46 + dTen);
    const batDau = dau + 30 + buf.readUInt16LE(dau + 26) + buf.readUInt16LE(dau + 28);
    const du = buf.subarray(batDau, batDau + coNen);
    tep.set(ten, () => (cachNen === 8 ? inflateRawSync(du) : du));
    p += 46 + dTen + dThem + dChu;
  }
  return tep;
}

function ghiZip(tep) {
  const phan = [];
  const muc = [];
  let viTri = 0;
  for (const [ten, noiDung] of tep) {
    const tenB = Buffer.from(ten, 'utf8');
    const goc = Buffer.from(noiDung, 'utf8');
    const nen = deflateRawSync(goc);
    const crc = crc32(goc);
    const dau = Buffer.alloc(30);
    dau.writeUInt32LE(0x04034b50, 0);
    dau.writeUInt16LE(20, 4);
    dau.writeUInt16LE(0x0800, 6); // tên tệp UTF-8
    dau.writeUInt16LE(8, 8);
    dau.writeUInt32LE(crc, 14);
    dau.writeUInt32LE(nen.length, 18);
    dau.writeUInt32LE(goc.length, 22);
    dau.writeUInt16LE(tenB.length, 26);
    phan.push(dau, tenB, nen);
    const tt = Buffer.alloc(46);
    tt.writeUInt32LE(0x02014b50, 0);
    tt.writeUInt16LE(20, 4);
    tt.writeUInt16LE(20, 6);
    tt.writeUInt16LE(0x0800, 8);
    tt.writeUInt16LE(8, 10);
    tt.writeUInt32LE(crc, 16);
    tt.writeUInt32LE(nen.length, 20);
    tt.writeUInt32LE(goc.length, 24);
    tt.writeUInt16LE(tenB.length, 28);
    tt.writeUInt32LE(viTri, 42);
    muc.push(tt, tenB);
    viTri += 30 + tenB.length + nen.length;
  }
  const thuMuc = Buffer.concat(muc);
  const ket = Buffer.alloc(22);
  ket.writeUInt32LE(0x06054b50, 0);
  ket.writeUInt16LE(tep.size, 8);
  ket.writeUInt16LE(tep.size, 10);
  ket.writeUInt32LE(thuMuc.length, 12);
  ket.writeUInt32LE(viTri, 16);
  return Buffer.concat([...phan, thuMuc, ket]);
}

// ---------- XLSX ----------

const giaiXml = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|lt|gt|amp|quot|apos);/gi, (_, m) => {
    if (m[0] === '#') return String.fromCodePoint(m[1].toLowerCase() === 'x' ? parseInt(m.slice(2), 16) : +m.slice(1));
    return { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" }[m.toLowerCase()];
  });

const maXml = (s) =>
  String(s)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const chuTrongThe = (xml) =>
  giaiXml([...xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '').matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(''));

const soCot = (ref) => [...ref.replace(/\d+$/, '')].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
const tenCot = (i) => (i < 26 ? '' : tenCot(Math.floor(i / 26) - 1)) + String.fromCharCode(65 + (i % 26));

// Trả về Map tên tab → mảng dòng. Ô số trả về dạng chuỗi như trong tệp; ô đúng/sai trả về "TRUE"/"FALSE".
export function docXlsx(buf) {
  const zip = docZip(buf);
  const doc = (ten) => {
    const f = zip.get(ten);
    return f ? f().toString('utf8') : '';
  };
  const chung = [...doc('xl/sharedStrings.xml').matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((m) => chuTrongThe(m[1]));
  const lienKet = new Map(
    [...doc('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)].map((m) => [
      m[0].match(/\bId="([^"]+)"/)[1],
      m[0].match(/\bTarget="([^"]+)"/)[1],
    ]),
  );
  const ketQua = new Map();
  for (const m of doc('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const ten = giaiXml(m[0].match(/\bname="([^"]*)"/)[1]);
    const dich = lienKet.get(m[0].match(/\br:id="([^"]+)"/)[1]);
    const duongDan = dich.startsWith('/') ? dich.slice(1) : `xl/${dich.replace(/^\.\//, '')}`;
    const dong = [];
    for (const r of doc(duongDan).matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
      const mDong = r[1].match(/\br="(\d+)"/);
      const soDong = mDong ? +mDong[1] - 1 : dong.length;
      const hang = [];
      let viTri = 0;
      for (const c of (r[2] || '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = (c[1].match(/\br="([A-Z]+\d+)"/) || [])[1];
        const cot = ref ? soCot(ref) : viTri;
        viTri = cot + 1;
        const kieu = (c[1].match(/\bt="([^"]+)"/) || [])[1];
        const v = ((c[2] || '').match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        let giaTri = '';
        if (kieu === 's') giaTri = chung[+v] ?? '';
        else if (kieu === 'inlineStr') giaTri = chuTrongThe((c[2] || '').match(/<is>([\s\S]*?)<\/is>/)?.[1] || '');
        else if (kieu === 'b') giaTri = v === '1' ? 'TRUE' : 'FALSE';
        else if (v !== undefined) giaTri = giaiXml(v);
        hang[cot] = giaTri;
      }
      dong[soDong] = Array.from(hang, (x) => x ?? '');
    }
    ketQua.set(ten, Array.from(dong, (x) => x ?? []));
  }
  return ketQua;
}

// tab: [{ ten, dong: [[...], ...], doRong: [số ký tự mỗi cột], danhSach: [{ cot, giaTri: [...] }] }]
// Dòng đầu in đậm và cố định khi cuộn; danhSach tạo ô chọn giá trị cho cả cột.
export function ghiXlsx(tab) {
  const tep = new Map();
  tep.set(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      tab.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') +
      '</Types>',
  );
  tep.set(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
  );
  tep.set(
    'xl/workbook.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
      tab.map((t, i) => `<sheet name="${maXml(t.ten)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') +
      '</sheets></workbook>',
  );
  tep.set(
    'xl/_rels/workbook.xml.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      tab.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') +
      `<Relationship Id="rId${tab.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  );
  tep.set(
    'xl/styles.xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><name val="Arial"/></font></fonts>' +
      '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
      '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs>' +
      '</styleSheet>',
  );
  tab.forEach((t, i) => {
    const soDong = Math.max(t.dong.length, 1000);
    const cot = (t.doRong || []).map((w, k) => `<col min="${k + 1}" max="${k + 1}" width="${w}" customWidth="1"${t.xuongDong ? ' style="2"' : ''}/>`).join('');
    const dong = t.dong
      .map(
        (h, r) =>
          `<row r="${r + 1}">` +
          h
            .map((v, c) => {
              if (v === '' || v === null || v === undefined) return '';
              const ref = `${tenCot(c)}${r + 1}`;
              const s = r === 0 ? ' s="1"' : t.xuongDong ? ' s="2"' : '';
              if (typeof v === 'number') return `<c r="${ref}"${s}><v>${v}</v></c>`;
              return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${maXml(v)}</t></is></c>`;
            })
            .join('') +
          '</row>',
      )
      .join('');
    const kiemTra = (t.danhSach || [])
      .map((d) => {
        const vung = `${tenCot(d.cot)}2:${tenCot(d.cot)}${soDong}`;
        return `<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="${vung}"><formula1>"${maXml(d.giaTri.join(','))}"</formula1></dataValidation>`;
      })
      .join('');
    tep.set(
      `xl/worksheets/sheet${i + 1}.xml`,
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
        (cot ? `<cols>${cot}</cols>` : '') +
        `<sheetData>${dong}</sheetData>` +
        (kiemTra ? `<dataValidations count="${t.danhSach.length}">${kiemTra}</dataValidations>` : '') +
        '</worksheet>',
    );
  });
  return ghiZip(tep);
}
