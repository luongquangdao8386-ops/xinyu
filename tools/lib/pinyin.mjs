// Xử lý Pinyin có dấu thanh: tách âm tiết, đổi sang dạng số (đối chiếu CC-CEDICT),
// sinh Pinyin gốc từ Pinyin hiển thị và kiểm tra cách ghi thanh biến của 一, 不 (mục 11.2, 11.6 của đặc tả).

// Tập âm tiết sinh từ âm đầu × vần. Tập này rộng hơn tập âm tiết thật một chút (chấp nhận vài tổ hợp
// không tồn tại); việc tách âm tiết chọn cách ít âm tiết nhất nên không ảnh hưởng Pinyin đúng chuẩn.
const AM_DAU = 'b p m f d t n l g k h j q x zh ch sh r z c s y w'.split(' ');
const VAN = 'a o e ai ei ao ou an en ang eng ong er i ia ie iao iu ian in iang ing iong u ua uo uai ui uan un uang ue ü üe üan ün'.split(' ');
const AM_TIET = new Set([
  ...VAN.filter((v) => /^[aoe]/.test(v)),
  ...AM_DAU.flatMap((d) => VAN.filter((v) => v !== 'er').map((v) => d + v)), // "zher" phải tách thành zhe + r (这儿)
  'm', 'n', 'ng', 'hm', 'hng',
]);

const DAU_THANH = { '̄': 1, '́': 2, '̌': 3, '̀': 4 };
const MA_THANH = ['', '̄', '́', '̌', '̀', ''];

export const laChuHan = (c) => /^\p{Script=Han}$/u.test(c);

// Tách chuỗi Pinyin thành âm tiết. Mỗi âm tiết: { am: 'yi', thanh: 1–5 (5 là thanh nhẹ), dau, cuoi }
// với dau/cuoi là vị trí trong chuỗi gốc. Âm "r" đứng sau âm tiết khác là âm cuốn lưỡi của 儿.
export function tachAmTiet(chuoi) {
  const s = chuoi.normalize('NFC');
  const ds = [];
  const loi = [];
  for (const m of s.matchAll(/[\p{Script=Latin}\p{M}]+/gu)) {
    const goc = m[0];
    const chu = [];
    for (let i = 0; i < goc.length; i++) {
      const tach = goc[i].normalize('NFD');
      let co = tach[0].toLowerCase();
      let thanh = 0;
      for (const dau of tach.slice(1)) {
        if (dau === '̈') co = co === 'u' ? 'ü' : co;
        else if (DAU_THANH[dau]) thanh = DAU_THANH[dau];
      }
      if (co === 'v') co = 'ü';
      chu.push({ co, thanh, viTri: m.index + i });
    }
    const n = chu.length;
    const it = Array(n + 1).fill(Infinity);
    const buoc = Array(n + 1).fill(0);
    it[n] = 0;
    for (let i = n - 1; i >= 0; i--) {
      for (let d = 1; d <= 6 && i + d <= n; d++) {
        const am = chu.slice(i, i + d).map((c) => c.co).join('');
        const hopLe = (AM_TIET.has(am) && (i === 0 || !/^[aoe]/.test(am))) || (am === 'r' && i > 0);
        if (hopLe && it[i + d] + 1 < it[i]) {
          it[i] = it[i + d] + 1;
          buoc[i] = d;
        }
      }
    }
    if (it[0] === Infinity) {
      loi.push(`không tách được âm tiết “${goc}”`);
      continue;
    }
    for (let i = 0; i < n; i += buoc[i]) {
      const phan = chu.slice(i, i + buoc[i]);
      const thanh = phan.filter((c) => c.thanh);
      if (thanh.length > 1) loi.push(`âm tiết “${goc.slice(i, i + buoc[i])}” có hai dấu thanh`);
      ds.push({
        am: phan.map((c) => c.co).join(''),
        thanh: thanh[0]?.thanh || 5,
        dau: phan[0].viTri,
        cuoi: phan.at(-1).viTri + 1,
      });
    }
  }
  return { ds, loi };
}

// "yìdiǎnr" → "yi4 dian3 r5"; ü viết u: như CC-CEDICT.
export const soHoa = (ds) => ds.map((a) => `${a.am.replace(/ü/g, 'u:')}${a.thanh}`).join(' ');

// Đặt lại dấu thanh cho một âm tiết đã viết (giữ chữ hoa, chữ thường).
export function datThanh(amTiet, thanh) {
  const tach = [...amTiet.normalize('NFD').replace(/[̄́̌̀]/g, '')];
  const nguyenAm = tach.map((c, i) => (/[aeiouv]/i.test(c) ? i : -1)).filter((i) => i >= 0);
  if (!nguyenAm.length) return amTiet;
  const thuong = tach.join('').toLowerCase();
  let viTri = nguyenAm.find((i) => /[ae]/i.test(tach[i]));
  if (viTri === undefined) viTri = thuong.includes('ou') ? thuong.indexOf('ou') : nguyenAm.at(-1);
  // Dấu hai chấm của ü là ký tự kết hợp đi ngay sau u: dấu thanh đặt sau nó.
  const sau = tach[viTri + 1] === '̈' ? viTri + 1 : viTri;
  tach.splice(sau + 1, 0, MA_THANH[thanh]);
  return tach.join('').normalize('NFC');
}

// Ghép từng chữ Hán với âm tiết của nó. Trả về null khi số chữ và số âm tiết khác nhau.
export function canChinh(chuHan, pinyin) {
  const chu = [];
  const mang = [...chuHan];
  mang.forEach((c, i) => {
    if (!laChuHan(c)) return;
    let k = i + 1;
    while (k < mang.length && /\s/.test(mang[k])) k++;
    // ketDoan: sau chữ này là dấu câu hoặc hết chuỗi, nên chữ này đứng cuối một đoạn đọc liền.
    chu.push({ chu: c, ketDoan: k >= mang.length || !laChuHan(mang[k]) });
  });
  const { ds, loi } = tachAmTiet(pinyin);
  if (loi.length || ds.length !== chu.length) return { loi: loi.length ? loi : [`Pinyin có ${ds.length} âm tiết, chữ Hán có ${chu.length} chữ`] };
  return { cap: chu.map((c, i) => ({ ...c, ...ds[i] })) };
}

// Pinyin gốc: trả 一 và 不 về thanh gốc (yī, bù), các âm tiết khác giữ nguyên.
export function sinhPinyinGoc(chuHan, pinyinHienThi) {
  const { cap, loi } = canChinh(chuHan, pinyinHienThi);
  if (!cap) return { loi };
  let ket = pinyinHienThi.normalize('NFC');
  for (const a of [...cap].reverse()) {
    let moi = 0;
    if (a.chu === '一' && a.am === 'yi' && (a.thanh === 2 || a.thanh === 4)) moi = 1;
    if (a.chu === '不' && a.am === 'bu' && a.thanh === 2) moi = 4;
    if (moi) ket = ket.slice(0, a.dau) + datThanh(ket.slice(a.dau, a.cuoi), moi) + ket.slice(a.cuoi);
  }
  return { pinyinGoc: ket };
}

const CHU_SO = '第十期零二三四五六七八九百千万两';

// Kiểm tra cách ghi 一 và 不 trong Pinyin hiển thị. Trả về các phát hiện:
// { muc: 'canhBao' | 'xemTay', noiDung }. "xemTay" là trường hợp có thể là ngoại lệ đúng
// (一 giữ yī khi đọc số, thứ tự, ngày giờ) nên cần xem bằng tay.
export function kiemTraYiBu(chuHan, pinyinHienThi, pinyinGoc) {
  const { cap, loi } = canChinh(chuHan, pinyinHienThi);
  if (!cap) return loi.map((noiDung) => ({ muc: 'canhBao', noiDung }));
  const ket = [];
  let goc = null;
  if (pinyinGoc) {
    const g = canChinh(chuHan, pinyinGoc);
    if (!g.cap) ket.push(...g.loi.map((l) => ({ muc: 'canhBao', noiDung: `Pinyin gốc: ${l}` })));
    else {
      goc = g.cap;
      cap.forEach((a, i) => {
        const b = goc[i];
        const dung = a.chu === '一' ? b.am === 'yi' && [1, 5].includes(b.thanh) : a.chu === '不' ? b.am === 'bu' && [4, 5].includes(b.thanh) : a.am === b.am && a.thanh === b.thanh;
        if (!dung) ket.push({ muc: 'canhBao', noiDung: `Pinyin gốc và hiển thị khác nhau ở chữ ${a.chu} (${pinyinGoc.slice(b.dau, b.cuoi)} / ${pinyinHienThi.slice(a.dau, a.cuoi)})` });
      });
    }
  }
  const thanhGocSau = (k) => {
    if (goc) return goc[k].thanh;
    if (cap[k].chu === '一') return 1;
    if (cap[k].chu === '不') return 4;
    return cap[k].thanh;
  };
  cap.forEach((a, k) => {
    if (a.chu !== '一' && a.chu !== '不') return;
    const viet = pinyinHienThi.slice(a.dau, a.cuoi);
    const sau = a.ketDoan || k + 1 >= cap.length ? -1 : k + 1;
    const truoc = k > 0 && !cap[k - 1].ketDoan ? k - 1 : -1;
    const ts = sau < 0 ? 0 : thanhGocSau(sau);
    const theoSau = sau < 0 ? null : ts === 4 ? [2] : ts === 5 ? [2, 4] : [4];
    const tenChu = `${a.chu} trong “${[...cap.map((c) => c.chu)].join('')}”`;
    if (a.chu === '不') {
      const duKien = theoSau || [4];
      if (a.thanh === 5 && truoc >= 0 && sau >= 0) return; // 对不起, 看不见, 是不是
      if (!duKien.includes(a.thanh)) ket.push({ muc: 'canhBao', noiDung: `${tenChu}: ghi “${viet}”, theo quy tắc là ${duKien.map((t) => datThanh('bu', t)).join(' hoặc ')}` });
      return;
    }
    if (truoc >= 0 && CHU_SO.includes(cap[truoc].chu)) {
      if (a.thanh !== 1) ket.push({ muc: 'canhBao', noiDung: `${tenChu}: ghi “${viet}”, sau ${cap[truoc].chu} thường đọc yī` });
      return;
    }
    if (!theoSau) {
      if (a.thanh !== 1) ket.push({ muc: 'canhBao', noiDung: `${tenChu}: ghi “${viet}”, 一 đứng cuối đọc yī` });
      return;
    }
    if (a.thanh === 5 && truoc >= 0 && cap[truoc].chu === cap[sau].chu) return; // 看一看
    if (theoSau.includes(a.thanh)) return;
    if (a.thanh === 1) ket.push({ muc: 'xemTay', noiDung: `${tenChu}: ghi “${viet}” không biến điệu; đúng nếu là số đếm, thứ tự hay ngày giờ, nếu không thì là ${theoSau.map((t) => datThanh('yi', t)).join(' hoặc ')}` });
    else ket.push({ muc: 'canhBao', noiDung: `${tenChu}: ghi “${viet}”, theo quy tắc là ${theoSau.map((t) => datThanh('yi', t)).join(' hoặc ')}` });
  });
  return ket;
}
