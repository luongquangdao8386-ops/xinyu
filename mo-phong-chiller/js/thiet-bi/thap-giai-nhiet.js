// Tháp giải nhiệt vuông kiểu ngược dòng, quạt hút trên đỉnh.
// Nước nóng phun từ trên xuống qua khối đệm, không khí đi từ cửa chớp phía dưới lên quạt.
// Toạ độ cục bộ: gốc ở mặt sàn dưới tâm tháp; cửa ra nước ở mặt +Z, cửa vào nước nóng ở mặt +X.

import * as THREE from 'three';
import { VL } from '../vat-lieu.js';
import {
  V, TRUC, mesh, nhom, truGiua, truTheoTruc, hop, geoLathe, vongBuLong, buLongTaiDiem, banSao, maTran, quatTuY,
  geoTamSong, geoCanhQuat, geoMatBich, dungChung, TuyenOng, geoOng,
} from '../hinh-hoc.js';
import { dangKy } from '../thanh-phan.js';
import { ONG, CAO_DO, VI_TRI } from '../cau-hinh.js';
import * as PK from './phu-kien.js';

export const THAP = {
  nua: 1.5, // nửa cạnh
  yDay: 0.4, yMieng: 1.05, // đáy và miệng bể nước
  yNuoc: 0.88, // mực nước bình thường
  yChop: [1.05, 1.85], // vùng cửa chớp hút gió
  yDem: [1.95, 2.85], // khối đệm
  yPhun: 2.98, // ống nhánh phân phối
  yTachGiot: [3.1, 3.26],
  ySan: 3.4, // sàn đỉnh tháp
  rQuat: 1.2, yQuat: 3.9, yMieng2: 4.25, // quạt và miệng thoát gió
};

export function dungThap() {
  const T = THAP, H = T.nua;
  const goc = nhom('Tháp giải nhiệt');
  goc.position.set(VI_TRI.thap.x, 0, VI_TRI.thap.z);
  dangKy('thap', goc, {
    ten: 'Tháp giải nhiệt vuông, ngược dòng, quạt hút', the: 'CT-01',
    chucNang: 'Thải nhiệt của bình ngưng ra không khí. Nước nóng 35 °C được phun đều lên khối đệm, chảy thành màng mỏng; không khí hút từ dưới lên làm bay hơi một phần nước nên nước nguội lại khoảng 30 °C và gom ở bể đáy.',
    cauTao: 'Khung và chân thép, vỏ tấm composite, cửa chớp hút gió, bể nước, ống phân phối và vòi phun, khối đệm nhiều lớp, bộ tách giọt, quạt hướng trục và động cơ, miệng thoát gió có lưới bảo vệ, van phao cấp nước bù, đường xả tràn.',
    thongSo: 'thap',
  });
  const voThap = [];
  const hoatAnh = {};

  // ---------- Khung và chân đỡ ----------
  const khung = nhom('Khung tháp');
  goc.add(khung);
  for (const z of [-1.1, 1.1]) khung.add(hop(3.3, 0.12, 0.35, VL.betong, V(0, 0.06, z)));
  const chan = [];
  for (const x of [-1.42, 0, 1.42]) for (const z of [-1.1, 1.1]) chan.push(V(x, 0, z));
  khung.add(banSao(dungChung('chanThap', () => new THREE.BoxGeometry(0.12, T.yDay - 0.12, 0.12)), VL.khung, chan.map((p) => maTran(V(p.x, 0.12 + (T.yDay - 0.12) / 2, p.z)))));
  khung.add(banSao(dungChung('deChan', () => new THREE.BoxGeometry(0.22, 0.012, 0.22)), VL.khung, chan.map((p) => maTran(V(p.x, 0.126, p.z)))));
  const neo = [];
  for (const p of chan) neo.push(V(p.x - 0.08, 0.132, p.z - 0.08), V(p.x + 0.08, 0.132, p.z + 0.08));
  khung.add(buLongTaiDiem(neo, 'y', { co: 0.01, dai: 0.04, vl: VL.thep, mu: true }));
  for (const z of [-1.1, 1.1]) khung.add(hop(3.0, 0.1, 0.1, VL.khung, V(0, T.yDay - 0.05, z)));
  // Cột góc và đà ngang
  const cot = [[-H, -H], [H, -H], [H, H], [-H, H]];
  for (const [x, z] of cot) khung.add(hop(0.1, T.ySan - T.yMieng, 0.1, VL.frpDam, V(x, (T.ySan + T.yMieng) / 2, z)));
  for (const y of [T.yMieng, T.yChop[1], T.ySan - 0.04]) {
    khung.add(hop(2 * H, 0.08, 0.08, VL.frpDam, V(0, y, -H)), hop(2 * H, 0.08, 0.08, VL.frpDam, V(0, y, H)));
    khung.add(hop(0.08, 0.08, 2 * H, VL.frpDam, V(-H, y, 0)), hop(0.08, 0.08, 2 * H, VL.frpDam, V(H, y, 0)));
  }
  for (const [x, z] of [[0, -H], [0, H], [-H, 0], [H, 0]]) khung.add(hop(0.07, T.yChop[1] - T.yMieng, 0.07, VL.frpDam, V(x, (T.yChop[1] + T.yMieng) / 2, z)));
  dangKy('thap-khung', khung, { ten: 'Khung tháp và chân đỡ', cha: 'thap', chucNang: 'Cột góc, đà ngang và chân thép đặt trên dầm bê tông, đỡ bể nước, khối đệm và cụm quạt.' });

  // ---------- Bể nước đáy ----------
  const be = nhom('Bể nước đáy');
  goc.add(be);
  const hBe = T.yMieng - T.yDay;
  be.add(hop(2 * H, 0.04, 2 * H, VL.frp, V(0, T.yDay + 0.02, 0)));
  be.add(hop(2 * H, hBe, 0.04, VL.frp, V(0, T.yDay + hBe / 2, -H + 0.02)), hop(2 * H, hBe, 0.04, VL.frp, V(0, T.yDay + hBe / 2, H - 0.02)));
  be.add(hop(0.04, hBe, 2 * H, VL.frp, V(-H + 0.02, T.yDay + hBe / 2, 0)), hop(0.04, hBe, 2 * H, VL.frp, V(H - 0.02, T.yDay + hBe / 2, 0)));
  // Mặt nước có sóng nhẹ
  const geoNuoc = new THREE.PlaneGeometry(2 * H - 0.08, 2 * H - 0.08, 28, 28);
  geoNuoc.rotateX(-Math.PI / 2);
  const matNuoc = mesh(geoNuoc, VL.matNuoc, { bong: false });
  matNuoc.position.y = T.yNuoc;
  be.add(matNuoc);
  hoatAnh.matNuoc = matNuoc;
  // Cửa ra nước về bơm: lưới chắn rác trong bể và ống nối qua thành +Z
  const rRa = ONG.giaiNhiet.r;
  const yRa = CAO_DO.tamTrucBom;
  be.add(truGiua(V(0, yRa, H - 0.42), V(0, yRa, H - 0.04), 0.15, VL.luoiChe, { seg: 24 }));
  be.add(hop(0.5, 0.012, 0.5, VL.frpDam, V(0, yRa + 0.2, H - 0.25)));
  be.add(truGiua(V(0, yRa, H - 0.05), V(0, yRa, H + 0.25 - 0.024), rRa, VL.ongNuocGN, { seg: 28 }));
  const bichRa = mesh(geoMatBich(rRa, rRa + 0.06, 0.024), VL.ongNuocGN, { vt: V(0, yRa, H + 0.25) });
  bichRa.quaternion.copy(quatTuY(TRUC.z));
  be.add(bichRa);
  dangKy('thap-be', be, { ten: 'Bể nước đáy và đầu ra nước về bơm', cha: 'thap', chucNang: 'Gom nước đã làm mát. Cửa ra có lưới chắn rác và tấm chống xoáy, dẫn nước về cửa hút bơm giải nhiệt.' });

  // ---------- Cửa chớp hút gió (mỗi mặt một InstancedMesh để ẩn riêng) ----------
  const chop = nhom('Cửa chớp');
  goc.add(chop);
  const geoLa = dungChung('laChop', () => new THREE.BoxGeometry(2 * H - 0.12, 0.13, 0.008));
  const yLa = [];
  for (let y = T.yChop[0] + 0.08; y < T.yChop[1] - 0.03; y += 0.1) yLa.push(y);
  const matChop = {};
  for (const [ten, n] of [['+x', V(1, 0, 0)], ['-x', V(-1, 0, 0)], ['+z', V(0, 0, 1)], ['-z', V(0, 0, -1)]]) {
    const q = new THREE.Quaternion().setFromUnitVectors(TRUC.z, n);
    const nghieng = new THREE.Quaternion().setFromAxisAngle(TRUC.x, 0.75);
    const qq = q.clone().multiply(nghieng);
    const im = banSao(geoLa, VL.frpDam, yLa.map((y) => maTran(n.clone().multiplyScalar(H + 0.03).setY(y), qq)));
    chop.add(im);
    matChop[ten] = im;
  }
  dangKy('thap-chop', chop, { ten: 'Cửa hút gió và thanh chớp', cha: 'thap', chucNang: 'Các thanh chớp nghiêng cho không khí đi vào phần dưới tháp nhưng chắn nước bắn ra ngoài và che nắng cho bể.' });

  // ---------- Vỏ tấm composite ----------
  const vo = nhom('Vỏ tháp');
  goc.add(vo);
  const hVo = T.ySan - T.yChop[1];
  const yVo = (T.ySan + T.yChop[1]) / 2;
  const tamVo = {};
  const geoGan = dungChung('ganVo', () => new THREE.BoxGeometry(0.05, hVo, 0.03));
  for (const [ten, n] of [['+x', V(1, 0, 0)], ['-x', V(-1, 0, 0)], ['+z', V(0, 0, 1)], ['-z', V(0, 0, -1)]]) {
    const mat = nhom(`Tấm vỏ ${ten}`);
    const tam = hop(2 * H, hVo, 0.02, VL.frp, V(0, 0, 0));
    mat.add(tam);
    const gan = banSao(geoGan, VL.frp, [-1.0, -0.5, 0, 0.5, 1.0].map((u) => maTran(V(u, 0, 0.02))));
    mat.add(gan);
    mat.position.copy(n.clone().multiplyScalar(H)).setY(yVo);
    mat.quaternion.setFromUnitVectors(TRUC.z, n);
    vo.add(mat);
    tamVo[ten] = mat;
  }
  // Cửa thăm trên mặt -Z
  const cua = nhom('Cửa thăm');
  cua.add(hop(0.6, 0.9, 0.03, VL.frpDam, V(0.6, 2.4, -H - 0.025)));
  cua.add(hop(0.04, 0.12, 0.04, VL.thep, V(0.38, 2.4, -H - 0.055)));
  for (const y of [2.1, 2.7]) cua.add(truTheoTruc(0.015, 0.08, 'y', VL.thep, V(0.92, y, -H - 0.03), { seg: 8 }));
  vo.add(cua);
  dangKy('thap-vo', vo, { ten: 'Vỏ tháp', cha: 'thap', chucNang: 'Tấm composite có gân chịu lực, bao kín phần khối đệm để không khí chỉ đi từ cửa chớp lên quạt. Có cửa thăm để kiểm tra bên trong.' });
  voThap.push(tamVo['+x'], tamVo['+z'], matChop['+x'], matChop['+z']);

  // ---------- Khối đệm trao đổi nhiệt nhiều lớp ----------
  const dem = nhom('Khối đệm');
  goc.add(dem);
  const soLop = 3, cao = (T.yDem[1] - T.yDem[0]) / soLop;
  const geoTam = dungChung('tamDem', () => geoTamSong(2 * H - 0.1, cao - 0.01, 0.012, 0.07, 64));
  for (let l = 0; l < soLop; l++) {
    const y = T.yDem[0] + cao * (l + 0.5);
    const q = new THREE.Quaternion().setFromAxisAngle(TRUC.y, l % 2 ? Math.PI / 2 : 0);
    const mt = [];
    for (let u = -H + 0.08; u <= H - 0.08; u += 0.1) {
      const p = l % 2 ? V(u, y, 0) : V(0, y, u);
      mt.push(maTran(p, q));
    }
    dem.add(banSao(geoTam, VL.fill, mt, { bong: false }));
  }
  for (const z of [-0.9, 0, 0.9]) dem.add(hop(2 * H - 0.1, 0.05, 0.06, VL.frpDam, V(0, T.yDem[0] - 0.03, z)));
  dangKy('thap-dem', dem, { ten: 'Khối đệm trao đổi nhiệt', cha: 'thap', chucNang: 'Ba lớp tấm nhựa gợn sóng xếp vuông góc nhau. Nước chảy thành màng mỏng trên tấm, tăng diện tích tiếp xúc và thời gian tiếp xúc với không khí đi ngược lên.' });

  // ---------- Hệ phân phối nước và vòi phun ----------
  const pp = nhom('Hệ phân phối nước');
  goc.add(pp);
  const yOng = CAO_DO.ongTren;
  pp.add(truGiua(V(H + 0.25 - 0.024, yOng, 0), V(-H + 0.15, yOng, 0), 0.09, VL.nhuaTrang, { seg: 24 }));
  pp.add(truGiua(V(H + 0.02, yOng, 0), V(H + 0.25 - 0.024, yOng, 0), rRa, VL.ongNuocGN, { seg: 28 }));
  const bichVao = mesh(geoMatBich(rRa, rRa + 0.06, 0.024), VL.ongNuocGN, { vt: V(H + 0.25, yOng, 0) });
  bichVao.quaternion.copy(quatTuY(TRUC.x));
  pp.add(bichVao);
  const xNhanh = [-1.15, -0.575, 0, 0.575, 1.15];
  const zVoi = [-1.15, -0.575, 0, 0.575, 1.15];
  for (const x of xNhanh) {
    pp.add(truGiua(V(x, T.yPhun, -H + 0.12), V(x, T.yPhun, H - 0.12), 0.035, VL.nhuaTrang, { seg: 14 }));
    pp.add(truGiua(V(x, T.yPhun, 0), V(x, yOng, 0), 0.04, VL.nhuaTrang, { seg: 12 }));
  }
  const voi = [];
  for (const x of xNhanh) for (const z of zVoi) voi.push(V(x, T.yPhun - 0.05, z));
  pp.add(banSao(dungChung('voiPhun', () => {
    const g = new THREE.CylinderGeometry(0.02, 0.026, 0.06, 12);
    return g;
  }), VL.nhuaTrang, voi.map((p) => maTran(p))));
  pp.add(banSao(dungChung('diaPhun', () => new THREE.CylinderGeometry(0.035, 0.035, 0.006, 12)), VL.nhuaTrang, voi.map((p) => maTran(p.clone().add(V(0, -0.05, 0))))));
  const non = banSao(dungChung('nonPhun', () => { const g = new THREE.ConeGeometry(0.3, 0.12, 20, 1, true); return g; }), VL.phun, voi.map((p) => maTran(p.clone().add(V(0, -0.1, 0)))), { bong: false });
  pp.add(non);
  hoatAnh.nonPhun = non;
  dangKy('thap-phanphoi', pp, { ten: 'Ống phân phối và vòi phun', cha: 'thap', chucNang: 'Nước nóng từ đường cấp lên đỉnh vào ống góp, chia ra 5 ống nhánh và 25 vòi phun, rải đều thành tia hình nón lên mặt khối đệm.' });

  // ---------- Bộ tách giọt ----------
  const tg = nhom('Bộ tách giọt');
  goc.add(tg);
  const geoLaTG = dungChung('laTachGiot', () => new THREE.BoxGeometry(2 * H - 0.1, 0.09, 0.004));
  const mtTG = [];
  const yTG = (T.yTachGiot[0] + T.yTachGiot[1]) / 2;
  for (let z = -H + 0.06; z <= H - 0.06; z += 0.06) {
    mtTG.push(maTran(V(0, yTG - 0.035, z), new THREE.Quaternion().setFromAxisAngle(TRUC.x, 0.5)));
    mtTG.push(maTran(V(0, yTG + 0.035, z), new THREE.Quaternion().setFromAxisAngle(TRUC.x, -0.5)));
  }
  tg.add(banSao(geoLaTG, VL.frpDam, mtTG, { bong: false }));
  dangKy('thap-tachgiot', tg, { ten: 'Bộ tách giọt', cha: 'thap', chucNang: 'Các lá chữ V nằm trên vùng phân phối nước, bắt các giọt nước bị gió cuốn theo và cho chảy ngược xuống, giảm thất thoát nước.' });

  // ---------- Sàn đỉnh, miệng thoát gió, quạt, động cơ, lưới bảo vệ ----------
  const quatNhom = nhom('Cụm quạt');
  goc.add(quatNhom);
  const hinhSan = new THREE.Shape([[-H, -H], [H, -H], [H, H], [-H, H]].map(([a, b]) => new THREE.Vector2(a, b)));
  const lo = new THREE.Path(); lo.absarc(0, 0, T.rQuat + 0.07, 0, Math.PI * 2, true);
  hinhSan.holes.push(lo);
  const geoSan = new THREE.ExtrudeGeometry(hinhSan, { depth: 0.04, bevelEnabled: false, curveSegments: 48 });
  geoSan.rotateX(Math.PI / 2);
  quatNhom.add(mesh(geoSan, VL.frp, { vt: V(0, T.ySan + 0.04, 0) }));
  const rOngGio = T.rQuat + 0.07;
  quatNhom.add(mesh(dungChung('ongGio', () => new THREE.CylinderGeometry(rOngGio, rOngGio, T.yMieng2 - T.ySan, 56, 1, true)), new THREE.MeshStandardMaterial({ color: '#c3ccd2', roughness: 0.55, metalness: 0.05, side: THREE.DoubleSide }), { vt: V(0, (T.yMieng2 + T.ySan) / 2 + 0.02, 0) }));
  quatNhom.add(mesh(dungChung('vanhMieng', () => { const g = new THREE.TorusGeometry(rOngGio + 0.02, 0.03, 8, 56); g.rotateX(Math.PI / 2); return g; }), VL.frpDam, { vt: V(0, T.yMieng2 + 0.02, 0) }));
  // Dầm đỡ động cơ bắc ngang miệng
  for (const z of [-0.2, 0.2]) quatNhom.add(hop(2 * rOngGio + 0.2, 0.1, 0.08, VL.khung, V(0, T.ySan + 0.09, z)));
  quatNhom.add(hop(0.5, 0.02, 0.5, VL.khung, V(0, T.ySan + 0.15, 0)));
  // Động cơ đứng có cánh tản nhiệt
  const yDC0 = T.ySan + 0.16, yDC1 = T.yQuat - 0.1;
  quatNhom.add(truTheoTruc(0.13, yDC1 - yDC0, 'y', VL.dongCo, V(0, (yDC0 + yDC1) / 2, 0), { seg: 32 }));
  const mtCanh = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    mtCanh.push(maTran(V(Math.cos(a) * 0.145, (yDC0 + yDC1) / 2, Math.sin(a) * 0.145), new THREE.Quaternion().setFromAxisAngle(TRUC.y, -a)));
  }
  quatNhom.add(banSao(dungChung('canhDCThap', () => new THREE.BoxGeometry(0.03, yDC1 - yDC0 - 0.04, 0.005)), VL.dongCo, mtCanh));
  quatNhom.add(hop(0.12, 0.12, 0.1, VL.dongCo, V(0.18, (yDC0 + yDC1) / 2, 0)));
  // Phần quay: trục, moay ơ, 6 cánh
  const quat = nhom('Cánh quạt');
  quat.position.set(0, T.yQuat, 0);
  quat.add(truTheoTruc(0.035, 0.16, 'y', VL.inox, V(0, -0.08, 0), { seg: 12 }));
  quat.add(truTheoTruc(0.18, 0.14, 'y', VL.nhom, V(0, 0, 0), { seg: 28 }));
  quat.add(mesh(dungChung('muiMayo', () => new THREE.SphereGeometry(0.18, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2)), VL.nhom, { vt: V(0, 0.07, 0) }));
  const geoCanh = geoCanhQuat(0.17, T.rQuat, 0.3, 0.5, 0.18);
  for (let i = 0; i < 6; i++) { const m = mesh(geoCanh, VL.nhom); m.rotation.y = (i / 6) * Math.PI * 2; quat.add(m); }
  quatNhom.add(quat);
  hoatAnh.quat = quat;
  // Lưới bảo vệ trên miệng thoát gió
  const luoi = nhom('Lưới bảo vệ');
  const yLuoi = T.yMieng2 + 0.05;
  for (const r of [0.35, 0.7, 1.0, rOngGio]) luoi.add(mesh(dungChung(`vongLuoi:${r}`, () => { const g = new THREE.TorusGeometry(r, 0.007, 6, 64); g.rotateX(Math.PI / 2); return g; }), VL.thep, { vt: V(0, yLuoi, 0), bong: false }));
  const mtNan = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    mtNan.push(maTran(V(Math.cos(a) * (rOngGio + 0.15) / 2, yLuoi, Math.sin(a) * (rOngGio + 0.15) / 2), new THREE.Quaternion().setFromAxisAngle(TRUC.y, -a).multiply(new THREE.Quaternion().setFromAxisAngle(TRUC.z, Math.PI / 2))));
  }
  luoi.add(banSao(dungChung('nanLuoi', () => new THREE.CylinderGeometry(0.006, 0.006, rOngGio - 0.15, 6)), VL.thep, mtNan, { bong: false }));
  quatNhom.add(luoi);
  dangKy('thap-quat', quatNhom, { ten: 'Cụm quạt hướng trục và miệng thoát gió', cha: 'thap', chucNang: 'Động cơ đứng đặt trên dầm đỡ quay trực tiếp quạt 6 cánh quanh trục thẳng đứng, hút không khí từ cửa chớp lên qua khối đệm rồi thổi ra miệng thoát gió có lưới bảo vệ.' });

  // ---------- Lan can và thang ----------
  const lc = nhom('Lan can và thang');
  goc.add(lc);
  const yS = T.ySan + 0.04;
  const cotLC = [];
  for (const u of [-H, -0.5, 0.5, H]) cotLC.push(V(u, yS, -H), V(u, yS, H), V(-H, yS, u), V(H, yS, u));
  lc.add(banSao(dungChung('cotLC', () => new THREE.CylinderGeometry(0.02, 0.02, 1.0, 8)), VL.vang, cotLC.map((p) => maTran(p.clone().add(V(0, 0.5, 0))))));
  for (const y of [0.5, 1.0]) {
    lc.add(truGiua(V(-H, yS + y, -H), V(H, yS + y, -H), 0.02, VL.vang, { seg: 8 }), truGiua(V(-H, yS + y, H), V(H, yS + y, H), 0.02, VL.vang, { seg: 8 }));
    lc.add(truGiua(V(-H, yS + y, -H), V(-H, yS + y, H), 0.02, VL.vang, { seg: 8 }), truGiua(V(H, yS + y, -H), V(H, yS + y, H), 0.02, VL.vang, { seg: 8 }));
  }
  const xT = 1.0, zT = H + 0.22;
  for (const dx of [-0.22, 0.22]) lc.add(truGiua(V(xT + dx, 0.12, zT), V(xT + dx, yS + 1.0, zT), 0.025, VL.vang, { seg: 8 }));
  const bac = [];
  for (let y = 0.4; y < yS; y += 0.3) bac.push(maTran(V(xT, y, zT)));
  lc.add(banSao(dungChung('bacThang', () => { const g = new THREE.CylinderGeometry(0.014, 0.014, 0.44, 8); g.rotateZ(Math.PI / 2); return g; }), VL.vang, bac));
  for (const y of [2.4, 2.9, 3.4, 3.9]) lc.add(mesh(dungChung('vongLong', () => { const g = new THREE.TorusGeometry(0.36, 0.012, 6, 24, Math.PI); g.rotateX(Math.PI / 2); return g; }), VL.vang, { vt: V(xT, y, zT) }));
  for (const y of [1.0, 2.0, 3.0]) lc.add(hop(0.06, 0.04, 0.22, VL.vang, V(xT - 0.22, y, H + 0.11)), hop(0.06, 0.04, 0.22, VL.vang, V(xT + 0.22, y, H + 0.11)));
  dangKy('thap-thang', lc, { ten: 'Thang leo và lan can', cha: 'thap', chucNang: 'Thang có lồng bảo vệ và lan can quanh sàn đỉnh phục vụ kiểm tra quạt, động cơ.' });

  // ---------- Đường nước bù có van phao và đường xả ----------
  const nb = nhom('Đường nước bù');
  goc.add(nb);
  const rNB = ONG.nuocBu.r;
  const tuyenBu = new TuyenOng([V(-2.3, 0.02, 0.8), V(-2.3, 1.18, 0.8), V(-1.22, 1.18, 0.8), V(-1.22, 1.0, 0.8)], 0.06);
  nb.add(mesh(geoOng(tuyenBu, rNB), VL.nuocBu || VL.thepSonSang));
  nb.add(hop(0.2, 0.02, 0.2, VL.betong, V(-2.3, 0.01, 0.8)));
  const vbBu = PK.vanBi(rNB, { mau: VL.nutDo });
  PK.datLenTuyen(vbBu.obj, tuyenBu, 0.45, TRUC.x);
  nb.add(vbBu.obj);
  const dongHoNuoc = nhom('Đồng hồ nước');
  dongHoNuoc.add(truTheoTruc(0.04, 0.16, 'x', VL.dongThau, V(0, 0, 0), { seg: 16 }), truTheoTruc(0.045, 0.03, 'y', VL.nhua, V(0, 0.05, 0), { seg: 16 }));
  PK.datLenTuyen(dongHoNuoc, tuyenBu, 0.8, TRUC.x);
  nb.add(dongHoNuoc);
  // Van phao: thân van, cần và quả phao nổi trên mặt nước
  nb.add(hop(0.07, 0.06, 0.06, VL.dongThau, V(-1.22, 0.98, 0.8)));
  const phao = nhom('Phao');
  phao.add(truGiua(V(-1.2, 0.97, 0.8), V(-0.8, T.yNuoc + 0.03, 0.8), 0.008, VL.inox, { seg: 8 }));
  phao.add(mesh(dungChung('quaPhao', () => new THREE.SphereGeometry(0.09, 20, 14)), VL.vang, { vt: V(-0.72, T.yNuoc + 0.02, 0.8) }));
  nb.add(phao);
  hoatAnh.phao = phao;
  dangKy('thap-nuocbu', nb, { ten: 'Đường nước bù và van phao', cha: 'thap', chucNang: 'Bù lượng nước mất do bay hơi, cuốn theo gió và xả đáy. Quả phao hạ xuống khi mực nước thấp thì mở van cấp, nổi lên thì đóng van.' });
  // Đường xả tràn và xả đáy về rãnh thoát sàn
  const xa = nhom('Đường xả');
  goc.add(xa);
  const tuyenXa = new TuyenOng([V(-1.2, 0.98, -1.2), V(-1.2, 0.3, -1.2), V(-2.2, 0.3, -1.2), V(-2.2, 0.04, -1.2)], 0.06);
  xa.add(mesh(geoOng(tuyenXa, 0.025), VL.thepSonSang));
  xa.add(mesh(dungChung('pheuTran', () => new THREE.CylinderGeometry(0.05, 0.025, 0.06, 16, 1, true)), VL.thepSonSang, { vt: V(-1.2, 1.0, -1.2) }));
  xa.add(truGiua(V(-0.7, T.yDay, -1.2), V(-0.7, 0.3, -1.2), 0.02, VL.thepSonSang, { seg: 10 }), truGiua(V(-0.7, 0.3, -1.2), V(-1.2, 0.3, -1.2), 0.02, VL.thepSonSang, { seg: 10 }));
  const vxa = PK.vanBi(0.02, { mau: VL.nutDo });
  vxa.obj.position.set(-0.9, 0.3, -1.2);
  vxa.obj.rotation.y = Math.PI;
  xa.add(vxa.obj);
  xa.add(hop(0.3, 0.012, 0.3, VL.thepToi, V(-2.2, 0.006, -1.2)));
  dangKy('thap-xa', xa, { ten: 'Đường xả tràn và xả đáy', cha: 'thap', chucNang: 'Ống tràn giữ mực nước không vượt mức cho phép; van xả đáy dùng để xả cặn và tháo cạn bể, nước dẫn về rãnh thoát sàn.' });

  // Hạt nước rơi và hạt không khí
  const giot = new THREE.InstancedMesh(dungChung('giotThap', () => { const g = new THREE.SphereGeometry(0.02, 6, 4); g.scale(1, 2.8, 1); return g; }), VL.giot, 520);
  giot.frustumCulled = false;
  goc.add(giot);
  hoatAnh.giot = { mesh: giot, nua: H - 0.1, yTren: T.yPhun - 0.1, yDuoi: T.yNuoc, yDem: T.yDem };
  const khi = new THREE.InstancedMesh(dungChung('muiKhi', () => { const g = new THREE.ConeGeometry(0.045, 0.14, 8); return g; }), new THREE.MeshStandardMaterial({ color: '#9fb3c2', roughness: 0.6, transparent: true, opacity: 0.85 }), 180);
  khi.frustumCulled = false;
  goc.add(khi);
  hoatAnh.khi = { mesh: khi, nua: H, yChop: T.yChop, yTren: T.yMieng2 + 0.9, rQuat: T.rQuat };

  goc.updateMatrixWorld(true);
  const tgP = (p) => p.clone().applyMatrix4(goc.matrixWorld);
  return {
    goc, hoatAnh, voThap,
    tuyenNuocBu: (() => { const d = tuyenBu.diem.map(tgP); return new TuyenOng(d, 0.06); })(),
    diemNoi: {
      ra: { p: tgP(V(0, yRa, H + 0.25)), huong: TRUC.z.clone() },
      vao: { p: tgP(V(H + 0.25, yOng, 0)), huong: TRUC.x.clone() },
    },
    vatCan: [{ ten: 'Thân tháp giải nhiệt', hop: new THREE.Box3(tgP(V(-H, 0.12, -H)), tgP(V(H, T.yMieng2, H))) }],
  };
}
