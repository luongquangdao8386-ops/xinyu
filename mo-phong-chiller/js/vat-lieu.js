// Thư viện vật liệu dùng chung, kết cấu vẽ bằng canvas và bộ quản lý mặt cắt (clipping plane).
// Mọi thiết bị lấy vật liệu từ VL để không tạo vật liệu trùng lặp.

import * as THREE from 'three';
import { MAU } from './cau-hinh.js';

export const VL = {};

const chuan = (mau, nham, kimLoai = 0, them = {}) =>
  new THREE.MeshStandardMaterial({ color: mau, roughness: nham, metalness: kimLoai, ...them });

export function taoVatLieu() {
  Object.assign(VL, {
    // Thép sơn: khung, thân bình, giá đỡ
    khung: chuan('#34414d', 0.62, 0.35),
    thepSon: chuan('#617a8c', 0.5, 0.3),
    thepSonSang: chuan('#a7b4be', 0.55, 0.25),
    binhNgung: chuan('#8e9aa4', 0.32, 0.75), // thép kim loại, sơn trong
    mayNen: chuan('#3f5f58', 0.45, 0.4), // gang đúc sơn xanh xám
    dongCo: chuan('#1f4e8c', 0.42, 0.35), // vỏ động cơ sơn xanh
    vanGang: chuan('#8c2c26', 0.5, 0.25), // thân van gang sơn đỏ
    vanXanh: chuan('#24507a', 0.48, 0.25),
    vang: chuan('#e2ad12', 0.5, 0.2), // nắp che, lan can: vàng an toàn
    // Kim loại màu
    nhom: chuan('#c9ced3', 0.3, 0.95),
    nhomVo: chuan('#d6dadd', 0.42, 0.85), // lớp vỏ nhôm bọc bảo ôn ống
    dong: chuan('#b8703d', 0.3, 1),
    dongThau: chuan('#c8a046', 0.32, 1),
    inox: chuan('#d8dcdf', 0.22, 1),
    thep: chuan('#9aa2a8', 0.35, 0.9), // trục, bu lông mạ kẽm
    thepToi: chuan('#4b5157', 0.4, 0.85),
    // Phi kim
    caoSu: chuan('#1d1e20', 0.92, 0),
    baoOn: chuan('#151617', 0.97, 0), // xốp cao su lưu hóa màu đen
    baoOnCat: chuan('#3d4146', 0.95, 0), // mặt cắt lớp bảo ôn
    nhua: chuan('#2b2e31', 0.6, 0),
    nhuaTrang: chuan('#e9ecee', 0.55, 0),
    betong: chuan('#bdbbb4', 0.95, 0),
    frp: chuan('#cfd7dc', 0.6, 0.05), // vỏ tháp composite
    frpDam: chuan('#7d8b95', 0.55, 0.15),
    fill: chuan('#eef3f5', 0.75, 0, { side: THREE.DoubleSide, transparent: true, opacity: 0.55 }),
    tamAHU: chuan('#e5e8ea', 0.5, 0.1),
    tuDien: chuan('#d5d8d3', 0.55, 0.1),
    loc: chuan('#f4f1e6', 0.9, 0, { side: THREE.DoubleSide }),
    vai: chuan('#4a4f55', 0.9, 0), // khớp mềm ống gió
    day: chuan('#18191b', 0.7, 0), // dây tín hiệu
    ongLuon: chuan('#8b9196', 0.4, 0.6),
    // Trong suốt
    kinh: new THREE.MeshStandardMaterial({ color: '#cfeee3', roughness: 0.05, metalness: 0, transparent: true, opacity: 0.45 }),
    kinhXem: chuan('#4fae6c', 0.08, 0.1, { emissive: '#103a1c' }), // chấm chỉ thị xanh: môi chất khô
    nuoc: new THREE.MeshStandardMaterial({ color: '#4c9ec2', roughness: 0.12, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false }),
    matNuoc: new THREE.MeshStandardMaterial({ color: '#3e8fa8', roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.78 }),
    giot: new THREE.MeshBasicMaterial({ color: '#3f9fd0', transparent: true, opacity: 0.9, depthWrite: false }),
    phun: new THREE.MeshBasicMaterial({ color: '#a9d9ef', transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
    // Đèn trạng thái
    denXanh: chuan('#1f7a3a', 0.3, 0, { emissive: '#000000' }),
    denVang: chuan('#8a6a10', 0.3, 0, { emissive: '#000000' }),
    denDo: chuan('#7a1f1f', 0.3, 0, { emissive: '#000000' }),
    nutXanh: chuan('#2e9b4a', 0.35, 0),
    nutDo: chuan('#c62d2d', 0.35, 0),
    nutVang: chuan('#e4b31a', 0.35, 0),
  });

  // Vật liệu theo lưu chất (chế độ màu môi chất) và bản trong suốt (chế độ xem dòng chảy).
  VL.luuChat = {};
  VL.luuChatTrong = {};
  for (const k of ['nuocLanhCap', 'nuocLanhHoi', 'nuocVaoNgung', 'nuocRaNgung', 'hoiHaAp', 'hoiCaoAp', 'longCaoAp', 'haiPha', 'dau', 'nuocBu']) {
    VL.luuChat[k] = chuan(MAU[k], 0.45, 0.1);
    VL.luuChatTrong[k] = new THREE.MeshStandardMaterial({
      color: MAU[k], roughness: 0.2, metalness: 0, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide,
    });
  }
  // Vật liệu ống "thực tế" theo mạch
  VL.ongNuocGN = chuan('#3f6b5f', 0.5, 0.3); // ống thép sơn xanh rêu
  VL.ongDong = VL.dong;

  // Lưới bảo vệ khớp nối và quạt: kết cấu lỗ đục
  VL.luoiChe = chuan('#e2ad12', 0.5, 0.2, { alphaMap: ketCauLuoi(), alphaTest: 0.5, side: THREE.DoubleSide });
  VL.locXep = chuan('#f2eee0', 0.9, 0, { map: ketCauNepLoc(), side: THREE.DoubleSide });
  VL.canhTan = chuan('#cfd4d8', 0.35, 0.9, { side: THREE.DoubleSide }); // lá nhôm dàn coil
  return VL;
}

// ---------- Kết cấu vẽ bằng canvas ----------

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function ketCauLuoi() {
  const [c, g] = canvas(64, 64);
  g.fillStyle = '#fff'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#000';
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    g.beginPath(); g.arc(8 + x * 16 + (y % 2) * 8, 8 + y * 16, 5.2, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 4);
  return t;
}

function ketCauNepLoc() {
  const [c, g] = canvas(64, 8);
  for (let x = 0; x < 64; x++) {
    const v = 200 + 40 * Math.abs(Math.sin((x / 64) * Math.PI * 6));
    g.fillStyle = `rgb(${v},${v - 4},${v - 18})`; g.fillRect(x, 0, 1, 8);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Vạch chảy trong ống trao đổi nhiệt (chế độ mặt cắt): sọc sáng trượt dọc ống.
export function ketCauSoc(mau) {
  const [c, g] = canvas(8, 64);
  const [r, gr, b] = [1, 3, 5].map((i) => parseInt(mau.slice(i, i + 2), 16));
  for (let y = 0; y < 64; y++) {
    // nền màu lưu chất, một vạch sáng mỗi chu kỳ để thấy chiều chảy
    const s = Math.pow(Math.max(0, Math.sin((y / 64) * Math.PI * 2)), 8);
    const tron = (x) => Math.round(Math.min(255, x * (0.78 + 0.22 * s) + 120 * s));
    g.fillStyle = `rgb(${tron(r)},${tron(gr)},${tron(b)})`;
    g.fillRect(0, y, 8, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Mặt đồng hồ đo: vạch chia 270°, số và đơn vị. Dùng chung theo dải đo.
const khoMatDongHo = new Map();
export function ketCauMatDongHo(min, max, donVi, buoc) {
  const khoa = `${min}|${max}|${donVi}`;
  if (khoMatDongHo.has(khoa)) return khoMatDongHo.get(khoa);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#f7f7f2'; g.beginPath(); g.arc(128, 128, 126, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#30343a'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 122, 0, Math.PI * 2); g.stroke();
  const soVach = Math.round((max - min) / buoc);
  g.fillStyle = '#1d2024'; g.font = 'bold 24px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = 0; i <= soVach * 5; i++) {
    const a = (-225 + (270 * i) / (soVach * 5)) * (Math.PI / 180);
    const lon = i % 5 === 0;
    g.strokeStyle = '#1d2024'; g.lineWidth = lon ? 4 : 2;
    g.beginPath();
    g.moveTo(128 + Math.cos(a) * (lon ? 88 : 98), 128 + Math.sin(a) * (lon ? 88 : 98));
    g.lineTo(128 + Math.cos(a) * 110, 128 + Math.sin(a) * 110);
    g.stroke();
    if (lon) {
      const v = min + (i / 5) * buoc;
      g.fillText(String(Math.round(v * 10) / 10).replace('.', ','), 128 + Math.cos(a) * 66, 128 + Math.sin(a) * 66);
    }
  }
  g.font = 'bold 26px sans-serif'; g.fillStyle = '#8c2c26';
  g.fillText(donVi, 128, 184);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  khoMatDongHo.set(khoa, t);
  return t;
}

// Biển tên nhỏ (chữ trên nền), dùng cho biển thiết bị và tủ điện.
export function ketCauBien(chu, { nen = '#eef0f2', mauChu = '#1d2730', rong = 256, cao = 64, co = 30 } = {}) {
  const [c, g] = canvas(rong, cao);
  g.fillStyle = nen; g.fillRect(0, 0, rong, cao);
  g.strokeStyle = mauChu; g.lineWidth = 3; g.strokeRect(3, 3, rong - 6, cao - 6);
  g.fillStyle = mauChu; g.font = `bold ${co}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(chu, rong / 2, cao / 2 + 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- Mặt cắt ----------
// Mỗi nhóm mặt cắt có một bộ mặt phẳng. giao = true: chỉ cắt vùng nằm phía âm của TẤT CẢ mặt phẳng
// (cắt một góc phần tư); giao = false: cắt vùng phía âm của BẤT KỲ mặt phẳng nào.

const nhomCat = new Map();
const nguoiNghe = [];

export function khaiBaoMatCat(khoa, matPhang, giao = true) {
  nhomCat.set(khoa, { matPhang, giao, bat: false, banSao: new Map() });
}

// Bản sao vật liệu thuộc nhóm mặt cắt (dùng chung trong nhóm).
export function vlCat(goc, khoa) {
  const n = nhomCat.get(khoa);
  if (!n) throw new Error(`Chưa khai báo mặt cắt ${khoa}`);
  let m = n.banSao.get(goc);
  if (!m) {
    m = goc.clone();
    m.side = THREE.DoubleSide; // nhìn được mặt trong sau khi cắt
    m.clipShadows = true;
    m.userData.nhomCat = khoa;
    n.banSao.set(goc, m);
  }
  return m;
}

export function datMatCat(khoa, bat) {
  const n = nhomCat.get(khoa);
  if (!n) return;
  n.bat = bat;
  for (const m of n.banSao.values()) {
    m.clippingPlanes = bat ? n.matPhang : null;
    m.clipIntersection = n.giao;
    m.needsUpdate = true;
  }
  for (const f of nguoiNghe) f(khoa, bat);
}

export const dangCat = (khoa) => !!nhomCat.get(khoa)?.bat;
export const khiDoiMatCat = (f) => nguoiNghe.push(f);
