// Màn 02 — Mục tiêu học (bảng 01): học từ đầu, luyện thi hoặc kết hợp; chọn cấp mục tiêu (chỉ cấp đã có nội dung).
import { h } from '../giao-dien.mjs';
import { capCoNoiDung } from '../ke-hoach.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { dauBuoc, nut, oChon, tranhGoc } from './thanh-phan.mjs';

export const MUC_TIEU = {
  hoc: ['Học từ đầu', 'Xây nền tảng vững chắc từ cơ bản.'],
  thi: ['Luyện thi HSK', 'Ôn tập theo cấu trúc HSK 3.0.'],
  'ca-hai': ['Học và luyện thi', 'Vừa học từ đầu, vừa luyện thi HSK.'],
};
const CAP = [1, 2, 3, 4, 5, 6, 7];
export const tenCap = (c) => (c === 7 ? 'HSK 7–9' : `HSK ${c}`);

export default {
  tieuDe: 'Mục tiêu học',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const coNoiDung = capCoNoiDung(await napNoiDung('lo-trinh'));
    const chon = { mucTieu: hoSo.mucTieu, capMucTieu: hoSo.capMucTieu ?? coNoiDung[0] };
    const nutTiep = nut(sua ? 'Lưu' : 'Tiếp tục', { chinh: true, mui: !sua, type: 'submit', disabled: !chon.mucTieu });
    return [
      tranhGoc(),
      dauBuoc(sua ? 0 : 1, () => di(sua ? 'toi' : 'chao-mung'), sua ? 'Tôi' : 'Chào mừng'),
      h('div', { class: 'mo-dau' }, h('h1', {}, 'Bạn muốn', h('br'), 'đạt điều gì?')),
      h(
        'form',
        {
          class: 'nhom-nut',
          onsubmit: async (e) => {
            e.preventDefault();
            await luuHoSo(chon);
            di(sua ? 'toi' : 'diem-bat-dau');
          },
        },
        h(
          'fieldset',
          { class: 'lua-chon', 'aria-label': 'Mục tiêu học' },
          Object.entries(MUC_TIEU).map(([gt, [chu, moTa]]) =>
            oChon({ ten: 'muc-tieu', gt, chu, moTa, chon: chon.mucTieu === gt, onchange: () => { chon.mucTieu = gt; nutTiep.disabled = false; } }),
          ),
        ),
        h(
          'div',
          { class: 'o-chon-cap' },
          h('label', { for: 'cap-muc-tieu' }, 'Cấp HSK mục tiêu'),
          h(
            'select',
            { id: 'cap-muc-tieu', onchange: (e) => { chon.capMucTieu = Number(e.target.value); } },
            CAP.map((c) => h('option', { value: c, selected: chon.capMucTieu === c, disabled: !coNoiDung.includes(c) }, coNoiDung.includes(c) ? tenCap(c) : `${tenCap(c)} · chưa có nội dung`)),
          ),
          h('p', { class: 'phu nho' }, 'Có thể thay đổi sau. Bản đầu có Nền phát âm và HSK 1.'),
        ),
        nutTiep,
      ),
    ];
  },
};
