// Thành phần dùng chung của các màn theo bảng ảnh: đầu màn, tranh góc, nút, hàng danh sách, ô lựa chọn, vòng số
// của lộ trình, nút nghe, công tắc.
import { chuanBi, dung, phat } from '../am-thanh.mjs';
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

// Nút; chinh: nút đỏ son; mui: thêm mũi tên; nho: nút thấp trong hàng.
export const nut = (nhan, { chinh = false, mui = false, rong = true, nho = false, ...thuocTinh } = {}) =>
  h('button', { type: 'button', class: `nut${chinh ? ' nut-chinh' : ''}${rong ? ' nut-rong' : ''}${nho ? ' nut-nho' : ''}`, ...thuocTinh }, h('span', {}, nhan), mui ? bieuTuong('tiep') : null);

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

// Đầu màn có nút lùi (màn 07, 08 và màn trong bài): tieuDe ở giữa hoặc sát nút lùi; phai: phần tử bên phải;
// tienDo: [đã làm, tổng] thì hiện thanh tiến độ và “n / tổng” như bảng 03, màn 09.
export function dauLui({ lui, nhanLui, tieuDe, phai, tienDo }) {
  return h(
    'header',
    { class: `dau-lui${tienDo ? ' co-tien-do' : ''}` },
    h('button', { type: 'button', class: 'lui', onclick: lui, 'aria-label': `Quay lại: ${nhanLui}` }, bieuTuong('lui')),
    h('span', { class: 'tieu-de' }, tieuDe || ''),
    phai || (tienDo ? h('span', { class: 'dem' }, `${tienDo[0]} / ${tienDo[1]}`) : h('span')),
    tienDo ? h('div', { class: 'thanh', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': tienDo[1], 'aria-valuenow': tienDo[0], 'aria-label': 'Tiến độ' }, h('span', { style: `width:${(tienDo[0] / tienDo[1]) * 100}%` })) : null,
  );
}

// Vòng tròn bên trái hàng lộ trình (bảng 02, 03): dấu ✓ khi xong, số khi chưa; dang: tô đỏ son.
export const vongSo = (so, trangThai) =>
  h('span', { class: `vong ${trangThai}` }, trangThai === 'xong' ? [bieuTuong('chon'), h('span', { class: 'an-chu' }, 'Đã học')] : trangThai === 'khoa' ? bieuTuong('khoa') : String(so).padStart(2, '0'));

// Nút nghe âm thanh mẫu; tải trước tệp khi dựng. layCham: hàm trả về true khi đang chọn nghe chậm.
export function nutNghe({ loai, ma, nhan = 'Nghe', lon = false, layCham = () => false }) {
  chuanBi(loai, ma).catch(() => {});
  const nut = h('button', { type: 'button', class: `nut-nghe${lon ? ' lon' : ''}`, 'aria-label': nhan, onclick: () => batTat() }, bieuTuong(lon ? 'phat' : 'loa'));
  const daoTrangThai = (dang) => {
    nut.classList.toggle('dang', dang);
    nut.replaceChildren(bieuTuong(dang ? 'tam-dung' : lon ? 'phat' : 'loa'));
    nut.setAttribute('aria-label', dang ? 'Dừng' : nhan);
  };
  async function batTat() {
    if (nut.classList.contains('dang')) return dung();
    daoTrangThai(true);
    try {
      if (!(await phat(loai, ma, { cham: layCham(), onXong: () => daoTrangThai(false) }))) {
        daoTrangThai(false);
        nut.title = 'Chưa có âm thanh cho mục này';
      }
    } catch {
      daoTrangThai(false);
    }
  }
  nut.phat = batTat;
  return nut;
}

// Công tắc dạng chip (Nghe chậm, Ẩn Pinyin…): bat là trạng thái ban đầu; doi(bat) gọi khi đổi.
export const congTac = (nhan, bat, doi) =>
  h('label', { class: 'cong-tac' }, h('input', { type: 'checkbox', checked: !!bat, onchange: (e) => doi(e.target.checked) }), h('span', {}, nhan));

// Công tắc nghe chậm (tốc độ 0,75), nhớ trong hồ sơ (hoSo.ngheCham).
export const congTacCham = (hoSo, luuHoSo) =>
  congTac('Nghe chậm', hoSo.ngheCham, (bat) => {
    hoSo.ngheCham = bat;
    luuHoSo({ ngheCham: bat });
  });
