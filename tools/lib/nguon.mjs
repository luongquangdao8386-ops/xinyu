// Đọc Google Sheet biên soạn: tệp .xlsx, thư mục CSV (mỗi tab một tệp) hoặc đường dẫn “Công bố lên web” dạng .xlsx.
// Dùng chung cho tools/xay-noi-dung.mjs và tools/dien-noi-dung.mjs.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { docCsv, docXlsx } from './bang-tinh.mjs';
import { TAB } from './cau-truc.mjs';

// fetch của Node không tự đi qua HTTPS_PROXY (môi trường cloud cần proxy để tới docs.google.com):
// chạy lại chính script với NODE_USE_ENV_PROXY=1 (Node ≥ 22.21). Gọi ở đầu script, trước khi làm gì khác.
export async function quaProxy() {
  if (!(process.env.HTTPS_PROXY || process.env.https_proxy) || process.env.NODE_USE_ENV_PROXY) return;
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, ['--disable-warning=UNDICI-EHPA', ...process.execArgv, ...process.argv.slice(1)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(r.status ?? 1);
}

// Trả về Map tên tab → mảng dòng (dòng đầu là tiêu đề).
export async function docNguon(nguon) {
  if (/^https?:\/\//.test(nguon)) {
    const tl = await fetch(nguon);
    if (!tl.ok) throw new Error(`tải ${nguon} lỗi ${tl.status}`);
    const buf = Buffer.from(await tl.arrayBuffer());
    if (buf.subarray(0, 2).toString() !== 'PK') throw new Error('đường dẫn không trả về tệp .xlsx; khi công bố lên web hãy chọn cả tài liệu và định dạng .xlsx');
    return docXlsx(buf);
  }
  if (statSync(nguon).isDirectory()) {
    const tep = readdirSync(nguon).filter((t) => t.toLowerCase().endsWith('.csv'));
    const bang = new Map();
    for (const tab of TAB) {
      const t = tep.find((x) => x.toLowerCase() === `${tab.ten.toLowerCase()}.csv` || x.toLowerCase().endsWith(` - ${tab.ten.toLowerCase()}.csv`));
      if (t) bang.set(tab.ten, docCsv(readFileSync(join(nguon, t), 'utf8')));
    }
    return bang;
  }
  return docXlsx(readFileSync(nguon));
}
