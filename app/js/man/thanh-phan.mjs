// Thành phần dùng chung của các màn theo bảng ảnh: đầu màn, tranh góc, nút, hàng danh sách, ô lựa chọn.
import { bieuTuong, h } from '../giao-dien.mjs';

// Đầu màn có tab: dấu son chữ 新 và tên app (trên máy tính tên app nằm ở thanh bên).
export const dauApp = () => h('header', { class: 'dau-app' }, h('span', { class: 'dau-son', lang: 'zh-CN', 'aria-hidden': 'true' }, '新'), h('span', { class: 'ten-app' }, 'Xinyu'));

// Tranh mực góc trên bên phải (bảng ảnh), chỉ để trang trí.
export const tranhGoc = () => h('div', { class: 'tranh-goc', 'aria-hidden': 'true' });

// Đầu màn thiết lập: nút lùi, "Bước n / 3" và thanh tiến độ; so = 0 khi mở lại để sửa (không hiện bước).
export function dauBuoc(so, lui, nhanLui) {
  return h(
    'header',
    { class: 'dau-buoc' },
    h('button', { type: 'button', class: 'lui', onclick: lui, 'aria-label': `Quay lại: ${nhanLui}` }, bieuTuong('lui')),
    so ? h('div', { class: 'giua' }, h('span', {}, `Bước ${so} / 3`), h('div', { class: 'thanh', 'aria-hidden': 'true' }, h('span', { style: `width:${(so / 3) * 100}%` }))) : h('span'),
  );
}

// Nút; chinh: nút đỏ son; mui: thêm mũi tên.
export const nut = (nhan, { chinh = false, mui = false, rong = true, ...thuocTinh } = {}) =>
  h('button', { type: 'button', class: `nut${chinh ? ' nut-chinh' : ''}${rong ? ' nut-rong' : ''}`, ...thuocTinh }, h('span', {}, nhan), mui ? bieuTuong('tiep') : null);

// Một hàng danh sách có biểu tượng tròn: tên, giá trị, mũi tên mở (khi có onclick).
export function hang({ bieuTuong: bt, ten, giaTri, son = false, onclick, them = null }) {
  return h(
    'li',
    {},
    h(
      onclick ? 'button' : 'div',
      { class: `hang${onclick ? '' : ' tinh'}`, type: onclick ? 'button' : null, onclick },
      h('span', { class: 'tron' }, bieuTuong(bt)),
      h('span', { class: 'chu' }, h('span', { class: 'ten' }, ten), giaTri ? h('span', { class: `gia-tri${son ? ' son' : ''}` }, giaTri) : null),
      onclick ? h('span', { class: 'mo' }, bieuTuong('mo')) : h('span'),
      them,
    ),
  );
}

// Một ô chọn (radio). gt: giá trị; ten: tên nhóm; chu: dòng chính; moTa: dòng phụ.
export function oChon({ ten, gt, chu, moTa, chon, khoa, onchange }) {
  return h(
    'label',
    { class: 'o-chon' },
    h('input', { type: 'radio', name: ten, value: gt, checked: chon, disabled: khoa, onchange }),
    h('span', { class: 'dau' }),
    h('span', { class: 'ten' }, chu),
    moTa ? h('span', { class: 'mo-ta' }, moTa) : null,
  );
}
