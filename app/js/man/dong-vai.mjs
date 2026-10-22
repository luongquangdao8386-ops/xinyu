// Màn 09B — Đóng vai (mục 5.7), phần sau của hoạt động “Nói”: chọn một vai trong hội thoại; app phát lời vai kia,
// đến lượt mình thì hiện gợi ý (ẩn được) và ghi âm; xong đoạn thì nghe lại cả hội thoại ghép giọng mẫu với giọng
// mình, rồi đổi vai. Không ghi âm được thì đọc to và bấm “Tôi đã nói xong”. Xong đóng vai là xong hoạt động “Nói”.
import { chuanBi, dung, phat, phatChuoi } from '../am-thanh.mjs';
import { cacVai, chuoiDongVai } from '../bai-tap.mjs';
import { bieuTuong, h, han } from '../giao-dien.mjs';
import { luotBan } from './luot-ban.mjs';
import { congTac, congTacCham, nut, oChon } from './thanh-phan.mjs';
import { dauHoatDong, napHoatDong, nutNgheMau, theoMa, xongVaSang } from './trong-bai.mjs';

export default {
  tieuDe: 'Đóng vai',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'noi');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const dsCau = await theoMa('cau', hd.bai.cau);
    const vaiCo = cacVai(dsCau);
    if (vaiCo.length < 2) {
      xongVaSang({ di, hd });
      return [];
    }
    for (const c of dsCau) chuanBi('cau', c.ma).catch(() => {});
    const layCham = () => !!hoSo.ngheCham;
    const daDong = new Set();
    let vai = vaiCo[0];
    let banGhi = new Map();
    let vt = 0;
    let dau = h('header');
    const vung = h('div', { class: 'hoat-dong' });
    const dauMan = (tienDo) => dau.replaceWith((dau = dauHoatDong({ di, hd, ten: 'Đóng vai', tienDo })));

    function veChon() {
      dung();
      dauMan(null);
      const loiDau = (v) => dsCau.find((c) => c.vai === v);
      vung.replaceChildren(
        h('h1', {}, 'Chọn vai của bạn'),
        h('p', { class: 'phu' }, 'App đọc lời người kia. Đến lượt bạn thì nói lời của vai mình; gợi ý hiện trên màn và ẩn được.'),
        h(
          'fieldset',
          { class: 'lua-chon' },
          h('legend', { class: 'an-chu' }, 'Vai'),
          vaiCo.map((v) => oChon({ ten: 'vai', gt: v, chu: `Người ${v}${daDong.has(v) ? ' · đã đóng' : ''}`, moTa: h('span', {}, 'Câu đầu: ', han(loiDau(v).chuHan), ` ${loiDau(v).nghia}`), chon: v === vai, onchange: () => (vai = v) })),
        ),
        h('div', { class: 'chan-co-dinh' }, nut('Bắt đầu đóng vai', { chinh: true, mui: true, onclick: () => batDau() })),
      );
      window.scrollTo(0, 0);
    }

    function batDau() {
      banGhi = new Map();
      vt = 0;
      veLuot();
    }

    // Lời đã qua của hội thoại, lời hiện tại nổi lên.
    function bongLoi(c, hienTai) {
      const cuaMinh = c.vai === vai;
      return h(
        'div',
        { class: `bong-loi${cuaMinh ? ' cua-minh' : ''}${hienTai ? ' hien-tai' : ''}` },
        h('span', { class: 'vai' }, cuaMinh ? `${c.vai} · Bạn` : c.vai),
        h('p', { class: 'cau-han' }, han(c.chuHan)),
        h('p', { class: 'cau-nghia' }, c.nghia),
      );
    }

    function veLuot() {
      const c = dsCau[vt];
      dauMan([vt + 1, dsCau.length]);
      const daQua = dsCau.slice(0, vt).map((x) => bongLoi(x, false));
      if (c.vai !== vai) {
        const loi = bongLoi(c, true);
        vung.replaceChildren(h('h1', { class: 'an-chu' }, 'Đóng vai'), h('div', { class: 'hoi-thoai dong-vai' }, daQua, loi), h('p', { class: 'trang-thai-mic' }, bieuTuong('loa'), ` Người ${c.vai} đang nói…`));
        phat('cau', c.ma, { cham: layCham(), onXong: () => setTimeout(tiep, 400) }).then((co) => co || tiep(), tiep);
      } else {
        let anGoiY = !!hoSo.anGoiYDongVai;
        const goiY = h('div', { class: 'goi-y-vai' });
        const veGoiY = () =>
          goiY.replaceChildren(
            ...(anGoiY
              ? [h('p', { class: 'cau-nghia' }, c.nghia), h('p', { class: 'phu nho' }, 'Gợi ý chữ đang ẩn')]
              : [h('p', { class: 'han-lon cau' }, han(c.chuHan)), h('p', { class: 'pinyin-lon' }, c.pinyin), h('p', { class: 'cau-nghia' }, c.nghia)]),
          );
        veGoiY();
        vung.replaceChildren(
          h('h1', { class: 'an-chu' }, 'Đóng vai'),
          h('div', { class: 'hoi-thoai dong-vai' }, daQua),
          h('p', { class: 'nhan' }, `Lượt của bạn · Người ${vai}`),
          goiY,
          h(
            'div',
            { class: 'hang-nghe' },
            nutNgheMau(() => ({ loai: 'cau', ma: c.ma }), layCham, 'Nghe gợi ý'),
            congTacCham(hoSo, luuHoSo),
            congTac('Ẩn gợi ý', anGoiY, (bat) => {
              anGoiY = bat;
              hoSo.anGoiYDongVai = bat;
              luuHoSo({ anGoiYDongVai: bat });
              veGoiY();
            }),
          ),
          luotBan({
            muc: `cau/${c.ma}`,
            mau: { loai: 'cau', ma: c.ma },
            layCham,
            hoSo,
            luuHoSo,
            toiDa: 10,
            tuXenKe: false,
            nhanKhongGhi: 'Tôi đã nói xong',
            onGhi: (blob) => {
              if (blob) banGhi.set(c.ma, blob);
              setTimeout(tiep, blob ? 300 : 0);
            },
          }),
        );
      }
      window.scrollTo(0, document.body.scrollHeight);
    }

    function tiep() {
      if (!vung.isConnected) return;
      if (++vt < dsCau.length) return veLuot();
      veXong();
    }

    function veXong() {
      daDong.add(vai);
      dauMan([dsCau.length, dsCau.length]);
      const vaiKhac = vaiCo.find((v) => !daDong.has(v)) || vaiCo.find((v) => v !== vai);
      const nutNghe = nut('Nghe lại cả đoạn', {
        onclick: () => phatChuoi(chuoiDongVai(dsCau, vai, banGhi), { cham: layCham(), onMoi: (i) => [...vung.querySelectorAll('.bong-loi')].forEach((b, j) => b.classList.toggle('dang-phat', i === j)) }),
      });
      vung.replaceChildren(
        h('h1', {}, `Xong vai ${vai}.`),
        h('p', { class: 'phu' }, banGhi.size ? 'Nghe lại cả hội thoại: lời của bạn là bản vừa ghi, lời người kia là giọng mẫu.' : 'Nghe lại hội thoại mẫu để so với cách bạn vừa nói.'),
        h(
          'div',
          { class: 'nhom-nut' },
          nut('Xong phần nói', { chinh: true, mui: true, onclick: () => xongVaSang({ di, hd }) }),
          nutNghe,
          nut(`Đổi vai: người ${vaiKhac}`, { onclick: () => { vai = vaiKhac; batDau(); } }),
        ),
        h('div', { class: 'hoi-thoai dong-vai' }, dsCau.map((x) => bongLoi(x, false))),
      );
      window.scrollTo(0, 0);
    }

    veChon();
    return [dau, vung];
  },
};
