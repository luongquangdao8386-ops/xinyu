// Màn 28 — Hồ sơ và mục tiêu (bản B1.1): xem và sửa mục tiêu, điểm bắt đầu, kế hoạch; trạng thái lưu trữ;
// thiết lập lại từ đầu. Cài đặt học tập (29) và sao lưu (46) làm ở B1.7.
import { h, vietNgay } from '../giao-dien.mjs';
import { daLuuLau, xinLuuLau } from '../kho.mjs';
import { goiYCaiDat } from './chao-mung.mjs';
import { MUC_TIEU, tenCap } from './muc-tieu.mjs';

export default {
  tieuDe: 'Tôi',
  async ve({ hoSo, di, datLai }) {
    const luuLau = await daLuuLau().catch(() => null);
    const trangThai = h('p', { class: 'nho' });
    const veLuu = (v) => {
      trangThai.replaceChildren(
        v ? '✓ Trình duyệt giữ dữ liệu lâu dài.' : v === false ? 'Trình duyệt chưa hứa giữ dữ liệu lâu dài; hãy cài app ra Màn hình chính và nhớ sao lưu.' : 'Trình duyệt này không cho biết có giữ dữ liệu lâu dài hay không.',
      );
    };
    veLuu(luuLau);

    const xacNhan = h(
      'div',
      { class: 'khoi khoi-canh-bao', hidden: true },
      h('p', {}, 'Xóa hồ sơ học và làm lại phần thiết lập? Các lựa chọn mục tiêu, điểm bắt đầu và kế hoạch sẽ mất.'),
      h(
        'div',
        { class: 'hang-nut' },
        h('button', { type: 'button', class: 'nut nut-chinh', onclick: datLai }, 'Xóa và làm lại'),
        h('button', { type: 'button', class: 'nut', onclick: () => { xacNhan.hidden = true; } }, 'Giữ nguyên'),
      ),
    );
    return [
      h('h1', {}, 'Tôi'),
      h(
        'dl',
        { class: 'thong-tin' },
        h('dt', {}, 'Mục tiêu'), h('dd', {}, MUC_TIEU[hoSo.mucTieu]?.[0] ?? '—'),
        h('dt', {}, 'Cấp mục tiêu'), h('dd', {}, tenCap(hoSo.capMucTieu ?? 1)),
        h('dt', {}, 'Bắt đầu từ'), h('dd', {}, hoSo.diemBatDau ?? '—'),
        h('dt', {}, 'Mỗi ngày'), h('dd', {}, `${hoSo.phutMoiNgay} phút`),
        h('dt', {}, 'Ngày thi'), h('dd', {}, hoSo.ngayThi ? vietNgay(hoSo.ngayThi) : 'Chưa đặt'),
      ),
      h(
        'div',
        { class: 'hang-nut' },
        h('button', { type: 'button', class: 'nut', onclick: () => di('ke-hoach/sua') }, 'Sửa kế hoạch'),
        h('button', { type: 'button', class: 'nut', onclick: () => di('muc-tieu/sua') }, 'Đổi mục tiêu'),
        h('button', { type: 'button', class: 'nut', onclick: () => di('diem-bat-dau/sua') }, 'Đổi điểm bắt đầu'),
      ),
      h(
        'section',
        { class: 'dau-man' },
        h('h2', {}, 'Lưu trữ'),
        trangThai,
        luuLau === false ? h('button', { type: 'button', class: 'nut', onclick: async () => veLuu(await xinLuuLau()) }, 'Xin giữ dữ liệu lâu dài') : null,
        goiYCaiDat(),
        h('p', { class: 'phu nho' }, 'Sao lưu bằng tệp và cài đặt học tập có ở việc B1.7.'),
      ),
      h('section', { class: 'dau-man' }, h('h2', {}, 'Làm lại'), h('button', { type: 'button', class: 'nut', onclick: () => { xacNhan.hidden = false; } }, 'Thiết lập lại từ đầu'), xacNhan),
    ];
  },
};
