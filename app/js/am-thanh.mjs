// Phát âm thanh mẫu (mục 12.3): âm tiết, từ và câu trong audio/, tra theo audio/danh-sach.json. Đường dẫn kèm mã
// băm của tệp (?v=…) để tệp tạo lại thay bản cũ trong bộ nhớ đệm. Tệp được tải thành Blob rồi mới phát: Safari
// trên iPhone không phát được âm thanh do service worker trả về nếu yêu cầu theo từng đoạn (Range).
// Dùng chung một phần tử <audio> cho cả app: iPhone chỉ cho phát khi người dùng bấm, phần tử đã phát một lần thì
// các lần sau phát được cả khi tệp tải xong muộn hơn cú bấm.

const THU_MUC = { amTiet: 'am-tiet', tu: 'tu', cau: 'cau' };
// Tốc độ chậm: giảm tốc độ phát, giữ cao độ (mục 12.3).
export const TOC_DO_CHAM = 0.75;

const DAU_THANH = { '̄': 1, '́': 2, '̌': 3, '̀': 4 };
// Tên tệp của một âm tiết Pinyin: mā → ma1, lǜ → lv4, ma → ma5 (thanh nhẹ). Giống tools/lib/am-thanh.mjs.
export function maAmTiet(amTiet) {
  let thanh = 5;
  const goc = [...amTiet.trim().toLowerCase().normalize('NFD')]
    .filter((k) => {
      if (k in DAU_THANH) thanh = DAU_THANH[k];
      return !(k in DAU_THANH);
    })
    .join('')
    .replace(/ü/g, 'v');
  return /^[a-z]+$/.test(goc) ? goc + thanh : null;
}

// Âm thanh của một câu hỏi nghe (trường amThanh của content/cau-hoi.json): { loai, ma } hoặc null.
export function amThanhCauHoi(cau) {
  const a = cau.amThanh || {};
  if (a.amTiet) return { loai: 'amTiet', ma: maAmTiet(a.amTiet) };
  if (a.tu) return { loai: 'tu', ma: a.tu };
  if (a.cau) return { loai: 'cau', ma: a.cau };
  return null;
}

let danhSach = null;
const napDanhSach = () =>
  (danhSach ||= fetch('audio/danh-sach.json').then((tl) => {
    if (!tl.ok) throw new Error(`Không tải được danh sách âm thanh (${tl.status})`);
    return tl.json();
  }));

// Đường dẫn tệp kèm mã băm; null khi chưa có tệp (chưa tạo âm thanh cho mục này).
export async function duongDan(loai, ma) {
  const muc = (await napDanhSach())[loai]?.[ma];
  return muc ? `audio/${THU_MUC[loai]}/${ma}.mp3?v=${muc.bam}` : null;
}

const daTai = new Map();
// Tải trước một tệp (khi dựng màn) để lúc bấm nghe phát được ngay; trả về địa chỉ Blob hoặc null.
export function chuanBi(loai, ma) {
  const khoa = `${loai}/${ma}`;
  if (!daTai.has(khoa)) {
    const viec = duongDan(loai, ma).then(async (url) => {
      if (!url) return null;
      const tl = await fetch(url);
      if (!tl.ok) throw new Error(`Không tải được âm thanh (${tl.status})`);
      return URL.createObjectURL(await tl.blob());
    });
    viec.catch(() => daTai.delete(khoa));
    daTai.set(khoa, viec);
  }
  return daTai.get(khoa);
}

let loa = null;
let dangPhat = null;
// Phát một tệp; cham: tốc độ 0,75. onXong gọi khi phát hết hoặc bị dừng. Trả về false khi chưa có tệp.
export async function phat(loai, ma, { cham = false, onXong } = {}) {
  loa ||= new Audio();
  dung();
  const url = await chuanBi(loai, ma);
  if (!url) return false;
  const lan = (dangPhat = { onXong });
  loa.src = url;
  loa.preservesPitch = loa.webkitPreservesPitch = true;
  loa.defaultPlaybackRate = loa.playbackRate = cham ? TOC_DO_CHAM : 1;
  loa.onended = loa.onerror = () => xong(lan);
  try {
    await loa.play();
  } catch (e) {
    xong(lan);
    throw e;
  }
  return true;
}
function xong(lan) {
  if (dangPhat !== lan) return;
  dangPhat = null;
  lan.onXong?.();
}
export function dung() {
  if (!loa || !dangPhat) return;
  loa.pause();
  xong(dangPhat);
}
