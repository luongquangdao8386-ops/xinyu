// Kiểm thử mô hình nhiệt và liên động vận hành (chạy: node --test kiem-thu/*.test.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import { apBaoHoa, THIET_KE } from '../js/mo-hinh-nhiet.js';
import { VanHanh } from '../js/van-hanh.js';

const chay = (vh, giay) => { for (let t = 0; t < giay; t += 1) vh.capNhat(1); };
const gan = (x, y, sai, ten) => assert.ok(Math.abs(x - y) <= sai, `${ten}: ${x.toFixed(2)} khác ${y} quá ${sai}`);

test('bảng bão hòa R134a', () => {
  gan(apBaoHoa(0), 2.928, 0.01, 'P(0 °C)');
  gan(apBaoHoa(40), 10.166, 0.01, 'P(40 °C)');
  gan(apBaoHoa(37.5), 9.5, 0.1, 'P(37,5 °C) nội suy');
});

test('đầy tải: nước lạnh 7/12 °C, giải nhiệt 30/35 °C, cân bằng năng lượng', () => {
  const vh = new VanHanh();
  vh.datTai(1);
  vh.chayTatCa();
  chay(vh, 900);
  const s = vh.so;
  assert.equal(s.ttMN, 'chay');
  gan(s.tCapNL, 7, 0.6, 'nước lạnh cấp');
  gan(s.tHoiNL, 12, 0.8, 'nước lạnh hồi');
  gan(s.tVaoNg, 30, 0.8, 'nước vào bình ngưng');
  gan(s.tRaNg, 35, 0.8, 'nước ra bình ngưng');
  gan(s.qMay, s.qAHU, 0.05 * THIET_KE.qLanh, 'công suất chiller = tải AHU');
  assert.ok(s.cop > 4.5 && s.cop < 6.5, `COP ${s.cop}`);
  assert.ok(s.pNgung > s.pBayHoi + 4, 'áp ngưng cao hơn áp bay hơi');
});

test('non tải: van trượt giảm, vẫn giữ nước cấp gần 7 °C', () => {
  const vh = new VanHanh();
  vh.datTai(0.4);
  vh.chayTatCa();
  chay(vh, 900);
  assert.ok(vh.so.vanTruot < 0.6, `van trượt ${vh.so.vanTruot}`);
  gan(vh.so.tCapNL, 7, 0.7, 'nước lạnh cấp');
});

test('máy nén chỉ chạy khi cả hai mạch có lưu lượng', () => {
  const vh = new VanHanh();
  vh.datBat('bomGN', true);
  vh.datBat('quatThap', true);
  vh.datBat('mayNen', true);
  chay(vh, 30);
  assert.equal(vh.so.ttMN, 'cho-luu-luong');
  assert.equal(vh.so.nMayNen, 0);
  assert.match(vh.so.thongBao.map((t) => t.chu).join(' '), /bơm nước lạnh đang dừng/);
  vh.datBat('bomNL', true);
  chay(vh, 15);
  assert.equal(vh.so.ttMN, 'chay');
});

test('bơm dừng khi đang chạy: máy nén ngừng, chờ lưu lượng rồi tự chạy lại', () => {
  const vh = new VanHanh();
  vh.chayTatCa();
  chay(vh, 120);
  assert.equal(vh.so.ttMN, 'chay');
  vh.datBat('bomGN', false);
  chay(vh, 5);
  assert.equal(vh.so.ttMN, 'cho-luu-luong');
  chay(vh, 3);
  assert.ok(vh.so.nMayNen < 0.01, 'động cơ máy nén đã dừng');
  assert.match(vh.so.thongBao.map((t) => t.chu).join(' '), /chờ lưu lượng/i);
  vh.datBat('bomGN', true);
  chay(vh, 15);
  assert.equal(vh.so.ttMN, 'chay');
});

test('tốc độ bơm thấp hơn mức tối thiểu: công tắc dòng chảy không đóng', () => {
  const vh = new VanHanh();
  vh.datTocDo('bomNL', 0.4);
  vh.chayTatCa();
  chay(vh, 30);
  assert.equal(vh.so.ttMN, 'cho-luu-luong');
  assert.match(vh.so.thongBao.map((t) => t.chu).join(' '), /lưu lượng nước lạnh mới đạt 40 %/);
});

test('quạt tháp dừng: áp suất ngưng tăng tới khi giảm tải hoặc dừng bảo vệ; đặt lại được', () => {
  const vh = new VanHanh();
  vh.datTai(1);
  vh.chayTatCa();
  chay(vh, 300);
  const p0 = vh.so.pNgung;
  vh.datBat('quatThap', false);
  let thayHanChe = false;
  for (let t = 0; t < 900 && vh.so.ttMN !== 'bao-ve'; t++) { vh.capNhat(1); thayHanChe ||= vh.so.hanCheTai; }
  assert.ok(vh.so.pNgung > p0 + 1, 'áp ngưng tăng');
  assert.ok(thayHanChe || vh.so.ttMN === 'bao-ve', 'có giảm tải hoặc dừng bảo vệ');
  vh.datBat('quatThap', true);
  chay(vh, 200);
  vh.datLai();
  chay(vh, 30);
  assert.notEqual(vh.so.ttMN, 'bao-ve');
});
