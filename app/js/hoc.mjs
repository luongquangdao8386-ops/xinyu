// Dữ liệu học của lộ trình: nạp danh sách bài cùng tiến độ đã lưu, ghi bắt đầu bài, hoạt động đã làm, bài đã xong
// và lần làm kiểm tra (kho tienDo, lanLam trong IndexedDB).
import { danhSachBai } from './bai-hoc.mjs';
import { doc, docHet, docTheo, ghi } from './kho.mjs';
import { napNoiDung } from './noi-dung.mjs';

// { ds (mọi bài theo thứ tự), noiDung (bài đã soạn theo mã), tienDo (theo mã) }.
export async function napLoTrinh() {
  const [loTrinh, bai, tienDo] = await Promise.all([napNoiDung('lo-trinh'), napNoiDung('bai'), docHet('tienDo')]);
  return {
    ds: danhSachBai(loTrinh, bai),
    noiDung: Object.fromEntries(bai.map((b) => [b.ma, b])),
    tienDo: Object.fromEntries(tienDo.map((t) => [t.ma, t])),
  };
}

const bayGio = () => new Date().toISOString();

async function capNhat(ma, doi) {
  const cu = (await doc('tienDo', ma)) || { ma, hoatDong: {} };
  return ghi('tienDo', doi({ ...cu, batDau: cu.batDau || bayGio() }));
}

export const batDauBai = (ma) => capNhat(ma, (td) => td);
export const xongHoatDong = (ma, khoa) => capNhat(ma, (td) => ({ ...td, hoatDong: { ...td.hoatDong, [khoa]: bayGio() } }));
// Bài xong khi làm xong kiểm tra mục tiêu bài (mục 10.2: 42 → 39); lanXong đếm số lần học hết bài.
export const xongBai = (ma) => capNhat(ma, (td) => ({ ...td, xong: td.xong || bayGio(), lanXong: (td.lanXong || 0) + 1 }));

// Lần làm bài (mục 11.5): { ma, loai, bai, batDau, xong, traLoi: [{ cauHoi, chon, dung }] }.
export const ghiLanLam = (lan) => ghi('lanLam', lan);
export async function lanLamCuoi(bai, loai) {
  const ds = (await docTheo('lanLam', 'bai', bai)).filter((l) => l.loai === loai && l.xong);
  return ds.sort((a, b) => a.xong.localeCompare(b.xong)).at(-1) || null;
}
