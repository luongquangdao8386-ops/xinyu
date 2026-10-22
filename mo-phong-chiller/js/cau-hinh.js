// Cấu hình chung: phiên bản thư viện, bảng màu chú giải, vị trí thiết bị, cỡ ống, cao độ tuyến ống.
// Muốn dời thiết bị hoặc đổi màu thì sửa ở đây trước. Các tuyến ống tính từ đầu nối của thiết bị
// (xem js/duong-ong.js), nên dời thiết bị xong cần xem lại các điểm gấp khúc ghi trong tệp đó.

export const PHIEN_BAN_THREE = '0.186.1';

// Bảng màu chú giải (dùng cho ống ở chế độ màu môi chất, hạt dòng chảy, mũi tên và bảng chú giải).
export const MAU = {
  nuocLanhCap: '#1d4fbf', // nước lạnh cấp: xanh dương đậm
  nuocLanhHoi: '#79b8f2', // nước lạnh hồi: xanh dương nhạt
  nuocVaoNgung: '#12a89c', // nước từ tháp vào bình ngưng: xanh ngọc
  nuocRaNgung: '#ef7b1f', // nước nóng từ bình ngưng về tháp: cam
  hoiHaAp: '#7b55c7', // môi chất: hơi hạ áp về máy nén
  hoiCaoAp: '#c9303c', // môi chất: hơi cao áp quá nhiệt sau máy nén
  longCaoAp: '#a3366f', // môi chất: lỏng cao áp sau bình ngưng
  haiPha: '#b7a1ee', // môi chất: lỏng – hơi hạ áp sau van tiết lưu
  dau: '#8a7428', // dầu bôi trơn hồi về máy nén
  nuocBu: '#5f8fa8', // nước cấp bù cho tháp
  khiNong: '#f0a050', // không khí hồi vào AHU (trước dàn coil)
  khiLanh: '#62b9f0', // không khí cấp sau dàn coil
  khiThap: '#9fb3c2', // không khí đi qua tháp giải nhiệt
  noiBat: '#ffc21a', // làm nổi bật thiết bị đang chọn
};

// Tên hiển thị của từng loại lưu chất (bảng chú giải, nhãn ống).
export const TEN_LUU_CHAT = {
  nuocLanhCap: 'Nước lạnh cấp',
  nuocLanhHoi: 'Nước lạnh hồi',
  nuocVaoNgung: 'Nước từ tháp vào bình ngưng',
  nuocRaNgung: 'Nước nóng từ bình ngưng về tháp',
  hoiHaAp: 'Hơi hạ áp (đường hút)',
  hoiCaoAp: 'Hơi cao áp quá nhiệt (đường đẩy)',
  longCaoAp: 'Lỏng cao áp (đường lỏng)',
  haiPha: 'Lỏng – hơi hạ áp sau tiết lưu',
  dau: 'Dầu hồi về máy nén',
  nuocBu: 'Nước cấp bù',
};

// Ba mạch riêng biệt; mỗi tuyến ống thuộc đúng một mạch.
export const MACH = {
  nuocLanh: { ten: 'Mạch nước lạnh', luuChat: ['nuocLanhCap', 'nuocLanhHoi'] },
  giaiNhiet: { ten: 'Mạch nước giải nhiệt', luuChat: ['nuocVaoNgung', 'nuocRaNgung', 'nuocBu'] },
  moiChat: { ten: 'Mạch môi chất', luuChat: ['hoiHaAp', 'hoiCaoAp', 'longCaoAp', 'haiPha', 'dau'] },
};

// Vị trí thiết bị trên nền (mét). Trục X sang phải, Z về phía người xem, Y hướng lên.
// xoay: góc quay quanh trục đứng (radian).
export const VI_TRI = {
  chiller: { x: 0, z: 0 },
  bomNuocLanh: { x: -4.4, z: 2.6, xoay: Math.PI / 2 },
  bomGiaiNhiet: { x: -4.4, z: -2.6, xoay: -Math.PI / 2 },
  thap: { x: -4.4, z: -7.0 },
  ahu: { x: -7.6, z: 4.8 },
  binhGianNo: { x: -3.1, z: 4.3 },
};

export const CAO_BE_CHILLER = 0.15; // bệ bê tông dưới cụm chiller

// Cỡ ống: r là bán kính ngoài ống thép (m), baoOn là chiều dày bảo ôn.
export const ONG = {
  nuocLanh: { r: 0.084, baoOn: 0.04, ten: 'DN150' },
  giaiNhiet: { r: 0.1095, baoOn: 0, ten: 'DN200' },
  bypass: { r: 0.0445, baoOn: 0.03, ten: 'DN80' },
  gianNo: { r: 0.0167, baoOn: 0, ten: 'DN25' },
  nuocBu: { r: 0.0167, baoOn: 0, ten: 'DN25' },
};

// Cao độ tâm ống (m, tính từ mặt sàn).
export const CAO_DO = {
  ongTren: 3.0, // tuyến nước lạnh cấp và nước nóng về tháp đi trên cao
  ongDayBom: 2.1, // tuyến đẩy của bơm vòng qua phía trên động cơ
  tamTrucBom: 0.62, // tâm trục bơm = tâm cửa hút
};

// Camera mặc định: nhìn tổng thể từ trên xuống khoảng 35°.
export const CAMERA = {
  tamNhin: [-3.3, 1.0, -0.8],
  gocCao: 35, // độ, so với mặt sàn
  gocPhuong: 38, // độ, từ trục +Z quay sang +X
  khoangCach: 25,
};
