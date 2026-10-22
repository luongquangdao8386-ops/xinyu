// Dựng đường ống ba mạch riêng biệt từ đầu nối của thiết bị: ống, co, mặt bích, bảo ôn, van và thiết bị đo,
// giá đỡ, mũi tên chỉ chiều và hạt dòng chảy. Mỗi tuyến ghi rõ mạch, lưu chất và đại lượng lưu lượng điều khiển hạt.
// Muốn đổi tuyến ống: sửa danh sách điểm gấp khúc trong dinhNghiaTuyenNuoc(); muốn thêm van: thêm vào mảng pk.

import * as THREE from 'three';
import { VL } from './vat-lieu.js';
import { V, TRUC, mesh, nhom, TuyenOng, geoOng, hop, truGiua, banSao, maTran, quatTuY, dungChung, buLongTaiDiem, ghep } from './hinh-hoc.js';
import { dangKy } from './thanh-phan.js';
import { MAU, ONG, CAO_DO, MACH } from './cau-hinh.js';
import * as PK from './thiet-bi/phu-kien.js';

const X_RE = -5.3; // vị trí rẽ nhánh bypass và van ba ngả trước AHU
const Y_TE = 1.1; // cao độ tê rẽ bypass trên đoạn ống xuống AHU
const Z_HOI = 5.5; // tuyến hồi từ AHU đi vòng ra phía trước

// Định nghĩa tuyến ống nước (toạ độ thế giới). s âm tính từ cuối tuyến; p là điểm nằm trên đoạn thẳng của tuyến.
function dinhNghiaTuyenNuoc(tb) {
  const ch = tb.chiller.diemNoi, bNL = tb.bomNL.diemNoi, bGN = tb.bomGN.diemNoi, th = tb.thap.diemNoi, ah = tb.ahu.diemNoi, bg = tb.bgn.diemNoi;
  const YT = CAO_DO.ongTren, YD = CAO_DO.ongDayBom;
  const xR = ch.nuocLanhRa.p.x, zE = ch.nuocLanhRa.p.z, zC = ch.giaiNhietRa.p.z;
  const zA = ah.vao.p.z;
  const rNL = ONG.nuocLanh.r, rGN = ONG.giaiNhiet.r;
  const P = (x, y, z) => V(x, y, z);
  const ap = (khoa) => ({ min: 0, max: 10, buoc: 2, donVi: 'bar', khoa });
  const nk = (khoa) => ({ min: 0, max: 50, buoc: 10, khoa });
  const NL = { mach: 'nuocLanh', r: rNL, baoOn: ONG.nuocLanh.baoOn, uon: 0.25, vlThuc: VL.thepSon };
  const GN = { mach: 'giaiNhiet', r: rGN, baoOn: 0, uon: 0.25, vlThuc: VL.ongNuocGN };
  const X = V(1, 0, 0), Z = V(0, 0, 1);
  return [
    { ...NL, ma: 'nl-cap', ten: 'Nước lạnh cấp: bình bay hơi → AHU', luuChat: 'nuocLanhCap', luuLuong: 'qNL', bichCuoi: false,
      diem: [ch.nuocLanhRa.p, P(xR, YT, zE), P(xR, YT, zA), P(X_RE, YT, zA), P(X_RE, Y_TE, zA)],
      pk: [
        { loai: 'khopMem', s: 0.16, len: Z },
        { loai: 'vanBuom', s: 0.5, len: Z },
        { loai: 'congTac', s: 0.78, len: X },
        { loai: 'nhietKe', s: 0.95, len: Z, mat: V(0.4, 0, 1), o: nk('tCapNL') },
        { loai: 'dongHoAp', s: 1.12, len: X, mat: V(1, 0, 0.4), o: ap('pRaBBH') },
        { loai: 'xaKhi', p: P(xR, YT, zE + 0.55), len: TRUC.y },
        { loai: 'te', s: -0.001, len: Z, o: { rNhanh: ONG.bypass.r, dai: rNL + ONG.nuocLanh.baoOn } },
      ] },
    { ...NL, ma: 'nl-cap-ahu', ten: 'Nước lạnh cấp vào dàn coil AHU', luuChat: 'nuocLanhCap', luuLuong: 'qNLCoil', bichDau: false,
      diem: [P(X_RE, Y_TE, zA), P(X_RE, ah.vao.p.y, zA), ah.vao.p],
      pk: [
        { loai: 'locY', p: P(-5.9, ah.vao.p.y, zA), len: TRUC.y },
        { loai: 'vanBuom', p: P(-6.3, ah.vao.p.y, zA), len: TRUC.y },
      ], khoangTrong: [[0, 0.1]] },
    { ...NL, ma: 'nl-bypass', ten: 'Nhánh bypass qua van ba ngả', luuChat: 'nuocLanhCap', luuLuong: 'qNLBypass', r: ONG.bypass.r, baoOn: ONG.bypass.baoOn, uon: 0.12, bichDau: false,
      diem: [P(X_RE, Y_TE, zA), P(X_RE, Y_TE, Z_HOI), P(X_RE, ah.ra.p.y - rNL * 1.75, Z_HOI)],
      pk: [{ loai: 'vanCanBang', p: P(X_RE, Y_TE, 5.12), len: TRUC.y }], khoangTrong: [[0, 0.14]] },
    { ...NL, ma: 'nl-hoi-ahu', ten: 'Nước lạnh hồi ra khỏi dàn coil', luuChat: 'nuocLanhHoi', luuLuong: 'qNLCoil', bichCuoi: false,
      diem: [ah.ra.p, P(-6.1, ah.ra.p.y, ah.ra.p.z), P(-6.1, ah.ra.p.y, Z_HOI), P(X_RE, ah.ra.p.y, Z_HOI)],
      pk: [
        { loai: 'vanBuom', p: P(-5.66, ah.ra.p.y, Z_HOI), len: TRUC.y },
        { loai: 'van3Nga', s: -0.001, len: TRUC.y, o: { rNhanh: ONG.bypass.r } },
      ] },
    { ...NL, ma: 'nl-hoi', ten: 'Nước lạnh hồi: AHU → bơm nước lạnh', luuChat: 'nuocLanhHoi', luuLuong: 'qNL', bichDau: false,
      diem: [P(X_RE, ah.ra.p.y, Z_HOI), P(bNL.hut.p.x, ah.ra.p.y, Z_HOI), P(bNL.hut.p.x, bNL.hut.p.y, Z_HOI), bNL.hut.p],
      pk: [
        { loai: 'vanCanBang', p: P(-4.9, ah.ra.p.y, Z_HOI), len: TRUC.y },
        { loai: 'nhietKe', p: P(bNL.hut.p.x, 1.3, Z_HOI), len: X, mat: V(1, 0, 0.5), o: nk('tHoiNL') },
        { loai: 'locY', p: P(bNL.hut.p.x, bNL.hut.p.y, 4.85), len: X },
        { loai: 'vanXa', p: P(bNL.hut.p.x, bNL.hut.p.y, 4.55), len: TRUC.y },
        { loai: 'te', p: P(bNL.hut.p.x, bNL.hut.p.y, bg.noi.p.z), len: X, o: { rNhanh: ONG.gianNo.r, dai: rNL + 0.02 } },
        { loai: 'vanBuom', p: P(bNL.hut.p.x, bNL.hut.p.y, 3.85), len: X },
        { loai: 'dongHoAp', p: P(bNL.hut.p.x, bNL.hut.p.y, 3.58), len: TRUC.y, mat: V(1, 0, 0.3), o: ap('pHutBomNL') },
        { loai: 'khopMem', s: -0.15, len: TRUC.y },
      ], khoangTrong: [[0, 0.2]] },
    { ...NL, ma: 'nl-gianno', ten: 'Nhánh nối bình giãn nở', luuChat: 'nuocLanhHoi', luuLuong: null, r: ONG.gianNo.r, baoOn: 0, uon: 0.05, bichDau: false, vlThuc: VL.thep,
      diem: [P(bNL.hut.p.x, bNL.hut.p.y, bg.noi.p.z), P(-3.6, bNL.hut.p.y, bg.noi.p.z), P(-3.6, 0.1, bg.noi.p.z), P(bg.noi.p.x, 0.1, bg.noi.p.z), bg.noi.p],
      pk: [
        { loai: 'vanBi', p: P(-4.05, bNL.hut.p.y, bg.noi.p.z), len: TRUC.y, ten: 'Van khóa bình giãn nở (có khóa tay)' },
        { loai: 'dongHoAp', p: P(-3.86, bNL.hut.p.y, bg.noi.p.z), len: TRUC.y, mat: V(1, 0, 0.6), o: ap('pHutBomNL') },
      ] },
    { ...NL, ma: 'nl-bom', ten: 'Nước lạnh hồi: bơm → đầu vào bình bay hơi', luuChat: 'nuocLanhHoi', luuLuong: 'qNL',
      diem: [bNL.day.p, P(bNL.day.p.x, YD, bNL.day.p.z), P(xR, YD, bNL.day.p.z), P(xR, ch.nuocLanhVao.p.y, bNL.day.p.z), ch.nuocLanhVao.p],
      pk: [
        { loai: 'khopMem', s: 0.14, len: X },
        { loai: 'vanMotChieu', s: 0.46, len: X },
        { loai: 'dongHoAp', s: 0.76, len: X, mat: V(1, 0, 0.4), o: ap('pDayBomNL') },
        { loai: 'vanBuom', p: P(-4.0, YD, bNL.day.p.z), len: TRUC.y },
        { loai: 'nhietKe', p: P(xR, ch.nuocLanhVao.p.y, 1.95), len: TRUC.y, mat: V(1, 0, 0.3), o: nk('tHoiNL') },
        { loai: 'dongHoAp', p: P(xR, ch.nuocLanhVao.p.y, 1.75), len: TRUC.y, mat: V(1, 0, 0.3), o: ap('pVaoBBH') },
        { loai: 'vanBuom', p: P(xR, ch.nuocLanhVao.p.y, 1.45), len: TRUC.y, o: { tayBen: true } },
        { loai: 'khopMem', s: -0.17, len: TRUC.y },
      ] },
    { ...GN, ma: 'gn-thap', ten: 'Nước giải nhiệt: bể tháp → bơm giải nhiệt', luuChat: 'nuocVaoNgung', luuLuong: 'qGN',
      diem: [th.ra.p, bGN.hut.p],
      pk: [
        { loai: 'vanBuom', s: 0.26, len: TRUC.y },
        { loai: 'locY', s: 0.85, len: X },
        { loai: 'dongHoAp', s: 1.45, len: TRUC.y, mat: V(1, 0, 0.3), o: ap('pHutBomGN') },
        { loai: 'khopMem', s: -0.17, len: TRUC.y },
      ] },
    { ...GN, ma: 'gn-bom', ten: 'Nước giải nhiệt: bơm → đầu vào bình ngưng', luuChat: 'nuocVaoNgung', luuLuong: 'qGN',
      diem: [bGN.day.p, P(bGN.day.p.x, YD, bGN.day.p.z), P(xR, YD, bGN.day.p.z), P(xR, ch.giaiNhietVao.p.y, bGN.day.p.z), ch.giaiNhietVao.p],
      pk: [
        { loai: 'khopMem', s: 0.16, len: X },
        { loai: 'vanMotChieu', s: 0.56, len: X },
        { loai: 'dongHoAp', s: 0.83, len: X, mat: V(1, 0, 0.4), o: ap('pDayBomGN') },
        { loai: 'vanBuom', p: P(-4.0, YD, bGN.day.p.z), len: TRUC.y },
        { loai: 'nhietKe', p: P(xR, ch.giaiNhietVao.p.y, -1.97), len: TRUC.y, mat: V(1, 0, -0.2), o: nk('tVaoNg') },
        { loai: 'dongHoAp', p: P(xR, ch.giaiNhietVao.p.y, -1.77), len: TRUC.y, mat: V(1, 0, -0.2), o: ap('pVaoBN') },
        { loai: 'vanBuom', p: P(xR, ch.giaiNhietVao.p.y, -1.47), len: TRUC.y, o: { tayBen: true } },
        { loai: 'khopMem', s: -0.17, len: TRUC.y },
      ] },
    { ...GN, ma: 'gn-ve', ten: 'Nước nóng: bình ngưng → đỉnh tháp', luuChat: 'nuocRaNgung', luuLuong: 'qGN',
      diem: [ch.giaiNhietRa.p, P(xR, YT, zC), P(xR, YT, th.vao.p.z), th.vao.p],
      pk: [
        { loai: 'khopMem', s: 0.17, len: Z.clone().negate() },
        { loai: 'vanBuom', s: 0.52, len: Z.clone().negate() },
        { loai: 'congTac', s: 0.78, len: X },
        { loai: 'nhietKe', s: 0.95, len: X, mat: V(1, 0, -0.2), o: nk('tRaNg') },
        { loai: 'dongHoAp', s: 1.12, len: X, mat: V(1, 0, -0.2), o: ap('pRaBN') },
        { loai: 'xaKhi', p: P(xR, YT, zC - 0.55), len: TRUC.y },
        { loai: 'vanBuom', p: P(-2.38, YT, th.vao.p.z), len: TRUC.y },
      ] },
  ];
}

// Giá đỡ ống (toạ độ thế giới): Π = khung hai cột đỡ ống trên cao, chan = cột đơn có yên đỡ.
function dinhNghiaGiaDo(tb) {
  const YT = CAO_DO.ongTren, YD = CAO_DO.ongDayBom;
  const xR = tb.chiller.diemNoi.nuocLanhRa.p.x, zA = tb.ahu.diemNoi.vao.p.z;
  const rNL = ONG.nuocLanh.r + ONG.nuocLanh.baoOn, rGN = ONG.giaiNhiet.r;
  const yH = tb.ahu.diemNoi.ra.p.y, yB = tb.bomNL.diemNoi.hut.p.y;
  return [
    { loai: 'pi', p: V(xR, YT, 2.0), huong: TRUC.z, R: rNL },
    { loai: 'pi', p: V(xR, YT, 3.9), huong: TRUC.z, R: rNL },
    { loai: 'pi', p: V(-3.6, YT, zA), huong: TRUC.x, R: rNL },
    { loai: 'pi', p: V(xR, YT, -2.0), huong: TRUC.z, R: rGN },
    { loai: 'pi', p: V(xR, YT, -4.3), huong: TRUC.z, R: rGN },
    { loai: 'pi', p: V(xR, YT, -6.2), huong: TRUC.z, R: rGN },
    { loai: 'chan', p: V(-3.1, YD, 2.6), huong: TRUC.x, R: rNL },
    { loai: 'chan', p: V(-3.1, YD, -2.6), huong: TRUC.x, R: rGN },
    { loai: 'chan', p: V(xR, tb.chiller.diemNoi.nuocLanhVao.p.y, 2.18), huong: TRUC.z, R: rNL },
    { loai: 'chan', p: V(xR, tb.chiller.diemNoi.giaiNhietVao.p.y, -2.2), huong: TRUC.z, R: rGN },
    { loai: 'chan', p: V(-4.4, tb.thap.diemNoi.ra.p.y, -3.65), huong: TRUC.z, R: rGN },
    { loai: 'chan', p: V(-4.4, yB, 4.1), huong: TRUC.z, R: rNL },
    { loai: 'chan', p: V(-4.62, yH, Z_HOI), huong: TRUC.x, R: rNL },
  ];
}

const TAO = {
  vanBuom: (t, o) => PK.vanBuom(t.r, o),
  vanMotChieu: (t) => PK.vanMotChieu(t.r),
  locY: (t) => PK.locY(t.r),
  khopMem: (t) => PK.khopMem(t.r),
  vanCanBang: (t) => PK.vanCanBang(t.r),
  van3Nga: (t, o) => PK.van3Nga(t.r, o.rNhanh),
  vanBi: (t) => PK.vanBi(t.r),
  vanXa: (t) => PK.vanXa(t.r + t.baoOn),
  dongHoAp: (t, o) => PK.dongHoAp(t.r + t.baoOn, o),
  nhietKe: (t, o) => PK.nhietKe(t.r + t.baoOn, o),
  congTac: (t) => PK.congTacDongChay(t.r + t.baoOn),
  xaKhi: (t) => PK.xaKhi(t.r + t.baoOn),
  te: (t, o) => PK.teNhanh(t.r, o.rNhanh, o.dai),
};
// Phụ kiện cắt ngang lớp bảo ôn (cần chừa khoảng)
const CAT_BAO_ON = new Set(['vanBuom', 'vanMotChieu', 'locY', 'khopMem', 'vanCanBang', 'van3Nga', 'vanBi', 'te']);

// Độ dài dọc tuyến của điểm p nằm trên một đoạn thẳng.
function sTaiDiem(tuyen, p) {
  for (const d of tuyen.doan) {
    if (d.loai !== 'thang') continue;
    const ab = d.b.clone().sub(d.a);
    const u = p.clone().sub(d.a).dot(ab) / ab.lengthSq();
    if (u < -1e-6 || u > 1 + 1e-6) continue;
    const gan = d.a.clone().addScaledVector(ab, u);
    if (gan.distanceTo(p) < 1e-3) return d.s0 + u * d.len;
  }
  throw new Error(`Điểm (${p.x}, ${p.y}, ${p.z}) không nằm trên đoạn thẳng nào của tuyến`);
}

// Khoảng [0, dai] trừ đi các khoảng bận.
function khoangTrong(dai, ban) {
  const ds = ban.map(([a, b]) => [Math.max(0, a), Math.min(dai, b)]).filter(([a, b]) => b > a).sort((x, y) => x[0] - y[0]);
  const out = [];
  let dau = 0;
  for (const [a, b] of ds) { if (a > dau) out.push([dau, a]); dau = Math.max(dau, b); }
  if (dau < dai) out.push([dau, dai]);
  return out.filter(([a, b]) => b - a > 0.04);
}

// Mũi tên chỉ chiều: phễu và vành màu theo lưu chất bọc quanh ống.
function geoMuiTen(R) {
  return dungChung(`muiTen:${R.toFixed(3)}`, () => {
    const k = Math.max(0.6, Math.min(1, R / 0.1));
    const non = new THREE.CylinderGeometry(R + 0.006, R + 0.05 * k, 0.15 * k, 24, 1, false);
    const vanh = new THREE.CylinderGeometry(R + 0.005, R + 0.005, 0.12 * k, 24, 1, true);
    vanh.translate(0, -0.15 * k, 0);
    return ghep([non, vanh]);
  });
}

function giaDoPi(p, huong, R, rong = 1.1) {
  const g = nhom('Giá đỡ khung Π');
  const ngang = new THREE.Vector3().crossVectors(huong, TRUC.y).normalize();
  const yDam = p.y - R - 0.05;
  for (const k of [-1, 1]) {
    const c = p.clone().addScaledVector(ngang, (k * rong) / 2);
    g.add(hop(0.08, yDam, 0.08, VL.khung, V(c.x, yDam / 2, c.z)));
    g.add(hop(0.2, 0.012, 0.2, VL.khung, V(c.x, 0.006, c.z)));
    g.add(buLongTaiDiem([V(c.x - 0.07, 0.012, c.z - 0.07), V(c.x + 0.07, 0.012, c.z + 0.07)], 'y', { co: 0.009, dai: 0.03, vl: VL.thep, mu: true }));
  }
  const dam = hop(rong + 0.1, 0.1, 0.08, VL.khung, V(p.x, yDam, p.z));
  dam.quaternion.setFromUnitVectors(TRUC.x, ngang);
  g.add(dam);
  // Đế đỡ ống và cùm chữ U
  g.add(hop(0.16, 0.05, 0.12, VL.khung, V(p.x, p.y - R - 0.0, p.z)).rotateY(Math.atan2(huong.x, huong.z)));
  const cum = mesh(dungChung(`cum:${R.toFixed(3)}`, () => new THREE.TorusGeometry(R + 0.008, 0.008, 6, 24, Math.PI)), VL.thep);
  cum.position.copy(p);
  cum.quaternion.setFromUnitVectors(TRUC.z, huong);
  g.add(cum);
  return g;
}

function giaDoChan(p, R, huong) {
  const g = nhom('Giá đỡ cột đơn');
  const yYen = p.y - R - 0.03;
  g.add(truGiua(V(p.x, 0.01, p.z), V(p.x, yYen, p.z), 0.04, VL.khung, { seg: 12 }));
  g.add(hop(0.22, 0.012, 0.22, VL.khung, V(p.x, 0.006, p.z)));
  g.add(buLongTaiDiem([V(p.x - 0.08, 0.012, p.z - 0.08), V(p.x + 0.08, 0.012, p.z + 0.08), V(p.x - 0.08, 0.012, p.z + 0.08), V(p.x + 0.08, 0.012, p.z - 0.08)], 'y', { co: 0.009, dai: 0.03, vl: VL.thep, mu: true }));
  const yen = mesh(dungChung(`yen:${R.toFixed(3)}`, () => { const t = new THREE.TorusGeometry(R + 0.01, 0.014, 6, 20, Math.PI); t.rotateZ(Math.PI); return t; }), VL.khung);
  yen.position.copy(p);
  yen.quaternion.setFromUnitVectors(TRUC.z, huong);
  g.add(yen, hop(0.1, 0.03, 0.06, VL.khung, V(p.x, yYen, p.z)));
  return g;
}

export function dungDuongOng(tb, scene) {
  const goc = nhom('Đường ống');
  scene.add(goc);
  dangKy('duong-ong', goc, { ten: 'Đường ống ba mạch', chucNang: 'Mạch nước lạnh, mạch nước giải nhiệt và mạch môi chất là ba mạch kín riêng biệt. Nước và môi chất chỉ trao đổi nhiệt qua thành ống trong bình bay hơi và bình ngưng, không trộn với nhau.' });
  const nhomMach = {
    nuocLanh: nhom('Mạch nước lạnh'), giaiNhiet: nhom('Mạch nước giải nhiệt'), moiChat: nhom('Mạch môi chất'),
  };
  goc.add(nhomMach.nuocLanh, nhomMach.giaiNhiet);
  tb.chiller.nhomTG.add(nhomMach.moiChat);
  dangKy('mach-nuocLanh', nhomMach.nuocLanh, { ten: MACH.nuocLanh.ten, cha: 'duong-ong', chucNang: 'Bình bay hơi → nước lạnh cấp 7 °C → AHU → nước hồi 12 °C → bơm nước lạnh → bình bay hơi. Ống bọc bảo ôn và vỏ nhôm.' });
  dangKy('mach-giaiNhiet', nhomMach.giaiNhiet, { ten: MACH.giaiNhiet.ten, cha: 'duong-ong', chucNang: 'Bể tháp → bơm giải nhiệt → bình ngưng (30 → 35 °C) → vòi phun trên đỉnh tháp → rơi qua khối đệm → bể tháp.' });
  dangKy('mach-moiChat', nhomMach.moiChat, { ten: MACH.moiChat.ten, cha: 'duong-ong', chucNang: 'Máy nén → bình tách dầu → bình ngưng → phin lọc, kính xem → van tiết lưu → bình bay hơi → máy nén. Mạch kín nằm trong cụm chiller.' });

  const dsTuyen = [];
  const pkTheoMach = { nuocLanh: [], giaiNhiet: [], moiChat: [] };
  const dsDongHo = [];

  const dungTuyen = (t, cha) => {
    const g = nhom(t.ten);
    cha.add(g);
    dangKy(`ong-${t.ma}`, g, { ten: t.ten, cha: `mach-${t.mach}`, chucNang: `Tuyến ống ${t.r >= 0.08 ? (t.r > 0.1 ? 'DN200' : 'DN150') : ''} thuộc ${MACH[t.mach].ten.toLowerCase()}.` });
    const tuyen = t.tuyen || new TuyenOng(t.diem, t.uon);
    const ban = [...(t.khoangTrong || [])];
    // Phụ kiện
    (t.pk || []).forEach((pk, i) => {
      const kq = TAO[pk.loai](t, pk.o || {});
      let s = pk.p ? sTaiDiem(tuyen, pk.p) : pk.s;
      if (s < 0) s = tuyen.dai + s;
      if (pk.loai === 'te' || pk.loai === 'van3Nga') s = Math.min(Math.max(s, 0), tuyen.dai);
      PK.datLenTuyen(kq.obj, tuyen, s, pk.len || TRUC.y);
      g.add(kq.obj);
      if (pk.mat) PK.huongMatDongHo(kq.obj, pk.mat.clone().normalize());
      if (CAT_BAO_ON.has(pk.loai)) ban.push([s - kq.dai / 2, s + kq.dai / 2]);
      dangKy(`pk-${t.ma}-${i}`, kq.obj, { ten: pk.ten || kq.ten, cha: `ong-${t.ma}`, chucNang: kq.chucNang });
      pkTheoMach[t.mach].push(kq.obj);
    });
    // Mặt bích đối ứng tại đầu nối thiết bị
    if (t.bichDau !== false) {
      const kq = PK.bichCuoi(t.r, false);
      PK.datLenTuyen(kq.obj, tuyen, 0);
      g.add(kq.obj); ban.push([0, 0.07]); pkTheoMach[t.mach].push(kq.obj);
    }
    if (t.bichCuoi !== false) {
      const kq = PK.bichCuoi(t.r, true);
      PK.datLenTuyen(kq.obj, tuyen, tuyen.dai);
      g.add(kq.obj); ban.push([tuyen.dai - 0.07, tuyen.dai]); pkTheoMach[t.mach].push(kq.obj);
    }
    // Ống
    const ong = mesh(geoOng(tuyen, t.r, { nTron: t.r > 0.05 ? 24 : 12 }), t.vlThuc);
    g.add(ong);
    // Bảo ôn (chừa khoảng tại van, mặt bích; hai đầu mỗi đoạn có vành thể hiện chiều dày)
    let baoOn = null;
    if (t.baoOn > 0) {
      const doan = khoangTrong(tuyen.dai, ban);
      if (doan.length) {
        baoOn = mesh(ghep(doan.map(([a, b]) => geoOng(tuyen, t.r + t.baoOn, { s0: a, s1: b, nTron: 24, napDau: true }))), t.vlBaoOn || VL.nhomVo);
        g.add(baoOn);
      }
    }
    // Mũi tên chỉ chiều trên các đoạn thẳng dài
    const R = t.r + t.baoOn;
    const muiTen = [];
    for (const d of tuyen.doanThang()) {
      if (d.len < (t.mach === 'moiChat' ? 0.3 : 0.9)) continue;
      const n = Math.max(1, Math.round(d.len / 2.6));
      for (let k = 1; k <= n; k++) {
        let s = d.s0 + (d.len * k) / (n + 1);
        const vuong = ban.find(([a, b]) => s > a - 0.12 && s < b + 0.12);
        if (vuong) s = vuong[1] + 0.14 < d.s1 - 0.1 ? vuong[1] + 0.14 : vuong[0] - 0.14;
        if (s < d.s0 + 0.05 || s > d.s1 - 0.05) continue;
        const { p, t: tt } = tuyen.diemTai(s);
        const m = mesh(geoMuiTen(R), VL.luuChat[t.luuChat], { bong: false });
        m.position.copy(p);
        m.quaternion.copy(quatTuY(tt));
        g.add(m);
        muiTen.push(m);
      }
    }
    const kq = { ...t, tuyen, nhom: g, ong, baoOn, muiTen };
    dsTuyen.push(kq);
    return kq;
  };

  // Mạch nước
  for (const t of dinhNghiaTuyenNuoc(tb)) dungTuyen(t, nhomMach[t.mach]);
  // Mạch môi chất (tuyến định nghĩa trong cụm chiller)
  const VL_MC = {
    'mc-hut': { vlThuc: VL.thepSon, vlBaoOn: VL.baoOn, bichDau: true, bichCuoi: true, luuLuong: 'qMC' },
    'mc-day': { vlThuc: VL.thepSon, bichDau: true, bichCuoi: true, luuLuong: 'qMC' },
    'mc-ngung': { vlThuc: VL.thepSon, bichDau: true, bichCuoi: true, luuLuong: 'qMC' },
    'mc-long': { vlThuc: VL.dong, bichDau: false, bichCuoi: false, luuLuong: 'qMC' },
    'mc-tietluu': { vlThuc: VL.dong, vlBaoOn: VL.baoOn, bichDau: false, bichCuoi: false, luuLuong: 'qMC' },
    'mc-dau': { vlThuc: VL.dong, bichDau: false, bichCuoi: false, luuLuong: 'qDau' },
  };
  for (const t of tb.chiller.tuyenMoiChat) dungTuyen({ ...t, ...VL_MC[t.ma], pk: [] }, nhomMach.moiChat);
  // Nước bù cho tháp (ống đã dựng trong tháp, chỉ thêm hạt chảy)
  dsTuyen.push({ ma: 'gn-bu', mach: 'giaiNhiet', luuChat: 'nuocBu', luuLuong: 'qBu', r: ONG.nuocBu.r, baoOn: 0, tuyen: tb.thap.tuyenNuocBu, ong: null, muiTen: [], phu: true });
  // Ống luồn dây của chiller
  for (const [i, t] of tb.chiller.nhomOngLuon.userData.tuyen.entries()) tb.chiller.nhomOngLuon.add(mesh(geoOng(t, i === 0 ? 0.022 : 0.013, { nTron: 10 }), VL.ongLuon));

  // Giá đỡ
  const giaDo = nhom('Giá đỡ ống');
  goc.add(giaDo);
  dangKy('gia-do', giaDo, { ten: 'Giá đỡ ống', cha: 'duong-ong', chucNang: 'Khung Π đỡ các tuyến ống trên cao, cột đơn có yên đỡ dưới các tuyến thấp; ống được cùm chữ U, bản đế bắt bu lông nở xuống sàn. Giá đỡ gánh trọng lượng ống và nước để thiết bị không chịu tải từ đường ống.' });
  dinhNghiaGiaDo(tb).forEach((d, i) => {
    const g = d.loai === 'pi' ? giaDoPi(d.p, d.huong, d.R) : giaDoChan(d.p, d.R, d.huong);
    giaDo.add(g);
    dangKy(`gd-${i}`, g, { ten: d.loai === 'pi' ? 'Giá đỡ khung Π' : 'Giá đỡ cột đơn', cha: 'gia-do', chucNang: d.loai === 'pi' ? 'Hai cột thép hộp và dầm chữ C đỡ ống trên cao, có đế đỡ và cùm chữ U.' : 'Cột thép ống có yên đỡ cong ôm đáy ống, chịu tải tuyến ống thấp.' });
  });

  // Hạt dòng chảy: một InstancedMesh, màu theo lưu chất của từng tuyến
  const buocHat = { cao: 0.22, thap: 0.45 };
  let tong = 0;
  for (const t of dsTuyen) {
    if (!t.luuLuong) continue;
    t.soHat = Math.max(3, Math.floor(t.tuyen.dai / buocHat.cao));
    t.hat0 = tong;
    tong += t.soHat;
  }
  const hat = new THREE.InstancedMesh(dungChung('hatDong', () => new THREE.SphereGeometry(1, 10, 8)), new THREE.MeshBasicMaterial({ color: '#ffffff' }), tong);
  hat.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(tong * 3), 3);
  hat.frustumCulled = false;
  hat.renderOrder = 1;
  const mau = new THREE.Color();
  for (const t of dsTuyen) {
    if (!t.luuLuong) continue;
    mau.set(MAU[t.luuChat]).offsetHSL(0, 0.05, 0.08);
    for (let k = 0; k < t.soHat; k++) hat.setColorAt(t.hat0 + k, mau);
    t.pha = 0;
    t.rHat = Math.max(0.008, t.r * (t.mach === 'moiChat' ? 0.5 : 0.42));
  }
  hat.visible = false;
  goc.add(hat);

  return { goc, dsTuyen, hat, pkTheoMach, nhomMach, dongHo: PK.dongHo };
}

// Chế độ hiển thị ống: màu thực tế / màu theo lưu chất / ống trong suốt có hạt; làm nổi bật một mạch.
const VL_MO = new THREE.MeshStandardMaterial({ color: '#a4adb5', roughness: 0.6, transparent: true, opacity: 0.13, depthWrite: false });
export function datCheDoOng(kq, { mauLuuChat = false, xemDong = false, machNoiBat = 'tatCa' }) {
  for (const t of kq.dsTuyen) {
    const mo = machNoiBat !== 'tatCa' && t.mach !== machNoiBat;
    const trong = !mo && (xemDong || machNoiBat === t.mach);
    t.hienHat = trong;
    if (!t.ong) continue;
    t.ong.material = mo ? VL_MO : trong ? VL.luuChatTrong[t.luuChat] : mauLuuChat ? VL.luuChat[t.luuChat] : t.vlThuc;
    t.ong.castShadow = !mo && !trong;
    if (t.baoOn) {
      t.baoOn.visible = !trong;
      t.baoOn.material = mo ? VL_MO : mauLuuChat ? VL.luuChat[t.luuChat] : t.vlBaoOn || VL.nhomVo;
      t.baoOn.castShadow = !mo;
    }
    for (const m of t.muiTen) m.visible = !mo;
  }
  for (const [mach, ds] of Object.entries(kq.pkTheoMach)) for (const o of ds) o.visible = machNoiBat === 'tatCa' || machNoiBat === mach;
  kq.hat.visible = kq.dsTuyen.some((t) => t.hienHat);
}
