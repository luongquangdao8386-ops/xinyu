// Màn 09A — Nhại theo (mục 5.7), phần đầu của hoạt động “Nói”: từng câu của hội thoại; nghe mẫu (chậm được) bao
// nhiêu lần tùy ý, ghi âm rồi nghe xen kẽ mẫu – giọng mình; ẩn dần chữ: Hán và Pinyin → chỉ chữ Hán → ẩn chữ. Hết
// các câu thì nhại lại với mức ẩn chữ cao hơn hoặc sang đóng vai (09B).
import { chuanBi } from '../am-thanh.mjs';
import { MUC_CHU } from '../bai-tap.mjs';
import { bieuTuong, h, han } from '../giao-dien.mjs';
import { duongHoatDong } from './bai.mjs';
import { luotBan } from './luot-ban.mjs';
import { congTacCham, nut } from './thanh-phan.mjs';
import { dauHoatDong, napHoatDong, nutNgheMau, theoMa } from './trong-bai.mjs';

export default {
  tieuDe: 'Nhại theo',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'noi');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const dsCau = await theoMa('cau', hd.bai.cau);
    for (const c of dsCau) chuanBi('cau', c.ma).catch(() => {});
    const layCham = () => !!hoSo.ngheCham;
    let vt = 0;
    let mucChu = 0;
    let dau = h('header');
    const vung = h('div', { class: 'hoat-dong' });
    const sangDongVai = () => di(`${duongHoatDong(hd.muc.ma, 'noi')}/dong-vai`);

    function chonMucChu(veLai) {
      return h(
        'fieldset',
        { class: 'chon-doan nho' },
        h('legend', {}, 'Hiện chữ'),
        MUC_CHU.map((m, i) =>
          h('label', {}, h('input', { type: 'radio', name: 'muc-chu', value: m.khoa, checked: i === mucChu, onchange: () => { mucChu = i; veLai(); } }), m.ten),
        ),
      );
    }

    function veCau(phatNgay = false) {
      const cau = dsCau[vt];
      dau.replaceWith((dau = dauHoatDong({ di, hd, ten: 'Nhại theo', tienDo: [vt + 1, dsCau.length] })));
      const nghe = nutNgheMau(() => ({ loai: 'cau', ma: cau.ma }), layCham);
      const noiDung = h('div', { class: 'cau-nhai' });
      const veChu = () =>
        noiDung.replaceChildren(
          ...[
            cau.vai ? h('span', { class: 'vai' }, cau.vai) : null,
            mucChu < 2 ? h('p', { class: 'han-lon cau' }, han(cau.chuHan)) : h('p', { class: 'chu-an' }, bieuTuong('tai-nghe'), 'Chữ đang ẩn: nghe và nói theo'),
            mucChu === 0 ? h('p', { class: 'pinyin-lon' }, cau.pinyin) : null,
            h('p', { class: 'nghia' }, cau.nghia),
          ].filter(Boolean),
        );
      veChu();
      const cuoi = vt + 1 === dsCau.length;
      vung.replaceChildren(
        h('h1', { class: 'an-chu' }, `Nhại theo, câu ${vt + 1}`),
        chonMucChu(veChu),
        noiDung,
        h('div', { class: 'hang-nghe' }, nghe, congTacCham(hoSo, luuHoSo)),
        luotBan({ muc: `cau/${cau.ma}`, mau: { loai: 'cau', ma: cau.ma }, layCham, hoSo, luuHoSo, toiDa: 10 }),
        h(
          'div',
          { class: 'chan-co-dinh hai-nut' },
          vt ? nut('Câu trước', { rong: false, onclick: () => { vt--; veCau(true); } }) : null,
          nut(cuoi ? 'Xong nhại theo' : 'Câu tiếp', { chinh: true, mui: true, onclick: () => (cuoi ? veHet() : (vt++, veCau(true))) }),
        ),
      );
      window.scrollTo(0, 0);
      if (phatNgay) nghe.phat();
    }

    function veHet() {
      dau.replaceWith((dau = dauHoatDong({ di, hd, ten: 'Nhại theo', tienDo: [dsCau.length, dsCau.length] })));
      vung.replaceChildren(
        ...[
          h('div', { class: 'trang-trong' }, h('span', { class: 'dau-xong nho', 'aria-hidden': 'true' }, bieuTuong('chon')), h('h2', {}, `Đã nhại ${dsCau.length} câu.`), h('p', { class: 'phu' }, mucChu < 2 ? `Nhại lại với mức “${MUC_CHU[mucChu + 1].ten}” để nhớ câu mà không cần nhìn chữ, hoặc sang đóng vai.` : 'Sang đóng vai: nói lời một người trong hội thoại.')),
          h(
            'div',
            { class: 'nhom-nut' },
            nut('Sang đóng vai', { chinh: true, mui: true, onclick: sangDongVai }),
            mucChu < 2 ? nut(`Nhại lại: ${MUC_CHU[mucChu + 1].ten.toLowerCase()}`, { onclick: () => { mucChu++; vt = 0; veCau(true); } }) : null,
          ),
        ].filter(Boolean),
      );
      window.scrollTo(0, 0);
    }

    veCau();
    return [dau, vung];
  },
};
