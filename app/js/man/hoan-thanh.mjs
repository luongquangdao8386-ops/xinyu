// Màn 39 — Hoàn thành bài học (bảng 15): tổng kết bài vừa học và lần kiểm tra gần nhất (số câu đúng ngay lần đầu,
// không có điểm hay huy chương), gợi ý ôn lại, sang bài tiếp theo hoặc về Hôm nay (mục 10.2).
import { baiSau, hoatDongCuaBai, nhanBai } from '../bai-hoc.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { lanLamCuoi, napLoTrinh } from '../hoc.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { duongHoatDong } from './bai.mjs';
import { dauApp, hang, nut, tranhGoc } from './thanh-phan.mjs';

export default {
  tieuDe: 'Hoàn thành bài học',
  async ve({ di, thamSo }) {
    const ma = thamSo[0];
    const [{ ds, noiDung, tienDo }, cauHoi, lan] = await Promise.all([napLoTrinh(), napNoiDung('cau-hoi'), lanLamCuoi(ma, 'kiem-tra')]);
    const muc = ds.find((b) => b.ma === ma);
    const bai = noiDung[ma];
    if (!muc || !bai || !tienDo[ma]?.xong) {
      di(muc ? `bai/${ma}` : 'hom-nay');
      return [];
    }
    const hoatDong = hoatDongCuaBai(bai, cauHoi.filter((q) => q.bai === ma));
    const lanDau = lan?.traLoi.filter((t) => t.lan === 1) || [];
    const soDung = lanDau.filter((t) => t.dung).length;
    const sau = baiSau(ds, ma);

    const tongKet = [
      hang({ bieuTuong: 'sach', ten: 'Đã học', giaTri: bai.chuDe }),
      bai.phatAm?.length ? hang({ bieuTuong: 'loa', ten: 'Âm và thanh', giaTri: `${bai.phatAm.length} mục` }) : null,
      bai.tu?.length ? hang({ bieuTuong: 'de-cuong', ten: 'Từ mới', giaTri: `${bai.tu.length} từ` }) : null,
      bai.cau?.length ? hang({ bieuTuong: 'loi-thoai', ten: 'Mẫu câu', giaTri: `${bai.cau.length} câu` }) : null,
      lanDau.length ? hang({ bieuTuong: 'muc-tieu', ten: 'Kiểm tra', giaTri: `${soDung} / ${lanDau.length} câu đúng ngay lần đầu` }) : null,
    ];
    const onLai = [
      ...hoatDong.filter((d) => d.khoa !== 'kiem-tra').slice(0, 2).map((d) => hang({ bieuTuong: d.bieuTuong, ten: d.ten, giaTri: d.moTa, onclick: () => di(duongHoatDong(ma, d.khoa)) })),
      hang({ bieuTuong: 'lam-lai', ten: 'Làm lại bài kiểm tra', giaTri: soDung < lanDau.length ? `${lanDau.length - soDung} câu chưa đúng lần đầu` : 'Ôn lại toàn bộ câu hỏi', onclick: () => di(`kiem-tra/${ma}`) }),
    ];

    return [
      tranhGoc(),
      dauApp(),
      h('div', { class: 'mo-dau' }, h('h1', {}, 'Thêm một', h('br'), 'bước tiến.'), h('p', {}, nhanBai(muc))),
      h('div', { class: 'dau-xong', role: 'img', 'aria-label': 'Đã hoàn thành bài' }, bieuTuong('chon')),
      h('ul', { class: 'ds-hang' }, tongKet),
      h('section', { class: 'nhom' }, h('h2', {}, 'Bạn có thể ôn lại'), h('ul', { class: 'ds-hang' }, onLai)),
      h(
        'div',
        { class: 'nhom-nut' },
        sau ? nut('Sang bài tiếp theo', { chinh: true, mui: true, onclick: () => di(`bai/${sau.ma}`) }) : h('p', { class: 'phu' }, 'Bạn đã học hết các bài của lộ trình hiện có.'),
        nut('Về Hôm nay', { onclick: () => di('hom-nay') }),
      ),
    ];
  },
};
