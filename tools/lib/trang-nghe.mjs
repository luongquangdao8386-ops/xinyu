// Trang nghe duyệt âm thanh mẫu (mục 11.6 bước 6): một tệp HTML tự chứa (MP3 nhúng sẵn), chạm để nghe từng tệp,
// xem đường cao độ, thấy chỗ máy kiểm tra thanh điệu báo và đánh dấu tệp cần sửa. Đăng thành Artifact thì đánh
// dấu lưu vào kho dữ liệu của trang (bộ sưu tập canSua) để Claude đọc ở phiên sau; mở bằng trình duyệt thì
// lưu trên máy và sao chép danh sách để gửi Claude.

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Đường cao độ dạng SVG: trục dọc là nửa cung so với cao độ trung bình của giọng (-12…+12), đường đứt là mức trung bình.
function duongCaoDo(f0, moc, dai) {
  const rong = Math.round(Math.min(220, Math.max(64, dai * 90)));
  const cao = 40;
  const y = (hz) => (cao / 2 - (12 * Math.log2(hz / moc) * cao) / 24).toFixed(1);
  const n = Math.max(f0.length, Math.round(dai * 100));
  let d = '';
  let ngat = true;
  f0.forEach((hz, i) => {
    if (!hz) {
      ngat = true;
      return;
    }
    d += `${ngat ? 'M' : 'L'}${((i / n) * rong).toFixed(1)} ${y(hz)}`;
    ngat = false;
  });
  return `<svg class="duong" width="${rong}" height="${cao}" viewBox="0 0 ${rong} ${cao}" aria-hidden="true"><line x1="0" x2="${rong}" y1="${cao / 2}" y2="${cao / 2}"/><path d="${d}"/></svg>`;
}

function dongMuc(m, so) {
  const co = m.canhBao.length
    ? `<p class="co"><span aria-hidden="true">⚠</span> ${m.canhBao.map(esc).join('; ')}</p>`
    : '';
  return `<li class="muc" data-khoa="${esc(m.khoa)}">
<button type="button" class="nghe" aria-label="Nghe ${esc(m.chu)} ${esc(m.pinyin)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg></button>
<div class="noi-dung"><p class="dong-chu"><span class="han" lang="zh-CN">${esc(m.chu)}</span> <span class="py">${esc(m.pinyin)}</span>${m.nghia ? ` <span class="nghia">${esc(m.nghia)}</span>` : ''}</p>
<p class="phu">${esc(m.moTa)}</p>${co}</div>
${duongCaoDo(m.f0, m.moc, m.dai)}
<label class="sua"><input type="checkbox" id="sua-${so}"> Cần sửa</label>
<input type="text" class="ly-do" id="ly-do-${so}" placeholder="Sai chỗ nào? (không bắt buộc)" aria-label="Lý do cần sửa ${esc(m.chu)}" hidden>
</li>`;
}

// du: { tieuDe, moTa, tongKet: [chuỗi], nhom: [{ phan, ten, muc: [khóa] }], muc: { khóa: mục }, amThanh: { khóa: base64 } }.
// Mỗi mục: { khoa, chu, pinyin, nghia, moTa, canhBao: [chuỗi], f0, moc, dai }.
export function taoTrangNghe(du) {
  let so = 0;
  const phan = [];
  for (const n of du.nhom) {
    let p = phan.find((x) => x.ten === n.phan);
    if (!p) phan.push((p = { ten: n.phan, nhom: [] }));
    p.nhom.push(n);
  }
  const noiDung = phan
    .map(
      (p) => `<details class="phan" open><summary><h2>${esc(p.ten)}</h2></summary>
${p.nhom
  .map(
    (n) => `<section class="nhom"><div class="dau-nhom"><h3>${esc(n.ten)}</h3>${n.muc.length > 1 ? '<button type="button" class="nghe-het">Nghe lần lượt</button>' : ''}</div>
<ul class="ds">${n.muc.map((k) => dongMuc(du.muc[k], ++so)).join('\n')}</ul></section>`,
  )
  .join('\n')}</details>`,
    )
    .join('\n');
  const thongTin = Object.fromEntries(Object.values(du.muc).map((m) => [m.khoa, { chu: m.chu, pinyin: m.pinyin, moTa: m.moTa }]));
  return `<title>Duyệt âm thanh Xinyu</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Noto+Sans+SC:wght@400;500&family=Noto+Serif:wght@600&display=swap">
<style>
/* Một cột như màn điện thoại của app (mục 8.5): giấy ngà, chữ nâu mực, đỏ son cho nút và dấu nhận diện. */
:root {
  --nen: #FBF6EE; --nen-phu: #F0E5D7; --chu: #352521; --chu-phu: #6B5A50; --son: #AB483B; --tren-son: #FBF6EE;
  --canh-bao: #7A5410; --nen-canh-bao: #F6ECD2; --vien: #8F7C6C; --phan-cach: #E2D5C3; --dang-nghe: #F0E5D7;
  --tieu-de: "Noto Serif", Georgia, serif; --than: "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --han: "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --nen: #1D1815; --nen-phu: #2B231E; --chu: #F2E8DC; --chu-phu: #C4B4A6; --son: #E8806F; --tren-son: #1D1815;
  --canh-bao: #E6BE6E; --nen-canh-bao: #3A2E17; --vien: #9C8878; --phan-cach: #3B312A; --dang-nghe: #33291F; color-scheme: dark; } }
:root[data-theme="dark"] {
  --nen: #1D1815; --nen-phu: #2B231E; --chu: #F2E8DC; --chu-phu: #C4B4A6; --son: #E8806F; --tren-son: #1D1815;
  --canh-bao: #E6BE6E; --nen-canh-bao: #3A2E17; --vien: #9C8878; --phan-cach: #3B312A; --dang-nghe: #33291F; color-scheme: dark; }
body { background: var(--nen); color: var(--chu); font: 15px/1.55 var(--than); }
.trang { max-width: 720px; margin: 0 auto; padding-block: 28px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 28px; }
h1, h2, h3 { font-family: var(--tieu-de); font-weight: 600; text-wrap: balance; margin: 0; }
h1 { font-size: 1.9rem; line-height: 1.2; }
h2 { font-size: 1.3rem; display: inline; }
h3 { font-size: 1rem; }
p { margin: 0; }
.nhan { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--son); font-weight: 600; }
.dau-trang { display: grid; gap: 10px; }
.mo-ta { color: var(--chu-phu); max-width: 62ch; }
.tong { display: flex; flex-wrap: wrap; gap: 6px 18px; font-variant-numeric: tabular-nums; color: var(--chu-phu); font-size: .9rem; }
.tong b { color: var(--chu); }
.khoi { background: var(--nen-phu); border-radius: 10px; padding: 16px; display: grid; gap: 10px; }
.khoi ul { margin: 0; padding-left: 1.2em; display: grid; gap: 4px; }
.hang-nut { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
button { font: inherit; color: inherit; cursor: pointer; }
.nut { min-height: 44px; padding: 0 16px; border-radius: 8px; border: 1px solid var(--vien); background: transparent; }
.nut-chinh { background: var(--son); color: var(--tren-son); border-color: var(--son); font-weight: 600; }
.trang-thai { color: var(--chu-phu); font-size: .88rem; }
.phan { border-top: 1px solid var(--phan-cach); padding-top: 14px; }
.phan > summary { cursor: pointer; list-style-position: outside; padding: 4px 0 8px; }
.nhom { display: grid; gap: 6px; margin-top: 14px; }
.dau-nhom { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.nghe-het { min-height: 36px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--phan-cach); background: transparent; color: var(--chu-phu); font-size: .88rem; }
.ds { list-style: none; margin: 0; padding: 0; display: grid; }
.muc { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto auto; gap: 4px 12px; align-items: center; padding: 8px 6px; border-bottom: 1px solid var(--phan-cach); border-radius: 6px; }
.muc.dang-nghe { background: var(--dang-nghe); }
.nghe { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--vien); background: transparent; display: grid; place-items: center; }
.nghe svg { width: 18px; height: 18px; fill: var(--son); }
.dong-chu { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
.han { font-family: var(--han); font-size: 1.35rem; }
.py { font-size: 1.05rem; }
.nghia, .phu { color: var(--chu-phu); font-size: .88rem; }
.co { color: var(--canh-bao); background: var(--nen-canh-bao); font-size: .86rem; padding: 2px 8px; border-radius: 6px; justify-self: start; margin-top: 4px; }
.duong line { stroke: var(--phan-cach); stroke-dasharray: 3 3; }
.duong path { stroke: var(--chu); stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.sua { display: flex; align-items: center; gap: 6px; min-height: 44px; font-size: .9rem; white-space: nowrap; cursor: pointer; }
.sua input { width: 20px; height: 20px; accent-color: var(--son); }
.ly-do { grid-column: 2 / -1; min-height: 40px; padding: 0 10px; border: 1px solid var(--vien); border-radius: 6px; background: var(--nen); color: var(--chu); font: inherit; }
:focus-visible { outline: 2px solid var(--son); outline-offset: 2px; }
@media (max-width: 520px) {
  .muc { grid-template-columns: 44px minmax(0, 1fr) auto; }
  .duong { grid-column: 2; grid-row: 2; }
  .sua { grid-column: 3; grid-row: 1; }
}
@media (prefers-reduced-motion: no-preference) { .muc { transition: background-color .2s; } }
</style>
<main class="trang">
<header class="dau-trang">
<p class="nhan">Xinyu · Âm thanh mẫu</p>
<h1>${esc(du.tieuDe)}</h1>
<p class="mo-ta">${esc(du.moTa)}</p>
<p class="tong">${du.tongKet.map((t) => `<span>${t}</span>`).join('')}</p>
</header>
<section class="khoi" aria-labelledby="tieu-de-sua">
<h2 id="tieu-de-sua">Tệp bạn đánh dấu cần sửa</h2>
<p id="trong">Chưa có tệp nào. Khi nghe thấy tệp đọc sai, khó nghe hay có tiếng lạ, bấm “Cần sửa” ở dòng đó và ghi ngắn lý do.</p>
<ul id="ds-sua" hidden></ul>
<div class="hang-nut"><button type="button" class="nut nut-chinh" id="sao-chep" hidden>Sao chép danh sách</button><span class="trang-thai" id="trang-thai">Đánh dấu đang lưu trên máy này.</span></div>
</section>
${noiDung}
</main>
<script>
const AM = ${JSON.stringify(du.amThanh)};
const TT = ${JSON.stringify(thongTin)};
const docKhoa = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const ghiKhoa = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
let danhDau = docKhoa('xinyu-can-sua') || {};
let kho = null;

// Nghe: một trình phát dùng chung; "Nghe lần lượt" phát cả nhóm.
const phat = new Audio();
let hangDoi = [];
function nghe(li) {
  document.querySelectorAll('.muc.dang-nghe').forEach((x) => x.classList.remove('dang-nghe'));
  li.classList.add('dang-nghe');
  phat.src = 'data:audio/mpeg;base64,' + AM[li.dataset.khoa];
  phat.play().catch(() => li.classList.remove('dang-nghe'));
}
phat.addEventListener('ended', () => {
  document.querySelectorAll('.muc.dang-nghe').forEach((x) => x.classList.remove('dang-nghe'));
  const tiep = hangDoi.shift();
  if (tiep) setTimeout(() => nghe(tiep), 450);
});
document.addEventListener('click', (e) => {
  const nut = e.target.closest('.nghe');
  if (nut) { hangDoi = []; nghe(nut.closest('.muc')); return; }
  const het = e.target.closest('.nghe-het');
  if (het) { hangDoi = [...het.closest('.nhom').querySelectorAll('.muc')]; nghe(hangDoi.shift()); }
});

// Đánh dấu cần sửa: kho dữ liệu của trang nếu có, không thì lưu trên máy.
function veDanhDau() {
  document.querySelectorAll('.muc').forEach((li) => {
    const d = danhDau[li.dataset.khoa];
    li.querySelector('.sua input').checked = !!d;
    const o = li.querySelector('.ly-do');
    o.hidden = !d;
    if (d && document.activeElement !== o) o.value = d.lyDo || '';
  });
  const khoa = Object.keys(danhDau);
  const ds = document.getElementById('ds-sua');
  ds.hidden = !khoa.length;
  document.getElementById('trong').hidden = !!khoa.length;
  document.getElementById('sao-chep').hidden = !khoa.length;
  ds.replaceChildren(...khoa.map((k) => {
    const li = document.createElement('li');
    const t = TT[k] || {};
    li.textContent = t.chu + ' ' + t.pinyin + ' (' + t.moTa + ')' + (danhDau[k].lyDo ? ': ' + danhDau[k].lyDo : '');
    return li;
  }));
}
async function luu(k, d) {
  if (d) danhDau[k] = d; else delete danhDau[k];
  ghiKhoa('xinyu-can-sua', danhDau);
  veDanhDau();
  if (!kho) return;
  const ref = kho.collection('canSua').doc(k);
  try { if (d) await ref.set({ ...d, ...TT[k], khoa: k, luc: new Date().toISOString() }); else await ref.delete(); }
  catch (e) { document.getElementById('trang-thai').textContent = 'Không lưu được vào kho của trang (' + (e.code || 'lỗi') + '); đánh dấu vẫn giữ trên máy này.'; }
}
document.addEventListener('change', (e) => {
  const li = e.target.closest('.muc');
  if (!li) return;
  const k = li.dataset.khoa;
  if (e.target.matches('.sua input')) luu(k, e.target.checked ? { lyDo: li.querySelector('.ly-do').value.trim() } : null);
  if (e.target.matches('.ly-do') && danhDau[k]) luu(k, { lyDo: e.target.value.trim() });
});
document.getElementById('sao-chep').addEventListener('click', async () => {
  const van = 'Âm thanh cần sửa:\\n' + Object.keys(danhDau).map((k) => '- ' + k + ' ' + TT[k].chu + ' ' + TT[k].pinyin + (danhDau[k].lyDo ? ': ' + danhDau[k].lyDo : '')).join('\\n');
  const tt = document.getElementById('trang-thai');
  try { await navigator.clipboard.writeText(van); tt.textContent = 'Đã sao chép. Dán vào trò chuyện với Claude.'; }
  catch { tt.textContent = van; }
});
veDanhDau();
(async () => {
  kho = window.claude && window.claude.use ? await window.claude.use('db').catch(() => null) : null;
  if (!kho) return;
  document.getElementById('trang-thai').textContent = 'Đánh dấu được lưu cùng trang này; Claude đọc được ở phiên sau.';
  kho.collection('canSua').onSnapshot((snap) => {
    danhDau = {};
    snap.docs.forEach((d) => { const v = d.data(); danhDau[d.id] = { lyDo: v.lyDo || '' }; });
    ghiKhoa('xinyu-can-sua', danhDau);
    veDanhDau();
  }, () => { document.getElementById('trang-thai').textContent = 'Không đọc được kho của trang; đánh dấu lưu trên máy này.'; kho = null; });
})();
</script>
`;
}
