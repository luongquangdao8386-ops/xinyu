// Phụ kiện đường ống: van, lọc Y, khớp nối mềm, đồng hồ áp suất, cảm biến, linh kiện môi chất.
// Mỗi hàm dựng phụ kiện dọc trục X cục bộ (chiều dòng chảy), tâm ở gốc, phía trên là +Y.
// Trả về { obj, dai, ten, chucNang }; `dai` là chiều dài chiếm trên ống (để chừa bảo ôn).

import * as THREE from 'three';
import { VL, ketCauMatDongHo } from '../vat-lieu.js';
import {
  V, TRUC, mesh, nhom, truTheoTruc, truGiua, hop, geoLathe, geoMatBich, vongBuLong, dungChung, quatTuY,
} from '../hinh-hoc.js';

// Kim đồng hồ cần cập nhật theo thông số giả lập: { kim, min, max, khoa }.
export const dongHo = [];

const rBich = (r) => r + (r > 0.09 ? 0.06 : r > 0.03 ? 0.055 : 0.03);
const dayBich = (r) => (r > 0.03 ? 0.022 : 0.012);
const coBuLong = (r) => (r > 0.09 ? 0.013 : r > 0.03 ? 0.011 : 0.006);
const soBuLong = (r) => (r > 0.09 ? 12 : r > 0.03 ? 8 : 4);

// Mặt bích ống: mặt tiếp xúc tại x = x0, cổ hàn hướng về phía `huong` (+1: cổ về +X).
export function matBichOng(r, x0, huong, vl = VL.thepSon) {
  const m = mesh(geoMatBich(r, rBich(r), dayBich(r)), vl);
  m.position.set(x0, 0, 0);
  m.quaternion.copy(quatTuY(V(-huong, 0, 0)));
  return m;
}

// Cặp mặt bích bắt bu lông xuyên qua (giữa là thân van kẹp hoặc gioăng), tổng dày `kep`.
function capBich(g, r, kep) {
  const t = dayBich(r);
  g.add(matBichOng(r, -kep / 2, -1));
  g.add(matBichOng(r, kep / 2, 1));
  g.add(vongBuLong({
    tam: V(0, 0, 0), truc: 'x', rVong: (r + rBich(r)) / 2 + 0.006, n: soBuLong(r), co: coBuLong(r), dai: kep + 2 * t, vl: VL.thep,
  }));
}

// Đầu nối mặt bích ở cuối tuyến (mặt bích đối ứng với mặt bích thiết bị).
// cuoi = true: đặt ở cuối tuyến (mặt bích quay về +X cục bộ, tức về phía thiết bị).
export function bichCuoi(r, cuoi = false) {
  const g = nhom('Mặt bích nối');
  const t = dayBich(r);
  g.add(matBichOng(r, 0, cuoi ? -1 : 1));
  g.add(vongBuLong({ tam: V(0, 0, 0), truc: 'x', rVong: (r + rBich(r)) / 2 + 0.006, n: soBuLong(r), co: coBuLong(r), dai: 2 * t + 0.01, vl: VL.thep }));
  return { obj: g, dai: 0.1, ten: 'Mặt bích nối', chucNang: 'Nối ống với đầu nối thiết bị bằng bu lông, có gioăng làm kín ở giữa.' };
}

// Tay quay (vô lăng) trong mặt phẳng vuông góc với trục `truc`.
function volang(R, vt, truc, vl = VL.vanXanh) {
  const g = nhom('Vô lăng');
  const vanh = mesh(dungChung(`volang:${R}`, () => new THREE.TorusGeometry(R, R * 0.09, 8, 28)), vl);
  const may = mesh(geoTruDon(R * 0.2, 12), vl);
  may.scale.set(1, R * 0.35, 1);
  g.add(vanh, may);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    g.add(truGiua(V(0, 0, 0), V(Math.cos(a) * R, Math.sin(a) * R, 0), R * 0.05, vl, { seg: 6 }));
  }
  may.quaternion.copy(quatTuY(TRUC.z));
  g.position.copy(vt);
  g.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(TRUC.z, truc.clone().normalize()));
  return g;
}

function geoTruDon(r, seg) {
  return dungChung(`tru:${r}:${seg}:false`, () => new THREE.CylinderGeometry(r, r, 1, seg, 1, false));
}

// ---------- Van nước ----------

export function vanBuom(r, { tayBen = false } = {}) {
  const g = nhom('Van bướm');
  const than = 0.055 + r * 0.25;
  capBich(g, r, than);
  g.add(truTheoTruc(r + 0.03, than, 'x', VL.vanXanh, V(0, 0, 0), { seg: 28 }));
  // Cổ van và hộp số tay quay
  const cao = r + 0.07;
  g.add(truGiua(V(0, r + 0.02, 0), V(0, cao, 0), 0.022, VL.vanXanh, { seg: 12 }));
  g.add(hop(0.09, 0.07, 0.11, VL.vanXanh, V(0, cao + 0.035, 0)));
  const huong = tayBen ? V(-1, 0, 0) : V(0, 0, 1);
  g.add(truGiua(V(0, cao + 0.035, 0), V(0, cao + 0.035, 0).addScaledVector(huong, 0.1), 0.01, VL.thep, { seg: 8 }));
  g.add(volang(0.075, V(0, cao + 0.035, 0).addScaledVector(huong, 0.1), huong, VL.vanGang));
  return { obj: g, dai: than + 0.08, ten: 'Van bướm (van khóa)', chucNang: 'Đóng hoặc mở tuyến ống để cô lập thiết bị khi bảo trì. Đĩa van xoay 90° nhờ hộp số tay quay.' };
}

export function vanMotChieu(r) {
  const g = nhom('Van một chiều');
  const L = r * 3.6;
  g.add(matBichOng(r, -L / 2, -1, VL.vanGang), matBichOng(r, L / 2, 1, VL.vanGang));
  g.add(mesh(dungChung(`thanCV:${r}`, () => {
    const geo = geoLathe([[0.001, -L / 2 + 0.02], [r * 1.05, -L / 2 + 0.02], [r * 1.35, -L * 0.15], [r * 1.4, L * 0.1], [r * 1.05, L / 2 - 0.02], [0.001, L / 2 - 0.02]], 28, false);
    geo.rotateZ(-Math.PI / 2);
    return geo;
  }), VL.vanGang));
  // Nắp van trên đỉnh với vòng bu lông
  g.add(truGiua(V(0, r * 1.1, 0), V(0, r * 1.55, 0), r * 0.75, VL.vanGang, { seg: 24 }));
  g.add(vongBuLong({ tam: V(0, r * 1.55, 0), truc: 'y', rVong: r * 0.62, n: 6, co: coBuLong(r) * 0.8, dai: 0.03, vl: VL.thep, mu: true }));
  // Mũi tên chiều dòng chảy đúc trên thân
  const mui = mesh(dungChung('muiCV', () => new THREE.ConeGeometry(0.025, 0.05, 3)), VL.thep);
  mui.position.set(r * 0.4, 0, r * 1.38);
  mui.quaternion.copy(quatTuY(TRUC.x));
  g.add(mui, truGiua(V(-r * 0.6, 0, r * 1.36), V(r * 0.2, 0, r * 1.36), 0.008, VL.thep, { seg: 6 }));
  return { obj: g, dai: L + 0.06, ten: 'Van một chiều', chucNang: 'Chỉ cho nước đi theo một chiều, chặn dòng chảy ngược về bơm khi bơm dừng.' };
}

export function locY(r) {
  const g = nhom('Lọc Y');
  const L = r * 4.6;
  g.add(matBichOng(r, -L / 2, -1, VL.vanGang), matBichOng(r, L / 2, 1, VL.vanGang));
  g.add(truTheoTruc(r * 1.18, L - 0.02, 'x', VL.vanGang, V(0, 0, 0), { seg: 28 }));
  // Nhánh chứa lưới lọc chéo 45° xuống dưới
  const huong = V(1, -1, 0).normalize();
  const goc = V(-L * 0.12, 0, 0);
  const cuoi = goc.clone().addScaledVector(huong, r * 2.6);
  g.add(truGiua(goc, cuoi, r * 0.95, VL.vanGang, { seg: 24 }));
  const nap = mesh(geoMatBich(r * 0.95, r * 1.25, 0.02), VL.vanGang);
  nap.position.copy(cuoi);
  nap.quaternion.copy(quatTuY(huong.clone().negate()));
  g.add(nap);
  g.add(truGiua(cuoi, cuoi.clone().addScaledVector(huong, 0.03), r * 1.25, VL.vanGang, { seg: 24 }));
  g.add(vongBuLong({ tam: cuoi.clone().addScaledVector(huong, 0.02), truc: huong, rVong: r * 1.1, n: 6, co: coBuLong(r) * 0.8, dai: 0.05, vl: VL.thep }));
  // Nút xả cặn
  g.add(truGiua(cuoi.clone().addScaledVector(huong, 0.03), cuoi.clone().addScaledVector(huong, 0.07), 0.012, VL.dongThau, { seg: 6 }));
  return { obj: g, dai: L + 0.06, ten: 'Lọc Y', chucNang: 'Lưới lọc giữ cặn bẩn trước khi nước vào bơm. Tháo nắp nhánh chéo để vệ sinh lưới.' };
}

export function khopMem(r) {
  const g = nhom('Khớp nối mềm');
  const L = Math.max(0.16, r * 2.1);
  g.add(matBichOng(r, -L / 2, -1, VL.thepSon), matBichOng(r, L / 2, 1, VL.thepSon));
  g.add(mesh(dungChung(`caosu:${r}`, () => {
    const pts = [];
    const n = 16;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const x = -L / 2 + 0.015 + (L - 0.03) * u;
      const phinh = Math.abs(Math.sin(u * Math.PI * 2));
      pts.push([r * 1.02 + r * 0.32 * phinh, x]);
    }
    const geo = geoLathe(pts, 28, false);
    geo.rotateZ(-Math.PI / 2);
    return geo;
  }), VL.caoSu));
  // Thanh giằng giới hạn giãn
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const rr = rBich(r) - 0.012;
    g.add(truGiua(V(-L / 2 - 0.03, Math.cos(a) * rr, Math.sin(a) * rr), V(L / 2 + 0.03, Math.cos(a) * rr, Math.sin(a) * rr), 0.006, VL.thep, { seg: 6 }));
  }
  return { obj: g, dai: L + 0.06, ten: 'Khớp nối mềm', chucNang: 'Ống cao su hai bầu hấp thụ rung động của bơm/máy nén và sai lệch lắp đặt, không truyền rung sang đường ống.' };
}

export function vanCanBang(r) {
  const g = nhom('Van cân bằng');
  const L = r * 3.4;
  g.add(matBichOng(r, -L / 2, -1, VL.vanGang), matBichOng(r, L / 2, 1, VL.vanGang));
  g.add(mesh(dungChung(`thanCB:${r}`, () => {
    const geo = new THREE.SphereGeometry(r * 1.35, 24, 16);
    geo.scale(1.25, 1, 1);
    return geo;
  }), VL.vanGang));
  g.add(truGiua(V(0, r * 1.1, 0), V(0, r * 2.1, 0), r * 0.42, VL.vanGang, { seg: 16 }));
  g.add(volang(r * 0.9, V(0, r * 2.2, 0), TRUC.y, VL.vanXanh));
  // Hai cổng đo chênh áp
  for (const x of [-L * 0.28, L * 0.28]) g.add(truGiua(V(x, 0, r * 1.15), V(x, 0, r * 1.5), 0.01, VL.dongThau, { seg: 8 }));
  return { obj: g, dai: L + 0.06, ten: 'Van cân bằng', chucNang: 'Đặt trước lưu lượng thiết kế qua dàn coil; hai cổng đo dùng để đo chênh áp khi hiệu chỉnh.' };
}

// Van ba ngả: cổng A (vào, -X), AB (ra, +X), B (nhánh bypass, -Y).
export function van3Nga(r, rNhanh) {
  const g = nhom('Van ba ngả');
  const L = r * 3.4;
  g.add(matBichOng(r, -L / 2, -1, VL.vanGang), matBichOng(r, L / 2, 1, VL.vanGang));
  g.add(mesh(dungChung(`than3:${r}`, () => new THREE.SphereGeometry(r * 1.4, 24, 16)), VL.vanGang));
  g.add(truTheoTruc(r * 1.05, L - 0.02, 'x', VL.vanGang, V(0, 0, 0), { seg: 24 }));
  g.add(truGiua(V(0, 0, 0), V(0, -r * 1.75, 0), rNhanh * 1.1, VL.vanGang, { seg: 20 }));
  const bichB = mesh(geoMatBich(rNhanh, rBich(rNhanh), dayBich(rNhanh)), VL.vanGang);
  bichB.position.set(0, -r * 1.75, 0);
  bichB.rotation.x = Math.PI; // mặt bích quay xuống phía ống nhánh
  g.add(bichB);
  // Cổ và bộ truyền động điện
  g.add(truGiua(V(0, r * 1.2, 0), V(0, r * 2.4, 0), 0.016, VL.thep, { seg: 8 }));
  g.add(truGiua(V(-0.04, r * 1.2, 0), V(-0.04, r * 2.4, 0), 0.008, VL.thep, { seg: 6 }), truGiua(V(0.04, r * 1.2, 0), V(0.04, r * 2.4, 0), 0.008, VL.thep, { seg: 6 }));
  g.add(hop(0.17, 0.2, 0.13, VL.nhuaTrang, V(0, r * 2.4 + 0.1, 0)));
  g.add(hop(0.05, 0.03, 0.02, VL.nhua, V(0.05, r * 2.4 + 0.12, 0.075)));
  return { obj: g, dai: L + 0.06, ten: 'Van ba ngả có bộ truyền động', chucNang: 'Bộ điều khiển AHU chỉnh tỷ lệ nước qua dàn coil và qua nhánh bypass để giữ nhiệt độ gió cấp; lưu lượng tổng của mạch gần như không đổi.' };
}

export function vanBi(r, { mau = VL.nutDo } = {}) {
  const g = nhom('Van bi');
  const L = Math.max(0.07, r * 4);
  g.add(truTheoTruc(r * 1.3, L * 0.55, 'x', VL.dongThau, V(0, 0, 0), { seg: 16 }));
  for (const x of [-L * 0.38, L * 0.38]) g.add(truTheoTruc(r * 1.25, L * 0.24, 'x', VL.dongThau, V(x, 0, 0), { seg: 6 }));
  g.add(truGiua(V(0, r * 1.2, 0), V(0, r * 1.2 + 0.02, 0), 0.006, VL.thep, { seg: 6 }));
  g.add(hop(Math.max(0.09, r * 4.5), 0.008, 0.018, mau, V(Math.max(0.045, r * 2.2) - 0.008, r * 1.2 + 0.024, 0)));
  return { obj: g, dai: L + 0.02, ten: 'Van bi', chucNang: 'Van khóa đóng mở nhanh bằng tay gạt 1/4 vòng.' };
}

// Nhánh rẽ (tê) vuông góc về phía +Y cục bộ, đầu nhánh có mặt bích.
export function teNhanh(r, rNhanh, dai) {
  const g = nhom('Tê rẽ nhánh');
  g.add(truTheoTruc(r * 1.04, rNhanh * 2.6, 'x', VL.thepSon, V(0, 0, 0), { seg: 24 }));
  g.add(truGiua(V(0, 0, 0), V(0, dai, 0), rNhanh, VL.thepSon, { seg: 16 }));
  return { obj: g, dai: rNhanh * 2.6 + 0.04, ten: 'Tê rẽ nhánh', chucNang: 'Điểm rẽ nhánh trên ống chính.' };
}

// ---------- Thiết bị đo ----------

// Đồng hồ áp suất: cần đứng theo +Y cục bộ, mặt đồng hồ quay về hướng `mat` (vectơ thế giới, đặt sau).
export function dongHoAp(rOng, { min = 0, max = 10, buoc = 2, donVi = 'bar', khoa, cao = 0.16 } = {}) {
  const g = nhom('Đồng hồ áp suất');
  const goc0 = rOng + 0.005;
  g.add(truGiua(V(0, goc0 - 0.01, 0), V(0, goc0 + cao, 0), 0.007, VL.dongThau, { seg: 8 }));
  g.add(hop(0.026, 0.026, 0.026, VL.dongThau, V(0, goc0 + cao * 0.35, 0)));
  g.add(hop(0.05, 0.006, 0.01, VL.nutDo, V(0.022, goc0 + cao * 0.35 + 0.016, 0)));
  const dau = nhom('Mặt đồng hồ');
  dau.position.set(0, goc0 + cao + 0.05, 0);
  const vo = mesh(dungChung('voDH', () => { const geo = new THREE.CylinderGeometry(0.052, 0.052, 0.032, 28); geo.rotateX(Math.PI / 2); return geo; }), VL.inox);
  const mat = mesh(dungChung('matDH', () => new THREE.CircleGeometry(0.046, 32)), new THREE.MeshBasicMaterial({ map: ketCauMatDongHo(min, max, donVi, buoc) }), { bong: false });
  mat.position.z = 0.0165;
  const kim = mesh(dungChung('kimDH', () => { const geo = new THREE.BoxGeometry(0.04, 0.0035, 0.002); geo.translate(0.016, 0, 0); return geo; }), VL.nutDo, { bong: false });
  kim.position.z = 0.018;
  const kinh = mesh(dungChung('kinhDH', () => new THREE.CircleGeometry(0.047, 24)), VL.kinh, { bong: false });
  kinh.position.z = 0.021;
  dau.add(vo, mat, kim, kinh);
  g.add(dau);
  if (khoa) dongHo.push({ kim, min, max, khoa, giaTri: min });
  g.userData.matDongHo = dau;
  return { obj: g, dai: 0.05, ten: 'Đồng hồ áp suất', chucNang: 'Hiển thị áp suất tại điểm đo (giá trị giả lập). Van kim dưới mặt đồng hồ dùng để cô lập khi thay.' };
}

// Đồng hồ nhiệt độ lưỡng kim cắm vào giếng nhiệt.
export function nhietKe(rOng, { min = 0, max = 50, buoc = 10, khoa, cao = 0.12 } = {}) {
  const kq = dongHoAp(rOng, { min, max, buoc, donVi: '°C', khoa, cao });
  kq.obj.name = 'Nhiệt kế';
  kq.obj.children[1].visible = false; // không có van kim
  kq.obj.children[2].visible = false;
  kq.ten = 'Nhiệt kế (đồng hồ nhiệt độ)';
  kq.chucNang = 'Đo nhiệt độ nước qua giếng nhiệt cắm vào ống (giá trị giả lập).';
  return kq;
}

// Cảm biến nhiệt độ có đầu chuyển đổi và dây tín hiệu.
export function camBienNhiet(rOng, { cao = 0.08 } = {}) {
  const g = nhom('Cảm biến nhiệt độ');
  const goc0 = rOng;
  g.add(truGiua(V(0, goc0 - 0.01, 0), V(0, goc0 + cao, 0), 0.008, VL.inox, { seg: 8 }));
  g.add(truGiua(V(0, goc0 + cao, 0), V(0, goc0 + cao + 0.05, 0), 0.026, VL.nhom, { seg: 16 }));
  g.add(truGiua(V(0, goc0 + cao + 0.05, 0), V(0, goc0 + cao + 0.058, 0), 0.028, VL.nhua, { seg: 16 }));
  g.add(truGiua(V(0, goc0 + cao + 0.025, 0.02), V(0, goc0 + cao + 0.025, 0.045), 0.008, VL.nhua, { seg: 8 }));
  g.userData.dauDay = V(0, goc0 + cao + 0.025, 0.045);
  return { obj: g, dai: 0.04, ten: 'Cảm biến nhiệt độ', chucNang: 'Đầu dò nhiệt điện trở trong giếng nhiệt, gửi tín hiệu về tủ điều khiển.' };
}

export function camBienAp(rOng, { cao = 0.06 } = {}) {
  const g = nhom('Cảm biến áp suất');
  g.add(truGiua(V(0, rOng - 0.005, 0), V(0, rOng + cao, 0), 0.006, VL.dongThau, { seg: 8 }));
  g.add(hop(0.02, 0.015, 0.02, VL.dongThau, V(0, rOng + cao * 0.5, 0)));
  g.add(truGiua(V(0, rOng + cao, 0), V(0, rOng + cao + 0.07, 0), 0.016, VL.inox, { seg: 16 }));
  g.add(truGiua(V(0, rOng + cao + 0.07, 0), V(0, rOng + cao + 0.09, 0), 0.012, VL.nhua, { seg: 12 }));
  g.userData.dauDay = V(0, rOng + cao + 0.09, 0);
  return { obj: g, dai: 0.03, ten: 'Cảm biến áp suất', chucNang: 'Bộ chuyển đổi áp suất 4–20 mA gửi tín hiệu về tủ điều khiển.' };
}

export function congTacDongChay(rOng) {
  const g = nhom('Công tắc dòng chảy');
  g.add(truGiua(V(0, rOng - 0.005, 0), V(0, rOng + 0.05, 0), 0.016, VL.dongThau, { seg: 8 }));
  g.add(hop(0.11, 0.07, 0.07, VL.nhuaTrang, V(0, rOng + 0.085, 0)));
  g.add(truGiua(V(0.055, rOng + 0.085, 0), V(0.08, rOng + 0.085, 0), 0.01, VL.nhua, { seg: 8 }));
  g.userData.dauDay = V(0.08, rOng + 0.085, 0);
  return { obj: g, dai: 0.06, ten: 'Công tắc dòng chảy', chucNang: 'Lá cảm biến trong ống xác nhận có lưu lượng; máy nén chỉ được chạy khi công tắc đóng.' };
}

export function xaKhi(rOng) {
  const g = nhom('Van xả khí tự động');
  g.add(truGiua(V(0, rOng - 0.005, 0), V(0, rOng + 0.06, 0), 0.012, VL.dongThau, { seg: 8 }));
  g.add(hop(0.03, 0.02, 0.03, VL.dongThau, V(0, rOng + 0.04, 0)));
  g.add(truGiua(V(0, rOng + 0.06, 0), V(0, rOng + 0.13, 0), 0.026, VL.dongThau, { seg: 16 }));
  g.add(truGiua(V(0, rOng + 0.13, 0), V(0, rOng + 0.145, 0), 0.01, VL.dongThau, { seg: 8 }));
  return { obj: g, dai: 0.04, ten: 'Van xả khí tự động', chucNang: 'Đặt ở điểm cao của tuyến ống, tự xả bọt khí tích tụ để nước tuần hoàn êm và không làm giảm truyền nhiệt.' };
}

export function vanXa(rOng) {
  const g = nhom('Van xả đáy');
  g.add(truGiua(V(0, -rOng + 0.005, 0), V(0, -rOng - 0.06, 0), 0.012, VL.dongThau, { seg: 8 }));
  const v = vanBi(0.012, { mau: VL.nutDo }).obj;
  v.position.set(0, -rOng - 0.08, 0);
  v.rotation.z = Math.PI / 2;
  g.add(v);
  return { obj: g, dai: 0.04, ten: 'Van xả đáy', chucNang: 'Xả nước ở điểm thấp khi cần tháo cạn tuyến ống.' };
}

// ---------- Linh kiện mạch môi chất ----------

export function phinLoc(r) {
  const g = nhom('Phin lọc');
  const L = 0.26, R = 0.048;
  g.add(mesh(dungChung('phin', () => {
    const geo = geoLathe([[r, -L / 2 - 0.03], [r * 1.4, -L / 2 - 0.03], [R * 0.7, -L / 2 + 0.005], [R, -L / 2 + 0.03], [R, L / 2 - 0.03], [R * 0.7, L / 2 - 0.005], [r * 1.4, L / 2 + 0.03], [r, L / 2 + 0.03]], 28, false);
    geo.rotateZ(-Math.PI / 2);
    return geo;
  }), VL.thepSonSang));
  for (const x of [-L / 2 - 0.02, L / 2 + 0.02]) g.add(truTheoTruc(r * 1.5, 0.025, 'x', VL.dongThau, V(x, 0, 0), { seg: 6 }));
  g.add(hop(0.09, 0.002, 0.05, VL.nhuaTrang, V(0, R + 0.001, 0)));
  return { obj: g, dai: L + 0.08, ten: 'Phin lọc ẩm', chucNang: 'Lõi hút ẩm và lưới lọc giữ hơi nước, axit và cặn trong môi chất lỏng trước van tiết lưu.' };
}

export function kinhXem(r) {
  const g = nhom('Kính xem');
  g.add(truTheoTruc(r * 1.25, 0.09, 'x', VL.dongThau, V(0, 0, 0), { seg: 6 }));
  g.add(truGiua(V(0, 0, 0), V(0, r * 1.7, 0), 0.026, VL.dongThau, { seg: 16 }));
  const kinh = mesh(dungChung('kinhXem', () => new THREE.CylinderGeometry(0.019, 0.019, 0.006, 20)), VL.kinhXem, { bong: false });
  kinh.position.set(0, r * 1.7 + 0.002, 0);
  g.add(kinh);
  g.userData.kinh = kinh;
  return { obj: g, dai: 0.1, ten: 'Kính xem môi chất', chucNang: 'Cho thấy môi chất lỏng đầy ống (không có bọt). Chấm chỉ thị đổi màu khi môi chất bị ẩm.' };
}

export function vanTietLuu(r) {
  const g = nhom('Van tiết lưu điện tử');
  g.add(hop(0.075, 0.075, 0.07, VL.dongThau, V(0, 0, 0)));
  for (const x of [-0.05, 0.05]) g.add(truTheoTruc(r * 1.2, 0.03, 'x', VL.dongThau, V(x, 0, 0), { seg: 12 }));
  g.add(truGiua(V(0, 0.035, 0), V(0, 0.07, 0), 0.02, VL.inox, { seg: 16 }));
  g.add(truGiua(V(0, 0.07, 0), V(0, 0.19, 0), 0.034, VL.nhua, { seg: 20 }));
  g.add(truGiua(V(0, 0.19, 0), V(0, 0.205, 0), 0.028, VL.nhua, { seg: 20 }));
  g.add(truGiua(V(0, 0.15, 0.03), V(0, 0.15, 0.06), 0.009, VL.nhua, { seg: 8 }));
  g.userData.dauDay = V(0, 0.15, 0.06);
  return { obj: g, dai: 0.12, ten: 'Van tiết lưu điện tử (EXV)', chucNang: 'Động cơ bước điều chỉnh độ mở kim van: hạ áp suất môi chất lỏng từ áp ngưng xuống áp bay hơi và giữ mức lỏng trong bình bay hơi.' };
}

export function vanDienTu(r) {
  const g = nhom('Van điện từ');
  g.add(hop(0.05, 0.04, 0.04, VL.dongThau, V(0, 0, 0)));
  g.add(truGiua(V(0, 0.02, 0), V(0, 0.06, 0), 0.012, VL.inox, { seg: 12 }));
  g.add(hop(0.055, 0.055, 0.05, VL.nhua, V(0, 0.085, 0)));
  for (const x of [-0.035, 0.035]) g.add(truTheoTruc(r * 1.3, 0.02, 'x', VL.dongThau, V(x, 0, 0), { seg: 6 }));
  return { obj: g, dai: 0.07, ten: 'Van điện từ đường dầu', chucNang: 'Mở khi máy nén chạy để dầu hồi về máy nén, đóng khi dừng để dầu không tràn vào buồng nén.' };
}

export function vanAnToan(cao = 0.22) {
  const g = nhom('Van an toàn');
  g.add(truGiua(V(0, 0, 0), V(0, 0.05, 0), 0.02, VL.dongThau, { seg: 12 }));
  g.add(truGiua(V(0, 0.05, 0), V(0, 0.11, 0), 0.032, VL.dongThau, { seg: 16 }));
  g.add(truGiua(V(0, 0.11, 0), V(0, cao, 0), 0.02, VL.dongThau, { seg: 12 }));
  g.add(truGiua(V(0, cao, 0), V(0, cao + 0.02, 0), 0.026, VL.nutDo, { seg: 12 }));
  g.add(truGiua(V(0, 0.08, 0), V(0.09, 0.08, 0), 0.016, VL.dongThau, { seg: 10 }));
  return { obj: g, dai: 0.05, ten: 'Van an toàn', chucNang: 'Tự mở xả môi chất ra ngoài khi áp suất trong bình vượt mức an toàn.' };
}

// ---------- Đặt phụ kiện lên tuyến ----------

const tam = new THREE.Vector3();
// Trục X cục bộ theo tiếp tuyến tại s; trục Y theo `len` (vectơ thế giới) sau khi trực giao hóa.
export function datLenTuyen(obj, tuyen, s, len = TRUC.y, duPhong = TRUC.z) {
  const { p, t } = tuyen.diemTai(s);
  let y = len.clone().addScaledVector(t, -len.dot(t));
  if (y.lengthSq() < 1e-6) y = duPhong.clone().addScaledVector(t, -duPhong.dot(t));
  y.normalize();
  const z = tam.crossVectors(t, y).clone();
  obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(t, y, z));
  obj.position.copy(p);
  return obj;
}

// Xoay mặt đồng hồ về hướng nhìn thuận tiện (gọi sau khi đã gắn vào cảnh).
export function huongMatDongHo(obj, huong) {
  const dau = obj.userData.matDongHo;
  if (!dau) return;
  obj.updateWorldMatrix(true, true);
  const p = dau.getWorldPosition(new THREE.Vector3());
  dau.lookAt(p.add(huong));
}
