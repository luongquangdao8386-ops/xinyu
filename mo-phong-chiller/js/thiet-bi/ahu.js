// AHU (khối xử lý không khí) đại diện cho thiết bị dùng nước lạnh.
// Các khoang theo chiều gió (từ +Z về -Z): hòa trộn – lọc – dàn coil – quạt; gió cấp ra trên đỉnh khoang quạt.
// Đầu nối nước lạnh ở mặt +X. Toạ độ cục bộ: gốc ở mặt sàn dưới tâm AHU.

import * as THREE from 'three';
import { VL } from '../vat-lieu.js';
import {
  V, TRUC, mesh, nhom, truGiua, truTheoTruc, hop, geoLathe, banSao, maTran, quatTuY, geoNepGap, geoCanhCong,
  geoMatBich, dungChung, TuyenOng, geoOng,
} from '../hinh-hoc.js';
import { dangKy } from '../thanh-phan.js';
import { ONG, VI_TRI } from '../cau-hinh.js';

export const AHU = {
  x: 0.8, // nửa bề rộng
  y0: 0.24, y1: 2.14, // đáy và nóc vỏ
  z: [1.8, 1.0, 0.4, -0.4, -1.8], // ranh giới các khoang
  yQuat: 1.19, zQuat: -0.75,
  zCuaRa: -1.45, // tâm miệng gió cấp
};

export function dungAHU() {
  const A = AHU;
  const goc = nhom('AHU');
  goc.position.set(VI_TRI.ahu.x, 0, VI_TRI.ahu.z);
  dangKy('ahu', goc, {
    ten: 'AHU – khối xử lý không khí', the: 'AHU-01',
    chucNang: 'Đại diện cho phụ tải dùng nước lạnh. Quạt hút gió hồi qua bộ lọc và dàn coil; nước lạnh 7 °C trong ống coil lấy nhiệt của không khí nên gió cấp lạnh đi, nước ra ấm lên khoảng 12 °C.',
    cauTao: 'Khung nhôm định hình, vỏ tấm ghép hai lớp, cửa bảo trì có tay nắm và bản lề, chân đỡ, khoang hòa trộn có van gió, bộ lọc xếp nếp, dàn coil ống đồng cánh nhôm, khay nước ngưng và ống thoát có bẫy nước, quạt ly tâm cánh cong ngược, động cơ, đoạn ống gió cấp.',
    thongSo: 'ahu',
  });
  const voAHU = [];
  const hoatAnh = {};
  const yG = (A.y0 + A.y1) / 2, hG = A.y1 - A.y0;

  // ---------- Chân, khung và vỏ tấm ghép ----------
  const khung = nhom('Khung và vỏ');
  goc.add(khung);
  khung.add(hop(1.8, 0.1, 3.8, VL.betong, V(0, 0.05, 0)));
  const chan = [];
  for (const x of [-0.7, 0.7]) for (const z of [-1.7, -0.6, 0.6, 1.7]) chan.push(V(x, 0.12, z));
  khung.add(banSao(dungChung('chanAHU', () => new THREE.CylinderGeometry(0.03, 0.04, 0.04, 12)), VL.thep, chan.map((p) => maTran(p))));
  for (const x of [-0.74, 0.74]) khung.add(hop(0.1, 0.1, 3.6, VL.khung, V(x, 0.19, 0)));
  for (const z of A.z) khung.add(hop(1.58, 0.1, 0.08, VL.khung, V(0, 0.19, z)));
  // Thanh nhôm định hình theo các cạnh
  const geoThanh = dungChung('thanhNhom', () => new THREE.BoxGeometry(1, 1, 1));
  const mt = [];
  const s = 0.045;
  for (const z of A.z) for (const [x, y] of [[-A.x, A.y0], [A.x, A.y0], [-A.x, A.y1], [A.x, A.y1]]) {
    mt.push(maTran(V(x, yG, z), undefined, V(s, hG, s)));
    mt.push(maTran(V(0, y, z), undefined, V(2 * A.x, s, s)));
  }
  for (const [x, y] of [[-A.x, A.y0], [A.x, A.y0], [-A.x, A.y1], [A.x, A.y1]]) mt.push(maTran(V(x, y, 0), undefined, V(s, s, A.z[0] - A.z[4])));
  khung.add(banSao(geoThanh, VL.nhom, mt));
  // Tấm vỏ: nóc và hai bên theo từng khoang, hai đầu
  const tam = (w, h, d, p) => hop(w, h, d, VL.tamAHU, p);
  const dsCua = [];
  for (let i = 0; i < 4; i++) {
    const z0 = A.z[i], z1 = A.z[i + 1], zc = (z0 + z1) / 2, dz = z0 - z1 - s;
    const noc = tam(2 * A.x - s, 0.04, dz, V(0, A.y1 - 0.01, zc));
    const day = tam(2 * A.x - s, 0.04, dz, V(0, A.y0 + 0.01, zc));
    const trai = tam(0.04, hG - s, dz, V(-A.x + 0.01, yG, zc));
    const phai = tam(0.04, hG - s, dz, V(A.x - 0.01, yG, zc));
    khung.add(noc, day, trai, phai);
    voAHU.push(noc, phai);
    if (i === 1 || i === 3) dsCua.push({ phai, zc, dz });
  }
  const dau1 = tam(2 * A.x - s, hG - s, 0.04, V(0, yG, A.z[4] + 0.01));
  khung.add(dau1);
  // Mặt đầu hồi gió có khung van gió
  const dau0 = nhom('Mặt đầu hồi gió');
  dau0.add(tam(2 * A.x - s, 0.3, 0.04, V(0, A.y1 - 0.17, A.z[0] - 0.01)), tam(2 * A.x - s, 0.3, 0.04, V(0, A.y0 + 0.17, A.z[0] - 0.01)));
  dau0.add(tam(0.18, hG - 0.64, 0.04, V(-A.x + 0.11, yG, A.z[0] - 0.01)), tam(0.18, hG - 0.64, 0.04, V(A.x - 0.11, yG, A.z[0] - 0.01)));
  khung.add(dau0);
  dangKy('ahu-vo', khung, { ten: 'Khung, vỏ tấm ghép và chân đỡ', cha: 'ahu', chucNang: 'Khung nhôm định hình ghép các tấm vỏ hai lớp có cách nhiệt ở giữa; khung đế thép đặt trên chân chỉnh cao độ.' });

  // Cửa bảo trì: tay nắm và bản lề (khoang lọc và khoang quạt)
  const cuaNhom = nhom('Cửa bảo trì');
  goc.add(cuaNhom);
  for (const { zc, dz } of dsCua) {
    const cua = nhom('Cửa');
    cua.add(hop(0.02, hG - 0.22, dz - 0.16, VL.tamAHU, V(A.x + 0.02, yG, zc)));
    for (const dy of [-0.35, 0.35]) {
      cua.add(hop(0.05, 0.04, 0.04, VL.nhua, V(A.x + 0.05, yG + dy, zc - dz / 2 + 0.16)));
      cua.add(hop(0.025, 0.025, 0.14, VL.nhua, V(A.x + 0.075, yG + dy, zc - dz / 2 + 0.21)));
    }
    for (const dy of [-0.6, 0, 0.6]) cua.add(truTheoTruc(0.014, 0.08, 'y', VL.nhom, V(A.x + 0.035, yG + dy, zc + dz / 2 - 0.05), { seg: 8 }));
    cuaNhom.add(cua);
    voAHU.push(cua);
  }
  dangKy('ahu-cua', cuaNhom, { ten: 'Cửa bảo trì', cha: 'ahu', chucNang: 'Cửa có bản lề và tay nắm khóa cam để thay bộ lọc, vệ sinh khay nước ngưng và kiểm tra quạt.' });

  // ---------- Khoang hòa trộn: van gió hồi và gió tươi ----------
  const vanGio = nhom('Van gió');
  goc.add(vanGio);
  const geoLaGio = dungChung('laVanGio', () => new THREE.BoxGeometry(1.2, 0.012, 0.13));
  const laHoi = [];
  for (let i = 0; i < 9; i++) laHoi.push(V(0, A.y0 + 0.4 + i * 0.14, A.z[0] + 0.03));
  const imHoi = banSao(geoLaGio, VL.nhom, laHoi.map((p) => maTran(p)));
  vanGio.add(imHoi);
  hoatAnh.laVanGio = { mesh: imHoi, diem: laHoi };
  // Ống gió hồi ngắn với khớp mềm
  vanGio.add(hop(1.26, 0.04, 0.5, VL.nhom, V(0, A.y0 + 1.6 + 0.02, A.z[0] + 0.33)), hop(1.26, 0.04, 0.5, VL.nhom, V(0, A.y0 + 0.3 - 0.02, A.z[0] + 0.33)));
  vanGio.add(hop(0.04, 1.3, 0.5, VL.nhom, V(-0.63, yG, A.z[0] + 0.33)), hop(0.04, 1.3, 0.5, VL.nhom, V(0.63, yG, A.z[0] + 0.33)));
  // Cửa gió tươi trên nóc
  vanGio.add(hop(0.8, 0.12, 0.45, VL.nhom, V(0, A.y1 + 0.06, 1.4)));
  dangKy('ahu-vangio', vanGio, { ten: 'Khoang hòa trộn và van gió', cha: 'ahu', chucNang: 'Gió hồi từ phòng và gió tươi gặp nhau tại khoang hòa trộn. Các lá van gió mở theo lệnh chạy quạt.' });

  // ---------- Bộ lọc ----------
  const loc = nhom('Bộ lọc');
  goc.add(loc);
  const geoLoc = dungChung('locXep', () => geoNepGap(0.66, 0.78, 0.07, 14));
  const oLoc = [];
  for (const x of [-0.36, 0.36]) for (const y of [yG - 0.42, yG + 0.42]) oLoc.push(V(x, y, 0.7));
  loc.add(banSao(geoLoc, VL.locXep, oLoc.map((p) => maTran(p)), { bong: false }));
  for (const x of [-0.72, 0, 0.72]) loc.add(hop(0.03, hG - 0.1, 0.1, VL.nhom, V(x, yG, 0.7)));
  for (const y of [A.y0 + 0.05, yG, A.y1 - 0.05]) loc.add(hop(1.5, 0.03, 0.1, VL.nhom, V(0, y, 0.7)));
  dangKy('ahu-loc', loc, { ten: 'Bộ lọc không khí', cha: 'ahu', chucNang: 'Tấm lọc xếp nếp giữ bụi trước khi gió vào dàn coil, giúp coil sạch và truyền nhiệt tốt.' });

  // ---------- Dàn coil: ống đồng, lá nhôm, ống góp, đầu nối ----------
  const coil = nhom('Dàn coil');
  goc.add(coil);
  const yC0 = 0.52, yC1 = 1.86;
  const soLa = 90;
  const mtLa = [];
  for (let i = 0; i < soLa; i++) mtLa.push(maTran(V(-0.68 + (1.36 * i) / (soLa - 1), (yC0 + yC1) / 2, 0)));
  coil.add(banSao(dungChung('laCoil', () => new THREE.BoxGeometry(0.0016, yC1 - yC0, 0.3)), VL.canhTan, mtLa, { bong: false }));
  const hangZ = [-0.125, -0.075, -0.025, 0.025, 0.075, 0.125];
  const hangY = [];
  for (let y = yC0 + 0.06; y < yC1 - 0.03; y += 0.1) hangY.push(y);
  const mtOng = [];
  for (const z of hangZ) for (const y of hangY) mtOng.push(maTran(V(0, y, z)));
  coil.add(banSao(dungChung('ongCoil', () => { const g = new THREE.CylinderGeometry(0.008, 0.008, 1.46, 8); g.rotateZ(Math.PI / 2); return g; }), VL.dong, mtOng, { bong: false }));
  // Co chữ U hai đầu (nối ống thành đường rắn)
  const geoCoU = dungChung('coU', () => { const g = new THREE.TorusGeometry(0.05, 0.008, 6, 12, Math.PI); g.rotateY(Math.PI / 2); return g; });
  const mtU = [];
  for (const z of hangZ) for (let k = 0; k + 1 < hangY.length; k += 2) {
    const yc = (hangY[k] + hangY[k + 1]) / 2;
    mtU.push(maTran(V(-0.73, yc, z), new THREE.Quaternion().setFromAxisAngle(TRUC.z, Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(TRUC.y, Math.PI / 2))));
    if (k + 2 < hangY.length) mtU.push(maTran(V(0.73, yc + 0.1, z), new THREE.Quaternion().setFromAxisAngle(TRUC.z, -Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(TRUC.y, Math.PI / 2))));
  }
  coil.add(banSao(geoCoU, VL.dong, mtU, { bong: false }));
  for (const y of [yC0 - 0.02, yC1 + 0.02]) coil.add(hop(1.5, 0.04, 0.34, VL.thepSonSang, V(0, y, 0)));
  for (const x of [-0.75, 0.75]) coil.add(hop(0.02, yC1 - yC0 + 0.08, 0.34, VL.thepSonSang, V(x, (yC0 + yC1) / 2, 0)));
  // Ống góp cấp (phía gió ra, -Z, vào ở dưới) và hồi (phía gió vào, +Z, ra ở trên)
  const rN = ONG.nuocLanh.r;
  const yVao = 0.62, yRa = 1.8, zVao = -0.12, zRa = 0.12;
  coil.add(truGiua(V(0.74, yC0, zVao), V(0.74, yC1, zVao), 0.055, VL.dong, { seg: 16 }), truGiua(V(0.74, yC0, zRa), V(0.74, yC1, zRa), 0.055, VL.dong, { seg: 16 }));
  for (const y of hangY) {
    coil.add(truGiua(V(0.69, y, zVao + 0.04), V(0.74, y, zVao), 0.008, VL.dong, { seg: 6 }));
    coil.add(truGiua(V(0.69, y, zRa - 0.04), V(0.74, y, zRa), 0.008, VL.dong, { seg: 6 }));
  }
  coil.add(truGiua(V(0.74, yVao, zVao), V(1.1 - 0.022, yVao, zVao), rN, VL.thepSon, { seg: 24 }));
  coil.add(truGiua(V(0.74, yRa, zRa), V(1.1 - 0.022, yRa, zRa), rN, VL.thepSon, { seg: 24 }));
  for (const [y, z] of [[yVao, zVao], [yRa, zRa]]) {
    const b = mesh(geoMatBich(rN, rN + 0.06, 0.022), VL.thepSon, { vt: V(1.1, y, z) });
    b.quaternion.copy(quatTuY(TRUC.x));
    coil.add(b);
  }
  // Van xả khí trên ống góp và nút xả nước dưới đáy
  coil.add(truGiua(V(0.74, yC1, zRa), V(0.74, yC1 + 0.12, zRa), 0.012, VL.dongThau, { seg: 8 }));
  coil.add(truGiua(V(0.74, yC0, zVao), V(0.74, yC0 - 0.1, zVao), 0.012, VL.dongThau, { seg: 8 }));
  dangKy('ahu-coil', coil, { ten: 'Dàn coil nước lạnh', cha: 'ahu', chucNang: 'Sáu hàng ống đồng xuyên qua lá nhôm. Nước lạnh vào ống góp dưới ở phía gió ra, đi ngược chiều gió và ra ống góp trên ở phía gió vào (trao đổi nhiệt ngược dòng).' });

  // ---------- Khay nước ngưng và đường thoát có bẫy nước ----------
  const khay = nhom('Khay nước ngưng');
  goc.add(khay);
  khay.add(hop(1.5, 0.012, 0.9, VL.inox, V(0, 0.3, 0)));
  khay.add(hop(1.5, 0.08, 0.012, VL.inox, V(0, 0.34, -0.45)), hop(1.5, 0.08, 0.012, VL.inox, V(0, 0.34, 0.45)));
  khay.add(hop(0.012, 0.08, 0.9, VL.inox, V(-0.75, 0.34, 0)), hop(0.012, 0.08, 0.9, VL.inox, V(0.75, 0.34, 0)));
  const nuocKhay = hop(1.48, 0.012, 0.88, VL.nuoc, V(0, 0.32, 0));
  nuocKhay.castShadow = false;
  khay.add(nuocKhay);
  const tuyenThoat = new TuyenOng([V(0.74, 0.33, 0.3), V(0.98, 0.33, 0.3), V(0.98, 0.15, 0.3), V(1.12, 0.15, 0.3), V(1.12, 0.3, 0.3), V(1.26, 0.3, 0.3), V(1.26, 0.03, 0.3)], 0.04);
  khay.add(mesh(geoOng(tuyenThoat, 0.016), VL.nhuaTrang));
  khay.add(hop(0.25, 0.01, 0.25, VL.thepToi, V(1.26, 0.005, 0.3)));
  const giot = new THREE.InstancedMesh(dungChung('giotCoil', () => { const g = new THREE.SphereGeometry(0.008, 6, 4); g.scale(1, 2, 1); return g; }), VL.giot, 40);
  giot.frustumCulled = false;
  khay.add(giot);
  hoatAnh.giotNgung = { mesh: giot, yTren: yC0, yDuoi: 0.32 };
  dangKy('ahu-khay', khay, { ten: 'Khay nước ngưng và đường thoát nước', cha: 'ahu', chucNang: 'Hơi ẩm trong không khí ngưng thành nước trên lá coil lạnh, nhỏ xuống khay inox và chảy qua bẫy nước chữ U ra rãnh thoát sàn. Bẫy nước ngăn gió lọt qua ống thoát.' });

  // ---------- Quạt, động cơ, đoạn ống gió cấp ----------
  const quatNhom = nhom('Quạt và động cơ');
  goc.add(quatNhom);
  // Vách ngăn có miệng hút loe
  const hinhVach = new THREE.Shape([[-A.x + 0.03, A.y0 + 0.03], [A.x - 0.03, A.y0 + 0.03], [A.x - 0.03, A.y1 - 0.03], [-A.x + 0.03, A.y1 - 0.03]].map(([a, b]) => new THREE.Vector2(a, b)));
  const loVach = new THREE.Path(); loVach.absarc(0, A.yQuat, 0.34, 0, Math.PI * 2, true);
  hinhVach.holes.push(loVach);
  quatNhom.add(mesh(new THREE.ExtrudeGeometry(hinhVach, { depth: 0.02, bevelEnabled: false, curveSegments: 32 }), VL.tamAHU, { vt: V(0, 0, -0.47) }));
  quatNhom.add(mesh(dungChung('loeHut', () => {
    const pts = [];
    for (let k = 0; k <= 10; k++) { const t = (k / 10) * Math.PI / 2; pts.push([0.3 + 0.1 * (1 - Math.sin(t)), -0.1 * Math.cos(t) + 0.1]); }
    const g = geoLathe(pts, 40, false);
    g.rotateX(-Math.PI / 2);
    return g;
  }), new THREE.MeshStandardMaterial({ color: '#c9ced3', roughness: 0.35, metalness: 0.9, side: THREE.DoubleSide }), { vt: V(0, A.yQuat, -0.48) }));
  // Bánh quạt cánh cong ngược (quay quanh trục Z)
  const banh = nhom('Bánh quạt');
  banh.position.set(0, A.yQuat, A.zQuat);
  const trong = nhom();
  trong.add(mesh(dungChung('diaQuat', () => new THREE.CylinderGeometry(0.43, 0.43, 0.012, 40)), VL.thepSonSang, { vt: V(0, -0.15, 0) }));
  trong.add(mesh(dungChung('vanhQuat', () => geoLathe([[0.31, 0.004], [0.43, -0.004], [0.43, 0.004], [0.31, 0.012], [0.31, 0.004]], 40)), VL.thepSonSang, { vt: V(0, 0.14, 0) }));
  const geoCQ = geoCanhCong(0.2, 0.42, 0.007, 0.29, 0.75);
  for (let i = 0; i < 10; i++) { const m = mesh(geoCQ, VL.thepSonSang, { vt: V(0, -0.145, 0) }); m.rotation.y = (i / 10) * Math.PI * 2; trong.add(m); }
  trong.add(mesh(dungChung('mayoQuat', () => new THREE.CylinderGeometry(0.06, 0.06, 0.12, 16)), VL.thepToi, { vt: V(0, -0.2, 0) }));
  trong.rotation.x = Math.PI / 2; // trục Y -> +Z: vành trước có miệng hút hướng về phía coil
  banh.add(trong);
  quatNhom.add(banh);
  hoatAnh.banhQuat = banh;
  // Động cơ, trục, khung đế và lò xo giảm chấn
  const zDC0 = -1.0, zDC1 = -1.45;
  quatNhom.add(truGiua(V(0, A.yQuat, A.zQuat - 0.2), V(0, A.yQuat, zDC0), 0.025, VL.inox, { seg: 12 }));
  quatNhom.add(truGiua(V(0, A.yQuat, zDC0), V(0, A.yQuat, zDC1), 0.14, VL.dongCo, { seg: 32 }));
  const mtC = [];
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    if (Math.sin(a) < -0.8) continue;
    mtC.push(maTran(V(Math.cos(a) * 0.155, A.yQuat + Math.sin(a) * 0.155, (zDC0 + zDC1) / 2), new THREE.Quaternion().setFromAxisAngle(TRUC.z, a - Math.PI / 2)));
  }
  quatNhom.add(banSao(dungChung('canhDCAHU', () => new THREE.BoxGeometry(0.006, 0.032, Math.abs(zDC1 - zDC0) - 0.04)), VL.dongCo, mtC));
  quatNhom.add(hop(0.12, 0.1, 0.14, VL.dongCo, V(0.19, A.yQuat + 0.05, -1.2)));
  quatNhom.add(hop(0.3, A.yQuat - 0.14 - 0.45, 0.3, VL.khung, V(0, 0.45 + (A.yQuat - 0.14 - 0.45) / 2, -1.22)));
  quatNhom.add(hop(0.9, 0.06, 1.1, VL.khung, V(0, 0.42, -1.1)));
  for (const [x, z] of [[-0.38, -0.62], [0.38, -0.62], [-0.38, -1.58], [0.38, -1.58]]) {
    const lx = nhom('Lò xo');
    for (let k = 0; k < 5; k++) lx.add(mesh(dungChung('voLoXo', () => { const g = new THREE.TorusGeometry(0.04, 0.007, 6, 16); g.rotateX(Math.PI / 2); return g; }), VL.vang, { vt: V(0, 0.29 + k * 0.022, 0) }));
    lx.position.set(x, 0, z);
    quatNhom.add(lx);
  }
  // Khớp mềm và ống gió cấp
  const ongGio = nhom('Ống gió cấp');
  const z0 = A.zCuaRa;
  ongGio.add(hop(1.0, 0.12, 0.5, VL.vai, V(0, A.y1 + 0.06, z0)));
  const thanOng = (w, h, d, p) => hop(w, h, d, VL.nhom, p);
  ongGio.add(thanOng(1.02, 0.6, 0.52, V(0, A.y1 + 0.42, z0)));
  ongGio.add(thanOng(1.02, 0.52, 0.52, V(-0.1, 2.98, z0)));
  ongGio.add(thanOng(1.6, 0.52, 0.52, V(-1.1, 2.98, z0)));
  ongGio.add(hop(0.02, 0.5, 0.5, VL.thepToi, V(-1.91, 2.98, z0)));
  for (const x of [-0.4, -1.0, -1.6]) ongGio.add(hop(0.04, 0.56, 0.56, VL.nhom, V(x, 2.98, z0)));
  quatNhom.add(ongGio);
  dangKy('ahu-quat', quatNhom, { ten: 'Quạt ly tâm, động cơ và đoạn ống gió', cha: 'ahu', chucNang: 'Quạt cánh cong ngược hút gió qua miệng loe, đẩy gió ra khoang quạt và lên ống gió cấp qua khớp nối mềm bằng vải. Cụm quạt – động cơ đặt trên lò xo giảm chấn.' });
  dangKy('ahu-onggio', ongGio, { ten: 'Đoạn ống gió cấp', cha: 'ahu-quat', chucNang: 'Ống gió tôn mạ kẽm dẫn gió lạnh tới các phòng; khớp mềm ngăn rung từ AHU truyền sang ống gió.' });

  // Hạt không khí đi qua AHU
  const hat = new THREE.InstancedMesh(dungChung('hatKhi', () => new THREE.SphereGeometry(0.03, 8, 6)), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9 }), 140);
  hat.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(140 * 3), 3);
  hat.frustumCulled = false;
  goc.add(hat);
  hoatAnh.khi = { mesh: hat, A };

  goc.updateMatrixWorld(true);
  const tgP = (p) => p.clone().applyMatrix4(goc.matrixWorld);
  return {
    goc, hoatAnh, voAHU,
    diemNoi: { vao: { p: tgP(V(1.1, yVao, zVao)), huong: TRUC.x.clone() }, ra: { p: tgP(V(1.1, yRa, zRa)), huong: TRUC.x.clone() } },
    vatCan: [{ ten: 'Vỏ AHU', hop: new THREE.Box3(tgP(V(-A.x, A.y0, A.z[4])), tgP(V(A.x, A.y1 + 0.9, A.z[0] + 0.6))) }],
  };
}
