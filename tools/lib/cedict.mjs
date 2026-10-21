// Nạp CC-CEDICT (giấy phép CC BY-SA 4.0) để đối chiếu Pinyin (mục 11.6 bước 2). Không đưa từ điển vào repo:
// lần đầu tải gói npm cedict-json (bản cố định, có kiểm tra mã băm) rồi lưu bản gọn vào tools/.cache/.
// Cũng đọc được tệp cedict_ts.u8 tải từ mdbg.net hoặc tệp JSON của gói đó qua tham số --cedict.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const GOI = {
  ten: 'cedict-json',
  phienBan: '1.3.20251213',
  tai: 'https://registry.npmjs.org/cedict-json/-/cedict-json-1.3.20251213.tgz',
  sha512: 'RVmJrMNhbPjRSKoP68urEEAr06zKH/Cq/+ABVJ8dIq15rTzW5W25NANVy1RMjU/pwX/eZ+yQ02k5RkXRjj6qgg==',
};

const THU_MUC_DEM = join(dirname(fileURLToPath(import.meta.url)), '..', '.cache');
const TEP_DEM = join(THU_MUC_DEM, `cedict-${GOI.phienBan}.json`);

// Gom thành { 简体: ['pin1 yin1', ...] }, Pinyin viết thường.
function gom(muc) {
  const tu = {};
  for (const { simplified, pinyin } of muc) (tu[simplified] ||= []).push(pinyin.toLowerCase());
  return tu;
}

function docU8(van) {
  const muc = [];
  for (const dong of van.split('\n')) {
    const m = dong.match(/^\S+ (\S+) \[([^\]]*)\]/);
    if (m) muc.push({ simplified: m[1], pinyin: m[2] });
  }
  return muc;
}

function layTepTrongTar(tar, ten) {
  for (let p = 0; p + 512 <= tar.length; ) {
    const tenTep = tar.toString('utf8', p, p + 100).replace(/\0.*$/s, '');
    if (!tenTep) break;
    const coTep = parseInt(tar.toString('utf8', p + 124, p + 136).replace(/\0.*$/s, '').trim() || '0', 8);
    if (tenTep === ten) return tar.subarray(p + 512, p + 512 + coTep);
    p += 512 + Math.ceil(coTep / 512) * 512;
  }
  return null;
}

async function taiGoi() {
  const tl = await fetch(GOI.tai);
  if (!tl.ok) throw new Error(`tải ${GOI.tai} lỗi ${tl.status}`);
  const tgz = Buffer.from(await tl.arrayBuffer());
  const bam = createHash('sha512').update(tgz).digest('base64');
  if (bam !== GOI.sha512) throw new Error('mã băm gói cedict-json không khớp, không dùng');
  const json = layTepTrongTar(gunzipSync(tgz), 'package/cedict.json');
  if (!json) throw new Error('không thấy cedict.json trong gói');
  return gom(JSON.parse(json.toString('utf8')));
}

// Trả về { tra: Map 简体 → [pinyin], nguon } hoặc { loi } khi không nạp được.
export async function napCedict(tep) {
  try {
    let tu;
    let nguon;
    if (tep) {
      const van = readFileSync(tep, 'utf8');
      tu = gom(tep.endsWith('.json') ? JSON.parse(van) : docU8(van));
      nguon = tep;
    } else if (existsSync(TEP_DEM)) {
      tu = JSON.parse(readFileSync(TEP_DEM, 'utf8'));
      nguon = `${GOI.ten} ${GOI.phienBan} (bản lưu trong tools/.cache)`;
    } else {
      tu = await taiGoi();
      mkdirSync(THU_MUC_DEM, { recursive: true });
      writeFileSync(TEP_DEM, JSON.stringify(tu));
      nguon = `${GOI.ten} ${GOI.phienBan} (vừa tải từ npm)`;
    }
    return { tra: new Map(Object.entries(tu)), nguon };
  } catch (e) {
    return { loi: e.message };
  }
}
