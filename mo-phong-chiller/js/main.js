// Điểm vào: dựng cảnh, thiết bị, đường ống; nối trạng thái vận hành, hoạt ảnh và giao diện; chạy vòng lặp.

import * as THREE from 'three';
import { taoCanh } from './canh.js';
import { taoVatLieu } from './vat-lieu.js';
import { dungChiller } from './thiet-bi/chiller.js';
import { dungBom } from './thiet-bi/bom.js';
import { dungThap } from './thiet-bi/thap-giai-nhiet.js';
import { dungAHU } from './thiet-bi/ahu.js';
import { dungBinhGianNo } from './thiet-bi/binh-gian-no.js';
import { dungDuongOng } from './duong-ong.js';
import { VanHanh } from './van-hanh.js';
import { taoHoatAnh } from './hoat-anh.js';
import { taoGiaoDien } from './giao-dien.js';
import { kiemTraDuongOng } from './kiem-tra.js';
import { VI_TRI, ONG, PHIEN_BAN_THREE } from './cau-hinh.js';
import { dangCat } from './vat-lieu.js';
import { gopTinh } from './hinh-hoc.js';

function khoiDong() {
  const khung = document.getElementById('khung-3d');
  const canh = taoCanh(khung);
  taoVatLieu();

  // Thiết bị
  const tb = {
    chiller: dungChiller(),
    bomNL: dungBom({
      ma: 'bom-nl', ten: 'Bơm nước lạnh', the: 'CHWP-01', viTri: VI_TRI.bomNuocLanh, rOng: ONG.nuocLanh.r,
      chucNang: 'Tuần hoàn nước lạnh qua bình bay hơi và AHU (151 m³/h ở 100 % tốc độ). Đặt trên đường hồi, đẩy nước vào bình bay hơi; bình giãn nở nối ở cửa hút.',
    }),
    bomGN: dungBom({
      ma: 'bom-gn', ten: 'Bơm nước giải nhiệt', the: 'CWP-01', viTri: VI_TRI.bomGiaiNhiet, rOng: ONG.giaiNhiet.r,
      chucNang: 'Hút nước nguội từ bể tháp, đẩy qua bình ngưng rồi lên vòi phun trên đỉnh tháp (190 m³/h ở 100 % tốc độ).',
    }),
    thap: dungThap(),
    ahu: dungAHU(),
    bgn: dungBinhGianNo(),
  };
  for (const k of Object.keys(tb)) canh.scene.add(tb[k].goc);
  const ong = dungDuongOng(tb, canh.scene);

  // Hạt và hiệu ứng không chọn được bằng chuột
  const boQua = [ong.hat, tb.thap.hoatAnh.giot.mesh, tb.thap.hoatAnh.khi.mesh, tb.thap.hoatAnh.nonPhun, tb.ahu.hoatAnh.khi.mesh, tb.ahu.hoatAnh.giotNgung.mesh, tb.chiller.hoatAnh.botSoi.mesh, tb.chiller.hoatAnh.giotNgung.mesh];
  for (const o of boQua) o.userData.boQuaChon = true;

  // Giữ riêng các vật thể chuyển động, đổi vật liệu hoặc ẩn hiện độc lập; phần còn lại gộp theo vật liệu
  const ha0 = tb.chiller.hoatAnh;
  const giu = [
    ...tb.chiller.voChiller, ...tb.chiller.noiThat.map((x) => x.obj), ha0.rotorDuc, ha0.rotorCai, ha0.trucCai, ha0.vanTruot.mesh, ha0.vanTruot.can,
    ...tb.thap.voThap, tb.thap.hoatAnh.matNuoc, ...tb.ahu.voAHU, tb.bgn.hoatAnh.mang, tb.bgn.hoatAnh.nuoc,
    ...ong.dsTuyen.flatMap((t) => [t.ong, t.baoOn, ...(t.muiTen || [])]), ...ong.dongHo.map((d) => d.kim),
  ];
  for (const o of giu) if (o) o.userData.giuRieng = true;
  for (const k of Object.keys(tb)) gopTinh(tb[k].goc);
  gopTinh(ong.goc);
  // Chi tiết nhỏ không đổ bóng (giảm số lần vẽ ở lượt bóng)
  canh.scene.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || !o.castShadow || !o.geometry) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    if (o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z) < 0.07) o.castShadow = false;
  });

  const vh = new VanHanh();
  const ha = taoHoatAnh(tb, ong);
  const ui = taoGiaoDien({ canh, tb, ong, vh, ha });

  const dongHo = new THREE.Timer();
  dongHo.connect(document);
  let soKhung = 0, tgDo = 0, fps = 0, tongKhung = 0;
  function vong(thoiDiem) {
    requestAnimationFrame(vong);
    dongHo.update(thoiDiem);
    const dt = Math.min(0.1, dongHo.getDelta());
    const x = ui.xem;
    if (!x.tamDung) vh.capNhat(dt * x.tocDo);
    ha.capNhat(x.tamDung ? 0 : dt, vh.so, {
      tocDo: 1,
      hienBinh: { binhBayHoi: dangCat('binhBayHoi') || x.voChiller, binhNgung: dangCat('binhNgung') || x.voChiller },
    });
    canh.capNhatBay(dt);
    canh.controls.update(dt);
    ui.capNhat(dt);
    canh.renderer.render(canh.scene, canh.camera);
    canh.lopNhan.render(canh.scene, canh.camera);
    soKhung++; tongKhung++; tgDo += dt;
    if (tgDo > 1) { fps = soKhung / tgDo; soKhung = 0; tgDo = 0; }
  }
  requestAnimationFrame(vong);

  // Cho kiểm thử tự động và console
  window.__moPhong = {
    canh, tb, ong, vh, ui, ha, THREE, phienBan: PHIEN_BAN_THREE,
    kiemTra: () => kiemTraDuongOng(tb, ong),
    fps: () => fps,
    soKhungDaVe: () => tongKhung,
    thongKe: () => canh.renderer.info.render,
  };
  document.body.dataset.sanSang = '1';
}

try {
  khoiDong();
} catch (e) {
  console.error(e);
  const p = document.createElement('p');
  p.className = 'loi-khoi-dong';
  p.textContent = `Không dựng được mô hình: ${e.message}. Trình duyệt cần hỗ trợ WebGL 2 và ES modules.`;
  document.body.append(p);
  throw e;
}
