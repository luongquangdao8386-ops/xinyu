// Hoạt động trong bài chưa dựng (màn 09–13, 47): giữ đầu màn của bài học và tiến độ trong bài, ghi rõ màn nào sẽ
// có ở việc nào trong docs/tien-do.md, cho sang phần tiếp theo. Không đánh dấu hoạt động là đã làm.
import { hoatDongCuaBai } from '../bai-hoc.mjs';
import { h } from '../giao-dien.mjs';
import { napLoTrinh } from '../hoc.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { duongHoatDong } from './bai.mjs';
import { dauLui, nut } from './thanh-phan.mjs';

const SE_CO = {
  'phat-am': 'Nghe mẫu từng âm và thanh, xem cách đọc và so sánh với tiếng Việt, đọc theo, ghi âm và nghe lại.',
  'cap-thanh': 'Nghe từ và chọn cặp thanh, nghe mẫu rồi đọc liền hai âm tiết của 20 cặp thanh.',
  'nghe-doc': 'Nghe hội thoại, xem Pinyin và nghĩa khi cần, trả lời câu hỏi hiểu nội dung.',
  'tu-vung': 'Từ, Pinyin, âm thanh, nghĩa, âm Hán Việt, câu ví dụ và ghi chú của bạn.',
  'mau-cau': 'Mẫu câu, giải thích, so sánh với tiếng Việt, lỗi hay mắc và ví dụ.',
  'chu-han': 'Xem thứ tự nét, đồ theo, tự viết và đối chiếu.',
  noi: 'Nhại theo từng câu, ghi âm, nghe xen kẽ với mẫu; đóng vai một người trong hội thoại.',
};

export default {
  tieuDe: 'Bài học',
  async ve({ di, thamSo }) {
    const [ma, khoa] = thamSo;
    const [{ ds, noiDung }, cauHoi] = await Promise.all([napLoTrinh(), napNoiDung('cau-hoi')]);
    const bai = noiDung[ma];
    const hoatDong = bai ? hoatDongCuaBai(bai, cauHoi.filter((q) => q.bai === ma)) : [];
    const i = hoatDong.findIndex((d) => d.khoa === khoa);
    if (i < 0) {
      di(bai ? `bai/${ma}` : 'lo-trinh');
      return [];
    }
    const d = hoatDong[i];
    const sau = hoatDong[i + 1];
    const soThu = ds.find((b) => b.ma === ma).soThu;
    return [
      dauLui({ lui: () => di(`bai/${ma}`), nhanLui: 'Chi tiết bài học', tieuDe: `Bài ${String(soThu).padStart(2, '0')} / ${d.ten}`, tienDo: [i + 1, hoatDong.length] }),
      h('div', { class: 'mo-dau rong' }, h('h1', {}, d.ten), h('p', { class: 'phu' }, d.moTa)),
      h('section', { class: 'the' }, h('p', {}, SE_CO[khoa] || ''), h('p', { class: 'phu nho' }, `Màn ${d.man} đang xây ở việc ${d.viec}. Trong lúc chờ, bạn có thể sang phần tiếp theo của bài.`)),
      h(
        'div',
        { class: 'nhom-nut' },
        sau ? nut(`Sang: ${sau.ten}`, { chinh: true, mui: true, onclick: () => di(duongHoatDong(ma, sau.khoa)) }) : null,
        nut('Về bài học', { onclick: () => di(`bai/${ma}`) }),
      ),
    ];
  },
};
