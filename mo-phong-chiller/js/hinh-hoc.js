// Tiện ích hình học dùng chung: hình trụ theo trục, mặt bích, bu lông dạng InstancedMesh,
// tuyến ống có co (khung vận chuyển song song), rotor xoắn, tấm sóng, cánh cong.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const TRUC = { x: V(1, 0, 0), y: V(0, 1, 0), z: V(0, 0, 1) };
const vec = (t) => (typeof t === 'string' ? TRUC[t].clone() : t.clone().normalize());

// Kho geometry dùng chung theo khóa: chi tiết lặp lại chỉ tạo một lần.
const kho = new Map();
export function dungChung(khoa, tao) {
  let g = kho.get(khoa);
  if (!g) { g = tao(); kho.set(khoa, g); }
  return g;
}

export function mesh(geo, vl, { vt, bong = true, ten } = {}) {
  const m = new THREE.Mesh(geo, vl);
  if (vt) m.position.copy(vt);
  m.castShadow = bong;
  m.receiveShadow = true;
  if (ten) m.name = ten;
  return m;
}

export function nhom(ten, ...con) {
  const g = new THREE.Group();
  g.name = ten || '';
  for (const c of con) if (c) g.add(c);
  return g;
}

export const quatTuY = (huong) => new THREE.Quaternion().setFromUnitVectors(TRUC.y, vec(huong));

// Hình trụ dài 1 theo trục Y, tâm ở gốc; co giãn theo trục để dùng chung geometry.
export function geoTruDon(r, seg = 24, mo = false) {
  return dungChung(`tru:${r}:${seg}:${mo}`, () => new THREE.CylinderGeometry(r, r, 1, seg, 1, mo));
}

// Hình trụ đặt giữa hai điểm a, b.
export function truGiua(a, b, r, vl, { seg = 24, mo = false, bong = true } = {}) {
  const m = mesh(geoTruDon(r, seg, mo), vl, { bong });
  m.scale.set(1, a.distanceTo(b), 1);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.copy(quatTuY(b.clone().sub(a)));
  return m;
}

// Hình trụ theo trục x|y|z, tâm tại vt.
export function truTheoTruc(r, dai, truc, vl, vt, opts = {}) {
  const t = vec(truc);
  return truGiua(vt.clone().addScaledVector(t, -dai / 2), vt.clone().addScaledVector(t, dai / 2), r, vl, opts);
}

// Hộp tâm tại vt.
export function hop(w, h, d, vl, vt, opts = {}) {
  const geo = dungChung('hop1', () => new THREE.BoxGeometry(1, 1, 1));
  const m = mesh(geo, vl, opts);
  m.scale.set(w, h, d);
  if (vt) m.position.copy(vt);
  return m;
}

// Lathe có cạnh sắc: mỗi điểm góc được nhân đôi để pháp tuyến không bị làm trơn qua góc.
// diem: mảng [r, y]; trục quay là Y.
export function geoLathe(diem, seg = 32, sac = true) {
  const pts = [];
  diem.forEach(([r, y], i) => {
    const p = new THREE.Vector2(Math.max(r, 0), y);
    pts.push(p);
    if (sac && i > 0 && i < diem.length - 1) pts.push(p.clone());
  });
  return new THREE.LatheGeometry(pts, seg);
}

// Mặt bích có cổ hàn: mặt tiếp xúc ở y = 0, cổ ống hướng về y âm.
export function geoMatBich(rOng, rNgoai, day, seg = 32) {
  return dungChung(`bich:${rOng}:${rNgoai}:${day}`, () => {
    const rCo = rOng + day * 0.55;
    return geoLathe([
      [rOng * 0.92, 0], [rNgoai, 0], [rNgoai, -day], [rCo, -day], [rOng * 1.02, -day * 2.2], [rOng * 0.92, -day * 2.2], [rOng * 0.92, 0],
    ], seg);
  });
}

// Đặt vật thể có trục Y theo hướng huong, gốc tại vt.
export function datTheoHuong(obj, vt, huong) {
  obj.position.copy(vt);
  obj.quaternion.copy(quatTuY(huong));
  return obj;
}

// Bu lông có đai ốc hai đầu (vít cấy) dài `dai` theo trục Y, tâm ở gốc.
export function geoBuLong(co, dai) {
  return dungChung(`bulong:${co}:${dai}`, () => {
    const dai0 = new THREE.CylinderGeometry(co * 0.48, co * 0.48, dai + co * 1.2, 8);
    const oc1 = new THREE.CylinderGeometry(co, co, co * 0.8, 6);
    oc1.translate(0, dai / 2 + co * 0.4, 0);
    const oc2 = new THREE.CylinderGeometry(co, co, co * 0.8, 6);
    oc2.translate(0, -dai / 2 - co * 0.4, 0);
    return mergeGeometries([dai0.toNonIndexed(), oc1.toNonIndexed(), oc2.toNonIndexed()]);
  });
}

// Bu lông có mũ một đầu (đầu ở y dương), chân cắm xuống.
export function geoBuLongMu(co, dai) {
  return dungChung(`bulongmu:${co}:${dai}`, () => {
    const than = new THREE.CylinderGeometry(co * 0.48, co * 0.48, dai, 8);
    than.translate(0, -dai / 2, 0);
    const mu = new THREE.CylinderGeometry(co, co, co * 0.7, 6);
    mu.translate(0, co * 0.35, 0);
    const vong = new THREE.CylinderGeometry(co * 1.25, co * 1.25, co * 0.18, 12);
    vong.translate(0, -co * 0.09, 0);
    return mergeGeometries([than.toNonIndexed(), mu.toNonIndexed(), vong.toNonIndexed()]);
  });
}

// Hai vectơ vuông góc với trục t.
export function coSoVuongGoc(t) {
  const a = Math.abs(t.y) < 0.9 ? TRUC.y : TRUC.x;
  const u = new THREE.Vector3().crossVectors(t, a).normalize();
  const w = new THREE.Vector3().crossVectors(t, u).normalize();
  return [u, w];
}

// Vòng bu lông quanh trục: một InstancedMesh cho cả vòng.
export function vongBuLong({ tam, truc, rVong, n, co = 0.012, dai = 0.08, vl, lech = 0.5, mu = false }) {
  const t = vec(truc);
  const [u, w] = coSoVuongGoc(t);
  const geo = mu ? geoBuLongMu(co, dai) : geoBuLong(co, dai);
  const im = new THREE.InstancedMesh(geo, vl, n);
  const q = quatTuY(t);
  const m = new THREE.Matrix4();
  const one = V(1, 1, 1);
  for (let i = 0; i < n; i++) {
    const a = ((i + lech) / n) * Math.PI * 2;
    const p = tam.clone().addScaledVector(u, Math.cos(a) * rVong).addScaledVector(w, Math.sin(a) * rVong);
    im.setMatrixAt(i, m.compose(p, q, one));
  }
  im.castShadow = false; // bu lông nhỏ: bỏ đổ bóng để giảm tải
  im.receiveShadow = true;
  return im;
}

// Bu lông tại danh sách điểm cho trước, cùng một hướng.
export function buLongTaiDiem(diem, truc, { co = 0.012, dai = 0.08, vl, mu = false }) {
  const geo = mu ? geoBuLongMu(co, dai) : geoBuLong(co, dai);
  const im = new THREE.InstancedMesh(geo, vl, diem.length);
  const q = quatTuY(vec(truc));
  const m = new THREE.Matrix4();
  diem.forEach((p, i) => im.setMatrixAt(i, m.compose(p, q, V(1, 1, 1))));
  im.castShadow = false;
  return im;
}

// Nhiều bản sao một geometry theo danh sách ma trận.
export function banSao(geo, vl, maTran, { bong = true } = {}) {
  const im = new THREE.InstancedMesh(geo, vl, maTran.length);
  maTran.forEach((m, i) => im.setMatrixAt(i, m));
  im.castShadow = bong;
  im.receiveShadow = true;
  return im;
}

export const maTran = (p, q = new THREE.Quaternion(), s = V(1, 1, 1)) => new THREE.Matrix4().compose(p, q, s);

// ---------- Tuyến ống ----------
// Tuyến gồm các điểm gấp khúc vuông góc; ở mỗi điểm gấp có một co (cung Bezier bậc hai gần đúng cung tròn).

export class TuyenOng {
  constructor(diem, rUon = 0.2) {
    this.diem = diem.map((p) => p.clone());
    this.doan = [];
    let dau = this.diem[0].clone();
    const n = this.diem.length;
    for (let i = 1; i < n - 1; i++) {
      const a = this.diem[i - 1], b = this.diem[i], c = this.diem[i + 1];
      const d1 = b.clone().sub(a), d2 = c.clone().sub(b);
      const l1 = d1.length(), l2 = d2.length();
      d1.normalize(); d2.normalize();
      const r = Math.min(rUon, i === 1 ? l1 - 0.04 : l1 / 2, i === n - 2 ? l2 - 0.04 : l2 / 2);
      const p0 = b.clone().addScaledVector(d1, -r);
      const p2 = b.clone().addScaledVector(d2, r);
      if (dau.distanceTo(p0) > 1e-5) this.doan.push({ loai: 'thang', a: dau, b: p0 });
      this.doan.push({ loai: 'cong', p0, p1: b.clone(), p2, r });
      dau = p2;
    }
    this.doan.push({ loai: 'thang', a: dau, b: this.diem[n - 1].clone() });
    let s = 0;
    for (const d of this.doan) {
      d.s0 = s;
      if (d.loai === 'thang') d.len = d.a.distanceTo(d.b);
      else { d.cung = new THREE.QuadraticBezierCurve3(d.p0, d.p1, d.p2); d.len = d.cung.getLength(); }
      s += d.len;
      d.s1 = s;
    }
    this.dai = s;
  }

  diemTai(s, p = new THREE.Vector3(), t = new THREE.Vector3()) {
    s = Math.min(Math.max(s, 0), this.dai);
    let d = this.doan[this.doan.length - 1];
    for (const x of this.doan) if (s <= x.s1) { d = x; break; }
    const u = d.len > 0 ? Math.min(1, Math.max(0, (s - d.s0) / d.len)) : 0; // kẹp để tránh u > 1 do sai số dấu phẩy động
    if (d.loai === 'thang') { p.lerpVectors(d.a, d.b, u); t.subVectors(d.b, d.a).normalize(); }
    else { d.cung.getPointAt(u, p); d.cung.getTangentAt(u, t); }
    return { p, t };
  }

  // Mẫu điểm dọc tuyến trong khoảng [s0, s1]: đoạn thẳng lấy hai đầu, đoạn cong chia nhỏ.
  mau(s0 = 0, s1 = this.dai, soCong = 12) {
    const ds = new Set([s0, s1]);
    for (const d of this.doan) {
      if (d.loai === 'thang') { ds.add(d.s0); ds.add(d.s1); }
      else for (let i = 0; i <= soCong; i++) ds.add(d.s0 + (d.len * i) / soCong);
    }
    return [...ds].filter((s) => s >= s0 - 1e-9 && s <= s1 + 1e-9).sort((a, b) => a - b)
      .filter((s, i, arr) => i === 0 || s - arr[i - 1] > 1e-5)
      .map((s) => ({ s, ...this.diemTai(s) }));
  }

  // Các đoạn thẳng (để đặt van, mũi tên, giá đỡ).
  doanThang() {
    return this.doan.filter((d) => d.loai === 'thang').map((d) => ({ ...d, huong: d.b.clone().sub(d.a).normalize() }));
  }
}

// Ống tròn chạy theo tuyến trong khoảng [s0, s1]; uv.x = độ dài (m) để kết cấu lặp theo mét.
export function geoOng(tuyen, r, { s0 = 0, s1 = tuyen.dai, nTron = 18, napDau = false } = {}) {
  const mau = tuyen.mau(s0, s1);
  const pos = [], nor = [], uv = [], idx = [];
  let n = coSoVuongGoc(mau[0].t)[0];
  const q = new THREE.Quaternion();
  for (let i = 0; i < mau.length; i++) {
    const { p, t, s } = mau[i];
    if (i > 0) {
      q.setFromUnitVectors(mau[i - 1].t, t);
      n.applyQuaternion(q);
      n.addScaledVector(t, -n.dot(t)).normalize();
    }
    const b = new THREE.Vector3().crossVectors(t, n);
    for (let j = 0; j <= nTron; j++) {
      const a = (j / nTron) * Math.PI * 2;
      const dx = n.x * Math.cos(a) + b.x * Math.sin(a);
      const dy = n.y * Math.cos(a) + b.y * Math.sin(a);
      const dz = n.z * Math.cos(a) + b.z * Math.sin(a);
      pos.push(p.x + dx * r, p.y + dy * r, p.z + dz * r);
      nor.push(dx, dy, dz);
      uv.push(s, j / nTron);
    }
  }
  const hang = nTron + 1;
  for (let i = 0; i < mau.length - 1; i++) for (let j = 0; j < nTron; j++) {
    const a = i * hang + j, b = a + hang, c = b + 1, d = a + 1;
    idx.push(a, b, d, b, c, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  if (!napDau) return geo;
  return mergeGeometries([geo, geoVanhKhuyen(tuyen, s0, 0, r, -1), geoVanhKhuyen(tuyen, s1, 0, r, 1)]);
}

// Vành khuyên vuông góc tuyến tại s (thể hiện chiều dày lớp bảo ôn ở đầu đoạn).
export function geoVanhKhuyen(tuyen, s, rTrong, rNgoai, chieu = 1) {
  const { p, t } = tuyen.diemTai(s);
  const g = new THREE.RingGeometry(rTrong, rNgoai, 24);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(TRUC.z, t.clone().multiplyScalar(chieu)));
  g.translate(p.x, p.y, p.z);
  return g;
}

// ---------- Rotor trục vít ----------
// Biên dạng cực r(θ) xoắn dần theo chiều dài. Rotor đực có răng lồi, rotor cái có rãnh lõm.
// Trục rotor là X; góc θ đo trong mặt phẳng (y, z) từ +y sang +z.
export function geoRotor({ soRang, rNgoai, rTrong, dai, gocXoan, loai, nTron = 128, nDoc = 48 }) {
  const f = (th) => {
    const c = 0.5 + 0.5 * Math.cos(soRang * th);
    return loai === 'duc'
      ? rTrong + (rNgoai - rTrong) * Math.pow(c, 0.85)
      : rNgoai - (rNgoai - rTrong) * Math.pow(c, 2.2);
  };
  const pos = [], idx = [];
  for (let i = 0; i <= nDoc; i++) {
    const x = -dai / 2 + (dai * i) / nDoc;
    const xoan = (gocXoan * i) / nDoc;
    for (let j = 0; j < nTron; j++) {
      const th = (j / nTron) * Math.PI * 2;
      const r = f(th - xoan);
      pos.push(x, r * Math.cos(th), r * Math.sin(th));
    }
  }
  for (let i = 0; i < nDoc; i++) for (let j = 0; j < nTron; j++) {
    const a = i * nTron + j, b = (i + 1) * nTron + j, c = (i + 1) * nTron + ((j + 1) % nTron), d = i * nTron + ((j + 1) % nTron);
    idx.push(a, d, b, b, d, c);
  }
  const than = new THREE.BufferGeometry();
  than.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  than.setIndex(idx);
  than.computeVertexNormals();
  // Hai mặt đầu
  const nap = (i, chieu) => {
    const p = [], ix = [];
    const x = -dai / 2 + (dai * i) / nDoc;
    p.push(x, 0, 0);
    for (let j = 0; j < nTron; j++) p.push(pos[(i * nTron + j) * 3], pos[(i * nTron + j) * 3 + 1], pos[(i * nTron + j) * 3 + 2]);
    for (let j = 0; j < nTron; j++) {
      const a = 1 + j, b = 1 + ((j + 1) % nTron);
      if (chieu > 0) ix.push(0, a, b); else ix.push(0, b, a);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    g.setIndex(ix);
    g.computeVertexNormals();
    return g;
  };
  return mergeGeometries([than, nap(0, -1), nap(nDoc, 1)]);
}

// ---------- Tấm sóng (khối đệm tháp) ----------
export function geoTamSong(rong, cao, bienDo, buocSong, nX = 60) {
  const g = new THREE.PlaneGeometry(rong, cao, nX, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, bienDo * Math.sin((p.getX(i) / buocSong) * Math.PI * 2));
  g.computeVertexNormals();
  return g;
}

// Tấm xếp nếp hình chữ V (bộ lọc khí, bộ tách giọt).
export function geoNepGap(rong, cao, sau, soNep) {
  const pos = [], idx = [];
  for (let i = 0; i <= soNep * 2; i++) {
    const x = -rong / 2 + (rong * i) / (soNep * 2);
    const z = i % 2 === 0 ? -sau / 2 : sau / 2;
    pos.push(x, -cao / 2, z, x, cao / 2, z);
  }
  for (let i = 0; i < soNep * 2; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// ---------- Cánh cong (bánh công tác bơm, bánh quạt AHU) ----------
// Cánh cong ngược: đường giữa là xoắn logarit từ r1 đến r2, đùn theo trục Y một đoạn `cao`.
export function geoCanhCong(r1, r2, day, cao, gocQuet = 0.9) {
  return dungChung(`canh:${r1}:${r2}:${day}:${cao}:${gocQuet}`, () => {
    const n = 14;
    const trong = [], ngoai = [];
    for (let i = 0; i <= n; i++) {
      const r = r1 + ((r2 - r1) * i) / n;
      const phi = -gocQuet * Math.log(r / r1) / Math.log(r2 / r1);
      const dphi = (day / 2) / r;
      trong.push(new THREE.Vector2(r * Math.cos(phi - dphi), r * Math.sin(phi - dphi)));
      ngoai.push(new THREE.Vector2(r * Math.cos(phi + dphi), r * Math.sin(phi + dphi)));
    }
    const shape = new THREE.Shape([...trong, ...ngoai.reverse()]);
    const g = new THREE.ExtrudeGeometry(shape, { depth: cao, bevelEnabled: false, curveSegments: 4 });
    g.rotateX(-Math.PI / 2); // mặt phẳng XY -> XZ, đùn theo +Y
    return g;
  });
}

// Cánh quạt hướng trục xoắn dọc sải cánh: sải theo +X từ rGoc đến rNgon.
export function geoCanhQuat(rGoc, rNgon, day, xoanGoc, xoanNgon, n = 14) {
  return dungChung(`canhquat:${rGoc}:${rNgon}`, () => {
    const g = new THREE.BoxGeometry(rNgon - rGoc, 0.014, day, n, 1, 1);
    g.translate((rGoc + rNgon) / 2, 0, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const u = (x - rGoc) / (rNgon - rGoc);
      const goc = xoanGoc + (xoanNgon - xoanGoc) * u;
      const rong = 1 - 0.25 * u; // dây cung hẹp dần về đầu cánh
      const zz = z * rong;
      p.setY(i, y * Math.cos(goc) - zz * Math.sin(goc));
      p.setZ(i, y * Math.sin(goc) + zz * Math.cos(goc));
    }
    g.computeVertexNormals();
    return g;
  });
}

// Đùn hình 2D theo +Z rồi đặt tâm chiều dày ở gốc.
export function geoDun(shape, sau, { vat = 0, buocVat = 2, cong = 24 } = {}) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: sau, curveSegments: cong, bevelEnabled: vat > 0, bevelSize: vat, bevelThickness: vat, bevelSegments: buocVat,
  });
  g.translate(0, 0, -sau / 2);
  return g;
}

// Hình chữ nhật bo góc (Shape) tâm ở gốc.
export function hinhChuNhatBo(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// Điểm cách đều trên chu vi hình chữ nhật bo góc (để đặt bu lông mặt bích chữ nhật).
export function diemChuViChuNhat(w, h, n) {
  const chuVi = 2 * (w + h);
  const out = [];
  for (let i = 0; i < n; i++) {
    let d = ((i + 0.5) / n) * chuVi;
    if (d < w) { out.push([-w / 2 + d, -h / 2]); continue; }
    d -= w;
    if (d < h) { out.push([w / 2, -h / 2 + d]); continue; }
    d -= h;
    if (d < w) { out.push([w / 2 - d, h / 2]); continue; }
    d -= w;
    out.push([-w / 2, h / 2 - d]);
  }
  return out;
}

// Ghép nhiều geometry đã đặt vị trí thành một (giảm số lần vẽ cho chi tiết tĩnh).
export function ghep(dsGeo) {
  return mergeGeometries(dsGeo.map((g) => (g.index ? g.toNonIndexed() : g)));
}

// Bật bóng đổ cho cả nhánh.
export function datBong(obj, cast = true, receive = true) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; } });
  return obj;
}

// Gộp các mesh tĩnh là con trực tiếp của cùng một nhóm và dùng chung vật liệu thành một mesh để giảm số lần vẽ.
// Bỏ qua mesh có đánh dấu giuRieng (chuyển động, đổi vật liệu, ẩn hiện riêng), mesh đăng ký làm thành phần,
// nút bấm, vật liệu trong suốt và InstancedMesh.
export function gopTinh(goc) {
  const dsNhom = [];
  goc.traverse((o) => { if (o.children.length > 1) dsNhom.push(o); });
  let truoc = 0, sau = 0;
  for (const g of dsNhom) {
    const theoVL = new Map();
    for (const c of g.children) {
      if (!c.isMesh || c.isInstancedMesh || c.children.length || !c.visible || Array.isArray(c.material)) continue;
      if (c.userData.giuRieng || c.userData.hanhDong || c.userData.ma || c.material.transparent) continue;
      if (!theoVL.has(c.material)) theoVL.set(c.material, []);
      theoVL.get(c.material).push(c);
    }
    for (const [vl, ds] of theoVL) {
      if (ds.length < 2) continue;
      const geos = ds.map((c) => {
        c.updateMatrix();
        const geo = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry.clone();
        for (const ten of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(ten)) geo.deleteAttribute(ten);
        if (!geo.attributes.normal) geo.computeVertexNormals();
        if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
        geo.clearGroups();
        geo.morphAttributes = {};
        geo.applyMatrix4(c.matrix);
        return geo;
      });
      const gop = mergeGeometries(geos, false);
      if (!gop) continue;
      const m = new THREE.Mesh(gop, vl);
      m.castShadow = ds.some((c) => c.castShadow);
      m.receiveShadow = true;
      m.name = `${g.name || 'nhóm'} (gộp)`;
      for (const c of ds) g.remove(c);
      g.add(m);
      truoc += ds.length; sau += 1;
    }
  }
  return { truoc, sau };
}
