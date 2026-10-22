// Bơm ly tâm một cửa hút (end-suction) trên bệ: thân xoắn ốc, bánh công tác, giá ổ trục, khớp nối có nắp che,
// động cơ có cánh tản nhiệt, bệ máy, bu lông neo. Toạ độ cục bộ: trục bơm theo +X (thân bơm → động cơ),
// cửa hút hướng -X, cửa đẩy hướng +Y; gốc ở mặt sàn dưới tâm thân bơm.

import * as THREE from 'three';
import { VL, vlCat, khaiBaoMatCat } from '../vat-lieu.js';
import {
  V, TRUC, mesh, nhom, truGiua, truTheoTruc, hop, geoLathe, vongBuLong, buLongTaiDiem, banSao, maTran, quatTuY,
  geoCanhCong, geoMatBich, dungChung,
} from '../hinh-hoc.js';
import { dangKy } from '../thanh-phan.js';
import { CAO_DO } from '../cau-hinh.js';

const YS = CAO_DO.tamTrucBom; // cao độ tâm trục so với sàn
const NEN = 0.27; // mặt trên bệ máy (bệ bê tông 0,15 + khung thép 0,12)

// Vỏ xoắn ốc: hình 2D trong mặt phẳng (z, y) quanh tâm trục, cổ đẩy hướng lên.
function geoVoXoan(r0, r1, rong, rOng) {
  return dungChung(`voXoan:${r0}:${r1}:${rong}`, () => {
    const s = new THREE.Shape();
    const n = 48;
    const goc0 = 0.22; // bắt đầu ngay bên phải cổ đẩy
    for (let i = 0; i <= n; i++) {
      const t = goc0 + (i / n) * (Math.PI * 2 - goc0 - 0.12);
      const r = r0 + (r1 - r0) * (t / (Math.PI * 2));
      const phi = Math.PI / 2 - t; // quay theo chiều kim đồng hồ khi nhìn từ phía hút
      const p = [r * Math.cos(phi), r * Math.sin(phi)];
      if (i === 0) s.moveTo(...p); else s.lineTo(...p);
    }
    const nc = rOng * 1.05;
    s.lineTo(-nc, r1 + 0.02);
    s.lineTo(-nc, r1 + 0.09);
    s.lineTo(nc, r1 + 0.09);
    s.lineTo(nc, r0 * 0.98);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: rong, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 4 });
    g.translate(0, 0, -rong / 2);
    g.rotateY(Math.PI / 2); // trục đùn -> X
    return g;
  });
}

export function dungBom({ ma, ten, the, viTri, rOng, mauDongCo = VL.dongCo, chucNang }) {
  const goc = nhom(ten);
  goc.position.set(viTri.x, 0, viTri.z);
  goc.rotation.y = viTri.xoay;
  goc.updateMatrixWorld(true);
  dangKy(ma, goc, {
    ten, the, chucNang,
    cauTao: 'Thân bơm gang dạng xoắn ốc, bánh công tác kín 6 cánh cong ngược, giá ổ trục, khớp nối đàn hồi có nắp che, động cơ 3 pha có cánh tản nhiệt và quạt làm mát, bệ thép trên bệ bê tông, bu lông neo.',
    thongSo: ma,
  });

  // Mặt cắt: bỏ phần phía +X thế giới (phía người xem) và nửa phía cửa hút của thân bơm.
  const khoa = `cat-${ma}`;
  const nCua = V(1, 0, 0).applyQuaternion(goc.quaternion); // pháp tuyến: phía âm là phía cửa hút
  const p0 = V(0.012, 0, 0).applyMatrix4(goc.matrixWorld);
  khaiBaoMatCat(khoa, [new THREE.Plane(V(-1, 0, 0), viTri.x), new THREE.Plane(nCua, -nCua.dot(p0))], true);
  const c = (vl) => vlCat(vl, khoa);

  const r0 = 0.15 + rOng * 0.25;
  const r1 = r0 + 0.07 + rOng * 0.2;
  const rong = 0.13;

  // Bệ bê tông và bệ máy thép
  const be = nhom('Bệ máy');
  be.add(hop(2.1, 0.15, 0.8, VL.betong, V(0.6, 0.075, 0)));
  const hinhC = new THREE.Shape([[-0.04, -0.06], [0.04, -0.06], [0.04, -0.05], [-0.032, -0.05], [-0.032, 0.05], [0.04, 0.05], [0.04, 0.06], [-0.04, 0.06]].map(([a, b]) => new THREE.Vector2(a, b)));
  const geoRay = dungChung('rayBom', () => { const g = new THREE.ExtrudeGeometry(hinhC, { depth: 1.9, bevelEnabled: false }); g.translate(0, 0, -0.95); g.rotateY(Math.PI / 2); return g; });
  for (const z of [-0.24, 0.24]) { const m = mesh(geoRay, VL.khung, { vt: V(0.65, 0.21, z) }); m.rotation.x = z > 0 ? Math.PI : 0; be.add(m); }
  for (const x of [-0.3, 1.6]) be.add(hop(0.012, 0.12, 0.56, VL.khung, V(x, 0.21, 0)));
  be.add(hop(0.36, 0.012, 0.56, VL.khung, V(0.0, NEN - 0.006, 0)), hop(0.7, 0.012, 0.56, VL.khung, V(1.12, NEN - 0.006, 0)));
  const neo = [];
  for (const x of [-0.2, 0.65, 1.5]) for (const z of [-0.33, 0.33]) neo.push(V(x, 0.15, z));
  be.add(buLongTaiDiem(neo, 'y', { co: 0.012, dai: 0.05, vl: VL.thep, mu: true }));
  be.add(banSao(dungChung('banNeo', () => new THREE.BoxGeometry(0.1, 0.01, 0.1)), VL.khung, neo.map((p) => maTran(p.clone().add(V(0, -0.005, 0))))));
  goc.add(be);
  dangKy(`${ma}-be`, be, { ten: 'Bệ máy, chân đế và bu lông neo', cha: ma, chucNang: 'Khung thép chữ C giữ thẳng hàng bơm và động cơ, bắt vào bệ bê tông bằng bu lông neo.' });

  // Thân bơm (vỏ xoắn ốc), cửa hút, cửa đẩy, nắp sau
  const than = nhom('Thân bơm');
  than.add(mesh(geoVoXoan(r0, r1, rong, rOng), c(VL.vanXanh), { vt: V(0, YS, 0) }));
  than.add(truGiua(V(-0.06, YS, 0), V(-0.3 + 0.03, YS, 0), rOng * 1.05, c(VL.vanXanh), { seg: 28 }));
  const yDay = YS + r1 + 0.11;
  than.add(truGiua(V(0, YS + r1 + 0.06, 0), V(0, yDay - 0.02, 0), rOng * 1.02, c(VL.vanXanh), { seg: 28 }));
  const bichHut = mesh(geoMatBich(rOng, rOng + 0.06, 0.024), VL.vanXanh, { vt: V(-0.3, YS, 0) });
  bichHut.quaternion.copy(quatTuY(V(-1, 0, 0)));
  const bichDay = mesh(geoMatBich(rOng, rOng + 0.06, 0.024), VL.vanXanh, { vt: V(0, yDay, 0) });
  than.add(bichHut, bichDay);
  than.add(mesh(dungChung(`napSau:${r0}`, () => { const g = geoLathe([[0.05, 0], [r0 + 0.02, 0], [r0 + 0.02, 0.03], [0.13, 0.09], [0.1, 0.14], [0.05, 0.14]], 40); g.rotateZ(-Math.PI / 2); return g; }), c(VL.vanXanh), { vt: V(0.08, YS, 0) }));
  than.add(vongBuLong({ tam: V(0.095, YS, 0), truc: 'x', rVong: r0 - 0.005, n: 10, co: 0.01, dai: 0.06, vl: c(VL.thep) }));
  // Chân thân bơm
  than.add(hop(0.12, YS - r1 - NEN + 0.02, 0.36, VL.vanXanh, V(0, NEN + (YS - r1 - NEN + 0.02) / 2, 0)));
  // Nút xả khí, nút xả đáy, cổng đo áp
  than.add(truTheoTruc(0.01, 0.03, 'y', VL.dongThau, V(0.03, YS + r1 + 0.02, rOng * 1.2), { seg: 6 }));
  than.add(truTheoTruc(0.012, 0.03, 'y', VL.dongThau, V(0, YS - r1 - 0.03, 0.06), { seg: 6 }));
  goc.add(than);
  dangKy(`${ma}-than`, than, { ten: 'Thân bơm và cửa hút, cửa đẩy', cha: ma, chucNang: 'Vỏ xoắn ốc gom nước văng ra từ bánh công tác, đổi động năng thành áp suất rồi dẫn ra cửa đẩy phía trên. Cửa hút đồng trục với bánh công tác.' });

  // Phần quay: trục, bánh công tác, khớp nối
  const quay = nhom('Phần quay');
  quay.position.set(0, YS, 0);
  const banh = nhom('Bánh công tác');
  const trong = nhom();
  trong.add(mesh(dungChung(`dia:${r0}`, () => new THREE.CylinderGeometry(r0 - 0.012, r0 - 0.012, 0.008, 40)), VL.dongThau, { vt: V(0, 0.032, 0) }));
  const tamTruoc = mesh(dungChung(`vanhTruoc:${r0}`, () => geoLathe([[0.07, -0.004], [r0 - 0.012, -0.004], [r0 - 0.012, 0.004], [0.07, 0.004], [0.07, -0.004]], 40)), c(VL.dongThau), { vt: V(0, -0.032, 0) });
  trong.add(tamTruoc);
  const geoCanh = geoCanhCong(0.05, r0 - 0.016, 0.008, 0.064, 1.1);
  for (let i = 0; i < 6; i++) { const m = mesh(geoCanh, VL.dongThau, { vt: V(0, -0.032, 0) }); m.rotation.y = (i / 6) * Math.PI * 2; trong.add(m); }
  trong.add(mesh(dungChung('mayo', () => new THREE.CylinderGeometry(0.045, 0.05, 0.08, 20)), VL.dongThau));
  trong.rotation.z = -Math.PI / 2; // trục Y -> +X: vành trước có miệng hút nằm phía -X
  banh.add(trong);
  quay.add(banh);
  quay.add(truTheoTruc(0.028, 0.7, 'x', VL.inox, V(0.31, 0, 0), { seg: 16 }));
  // Khớp nối đàn hồi: hai nửa may ơ và đệm cao su
  const khop = nhom('Khớp nối');
  khop.add(truTheoTruc(0.075, 0.05, 'x', VL.thepToi, V(0.645, 0, 0), { seg: 24 }));
  khop.add(truTheoTruc(0.075, 0.05, 'x', VL.thepToi, V(0.715, 0, 0), { seg: 24 }));
  khop.add(truTheoTruc(0.062, 0.02, 'x', VL.caoSu, V(0.68, 0, 0), { seg: 24 }));
  khop.add(banSao(dungChung('chotKhop', () => { const g = new THREE.CylinderGeometry(0.009, 0.009, 0.1, 8); g.rotateZ(Math.PI / 2); return g; }), VL.thep,
    [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return maTran(V(0.68, Math.cos(a) * 0.055, Math.sin(a) * 0.055)); })));
  khop.add(hop(0.13, 0.012, 0.03, VL.vang, V(0.68, 0.078, 0)));
  quay.add(khop);
  goc.add(quay);
  dangKy(`${ma}-banh`, banh, { ten: 'Bánh công tác', cha: ma, chucNang: 'Sáu cánh cong ngược quay cùng trục, hút nước vào ở tâm và văng ra mép ngoài, tạo cột áp cho mạch.' });
  dangKy(`${ma}-khop`, khop, { ten: 'Khớp nối', cha: ma, chucNang: 'Truyền mô-men từ trục động cơ sang trục bơm; đệm cao su bù sai lệch đồng tâm nhỏ và giảm va đập khi khởi động.' });

  // Giá ổ trục và chân đỡ
  const gia = nhom('Giá ổ trục');
  gia.add(mesh(dungChung('giaO', () => { const g = geoLathe([[0.03, 0], [0.13, 0], [0.13, 0.03], [0.095, 0.1], [0.095, 0.44], [0.07, 0.46], [0.03, 0.46]], 32); g.rotateZ(-Math.PI / 2); return g; }), VL.vanXanh, { vt: V(0.15, YS, 0) }));
  gia.add(hop(0.12, YS - NEN - 0.09, 0.28, VL.vanXanh, V(0.45, NEN + (YS - NEN - 0.09) / 2, 0)));
  gia.add(banSao(dungChung('ganGia', () => new THREE.BoxGeometry(0.3, 0.014, 0.014)), VL.vanXanh, [0, 1, 2, 3].map((i) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return maTran(V(0.42, YS + Math.cos(a) * 0.098, Math.sin(a) * 0.098));
  })));
  goc.add(gia);

  // Nắp che khớp nối (lưới đục lỗ, nhìn xuyên thấy khớp quay)
  const nap = nhom('Nắp che khớp nối');
  nap.add(mesh(dungChung('napKhop', () => { const g = new THREE.CylinderGeometry(0.125, 0.125, 0.22, 28, 1, true, -Math.PI * 1.12, Math.PI * 1.24); g.rotateZ(-Math.PI / 2); return g; }), VL.luoiChe, { vt: V(0.68, YS, 0) }));
  for (const x of [0.57, 0.79]) nap.add(mesh(dungChung('vanhNap', () => { const g = new THREE.TorusGeometry(0.125, 0.006, 6, 28, Math.PI * 1.24); g.rotateZ(-Math.PI * 0.12); g.rotateY(Math.PI / 2); return g; }), VL.vang, { vt: V(x, YS, 0) }));
  nap.add(hop(0.05, YS - NEN - 0.05, 0.03, VL.vang, V(0.68, NEN + (YS - NEN - 0.05) / 2, 0.12)), hop(0.05, YS - NEN - 0.05, 0.03, VL.vang, V(0.68, NEN + (YS - NEN - 0.05) / 2, -0.12)));
  goc.add(nap);
  dangKy(`${ma}-nap`, nap, { ten: 'Nắp che khớp nối', cha: ma, chucNang: 'Tấm thép đục lỗ sơn vàng che phần quay để bảo đảm an toàn, vẫn nhìn được khớp nối khi kiểm tra.' });

  // Động cơ: thân có cánh tản nhiệt, nắp quạt, hộp đấu dây, chân và bệ kê
  const dc = nhom('Động cơ');
  const x0 = 0.82, x1 = 1.4, rDC = 0.155;
  dc.add(truTheoTruc(rDC, x1 - x0, 'x', mauDongCo, V((x0 + x1) / 2, YS, 0), { seg: 36 }));
  const geoCanh2 = dungChung('canhDC', () => new THREE.BoxGeometry(x1 - x0 - 0.04, 0.034, 0.006));
  const mt = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    if (-Math.sin(a) < -0.85) continue; // chừa chỗ chân động cơ
    const q = new THREE.Quaternion().setFromAxisAngle(TRUC.x, a + Math.PI / 2); // trục y của lá tản nhiệt hướng ra ngoài
    mt.push(maTran(V((x0 + x1) / 2, YS - Math.sin(a) * (rDC + 0.016), Math.cos(a) * (rDC + 0.016)), q));
  }
  dc.add(banSao(geoCanh2, mauDongCo, mt));
  dc.add(mesh(dungChung('napDCtruoc', () => { const g = geoLathe([[0.03, 0], [rDC, 0], [rDC + 0.005, 0.03], [0.08, 0.06], [0.03, 0.07]], 32, false); g.rotateZ(Math.PI / 2); return g; }), mauDongCo, { vt: V(x0, YS, 0) }));
  dc.add(truTheoTruc(rDC + 0.012, 0.15, 'x', mauDongCo, V(x1 + 0.075, YS, 0), { seg: 32 }));
  dc.add(mesh(dungChung('luoiQuat', () => { const g = new THREE.CircleGeometry(rDC + 0.008, 28); g.rotateY(Math.PI / 2); return g; }), VL.luoiChe, { vt: V(x1 + 0.151, YS, 0) }));
  dc.add(hop(0.18, 0.11, 0.17, mauDongCo, V(1.0, YS + rDC + 0.05, 0)));
  dc.add(truGiua(V(1.0, YS + rDC + 0.05, 0.085), V(1.0, YS + rDC + 0.05, 0.13), 0.018, VL.nhua, { seg: 10 }));
  dc.add(mesh(dungChung('vongCau', () => new THREE.TorusGeometry(0.025, 0.007, 6, 14)), VL.thep, { vt: V(1.18, YS + rDC + 0.04, 0) }));
  for (const x of [0.92, 1.3]) {
    dc.add(hop(0.08, 0.04, 0.32, mauDongCo, V(x, YS - rDC - 0.005, 0)));
    dc.add(hop(0.12, YS - rDC - 0.025 - NEN, 0.34, VL.khung, V(x, NEN + (YS - rDC - 0.025 - NEN) / 2, 0)));
  }
  dc.add(buLongTaiDiem([V(0.92, YS - rDC + 0.016, 0.13), V(0.92, YS - rDC + 0.016, -0.13), V(1.3, YS - rDC + 0.016, 0.13), V(1.3, YS - rDC + 0.016, -0.13)], 'y', { co: 0.011, dai: 0.06, vl: VL.thep, mu: true }));
  goc.add(dc);
  dangKy(`${ma}-dc`, dc, { ten: 'Động cơ bơm', cha: ma, chucNang: 'Động cơ 3 pha chạy qua biến tần để đổi tốc độ bơm. Cánh tản nhiệt dọc thân và quạt ở đuôi giải nhiệt cho động cơ.' });

  goc.updateMatrixWorld(true);
  const tg = (p) => p.clone().applyMatrix4(goc.matrixWorld);
  const huongTG = (h) => h.clone().applyQuaternion(goc.quaternion);
  return {
    goc, quay,
    diemNoi: { hut: { p: tg(V(-0.3, YS, 0)), huong: huongTG(V(-1, 0, 0)) }, day: { p: tg(V(0, yDay, 0)), huong: TRUC.y.clone() } },
    vo: [than],
    vatCan: [{ ten: `Thân ${ten}`, hop: new THREE.Box3().setFromObject(than) }, { ten: `Động cơ ${ten}`, hop: new THREE.Box3().setFromObject(dc) }],
    khoaCat: khoa,
  };
}
