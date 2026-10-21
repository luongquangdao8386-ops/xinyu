// Điền nội dung Claude soạn (tools/noi-dung/) vào các dòng hiện có của Google Sheet biên soạn.
// Chỉ điền ô đang trống và thêm dòng chưa có; ô đã có chữ giữ nguyên, chỗ khác nhau ghi vào báo cáo.
// Không đọc ghi tệp: phần đó ở tools/dien-noi-dung.mjs.

import { TAB } from './cau-truc.mjs';
import { dungTab } from './mau-sheet.mjs';
import { xayNoiDung } from './xay-dung.mjs';

const chuanHoa = (s) => String(s ?? '').normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
const rong = (v) => v === undefined || v === null || String(v).trim() === '';
// Giá trị ghi lên Sheet: danh sách nối bằng 、, số giữ dạng số.
const oSheet = (v) => (Array.isArray(v) ? v.join('、') : v);
// Ô số đọc từ .xlsx có dạng "12.0": đổi lại thành số để ghi ra không thành chữ.
const oSo = (cot, v) => ((cot.kieu === 'so' || cot.kieu === 'cap') && /^\d+(\.0+)?$/.test(String(v).trim()) ? parseInt(v, 10) : v);
const giong = (a, b) => chuanHoa(a) === chuanHoa(b) || (/^\d+(\.0+)?$/.test(String(a).trim()) && /^\d+(\.0+)?$/.test(String(b).trim()) && parseInt(a, 10) === parseInt(b, 10));

// bang: Map tên tab → mảng dòng (dòng đầu là tiêu đề), như docNguon trả về.
// noiDung: tên tab → các dòng { khoa JSON: giá trị } (danh sách viết dạng mảng). Dòng Tu có thể không ghi Mã
// mà gọi bằng Từ (kèm Số đồng hình nếu có).
// Trả về { dong, cotRieng, tabKhac, baoCao } với dong, cotRieng dùng cho dungTab() của mau-sheet.mjs.
export function dienNoiDung({ bang, noiDung }) {
  const baoCao = [];
  const dong = {};
  const cotRieng = {};
  for (const tab of TAB) {
    const hang = bang.get(tab.ten) || [];
    const tieuDe = (hang[0] || []).map((h) => String(h ?? '').trim());
    const viTri = new Map(tieuDe.map((h, i) => [chuanHoa(h), i]));
    const chuan = new Set(tab.cot.map((c) => chuanHoa(c.tieuDe)));
    const rieng = tieuDe.filter((h) => h && !chuan.has(chuanHoa(h)));
    const thieu = tab.cot.filter((c) => !viTri.has(chuanHoa(c.tieuDe)));
    if (hang.length && thieu.length) baoCao.push({ muc: 'ghiChu', tab: tab.ten, noiDung: `thêm cột ${thieu.map((c) => c.tieuDe).join(', ')}` });
    if (!hang.length) baoCao.push({ muc: 'ghiChu', tab: tab.ten, noiDung: 'Sheet chưa có tab này, tạo mới' });
    cotRieng[tab.ten] = rieng;

    const ds = [];
    for (const h of hang.slice(1)) {
      if (!h || h.every((o) => rong(o))) continue;
      const o = {};
      for (const c of tab.cot) if (viTri.has(chuanHoa(c.tieuDe))) o[c.khoa] = oSo(c, h[viTri.get(chuanHoa(c.tieuDe))] ?? '');
      for (const r of rieng) o[`+${r}`] = h[viTri.get(chuanHoa(r))] ?? '';
      ds.push(o);
    }
    const theoKhoa = new Map();
    if (tab.khoa) for (const o of ds) if (!rong(o[tab.khoa])) theoKhoa.set(String(o[tab.khoa]).trim(), o);
    const tenTu = (o) => `${String(o.tu ?? '').trim()}|${rong(o.dongHinh) ? '' : parseInt(o.dongHinh, 10)}`;
    const theoTu = new Map(tab.ten === 'Tu' ? ds.map((o) => [tenTu(o), o]) : []);

    const daSoan = new Set();
    let dien = 0;
    let moi = 0;
    for (const a of noiDung[tab.ten] || []) {
      let khoa = rong(a[tab.khoa]) ? undefined : String(a[tab.khoa]).trim();
      let cu = khoa !== undefined ? theoKhoa.get(khoa) : undefined;
      if (!cu && khoa === undefined && tab.ten === 'Tu') {
        cu = theoTu.get(tenTu(a));
        if (!cu) {
          baoCao.push({ muc: 'loi', tab: tab.ten, noiDung: `không tìm thấy từ ${a.tu}${a.dongHinh || ''} ở tab Tu và nội dung không ghi Mã` });
          continue;
        }
        khoa = String(cu.ma).trim();
      }
      if (khoa === undefined) {
        baoCao.push({ muc: 'loi', tab: tab.ten, noiDung: `một dòng nội dung thiếu ${tab.cot.find((c) => c.khoa === tab.khoa).tieuDe}` });
        continue;
      }
      if (daSoan.has(khoa)) {
        baoCao.push({ muc: 'loi', tab: tab.ten, khoa, noiDung: 'nội dung soạn trùng khóa này hai lần' });
        continue;
      }
      daSoan.add(khoa);
      if (!cu) {
        const o = { trangThai: 'nháp' };
        for (const c of tab.cot) if (!rong(oSheet(a[c.khoa]))) o[c.khoa] = oSheet(a[c.khoa]);
        o[tab.khoa] = khoa;
        ds.push(o);
        theoKhoa.set(khoa, o);
        moi++;
        continue;
      }
      for (const c of tab.cot) {
        if (c.khoa === 'trangThai' || c.khoa === tab.khoa) continue;
        const v = oSheet(a[c.khoa]);
        if (rong(v)) continue;
        if (rong(cu[c.khoa])) {
          cu[c.khoa] = v;
          dien++;
        } else if (!giong(cu[c.khoa], v)) baoCao.push({ muc: 'khac', tab: tab.ten, khoa, noiDung: `cột ${c.tieuDe}: Sheet ghi “${cu[c.khoa]}”, nội dung soạn ghi “${v}” (giữ bản trên Sheet)` });
      }
    }
    if (dien || moi) baoCao.push({ muc: 'ghiChu', tab: tab.ten, noiDung: `điền ${dien} ô, thêm ${moi} dòng` });
    dong[tab.ten] = ds;
  }
  for (const ten of Object.keys(noiDung)) if (!TAB.some((t) => t.ten === ten)) baoCao.push({ muc: 'loi', noiDung: `nội dung soạn có tab lạ ${ten}` });
  const tabKhac = [...bang.keys()].filter((ten) => ten !== 'HuongDan' && !TAB.some((t) => t.ten === ten));
  for (const ten of tabKhac) baoCao.push({ muc: 'ghiChu', tab: ten, noiDung: 'tab riêng, giữ nguyên' });
  return { dong, cotRieng, tabKhac, baoCao };
}

// Chạy thử kiểm tra 11.6 trên các dòng vừa soạn: đặt chúng thành “đã kiểm tra” (chỉ trong bản chạy thử),
// chạy xayNoiDung và trả về các mục báo cáo (trừ ghi chú) của những dòng đó.
export function chayThu({ dong, cotRieng = {}, noiDung, deCuong = [], cedict = null }) {
  const khoaSoan = new Map(TAB.map((t) => [t.ten, new Set()]));
  for (const t of TAB) {
    for (const a of noiDung[t.ten] || []) {
      let k = a[t.khoa];
      if (k === undefined && t.ten === 'Tu') k = (dong.Tu || []).find((o) => o.tu === a.tu && String(o.dongHinh ?? '') === String(a.dongHinh ?? ''))?.ma;
      if (k !== undefined) khoaSoan.get(t.ten).add(String(k));
    }
  }
  const bang = new Map(
    dungTab(dong, cotRieng)
      .slice(1)
      .map((x) => {
        const t = TAB.find((y) => y.ten === x.ten);
        const iKhoa = t.khoa ? t.cot.findIndex((c) => c.khoa === t.khoa) : -1;
        const iTrangThai = t.cot.findIndex((c) => c.khoa === 'trangThai');
        const soan = (h, r) => r && iKhoa >= 0 && iTrangThai >= 0 && khoaSoan.get(t.ten).has(String(h[iKhoa]));
        return [x.ten, x.dong.map((h, r) => h.map((o, i) => (soan(h, r) && i === iTrangThai ? 'đã kiểm tra' : String(o ?? ''))))];
      }),
  );
  const kq = xayNoiDung({ bang, deCuong, cedict });
  return {
    soDong: [...khoaSoan.values()].reduce((n, s) => n + s.size, 0),
    baoCao: kq.baoCao.filter((m) => m.tab && khoaSoan.get(m.tab)?.has(String(m.khoa)) && m.muc !== 'ghiChu'),
    duLieu: kq.duLieu,
  };
}
