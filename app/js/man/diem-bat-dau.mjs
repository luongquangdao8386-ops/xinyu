// Màn 03 — Chọn điểm bắt đầu (bảng 01, dùng lại bố cục “Kiểm tra đầu vào” nhưng bỏ bài kiểm tra, mục 4.2): bắt đầu
// từ Nền phát âm hoặc chọn một bài đã có nội dung.
import { h } from '../giao-dien.mjs';
import { baiDenCap } from '../ke-hoach.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { dauBuoc, nut, oChon, tranhGoc } from './thanh-phan.mjs';

export default {
  tieuDe: 'Chọn điểm bắt đầu',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const [loTrinh, baiDaSoan] = await Promise.all([napNoiDung('lo-trinh'), napNoiDung('bai')]);
    const daSoan = new Set(baiDaSoan.map((b) => b.ma));
    const tatCa = baiDenCap(loTrinh, hoSo.capMucTieu ?? 1);
    const dau = tatCa[0];
    let diem = hoSo.diemBatDau && hoSo.diemBatDau !== dau.ma ? hoSo.diemBatDau : null;
    const xong = async (ma) => {
      await luuHoSo({ diemBatDau: ma });
      di(sua ? 'toi' : 'ke-hoach');
    };

    const nutChon = nut(diem ? `Bắt đầu từ ${diem}` : 'Chọn một bài ở trên', { chinh: true, mui: true, disabled: !diem, onclick: () => xong(diem) });
    const khungChon = h(
      'section',
      { class: 'the nhom-bai', hidden: !diem },
      h('h2', {}, 'Chọn bài bắt đầu'),
      h('p', { class: 'phu nho' }, 'Chỉ chọn được bài đã soạn; bài khác mở dần khi có nội dung.'),
      loTrinh
        .filter((c) => tatCa.some((b) => b.cum === c.cum))
        .map((c) =>
          h(
            'details',
            { open: c.bai.some((b) => b.ma === diem) || c === loTrinh[0] },
            h('summary', {}, `${c.cum} · ${c.bai.filter((b) => daSoan.has(b.ma)).length}/${c.bai.length} bài`),
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
                  onchange: () => {
                    diem = b.ma;
                    nutChon.disabled = false;
                    nutChon.firstChild.textContent = `Bắt đầu từ ${b.ma}`;
                  },
                }),
              ),
            ),
          ),
        ),
      nutChon,
    );
    return [
      tranhGoc(),
      dauBuoc(sua ? 0 : 2, () => di(sua ? 'toi' : 'muc-tieu'), sua ? 'Tôi' : 'Mục tiêu học'),
      h(
        'div',
        { class: 'mo-dau' },
        h('h1', {}, 'Bắt đầu đúng', h('br'), 'trình độ.'),
        h('p', {}, 'Mới học tiếng Trung? Bắt đầu từ Nền phát âm. Đã học một phần thì chọn bài muốn học tiếp.'),
      ),
      h(
        'div',
        { class: 'nhom-nut' },
        nut('Bắt đầu từ Nền phát âm', { chinh: true, mui: true, onclick: () => xong(dau.ma) }),
        nut('Chọn một bài', { onclick: () => { khungChon.hidden = false; khungChon.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }),
      ),
      khungChon,
    ];
  },
};
