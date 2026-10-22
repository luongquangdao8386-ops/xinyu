// Khởi tạo cảnh: renderer, camera, OrbitControls, ánh sáng, môi trường phản chiếu, nền phòng máy có lưới toạ độ,
// lớp nhãn CSS2D, đổi kích thước theo khung và hiệu ứng bay camera.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CAMERA } from './cau-hinh.js';

export const NEN = { x0: -13, x1: 7, z0: -10.5, z1: 8.5 }; // phạm vi sàn phòng máy (m)

export function taoCanh(khung) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.localClippingEnabled = true;
  khung.appendChild(renderer.domElement);

  const lopNhan = new CSS2DRenderer();
  lopNhan.domElement.className = 'lop-nhan';
  khung.appendChild(lopNhan.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e7ebee');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  // Ánh sáng mềm: bầu trời + mặt trời đổ bóng + đèn phụ phía đối diện
  scene.add(new THREE.HemisphereLight('#ffffff', '#b9c0c5', 1.25));
  const mat = new THREE.DirectionalLight('#fff4e6', 2.1);
  mat.position.set(6, 19, 12);
  mat.target.position.set(-3, 0, -1);
  mat.castShadow = true;
  const cam = mat.shadow.camera;
  cam.left = -15; cam.right = 15; cam.top = 15; cam.bottom = -15; cam.near = 2; cam.far = 50;
  mat.shadow.mapSize.set(2048, 2048);
  mat.shadow.bias = -0.0004;
  mat.shadow.normalBias = 0.025;
  mat.shadow.radius = 3;
  scene.add(mat, mat.target);
  const phu = new THREE.DirectionalLight('#dfe8f2', 0.55);
  phu.position.set(-12, 8, -6);
  scene.add(phu);

  scene.add(dungNen(renderer));

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 220);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.minDistance = 0.5;
  controls.maxDistance = 70;
  controls.zoomToCursor = true;

  // Đổi kích thước theo khung
  const doiCo = () => {
    const w = Math.max(1, khung.clientWidth), h = Math.max(1, khung.clientHeight);
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    lopNhan.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(doiCo).observe(khung);
  doiCo();

  // Bay camera tới vị trí mới (nội suy mượt)
  let bayHienTai = null;
  function bay(viTri, dich, thoiGian = 1.0) {
    if (thoiGian <= 0) { camera.position.copy(viTri); controls.target.copy(dich); bayHienTai = null; controls.update(); return; }
    bayHienTai = { tu: camera.position.clone(), tuDich: controls.target.clone(), den: viTri.clone(), denDich: dich.clone(), t: 0, T: thoiGian };
  }
  function capNhatBay(dt) {
    if (!bayHienTai) return;
    const b = bayHienTai;
    b.t = Math.min(b.T, b.t + dt);
    const u = b.t / b.T, k = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    camera.position.lerpVectors(b.tu, b.den, k);
    controls.target.lerpVectors(b.tuDich, b.denDich, k);
    if (b.t >= b.T) bayHienTai = null;
  }
  // Ngắt hiệu ứng bay khi người dùng tự xoay camera
  controls.addEventListener('start', () => { bayHienTai = null; });

  // Góc nhìn theo góc cao và góc phương vị, khoảng cách đủ để thấy bán kính R
  function gocNhin(tam, gocCao, gocPhuong, R) {
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const d = R / Math.sin(Math.min(vfov, hfov) / 2);
    const c = THREE.MathUtils.degToRad(gocCao), p = THREE.MathUtils.degToRad(gocPhuong);
    return tam.clone().add(new THREE.Vector3(Math.cos(c) * Math.sin(p), Math.sin(c), Math.cos(c) * Math.cos(p)).multiplyScalar(d));
  }
  const tamMacDinh = new THREE.Vector3(...CAMERA.tamNhin);
  camera.position.copy(gocNhin(tamMacDinh, CAMERA.gocCao, CAMERA.gocPhuong, 8.4));
  controls.target.copy(tamMacDinh);
  controls.update();

  return { renderer, scene, camera, controls, lopNhan, matTroi: mat, bay, capNhatBay, gocNhin, tamMacDinh };
}

// Sàn phòng máy: kết cấu canvas gồm bê tông, lưới 1 m, lưới chính 5 m, toạ độ và vùng bảo trì kẻ vạch.
function dungNen(renderer) {
  const { x0, x1, z0, z1 } = NEN;
  const tl = 100; // px/m
  const W = Math.round((x1 - x0) * tl), H = Math.round((z1 - z0) * tl);
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.fillStyle = '#d9dcda'; g.fillRect(0, 0, W, H);
  // Hạt bê tông
  for (let i = 0; i < 26000; i++) {
    const v = 190 + Math.random() * 50;
    g.fillStyle = `rgba(${v},${v},${v - 4},0.35)`;
    g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  const px = (x) => (x - x0) * tl, pz = (z) => (z - z0) * tl;
  for (let x = Math.ceil(x0); x <= x1; x++) {
    const chinh = x % 5 === 0;
    g.strokeStyle = chinh ? 'rgba(96,110,122,0.55)' : 'rgba(120,132,142,0.28)'; g.lineWidth = chinh ? 3 : 1.5;
    g.beginPath(); g.moveTo(px(x), 0); g.lineTo(px(x), H); g.stroke();
  }
  for (let z = Math.ceil(z0); z <= z1; z++) {
    const chinh = z % 5 === 0;
    g.strokeStyle = chinh ? 'rgba(96,110,122,0.55)' : 'rgba(120,132,142,0.28)'; g.lineWidth = chinh ? 3 : 1.5;
    g.beginPath(); g.moveTo(0, pz(z)); g.lineTo(W, pz(z)); g.stroke();
  }
  // Nhãn toạ độ dọc mép trước (x) và mép trái (z)
  g.fillStyle = 'rgba(70,82,92,0.85)'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let x = Math.ceil(x0) + 1; x < x1; x += 2) g.fillText(`${x} m`.replace('-', '−'), px(x), H - 30);
  g.textAlign = 'left';
  for (let z = Math.ceil(z0) + 1; z < z1; z += 2) g.fillText(`${z} m`.replace('-', '−'), 14, pz(z));
  // Vùng bảo trì: kẻ sọc vàng, viền nét đứt
  const vung = (xa, za, xb, zb, chu) => {
    g.save();
    g.beginPath(); g.rect(px(xa), pz(za), px(xb) - px(xa), pz(zb) - pz(za)); g.clip();
    g.strokeStyle = 'rgba(226,173,18,0.35)'; g.lineWidth = 10;
    for (let k = -H; k < W + H; k += 46) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + H, H); g.stroke(); }
    g.restore();
    g.setLineDash([26, 16]); g.strokeStyle = '#c99a0c'; g.lineWidth = 6;
    g.strokeRect(px(xa), pz(za), px(xb) - px(xa), pz(zb) - pz(za));
    g.setLineDash([]);
    g.fillStyle = '#7a5d05'; g.font = 'bold 34px sans-serif'; g.textAlign = 'center';
    chu.split('\n').forEach((d, i, a) => g.fillText(d, (px(xa) + px(xb)) / 2, (pz(za) + pz(zb)) / 2 + (i - (a.length - 1) / 2) * 40));
  };
  vung(2.7, -0.85, 6.0, 0.85, 'KHOẢNG RÚT ỐNG\nBẢO TRÌ BÌNH');
  vung(-3.05, -1.25, -2.15, 1.25, 'THÁO\nNẮP');
  vung(-0.95, 1.05, 2.6, 1.9, 'LỐI ĐI BẢO TRÌ');
  const kt = new THREE.CanvasTexture(cv);
  kt.colorSpace = THREE.SRGBColorSpace;
  kt.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
  geo.rotateX(-Math.PI / 2);
  const san = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: kt, roughness: 0.92, metalness: 0 }));
  san.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2);
  san.receiveShadow = true;
  san.name = 'Sàn phòng máy';
  san.userData.boQuaChon = true;
  return san;
}
