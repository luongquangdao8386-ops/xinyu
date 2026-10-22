// Hoạt động trong bài (địa chỉ hoc/<mã bài>/<khóa>[/phần]): chuyển tới màn của hoạt động. Hoạt động chưa dựng (13,
// 47) mở màn chờ: giữ đầu màn của bài học và tiến độ trong bài, ghi rõ màn nào sẽ có ở việc nào trong
// docs/tien-do.md, cho sang phần tiếp theo. Màn chờ không đánh dấu hoạt động là đã làm.
import { h } from '../giao-dien.mjs';
import { duongHoatDong } from './bai.mjs';
import dongVai from './dong-vai.mjs';
import mauCau from './mau-cau.mjs';
import ngheDoc from './nghe-doc.mjs';
import nhaiTheo from './nhai-theo.mjs';
import phatAm from './phat-am.mjs';
import { nut } from './thanh-phan.mjs';
import { dauHoatDong, napHoatDong } from './trong-bai.mjs';
import tuVung from './tu-vung.mjs';

// Màn của từng hoạt động; hoạt động Nói gồm nhại theo (09A) rồi đóng vai (09B, phần dong-vai).
const MAN = {
  'phat-am': phatAm,
  'nghe-doc': ngheDoc,
  'tu-vung': tuVung,
  'mau-cau': mauCau,
  noi: nhaiTheo,
  'noi/dong-vai': dongVai,
};

const SE_CO = {
  'cap-thanh': 'Nghe từ và chọn cặp thanh, nghe mẫu rồi đọc liền hai âm tiết của 20 cặp thanh.',
  'chu-han': 'Xem thứ tự nét, đồ theo, tự viết và đối chiếu.',
};

const choXay = {
  tieuDe: 'Bài học',
  async ve({ di, thamSo }) {
    const [ma, khoa] = thamSo;
    const hd = await napHoatDong(ma, khoa);
    if (!hd) {
      di(`bai/${ma}`);
      return [];
    }
    const { d, sau } = hd;
    return [
      dauHoatDong({ di, hd, tienDo: [hd.hoatDong.indexOf(d) + 1, hd.hoatDong.length] }),
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

export const manHoatDong = (thamSo) => MAN[[thamSo[1], thamSo[2]].filter(Boolean).join('/')] || choXay;

export default {
  tieuDe: 'Bài học',
  tieuDeCua: (thamSo) => manHoatDong(thamSo).tieuDe,
  ve: (boi) => manHoatDong(boi.thamSo).ve(boi),
};
