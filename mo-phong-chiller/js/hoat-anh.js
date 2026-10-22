// Hoạt ảnh theo trạng thái vận hành: rotor máy nén, bánh công tác bơm, quạt tháp, quạt AHU,
// hạt nước trong ống, nước rơi trong tháp, dòng không khí, bọt sôi, giọt ngưng, kim đồng hồ, màn hình tủ điện.
// Mọi chuyển động nhân với dt (giây) nên tốc độ không phụ thuộc số khung hình.

import * as THREE from 'three';
import { VL } from './vat-lieu.js';
import { MAU } from './cau-hinh.js';
import { THIET_KE } from './mo-hinh-nhiet.js';

const TAU = Math.PI * 2;
const m4 = new THREE.Matrix4();
const v3 = new THREE.Vector3();
const q0 = new THREE.Quaternion();
const sc = new THREE.Vector3();
const AN = new THREE.Matrix4().makeScale(0, 0, 0);
const ngauNhien = (a, b) => a + Math.random() * (b - a);
const so1 = (x) => x.toFixed(1).replace('.', ',');

// Tốc độ hiển thị của hạt (m/s): nước theo lưu lượng thực chia tiết diện, nhân hệ số cho dễ nhìn.
function vanTocHat(t, so) {
  const k = so[t.luuLuong] || 0;
  if (t.luuLuong === 'qMC') return 0.75 * k;
  if (t.luuLuong === 'qDau') return 0.35 * k;
  if (t.luuLuong === 'qBu') return 0.4 * k;
  const A = Math.PI * (t.r * 0.92) ** 2;
  return Math.min(1.4, (k / 3600 / A) * 0.3);
}

export function taoHoatAnh(tb, ong) {
  const ch = tb.chiller.hoatAnh, th = tb.thap.hoatAnh, ah = tb.ahu.hoatAnh, bg = tb.bgn.hoatAnh;
  const st = { gocDuc: 0, gocBomNL: 0, gocBomGN: 0, gocQuat: 0, gocQuatAHU: 0, tg: 0, manHinh: 0, chatLuong: 'cao' };

  // ---- Nước rơi trong tháp ----
  const giot = th.giot, nG = giot.mesh.count;
  const gx = new Float32Array(nG), gy = new Float32Array(nG), gz = new Float32Array(nG);
  for (let i = 0; i < nG; i++) { gx[i] = ngauNhien(-giot.nua, giot.nua); gz[i] = ngauNhien(-giot.nua, giot.nua); gy[i] = ngauNhien(giot.yDuoi, giot.yTren); }
  let nGHien = -1;

  // ---- Không khí qua tháp ----
  const khi = th.khi, nK = khi.mesh.count;
  const MAT = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const kx = new Float32Array(nK), ky = new Float32Array(nK), kz = new Float32Array(nK), kPha = new Uint8Array(nK), kMat = new Uint8Array(nK), kDich = new Float32Array(nK);
  const qMat = MAT.map(([x, z]) => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-x, 0, -z)));
  const sinhKhi = (i, ngauNhienY = false) => {
    const m = Math.floor(Math.random() * 4), [nx, nz] = MAT[m], u = ngauNhien(-khi.nua + 0.2, khi.nua - 0.2);
    kMat[i] = m; kPha[i] = 0;
    kx[i] = nx * (khi.nua + 0.7) + (nz !== 0 ? u : 0);
    kz[i] = nz * (khi.nua + 0.7) + (nx !== 0 ? u : 0);
    ky[i] = ngauNhien(khi.yChop[0] + 0.12, khi.yChop[1] - 0.08);
    kDich[i] = ngauNhien(0.1, 1.1);
    if (ngauNhienY && Math.random() < 0.6) { kPha[i] = 1; kx[i] *= 0.4; kz[i] *= 0.4; ky[i] = ngauNhien(khi.yChop[1], khi.yTren); }
  };
  for (let i = 0; i < nK; i++) sinhKhi(i, true);

  // ---- Không khí qua AHU: mỗi hạt một đường gấp khúc (toạ độ cục bộ AHU) ----
  const A = ah.khi.A, nA = ah.khi.mesh.count;
  const yG = (A.y0 + A.y1) / 2;
  const duongAHU = [];
  for (let i = 0; i < nA; i++) {
    const ox = ngauNhien(-0.6, 0.6), oy = ngauNhien(yG - 0.65, yG + 0.65), th0 = ngauNhien(0, TAU);
    const ox2 = ngauNhien(-0.4, 0.4), oz = ngauNhien(-0.18, 0.18), oy2 = ngauNhien(-0.18, 0.18);
    const d = [
      [ox, oy, 2.35], [ox, oy, 0.45], [ox, oy, -0.38], [ox * 0.3, A.yQuat + (oy - yG) * 0.3, -0.52],
      [Math.cos(th0) * 0.45, A.yQuat + Math.sin(th0) * 0.45, -0.8], [ox2, A.y1 - 0.15, A.zCuaRa + oz],
      [ox2, 2.75, A.zCuaRa + oz], [-0.45, 2.98 + oy2, A.zCuaRa + oz], [-1.9, 2.98 + oy2, A.zCuaRa + oz],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const l = [0];
    for (let k = 1; k < d.length; k++) l.push(l[k - 1] + d[k].distanceTo(d[k - 1]));
    duongAHU.push({ d, l, s: Math.random() * l.at(-1) });
  }
  const mauNong = new THREE.Color(MAU.khiNong), mauLanh = new THREE.Color(MAU.khiLanh), mauTam = new THREE.Color();

  // ---- Bọt sôi và giọt ngưng trong bình ----
  const taoHatBinh = (cfg) => {
    const n = cfg.mesh.count, x = new Float32Array(n), y = new Float32Array(n), z = new Float32Array(n), r = new Float32Array(n);
    const sinh = (i, batKy) => {
      x[i] = ngauNhien(cfg.x0, cfg.x1);
      const a = ngauNhien(0, TAU), rr = Math.sqrt(Math.random()) * cfg.R * 0.85;
      z[i] = cfg.zTam + Math.cos(a) * rr;
      const yMin = cfg.yDuoi, yMax = cfg.yMat;
      y[i] = cfg.yTam + (batKy ? ngauNhien(yMin, yMax) : cfg.kieu === 'len' ? yMin + Math.random() * 0.05 : yMax - Math.random() * 0.03);
      const rel = y[i] - cfg.yTam, zr = z[i] - cfg.zTam;
      if (rel * rel + zr * zr > (cfg.R * 0.95) ** 2) z[i] = cfg.zTam + zr * 0.5;
      r[i] = ngauNhien(0.004, 0.009);
    };
    for (let i = 0; i < n; i++) sinh(i, true);
    return { cfg, n, x, y, z, r, sinh };
  };
  const bot = taoHatBinh(ch.botSoi), ngung = taoHatBinh(ch.giotNgung);

  // ---- Kim đồng hồ ----
  for (const d of ong.dongHo) d.goc = null;

  function capNhatHatBinh(h, toc, dt, hien) {
    const { cfg } = h;
    const nHien = hien ? Math.round(h.n * Math.min(1, toc)) : 0;
    for (let i = 0; i < h.n; i++) {
      if (i >= nHien) { cfg.mesh.setMatrixAt(i, AN); continue; }
      if (cfg.kieu === 'len') { h.y[i] += (0.12 + h.r[i] * 8) * dt; if (h.y[i] > cfg.yTam + cfg.yMat) h.sinh(i, false); }
      else { h.y[i] -= 0.45 * dt; if (h.y[i] < cfg.yTam + cfg.yDuoi) h.sinh(i, false); }
      m4.makeScale(h.r[i], h.r[i], h.r[i]).setPosition(h.x[i], h.y[i], h.z[i]);
      cfg.mesh.setMatrixAt(i, m4);
    }
    cfg.mesh.instanceMatrix.needsUpdate = true;
  }

  function capNhat(dtThuc, so, { tocDo = 1, hienBinh = { binhBayHoi: false, binhNgung: false } } = {}) {
    const dt = Math.min(0.1, dtThuc) * tocDo;
    st.tg += dtThuc;
    const thap = st.chatLuong === 'thap';

    // Máy nén: rotor đực theo động cơ, rotor cái quay ngược với tỉ số 4:6
    st.gocDuc += so.nMayNen * TAU * 0.8 * dt;
    ch.rotorDuc.rotation.x = st.gocDuc;
    ch.rotoDongCo.rotation.x = st.gocDuc;
    ch.rotorCai.rotation.x = -st.gocDuc * (4 / 6);
    ch.trucCai.rotation.x = ch.rotorCai.rotation.x;
    const dx = -(1 - so.vanTruot) * 0.16;
    ch.vanTruot.mesh.position.x = ch.vanTruot.x0 + dx;
    ch.vanTruot.can.position.x = 0.64 + dx / 2;

    // Bơm
    st.gocBomNL += so.nBomNL * TAU * 1.6 * dt;
    st.gocBomGN += so.nBomGN * TAU * 1.6 * dt;
    tb.bomNL.quay.rotation.x = st.gocBomNL;
    tb.bomGN.quay.rotation.x = st.gocBomGN;

    // Quạt tháp quay quanh trục đứng
    st.gocQuat += so.nQuat * TAU * 0.55 * dt;
    th.quat.rotation.y = -st.gocQuat;

    // Nước rơi trong tháp: tỉ lệ theo lưu lượng giải nhiệt
    const fGN = so.qGN / THIET_KE.luuLuongGN;
    const nGH = Math.round(nG * Math.min(1, fGN) * (thap ? 0.45 : 1));
    for (let i = 0; i < nG; i++) {
      if (i >= nGH) { if (nGHien !== nGH) giot.mesh.setMatrixAt(i, AN); continue; }
      const trongDem = gy[i] < giot.yDem[1] && gy[i] > giot.yDem[0];
      gy[i] -= (trongDem ? 1.0 : 1.9) * dt; // chậm lại khi chảy thành màng trên tấm đệm
      if (gy[i] < giot.yDuoi) { gy[i] = giot.yTren - Math.random() * 0.05; gx[i] = ngauNhien(-giot.nua, giot.nua); gz[i] = ngauNhien(-giot.nua, giot.nua); }
      giot.mesh.setMatrixAt(i, m4.makeTranslation(gx[i], gy[i], gz[i]));
    }
    nGHien = nGH;
    giot.mesh.instanceMatrix.needsUpdate = true;
    th.nonPhun.visible = fGN > 0.05;
    VL.phun.opacity = 0.12 + 0.12 * Math.min(1, fGN) + 0.03 * Math.sin(st.tg * 9);

    // Không khí: vào ngang qua cửa chớp, đi lên qua khối đệm và quạt
    const nKH = Math.round(nK * so.nQuat * (thap ? 0.5 : 1));
    for (let i = 0; i < nK; i++) {
      if (i >= nKH) { khi.mesh.setMatrixAt(i, AN); continue; }
      const [nx, nz] = MAT[kMat[i]];
      if (kPha[i] === 0) {
        const buoc = 1.1 * so.nQuat * dt;
        kx[i] -= nx * buoc; kz[i] -= nz * buoc;
        if (nx * kx[i] + nz * kz[i] < kDich[i]) kPha[i] = 1;
        khi.mesh.setMatrixAt(i, m4.compose(v3.set(kx[i], ky[i], kz[i]), qMat[kMat[i]], sc.set(1, 1, 1)));
      } else {
        ky[i] += (1.2 + 0.8 * (ky[i] > 3.3 ? 1 : 0)) * so.nQuat * dt;
        const r = Math.hypot(kx[i], kz[i]);
        if (ky[i] > 3.2 && r > khi.rQuat * 0.9) { kx[i] *= 0.97; kz[i] *= 0.97; }
        if (ky[i] > khi.yTren) sinhKhi(i);
        khi.mesh.setMatrixAt(i, m4.compose(v3.set(kx[i], ky[i], kz[i]), q0.identity(), sc.set(1, 1, 1)));
      }
    }
    khi.mesh.instanceMatrix.needsUpdate = true;

    // Mặt nước bể tháp gợn sóng khi có nước rơi
    if ((st.tg * 30) % 2 < 1) {
      const p = th.matNuoc.geometry.attributes.position;
      const bd = 0.012 * Math.min(1, fGN);
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i);
        p.setY(i, bd * (Math.sin(x * 7 + st.tg * 5) * Math.cos(z * 6 - st.tg * 4) + 0.5 * Math.sin((x + z) * 11 + st.tg * 7)));
      }
      p.needsUpdate = true;
    }
    th.phao.position.y = 0.006 * Math.sin(st.tg * 2.3) * Math.min(1, fGN);

    // AHU: bánh quạt, lá van gió, hạt không khí đổi màu sau dàn coil, giọt nước ngưng
    st.gocQuatAHU += so.nQuatAHU * TAU * 1.1 * dt;
    ah.banhQuat.rotation.z = st.gocQuatAHU;
    const moVan = so.nQuatAHU;
    ah.laVanGio.diem.forEach((p, i) => ah.laVanGio.mesh.setMatrixAt(i, m4.compose(p, q0.setFromAxisAngle(v3.set(1, 0, 0), (1 - moVan) * 1.45), sc.set(1, 1, 1))));
    ah.laVanGio.mesh.instanceMatrix.needsUpdate = true;
    const nAH = so.nQuatAHU > 0.05 ? Math.round(nA * (thap ? 0.5 : 1)) : 0;
    const dangLanh = so.qAHU > 5;
    for (let i = 0; i < nA; i++) {
      if (i >= nAH) { ah.khi.mesh.setMatrixAt(i, AN); continue; }
      const dd = duongAHU[i];
      dd.s = (dd.s + 1.3 * so.nQuatAHU * dt) % dd.l.at(-1);
      let k = 1;
      while (k < dd.l.length - 1 && dd.l[k] < dd.s) k++;
      const u = (dd.s - dd.l[k - 1]) / (dd.l[k] - dd.l[k - 1]);
      v3.lerpVectors(dd.d[k - 1], dd.d[k], u);
      ah.khi.mesh.setMatrixAt(i, m4.makeTranslation(v3.x, v3.y, v3.z));
      const lanh = dangLanh ? Math.min(1, Math.max(0, (0.3 - v3.z) / 0.6)) * Math.min(1, so.qAHU / Math.max(1, so.qCan)) : 0;
      ah.khi.mesh.setColorAt(i, mauTam.copy(mauNong).lerp(mauLanh, lanh));
    }
    ah.khi.mesh.instanceMatrix.needsUpdate = true;
    if (ah.khi.mesh.instanceColor) ah.khi.mesh.instanceColor.needsUpdate = true;
    const gn = ah.giotNgung;
    for (let i = 0; i < gn.mesh.count; i++) {
      if (!dangLanh || so.nQuatAHU < 0.1) { gn.mesh.setMatrixAt(i, AN); continue; }
      const chu = 0.9 + (i % 7) * 0.13;
      const t = ((st.tg + i * 0.37) % chu) / chu;
      gn.mesh.setMatrixAt(i, m4.makeTranslation(-0.65 + ((i * 0.618) % 1) * 1.3, gn.yTren - t * (gn.yTren - gn.yDuoi), -0.12 + ((i * 0.37) % 1) * 0.24));
    }
    gn.mesh.instanceMatrix.needsUpdate = true;

    // Bình giãn nở: màng dịch lên khi nước lạnh ấm lên (nước nở ra)
    const tTB = (so.tCapNL + so.tHoiNL) / 2;
    const yMang = 0.66 + Math.max(0, Math.min(1, (tTB - 6) / 22)) * 0.2;
    bg.mang.position.y += (yMang - bg.mang.position.y) * Math.min(1, dt * 2);
    const hN = bg.mang.position.y - bg.yDay;
    bg.nuoc.scale.y = hN;
    bg.nuoc.position.y = bg.yDay + hN / 2;

    // Hạt chảy trong ống: đúng tuyến, đúng chiều, tốc độ theo lưu lượng; dừng khi bơm/máy nén dừng
    const hat = ong.hat;
    if (hat.visible) {
      for (const t of ong.dsTuyen) {
        if (t.soHat === undefined) continue;
        if (!t.hienHat) { for (let k = 0; k < t.soHat; k++) hat.setMatrixAt(t.hat0 + k, AN); continue; }
        t.pha = (t.pha + vanTocHat(t, so) * dt) % t.tuyen.dai;
        const buoc = t.tuyen.dai / t.soHat;
        for (let k = 0; k < t.soHat; k++) {
          if (thap && k % 2) { hat.setMatrixAt(t.hat0 + k, AN); continue; }
          const s = (k * buoc + t.pha) % t.tuyen.dai;
          const { p } = t.tuyen.diemTai(s, v3);
          m4.makeScale(t.rHat, t.rHat, t.rHat).setPosition(p);
          hat.setMatrixAt(t.hat0 + k, m4);
        }
      }
      hat.instanceMatrix.needsUpdate = true;
    }

    // Sọc nước chảy trong ống trao đổi nhiệt (khi xem mặt cắt)
    const vNL = (so.qNL / THIET_KE.luuLuongNL) * 0.9, vGN = (so.qGN / THIET_KE.luuLuongGN) * 0.9;
    tb.chiller.boOng[0].pass.forEach((p) => { p.kt.offset.y -= p.chieu * vNL * dt; });
    tb.chiller.boOng[1].pass.forEach((p) => { p.kt.offset.y -= p.chieu * vGN * dt; });

    // Bọt sôi trong bình bay hơi, giọt ngưng trong bình ngưng
    capNhatHatBinh(bot, so.qMC * 1.2, dt, hienBinh.binhBayHoi);
    capNhatHatBinh(ngung, so.qMC * 1.2, dt, hienBinh.binhNgung);

    // Kim đồng hồ (làm mượt)
    for (const d of ong.dongHo) {
      const v = so[d.khoa] ?? d.min;
      const f = Math.max(0, Math.min(1, (v - d.min) / (d.max - d.min)));
      const goc = (225 - 270 * f) * (Math.PI / 180);
      d.goc = d.goc === null ? goc : d.goc + (goc - d.goc) * Math.min(1, dtThuc * 4);
      d.kim.rotation.z = d.goc;
    }

    // Đèn và màn hình tủ điều khiển
    const nhay = Math.sin(st.tg * 6) > 0;
    VL.denXanh.emissive.set(so.ttMN === 'chay' ? '#36e070' : '#000000');
    VL.denVang.emissive.set(['cho-luu-luong', 'xac-nhan', 'khoi-dong', 'cho-tai'].includes(so.ttMN) && nhay ? '#ffc21a' : '#000000');
    VL.denDo.emissive.set(so.ttMN === 'bao-ve' ? '#ff3030' : '#000000');
    VL.kinhXem.emissive.set(so.ttMN === 'khoi-dong' && nhay ? '#3a6a3a' : '#103a1c');
    st.manHinh -= dtThuc;
    if (st.manHinh <= 0) { st.manHinh = 0.25; veManHinh(ch.manHinh, so); }
  }

  return { capNhat, st };
}

// Màn hình cảm ứng trên tủ điều khiển
function veManHinh(mh, so) {
  const g = mh.ctx, W = mh.canvas.width, H = mh.canvas.height;
  g.fillStyle = '#0f1d2b'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1d3448'; g.fillRect(0, 0, W, 44);
  g.fillStyle = '#e8eef3'; g.font = 'bold 24px sans-serif'; g.textBaseline = 'middle';
  g.fillText('CH-01  CHILLER TRỤC VÍT', 14, 23);
  const mauTT = { chay: '#36e070', 'bao-ve': '#ff5050', tat: '#9fb0bf' }[so.ttMN] || '#ffc21a';
  g.fillStyle = mauTT; g.font = 'bold 22px sans-serif';
  g.textAlign = 'right'; g.fillText(so.tenTTMN.toUpperCase(), W - 14, 23); g.textAlign = 'left';
  const dong = [
    ['Nước lạnh', `vào ${so1(so.tHoiNL)} °C`, `ra ${so1(so.tCapNL)} °C`],
    ['Giải nhiệt', `vào ${so1(so.tVaoNg)} °C`, `ra ${so1(so.tRaNg)} °C`],
    ['Áp suất', `hút ${so1(so.pBayHoi)} bar`, `đẩy ${so1(so.pNgung)} bar`],
    ['Công suất', `${Math.round(so.qMay)} kW lạnh`, `${Math.round(so.pDien)} kW điện`],
    ['Van trượt', `${Math.round(so.vanTruot * 100)} %`, `EXV ${Math.round(so.exv)} %`],
  ];
  g.font = '21px sans-serif';
  dong.forEach(([a, b, c], i) => {
    const y = 72 + i * 40;
    g.fillStyle = '#8fb3cc'; g.fillText(a, 14, y);
    g.fillStyle = '#ffffff'; g.fillText(b, 170, y); g.fillText(c, 350, y);
  });
  g.fillStyle = so.ctNL ? '#36e070' : '#ff8a3d'; g.fillText(so.ctNL ? '● Lưu lượng NL' : '○ Lưu lượng NL', 14, 290);
  g.fillStyle = so.ctGN ? '#36e070' : '#ff8a3d'; g.fillText(so.ctGN ? '● Lưu lượng GN' : '○ Lưu lượng GN', 260, 290);
  g.fillStyle = '#6f8aa0'; g.font = '16px sans-serif'; g.fillText('Giá trị giả lập minh họa', 14, 325);
  mh.kt.needsUpdate = true;
}
