// Ghi âm giọng người học (mục 12.4): MediaRecorder, lưu trên máy ở kho banGhi, mỗi mục giữ 3 bản gần nhất (gồm cả
// bản ghi nhại theo và đóng vai), không đồng bộ. Quyền micro chỉ xin khi người học bấm ghi âm; bị từ chối hoặc máy
// không ghi âm được thì màn gọi bảng 35 (man/luot-ban.mjs).
// Mục ghi âm đặt theo âm thanh mẫu của nó: amTiet/ma1, tu/T147, cau/CPA08-01.
import { doc, ghi } from './kho.mjs';

export const coGhiAm = () => !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

// Safari ghi được audio/mp4, Chrome và Firefox ghi audio/webm.
const DINH_DANG = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];

let dangGhi = null;

// Lỗi khi xin micro: 'tu-choi' (người dùng hoặc cài đặt chặn), 'khong-co' (máy không có micro), 'loi' (lỗi khác).
export const loaiLoiMicro = (e) => (e?.name === 'NotAllowedError' || e?.name === 'SecurityError' ? 'tu-choi' : e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError' ? 'khong-co' : 'loi');

// Bắt đầu ghi, tự dừng sau toiDa giây. Trả về { dung(): Promise<Blob> }; ném lỗi khi không mở được micro.
export async function batDauGhi({ toiDa = 10, onTuDung } = {}) {
  dungGhi();
  // Phiên âm thanh của Safari (16.4+): ghi và phát khi đang ghi, chỉ phát (loa ngoài) khi ghi xong.
  if (navigator.audioSession) navigator.audioSession.type = 'play-and-record';
  let luong;
  try {
    luong = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  } catch (e) {
    if (navigator.audioSession) navigator.audioSession.type = 'auto';
    throw e;
  }
  const dinhDang = DINH_DANG.find((d) => MediaRecorder.isTypeSupported?.(d));
  const may = new MediaRecorder(luong, dinhDang ? { mimeType: dinhDang } : undefined);
  const manh = [];
  may.ondataavailable = (e) => e.data.size && manh.push(e.data);
  const xong = new Promise((ok) => {
    may.onstop = () => {
      for (const t of luong.getTracks()) t.stop();
      // iPhone chuyển tiếng ra loa thoại khi đang mở micro; trả về loa ngoài để nghe lại rõ.
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
      ok(new Blob(manh, { type: may.mimeType || dinhDang || 'audio/mp4' }));
    };
  });
  const hen = setTimeout(() => {
    if (may.state !== 'recording') return;
    may.stop();
    onTuDung?.();
  }, toiDa * 1000);
  const dung = () => {
    clearTimeout(hen);
    if (may.state === 'recording') may.stop();
    if (dangGhi === phien) dangGhi = null;
    return xong;
  };
  const phien = { dung };
  dangGhi = phien;
  may.start();
  return phien;
}

// Dừng và bỏ bản đang ghi (khi rời màn).
export function dungGhi() {
  dangGhi?.dung();
  dangGhi = null;
}

// Lưu một bản ghi của mục; giữ 3 bản gần nhất. Lưu dạng ArrayBuffer vì Safari từng lỗi khi lưu Blob vào IndexedDB.
export async function luuBanGhi(muc, blob) {
  const cu = (await doc('banGhi', muc))?.ds || [];
  const ban = { luc: new Date().toISOString(), loai: blob.type, du: await blob.arrayBuffer() };
  await ghi('banGhi', { muc, ds: [ban, ...cu].slice(0, 3) });
}

// Bản ghi mới nhất của mục (Blob) hoặc null.
export async function banGhiMoi(muc) {
  const b = (await doc('banGhi', muc))?.ds?.[0];
  return b ? new Blob([b.du], { type: b.loai }) : null;
}
