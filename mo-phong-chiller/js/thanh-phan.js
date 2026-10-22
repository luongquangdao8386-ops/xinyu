// Sổ đăng ký thành phần: mỗi bộ phận chọn được có mã, tên, mô tả chức năng và vật thể 3D.
// Dùng cho cây cấu tạo, chọn bằng chuột, ẩn/hiện và phóng gần.

export const thanhPhan = new Map();

// dangKy('bbh', vatThe, { ten, cha, chucNang, cauTao, the })
// the: số hiệu thiết bị (CH-01…), chỉ ghi cho thiết bị chính.
export function dangKy(ma, vatThe, { ten, cha = null, chucNang = '', cauTao = '', the = '', thongSo = null }) {
  vatThe.userData.ma = ma;
  vatThe.name = vatThe.name || ten;
  const muc = { ma, ten, cha, chucNang, cauTao, the, thongSo, vatThe, con: [] };
  thanhPhan.set(ma, muc);
  if (cha && thanhPhan.has(cha)) thanhPhan.get(cha).con.push(ma);
  return vatThe;
}

// Thành phần gần nhất chứa vật thể (đi ngược lên cây cảnh).
export function timThanhPhan(obj) {
  for (let o = obj; o; o = o.parent) if (o.userData?.ma && thanhPhan.has(o.userData.ma)) return thanhPhan.get(o.userData.ma);
  return null;
}

export const goc = () => [...thanhPhan.values()].filter((m) => !m.cha);

export function chuoiCha(ma) {
  const out = [];
  for (let m = thanhPhan.get(ma); m; m = m.cha ? thanhPhan.get(m.cha) : null) out.unshift(m);
  return out;
}
