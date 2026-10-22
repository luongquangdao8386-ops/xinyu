// Màn 42 — Kiểm tra mục tiêu bài (mục 5.2, 10.2): câu hỏi của bài trong content/cau-hoi.json, từng câu một, phản
// hồi ngay sau mỗi câu với ✓/✕ kèm chữ, lời giải và chỗ dễ nhầm của đáp án đã chọn. Câu sai được hỏi lại một lần
// ở cuối, đáp án xáo lại. Làm xong: lưu lần làm (kho lanLam), đánh dấu bài xong rồi sang màn 39.
// Bố cục theo bảng 03 (màn 09) và bảng 14 (màn 38); đáp án đang chọn dùng viền chu-chinh trên nền kem (mục 8.2).
import { amThanhCauHoi, chuanBi, dung } from '../am-thanh.mjs';
import { xaoDapAn } from '../bai-hoc.mjs';
import { bieuTuong, h, tronChu } from '../giao-dien.mjs';
import { ghiLanLam, napLoTrinh, xongBai, xongHoatDong } from '../hoc.mjs';
import { napNoiDung } from '../noi-dung.mjs';
import { dauLui, nut, nutNghe } from './thanh-phan.mjs';

const KY_NANG = { nghe: 'Nghe', 'đọc': 'Đọc', 'nói': 'Nói', 'viết': 'Viết' };

export default {
  tieuDe: 'Kiểm tra',
  async ve({ hoSo, luuHoSo, di, thamSo }) {
    const ma = thamSo[0];
    const [{ ds }, tatCa] = await Promise.all([napLoTrinh(), napNoiDung('cau-hoi')]);
    const muc = ds.find((b) => b.ma === ma);
    const cauHoi = tatCa.filter((q) => q.bai === ma);
    if (!muc || !cauHoi.length) {
      di(muc ? `bai/${ma}` : 'lo-trinh');
      return [];
    }
    for (const q of cauHoi) {
      const a = amThanhCauHoi(q);
      if (a?.ma) chuanBi(a.loai, a.ma).catch(() => {});
    }

    const batDau = new Date().toISOString();
    const hat = Date.now();
    const hang = cauHoi.map((cau) => ({ cau, lan: 1 }));
    const traLoi = [];
    let vt = 0;
    const vung = h('div', { class: 'cau-kiem-tra' });
    let dau = h('header');

    function veCau(tuPhat = false) {
      const { cau, lan } = hang[vt];
      const soDaLam = traLoi.filter((t) => t.lan === 1).length;
      dau.replaceWith((dau = dauLui({ lui: () => { dung(); di(`bai/${ma}`); }, nhanLui: 'Thoát kiểm tra, về chi tiết bài học', tieuDe: `Bài ${String(muc.soThu).padStart(2, '0')} / Kiểm tra`, tienDo: [soDaLam, cauHoi.length] })));
      const dapAn = xaoDapAn(cau, hat + lan);
      const am = amThanhCauHoi(cau);
      const loa = am?.ma ? nutNghe({ loai: am.loai, ma: am.ma, nhan: 'Nghe', lon: true, layCham: () => !!hoSo.ngheCham }) : null;
      let chon = null;
      const nutKiem = nut('Kiểm tra', { chinh: true, mui: true, disabled: true, onclick: () => (nutKiem.dataset.xong ? sang() : cham()) });
      const phanHoi = h('div', { class: 'phan-hoi', role: 'status', 'aria-live': 'polite' });
      const nhom = h(
        'fieldset',
        { class: 'dap-an' },
        h('legend', { class: 'an-chu' }, 'Chọn một đáp án'),
        dapAn.map((d) =>
          h(
            'label',
            { class: 'o-dap-an', 'data-dap-an': d },
            h('input', { type: 'radio', name: 'dap-an', value: d, onchange: () => { chon = d; nutKiem.disabled = false; } }),
            h('span', { class: 'dau' }),
            h('span', { class: 'ten' }, tronChu(d)),
            h('span', { class: 'ket-qua' }),
          ),
        ),
      );

      function cham() {
        const dung_ = chon === cau.dapAnDung;
        traLoi.push({ cauHoi: cau.ma, chon, dung: dung_, lan });
        for (const o of nhom.querySelectorAll('.o-dap-an')) {
          o.querySelector('input').disabled = true;
          const d = o.dataset.dapAn;
          const kq = d === cau.dapAnDung ? ['dung', 'Đáp án đúng'] : d === chon ? ['sai', 'Bạn chọn'] : null;
          if (!kq) continue;
          o.classList.add(kq[0]);
          o.querySelector('.ket-qua').replaceChildren(bieuTuong(kq[0]), kq[1]);
        }
        const nham = cau.dapAnSai.find((s) => s.dapAn === chon)?.nhamVoi;
        phanHoi.className = `phan-hoi ${dung_ ? 'dung' : 'sai'}`;
        phanHoi.replaceChildren(
          ...[
            h('p', { class: 'dong-dau' }, bieuTuong(dung_ ? 'dung' : 'sai'), h('b', {}, dung_ ? 'Đúng.' : 'Chưa đúng.'), dung_ ? null : h('span', {}, ' Đáp án: ', tronChu(cau.dapAnDung))),
            nham ? h('p', {}, tronChu(nham)) : null,
            h('p', {}, tronChu(cau.loiGiai)),
            !dung_ && lan === 1 ? h('p', { class: 'phu nho' }, 'Câu này sẽ được hỏi lại ở cuối bài kiểm tra.') : null,
          ].filter(Boolean),
        );
        if (!dung_ && lan === 1) hang.push({ cau, lan: 2 });
        nutKiem.dataset.xong = '1';
        nutKiem.firstChild.textContent = vt + 1 < hang.length ? 'Câu tiếp' : 'Xem kết quả';
        nutKiem.focus();
      }

      const doiCham = h(
        'label',
        { class: 'cong-tac' },
        h('input', { type: 'checkbox', checked: !!hoSo.ngheCham, onchange: (e) => { hoSo.ngheCham = e.target.checked; luuHoSo({ ngheCham: e.target.checked }); } }),
        h('span', {}, 'Nghe chậm'),
      );
      // replaceChildren của DOM ghi null thành chữ "null" nên lọc trước.
      vung.replaceChildren(
        ...[
          h('p', { class: 'nhan' }, `${KY_NANG[cau.kyNang] || cau.kyNang} · ${lan === 2 ? 'Làm lại câu chưa đúng' : `Câu ${vt + 1}`}`),
          h('h2', { class: 'de-bai' }, tronChu(cau.noiDung)),
          loa ? h('div', { class: 'khoi-nghe' }, loa, h('span', { class: 'chu' }, h('b', {}, 'Nghe'), h('span', { class: 'phu nho' }, 'Bấm để nghe lại')), doiCham) : null,
          nhom,
          phanHoi,
          h('div', { class: 'chan-co-dinh' }, nutKiem),
        ].filter(Boolean),
      );
      window.scrollTo(0, 0);
      if (tuPhat && loa) loa.phat();
    }

    async function sang() {
      dung();
      if (++vt < hang.length) return veCau(true);
      const xong = new Date().toISOString();
      await ghiLanLam({ ma: `${ma}-${hat}`, loai: 'kiem-tra', bai: ma, batDau, xong, traLoi });
      await xongHoatDong(ma, 'kiem-tra');
      await xongBai(ma);
      di(`xong/${ma}`);
    }

    veCau();
    return [dau, vung];
  },
};
