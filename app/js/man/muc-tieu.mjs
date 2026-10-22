// Màn 02 — Mục tiêu học: học từ đầu, luyện thi hoặc kết hợp; chọn cấp mục tiêu (chỉ cấp đã có nội dung).
import { h } from '../giao-dien.mjs';
import { capCoNoiDung } from '../ke-hoach.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { buocThietLap, nutLui, oChon } from './thanh-phan.mjs';

export const MUC_TIEU = {
  hoc: ['Học từ đầu', 'Học theo lộ trình từng bài, ôn tập và kiểm tra cuối bài.'],
  thi: ['Luyện thi HSK', 'Ưu tiên luyện dạng bài, thi thử và sửa lỗi; vẫn học những bài còn thiếu.'],
  'ca-hai': ['Học và luyện thi', 'Học theo lộ trình, xen luyện dạng bài của cấp đang học.'],
};
const CAP = [1, 2, 3, 4, 5, 6, 7];
export const tenCap = (c) => (c === 7 ? 'HSK 7–9' : `HSK ${c}`);

export default {
  tieuDe: 'Mục tiêu học',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const coNoiDung = capCoNoiDung(await napNoiDung('lo-trinh'));
    const chon = { mucTieu: hoSo.mucTieu, capMucTieu: hoSo.capMucTieu ?? coNoiDung[0] };
    const nutTiep = h('button', { type: 'submit', class: 'nut nut-chinh nut-rong', disabled: !chon.mucTieu }, sua ? 'Lưu' : 'Tiếp tục');
    const form = h(
      'form',
      {
        class: 'dau-man',
        onsubmit: async (e) => {
          e.preventDefault();
          await luuHoSo(chon);
          di(sua ? 'toi' : 'diem-bat-dau');
        },
      },
      h(
        'fieldset',
        { class: 'lua-chon' },
        h('legend', {}, 'Bạn học để làm gì?'),
        Object.entries(MUC_TIEU).map(([gt, [chu, moTa]]) =>
          oChon({ ten: 'muc-tieu', gt, chu, moTa, chon: chon.mucTieu === gt, onchange: () => { chon.mucTieu = gt; nutTiep.disabled = false; } }),
        ),
      ),
      h(
        'fieldset',
        { class: 'lua-chon' },
        h('legend', {}, 'Cấp mục tiêu'),
        h(
          'div',
          { class: 'hang-chon' },
          CAP.map((c) =>
            oChon({
              ten: 'cap',
              gt: c,
              chu: tenCap(c),
              moTa: coNoiDung.includes(c) ? null : 'Chưa có nội dung',
              chon: chon.capMucTieu === c,
              khoa: !coNoiDung.includes(c),
              onchange: () => { chon.capMucTieu = c; },
            }),
          ),
        ),
        h('p', { class: 'phu nho' }, 'Bản đầu có Nền phát âm và HSK 1; cấp sau mở khi soạn xong nội dung.'),
      ),
      nutTiep,
    );
    return [sua ? nutLui('Tôi', () => di('toi')) : nutLui('Chào mừng', () => di('chao-mung')), sua ? null : buocThietLap(1), h('h1', {}, 'Mục tiêu học'), form];
  },
};
