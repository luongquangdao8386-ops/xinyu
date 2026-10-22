// Màn 04 — Kế hoạch cá nhân: thời lượng mỗi ngày và ngày thi; kế hoạch tính lại ngay khi đổi (mục 4.2).
import { h, ngayHomNay, vietNgay } from '../giao-dien.mjs';
import { BUOI_HOC, THOI_LUONG, PHUT_MOI_BAI, baiDenCap, uocTinh } from '../ke-hoach.mjs';
import { xinLuuLau } from '../kho.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { tenCap } from './muc-tieu.mjs';
import { buocThietLap, nutLui, oChon } from './thanh-phan.mjs';

const MO_TA_PHUT = { 15: 'Ngày bận', 30: 'Mặc định', 45: 'Học sâu' };
const tuan = (ngay) => (ngay < 14 ? `${ngay} ngày` : `khoảng ${Math.round(ngay / 7)} tuần`);

export default {
  tieuDe: 'Kế hoạch học',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const tatCa = baiDenCap(await napNoiDung('lo-trinh'), hoSo.capMucTieu ?? 1);
    const vt = Math.max(0, tatCa.findIndex((b) => b.ma === hoSo.diemBatDau));
    const conLai = tatCa.slice(vt);
    const chon = { phutMoiNgay: hoSo.phutMoiNgay ?? 30, ngayThi: hoSo.ngayThi ?? null };
    const homNay = ngayHomNay();

    const tomTat = h('div', { class: 'khoi', 'aria-live': 'polite' });
    const buoi = h('ol', { class: 'bang-buoi' });
    const tenBuoi = h('h3', {});
    function tinhLai() {
      const kq = uocTinh({ soBai: conLai.length, phutMoiNgay: chon.phutMoiNgay, homNay, ngayThi: chon.ngayThi });
      const dong = [
        h('p', {}, `Từ ${conLai[0].ma} đến hết ${tenCap(hoSo.capMucTieu ?? 1)}: `, h('b', { class: 'so-lieu' }, `${kq.soBai} bài`), '.'),
        h('p', {}, `Học ${chon.phutMoiNgay} phút mỗi ngày: dự kiến xong ngày `, h('b', { class: 'so-lieu' }, vietNgay(kq.ngayXong)), ` (${tuan(kq.soNgay)}).`),
      ];
      if (kq.ngayThi) {
        if (kq.conNgay < 0) dong.push(h('p', {}, 'Ngày thi đã qua; chọn lại ngày thi hoặc xóa.'));
        else if (kq.kip) dong.push(h('p', {}, `Ngày thi ${vietNgay(kq.ngayThi)}, còn ${kq.conNgay} ngày: kịp học hết bài, còn khoảng ${kq.conNgay - kq.soNgay} ngày để ôn và luyện thi.`));
        else
          dong.push(
            h(
              'p',
              {},
              `Ngày thi ${vietNgay(kq.ngayThi)}, còn ${kq.conNgay} ngày: chưa kịp học hết bài với ${chon.phutMoiNgay} phút mỗi ngày. `,
              kq.phutCan ? `Chọn ${kq.phutCan} phút mỗi ngày thì kịp.` : 'Cả 45 phút mỗi ngày cũng chưa kịp; cân nhắc dời ngày thi hoặc tập trung luyện thi.',
            ),
          );
      }
      dong.push(h('p', { class: 'phu nho' }, `Ước tính khi học đều mỗi ngày, khoảng ${PHUT_MOI_BAI} phút cho mỗi bài kể cả ôn tập. Khi đã học một thời gian, app tính lại theo tốc độ thật của bạn.`));
      tomTat.replaceChildren(...dong);
      tomTat.className = kq.ngayThi && !kq.kip ? 'khoi khoi-canh-bao' : 'khoi';
      tenBuoi.textContent = `Một buổi ${chon.phutMoiNgay} phút`;
      buoi.replaceChildren(...BUOI_HOC[chon.phutMoiNgay].map(([p, viec]) => h('li', {}, h('span', { class: 'phut' }, `${p} phút`), h('span', {}, viec))));
    }

    const oNgay = h('input', {
      type: 'date',
      id: 'ngay-thi',
      min: homNay,
      value: chon.ngayThi || '',
      oninput: () => { chon.ngayThi = oNgay.value || null; tinhLai(); },
    });
    const form = h(
      'form',
      {
        class: 'dau-man',
        onsubmit: async (e) => {
          e.preventDefault();
          await luuHoSo({ ...chon, xongThietLap: true });
          if (!sua) await xinLuuLau().catch(() => null);
          di(sua ? 'toi' : 'hom-nay');
        },
      },
      h(
        'fieldset',
        { class: 'lua-chon' },
        h('legend', {}, 'Mỗi ngày học bao lâu?'),
        h(
          'div',
          { class: 'hang-chon' },
          THOI_LUONG.map((p) => oChon({ ten: 'phut', gt: p, chu: `${p} phút`, moTa: MO_TA_PHUT[p], chon: chon.phutMoiNgay === p, onchange: () => { chon.phutMoiNgay = p; tinhLai(); } })),
        ),
        h('p', { class: 'phu nho' }, 'Ngày bận còn có chế độ “Chỉ có 5 phút” để ôn thẻ đến hạn.'),
      ),
      h(
        'div',
        { class: 'o-ngay' },
        h('label', { for: 'ngay-thi', class: 'ten' }, h('b', {}, 'Ngày thi'), h('span', { class: 'phu' }, ' (không bắt buộc)')),
        h('div', { class: 'hang' }, oNgay, h('button', { type: 'button', class: 'nut', onclick: () => { oNgay.value = ''; chon.ngayThi = null; tinhLai(); } }, 'Xóa')),
      ),
      tomTat,
      h('section', { class: 'dau-man' }, tenBuoi, buoi),
      h('button', { type: 'submit', class: 'nut nut-chinh nut-rong' }, sua ? 'Lưu kế hoạch' : 'Bắt đầu học'),
    );
    tinhLai();
    return [sua ? nutLui('Tôi', () => di('toi')) : nutLui('Điểm bắt đầu', () => di('diem-bat-dau')), sua ? null : buocThietLap(3), h('h1', {}, 'Kế hoạch học'), form];
  },
};
