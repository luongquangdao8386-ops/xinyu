// Giao diện điều khiển: bảng vận hành, thông số giả lập, chế độ xem (vỏ, mặt cắt, nắp hộp nước, dòng chảy),
// góc nhìn camera, cây cấu tạo, chọn thiết bị bằng chuột, làm nổi bật, nhãn tiếng Việt chống chồng lấn.

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { VL, datMatCat, dangCat, khiDoiMatCat } from './vat-lieu.js';
import { thanhPhan, timThanhPhan } from './thanh-phan.js';
import { MAU, TEN_LUU_CHAT, VI_TRI } from './cau-hinh.js';
import { datCheDoOng } from './duong-ong.js';
import { THIET_KE } from './mo-hinh-nhiet.js';
import { NGUONG } from './van-hanh.js';

// h('p', { class: 'x' }, 'chữ', con): thuộc tính bắt đầu bằng "on" là sự kiện.
function h(the, tt = {}, ...con) {
  const el = document.createElement(the);
  for (const [k, v] of Object.entries(tt || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of con.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
}
const so1 = (x) => (Number.isFinite(x) ? x.toFixed(1).replace('.', ',') : '–');
const so0 = (x) => (Number.isFinite(x) ? Math.round(x).toLocaleString('vi-VN') : '–');
const pt = (x) => `${Math.round(x * 100)} %`;

export function taoGiaoDien({ canh, tb, ong, vh, ha }) {
  const { camera, controls, scene, renderer } = canh;
  const xem = {
    voChiller: false, voThap: false, voAHU: false,
    cat: { binhBayHoi: false, binhNgung: false, mayNen: false, bom: false, binhGianNo: false },
    napMo: false, xemDong: false, mauLuuChat: false, mach: 'tatCa', nhan: true, nhanOng: true,
    chatLuong: 'cao', tocDo: 1, tamDung: false,
  };
  let napK = 0; // tiến độ tháo nắp 0..1
  let dangChon = null;

  // ---------------- Bảng điều khiển ----------------
  const bang = document.getElementById('bang');
  const tabs = [['van-hanh', 'Vận hành'], ['hien-thi', 'Hiển thị'], ['cau-tao', 'Cấu tạo']];
  const nav = bang.querySelector('.the-bang');
  tabs.forEach(([id, ten], i) => {
    nav.append(h('button', {
      class: 'the', role: 'tab', id: `nut-${id}`, 'aria-selected': i === 0 ? 'true' : 'false', 'aria-controls': `tab-${id}`,
      onclick: () => moTab(id),
    }, ten));
  });
  function moTab(id) {
    for (const [k] of tabs) {
      document.getElementById(`tab-${k}`).hidden = k !== id;
      document.getElementById(`nut-${k}`).setAttribute('aria-selected', k === id ? 'true' : 'false');
    }
    try { localStorage.setItem('chiller-tab', id); } catch { /* bỏ qua */ }
  }

  // --- Tab vận hành ---
  const tVH = document.getElementById('tab-van-hanh');
  const hopTB = h('div', { class: 'thong-bao', 'aria-live': 'polite' });
  const congTac = (id, nhan, onchange) => h('label', { class: 'cong-tac', for: id },
    h('input', { type: 'checkbox', id, role: 'switch', onchange }), h('span', { class: 'ray', 'aria-hidden': 'true' }), h('span', { class: 'sr' }, nhan));
  const truot = (id, min, max, gt, onInput) => h('input', { type: 'range', id, min, max, step: 1, value: gt, oninput: onInput });
  const hang = (the, ten, dk, tt, them) => h('div', { class: 'thiet-bi' },
    h('div', { class: 'tb-dau' }, h('span', { class: 'tb-the' }, the), h('span', { class: 'tb-ten' }, ten), dk),
    h('div', { class: 'tb-tt', id: `tt-${the}` }, tt), them || null);
  const outNL = h('output', { id: 'out-toc-nl' }, '100 %'), outGN = h('output', { id: 'out-toc-gn' }, '100 %'), outTai = h('output', { id: 'out-tai' }, '80 %');
  tVH.append(
    h('div', { class: 'nhom-nut' },
      h('button', { class: 'nut chinh', id: 'nut-chay-het', onclick: () => { vh.chayTatCa(); dongBoNut(); } }, 'Chạy toàn hệ thống'),
      h('button', { class: 'nut', id: 'nut-dung-het', onclick: () => { vh.dungTatCa(); dongBoNut(); } }, 'Dừng toàn bộ'),
      h('button', { class: 'nut', id: 'nut-dat-lai', onclick: () => vh.datLai() }, 'Đặt lại báo lỗi')),
    hopTB,
    h('h2', {}, 'Thiết bị'),
    hang('CHWP-01', 'Bơm nước lạnh', congTac('bat-bom-nl', 'Chạy bơm nước lạnh', (e) => vh.datBat('bomNL', e.target.checked)), '',
      h('div', { class: 'thanh-truot' }, h('label', { for: 'toc-nl' }, 'Tốc độ (biến tần)'), truot('toc-nl', 30, 100, 100, (e) => { vh.datTocDo('bomNL', e.target.value / 100); outNL.value = `${e.target.value} %`; }), outNL)),
    hang('CWP-01', 'Bơm giải nhiệt', congTac('bat-bom-gn', 'Chạy bơm giải nhiệt', (e) => vh.datBat('bomGN', e.target.checked)), '',
      h('div', { class: 'thanh-truot' }, h('label', { for: 'toc-gn' }, 'Tốc độ (biến tần)'), truot('toc-gn', 30, 100, 100, (e) => { vh.datTocDo('bomGN', e.target.value / 100); outGN.value = `${e.target.value} %`; }), outGN)),
    hang('CT-01', 'Quạt tháp giải nhiệt', congTac('bat-quat', 'Chạy quạt tháp', (e) => vh.datBat('quatThap', e.target.checked)), ''),
    hang('CH-01', 'Máy nén chiller', congTac('bat-may-nen', 'Cho phép máy nén chạy', (e) => vh.datBat('mayNen', e.target.checked)), ''),
    hang('AHU-01', 'Tải lạnh của AHU', null, '',
      h('div', { class: 'thanh-truot' }, h('label', { for: 'tai-ahu' }, 'Nhu cầu lạnh'), truot('tai-ahu', 0, 100, 80, (e) => { vh.datTai(e.target.value / 100); outTai.value = `${e.target.value} %`; }), outTai)),
    h('h2', {}, 'Thông số ', h('span', { class: 'ghi-chu' }, 'giả lập minh họa')),
    h('div', { class: 'bang-so', id: 'bang-so' }),
    h('div', { class: 'thoi-gian' },
      h('span', {}, 'Thời gian mô phỏng'),
      h('div', { class: 'phan-doan', role: 'group', 'aria-label': 'Tốc độ thời gian' },
        ...[1, 2, 5].map((k) => h('button', { class: k === 1 ? 'chon' : '', 'data-toc': k, onclick: (e) => { xem.tocDo = k; e.target.parentElement.querySelectorAll('button').forEach((b) => b.classList.toggle('chon', b === e.target)); } }, `${k}×`)),
        h('button', { id: 'nut-tam-dung', onclick: (e) => { xem.tamDung = !xem.tamDung; e.target.textContent = xem.tamDung ? 'Tiếp tục' : 'Tạm dừng'; e.target.classList.toggle('chon', xem.tamDung); } }, 'Tạm dừng'))),
    h('p', { class: 'ghi-chu' }, `Mô hình nhiệt đơn giản: công suất định mức ${THIET_KE.qLanh} kW, nước lạnh ${THIET_KE.luuLuongNL} m³/h, nước giải nhiệt ${THIET_KE.luuLuongGN} m³/h, bầu ướt ${so1(THIET_KE.tBauUot)} °C, môi chất R134a. Máy nén chỉ chạy khi cả hai mạch đạt tối thiểu ${pt(NGUONG.luuLuongToiThieu)} lưu lượng.`),
  );
  function dongBoNut() {
    document.getElementById('bat-bom-nl').checked = vh.dk.bomNL.bat;
    document.getElementById('bat-bom-gn').checked = vh.dk.bomGN.bat;
    document.getElementById('bat-quat').checked = vh.dk.quatThap.bat;
    document.getElementById('bat-may-nen').checked = vh.dk.mayNen.bat;
    document.getElementById('tai-ahu').value = Math.round(vh.dk.taiAHU * 100);
    outTai.value = pt(vh.dk.taiAHU);
  }

  // --- Tab hiển thị ---
  const tHT = document.getElementById('tab-hien-thi');
  const nutGoc = (ten, f, id) => h('button', { class: 'nut nho', id, onclick: f }, ten);
  const chon = (id, nhan, f, tick = false) => h('label', { class: 'chon-o', for: id }, h('input', { type: 'checkbox', id, checked: tick, onchange: (e) => f(e.target.checked) }), h('span', {}, nhan));
  const phongGan = [
    ['chiller', 'Cụm chiller'], ['ch-mn', 'Máy nén'], ['ch-bbh', 'Bình bay hơi'], ['ch-bn', 'Bình ngưng'], ['ch-bbh-hop', 'Hộp nước'],
    ['ch-tu', 'Tủ điều khiển'], ['ch-exv', 'Van tiết lưu, phin lọc'], ['thap', 'Tháp giải nhiệt'], ['bom-nl', 'Bơm nước lạnh'],
    ['bom-gn', 'Bơm giải nhiệt'], ['ahu', 'AHU'], ['bgn', 'Bình giãn nở'],
  ];
  tHT.append(
    h('h2', {}, 'Góc nhìn'),
    h('div', { class: 'luoi-nut' },
      nutGoc('Tổng thể 35°', () => datGoc('tongThe'), 'goc-tong-the'), nutGoc('Từ trên', () => datGoc('tren'), 'goc-tren'),
      nutGoc('Mặt trước', () => datGoc('truoc'), 'goc-truoc'), nutGoc('Mặt bên', () => datGoc('ben'), 'goc-ben'),
      nutGoc('Về mặc định', () => datGoc('tongThe'), 'goc-mac-dinh')),
    h('h2', {}, 'Phóng gần thiết bị'),
    h('div', { class: 'luoi-nut' }, ...phongGan.map(([ma, ten]) => nutGoc(ten, () => { chonMa(ma); phongTo(ma); }, `pg-${ma}`))),
    h('h2', {}, 'Vỏ thiết bị'),
    chon('an-vo-chiller', 'Ẩn vỏ chiller (bình, máy nén, tách dầu)', (b) => { xem.voChiller = b; apDungXem(); }),
    chon('an-vo-thap', 'Ẩn một phần vỏ tháp giải nhiệt', (b) => { xem.voThap = b; apDungXem(); }),
    chon('an-vo-ahu', 'Ẩn vỏ AHU', (b) => { xem.voAHU = b; apDungXem(); }),
    h('h2', {}, 'Mặt cắt'),
    chon('cat-bbh', 'Bình bay hơi', (b) => { xem.cat.binhBayHoi = b; apDungXem(); }),
    chon('cat-bn', 'Bình ngưng', (b) => { xem.cat.binhNgung = b; apDungXem(); }),
    chon('cat-mn', 'Máy nén (rotor, động cơ)', (b) => { xem.cat.mayNen = b; apDungXem(); }),
    chon('cat-bom', 'Hai bơm (bánh công tác)', (b) => { xem.cat.bom = b; apDungXem(); }),
    chon('cat-bgn', 'Bình giãn nở (màng)', (b) => { xem.cat.binhGianNo = b; apDungXem(); }),
    chon('thao-nap', 'Tháo nắp hộp nước hai bình', (b) => { xem.napMo = b; apDungXem(); }),
    h('h2', {}, 'Dòng chảy'),
    chon('xem-dong', 'Xem dòng chảy (ống trong suốt, hạt chuyển động)', (b) => { xem.xemDong = b; apDungXem(); }),
    chon('mau-luu-chat', 'Tô màu ống theo lưu chất', (b) => { xem.mauLuuChat = b; apDungXem(); }),
    h('div', { class: 'phan-doan rong', role: 'group', 'aria-label': 'Làm nổi bật mạch' },
      ...[['tatCa', 'Tất cả'], ['nuocLanh', 'Nước lạnh'], ['giaiNhiet', 'Giải nhiệt'], ['moiChat', 'Môi chất']].map(([k, ten]) =>
        h('button', { class: k === 'tatCa' ? 'chon' : '', 'data-mach': k, onclick: () => datMach(k) }, ten))),
    h('h2', {}, 'Nhãn và chất lượng'),
    chon('nhan-tb', 'Nhãn thiết bị', (b) => { xem.nhan = b; apDungNhan(); }, true),
    chon('nhan-ong', 'Nhãn nhiệt độ, trạng thái môi chất', (b) => { xem.nhanOng = b; apDungNhan(); }, true),
    chon('chat-luong', 'Chế độ tiết kiệm (bóng mờ hơn, ít hạt hơn)', (b) => { xem.chatLuong = b ? 'thap' : 'cao'; apDungChatLuong(); }),
  );
  function datMach(k) {
    xem.mach = k;
    tHT.querySelectorAll('[data-mach]').forEach((b) => b.classList.toggle('chon', b.dataset.mach === k));
    apDungXem();
  }

  // --- Tab cấu tạo: cây thành phần ---
  const tCT = document.getElementById('tab-cau-tao');
  const cay = h('ul', { class: 'cay', role: 'tree', 'aria-label': 'Cấu tạo hệ thống' });
  tCT.append(h('p', { class: 'ghi-chu' }, 'Bấm tên để chọn và xem chức năng; bỏ dấu để ẩn bộ phận.'), cay);
  const hangCay = new Map();
  function dungCay(ma, cap) {
    const m = thanhPhan.get(ma);
    const coCon = m.con.length > 0;
    const li = h('li', { role: 'treeitem', 'aria-expanded': coCon ? (cap < 1 ? 'true' : 'false') : null });
    const hop = h('input', { type: 'checkbox', checked: true, 'aria-label': `Hiện ${m.ten}`, onchange: (e) => datHien(ma, e.target.checked) });
    const nutMo = coCon ? h('button', { class: 'mo-cay', 'aria-label': 'Mở rộng', onclick: () => { const mo = li.getAttribute('aria-expanded') === 'true'; li.setAttribute('aria-expanded', mo ? 'false' : 'true'); } }, '') : h('span', { class: 'mo-cay rong' });
    const ten = h('button', { class: 'ten-cay', onclick: () => { chonMa(ma); } }, m.the ? h('span', { class: 'the-nho' }, m.the) : null, m.ten);
    li.append(h('div', { class: 'dong-cay' }, nutMo, hop, ten));
    if (coCon) { const ul = h('ul', { role: 'group' }); for (const c of m.con) ul.append(dungCay(c, cap + 1)); li.append(ul); }
    hangCay.set(ma, { li, hop, ten });
    return li;
  }
  for (const ma of ['chiller', 'thap', 'bom-nl', 'bom-gn', 'ahu', 'bgn', 'duong-ong']) cay.append(dungCay(ma, 0));

  // ---------------- Hiện/ẩn theo cây ----------------
  function laConCanh(o, cha) { for (let x = o; x; x = x.parent) if (x === cha) return true; return false; }
  function datHien(ma, v) {
    const m = thanhPhan.get(ma);
    m.vatThe.visible = v;
    const r = hangCay.get(ma); if (r) r.hop.checked = v;
    for (const c of m.con) { const mc = thanhPhan.get(c); if (!laConCanh(mc.vatThe, m.vatThe)) datHien(c, v); else { const rc = hangCay.get(c); if (rc) rc.hop.checked = v && mc.vatThe.visible; } }
  }
  let coLap = null;
  function coLapMa(ma) {
    hienTatCa();
    const m = thanhPhan.get(ma);
    const giu = new Set();
    for (let o = m.vatThe; o; o = o.parent) giu.add(o);
    coLap = [];
    for (let o = m.vatThe; o && o !== scene; o = o.parent) {
      const cha = o.parent;
      if (!cha) break;
      for (const anh of cha.children) if (!giu.has(anh) && anh.visible && (anh.isMesh || anh.isGroup || anh.isInstancedMesh) && anh.userData.boQuaChon !== true) { anh.visible = false; coLap.push(anh); }
    }
    // Giữ sàn và ánh sáng; đường ống thuộc cụm khác bị ẩn theo
  }
  function hienTatCa() {
    if (coLap) { for (const o of coLap) o.visible = true; coLap = null; }
    for (const ma of thanhPhan.keys()) { const m = thanhPhan.get(ma); if (!m.vatThe.visible && !m.vatThe.userData.anTheoCheDo) datHien(ma, true); }
    apDungXem();
  }

  // ---------------- Chế độ xem ----------------
  const dsMN = [tb.chiller.voChiller];
  function apDungXem() {
    boNoiBat();
    datMatCat('binhBayHoi', xem.cat.binhBayHoi);
    datMatCat('binhNgung', xem.cat.binhNgung);
    datMatCat('mayNen', xem.cat.mayNen);
    datMatCat(tb.bomNL.khoaCat, xem.cat.bom);
    datMatCat(tb.bomGN.khoaCat, xem.cat.bom);
    datMatCat('binhGianNo', xem.cat.binhGianNo);
    for (const o of dsMN[0]) { o.visible = !xem.voChiller; o.userData.anTheoCheDo = xem.voChiller; }
    for (const o of tb.thap.voThap) { o.visible = !xem.voThap; o.userData.anTheoCheDo = xem.voThap; }
    for (const o of tb.ahu.voAHU) { o.visible = !xem.voAHU; o.userData.anTheoCheDo = xem.voAHU; }
    // Nội thất bình: chỉ hiện khi cắt, ẩn vỏ hoặc tháo nắp
    for (const it of tb.chiller.noiThat) it.obj.visible = dangCat(it.nhom) || xem.voChiller || (it.napMo && xem.napMo);
    tb.chiller.capCat.binhBayHoi.visible = xem.cat.binhBayHoi && !xem.voChiller;
    tb.chiller.capCat.binhNgung.visible = xem.cat.binhNgung && !xem.voChiller;
    const nuocTrongOng = [xem.cat.binhBayHoi || xem.voChiller || xem.xemDong || xem.mach === 'nuocLanh', xem.cat.binhNgung || xem.voChiller || xem.xemDong || xem.mach === 'giaiNhiet'];
    tb.chiller.boOng.forEach((b, i) => b.pass.forEach((p) => { p.mesh.material = nuocTrongOng[i] ? p.vlNuoc : VL.dong; }));
    datCheDoOng(ong, { mauLuuChat: xem.mauLuuChat, xemDong: xem.xemDong, machNoiBat: xem.mach });
    apDungNhan();
    if (dangChon) lamNoiBat(dangChon);
  }

  function apDungChatLuong() {
    ha.st.chatLuong = xem.chatLuong;
    const cao = xem.chatLuong === 'cao';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cao ? 2 : 1.25));
    canh.matTroi.shadow.mapSize.set(cao ? 2048 : 1024, cao ? 2048 : 1024);
    canh.matTroi.shadow.map?.dispose();
    canh.matTroi.shadow.map = null;
    canh.matTroi.shadow.radius = cao ? 3 : 1;
    canh.matTroi.castShadow = cao; // tiết kiệm: tắt bóng đổ
  }

  // ---------------- Góc nhìn ----------------
  function datGoc(k, tucThi = false) {
    const tam = canh.tamMacDinh;
    const g = { tongThe: [35, 38, 8.4], tren: [89.5, 0, 9.0], truoc: [6, 0, 8.6], ben: [6, 90, 8.0] }[k];
    canh.bay(canh.gocNhin(tam, g[0], g[1], g[2]), tam, tucThi ? 0 : 1.1);
  }
  const GOC_TB = {
    chiller: [26, 42], 'ch-mn': [24, 18], 'ch-bbh': [22, 28], 'ch-bn': [30, 160], 'ch-bbh-hop': [14, -62], 'ch-tu': [12, 88], 'ch-exv': [22, 62],
    thap: [24, 48], 'bom-nl': [26, 68], 'bom-gn': [26, 112], ahu: [22, 58], bgn: [20, 55],
  };
  function phongTo(ma, tucThi = false) {
    const m = thanhPhan.get(ma);
    if (!m) return;
    let o = m.vatThe;
    const hop = new THREE.Box3();
    o.updateWorldMatrix(true, true);
    o.traverseVisible((x) => { if ((x.isMesh || x.isInstancedMesh) && x.userData.boQuaChon !== true && x.geometry) { x.geometry.computeBoundingBox(); const b = x.isInstancedMesh ? new THREE.Box3().setFromObject(x) : x.geometry.boundingBox.clone().applyMatrix4(x.matrixWorld); hop.union(b); } });
    if (hop.isEmpty()) hop.setFromObject(o);
    if (ma === 'ch-bbh-hop') hop.expandByVector(new THREE.Vector3(0.3, 0.2, 0.6));
    if (ma === 'ch-exv') hop.expandByVector(new THREE.Vector3(0.25, 0.15, 0.45));
    const tam = hop.getCenter(new THREE.Vector3());
    const R = Math.max(0.35, hop.getSize(new THREE.Vector3()).length() / 2) * 0.95;
    let g = GOC_TB[ma];
    if (!g) {
      const d = camera.position.clone().sub(controls.target).normalize();
      g = [THREE.MathUtils.radToDeg(Math.asin(d.y)), THREE.MathUtils.radToDeg(Math.atan2(d.x, d.z))];
    }
    canh.bay(canh.gocNhin(tam, Math.max(8, g[0]), g[1], R), tam, tucThi ? 0 : 1.0);
  }

  // ---------------- Làm nổi bật thiết bị đang chọn ----------------
  const banSang = new Map();
  const mauSang = new THREE.Color(MAU.noiBat);
  function vlSang(m) {
    let s = banSang.get(m);
    if (!s) {
      s = m.clone();
      if (s.emissive) { s.emissive = mauSang.clone(); s.emissiveIntensity = 0.42; }
      else if (s.color) s.color = s.color.clone().lerp(mauSang, 0.55);
      banSang.set(m, s);
    }
    s.clippingPlanes = m.clippingPlanes; s.clipIntersection = m.clipIntersection; s.visible = m.visible;
    return s;
  }
  khiDoiMatCat(() => { for (const [m, s] of banSang) { s.clippingPlanes = m.clippingPlanes; s.clipIntersection = m.clipIntersection; s.needsUpdate = true; } });
  let doiTuongSang = [];
  function lamNoiBat(muc) {
    boNoiBat();
    muc.vatThe.traverse((o) => {
      if (!(o.isMesh || o.isInstancedMesh) || o.userData.boQuaChon || Array.isArray(o.material)) return;
      o.userData.vlGoc = o.material;
      o.material = vlSang(o.material);
      doiTuongSang.push(o);
    });
  }
  function boNoiBat() {
    for (const o of doiTuongSang) if (o.userData.vlGoc) { o.material = o.userData.vlGoc; delete o.userData.vlGoc; }
    doiTuongSang = [];
  }

  // ---------------- Thẻ thông tin thiết bị đang chọn ----------------
  const the = document.getElementById('the-chon');
  function chonMa(ma) {
    const m = thanhPhan.get(ma);
    if (!m) return;
    dangChon = m;
    lamNoiBat(m);
    the.hidden = false;
    the.replaceChildren(
      h('div', { class: 'the-dau' },
        h('div', {}, m.the ? h('span', { class: 'the-nho' }, m.the) : null, h('h3', {}, m.ten),
          h('p', { class: 'duong-dan' }, chuoiCha(ma))),
        h('button', { class: 'dong', 'aria-label': 'Đóng', onclick: boChon }, '×')),
      m.chucNang ? h('p', {}, h('strong', {}, 'Chức năng. '), m.chucNang) : null,
      m.cauTao ? h('p', {}, h('strong', {}, 'Cấu tạo. '), m.cauTao) : null,
      h('dl', { class: 'so-the', id: 'so-the' }),
      h('div', { class: 'nhom-nut' },
        h('button', { class: 'nut nho', onclick: () => phongTo(ma) }, 'Phóng gần'),
        h('button', { class: 'nut nho', onclick: () => datHien(ma, false) }, 'Ẩn'),
        h('button', { class: 'nut nho', onclick: () => coLapMa(ma) }, 'Chỉ xem mục này'),
        h('button', { class: 'nut nho', onclick: hienTatCa }, 'Hiện tất cả')),
    );
    capNhatSoThe();
    for (const [k, r] of hangCay) r.ten.classList.toggle('dang-chon', k === ma);
  }
  function chuoiCha(ma) {
    const ds = [];
    for (let m = thanhPhan.get(ma)?.cha && thanhPhan.get(thanhPhan.get(ma).cha); m; m = m.cha ? thanhPhan.get(m.cha) : null) ds.unshift(m.ten);
    return ds.join(' › ');
  }
  function boChon() { dangChon = null; boNoiBat(); the.hidden = true; for (const r of hangCay.values()) r.ten.classList.remove('dang-chon'); }
  function timThongSo(m) { for (let x = m; x; x = x.cha ? thanhPhan.get(x.cha) : null) if (x.thongSo) return x.thongSo; return null; }
  function capNhatSoThe() {
    const dl = document.getElementById('so-the');
    if (!dl || !dangChon) return;
    const s = vh.so, k = timThongSo(dangChon);
    const ds = {
      chiller: [['Máy nén', s.tenTTMN], ['Công suất lạnh', `${so0(s.qMay)} kW`], ['Điện máy nén', `${so0(s.pDien)} kW`], ['COP', s.cop ? so1(s.cop) : '–']],
      bbh: [['Nước vào / ra', `${so1(s.tHoiNL)} / ${so1(s.tCapNL)} °C`], ['Bay hơi', `${so1(s.tBayHoi)} °C · ${so1(s.pBayHoi)} bar`], ['Lưu lượng', `${so0(s.qNL)} m³/h`]],
      bn: [['Nước vào / ra', `${so1(s.tVaoNg)} / ${so1(s.tRaNg)} °C`], ['Ngưng tụ', `${so1(s.tNgung)} °C · ${so1(s.pNgung)} bar`], ['Lưu lượng', `${so0(s.qGN)} m³/h`]],
      mn: [['Trạng thái', s.tenTTMN], ['Van trượt (tải)', pt(s.vanTruot)], ['Áp hút / đẩy', `${so1(s.pBayHoi)} / ${so1(s.pNgung)} bar`], ['Nhiệt độ đẩy', `${so1(s.tDay)} °C`]],
      exv: [['Độ mở', `${so0(s.exv)} %`], ['Trước van', `${so1(s.pNgung)} bar · ${so1(s.tLong)} °C`], ['Sau van', `${so1(s.pBayHoi)} bar · ${so1(s.tBayHoi)} °C`]],
      'bom-nl': [['Tốc độ', pt(s.nBomNL)], ['Lưu lượng', `${so0(s.qNL)} m³/h`], ['Áp hút / đẩy', `${so1(s.pHutBomNL)} / ${so1(s.pDayBomNL)} bar`]],
      'bom-gn': [['Tốc độ', pt(s.nBomGN)], ['Lưu lượng', `${so0(s.qGN)} m³/h`], ['Áp hút / đẩy', `${so1(s.pHutBomGN)} / ${so1(s.pDayBomGN)} bar`]],
      thap: [['Quạt', pt(s.nQuat)], ['Nước vào / ra tháp', `${so1(s.tRaNg)} / ${so1(s.tVaoNg)} °C`], ['Bầu ướt', `${so1(THIET_KE.tBauUot)} °C`], ['Lưu lượng', `${so0(s.qGN)} m³/h`]],
      ahu: [['Nhu cầu lạnh', `${so0(s.qCan)} kW`], ['Đáp ứng', `${so0(s.qAHU)} kW`], ['Nước qua coil', pt(s.van3)], ['Quạt', pt(s.nQuatAHU)]],
      bgn: [['Áp tĩnh tại điểm nối', `${so1(s.pHutBomNL)} bar`], ['Nhiệt độ nước trung bình', `${so1((s.tCapNL + s.tHoiNL) / 2)} °C`]],
    }[k];
    dl.replaceChildren(...(ds || []).flatMap(([a, b]) => [h('dt', {}, a), h('dd', {}, b)]));
    dl.hidden = !ds;
  }

  // ---------------- Chọn bằng chuột ----------------
  const tia = new THREE.Raycaster();
  const chuot = new THREE.Vector2();
  const dsChon = [tb.chiller.goc, tb.thap.goc, tb.bomNL.goc, tb.bomGN.goc, tb.ahu.goc, tb.bgn.goc, ong.goc];
  const hienThat = (o) => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true; };
  function biCat(hit) {
    const m = hit.object.material;
    const ps = m && m.clippingPlanes;
    if (!ps || !ps.length) return false;
    const am = ps.map((p) => p.distanceToPoint(hit.point) < 0);
    return m.clipIntersection ? am.every(Boolean) : am.some(Boolean);
  }
  function timTrung(e) {
    const r = renderer.domElement.getBoundingClientRect();
    chuot.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    tia.setFromCamera(chuot, camera);
    for (const hit of tia.intersectObjects(dsChon, true)) {
      const o = hit.object;
      if (o.userData.boQuaChon || !hienThat(o) || biCat(hit)) continue;
      if (o.material && o.material.opacity < 0.2 && o.material.transparent) continue;
      return hit;
    }
    return null;
  }
  let nhan0 = null;
  const goiY = document.getElementById('goi-y');
  renderer.domElement.addEventListener('pointerdown', (e) => { nhan0 = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!nhan0 || Math.hypot(e.clientX - nhan0.x, e.clientY - nhan0.y) > 6) { nhan0 = null; return; }
    nhan0 = null;
    const hit = timTrung(e);
    if (!hit) { boChon(); return; }
    const hd = hit.object.userData.hanhDong;
    if (hd) {
      if (hd === 'khoiDong') vh.datBat('mayNen', true);
      if (hd === 'dung') vh.datBat('mayNen', false);
      if (hd === 'datLai') vh.datLai();
      if (hd === 'dungKhan') vh.dungTatCa();
      dongBoNut();
    }
    const m = timThanhPhan(hit.object);
    if (m) chonMa(m.ma);
  });
  let henGoiY = 0, suKienCuoi = null;
  renderer.domElement.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && e.buttons === 0) suKienCuoi = e; else { suKienCuoi = null; goiY.hidden = true; } });
  renderer.domElement.addEventListener('pointerleave', () => { suKienCuoi = null; goiY.hidden = true; });
  function capNhatGoiY(dt) {
    henGoiY -= dt;
    if (henGoiY > 0 || !suKienCuoi) return;
    henGoiY = 0.12;
    const e = suKienCuoi;
    suKienCuoi = null;
    const hit = timTrung(e);
    const m = hit && timThanhPhan(hit.object);
    if (!m) { goiY.hidden = true; renderer.domElement.style.cursor = ''; return; }
    const r = renderer.domElement.getBoundingClientRect();
    goiY.textContent = hit.object.userData.hanhDong ? `${m.ten} – nút ${{ khoiDong: 'khởi động', dung: 'dừng', datLai: 'đặt lại', dungKhan: 'dừng khẩn' }[hit.object.userData.hanhDong]}` : m.ten;
    goiY.style.left = `${e.clientX - r.left + 14}px`;
    goiY.style.top = `${e.clientY - r.top + 12}px`;
    goiY.hidden = false;
    renderer.domElement.style.cursor = 'pointer';
  }

  // ---------------- Nhãn tiếng Việt ----------------
  const dsNhan = [];
  function taoNhan(chu, vt, { loai = 'tb', uuTien = 1, mau = null, nhomCat = null, cha = scene } = {}) {
    const el = h('div', { class: `nhan nhan-${loai}` });
    if (mau) el.style.setProperty('--mau-nhan', mau);
    el.innerHTML = chu;
    const o = new CSS2DObject(el);
    o.position.copy(vt);
    cha.add(o);
    const n = { o, el, loai, uuTien, nhomCat };
    dsNhan.push(n);
    return n;
  }
  const tren = (obj, them = 0.25) => { const b = new THREE.Box3().setFromObject(obj); const c = b.getCenter(new THREE.Vector3()); c.y = b.max.y + them; return c; };
  taoNhan('<b>CH-01</b> Chiller trục vít', tren(tb.chiller.goc), { uuTien: 10 });
  taoNhan('<b>CT-01</b> Tháp giải nhiệt', tren(tb.thap.goc, 0.4), { uuTien: 10 });
  taoNhan('<b>CHWP-01</b> Bơm nước lạnh', tren(tb.bomNL.goc, 0.2), { uuTien: 9 });
  taoNhan('<b>CWP-01</b> Bơm giải nhiệt', tren(tb.bomGN.goc, 0.2), { uuTien: 9 });
  taoNhan('<b>AHU-01</b> Khối xử lý không khí', tren(tb.ahu.goc, 0.25), { uuTien: 10 });
  taoNhan('<b>ET-01</b> Bình giãn nở', tren(tb.bgn.goc, 0.15), { uuTien: 8 });
  // Nhãn trên ống (cập nhật giá trị liên tục)
  const tuyen = (ma) => ong.dsTuyen.find((t) => t.ma === ma);
  const diem = (ma, s, lech = new THREE.Vector3(0, 0.32, 0)) => { const t = tuyen(ma).tuyen; return t.diemTai(s < 0 ? t.dai + s : s).p.clone().add(lech); };
  const nhanOng = [
    { n: taoNhan('', diem('nl-cap', -2.6), { loai: 'ong', uuTien: 7, mau: MAU.nuocLanhCap }), f: (s) => `Nước lạnh cấp <b>${so1(s.tCapNL)} °C</b>` },
    { n: taoNhan('', diem('nl-bom', -0.9), { loai: 'ong', uuTien: 7, mau: MAU.nuocLanhHoi }), f: (s) => `Nước lạnh hồi <b>${so1(s.tHoiNL)} °C</b>` },
    { n: taoNhan('', diem('gn-bom', -0.9), { loai: 'ong', uuTien: 7, mau: MAU.nuocVaoNgung }), f: (s) => `Vào bình ngưng <b>${so1(s.tVaoNg)} °C</b>` },
    { n: taoNhan('', diem('gn-ve', -3.0), { loai: 'ong', uuTien: 7, mau: MAU.nuocRaNgung }), f: (s) => `Nước nóng về tháp <b>${so1(s.tRaNg)} °C</b>` },
    { n: taoNhan('', diem('nl-hoi', 1.0), { loai: 'ong', uuTien: 5, mau: MAU.nuocLanhHoi }), f: (s) => `Hồi từ AHU · ${so0(s.qNL)} m³/h` },
    { n: taoNhan('', diem('gn-thap', 1.2), { loai: 'ong', uuTien: 5, mau: MAU.nuocVaoNgung }), f: (s) => `Từ bể tháp · ${so0(s.qGN)} m³/h` },
    { n: taoNhan('', diem('mc-hut', 0.25, new THREE.Vector3(-0.15, 0.1, 0.25)), { loai: 'mc', uuTien: 6, mau: MAU.hoiHaAp }), f: (s) => `Hơi hạ áp · ${so1(s.pBayHoi)} bar · ${so1(s.tHut)} °C` },
    { n: taoNhan('', diem('mc-day', 0.35, new THREE.Vector3(0.1, 0.15, 0.1)), { loai: 'mc', uuTien: 6, mau: MAU.hoiCaoAp }), f: (s) => `Hơi cao áp quá nhiệt · ${so1(s.pNgung)} bar · ${so0(s.tDay)} °C` },
    { n: taoNhan('', diem('mc-long', 0.5, new THREE.Vector3(0.25, -0.05, 0)), { loai: 'mc', uuTien: 6, mau: MAU.longCaoAp }), f: (s) => `Lỏng cao áp · ${so1(s.tLong)} °C` },
    { n: taoNhan('', diem('mc-tietluu', -0.4, new THREE.Vector3(0.2, 0.05, 0.25)), { loai: 'mc', uuTien: 6, mau: MAU.haiPha }), f: (s) => `Sau tiết lưu: lỏng – hơi · ${so1(s.pBayHoi)} bar` },
  ];
  for (const n of tb.chiller.nhanMatCat) taoNhan(n.chu, n.vt, { loai: 'cat', uuTien: 9, nhomCat: n.nhom });
  function apDungNhan() {
    for (const n of dsNhan) {
      let hien = false;
      if (n.loai === 'tb') hien = xem.nhan;
      else if (n.loai === 'ong') hien = xem.nhanOng && (xem.mach === 'tatCa' || (n.el.style.getPropertyValue('--mau-nhan') && laMauMach(n.el.style.getPropertyValue('--mau-nhan'))));
      else if (n.loai === 'mc') hien = xem.nhanOng && (xem.mach === 'moiChat' || xem.xemDong || xem.mauLuuChat || xem.cat.mayNen);
      else if (n.loai === 'cat') hien = dangCat(n.nhomCat) || (xem.voChiller && n.nhomCat !== 'mayNen');
      n.o.visible = hien;
    }
  }
  function laMauMach(mau) {
    const m = { nuocLanh: [MAU.nuocLanhCap, MAU.nuocLanhHoi], giaiNhiet: [MAU.nuocVaoNgung, MAU.nuocRaNgung], moiChat: [] }[xem.mach] || [];
    return m.includes(mau.trim());
  }
  // Ẩn bớt nhãn chồng lên nhau, giữ nhãn ưu tiên cao
  let henNhan = 0;
  function chongChong(dt) {
    henNhan -= dt;
    if (henNhan > 0) return;
    henNhan = 0.2;
    const ds = dsNhan.filter((n) => n.o.visible && n.el.style.display !== 'none').sort((a, b) => b.uuTien - a.uuTien);
    const daDat = [];
    for (const n of ds) {
      n.el.classList.remove('bi-che');
      const r = n.el.getBoundingClientRect();
      if (!r.width) continue;
      const trung = daDat.some((q) => r.left < q.right + 4 && r.right > q.left - 4 && r.top < q.bottom + 2 && r.bottom > q.top - 2);
      if (trung) n.el.classList.add('bi-che'); else daDat.push(r);
    }
  }

  // ---------------- Chú giải, tình trạng ----------------
  const chuGiai = document.getElementById('chu-giai');
  const muc = (k, ten, kieu = 'ong') => h('li', {}, h('span', { class: `mau mau-${kieu}`, style: `--m:${MAU[k]}` }), ten);
  chuGiai.append(
    h('details', { open: window.innerWidth > 700 ? true : null },
      h('summary', {}, 'Chú giải màu'),
      h('div', { class: 'cot-chu-giai' },
        h('div', {}, h('p', {}, 'Nước'), h('ul', {}, muc('nuocLanhCap', TEN_LUU_CHAT.nuocLanhCap), muc('nuocLanhHoi', TEN_LUU_CHAT.nuocLanhHoi), muc('nuocVaoNgung', 'Từ tháp vào bình ngưng'), muc('nuocRaNgung', 'Nóng từ bình ngưng về tháp'))),
        h('div', {}, h('p', {}, 'Môi chất R134a'), h('ul', {}, muc('hoiCaoAp', 'Hơi cao áp (đẩy)'), muc('longCaoAp', 'Lỏng cao áp'), muc('haiPha', 'Lỏng – hơi sau tiết lưu'), muc('hoiHaAp', 'Hơi hạ áp (hút)'), muc('dau', 'Dầu hồi'))),
        h('div', {}, h('p', {}, 'Không khí'), h('ul', {}, muc('khiNong', 'Gió hồi trước coil', 'khi'), muc('khiLanh', 'Gió cấp sau coil', 'khi'), muc('khiThap', 'Gió qua tháp', 'khi'))))),
  );
  const tinhTrang = document.getElementById('tinh-trang');

  function capNhatBang() {
    const s = vh.so;
    // Tình trạng thiết bị
    const tt = (n, tg) => (n > 0.02 ? (n < 0.98 * tg ? 'Đang tăng/giảm tốc' : 'Chạy') : 'Dừng');
    const muc = [
      ['CHWP-01', 'Bơm NL', s.nBomNL > 0.02 ? 'chay' : 'dung', s.nBomNL > 0.02 ? `${pt(s.nBomNL)} · ${so0(s.qNL)} m³/h` : 'Dừng'],
      ['CWP-01', 'Bơm GN', s.nBomGN > 0.02 ? 'chay' : 'dung', s.nBomGN > 0.02 ? `${pt(s.nBomGN)} · ${so0(s.qGN)} m³/h` : 'Dừng'],
      ['CT-01', 'Quạt tháp', s.nQuat > 0.02 ? 'chay' : 'dung', s.nQuat > 0.02 ? (s.nQuat > 0.98 ? 'Chạy' : 'Tăng tốc') : 'Dừng'],
      ['CH-01', 'Máy nén', { chay: 'chay', 'bao-ve': 'loi', tat: 'dung' }[s.ttMN] || 'cho', s.ttMN === 'chay' ? `Chạy · tải ${pt(s.vanTruot)}` : s.tenTTMN],
    ];
    tinhTrang.replaceChildren(...muc.map(([t, ten, k, gt]) => h('li', { class: `tt-${k}` }, h('span', { class: 'cham', 'aria-hidden': 'true' }), h('span', { class: 'tt-ten' }, ten), h('span', { class: 'tt-gt' }, gt))));
    const ghi = (id, chu, k) => { const el = document.getElementById(id); if (el) { el.textContent = chu; el.dataset.k = k; } };
    ghi('tt-CHWP-01', s.nBomNL > 0.02 ? `${tt(s.nBomNL, vh.dk.bomNL.tocDo)} · ${so0(s.qNL)} m³/h · công tắc dòng chảy ${s.ctNL ? 'đóng' : 'hở'}` : 'Dừng · không có lưu lượng', s.nBomNL > 0.02 ? 'chay' : 'dung');
    ghi('tt-CWP-01', s.nBomGN > 0.02 ? `${tt(s.nBomGN, vh.dk.bomGN.tocDo)} · ${so0(s.qGN)} m³/h · công tắc dòng chảy ${s.ctGN ? 'đóng' : 'hở'}` : 'Dừng · không có lưu lượng', s.nBomGN > 0.02 ? 'chay' : 'dung');
    ghi('tt-CT-01', s.nQuat > 0.02 ? `Chạy ${pt(s.nQuat)}` : 'Dừng · tháp chỉ có gió tự nhiên', s.nQuat > 0.02 ? 'chay' : 'dung');
    ghi('tt-CH-01', s.ttMN === 'chay' ? `Đang chạy · van trượt ${pt(s.vanTruot)} · ${so0(s.pDien)} kW điện` : s.tenTTMN, { chay: 'chay', 'bao-ve': 'loi', tat: 'dung' }[s.ttMN] || 'cho');
    ghi('tt-AHU-01', `Nhu cầu ${so0(s.qCan)} kW · đáp ứng ${so0(s.qAHU)} kW · nước qua coil ${pt(s.van3)}`, s.qAHU > 1 ? 'chay' : 'dung');
    hopTB.replaceChildren(...s.thongBao.map((t) => h('p', { class: `tb-${t.muc}` }, h('span', { class: 'bieu-tuong', 'aria-hidden': 'true' }, t.muc === 'loi' ? '✕' : t.muc === 'cho' ? '!' : 'i'), h('span', {}, t.chu))));
    // Bảng số
    const bs = document.getElementById('bang-so');
    const o = (nhan, gt, mau) => h('div', { class: 'o-so' }, h('span', { class: 'o-nhan' }, mau ? h('i', { style: `--m:${mau}` }) : null, nhan), h('span', { class: 'o-gt' }, gt));
    bs.replaceChildren(
      h('p', { class: 'nhom-so' }, 'Mạch nước lạnh'),
      o('Cấp (ra bình bay hơi)', `${so1(s.tCapNL)} °C`, MAU.nuocLanhCap), o('Hồi (vào bình bay hơi)', `${so1(s.tHoiNL)} °C`, MAU.nuocLanhHoi), o('Lưu lượng', `${so0(s.qNL)} m³/h`),
      h('p', { class: 'nhom-so' }, 'Mạch nước giải nhiệt'),
      o('Vào bình ngưng', `${so1(s.tVaoNg)} °C`, MAU.nuocVaoNgung), o('Ra bình ngưng', `${so1(s.tRaNg)} °C`, MAU.nuocRaNgung), o('Lưu lượng', `${so0(s.qGN)} m³/h`),
      h('p', { class: 'nhom-so' }, 'Tải lạnh và điện'),
      o('Nhu cầu AHU', `${so0(s.qCan)} kW`), o('Chiller cấp', `${so0(s.qMay)} kW`), o('Điện máy nén', `${so0(s.pDien)} kW`), o('COP', s.cop ? so1(s.cop) : '–'),
      h('p', { class: 'nhom-so' }, 'Mạch môi chất'),
      o('Bay hơi', `${so1(s.tBayHoi)} °C · ${so1(s.pBayHoi)} bar`, MAU.hoiHaAp), o('Ngưng tụ', `${so1(s.tNgung)} °C · ${so1(s.pNgung)} bar`, MAU.hoiCaoAp),
      o('Van trượt', pt(s.vanTruot)), o('Van tiết lưu', `${so0(s.exv)} %`),
    );
    for (const { n, f } of nhanOng) n.el.innerHTML = f(s);
    capNhatSoThe();
  }

  // ---------------- Vòng cập nhật ----------------
  let henBang = 0;
  function capNhat(dt) {
    // Nắp hộp nước trượt ra
    const dich = xem.napMo ? 1 : 0;
    if (napK !== dich) {
      napK = dich > napK ? Math.min(1, napK + dt * 1.2) : Math.max(0, napK - dt * 1.2);
      const k = napK < 0.5 ? 2 * napK * napK : 1 - Math.pow(-2 * napK + 2, 2) / 2;
      for (const nap of Object.values(tb.chiller.nap)) { nap.position.x = -0.62 * k; nap.position.y = -0.05 * Math.sin(k * Math.PI); }
    }
    henBang -= dt;
    if (henBang <= 0) { henBang = 0.25; capNhatBang(); }
    capNhatGoiY(dt);
    chongChong(dt);
  }

  // Khôi phục tab đã mở
  let tab = 'van-hanh';
  try { tab = localStorage.getItem('chiller-tab') || tab; } catch { /* bỏ qua */ }
  if (!tabs.some(([k]) => k === tab)) tab = 'van-hanh';
  moTab(tab);
  dongBoNut();
  apDungXem();
  capNhatBang();

  return {
    capNhat, xem, datGoc, phongTo, chonMa, apDungXem, datMach, dongBoNut,
    datXem: (k, v) => { if (k in xem.cat) xem.cat[k] = v; else xem[k] = v; apDungXem(); },
  };
}
