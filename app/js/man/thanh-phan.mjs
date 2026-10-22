// Thành phần dùng chung của các màn: bước thiết lập, nút lùi, ô lựa chọn.
import { bieuTuong, h } from '../giao-dien.mjs';

// Tiến độ ba bước thiết lập (màn 02, 03, 04).
export function buocThietLap(so) {
  return h(
    'div',
    { class: 'buoc' },
    h('ol', { 'aria-hidden': 'true' }, [1, 2, 3].map((i) => h('li', { class: i <= so ? 'qua' : '' }))),
    h('span', { class: 'phu nho' }, `Bước ${so}/3`),
  );
}

export const nutLui = (nhan, onclick) => h('button', { type: 'button', class: 'lui', onclick }, bieuTuong('lui'), nhan);

// Một ô chọn (radio). gt: giá trị; ten: tên nhóm; chu: dòng chính; moTa: dòng phụ.
export function oChon({ ten, gt, chu, moTa, chon, khoa, onchange }) {
  return h(
    'label',
    { class: 'o-chon' },
    h('input', { type: 'radio', name: ten, value: gt, checked: chon, disabled: khoa, onchange }),
    h('span', { class: 'ten' }, chu),
    moTa ? h('span', { class: 'mo-ta' }, moTa) : null,
    h('span', { class: 'dau' }, bieuTuong('chon')),
  );
}
