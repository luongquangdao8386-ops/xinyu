// Màn 09 — Nghe và đọc (bảng 03): hội thoại của bài, nghe cả đoạn hoặc từng câu (nghe chậm được), ẩn Pinyin, xem
// nghĩa khi cần, rồi kiểm tra hiểu: nghe một câu, chọn nghĩa (đáp án nhiễu là nghĩa các câu khác của hội thoại).
// Nhại theo (09A) và đóng vai (09B) ở hoạt động “Nói” của bài.
import { chuanBi, dung, phatChuoi } from '../am-thanh.mjs';
import { cauHieuHoiThoai } from '../bai-tap.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { congTac, congTacCham, nut, nutNghe } from './thanh-phan.mjs';
import { cauChon, dauHoatDong, dongCau, napHoatDong, theoMa, xongVaSang } from './trong-bai.mjs';

export default {
  tieuDe: 'Nghe & đọc',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'nghe-doc');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const dsCau = await theoMa('cau', hd.bai.cau);
    for (const c of dsCau) chuanBi('cau', c.ma).catch(() => {});
    const batDau = new Date().toISOString();
    const traLoi = [];
    const layCham = () => !!hoSo.ngheCham;
    const viTri = hd.hoatDong.indexOf(hd.d);

    const dong = dsCau.map((c) => dongCau(c, { layCham, vai: c.vai, an: { pinyin: hoSo.anPinyin, nghia: true }, lop: 'loi-thoai' }));
    const nutPhat = h('button', { type: 'button', class: 'nut-nghe lon', 'aria-label': 'Nghe cả hội thoại', onclick: () => ngheCa() }, bieuTuong('phat'));
    const datPhat = (dang) => {
      nutPhat.classList.toggle('dang', dang);
      nutPhat.replaceChildren(bieuTuong(dang ? 'tam-dung' : 'phat'));
      nutPhat.setAttribute('aria-label', dang ? 'Dừng' : 'Nghe cả hội thoại');
    };
    function ngheCa() {
      if (nutPhat.classList.contains('dang')) return dung();
      datPhat(true);
      phatChuoi(
        dsCau.map((c) => ({ loai: 'cau', ma: c.ma })),
        {
          cham: layCham(),
          onMoi: (i) => dong.forEach((d, j) => d.classList.toggle('dang-phat', i === j)),
          onXong: () => {
            datPhat(false);
            for (const d of dong) d.classList.remove('dang-phat');
          },
        },
      );
    }
    const anPinyin = congTac('Ẩn Pinyin', hoSo.anPinyin, (bat) => {
      hoSo.anPinyin = bat;
      luuHoSo({ anPinyin: bat });
      for (const d of dong) d.querySelector('.cau-pinyin').hidden = bat;
    });
    const xemNghia = h(
      'button',
      { type: 'button', class: 'hang hang-mo', 'aria-expanded': 'false', onclick: () => {
        const mo = xemNghia.getAttribute('aria-expanded') !== 'true';
        xemNghia.setAttribute('aria-expanded', String(mo));
        for (const d of dong) d.querySelector('.cau-nghia').hidden = !mo;
      } },
      h('span', { class: 'tron' }, bieuTuong('sach')),
      h('span', { class: 'chu' }, h('span', { class: 'ten' }, 'Xem nghĩa')),
      h('span', { class: 'mo xoay' }, bieuTuong('mo')),
    );

    // Kiểm tra hiểu: từng câu một, nút chân màn đổi Kiểm tra → Câu tiếp → Xong.
    const cauHoi = cauHieuHoiThoai(dsCau, Date.now());
    let c = 0;
    let cauDang = null;
    const vungHoi = h('div', { class: 'hieu-noi-dung' });
    const nutChinh = nut('Kiểm tra', { chinh: true, mui: true, disabled: !!cauHoi.length, onclick: () => bam() });
    const datNut = (nhan, tat = false) => {
      nutChinh.firstChild.textContent = nhan;
      nutChinh.disabled = tat;
    };
    function veHoi() {
      const q = cauHoi[c];
      cauDang = cauChon({
        ten: `hieu-${q.cau.ma}`,
        dapAn: q.dapAn,
        dung: q.dung,
        onChon: () => datNut('Kiểm tra'),
        onCham: ({ chon, dung: d }) => {
          traLoi.push({ muc: `cau/${q.cau.ma}`, dang: 'nghe-chon-nghia', chon, dung: d });
          datNut(c + 1 < cauHoi.length ? 'Câu tiếp' : 'Xong nghe & đọc');
        },
      });
      vungHoi.replaceChildren(
        h('p', { class: 'nhan' }, `Câu ${c + 1} / ${cauHoi.length} · Nghe câu, chọn nghĩa`),
        h('div', { class: 'khoi-nghe' }, nutNghe({ loai: 'cau', ma: q.cau.ma, nhan: 'Nghe câu hỏi', layCham }), h('span', { class: 'chu' }, h('b', {}, 'Nghe câu'), h('span', { class: 'phu nho' }, 'Bấm để nghe lại'))),
        cauDang,
      );
      datNut('Kiểm tra', true);
    }
    function bam() {
      if (cauDang && !cauDang.daCham) return cauDang.cham();
      if (c + 1 < cauHoi.length) {
        c++;
        veHoi();
        return vungHoi.querySelector('.nut-nghe')?.click();
      }
      xongVaSang({ di, hd, batDau, traLoi });
    }
    if (cauHoi.length) veHoi();
    else datNut('Xong nghe & đọc');

    return [
      dauHoatDong({ di, hd, tienDo: [viTri + 1, hd.hoatDong.length] }),
      h(
        'div',
        { class: 'hoat-dong' },
        h('h1', {}, hd.muc.chuDe),
        h('div', { class: 'khoi-nghe trinh-phat' }, nutPhat, h('span', { class: 'chu' }, h('b', {}, 'Nghe hội thoại'), h('span', { class: 'phu nho' }, `${dsCau.length} câu · bấm một câu để nghe riêng`))),
        h('div', { class: 'hang-nghe' }, congTacCham(hoSo, luuHoSo), anPinyin),
        h('div', { class: 'hoi-thoai' }, dong),
        xemNghia,
        cauHoi.length ? h('section', { class: 'nhom luyen-nhanh' }, h('h2', {}, 'Hiểu nội dung'), vungHoi) : null,
        h('div', { class: 'chan-co-dinh' }, nutChinh),
      ),
    ];
  },
};
