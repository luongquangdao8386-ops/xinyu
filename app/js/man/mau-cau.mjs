// Màn 11 — Ngữ pháp (bảng 04), hoạt động “Mẫu câu”: từng điểm ngữ pháp của bài với mẫu câu, giải thích, so sánh với
// tiếng Việt, lỗi người Việt hay mắc (mục 5.5), câu ví dụ có âm thanh và bài điền từ còn thiếu dựng từ câu ví dụ
// (đáp án nhiễu là từ khác của bài). Tên điểm ngữ pháp lấy ở đầu lời giải thích, trước dấu hai chấm.
import { cauDienTu, tachTenNguPhap } from '../bai-tap.mjs';
import { bieuTuong, h, han, tronChu } from '../giao-dien.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { nut, nutNghe } from './thanh-phan.mjs';
import { cauChon, dauHoatDong, dongCau, napHoatDong, theoMa, xongVaSang } from './trong-bai.mjs';

export default {
  tieuDe: 'Mẫu câu',
  async ve({ hoSo, di, thamSo }) {
    const hd = await napHoatDong(thamSo[0], 'mau-cau');
    if (!hd) {
      di(`bai/${thamSo[0]}`);
      return [];
    }
    const [dsNp, tatCaTu, tatCaCau] = await Promise.all([theoMa('ngu-phap', hd.bai.nguPhap), napNoiDung('tu'), napNoiDung('cau')]);
    const tuTheoMa = new Map(tatCaTu.map((t) => [t.ma, t]));
    const cauTheoMa = new Map(tatCaCau.map((c) => [c.ma, c]));
    const tuCungBai = (hd.bai.tu || []).map((m) => tuTheoMa.get(m)).filter(Boolean);
    const batDau = new Date().toISOString();
    const hat = Date.now();
    const traLoi = [];
    const layCham = () => !!hoSo.ngheCham;
    let vt = 0;
    let dau = h('header');
    const vung = h('div', { class: 'hoat-dong' });

    function veDiem() {
      const np = dsNp[vt];
      const { ten, giaiThich } = tachTenNguPhap(np.giaiThich);
      const viDu = (np.viDu || []).map((m) => cauTheoMa.get(m)).filter(Boolean);
      const dienTu = viDu
        .map((c, i) => ({ cau: c, bai: cauDienTu(c, tuTheoMa, tuCungBai, tatCaTu.filter((t) => t.cap === np.cap), hat + vt * 10 + i) }))
        .filter((x) => x.bai && x.bai.dapAn.length > 1)
        .slice(0, 3);
      const cuoi = vt + 1 === dsNp.length;
      dau.replaceWith((dau = dauHoatDong({ di, hd, tienDo: [vt + 1, dsNp.length] })));

      let c = 0;
      let cauDang = null;
      const vungDien = h('div', { class: 'dien-tu' });
      const nutChinh = nut('', { chinh: true, mui: true, onclick: () => bam() });
      const datNut = (nhan, tat = false) => {
        nutChinh.firstChild.textContent = nhan;
        nutChinh.disabled = tat;
      };
      function veDien() {
        const { cau, bai } = dienTu[c];
        const nghe = nutNghe({ loai: 'cau', ma: cau.ma, nhan: `Nghe: ${cau.chuHan}`, layCham });
        nghe.hidden = true;
        cauDang = cauChon({
          ten: `dien-${cau.ma}`,
          dapAn: bai.dapAn,
          dung: bai.dung,
          ngang: true,
          onChon: () => datNut('Kiểm tra'),
          onCham: ({ chon, dung }) => {
            traLoi.push({ muc: `ngu-phap/${np.ma}`, cau: cau.ma, dang: 'dien-tu', chon, dung });
            nghe.hidden = false;
            datNut(c + 1 < dienTu.length ? 'Câu tiếp' : cuoi ? 'Xong mẫu câu' : 'Tiếp tục');
          },
        });
        vungDien.replaceChildren(
          h('p', { class: 'nhan' }, `Câu ${c + 1} / ${dienTu.length}`),
          h('div', { class: 'cau-dien' }, h('p', { class: 'cau-han' }, han(bai.truoc), h('span', { class: 'cho-trong', 'aria-label': 'chỗ trống' }, '＿＿'), han(bai.sau)), nghe),
          h('p', { class: 'cau-nghia' }, cau.nghia),
          cauDang,
        );
        datNut('Kiểm tra', true);
      }
      function bam() {
        if (cauDang && !cauDang.daCham) return cauDang.cham();
        if (c + 1 < dienTu.length) {
          c++;
          return veDien();
        }
        if (!cuoi) {
          vt++;
          return veDiem();
        }
        xongVaSang({ di, hd, batDau, traLoi });
      }
      if (dienTu.length) veDien();
      else datNut(cuoi ? 'Xong mẫu câu' : 'Tiếp tục');

      vung.replaceChildren(
        ...[
          h('h1', { class: 'ten-ngu-phap' }, tronChu(ten || 'Mẫu câu')),
          h('div', { class: 'the cong-thuc' }, h('p', { class: 'mau-cau' }, tronChu(np.mauCau)), h('p', {}, tronChu(giaiThich))),
          h(
            'dl',
            { class: 'meo' },
            np.soSanh ? [h('dt', {}, 'So với tiếng Việt'), h('dd', {}, tronChu(np.soSanh))] : null,
            np.loiHayMac ? [h('dt', { class: 'canh-bao' }, bieuTuong('canh-bao'), 'Lỗi người Việt hay mắc'), h('dd', {}, tronChu(np.loiHayMac))] : null,
          ),
          viDu.length ? h('section', { class: 'nhom vi-du' }, h('h2', {}, 'Ví dụ'), viDu.map((cau) => dongCau(cau, { layCham }))) : null,
          dienTu.length ? h('section', { class: 'nhom luyen-nhanh' }, h('h2', {}, 'Điền từ còn thiếu'), vungDien) : null,
          h('div', { class: 'chan-co-dinh' }, nutChinh),
        ].filter(Boolean),
      );
      window.scrollTo(0, 0);
    }

    veDiem();
    return [dau, vung];
  },
};
