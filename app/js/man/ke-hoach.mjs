// Màn 04 — Kế hoạch cá nhân (bảng 02): điểm bắt đầu, mục tiêu, thời lượng mỗi ngày và ngày thi; kế hoạch tính lại
// ngay khi đổi (mục 4.2).
import { bieuTuong, h, ngayHomNay, vietNgay } from '../giao-dien.mjs';
import { BUOI_HOC, THOI_LUONG, PHUT_MOI_BAI, baiDenCap, uocTinh } from '../ke-hoach.mjs';
import { xinLuuLau } from '../kho.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { tenCap } from './muc-tieu.mjs';
import { dauBuoc, hang, nut, tranhGoc } from './thanh-phan.mjs';

const tuan = (ngay) => (ngay < 14 ? `${ngay} ngày` : `khoảng ${Math.round(ngay / 7)} tuần`);

export default {
  tieuDe: 'Kế hoạch học',
  async ve({ hoSo, luuHoSo, di, sua }) {
    const loTrinh = await napNoiDung('lo-trinh');
    const cap = hoSo.capMucTieu ?? 1;
    const tatCa = baiDenCap(loTrinh, cap);
    const vt = Math.max(0, tatCa.findIndex((b) => b.ma === hoSo.diemBatDau));
    const conLai = tatCa.slice(vt);
    const chon = { phutMoiNgay: hoSo.phutMoiNgay ?? 30, ngayThi: hoSo.ngayThi ?? null };
    const homNay = ngayHomNay();

    const tomTat = h('section', { class: 'the', 'aria-live': 'polite' });
    const buoi = h('ol', { class: 'bang-buoi' });
    const tenBuoi = h('summary', {});
    const giaTriNgay = h('span', { class: 'gia-tri son' });
    function tinhLai() {
      const kq = uocTinh({ soBai: conLai.length, phutMoiNgay: chon.phutMoiNgay, homNay, ngayThi: chon.ngayThi });
      giaTriNgay.textContent = chon.ngayThi ? vietNgay(chon.ngayThi) : 'Chưa chọn';
      const dong = [
        h('p', {}, `Từ ${conLai[0].ma} đến hết ${tenCap(cap)}: `, h('b', {}, `${kq.soBai} bài`), '. Học ', h('b', {}, `${chon.phutMoiNgay} phút`), ' mỗi ngày thì dự kiến xong ngày ', h('b', {}, vietNgay(kq.ngayXong)), ` (${tuan(kq.soNgay)}).`),
      ];
      if (kq.ngayThi) {
        if (kq.conNgay < 0) dong.push(h('p', {}, 'Ngày thi đã qua; chọn lại ngày thi hoặc xóa.'));
        else if (kq.kip) dong.push(h('p', {}, `Còn ${kq.conNgay} ngày đến ngày thi: kịp học hết bài, dư khoảng ${kq.conNgay - kq.soNgay} ngày để ôn và luyện thi.`));
        else dong.push(h('p', {}, `Còn ${kq.conNgay} ngày đến ngày thi: chưa kịp với ${chon.phutMoiNgay} phút mỗi ngày. `, kq.phutCan ? `Chọn ${kq.phutCan} phút thì kịp.` : 'Cả 45 phút cũng chưa kịp; cân nhắc dời ngày thi hoặc tập trung luyện thi.'));
      }
      dong.push(h('p', { class: 'phu nho' }, `Ước tính khoảng ${PHUT_MOI_BAI} phút cho mỗi bài kể cả ôn tập, học đều mỗi ngày; khi đã học một thời gian, app tính theo tốc độ thật của bạn.`));
      tomTat.replaceChildren(...dong);
      tomTat.className = kq.ngayThi && !kq.kip ? 'the the-canh-bao' : 'the';
      tenBuoi.textContent = `Một buổi ${chon.phutMoiNgay} phút gồm những gì?`;
      buoi.replaceChildren(...BUOI_HOC[chon.phutMoiNgay].map(([p, viec]) => h('li', {}, h('span', { class: 'phut' }, `${p} phút`), h('span', {}, viec))));
    }

    const oNgay = h('input', { type: 'date', id: 'ngay-thi', min: homNay, value: chon.ngayThi || '', 'aria-label': 'Ngày thi', oninput: () => { chon.ngayThi = oNgay.value || null; tinhLai(); } });
    const xoaNgay = h('button', { type: 'button', class: 'lien-ket', onclick: () => { oNgay.value = ''; chon.ngayThi = null; tinhLai(); } }, 'Xóa ngày thi');
    const baiDau = tatCa[vt];
    return [
      tranhGoc(),
      dauBuoc(sua ? 0 : 3, () => di(sua ? 'toi' : 'diem-bat-dau'), sua ? 'Tôi' : 'Điểm bắt đầu'),
      h('div', { class: 'mo-dau' }, h('h1', {}, 'Lộ trình', h('br'), 'dành cho bạn.'), h('p', {}, 'Chọn thời lượng học và ngày thi để bắt đầu hành trình Hán ngữ của bạn.')),
      h(
        'ul',
        { class: 'ds-hang' },
        hang({ bieuTuong: 'sach', ten: 'Bắt đầu', giaTri: baiDau.ma.startsWith('PA') && vt === 0 ? 'Nền phát âm' : `${baiDau.ma} · ${baiDau.chuDe}`, onclick: () => di(sua ? 'diem-bat-dau/sua' : 'diem-bat-dau') }),
        hang({ bieuTuong: 'muc-tieu', ten: 'Mục tiêu', giaTri: tenCap(cap), onclick: () => di(sua ? 'muc-tieu/sua' : 'muc-tieu') }),
        hang({ bieuTuong: 'de-cuong', ten: 'Đề cương', giaTri: 'HSK 3.0 · Đề cương thi 11/2025' }),
      ),
      h(
        'fieldset',
        { class: 'chon-doan' },
        h('legend', {}, 'Thời lượng học mỗi ngày'),
        THOI_LUONG.map((p) => h('label', {}, h('input', { type: 'radio', name: 'phut', value: p, checked: chon.phutMoiNgay === p, onchange: () => { chon.phutMoiNgay = p; tinhLai(); } }), `${p} phút`)),
      ),
      h(
        'ul',
        { class: 'ds-hang' },
        h('li', {}, h('label', { class: 'hang', for: 'ngay-thi', onclick: (e) => { if (e.target !== oNgay) return; try { oNgay.showPicker(); } catch {} } }, h('span', { class: 'tron' }, bieuTuong('lich')), h('span', { class: 'chu' }, h('span', { class: 'ten' }, 'Ngày thi'), giaTriNgay, h('span', { class: 'gia-tri nho' }, 'Không bắt buộc; bổ sung khi bạn có lịch thi.')), h('span', { class: 'mo' }, bieuTuong('mo')), oNgay)),
      ),
      xoaNgay,
      tomTat,
      h('details', { class: 'mo-rong' }, tenBuoi, buoi),
      nut(sua ? 'Lưu kế hoạch' : 'Bắt đầu lộ trình', {
        chinh: true,
        mui: !sua,
        onclick: async () => {
          await luuHoSo({ ...chon, xongThietLap: true });
          if (!sua) await xinLuuLau().catch(() => null);
          di(sua ? 'toi' : 'hom-nay');
        },
      }),
    ];
  },
};
