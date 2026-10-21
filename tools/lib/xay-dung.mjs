// Lõi công cụ xây nội dung (mục 12.8): đọc các tab theo cau-truc.mjs, chạy kiểm tra 11.6 bước 1–4,
// tính dòng nào được xuất và dựng dữ liệu JSON. Không đọc ghi tệp: phần đó ở tools/xay-noi-dung.mjs.

import { TAB } from './cau-truc.mjs';
import { canChinh, kiemTraYiBu, laChuHan, sinhPinyinGoc, soHoa, tachAmTiet } from './pinyin.mjs';

export const TEN_BUOC = {
  0: 'Cấu trúc và tham chiếu',
  1: 'Bước 1 — Đối chiếu đề cương',
  2: 'Bước 2 — Pinyin và CC-CEDICT',
  3: 'Bước 3 — Từ trong câu và truyện',
  4: 'Bước 4 — Cách ghi 一 và 不',
};

const chuanHoa = (s) => String(s ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
const boDau = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const SAI = new Set(['', 'false', '0', 'không', 'khong', 'no']);

// "没（有）" → ["没有", "没"]: dạng đầy đủ và dạng bỏ phần trong ngoặc.
export function dangViet(tu) {
  const day = tu.replace(/[（(]([^）)]*)[）)]/g, '$1');
  const gon = tu.replace(/[（(][^）)]*[）)]/g, '');
  return [...new Set([day, gon].filter(Boolean))];
}

// Tách câu thành từ đã biết (tap) bằng quy hoạch động: ít chữ lạ nhất, rồi ít từ nhất.
// Trả về { tu: [từ đã biết theo thứ tự], la: [đoạn chữ chưa biết] }.
export function phanTu(cau, tap) {
  const dai = Math.max(1, ...[...tap].map((w) => [...w].length));
  const ket = { tu: [], la: [] };
  for (const doan of cau.match(/\p{Script=Han}+/gu) || []) {
    const chu = [...doan];
    const n = chu.length;
    const tot = Array(n + 1).fill(null);
    tot[0] = { la: 0, so: 0 };
    for (let i = 0; i < n; i++) {
      if (!tot[i]) continue;
      for (let d = 1; d <= Math.min(dai, n - i); d++) {
        const w = chu.slice(i, i + d).join('');
        const biet = tap.has(w);
        if (!biet && d > 1) continue;
        const moi = { la: tot[i].la + (biet ? 0 : 1), so: tot[i].so + 1, truoc: i, w, biet };
        const cu = tot[i + d];
        if (!cu || moi.la < cu.la || (moi.la === cu.la && moi.so < cu.so)) tot[i + d] = moi;
      }
    }
    const phan = [];
    for (let k = n; k > 0; k = tot[k].truoc) phan.unshift(tot[k]);
    let la = '';
    for (const p of phan) {
      if (p.biet) {
        if (la) ket.la.push(la);
        la = '';
        ket.tu.push(p.w);
      } else la += p.w;
    }
    if (la) ket.la.push(la);
  }
  return ket;
}

function chuyenKieu(cot, tho) {
  const s = String(tho ?? '').normalize('NFC').trim();
  if (cot.kieu === 'co') return { gt: !SAI.has(s.toLowerCase()) };
  if (s === '') return { gt: undefined };
  switch (cot.kieu) {
    case 'so':
      return /^-?\d+(\.0+)?$/.test(s) ? { gt: parseInt(s, 10) } : { loi: `cột “${cot.tieuDe}” cần số, đang ghi “${s}”` };
    case 'cap':
      if (/^\d(\.0+)?$/.test(s)) return { gt: parseInt(s, 10) };
      if (/^7\s*[-–]\s*9$/.test(s)) return { gt: '7-9' };
      return { loi: `cột “${cot.tieuDe}” cần cấp HSK (1–6 hoặc 7-9), đang ghi “${s}”` };
    case 'ds':
      return { gt: s.split(/[,，、;；\n]+/).map((x) => x.trim()).filter(Boolean) };
    case 'ngay': {
      if (/^\d+(\.\d+)?$/.test(s)) return { gt: new Date(Date.UTC(1899, 11, 30) + Math.floor(+s) * 864e5).toISOString().slice(0, 10) };
      const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return { gt: `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` };
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { gt: s };
      return { gt: s, canhBao: `cột “${cot.tieuDe}” không đọc được ngày “${s}” (ghi dạng 21/10/2026)` };
    }
    default:
      if (cot.chon) {
        const khop = cot.chon.find((c) => boDau(chuanHoa(c)) === boDau(chuanHoa(s)));
        return khop ? { gt: khop } : { loi: `cột “${cot.tieuDe}” chỉ nhận ${cot.chon.join(', ')}; đang ghi “${s}”` };
      }
      return { gt: s };
  }
}

const capSo = (c) => (typeof c === 'number' ? c : c === '7-9' ? 7 : undefined);

// bang: Map tên tab → mảng dòng (dòng đầu là tiêu đề). deCuong: nội dung các tệp content/de-cuong/hsk*.json.
// cedict: Map 简体 → [pinyin dạng số], hoặc null để bỏ qua bước 2 phần CC-CEDICT.
export function xayNoiDung({ bang, deCuong = [], cedict = null }) {
  const baoCao = [];
  const banGhi = {};
  const theoKhoa = {};

  const ghi = (muc, buoc, ban, noiDung, pinyin = false) => {
    if (ban?.gt?.daXemTay && pinyin && muc !== 'loi') return;
    if (ban && muc === 'loi') ban.coLoi = true;
    baoCao.push({ muc, buoc, tab: ban?.tab, dong: ban?.dong, khoa: ban?.khoa, nhap: ban ? !ban.daKiemTra : false, noiDung });
  };

  // ---------- Đọc các tab ----------
  for (const tab of TAB) {
    banGhi[tab.ten] = [];
    theoKhoa[tab.ten] = new Map();
    const dong = bang.get(tab.ten);
    if (!dong || !dong.length) {
      baoCao.push({ muc: 'ghiChu', buoc: 0, tab: tab.ten, noiDung: 'không có tab này hoặc tab trống' });
      continue;
    }
    const tieuDe = dong[0].map(chuanHoa);
    const viTri = {};
    const thieu = [];
    for (const cot of tab.cot) {
      const i = tieuDe.indexOf(chuanHoa(cot.tieuDe));
      if (i < 0) thieu.push(cot.tieuDe);
      else viTri[cot.khoa] = i;
    }
    if (thieu.length) baoCao.push({ muc: 'loi', buoc: 0, tab: tab.ten, noiDung: `thiếu cột: ${thieu.join(', ')}` });
    for (let r = 1; r < dong.length; r++) {
      const hang = dong[r] || [];
      if (hang.every((o) => String(o ?? '').trim() === '')) continue;
      const ban = { tab: tab.ten, dong: r + 1, gt: {}, coLoi: false };
      const tt = chuanHoa(hang[viTri.trangThai]);
      ban.daKiemTra = boDau(tt) === 'da kiem tra';
      ban.khoa = tab.khoa ? String(hang[viTri[tab.khoa]] ?? '').trim() : undefined;
      if (tt && !ban.daKiemTra && boDau(tt) !== 'nhap') ghi('canhBao', 0, ban, `trạng thái “${hang[viTri.trangThai]}” không rõ, coi là nháp`);
      for (const cot of tab.cot) {
        if (cot.khoa === 'trangThai' || viTri[cot.khoa] === undefined) continue;
        const k = chuyenKieu(cot, hang[viTri[cot.khoa]]);
        if (k.loi) ghi('loi', 0, ban, k.loi);
        if (k.canhBao) ghi('canhBao', 0, ban, k.canhBao);
        if (k.gt !== undefined) ban.gt[cot.khoa] = k.gt;
      }
      if (ban.daKiemTra) {
        const thieuGt = tab.cot.filter((c) => c.batBuoc && (ban.gt[c.khoa] === undefined || (Array.isArray(ban.gt[c.khoa]) && !ban.gt[c.khoa].length)));
        if (thieuGt.length) ghi('loi', 0, ban, `thiếu ${thieuGt.map((c) => c.tieuDe).join(', ')}`);
      }
      if (tab.khoa) {
        if (!ban.khoa) ghi('loi', 0, ban, `thiếu ${tab.cot.find((c) => c.khoa === tab.khoa).tieuDe}`);
        else if (theoKhoa[tab.ten].has(ban.khoa)) {
          ghi('loi', 0, ban, `trùng ${tab.khoa === 'ma' ? 'mã' : 'chữ'} với dòng ${theoKhoa[tab.ten].get(ban.khoa).dong}`);
          continue;
        } else theoKhoa[tab.ten].set(ban.khoa, ban);
      }
      banGhi[tab.ten].push(ban);
    }
  }
  const { Bai, Tu, Chu, NguPhap, Cau, CauHoi, PhatAm, CapThanh, CapDeNham, Truyen, CanSua } = banGhi;

  // ---------- Danh sách đề cương ----------
  const dcTu = new Map();
  const dcTuTheoChu = new Map();
  const dcChu = new Map();
  const dcVietTay = new Map();
  const dcNguPhap = new Map();
  for (const d of deCuong) {
    for (const t of d.tu) {
      dcTu.set(t.stt, t);
      for (const w of dangViet(t.tu)) (dcTuTheoChu.get(w) || dcTuTheoChu.set(w, []).get(w)).push(t);
    }
    for (const c of d.chuNhanBiet) dcChu.set(c.chu, d.cap);
    for (const c of d.chuVietTay) dcVietTay.set(c.chu, d.capChuVietTay || [d.cap, d.cap]);
    for (const n of d.nguPhap) dcNguPhap.set(n.ma, { ...n, cap: d.cap });
  }

  // ---------- Tra cứu giữa các tab ----------
  const tuTheoChu = new Map();
  for (const t of Tu) for (const w of new Set([t.gt.tu, ...dangViet(t.gt.tu || '')])) if (w) (tuTheoChu.get(w) || tuTheoChu.set(w, []).get(w)).push(t);
  const timTu = (ref) => {
    const m = ref.match(/^(.*\D)(\d)$/);
    if (m) return (tuTheoChu.get(m[1]) || []).filter((t) => t.gt.dongHinh === +m[2]);
    return tuTheoChu.get(ref) || [];
  };
  // Trả về bản ghi từ, hoặc ghi lỗi khi không có hoặc mơ hồ.
  const traTu = (ban, ref, noi) => {
    const ds = timTu(ref);
    if (ds.length === 1) return ds[0];
    if (!ds.length) ghi('loi', 0, ban, `${noi}: từ “${ref}” không có ở tab Tu`);
    else ghi('loi', 0, ban, `${noi}: “${ref}” ứng với nhiều dòng ở tab Tu (${ds.map((t) => t.khoa).join(', ')}); thêm số đồng hình, ví dụ ${ref}1`);
    return null;
  };
  const traMa = (ban, tab, ma, noi) => {
    const t = theoKhoa[tab].get(ma);
    if (!t) ghi('loi', 0, ban, `${noi}: “${ma}” không có ở tab ${tab}`);
    return t || null;
  };
  const cauCua = new Map();
  for (const c of Cau) if (c.gt.bai) (cauCua.get(c.gt.bai) || cauCua.set(c.gt.bai, []).get(c.gt.bai)).push(c);
  const phatAmCua = new Map();
  for (const p of PhatAm) if (p.gt.bai) (phatAmCua.get(p.gt.bai) || phatAmCua.set(p.gt.bai, []).get(p.gt.bai)).push(p);

  // ---------- Bài học: tham chiếu, cấp, từ đã học ----------
  const capBai = (b) => (b.gt.chang === 'Nền phát âm' ? 1 : b.gt.chang === 'HSK 7–9' ? 9 : +String(b.gt.chang || '').replace('HSK ', '') || undefined);
  const phuThuoc = new Map(); // bản ghi → các bản ghi cần được xuất cùng
  const them = (ban, ...ds) => phuThuoc.set(ban, [...(phuThuoc.get(ban) || []), ...ds.filter(Boolean)]);
  const thuTu = new Map();
  for (const b of Bai) {
    if (b.gt.thuTu !== undefined) {
      if (thuTu.has(b.gt.thuTu)) ghi('canhBao', 0, b, `cùng thứ tự ${b.gt.thuTu} với bài ${thuTu.get(b.gt.thuTu).khoa}`);
      else thuTu.set(b.gt.thuTu, b);
    }
    const cap = capBai(b);
    b.tuDaTra = [];
    for (const ref of b.gt.tu || []) {
      const t = traTu(b, ref, 'cột Từ');
      if (!t) continue;
      b.tuDaTra.push(t);
      them(b, t);
      const ct = capSo(t.gt.cap);
      if (cap && ct && ct > cap) ghi('loi', 1, b, `từ ${ref} thuộc cấp ${t.gt.cap}, bài ở chặng ${b.gt.chang}`);
    }
    for (const c of b.gt.chu || []) {
      const ch = traMa(b, 'Chu', c, 'cột Chữ');
      them(b, ch);
      const cn = ch?.gt.capNhanBiet ?? dcChu.get(c);
      if (cap && cn && capSo(cn) > cap) ghi('canhBao', 1, b, `chữ ${c} là chữ nhận biết cấp ${cn}, bài ở chặng ${b.gt.chang}`);
    }
    for (const m of b.gt.nguPhap || []) {
      const n = traMa(b, 'NguPhap', m, 'cột Ngữ pháp');
      them(b, n);
      if (cap && n && capSo(n.gt.cap) > cap) ghi('loi', 1, b, `ngữ pháp ${m} thuộc cấp ${n.gt.cap}, bài ở chặng ${b.gt.chang}`);
    }
    them(b, ...(cauCua.get(b.khoa) || []), ...(phatAmCua.get(b.khoa) || []));
  }
  const baiTheoThuTu = Bai.filter((b) => b.gt.thuTu !== undefined).sort((a, b) => a.gt.thuTu - b.gt.thuTu);
  const daHoc = new Map(); // mã bài → Set dạng viết của từ và tên riêng đã học tính đến bài đó
  const tichLuy = new Set();
  for (const b of baiTheoThuTu) {
    for (const ref of b.gt.tu || []) {
      const ds = timTu(ref);
      for (const w of ds.length === 1 ? dangViet(ds[0].gt.tu) : [ref.replace(/\d$/, '')]) tichLuy.add(w);
    }
    for (const ten of b.gt.tenRieng || []) tichLuy.add(ten);
    daHoc.set(b.khoa, new Set(tichLuy));
  }

  // ---------- Từ ----------
  for (const t of Tu) {
    const { tu, pinyin } = t.gt;
    if (!tu || !pinyin) continue;
    const day = dangViet(tu)[0];
    if ([...day].some((c) => !laChuHan(c))) ghi('loi', 0, t, `cột Từ chỉ được có chữ Hán: “${tu}”`);
    // Bước 1
    if (t.gt.maDeCuong !== undefined) {
      const dc = dcTu.get(t.gt.maDeCuong);
      if (!dc) ghi('loi', 1, t, `mã đề cương ${t.gt.maDeCuong} không có trong content/de-cuong`);
      else {
        if (dc.tu !== tu) ghi('loi', 1, t, `mã đề cương ${dc.stt} là từ ${dc.tu}, dòng này ghi ${tu}`);
        if ((dc.dongHinh ?? undefined) !== t.gt.dongHinh) ghi('loi', 1, t, `số đồng hình phải là ${dc.dongHinh ?? 'trống'} theo đề cương`);
        if (dc.cap !== t.gt.cap) ghi('loi', 1, t, `sai cấp: đề cương xếp ${dc.tu} vào cấp ${dc.cap}`);
        if (dc.pinyin.normalize('NFC') !== pinyin.normalize('NFC')) ghi('canhBao', 1, t, `Pinyin khác đề cương (đề cương ghi ${dc.pinyin})`, true);
      }
    } else {
      const dc = dcTuTheoChu.get(tu);
      if (dc) ghi('canhBao', 1, t, `từ có trong đề cương (mã ${dc.map((d) => d.stt).join(', ')}), nên điền Mã đề cương`);
      else ghi('ghiChu', 1, t, `từ ${tu} ngoài đề cương`);
    }
    // Bước 2 và 4
    const hienThi = pinyin.split('/').map((p) => p.trim());
    const gocGhi = t.gt.pinyinGoc ? t.gt.pinyinGoc.split('/').map((p) => p.trim()) : null;
    if (gocGhi && gocGhi.length !== hienThi.length) ghi('canhBao', 2, t, 'Pinyin và Pinyin gốc có số cách đọc khác nhau', true);
    const goc = [];
    hienThi.forEach((p, i) => {
      const cc = canChinh(day, p);
      if (!cc.cap) {
        ghi('canhBao', 2, t, `Pinyin “${p}”: ${cc.loi.join('; ')}`, true);
        goc.push(gocGhi?.[i] || p);
        return;
      }
      if (gocGhi?.[i]) goc.push(gocGhi[i]);
      else goc.push(sinhPinyinGoc(day, p).pinyinGoc);
      if (/[一不]/.test(day)) for (const f of kiemTraYiBu(day, p, gocGhi?.[i])) ghi(f.muc, 4, t, f.noiDung, true);
    });
    t.pinyinGoc = goc.join('/');
    if (cedict) {
      const doc = cedict.has(day) ? [...new Set(cedict.get(day))] : null;
      if (!doc) ghi('ghiChu', 2, t, `${day} không có trong CC-CEDICT`, true);
      else {
        const cua = goc.map((g) => soHoa(tachAmTiet(g).ds).toLowerCase());
        const gan = (a, b) => {
          const x = a.split(' ');
          const y = b.split(' ');
          return x.length === y.length && x.every((s, i) => s === y[i] || (s.slice(0, -1) === y[i].slice(0, -1) && (s.endsWith('5') || y[i].endsWith('5'))));
        };
        if (!cua.some((c) => doc.includes(c))) {
          if (cua.some((c) => doc.some((d) => gan(c, d)))) ghi('ghiChu', 2, t, `${day} khác CC-CEDICT ở thanh nhẹ: ${cua.join(' / ')} | CC-CEDICT: ${doc.join(' ; ')}`, true);
          else ghi('canhBao', 2, t, `${day} lệch CC-CEDICT: ${cua.join(' / ')} | CC-CEDICT: ${doc.join(' ; ')}`, true);
        }
      }
    }
    for (const m of t.gt.cauViDu || []) them(t, traMa(t, 'Cau', m, 'cột Câu ví dụ'));
  }

  // ---------- Chữ ----------
  for (const c of Chu) {
    const ch = c.khoa;
    if (!ch) continue;
    if ([...ch].length !== 1 || !laChuHan(ch)) {
      ghi('loi', 0, c, `cột Chữ phải là đúng một chữ Hán: “${ch}”`);
      continue;
    }
    const nb = dcChu.get(ch);
    if (nb === undefined) ghi('ghiChu', 1, c, `chữ ${ch} ngoài danh sách chữ nhận biết của đề cương`);
    else if (c.gt.capNhanBiet !== undefined && c.gt.capNhanBiet !== nb) ghi('loi', 1, c, `cấp nhận biết theo đề cương là ${nb}`);
    const vt = dcVietTay.get(ch);
    const cv = capSo(c.gt.capVietTay);
    if (cv !== undefined) {
      if (!vt) ghi('canhBao', 1, c, `chữ ${ch} không có trong danh sách chữ viết tay của đề cương`);
      else if (cv < vt[0] || cv > vt[1]) ghi('loi', 1, c, `đề cương xếp chữ ${ch} vào chữ viết tay cấp ${vt.join('–')}`);
    }
  }

  // ---------- Ngữ pháp ----------
  for (const n of NguPhap) {
    if (!n.khoa) continue;
    const dc = dcNguPhap.get(n.khoa);
    if (!dc) {
      if (/^NP\d/.test(n.khoa)) ghi('loi', 1, n, `mã ${n.khoa} không có trong đề cương`);
      else ghi('ghiChu', 1, n, `điểm ngữ pháp ${n.khoa} ngoài đề cương`);
    } else if (n.gt.cap !== undefined && n.gt.cap !== dc.cap) ghi('loi', 1, n, `sai cấp: đề cương xếp ${n.khoa} vào cấp ${dc.cap}`);
    for (const m of n.gt.viDu || []) them(n, traMa(n, 'Cau', m, 'cột Ví dụ'));
  }

  // ---------- Truyện ----------
  for (const tr of Truyen) {
    const b = tr.gt.sauBai ? traMa(tr, 'Bai', tr.gt.sauBai, 'cột Sau bài') : null;
    tr.bai = b;
    if ((tr.gt.tuMoi || []).length > 3) ghi('loi', 3, tr, `có ${tr.gt.tuMoi.length} từ mới, tối đa 3`);
    const cau = cauCua.get(tr.khoa) || [];
    if (!cau.length && tr.daKiemTra) ghi('canhBao', 3, tr, 'chưa có câu nào ở tab Cau');
    them(tr, ...cau);
    for (const m of tr.gt.cauHoi || []) them(tr, traMa(tr, 'CauHoi', m, 'cột Câu hỏi'));
  }

  // ---------- Câu ----------
  const truyenDung = new Map(); // truyện → Set từ mới thật sự xuất hiện
  for (const c of Cau) {
    const { bai, chuHan, pinyin } = c.gt;
    if (!bai) continue;
    const b = theoKhoa.Bai.get(bai);
    const tr = theoKhoa.Truyen.get(bai);
    if (!b && !tr) {
      ghi('loi', 0, c, `cột Bài: “${bai}” không có ở tab Bai hay Truyen`);
      continue;
    }
    if (!chuHan) continue;
    // Bước 3
    const baiGoc = b || tr.bai;
    const tap = baiGoc ? daHoc.get(baiGoc.khoa) : null;
    if (!tap) ghi('canhBao', 3, c, `không kiểm tra được từ: bài ${baiGoc?.khoa || bai} chưa có thứ tự`);
    else {
      const tuMoi = tr ? tr.gt.tuMoi || [] : [];
      const ket = phanTu(chuHan, new Set([...tap, ...tuMoi]));
      if (ket.la.length) ghi('loi', 3, c, `có chữ chưa học tính đến bài ${baiGoc.khoa}: ${[...new Set(ket.la)].join(', ')}`);
      if (tr) for (const w of ket.tu) if (tuMoi.includes(w)) (truyenDung.get(tr) || truyenDung.set(tr, new Set()).get(tr)).add(w);
      c.tuTrongCau = [...new Set(ket.tu)].map((w) => timTu(w)).filter((ds) => ds.length).map((ds) => ds[0]);
    }
    // Bước 2 và 4
    if (pinyin) {
      const cc = canChinh(chuHan, pinyin);
      if (!cc.cap) ghi('canhBao', 2, c, `Pinyin: ${cc.loi.join('; ')}`, true);
      else if (/[一不]/.test(chuHan)) for (const f of kiemTraYiBu(chuHan, pinyin)) ghi(f.muc, 4, c, f.noiDung, true);
    }
  }
  for (const tr of Truyen) {
    const dung = truyenDung.get(tr) || new Set();
    const thua = (tr.gt.tuMoi || []).filter((w) => !dung.has(w));
    if (thua.length && tr.daKiemTra) ghi('canhBao', 3, tr, `từ mới không xuất hiện trong câu nào: ${thua.join(', ')}`);
  }

  // ---------- Phát âm ----------
  const amTietPhatAm = new Map(); // âm tiết (chữ thường, NFC) → mục phát âm đầu tiên có âm tiết đó
  const chuanAm = (a) => a.normalize('NFC').toLowerCase();
  for (const p of PhatAm) {
    if (p.gt.bai) {
      const b = traMa(p, 'Bai', p.gt.bai, 'cột Bài');
      if (b && b.gt.chang !== 'Nền phát âm') ghi('canhBao', 0, p, `bài ${p.gt.bai} không thuộc chặng Nền phát âm`);
    }
    const amTiet = p.gt.amTiet || [];
    for (const a of amTiet) {
      const t = tachAmTiet(a);
      if (t.loi.length || t.ds.length !== 1 || t.ds[0].dau !== 0 || t.ds[0].cuoi !== a.normalize('NFC').length) ghi('loi', 2, p, `“${a}” không phải một âm tiết Pinyin`);
      else if (!amTietPhatAm.has(chuanAm(a))) amTietPhatAm.set(chuanAm(a), p);
    }
    const chuDoc = p.gt.chuDoc || [];
    if (chuDoc.length) {
      if (chuDoc.length !== amTiet.length) ghi('loi', 0, p, `Chữ đọc mẫu có ${chuDoc.length} chữ, Âm tiết ví dụ có ${amTiet.length} âm tiết`);
      chuDoc.forEach((c, i) => {
        if ([...c].length !== 1 || !laChuHan(c)) return ghi('loi', 0, p, `chữ đọc mẫu “${c}” phải là đúng một chữ Hán`);
        const a = amTiet[i];
        if (!cedict || !a || !cedict.has(c)) return;
        const so = soHoa(tachAmTiet(a).ds).toLowerCase();
        if (!cedict.get(c).includes(so)) ghi('canhBao', 2, p, `chữ ${c} không đọc ${a} theo CC-CEDICT (${[...new Set(cedict.get(c))].join(' ; ')})`);
      });
    }
    p.tuDaTra = [];
    for (const ref of p.gt.viDu || []) {
      const t = traTu(p, ref, 'cột Từ ví dụ');
      if (!t) continue;
      p.tuDaTra.push(t);
      them(p, t);
    }
  }

  // ---------- Câu hỏi, cặp thanh, cặp dễ nhầm ----------
  for (const q of CauHoi) {
    if (q.gt.bai && !theoKhoa.Bai.has(q.gt.bai) && !theoKhoa.Truyen.has(q.gt.bai)) ghi('loi', 0, q, `cột Bài: “${q.gt.bai}” không có ở tab Bai hay Truyen`);
    for (const d of q.gt.diemKienThuc || []) {
      const coMa = ['Chu', 'NguPhap', 'PhatAm', 'CapThanh'].some((tab) => theoKhoa[tab].has(d));
      if (!timTu(d).length && !coMa) ghi('loi', 0, q, `điểm kiến thức “${d}” không có ở tab Tu, Chu, NguPhap, PhatAm hay CapThanh`);
    }
    const am = q.gt.amThanh;
    if (am) {
      const tu = timTu(am);
      if (theoKhoa.Cau.has(am)) q.amThanh = { cau: theoKhoa.Cau.get(am) };
      else if (tu.length === 1) q.amThanh = { tu: tu[0] };
      else if (tu.length > 1) ghi('loi', 0, q, `cột Âm thanh: “${am}” ứng với nhiều dòng ở tab Tu (${tu.map((t) => t.khoa).join(', ')}); thêm số đồng hình`);
      else if (amTietPhatAm.has(chuanAm(am))) q.amThanh = { amTiet: am.normalize('NFC'), phatAm: amTietPhatAm.get(chuanAm(am)) };
      else ghi('loi', 0, q, `cột Âm thanh: “${am}” không phải từ ở tab Tu, mã câu ở tab Cau hay âm tiết ví dụ ở tab PhatAm`);
      const dua = q.amThanh && (q.amThanh.cau || q.amThanh.tu || q.amThanh.phatAm);
      if (dua) them(q, dua);
    }
    if (q.gt.kyNang === 'nghe' && !am && q.daKiemTra) ghi('canhBao', 0, q, 'câu hỏi nghe chưa ghi cột Âm thanh');
    for (const i of [1, 2, 3]) if (q.gt[`nhamVoi${i}`] && !q.gt[`dapAnSai${i}`]) ghi('canhBao', 0, q, `có “Nhầm với ${i}” nhưng thiếu “Đáp án sai ${i}”`);
  }
  for (const p of CapThanh) {
    if (p.gt.toHop && !/^[1-4]-[0-4]$/.test(p.gt.toHop)) ghi('loi', 0, p, `tổ hợp “${p.gt.toHop}” phải có dạng 3-3 hoặc 1-0`);
    p.tuDaTra = [];
    for (const ref of p.gt.viDu || []) {
      const t = traTu(p, ref, 'cột Từ ví dụ');
      if (!t) continue;
      p.tuDaTra.push(t);
      them(p, t);
      const thanh = tachAmTiet(t.pinyinGoc || '').ds.map((a) => (a.thanh === 5 ? 0 : a.thanh)).join('-');
      if (p.gt.toHop && thanh !== p.gt.toHop) ghi('canhBao', 2, p, `từ ${ref} (${t.pinyinGoc}) có thanh ${thanh}, không phải ${p.gt.toHop}`);
    }
  }
  for (const p of CapDeNham) {
    if ((p.gt.cacMuc || []).length === 1) ghi('loi', 0, p, 'cần ít nhất hai mục');
    for (const m of p.gt.cacMuc || []) {
      const t = timTu(m);
      if (t.length) them(p, t[0]);
      else if (theoKhoa.Chu.has(m)) them(p, theoKhoa.Chu.get(m));
      else ghi('loi', 0, p, `“${m}” không có ở tab Tu hay Chu`);
    }
    for (const m of p.gt.cauHoi || []) them(p, traMa(p, 'CauHoi', m, 'cột Câu hỏi'));
  }
  const chuaSua = CanSua.filter((r) => !r.gt.daXuLy).length;
  if (chuaSua) baoCao.push({ muc: 'ghiChu', buoc: 0, tab: 'CanSua', noiDung: `${chuaSua} mục cần sửa chưa xử lý` });

  // ---------- Dòng được xuất ----------
  const xuat = new Set(Object.values(banGhi).flat().filter((b) => b.daKiemTra && !b.coLoi));
  for (let doi = true; doi; ) {
    doi = false;
    for (const b of [...xuat]) {
      const thieu = (phuThuoc.get(b) || []).filter((d) => !xuat.has(d));
      if (!thieu.length) continue;
      xuat.delete(b);
      doi = true;
      ghi('loi', 0, b, `chưa xuất được vì cần ${thieu.map((d) => `${d.tab} ${d.khoa}`).join(', ')} (nháp hoặc có lỗi)`);
    }
  }

  // ---------- Dựng JSON ----------
  const duLieu = {};
  for (const tab of TAB.filter((t) => t.tep)) {
    duLieu[tab.ten] = banGhi[tab.ten]
      .filter((b) => xuat.has(b))
      .map((b) => {
        const o = {};
        for (const cot of tab.cot) {
          const v = b.gt[cot.khoa];
          if (cot.xuat === false || v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
          o[cot.khoa] = v;
        }
        return o;
      });
  }
  const ma = (ds) => ds.filter((d) => xuat.has(d)).map((d) => d.khoa);
  const theoMa = (tab) => new Map(banGhi[tab].filter((b) => xuat.has(b)).map((b, i) => [b, duLieu[tab][i]]));
  const oBai = theoMa('Bai');
  for (const [b, o] of oBai) {
    const cap = b.gt.chang === 'Nền phát âm' ? undefined : b.gt.chang === 'HSK 7–9' ? '7-9' : capBai(b);
    Object.assign(o, cap ? { cap } : {}, { tu: ma(b.tuDaTra) }, { cau: ma(cauCua.get(b.khoa) || []) });
    if (phatAmCua.has(b.khoa)) o.phatAm = ma(phatAmCua.get(b.khoa));
  }
  for (const [p, o] of theoMa('PhatAm')) if (o.viDu) o.viDu = ma(p.tuDaTra);
  for (const [t, o] of theoMa('Tu')) o.pinyinGoc = t.pinyinGoc;
  for (const [c, o] of theoMa('Cau')) if (c.tuTrongCau?.length) o.tu = c.tuTrongCau.map((t) => t.khoa);
  for (const [q, o] of theoMa('CauHoi')) {
    if (q.amThanh?.tu) o.amThanh = { tu: q.amThanh.tu.khoa };
    else if (q.amThanh?.cau) o.amThanh = { cau: q.amThanh.cau.khoa };
    else if (q.amThanh?.phatAm) o.amThanh = { amTiet: q.amThanh.amTiet, phatAm: q.amThanh.phatAm.khoa };
    const sai = [1, 2, 3].filter((i) => o[`dapAnSai${i}`]).map((i) => (o[`nhamVoi${i}`] ? { dapAn: o[`dapAnSai${i}`], nhamVoi: o[`nhamVoi${i}`] } : { dapAn: o[`dapAnSai${i}`] }));
    for (const i of [1, 2, 3]) delete o[`dapAnSai${i}`], delete o[`nhamVoi${i}`];
    if (sai.length) o.dapAnSai = sai;
  }
  for (const [p, o] of theoMa('CapThanh')) o.viDu = ma(p.tuDaTra);
  for (const [tr, o] of theoMa('Truyen')) {
    const cap = tr.bai ? capBai(tr.bai) : undefined;
    if (cap && tr.bai.gt.chang !== 'Nền phát âm') o.cap = tr.bai.gt.chang === 'HSK 7–9' ? '7-9' : cap;
    o.cau = ma(cauCua.get(tr.khoa) || []);
  }

  // ---------- Thống kê và độ phủ đề cương ----------
  const thongKe = TAB.filter((t) => t.tep).map((t) => ({
    tab: t.ten,
    tep: t.tep,
    tong: banGhi[t.ten].length,
    daKiemTra: banGhi[t.ten].filter((b) => b.daKiemTra).length,
    xuat: duLieu[t.ten].length,
  }));
  for (const d of deCuong) {
    const tuXuat = new Set(duLieu.Tu.filter((t) => t.maDeCuong !== undefined).map((t) => t.maDeCuong));
    const chuXuat = new Set(duLieu.Chu.map((c) => c.chu));
    const npXuat = new Set(duLieu.NguPhap.map((n) => n.ma));
    baoCao.push({
      muc: 'ghiChu',
      buoc: 1,
      noiDung: `HSK ${d.cap} đã xuất: ${d.tu.filter((t) => tuXuat.has(t.stt)).length}/${d.tu.length} từ, ${d.chuNhanBiet.filter((c) => chuXuat.has(c.chu)).length}/${d.chuNhanBiet.length} chữ nhận biết, ${d.nguPhap.filter((n) => npXuat.has(n.ma)).length}/${d.nguPhap.length} điểm ngữ pháp`,
    });
  }
  if (!cedict) baoCao.push({ muc: 'ghiChu', buoc: 2, noiDung: 'không có CC-CEDICT, bỏ qua phần đối chiếu từ điển' });

  for (const m of baoCao) m.nhap ??= false;
  return { duLieu, baoCao, thongKe };
}
