// Cụm chiller trục vít giải nhiệt nước: khung, bình bay hơi (ngập lỏng), bình ngưng, máy nén trục vít
// nửa kín, cụm tách dầu, linh kiện đường lỏng, cảm biến, tủ điều khiển và ống luồn dây.
// Toạ độ cục bộ: gốc ở mặt bệ dưới tâm cụm, X dọc trục bình, hộp nước đầu nối ở phía -X.
// Tuyến ống môi chất được định nghĩa ở đây (toạ độ thế giới) và dựng ống trong js/duong-ong.js.

import * as THREE from 'three';
import { VL, vlCat, khaiBaoMatCat, ketCauSoc, ketCauBien } from '../vat-lieu.js';
import {
  V, TRUC, mesh, nhom, truGiua, truTheoTruc, hop, geoLathe, vongBuLong, buLongTaiDiem, banSao, maTran, quatTuY,
  TuyenOng, geoRotor, geoDun, hinhChuNhatBo, diemChuViChuNhat, dungChung, geoMatBich,
} from '../hinh-hoc.js';
import { dangKy } from '../thanh-phan.js';
import { CAO_BE_CHILLER, VI_TRI, ONG, MAU } from '../cau-hinh.js';
import * as PK from './phu-kien.js';

const BE = CAO_BE_CHILLER;
// Bình bay hơi (E) và bình ngưng (C): tâm, bán kính ngoài vỏ, chiều dày, bảo ôn, bán kính mặt sàng,
// cao độ tấm chia pass trong hộp nước (so với tâm).
const E = { y: 0.8, z: 0.42, R: 0.31, d: 0.012, bo: 0.04, rSang: 0.36, yNgan: -0.04 };
const C = { y: 0.8, z: -0.42, R: 0.28, d: 0.012, rSang: 0.33, yNgan: -0.03 };
const XS = 1.55; // mặt trong của hai mặt sàng
const X_NOI = -1.785; // tâm hộp nước đầu nối
const Y_VO = 1.58, Y_DUC = 1.655, Y_CAI = 1.495; // tâm vỏ máy nén, trục rotor đực, rotor cái
const R_ONG = 0.0095; // ống trao đổi nhiệt Ø19

// Vành khuyên dọc trục X.
function vanhX(rIn, rOut, x0, x1, vl, y, z, seg = 48) {
  const g = geoLathe([[rIn, x0], [rOut, x0], [rOut, x1], [rIn, x1], [rIn, x0]], seg);
  g.rotateZ(-Math.PI / 2);
  g.translate(0, y, z);
  return mesh(g, vl);
}

// Lưới ống tam giác trong vòng tròn bán kính R, lọc theo điều kiện dk(y, z) (toạ độ tương đối tâm).
function luoiOng(R, buoc, dk) {
  const out = [];
  for (let h = -30; h <= 30; h++) {
    const y = h * buoc * 0.866;
    for (let c = -30; c <= 30; c++) {
      const z = (c + (Math.abs(h) % 2 ? 0.5 : 0)) * buoc;
      if (y * y + z * z < (R - 0.028) ** 2 && dk(y, z)) out.push([y, z]);
    }
  }
  return out;
}

// Thể tích môi chất phía vỏ: phần hình tròn giữa hai cao độ y0..y1 (tương đối tâm), dọc trục X.
function geoKhoiMoiChat(R, y0, y1, dai) {
  const s = new THREE.Shape();
  const a0 = Math.asin(Math.max(-1, Math.min(1, y0 / R)));
  const a1 = Math.asin(Math.max(-1, Math.min(1, y1 / R)));
  s.absarc(0, 0, R, a0, a1, false); // bên phải từ y0 lên y1
  s.absarc(0, 0, R, Math.PI - a1, Math.PI - a0, false); // bên trái từ y1 xuống y0
  const g = new THREE.ExtrudeGeometry(s, { depth: dai, bevelEnabled: false, curveSegments: 32 });
  g.translate(0, 0, -dai / 2);
  g.rotateY(Math.PI / 2); // trục đùn Z -> X; hình đối xứng nên không bị lật
  return g;
}

export function dungChiller() {
  const goc = nhom('Cụm chiller');
  goc.position.set(VI_TRI.chiller.x, BE, VI_TRI.chiller.z);
  const W = (x, y, z) => V(VI_TRI.chiller.x + x, BE + y, VI_TRI.chiller.z + z); // cục bộ -> thế giới
  // Nhóm con dùng toạ độ thế giới (cho tuyến môi chất, cảm biến, dây)
  const nhomTG = nhom('Toạ độ thế giới');
  nhomTG.position.set(-VI_TRI.chiller.x, -BE, -VI_TRI.chiller.z);
  goc.add(nhomTG);

  dangKy('chiller', goc, {
    ten: 'Cụm chiller trục vít giải nhiệt nước', the: 'CH-01',
    chucNang: 'Làm lạnh nước từ 12 °C xuống 7 °C. Nhiệt lấy từ nước lạnh được môi chất mang sang bình ngưng và thải vào nước giải nhiệt.',
    cauTao: 'Khung đế, bình bay hơi ngập lỏng, bình ngưng ống chùm, máy nén trục vít nửa kín, cụm tách dầu, van tiết lưu điện tử, tủ điều khiển. Mô hình minh họa, không theo sản phẩm của hãng nào.',
    thongSo: 'chiller',
  });

  // Mặt cắt (toạ độ thế giới): bình bay hơi cắt góc trên-trước, bình ngưng cắt góc trên-sau, máy nén cắt nửa trước.
  const zC = VI_TRI.chiller.z;
  khaiBaoMatCat('binhBayHoi', [new THREE.Plane(V(0, 0, -1), zC + E.z), new THREE.Plane(V(0, -1, 0), BE + E.y)], true);
  khaiBaoMatCat('binhNgung', [new THREE.Plane(V(0, 0, 1), -(zC + C.z)), new THREE.Plane(V(0, -1, 0), BE + C.y)], true);
  khaiBaoMatCat('mayNen', [new THREE.Plane(V(0, 0, -1), zC)], true);

  const voChiller = []; // các phần vỏ ẩn được bằng nút "Ẩn vỏ chiller"
  const noiThat = []; // phần chỉ hiện khi cắt/ẩn vỏ (thể tích môi chất, nước trong hộp)
  const hoatAnh = {};

  // ---------------- Khung máy ----------------
  const khung = nhom('Khung máy');
  goc.add(khung);
  dangKy('ch-khung', khung, {
    ten: 'Khung máy và chân đế', cha: 'chiller',
    chucNang: 'Đỡ toàn bộ cụm, truyền tải trọng xuống bệ qua đệm chống rung để rung động máy nén không truyền vào kết cấu.',
    cauTao: 'Hai dầm chữ I dọc, các thanh giằng chữ C ngang, yên đỡ bình, cột và dầm đỡ máy nén, đệm cao su chống rung, bu lông neo vào bệ bê tông.',
  });
  // Bệ bê tông
  khung.add(hop(4.9, BE, 2.0, VL.betong, V(0.25, -BE / 2, 0)));
  // Dầm chữ I dọc
  const hinhI = new THREE.Shape([
    [-0.05, -0.1], [0.05, -0.1], [0.05, -0.088], [0.004, -0.088], [0.004, 0.088], [0.05, 0.088], [0.05, 0.1], [-0.05, 0.1],
    [-0.05, 0.088], [-0.004, 0.088], [-0.004, -0.088], [-0.05, -0.088],
  ].map(([a, b]) => new THREE.Vector2(a, b)));
  const dai = 4.4;
  const geoDam = geoDun(hinhI, dai, { cong: 2 });
  geoDam.rotateY(Math.PI / 2);
  for (const z of [-0.7, 0.7]) {
    const m = mesh(geoDam, VL.khung);
    m.position.set(0.25, 0.148, z);
    khung.add(m);
  }
  // Thanh giằng chữ C ngang
  const hinhC = new THREE.Shape([[-0.03, -0.08], [0.03, -0.08], [0.03, -0.07], [-0.022, -0.07], [-0.022, 0.07], [0.03, 0.07], [0.03, 0.08], [-0.03, 0.08]].map(([a, b]) => new THREE.Vector2(a, b)));
  const geoGiang = geoDun(hinhC, 1.3, { cong: 2 });
  const xGiang = [-1.85, -1.3, -0.7, 0.8, 1.3, 1.85, 2.35];
  khung.add(banSao(geoGiang, VL.khung, xGiang.map((x) => maTran(V(x, 0.168, 0)))));
  // Đệm chống rung và bu lông neo
  const viTriDem = [];
  for (const x of [-1.7, 0.05, 1.8, 2.3]) for (const z of [-0.7, 0.7]) viTriDem.push([x, z]);
  khung.add(banSao(dungChung('demDe', () => new THREE.BoxGeometry(0.32, 0.012, 0.18)), VL.thepToi, viTriDem.map(([x, z]) => maTran(V(x, 0.006, z)))));
  khung.add(banSao(dungChung('demCaoSu', () => new THREE.BoxGeometry(0.18, 0.03, 0.15)), VL.caoSu, viTriDem.map(([x, z]) => maTran(V(x, 0.027, z)))));
  khung.add(banSao(dungChung('demTren', () => new THREE.BoxGeometry(0.2, 0.006, 0.17)), VL.thepToi, viTriDem.map(([x, z]) => maTran(V(x, 0.045, z)))));
  const neo = [];
  for (const [x, z] of viTriDem) neo.push(V(x - 0.13, 0.012, z), V(x + 0.13, 0.012, z));
  khung.add(buLongTaiDiem(neo, 'y', { co: 0.012, dai: 0.06, vl: VL.thep, mu: true }));
  // Yên đỡ bình (đúc theo cung bình)
  const yenDo = (rCung, rong, yTam, zTam) => {
    const s = new THREE.Shape();
    const ySuon = yTam - Math.sqrt(rCung * rCung - (rong / 2) ** 2);
    const a = Math.atan2(ySuon - yTam, rong / 2);
    s.moveTo(-rong / 2, 0.248);
    s.lineTo(rong / 2, 0.248);
    s.lineTo(rong / 2, ySuon);
    s.absarc(0, yTam, rCung, a, Math.PI - a, true);
    s.lineTo(-rong / 2, 0.248);
    const g = geoDun(s, 0.02, { cong: 24 });
    g.rotateY(Math.PI / 2);
    g.translate(0, 0, zTam);
    return g;
  };
  const geoYenE = yenDo(E.R + E.bo, 0.56, E.y, E.z);
  const geoYenC = yenDo(C.R, 0.48, C.y, C.z);
  for (const x of [-1.3, 1.3]) {
    khung.add(mesh(geoYenE, VL.khung, { vt: V(x, 0, 0) }), mesh(geoYenC, VL.khung, { vt: V(x, 0, 0) }));
    khung.add(hop(0.14, 0.012, 0.6, VL.khung, V(x, 0.254, E.z)), hop(0.14, 0.012, 0.52, VL.khung, V(x, 0.254, C.z)));
  }
  // Cột và dầm đỡ máy nén (đặt trong khe giữa hai bình)
  for (const x of [-0.7, 0.8]) {
    khung.add(hop(0.08, 1.21 - 0.248, 0.08, VL.khung, V(x, (1.21 + 0.248) / 2, -0.035)));
    khung.add(hop(0.16, 0.012, 0.12, VL.khung, V(x, 0.254, -0.035)));
  }
  khung.add(hop(1.8, 0.08, 0.12, VL.khung, V(0.05, 1.25, -0.02)));
  // Đệm cao su dưới chân máy nén
  for (const x of [-0.6, 0.7]) khung.add(hop(0.12, 0.02, 0.1, VL.caoSu, V(x, 1.3, -0.02)));

  // ---------------- Bình bay hơi ----------------
  const bbh = nhom('Bình bay hơi');
  goc.add(bbh);
  dangKy('ch-bbh', bbh, {
    ten: 'Bình bay hơi', cha: 'chiller',
    chucNang: 'Nước lạnh chảy trong ống; môi chất lỏng ngập quanh ống, sôi ở khoảng 5 °C và lấy nhiệt của nước. Hơi sinh ra được máy nén hút đi.',
    cauTao: 'Vỏ thép hình trụ nằm ngang bọc bảo ôn 40 mm, hai mặt sàng giữ bó ống đồng Ø19, tấm đỡ ống, hộp nước 2 pass có nắp tháo được, đầu hút hơi ở đỉnh, đầu cấp lỏng ở đáy.',
    thongSo: 'bbh',
  });
  const cE = (vl) => vlCat(vl, 'binhBayHoi');
  // Vỏ thép (mở hai đầu, bên trong nhìn thấy khi cắt)
  const voE = truGiua(V(-XS, E.y, E.z), V(XS, E.y, E.z), E.R, cE(VL.thepSon), { seg: 64, mo: true });
  const voETrong = truGiua(V(-XS, E.y, E.z), V(XS, E.y, E.z), E.R - E.d, cE(VL.thepSonSang), { seg: 64, mo: true });
  // Lớp bảo ôn và hai vành đầu thể hiện chiều dày
  const baoOn = nhom('Lớp bảo ôn');
  baoOn.add(truGiua(V(-1.52, E.y, E.z), V(1.52, E.y, E.z), E.R + E.bo, cE(VL.baoOn), { seg: 64, mo: true }));
  for (const x of [-1.52, 1.52]) {
    const vanh = mesh(new THREE.RingGeometry(E.R, E.R + E.bo, 64), cE(VL.baoOnCat));
    vanh.position.set(x, E.y, E.z);
    vanh.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
    baoOn.add(vanh);
  }
  // Mặt cắt lớp bảo ôn (chỉ hiện khi bật mặt cắt): dải vuông góc mặt phẳng cắt
  const capCatE = nhom('Mặt cắt bảo ôn');
  const dai1 = 3.04;
  const dai2 = 3.1;
  const dCat = (w, h, vl, x, y, z, ry, rx) => { const m = mesh(new THREE.PlaneGeometry(w, h), vl, { bong: false }); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); return m; };
  capCatE.add(
    dCat(dai1, E.bo, VL.baoOnCat, 0, E.y + E.R + E.bo / 2, E.z + 0.0005, 0, 0),
    dCat(dai2, E.d, VL.thepSonSang, 0, E.y + E.R - E.d / 2, E.z + 0.0005, 0, 0),
    dCat(dai1, E.bo, VL.baoOnCat, 0, E.y + 0.0005, E.z + E.R + E.bo / 2, 0, -Math.PI / 2),
    dCat(dai2, E.d, VL.thepSonSang, 0, E.y + 0.0005, E.z + E.R - E.d / 2, 0, -Math.PI / 2),
  );
  capCatE.visible = false;
  bbh.add(voE, voETrong, baoOn, capCatE);
  dangKy('ch-bbh-vo', voE, { ten: 'Thân bình bay hơi', cha: 'ch-bbh', chucNang: 'Vỏ chịu áp bằng thép tấm cuộn, chứa môi chất ở phía ngoài ống.' });
  dangKy('ch-bbh-baoon', baoOn, { ten: 'Lớp bảo ôn bình bay hơi', cha: 'ch-bbh', chucNang: 'Xốp cao su lưu hóa dày 40 mm ngăn nhiệt từ phòng máy truyền vào và chống đọng sương trên vỏ lạnh.' });
  voChiller.push(voE, voETrong, baoOn);

  // Mặt sàng hai đầu
  const matSangE = nhom('Mặt sàng');
  for (const x of [-XS - 0.02, XS + 0.02]) matSangE.add(truTheoTruc(E.rSang, 0.04, 'x', cE(VL.thepSonSang), V(x, E.y, E.z), { seg: 64 }));
  bbh.add(matSangE);
  dangKy('ch-bbh-sang', matSangE, { ten: 'Mặt sàng bình bay hơi', cha: 'ch-bbh', chucNang: 'Tấm thép dày khoan lỗ, các ống trao đổi nhiệt được nong chặt vào lỗ để ngăn nước với môi chất.' });

  // Bó ống: pass 1 (dưới tấm chia) và pass 2 (trên tấm chia)
  const ongE = luoiOng(E.R - E.d, 0.042, (y) => y < 0.14 && Math.abs(y - E.yNgan) > 0.012);
  const boOngE = dungBoOng(ongE, E, 'nuocLanhHoi', 'nuocLanhCap', 1);
  bbh.add(boOngE.nhom);
  dangKy('ch-bbh-ong', boOngE.nhom, {
    ten: 'Bó ống bình bay hơi (2 pass)', cha: 'ch-bbh',
    chucNang: 'Nước lạnh hồi vào nửa dưới (pass 1), quay đầu ở hộp nước cuối, ra ở nửa trên (pass 2). Nước đi trong ống, môi chất ở ngoài ống: hai chất chỉ trao đổi nhiệt qua thành ống đồng.',
  });
  // Tấm đỡ ống
  bbh.add(banSao(dungChung('tamDoE', () => { const g = new THREE.CylinderGeometry(E.R - E.d - 0.004, E.R - E.d - 0.004, 0.01, 48); g.rotateZ(Math.PI / 2); return g; }), cE(VL.thepSonSang), [-0.78, 0, 0.78].map((x) => maTran(V(x, E.y, E.z)))));
  // Môi chất phía vỏ: lỏng ngập ống (dưới) và hơi (trên)
  const longE = mesh(geoKhoiMoiChat(E.R - E.d - 0.002, -(E.R - E.d), 0.17, 2 * XS - 0.01), cE(trongSuot('#9b84e0', 0.32)), { bong: false });
  longE.position.set(0, E.y, E.z);
  const hoiE = mesh(geoKhoiMoiChat(E.R - E.d - 0.002, 0.17, E.R - E.d - 0.001, 2 * XS - 0.01), cE(trongSuot('#c9bdf2', 0.14)), { bong: false });
  hoiE.position.set(0, E.y, E.z);
  longE.renderOrder = hoiE.renderOrder = 2;
  bbh.add(longE, hoiE);
  noiThat.push({ obj: longE, nhom: 'binhBayHoi' }, { obj: hoiE, nhom: 'binhBayHoi' });
  // Bọt hơi trong lỏng
  const bot = new THREE.InstancedMesh(dungChung('bot', () => new THREE.SphereGeometry(1, 6, 4)), new THREE.MeshBasicMaterial({ color: '#f2efff', transparent: true, opacity: 0.85 }), 160);
  bot.frustumCulled = false;
  bbh.add(bot);
  noiThat.push({ obj: bot, nhom: 'binhBayHoi' });
  hoatAnh.botSoi = { mesh: bot, x0: -XS + 0.05, x1: XS - 0.05, yTam: E.y, zTam: E.z, R: E.R - 0.03, yDuoi: -0.24, yMat: 0.17, kieu: 'len' };

  // Hộp nước đầu nối (-X), tấm chia pass, nắp tháo được, đầu nối nước
  const hopE = dungHopNuoc(E, cE, 'binhBayHoi');
  bbh.add(hopE.nhom);
  dangKy('ch-bbh-hop', hopE.nhom, {
    ten: 'Hộp nước bình bay hơi', cha: 'ch-bbh',
    chucNang: 'Chia nước thành 2 pass bằng tấm ngăn ngang. Kiểu hộp có đầu nối bên hông: tháo nắp để vệ sinh ống mà không phải tháo đường ống.',
  });
  dangKy('ch-bbh-nap', hopE.nap, { ten: 'Nắp hộp nước bình bay hơi', cha: 'ch-bbh', chucNang: 'Nắp thép bắt bằng vòng bu lông lên mặt bích hộp nước; có tai móc cẩu khi tháo.' });
  voChiller.push(...hopE.vo);
  noiThat.push(...hopE.noiThat);
  // Đầu nối nước lạnh: vào (hồi 12 °C) phía trước nửa dưới, ra (cấp 7 °C) trên đỉnh
  const yVaoE = E.y - 0.15;
  const noiE = nhom('Đầu nối nước lạnh');
  noiE.add(truGiua(V(X_NOI, yVaoE, E.z + 0.18), V(X_NOI, yVaoE, 0.95 - 0.02), ONG.nuocLanh.r, VL.thepSon, { seg: 28 }));
  noiE.add(mesh(geoMatBich(ONG.nuocLanh.r, ONG.nuocLanh.r + 0.06, 0.022), VL.thepSon, { vt: V(X_NOI, yVaoE, 0.95) }));
  noiE.children.at(-1).quaternion.copy(quatTuY(TRUC.z));
  noiE.add(truGiua(V(X_NOI, E.y + 0.2, E.z), V(X_NOI, 1.41 - 0.02, E.z), ONG.nuocLanh.r, VL.thepSon, { seg: 28 }));
  noiE.add(mesh(geoMatBich(ONG.nuocLanh.r, ONG.nuocLanh.r + 0.06, 0.022), VL.thepSon, { vt: V(X_NOI, 1.41, E.z) }));
  bbh.add(noiE);
  dangKy('ch-bbh-noi', noiE, { ten: 'Đầu nối nước lạnh cấp và hồi', cha: 'ch-bbh', chucNang: 'Đầu vào (hồi 12 °C) ở nửa dưới phía trước, đầu ra (cấp 7 °C) trên đỉnh hộp nước. Mặt bích DN150.' });
  // Hộp quay đầu (+X)
  const dauE = dungHopQuayDau(E, cE);
  bbh.add(dauE.nhom);
  voChiller.push(...dauE.vo);
  // Đầu nối môi chất: hút hơi ở đỉnh, cấp lỏng ở đáy
  bbh.add(truGiua(V(-1.3, E.y + 0.2, E.z), V(-1.3, 1.18, E.z), 0.07, VL.thepSon, { seg: 24 }));
  bbh.add(truGiua(V(-1.3, E.y + E.R, E.z), V(-1.3, E.y + E.R + 0.025, E.z), 0.095, VL.baoOn, { seg: 24 }));
  bbh.add(mesh(geoMatBich(0.07, 0.125, 0.02), VL.thepSon, { vt: V(-1.3, 1.2, E.z) }));
  bbh.add(truGiua(V(1.35, E.y - 0.2, E.z), V(1.35, 0.45, E.z), 0.03, VL.dong, { seg: 16 }));
  // Van an toàn trên đỉnh bình
  const vatE = PK.vanAnToan();
  vatE.obj.position.set(0.35, E.y + E.R + E.bo, E.z);
  bbh.add(vatE.obj);
  dangKy('ch-bbh-vat', vatE.obj, { ten: 'Van an toàn bình bay hơi', cha: 'ch-bbh', chucNang: vatE.chucNang });

  // ---------------- Bình ngưng ----------------
  const bn = nhom('Bình ngưng');
  goc.add(bn);
  dangKy('ch-bn', bn, {
    ten: 'Bình ngưng', cha: 'chiller',
    chucNang: 'Hơi môi chất cao áp từ máy nén ngưng tụ trên mặt ngoài ống, nhả nhiệt cho nước giải nhiệt chảy trong ống (30 → 35 °C). Lỏng ngưng gom ở đáy bình.',
    cauTao: 'Vỏ thép hình trụ nằm ngang, mặt sàng, bó ống đồng có cánh, hộp nước 2 pass có nắp và vòng bu lông, yên đỡ, đầu vào hơi trên đỉnh, đầu ra lỏng ở đáy, van an toàn.',
    thongSo: 'bn',
  });
  const cC = (vl) => vlCat(vl, 'binhNgung');
  const voC = truGiua(V(-XS, C.y, C.z), V(XS, C.y, C.z), C.R, cC(VL.binhNgung), { seg: 64, mo: true });
  const voCTrong = truGiua(V(-XS, C.y, C.z), V(XS, C.y, C.z), C.R - C.d, cC(VL.thepSonSang), { seg: 64, mo: true });
  const capCatC = nhom('Mặt cắt vỏ bình ngưng');
  capCatC.add(
    dCat(dai2, C.d, VL.thepSonSang, 0, C.y + C.R - C.d / 2, C.z - 0.0005, Math.PI, 0),
    dCat(dai2, C.d, VL.thepSonSang, 0, C.y + 0.0005, C.z - C.R + C.d / 2, 0, -Math.PI / 2),
  );
  capCatC.visible = false;
  bn.add(voC, voCTrong, capCatC);
  dangKy('ch-bn-vo', voC, { ten: 'Thân bình ngưng', cha: 'ch-bn', chucNang: 'Vỏ thép chịu áp cao (khoảng 9–10 bar), chứa hơi và lỏng môi chất quanh bó ống.' });
  voChiller.push(voC, voCTrong);
  const matSangC = nhom('Mặt sàng');
  for (const x of [-XS - 0.02, XS + 0.02]) matSangC.add(truTheoTruc(C.rSang, 0.04, 'x', cC(VL.thepSonSang), V(x, C.y, C.z), { seg: 64 }));
  bn.add(matSangC);
  dangKy('ch-bn-sang', matSangC, { ten: 'Mặt sàng bình ngưng', cha: 'ch-bn', chucNang: 'Giữ hai đầu bó ống và ngăn nước giải nhiệt với môi chất.' });
  const ongC = luoiOng(C.R - C.d, 0.04, (y, z) => y < 0.17 && y > -0.2 && Math.abs(y - C.yNgan) > 0.012 && !(y > 0.1 && Math.abs(z) < 0.06));
  const boOngC = dungBoOng(ongC, C, 'nuocVaoNgung', 'nuocRaNgung', 1);
  bn.add(boOngC.nhom);
  dangKy('ch-bn-ong', boOngC.nhom, {
    ten: 'Bó ống bình ngưng (2 pass)', cha: 'ch-bn',
    chucNang: 'Nước giải nhiệt 30 °C vào nửa dưới, quay đầu, ra 35 °C ở nửa trên. Hơi môi chất ngưng thành giọt trên mặt ngoài ống rồi rơi xuống đáy bình.',
  });
  bn.add(banSao(dungChung('tamDoC', () => { const g = new THREE.CylinderGeometry(C.R - C.d - 0.004, C.R - C.d - 0.004, 0.01, 48); g.rotateZ(Math.PI / 2); return g; }), cC(VL.thepSonSang), [-0.78, 0, 0.78].map((x) => maTran(V(x, C.y, C.z)))));
  // Tấm chắn hơi dưới đầu vào hơi nóng
  bn.add(hop(0.3, 0.008, 0.14, cC(VL.thepSonSang), V(1.1, C.y + 0.2, C.z)));
  const hoiC = mesh(geoKhoiMoiChat(C.R - C.d - 0.002, -0.2, C.R - C.d - 0.001, 2 * XS - 0.01), cC(trongSuot('#f08a8a', 0.16)), { bong: false });
  hoiC.position.set(0, C.y, C.z);
  const longC = mesh(geoKhoiMoiChat(C.R - C.d - 0.002, -(C.R - C.d), -0.2, 2 * XS - 0.01), cC(trongSuot('#b8487f', 0.5)), { bong: false });
  longC.position.set(0, C.y, C.z);
  hoiC.renderOrder = longC.renderOrder = 2;
  bn.add(hoiC, longC);
  noiThat.push({ obj: hoiC, nhom: 'binhNgung' }, { obj: longC, nhom: 'binhNgung' });
  const giot = new THREE.InstancedMesh(dungChung('giotNgung', () => { const g = new THREE.SphereGeometry(1, 6, 4); g.scale(1, 1.8, 1); return g; }), new THREE.MeshBasicMaterial({ color: '#d36b9b', transparent: true, opacity: 0.85 }), 140);
  giot.frustumCulled = false;
  bn.add(giot);
  noiThat.push({ obj: giot, nhom: 'binhNgung' });
  hoatAnh.giotNgung = { mesh: giot, x0: -XS + 0.05, x1: XS - 0.05, yTam: C.y, zTam: C.z, R: C.R - 0.03, yDuoi: -0.2, yMat: 0.17, kieu: 'xuong' };

  const hopC = dungHopNuoc(C, cC, 'binhNgung');
  bn.add(hopC.nhom);
  dangKy('ch-bn-hop', hopC.nhom, { ten: 'Hộp nước bình ngưng', cha: 'ch-bn', chucNang: 'Hộp nước 2 pass có tấm chia, mặt bích và vòng bu lông; nắp tháo được để thông rửa ống.' });
  dangKy('ch-bn-nap', hopC.nap, { ten: 'Nắp hộp nước bình ngưng', cha: 'ch-bn', chucNang: 'Nắp thép bắt bu lông; tháo ra để vệ sinh cáu cặn trong ống nước giải nhiệt.' });
  voChiller.push(...hopC.vo);
  noiThat.push(...hopC.noiThat);
  const yVaoC = C.y - 0.155;
  const noiC = nhom('Đầu nối nước giải nhiệt');
  noiC.add(truGiua(V(X_NOI, yVaoC, C.z - 0.15), V(X_NOI, yVaoC, -0.97 + 0.02), ONG.giaiNhiet.r, VL.binhNgung, { seg: 28 }));
  noiC.add(mesh(geoMatBich(ONG.giaiNhiet.r, ONG.giaiNhiet.r + 0.06, 0.024), VL.thepSon, { vt: V(X_NOI, yVaoC, -0.97) }));
  noiC.children.at(-1).quaternion.copy(quatTuY(V(0, 0, -1)));
  noiC.add(truGiua(V(X_NOI, C.y + 0.2, C.z), V(X_NOI, 1.38 - 0.02, C.z), ONG.giaiNhiet.r, VL.binhNgung, { seg: 28 }));
  noiC.add(mesh(geoMatBich(ONG.giaiNhiet.r, ONG.giaiNhiet.r + 0.06, 0.024), VL.thepSon, { vt: V(X_NOI, 1.38, C.z) }));
  bn.add(noiC);
  dangKy('ch-bn-noi', noiC, { ten: 'Đầu nối nước giải nhiệt vào và ra', cha: 'ch-bn', chucNang: 'Nước từ tháp vào ở nửa dưới phía sau, nước nóng ra trên đỉnh hộp nước. Mặt bích DN200.' });
  const dauC = dungHopQuayDau(C, cC);
  bn.add(dauC.nhom);
  voChiller.push(...dauC.vo);
  // Đầu vào hơi nóng (đỉnh) và đầu ra lỏng (đáy)
  bn.add(truGiua(V(1.1, C.y + 0.2, C.z), V(1.1, 1.1, C.z), 0.055, VL.binhNgung, { seg: 20 }));
  bn.add(mesh(geoMatBich(0.055, 0.105, 0.02), VL.thepSon, { vt: V(1.1, 1.12, C.z) }));
  bn.add(truGiua(V(1.35, C.y - 0.2, C.z), V(1.35, 0.48, C.z), 0.03, VL.dong, { seg: 16 }));
  for (const x of [-0.45, -0.25]) {
    const v = PK.vanAnToan();
    v.obj.position.set(x, C.y + C.R, C.z);
    bn.add(v.obj);
    if (x < -0.3) dangKy('ch-bn-vat', v.obj, { ten: 'Van an toàn bình ngưng', cha: 'ch-bn', chucNang: v.chucNang });
  }

  // ---------------- Máy nén trục vít ----------------
  const mn = nhom('Máy nén trục vít');
  goc.add(mn);
  dangKy('ch-mn', mn, {
    ten: 'Máy nén trục vít nửa kín', cha: 'chiller',
    chucNang: 'Hút hơi hạ áp từ bình bay hơi, nén trong các rãnh giữa cặp rotor ăn khớp rồi đẩy hơi cao áp sang bình tách dầu. Van trượt thay đổi tải từ 25 đến 100 %.',
    cauTao: 'Vỏ động cơ có gân, vỏ rotor đúc có lỗ hình số 8, vỏ cửa đẩy, bích ghép bằng bu lông, cặp rotor đực 4 răng – cái 6 rãnh, trục và ổ bi, van trượt điều chỉnh tải.',
    thongSo: 'mn',
  });
  const cM = (vl) => vlCat(vl, 'mayNen');
  const voMN = nhom('Vỏ máy nén');
  mn.add(voMN);
  dangKy('ch-mn-vo', voMN, { ten: 'Vỏ máy nén', cha: 'ch-mn', chucNang: 'Vỏ gang đúc ghép bằng bu lông qua các mặt bích; gân tăng cứng chịu áp suất nén.' });
  voChiller.push(voMN);
  // Vỏ động cơ (đồng trục rotor đực)
  const geoVoDC = dungChung('voDC', () => { const g = geoLathe([[0.215, -0.39], [0.23, -0.39], [0.23, 0.39], [0.215, 0.39], [0.215, -0.39]], 48); g.rotateZ(-Math.PI / 2); return g; });
  voMN.add(mesh(geoVoDC, cM(VL.mayNen), { vt: V(-0.56, Y_DUC, 0) }));
  // Nắp đầu động cơ và mặt bích hút
  const geoNap = dungChung('napDC', () => {
    const pts = [];
    for (let k = 0; k <= 10; k++) { const t = (k / 10) * Math.PI / 2; pts.push([0.07 + 0.16 * Math.cos(t), -0.07 * Math.sin(t)]); }
    const g = geoLathe(pts, 48, false);
    g.rotateZ(-Math.PI / 2);
    return g;
  });
  voMN.add(mesh(geoNap, cM(VL.mayNen), { vt: V(-0.95, Y_DUC, 0) }));
  voMN.add(truGiua(V(-1.02, Y_DUC, 0), V(-1.03, Y_DUC, 0), 0.07, cM(VL.mayNen), { seg: 24, mo: true }));
  const bichHut = mesh(geoMatBich(0.07, 0.125, 0.02), VL.mayNen, { vt: V(-1.05, Y_DUC, 0) });
  bichHut.quaternion.copy(quatTuY(V(-1, 0, 0)));
  mn.add(bichHut);
  // Gân vòng trên vỏ động cơ
  const geoGanVong = dungChung('ganVong', () => { const g = geoLathe([[0.229, -0.008], [0.252, -0.008], [0.252, 0.008], [0.229, 0.008], [0.229, -0.008]], 48); g.rotateZ(-Math.PI / 2); return g; });
  voMN.add(banSao(geoGanVong, cM(VL.mayNen), [-0.86, -0.72, -0.58, -0.44, -0.3].map((x) => maTran(V(x, Y_DUC, 0)))));
  // Gân dọc trên đỉnh vỏ động cơ
  for (const a of [0.5, Math.PI - 0.5]) voMN.add(hop(0.76, 0.018, 0.012, cM(VL.mayNen), V(-0.56, Y_DUC + Math.sin(a) * 0.236, Math.cos(a) * 0.236)));
  // Bích ghép động cơ – thân rotor
  voMN.add(vanhX(0.2, 0.27, -0.19, -0.15, cM(VL.mayNen), Y_DUC, 0));
  voMN.add(vongBuLong({ tam: V(-0.17, Y_DUC, 0), truc: 'x', rVong: 0.252, n: 16, co: 0.011, dai: 0.06, vl: cM(VL.thep) }));
  // Thân rotor: hình chữ nhật bo góc, khoét lỗ số 8 cho cặp rotor
  const hinhVo = hinhChuNhatBo(0.4, 0.46, 0.07);
  hinhVo.holes.push(duongSo8(Y_DUC - Y_VO, 0.094, Y_CAI - Y_VO, 0.109));
  const geoThan = new THREE.ExtrudeGeometry(hinhVo, { depth: 0.68, bevelEnabled: false, curveSegments: 20 });
  geoThan.rotateY(Math.PI / 2);
  voMN.add(mesh(geoThan, cM(VL.mayNen), { vt: V(-0.15, Y_VO, 0) }));
  // Bích chữ nhật hai đầu thân rotor, gân ngang và bu lông ghép
  const vanhCN = (them, day) => {
    const s = hinhChuNhatBo(0.4 + them, 0.46 + them, 0.07 + them / 2);
    s.holes.push(hinhChuNhatBo(0.4, 0.46, 0.07));
    const g = new THREE.ExtrudeGeometry(s, { depth: day, bevelEnabled: false, curveSegments: 16 });
    g.rotateY(Math.PI / 2);
    return g;
  };
  const geoBichCN = vanhCN(0.08, 0.035);
  for (const x of [-0.15, 0.495]) voMN.add(mesh(geoBichCN, cM(VL.mayNen), { vt: V(x, Y_VO, 0) }));
  voMN.add(banSao(vanhCN(0.04, 0.016), cM(VL.mayNen), [0.0, 0.17, 0.33].map((x) => maTran(V(x, Y_VO, 0)))));
  voMN.add(hop(0.6, 0.03, 0.014, cM(VL.mayNen), V(0.19, Y_VO + 0.245, 0)));
  for (const x of [-0.13, 0.513]) {
    const diem = diemChuViChuNhat(0.44, 0.5, 18).map(([z, y]) => V(x, Y_VO + y, z));
    voMN.add(buLongTaiDiem(diem, 'x', { co: 0.01, dai: 0.06, vl: cM(VL.thep) }));
  }
  // Vỏ cửa đẩy và nắp ổ bi
  const hinhDay = hinhChuNhatBo(0.4, 0.46, 0.07);
  hinhDay.holes.push(hinhChuNhatBo(0.36, 0.42, 0.05));
  const geoDay = new THREE.ExtrudeGeometry(hinhDay, { depth: 0.3, bevelEnabled: false, curveSegments: 16 });
  geoDay.rotateY(Math.PI / 2);
  voMN.add(mesh(geoDay, cM(VL.mayNen), { vt: V(0.53, Y_VO, 0) }));
  const geoMatDay = new THREE.ExtrudeGeometry(hinhChuNhatBo(0.4, 0.46, 0.07), { depth: 0.02, bevelEnabled: false, curveSegments: 16 });
  geoMatDay.rotateY(Math.PI / 2);
  voMN.add(mesh(geoMatDay, cM(VL.mayNen), { vt: V(0.83, Y_VO, 0) }));
  for (const [y, r] of [[Y_DUC, 0.07], [Y_CAI, 0.075]]) {
    voMN.add(truTheoTruc(r, 0.025, 'x', cM(VL.mayNen), V(0.862, y, 0), { seg: 32 }));
    voMN.add(vongBuLong({ tam: V(0.872, y, 0), truc: 'x', rVong: r - 0.014, n: 6, co: 0.008, dai: 0.03, vl: cM(VL.thep), mu: true }));
  }
  // Cửa đẩy trên đỉnh, chân máy nén
  mn.add(truGiua(V(0.7, Y_VO + 0.2, 0), V(0.7, 1.86, 0), 0.055, VL.mayNen, { seg: 20 }));
  mn.add(mesh(geoMatBich(0.055, 0.105, 0.02), VL.mayNen, { vt: V(0.7, 1.88, 0) }));
  mn.add(hop(0.1, 0.13, 0.28, VL.mayNen, V(-0.6, 1.375, 0)));
  mn.add(hop(0.1, 0.05, 0.3, VL.mayNen, V(0.7, 1.335, 0)));
  mn.add(truGiua(V(0.1, Y_VO - 0.23, -0.13), V(0.1, Y_VO - 0.24, -0.13), 0.022, VL.mayNen, { seg: 12 }));
  // Hộp đấu dây động cơ
  const hopDay = hop(0.24, 0.13, 0.22, VL.mayNen, V(-0.55, Y_DUC + 0.23 + 0.065, 0));
  mn.add(hopDay);
  dangKy('ch-mn-hopday', hopDay, { ten: 'Hộp đấu dây động cơ', cha: 'ch-mn', chucNang: 'Nơi đấu cáp động lực từ tủ điều khiển vào cuộn dây động cơ; cáp đi trong ống luồn dây.' });

  // Bên trong: động cơ, cặp rotor, trục, ổ bi, van trượt
  const dc = nhom('Động cơ');
  dc.add(mesh(dungChung('stator', () => { const g = geoLathe([[0.135, -0.29], [0.205, -0.29], [0.205, 0.29], [0.135, 0.29], [0.135, -0.29]], 40); g.rotateZ(-Math.PI / 2); return g; }), VL.thepToi, { vt: V(-0.59, Y_DUC, 0) }));
  const geoCuon = dungChung('cuonDay', () => { const g = new THREE.TorusGeometry(0.17, 0.032, 10, 36); g.rotateY(Math.PI / 2); return g; });
  dc.add(mesh(geoCuon, VL.dong, { vt: V(-0.895, Y_DUC, 0) }), mesh(geoCuon, VL.dong, { vt: V(-0.285, Y_DUC, 0) }));
  const roto = nhom('Rotor động cơ');
  roto.position.set(0, Y_DUC, 0);
  roto.add(truTheoTruc(0.128, 0.56, 'x', VL.thep, V(-0.59, 0, 0), { seg: 32 }));
  roto.add(banSao(dungChung('ganRoto', () => { const g = new THREE.BoxGeometry(0.56, 0.012, 0.03); return g; }), VL.nhom, [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    return maTran(V(-0.59, Math.cos(a) * 0.125, Math.sin(a) * 0.125), new THREE.Quaternion().setFromAxisAngle(TRUC.x, a));
  })));
  roto.add(truTheoTruc(0.03, 1.72, 'x', VL.inox, V(-0.07, 0, 0), { seg: 16 }));
  dc.add(roto);
  mn.add(dc);
  dangKy('ch-mn-dc', dc, { ten: 'Động cơ máy nén', cha: 'ch-mn', chucNang: 'Động cơ 3 pha nằm trong vỏ kín, được làm mát bằng chính dòng hơi hút đi qua khe stator – rotor. Truyền động trực tiếp cho rotor đực.' });

  const cap = nhom('Cặp rotor trục vít');
  const rotorDuc = mesh(dungChung('rotorDuc', () => geoRotor({ soRang: 4, rNgoai: 0.09, rTrong: 0.055, dai: 0.6, gocXoan: 1.6 * Math.PI, loai: 'duc' })), VL.inox);
  rotorDuc.position.set(0.2, Y_DUC, 0);
  const rotorCai = mesh(dungChung('rotorCai', () => geoRotor({ soRang: 6, rNgoai: 0.105, rTrong: 0.07, dai: 0.6, gocXoan: -1.6 * Math.PI * (4 / 6), loai: 'cai' })), VL.thep);
  rotorCai.position.set(0.2, Y_CAI, 0);
  const trucCai = truTheoTruc(0.024, 0.95, 'x', VL.inox, V(0.31, Y_CAI, 0), { seg: 16 });
  cap.add(rotorDuc, rotorCai, trucCai);
  // Ổ bi hai đầu
  const geoOBi = dungChung('oBi', () => { const g = geoLathe([[0.03, -0.018], [0.058, -0.018], [0.058, 0.018], [0.03, 0.018], [0.03, -0.018]], 28); g.rotateZ(-Math.PI / 2); return g; });
  cap.add(banSao(geoOBi, VL.thepToi, [[-0.13, Y_DUC], [-0.13, Y_CAI], [0.62, Y_DUC], [0.62, Y_CAI], [0.68, Y_DUC], [0.68, Y_CAI]].map(([x, y]) => maTran(V(x, y, 0)))));
  // Van trượt điều chỉnh tải (nằm ở khe giữa hai lỗ, phía trước) và xi lanh dầu
  const vanTruot = hop(0.22, 0.04, 0.035, VL.dongThau, V(0.38, Y_VO + 0.004, 0.068));
  const canPiston = truTheoTruc(0.009, 0.3, 'x', VL.inox, V(0.64, Y_VO + 0.004, 0.068), { seg: 8 });
  cap.add(vanTruot, canPiston, truTheoTruc(0.035, 0.14, 'x', VL.thepToi, V(0.74, Y_VO + 0.004, 0.068), { seg: 20 }));
  mn.add(cap);
  dangKy('ch-mn-rotor', cap, {
    ten: 'Cặp rotor trục vít', cha: 'ch-mn',
    chucNang: 'Rotor đực 4 răng lồi quay theo động cơ, kéo rotor cái 6 rãnh quay ngược chiều với tỉ số 4:6. Rãnh giữa hai rotor nhận hơi ở đầu hút, thể tích nhỏ dần khi quay rồi mở ra cửa đẩy. Van trượt (màu đồng) lùi về để giảm tải.',
  });
  hoatAnh.rotorDuc = rotorDuc;
  hoatAnh.rotorCai = rotorCai;
  hoatAnh.rotoDongCo = roto;
  hoatAnh.trucCai = trucCai;
  hoatAnh.vanTruot = { mesh: vanTruot, can: canPiston, x0: 0.38 };

  // ---------------- Cụm tách dầu ----------------
  const td = nhom('Cụm tách dầu');
  goc.add(td);
  dangKy('ch-tachdau', td, {
    ten: 'Bình tách dầu và đường hồi dầu', cha: 'chiller',
    chucNang: 'Dầu được phun vào máy nén để làm kín và làm mát rồi đi cùng hơi đẩy. Bình tách đổi hướng dòng và qua lưới tách để giữ dầu lại ở đáy; dầu hồi về máy nén nhờ chênh áp qua phin lọc dầu và van điện từ.',
    cauTao: 'Bình đứng hai đáy elip, đầu vào hơi trên đỉnh, đầu ra hơi bên hông, kính xem mức dầu, điện trở sưởi dầu, đường hồi dầu Ø25.',
  });
  const cTD = (vl) => vlCat(vl, 'mayNen');
  const voTD = nhom('Vỏ bình tách dầu');
  voTD.add(mesh(dungChung('voTD', () => {
    const pts = [];
    for (let k = 0; k <= 8; k++) { const t = -Math.PI / 2 + (k / 8) * Math.PI / 2; pts.push([0.16 * Math.cos(t) + 0.0001, 1.24 + 0.08 * Math.sin(t)]); }
    for (let k = 0; k <= 8; k++) { const t = (k / 8) * Math.PI / 2; pts.push([0.16 * Math.cos(t) + 0.0001, 1.86 + 0.08 * Math.sin(t)]); }
    return geoLathe(pts, 40, false);
  }), cTD(VL.thepSon), { vt: V(0.7, 0, C.z) }));
  td.add(voTD);
  voChiller.push(voTD);
  td.add(truGiua(V(0.7, 1.06, C.z), V(0.7, 1.2, C.z), 0.11, VL.khung, { seg: 24 }));
  td.add(truGiua(V(0.7, 1.93, C.z), V(0.7, 1.97, C.z), 0.055, VL.thepSon, { seg: 20 }));
  const bichTD = mesh(geoMatBich(0.055, 0.105, 0.02), VL.thepSon, { vt: V(0.7, 1.99, C.z) });
  td.add(bichTD);
  td.add(truGiua(V(0.84, 1.75, C.z), V(0.87, 1.75, C.z), 0.055, VL.thepSon, { seg: 20 }));
  const bichRaTD = mesh(geoMatBich(0.055, 0.105, 0.02), VL.thepSon, { vt: V(0.89, 1.75, C.z) });
  bichRaTD.quaternion.copy(quatTuY(TRUC.x));
  td.add(bichRaTD);
  td.add(truGiua(V(0.7, 1.27, C.z + 0.15), V(0.7, 1.27, -0.24), 0.014, VL.dong, { seg: 10 }));
  // Bên trong: lưới tách và lớp dầu đáy bình
  const luoiTD = truTheoTruc(0.15, 0.08, 'y', VL.inox, V(0.7, 1.72, C.z), { seg: 28 });
  const dauDay = mesh(dungChung('dauDay', () => new THREE.CylinderGeometry(0.15, 0.15, 0.12, 28)), trongSuot('#c8a23a', 0.7), { vt: V(0.7, 1.24, C.z), bong: false });
  td.add(luoiTD, dauDay);
  noiThat.push({ obj: dauDay, nhom: 'mayNen' });
  // Kính xem mức dầu, điện trở sưởi
  const kxDau = PK.kinhXem(0.02);
  kxDau.obj.position.set(0.7 + 0.16, 1.33, C.z);
  kxDau.obj.quaternion.copy(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(0, 0, 1), V(1, 0, 0), V(0, 1, 0))));
  td.add(kxDau.obj);
  td.add(hop(0.07, 0.05, 0.05, VL.nhua, V(0.7, 1.22, C.z - 0.17)));

  // ---------------- Tuyến môi chất (toạ độ thế giới) ----------------
  const tuyenMoiChat = [
    { ma: 'mc-hut', luuChat: 'hoiHaAp', ten: 'Đường hút: hơi hạ áp về máy nén', r: 0.07, baoOn: 0.025, uon: 0.14,
      diem: [W(-1.3, 1.2, E.z), W(-1.3, Y_DUC, E.z), W(-1.3, Y_DUC, 0), W(-1.05, Y_DUC, 0)] },
    { ma: 'mc-day', luuChat: 'hoiCaoAp', ten: 'Đường đẩy: hơi cao áp sang bình tách dầu', r: 0.055, baoOn: 0, uon: 0.11,
      diem: [W(0.7, 1.88, 0), W(0.7, 2.16, 0), W(0.7, 2.16, C.z), W(0.7, 1.99, C.z)] },
    { ma: 'mc-ngung', luuChat: 'hoiCaoAp', ten: 'Hơi cao áp đã tách dầu vào bình ngưng', r: 0.055, baoOn: 0, uon: 0.11,
      diem: [W(0.89, 1.75, C.z), W(1.1, 1.75, C.z), W(1.1, 1.12, C.z)] },
    { ma: 'mc-long', luuChat: 'longCaoAp', ten: 'Đường lỏng cao áp: bình ngưng → phin lọc → kính xem → van tiết lưu', r: 0.024, baoOn: 0, uon: 0.07,
      diem: [W(1.35, 0.48, C.z), W(1.35, 0.35, C.z), W(2.05, 0.35, C.z), W(2.05, 0.35, 0.24)] },
    { ma: 'mc-tietluu', luuChat: 'haiPha', ten: 'Sau tiết lưu: lỏng – hơi hạ áp vào bình bay hơi', r: 0.024, baoOn: 0.02, uon: 0.06,
      diem: [W(2.05, 0.35, 0.24), W(2.05, 0.35, E.z), W(1.35, 0.35, E.z), W(1.35, 0.45, E.z)] },
    { ma: 'mc-dau', luuChat: 'dau', ten: 'Đường hồi dầu về máy nén', r: 0.012, baoOn: 0, uon: 0.04,
      diem: [W(0.7, 1.27, -0.24), W(0.7, 1.27, -0.13), W(0.1, 1.27, -0.13), W(0.1, 1.34, -0.13)] },
  ];
  for (const t of tuyenMoiChat) { t.tuyen = new TuyenOng(t.diem, t.uon); t.mach = 'moiChat'; t.khoangTrong = []; }
  const tuyen = (ma) => tuyenMoiChat.find((t) => t.ma === ma);

  // Linh kiện đường lỏng, đường dầu và đường hút (đặt theo độ dài dọc tuyến)
  const ppk = nhom('Bộ phận phụ');
  nhomTG.add(ppk);
  dangKy('ch-phu', ppk, { ten: 'Bộ phận phụ mạch môi chất', cha: 'chiller', chucNang: 'Van chặn, phin lọc, kính xem, van tiết lưu điện tử, van điện từ và phin lọc dầu trên các tuyến môi chất.' });
  const datPK = (kq, t, s, ma, len = TRUC.y, them = {}) => {
    PK.datLenTuyen(kq.obj, t.tuyen, s < 0 ? t.tuyen.dai + s : s, len);
    ppk.add(kq.obj);
    const s0 = s < 0 ? t.tuyen.dai + s : s;
    t.khoangTrong.push([s0 - kq.dai / 2, s0 + kq.dai / 2]);
    if (ma) dangKy(ma, kq.obj, { ten: kq.ten, cha: 'ch-phu', chucNang: kq.chucNang, ...them });
    return kq.obj;
  };
  const tLong = tuyen('mc-long');
  // Đoạn ngang dọc Z ở đầu +X: bắt đầu sau co thứ hai
  const sZ = tLong.tuyen.doan.at(-1).s0;
  datPK(PK.vanBi(0.024, { mau: VL.nutDo }), tLong, tLong.tuyen.doan[2].s0 + 0.2, 'ch-vanlong');
  datPK(PK.phinLoc(0.024), tLong, sZ + 0.19, 'ch-phin');
  const kx = datPK(PK.kinhXem(0.024), tLong, sZ + 0.42, 'ch-kinh');
  hoatAnh.kinhXem = kx.userData.kinh;
  const exv = PK.vanTietLuu(0.024);
  datPK(exv, tLong, tLong.tuyen.dai, 'ch-exv', TRUC.y, { thongSo: 'exv' });
  tLong.khoangTrong.at(-1)[1] = tLong.tuyen.dai + 1;
  tuyen('mc-tietluu').khoangTrong.push([-1, 0.07]);
  const tDau = tuyen('mc-dau');
  datPK(PK.vanDienTu(0.012), tDau, tDau.tuyen.doan[2].s0 + 0.08, 'ch-vandau', V(0, 0, -1));
  const locDau = nhom('Phin lọc dầu');
  locDau.add(truTheoTruc(0.034, 0.16, 'x', VL.thepSonSang, V(0, 0, 0), { seg: 20 }));
  locDau.add(truTheoTruc(0.02, 0.2, 'x', VL.dongThau, V(0, 0, 0), { seg: 8 }));
  datPK({ obj: locDau, dai: 0.2, ten: 'Phin lọc dầu', chucNang: 'Lọc cặn trong dầu trước khi dầu được phun trở lại vào buồng nén và ổ bi.' }, tDau, tDau.tuyen.doan[2].s0 + 0.3, 'ch-locdau');
  // Van một chiều đường đẩy
  const tDay = tuyen('mc-day');
  const cvDay = nhom('Van một chiều đường đẩy');
  cvDay.add(truTheoTruc(0.075, 0.1, 'x', VL.thepSon, V(0, 0, 0), { seg: 24 }));
  cvDay.add(truGiua(V(0, 0, 0), V(0, 0, 0.11), 0.04, VL.thepSon, { seg: 16 }));
  datPK({ obj: cvDay, dai: 0.12, ten: 'Van một chiều đường đẩy', chucNang: 'Ngăn hơi cao áp chảy ngược làm rotor quay ngược khi máy nén dừng.' }, tDay, tDay.tuyen.doan[2].s0 + 0.1, 'ch-cvday', TRUC.y);

  // ---------------- Cảm biến và dây tín hiệu ----------------
  const cb = nhom('Cảm biến');
  nhomTG.add(cb);
  dangKy('ch-camBien', cb, { ten: 'Cảm biến nhiệt độ, áp suất và dây tín hiệu', cha: 'chiller', chucNang: 'Đo nhiệt độ nước vào/ra hai bình, áp suất hút/đẩy/dầu và áp suất hai bình. Tín hiệu đi về tủ điều khiển qua hộp đấu dây và ống luồn dây.' });
  // qua: điểm trung gian của dây tín hiệu (toạ độ cục bộ). Dây đầu -X đi qua khe giữa hai hộp nước xuống hộp đấu dây JB1;
  // dây quanh máy nén đi dọc phía trên bảo ôn rồi xuống hộp đấu dây JB2 gắn trên cột đỡ máy nén.
  const KHE = [V(-1.66, 1.26, -0.015), V(-1.66, 0.47, -0.015)];
  const dsCB = [
    { loai: 'nhiet', p: W(X_NOI, yVaoE, 0.82), huong: TRUC.y, rOng: ONG.nuocLanh.r, ten: 'Cảm biến nhiệt độ nước lạnh vào', hop: 'jb1', qua: [V(-1.66, 1.26, 0.9), ...KHE] },
    { loai: 'nhiet', p: W(X_NOI, 1.3, E.z), huong: TRUC.z, rOng: ONG.nuocLanh.r, ten: 'Cảm biến nhiệt độ nước lạnh ra', hop: 'jb1', qua: [V(-1.66, 1.26, 0.66), ...KHE] },
    { loai: 'nhiet', p: W(X_NOI, yVaoC, -0.86), huong: TRUC.y, rOng: ONG.giaiNhiet.r, ten: 'Cảm biến nhiệt độ nước giải nhiệt vào', hop: 'jb1', qua: [V(-1.66, 1.26, -0.92), ...KHE] },
    { loai: 'nhiet', p: W(X_NOI, 1.27, C.z), huong: V(0, 0, -1), rOng: ONG.giaiNhiet.r, ten: 'Cảm biến nhiệt độ nước giải nhiệt ra', hop: 'jb1', qua: [V(-1.66, 1.26, -0.68), ...KHE] },
    { loai: 'ap', p: W(-1.3, Y_DUC, 0.25), huong: TRUC.y, rOng: 0.095, ten: 'Cảm biến áp suất hút', hop: 'jb2', qua: [V(-1.18, 1.62, 0.3), V(-1.0, 1.2, 0.28), V(0.72, 1.2, 0.28)] },
    { loai: 'nhiet', p: W(-1.3, Y_DUC, 0.17), huong: TRUC.y, rOng: 0.095, ten: 'Cảm biến nhiệt độ hơi hút', hop: 'jb2', qua: [V(-1.18, 1.6, 0.27), V(-1.0, 1.2, 0.27), V(0.72, 1.2, 0.27)] },
    { loai: 'ap', p: W(0.7, 1.98, 0), huong: TRUC.z, rOng: 0.055, ten: 'Cảm biến áp suất đẩy', hop: 'jb2', qua: [V(0.95, 2.0, 0.14), V(0.95, 1.2, 0.12)] },
    { loai: 'nhiet', p: W(0.7, 1.94, 0), huong: V(-1, 0, 0), rOng: 0.055, ten: 'Cảm biến nhiệt độ đẩy', hop: 'jb2', qua: [V(0.5, 1.96, 0.1), V(0.95, 1.95, 0.16), V(0.95, 1.2, 0.13)] },
    { loai: 'ap', p: W(0.19, 1.27, -0.13), huong: V(0, -1, 0), rOng: 0.012, ten: 'Cảm biến áp suất dầu', hop: 'jb2', qua: [V(0.45, 1.1, -0.11), V(0.74, 1.02, -0.1)] },
    { loai: 'ap', p: W(-0.1, C.y + C.R, C.z), huong: TRUC.y, rOng: 0, ten: 'Cảm biến áp suất bình ngưng', hop: 'jb2', qua: [V(-0.05, 1.2, -0.22), V(0.45, 1.06, -0.16), V(0.74, 1.0, -0.1)] },
    { loai: 'ap', p: W(-0.7, E.y + E.R + E.bo, E.z), huong: TRUC.y, rOng: 0, ten: 'Cảm biến áp suất bình bay hơi', hop: 'jb2', qua: [V(-0.65, 1.26, 0.3), V(0.72, 1.2, 0.29)] },
  ];
  const HOP_DAY = { jb1: W(-1.75, 0.34, 0.055), jb2: W(0.8, 0.98, 0.075) };
  cb.add(hop(0.16, 0.14, 0.1, VL.tuDien, HOP_DAY.jb1.clone().add(V(0, -0.02, -0.055))));
  cb.add(hop(0.12, 0.14, 0.07, VL.tuDien, HOP_DAY.jb2.clone().add(V(0, 0, -0.035))));
  const cacDay = [];
  dsCB.forEach((c, i) => {
    const kq = c.loai === 'nhiet' ? PK.camBienNhiet(c.rOng) : PK.camBienAp(c.rOng);
    kq.obj.position.copy(c.p);
    kq.obj.quaternion.copy(quatTuY(c.huong));
    cb.add(kq.obj);
    dangKy(`ch-cb-${i}`, kq.obj, { ten: c.ten, cha: 'ch-camBien', chucNang: kq.chucNang });
    kq.obj.updateMatrix();
    const dau = kq.obj.userData.dauDay.clone().applyMatrix4(kq.obj.matrix);
    const diem = [dau, ...c.qua.map((q) => W(q.x, q.y, q.z)), HOP_DAY[c.hop]];
    cacDay.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(diem, false, 'centripetal'), 12 * diem.length, 0.0045, 6));
  });
  cb.add(mesh(dungChung('dayCB', () => mergeTube(cacDay)), VL.day));

  // ---------------- Tủ điều khiển ----------------
  const tu = nhom('Tủ điều khiển');
  goc.add(tu);
  dangKy('ch-tu', tu, {
    ten: 'Tủ điều khiển chiller', cha: 'chiller',
    chucNang: 'Bộ điều khiển đọc cảm biến, khởi động động cơ (sao – tam giác), điều khiển van trượt và van tiết lưu, khóa liên động khi mất lưu lượng nước và dừng bảo vệ khi áp suất bất thường.',
    cauTao: 'Vỏ thép sơn tĩnh điện, màn hình cảm ứng, đèn báo chạy/chờ/lỗi, nút khởi động, dừng, đặt lại, nút dừng khẩn, công tắc chọn chế độ, cửa có tay nắm và bản lề, ống luồn dây.',
  });
  const tx = 2.3, ty = 1.4, tz = 0.1;
  tu.add(hop(0.3, 1.1, 0.9, VL.tuDien, V(tx, ty, tz)));
  tu.add(hop(0.012, 1.06, 0.86, VL.tuDien, V(tx + 0.156, ty, tz)));
  for (const z of [-0.25, 0.45]) tu.add(hop(0.06, 0.6, 0.06, VL.khung, V(tx, 0.55, z)));
  tu.add(hop(0.32, 0.03, 0.92, VL.tuDien, V(tx, ty + 0.565, tz)));
  // Màn hình
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 340;
  const ktMan = new THREE.CanvasTexture(cv);
  ktMan.colorSpace = THREE.SRGBColorSpace;
  const man = mesh(new THREE.PlaneGeometry(0.33, 0.22), new THREE.MeshBasicMaterial({ map: ktMan }), { bong: false });
  man.position.set(tx + 0.164, 1.7, tz);
  man.rotation.y = Math.PI / 2;
  tu.add(hop(0.012, 0.25, 0.36, VL.nhua, V(tx + 0.158, 1.7, tz)), man);
  hoatAnh.manHinh = { canvas: cv, ctx: cv.getContext('2d'), kt: ktMan };
  // Đèn báo và nút nhấn
  const truX = (r, dai, vl, y, z) => truTheoTruc(r, dai, 'x', vl, V(tx + 0.16 + dai / 2, y, z), { seg: 20 });
  // Nhìn từ phía +X, trục +Z nằm bên trái: xếp CHẠY – CHỜ – LỖI từ trái sang phải
  const den = { chay: truX(0.022, 0.03, VL.denXanh, 1.47, 0.3), cho: truX(0.022, 0.03, VL.denVang, 1.47, 0.1), loi: truX(0.022, 0.03, VL.denDo, 1.47, -0.1) };
  tu.add(den.chay, den.cho, den.loi);
  hoatAnh.den = den;
  const nut = {
    khoiDong: truX(0.021, 0.02, VL.nutXanh, 1.32, 0.3), dung: truX(0.021, 0.02, VL.nutDo, 1.32, 0.1), datLai: truX(0.021, 0.02, VL.nutVang, 1.32, -0.1),
  };
  for (const [k, m] of Object.entries(nut)) { m.userData.hanhDong = k; tu.add(m, truX(0.028, 0.008, VL.thep, 1.32, m.position.z)); }
  // Nút dừng khẩn và công tắc chọn chế độ
  tu.add(hop(0.006, 0.11, 0.11, VL.nutVang, V(tx + 0.163, 1.13, 0.1)));
  const khan = mesh(dungChung('namDung', () => { const g = new THREE.SphereGeometry(0.04, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2); g.rotateZ(-Math.PI / 2); return g; }), VL.nutDo);
  khan.position.set(tx + 0.19, 1.13, 0.1);
  khan.userData.hanhDong = 'dungKhan';
  tu.add(khan, truX(0.018, 0.03, VL.nutDo, 1.13, 0.1));
  tu.add(truX(0.026, 0.02, VL.nhua, 1.13, 0.32), hop(0.012, 0.012, 0.045, VL.nhuaTrang, V(tx + 0.185, 1.13, 0.32)));
  // Nhãn chữ trên mặt tủ
  const bien = (chu, y, z, w = 0.12) => {
    const m = mesh(new THREE.PlaneGeometry(w, w * 0.25), new THREE.MeshBasicMaterial({ map: ketCauBien(chu, { co: 34 }) }), { bong: false });
    m.position.set(tx + 0.1635, y, z);
    m.rotation.y = Math.PI / 2;
    return m;
  };
  tu.add(bien('CHẠY', 1.42, 0.3, 0.09), bien('CHỜ', 1.42, 0.1, 0.09), bien('LỖI', 1.42, -0.1, 0.09));
  tu.add(bien('KHỞI ĐỘNG', 1.275, 0.3, 0.11), bien('DỪNG', 1.275, 0.1, 0.09), bien('ĐẶT LẠI', 1.275, -0.1, 0.1));
  tu.add(bien('CH-01 · TỦ ĐIỀU KHIỂN', 1.89, 0.1, 0.42));
  // Tay nắm, bản lề, cửa thông gió
  tu.add(hop(0.03, 0.18, 0.025, VL.nhua, V(tx + 0.17, 1.4, -0.3)));
  for (const y of [1.0, 1.4, 1.8]) tu.add(truTheoTruc(0.012, 0.06, 'y', VL.thep, V(tx + 0.16, y, 0.545), { seg: 10 }));
  tu.add(banSao(dungChung('khe', () => new THREE.BoxGeometry(0.01, 0.008, 0.2)), VL.nhua, [0.93, 0.95, 0.97, 0.99].map((y) => maTran(V(tx + 0.163, y, 0.3)))));
  // Ống luồn dây: cáp động lực lên hộp đấu dây động cơ, cáp tín hiệu dưới khung
  const ongLuon = nhom('Ống luồn dây');
  const tuyenDL = new TuyenOng([W(2.3, 1.96, 0.3), W(2.3, 2.27, 0.3), W(-0.55, 2.27, 0.3), W(-0.55, 2.27, 0.05), W(-0.55, Y_DUC + 0.36, 0.05)], 0.08);
  const tuyenTH = new TuyenOng([W(2.25, 0.84, 0.0), W(2.25, 0.27, 0.0), W(-1.67, 0.27, 0.0)], 0.06);
  const tuyenTH2 = new TuyenOng([W(0.8, 0.91, 0.045), W(0.8, 0.29, 0.045)], 0.05);
  ongLuon.userData.tuyen = [tuyenDL, tuyenTH, tuyenTH2];
  nhomTG.add(ongLuon);
  dangKy('ch-ongluon', ongLuon, { ten: 'Ống luồn dây', cha: 'ch-tu', chucNang: 'Ống thép mạ bảo vệ cáp động lực (tủ → động cơ) và cáp tín hiệu (hộp đấu dây → tủ).' });

  return {
    goc, hoatAnh, voChiller, noiThat, tuyenMoiChat, nhomTG, nhomOngLuon: ongLuon,
    capCat: { binhBayHoi: capCatE, binhNgung: capCatC },
    nap: { binhBayHoi: hopE.nap, binhNgung: hopC.nap },
    boOng: [boOngE, boOngC],
    // Đầu nối nước (toạ độ thế giới) và hướng ống đi ra
    diemNoi: {
      nuocLanhVao: { p: W(X_NOI, yVaoE, 0.95), huong: TRUC.z.clone() },
      nuocLanhRa: { p: W(X_NOI, 1.41, E.z), huong: TRUC.y.clone() },
      giaiNhietVao: { p: W(X_NOI, yVaoC, -0.97), huong: V(0, 0, -1) },
      giaiNhietRa: { p: W(X_NOI, 1.38, C.z), huong: TRUC.y.clone() },
    },
    // Hình hộp thân thiết bị để kiểm tra ống không xuyên thiết bị
    vatCan: [
      { ten: 'Thân bình bay hơi', hop: new THREE.Box3(W(-1.6, E.y - E.R - E.bo, E.z - E.R - E.bo), W(1.6, E.y + E.R + E.bo, E.z + E.R + E.bo)) },
      { ten: 'Thân bình ngưng', hop: new THREE.Box3(W(-1.6, C.y - C.R, C.z - C.R), W(1.6, C.y + C.R, C.z + C.R)) },
      { ten: 'Máy nén', hop: new THREE.Box3(W(-1.0, 1.36, -0.23), W(0.85, 1.9, 0.23)) },
      { ten: 'Tủ điều khiển', hop: new THREE.Box3(W(2.15, 0.85, -0.35), W(2.45, 1.95, 0.55)) },
      { ten: 'Bình tách dầu', hop: new THREE.Box3(W(0.54, 1.16, C.z - 0.16), W(0.86, 1.94, C.z + 0.16)) },
    ],
    nhanMatCat: [
      { chu: 'Nước lạnh trong ống', vt: W(-0.4, E.y - 0.12, E.z + 0.05), nhom: 'binhBayHoi' },
      { chu: 'Môi chất lỏng sôi quanh ống', vt: W(0.5, E.y + 0.08, E.z + 0.2), nhom: 'binhBayHoi' },
      { chu: 'Hơi môi chất về máy nén', vt: W(-0.9, E.y + 0.25, E.z + 0.05), nhom: 'binhBayHoi' },
      { chu: 'Nước giải nhiệt trong ống', vt: W(-0.4, C.y - 0.1, C.z - 0.05), nhom: 'binhNgung' },
      { chu: 'Hơi cao áp ngưng tụ quanh ống', vt: W(0.6, C.y + 0.2, C.z - 0.1), nhom: 'binhNgung' },
      { chu: 'Lỏng ngưng ở đáy bình', vt: W(0.2, C.y - 0.24, C.z - 0.1), nhom: 'binhNgung' },
      { chu: 'Rotor đực 4 răng', vt: W(0.2, Y_DUC + 0.1, 0.12), nhom: 'mayNen' },
      { chu: 'Rotor cái 6 rãnh', vt: W(0.2, Y_CAI - 0.12, 0.12), nhom: 'mayNen' },
      { chu: 'Động cơ (stator, rotor)', vt: W(-0.6, Y_DUC + 0.12, 0.15), nhom: 'mayNen' },
    ],
  };
}

// Ghép các ống dây (cùng thuộc tính) thành một geometry.
function mergeTube(ds) {
  const pos = [], nor = [], uv = [], idx = [];
  let goc = 0;
  for (const g of ds) {
    pos.push(...g.attributes.position.array);
    nor.push(...g.attributes.normal.array);
    uv.push(...g.attributes.uv.array);
    for (const i of g.index.array) idx.push(i + goc);
    goc += g.attributes.position.count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function trongSuot(mau, doTrong) {
  return new THREE.MeshStandardMaterial({ color: mau, roughness: 0.25, metalness: 0, transparent: true, opacity: doTrong, depthWrite: false });
}

// Đường bao lỗ số 8 (hợp của hai lỗ rotor) trong mặt phẳng (z, y) tương đối tâm vỏ.
function duongSo8(y1, r1, y2, r2) {
  const d = y1 - y2;
  const h1 = (d * d + r1 * r1 - r2 * r2) / (2 * d);
  const w = Math.sqrt(r1 * r1 - h1 * h1);
  const yi = y1 - h1;
  const p = new THREE.Path();
  const a1 = Math.atan2(yi - y1, w), a2 = Math.atan2(yi - y1, -w);
  p.absarc(0, y1, r1, a1, a2 + Math.PI * 2 * (a2 < a1 ? 1 : 0), false);
  const b1 = Math.atan2(yi - y2, -w), b2 = Math.atan2(yi - y2, w);
  p.absarc(0, y2, r2, b1, b2 + Math.PI * 2 * (b2 < b1 ? 1 : 0), false);
  return p;
}

// Bó ống 2 pass dạng InstancedMesh; mỗi pass một vật liệu để đổi màu nước và cho vạch chảy ngược chiều.
function dungBoOng(dsOng, B, luuChat1, luuChat2) {
  const g = nhom('Bó ống');
  const dai = 2 * XS + 0.085;
  const geo = dungChung('ongTD', () => { const x = new THREE.CylinderGeometry(R_ONG, R_ONG, dai, 8, 1, false); x.rotateZ(-Math.PI / 2); return x; });
  const pass1 = dsOng.filter(([y]) => y < B.yNgan), pass2 = dsOng.filter(([y]) => y >= B.yNgan);
  const kq = { nhom: g, pass: [] };
  for (const [ds, lc, chieu] of [[pass1, luuChat1, 1], [pass2, luuChat2, -1]]) {
    const im = banSao(geo, VL.dong, ds.map(([y, z]) => maTran(V(0, B.y + y, B.z + z))), { bong: false });
    g.add(im);
    const kt = ketCauSoc(MAU[lc]);
    kt.repeat.set(1, 6);
    const vlNuoc = new THREE.MeshStandardMaterial({ map: kt, roughness: 0.3, metalness: 0.1 });
    kq.pass.push({ mesh: im, vlNuoc, kt, chieu, luuChat: lc });
  }
  // Miệng ống trên hai mặt sàng (chấm tối = lòng ống)
  const geoMieng = dungChung('miengOng', () => new THREE.CircleGeometry(R_ONG * 0.78, 10));
  const qTrai = new THREE.Quaternion().setFromAxisAngle(TRUC.y, -Math.PI / 2);
  const qPhai = new THREE.Quaternion().setFromAxisAngle(TRUC.y, Math.PI / 2);
  const mt = [];
  for (const [y, z] of dsOng) {
    mt.push(maTran(V(-XS - 0.0405, B.y + y, B.z + z), qTrai), maTran(V(XS + 0.0405, B.y + y, B.z + z), qPhai));
  }
  g.add(banSao(geoMieng, VL.thepToi, mt, { bong: false }));
  return kq;
}

// Hộp nước đầu -X: bích trong, vỏ hộp, tấm chia pass, bích ngoài, nắp tháo được, nước bên trong.
function dungHopNuoc(B, c, nhomCat) {
  const g = nhom('Hộp nước');
  const rB = B.rSang;
  const vo = [];
  const voHop = truGiua(V(-1.62, B.y, B.z), V(-1.95, B.y, B.z), B.R, c(VL.thepSon), { seg: 56, mo: true });
  const bichTrong = vanhX(B.R - 0.012, rB, -1.62, -1.59, c(VL.thepSon), B.y, B.z);
  const bichNgoai = vanhX(B.R - 0.012, rB, -1.98, -1.95, c(VL.thepSon), B.y, B.z);
  const buLongSang = vongBuLong({ tam: V(-1.6, B.y, B.z), truc: 'x', rVong: rB - 0.022, n: 20, co: 0.011, dai: 0.07, vl: c(VL.thep) });
  g.add(voHop, bichTrong, bichNgoai, buLongSang);
  vo.push(voHop);
  // Tấm chia pass nằm ngang
  const nuaRong = Math.sqrt((B.R - 0.012) ** 2 - B.yNgan ** 2);
  g.add(hop(0.36, 0.012, nuaRong * 2, c(VL.thepSonSang), V(-1.77, B.y + B.yNgan, B.z)));
  // Nước trong hộp: ngăn dưới (vào) và ngăn trên (ra)
  const R0 = B.R - 0.013;
  const nuocDuoi = mesh(geoKhoiMoiChat(R0, -R0, B.yNgan - 0.006, 0.34), c(nuocTrong(B === E ? '#79b8f2' : '#12a89c')), { bong: false });
  const nuocTren = mesh(geoKhoiMoiChat(R0, B.yNgan + 0.006, R0 - 0.0005, 0.34), c(nuocTrong(B === E ? '#1d4fbf' : '#ef7b1f')), { bong: false });
  for (const m of [nuocDuoi, nuocTren]) { m.position.set(-1.78, B.y, B.z); m.renderOrder = 2; g.add(m); }
  // Nắp tháo được
  const nap = nhom('Nắp hộp nước');
  nap.add(truTheoTruc(rB, 0.03, 'x', c(VL.thepSon), V(-1.995, B.y, B.z), { seg: 56 }));
  nap.add(vongBuLong({ tam: V(-1.98, B.y, B.z), truc: 'x', rVong: rB - 0.022, n: 20, co: 0.011, dai: 0.075, vl: c(VL.thep) }));
  const tai = mesh(dungChung('taiCau', () => new THREE.TorusGeometry(0.035, 0.009, 8, 16)), c(VL.thepSon));
  tai.position.set(-2.03, B.y + rB - 0.06, B.z);
  tai.rotation.y = Math.PI / 2;
  nap.add(tai, hop(0.04, 0.05, 0.012, c(VL.thepSon), V(-2.02, B.y + rB - 0.08, B.z)));
  for (const dz of [-0.14, 0.14]) {
    nap.add(truGiua(V(-2.01, B.y - 0.05, B.z + dz), V(-2.07, B.y - 0.05, B.z + dz), 0.008, VL.thep, { seg: 8 }));
    nap.add(truGiua(V(-2.01, B.y + 0.05, B.z + dz), V(-2.07, B.y + 0.05, B.z + dz), 0.008, VL.thep, { seg: 8 }));
    nap.add(truGiua(V(-2.07, B.y - 0.05, B.z + dz), V(-2.07, B.y + 0.05, B.z + dz), 0.008, VL.thep, { seg: 8 }));
  }
  // Nút xả khí và xả nước
  nap.add(truTheoTruc(0.012, 0.02, 'x', VL.dongThau, V(-2.02, B.y + rB - 0.13, B.z + 0.12), { seg: 6 }));
  nap.add(truTheoTruc(0.012, 0.02, 'x', VL.dongThau, V(-2.02, B.y - rB + 0.1, B.z + 0.12), { seg: 6 }));
  g.add(nap);
  vo.push(nap);
  return { nhom: g, nap, vo, noiThat: [{ obj: nuocDuoi, nhom: nhomCat, napMo: true }, { obj: nuocTren, nhom: nhomCat, napMo: true }] };
}

function nuocTrong(mau) {
  return new THREE.MeshStandardMaterial({ color: mau, roughness: 0.2, metalness: 0, transparent: true, opacity: 0.35, depthWrite: false });
}

// Hộp quay đầu (+X): nước đổi chiều từ pass 1 sang pass 2.
function dungHopQuayDau(B, c) {
  const g = nhom('Hộp quay đầu');
  const rB = B.rSang;
  const vo = truGiua(V(1.62, B.y, B.z), V(1.74, B.y, B.z), B.R, c(VL.thepSon), { seg: 56, mo: true });
  g.add(vo, vanhX(B.R - 0.012, rB, 1.59, 1.62, c(VL.thepSon), B.y, B.z), vanhX(B.R - 0.012, rB, 1.74, 1.77, c(VL.thepSon), B.y, B.z));
  g.add(vongBuLong({ tam: V(1.6, B.y, B.z), truc: 'x', rVong: rB - 0.022, n: 20, co: 0.011, dai: 0.07, vl: c(VL.thep) }));
  const nap = truTheoTruc(rB, 0.03, 'x', c(VL.thepSon), V(1.785, B.y, B.z), { seg: 56 });
  g.add(nap, vongBuLong({ tam: V(1.77, B.y, B.z), truc: 'x', rVong: rB - 0.022, n: 20, co: 0.011, dai: 0.075, vl: c(VL.thep) }));
  return { nhom: g, vo: [vo, nap] };
}
