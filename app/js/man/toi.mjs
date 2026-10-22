// Màn 28 — Hồ sơ và mục tiêu (bảng 10), bản B1.1: xem và sửa mục tiêu, điểm bắt đầu, kế hoạch; trạng thái lưu trữ;
// thiết lập lại từ đầu. Tiến bộ (27), cài đặt (29), trợ giúp (30) và đồng bộ (46) thêm ở các việc sau.
import { h, vietNgay } from '../giao-dien.mjs';
import { daLuuLau, xinLuuLau } from '../kho.mjs';
import { goiYCaiDat } from './chao-mung.mjs';
import { MUC_TIEU, tenCap } from './muc-tieu.mjs';
import { dauApp, hang, nut, tranhGoc } from './thanh-phan.mjs';

const MO_TA_LUU = {
  true: 'Trình duyệt giữ dữ liệu lâu dài',
  false: 'Chưa được giữ lâu dài; bấm để xin',
  null: 'Trình duyệt không cho biết',
};

export default {
  tieuDe: 'Tôi',
  async ve({ hoSo, di, datLai }) {
    const luuLau = await daLuuLau().catch(() => null);
    const xacNhan = h(
      'section',
      { class: 'the the-canh-bao', hidden: true },
      h('p', {}, 'Xóa hồ sơ học và làm lại phần thiết lập? Mục tiêu, điểm bắt đầu và kế hoạch sẽ mất.'),
      h('div', { class: 'nhom-nut' }, nut('Xóa và làm lại', { chinh: true, onclick: datLai }), nut('Giữ nguyên', { onclick: () => { xacNhan.hidden = true; } })),
    );
    const hangLuu = hang({
      bieuTuong: 'luu-tru',
      ten: 'Lưu trữ trên máy',
      giaTri: MO_TA_LUU[luuLau],
      son: luuLau === false,
      onclick: luuLau === false ? async () => { hangLuu.querySelector('.gia-tri').textContent = MO_TA_LUU[await xinLuuLau()]; } : null,
    });
    return [
      tranhGoc(),
      dauApp(),
      h('div', { class: 'mo-dau' }, h('h1', {}, 'Tôi'), h('p', {}, MUC_TIEU[hoSo.mucTieu]?.[0] ?? '')),
      h(
        'ul',
        { class: 'ds-hang' },
        hang({ bieuTuong: 'muc-tieu', ten: 'Mục tiêu', giaTri: tenCap(hoSo.capMucTieu ?? 1), onclick: () => di('muc-tieu/sua') }),
        hang({ bieuTuong: 'sach', ten: 'Bắt đầu từ', giaTri: hoSo.diemBatDau ?? '—', onclick: () => di('diem-bat-dau/sua') }),
        hang({ bieuTuong: 'dong-ho', ten: 'Thời gian học', giaTri: `${hoSo.phutMoiNgay} phút / ngày`, onclick: () => di('ke-hoach/sua') }),
        hang({ bieuTuong: 'lich', ten: 'Ngày thi', giaTri: hoSo.ngayThi ? vietNgay(hoSo.ngayThi) : 'Chưa chọn', son: !hoSo.ngayThi, onclick: () => di('ke-hoach/sua') }),
      ),
      h('ul', { class: 'ds-hang' }, hangLuu, hang({ bieuTuong: 'lam-lai', ten: 'Thiết lập lại từ đầu', giaTri: 'Làm lại mục tiêu và kế hoạch', onclick: () => { xacNhan.hidden = false; } })),
      xacNhan,
      goiYCaiDat('phu nho'),
      h('p', { class: 'phu nho' }, 'Tiến bộ học tập, cài đặt và sao lưu thêm ở các việc sau (B1.7, B2).'),
    ];
  },
};
