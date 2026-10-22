// Mô hình nhiệt giả lập minh họa (không phụ thuộc Three.js, chạy được trong Node để kiểm thử).
// Cân bằng năng lượng gộp cho từng mạch nước, tháp giải nhiệt theo hiệu suất so với bầu ướt,
// nhiệt độ bay hơi/ngưng theo độ chênh tiếp cận, áp suất theo bảng bão hòa R134a.
// Giá trị chỉ để minh họa quan hệ giữa các đại lượng, không dùng cho thiết kế.

export const THIET_KE = {
  qLanh: 880, // kW, công suất lạnh định mức (khoảng 250 RT)
  pDien: 160, // kW, điện máy nén ở đầy tải
  luuLuongNL: 151, // m³/h, nước lạnh (Δt 5 K ở đầy tải)
  luuLuongGN: 190, // m³/h, nước giải nhiệt
  tCapDat: 7.0, // °C, điểm đặt nước lạnh cấp
  tBauUot: 27.0, // °C, nhiệt độ bầu ướt ngoài trời
  tKhiHoi: 26.0, // °C, không khí hồi vào AHU
  tPhong: 28.0, // °C, nhiệt độ phòng máy (nước đứng yên tiến dần về giá trị này)
  epsQuat: 0.61, // hiệu suất tháp khi quạt chạy: (t vào tháp − t ra tháp)/(t vào tháp − t bầu ướt)
  epsTuNhien: 0.12, // hiệu suất tháp khi quạt dừng (gió tự nhiên)
  tau: 6, // s, hằng số thời gian của nước trong ống (giả lập thu nhỏ để thấy thay đổi nhanh)
  tauThap: 12, // s, bể tháp
  cotApNL: 3.2, cotApGN: 2.6, // bar, cột áp bơm ở 100 % tốc độ
  apTinhNL: 2.0, apTinhGN: 0.3, // bar, áp tĩnh tại cửa hút
  c: 4.186, // kJ/(kg·K)
};

// Áp suất bão hòa R134a, bar tuyệt đối.
const R134A = [[-10, 2.006], [-5, 2.433], [0, 2.928], [5, 3.497], [10, 4.146], [15, 4.884], [20, 5.717], [25, 6.654],
  [30, 7.702], [35, 8.87], [40, 10.166], [45, 11.599], [50, 13.179], [55, 14.915], [60, 16.818], [70, 21.17]];
export function apBaoHoa(t) {
  if (t <= R134A[0][0]) return R134A[0][1];
  for (let i = 1; i < R134A.length; i++) {
    const [t1, p1] = R134A[i];
    if (t <= t1) {
      const [t0, p0] = R134A[i - 1];
      return Math.exp(Math.log(p0) + ((Math.log(p1) - Math.log(p0)) * (t - t0)) / (t1 - t0));
    }
  }
  return R134A.at(-1)[1];
}
export const apKe = (t) => apBaoHoa(t) - 1.013; // bar g

export function taoTrangThaiNhiet(T = THIET_KE) {
  return {
    tCapNL: 13.5, tHoiNL: 13.8, // nước lạnh ra/vào bình bay hơi
    tVaoNg: 29.0, tRaNg: 29.2, // nước giải nhiệt vào/ra bình ngưng
    tBayHoi: 13.0, tNgung: 29.5, // nhiệt độ bão hòa môi chất
    qMay: 0, pDien: 0, qAHU: 0, van3: 0, cop: 0,
    T,
  };
}

const keo = (x, dich, dt, tau) => x + (dich - x) * Math.min(1, dt / tau);
const kep = (x, a, b) => Math.max(a, Math.min(b, x));

// vao: { qNL, qGN (m³/h), quat (0..1), mayNen (0..1), vanTruot (0.25..1), taiAHU (0..1, nhu cầu) }
export function buocNhiet(s, vao, dt) {
  const T = s.T;
  const mNL = (vao.qNL * 1000) / 3600; // kg/s
  const mGN = (vao.qGN * 1000) / 3600;
  const coNL = mNL > 1, coGN = mGN > 1;

  // Máy nén
  const tai = vao.mayNen * vao.vanTruot;
  let qMay = 0, pDien = 0;
  if (vao.mayNen > 0.02) {
    qMay = T.qLanh * tai * (1 + 0.025 * (s.tBayHoi - 5)) * (1 - 0.012 * (s.tNgung - 37));
    qMay = Math.max(0, qMay);
    pDien = T.pDien * vao.mayNen * (0.2 + 0.8 * vao.vanTruot) * (1 + 0.025 * (s.tNgung - s.tBayHoi - 32));
  }

  // AHU: công suất dàn coil phụ thuộc nhiệt độ nước cấp và lưu lượng; van ba ngả chia nước theo nhu cầu.
  const qCan = vao.taiAHU * T.qLanh;
  const qCoilMax = coNL ? 1.15 * T.qLanh * Math.max(0, T.tKhiHoi - s.tCapNL) / (T.tKhiHoi - T.tCapDat) * Math.sqrt(Math.min(1.2, mNL / ((T.luuLuongNL * 1000) / 3600))) : 0;
  const qAHU = Math.min(qCan, qCoilMax);
  const van3 = qCoilMax > 0 ? kep(qAHU / qCoilMax, 0, 1) : 0;

  // Mạch nước lạnh
  if (coNL) {
    s.tCapNL = keo(s.tCapNL, s.tHoiNL - qMay / (T.c * mNL), dt, T.tau);
    s.tHoiNL = keo(s.tHoiNL, s.tCapNL + (qAHU + 4) / (T.c * mNL), dt, T.tau);
  } else {
    s.tCapNL = keo(s.tCapNL, T.tPhong, dt, 400);
    s.tHoiNL = keo(s.tHoiNL, T.tPhong, dt, 400);
  }

  // Mạch nước giải nhiệt và tháp
  const qNgung = vao.mayNen > 0.02 ? qMay + pDien : 0;
  const eps = T.epsTuNhien + (T.epsQuat - T.epsTuNhien) * vao.quat;
  if (coGN) {
    s.tRaNg = keo(s.tRaNg, s.tVaoNg + qNgung / (T.c * mGN), dt, T.tau);
    s.tVaoNg = keo(s.tVaoNg, s.tRaNg - eps * (s.tRaNg - T.tBauUot), dt, T.tauThap);
  } else {
    s.tRaNg = keo(s.tRaNg, T.tBauUot + 2, dt, 300);
    s.tVaoNg = keo(s.tVaoNg, T.tBauUot + 2 - eps * 2, dt, 300);
  }

  // Môi chất: nhiệt độ bay hơi bám theo nước lạnh ra, nhiệt độ ngưng bám theo nước giải nhiệt ra.
  if (vao.mayNen > 0.02) {
    const tBH = coNL ? s.tCapNL - (0.8 + 1.4 * tai) : s.tBayHoi - 0.5 * 3;
    const tNG = coGN ? s.tRaNg + (0.8 + 1.4 * tai) : s.tNgung + 0.8 * 3;
    s.tBayHoi = keo(s.tBayHoi, tBH, dt, 3);
    s.tNgung = keo(s.tNgung, tNG, dt, 3);
  } else {
    s.tBayHoi = keo(s.tBayHoi, (s.tCapNL + s.tHoiNL) / 2, dt, 25);
    s.tNgung = keo(s.tNgung, (s.tVaoNg + s.tRaNg) / 2, dt, 25);
  }

  Object.assign(s, { qMay, pDien, qAHU, van3, qNgung, cop: pDien > 1 ? qMay / pDien : 0 });
  return s;
}

// Các đại lượng suy ra để hiển thị và cho đồng hồ.
export function daiLuongPhu(s, vao) {
  const T = s.T;
  const chay = vao.mayNen > 0.02;
  const nNL = vao.qNL / T.luuLuongNL, nGN = vao.qGN / T.luuLuongGN;
  const pDayNL = T.apTinhNL + T.cotApNL * nNL * nNL;
  const pDayGN = T.apTinhGN + T.cotApGN * nGN * nGN;
  return {
    pBayHoi: apKe(s.tBayHoi), pNgung: apKe(s.tNgung),
    tHut: s.tBayHoi + (chay ? 1.0 : 0), tDay: chay ? s.tNgung + 20 + 8 * (1 - vao.vanTruot) : s.tNgung,
    tLong: chay ? s.tNgung - 3 : s.tNgung,
    pDau: chay ? apKe(s.tNgung) - 0.35 : apKe(s.tNgung),
    pHutBomNL: T.apTinhNL, pDayBomNL: pDayNL, pVaoBBH: pDayNL - 0.3 * nNL * nNL, pRaBBH: pDayNL - 0.9 * nNL * nNL,
    pHutBomGN: Math.max(0.05, T.apTinhGN - 0.15 * nGN * nGN), pDayBomGN: pDayGN, pVaoBN: pDayGN - 0.25 * nGN * nGN, pRaBN: pDayGN - 0.75 * nGN * nGN,
  };
}
