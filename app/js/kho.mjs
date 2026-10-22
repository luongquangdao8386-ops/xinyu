// Dữ liệu học lưu trên máy bằng IndexedDB (mục 11.5, 12.2). Mỗi bản ghi có trường capNhat (thời điểm cập nhật)
// để đồng bộ ở giai đoạn B2. Thêm kho mới: thêm một hàm vào NANG_CAP (phiên bản cơ sở dữ liệu tăng theo).

const TEN = 'xinyu';
const NANG_CAP = [
  // Phiên bản 1: cài đặt và hồ sơ học (khóa 'hoSo': mục tiêu, cấp, điểm bắt đầu, thời lượng, ngày thi).
  (db) => db.createObjectStore('caiDat', { keyPath: 'khoa' }),
];

let moSan = null;
function mo() {
  moSan ||= new Promise((xong, loi) => {
    const yc = indexedDB.open(TEN, NANG_CAP.length);
    yc.onupgradeneeded = (e) => {
      for (let v = e.oldVersion; v < NANG_CAP.length; v++) NANG_CAP[v](yc.result);
    };
    yc.onsuccess = () => xong(yc.result);
    yc.onerror = () => loi(yc.error);
    yc.onblocked = () => loi(new Error('Xinyu đang mở ở thẻ khác với phiên bản cũ; đóng thẻ đó rồi mở lại.'));
  });
  return moSan;
}

async function giaoDich(kho, cheDo, viec) {
  const db = await mo();
  return new Promise((xong, loi) => {
    const gd = db.transaction(kho, cheDo);
    const yc = viec(gd.objectStore(kho));
    gd.oncomplete = () => xong(yc?.result);
    gd.onerror = () => loi(gd.error);
    gd.onabort = () => loi(gd.error);
  });
}

export const doc = (kho, khoa) => giaoDich(kho, 'readonly', (s) => s.get(khoa));
export const xoa = (kho, khoa) => giaoDich(kho, 'readwrite', (s) => s.delete(khoa));
export async function ghi(kho, banGhi) {
  const ban = { ...banGhi, capNhat: new Date().toISOString() };
  await giaoDich(kho, 'readwrite', (s) => s.put(ban));
  return ban;
}

// Xin trình duyệt giữ dữ liệu lâu dài (Safari có thể xóa dữ liệu của trang lâu không mở). Trả về true/false,
// null khi trình duyệt không hỗ trợ.
export async function xinLuuLau() {
  if (!navigator.storage?.persist) return null;
  return (await navigator.storage.persisted()) || navigator.storage.persist();
}
export const daLuuLau = async () => (navigator.storage?.persisted ? navigator.storage.persisted() : null);
