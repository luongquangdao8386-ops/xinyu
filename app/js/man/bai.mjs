// Màn 08 — Chi tiết bài học (bảng 03): mục tiêu, các hoạt động trong bài theo chu trình ở mục 5.3, tài liệu tham
// chiếu (lỗi thường gặp, dạng câu hỏi thi) và nút bắt đầu hoặc học tiếp. Bài chưa soạn nội dung chỉ hiện mục tiêu.
import { CHANG, hoatDongCuaBai, hoatDongTiep, nhanBai, tachY } from '../bai-hoc.mjs';
import { bieuTuong, h, tronChu } from '../giao-dien.mjs';
import { batDauBai, napLoTrinh } from '../hoc.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { dauLui, nut, tranhGoc } from './thanh-phan.mjs';

// Đường dẫn của một hoạt động trong bài.
export const duongHoatDong = (ma, khoa) => (khoa === 'kiem-tra' ? `kiem-tra/${ma}` : `hoc/${ma}/${khoa}`);

function thamChieu(bai) {
  const muc = [
    ['Tiêu chí hoàn thành', tachY(bai.tieuChi)],
    ['Lỗi thường gặp', tachY(bai.loiThuongGap)],
    ['Dạng câu hỏi thi', tachY(bai.dangThi)],
    ['Hoạt động', tachY((bai.hoatDong || '').replace(/\s*\(\d{2}[A-D]?\)/g, ''))],
  ].filter(([, ds]) => ds.length);
  return h('div', { class: 'tham-chieu', hidden: true }, muc.map(([ten, ds]) => h('section', {}, h('h3', {}, ten), h('ul', {}, ds.map((y) => h('li', {}, tronChu(y)))))));
}

export default {
  tieuDe: 'Chi tiết bài học',
  async ve({ hoSo, di, thamSo, vaoBaiTu }) {
    const ma = thamSo[0];
    const [{ ds, noiDung, tienDo }, cauHoi] = await Promise.all([napLoTrinh(), napNoiDung('cau-hoi')]);
    const muc = ds.find((b) => b.ma === ma);
    if (!muc) {
      di('lo-trinh');
      return [];
    }
    const chang = CHANG.find((c) => c.ten === muc.chang);
    const lui = () => di(vaoBaiTu || `chang/${chang.duong}`);
    const dau = [tranhGoc(), dauLui({ lui, nhanLui: vaoBaiTu?.startsWith('hom-nay') ? 'Hôm nay' : muc.chang }), h('div', { class: 'mo-dau' }, h('p', {}, nhanBai(muc)), h('h1', {}, muc.chuDe))];
    const bai = noiDung[ma];
    const yMucTieu = (y) => h('section', { class: 'the the-muc-tieu' }, h('h2', {}, bieuTuong('muc-tieu'), 'Sau bài này, bạn có thể'), h('ul', {}, y.map((x) => h('li', {}, tronChu(x)))));
    if (!bai) {
      return [...dau, yMucTieu([muc.mucTieu]), h('p', { class: 'the the-canh-bao' }, 'Bài này đang soạn nội dung. Khi soạn xong và xây lại nội dung, bài tự mở.')];
    }

    const td = tienDo[ma];
    const hoatDong = hoatDongCuaBai(bai, cauHoi.filter((q) => q.bai === ma));
    const tiep = hoatDongTiep(hoatDong, td) || hoatDong[0];
    const tc = thamChieu(bai);
    const hangTc = h(
      'button',
      { type: 'button', class: 'hang', 'aria-expanded': 'false', onclick: () => { tc.hidden = !tc.hidden; hangTc.setAttribute('aria-expanded', String(!tc.hidden)); } },
      h('span', { class: 'tron' }, bieuTuong('de-cuong')),
      h('span', { class: 'chu' }, h('span', { class: 'ten' }, 'Tài liệu tham chiếu'), h('span', { class: 'gia-tri' }, 'Tiêu chí · Lỗi thường gặp · Dạng câu hỏi thi')),
      h('span', { class: 'mo xoay' }, bieuTuong('mo')),
    );
    const vao = async (khoa) => {
      await batDauBai(ma);
      di(duongHoatDong(ma, khoa));
    };
    const nhanNut = td?.xong ? 'Học lại' : td?.batDau ? 'Học tiếp' : 'Bắt đầu';

    return [
      ...dau,
      yMucTieu(tachY(bai.tieuChi).length ? tachY(bai.tieuChi) : [bai.mucTieu]),
      h(
        'section',
        { class: 'nhom' },
        h('h2', {}, 'Trong bài học'),
        h(
          'ul',
          { class: 'ds-hang phang' },
          hoatDong.map((d) => {
            const daLam = !!td?.hoatDong?.[d.khoa];
            return h(
              'li',
              {},
              h(
                'button',
                { type: 'button', class: 'hang', onclick: () => vao(d.khoa) },
                h('span', { class: 'tron' }, bieuTuong(d.bieuTuong)),
                h('span', { class: 'chu' }, h('span', { class: 'ten' }, d.ten), h('span', { class: 'gia-tri' }, d.moTa)),
                daLam ? h('span', { class: 'da-lam' }, bieuTuong('chon'), 'Đã làm') : h('span', { class: 'mo' }, bieuTuong('mo')),
              ),
            );
          }),
          h('li', {}, hangTc, tc),
        ),
      ),
      h('div', { class: 'chan-co-dinh' }, nut(`${nhanNut} · ${hoSo.phutMoiNgay} phút`, { chinh: true, mui: true, onclick: () => vao(tiep.khoa) })),
    ];
  },
};
