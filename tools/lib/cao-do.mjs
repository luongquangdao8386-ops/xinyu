// Dò cao độ (thuật toán YIN) và nhận dạng hình thanh điệu cho âm thanh mẫu (mục 12.3, 12.4 của đặc tả).
// Chỉ dùng Float32Array, không cần API của Node, để app dùng lại được khi làm đường cao độ (B2).

// Hạ tần số lấy mẫu bằng bộ lọc thông thấp (sinc có cửa sổ Hann) rồi lấy một mẫu trong mỗi `he` mẫu.
function haTanSo(mau, he) {
  if (he <= 1) return mau;
  const nua = 4 * he;
  const loc = [];
  let tong = 0;
  for (let k = -nua; k <= nua; k++) {
    const x = (k / he) * 0.9;
    const w = 0.5 + 0.5 * Math.cos((Math.PI * k) / (nua + 1));
    const h = (k === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)) * w;
    loc.push(h);
    tong += h;
  }
  const ra = new Float32Array(Math.floor(mau.length / he));
  for (let i = 0; i < ra.length; i++) {
    const tam = i * he;
    let s = 0;
    for (let k = -nua; k <= nua; k++) {
      const j = tam + k;
      if (j >= 0 && j < mau.length) s += mau[j] * loc[k + nua];
    }
    ra[i] = s / tong;
  }
  return ra;
}

const trungVi = (ds) => {
  const s = [...ds].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

// Chi phí khi chọn đường cao độ (kiểu Praat): khung vô thanh, đổi giữa có thanh và vô thanh,
// và mỗi quãng tám thay đổi giữa hai khung liền nhau.
const CHI_PHI = { voThanh: 0.45, doiTrangThai: 0.35, quangTam: 2.5 };

// Trả về { buoc (giây), f0: mảng Hz theo từng khung, 0 là khung không có thanh (vô thanh hoặc lặng) }.
// Khung thứ i ứng với thời điểm i × buoc (giây) tính từ đầu tệp.
// Mỗi khung lấy vài ứng viên chu kỳ (cực tiểu của hàm hiệu chuẩn hóa YIN), rồi chọn đường liền mạch nhất
// bằng quy hoạch động: giọng đọc nhanh hay trầm khàn có độ tuần hoàn yếu nên không lọc bằng một ngưỡng cứng.
export function doCaoDo(mau, tanSo, { buoc = 0.01, f0Min = 65, f0Max = 520, nguongLang = 30 } = {}) {
  const he = Math.max(1, Math.floor(tanSo / 8000));
  const x = haTanSo(mau, he);
  const fs = tanSo / he;
  const tauMin = Math.floor(fs / f0Max);
  const tauMax = Math.ceil(fs / f0Min);
  const W = tauMax;
  const hop = buoc * fs;
  const soKhung = Math.max(0, Math.floor((x.length - W - tauMax) / hop) + 1);
  const rms = new Float64Array(soKhung);
  const ungVien = [];
  const d = new Float64Array(tauMax + 2);
  for (let k = 0; k < soKhung; k++) {
    const dau = Math.round(k * hop);
    let e = 0;
    for (let j = 0; j < W; j++) e += x[dau + j] * x[dau + j];
    rms[k] = Math.sqrt(e / W);
    // Hàm hiệu và hàm hiệu chuẩn hóa theo trung bình tích lũy.
    let tichLuy = 0;
    d[0] = 1;
    for (let tau = 1; tau <= tauMax + 1; tau++) {
      let s = 0;
      for (let j = 0; j < W; j++) {
        const h = x[dau + j] - x[dau + j + tau];
        s += h * h;
      }
      tichLuy += s;
      d[tau] = tichLuy ? (s * tau) / tichLuy : 1;
    }
    const uv = [];
    for (let tau = Math.max(2, tauMin); tau <= tauMax; tau++) {
      if (d[tau] >= 0.7 || d[tau] > d[tau - 1] || d[tau] > d[tau + 1]) continue;
      // Nội suy parabol quanh cực tiểu để lấy chu kỳ lẻ.
      const a = d[tau - 1];
      const c = d[tau + 1];
      const mauSo = a - 2 * d[tau] + c;
      const lech = mauSo > 0 ? Math.max(-0.5, Math.min(0.5, (0.5 * (a - c)) / mauSo)) : 0;
      uv.push({ f: fs / (tau + lech), chiPhi: d[tau] });
    }
    ungVien.push(uv.sort((a, b) => a.chiPhi - b.chiPhi).slice(0, 5));
  }
  const maxRms = Math.max(1e-9, ...rms);
  const dB = [...rms].map((r) => 20 * Math.log10(r / maxRms + 1e-12));
  const f0 = chonDuong(ungVien.map((uv, k) => (dB[k] < -nguongLang ? [] : uv)), dB);
  return { buoc, f0: lamSach(f0) };
}

// Quy hoạch động trên các ứng viên; trạng thái cuối mỗi khung là "vô thanh". Khung càng to (gần khung lớn
// nhất) thì càng khó là vô thanh: nguyên âm đọc nhanh hoặc khàn vẫn có thanh dù độ tuần hoàn yếu.
function chonDuong(ungVien, dB) {
  const n = ungVien.length;
  if (!n) return [];
  const trangThai = ungVien.map((uv, k) => [...uv, { f: 0, chiPhi: CHI_PHI.voThanh + 0.3 * Math.max(0, 1 + dB[k] / 20) }]);
  let truoc = trangThai[0].map((s) => s.chiPhi);
  const vet = [trangThai[0].map(() => -1)];
  for (let k = 1; k < n; k++) {
    const hienTai = [];
    const v = [];
    for (const s of trangThai[k]) {
      let tot = Infinity;
      let chon = 0;
      trangThai[k - 1].forEach((p, j) => {
        let c = truoc[j];
        if (!s.f !== !p.f) c += CHI_PHI.doiTrangThai;
        else if (s.f) c += CHI_PHI.quangTam * Math.abs(Math.log2(s.f / p.f));
        if (c < tot) {
          tot = c;
          chon = j;
        }
      });
      hienTai.push(tot + s.chiPhi);
      v.push(chon);
    }
    truoc = hienTai;
    vet.push(v);
  }
  const f0 = new Array(n).fill(0);
  let j = truoc.indexOf(Math.min(...truoc));
  for (let k = n - 1; k >= 0; k--) {
    f0[k] = trangThai[k][j].f;
    j = vet[k][j];
  }
  return f0;
}

// Bỏ đoạn có thanh quá ngắn, làm trơn bằng trung vị 3 khung.
function lamSach(f0) {
  const ra = [...f0];
  for (let i = 0; i < ra.length; ) {
    if (!ra[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j < ra.length && ra[j]) j++;
    const goc = ra.slice(i, j);
    for (let k = i; k < j; k++) ra[k] = j - i < 4 ? 0 : trungVi(goc.slice(Math.max(0, k - i - 1), k - i + 2));
    i = j;
  }
  return ra;
}

// Đổi Hz sang nửa cung so với tần số mốc (cao độ trung bình của giọng).
export const nuaCung = (hz, moc) => 12 * Math.log2(hz / moc);

// Các đoạn có thanh liền nhau [đầu, cuối) theo chỉ số khung; khoảng trống ngắn hơn `noi` khung được nối lại.
export function doanCoThanh(f0, noi = 5) {
  const doan = [];
  for (let i = 0; i < f0.length; i++) {
    if (!f0[i]) continue;
    const cuoi = doan.at(-1);
    if (cuoi && i - cuoi[1] <= noi) cuoi[1] = i + 1;
    else doan.push([i, i + 1]);
  }
  return doan;
}

// Hình đường cao độ của đoạn khung [dau, cuoi): bỏ khung vô thanh, bỏ 10% đầu và cuối (chỗ bắt đầu, kết thúc
// âm thường dao động), đổi sang nửa cung so với mốc rồi lấy trung bình 5 khoảng thời gian đều nhau.
export function hinhDoan(f0, dau, cuoi, moc) {
  const st = f0.slice(dau, cuoi).filter(Boolean).map((h) => nuaCung(h, moc));
  const bo = Math.floor(st.length * 0.1);
  const g = st.slice(bo, st.length - bo);
  if (g.length < 5) return null;
  return Array.from({ length: 5 }, (_, i) => {
    const p = g.slice(Math.floor((i * g.length) / 5), Math.floor(((i + 1) * g.length) / 5));
    return p.reduce((s, v) => s + v, 0) / p.length;
  });
}

// Mẫu hình thanh (nửa cung so với cao độ trung bình của giọng, 5 điểm thời gian trong âm tiết).
// 3: thanh 3 đứng cuối, đủ (xuống rồi lên, 214) hoặc chỉ xuống thấp (21); 3n, 4n: thanh 3, 4 không đứng
// cuối chỉ đọc nửa; 0-1 … 0-4: thanh nhẹ sau thanh 1 … 4.
const MAU = {
  1: [[4, 4, 4, 4, 4]],
  2: [[-2, -3, -1, 2, 4]],
  3: [[-2, -5, -7, -5, -1], [-1, -3, -5, -7, -8]],
  '3n': [[-1, -3, -5, -7, -8]],
  4: [[5, 4, 1, -3, -6]],
  '4n': [[5, 4, 2, 0, -2]],
  '0-1': [[0, -1, -2, -3, -4]],
  '0-2': [[1, 0, -1, -2, -3]],
  '0-3': [[1, 1, 1, 0, -1]],
  '0-4': [[-5, -6, -7, -7, -7]],
};
// Độ lệch (nửa cung) giữa hình đường cao độ và mẫu: chủ yếu so dáng lên xuống, phần chênh mức chung tính nhẹ hơn.
function lechMau(hinh, ma) {
  return Math.min(
    ...MAU[ma].map((m) => {
      const d = hinh.map((v, i) => v - m[i]);
      const o = d.reduce((s, v) => s + v, 0) / d.length;
      return Math.sqrt(d.reduce((s, v) => s + (v - o) ** 2, 0) / d.length) + 0.4 * Math.abs(o);
    }),
  );
}

// Cách đọc thực tế từng âm tiết, từ thanh ghi trong Pinyin hiển thị (5 là thanh nhẹ) và vị trí cuối đoạn
// (trước dấu câu hoặc hết chuỗi): hai thanh 3 liền nhau thì thanh 3 trước đọc thành thanh 2; thanh 3, 4 không
// đứng cuối đoạn chỉ đọc nửa; thanh nhẹ cao thấp theo âm tiết đứng trước. Biến điệu của 一, 不 đã ghi sẵn
// trong Pinyin hiển thị (mục 11.2).
export function cachDocThanh(amTiet) {
  const ma = [];
  amTiet.forEach((a, i) => {
    const sau = a.ketDoan ? null : amTiet[i + 1];
    let t = a.thanh;
    if (t === 3 && sau?.thanh === 3) t = 2;
    if (t === 5) {
      const truoc = ma[i - 1];
      ma.push(`0-${truoc ? truoc.replace(/^0-/, '')[0] : 2}`);
    } else if ((t === 3 || t === 4) && sau) ma.push(`${t}n`);
    else ma.push(String(t));
  });
  return ma;
}

// Chia các khung có thanh thành n đoạn liền nhau ứng với n âm tiết. trongSo: độ dài tương đối dự kiến
// (thanh nhẹ ngắn hơn). Đoạn có thanh thừa thì nối chỗ ngắt ngắn nhất; thiếu thì chia đoạn theo trọng số.
export function chiaAmTiet(f0, trongSo) {
  const n = trongSo.length;
  let doan = doanCoThanh(f0, 3).filter(([a, b]) => b - a >= 4);
  if (!doan.length) return null;
  while (doan.length > n) {
    let k = 0;
    for (let i = 1; i < doan.length - 1; i++) if (doan[i + 1][0] - doan[i][1] < doan[k + 1][0] - doan[k][1]) k = i;
    doan.splice(k, 2, [doan[k][0], doan[k + 1][1]]);
  }
  // Gán số âm tiết cho từng đoạn sao cho tỉ lệ độ dài khớp trọng số nhất (thử mọi cách chia).
  const tongD = doan.reduce((s, [a, b]) => s + b - a, 0);
  const tongW = trongSo.reduce((s, w) => s + w, 0);
  let tot = null;
  const thu = (j, i, nhom, sai) => {
    if (j === doan.length) {
      if (i === n && (!tot || sai < tot.sai)) tot = { nhom: [...nhom], sai };
      return;
    }
    for (let c = 1; i + c <= n - (doan.length - j - 1); c++) {
      const w = trongSo.slice(i, i + c).reduce((s, v) => s + v, 0) / tongW;
      const d = (doan[j][1] - doan[j][0]) / tongD;
      nhom.push(c);
      thu(j + 1, i + c, nhom, sai + (d - w) ** 2);
      nhom.pop();
    }
  };
  thu(0, 0, [], 0);
  if (!tot) return null;
  const ra = [];
  let i = 0;
  doan.forEach(([a, b], j) => {
    const w = trongSo.slice(i, i + tot.nhom[j]);
    const tong = w.reduce((s, v) => s + v, 0);
    let x = a;
    for (const v of w) {
      const y = Math.round(x + ((b - a) * v) / tong);
      ra.push([x, Math.min(b, y)]);
      x = y;
    }
    ra[ra.length - 1][1] = b;
    i += tot.nhom[j];
  });
  return ra;
}

// Lỗi rõ của một âm tiết so với cách đọc dự kiến, xét theo hướng đi của đường cao độ (nửa cung so với mốc):
// thanh 2 phải đi lên ở cuối, thanh 4 phải rơi, thanh 1 phẳng và không thấp… Không bắt lỗi vặt như thanh 2
// võng nhẹ trước khi lên, hay thanh 3 cuối từ không lên lại. Trả về lời mô tả lỗi hoặc null.
export function loiThanh(ma, h) {
  const tb = h.reduce((s, v) => s + v, 0) / h.length;
  const bienDo = Math.max(...h) - Math.min(...h);
  const len = h[4] - Math.min(h[0], h[1], h[2], h[3]);
  const roi = Math.max(h[0], h[1], h[2]) - h[4];
  if (ma === '1') {
    if (bienDo > 3.5) return h[4] > h[0] ? 'thanh 1 đi lên, không phẳng' : 'thanh 1 đi xuống, không phẳng';
    if (tb < -2) return 'thanh 1 quá thấp';
  } else if (ma === '2') {
    if (len < 1.5) return roi > 3 ? 'thanh 2 đi xuống' : 'thanh 2 gần như không lên';
  } else if (ma === '3') {
    if (tb > 2) return 'thanh 3 quá cao';
    if (h[0] > 3 && h[0] - h[4] > 4) return 'thanh 3 rơi từ cao như thanh 4';
    if (h[4] > 3 && h[4] - h[0] > 3) return 'thanh 3 đi lên cao như thanh 2';
  } else if (ma === '3n') {
    if (h[4] - h[0] > 2) return 'nửa thanh 3 lại đi lên';
    if (tb > 2) return 'nửa thanh 3 quá cao';
  } else if (ma === '4' || ma === '4n') {
    if (roi < (ma === '4' ? 3 : 1.5)) return 'thanh 4 không rơi';
  } else if (ma.startsWith('0')) {
    if (tb > 2.5 && bienDo < 2.5) return 'thanh nhẹ đọc cao và phẳng như thanh 1';
    if (h[4] - h[0] > 3) return 'thanh nhẹ đi lên như thanh 2';
    if (ma === '0-4' && tb > 0) return 'thanh nhẹ sau thanh 4 không xuống thấp';
  }
  return null;
}

// Kiểm tra thanh điệu của âm thanh mẫu (âm tiết, từ hoặc câu ngắn) theo Pinyin. amTiet: [{ thanh, ketDoan }].
// Trả về mảng, mỗi âm tiết { duKien, nghe (mẫu khớp nhất, để tham khảo), loi (lời mô tả lỗi rõ hoặc null),
// lech (độ lệch so với mẫu dự kiến, nửa cung), hinh }, hoặc null khi không tách được âm tiết. Chỉ để chọn bản đọc và lọc tệp cần nghe lại, không thay việc
// nghe duyệt.
export function kiemTraThanh(f0, moc, amTiet) {
  const duKien = cachDocThanh(amTiet);
  const doan = chiaAmTiet(f0, duKien.map((m) => (m.startsWith('0') ? 0.6 : 1)));
  if (!doan) return null;
  return duKien.map((ma, i) => {
    const hinh = hinhDoan(f0, doan[i][0], doan[i][1], moc);
    if (!hinh) return { duKien: ma, nghe: null, loi: null, lech: 0, hinh };
    const cuoi = amTiet[i].ketDoan || i === amTiet.length - 1;
    const ungVien = new Set([...(cuoi ? ['1', '2', '3', '4'] : ['1', '2', '3n', '4n']), ma]);
    if (i > 0) ungVien.add(`0-${duKien[i - 1].replace(/^0-/, '')[0]}`);
    const lech = Object.fromEntries([...ungVien].map((m) => [m, lechMau(hinh, m)]));
    const nghe = Object.keys(lech).sort((a, b) => lech[a] - lech[b])[0];
    return { duKien: ma, nghe, loi: loiThanh(ma, hinh), lech: lech[ma], hinh };
  });
}
