// Kiểm tra hình học đường ống: đầu ống trùng đầu nối thiết bị và đúng hướng, các tuyến nối liền thành mạch kín,
// ống không xuyên qua thân thiết bị và không xuyên qua nhau. Dùng trong kiem-thu/kiem-tra-trinh-duyet.mjs
// (gọi qua window.__moPhong.kiemTra()) và có thể gọi từ console trình duyệt.

import * as THREE from 'three';

const DUNG_SAI = 0.002; // m

export function kiemTraDuongOng(tb, ong) {
  const loi = [];
  const ok = [];
  const t = (ma) => ong.dsTuyen.find((x) => x.ma === ma);
  const dau = (ma) => t(ma).tuyen.diem[0];
  const cuoi = (ma) => t(ma).tuyen.diem.at(-1);
  const huongDau = (ma) => { const d = t(ma).tuyen.diem; return d[1].clone().sub(d[0]).normalize(); };
  const huongCuoi = (ma) => { const d = t(ma).tuyen.diem; return d.at(-1).clone().sub(d.at(-2)).normalize(); };

  // 1. Đầu ống nối đúng đầu nối thiết bị (vị trí và hướng)
  const ch = tb.chiller.diemNoi, bNL = tb.bomNL.diemNoi, bGN = tb.bomGN.diemNoi, th = tb.thap.diemNoi, ah = tb.ahu.diemNoi, bg = tb.bgn.diemNoi;
  const noi = [
    ['nl-cap', 'dau', ch.nuocLanhRa, 'đầu ra nước lạnh bình bay hơi'],
    ['nl-cap-ahu', 'cuoi', ah.vao, 'đầu vào dàn coil AHU'],
    ['nl-hoi-ahu', 'dau', ah.ra, 'đầu ra dàn coil AHU'],
    ['nl-hoi', 'cuoi', bNL.hut, 'cửa hút bơm nước lạnh'],
    ['nl-bom', 'dau', bNL.day, 'cửa đẩy bơm nước lạnh'],
    ['nl-bom', 'cuoi', ch.nuocLanhVao, 'đầu vào nước lạnh bình bay hơi'],
    ['nl-gianno', 'cuoi', bg.noi, 'đầu nối bình giãn nở'],
    ['gn-thap', 'dau', th.ra, 'đầu ra bể tháp'],
    ['gn-thap', 'cuoi', bGN.hut, 'cửa hút bơm giải nhiệt'],
    ['gn-bom', 'dau', bGN.day, 'cửa đẩy bơm giải nhiệt'],
    ['gn-bom', 'cuoi', ch.giaiNhietVao, 'đầu vào nước giải nhiệt bình ngưng'],
    ['gn-ve', 'dau', ch.giaiNhietRa, 'đầu ra nước giải nhiệt bình ngưng'],
    ['gn-ve', 'cuoi', th.vao, 'đầu vào nước nóng trên đỉnh tháp'],
  ];
  for (const [ma, phia, dn, ten] of noi) {
    const p = phia === 'dau' ? dau(ma) : cuoi(ma);
    const h = phia === 'dau' ? huongDau(ma) : huongCuoi(ma).negate();
    const lech = p.distanceTo(dn.p), goc = h.angleTo(dn.huong);
    if (lech > DUNG_SAI || goc > 0.01) loi.push(`Tuyến ${ma} (${phia}) không khớp ${ten}: lệch ${lech.toFixed(3)} m, lệch hướng ${(goc * 57.3).toFixed(1)}°`);
    else ok.push(`${ma} ↔ ${ten}`);
  }

  // 2. Các tuyến nối liền thành mạch (điểm cuối tuyến trước = điểm đầu tuyến sau)
  const lien = [
    ['nl-cap', 'nl-cap-ahu', 'tê rẽ bypass'], ['nl-cap', 'nl-bypass', 'tê rẽ bypass'], ['nl-hoi-ahu', 'nl-hoi', 'van ba ngả'],
    ['mc-day', null, ''], ['mc-long', 'mc-tietluu', 'van tiết lưu'],
  ];
  for (const [a, b, ten] of lien) {
    if (!b) continue;
    if (cuoi(a).distanceTo(dau(b)) > DUNG_SAI) loi.push(`${a} không nối liền ${b} tại ${ten}`); else ok.push(`${a} → ${b} (${ten})`);
  }
  const nhanh = cuoi('nl-bypass'), van3 = cuoi('nl-hoi-ahu');
  if (Math.abs(nhanh.x - van3.x) > DUNG_SAI || Math.abs(nhanh.z - van3.z) > DUNG_SAI || nhanh.y > van3.y) loi.push('Nhánh bypass không vào cổng dưới van ba ngả');
  else ok.push('nl-bypass → cổng B van ba ngả');
  const te = dau('nl-gianno');
  if (!t('nl-hoi').tuyen.doanThang().some((d) => new THREE.Line3(d.a, d.b).closestPointToPoint(te, true, new THREE.Vector3()).distanceTo(te) < DUNG_SAI)) loi.push('Nhánh bình giãn nở không rẽ từ tuyến hồi');
  else ok.push('nl-hoi → nl-gianno (tê bình giãn nở trên đường hút bơm)');

  // Mỗi tuyến chỉ thuộc một mạch, lưu chất đúng mạch
  const MACH_LC = { nuocLanh: ['nuocLanhCap', 'nuocLanhHoi'], giaiNhiet: ['nuocVaoNgung', 'nuocRaNgung', 'nuocBu'], moiChat: ['hoiHaAp', 'hoiCaoAp', 'longCaoAp', 'haiPha', 'dau'] };
  for (const x of ong.dsTuyen) if (!MACH_LC[x.mach]?.includes(x.luuChat)) loi.push(`Tuyến ${x.ma} có lưu chất ${x.luuChat} không thuộc ${x.mach}`);

  // 3. Ống không xuyên thiết bị và không xuyên nhau
  const vatCan = [tb.chiller, tb.bomNL, tb.bomGN, tb.thap, tb.ahu, tb.bgn].flatMap((x) => x.vatCan);
  const mau = new Map();
  const tuyenKT = ong.dsTuyen.filter((x) => x.ong);
  for (const x of tuyenKT) {
    const ds = [];
    for (let s = 0; s <= x.tuyen.dai; s += 0.04) ds.push({ s, p: x.tuyen.diemTai(s).p.clone() });
    mau.set(x.ma, ds);
  }
  const R = (x) => x.r + (x.baoOn || 0);
  const xaDau = (x, s, d) => s > d && s < x.tuyen.dai - d;
  // Ống – thiết bị: bỏ qua đoạn sát đầu nối thiết bị
  for (const x of tuyenKT) {
    for (const v of vatCan) {
      const trung = mau.get(x.ma).find(({ s, p }) => xaDau(x, s, x.mach === 'moiChat' ? 0.12 : 0.45) && v.hop.distanceToPoint(p) < R(x) - 0.005);
      if (trung) loi.push(`Tuyến ${x.ma} xuyên ${v.ten} tại (${trung.p.x.toFixed(2)}, ${trung.p.y.toFixed(2)}, ${trung.p.z.toFixed(2)})`);
    }
  }
  // Ống – ống: bỏ qua các cặp nối nhau quanh điểm nối
  const diemNoi = (a, b) => [a.tuyen.diem[0], a.tuyen.diem.at(-1)].flatMap((p) => [b.tuyen.diem[0], b.tuyen.diem.at(-1)].filter((q) => p.distanceTo(q) < 0.01).map(() => p));
  const nhanhTuyen = (a, b) => b.tuyen.doanThang().some((d) => [a.tuyen.diem[0], a.tuyen.diem.at(-1)].some((p) => new THREE.Line3(d.a, d.b).closestPointToPoint(p, true, new THREE.Vector3()).distanceTo(p) < 0.01));
  for (let i = 0; i < tuyenKT.length; i++) for (let j = i + 1; j < tuyenKT.length; j++) {
    const a = tuyenKT[i], b = tuyenKT[j];
    const chung = diemNoi(a, b);
    const laNhanh = nhanhTuyen(a, b) || nhanhTuyen(b, a);
    const can = R(a) + R(b) + 0.01;
    let gan = Infinity, tai = null;
    for (const pa of mau.get(a.ma)) {
      if (chung.some((c) => pa.p.distanceTo(c) < 0.45) || (laNhanh && (pa.s < 0.35 || pa.s > a.tuyen.dai - 0.35))) continue;
      for (const pb of mau.get(b.ma)) {
        if (chung.some((c) => pb.p.distanceTo(c) < 0.45) || (laNhanh && (pb.s < 0.35 || pb.s > b.tuyen.dai - 0.35))) continue;
        const d = pa.p.distanceTo(pb.p);
        if (d < gan) { gan = d; tai = pa.p; }
      }
    }
    if (gan < can) loi.push(`Tuyến ${a.ma} và ${b.ma} chạm nhau (cách tâm ${gan.toFixed(3)} m, cần ≥ ${can.toFixed(3)} m) gần (${tai.x.toFixed(2)}, ${tai.y.toFixed(2)}, ${tai.z.toFixed(2)})`);
  }
  return { loi, ok, soTuyen: ong.dsTuyen.length };
}
