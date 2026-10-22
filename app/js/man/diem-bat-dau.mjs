// Màn 03 — Chọn điểm bắt đầu: từ Nền phát âm hoặc một bài bất kỳ đã có nội dung; không có kiểm tra đầu vào (mục 4.2).
import { h } from '../giao-dien.mjs';
import { baiDenCap } from '../ke-hoach.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { buocThietLap, nutLui, oChon } from './thanh-phan.mjs';

export default {
  tieuDe: 'Chọn điểm bắt đầu',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const [loTrinh, baiDaSoan] = await Promise.all([napNoiDung('lo-trinh'), napNoiDung('bai')]);
    const daSoan = new Set(baiDaSoan.map((b) => b.ma));
    const tatCa = baiDenCap(loTrinh, hoSo.capMucTieu ?? 1);
    const dau = tatCa[0];
    let diem = hoSo.diemBatDau ?? dau.ma;
    const nutTiep = h('button', { type: 'submit', class: 'nut nut-chinh nut-rong' }, sua ? 'Lưu' : 'Tiếp tục');

    const danhSach = h(
      'div',
      { class: 'nhom-bai', hidden: diem === dau.ma },
      loTrinh
        .filter((c) => tatCa.some((b) => b.cum === c.cum))
        .map((c) =>
          h(
            'details',
            { open: c.bai.some((b) => b.ma === diem) },
            h('summary', {}, `${c.cum} · ${c.bai.filter((b) => daSoan.has(b.ma)).length}/${c.bai.length} bài đã có`),
            h(
              'div',
              { class: 'lua-chon' },
              c.bai.map((b) =>
                oChon({
                  ten: 'bai',
                  gt: b.ma,
                  chu: `${b.ma} · ${b.chuDe}`,
                  moTa: daSoan.has(b.ma) ? b.mucTieu : 'Đang soạn',
                  chon: diem === b.ma,
                  khoa: !daSoan.has(b.ma),
                  onchange: () => { diem = b.ma; },
                }),
              ),
            ),
          ),
        ),
    );

    const form = h(
      'form',
      {
        class: 'dau-man',
        onsubmit: async (e) => {
          e.preventDefault();
          await luuHoSo({ diemBatDau: diem });
          di(sua ? 'toi' : 'ke-hoach');
        },
      },
      h(
        'fieldset',
        { class: 'lua-chon' },
        h('legend', {}, 'Bắt đầu từ đâu?'),
        oChon({
          ten: 'cach',
          gt: 'dau',
          chu: 'Từ Nền phát âm',
          moTa: 'Pinyin, thanh điệu, cặp thanh và lời chào: 8 bài, khoảng 2 tuần. Nên chọn nếu mới bắt đầu.',
          chon: diem === dau.ma,
          onchange: () => { diem = dau.ma; danhSach.hidden = true; },
        }),
        oChon({ ten: 'cach', gt: 'chon', chu: 'Chọn một bài', moTa: 'Đã học một phần thì chọn bài muốn học tiếp.', chon: diem !== dau.ma, onchange: () => { danhSach.hidden = false; } }),
      ),
      danhSach,
      h('p', { class: 'phu nho' }, 'Bản đầu không có bài kiểm tra đầu vào: bạn tự chọn theo trình độ của mình.'),
      nutTiep,
    );
    return [sua ? nutLui('Tôi', () => di('toi')) : nutLui('Mục tiêu học', () => di('muc-tieu')), sua ? null : buocThietLap(2), h('h1', {}, 'Điểm bắt đầu'), form];
  },
};
