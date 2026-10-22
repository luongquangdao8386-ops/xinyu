// Kiểm tra mô phỏng trong trình duyệt thật (Chromium qua Playwright) và chụp ảnh bàn giao vào anh/.
// Chạy: node kiem-thu/kiem-tra-trinh-duyet.mjs   (cần gói playwright và Chromium)
// Kiểm tra: mô hình hiển thị, không lỗi JavaScript, đầu ống nối đúng thiết bị và đúng mạch, ống không xuyên
// thiết bị/xuyên nhau, rotor – bánh công tác – quạt – hạt nước chuyển động theo trạng thái, liên động lưu lượng,
// mặt cắt, ẩn vỏ, tháo nắp, chọn thiết bị bằng chuột, bố cục điện thoại không tràn ngang.
import fs from 'node:fs';
import path from 'node:path';
import { moMayChu, GOC } from './may-chu.mjs';

async function layPlaywright() {
  try { return await import('playwright'); } catch {
    const { createRequire } = await import('node:module');
    return createRequire('/opt/node-tools/node_modules/')('playwright');
  }
}

const { chromium } = await layPlaywright();
const may = await moMayChu(0);
const URL_APP = `http://127.0.0.1:${may.address().port}/`;
const THU_ANH = path.join(GOC, 'anh');
fs.mkdirSync(THU_ANH, { recursive: true });

const ketQua = [];
const ghi = (ten, dat, chiTiet = '') => { ketQua.push({ ten, dat, chiTiet }); console.log(`${dat ? 'ĐẠT ' : 'LỖI '} ${ten}${chiTiet ? ` — ${chiTiet}` : ''}`); };

const trinhDuyet = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const loiJS = [];
async function moTrang(w, h) {
  const pg = await trinhDuyet.newPage({ viewport: { width: w, height: h } });
  pg.setDefaultTimeout(180000);
  pg.on('pageerror', (e) => loiJS.push(`pageerror: ${e.message}`));
  pg.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_NAME|fonts\.g/.test(m.text() + (m.location()?.url || ''))) loiJS.push(m.text()); });
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // môi trường kiểm thử không có mạng ngoài
  await pg.goto(URL_APP, { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('body[data-san-sang="1"]', { timeout: 120000 });
  return pg;
}
const cho = (pg, ms) => pg.waitForTimeout(ms);
const chup = async (pg, ten) => { await pg.screenshot({ path: path.join(THU_ANH, ten), type: 'jpeg', quality: 84, timeout: 240000 }); console.log(`     ảnh ${ten}`); };
const tuaNhanh = (pg, giay) => pg.evaluate((g) => { for (let i = 0; i < g; i++) window.__moPhong.vh.capNhat(1); }, giay);
const goc = (pg) => pg.evaluate(() => {
  const M = window.__moPhong;
  return {
    duc: M.tb.chiller.hoatAnh.rotorDuc.rotation.x, cai: M.tb.chiller.hoatAnh.rotorCai.rotation.x,
    bomNL: M.tb.bomNL.quay.rotation.x, bomGN: M.tb.bomGN.quay.rotation.x, quat: M.tb.thap.hoatAnh.quat.rotation.y,
    ahu: M.tb.ahu.hoatAnh.banhQuat.rotation.z,
    phaNL: M.ong.dsTuyen.find((t) => t.ma === 'nl-cap').pha, phaGN: M.ong.dsTuyen.find((t) => t.ma === 'gn-ve').pha,
  };
});
const bam = async (pg, tab, id) => { await pg.click(`#nut-${tab}`); await pg.click(`#${id}`, { force: true }); };

try {
  const pg = await moTrang(1360, 820);

  // 1. Mô hình thực sự hiển thị
  const soMau = await pg.evaluate(() => {
    const M = window.__moPhong, r = M.canh.renderer;
    r.render(M.canh.scene, M.canh.camera);
    const gl = r.getContext(), w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(4), mau = new Set();
    for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) { gl.readPixels(Math.floor((w * (i + 0.5)) / 24), Math.floor((h * (j + 0.5)) / 24), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); mau.add(`${px[0] >> 3},${px[1] >> 3},${px[2] >> 3}`); }
    return mau.size;
  });
  ghi('Mô hình hiển thị trên canvas WebGL', soMau > 25, `${soMau} nhóm màu khác nhau trên lưới 24×24 điểm`);
  const tk = await pg.evaluate(() => ({ ...window.__moPhong.thongKe(), phienBan: window.__moPhong.phienBan, rev: window.__moPhong.THREE.REVISION }));
  ghi('Three.js và addon cùng phiên bản', tk.phienBan === `0.${tk.rev.replace(/\D/g, '')}.1` || tk.phienBan.includes(tk.rev), `REVISION ${tk.rev}, khai báo ${tk.phienBan}`);
  console.log(`     số lần vẽ ${tk.calls}, tam giác ${tk.triangles}`);

  // 2. Đầu ống, mạch, va chạm
  const kt = await pg.evaluate(() => window.__moPhong.kiemTra());
  ghi('Đầu ống nối đúng thiết bị, đúng mạch; ống không xuyên thiết bị hay xuyên nhau', kt.loi.length === 0, kt.loi.length ? kt.loi.join(' | ') : `${kt.ok.length} mối nối đúng, ${kt.soTuyen} tuyến`);

  // 3. Đứng yên khi dừng
  let a = await goc(pg); await cho(pg, 1500); let b = await goc(pg);
  ghi('Khi dừng: rotor, bơm, quạt tháp đứng yên', a.duc === b.duc && a.bomNL === b.bomNL && a.bomGN === b.bomGN && a.quat === b.quat);
  await chup(pg, '01-tong-the-luc-dung.jpg');

  // 4. Liên động: bật máy nén khi chưa có bơm
  await bam(pg, 'van-hanh', 'bat-may-nen');
  await tuaNhanh(pg, 10); await cho(pg, 800);
  let tt = await pg.evaluate(() => ({ s: window.__moPhong.vh.so.ttMN, tb: document.querySelector('.thong-bao').textContent }));
  ghi('Máy nén không chạy khi chưa có lưu lượng, giao diện giải thích', tt.s === 'cho-luu-luong' && /chờ lưu lượng/i.test(tt.tb), tt.tb.slice(0, 140));

  // 5. Chạy toàn hệ thống
  await pg.click('#nut-chay-het');
  await tuaNhanh(pg, 240); await cho(pg, 800);
  a = await goc(pg); await cho(pg, 2500); b = await goc(pg);
  const tiSo = (b.cai - a.cai) / (b.duc - a.duc);
  ghi('Khi chạy: rotor đực và cái quay ăn khớp (tỉ số −4:6)', b.duc !== a.duc && Math.abs(tiSo + 4 / 6) < 0.01, `tỉ số ${tiSo.toFixed(3)}`);
  ghi('Khi chạy: bánh công tác hai bơm, quạt tháp, quạt AHU quay', b.bomNL !== a.bomNL && b.bomGN !== a.bomGN && b.quat !== a.quat && b.ahu !== a.ahu);
  const so = await pg.evaluate(() => window.__moPhong.vh.so);
  ghi('Thông số giả lập hợp lý khi chạy ổn định', so.tCapNL > 6 && so.tCapNL < 8.5 && so.tHoiNL > so.tCapNL && so.tRaNg > so.tVaoNg && so.pNgung > so.pBayHoi,
    `nước lạnh ${so.tCapNL.toFixed(1)}/${so.tHoiNL.toFixed(1)} °C, giải nhiệt ${so.tVaoNg.toFixed(1)}/${so.tRaNg.toFixed(1)} °C, COP ${so.cop.toFixed(2)}`);
  await chup(pg, '02-tong-the-dang-chay.jpg');

  // 6. Dòng chảy: hạt đi theo tuyến khi bơm chạy
  await bam(pg, 'hien-thi', 'xem-dong');
  await cho(pg, 1500);
  a = await goc(pg); await cho(pg, 2000); b = await goc(pg);
  ghi('Chế độ dòng chảy: hạt nước lạnh và nước giải nhiệt chuyển động', b.phaNL !== a.phaNL && b.phaGN !== a.phaGN);
  const hatTrenTuyen = await pg.evaluate(() => {
    const M = window.__moPhong, T = M.THREE, m = new T.Matrix4(), p = new T.Vector3();
    let xa = 0;
    for (const t of M.ong.dsTuyen) {
      if (t.soHat === undefined || !t.hienHat) continue;
      for (let k = 0; k < t.soHat; k++) {
        M.ong.hat.getMatrixAt(t.hat0 + k, m); p.setFromMatrixPosition(m);
        if (m.elements[0] === 0) continue;
        let gan = Infinity; for (let s = 0; s <= t.tuyen.dai; s += 0.02) gan = Math.min(gan, t.tuyen.diemTai(s).p.distanceTo(p));
        if (gan > 0.03) xa++;
      }
    }
    return xa;
  });
  ghi('Hạt dòng chảy nằm đúng trên đường tâm tuyến ống', hatTrenTuyen === 0, `${hatTrenTuyen} hạt lệch tuyến`);
  await chup(pg, '03-xem-dong-chay.jpg');

  // 7. Dừng bơm nước lạnh: máy nén ngừng, chờ lưu lượng, hạt nước lạnh dừng
  await bam(pg, 'van-hanh', 'bat-bom-nl');
  await tuaNhanh(pg, 12); await cho(pg, 1200);
  a = await goc(pg); await cho(pg, 1800); b = await goc(pg);
  tt = await pg.evaluate(() => ({ s: window.__moPhong.vh.so.ttMN, n: window.__moPhong.vh.so.nMayNen, tb: document.querySelector('.thong-bao').textContent }));
  ghi('Bơm nước lạnh dừng: máy nén ngừng và chờ lưu lượng', tt.s === 'cho-luu-luong' && tt.n < 0.01 && /chờ lưu lượng/i.test(tt.tb), tt.tb.slice(0, 120));
  ghi('Bơm nước lạnh dừng: hạt mạch nước lạnh và rotor đứng yên, mạch giải nhiệt vẫn chảy', a.phaNL === b.phaNL && a.duc === b.duc && a.phaGN !== b.phaGN);
  await bam(pg, 'van-hanh', 'bat-bom-nl');
  await tuaNhanh(pg, 20); await cho(pg, 600);
  tt = await pg.evaluate(() => window.__moPhong.vh.so.ttMN);
  ghi('Có lại lưu lượng: máy nén tự khởi động lại', tt === 'chay', tt);
  await bam(pg, 'hien-thi', 'xem-dong');

  // 8. Mặt cắt, ẩn vỏ, tháo nắp
  for (const id of ['cat-bbh', 'cat-bn', 'cat-mn', 'cat-bom']) await bam(pg, 'hien-thi', id);
  await cho(pg, 1500);
  const cat = await pg.evaluate(() => {
    const M = window.__moPhong, coCat = (o) => { let c = false; o.traverse((x) => { if (x.material?.clippingPlanes?.length) c = true; }); return c; };
    return { bbh: coCat(M.tb.chiller.voChiller[0]), mn: M.tb.chiller.voChiller.some((o) => o.name === 'Vỏ máy nén' && coCat(o)), bom: coCat(M.tb.bomNL.vo[0]) && coCat(M.tb.bomGN.vo[0]), long: M.tb.chiller.noiThat[0].obj.visible };
  });
  ghi('Mặt cắt bình bay hơi, bình ngưng, máy nén, bơm hoạt động', cat.bbh && cat.mn && cat.bom && cat.long, JSON.stringify(cat));
  await pg.evaluate(() => window.__moPhong.ui.phongTo('ch-bbh', true)); await cho(pg, 1500);
  await chup(pg, '04-mat-cat-binh-bay-hoi-may-nen.jpg');
  await pg.evaluate(() => window.__moPhong.ui.phongTo('ch-mn', true)); await cho(pg, 1500);
  await chup(pg, '05-may-nen-cap-rotor.jpg');
  await pg.evaluate(() => window.__moPhong.ui.phongTo('ch-bn', true)); await cho(pg, 1500);
  await chup(pg, '06-mat-cat-binh-ngung.jpg');
  await pg.evaluate(() => window.__moPhong.ui.phongTo('bom-gn', true)); await cho(pg, 1500);
  await chup(pg, '07-bom-banh-cong-tac.jpg');
  for (const id of ['cat-bbh', 'cat-bn', 'cat-mn', 'cat-bom']) await bam(pg, 'hien-thi', id);

  await bam(pg, 'hien-thi', 'thao-nap');
  await pg.waitForFunction(() => window.__moPhong.tb.chiller.nap.binhBayHoi.position.x < -0.55, null, { timeout: 120000 });
  ghi('Tháo nắp hộp nước: nắp trượt ra, thấy mặt sàng và miệng ống', true);
  await pg.evaluate(() => window.__moPhong.ui.phongTo('ch-bbh-hop', true)); await cho(pg, 1500);
  await chup(pg, '08-thao-nap-hop-nuoc.jpg');
  await bam(pg, 'hien-thi', 'thao-nap');

  for (const id of ['an-vo-thap', 'an-vo-ahu', 'an-vo-chiller']) await bam(pg, 'hien-thi', id);
  await cho(pg, 800);
  const vo = await pg.evaluate(() => {
    const M = window.__moPhong;
    return { thap: M.tb.thap.voThap.every((o) => !o.visible), ahu: M.tb.ahu.voAHU.every((o) => !o.visible), chiller: M.tb.chiller.voChiller.every((o) => !o.visible) };
  });
  ghi('Ẩn/hiện vỏ chiller, vỏ tháp, vỏ AHU', vo.thap && vo.ahu && vo.chiller, JSON.stringify(vo));
  await pg.evaluate(() => window.__moPhong.ui.phongTo('thap', true)); await cho(pg, 2000);
  await chup(pg, '09-thap-giai-nhiet-ben-trong.jpg');
  await pg.evaluate(() => window.__moPhong.ui.phongTo('ahu', true)); await cho(pg, 2000);
  await chup(pg, '10-ahu-duong-di-khong-khi.jpg');
  await pg.evaluate(() => window.__moPhong.ui.phongTo('chiller', true)); await cho(pg, 2000);
  await chup(pg, '11-chiller-an-vo.jpg');
  for (const id of ['an-vo-thap', 'an-vo-ahu', 'an-vo-chiller']) await bam(pg, 'hien-thi', id);

  // 9. Chọn thiết bị bằng chuột: bấm vào giữa tháp giải nhiệt và vào thân máy nén
  await pg.evaluate(() => window.__moPhong.ui.datGoc('tongThe', true)); await cho(pg, 1200);
  for (const [ten, x, y, z, mong] of [['tháp', -4.4, 2.6, -5.6, /tháp|Vỏ|Khung|Cửa|đệm|quạt/i], ['máy nén', 0.2, 1.88, 0.0, /máy nén|Vỏ|chiller|động cơ|rotor|Hộp/i]]) {
    const xy = await pg.evaluate(([x, y, z]) => {
      const M = window.__moPhong, v = new M.THREE.Vector3(x, y, z).project(M.canh.camera), r = M.canh.renderer.domElement.getBoundingClientRect();
      return { x: r.left + ((v.x + 1) / 2) * r.width, y: r.top + ((1 - v.y) / 2) * r.height };
    }, [x, y, z]);
    await pg.mouse.click(xy.x, xy.y);
    await cho(pg, 800);
    const the = await pg.evaluate(() => ({ an: document.getElementById('the-chon').hidden, ten: document.querySelector('#the-chon h3')?.textContent || '', sang: (() => { let n = 0; window.__moPhong.canh.scene.traverse((o) => { if (o.userData.vlGoc) n++; }); return n; })() }));
    ghi(`Chọn ${ten} bằng chuột: làm nổi bật và hiện tên, chức năng`, !the.an && mong.test(the.ten) && the.sang > 0, `${the.ten} (${the.sang} mesh nổi bật)`);
  }
  await chup(pg, '12-chon-thiet-bi.jpg');
  await pg.close();

  // 10. Bố cục điện thoại
  const dt = await moTrang(400, 860);
  await cho(dt, 1500);
  const tran = await dt.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ghi('Bố cục điện thoại 400 px không tràn ngang', tran <= 1, `chênh ${tran}px`);
  await chup(dt, '13-dien-thoai.jpg');
  await dt.close();

  ghi('Không có lỗi JavaScript trong suốt quá trình kiểm tra', loiJS.length === 0, loiJS.slice(0, 5).join(' | '));
} catch (e) {
  ghi('Kiểm tra chạy hết', false, e.stack || e.message);
} finally {
  await trinhDuyet.close();
  may.close();
}
const loi = ketQua.filter((k) => !k.dat);
console.log(`\n${ketQua.length - loi.length}/${ketQua.length} mục đạt.`);
fs.writeFileSync(path.join(GOC, 'kiem-thu', 'ket-qua-trinh-duyet.json'), JSON.stringify({ ngay: new Date().toISOString(), ketQua }, null, 2));
process.exit(loi.length ? 1 : 0);
