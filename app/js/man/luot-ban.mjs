// Phần “Đến lượt bạn” (bảng 04, màn 12) dùng chung cho 12, 09A, 09B: nút micro lớn để ghi âm, nghe lại giọng mình,
// nghe xen kẽ với mẫu (mục 5.7, 12.4). Không chấm điểm. Màn 35 (bảng 12): bảng xin bật micro trước lần ghi đầu tiên,
// khi micro bị chặn hoặc máy không ghi âm được; cho phép luyện không ghi âm (đọc to theo mẫu) hoặc để sau.
import { dung, phatBanGhi, phatChuoi } from '../am-thanh.mjs';
import { banGhiMoi, batDauGhi, coGhiAm, loaiLoiMicro, luuBanGhi } from '../ghi-am.mjs';
import { bieuTuong, h } from '../giao-dien.mjs';
import { nut } from './thanh-phan.mjs';

const BANG_35 = {
  'chua-hoi': ['Bật micro để luyện nói.', 'Cho phép dùng micro khi bạn ghi âm, để nghe lại giọng mình và so với mẫu. Bản ghi chỉ lưu trên máy này.'],
  'tu-choi': ['Micro đang bị chặn.', 'Trên iPhone: mở Cài đặt > Ứng dụng > Safari > Micro (iOS 17 trở về trước: Cài đặt > Safari > Micro), chọn Hỏi hoặc Cho phép rồi thử lại. Trên máy tính: bấm biểu tượng bên trái thanh địa chỉ và cho phép micro.'],
  'khong-co': ['Không tìm thấy micro.', 'Máy này không có micro hoặc micro đang được ứng dụng khác dùng. Bạn vẫn luyện được bằng cách đọc to theo mẫu.'],
  'khong-ho-tro': ['Trình duyệt chưa ghi âm được.', 'Hãy mở Xinyu bằng Safari trên iPhone hoặc Chrome trên máy tính. Trong lúc này bạn vẫn luyện được bằng cách đọc to theo mẫu.'],
};

// Mở bảng 35. Trả về 'thu-lai' (bấm Cho phép micro hoặc Thử lại), 'thay-the' (luyện không ghi âm) hoặc 'de-sau'.
export function moBangMicro(trangThai) {
  return new Promise((ok) => {
    const [tieuDe, loi] = BANG_35[trangThai] || BANG_35['chua-hoi'];
    const thuDuoc = !['khong-co', 'khong-ho-tro'].includes(trangThai);
    const dong = (kq) => {
      bang.close();
      bang.remove();
      ok(kq);
    };
    const bang = h(
      'dialog',
      { class: 'bang-duoi', 'aria-labelledby': 'bang-micro', oncancel: (e) => { e.preventDefault(); dong('de-sau'); } },
      h('span', { class: 'tron-lon', 'aria-hidden': 'true' }, bieuTuong('mic')),
      h('h2', { id: 'bang-micro' }, tieuDe),
      h('p', {}, loi),
      h(
        'div',
        { class: 'nhom-nut' },
        thuDuoc ? nut(trangThai === 'tu-choi' ? 'Thử lại' : 'Cho phép micro', { chinh: true, mui: true, onclick: () => dong('thu-lai') }) : null,
        nut('Luyện không ghi âm', { chinh: !thuDuoc, onclick: () => dong('thay-the') }),
        h('button', { type: 'button', class: 'lien-ket', onclick: () => dong('de-sau') }, 'Để sau'),
      ),
    );
    document.body.append(bang);
    bang.showModal();
  });
}

const nutNho = (bt, nhan, onclick) => h('button', { type: 'button', class: 'nut nut-nho', disabled: true, onclick }, bieuTuong(bt), h('span', {}, nhan));

// Phần “Đến lượt bạn”.
// muc: mục ghi âm (amTiet/ma1, tu/T147, cau/CPA08-01); mau: âm thanh mẫu { loai, ma }; layCham: đang chọn nghe chậm;
// hoSo, luuHoSo: nhớ lựa chọn luyện không ghi âm (hoSo.khongGhiAm) và đã giới thiệu micro (hoSo.daHoiMicro);
// toiDa: số giây ghi tối đa; goiY: mẹo ngắn hiện trên nút micro; tuXenKe: ghi xong thì tự nghe xen kẽ mẫu – mình;
// onGhi(blob): sau mỗi lần ghi; nhanKhongGhi: khi luyện không ghi âm, hiện nút này để báo đã nói xong (09B), bấm thì
// gọi onGhi(null). Phần tử trả về có hàm doiMuc(muc, mau) để chuyển sang mục khác.
export function luotBan({ muc, mau, layCham = () => false, hoSo, luuHoSo, toiDa = 8, goiY, tuXenKe = true, onGhi, nhanKhongGhi }) {
  let banGhi = null;
  let phien = null;
  const khung = h('section', { class: 'luot-ban', 'aria-label': 'Đến lượt bạn' });
  const trangThai = h('p', { class: 'trang-thai-mic', role: 'status', 'aria-live': 'polite' });
  const nutMic = h('button', { type: 'button', class: 'nut-mic', 'aria-label': 'Ghi âm', onclick: () => (phien ? dungLai() : ghiAm()) }, bieuTuong('mic'));
  const nhanMic = h('span', { class: 'nhan-mic' }, 'Chạm để ghi âm');
  const nutNgheLai = nutNho('phat', 'Nghe lại', () => banGhi && phatBanGhi(banGhi));
  const nutXenKe = nutNho('xen-ke', 'Nghe xen kẽ', () => xenKe());

  const coBanGhi = (b) => {
    banGhi = b;
    nutNgheLai.disabled = nutXenKe.disabled = !b;
  };
  const xenKe = () => banGhi && phatChuoi([mau, { blob: banGhi }], { cham: layCham() });

  async function ghiAm() {
    if (!coGhiAm()) return hoiMicro('khong-ho-tro');
    // Lần đầu: giới thiệu vì sao cần micro trước khi trình duyệt hỏi quyền (bỏ qua khi đã được phép).
    let daCho = false;
    try {
      daCho = (await navigator.permissions.query({ name: 'microphone' })).state === 'granted';
    } catch {
      // Safari cũ không hỏi được trạng thái quyền micro.
    }
    if (!hoSo.daHoiMicro && !daCho) {
      hoSo.daHoiMicro = true;
      luuHoSo({ daHoiMicro: true });
      const kq = await moBangMicro('chua-hoi');
      if (kq !== 'thu-lai') return xuLy(kq);
    }
    dung();
    try {
      phien = await batDauGhi({ toiDa, onTuDung: () => dungLai() });
    } catch (e) {
      phien = null;
      return hoiMicro(loaiLoiMicro(e));
    }
    khung.classList.add('dang-ghi');
    nutMic.replaceChildren(bieuTuong('dung-ghi'));
    nutMic.setAttribute('aria-label', 'Dừng ghi âm');
    nhanMic.textContent = 'Đang ghi… chạm để dừng';
    trangThai.textContent = '';
  }

  async function dungLai() {
    if (!phien) return;
    const p = phien;
    phien = null;
    const blob = await p.dung();
    khung.classList.remove('dang-ghi');
    nutMic.replaceChildren(bieuTuong('mic'));
    nutMic.setAttribute('aria-label', 'Ghi âm');
    nhanMic.textContent = 'Chạm để ghi lại';
    if (blob.size < 1000) {
      trangThai.textContent = 'Chưa ghi được tiếng. Thử ghi lại.';
      return;
    }
    coBanGhi(blob);
    trangThai.textContent = tuXenKe ? 'Đã ghi. Đang nghe xen kẽ: mẫu, giọng bạn.' : 'Đã ghi.';
    await luuBanGhi(muc, blob).catch(() => {});
    onGhi?.(blob);
    if (tuXenKe) xenKe();
  }

  async function hoiMicro(loai) {
    xuLy(await moBangMicro(loai));
  }
  function xuLy(kq) {
    if (kq === 'thu-lai') return ghiAm();
    if (kq === 'thay-the') {
      hoSo.khongGhiAm = true;
      luuHoSo({ khongGhiAm: true });
      ve();
    }
  }

  function ve() {
    if (hoSo.khongGhiAm) {
      khung.replaceChildren(
        ...[
          h('h2', {}, 'Đến lượt bạn'),
          goiY ? h('p', { class: 'goi-y-luot' }, bieuTuong('thong-tin'), h('span', {}, goiY)) : null,
          h('p', { class: 'phu' }, 'Đọc to theo mẫu, rồi nghe lại mẫu để tự so.'),
          nhanKhongGhi ? nut(nhanKhongGhi, { chinh: true, mui: true, onclick: () => onGhi?.(null) }) : null,
          h('button', { type: 'button', class: 'lien-ket', onclick: () => { hoSo.khongGhiAm = false; luuHoSo({ khongGhiAm: false }); ve(); } }, 'Bật ghi âm'),
        ].filter(Boolean),
      );
      return;
    }
    khung.replaceChildren(
      ...[
        h('h2', {}, 'Đến lượt bạn'),
        h('div', { class: 'vung-mic' }, nutMic, nhanMic),
        goiY ? h('p', { class: 'goi-y-luot' }, bieuTuong('thong-tin'), h('span', {}, goiY)) : null,
        trangThai,
        h('div', { class: 'hang-nut' }, nutNgheLai, nutXenKe),
      ].filter(Boolean),
    );
  }

  khung.doiMuc = (mucMoi, mauMoi) => {
    if (phien) phien.dung();
    phien = null;
    muc = mucMoi;
    mau = mauMoi;
    khung.classList.remove('dang-ghi');
    nutMic.replaceChildren(bieuTuong('mic'));
    nhanMic.textContent = 'Chạm để ghi âm';
    trangThai.textContent = '';
    coBanGhi(null);
    const dangMuc = muc;
    banGhiMoi(muc)
      .then((b) => {
        if (b && dangMuc === muc) {
          coBanGhi(b);
          trangThai.textContent = 'Có bản ghi lần trước.';
        }
      })
      .catch(() => {});
  };
  ve();
  khung.doiMuc(muc, mau);
  return khung;
}
