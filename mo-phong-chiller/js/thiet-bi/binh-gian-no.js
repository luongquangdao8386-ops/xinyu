// Bình giãn nở kiểu màng cho mạch nước lạnh: thân bình, chân đỡ, đầu nối đáy, van nạp khí.
// Màng cao su chia bình thành khoang khí nén (trên) và khoang nước (dưới); khi nước nóng lên và nở ra,
// nước vào bình, màng bị đẩy lên. Toạ độ cục bộ: gốc ở mặt sàn dưới tâm bình.

import * as THREE from 'three';
import { VL, vlCat, khaiBaoMatCat } from '../vat-lieu.js';
import { V, mesh, nhom, truGiua, truTheoTruc, hop, geoLathe, banSao, maTran, buLongTaiDiem, dungChung, geoMatBich } from '../hinh-hoc.js';
import { dangKy } from '../thanh-phan.js';
import { VI_TRI } from '../cau-hinh.js';

export const BGN = { R: 0.25, y0: 0.45, y1: 1.05, yNoi: 0.2 };

export function dungBinhGianNo() {
  const B = BGN;
  const goc = nhom('Bình giãn nở');
  goc.position.set(VI_TRI.binhGianNo.x, 0, VI_TRI.binhGianNo.z);
  dangKy('bgn', goc, {
    ten: 'Bình giãn nở kiểu màng', the: 'ET-01',
    chucNang: 'Nối vào đường hút bơm nước lạnh để hấp thụ phần thể tích nước nở ra khi nhiệt độ tăng và giữ áp suất tĩnh ổn định tại điểm nối, tránh xâm thực ở cửa hút bơm.',
    cauTao: 'Thân thép hai đáy elip, màng cao su bên trong, van nạp khí trên đỉnh, ba chân đỡ có bản đế và bu lông neo, đầu nối nước ở đáy với van khóa có khóa tay và van xả.',
    thongSo: 'bgn',
  });
  khaiBaoMatCat('binhGianNo', [new THREE.Plane(V(-1, 0, 0), VI_TRI.binhGianNo.x)], true);
  const c = (vl) => vlCat(vl, 'binhGianNo');

  const than = nhom('Thân bình');
  const pts = [];
  for (let k = 0; k <= 8; k++) { const t = -Math.PI / 2 + (k / 8) * Math.PI / 2; pts.push([B.R * Math.cos(t) + 0.0001, B.y0 + 0.12 * Math.sin(t)]); }
  for (let k = 0; k <= 8; k++) { const t = (k / 8) * Math.PI / 2; pts.push([B.R * Math.cos(t) + 0.0001, B.y1 + 0.12 * Math.sin(t)]); }
  than.add(mesh(geoLathe(pts, 40, false), c(new THREE.MeshStandardMaterial({ color: '#b8352c', roughness: 0.45, metalness: 0.3 }))));
  // Van nạp khí và nắp trên đỉnh, biển thông số
  than.add(truGiua(V(0, B.y1 + 0.11, 0), V(0, B.y1 + 0.17, 0), 0.012, VL.dongThau, { seg: 8 }));
  than.add(truGiua(V(0, B.y1 + 0.17, 0), V(0, B.y1 + 0.19, 0), 0.015, VL.nhua, { seg: 8 }));
  than.add(hop(0.16, 0.12, 0.01, VL.nhom, V(0, (B.y0 + B.y1) / 2 + 0.1, B.R + 0.003)));
  goc.add(than);
  dangKy('bgn-than', than, { ten: 'Thân bình giãn nở', cha: 'bgn', chucNang: 'Vỏ thép chịu áp; van nạp khí trên đỉnh dùng để nạp áp khí ban đầu bằng áp tĩnh của hệ.' });

  // Chân đỡ
  const chan = nhom('Chân đỡ');
  const de = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
    const tren = V(Math.cos(a) * (B.R - 0.01), B.y0 + 0.05, Math.sin(a) * (B.R - 0.01));
    const duoi = V(Math.cos(a) * (B.R + 0.06), 0.012, Math.sin(a) * (B.R + 0.06));
    chan.add(truGiua(tren, duoi, 0.022, VL.khung, { seg: 8 }));
    de.push(duoi);
  }
  chan.add(banSao(dungChung('deChanBGN', () => new THREE.BoxGeometry(0.12, 0.012, 0.12)), VL.khung, de.map((p) => maTran(V(p.x, 0.006, p.z)))));
  chan.add(buLongTaiDiem(de.map((p) => V(p.x + 0.035, 0.012, p.z)), 'y', { co: 0.009, dai: 0.03, vl: VL.thep, mu: true }));
  goc.add(chan);

  // Đầu nối đáy
  goc.add(truGiua(V(0, B.y0 - 0.12, 0), V(0, B.yNoi + 0.02, 0), 0.02, VL.thep, { seg: 12 }));
  goc.add(mesh(geoMatBich(0.0167, 0.05, 0.012), VL.thep, { vt: V(0, B.yNoi, 0) }));
  goc.children.at(-1).rotation.x = Math.PI;

  // Bên trong: màng cao su, khoang nước và khoang khí
  const mang = mesh(dungChung('mangBGN', () => new THREE.SphereGeometry(B.R - 0.01, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2.6)), c(VL.caoSu), { bong: false });
  mang.scale.y = 0.5;
  mang.position.y = 0.72;
  const nuoc = mesh(dungChung('nuocBGN', () => new THREE.CylinderGeometry(B.R - 0.012, B.R - 0.012, 1, 32)), c(new THREE.MeshStandardMaterial({ color: '#79b8f2', transparent: true, opacity: 0.45, depthWrite: false })), { bong: false });
  goc.add(mang, nuoc);
  return {
    goc,
    hoatAnh: { mang, nuoc, yDay: B.y0 - 0.08 },
    diemNoi: { noi: { p: V(VI_TRI.binhGianNo.x, B.yNoi, VI_TRI.binhGianNo.z), huong: V(0, -1, 0) } },
    vatCan: [{ ten: 'Bình giãn nở', hop: new THREE.Box3(V(VI_TRI.binhGianNo.x - B.R, B.y0 - 0.12, VI_TRI.binhGianNo.z - B.R), V(VI_TRI.binhGianNo.x + B.R, B.y1 + 0.12, VI_TRI.binhGianNo.z + B.R)) }],
  };
}
