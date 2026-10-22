// Máy chủ tĩnh tối giản để chạy mô phỏng trên máy (ES modules cần mở qua http, không mở trực tiếp file://).
// Chạy: node kiem-thu/may-chu.mjs [cổng]  rồi mở http://127.0.0.1:8080/
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.glb': 'model/gltf-binary',
};

export function moMayChu(cong = 0) {
  const may = http.createServer((yc, tl) => {
    let p = decodeURIComponent(new URL(yc.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(GOC, path.normalize(p));
    if (!f.startsWith(GOC) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { tl.writeHead(404); tl.end('Không có tệp'); return; }
    tl.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(f).pipe(tl);
  });
  return new Promise((ok) => may.listen(cong, '127.0.0.1', () => ok(may)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const may = await moMayChu(Number(process.argv[2]) || 8080);
  console.log(`Mở http://127.0.0.1:${may.address().port}/  (Ctrl+C để dừng)`);
}
