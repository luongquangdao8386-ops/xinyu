// Trạng thái vận hành: lệnh bật/tắt từng thiết bị, liên động lưu lượng, trình tự khởi động máy nén,
// điều khiển van trượt theo nhiệt độ nước lạnh cấp, bảo vệ áp suất. Gọi mô hình nhiệt ở js/mo-hinh-nhiet.js.
// Không phụ thuộc Three.js.

import { THIET_KE, taoTrangThaiNhiet, buocNhiet, daiLuongPhu } from './mo-hinh-nhiet.js';

export const NGUONG = {
  luuLuongToiThieu: 0.5, // phần lưu lượng thiết kế để công tắc dòng chảy đóng
  xacNhanLuuLuong: 3, // s, công tắc phải đóng liên tục trước khi cho phép khởi động
  khoiDong: 3, // s, khởi động sao – tam giác
  tDungTai: 5.0, tChayLai: 8.0, // °C, dừng chờ tải khi nước cấp quá lạnh và chạy lại
  pHanCheTai: 10.3, pBaoVe: 11.5, // bar g, áp suất ngưng
  tBayHoiThap: 1.0, // °C, bảo vệ chống đóng băng
};

const TEN_TT_MN = {
  tat: 'Tắt', 'cho-luu-luong': 'Chờ lưu lượng', 'xac-nhan': 'Xác nhận lưu lượng', 'khoi-dong': 'Đang khởi động',
  chay: 'Đang chạy', 'cho-tai': 'Dừng chờ tải', 'bao-ve': 'Dừng bảo vệ',
};

const tienDen = (x, dich, toc, dt) => (x < dich ? Math.min(dich, x + toc * dt) : Math.max(dich, x - toc * dt));

export class VanHanh {
  constructor() {
    this.dk = {
      bomNL: { bat: false, tocDo: 1 }, bomGN: { bat: false, tocDo: 1 }, quatThap: { bat: false }, mayNen: { bat: false },
      taiAHU: 0.8, // nhu cầu lạnh của AHU (phần công suất định mức)
    };
    this.n = { bomNL: 0, bomGN: 0, quat: 0, mayNen: 0, quatAHU: 0 }; // tốc độ thực (0..1)
    this.ttMN = 'tat';
    this.hen = 0; // bộ đếm thời gian của bước hiện tại
    this.vanTruot = 0.25;
    this.ctNL = false; this.ctGN = false; // công tắc dòng chảy
    this.dongNL = 0; this.dongGN = 0; // thời gian công tắc đóng liên tục
    this.loi = null;
    this.hanCheTai = false;
    this.nhiet = taoTrangThaiNhiet();
    this.thoiGian = 0;
    this.so = {};
    this.tinhSo();
  }

  // Lệnh từ giao diện
  datBat(thietBi, bat) {
    this.dk[thietBi].bat = bat;
    if (thietBi === 'mayNen' && !bat && this.ttMN === 'bao-ve') this.loi = null;
  }
  datTocDo(bom, x) { this.dk[bom].tocDo = Math.max(0.3, Math.min(1, x)); }
  datTai(x) { this.dk.taiAHU = Math.max(0, Math.min(1, x)); }
  datLai() { if (this.ttMN === 'bao-ve') { this.loi = null; this.ttMN = this.dk.mayNen.bat ? 'cho-luu-luong' : 'tat'; this.hen = 0; } }
  chayTatCa() { for (const k of ['bomNL', 'bomGN', 'quatThap', 'mayNen']) this.dk[k].bat = true; if (this.dk.taiAHU < 0.1) this.dk.taiAHU = 0.8; this.datLai(); }
  dungTatCa() { for (const k of ['bomNL', 'bomGN', 'quatThap', 'mayNen']) this.dk[k].bat = false; }

  capNhat(dt) {
    // Bước nhỏ để mô hình ổn định khi tăng tốc thời gian
    let con = dt;
    while (con > 1e-6) {
      const h = Math.min(0.1, con);
      this.buoc(h);
      con -= h;
    }
    this.tinhSo();
  }

  buoc(dt) {
    const T = THIET_KE, d = this.dk, n = this.n;
    this.thoiGian += dt;
    n.bomNL = tienDen(n.bomNL, d.bomNL.bat ? d.bomNL.tocDo : 0, 0.5, dt);
    n.bomGN = tienDen(n.bomGN, d.bomGN.bat ? d.bomGN.tocDo : 0, 0.5, dt);
    n.quat = tienDen(n.quat, d.quatThap.bat ? 1 : 0, 0.3, dt);
    n.quatAHU = tienDen(n.quatAHU, d.taiAHU > 0.001 ? 1 : 0, 0.4, dt);

    // Công tắc dòng chảy (theo lưu lượng thực)
    this.ctNL = n.bomNL >= NGUONG.luuLuongToiThieu - 1e-6;
    this.ctGN = n.bomGN >= NGUONG.luuLuongToiThieu - 1e-6;
    this.dongNL = this.ctNL ? this.dongNL + dt : 0;
    this.dongGN = this.ctGN ? this.dongGN + dt : 0;
    const coLuuLuong = this.ctNL && this.ctGN;
    const daXacNhan = this.dongNL >= NGUONG.xacNhanLuuLuong && this.dongGN >= NGUONG.xacNhanLuuLuong;

    // Trình tự máy nén
    const nt = this.nhiet;
    this.hen += dt;
    const sang = (tt) => { this.ttMN = tt; this.hen = 0; };
    switch (this.ttMN) {
      case 'tat':
        if (d.mayNen.bat) sang('cho-luu-luong');
        break;
      case 'cho-luu-luong':
      case 'xac-nhan':
        if (!d.mayNen.bat) { sang('tat'); break; }
        if (!coLuuLuong) { if (this.ttMN !== 'cho-luu-luong') sang('cho-luu-luong'); break; }
        if (this.ttMN === 'cho-luu-luong') sang('xac-nhan');
        if (daXacNhan) {
          if (nt.tCapNL < NGUONG.tChayLai && nt.tHoiNL < NGUONG.tChayLai) sang('cho-tai');
          else { sang('khoi-dong'); this.vanTruot = 0.25; }
        }
        break;
      case 'khoi-dong':
        if (!d.mayNen.bat) { sang('tat'); break; }
        if (!coLuuLuong) { sang('cho-luu-luong'); break; }
        if (this.hen >= NGUONG.khoiDong) sang('chay');
        break;
      case 'chay':
        if (!d.mayNen.bat) { sang('tat'); break; }
        if (!coLuuLuong) { sang('cho-luu-luong'); break; }
        if (nt.tCapNL < NGUONG.tDungTai && this.vanTruot <= 0.26) { sang('cho-tai'); break; }
        break;
      case 'cho-tai':
        if (!d.mayNen.bat) { sang('tat'); break; }
        if (!coLuuLuong) { sang('cho-luu-luong'); break; }
        if (nt.tCapNL > NGUONG.tChayLai) { sang('khoi-dong'); this.vanTruot = 0.25; }
        break;
      case 'bao-ve':
        if (!d.mayNen.bat) sang('tat');
        break;
    }

    // Tốc độ động cơ máy nén và van trượt
    const chayMay = this.ttMN === 'khoi-dong' || this.ttMN === 'chay';
    n.mayNen = tienDen(n.mayNen, chayMay ? 1 : 0, chayMay ? 0.45 : 0.8, dt);
    const pNg = daiLuongPhu(nt, this.vaoNhiet()).pNgung;
    this.hanCheTai = this.ttMN === 'chay' && pNg > NGUONG.pHanCheTai;
    if (this.ttMN === 'chay') {
      const sai = nt.tCapNL - T.tCapDat;
      let toc = Math.max(-0.06, Math.min(0.05, 0.04 * sai));
      if (this.hanCheTai) toc = Math.min(toc, -0.03);
      this.vanTruot = Math.max(0.25, Math.min(1, this.vanTruot + toc * dt));
    } else if (!chayMay) {
      this.vanTruot = tienDen(this.vanTruot, 0.25, 0.2, dt);
    }

    buocNhiet(nt, this.vaoNhiet(), dt);

    // Bảo vệ
    if (chayMay) {
      const p = daiLuongPhu(nt, this.vaoNhiet()).pNgung;
      if (p > NGUONG.pBaoVe) { this.loi = `Áp suất ngưng ${p.toFixed(1).replace('.', ',')} bar vượt ngưỡng bảo vệ ${String(NGUONG.pBaoVe).replace('.', ',')} bar`; sang('bao-ve'); }
      else if (nt.tBayHoi < NGUONG.tBayHoiThap) { this.loi = `Nhiệt độ bay hơi ${nt.tBayHoi.toFixed(1).replace('.', ',')} °C dưới ngưỡng chống đóng băng`; sang('bao-ve'); }
    }
  }

  vaoNhiet() {
    const T = THIET_KE, n = this.n;
    return {
      qNL: n.bomNL * T.luuLuongNL, qGN: n.bomGN * T.luuLuongGN, quat: n.quat,
      mayNen: n.mayNen, vanTruot: this.vanTruot, taiAHU: this.dk.taiAHU * n.quatAHU,
    };
  }

  // Bảng số liệu cho giao diện, đồng hồ và hoạt ảnh
  tinhSo() {
    const vao = this.vaoNhiet(), nt = this.nhiet, phu = daiLuongPhu(nt, vao);
    const qMC = this.n.mayNen * (0.3 + 0.7 * this.vanTruot);
    this.so = {
      ...phu,
      tCapNL: nt.tCapNL, tHoiNL: nt.tHoiNL, tVaoNg: nt.tVaoNg, tRaNg: nt.tRaNg, tBayHoi: nt.tBayHoi, tNgung: nt.tNgung,
      qNL: vao.qNL, qGN: vao.qGN, qNLCoil: vao.qNL * nt.van3, qNLBypass: vao.qNL * (1 - nt.van3),
      qMC, qDau: this.n.mayNen * 0.3, qBu: this.n.bomGN > 0.1 ? 0.25 * this.n.quat + 0.05 : 0,
      van3: nt.van3, vanTruot: this.vanTruot, exv: this.n.mayNen > 0.02 ? 15 + 70 * this.vanTruot * this.n.mayNen : 0,
      qMay: nt.qMay, qAHU: nt.qAHU, qCan: this.dk.taiAHU * THIET_KE.qLanh * this.n.quatAHU, pDien: nt.pDien, cop: nt.cop,
      nBomNL: this.n.bomNL, nBomGN: this.n.bomGN, nQuat: this.n.quat, nMayNen: this.n.mayNen, nQuatAHU: this.n.quatAHU,
      ttMN: this.ttMN, tenTTMN: TEN_TT_MN[this.ttMN], ctNL: this.ctNL, ctGN: this.ctGN, loi: this.loi, hanCheTai: this.hanCheTai,
      thongBao: this.thongBao(),
    };
  }

  // Giải thích trạng thái bằng lời
  thongBao() {
    const d = this.dk, n = this.n, nt = this.nhiet;
    const ds = [];
    const pt = (x) => `${Math.round(x * 100)} %`;
    if (this.ttMN === 'bao-ve') ds.push({ muc: 'loi', chu: `Máy nén dừng bảo vệ: ${this.loi}. Khắc phục nguyên nhân rồi bấm “Đặt lại báo lỗi”.` });
    if (d.mayNen.bat && this.ttMN === 'cho-luu-luong') {
      const thieu = [];
      if (!this.ctNL) thieu.push(d.bomNL.bat ? `lưu lượng nước lạnh mới đạt ${pt(n.bomNL)} thiết kế, cần tối thiểu ${pt(NGUONG.luuLuongToiThieu)}` : 'bơm nước lạnh đang dừng nên công tắc dòng chảy bình bay hơi hở');
      if (!this.ctGN) thieu.push(d.bomGN.bat ? `lưu lượng nước giải nhiệt mới đạt ${pt(n.bomGN)} thiết kế, cần tối thiểu ${pt(NGUONG.luuLuongToiThieu)}` : 'bơm giải nhiệt đang dừng nên công tắc dòng chảy bình ngưng hở');
      ds.push({ muc: 'cho', chu: `Máy nén chờ lưu lượng: ${thieu.join('; ')}. Máy nén chỉ chạy khi cả hai mạch nước có lưu lượng.` });
    }
    if (this.ttMN === 'xac-nhan') ds.push({ muc: 'cho', chu: `Hai công tắc dòng chảy đã đóng, đang xác nhận lưu lượng ổn định (${NGUONG.xacNhanLuuLuong} giây) trước khi khởi động.` });
    if (this.ttMN === 'khoi-dong') ds.push({ muc: 'cho', chu: 'Máy nén khởi động sao – tam giác, van trượt giữ ở 25 % để giảm dòng khởi động.' });
    if (this.ttMN === 'cho-tai') ds.push({ muc: 'cho', chu: `Nước lạnh cấp ${nt.tCapNL.toFixed(1).replace('.', ',')} °C đã thấp hơn mức cần. Máy nén tạm dừng và tự chạy lại khi nước cấp lên trên ${String(NGUONG.tChayLai).replace('.', ',')} °C.` });
    if (this.hanCheTai) ds.push({ muc: 'cho', chu: 'Áp suất ngưng cao: bộ điều khiển đang giảm tải máy nén để tránh dừng bảo vệ.' });
    if (n.mayNen > 0.5 && !d.quatThap.bat) ds.push({ muc: 'cho', chu: 'Quạt tháp đang dừng: tháp chỉ giải nhiệt nhờ gió tự nhiên, nước vào bình ngưng nóng dần và áp suất ngưng tăng.' });
    if (this.ttMN === 'chay' && d.taiAHU < 0.25) ds.push({ muc: 'tin', chu: 'Tải AHU thấp: van ba ngả cho phần lớn nước đi qua nhánh bypass, máy nén giảm tải về mức tối thiểu.' });
    if (!ds.length && this.ttMN === 'chay') ds.push({ muc: 'tin', chu: 'Hệ đang chạy ổn định. Van trượt điều chỉnh công suất để giữ nước lạnh cấp 7 °C.' });
    if (!ds.length && !d.mayNen.bat) ds.push({ muc: 'tin', chu: 'Máy nén tắt. Chạy bơm nước lạnh, bơm giải nhiệt và quạt tháp, rồi bật máy nén (hoặc bấm “Chạy toàn hệ thống”).' });
    return ds;
  }
}
